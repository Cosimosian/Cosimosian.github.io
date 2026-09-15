# 个人履历网站 — 项目文档

> 风景园林 × 软件工程 × AI工程 三段叙事求职官网
>
> 架构：SPA + 三套视觉主题 + 底部拖拽时间轴 + CSS变量驱动 + 数据JSON解耦

---

## 快速导航

| 目录 | 用途 | AI开发时何时阅读 |
|------|------|-----------------|
| [`rules/`](#rules) | 流程规则：定义"怎么干" | 开始任何开发前必读 |
| [`specs/`](#specs) | 设计规格：定义"干什么" | 按阶段选择性阅读 |
| [`decisions/`](#decisions) | 决策记录：跟踪确认状态 | 开发前 + 用户反馈后 |
| [`templates/`](#templates) | 空白模板：供用户填写 | 需要用户输入时提供 |
| [`demos/`](#demos) | 演示文档 | 理解内容管理API |
| [`assets/`](#assets) | 素材规范 | 准备/处理图片资源时 |

---

## 按开发阶段阅读清单

### 阶段 0：项目初始化
- `decisions/decision-ledger.md` — 了解当前确认状态
- `specs/architecture.md` — 理解目录结构和文件组织

### 阶段 1：搭建基础工程架构
- `specs/architecture.md` §1-3 — 网页结构、目录结构、技术分层
- `specs/components.md` — 组件接口定义（了解需要创建的模块）
- `rules/dev-process.md` 阶段1 — 本阶段的具体任务和验收标准

### 阶段 2：封装三套 TA 视觉主题
- `specs/themes.md` — 三套主题 CSS 变量参考（优先使用已确认值）
- `decisions/decision-ledger.md` §2 — 主题视觉决策状态
- `assets/asset-spec.md` — 纹理素材规范
- `rules/dev-process.md` 阶段2

### 阶段 3：解耦履历数据层
- `specs/data-schema.md` — resume.json 字段定义
- `specs/components.md` §ResumeCard — 卡片组件接口
- `demos/content-management.md` — 内容管理 API 参考

### 阶段 4：开发核心时间轴交互
- `specs/interaction.md` — 卡尺时间轴交互参数（连续滑动 + 阶段边界检测）
- `specs/components.md` §TimelineController — 卡尺时间轴控制器接口
- `rules/dev-process.md` 阶段4

### 阶段 5：组装页面 UI 组件
- `specs/architecture.md` §4-5 — 组件关系图 + 数据流（全屏地图+浮动UI+双面板）
- `specs/components.md` — 全部组件接口（含ConsolePanel/DisplayPanel）
- `specs/responsive.md` — 桌面端浮动面板布局 + 卡尺时间轴

### 阶段 6：移动端适配
- `specs/responsive.md` — 响应式设计完整规格
- `rules/responsive-strategy.md` — 降级策略五阶段方法论
- `specs/themes.md` §移动端降级 — CSS变量降级规则

### 阶段 7：GitHub Pages 部署
- `specs/architecture.md` §3 — 部署层说明
- `decisions/decision-ledger.md` §5 — 部署决策状态

---

## rules

### `dev-process.md`
7阶段开发全流程：从基础架构到部署上线。每阶段明确 AI 生成任务、用户校验节点、耦合保障规则。包含解耦分层架构定义和后续扩展维护指引。

### `design-communication.md`
设计需求传达指引。将需求分为 4 类（架构级/视觉级/交互级/内容级），规定各类需求在 7 阶段流程中的最佳传达时机。提供"标准化设计需求包"模板和避坑指南。

### `responsive-strategy.md`
响应式前置策略核心规则：桌面优先、移动降级、双模结构、Pointer Events 统一、逻辑断点、CSS 变量驱动。分五个阶段实施（地基层→骨架层→肌理层→行为层→抛光层）。

---

## specs

### `architecture.md`
**硬性架构约束**。定义网页结构、完整目录结构、7层技术分层（数据/视觉/结构/交互/资源/适配/部署）、组件关系图、数据流图、耦合保障规则。

### `themes.md`
**三套主题 CSS 变量速查表**。每个主题定义完整的 CSS 变量（色彩、材质、卡片、动效、字体、粒子），标记确认状态（✅/💡）。含地图渲染参数、游标形象、情绪叙事关键词。

### `components.md`
**组件 API 参考**。所有核心组件的 TypeScript 接口定义：TimelineController、ChinaMap、ProjectCardsOverlay、ResumeCard、ModalController、ConnectionLine、ThemeManager、DataLoader。

### `interaction.md`
**交互参数规格**。统一记录所有可量化参数：时间轴拖拽（吸附距离、灵敏度、触控热区）、阶段切换动效、卡片交互、模态窗交互、地图定位点交互、全局触摸目标。

### `responsive.md`
**响应式设计规格**。逻辑断点定义（1200/768）、布局比例差异、CSS锚点变量、桌面端/移动端布局结构图对比、组件级响应式规则、性能降级策略、测试尺寸清单。

### `data-schema.md`
**resume.json 字段规范**。完整定义 timelineConfig、stages[]、Location、Project 的所有字段类型、必填/可选、示例值和约束规则。

---

## decisions

### `decision-ledger.md`
**项目决策唯一真相来源**。分5大类逐项记录决策状态（✅已确认 / 💡AI提议待确认 / ⏳开放 / ❌已否决）：架构级、主题视觉、交互参数、内容数据、部署运维。附带变更记录。

---

## templates

### `visual-form.md`
视觉风格与交互确认表单（待用户填写）。覆盖：中国地图三种渲染风格、游标动画小人、项目卡片、时间轴、头部区域、模态窗、色彩方案、字体系统、动画效果、移动端适配。

### `navigation-form.md`
导航结构与布局描述指南（四层次描述法：网页结构→整体布局→模块组成→视觉交互），供需要调整导航方案时使用。

---

## demos

### `content-management.md`
统一内容管理系统演示。介绍 ContentManager / ProjectRenderer / TimelineRenderer 的 API 用法和数据同步机制。

---

## assets

### `asset-spec.md`
素材资源规范。定义图片格式、尺寸、命名规范、存放路径、当前素材状态、图片引用方式。

---

## 补充说明

- `design/` 目录保留原始设计文档（architecture-plan.md、mobile-responsive-design.md、visual-details-checklist.md、mainpage_draft.png），作为设计演变的历史记录
- `reuse/` 目录中的副本文件已清理
- `.opencode/.omo/` 中的规划和草稿文件保留不变
