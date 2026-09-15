---
slug: personal-website-solution
status: drafting
intent: clear
pending-action: write .omo/plans/personal-website-solution.md
approach: <fill: the approach you intend to plan>
---

# Draft: personal-website-solution

## Components (topology ledger)
<!-- Lock the SHAPE before depth. One row per top-level component that can succeed or fail independently. -->
<!-- id | outcome (one line) | status: active|deferred | evidence path -->
- 静态站点架构 | SPA、无后端、基于 GitHub Pages | active | rules/code_process.md:1
- 三主题视觉管线 | CSS 变量 + data-theme 切换 | active | rules/code_process.md:33
- 时间轴交互 | 底部拖拽轨道、游标吸附、阶段切换 | active | rules/code_process.md:395
- 响应式与降级 | 移动端媒体查询 + 特性检测降级 | active | rules/code_process.md:411
- 数据与视图解耦 | resume.json 驱动内容渲染 | active | rules/code_process.md:193

## Open assumptions (announced defaults)
<!-- Record any default you adopt instead of asking, so the user can veto it at the gate. -->
<!-- assumption | adopted default | rationale | reversible? -->
- 技术栈 | 原生 HTML/CSS/TS（可用 JS），不依赖重型框架 | 参考 rules/code_process.md:29 的轻量解耦与静态部署目标，便于维护与AI友好 | 是（后续可切换框架但需重构）
- 构建与打包 | 无复杂构建链；可选 Vite 或直接静态发布 | 静态托管友好，发布成本低；如需可接入 Vite | 是（可增加打包层但不破坏已有结构）
- 主题切换机制 | 根节点 data-theme 全局切换 | 工程成熟，与现有设计对齐，便于扩展 | 是（可改为状态管理但影响现有架构）
- 布局结构 | 顶部标题/空档 + 中间内容区 + 底部时间轴 | 符合叙事型 UX，移动端友好 | 是（可增加侧边或头部导航但影响交互流）
- 卡片组件统一 | 复用 ResumeCard 组件模板 | 高内聚低耦合，三主题共享逻辑 | 是（可增加变体但需统一基础样式）

## Findings (cited - path:lines)
- 项目提供了 rules/code_process.md 与 rules/design_process.md，分别定义了7阶段开发流程与分阶段设计传达规则，强调高内聚低耦合、工程化 TA 主题管线与移动端降级策略 | code_process.md:1-597, design_process.md:1-260
- 设计与工程解耦：架构级规则需在阶段1锁定；视觉/交互细节在对应阶段前提交；内容级可随时修改 | design_process.md:46-90
- 三套主题候选：南法园林（纸质/莫兰迪）、千禧街机（CRT/像素）、AI未来（磨砂玻璃/金属拉丝），均通过 CSS 变量封装并支持独立切换 | code_process.md:32-35
- 时间轴交互：拖拽游标、阶段自动吸附、触屏适配、移动端降级（热区放大、动画简化） | code_process.md:301-366
- 部署目标：GitHub Pages 静态托管，无后端依赖，可选自定义域名与分析工具 | code_process.md:457-488
- 用户具备设计能力但非专业交互设计师，可提供素材（参考图、草稿）并要求及时反馈画面细节（如纹理、过渡） | 用户初始描述

## Decisions (with rationale)
- 采用原生 HTML/CSS/TS 作为技术栈，结合 Vite（可选）做模块管理与快速刷新，确保与静态部署适配，降低AI生成与后续维护门槛 | 与规则一致、轻量易扩展
- 严格遵循三阶段分层：视觉层（CSS 变量+主题文件）、数据层（JSON）、交互层（TS 工具类），避免逻辑与样式耦合 | 确保可扩展性与维护效率
- 在视觉关键节点使用内联 SVG DataURL 提供纹理与特效，减少外部依赖与加载开销 | 提升性能与一致性
- 规划阶段向用户收集：风格/配色偏好、字体栈、三套主题关键参数、交互敏感度、移动端断点、部署目标与域名、SEO 与分析工具等 | 避免后期返工
- 预留 WebGPU/Three.js 插件插槽，用于页面特效增强（背景粒子、视觉冲击），但确保完全可选与性能降级机制 | 满足用户"类似 three.js 的图像网站"潜力
- 在每个阶段设置 agent-executed QA（浏览器验证、Lighthouse 审计、性能度量、可访问性检查） | 保证质量与可交付性

