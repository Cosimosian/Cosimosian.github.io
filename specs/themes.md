# 三套主题 CSS 变量参考

> **说明**：标记 `💡` 的值为 AI 提案，尚未经用户确认。标记 `✅` 的为已确认规则。空白 `___` 待后续填充。
>
> 所有主题通过 `[data-theme="garden|code|ai"]` 选择器挂载，统一通过 CSS 变量控制。
>
> 硬性约束：主题 CSS 不得直接修改布局属性（width/height/margin/padding/position）。

---

## 通用变量结构（每套主题必须定义）

```css
[data-theme="xxx"] {
  /* 基础色彩 */
  --color-bg: ___;           /* 主背景色 */
  --color-text: ___;         /* 主文字色 */
  --color-accent: ___;       /* 强调色 */
  --color-secondary: ___;    /* 辅助色 */
  --color-tag-bg: ___;       /* 标签背景色 */
  --color-border: ___;       /* 边框色 */
  --color-shadow: ___;       /* 阴影色 */

  /* 材质纹理 */
  --texture-overlay: ___;    /* 纹理叠加（内联SVG DataURL或none） */
  --texture-opacity: ___;    /* 纹理透明度 */
  --blur-amount: ___;        /* 玻璃拟态模糊半径 */

  /* 面板样式（透明叠底） */
  --panel-opacity: ___;      /* 面板背景透明度 */
  --panel-border: ___;       /* 面板边框（细线，颜色+样式） */
  --panel-text-shadow: ___;  /* 面板文字阴影（保证地图背景上可读） */

  /* 地图背景 */
  --map-bg-color: ___;       /* 地图底色（卡片遮挡区域显示） */

  /* 动效 */
  --transition-theme: ___;   /* 主题切换过渡（duration + easing） */
  --transition-hover: ___;   /* hover 过渡 */
  --hover-lift: ___;         /* hover 上浮距离 */

  /* 字体 */
  --font-heading: ___;       /* 标题字体栈 */
  --font-body: ___;          /* 正文字体栈 */
  --fs-title: ___;           /* 标题字号（建议 clamp()） */
  --fs-body: ___;            /* 正文字号 */
  --fs-small: ___;           /* 小字号（标签/时间） */

  /* 粒子 */
  --particle-count: ___;     /* Canvas粒子数量 */

  /* 卡尺时间轴 */
  --caliper-track-color: ___;   /* 轨道线颜色 */
  --caliper-tick-color: ___;    /* 刻度线颜色 */
  --caliper-slider-bg: ___;     /* 滑块填充色 */
  --caliper-slider-border: ___; /* 滑块边框 */
  --stage-boundary-color: ___;  /* 阶段分界线颜色 */
}
```

---

## 主题 1：南法园林（`[data-theme="garden"]`）

### 色彩
```css
--color-bg:            💡 #F5F0E6       /* 旧纸张米白 */
--color-text:          💡 #3C3228       /* 深棕灰色 */
--color-accent:        💡 #92A87C       /* 苔藓绿，低饱和莫兰迪 */
--color-secondary:     ___              /* 辅色：___ */
--color-tag-bg:        💡 #E8E3D9       /* 浅棕色 */
--color-border:        💡 #D4CFC4       /* 深米色 */
--color-shadow:        💡 rgba(92,72,52,0.12)
```

### 材质
```css
--texture-overlay:     💡 内联SVG纸质噪点
--texture-opacity:     💡 15%
--blur-amount:         ✅ 桌面端10px / 移动端0px
```

### 卡片
```css
--card-radius:         💡 16px
--card-shadow:         💡 0 8px 24px rgba(92,72,52,0.12)
--card-bg:             ___              /* ___ */
```

### 动效
```css
--transition-theme:    💡 0.6s cubic-bezier(0.22, 1, 0.36, 1)
--transition-hover:    ___              /* ___ */
--hover-lift:          💡 10px
```

### 字体
```css
--font-heading:        💡 "Playfair Display", "思源宋体", "Noto Serif SC", serif
--font-body:           💡 "Inter", "思源黑体", "Noto Sans SC", sans-serif
--fs-title:            ✅ clamp(2rem, 8vw, 4.5rem)
--fs-body:             ___              /* ___ */
--fs-small:            ___              /* ___ */
```

### 粒子
```css
--particle-count:      ✅ 桌面400 / 平板250 / 手机150
```

### 地图渲染
| 属性 | 值 |
|------|-----|
| 风格 | 💡 水彩手绘 |
| 地图边界 | 💡 手绘风格（非严格地理投影） |
| 定位标记 | 💡 手绘星形 ★（带呼吸动画） |
| 连接线 | 💡 柔和波浪线，颜色 `#92A87C` |
| 装饰 | 💡 简化河流/山脉（手绘线条） |

### 游标
| 属性 | 值 |
|------|-----|
| 形象 | 💡 园丁（拿喷壶/园艺工具） |
| 动画 | 💡 轻松行走，循环2s |
| 服装 | 💡 T恤 + 围裙 |
| 表情 | 💡 温和微笑 |
| 尺寸 | 💡 40×40px，拖拽放大1.2倍 |

### 情绪叙事（AI提案）
> 💡 "在花园树荫里翻旧杂志"的松弛感。光线是漫反射的，材质肌理粗糙自然，阴影过渡非常柔和。色温偏暖，午后3点柔光。

---

## 主题 2：千禧街机（`[data-theme="code"]`）

