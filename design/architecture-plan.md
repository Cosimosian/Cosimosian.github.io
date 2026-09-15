# 架构与模块设计规划（基于设计草图与技术方案）

> **版本**：v2.0（结合 mainpage_draft.png 草图优化）
>
> **更新日期**：2025-06-24

---

## 📐 项目整体架构

```
resume-website/
├── load.html                    # 加载页（必须）
├── index.html                   # 核心单页
│   ├── header-section           # 头部区域（阶段特点描述）
│   ├── content-section          # 内容区域
│   │   └── china-map-container  # 中国地图容器（全屏）
│   │       ├── map-canvas       # 地图画布（三种渲染风格）
│   │       ├── location-markers # 定位标识层
│   │       └── project-cards-overlay # 项目卡片叠加层（根据定位点位置绝对定位）
│   ├── timeline-section         # 时间轴区域
│   │   ├── timeline-track       # 轨道
│   │   ├── stage-markers        # 阶段标记
│   │   └── cursor-avatar       # 游标动画小人
│   └── modal-overlay           # 模态窗遮罩
│       └── modal-content       # 模态窗内容
│
├── about.html                   # 简历页
│
├── css/
│   ├── main.css                 # 全局样式、布局、响应式
│   ├── components/
│   │   ├── header.css           # 头部样式
│   │   ├── china-map.css        # 地图样式
│   │   ├── project-card.css     # 卡片样式
│   │   ├── timeline.css         # 时间轴样式
│   │   └── modal.css            # 模态窗样式
│   └── themes/
│       ├── garden.css           # 风景园林主题
│       ├── code.css             # 千禧街机主题
│       └── ai.css               # AI未来主题
│
├── js/
│   ├── app.ts                   # 应用入口
│   ├── types/
│   │   └── index.ts             # TypeScript类型定义
│   ├── components/
│   │   ├── Header.ts            # 头部组件
│   │   ├── ChinaMap.ts          # 中国地图组件（核心）
│   │   │   ├── MapRenderer.ts   # 地图渲染器（三种风格）
│   │   │   ├── LocationMarker.ts # 定位标记
│   │   │   └── ConnectionLine.ts # 连接线（波浪线）
│   │   ├── ProjectCard.ts       # 项目卡片组件
│   │   ├── ProjectPanel.ts      # 项目面板（左/右）
│   │   ├── Modal.ts             # 模态窗组件
│   │   └── Timeline.ts          # 时间轴组件
│   ├── utils/
│   │   ├── TimelineController.ts # 时间轴交互控制器
│   │   ├── ModalController.ts   # 模态窗控制器
│   │   ├── ThemeManager.ts      # 主题管理器
│   │   └── DataLoader.ts        # 数据加载器
│   └── data/
│       └── resumeData.ts        # 数据类型与加载
│
├── assets/
│   ├── data/
│   │   └── resume.json          # 履历数据
│   ├── images/
│   │   ├── map/                 # 地图素材（三种风格）
│   │   │   ├── garden/          # 水彩手绘风格
│   │   │   ├── code/            # 像素网格风格
│   │   │   └── ai/              # 科技数据流风格
│   │   ├── garden/              # 园林阶段图片
│   │   ├── code/                # 街机阶段图片
│   │   ├── ai/                  # AI阶段图片
│   │   └── common/              # 通用图片
│   ├── animations/              # 动画资源
│   │   ├── cursor-garden.gif    # 园林阶段游标动画
│   │   ├── cursor-code.gif      # 街机阶段游标动画
│   │   ├── cursor-ai.gif        # AI阶段游标动画
│   │   └── loading.gif          # 加载动画
│   └── svg/                     # SVG资源
│       ├── icons/               # 图标
│       ├── textures/            # 纹理（纸张、CRT等）
│       └── patterns/            # 图案
│
└── .opencode/
    └── .omo/
        └── plans/
            └── personal-website-solution.md  # 开发计划
```

---

## 🧩 核心模块设计

### 1️⃣ 中国地图组件 - 核心特色组件