## Scope IN
- 单页应用（SPA）个人履历展示站点，包含三套可切换主题、底部拖拽时间轴、项目卡片流式展示
- 三阶段叙事主题：风景园林、软件工程、AI 工程，对应南法/千禧/AI 视觉管线
- 移动端响应式与性能降级策略
- 完整的数据驱动内容层（resume.json），支持内容扩展与修改零成本
- 静态部署（GitHub Pages），自定义域名与分析工具接入预留
- 基础性能与 SEO 优化（Lighthouse 100 目标）
- 可选插件插槽：Three.js/WebGPU 特效增强（需用户确认与素材）

## Scope OUT (Must NOT have)
- 后端服务或数据库
- 复杂构建链（禁止 Webpack 复杂配置，建议 Vite 或原生）
- 硬编码主题颜色/纹理到组件（必须通过 CSS 变量）
- 将履历内容写死到 HTML/JS（必须通过 JSON）
- 非必要的重型依赖与动态路由
- 破坏时间轴交互流的多级导航（如顶部菜单主导）

## Open questions
1. 风格与视觉方向：是否坚持"南法/千禧/AI"三套主题？是否需要替换或合并？
2. 配色与字体：三套主题的主色、辅色、强调色与字体栈（中英文）有无偏好？是否提供参考图或色板？
3. 交互与动画：游标拖拽灵敏度、吸附距离、过渡时长、滚动插播是否需要定制参数？
4. 移动端偏好：是否保留视觉细节优先并接受部分降级，还是优先性能？
5. 技术栈取舍：是否坚持原生 HTML/CSS/TS，还是偏好 React/Vue？
6. 构建工具：是否使用 Vite 进行模块管理，或直接原生？
7. SEO 与分析：是否接入 Google Analytics/百度统计？是否提供跟踪 ID？
8. 域名与部署：是否绑定自定义域名？域名注册商与 DNS 提供商？
9. Three.js/WebGPU 插件：是否需要页面特效增强（背景粒子、流体等）？请给出示例或参考链接。
10. 时间轴阶段数量与比例：是否为三阶段等分？是否增加阶段并调整分割比例？

## Approval gate
status: awaiting-approval

**方案摘要（TL;DR）**：
- 目标：构建高可维护、可扩展的叙事型个人履历 SPA，三套视觉主题（南法/千禧/AI），通过底部拖拽时间轴切换，数据驱动内容，移动端友好，静态部署（GitHub Pages），性能与 SEO 优化。
- 技术栈：原生 HTML/CSS/TS，可选 Vite 构建；视觉层用 CSS 变量封装主题，数据层用 JSON，交互层用 TS 工具类（TimelineController）。
- 架构与流程：严格遵循 rules/code_process.md 7 阶段与 rules/design_process.md 分阶段设计传达，确保高内聚低耦合。
- 关键决策点与默认：
  - 技术栈默认原生 TS（可改为框架但需重构）
  - 布局默认“标题+内容区+时间轴”（可增加导航但影响交互流）
  - 主题切换用根节点 data-theme 全局控制（成熟且易扩展）
  - 卡片组件统一模板（高复用与一致性）
  - 预留 Three.js/WebGPU 插槽（可选，需确认与素材）
  - 每阶段均设置 agent-executed QA（Lighthouse、视觉与功能验证）
- 后续动作：本草稿已记录所有发现、决策、默认采纳项与开放问题。如批准，我将：
  1) 将本草稿内容（不含 Todos）与追加的 Todos 一同写入 .opencode/.omo/plans/personal-website-solution.md；
  2) 待您发起 $start-work 后，按阶段分配给 subagent 执行。

