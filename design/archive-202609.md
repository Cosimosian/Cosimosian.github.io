# 归档：202609 版本规则差异 + 扩展接口与样式解耦评估

> **版本**：202609（2026-09-17 归档）
>
> **定位**：本文档冻结当前实现与框架设计规则（rules/specs/decisions/plans）之间的差异清单，
> 并评估长期演进所需的两类能力：**扩展接口预留**（新增阶段/移动端详细设计）与**样式解耦**（后续风格化调整）。
> 差异经用户确认：不做实现修改、不回写规则文档，仅归档。

---

## 一、202609 规则差异归档

### 1. 经确认演进、规则文档未同步（📝）

| # | 规则出处 | 规则内容 | 202609 现状 |
|---|---|---|---|
| 1 | `specs/architecture.md` §2 | 目录：`css/components/`、`css/themes/`、`js/utils|components|data/`、`assets/data/resume.json` | `css/` 五文件平铺、`js/` 六模块 + `js/map/`、`data/resume.js`、`shared/` |
| 2 | `rules/dev-process.md` 阶段1 | 同上目录结构 | 同上 |
| 3 | `specs/data-schema.md` | `resume.json`（timelineConfig + stages[].locations[].projects[] 嵌套） | `data/resume.js`（STAGES + PROJECTS 平铺，数据仍与代码同层） |
| 4 | `decisions/decision-ledger.md` | 三阶段三主题 | 四主题（新增 future） |
| 5 | `decisions/decision-ledger.md` | 移动端"不做任何改动（固定头+信息流+固定时间轴）" | mobile-gate 屏蔽移动端（"暂时关闭移动端展示"） |
| 6 | `decisions/decision-ledger.md` | 左控制台 28% + 右展示 48% | 左展示 28vw + 右导航 18vw（`specs/responsive.md` 尺寸锁定表为准） |
| 7 | `specs/interaction.md` §4 | 模态窗桌面 60% / 移动 95% / max 80vh | 沉浸式窄边距（100vw-36px、max 1200px、head+article 结构） |
| 8 | `specs/components.md` | TimelineController / ConsolePanel / DisplayPanel / ResumeCard / ModalController / DataLoader | CaliperTimeline / Panels（合并）/ 模板内联 / main.js 函数 / 无 DataLoader |
| 9 | `specs/themes.md` | 仅 garden/code/ai 三主题变量表 | 缺 future 主题变量表（变量已在 tokens.css 落地） |
| 10 | `specs/interaction.md` | 游标为 emoji 小人 GIF | 卡尺滑块（细矩形+三角指示器） |

### 2. 未确认偏离（⚠️，暂不做处理）

| # | 规则出处 | 规则内容 | 202609 现状 |
|---|---|---|---|
| 11 | `interaction.md` §1.2 | 年刻度 12px / 月刻度 6px | 年刻度全高、月刻度下 1/3 高（canvas） |
| 12 | `interaction.md` §1.2 | 阶段分界线虚线 | 实线（ticks 2px + track 2px） |
| 13 | `decision-ledger.md` | 连接线（波浪线连接定位点与卡片） | 未实现（面板布局取代卡片叠加） |
| 14 | `rules/responsive-strategy.md` | 统一 Pointer Events | 地图 hover 用 mousemove/mouseleave（桌面专属） |
| 15 | `rules/responsive-strategy.md` | 逻辑断点 1200/768 两级 | 仅 768 一个断点 |
| 16 | `rules/responsive-strategy.md` | 触摸目标 ≥44×44px | 主题圆点按钮 20×20px |
| 17 | `rules/responsive-strategy.md` | 双模结构预留（Flex + overflow-x） | 绝对定位百分比布局 |
| 18 | `dev-process.md` / `architecture.md` | 交互层 TypeScript | 纯 JS |

### 3. 计划内未完成（⏳，保留延后）

- moscow-plan #2/#13：真实项目内容与配图（picsum 占位）
- moscow-plan #3/#12：`load.html` 进站过渡、`about.html` 简历页
- moscow-plan #19/#20：粒子系统（`--particle-count`）、纹理叠加（`--texture-overlay`）
- moscow-plan #14：SEO 元标签 + favicon
- moscow-plan #21：游标动画 GIF（已被卡尺方案取代，建议废弃）

### 4. 已确认符合项（✅，抽查）

- `specs/responsive.md` 尺寸锁定表与实现完全一致（28vw/18vw/0.38w×0.38h/scale 0.85·900）
- `architecture.md` §6 硬性耦合约束：主题不改布局、卡片不硬编码主题、适配集中入口、回调通信
- `themes.md` 跨主题规则：颜色仅走变量、blur 10px、主题过渡 0.6s
- 时间轴连续滑动无吸附、跨阶段触发主题、边界位置 2021.75/2024.5
- 双端互斥元素基线 `display:none`、`prefers-reduced-motion`
- 模态窗 ESC/遮罩/× 关闭、缩放弹出动画

---

## 二、扩展接口预留评估

### 1. 新增阶段（第 N 阶段）——需动清单

