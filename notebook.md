# 项目文档索引

> 本项目为"风景园林 × 软件工程 × AI工程"三段叙事个人履历网站，基于高内聚低耦合架构设计。

---

## 一、规则与流程

### `rules/code_process.md`
**三段叙事求职官网软件工程级落地全流程**。定义7层解耦技术架构（数据层、视觉层、结构层、交互层、资源层、适配层、部署层），规划7个开发阶段：基础工程架构 → TA主题封装 → 数据层解耦 → 时间轴交互 → 页面组装 → 移动端适配 → GitHub Pages部署。每阶段明确AI生成任务、用户校验节点、耦合保障规则，并提供后续扩展维护指引（新增内容/阶段/主题/二级页均无需重构核心代码）。

### `rules/design_process.md`
**精准设计需求传达指引**。将设计需求分为四类（架构级/视觉级/交互级/内容级），规定不同类型需求在7阶段开发流程中的最佳传达时机和落地位置。提供"标准化设计需求包"模板（线框草图+量化参数+参考素材+情绪描述），附避坑指南（禁止模糊词汇、禁止中途改架构规则、优先静态参考图等）和AI辅助校验技巧。

### `rules/响应式前置策略.md`
**响应式前置策略的核心规则**。确立"桌面优先，移动端降级"的适配方向，通过双模结构预留、统一Pointer Events、逻辑断点（>1200px / 768-1200px / <768px）、CSS变量控制，分五个阶段实施：设计令牌与响应式锚点校准（地基层）→ 组件静态度量（骨架层）→ 材质纹理降级（肌理层）→ 交互动效适配（行为层）→ 精细调色微交互（抛光层）。附最终走查清单。

---

## 二、架构设计

### `design/architecture-plan.md`
**架构与模块设计规划v2.0**（基于mainpage_draft.png草图优化）。定义完整目录结构及核心模块：
- **ChinaMap组件**：Canvas渲染三种风格（水彩手绘/像素网格/科技数据流）+ 定位标记 + 连接线
- **ProjectCardsOverlay**：地图居中 + 卡片叠加 + 碰撞检测
- **TimelineController**：拖拽吸附 + 游标动画小人 + 移动端适配
- **ModalController**：缩放弹出模态窗（内联无跳转）
- **ConnectionLine**：波浪线/直线/虚线连接
- **数据结构**：resume.json按阶段分组，每个阶段包含locations→projects

### `.opencode/.omo/drafts/personal-website-solution.md`
**个人履历网站方案草案**（待审批）。包含components拓扑、开放假设（技术栈原生TS、无复杂构建链、CSS变量驱动主题切换、数据驱动等）、发现与决策、Scope IN/OUT（SPA + 三主题 + 时间轴 + 移动端 + GitHub Pages）、11个开放问题（风格/配色/交互参数/移动端/技术栈/SEO等）、详细Todo清单（阶段0至阶段7 + 可选Three.js插件），等待用户批准后写入正式计划文件。

### `.opencode/.omo/plans/personal-website-solution.md`
**个人履历网站工作计划（模板骨架）**。仅含TL;DR、Scope、Verification strategy、Execution strategy等框架结构，内容待填充。

---

## 三、响应式设计

### `design/mobile-responsive-design.md`
**移动端响应式详细设计方案**。基于layout-preview.html实际结构（header 15vh + content 70vh + timeline 15vh），定义桌面端/移动端差异对比表（地图、布局、交互、粒子、材质等11个维度）。实施方案覆盖7个方面：CSS设计令牌与逻辑断点 → 布局结构调整 → 项目信息流组件 → 时间轴响应式 → Pointer Events统一事件模型 → 材质纹理降级（玻璃拟态/SVG滤镜/主题切换）→ 性能优化（懒加载/粒子系统/CSS优化）。附完整JS代码示例和五阶段实施步骤。

### `content-management-demo.md`
**统一内容管理系统演示**。介绍基于mobile-responsive-design.md实现的内容管理方案：
- **ContentManager**：集中管理项目数据和时序数据，API支持增删改查
- **ProjectRenderer/TimelineRenderer**：根据设备类型自动适配渲染（桌面端地图叠加 vs 移动端信息流）
- **同步机制**：单一数据源，内容变更自动同步两端，设备变化自动重渲染
- 示例代码覆盖：更新项目、添加/删除项目、更新时间轴、数据导出导入、设备检测

---

## 四、视觉与交互设计

### `design/visual-details-checklist.md`
**视觉细节与交互确认清单（已预填充）**。基于设计草图和技术方案预先填写了完整方案，供用户逐项确认：
- 中国地图三种渲染风格（水彩手绘/像素网格/科技数据流）的具体参数
- 游标动画小人三个形象（园丁/程序员/机器人）的视觉特征和动画细节
- 项目卡片布局、hover效果（上浮10px + 阴影）、模态窗动画
- 三套主题色彩方案（南法暖色调/街机荧光色/AI冷色调）
- 字体系统（Inter + 思源系列）、移动端适配降级策略
- 参考作品清单和确认清单

### `design/human_check/visual-styles-interaction-form.md`
**视觉风格与交互确认清单（空白模板）**。一个待用户填写的详细表单，覆盖10大方面：中国地图三种渲染风格、游标动画小人、项目卡片、时间轴、头部区域、模态窗、整体色彩方案、字体系统、动画效果、移动端适配。每项提供勾选、填空、选择等交互式填写方式。

### `design/human_check/navigation-layout-guide.md`
**导航结构与布局描述指南（已填充项目信息）**。定义四层次描述法：网页结构确认 → 整体布局结构 → 模块组成与关系 → 视觉细节与交互。已填充本项目实际结构：混合结构（load.html + index.html + about.html），底部时间轴布局（15%-70%-15%），时间轴拖拽切换阶段 + 内联模态窗，并提供从设计到代码的完整映射示例。

### `reuse/navigation-layout-guide - 副本.md`
与 `design/human_check/navigation-layout-guide.md` 内容相同的原始完整版本（未填充项目具体信息，包含更多示例模板和填写指导）。
