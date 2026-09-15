# Resume JSON 数据模式

> 本文档定义 `resume.json` 的完整字段规范。所有内容数据必须遵循此结构。
> 这是唯一需要频繁修改的文件。修改 JSON 后刷新页面即可生效，无需改动 HTML/CSS/JS。

---

## 顶层结构

```json
{
  "timelineConfig": { ... },
  "stages": [ ... ]
}
```

---

## timelineConfig（时间轴配置）

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `dragCursorIcon` | `string` | 是 | 默认游标图标（表情/URL） | `"default"` |
| `stageSplitRatio` | `number[]` | 是 | 阶段分割比例，和必须为1 | `[0.333, 0.666]`（三等分） |

```json
{
  "timelineConfig": {
    "dragCursorIcon": "default",
    "stageSplitRatio": [0.333, 0.666]
  }
}
```

---

## stages[]（阶段数组）

每个阶段是一个人生/职业阶段，包含时间轴上的一个区间。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | 是 | 阶段唯一标识（如 `"garden"`） |
| `theme` | `string` | 是 | 对应CSS主题名（`"garden"` / `"code"` / `"ai"`） |
| `title` | `string` | 是 | 阶段完整标题 |
| `description` | `string` | 是 | 阶段描述（头部区域显示的诗意文字） |
| `yearStart` | `number` | 是 | 阶段起始年月（`2016.75` = 2016年9月） |
| `yearEnd` | `number` | 是 | 阶段结束年月（`2021.75` = 2021年9月） |
| `icon` | `string` | 否 | 阶段图标（表情符号） |
| `color` | `string` | 否 | 阶段主题色（用于时间轴分区背景） |
| `mapStyle` | `string` | 否 | 地图渲染风格（`"garden"` / `"code"` / `"ai"`，默认同theme） |
| `cursorAvatar` | `string` | 否 | 游标动画资源路径（默认按theme自动选择） |
| `locations` | `Location[]` | 是 | 该阶段涉及的城市及其项目 |

---

## Location（城市/地点）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `city` | `string` | 是 | 城市名称（中文） |
| `coordinates` | `{ lat: number; lng: number }` | 是 | WGS84经纬度坐标 |
| `projects` | `Project[]` | 是 | 该城市关联的项目列表 |

---

## Project（项目/经历）

| 字段 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `id` | `string` | 是 | 项目唯一标识 | `"garden-1"` |
| `title` | `string` | 是 | 项目标题 | `"乡村花境方案设计"` |
| `description` | `string` | 是 | 项目描述（1-2句话，卡片显示） | `"以南法乡村庭院为基底..."` |
| `tags` | `string[]` | 是 | 技术/风格标签（2-4个） | `["手绘", "场地规划", "植物配置"]` |
| `image` | `string` | 是 | 项目配图路径（桌面端，280×120px） | `"/assets/images/garden/project1.jpg"` |
| `mobileImage` | `string` | 是 | 项目配图路径（移动端，320×200px） | `"/assets/images/garden/project1-mobile.jpg"` |
| `location` | `string` | 是 | 显示用的地点+时间文本 | `"西安 · 2020-03"` |
| `link` | `string` | 否 | 外部链接（项目详情/在线地址） | `""` |
| `detailDescription` | `string` | 否 | 详细描述（模态窗中使用，支持更长文本） | `""` |

---

## 完整示例

```json
{
  "timelineConfig": {
    "dragCursorIcon": "default",
    "stageSplitRatio": [0.333, 0.666]
  },
  "stages": [
    {
      "id": "garden",
      "theme": "garden",
      "title": "阶段一｜风景园林学习",
      "description": "读懂季节，读懂种子，用线条描摹下午三点钟阴影的移动",
      "icon": "👨‍🌾",
      "color": "#4CAF50",
      "mapStyle": "garden",
      "cursorAvatar": "/assets/animations/cursor-garden.gif",
      "locations": [
        {
          "city": "西安",
          "coordinates": { "lat": 34.3416, "lng": 108.9398 },
          "projects": [
            {
              "id": "garden-1",
              "title": "项目标题",
              "description": "项目简短描述（1-2句话）",
              "tags": ["标签1", "标签2", "标签3"],
              "image": "/assets/images/garden/project1.jpg",
              "mobileImage": "/assets/images/garden/project1-mobile.jpg",
              "location": "西安 · 2020-03",
              "link": "",
              "detailDescription": "项目的完整详细描述，在模态窗中展示。"
            }
          ]
        }
      ]
    },
    {
      "id": "code",
      "theme": "code",
      "title": "阶段二｜千禧街机 · 软件工程学习",
      "description": "读懂逻辑，读懂代码，用键盘敲击凌晨三点半程序的运行",
      "icon": "🎮",
      "color": "#2196F3",
      "mapStyle": "code",
      "cursorAvatar": "/assets/animations/cursor-code.gif",
      "locations": []
    },
    {
      "id": "ai",
      "theme": "ai",
      "title": "阶段三｜AI未来 · AI工程从业",
      "description": "读懂数据，读懂智能，用算法模拟未来三秒钟世界的重构",
      "icon": "🤖",
      "color": "#9C27B0",
      "mapStyle": "ai",
      "cursorAvatar": "/assets/animations/cursor-ai.gif",
      "locations": []
    }
  ]
}
```

---

## 字段约束

1. `stageSplitRatio` 数组长度 = 阶段数 - 1，各值递增且 ∈ (0, 1)，最后一个分割点 < 1
2. 每个 Project 的 `id` 全局唯一
3. 图片路径必须相对于 `index.html` 或使用绝对路径
4. `tags` 数组 2-4 个元素为宜，前端渲染为标签胶囊
5. `mobileImage` 用于移动端信息流，尺寸建议 320×200px
6. `image` 用于桌面端卡片，尺寸建议 280×120px
7. Location 的 `coordinates` 使用真实经纬度，用于 Canvas 坐标投影
