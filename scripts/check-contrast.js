// WCAG 对比度校验：读取 css/tokens.css 的每主题色板，计算关键组合的对比度
// 用法：node scripts/check-contrast.js
// 规则：正文 ≥4.5:1、大字 ≥3:1（visual-constraints.md §2）
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'tokens.css'), 'utf8');

// 解析各主题块的变量
function parseThemeBlock(css, selector){
  const idx = selector === ':root' ? css.indexOf(':root{') : css.indexOf(selector);
  if(idx < 0) return {};
  const open = css.indexOf('{', idx);
  const close = css.indexOf('}', open);
  const body = css.slice(open + 1, close);
  const vars = {};
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while((m = re.exec(body))) vars[m[1].trim()] = m[2].trim();
  return vars;
}

function parseColor(str){
  str = String(str).trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(str);
  if(hex){
    return [parseInt(hex[1].slice(0,2),16), parseInt(hex[1].slice(2,4),16), parseInt(hex[1].slice(4,6),16)];
  }
  const rgba = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?/.exec(str);
  if(rgba) return [parseFloat(rgba[1]), parseFloat(rgba[2]), parseFloat(rgba[3]), rgba[4] !== undefined ? parseFloat(rgba[4]) : 1];
  return null;
}

function luminance([r,g,b]){
  const f = c => { c = c/255; return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
  return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b);
}

function contrast(a, b){
  const l1 = luminance(a), l2 = luminance(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

// 合成色（半透明色叠在背景上）
function composite(fg, bg){
  const a = fg[3] !== undefined ? fg[3] : 1;
  return [0,1,2].map(i => fg[i]*a + bg[i]*(1-a));
}

const themes = {
  garden: ':root',
  code: '[data-theme="code"]',
  ai: '[data-theme="ai"]',
  future: '[data-theme="future"]'
};

let failed = 0;

for(const [name, sel] of Object.entries(themes)){
  const v = parseThemeBlock(css, sel);
  const bg = parseColor(v['color-bg']);
  const text = parseColor(v['color-text']);
  const accent = parseColor(v['color-accent']);
  const tagText = parseColor(v['color-tag-text']);
  const tagBg = parseColor(v['color-tag-bg']);

  const checks = [];
  if(bg && text) checks.push(['正文文字/背景', contrast(text, bg), 4.5]);
  if(bg && accent) checks.push(['强调色/背景', contrast(accent, bg), 3]);
  if(bg && tagText) checks.push(['标签文字/背景', contrast(tagText, bg), 4.5]);
  if(tagText && tagBg && bg){
    const comp = composite(tagBg, bg);
    checks.push(['标签文字/标签底', contrast(tagText, comp), 4.5]);
  }

  console.log('\n=== ' + name + ' (' + sel + ') ===');
  console.log('  bg=' + v['color-bg'] + ' text=' + v['color-text'] + ' accent=' + v['color-accent']);
  for(const [label, ratio, min] of checks){
    const ok = ratio >= min;
    if(!ok) failed++;
    console.log('  ' + (ok ? 'PASS' : 'FAIL') + '  ' + label + ': ' + ratio.toFixed(2) + ':1 (需≥' + min + ':1)');
  }
  if(!bg){ console.log('  WARN  无法解析背景色'); failed++; }
}

console.log('\n结果：' + (failed === 0 ? '全部通过 ✓' : failed + ' 项未达标 ✗'));
process.exit(failed === 0 ? 0 : 1);