**引导性问题（请您依次确认或标注默认可接受）**：
A) 主题与视觉方向：
   - A1. 是否坚持“南法/千禧/AI”三套主题？（默认：坚持）
   - A2. 是否需要提供参考图或色板，以便我直接量化颜色参数？（若您有，请提供）
B) 配色与字体：
   - B1. 三套主题的主色/辅色/强调色是否有偏好？是否允许我给出默认色板供您选择？
   - B2. 中英文字体栈是否有偏好？（默认：无衬线系统字体 + 英文可选衬线用于南法主题）
C) 交互与动画：
   - C1. 游标拖拽灵敏度（1:1 / 1:1.5）、吸附距离（默认 50px）、过渡时长（默认 0.6s）是否需要调整？
   - C2. 是否增加滚动插播、悬停放大、淡入淡出等微交互？（默认保留卡片 hover 上浮）
D) 移动端偏好：
   - D1. 优先视觉细节或性能？（默认：性能优先，启用纹理/阴影降级）
   - D2. 时间轴热区与拖拽灵敏度是否接受默认值（热区 80×60，灵敏度 1.5:1）？
E) 技术栈与构建：
   - E1. 坚持原生 HTML/CSS/TS，还是偏好 React/Vue？（默认：原生 TS）
   - E2. 是否使用 Vite 模块管理？（默认：启用 Vite）
F) SEO 与分析：
   - F1. 是否接入 Google Analytics 或百度统计？（若接入，请提供跟踪 ID）
G) 域名与部署：
   - G1. 是否绑定自定义域名？（若绑定，请提供域名与 DNS 信息）
H) Three.js/WebGPU 插件：
   - H1. 是否需要背景粒子/流体等特效增强？（如需要，请给出示例或参考链接）
I) 时间轴阶段与比例：
   - I1. 是否为三阶段等分？（默认：等分）
   - I2. 是否增加阶段并调整分割比例？（如增加，请给出新阶段说明与期望比例）
   - I3. 时间轴是否需配置默认图标（例如：表情或 SVG）？（默认：使用简单游标图标）
J) 页面结构：
   - J1. 是否保留“顶部标题/空档 + 中间内容区 + 底部时间轴”布局？（默认：保留）
   - J2. 是否需要侧边或顶部导航？（如需要，请说明）
K) 二级页：
   - K1. 是否现在预留项目详情页结构？（默认：后期扩展时再预留）
L) 其他：
   - L1. 请提供您已有的素材文件（图片/参考图/草稿）目录或命名规范，我将据此设计资源层。

**等待您的批准与反馈**：
- 若您对上述默认项和引导性问题完全接受，请回复“批准，按默认执行”，我将立即写入计划文件并等待 $start-work；
- 若有任何偏好或补充，请在对应问题后给出您的选择或素材，我将据此更新草稿并再次等待批准。

---

## Todos
<!-- 后续在此区域追加具体、可执行的待办（路径、验收标准、agent-executed QA、提交规范）。每项待办应能在 1-3 次工具调用内完成。 -->

### 阶段 0：项目初始化与脚本执行
- [待办] 项目基础设置（Vite 项目创建、Git 初始化与 .gitignore）
  - 路径：项目根目录
  - 动作：
    1. 使用 `npm create vite@latest . -- --template vanilla-ts` 初始化 Vite 项目，选择 TypeScript 与原生模板；
    2. 初始化 Git 并写入 `.gitignore`（忽略 node_modules、.opencode、编辑器配置等）；
    3. 在 `.opencode/` 下创建 `.omo/` 文件夹（若尚不存在），用于保存计划文件。
  - 验收标准：
    1. `npm run dev` 可启动本地开发服务器，默认端口正常访问；
    2. `.gitignore` 生效，无关文件不被提交。
  - QA（agent-executed）：
    1. `npm run dev` + 浏览器访问根地址，打印控制台无错误；
    2. `git status` 检查 `.gitignore` 过滤是否正确。
  - 提交规范：`feat: init vite project with ts template and gitignore`

