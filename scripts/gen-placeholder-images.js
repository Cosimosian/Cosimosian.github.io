// 为 12 个项目生成本地占位图（SVG，按阶段主题色）
// 用法：node scripts/gen-placeholder-images.js
const fs = require('fs');
const path = require('path');

const meta = {
  g1:{title:'家用厨房沥水架',c:'#92A87C'},
  g2:{title:'科普信息研究',c:'#92A87C'},
  g3:{title:'杨凌自贸大厦',c:'#92A87C'},
  g4:{title:'榆林博物馆',c:'#92A87C'},
  c1:{title:'AUM自动化分析',c:'#00ffcc'},
  c2:{title:'桌面猫猫计时器',c:'#00ffcc'},
  c3:{title:'AI客服问答首页',c:'#00ffcc'},
  c4:{title:'RAG审计问答',c:'#00ffcc'},
  a1:{title:'终端智能护眼',c:'#00d9ff'},
  a2:{title:'显示异常检测',c:'#00d9ff'},
  a3:{title:'短剧生成工作流',c:'#00d9ff'},
  a4:{title:'衣物管理app',c:'#00d9ff'},
};

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

const dir = path.join(__dirname, '..', 'assets', 'images', 'projects');
fs.mkdirSync(dir, { recursive: true });

for(const [id, m] of Object.entries(meta)){
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${m.c}" stop-opacity="0.45"/>
      <stop offset="1" stop-color="${m.c}" stop-opacity="0.08"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#g)"/>
  <rect x="1" y="1" width="798" height="398" fill="none" stroke="${m.c}" stroke-opacity="0.35" stroke-width="2" rx="10"/>
  <text x="400" y="190" font-family="sans-serif" font-size="34" fill="${m.c}" text-anchor="middle">${esc(m.title)}</text>
  <text x="400" y="236" font-family="sans-serif" font-size="15" fill="${m.c}" fill-opacity="0.65" text-anchor="middle">图片待补充 · 替换本文件或修改 md 中的图片地址</text>
</svg>`;
  fs.writeFileSync(path.join(dir, `${id}-detail.svg`), svg, 'utf8');
}
console.log('generated', Object.keys(meta).length, 'placeholder SVGs ->', dir);
