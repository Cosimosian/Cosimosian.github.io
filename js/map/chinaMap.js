// ============================================================
// 中国地图模块（js/map/chinaMap.js）
// 职责：全屏 Canvas 地图——静态层缓存（国界/省界/河流/湖泊/文字）+ 动态三级城市标记 + 悬浮提示
// 依赖：RESUME（STAGES/周边标签）、Projection、Utils、全局 CHINA_GEO_DATA / MAP_STYLE
// 接口：init() / destroy() / resize() / draw()；阶段与游标年月通过构造参数 getStage/getYear 注入
// ============================================================
(function(global){
'use strict';

const { STAGES, SURROUNDING_LABELS } = global.RESUME;
const { lonLatToXY, XYToLonLat } = global.Projection;
const { DEBUG, cssVar, expActiveAt } = global.Utils;

// 地图绘制参数（原散落魔数集中于此）
const MAP_CONST = {
  LAYOUT_CX: 0.38,        // 地图中心水平系数（相对画布宽）
  LAYOUT_CY: 0.38,        // 地图中心垂直系数（相对画布高）
  SCALE_RATIO: 0.85,      // 缩放系数（相对画布短边）
  SCALE_CAP: 900,         // 缩放上限
  REDRAW_MS: 60,          // 动态层重绘间隔
  HOVER_RADIUS: 18,       // 悬浮命中半径
  PULSE_MS: 500,          // 水滴/标记缓跳周期
  DROP_STROKE: 'rgba(255,255,255,0.85)', // 水滴白描边
  PROVINCE_HL_ALPHA: 0.14 // 省份高亮透明度
};

// 经历条目 → 关联坐标点集（[[lat,lng],...]，含 extra 联动城市）
function expPoints(exp){
  return [[exp.lat, exp.lng], ...(exp.extra||[]).map(x=>[x.lat, x.lng])];
}

class ChinaMap{
  constructor(canvas, { getStage, getYear }){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._getStage = getStage;
    this._getYear = getYear;
    this.mapParams = { cx:0, cy:0, scale:0 };
    this._staticLayer = null;
    this._staticKey = '';
    this._animId = null;
    this._diag = false;
    this._onMouseMove = this._handleMouseMove.bind(this);
    this._onMouseLeave = this._handleMouseLeave.bind(this);
    this._onResize = () => this.resize();
  }

  init(){
    window.addEventListener('resize', this._onResize);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);
    this._animId = setInterval(() => this.draw(), MAP_CONST.REDRAW_MS);
    this.resize();
  }

  destroy(){
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    if(this._animId){ clearInterval(this._animId); this._animId = null; }
    this._staticLayer = null; // 释放离屏画布引用
  }

  resize(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this._staticKey = '';
    this.draw();
  }

  draw(){
    if(this.canvas.clientWidth===0||getComputedStyle(this.canvas).display==='none')return; // 移动端跳过
    this._ensureStaticLayer();
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    if(this._staticLayer)this.ctx.drawImage(this._staticLayer,0,0);
    this._drawMarkers(this.ctx);
  }

  // ---- 视觉基线令牌：来自 assets/data/map-style.json（Maputnik 可编辑） ----
  _styleTokens(theme){
    const t={};
    ((global.MAP_STYLE||{layers:[]}).layers||[]).forEach(l=>{
      if(l.metadata&&l.metadata.theme===theme)t[l.metadata.role]=Object.assign({},t[l.metadata.role],l.paint||{});
    });
    return t;
  }

  // ---- 静态图层缓存（背景/轮廓/省界/河流/湖泊/文字），主题或尺寸变化时重建 ----
  _ensureStaticLayer(){
    const stageId = this._getStage();
    const w=this.canvas.width,h=this.canvas.height;
    const key=stageId+'_'+w+'x'+h;
    if(this._staticLayer&&this._staticKey===key)return;
    this._staticKey=key;
    const layer=document.createElement('canvas');
    layer.width=w;layer.height=h;
    const s=layer.getContext('2d');
    const tok=this._styleTokens(STAGES[stageId].theme);
    const geo=global.CHINA_GEO_DATA;
    const cx=w*MAP_CONST.LAYOUT_CX, cy=h*MAP_CONST.LAYOUT_CY, scale=Math.min(Math.min(w,h)*MAP_CONST.SCALE_RATIO, MAP_CONST.SCALE_CAP);
    this.mapParams={cx,cy,scale};
    const px=p=>{const q=lonLatToXY(p[0],p[1]);return[cx+q.x*scale,cy+q.y*scale]};

    // 背景径向渐变
    const bg=tok.bg?tok.bg['background-color']:'#F5F0E6';
    const end=tok.bg&&tok.bg['gradient-end']?tok.bg['gradient-end']:'rgba(0,0,0,0.35)';
    const grad=s.createRadialGradient(cx,cy,scale*0.3,cx,cy,scale*1.4);
    grad.addColorStop(0,bg);grad.addColorStop(1,end);
    s.fillStyle=grad;s.fillRect(0,0,w,h);

    if(!geo){ this._staticLayer=layer; return; }

    const tracePath=ring=>{
      for(let i=0;i<ring.length;i++){const q=px(ring[i]);if(i===0)s.moveTo(q[0],q[1]);else s.lineTo(q[0],q[1]);}
    };

    // 国界轮廓：填充（evenodd 挖孔）+ 描边 + 风格叠层
    if(tok['outline-fill']){
      s.beginPath();tracePath(geo.outer);
      geo.holes.forEach(r=>{tracePath(r)});
      s.closePath();
      s.fillStyle=tok['outline-fill']['fill-color'];s.globalAlpha=tok['outline-fill']['fill-opacity']||0.05;
      s.fill('evenodd');s.globalAlpha=1;
    }
    if(tok.outline){
      s.beginPath();tracePath(geo.outer);
      geo.holes.forEach(r=>{tracePath(r)});
      s.strokeStyle=tok.outline['line-color'];s.lineWidth=tok.outline['line-width']||1.5;
      s.globalAlpha=tok.outline['line-opacity']||0.45;s.stroke();s.globalAlpha=1;
    }
    // 手绘/像素叠层（虚线）
    const overlayTok=tok['outline-handdrawn']||tok['outline-pixel'];
    if(overlayTok){
      s.beginPath();tracePath(geo.outer);geo.holes.forEach(r=>{tracePath(r)});
      s.strokeStyle=overlayTok['line-color'];s.lineWidth=overlayTok['line-width']||3;
      s.globalAlpha=overlayTok['line-opacity']||0.14;
      s.setLineDash(overlayTok['line-dasharray']||[10,6]);s.stroke();s.setLineDash([]);s.globalAlpha=1;
    }

    // 省界 / 河流 / 湖泊
    const strokeLines=(arr,tokName)=>{
      const t=tok[tokName];if(!t||!arr)return;
      s.strokeStyle=t['line-color'];s.lineWidth=t['line-width']||0.8;s.globalAlpha=t['line-opacity']||0.12;
      s.beginPath();arr.forEach(r=>tracePath(r));s.stroke();s.globalAlpha=1;
    };
    strokeLines(geo.provinces,'provinces');
    strokeLines(geo.rivers,'rivers');
    if(tok.lakes&&geo.lakes){
      s.fillStyle=tok.lakes['fill-color'];s.globalAlpha=tok.lakes['fill-opacity']||0.12;
      s.beginPath();geo.lakes.forEach(r=>tracePath(r));s.closePath();s.fill('evenodd');s.globalAlpha=1;
    }

    // 当前阶段时间线（经历）所在省份高亮（随阶段缓存重建，含联动城市）
    const expCities=(STAGES[stageId].experiences||[]).filter(e=>e.lat)
      .flatMap(e=>expPoints(e).map(([la,ln])=>[ln,la]));
    if(expCities.length&&geo.provinces){
      const inRing=(ring,p)=>{
        let inside=false;
        for(let i=0,j=ring.length-1;i<ring.length;j=i++){
          const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];
          if(((yi>p[1])!==(yj>p[1]))&&(p[0]<(xj-xi)*(p[1]-yi)/(yj-yi)+xi))inside=!inside;
        }
        return inside;
      };
      const hit=new Set();
      expCities.forEach(c=>geo.provinces.forEach((ring,idx)=>{if(inRing(ring,c))hit.add(idx)}));
      if(hit.size){
        const ac=(tok.marker&&tok.marker['circle-color'])||'#92A87C';
        s.fillStyle=ac;s.globalAlpha=MAP_CONST.PROVINCE_HL_ALPHA;
        hit.forEach(idx=>{s.beginPath();tracePath(geo.provinces[idx]);s.closePath();s.fill()});
        s.globalAlpha=1;
      }
    }

    // 周边地理标注
    const st=tok.surrounding||{};
    const so=st['text-opacity']||0.08;
    const sfont=(st['text-font']||'sans-serif')==='serif'?'serif':'sans-serif';
    s.globalAlpha=so;s.font=`${scale*0.025}px ${sfont}`;s.textAlign='center';
    SURROUNDING_LABELS.forEach(L=>s.fillText(L[0],cx+L[1]*scale,cy+L[2]*scale));
    s.textAlign='start';s.globalAlpha=1;

    // “中 国”字样
    const lt=tok.labels||{};
    s.globalAlpha=lt['text-opacity']||0.12;
    s.font=`300 ${scale*0.07}px ${(lt['text-font']||'serif')==='serif'?'serif':'sans-serif'}`;
    s.textAlign='center';s.fillText('中  国',cx,cy-scale*0.03);s.textAlign='start';s.globalAlpha=1;

    this._staticLayer=layer;
  }

  // ---- 动态图层：三级城市标记（每帧重绘） ----
  // L1 阶段主城（主题化形状） / L2 时间线经历城市水滴+缓慢跳动 / L3 游标所在月份经历城市放大
  _drawMarkers(s){
    const stageId=this._getStage();
    const year=this._getYear();
    const tok=this._styleTokens(STAGES[stageId].theme);
    const m=tok.marker||{};
    const ac=m['circle-color']||cssVar('--color-accent');
    const txtCol=cssVar('--color-text');
    const shape=m['marker-shape']||'dot';
    const {cx,cy,scale}=this.mapParams;
    if(!scale)return;

    // 标记越界守卫（坐标错误时立即在控制台暴露，而非静默消失；仅 debug 模式）
    const guard=(mx,my,name)=>{
      if(!DEBUG) return;
      if(!Number.isFinite(mx)||!Number.isFinite(my)||mx<-100||my<-100||mx>this.canvas.width+100||my>this.canvas.height+100){
        console.warn('[map-guard] 标记越界:',name||'?','@',Math.round(mx),Math.round(my),'canvas=',this.canvas.width+'x'+this.canvas.height);
      }
    };

    const stage=STAGES[stageId];
    const exps=(stage.experiences||[]).filter(e=>e.lat);
    const citySet=new Map();
    exps.forEach(e=>{
      expPoints(e).forEach(([la,ln])=>{
        const k=la.toFixed(2)+','+ln.toFixed(2);
        if(!citySet.has(k))citySet.set(k,{lat:la,lng:ln});
      });
    });

    // 主题形状（L1 主城用）
    const drawShape=(mx,my,r,alpha,haloR,haloAlpha,fontW,name)=>{
      s.fillStyle=ac;s.globalAlpha=alpha;
      if(shape==='square'){s.fillRect(mx-r,my-r,r*2,r*2);}
      else if(shape==='star'){
        s.beginPath();const spikes=5,outer=r,inner=r*0.45;
        for(let i=0;i<spikes*2;i++){const rad=(i%2===0?outer:inner);const ang=i*Math.PI/spikes-Math.PI/2;
          const qx=mx+Math.cos(ang)*rad,qy=my+Math.sin(ang)*rad;if(i===0)s.moveTo(qx,qy);else s.lineTo(qx,qy);}
        s.closePath();s.fill();
      }
      else if(shape==='glow'){
        const g=s.createRadialGradient(mx,my,0,mx,my,r*3);
        g.addColorStop(0,ac);g.addColorStop(1,'rgba(0,0,0,0)');
        s.fillStyle=g;s.fillRect(mx-r*3,my-r*3,r*6,r*6);
        s.beginPath();s.arc(mx,my,r,0,Math.PI*2);s.fillStyle=ac;s.fill();
      }
      else{s.beginPath();s.arc(mx,my,r,0,Math.PI*2);s.fill();}
      if(haloR){s.strokeStyle=ac;s.globalAlpha=haloAlpha;s.lineWidth=fontW?2:1.5;s.beginPath();s.arc(mx,my,haloR,0,Math.PI*2);s.stroke();}
      if(name){s.fillStyle=txtCol;s.globalAlpha=0.55;s.font=`${fontW?'bold ':''}${scale*0.02}px sans-serif`;s.fillText(name,mx+10,my+4);}
      s.globalAlpha=1;
    };

    // 水滴坐标点（尖端精确落在城市坐标，主体向上延展，白色描边增强对比）
    const drawDrop=(mx,my,r,alpha)=>{
      s.fillStyle=ac;s.globalAlpha=alpha;
      s.beginPath();
      s.moveTo(mx,my);
      s.bezierCurveTo(mx+r*1.15,my-r*0.25,mx+r,my-r*1.4,mx,my-r*1.4);
      s.bezierCurveTo(mx-r,my-r*1.4,mx-r*1.15,my-r*0.25,mx,my);
      s.closePath();s.fill();
      s.strokeStyle=MAP_CONST.DROP_STROKE;s.lineWidth=1.2;s.stroke();
      s.globalAlpha=1;
    };

    // 缓慢跳动（~3.1s 周期，±5%）
    const slowPulse=1+0.05*Math.sin(Date.now()/MAP_CONST.PULSE_MS);
    // 游标所在月份对应的经历（起止区间内，支持重叠时段多经历同时点亮），含联动城市点集
    const nearEs=exps.filter(e=>expActiveAt(e, year, 1/24));
    nearEs.forEach(e=>e.allPts=expPoints(e));

    // 一次性诊断输出（排查标记不可见；仅 debug 模式）
    if(DEBUG&&!this._diag){
      this._diag=true;
      const firstCity=[...citySet.values()][0];
      let firstPos=null;
      if(firstCity){const fp=lonLatToXY(firstCity.lng,firstCity.lat);firstPos={x:Math.round(cx+fp.x*scale),y:Math.round(cy+fp.y*scale)};}
      console.log('[map-diagnose]',JSON.stringify({
        stage:stageId, scale:Math.round(scale), cx:Math.round(cx), cy:Math.round(cy),
        cities:[...citySet.values()].map(c=>c.name),
        firstMarkerPos:firstPos,
        canvasSize:this.canvas.width+'x'+this.canvas.height,
        styleVals:{sr:m['secondary-radius'],so:m['secondary-opacity'],shape},
        near:nearEs.map(e=>e.text), currentYear:year
      }));
    }

    // L1 阶段主城
    if(stage.primaryLat){
      const p1=lonLatToXY(stage.primaryLng,stage.primaryLat);
      const mx1=cx+p1.x*scale,my1=cy+p1.y*scale;
      guard(mx1,my1,'主城');
      drawShape(mx1,my1,m['primary-radius']||4,m['primary-opacity']||0.8,m['primary-halo']||8,m['primary-halo-opacity']||0.3,false,null);
    }
    // L2 时间线经历城市：水滴 + 缓慢跳动
    const litPts=nearEs.flatMap(e=>e.allPts);
    citySet.forEach(c=>{
      if(litPts.some(q=>Math.abs(q[0]-c.lat)<0.01&&Math.abs(q[1]-c.lng)<0.01))return; // 由 L3 放大绘制
      const p2=lonLatToXY(c.lng,c.lat);
      const r=(m['secondary-radius']||5)*slowPulse;
      const mx=cx+p2.x*scale,my=cy+p2.y*scale;
      guard(mx,my,'水滴');
      drawDrop(mx,my,r,m['secondary-opacity']||0.85);
    });
    // L3 游标所在月份经历城市：放大水滴 + 光晕（重叠时段多经历同时点亮，联动所有关联城市）
    litPts.forEach(([la,ln])=>{
      const p3=lonLatToXY(ln,la);
      const mx=cx+p3.x*scale,my=cy+p3.y*scale;
      guard(mx,my,'放大');
      const r=(m['selected-radius']||7.5)*slowPulse;
      drawDrop(mx,my,r,1);
      s.strokeStyle=ac;s.globalAlpha=0.45;s.lineWidth=2;
      s.beginPath();s.arc(mx,my,r*1.5,0,Math.PI*2);s.stroke();
    });
    s.globalAlpha=1;
  }

  // ---- 悬浮命中目标（经纬度 → 屏幕坐标列表） ----
  _buildHoverTargets(){
    const t=[];
    const {cx,cy,scale}=this.mapParams;
    if(!scale)return t;
    const stage=STAGES[this._getStage()];
    if(stage.primaryLat){
      const p=lonLatToXY(stage.primaryLng,stage.primaryLat);
      t.push({x:cx+p.x*scale,y:cy+p.y*scale,label:(stage.experiences?.[0]?.text?.split(' ')[0]||'')});
    }
    (stage.experiences||[]).filter(e=>e.lat).forEach(e=>{
      expPoints(e).forEach(([la,ln])=>{
        const p=lonLatToXY(ln,la);
        t.push({x:cx+p.x*scale,y:cy+p.y*scale,label:e.text.split(' ')[0]});
      });
    });
    return t;
  }

  _handleMouseMove(e){
    if(!this.mapParams.scale)return;
    const x=(e.clientX-this.mapParams.cx)/this.mapParams.scale;
    const y=(e.clientY-this.mapParams.cy)/this.mapParams.scale;
    const ll=XYToLonLat(x,y);
    const coords=document.getElementById('mouse-coords');
    coords.textContent=ll.lat.toFixed(2)+'°N, '+ll.lng.toFixed(2)+'°E';
    coords.classList.add('visible');

    // 悬浮命中检测：鼠标贴近坐标点时显示对应经历名称
    const tip=document.getElementById('map-tooltip');
    const hit=this._buildHoverTargets().find(h=>Math.hypot(e.clientX-h.x,e.clientY-h.y)<=MAP_CONST.HOVER_RADIUS);
    if(hit){
      tip.textContent=hit.label;
      tip.style.left=(e.clientX+14)+'px';
      tip.style.top=(e.clientY+14)+'px';
      tip.classList.add('visible');
      this.canvas.style.cursor='pointer';
    }else{
      tip.classList.remove('visible');
      this.canvas.style.cursor='default';
    }
  }

  _handleMouseLeave(){
    document.getElementById('mouse-coords').classList.remove('visible');
    document.getElementById('map-tooltip').classList.remove('visible');
  }
}

global.ChinaMap = ChinaMap;

})(window);
