// ============================================================
// 项目面板模块（js/panels.js）
// 职责：右侧项目导航列表 + 左侧详情展示面板；选中状态由装配层注入
// 依赖：RESUME（PROJECTS）、Utils
// 接口：renderConsolePanel(stage) / selectProject(id) / showEmptyDisplay()
// 通信：getSelectedId / setSelectedId 回调读写选中状态；不直接操作地图
// ============================================================
(function(global){
'use strict';

const { PROJECTS } = global.RESUME;
const { fmtYear, tagsHtml } = global.Utils;

class Panels{
  constructor({ getSelectedId, setSelectedId, getStage }){
    this._getSelectedId = getSelectedId || (()=>null);
    this._setSelectedId = setSelectedId || (()=>{});
    this._getStage = getStage || (()=>'garden');
  }

  renderConsolePanel(stage){
    const projects = PROJECTS.filter(p=>p.stage===stage);
    const list = document.getElementById('console-list');
    const selectedId = this._getSelectedId();
    if(!projects.length){
      list.innerHTML='<div style="text-align:center;opacity:0.4;padding:20px;font-size:13px">—— 内容预留 ——<br><span style="font-size:11px">等待未来书写</span></div>';
      this.showEmptyDisplay();
      return;
    }
    list.innerHTML = projects.map(p=>`
      <div class="console-item${selectedId===p.id?' active':''}" data-id="${p.id}">
        <div class="ci-title">${p.title}</div>
        <div class="ci-meta">📍 ${p.location} · ${fmtYear(p.year)}</div>
      </div>
    `).join('');
    list.querySelectorAll('.console-item').forEach(el=>el.addEventListener('click',()=>this.selectProject(el.dataset.id)));
    if(!selectedId||!projects.find(p=>p.id===selectedId)){
      this.selectProject(projects[0].id);
    }
  }

  selectProject(id){
    this._setSelectedId(id);
    const p = PROJECTS.find(x=>x.id===id);
    if(!p) return this.showEmptyDisplay();
    const dc = document.getElementById('display-content');
    dc.innerHTML = `
      <img class="display-image" src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.style.background='var(--color-tag-bg)';this.style.minHeight='200px'">
      <div class="display-body">
        <div class="display-category">${p.category||''}</div>
        <div class="display-title">${p.title}</div>
        <div class="display-divider"></div>
        <div class="display-desc">${p.desc}</div>
        <div class="display-divider"></div>
        <div class="display-section-label">🏷 项目标签</div>
        <div class="display-tags">${tagsHtml(p.tags)}</div>
        <div class="display-divider"></div>
        <div class="display-section-label">📄 详细介绍</div>
        <div class="display-detail-placeholder">—— 待补充 ——</div>
        ${p.link?`<a class="display-link" href="${p.link}" target="_blank">→ 查看项目链接</a>`:''}
        ${p.outcome?`<div class="display-divider"></div><div class="display-section-label">📊 成 果</div><div class="display-outcome">${p.outcome}</div>`:''}
      </div>
    `;
    document.querySelectorAll('.console-item').forEach(el=>el.classList.toggle('active',el.dataset.id===id));
  }

  showEmptyDisplay(){
    this._setSelectedId(null);
    document.getElementById('display-content').innerHTML =
      this._getStage()==='future'
        ?'<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-muted);font-size:13px;opacity:0.35">—— 未来尚未书写 ——</div>'
        :'<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--color-muted);font-size:13px;opacity:0.35">选择右侧项目查看详情</div>';
  }
}

global.Panels = Panels;

})(window);