- [待办] 生成计划文件（由 ulw-plan 脚本）
  - 路径：`.opencode/.omo/drafts/`、`.opencode/.omo/plans/`
  - 动作：
    1. 确认脚本已执行并生成骨架；草稿文件已记录发现、决策与开放问题；
    2. 在Approval gate 得到用户批准后，将草稿内容与追加的 Todos 一并写入 `.opencode/.omo/plans/personal-website-solution.md`。
  - 验收标准：
    1. 计划文件存在且包含完整的 TL;DR、阶段、待办与验收；
    2. 草稿与计划文件在审批后同步完成。
  - QA（agent-executed）：读取计划文件，确保关键字段（意图、状态、待办）无缺失。

### 阶段 1：工程架构搭建与基础组件（基于 rules/code_process.md 阶段1）
- [待办] 创建目录结构与空模板文件
  - 路径：`src/`、`public/`、`assets/data/`、`assets/images/garden/`、`assets/images/code/`、`assets/images/ai/`、`src/css/themes/`、`src/js/utils/`、`src/js/components/`、`src/js/pages/`
  - 动作：
    1. 创建对应文件夹与占位文件：`src/css/main.css`、`src/css/themes/garden.css`、`src/css/themes/code.css`、`src/css/themes/ai.css`、`src/js/utils/TimelineController.ts`、`src/js/components/ResumeCard.ts`、`src/js/app.ts`、`assets/data/resume.json`；
    2. 在 `index.html`（或 Vite 的入口）引入全局 CSS 与 JS，添加基础 DOM：`<div id="app" data-theme="garden"></div>` 与主内容容器、时间轴容器；
    3. 在 `app.ts` 中初始化空的事件监听与模块导入。
  - 验收标准：
    1. 目录结构与规则中的 7 阶段架构一致；
    2. 文件引用路径正确，无构建报错。
  - QA（agent-executed）：
    1. 运行 `npm run dev`，检查无构建错误；
    2. 浏览器控制台无 404 资源加载错误。

- [待办] CSS 主题变量与基础样式空模板
  - 路径：`src/css/themes/`、`src/css/main.css`
  - 动作：
    1. 在 `main.css` 写入全局重置、通用布局、响应式媒体查询（含移动端断点）；
    2. 在各主题文件中预留 `[data-theme="..."]` 根变量块（颜色、纹理、阴影、过渡），暂时使用占位符；
    3. 在 `index.html` 中添加临时主题切换逻辑（通过根节点 `data-theme` 手动切换测试）。
  - 验收标准：
    1. 手动修改 `data-theme` 属性后，页面不报错；
    2. CSS 变量被读取且生效（可在控制台测试）。
  - QA（agent-executed）：
    1. 在浏览器控制台运行 `document.documentElement.setAttribute('data-theme', 'code')`，检查无报错；
    2. 使用 `getComputedStyle(document.documentElement).getPropertyValue('--color-bg')` 验证变量生效。

### 阶段 2：三套主题视觉管线（TA 工程化封装，基于 rules/code_process.md 阶段2）
- [待办] 南法园林主题参数与 SVG 纹理
  - 路径：`src/css/themes/garden.css`
  - 动作：
    1. 根据用户提供的参考图/色板，量化颜色变量（`--color-bg`, `--color-text`, `--color-accent`）并写入；
    2. 使用内联 SVG DataURL 生成纸质纹理与噪点，设置透明度与混合模式；
    3. 定义卡片样式（阴影、边框、圆角）与过渡参数；
    4. 确保所有变量仅用于视觉，不控制布局。
  - 验收标准：
    1. 页面主题切换到 garden 时，视觉风格符合参考图；
    2. 纸质纹理均匀叠加，文字对比度满足 WCAG AA（至少 4.5:1）。
  - QA（agent-executed）：
    1. 截图对比参考图；
    2. 使用 Lighthouse 对比度审计，报告无对比度不足。

