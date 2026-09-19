// ============================================================
// 卡尺时间轴模块（js/timeline.js）
// 职责：底部卡尺——年/月刻度绘制、阶段分界线、滑块拖拽与点击跳转、阶段检测
// 依赖：RESUME（YEAR_START/END、STAGES）、Utils
// 接口：init() / destroy() / drawTicks() / updateBoundaries() / moveToYear(year)
// 通信：onYearChange(year)（游标移动）、onStageCross(stageId)（跨越阶段边界）；不反向操作主题/面板
// ============================================================
(function(global){
'use strict';

const { YEAR_START, YEAR_END, STAGE_ORDER, STAGES } = global.RESUME;
const { cssVar, fmtYear } = global.Utils;

// 刻度绘制参数（原散落魔数集中于此）
const TICK_CONST = {
  FONT: '9px sans-serif',  // 年份标签字体
  MINOR_H: 0.67,           // 月小刻度起点（下 1/3 高度）
  LABEL_Y: -2,             // 年份文字距底边
  FUTURE_TINT: 'rgba(255,255,255,0.03)', // future 区域淡色
  BOUNDARY_W: 2            // 阶段分界线宽
};

class CaliperTimeline{
  constructor({ onYearChange, onStageCross, getStage }){
    this._onYearChange = onYearChange || (()=>{});
    this._onStageCross = onStageCross || (()=>{});
    this._getStage = getStage || (()=>'garden');
    this.ticksCanvas = document.getElementById('ticks-canvas');
    this.ticksCtx = this.ticksCanvas.getContext('2d');
    this.slider = document.getElementById('caliper-slider');
    this.trackWrap = document.getElementById('caliper-track-wrap');
    this.scrollBox = document.getElementById('caliper-scroll');
    this.yearDisplay = document.getElementById('year-display');
    this._year = YEAR_START;
    this._isDragging = false;

    // 纵向滚轮 → 横向滚动（时间线在低分辨率下可横向滚动，且无滚动条）
    this._onWheel = e=>{
      if(!this.scrollBox || this.scrollBox.scrollWidth <= this.scrollBox.clientWidth) return;
      if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){
        e.preventDefault();
        this.scrollBox.scrollLeft += e.deltaY;
      }
    };

    this._onSliderDown = e=>{ e.preventDefault(); this._isDragging=true; this.slider.classList.add('dragging'); this.slider.setPointerCapture(e.pointerId); };
    this._onSliderMove = e=>{
      if(!this._isDragging)return;
      const year=this._moveSlider(e.clientX);
      const st=this._detectStage(year);
      if(st!==this._getStage())this._onStageCross(st);
      else this._onYearChange(year);
    };
    this._onSliderUp = ()=>{ this._isDragging=false; this.slider.classList.remove('dragging'); };
    this._onTrackDown = e=>{
      if(e.target===this.slider||this.slider.contains(e.target))return;
      const year=this._moveSlider(e.clientX);
      const st=this._detectStage(year);
      if(st!==this._getStage())this._onStageCross(st);
      else this._onYearChange(year);
    };
  }

  init(){
    this.slider.addEventListener('pointerdown',this._onSliderDown);
    this.slider.addEventListener('pointermove',this._onSliderMove);
    this.slider.addEventListener('pointerup',this._onSliderUp);
    this.slider.addEventListener('pointerleave',this._onSliderUp);
    this.trackWrap.addEventListener('pointerdown',this._onTrackDown);
    if(this.scrollBox)this.scrollBox.addEventListener('wheel',this._onWheel,{passive:false});
    this.drawTicks();
    this.updateBoundaries();
    this.moveToYear(YEAR_START);
  }

  destroy(){
    this.slider.removeEventListener('pointerdown',this._onSliderDown);
    this.slider.removeEventListener('pointermove',this._onSliderMove);
    this.slider.removeEventListener('pointerup',this._onSliderUp);
    this.slider.removeEventListener('pointerleave',this._onSliderUp);
    this.trackWrap.removeEventListener('pointerdown',this._onTrackDown);
    if(this.scrollBox)this.scrollBox.removeEventListener('wheel',this._onWheel);
  }

  _yearFromRatio(r){ return YEAR_START+r*(YEAR_END-YEAR_START); }
  _ratioFromYear(y){ return (y-YEAR_START)/(YEAR_END-YEAR_START); }

  // 阶段检测：遍历阶段序列表，落在哪个区间返回哪个阶段（新增阶段零改动）
  _detectStage(year){
    for(let i=1;i<STAGE_ORDER.length;i++){
      if(year < STAGES[STAGE_ORDER[i]].yearStart) return STAGE_ORDER[i-1];
    }
    return STAGE_ORDER[STAGE_ORDER.length-1];
  }

  // 游标移动到指定年月（更新视觉与内部状态，不触发回调）
  moveToYear(year){
    this._year=year;
    this.slider.style.left=(this._ratioFromYear(year)*100)+'%';
    this.yearDisplay.textContent=fmtYear(year);
  }

  getCurrentYear(){ return this._year; }

  _moveSlider(clientX){
    const rect=this.trackWrap.getBoundingClientRect();
    let r=(clientX-rect.left)/rect.width;r=Math.max(0,Math.min(1,r));
    this.slider.style.left=(r*100)+'%';
    const year=this._yearFromRatio(r);this.yearDisplay.textContent=fmtYear(year);
    this._year=year;
    return year;
  }

  drawTicks(){
    const wrap=document.getElementById('caliper-ticks');
    const w=wrap.clientWidth, h=wrap.clientHeight;
    this.ticksCanvas.width=w;this.ticksCanvas.height=h;this.ticksCtx.clearRect(0,0,w,h);

    const totalYears=YEAR_END-YEAR_START;
    const tickCol=cssVar('--caliper-tick');
    const labelCol=cssVar('--caliper-label');
    const boundaryCol=cssVar('--stage-boundary');

    // Year major ticks (full height) —— 年份范围派生自数据（原硬编码 2017..2026）
    for(let y=Math.ceil(YEAR_START); y<=Math.floor(YEAR_END)-1; y++){
      const ratio=(y-YEAR_START)/totalYears, x=ratio*w;
      this.ticksCtx.strokeStyle=tickCol;this.ticksCtx.lineWidth=1;
      this.ticksCtx.beginPath();this.ticksCtx.moveTo(x,0);this.ticksCtx.lineTo(x,h);this.ticksCtx.stroke();
      this.ticksCtx.fillStyle=labelCol;this.ticksCtx.font=TICK_CONST.FONT;this.ticksCtx.textAlign='center';
      this.ticksCtx.fillText(y,x,h+TICK_CONST.LABEL_Y);this.ticksCtx.textAlign='start';
      // Month minor ticks (lower 1/3 only)
      for(let m=1;m<=11;m++){
        const my=y+m/12;if(my>YEAR_END)break;
        this.ticksCtx.beginPath();this.ticksCtx.moveTo((my-YEAR_START)/totalYears*w, h*TICK_CONST.MINOR_H);this.ticksCtx.lineTo((my-YEAR_START)/totalYears*w, h);this.ticksCtx.stroke();
      }
    }

    // 结束年份标签（原硬编码 "2026.12" → 派生自 YEAR_END 前一月）
    this.ticksCtx.fillStyle=labelCol;this.ticksCtx.font=TICK_CONST.FONT;this.ticksCtx.textAlign='center';
    this.ticksCtx.fillText(fmtYear(YEAR_END-1/12),(YEAR_END-YEAR_START)/totalYears*w,h+TICK_CONST.LABEL_Y);this.ticksCtx.textAlign='start';

    // Future zone tint (subtle)
    const futureRatio=(STAGES.future.yearStart-YEAR_START)/totalYears;
    this.ticksCtx.fillStyle=TICK_CONST.FUTURE_TINT;
    this.ticksCtx.fillRect(futureRatio*w,0,w-futureRatio*w,h);

    // Stage boundaries on ticks（边界列表派生自阶段序列表）
    STAGE_ORDER.slice(1).forEach(sid=>{
      const bx=(STAGES[sid].yearStart-YEAR_START)/totalYears*w;
      this.ticksCtx.strokeStyle=boundaryCol;this.ticksCtx.lineWidth=TICK_CONST.BOUNDARY_W;
      this.ticksCtx.beginPath();this.ticksCtx.moveTo(bx,0);this.ticksCtx.lineTo(bx,h);this.ticksCtx.stroke();
    });
  }

  // 边界标记与标签 DOM 动态生成（由阶段序列表驱动；新增阶段零改动 HTML）
  _ensureBoundaryDom(){
    const wrap=this.trackWrap;
    wrap.querySelectorAll('.stage-boundary-marker,.stage-boundary-label').forEach(el=>el.remove());
    STAGE_ORDER.slice(1).forEach(sid=>{
      const s=STAGES[sid];
      const m=document.createElement('div');m.className='stage-boundary-marker';m.dataset.stage=sid;
      const l=document.createElement('div');l.className='stage-boundary-label';l.dataset.stage=sid;l.textContent=s.shortLabel||'';
      wrap.appendChild(m);wrap.appendChild(l);
    });
  }

  updateBoundaries(){
    this._ensureBoundaryDom();
    const totalYears=YEAR_END-YEAR_START;
    STAGE_ORDER.slice(1).forEach(sid=>{
      const pct=(STAGES[sid].yearStart-YEAR_START)/totalYears*100;
      const el=this.trackWrap.querySelector(`.stage-boundary-marker[data-stage="${sid}"]`);if(el)el.style.left=pct+'%';
      const lbl=this.trackWrap.querySelector(`.stage-boundary-label[data-stage="${sid}"]`);if(lbl)lbl.style.left=pct+'%';
    });
  }
}

global.CaliperTimeline = CaliperTimeline;

})(window);
