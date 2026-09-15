# 架构规格

> 本文档定义项目的**硬性架构约束**。所有开发必须遵守本文档的结构和接口约定。
> 视觉风格相关内容由 `specs/themes.md` 定义。

---

## 1. 网页结构

```
load.html            # 加载页（进站过渡）
index.html           # 核心单页（SPA）
├── 全屏地图背景层（Canvas）         # z-index: 0
│   ├── 中国地图（居中）              # 包含周边地理信息
│   └── 城市标记点                    # 暂定，后续填充具体位置
└── UI 浮动覆盖层                    # z-index: 1
    ├── 头部透明叠底（Header）        # 阶段描述文字
    ├── 左右双面板区域
    │   ├── ConsolePanel（左 28%）    # 控制台：项目导航列表
    │   └── DisplayPanel（右 48%）    # 展示面板：选中项目详情
    ├── 卡尺时间轴（Timeline 7vh）    # 2016.9-2026.7 刻度
    │   ├── 刻度层（年大+月小）       # CaliperTicks
    │   ├── 卡尺滑块游标              # CaliperSlider
    │   └── 阶段分界线                # 2021.9 / 2024.7
    └── 模态窗遮罩（Modal）

about.html           # 简历页
```

---

## 2. 目录结构

```
project/
├── load.html
├── index.html
├── about.html
├── css/
│   ├── main.css              # 全局重置、通用布局、响应式媒体查询
│   ├── components/
│   │   ├── header.css
│   │   ├── china-map.css
│   │   ├── project-card.css
│   │   ├── timeline.css
│   │   └── modal.css
│   └── themes/
│       ├── garden.css        # 南法园林主题（独立封装）
│       ├── code.css          # 千禧街机主题（独立封装）
│       └── ai.css            # AI未来主题（独立封装）
├── js/
│   ├── app.ts                # 应用入口：初始化 + 数据加载 + 事件绑定
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   ├── components/
  │   │   ├── Header.ts
  │   │   ├── ChinaMap.ts       # 核心：中国地图组件（全屏背景层）
  │   │   ├── MapRenderer.ts    # 地图渲染器（三种风格）
  │   │   ├── LocationMarker.ts # 定位标记
  │   │   ├── ConsolePanel.ts   # 新增：左控制台面板
  │   │   ├── DisplayPanel.ts   # 新增：右展示面板
  │   │   ├── ProjectCard.ts    # 项目卡片组件
│   │   ├── ProjectPanel.ts   # 项目面板
│   │   ├── Modal.ts          # 模态窗组件
│   │   └── Timeline.ts       # 时间轴组件
│   ├── utils/
│   │   ├── TimelineController.ts  # 时间轴交互控制器
│   │   ├── ModalController.ts     # 模态窗控制器
│   │   ├── ThemeManager.ts        # 主题管理器
│   │   └── DataLoader.ts          # 数据加载器
│   └── data/
│       └── resumeData.ts          # 数据接口定义
├── assets/
│   ├── data/
│   │   └── resume.json            # 所有履历内容（唯一需频繁修改的文件）
│   ├── images/
│   │   ├── map/                   # 地图素材（三种风格）
│   │   │   ├── garden/            # 水彩手绘风格
│   │   │   ├── code/              # 像素网格风格
│   │   │   └── ai/                # 科技数据流风格
│   │   ├── garden/                # 园林阶段项目图片
│   │   ├── code/                  # 街机阶段项目图片
│   │   ├── ai/                    # AI阶段项目图片
│   │   └── common/                # 通用图片
│   ├── animations/                # 动画资源
│   │   ├── cursor-garden.gif
│   │   ├── cursor-code.gif
│   │   ├── cursor-ai.gif
│   │   └── loading.gif
│   └── svg/                       # SVG资源
│       ├── icons/
│       ├── textures/              # 纹理（纸张、CRT等）
│       └── patterns/
└── favicon.ico
```

---

## 3. 技术分层架构