- [待办] 千禧街机主题参数与 CRT 扫描线
  - 路径：`src/css/themes/code.css`
  - 动作：
    1. 量化色彩变量（像素风格、对比度高）；
    2. 使用内联 SVG 模拟 CRT 扫描线，设置密度与透明度；
    3. 设置卡片 hover 效果（轻微抖动或高亮边缘）；
    4. 保持布局与其他主题一致。
  - 验收标准：同南法主题，风格与参考图一致。
  - QA：同南法主题。

- [待办] AI 未来主题参数与磨砂玻璃/金属拉丝
  - 路径：`src/css/themes/ai.css`
  - 动作：
    1. 量化冷色调与玻璃/金属参数；
    2. 使用 `backdrop-filter: blur(...)` 与内联 SVG 噪点实现磨砂玻璃；
    3. 设置流光边框或微发光效果；
    4. 确保性能（降低模糊半径或仅在桌面端开启）。
  - 验收标准：风格与参考图一致，桌面端流畅。
  - QA：同南法主题 + 移动端降级验证。

### 阶段 3：数据层与通用卡片组件（基于 rules/code_process.md 阶段3）
- [待办] 创建 resume.json 数据结构与示例
  - 路径：`assets/data/resume.json`
  - 动作：
    1. 定义标准结构：`timelineConfig`、`stages` 数组（每阶段含 id、theme、title、description、projects）；
    2. 写入三个阶段的占位内容与示例项目（含 tags、image 路径、link）；
    3. 确保 JSON 格式正确（无 trailing commas 等）。
  - 验收标准：JSON 可被正常解析，字段与模板对应。
  - QA（agent-executed）：运行 `cat assets/data/resume.json | node -e "console.log('Valid JSON')"` 或 `JSON.parse` 检查。

- [待办] ResumeCard 通用组件实现
  - 路径：`src/js/components/ResumeCard.ts`
  - 动作：
    1. 编写 TS 接口描述项目数据（与 JSON 一致）；
    2. 实现 `render(container: HTMLElement, data: ProjectItem): void`，使用模板字符串生成卡片；
    3. 确保卡片仅使用 CSS 变量与通用类，不硬编码主题样式。
  - 验收标准：
    1. 在 `app.ts` 中测试渲染不同主题，卡片样式统一；
    2. 支持图片懒加载（loading="lazy"）与 alt 文本。
  - QA（agent-executed）：浏览器打开，检查卡片渲染正常，控制台无报错。

### 阶段 4：时间轴交互控制器（基于 rules/code_process.md 阶段4）
- [待办] TimelineController.ts 工具类实现
  - 路径：`src/js/utils/TimelineController.ts`
  - 动作：
    1. 定义配置接口（轨道选择器、游标选择器、分割比例、回调）；
    2. 实现拖拽监听（mousedown/touchstart 等），实时更新游标位置；
    3. 实现阶段检测逻辑与自动吸附（到区间中点）；
    4. 触发回调（传入当前阶段 id），外部据此切换主题与内容；
    5. 移动端适配：增大触控热区、降低灵敏度。
  - 验收标准：
    1. 桌面端拖拽与触屏拖拽均流畅；
    2. 吸附距离符合默认或用户指定值；
    3. 无过多事件监听泄漏（移除监听）。
  - QA（agent-executed）：
    1. 在控制台监听阶段切换事件，验证触发时机与阶段 id；
    2. 移动端模拟器测试拖拽热区大小。

### 阶段 5：页面组装与入口逻辑（基于 rules/code_process.md 阶段5）
- [待办] 完善 index.html 与页面结构
  - 路径：`index.html`
  - 动作：
    1. 设置语义化结构：`<header>`（标题）、`<main>`（阶段标题与内容区）、`<footer>`（时间轴）；
    2. 添加 Loading 占位，内容加载完成后隐藏；
    3. 引入所有 JS 与 CSS，确保按需加载。
  - 验收标准：
    1. HTML 可访问性与语义化达标；
    2. 无额外资源 404。
  - QA（agent-executed）：浏览器开发者工具审查元素与网络请求。