```typescript
// ChinaMap.ts
class ChinaMap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentStyle: MapRenderStyle;
  private locations: Location[];
  private connectionLines: ConnectionLine[];

  constructor(container: HTMLElement, style: MapRenderStyle) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.currentStyle = style;
    this.initCanvas();
    this.bindEvents();
  }

  // 渲染地图（核心方法）
  render(style: MapRenderStyle): void {
    this.currentStyle = style;
    this.clearCanvas();
    this.drawMapBase();  // 绘制地图轮廓
    this.drawDecorations();  // 绘制装饰元素（波浪线等）
    this.drawLocations();  // 绘制定位点
    this.drawConnectionLines();  // 绘制连接线
  }

  // 添加定位点
  addLocation(location: Location): void {
    this.locations.push(location);
    this.drawLocationMarker(location);
  }

  // 绘制连接线（波浪线，参考草图）
  drawConnectionLine(from: Location, to: Location): void {
    const line = new ConnectionLine(from, to, 'wavy');
    this.connectionLines.push(line);
    line.draw(this.ctx, this.currentStyle);
  }

  // 清除标记
  clearMarkers(): void {
    this.locations = [];
    this.connectionLines = [];
    this.clearCanvas();
  }

  // 响应式调整
  resize(): void {
    this.initCanvas();
    this.render(this.currentStyle);
  }
}

// 地图渲染风格枚举
enum MapRenderStyle {
  GARDEN = 'garden',  // 水彩手绘风格
  CODE = 'code',      // 像素网格风格
  AI = 'ai'           // 科技数据流风格
}

// 定位点数据结构
interface Location {
  city: string;
  coordinates: { lat: number; lng: number };
  screenPosition: { x: number; y: number };
  projects: Project[];
  markerType: 'star' | 'pin' | 'pixel' | 'dot';
}

// 连接线数据结构
interface ConnectionLine {
  from: Location;
  to: Location;
  style: 'wavy' | 'straight' | 'dashed';
  draw(ctx: CanvasRenderingContext2D, style: MapRenderStyle): void;
}
```

#### 设计要点

**1. 基于草图的布局调整：**
- 草图显示：矩形边框 + 波浪线连接左右两个项目模块
- 新增设计：地图作为背景层，项目卡片分为左右两栏
- 连接线：使用波浪线连接地图定位点和项目卡片

**2. 三种渲染风格实现：**
- **园林阶段（水彩手绘）**：
  - 使用Canvas API绘制手绘风格的地图轮廓
  - 叠加纸张纹理（SVG噪点）
  - 定位标记使用手绘星形（参考草图的★）
  - 连接线使用柔和的波浪线

- **街机阶段（像素网格）**：
  - 地图轮廓像素化处理
  - 背景叠加网格线
  - 定位标记使用像素方块
  - 连接线使用像素风格的虚线

- **AI阶段（科技数据流）**：
  - 地图轮廓使用细线条
  - 定位点之间有数据流动画（粒子）
  - 定位标记使用发光圆点
  - 连接线使用数据流虚线

**3. 地理准确性与视觉表达的平衡：**
- 使用简化的中国地图轮廓（非严格精确）
- 重点表达"经历所在地的感觉"
- 城市定位准确（使用真实经纬度）
- 地形细节简化（根据风格调整）

**4. 项目卡片与地图的关联：**
- 项目卡片分为左右两栏（基于草图）
- 左栏：显示地图左侧项目的卡片
- 右栏：显示地图右侧项目的卡片
- 连接线：连接地图定位点和对应卡片区域

---

### 2️⃣ 项目卡片叠加层 - 地图居中+卡片叠加

```typescript
// ProjectCardsOverlay.ts
class ProjectCardsOverlay {
  private container: HTMLElement;
  private cards: Map<string, ProjectCard>; // 按项目ID存储卡片
  private map: ChinaMap;

  constructor(container: HTMLElement, map: ChinaMap) {
    this.container = container;
    this.cards = new Map();
    this.map = map;
    this.initLayout();
  }

  // 初始化布局（地图居中，卡片叠加）
  private initLayout(): void {
    this.container.className = 'project-cards-overlay';
    this.container.style.position = 'absolute';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.pointerEvents = 'none'; // 让鼠标穿透到地图
  }

  // 根据定位点位置渲染项目卡片
  renderProjects(projects: Project[]): void {
    this.clear();

    projects.forEach(project => {
      const card = new ProjectCard(project);
      const position = this.map.getMarkerPosition(project.location);
      card.setPosition(position.x, position.y);
      this.cards.set(project.id, card);
      this.container.appendChild(card.render());
    });

    // 碰撞检测，确保卡片不互相遮挡
    this.resolveCollisions();
  }

  // 碰撞检测与解决
  private resolveCollisions(): void {
    const cardArray = Array.from(this.cards.values());
    
    for (let i = 0; i < cardArray.length; i++) {
      for (let j = i + 1; j < cardArray.length; j++) {
        const card1 = cardArray[i];
        const card2 = cardArray[j];
        
        if (this.isColliding(card1, card2)) {
          // 调整位置，避免遮挡
          this.adjustPosition(card1, card2);
        }
      }
    }
  }

  // 碰撞检测
  private isColliding(card1: ProjectCard, card2: ProjectCard): boolean {
    const rect1 = card1.getBoundingClientRect();
    const rect2 = card2.getBoundingClientRect();
    
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
  }

  // 调整位置（向上下偏移）
  private adjustPosition(card1: ProjectCard, card2: ProjectCard): void {
    // 如果卡片1在卡片2的上方，向上偏移
    if (card1.y < card2.y) {
      card1.offsetBy(0, -20); // 向上偏移20px
    } else {
      card2.offsetBy(0, 20); // 向下偏移20px
    }
  }

  // 清空卡片
  clear(): void {
    this.cards.clear();
    this.container.innerHTML = '';
  }
}
```

