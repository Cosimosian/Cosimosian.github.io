# 地图风格令牌方案（方案 C 落地记录）

> **版本**：v1.0（已实施于 `index.html`）
>
> **日期**：2025-09-15

---

## 1. 方案概述

高精度分层 GeoJSON + Maputnik 风格基线（style.json）双资源驱动：
- **数据层**（几何，慢变化）：`assets/data/china-geo-data.js`
- **风格层**（视觉，常调整）：`assets/data/map-style.json` → `map-style-data.js`

前端 Canvas 渲染器只做"数据投影 + 按令牌上色"，改风格不改代码。

---

## 2. 资源文件

| 文件 | 大小 | 内容 | 来源 |
|---|---|---|---|
| `assets/data/china-geo-data.js` | 275KB | 国界 2437 点 + 岛礁 276 点 + 省界 45 线(11479点) + 河流 110 条(3203点) + 湖泊 54 环(939点) | 阿里 DataV 国界/省界 + Natural Earth 50m 河流湖泊 |
| `assets/data/map-style.json` | 8KB | Mapbox Style Spec v8，38 图层按 `metadata.theme` 分四组 | 手工构建的 Maputnik 基线 |
| `assets/data/map-style-data.js` | 8KB | 同上，`window.MAP_STYLE` 包装（file:// 可用） | `node scripts/wrap-style.js` 生成 |
| `scripts/wrap-style.js` | - | style.json → style-data.js 包装脚本 | 新 |
| `scripts/build-geo-data.js` | - | 原始 GeoJSON → 简化分层数据（Douglas-Peucker 0.02 容差） | 新（位于 temp，后续可移入 scripts/） |

---

## 3. style.json 图层 → Canvas 角色映射

每个图层带 `metadata: {theme, role}`，前端 `styleTokens(theme)` 过滤当前主题并按 role 提取 paint：

| role | 数据源 | Canvas 绘制 |
|---|---|---|
| `bg` | - | 径向渐变（`background-color` → `gradient-end`） |
| `outline-fill` | china-geo | 国界 evenodd 填充 |
| `outline` | china-geo | 国界描边 |
| `outline-handdrawn` / `outline-pixel` | china-geo | 虚线叠层（手绘笔触 / 像素感） |
| `provinces` | province-lines | 省界线 |
| `rivers` | rivers | 河流线 |
| `lakes` | lakes | 湖泊填充 |
| `labels` | - | "中 国"字样（字体/透明度令牌化） |
| `surrounding` | - | 周边地理标注 |
| `marker` | - | 城市标记（`marker-shape`: star/square/glow/dot + 三级半径/透明度） |

## 4. 风格调整工作流

```
Maputnik 打开 assets/data/map-style.json
  → 可视化调整各主题图层颜色/线宽/透明度
  → 导出覆盖 map-style.json
  → node scripts/wrap-style.js assets/data/map-style.json
  → 刷新页面（无需改 index.html）
```

---

## 5. index.html 改动要点

- 引入 `china-geo-data.js` + `map-style-data.js`
- 删除手工轮廓 19 点与 4 条手工省份线，改为真实数据投影
- **静态层缓存**：背景/轮廓/省界/河流/湖泊/文字渲染到 offscreen canvas，仅主题或尺寸变化时重建（实测 2.4ms / 18k 点）
- **动态层**：三级城市标记每 60ms 重绘（脉冲动画），shape 按主题令牌
- 移动端（`display:none`）跳过重绘
- 投影保持既有 `lonLatToXY`（简单圆柱，73-135E / 18-54N 归一化），与鼠标经纬度显示、城市标记对齐

---

## 6. 验证记录（2025-09-15）

| 项目 | 结果 |
|---|---|
| 数据加载（geo 5 层 / style 38 图层 / 10 role） | ✅ |
| 四主题渲染像素颜色区分（garden 米白 / code 深蓝青 / ai 纯黑 / future 近黑） | ✅ |
| 静态层重建耗时 | ✅ 2.4ms |
| 主题切换重建缓存（staticKey 跟随主题+尺寸） | ✅ |
| 移动端降级（390×844：地图隐藏 + 信息流 + 跳过重绘） | ✅ |
| 桌面恢复重渲染（1600×900） | ✅ |

截图：`.playwright-mcp/map-final-garden.png`、`map-final-code.png`、`map-final-ai.png`

---

## 7. 待办与扩展

- [ ] 用户审阅四主题视觉效果，如需微调 → Maputnik 流程或直接改 map-style.json
- [ ] 南海诸岛附图（右下角小视口）
- [ ] `scripts/build-geo-data.js` 移入 scripts/ 并记录原始数据获取命令
- [ ] 高精度数据体积优化（省界 45 线可合并去重，预计省 30-40%）
