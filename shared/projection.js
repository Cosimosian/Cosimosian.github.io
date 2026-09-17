// ============================================================
// 经纬度投影（shared/projection.js）
// 职责：中国范围经纬度 ↔ 归一化坐标 ↔ 屏幕像素 的双向换算
// 依赖：无（纯函数，被 map 模块单向引用）
// 加载：普通 <script>（file:// 兼容），挂载 window.Projection
// 注意：投影魔数集中于此，改动只需一处
// ============================================================
(function(global){
'use strict';

const LON_MIN = 73, LON_MAX = 135, LAT_MIN = 18, LAT_MAX = 54;

// 归一化窗口参数（与 XYToLonLat 严格互逆，勿单边修改）
const X_SCALE = 0.96, X_OFFSET = -0.05;
const Y_ANCHOR = 0.44, Y_SCALE = 0.70;

function lonLatToXY(lon, lat){
  const x = (lon - LON_MIN) / (LON_MAX - LON_MIN) * X_SCALE + X_OFFSET;
  const y = Y_ANCHOR - (lat - LAT_MIN) / (LAT_MAX - LAT_MIN) * Y_SCALE;
  return { x, y };
}

function XYToLonLat(x, y){
  const lon = LON_MIN + (x - X_OFFSET) / X_SCALE * (LON_MAX - LON_MIN);
  const lat = LAT_MIN + (Y_ANCHOR - y) / Y_SCALE * (LAT_MAX - LAT_MIN);
  return { lat, lng: lon };
}

// 经纬度 → 画布像素（mapParams = {cx, cy, scale}）
function toScreen(lon, lat, { cx, cy, scale }){
  const p = lonLatToXY(lon, lat);
  return { x: cx + p.x * scale, y: cy + p.y * scale };
}

global.Projection = { LON_MIN, LON_MAX, LAT_MIN, LAT_MAX, lonLatToXY, XYToLonLat, toScreen };

})(window);