#### 设计要点（地图居中+卡片叠加）

**1. 地图居中布局：**
- 地图占据整个内容区域
- 地图在容器中居中显示
- 项目卡片作为叠加层

**2. 卡片叠加逻辑：**
- 每个卡片根据定位点的经纬度计算屏幕位置
- 使用绝对定位放置卡片
- 卡片pointer-events: auto，可以交互
- 容器pointer-events: none，可以操作地图

**3. 卡片内容（每个卡片都有图片）：**
```
项目卡片结构：
┌─────────────────┐
│  [项目图片]     │
│  ┌───────────┐ │
│  │ 300×200px │ │
│  └───────────┘ │
│                 │
│  项目标题        │
│  项目描述        │
│  [标签][标签]   │
│  📍 地点 · 时间  │
└─────────────────┘
```

**4. 不互相遮挡的方案：**
- 碰撞检测：实时检测卡片是否重叠
- 动态调整：自动调整卡片位置
- 偏移方向：优先上下偏移，避免水平冲突
- 最小间距：确保卡片之间至少有10px间距

**5. 交互逻辑：**
- 鼠标悬停：卡片放大（z-index提升）
- 点击卡片：弹出模态窗显示详情
- 默认状态：卡片稍微缩小，避免遮挡

---

### 3️⃣ 时间轴交互控制器 - 保持原有设计

```typescript
// TimelineController.ts
class TimelineController {
  private track: HTMLElement;
  private cursor: HTMLElement;
  private currentStage: Stage;
  private dragState: DragState;
  private cursorAvatars: Map<Stage, string>;

  // 核心：拖拽控制
  initDraggableCursor(): void {
    this.track.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  // 核心：阶段检测与吸附
  detectStage(cursorPosition: number): Stage {
    const stageWidth = this.track.offsetWidth / 3;
    if (cursorPosition < stageWidth) return 'garden';
    if (cursorPosition < stageWidth * 2) return 'code';
    return 'ai';
  }

  snapToStage(stage: Stage): void {
    const targetX = this.getStageCenter(stage);
    this.animateCursorTo(targetX);
    this.triggerStageChange(stage);
  }

  // 游标动画小人切换
  updateCursorAvatar(stage: Stage): void {
    const avatarUrl = this.cursorAvatars.get(stage);
    this.cursor.style.backgroundImage = `url(${avatarUrl})`;
  }

  // 移动端适配
  adaptForMobile(): void {
    // 扩大触控热区
    this.cursor.style.touchAction = 'none';
    // 降低拖拽灵敏度
    this.dragSensitivity = 1.5;
    // 禁用缩放动画
    this.enableScaleAnimation = false;
  }
}
```

#### 设计要点

**保持原有设计：**
- 拖拽吸附机制
- 游标动画小人（3个不同形象）
- 阶段标记（后期可扩展）
- 移动端触控优化

---

### 4️⃣ 模态窗控制器 - 保持原有设计

```typescript
// ModalController.ts
class ModalController {
  private overlay: HTMLElement;
  private content: HTMLElement;
  private currentProject: Project | null;

  open(projectId: string): void {
    const project = this.loadProject(projectId);
    this.currentProject = project;
    this.renderContent(project);
    this.overlay.classList.add('active');
  }

  close(): void {
    this.overlay.classList.remove('active');
    this.currentProject = null;
  }

  bindEscapeKey(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  bindBackdropClick(): void {
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
  }
}
```

