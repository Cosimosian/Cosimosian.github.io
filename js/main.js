// ============================================================
// 装配入口（js/main.js）
// 职责：持有单一状态（阶段/游标年月/选中项目），创建各模块并接线回调，绑定页面级事件（模态窗/主题按钮）
// 依赖：全部模块（单向：main → 各模块；模块间互不直接调用）
// 接口：init() / destroy()（页面级单例，销毁接口供未来扩展）
// ============================================================
(function(global){
'use strict';

const { YEAR_START, STAGE_ORDER, STAGES, PROJECTS } = global.RESUME;
const { loadProjectDoc } = global.ProjectDoc;
const { open: openModal, close: closeModal } = global.Modal;

// ---- 单一状态（游标位置由 currentChapter + year 驱动） ----
const state = { stage: STAGE_ORDER[0], year: YEAR_START, selectedProjectId: null };

// ---- 经历时间线 ----
const experiences = new global.ExperienceTimeline({
  container: document.getElementById('stage-timeline')
});

// ---- 主题管理（章节 = 主题阶段） ----
const themeManager = new global.ThemeManager({
  onStageChange: (stage, snapped) => {
    state.stage = stage;
    if(snapped){
      state.year = STAGES[stage].yearStart;
      timeline.moveToYear(state.year);
    }
    map.draw();
    timeline.drawTicks();
    timeline.updateBoundaries();
    panels.renderConsolePanel(stage);
    experiences.applyFocus(stage, state.year);
  }
});

// ---- 卡尺时间轴 ----
const timeline = new global.CaliperTimeline({
  getStage: () => state.stage,
  onYearChange: year => { state.year = year; experiences.highlightClosestExp(year); },
  onStageCross: stageId => themeManager.setTheme(stageId)
});

// ---- 中国地图 ----
const map = new global.ChinaMap(document.getElementById('china-map-bg'), {
  getStage: () => state.stage,
  getYear: () => state.year
});

// ---- 项目面板 ----
const panels = new global.Panels({
  getSelectedId: () => state.selectedProjectId,
  setSelectedId: id => { state.selectedProjectId = id; },
  getStage: () => state.stage
});

// ============================================================
// MODAL（共享自 js/modal.js，桌面/移动通用）
// ============================================================
const modalOverlay = document.getElementById('modal-overlay');
const onOverlayClick = e => { if(e.target===e.currentTarget) closeModal(); };
const onEscape = e => { if(e.key==='Escape') closeModal(); };
const onDisplayPanelClick = () => {
  const p = PROJECTS.find(x=>x.id===state.selectedProjectId);
  if(p) openModal(p);
};
const onThemeDotClick = e => themeManager.setTheme(e.currentTarget.dataset.theme, true);

// ============================================================
// INIT
// ============================================================
function init(){
  experiences.init();
  map.init();
  window.addEventListener('resize', onResize);
  timeline.init();
  panels.renderConsolePanel(STAGE_ORDER[0]);
  experiences.applyFocus(STAGE_ORDER[0], state.year);

  modalOverlay.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onEscape);
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('display-panel').addEventListener('click', onDisplayPanelClick);
  document.querySelectorAll('.panel-theme-dot').forEach(d=>d.addEventListener('click', onThemeDotClick));
}

function onResize(){ map.resize(); timeline.drawTicks(); timeline.updateBoundaries(); }

function destroy(){
  window.removeEventListener('resize', onResize);
  modalOverlay.removeEventListener('click', onOverlayClick);
  document.removeEventListener('keydown', onEscape);
  document.querySelector('.modal-close').removeEventListener('click', closeModal);
  document.getElementById('display-panel').removeEventListener('click', onDisplayPanelClick);
  document.querySelectorAll('.panel-theme-dot').forEach(d=>d.removeEventListener('click', onThemeDotClick));
  timeline.destroy();
  map.destroy();
  experiences.destroy();
}

init();

global.ResumeApp = { init, destroy, openModal, closeModal };

})(window);
