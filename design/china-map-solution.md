# 中国地图具体方案（方案 B：GeoJSON + Canvas 自绘投影）

> **版本**：v1.0（已落地实施）
>
> **更新日期**：2025-09-15
>
> **状态**：✅ 已实施于 `layout-preview.html`，数据文件 `assets/data/china-map-data.js`

---

## 1. 方案选择依据

综合现有预留接口与设计意图，从 4 套候选方案（A 纯手绘轮廓 / B GeoJSON+Canvas / C D3-geo / D 静态SVG素材）中选定 **方案 B**：

| 约束来源 | 约束内容 | 方案 B 契合度 |
|---|---|---|
| `specs/components.md` | ChinaMap 为 Canvas 组件，`render(style)` + 三套 MapRenderer | ✅ 零接口破坏 |
| `specs/components.md` | CityMarker 携带真实经纬度 `{lat, lng}` | ✅ 墨卡托投影精确映射 |
| `visual-details-checklist.md` | ✅ 简化轮廓、非标准地图投影 | ✅ 110m 精度 + 自绘投影 |
| `architecture-plan.md` | 城市定位准确（真实经纬度） | ✅ 投影后定位 |
| `decision-ledger.md` | ✅ 三阶段三种渲染风格 | ✅ 三个独立渲染器 |
| `themes.md` | 主题色仅通过 CSS 变量 | ✅ `getComputedStyle` 读取 |

---

## 2. 数据源

- **来源**：Natural Earth `ne_110m_admin_0_countries.geojson`（public domain）
- **处理**：Node 脚本提取中国几何（MultiPolygon 两多边形合并取环），坐标四舍五入至 2 位小数
- **产物**：`assets/data/china-map-data.js`（3.7KB）

```javascript
window.CHINA_MAP_DATA = {
  outer: [[lng, lat], ...],   // 主轮廓 230 点（含台湾、海南主体）
  holes: [[...]]              // 附属岛礁环 10 点
};
```

- **加载方式**：`<script src>` 同步引入（file:// 与 http:// 均可），无 fetch CORS 问题
- **经纬范围**：lat 20.28°–53.46°，lng 73.68°–135.03°

---

## 3. 投影与适配（ChinaMap._computeTransform）

```
Web Mercator 投影：
  x = lng * π/180 * R        (R = 6378137m)
  y = ln(tan(π/4 + lat*π/360)) * R

Fit 变换（轮廓 bbox → 画布，居中 + 8% 边距）：
  scale = min((w-2m)/(maxX-minX), (h-2m)/(maxY-minY))
  屏幕坐标: sx = (x-cx)*scale + w/2
            sy = h/2 - (y-cy)*scale    ← y 轴翻转（北在上）
```

- 投影结果缓存于 `_projected`（Path2D），`resize()`/`render()` 时失效重建
- Canvas 以 devicePixelRatio 缩放，CSS 尺寸 = 容器 100%×100%

---

## 4. 三种渲染器绘制规格

### 4.1 garden（水彩手绘）
| 元素 | 规格 |
|---|---|
| 轮廓填充 | `--map-primary` 透明度 0.28 |
| 描边 | `--map-border` 2.2px 实线 + 5px 虚线叠层（手绘笔触感） |
| 城市标记 | 5 角星形（r=8，高亮 12），`--map-marker` 填充 + 白色描边 |
| 动画 | 呼吸（sin 周期 1s，幅度 ±12%） |

### 4.2 code（像素网格）
| 元素 | 规格 |
|---|---|
| 背景 | 7px 网格线，`--map-secondary` 透明度 5% |
| 轮廓 | 投影点取整至 7px 栅格，方块填充 `--map-primary` 55% + `--map-secondary` 描边 |
| 城市标记 | 像素方块 12px（高亮 18px），`--map-marker` 填充 + 描边 |
| 动画 | 闪烁（sin 4πt 阈值，约 2Hz） |

### 4.3 ai（科技数据流）
| 元素 | 规格 |
|---|---|
| 轮廓 | 1.4px 细线 + shadowBlur 14 发光（`--map-secondary`）+ 4px 半透明描边 |
| 城市标记 | 发光圆点 r=6（高亮 9）+ 3r 径向渐变光晕 |
| 动画 | 脉冲（周期 1s，幅度 ±30%） |

