// 主题 v1.0 地图画法重绘：garden 水墨 / code 像素 / ai 玻璃瞳孔
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const style = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/map-style.json'), 'utf8'));

const themes = {
  garden: {
    'outline-fill': { 'fill-color': '#33302A', 'fill-opacity': 0.04 },
    'outline': { 'line-color': '#33302A', 'line-width': 1.4, 'line-opacity': 0.45 },
    'outline-handdrawn': { 'line-color': '#33302A', 'line-width': 2.6, 'line-opacity': 0.12, 'line-dasharray': [12, 7] },
    'provinces': { 'line-color': '#33302A', 'line-width': 0.6, 'line-opacity': 0.09 },
    'rivers': { 'line-color': '#5C6B73', 'line-width': 0.8, 'line-opacity': 0.22 },
    'lakes': { 'fill-color': '#9FB4BC', 'fill-opacity': 0.14 },
    'labels': { 'text-color': '#33302A', 'text-opacity': 0.14, 'text-font': 'serif' },
    'surrounding': { 'text-color': '#33302A', 'text-opacity': 0.09, 'text-font': 'serif' },
    'marker': Object.assign({}, style.layers.find(l=>l.id==='garden-marker').paint, { 'circle-color': '#A8463A', 'marker-shape': 'star' }),
    'bg': { 'background-color': '#F6F1E7', 'gradient-end': 'rgba(51,48,42,0.25)' }
  },
  code: {
    'outline-fill': { 'fill-color': '#00FFCC', 'fill-opacity': 0.04 },
    'outline': { 'line-color': '#00FFCC', 'line-width': 2, 'line-opacity': 0.5 },
    'outline-pixel': { 'line-color': '#00FFCC', 'line-width': 1, 'line-opacity': 0.5, 'line-dasharray': [4, 4] },
    'provinces': { 'line-color': '#00FFCC', 'line-width': 0.8, 'line-opacity': 0.14 },
    'rivers': { 'line-color': '#0D5C52', 'line-width': 0.9, 'line-opacity': 0.3 },
    'lakes': { 'fill-color': '#0A2A3A', 'fill-opacity': 0.35 },
    'labels': { 'text-color': '#E8E8F0', 'text-opacity': 0.16, 'text-font': 'sans-serif' },
    'surrounding': { 'text-color': '#E8E8F0', 'text-opacity': 0.1, 'text-font': 'sans-serif' },
    'marker': Object.assign({}, style.layers.find(l=>l.id==='code-marker').paint, { 'circle-color': '#00FFCC', 'marker-shape': 'square' }),
    'bg': { 'background-color': '#12121C', 'gradient-end': 'rgba(0,0,0,0.6)' }
  },
  ai: {
    'outline-fill': { 'fill-color': '#5ED6FF', 'fill-opacity': 0.03 },
    'outline': { 'line-color': '#5ED6FF', 'line-width': 1.2, 'line-opacity': 0.5, 'line-glow': 12 },
    'provinces': { 'line-color': '#5ED6FF', 'line-width': 0.6, 'line-opacity': 0.08 },
    'rivers': { 'line-color': '#2A5A70', 'line-width': 0.8, 'line-opacity': 0.25 },
    'lakes': { 'fill-color': '#0E2A38', 'fill-opacity': 0.4 },
    'labels': { 'text-color': '#E4EAF2', 'text-opacity': 0.12, 'text-font': 'sans-serif' },
    'surrounding': { 'text-color': '#E4EAF2', 'text-opacity': 0.08, 'text-font': 'sans-serif' },
    'marker': Object.assign({}, style.layers.find(l=>l.id==='ai-marker').paint, { 'circle-color': '#5ED6FF', 'marker-shape': 'glow' }),
    'bg': { 'background-color': '#0A0E14', 'gradient-end': 'rgba(255,184,107,0.08)' }
  }
};

style.layers.forEach(layer => {
  const theme = layer.metadata && layer.metadata.theme;
  const role = layer.metadata && layer.metadata.role;
  if (!theme || !themes[theme] || !themes[theme][role]) return;
  layer.paint = themes[theme][role];
});

// 更新元信息
style.metadata.version = '1.0';
style.metadata.about = '主题 v1.0 地图画法：garden 水墨（淡墨细线+朱砂星） / code 像素（荧光绿方块） / ai 玻璃（赛博蓝发光+琥珀暗角）。v0.1 备份见 map-style-v0.1.json';

fs.writeFileSync(path.join(root, 'assets/data/map-style.json'), JSON.stringify(style, null, 2), 'utf8');
console.log('map-style.json updated:', style.layers.length, 'layers');
