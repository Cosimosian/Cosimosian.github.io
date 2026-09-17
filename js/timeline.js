// ============================================================
// 卡尺时间轴模块（js/timeline.js）
// 职责：底部卡尺——年/月刻度绘制、阶段分界线、滑块拖拽与点击跳转、阶段检测
// 依赖：RESUME（YEAR_START/END、STAGES）、Utils
// 接口：init() / destroy() / drawTicks() / updateBoundaries() / moveToYear(year)
// 通信：onYearChange(year)（游标移动）、onStageCross(stageId)（跨越阶段边界）；不反向操作主题/面板
// ============================================================
(function(global){
'use strict';

const { YEAR_START, YEAR_END, STAGES } = global.RESUME;
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
    this.yearDisplay = document.getElementById('year-display');
    this._year = YEAR_START;
    this._isDragging = false;

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
  }

  _yearFromRatio(r){ return YEAR_START+r*(YEAR_END-YEAR_START); }
  _ratioFromYear(y){ return (y-YEAR_START)/(YEAR_END-YEAR_START); }

  _detectStage(year){
    if(year<STAGES.code.yearStart)return'garden';
    if(year<STAGES.ai.yearStart)return'code';
    if(year<STAGES.future.yearStart)return'ai';
    return'future';
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

    // Stage boundaries on ticks
    [STAGES.code.yearStart,STAGES.ai.yearStart,STAGES.future.yearStart].forEach(by=>{
      const bx=(by-YEAR_START)/totalYears*w;
      this.ticksCtx.strokeStyle=boundaryCol;this.ticksCtx.lineWidth=TICK_CONST.BOUNDARY_W;
      this.ticksCtx.beginPath();this.ticksCtx.moveTo(bx,0);this.ticksCtx.lineTo(bx,h);this.ticksCtx.stroke();
    });
  }

  updateBoundaries(){
    const totalYears=YEAR_END-YEAR_START;
    const place=(id,label,year,labelText)=>{
      const pct=(year-YEAR_START)/totalYears*100;
      const el=document.getElementById(id);if(el)el.style.left=pct+'%';
      const lbl=document.getElementById(label);if(lbl)lbl.style.left=pct+'%',lbl.textContent=labelText;
    };
    place('boundary-code','boundary-code-label',STAGES.code.yearStart,'软件');
    place('boundary-ai','boundary-ai-label',STAGES.ai.yearStart,'显示');
    place('boundary-future','boundary-future-label',STAGES.future.yearStart,'未来');
  }
}

global.CaliperTimeline = CaliperTimeline;

})(window);