| 分层 | 技术方案 | 职责 | 解耦约束 |
|------|---------|------|---------|
| **数据层** | 独立 `resume.json` 静态文件 | 存储所有履历内容 | 完全与视觉、交互隔离，不含任何样式/布局代码 |
| **视觉层** | 原生 CSS 变量 + 独立主题 CSS | `[data-theme="xxx"]` 全局切换三套视觉 | 仅定义视觉变量，不参与布局结构控制 |
| **结构层** | 语义化 HTML5 + 独立组件模板 | 通用页面布局、卡片模板 | 不嵌入业务逻辑，仅通过 JS 导入数据渲染 |
| **交互层** | 原生 TypeScript 工具类 | 拖拽时间轴、主题切换、模态窗 | 独立封装，不依赖具体主题与数据结构 |
| **资源层** | WebP/AVIF 压缩静态素材 | 项目配图、主题纹理、图标 | 按阶段分文件夹存储，路径由 JSON 统一管理 |
| **适配层** | CSS 媒体查询 + 特性检测 JS | 移动端布局、高消耗效果降级 | 自动识别设备，按需加载简化版样式 |
| **部署层** | GitHub Pages 静态托管 | 无后端依赖，推送即部署 | 所有资源引用路径适配子目录部署 |

---

## 4. 组件关系图

```
index.html
├── ChinaMap（全屏背景层，Canvas，z-index:0）
│   ├── MapRenderer（渲染器）
│   │   ├── renderGarden()   → 水彩手绘风格
│   │   ├── renderCode()     → 像素网格风格
│   │   └── renderAI()       → 科技数据流风格
│   └── CityMarkers（城市标记点，暂定/待填充）
│
├── Header（透明叠底浮动层）
│
├── ConsolePanel（左侧控制台面板，28%宽）
│   └── 当前阶段项目列表（点击切换右侧展示）
│
├── DisplayPanel（右侧展示面板，48%宽）
│   └── ResumeCard（选中项目完整信息）
│
├── Timeline（卡尺时间轴，底部固定7vh）
│   ├── TimelineController（交互控制器）
│   │   ├── 连续滑动 → 计算年月（2016.9-2026.7）
│   │   ├── 跨越阶段边界 → 触发 setTheme()
│   │   └── 更新 ConsolePanel 项目列表
│   ├── CaliperTicks（刻度渲染：年大刻度 + 月小刻度）
│   ├── CaliperSlider（卡尺滑动块游标）
│   └── StageBoundaries（阶段分界线：2021.9 / 2024.7）
│
└── Modal（模态窗组件）
    ├── ModalController（控制器）
    └── ModalContent（内容渲染）
```

---

## 5. 数据流

```
resume.json  ──加载──→  DataLoader  ──解析──→  app.ts
                                                   │
                    ┌──────────────────────────────┤
                    ▼                              ▼
           TimelineController              ConsolePanel.renderList()
           │                              DisplayPanel.renderProject()
           │                                      │
           ├──[拖动游标]                            │
           │   │                                   │
           │   ├─ 计算当前年月                      │
           │   │  year = 2016.75 + ratio * (2026.58-2016.75)
           │   │                                   │
           │   ├─[跨越阶段边界?]→ setTheme()        │
           │   │  更新的 data-theme 属性            │
           │   │  CSS 变量自动切换主题              │
           │   │                                   │
           │   └─[ConsolePanel] 过滤当前阶段项目     │
           │      显示项目导航列表                   │
           │                                       │
           └──[用户点击左面板项目]                    │
               DisplayPanel.render(project)          │
```

---

## 6. 硬性耦合约束

1. **主题 CSS 不得直接修改布局**：`garden.css` / `code.css` / `ai.css` 仅通过 CSS 变量控制颜色、纹理、阴影、动效，不设置 `width`、`height`、`margin`、`padding`、`position` 等布局属性
2. **JSON 不得包含视觉/布局代码**：`resume.json` 仅存储文本内容、素材路径、配置参数
3. **交互工具类不操作样式**：`TimelineController` 仅通过回调函数向外传递阶段标识，不直接修改 DOM 样式或主题
4. **卡片组件不硬编码主题**：`ResumeCard` 通过父节点 `data-theme` 变量适配不同主题
5. **适配逻辑集中在入口**：所有页面组装逻辑在 `app.ts` 中集中处理，不分散到其他模块
