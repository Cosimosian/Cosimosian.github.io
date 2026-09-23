// ============================================================
// Loading 页逻辑（纸艺工作台）
// - 小人头 + 剪纸装备（手拿剪纸换上）
// - 状态机：光头 → 戴发镜(仪式) → 睡觉(睡帽) → 工作(电脑) → 听歌(耳机) 循环
// - 资源预载驱动进度条；动画独立循环
// - 100% 后浮现剪纸箭头，点击进入 index.html
// ============================================================
(function(){
'use strict';

const $ = id => document.getElementById(id);

// 动画节奏（可调）
const STATE_DURATION = 4500;   // 每状态展示时长 ms
const HAND_MS = 450;           // 手伸入/缩回时长

// ---- 主题色（装备/箭头染色，随 data-theme 自动） ----
function accent(){ return getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#A8463A'; }

// ============================================================
// SVG 资源（剪纸风：纸色填充 + 深灰描边；装备用主题色点缀）
// ============================================================
const PAPER = '#F0E8DA';
const INK = '#55544F';

// 小人头（光头，圆脸豆豆眼）
const SVG_HEAD = `
<svg viewBox="0 0 200 250" width="200" height="250">
  <path d="M62 250 Q62 192 100 192 Q138 192 138 250 Z" fill="${PAPER}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="28" cy="106" r="13" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
  <circle cx="172" cy="106" r="13" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
  <circle cx="100" cy="100" r="74" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
  <circle cx="70" cy="94" r="6" fill="${INK}"/>
  <circle cx="130" cy="94" r="6" fill="${INK}"/>
  <path d="M84 130 Q100 141 116 130" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="58" cy="120" r="9" fill="${accent()}" opacity="0.22"/>
  <circle cx="142" cy="120" r="9" fill="${accent()}" opacity="0.22"/>
</svg>`;

// 装备（叠层，viewBox 对齐头部）
const EQUIPS = {
  hair: `<svg viewBox="0 0 200 250" width="200" height="250" class="equip-svg">
    <path d="M30 96 Q40 44 70 34 Q86 28 100 28 Q120 30 138 44 Q166 64 170 96 Q140 62 100 60 Q60 62 30 96 Z" fill="${INK}" opacity="0.85"/>
  </svg>`,
  glasses: `<svg viewBox="0 0 200 250" width="200" height="250" class="equip-svg">
    <circle cx="70" cy="94" r="22" fill="none" stroke="${INK}" stroke-width="4"/>
    <circle cx="130" cy="94" r="22" fill="none" stroke="${INK}" stroke-width="4"/>
    <path d="M92 94 Q100 90 108 94" stroke="${INK}" stroke-width="4" fill="none"/>
    <path d="M48 92 L26 88 M152 92 L174 88" stroke="${INK}" stroke-width="4"/>
  </svg>`,
  cap: `<svg viewBox="0 0 200 250" width="200" height="250" class="equip-svg">
    <path d="M40 74 Q40 34 100 22 Q160 34 160 74 Q150 56 100 54 Q50 56 40 74 Z" fill="${accent()}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="100" cy="22" r="10" fill="${accent()}" stroke="${INK}" stroke-width="3"/>
    <path d="M40 74 L160 74" stroke="${INK}" stroke-width="3"/>
  </svg>`,
  laptop: `<svg viewBox="0 0 200 250" width="200" height="250" class="equip-svg">
    <rect x="45" y="120" width="110" height="66" rx="4" fill="none" stroke="${INK}" stroke-width="4"/>
    <path d="M45 170 L58 186 L142 186 L155 170" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <rect x="53" y="128" width="94" height="36" rx="2" fill="${accent()}" opacity="0.25" stroke="none"/>
  </svg>`,
  headphone: `<svg viewBox="0 0 200 250" width="200" height="250" class="equip-svg">
    <path d="M32 96 A68 68 0 0 1 168 96" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
    <rect x="22" y="88" width="26" height="40" rx="8" fill="${accent()}" stroke="${INK}" stroke-width="3"/>
    <rect x="152" y="88" width="26" height="40" rx="8" fill="${accent()}" stroke="${INK}" stroke-width="3"/>
  </svg>`,
  note: `<svg viewBox="0 0 200 250" width="200" height="250" class="equip-svg">
    <g fill="${accent()}" stroke="${INK}" stroke-width="2.5">
      <path d="M148 70 q10 -6 18 0 q-6 14 -18 12 Z"/>
      <path d="M150 118 q10 -6 18 0 q-6 14 -18 12 Z"/>
    </g>
  </svg>`
};

// 手（真实风格简化，纸色）
const SVG_HAND = `
<svg viewBox="0 0 96 120" width="96" height="120">
  <g fill="${PAPER}" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
    <path d="M30 30 Q24 16 34 12 Q44 10 48 22 L48 70 Q48 92 40 102 L20 112 Q14 96 26 90 Z"/>
    <path d="M48 22 Q52 10 62 12 Q70 16 66 30 L60 66"/>
    <path d="M66 30 Q76 24 82 34 Q84 44 76 48 L70 62"/>
    <path d="M70 50 Q84 48 88 58 Q88 68 78 68 L70 66"/>
  </g>
</svg>`;

// 装备剪影（预告区，虚线）
const SILHOUETTES = {
  cap: `<svg viewBox="0 0 200 250" width="34" height="42"><path d="M40 74 Q40 34 100 22 Q160 34 160 74 Q150 56 100 54 Q50 56 40 74 Z" fill="none" stroke="${accent()}" stroke-width="3" class="sketch" stroke-dasharray="3 3"/></svg>`,
  laptop: `<svg viewBox="0 0 200 250" width="34" height="42"><rect x="45" y="120" width="110" height="66" rx="4" fill="none" stroke="${accent()}" stroke-width="3" class="sketch"/></svg>`,
  headphone: `<svg viewBox="0 0 200 250" width="34" height="42"><path d="M32 96 A68 68 0 0 1 168 96" fill="none" stroke="${accent()}" stroke-width="4" class="sketch"/></svg>`
};

// ============================================================
// 渲染
// ============================================================
const figure = $('figure');
figure.innerHTML = SVG_HEAD;
const equipLayer = document.createElement('div');
equipLayer.className = 'equip';
equipLayer.style.position = 'absolute';
equipLayer.style.top = '0';
equipLayer.style.left = '0';
figure.appendChild(equipLayer);

function setEquip(key){
  equipLayer.innerHTML = key ? EQUIPS[key] : '';
}
function setSilhouette(key){
  $('next-slot').innerHTML = key ? (SILHOUETTES[key] || '') : '';
  $('next-label').textContent = key ? NEXT_LABEL[key] : '';
}

const NEXT_LABEL = { cap:'睡觉', laptop:'工作', headphone:'听歌' };

// 手元素
const handL = $('hand-left');
const handR = $('hand-right');
handL.innerHTML = SVG_HAND;
handR.innerHTML = SVG_HAND;

function handIn(hand){
  hand.classList.remove('exit','hold');
  hand.classList.add('enter');
}
function handHold(hand){
  hand.classList.remove('enter','exit');
  hand.classList.add('hold');
}
function handOut(hand){
  hand.classList.remove('enter','hold');
  hand.classList.add('exit');
}

// ============================================================
// 状态机（async 时序）
// ============================================================
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 状态序列（循环）：[当前装备, 新装备, 状态名]
const SEQUENCE = [
  { cur:'cap', next:'laptop', name:'工作' },
  { cur:'laptop', next:'headphone', name:'听歌' },
  { cur:'headphone', next:'cap', name:'睡觉' }
];

let running = true;
let entering = false;

// 开场仪式：光头 → 戴头发 + 眼镜
async function opening(){
  // 戴头发
  setSilhouette(null);
  handIn(handL); await sleep(HAND_MS);
  setEquip('hair'); await sleep(350);
  handOut(handL); await sleep(HAND_MS);
  await sleep(400);
  // 戴眼镜
  handIn(handR); await sleep(HAND_MS);
  setEquip('hair'); // 保持头发，加眼镜（合成：头部叠两层，这里简化：眼镜覆盖时头发仍在）
  appendGlasses(); await sleep(350);
  handOut(handR); await sleep(HAND_MS);
  await sleep(500);
}

// 眼镜叠加在头发之上
function appendGlasses(){
  equipLayer.innerHTML = EQUIPS.hair + EQUIPS.glasses;
}

// 状态循环
async function loop(){
  setEquip('cap');
  setSilhouette('laptop');
  let i = 0;
  while(running){
    const s = SEQUENCE[i % SEQUENCE.length];
    $('next-label').textContent = s.name;
    // 展示当前
    await sleep(STATE_DURATION);
    if(!running) break;
    // 右手取下当前
    handIn(handR); await sleep(HAND_MS);
    setEquip(null); await sleep(300);
    handOut(handR); await sleep(HAND_MS);
    await sleep(250);
    // 左手挂新装备
    handIn(handL); await sleep(HAND_MS);
    setEquip(s.next); await sleep(350);
    handOut(handL); await sleep(HAND_MS);
    // 预告下一个
    setSilhouette(SEQUENCE[(i+1) % SEQUENCE.length].next);
    i++;
  }
}

// ============================================================
// 进度条 + 资源预载
// ============================================================
const RESOURCES = [
  'assets/data/china-geo-data.js','assets/data/map-style-data.js',
  'data/resume.js','shared/projection.js','shared/utils.js',
  'js/projectDoc.js','js/modal.js','js/map/chinaMap.js','js/timeline.js',
  'js/theme.js','js/experiences.js','js/panels.js','js/main.js','js/mobile.js',
  'css/tokens.css','css/base.css','css/components.css','css/timeline.css',
  'css/mobile.css','css/themes-effects.css','css/loading.css',
  'data/projects/g1.md','data/projects/g2.md','data/projects/g3.md',
  'data/projects/c1.md','data/projects/c2.md','data/projects/c3.md','data/projects/c4.md',
  'data/projects/a1.md','data/projects/a2.md','data/projects/a3.md','data/projects/a4.md'
];

let progress = 0;
function setProgress(p){
  progress = Math.min(100, Math.round(p));
  $('progress-fill').style.width = progress + '%';
  $('progress-num').textContent = progress + '%';
  if(progress >= 100) onLoaded();
}

let enterReady = false;
function onLoaded(){
  if(enterReady) return;
  enterReady = true;
  $('enter').classList.add('show');
}

async function preload(){
  // file:// 下 fetch 会失败 → 模拟进度
  let fallback = false;
  try{ await fetch('index.html'); }catch(e){ fallback = true; }

  if(fallback){
    // 模拟：匀速推进到 100
    let p = 0;
    const timer = setInterval(()=>{
      p += 2;
      setProgress(p);
      if(p >= 100) clearInterval(timer);
    }, 120);
    return;
  }

  let done = 0;
  const total = RESOURCES.length;
  await Promise.all(RESOURCES.map(async url => {
    try{
      const res = await fetch(url, { cache:'force-cache' });
      await (res.ok ? res.blob() : Promise.resolve());
    }catch(e){ /* 忽略单资源失败 */ }
    done++;
    setProgress(done / total * 100);
  }));
  setProgress(100);
}

// 进入
$('enter').addEventListener('click', ()=>{
  if(enterReady && !entering){
    entering = true;
    window.location.href = 'index.html';
  }
});

// ============================================================
// 启动
// ============================================================
(async function init(){
  setEquip(null);
  preload();                 // 进度条独立推进
  await opening();           // 开场仪式
  loop();                    // 状态循环（独立于进度）
})();

})();
