# 主题 v1.0 设计规格（202609）

> 关键词驱动的三主题重设计。v0.1 存档：`git tag theme-v0.1` + `css/tokens-v0.1.css` + `assets/data/map-style-v0.1.json`。
> 回滚：`git checkout theme-v0.1 -- css/tokens.css assets/data/map-style.json`（或直接复制备份文件）。

## 一、极简中国风（garden）

关键词：无我 · 园林 · 自然呼吸 · 平静 · 明媚 · 朦胧 · 水汽 · 书画气

| 层 | 落点 |
|---|---|
| 色彩 | 宣纸 `#F6F1E7` / 淡墨 `#33302A` / 朱砂 `#A8463A` / 黛青 `#5C6B73` |
| 字体 | 思源宋体 + 霞鹜文楷（CDN），`--ls-heading:0.03em`，`--fs-adjust:0.55` |
| 材质 | 宣纸噪点 + 顶部水汽雾（`--texture-overlay`） |
| 动效 | 0.8s 慢呼气曲线；4s 呼吸；hover 轻浮 3%（无我=UI 后退） |
| 地图 | 水墨：淡墨细线 + 笔触虚线 + 朱砂星标 + 墨色文字 |

## 二、冷酷千禧（code）

关键词：child · 鬼马 · 故障 · 叛逆 · 躁动 · 重复 · 局部喧闹

| 层 | 落点 |
|---|---|
| 色彩 | 冷底 `#12121C` / 荧光绿 `#00FFCC` / 粉紫噪点 `#FF4FD8` |
| 字体 | Press Start 2P + Zpix（CDN/系统），`--ls-heading:1px`，`--fs-adjust:0.75` |
| 材质 | 16px 贴纸像素图案平铺（重复） |
| 动效 | 0.2s steps 机械感；激活项 RGB 分裂 glitch；hover 微抖；标签 ±2° 贴纸倾斜；不对称圆角 |
| 地图 | 像素：荧光绿方块 + 像素虚线 |

## 三、玻璃拟态（ai）

关键词：生命孕育 · 时间轴粘液 · 温暖的冰冷 · 缓动 · 人造皮肤 · 硅基生命之眼

| 层 | 落点 |
|---|---|
| 色彩 | 深空 `#0A0E14` / 赛博蓝 `#5ED6FF` / 琥珀暖点 `#FFB86B` |
| 字体 | Space Grotesk（CDN），`--ls-heading:-0.01em` |
| 材质 | 细颗粒皮肤噪点 + 底部皮下琥珀暖光；blur 18px；面板顶部高光边 |
| 动效 | 0.8s 黏滞缓出 `cubic-bezier(0.16,1,0.3,1)`；时间轴粘液流动高光；4s 生命呼吸；主题点瞳孔化 |
| 地图 | 玻璃：琥珀暖暗角 + 赛博蓝发光描边 + 发光圆点 |

## 文件映射

- `css/tokens.css`：色彩/字体/字距/材质/缓动变量（批次1-2）
- `css/themes-effects.css`：特效动画层（批次3）
- `assets/data/map-style.json`：地图三套画法（批次4）
- `js/map/chinaMap.js`：兜底色同步

## 约束遵循

- 主题不改布局结构（特效层仅 transform/animation/box-shadow/border-radius/伪元素）
- `prefers-reduced-motion` 全关闭
- 移动端自动继承变量；特效动画移动端可用（后续单独优化）
- 组件 CSS 与字号层级（`--fs-*`）零改动
