// ============================================================
// 项目详情文档加载器（js/projectDoc.js）
// 职责：加载 data/projects/<id>.md，解析 front matter，渲染 markdown 子集为 HTML
// 依赖：无（纯加载 + 渲染；由 index.html 的 modal 逻辑消费）
// 加载：普通 <script>（file:// 兼容），挂载 window.ProjectDoc
// 扩展接口：front matter 任意键可加，渲染器按需消费；正文语法在 renderMarkdown 扩展
// ============================================================
(function(global){
'use strict';

const cache = new Map();

// 解析 front matter（"---\nkey: value\n---"），返回 {meta, body}
function parseFrontMatter(text){
  const m = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/.exec(text);
  if(!m) return { meta: {}, body: text };
  const meta = {};
  m[1].split(/\r?\n/).forEach(line => {
    const i = line.indexOf(':');
    if(i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return { meta, body: text.slice(m[0].length) };
}

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// 行内语法：**bold**、[text](url)
function inline(s){
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
}

// markdown 子集 → HTML（块级：段落/标题/图片·视频/无序列表）
function renderMarkdown(md){
  const lines = md.split(/\r?\n/);
  let html = '';
  let para = [];
  let list = null;

  const flushPara = () => { if(para.length){ html += '<p>'+para.join('<br>')+'</p>'; para = []; } };
  const flushList = () => { if(list){ html += '<ul>'+list+'</ul>'; list = null; } };
  const flush = () => { flushPara(); flushList(); };

  // 媒体 URL 按扩展名区分：视频（mp4/webm/mov）渲染 <video>，其余渲染图片
  const mediaHtml = (alt, src) => {
    if(/\.(mp4|webm|mov)(\?.*)?$/i.test(src)){
      return `<video class="modal-article-video" src="${esc(src)}" controls preload="metadata" alt="${esc(alt)}"></video>`;
    }
    return `<img class="modal-article-img" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="window.ProjectDoc.imgFallback(this)">`;
  };

  for(const raw of lines){
    const line = raw.trimEnd();
    const t = line.trim();
    if(!t){ flush(); continue; }

    const img = /^!\[([^\]]*)\]\(([^)\s]+)\)/.exec(t);
    if(img){ flush(); html += mediaHtml(img[1], img[2]); continue; }

    const h = /^(#{1,3})\s+(.*)$/.exec(t);
    if(h){ flush(); html += `<h${h[1].length+2} class="modal-article-h">${inline(h[2])}</h${h[1].length+2}>`; continue; }

    const li = /^[-*]\s+(.*)$/.exec(t);
    if(li){ flushPara(); if(!list) list = ''; list += `<li>${inline(li[1])}</li>`; continue; }

    flushList();
    para.push(inline(t));
  }
  flush();
  return html;
}

function parseProjectDoc(text){
  const { meta, body } = parseFrontMatter(text);
  return { meta, bodyHtml: renderMarkdown(body) };
}

async function loadProjectDoc(id){
  if(cache.has(id)) return cache.get(id);
  const res = await fetch(`data/projects/${id}.md`);
  if(!res.ok) throw new Error(`project doc ${id} not found (${res.status})`);
  const doc = parseProjectDoc(await res.text());
  cache.set(id, doc);
  return doc;
}

global.ProjectDoc = { parseProjectDoc, loadProjectDoc };

// 图片加载失败兜底：替换为带 alt 文案的占位块（外网图片不可达时布局不塌）
global.ProjectDoc.imgFallback = function(el){
  const d = document.createElement('div');
  d.className = 'modal-article-img-fallback';
  d.textContent = el.alt || '图片加载失败';
  el.replaceWith(d);
};

})(window);
