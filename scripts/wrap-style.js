const fs = require('fs');
const path = process.argv[2];
const style = JSON.parse(fs.readFileSync(path, 'utf8'));
const out =
`// 中国地图视觉基线（由 assets/data/map-style.json 包装生成）
// 编辑流程: Maputnik 打开 map-style.json 调整 -> 导出覆盖 map-style.json -> 运行本脚本重新生成
window.MAP_STYLE = ${JSON.stringify(style)};
`;
const dest = path.replace(/\.json$/, '-data.js');
fs.writeFileSync(dest, out, 'utf8');
console.log('wrapped ->', dest, Math.round(fs.statSync(dest).size / 1024) + 'KB');