### 城市名标注
- 仅高亮城市显示（12px，`--color-text`），位于标记上方

---

## 5. 城市标记系统

```javascript
const CITIES = {
  xian:     { name:'西安', lat:34.34, lng:108.94, markerType:'star' },
  lanzhou:  { name:'兰州', lat:36.06, lng:103.83, markerType:'star' },
  shenzhen: { name:'深圳', lat:22.54, lng:114.06, markerType:'star' },
  hangzhou: { name:'杭州', lat:30.27, lng:120.16, markerType:'star' },
  beijing:  { name:'北京', lat:39.90, lng:116.40, markerType:'star' },
  shanghai: { name:'上海', lat:31.23, lng:121.47, markerType:'star' },
  chengdu:  { name:'成都', lat:30.57, lng:104.07, markerType:'star' }
};
```

- 实现 `addCityMarker` / `setCityMarkers` / `clearMarkers` 预留接口
- 命中检测：`handleClick` 24px 半径内最近标记，点击 toggle 高亮
- 高亮回调 `onCityClick(cityKey, highlighted)` → 联动 DOM 卡片透明度

---

## 6. 项目卡片定位（positionDesktopCards）

1. 城市反查：优先 `location` 字符串中文城市名（如"兰州"）→ `CITY_BY_NAME`，fallback 到 `city` 字段
2. 定位规则：卡片中心 = 标记右侧（`pos.x + 卡片半宽 + 26px`），同城多项目上下错位 40px
3. 边界夹取：卡片中心与整卡均不出容器（4px 最小边距）
4. 图片 `load` 后重定位（卡片高度变化）
5. CSS 配合：`.project-card-overlay` 使用 `translate(-50%,-50%)` 中心对齐

---

## 7. 主题与响应式集成

- `switchTheme(theme)` → `chinaMap.render(theme)` → 三渲染器切换
- 主题色实时读取 `.app-container` 的 CSS 变量（`--map-primary` / `--map-border` / `--map-marker` / `--map-marker-hover`）
- 动画循环：rAF 每帧重绘（呼吸/闪烁/脉冲），canvas `display:none`（移动端）时自动跳过
- `handleResize`：设备切换 → 重渲染卡片 + `chinaMap.resize()` + 重投影
- 移动端（≤768px）：地图容器 `display:none`，信息流布局不变

---

## 8. 南海诸岛处理策略

- **当前（v1.0）**：主轮廓（Natural Earth 110m 已含台湾、海南）+ 附属岛礁环；南海诸岛岛礁群在 110m 精度下不可见
- **后续（v1.1 可选）**：右下角"南海诸岛附图"（九段线内岛礁放大图），独立环数据 + 独立投影视口，标准地图惯例

---

## 9. 验证记录（2025-09-15）

| 项目 | 结果 |
|---|---|
| JS 语法（new Function 编译） | ✅ 通过 |
| 城市相对位置（北京东北/成都西部/深圳南部等） | ✅ 正确 |
| 兰州项目反查定位（city 字段 xian，location 兰州） | ✅ 定位兰州 915,343 |
| 三主题 Canvas 像素输出 | ✅ garden 157K / code 477K / ai 86K 非透明像素 |
| 标记点击高亮 + 卡片联动 + toggle 取消 | ✅ 通过 |
| 主题切换重渲染 | ✅ style 同步 code/ai，CSS 变量正确 |
| 移动端降级（390×844） | ✅ 地图隐藏、信息流 4 卡、头/时间轴 fixed |
| 桌面恢复重渲染（1600×900） | ✅ 4 卡重定位、canvas 1440px |

---

## 10. 后续扩展点

- [ ] 南海诸岛附图（v1.1）
- [ ] ConnectionLine 波浪线连接标记与卡片（specs/components.md 预留）
- [ ] 阶段过滤：切换时间轴阶段时仅显示该阶段城市标记
- [ ] 粒子效果接入 `--particle-count`（AI 主题数据流粒子）
- [ ] 110m → 50m 精度轮廓（增加边境细节）
