# 项目详情文档格式说明（data/projects/）

每个项目一个独立 `.md` 文件，文件名 = 项目 id（如 `g1.md`）。手动编辑此文件即可更新弹窗图文，无需改代码。

## 文件结构

```markdown
---
outcome: “博世杯”一等奖        ← 可选 front matter（键: 值，逐行）
image: https://…               ← 可选：覆盖弹窗头部图
---

正文……                          ← 项目详细介绍（markdown 子集）
```

## 正文支持语法

| 语法 | 效果 |
|---|---|
| 空行分段 | 段落 |
| `# 标题` / `## 标题` / `### 标题` | 二/三/四级标题 |
| `![描述](图片URL)` | 独立一行图片（懒加载） |
| `- 项目` / `* 项目` | 无序列表 |
| `**加粗**` | 加粗 |
| `[文字](URL)` | 链接（新窗口打开） |

## 扩展接口

- **front matter**：可添加任意新键（如 `gallery:`、`video:`、`repo:`），弹窗渲染器（`js/projectDoc.js`）按需消费；未消费的键被忽略，不影响显示
- **正文**：新增语法需在 `js/projectDoc.js` 的 `renderMarkdown` 中扩展对应分支

## 加载与缓存

`loadProjectDoc(id)`：`fetch data/projects/<id>.md` → 解析 front matter + 渲染正文 → 按 id 缓存（Map）。

> **注意**：详情图文需通过 http（`python -m http.server` 或 GitHub Pages）访问；直接双击 `file://` 打开时浏览器阻止 fetch 本地文件，弹窗将只显示基础信息、正文区留空，不影响页面其他功能。
