// ============================================================
// 经历时间线模块（js/experiences.js）
// 职责：右下角全阶段经历时间线——渲染、阶段聚焦（淡入淡出）、游标联动高亮、块居中缓动滚动
// 依赖：RESUME（STAGES）、Utils
// 接口：init() / destroy() / applyFocus(stageId, currentYear) / highlightClosestExp(year)
// 说明：当前游标年月由调用方（装配层）传入，不读取全局状态
// ============================================================
(function(global){
'use strict';

const { STAGES } = global.RESUME;
const { fmtYear, expActiveAt } = global.Utils;

class ExperienceTimeline{
  constructor({ container }){
    this.container = container;
    this._allExps = [];
    this._scrollAnim = 0;
    this._onWheel = e => e.preventDefault();
  }

  init(){
    this._build();
    this.container.addEventListener('wheel', this._onWheel, { passive:false }); // 滚动仅由游标跨阶段驱动
  }

  destroy(){
    this.container.removeEventListener('wheel', this._onWheel);
  }

  _build(){
    this._allExps = [];
    for(const sid of ['garden','code','ai']){
      (STAGES[sid].experiences||[]).forEach(e=>this._allExps.push({...e,stage:sid}));
    }
    this._allExps.sort((a,b)=>a.year-b.year);
    this._render();
  }

  _render(){
    const ct = this.container;
    if(!this._allExps.length){ ct.innerHTML=''; return; }
    ct.innerHTML = this._allExps.map((e,i)=>`
      <div class="st-entry out-of-focus" data-exp-idx="${i}" data-stage="${e.stage}">
        <div class="st-dot-wrap">
          <div class="st-dot"></div>
          <div class="st-line"></div>
        </div>
        <div class="st-body">
          <div class="st-year">${fmtYear(e.year)} — ${e.yearEnd?fmtYear(e.yearEnd):'至今'}${e.type?' · '+e.type:''}</div>
          <div class="st-text">${e.text}</div>
        </div>
      </div>
    `).join('');
  }

  // 丝滑缓动滚动（rAF + easeInOutCubic，可被打断，新滚动取代旧动画）
  _smoothScrollTo(targetTop, duration=900){
    const id = ++this._scrollAnim;
    const c = this.container;
    const start = c.scrollTop;
    const end = Math.max(0, targetTop);
    if(Math.abs(end-start)<1){ c.scrollTop = end; return; }
    const t0 = performance.now();
    const ease = t => t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
    const step = now => {
      if(id !== this._scrollAnim) return;
      const p = Math.min(1, (now-t0)/duration);
      c.scrollTop = start + (end-start)*ease(p);
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // 阶段聚焦：同阶段经历视为一个块，整块滚动到面板垂直居中（阶段内不再滚动）
  applyFocus(stageId, currentYear){
    const entries = this.container.querySelectorAll('.st-entry');
    const target = this.container.querySelector(`.st-entry[data-stage="${stageId}"]`);
    entries.forEach(e=>{
      const inStage = e.dataset.stage===stageId;
      e.classList.toggle('in-focus', inStage);
      e.classList.toggle('out-of-focus', !inStage);
    });
    if(target){
      const stageEntries = [...entries].filter(e=>e.dataset.stage===stageId);
      const blockTop = stageEntries[0].offsetTop;
      const lastEl = stageEntries[stageEntries.length-1];
      const blockBottom = lastEl.offsetTop + lastEl.offsetHeight;
      this._smoothScrollTo((blockTop+blockBottom)/2 - this.container.clientHeight/2);
    }
    this.highlightClosestExp(currentYear);
  }

  // 游标联动：区间内经历全部点亮（重叠时段多条目同时亮）；无命中则取最近一条
  highlightClosestExp(year){
    const entries = this.container.querySelectorAll('.st-entry');
    entries.forEach(e=>e.classList.remove('active'));
    if(!isFinite(year)) return;
    let inRange=-1, closest=-1, closestDist=Infinity;
    this._allExps.forEach((e,i)=>{
      const d=expActiveAt(e, year) ? 0 : Math.min(Math.abs(e.year-year), Math.abs((e.yearEnd||e.year)-year));
      if(d===0&&inRange<0) inRange=i;
      if(d<closestDist){ closestDist=d; closest=i; }
    });
    if(closestDist===0){
      this._allExps.forEach((e,i)=>{
        if(expActiveAt(e, year)) entries[i]?.classList.add('active');
      });
    }else if(closest>=0){
      entries[closest]?.classList.add('active');
    }
  }
}

global.ExperienceTimeline = ExperienceTimeline;

})(window);
