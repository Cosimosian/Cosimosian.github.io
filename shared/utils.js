// ============================================================
// 通用工具（shared/utils.js）
// 职责：无依赖的纯工具函数
// 依赖：无（被所有模块单向引用，本文件不得反向依赖业务模块）
// 加载：普通 <script>（file:// 兼容），挂载 window.Utils
// ============================================================
(function(global){
'use strict';

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

global.Utils = { cssVar, clamp, fmtYear };

})(window);