#### 设计要点

**保持原有设计：**
- 内联弹窗（无跳转）
- ESC键关闭
- 点击背景关闭
- 缩放弹出动画
- 半透明遮罩

---

### 5️⃣ 连接线组件 - 新增（基于草图）

```typescript
// ConnectionLine.ts
class ConnectionLine {
  private from: Point;
  private to: Point;
  private style: 'wavy' | 'straight' | 'dashed';
  private amplitude: number;
  private frequency: number;

  constructor(from: Point, to: Point, style: 'wavy' | 'straight' | 'dashed') {
    this.from = from;
    this.to = to;
    this.style = style;
    this.amplitude = 10;  // 波浪幅度
    this.frequency = 0.02;  // 波浪频率
  }

  draw(ctx: CanvasRenderingContext2D, mapStyle: MapRenderStyle): void {
    ctx.beginPath();

    if (this.style === 'wavy') {
      this.drawWavyLine(ctx);
    } else if (this.style === 'straight') {
      this.drawStraightLine(ctx);
    } else if (this.style === 'dashed') {
      this.drawDashedLine(ctx);
    }

    // 应用主题颜色
    ctx.strokeStyle = this.getColor(mapStyle);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private drawWavyLine(ctx: CanvasRenderingContext2D): void {
    // 绘制波浪线
    const dx = this.to.x - this.from.x;
    const dy = this.to.y - this.from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(distance / 2);

    ctx.moveTo(this.from.x, this.from.y);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = this.from.x + dx * t;
      const y = this.from.y + dy * t + Math.sin(t * distance * this.frequency) * this.amplitude;
      ctx.lineTo(x, y);
    }
  }

  private getColor(style: MapRenderStyle): string {
    switch (style) {
      case 'garden': return '#92A87C';  // 苔藓绿
      case 'code': return '#00ffcc';   // 荧光绿
      case 'ai': return '#00d9ff';     // 赛博蓝
      default: return '#666666';
    }
  }
}
```

#### 设计要点（基于草图）

**1. 波浪线效果：**
- 参考草图中的连接线设计
- 使用正弦波实现波浪效果
- 幅度和频率可调整

**2. 不同主题的连接线：**
- 园林阶段：柔和的波浪线（棕色）
- 街机阶段：像素化虚线（荧光绿）
- AI阶段：数据流虚线（赛博蓝）

---

## 📊 数据结构设计

```typescript
// resume.json
{
  "stages": [
    {
      "id": "garden",
      "theme": "garden",
      "title": "阶段一｜风景园林学习",
      "description": "读懂季节，读懂种子，用线条描摹下午三点钟阴影的移动",
      "mapStyle": "garden",
      "cursorAvatar": "/assets/animations/cursor-garden.gif",
      "locations": [
        {
          "city": "西安",
          "coordinates": { "lat": 34.3416, "lng": 108.9398 },

          "projects": [
            {
              "id": "project-1",
              "title": "乡村花境方案设计",
              "image": "/assets/images/garden/project1.jpg",
              "tags": ["手绘", "场地规划"],
              "description": "以南法乡村庭院为基底，运用自然曲线构图...",
              "date": "2020-03"
            }
          ]
        },
        {
          "city": "深圳",
          "coordinates": { "lat": 22.5431, "lng": 114.0579 },

          "projects": [
            {
              "id": "project-2",
              "title": "城市公园改造",
              "image": "/assets/images/garden/project2.jpg",
              "tags": ["城市设计", "生态修复"],
              "description": "深圳某城市公园的生态化改造...",
              "date": "2021-06"
            }
          ]
        }
      ]
    },
    {
      "id": "code",
      "theme": "code",
      "title": "阶段二｜千禧街机学习",
      "description": "读懂逻辑，读懂代码，用键盘敲击凌晨三点半程序的运行",
      "mapStyle": "code",
      "cursorAvatar": "/assets/animations/cursor-code.gif",
      "locations": [/* 同上结构 */]
    },
    {
      "id": "ai",
      "theme": "ai",
      "title": "阶段三｜AI未来从业",
      "description": "读懂数据，读懂智能，用算法模拟未来三秒钟世界的重构",
      "mapStyle": "ai",
      "cursorAvatar": "/assets/animations/cursor-ai.gif",
      "locations": [/* 同上结构 */]
    }
  ]
}
```

