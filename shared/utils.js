// ============================================================
// 通用工具（shared/utils.js）
// 职责：无依赖的纯工具函数 + 调试开关
// 依赖：无（被所有模块单向引用，本文件不得反向依赖业务模块）
// 加载：普通 <script>（file:// 兼容），挂载 window.Utils
// ============================================================
(function(global){
'use strict';

// 调试开关：URL 加 ?debug=1 时输出诊断日志（默认关闭）
const DEBUG = (function(){
  try{ return new URLSearchParams(global.location.search).has('debug'); }
  catch(e){ return false; }
})();

// 读取 :root 上的 CSS 变量（trim 后返回）
function cssVar(name){
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// 数值钳制到 [min, max]
function clamp(v, min, max){
  return Math.max(min, Math.min(max, v));
}

// 年月格式化：2016.75 → "2016.9"（月从 1 开始）
function fmtYear(y){
  const yr = Math.floor(y);
  const mo = Math.round((y - yr) * 12) + 1;
  return yr + '.' + mo;
}

// 经历条目在指定年月是否处于活跃区间（slack 为区间容差月数，地图标记用 1/24、列表高亮用 0）
function expActiveAt(exp, year, slack=0){
  return year >= (exp.year - slack) && year <= (exp.yearEnd || exp.year) + slack;
}

// 项目标签 → 标签 HTML（面板与弹窗共用，避免重复模板）
function tagsHtml(tags){
  return (tags||[]).map(t=>`<span class="display-tag">${t}</span>`).join('');
}

global.Utils = { DEBUG, cssVar, clamp, fmtYear, expActiveAt, tagsHtml };

})(window);
