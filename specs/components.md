# 组件 API 参考

> 本文档定义所有核心组件的 TypeScript 接口和公开方法。实现时必须严格遵守。
> 来源：`design/architecture-plan.md`、`rules/code_process.md`

---

## TimelineController

时间轴交互控制器，独立工具类，不耦合业务数据与视觉样式。

```typescript
interface TimelineConfig {
  trackSelector: string;          // 时间轴轨道 CSS 选择器
  sliderSelector: string;         // 卡尺滑块 CSS 选择器
  yearStart: number;              // 起始年（2016.75 = 2016年9月）
  yearEnd: number;                // 结束年（2026.58 = 2026年7月）
  stageBoundaries: Array<{        // 阶段边界
    year: number;                 // 边界年月（2021.75 / 2024.5）
    stageId: string;              // 边界之后的阶段 ID
  }>;
  onYearChange: (year: number) => void;       // 年月连续变化回调
  onStageCross: (stageId: string) => void;     // 跨越阶段边界回调
}

class TimelineController {
  constructor(config: TimelineConfig);

  // 拖拽控制（Pointer Events 统一模型）
  initDraggableSlider(): void;

  // 年月计算
  getCurrentYear(): number;       // 返回当前年月（2016.75 → 2016年9月）
  getCurrentStage(): string;      // 返回当前阶段 ID

  // 点击跳转
  jumpToYear(year: number): void;

  // 卡尺刻度渲染
  renderTicks(container: HTMLElement): void;   // 年大刻度 + 月小刻度

  // 移动端适配
  adaptForMobile(): void;

  // 销毁
  destroy(): void;
}
```

**硬性约束**：
- 内部不直接操作主题样式、渲染内容
- 仅通过 `onStageCross` 和 `onYearChange` 回调向外传递信息
- 不硬编码阶段数量、年月范围，所有参数由外部传入
- 移动端自动增大游标触控热区至 80×60px
- 视觉尺寸（3px滑块）与触控热区（24×80px）分离

---

## ChinaMap（核心）

中国地图组件，Canvas 渲染，三种风格切换。

```typescript
enum MapRenderStyle {
  GARDEN = 'garden',   // 水彩手绘
  CODE = 'code',       // 像素网格
  AI = 'ai',           // 科技数据流
}

interface CityMarker {
  city: string;
  coordinates: { lat: number; lng: number };
  screenPosition: { x: number; y: number };
  markerType: 'star' | 'dot' | 'pixel';
}

class ChinaMap {
  constructor();  // 全屏背景层，不需要容器参数

  // 核心渲染
  render(style: MapRenderStyle): void;
  clearCanvas(): void;

  // 定位点管理（预留）
  addCityMarker(marker: CityMarker): void;
  clearMarkers(): void;
  setCityMarkers(markers: CityMarker[]): void;

  // 响应式
  resize(): void;        // 监听 window resize
  destroy(): void;
}
```

**硬性约束**：
- Canvas 尺寸为全屏（`100vw × 100vh`）
- 中国地图居中绘制，周边地理信息渲染在边角区域
- 内部坐标投影函数根据实际画布大小动态计算
- 三种渲染引擎（`MapRenderer`）独立实现，通过统一接口调用
- 城市标记点暂预留接口，后续根据具体经纬度填充

---

## ConsolePanel（新增 — 左侧控制台面板）

左侧项目导航面板，透明叠底 + 细线边框风格，负责切换右侧展示内容。

```typescript
class ConsolePanel {
  constructor(container: HTMLElement);

  // 渲染当前阶段项目列表
  renderProjectList(stageId: string, projects: ProjectCardData[]): void;

  // 高亮当前选中项目
  setActiveProject(projectId: string): void;

  // 清空
  clear(): void;

  // 选择回调
  onSelect: (project: ProjectCardData) => void;
}
```

**硬性约束**：
- 面板背景使用 `--panel-opacity` + `--panel-border` 透明叠底
- 文字使用 `--panel-text-shadow` 保证地图背景上可读
- 不硬编码项目数量/布局，数据驱动渲染

---

## DisplayPanel（新增 — 右侧展示面板）

右侧项目详情展示面板，透明叠底 + 细线边框风格。

```typescript
class DisplayPanel {
  constructor(container: HTMLElement);

  // 渲染单个项目详情
  renderProject(project: ProjectCardData | null): void;

  // 空状态（无项目时显示提示）
  showEmptyState(stageId: string): void;

  // 清空
  clear(): void;
}
```

**硬性约束**：
- 面板背景使用 `--panel-opacity` + `--panel-border` 透明叠底
- 使用 `ResumeCard` 渲染项目内容
- 不硬编码项目数据结构

---

## ResumeCard（通用卡片）

```typescript
interface ProjectCardData {
  id: string;
  title: string;
  image: string;
  mobileImage?: string;
  description: string;
  tags: string[];
  location: string;
  city: string;
  stage: string;
}

class ResumeCard {
  constructor(data: ProjectCardData);

  render(container: HTMLElement): void;
}

function createProjectCard(project: ProjectCardData): HTMLElement;
```

**硬性约束**：
- 不硬编码任何主题专属样式
- 仅通过父节点 `data-theme` 继承 CSS 变量
- 支持图片懒加载（`loading="lazy"`）
- 移动端/桌面端使用不同图片资源（通过 `mobileImage` 字段区分）

---

## ModalController

模态窗控制器，内联弹窗（无页面跳转）。

```typescript
class ModalController {
  constructor(overlay: HTMLElement, content: HTMLElement);

  open(projectId: string): void;
  close(): void;
  bindEscapeKey(): void;
  bindBackdropClick(): void;

  private loadProject(projectId: string): ProjectCardData;
  private renderContent(project: ProjectCardData): void;
}
```

**硬性约束**：
- ESC 键关闭
- 点击遮罩层关闭
- 右上角 × 按钮关闭
- 缩放弹出动画（`scale 0.8 → 1.0`）
- 模式窗内容自适应，移动端宽度 95%

---

## ThemeManager

```typescript
interface ThemeConfig {
  garden: { primary: string; background: string; mapPrimary: string; mapSecondary: string; mapBorder: string; mapMarker: string; };
  code: { primary: string; background: string; mapPrimary: string; mapSecondary: string; mapBorder: string; mapMarker: string; };
  ai: { primary: string; background: string; mapPrimary: string; mapSecondary: string; mapBorder: string; mapMarker: string; };
}

class ThemeManager {
  constructor();

  switchTheme(themeName: 'garden' | 'code' | 'ai'): void;
  getCurrentTheme(): string;
}
```

---

## DataLoader

```typescript
interface ResumeData {
  timelineConfig: {
    yearStart: number;       // 2016.75
    yearEnd: number;         // 2026.58
    dragCursorIcon: string;
  };
  stages: Stage[];
}

interface Stage {
  id: string;
  theme: 'garden' | 'code' | 'ai';
  yearStart: number;         // 阶段起始年月
  yearEnd: number;           // 阶段结束年月
  title: string;
  description: string;
  locations: Location[];
}

class DataLoader {
  constructor(dataUrl: string);

  async load(): Promise<ResumeData>;
  getStage(stageId: string): Stage | undefined;
  getProject(projectId: string): ProjectCardData | undefined;
  getAllStages(): Stage[];
}
```