| 类别 | 位置 | 操作 | 数据驱动？ |
|---|---|---|---|
| 数据 | `data/resume.js` STAGES + STAGE_ORDER | 加一条（id/theme/yearStart/yearEnd/shortLabel/description/experiences…）并加入序列表 | ✅ 加内容 |
| 数据 | `data/resume.js` PROJECTS + `data/projects/*.md` | 加项目 + 加图文文档 | ✅ 加内容 |
| 主题 | `css/tokens.css` | 加 `[data-theme="x"]` 变量块（结构有约定） | ✅ 加内容 |
| 地图 | `assets/data/map-style.json` | 加该主题图层组（bg/outline/provinces/rivers/lakes/labels/surrounding/marker） | ✅ 加内容（Maputnik 可编辑） |
| UI | `index.html` 主题按钮 | 加一个 `.panel-theme-dot` | ✅ 加内容 |
| 逻辑 | 阶段检测/边界渲染/经历列表/初始阶段 | **已数据驱动化（202609 当日）**：`_detectStage` 遍历 STAGE_ORDER、边界 DOM 由 `_ensureBoundaryDom` 动态生成（HTML 零硬编码）、`experiences._build` 遍历 STAGE_ORDER、初始阶段取 `STAGE_ORDER[0]` | ✅ 零改动 |

**结论**：新增阶段 = 纯加数据/样式内容，**逻辑层零改动**；唯一 HTML 改动是加一个主题按钮。

### 2. 移动端详细设计——预留状态

| 项 | 状态 |
|---|---|
| 移动端 gate 隔离 | ✅ `mobile-gate.css` 独立文件，桌面/移动互不污染 |
| 地图跳过重绘 | ✅ `drawMap()` 有 `display:none` 检查，移动端零开销 |
| 弹窗适配 | ✅ 窄边距方案天然适配小屏（36px），无需专门媒体查询 |
| 响应式方法论 | ✅ `rules/responsive-strategy.md` 五阶段方法论完整保留 |
| 信息流组件 | ❌ 未实现（gate 替代）；后续需在 `Panels` 加 mobile 渲染分支 |
| 触控目标 | ⚠️ slider 热区 28px 已有；移动端 80×60px 规则未落 |
| 断点体系 | ⚠️ 仅 768 单断点，平板无差异化 |
| 移动端时间轴交互 | ⚠️ Pointer Events 已就绪；`touch-action:none` 已有；横滑布局未做 |

**结论**：移动端是"干净空白区"——桌面端未向移动端泄漏结构，后续详细设计可从零搭建信息流，无需先拆除旧实现。

### 3. 其他扩展点

- **项目图文**：md front matter 任意加键，渲染器按需消费（接口已预留）
- **地图数据**：`assets/data/china-geo-data.js` 可替换为更高精度数据（结构约定 outer/holes/provinces/rivers/lakes）
- **地图风格**：`map-style.json` role 体系可加新 role（渲染器按需消费）
- **调试**：`?debug=1` 开关

---

## 三、样式解耦评估

### 1. 解耦架构

```
风格化调整入口（三处，互不交叉）：
  UI 视觉   → css/tokens.css（四主题变量块；组件 CSS 只引用变量）
  地图风格  → assets/data/map-style.json（按 theme+role 分层；Maputnik 编辑 → 刷新生效）
  项目图文  → data/projects/*.md（front matter + markdown 子集；渲染器消费）

组件 CSS（components/timeline/base/mobile-gate）不感知具体主题，
只引用 var(--xx)；主题变量块之间零交叉依赖。
```

### 2. 残留耦合（风格化调整需注意）

| # | 位置 | 说明 | 影响 |
|---|---|---|---|
| 1 | `css/tokens.css` | `--map-bg/--map-stroke/--map-marker-fill` 为早期遗留变量，地图已改用 style.json | 死变量，可清理 |
| 2 | `js/map/chinaMap.js` | 兜底色 `'#92A87C'`、`'#F5F0E6'`（style.json 缺省时） | 轻微；改地图风格优先走 style.json |
| 3 | `css/mobile-gate.css` | gate 用 `--gate-*` 局部变量固定 code 风格 | 有意为之（gate 是固定提示页） |
| 4 | `data/resume.js` | `SURROUNDING_LABELS` 周边地理标签在数据层（风格层为文字透明度） | 内容/风格边界合理 |

### 3. 风格化调整操作指引

| 目标 | 改哪里 | 生效方式 |
|---|---|---|
| 某主题整体配色/材质 | `css/tokens.css` 对应 `[data-theme]` 块 | 刷新 |
| 某主题地图画法（轮廓/省界/标记） | `map-style.json` 对应 theme 图层 paint | 刷新（http） |
| 项目详情图文 | 对应 `data/projects/<id>.md` | 刷新（http） |
| 新增主题 | tokens.css + map-style.json + 按钮 + 阶段数据 | 见"二、1"清单 |

**结论**：三套（实际四套）阶段样式已**充分解耦**——UI 与地图与内容三层独立，可并行调整；
唯一注意点是清理 #1 死变量与 #2 兜底色。

---

## 附：文档定位

本归档冻结于 202609。后续任一规则差异发生变化（如"新增阶段数据驱动化"完成、
移动端信息流落地、TypeScript 迁移），应新建归档版本（如 202610-xxx.md），
本文件不再修改。
