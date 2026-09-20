// ============================================================
// 项目弹窗模块（js/modal.js，桌面/移动共享）
// 职责：打开/关闭项目详情弹窗（标题/标签/成果 + md 图文正文）
// 依赖：ProjectDoc（md 加载）、Utils（tagsHtml）、全局 RESUME（无——数据由调用方传入）
// 加载：普通 <script>（file:// 兼容），挂载 window.Modal
// ============================================================
(function(global){
'use strict';

const { loadProjectDoc } = global.ProjectDoc;
const { tagsHtml } = global.Utils;

// 打开项目详情弹窗：基础信息来自 PROJECTS 条目，图文详情来自 data/projects/<id>.md
async function open(project){
  document.getElementById('modal-title').textContent = project.title;
  document.getElementById('modal-tags').innerHTML = tagsHtml(project.tags);
  document.getElementById('modal-outcome').textContent = project.outcome ? '🏆 ' + project.outcome : '';
  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';

  const article = document.getElementById('modal-article');
  article.className = 'modal-article';
  article.innerHTML = '<p style="opacity:0.5">详情加载中…</p>';
  try{
    const doc = await loadProjectDoc(project.id);
    article.innerHTML = doc.bodyHtml;
    if(doc.meta.gallery) article.classList.add('gallery');
    const oc = doc.meta.outcome || project.outcome;
    document.getElementById('modal-outcome').textContent = oc ? '🏆 ' + oc : '';
  }catch(err){
    article.innerHTML = '';
  }
}

function close(){
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

global.Modal = { open, close };

})(window);
