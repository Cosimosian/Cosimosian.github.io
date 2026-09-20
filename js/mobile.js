// ============================================================
// 移动端应用（js/mobile.js，202609 启用）
// 职责：≤640px 下的移动端 UI——阶段切换、项目信息流、经历时间线抽屉、弹窗接入
// 依赖：RESUME（STAGE_ORDER/STAGES/PROJECTS）、Utils（fmtYear/tagsHtml）、Modal（弹窗共享）
// 隔离：只操作 #mobile-ui / #m-drawer-overlay DOM，不触碰桌面端任何元素与逻辑
// ============================================================
(function(global){
'use strict';

const { STAGE_ORDER, STAGES, PROJECTS } = global.RESUME;
const { fmtYear, tagsHtml } = global.Utils;

let currentStage = STAGE_ORDER[0];

const el = id => document.getElementById(id);

// ---- 阶段切换 ----
function switchStage(stageId){
  currentStage = stageId;
  const s = STAGES[stageId];
  document.documentElement.setAttribute('data-theme', s.theme);
  el('m-badge').textContent = s.badge || ('阶段 ' + String(STAGE_ORDER.indexOf(stageId)+1).padStart(2,'0'));
  el('m-desc').textContent = s.description;
  renderDots();
  renderFlow(stageId);
}

// ---- 底部阶段圆点（数量 = 阶段数，居中无文字） ----
function renderDots(){
  const dots = el('m-dots');
  dots.innerHTML = '';
  STAGE_ORDER.forEach(stageId=>{
    const d = document.createElement('button');
    d.className = 'm-dot' + (stageId===currentStage ? ' active' : '');
    d.dataset.stage = stageId;
    d.setAttribute('aria-label', STAGES[stageId].title);
    d.addEventListener('click', ()=>switchStage(stageId));
    dots.appendChild(d);
  });
}

// ---- 项目信息流（无图卡片，按开始时间排序，整卡可点） ----
function renderFlow(stageId){
  const projects = PROJECTS.filter(p=>p.stage===stageId).sort((a,b)=>a.year-b.year);
  const flow = el('m-flow');
  if(!projects.length){
    flow.innerHTML = '<div class="m-empty">—— 内容预留，等待书写 ——</div>';
    return;
  }
  flow.classList.remove('fade');
  void flow.offsetWidth; // 重启动画
  flow.innerHTML = projects.map(p=>`
    <article class="m-card" data-id="${p.id}">
      <h2 class="m-card-title">${p.title}</h2>
      <div class="m-card-tags">${tagsHtml(p.tags)}</div>
      ${p.outcome?`<div class="m-card-outcome">🏆 ${p.outcome}</div>`:''}
    </article>
  `).join('');
  flow.classList.add('fade');
  flow.querySelectorAll('.m-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const p = PROJECTS.find(x=>x.id===card.dataset.id);
      if(p) global.Modal.open(p);
    });
  });
}

// ---- 经历时间线抽屉（只列经历文本） ----
function renderDrawer(){
  const list = el('m-drawer-list');
  let html = '';
  for(const stageId of STAGE_ORDER){
    (STAGES[stageId].experiences||[]).forEach(e=>{
      html += `<div class="m-exp${stageId===currentStage?' current':''}">
        <div class="m-exp-year">${fmtYear(e.year)} — ${e.yearEnd?fmtYear(e.yearEnd):'至今'}</div>
        <div class="m-exp-text">${e.text}</div>
      </div>`;
    });
  }
  list.innerHTML = html;
}

const openDrawer = () => { renderDrawer(); el('m-drawer-overlay').classList.add('open'); };
const closeDrawer = () => { el('m-drawer-overlay').classList.remove('open'); };

// ---- 初始化 ----
function init(){
  renderDots();
  switchStage(STAGE_ORDER[0]);
  el('m-more').addEventListener('click', openDrawer);
  el('m-drawer-close').addEventListener('click', closeDrawer);
  el('m-drawer-overlay').addEventListener('click', e=>{ if(e.target===e.currentTarget) closeDrawer(); });
}

// 始终初始化（桌面宽度下 #mobile-ui 隐藏，事件无副作用；支持旋转/缩放窗口切换）
init();

global.MobileApp = { init, switchStage, openDrawer, closeDrawer };

})(window);