- [待办] app.ts 入口逻辑实现
  - 路径：`src/js/app.ts`
  - 动作：
    1. 读取 `resume.json`，初始化 `TimelineController`；
    2. 监听阶段切换回调：更新 `data-theme`、调用 `ResumeCard` 渲染当前阶段项目；
    3. 添加内容切换过渡（淡入淡出）；
    4. 处理初始化加载与错误降级。
  - 验收标准：
    1. 初始加载默认阶段正确；
    2. 切换阶段时主题与内容同步更新，过渡流畅。
  - QA（agent-executed）：浏览器测试所有阶段切换，截图记录。

### 阶段 6：移动端适配与性能降级（基于 rules/code_process.md 阶段6）
- [待办] 媒体查询与移动端布局调整
  - 路径：`src/css/main.css`
  - 动作：
    1. 增加移动端断点（768px、480px），调整时间轴高度与游标大小；
    2. 调整内容区 padding 与卡片间距，避免水平滚动；
    3. 简化多列为单列。
  - 验收标准：移动端与平板端布局正常，无重叠溢出。
  - QA（agent-executed）：Chrome DevTools 设备模拟器测试多种尺寸。

- [待办] 特性检测与性能降级
  - 路径：`src/js/app.ts`、`src/css/main.css`
  - 动作：
    1. 检测 `is-mobile`（通过 UA 或特征），给 `body` 添加类；
    2. 在 CSS 中根据 `body.is-mobile` 关闭高消耗效果（如纹理叠加、阴影模糊）；
    3. 在 JS 中减少过渡时长或关闭部分动画。
  - 验收标准：移动端性能良好，无明显卡顿。
  - QA（agent-executed）：Lighthouse Performance 与 Battery 测试，查看帧率。

### 阶段 7：GitHub Pages 部署与 SEO（基于 rules/code_process.md 阶段7）
- [待办] 部署配置与文档
  - 路径：项目根目录
  - 动作：
    1. 更新 `.gitignore` 确保只提交必要文件；
    2. 创建 `.github/workflows/deploy.yml`（可选）或手动 Pages 设置；
    3. 编写 `DEPLOY.md`，说明仓库初始化、远程关联、Pages 设置、自定义域名（如需要）。
  - 验收标准：
    1. 推送代码后 GitHub Pages 自动构建；
    2. 线上地址可访问，资源正常。
  - QA（agent-executed）：访问线上地址，使用 Lighthouse 审核。

- [待办] SEO 与元数据优化
  - 路径：`index.html`、`public/`
  - 动作：
    1. 设置 `title`、`description`、`keywords`、`open graph` 标签；
    2. 添加 `favicon.ico`；
    3. 开启预渲染（若使用 Vite SSR 插件）或确保静态内容可爬取。
  - 验收标准：Lighthouse SEO 分数 ≥ 95。
  - QA（agent-executed）：Lighthouse SEO 审计报告。

- [待办] 分析工具接入（可选）
  - 路径：`index.html`、`src/js/app.ts`
  - 动作：
    1. 根据用户提供的跟踪 ID，添加 Google Analytics 或百度统计脚本；
    2. 确保隐私政策或弹窗合规。
  - 验收标准：用户可验证事件上报。
  - QA（agent-executed）：控制台网络面板验证脚本加载与请求。

### 可选扩展阶段（Three.js/WebGPU 插件插槽）
- [待办] 插件架构与降级策略
  - 路径：`src/js/plugins/`
  - 动作：
    1. 定义插件接口与初始化协议；
    2. 创建 `ThreeBackgroundPlugin.ts` 占位，实现可选挂载；
    3. 在 `app.ts` 中检测性能支持，仅在桌面端开启。
  - 验收标准：插件不影响主线流程，移动端自动降级。
  - QA（agent-executed）：移动端测试插件未启用，桌面端测试插件初始化与销毁。

---

**注意**：以上待办已在草稿中一次性追加。待用户批准后，我将把草稿与待办一并写入 `.opencode/.omo/plans/personal-website-solution.md`，并等待 $start-work 触发执行。
