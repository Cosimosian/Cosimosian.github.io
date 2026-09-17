// ============================================================
// 履历数据层（data/resume.js）
// 职责：全部履历内容——时间范围、阶段配置、项目数据、地图周边标签
// 依赖：无（纯静态数据，被 js/ 各模块单向引用）
// 加载：普通 <script>（file:// 兼容），挂载 window.RESUME
// ============================================================
(function(global){
'use strict';

const YEAR_START = 2016.75;  // 2016.9
const YEAR_END   = 2027.0;   // 2026.12

const STAGES = {
  garden: { id:'garden', theme:'garden', yearStart:2016.75, yearEnd:2021.75,
    title:'2016‑2021｜风景园林 · 落地景观与产品设计',
    description:'自然器物之间 | 环境美学与人的感知联结',
    badge:'阶段 01',
    primaryLat:34.28, primaryLng:108.07,
    experiences:[
      {year:2016.75,yearEnd:2020.42,type:'教育',text:'西北农林科技大学 风景园林学士（获保研资格）',lat:34.28,lng:108.07},
      {year:2020.33,yearEnd:2021.58,type:'工作',text:'中国建筑设计研究院 建筑景观设计',lat:34.34,lng:108.94}
    ]},
  code: { id:'code', theme:'code', yearStart:2021.75, yearEnd:2024.5,
    title:'2021‑2024｜软件工程 · 初探技术与商业系统',
    description:'数字抽象之域 | 人造规则下的解析与建构',
    badge:'阶段 02',
    primaryLat:34.34, primaryLng:108.94,
    experiences:[
      {year:2021.75,yearEnd:2023.42,type:'教育',text:'西安电子科技大学 软件工程学士（西电青岛研究院）',lat:34.34,lng:108.94,extra:[{lat:36.07,lng:120.38}]},
      {year:2022.5,yearEnd:2022.58,type:'实习',text:'招商银行 数据分析',lat:34.34,lng:108.94},
      {year:2023.08,yearEnd:2023.33,type:'实习',text:'西门子 前端开发',lat:31.30,lng:120.62},
      {year:2023.83,yearEnd:2024.42,type:'工作',text:'德勤 网络安全风险咨询',lat:22.54,lng:114.06}
    ]},
  ai: { id:'ai', theme:'ai', yearStart:2024.5, yearEnd:2026.58,
    title:'2024‑2026｜显示软件开发 · 工程训练和AI探索',
    description:'系统工程之途 | 虚实渐感，巨微相循，感理互筑',
    badge:'阶段 03',
    primaryLat:34.34, primaryLng:108.94,
    experiences:[
      {year:2024.83,yearEnd:2026.58,type:'工作',text:'华为 显示软件开发',lat:34.34,lng:108.94}
    ]},
  future: { id:'future', theme:'future', yearStart:2026.58, yearEnd:2027.0,
    title:'未来 · Future',
    description:'—— 内容预留，等待书写 ——',
    badge:'未 来',
    experiences:[] }
};

const PROJECTS = [
  {id:'g1',title:'工业设计 | 家用厨房沥水架',category:'实用新型专利，“博世杯”工业设计与模型制作大赛一等奖',desc:'工业产品设计课程项目，从生活场景出发完成家用厨房沥水架的产品设计与方案表达。',tags:['SketchUp','0.'],location:'西安',image:'https://picsum.photos/seed/garden1/600/260',mobileImage:'https://picsum.photos/seed/garden1-m/640/340',stage:'garden',year:2017.5,outcome:'',link:'',lat:34.34,lng:108.94},
  {id:'g2',title:'用户研究 | 公众偏好的科普信息研究',category:'毕业设计',desc:'用户研究课题，围绕公众偏好的科普信息类型与科普方式展开调研分析。',tags:['用户研究','调研分析'],location:'西安',image:'https://picsum.photos/seed/garden2/600/260',mobileImage:'https://picsum.photos/seed/garden2-m/640/340',stage:'garden',year:2018.5,outcome:'',link:'',lat:34.34,lng:108.94},
  {id:'g3',title:'建筑景观 | 杨凌自贸大厦',category:'景观工程（实际建成）',desc:'中国建筑设计研究院工作期间的景观设计项目。',tags:['景观设计','公共建筑'],location:'杨凌',image:'https://picsum.photos/seed/garden3/600/260',mobileImage:'https://picsum.photos/seed/garden3-m/640/340',stage:'garden',year:2021.0,outcome:'',link:'',lat:34.28,lng:108.07},
  {id:'g4',title:'建筑景观 | 榆林博物馆',category:'景观工程（实际建成）',desc:'中国建筑设计研究院工作期间的景观设计项目。',tags:['景观设计','文化建筑'],location:'榆林',image:'https://picsum.photos/seed/garden4/600/260',mobileImage:'https://picsum.photos/seed/garden4-m/640/340',stage:'garden',year:2021.25,outcome:'',link:'',lat:38.29,lng:109.73},
  {id:'c1',title:'数据分析 | 基于BI平台的全客群AUM自动化分析',category:'数分实习',desc:'德勤工作期间的 chatBI 数据分析项目，基于对话式商业智能的数据分析实践。',tags:['数据分析','商业智能'],location:'深圳',image:'https://picsum.photos/seed/code6/600/260',mobileImage:'https://picsum.photos/seed/code6-m/640/340',stage:'code',year:2024.25,outcome:'',link:'',lat:22.54,lng:114.06},
  {id:'c2',title:'产品设计 | 微软 Edge 挑战者开发大赛-桌面猫猫计时器',category:'校外竞赛（入围20强）',desc:'微软 Edge 挑战者开发大赛参赛项目，前端开发与网页应用实现。',tags:['前端开发','Web应用'],location:'西安',image:'https://picsum.photos/seed/code2/600/260',mobileImage:'https://picsum.photos/seed/code2-m/640/340',stage:'code',year:2022.75,outcome:'',link:'',lat:34.34,lng:108.94},
  {id:'c3',title:'前端开发 | AI客服问答系统首页',category:'开发实习',desc:'校园互助服务平台，负责产品规划、需求管理与功能迭代。',tags:['产品经理','需求分析'],location:'西安',image:'https://picsum.photos/seed/code1/600/260',mobileImage:'https://picsum.photos/seed/code1-m/640/340',stage:'code',year:2022.25,outcome:'',link:'',lat:34.34,lng:108.94},
  {id:'c4',title:'RAG项目 | 网络安全审计存档问答系统',category:'AI探索',desc:'德勤工作期间的 chatBI 数据分析项目，基于对话式商业智能的数据分析实践。',tags:['数据分析','商业智能'],location:'深圳',image:'https://picsum.photos/seed/code6/600/260',mobileImage:'https://picsum.photos/seed/code6-m/640/340',stage:'code',year:2024.25,outcome:'',link:'',lat:22.54,lng:114.06},
  {id:'a1',title:'眨眼检测 | 终端智能护眼特性',category:'软件工程（市场发布）',desc:'华为显示软件开发期间的智能护眼项目，负责AI模型训练与数据处理。',tags:['模型训练','数据处理','护眼'],location:'西安',image:'https://picsum.photos/seed/ai1/600/260',mobileImage:'https://picsum.photos/seed/ai1-m/640/340',stage:'ai',year:2025.0,outcome:'',link:'',lat:34.34,lng:108.94},
  {id:'a2',title:'多模态 | 图像显示异常检测',category:'软件工程（内部提效）',desc:'华为显示软件开发期间的多模态显示异常检测项目。',tags:['多模态','异常检测','显示'],location:'西安',image:'https://picsum.photos/seed/ai2/600/260',mobileImage:'https://picsum.photos/seed/ai2-m/640/340',stage:'ai',year:2025.5,outcome:'',link:'',lat:34.34,lng:108.94},
  {id:'a3',title:'多agent协同 | 短剧生成工作流',category:'AI探索',desc:'华为显示软件开发期间的工作流项目，短剧生成工作流的设计与实现。',tags:['工作流','内容生成','AIGC'],location:'西安',image:'https://picsum.photos/seed/ai3/600/260',mobileImage:'https://picsum.photos/seed/ai3-m/640/340',stage:'ai',year:2026.0,outcome:'',link:'',lat:34.34,lng:108.94},
  {id:'a4',title:'chatBI | 个人衣物管理app',category:'AI探索',desc:'衣物管理。',tags:['app','衣物识别','AIGC'],location:'西安',image:'https://picsum.photos/seed/ai3/600/260',mobileImage:'https://picsum.photos/seed/ai3-m/640/340',stage:'ai',year:2026.0,outcome:'',link:'',lat:34.34,lng:108.94},
];

// 弹窗详情图文：见 data/projects/<id>.md（独立可编辑文件，格式说明见 data/projects/README.md）

// 地图周边地理标注（[文本, 相对x, 相对y]，坐标以 scale 为单位）
const SURROUNDING_LABELS=[
  ['中亚 · Central Asia',-0.88,-0.12],['俄罗斯 · Russia',0.10,-0.26],['蒙古 · Mongolia',0.38,-0.18],
  ['朝鲜半岛',0.84,0.12],['日本 · Japan',0.90,0.28],['东南亚',0.50,0.52],
  ['南亚 · South Asia',-0.32,0.46],['喜马拉雅',-0.42,0.18]
];

// 挂载到 window（file:// 下 ES Modules 不可用，统一走命名空间）
global.RESUME = { YEAR_START, YEAR_END, STAGES, PROJECTS, SURROUNDING_LABELS };

})(window);
