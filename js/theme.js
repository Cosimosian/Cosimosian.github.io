// ============================================================
// 主题管理模块（js/theme.js）
// 职责：阶段主题切换——data-theme、头部描述、主题按钮态；通过回调通知装配层调度各模块
// 依赖：RESUME（STAGES）
// 接口：setTheme(theme, snapToStageStart) / getCurrentStage()
// 通信：onStageChange(stageId, snapped)——只发事件，不直操时间轴/地图/面板
// ============================================================
(function(global){
'use strict';

const { STAGES } = global.RESUME;

class ThemeManager{
  constructor({ onStageChange }){
    this._onStageChange = onStageChange || (()=>{});
    this._current = 'garden';
  }

  getCurrentStage(){ return this._current; }

  setTheme(theme, snapToStageStart){
    this._current = theme;
    const s = STAGES[theme];
    document.documentElement.setAttribute('data-theme', s.theme);
    document.getElementById('stage-desc').textContent = s.description;
    document.querySelectorAll('.panel-theme-dot').forEach(d=>d.classList.toggle('active', d.dataset.theme===theme));
    this._onStageChange(theme, !!snapToStageStart);
  }
}

global.ThemeManager = ThemeManager;

})(window);