### 色彩
```css
--color-bg:            💡 #1a1a2e       /* 深蓝色 */
--color-text:          💡 #EAEAEA       /* 浅灰色 */
--color-accent:        💡 #00ffcc       /* 荧光绿，高对比 */
--color-secondary:     ___              /* 辅色：___ */
--color-tag-bg:        💡 #16213e       /* 深蓝 */
--color-border:        💡 rgba(0,255,204,0.3)
--color-shadow:        💡 rgba(0,255,204,0.3)
```

### 材质
```css
--texture-overlay:     💡 内联SVG CRT扫描线
--texture-opacity:     💡 8%（扫描线密度15px）
--blur-amount:         ✅ 桌面端5px / 移动端0px
```

### 卡片
```css
--card-radius:         ___              /* ___ */
--card-shadow:         ___              /* ___ */
--card-bg:             ___              /* ___ */
```

### 动效
```css
--transition-theme:    ___              /* ___ */
--transition-hover:    ___              /* ___ */
--hover-lift:          ___              /* ___ */
```

### 字体
```css
--font-heading:        💡 "Inter", "思源黑体", "Noto Sans SC", sans-serif
--font-body:           💡 "Inter", "思源黑体", "Noto Sans SC", sans-serif
--fs-title:            ___              /* ___ */
--fs-body:             ___              /* ___ */
--fs-small:            ___              /* ___ */
```

### 粒子
```css
--particle-count:      ✅ 桌面250 / 移动端150
```

### 地图渲染
| 属性 | 值 |
|------|-----|
| 风格 | 💡 像素网格 |
| 地图边界 | 💡 块状像素化处理 |
| 背景 | 💡 淡色网格线（透明度5%） |
| 定位标记 | 💡 8-bit像素方块（发光） |
| 连接线 | 💡 像素风格虚线，颜色 `#00ffcc` |
| CRT效果 | 💡 扫描线覆盖全地图 |

### 游标
| 属性 | 值 |
|------|-----|
| 形象 | 💡 程序员（戴耳机/敲键盘） |
| 动画 | 💡 跳跃动作（致敬像素游戏），循环1.5s |
| 服装 | 💡 衬衫 + 领带 |
| 表情 | 💡 专注或微笑 |
| 尺寸 | 💡 40×40px，拖拽放大1.2倍 |

### 情绪叙事（AI提案）
> 💡 "老显示器通电后荧光粉发光"的视觉效果。扫描线淡灰色半透明，边缘轻微几何失真。高对比度，荧光色为主。

---

## 主题 3：AI未来（`[data-theme="ai"]`）

### 色彩
```css
--color-bg:            💡 #0a0a0a       /* 深黑色 */
--color-text:          💡 #E0E0E0       /* 灰白色 */
--color-accent:        💡 #00d9ff       /* 赛博蓝，科技感 */
--color-secondary:     ___              /* 辅色：___ */
--color-tag-bg:        💡 #1a1a1a       /* 深灰 */
--color-border:        💡 rgba(0,217,255,0.3)
--color-shadow:        💡 rgba(0,217,255,0.4)
```

### 材质
```css
--texture-overlay:     💡 内联SVG噪点（磨砂玻璃）
--texture-opacity:     ___              /* ___ */
--blur-amount:         ✅ 桌面端12px / 移动端0px
```

### 卡片
```css
--card-radius:         ___              /* ___ */
--card-shadow:         ___              /* ___ */
--card-bg:             ___              /* ___ */
```

### 动效
```css
--transition-theme:    ___              /* ___ */
--transition-hover:    ___              /* ___ */
--hover-lift:          ___              /* ___ */
```

### 字体
```css
--font-heading:        💡 "Inter", "思源黑体", "Noto Sans SC", sans-serif
--font-body:           💡 "Inter", "思源黑体", "Noto Sans SC", sans-serif
--fs-title:            ___              /* ___ */
--fs-body:             ___              /* ___ */
--fs-small:            ___              /* ___ */
```

### 粒子
```css
--particle-count:      ___              /* 桌面端待定 / 移动端降级 */
```

### 地图渲染
| 属性 | 值 |
|------|-----|
| 风格 | 💡 科技数据流 |
| 地图边界 | 💡 细线条描边 |
| 背景 | 💡 流动粒子效果 |
| 定位标记 | 💡 发光圆点（脉冲动画） |
| 连接线 | 💡 数据流虚线 + 粒子流动，颜色 `#00d9ff` |
| 霓虹效果 | 💡 发光线条边框 |

### 游标
| 属性 | 值 |
|------|-----|
| 形象 | 💡 机器人/数据人物（带发光元素） |
| 动画 | 💡 扫描动作（头部左右转动），循环3s |
| 服装 | 💡 未来感（发光线条） |
| 表情 | 💡 平静或眨眼 |
| 尺寸 | 💡 40×40px，拖拽放大1.2倍 |

### 情绪叙事（AI提案）
> 💡 "低温金属上的凝露"科技感。玻璃拟态模糊半径12px，很细的高亮反光边。冷色调，霓虹蓝为主。

---

## 跨主题通用规则

### 必须遵守
1. 所有颜色仅通过 CSS 变量使用，不得在组件中硬编码色值
2. 纹理资源使用内联 SVG DataURL，减少外部 HTTP 请求
3. 粒子数量必须通过 `getComputedStyle` 读取 `--particle-count` 变量动态控制
4. 所有过渡动效统一使用 `--transition-theme` 变量

### 移动端降级（自动生效）
- `--blur-amount: 0px`（关闭模糊）
- `--particle-count` 降低至移动端数值
- `--texture-overlay: none`（关闭纹理叠加，可选）
- 动画时长减半