---

## 🎨 组件关系图

```
index.html
├── Header (标题组件)
│   └── 显示阶段描述
│
├── ContentSection
│   └── ChinaMap (地图组件)
│       ├── MapRenderer (渲染器)
│       │   ├── renderGarden()  // 水彩手绘风格
│       │   ├── renderCode()    // 像素网格风格
│       │   └── renderAI()      // 科技数据流风格
│       ├── LocationMarker (定位标记)
│       ├── ConnectionLine (连接线)
│       └── ProjectCardsOverlay (项目卡片叠加层)
│           └── ProjectCard[] (根据定位点位置绝对定位)
│
├── Timeline (时间轴组件)
│   ├── TimelineController (交互控制器)
│   ├── StageMarkers (阶段标记)
│   └── CursorAvatar (游标动画小人)
│
└── Modal (模态窗组件)
    ├── ModalController (控制器)
    └── ModalContent (内容)
```

---

## 🔧 技术实现要点

### 1. 中国地图的三种渲染实现

**方案A：使用第三方地图库（推荐）**
- Leaflet.js（轻量，2D地图）
- D3.js（数据可视化，可自定义渲染）
- Three.js（3D效果，可选）

**方案B：纯Canvas绘制**
- 优点：完全自定义，无依赖
- 缺点：开发量大，需要手动处理坐标转换

**推荐方案：D3.js**
- 支持自定义SVG渲染
- 地理投影功能完善
- 可轻松实现三种渲染风格

### 2. 项目卡片的动态定位

```typescript
// 根据定位点坐标计算卡片位置
function calculateCardPosition(coordinates: { lat: number; lng: number }, map: ChinaMap): { x: number; y: number } {
  const markerPosition = map.coordinatesToScreen(coordinates);
  
  // 卡片在定位点右侧显示
  return {
    x: markerPosition.x + 30,  // 向右偏移30px
    y: markerPosition.y - 50   // 向上偏移50px，卡片顶部对齐
  };
}

// 碰撞检测与位置调整
function resolveCardCollisions(cards: ProjectCard[]): void {
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (isColliding(cards[i], cards[j])) {
        adjustCardPosition(cards[i], cards[j]);
      }
    }
  }
}
```

### 3. 地图居中与卡片叠加

```typescript
// 地图居中显示
function centerMap(map: ChinaMap): void {
  const container = map.getContainer();
  const mapSize = map.getSize();
  
  // 设置地图居中
  map.setView({
    x: (container.width - mapSize.width) / 2,
    y: (container.height - mapSize.height) / 2
  });
}

// 卡片叠加在地图上
function overlayCards(map: ChinaMap, cards: ProjectCard[]): void {
  const overlay = document.querySelector('.project-cards-overlay');
  
  cards.forEach(card => {
    const position = calculateCardPosition(card.location, map);
    card.setPosition(position.x, position.y);
    overlay.appendChild(card.element);
  });
  
  resolveCardCollisions(cards);
}
```

---

## 📱 响应式设计

### 桌面端（> 768px）
- 双栏布局
- 地图完整显示
- 连接线正常显示

### 平板端（481px - 768px）
- 保持双栏布局
- 地图缩放（70%）
- 连接线简化

### 移动端（<= 480px）
- 改为单栏布局
- 地图隐藏或简化
- 取消连接线
- 卡片垂直排列

---

## ✅ 架构优势

1. **高内聚低耦合**：每个组件独立封装，易于维护
2. **可扩展性强**：轻松添加新的渲染风格、新的阶段
3. **数据驱动**：所有内容来自JSON，无需修改代码
4. **响应式设计**：自动适配不同设备
5. **性能优化**：Canvas渲染、懒加载、缓存策略

---

## 🚀 下一步行动

**已完成：**
- ✅ 基于草图分析优化架构
- ✅ 重新设计组件关系（增加连接线、左右面板）
- ✅ 完善数据结构
- ✅ 创建视觉细节确认文档

**待确认：**
- ⏳ 您确认架构设计
- ⏳ 您确认视觉细节文档
- ⏳ 开始实现

---

**请您检查：**
1. 架构设计是否符合您的想法？
2. 基于草图的双栏布局是否接受？
3. 中国地图的三种渲染风格是否清晰？
4. 连接线的设计是否符合草图预期？

**确认后，我将立即开始实现！** 🎯