# 素材资源规范

> 本文档定义项目中所有素材资源（图片、SVG、动画）的格式、尺寸、命名和存放路径要求。

---

## 1. 图片格式

| 类型 | 格式 | 压缩要求 | 说明 |
|------|------|---------|------|
| 项目配图 | WebP（优先）/ JPG（兜底） | 质量80%，最长边≤1200px | 保留原始分辨率副本 |
| 地图素材 | PNG（透明背景需要） / SVG（矢量优先） | 无损压缩 | 每种风格独立文件夹 |
| 图标 | SVG | 压缩优化 | 内联或独立文件 |
| 纹理 | SVG DataURL（优先） / PNG | 最小化体积 | 优先内联到CSS减少HTTP请求 |
| 动画 | GIF / APNG / Lottie | 控制 ≤ 500KB | 游标动画小人 |

---

## 2. 图片尺寸

| 用途 | 桌面端 | 移动端 | 宽高比 |
|------|--------|--------|--------|
| 项目卡片配图（叠加层） | 280×120px | - | ~2.33:1 |
| 项目卡片配图（信息流） | - | 320×200px | 1.6:1 |
| 模态窗大图 | 宽度100%，最大高度400px | 同左 | 自适应 |
| 游标动画小人 | 40×40px | 40×40px | 1:1 |

---

## 3. 文件命名规范

```
项目配图：   {stage}-{project-number}.webp     → garden-1.webp, code-3.webp
移动端配图： {stage}-{project-number}-mobile.webp → garden-1-mobile.webp
地图素材：   {stage}-map.{svg|png}              → garden-map.svg
纹理素材：   {stage}-texture.{svg|png}          → garden-texture.svg
游标动画：   cursor-{stage}.gif                 → cursor-garden.gif
图标：       icon-{name}.svg                    → icon-close.svg
加载动画：   loading.gif
```

---

## 4. 存放路径

```
assets/
├── data/
│   └── resume.json              # 履历数据（唯一频繁修改的文件）
│
├── images/
│   ├── map/                     # 地图素材（三种风格）
│   │   ├── garden/
│   │   │   └── garden-map.svg   # 水彩手绘风格地图
│   │   ├── code/
│   │   │   └── code-map.png     # 像素网格风格地图
│   │   └── ai/
│   │       └── ai-map.svg       # 科技数据流风格地图
│   │
│   ├── garden/                  # 园林阶段项目图片
│   │   ├── garden-1.webp
│   │   ├── garden-1-mobile.webp
│   │   └── ...
│   ├── code/                    # 街机阶段项目图片
│   │   ├── code-1.webp
│   │   ├── code-1-mobile.webp
│   │   └── ...
│   ├── ai/                      # AI阶段项目图片
│   │   ├── ai-1.webp
│   │   ├── ai-1-mobile.webp
│   │   └── ...
│   └── common/                  # 通用图片
│
├── animations/                  # 动画资源
│   ├── cursor-garden.gif
│   ├── cursor-code.gif
│   ├── cursor-ai.gif
│   └── loading.gif
│
└── svg/                         # SVG资源
    ├── icons/                   # 图标（关闭、返回等）
    ├── textures/                # 纹理（纸张噪点、CRT扫描线等）
    └── patterns/                # 图案
```

---

## 5. 当前素材状态

| 资源 | 状态 | 备注 |
|------|------|------|
| 项目配图 | ⏳ 待用户提供 | 需按阶段整理 |
| 中国地图SVG | ✅ 已有 | `china-map.svg`（根目录，需迁移到 `assets/images/map/`） |
| 游标动画小人 | ⏳ 待制作 | 三个阶段的GIF动画 |
| 地图纹理（三种风格） | ⏳ 待制作 | 水彩纸张 / CRT扫描线 / 磨砂玻璃 |
| 加载动画 | ⏳ 待制作 | `loading.gif` |
| 设计草图 | ✅ 已有 | `design/mainpage_draft.png` |

---

## 6. 图片引用方式

在 `resume.json` 中，图片通过相对路径引用：

```json
{
  "image": "/assets/images/garden/garden-1.webp",
  "mobileImage": "/assets/images/garden/garden-1-mobile.webp"
}
```

CSS 中的纹理优先使用内联 SVG DataURL，减少外部 HTTP 请求：

```css
[data-theme="garden"] {
  --texture-overlay: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'...%3E%3C/svg%3E");
}
```
