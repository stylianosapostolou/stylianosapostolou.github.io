/* Stylianos Apostolou — portfolio V3. Page book, cover aircraft, wing dynamics.
   The Electric Propulsion animation further down is the original V2 code, unchanged. */
const $=s=>document.querySelector(s);
const pages=[...document.querySelectorAll('.page')],dots=$('#dots'),counter=$('#counter'),navtitle=$('#navtitle');
const TITLES=['Cover','Engineering profile','Thesis · the problem','Thesis · method & validation','Thesis · results','Wing dynamics & aeroelasticity','Cryogenic LH₂ pressure vessel','Research foundation','Engineering toolkit','Electric propulsion','Imperial College London'];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let page=0;
pages.forEach((_,i)=>{let d=document.createElement('button');d.type='button';d.setAttribute('aria-label','Page '+(i+1)+': '+(TITLES[i]||''));d.onclick=e=>{e.stopPropagation();show(i)};dots.appendChild(d)});
const toc=$('#toc'),tocbtn=$('#tocbtn'),toclist=$('#toclist');
TITLES.forEach((t,i)=>{let li=document.createElement('li'),b=document.createElement('button');b.type='button';b.innerHTML='<span>'+String(i+1).padStart(2,'0')+'</span>'+t;b.onclick=()=>{closeToc();show(i)};li.appendChild(b);toclist.appendChild(li)});
function openToc(){toc.hidden=false;tocbtn.setAttribute('aria-expanded','true');[...toclist.querySelectorAll('button')].forEach((b,i)=>b.classList.toggle('on',i===page));toclist.querySelectorAll('button')[page].focus()}
function closeToc(){toc.hidden=true;tocbtn.setAttribute('aria-expanded','false')}
tocbtn.onclick=e=>{e.stopPropagation();toc.hidden?openToc():closeToc()};
toc.addEventListener('click',e=>{if(e.target===toc)closeToc()});
function show(n,fromHash){if(n<0||n>=pages.length)return;pages.forEach((p,i)=>{p.classList.toggle('active',i===n);p.classList.toggle('exit',i<n);p.setAttribute('aria-hidden',i===n?'false':'true');p.inert=i!==n});page=n;counter.textContent=String(n+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');navtitle.textContent=TITLES[n]||'';[...dots.children].forEach((d,i)=>d.classList.toggle('on',i===n));prev.disabled=n===0;next.disabled=n===pages.length-1;pages[n].scrollTop=0;if(!fromHash){try{history.replaceState(null,'','#p'+(n+1))}catch(e){}}}
next.onclick=e=>{e.stopPropagation();show(page+1)};prev.onclick=e=>{e.stopPropagation();show(page-1)};
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=e=>{e.stopPropagation();show(+b.dataset.go)});
document.addEventListener('keydown',e=>{if(!toc.hidden){if(e.key==='Escape')closeToc();return}
 const tag=(e.target.tagName||'');if(e.key===' '&&(tag==='BUTTON'||tag==='A'))return;
 if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();show(page+1)}
 else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();show(page-1)}
 else if(e.key==='Home')show(0);else if(e.key==='End')show(pages.length-1)});
/* click margins turn the page on wide screens; ignored on controls, links and while selecting text */
document.addEventListener('click',e=>{if(innerWidth<=800||!toc.hidden)return;if(e.target.closest('button,a,input,select,textarea,label,table,figure,.seg'))return;if(String(getSelection()).length)return;if(e.clientX>innerWidth*.86)show(page+1);else if(e.clientX<innerWidth*.14)show(page-1)});
/* horizontal swipe on touch screens */
let tx=0,ty=0;document.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
document.addEventListener('touchend',e=>{if(!toc.hidden)return;let dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.6)show(page+(dx<0?1:-1))},{passive:true});
function fromHash(){let m=/^#p(\d+)$/.exec(location.hash);return m?Math.min(pages.length,Math.max(1,+m[1]))-1:0}
addEventListener('hashchange',()=>show(fromHash(),true));
show(fromHash(),true);

/* canvas sizing that only reallocates when the element size changes */
function size(c){let r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),W=Math.round(r.width*d),H=Math.round(r.height*d);if(c.width!==W||c.height!==H){c.width=W;c.height=H}let x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return[x,r.width,r.height]}

/* ---------- 01 cover: ATR 72-class top view, hybrid power path, relative airflow ---------- */
const hc=$('#hero');let streaks=[],prop=0,dash=0;
function hero(){let[x,w,h]=size(hc);if(!w||!h)return;
 if(!streaks.length)streaks=Array.from({length:60},()=>({x:Math.random()*w,y:Math.random()*h,v:.8+Math.random()*1.6,l:30+Math.random()*90}));
 x.clearRect(0,0,w,h);
 const narrow=w<800,cx=narrow?w*.47:w*.72,cy=narrow?h*.47:h*.5,s=Math.min(narrow?w*.85:w*.44,narrow?h*.82:h*.8)/31;
 /* relative airflow */
 x.lineWidth=1;streaks.forEach(p=>{if(!RM){p.x+=p.v;if(p.x-p.l>w){p.x=-5;p.y=Math.random()*h}}let g=x.createLinearGradient(p.x-p.l,0,p.x,0);g.addColorStop(0,'rgba(116,215,255,0)');g.addColorStop(1,'rgba(116,215,255,.16)');x.strokeStyle=g;x.beginPath();x.moveTo(p.x-p.l,p.y);x.lineTo(p.x,p.y);x.stroke()});
 const P=(a,b)=>[cx+a*s,cy+b*s];
 const poly=(pts,fill,stroke,lw)=>{x.beginPath();pts.forEach((q,i)=>{let[u,v]=P(q[0],q[1]);i?x.lineTo(u,v):x.moveTo(u,v)});x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=lw||1.4;x.stroke()}};
 const line=(a,b,c,d,st,lw,dsh)=>{x.beginPath();x.setLineDash(dsh||[]);let[u,v]=P(a,b),[m,n]=P(c,d);x.moveTo(u,v);x.lineTo(m,n);x.strokeStyle=st;x.lineWidth=lw||1;x.stroke();x.setLineDash([])};
 const C='rgba(120,221,255,.85)',F='rgba(14,38,52,.82)';
 /* fuselage (nose at -x, flying left) */
 x.beginPath();let f=[[-13.6,0]];x.moveTo(...P(-13.6,0));x.quadraticCurveTo(...P(-13.3,-1.45),...P(-10.6,-1.4));x.lineTo(...P(8,-1.4));x.quadraticCurveTo(...P(12.2,-1.05),...P(13.6,-.32));x.lineTo(...P(13.6,.32));x.quadraticCurveTo(...P(12.2,1.05),...P(8,1.4));x.lineTo(...P(-10.6,1.4));x.quadraticCurveTo(...P(-13.3,1.45),...P(-13.6,0));x.fillStyle=F;x.fill();x.strokeStyle=C;x.lineWidth=1.4;x.stroke();
 /* horizontal tail and fin */
 poly([[12.3,-3.7],[11.2,0],[12.3,3.7],[13.1,3.7],[13.35,0],[13.1,-3.7]],F,C);
 line(9.2,0,13.5,0,'rgba(120,221,255,.6)',1.2);
 /* high wing */
 poly([[-1.3,-13.5],[-1.65,0],[-1.3,13.5],[.3,13.5],[1.25,0],[.3,-13.5]],F,C);
 [[-1,-1],[1,1]].forEach(([k])=>{line(.75,k*2,.62,k*7.5,'rgba(120,221,255,.25)',1);line(.55,k*8,.25,k*12.8,'rgba(120,221,255,.25)',1)});
 /* battery + power path (orange = electrical) */
 dash=RM?0:(dash+.6)%20;
 x.setLineDash([3,3]);poly([[3,-.85],[6.6,-.85],[6.6,.85],[3,.85]],'rgba(255,155,100,.08)','rgba(255,155,100,.85)',1.2);x.setLineDash([]);
 x.save();x.setLineDash([6,6]);x.lineDashOffset=-dash;[-1,1].forEach(k=>{x.beginPath();x.moveTo(...P(3,k*.5));x.lineTo(...P(.2,k*.5));x.lineTo(...P(.2,k*4.1));x.lineTo(...P(-.6,k*4.1));x.strokeStyle='rgba(255,155,100,.75)';x.lineWidth=1.4;x.stroke()});x.restore();
 /* nacelles, motors, 6-blade propellers */
 prop=RM?.4:prop+.32;
 [-1,1].forEach(k=>{let y=k*4.1;
  x.beginPath();x.moveTo(...P(-4,y));x.quadraticCurveTo(...P(-3.9,y-.6),...P(-3,y-.6));x.lineTo(...P(2.2,y-.45));x.quadraticCurveTo(...P(2.8,y),...P(2.2,y+.45));x.lineTo(...P(-3,y+.6));x.quadraticCurveTo(...P(-3.9,y+.6),...P(-4,y));x.fillStyle=F;x.fill();x.strokeStyle=C;x.lineWidth=1.3;x.stroke();
  let[mx,my]=P(-2.6,y);x.beginPath();x.arc(mx,my,Math.max(2.5,.32*s),0,7);x.fillStyle='rgba(255,155,100,.9)';x.fill();
  line(-4.25,y-1.96,-4.25,y+1.96,'rgba(120,221,255,.18)',1);
  for(let i=0;i<6;i++){let a=prop+i*Math.PI/3,c=Math.cos(a);line(-4.25,y,-4.25+.12*Math.sin(a),y+1.96*c,'rgba(200,240,255,'+(.25+.45*Math.abs(Math.sin(a)))+')',1.3)}
 });
 /* dimension lines, drawing-style */
 x.font='11px Inter,Arial,sans-serif';x.fillStyle='rgba(185,200,210,.75)';
 const dimX=15.4;line(dimX,-13.5,dimX,13.5,'rgba(185,200,210,.35)',1);line(dimX-.5,-13.5,dimX+.5,-13.5,'rgba(185,200,210,.5)',1);line(dimX-.5,13.5,dimX+.5,13.5,'rgba(185,200,210,.5)',1);
 let[lx,ly]=P(dimX,0);x.save();x.translate(lx+14,ly);x.rotate(Math.PI/2);x.textAlign='center';x.fillText('b = 27.05 m',0,0);x.restore();
 const dimY=15.6;line(-13.6,dimY,13.6,dimY,'rgba(185,200,210,.35)',1);line(-13.6,dimY-.5,-13.6,dimY+.5,'rgba(185,200,210,.5)',1);line(13.6,dimY-.5,13.6,dimY+.5,'rgba(185,200,210,.5)',1);
 let[tx2,ty2]=P(0,dimY);x.textAlign='center';x.fillText('l = 27.17 m',tx2,ty2+16);
 if(!narrow){x.textAlign='left';x.fillStyle='rgba(255,155,100,.9)';let[ax,ay]=P(3,.85);x.fillText('263 kWh battery',ax,ay+16);let[bx,by]=P(-2.6,4.1);x.fillText('500 kW motor',bx-20,by+s*.6+16);
  x.fillStyle='rgba(116,215,255,.7)';x.letterSpacing='2px';let[gx,gy]=P(-13.6,-15.6);x.fillText('THESIS DESIGN CASE · ATR 72-CLASS PARALLEL HYBRID · TOP VIEW',gx,gy);x.letterSpacing='0px'}
 x.textAlign='left';
}

/* ---------- 06 wing: mode shapes and forced response ---------- */
const wc=$('#wing'),trc=$('#trace');let wingMode='res';
const ph=(b,g,s)=>Math.cosh(b*s)-Math.cos(b*s)-g*(Math.sinh(b*s)-Math.sin(b*s));
const SH={1:s=>ph(1.8751,.7341,s)/ph(1.8751,.7341,1),2:s=>ph(4.6941,1.0185,s)/ph(4.6941,1.0185,1)};
const TT=6,NS=12000,DT=TT/NS,WN=2*Math.PI*20.18,WF=2*Math.PI*19.99;
function respond(z){let a=new Float32Array(NS),x=0,v=0;const f=(t,x,v)=>WN*WN*Math.sin(WF*t)-2*z*WN*v-WN*WN*x;
 for(let i=0;i<NS;i++){let t=i*DT;a[i]=x;let k1x=v,k1v=f(t,x,v),k2x=v+k1v*DT/2,k2v=f(t+DT/2,x+k1x*DT/2,v+k1v*DT/2),k3x=v+k2v*DT/2,k3v=f(t+DT/2,x+k2x*DT/2,v+k2v*DT/2),k4x=v+k3v*DT,k4v=f(t+DT,x+k3x*DT,v+k3v*DT);x+=DT*(k1x+2*k2x+2*k3x+k4x)/6;v+=DT*(k1v+2*k2v+2*k3v+k4v)/6}return a}
const RESP={res:respond(0),damp:respond(.01)};
const NORM=Math.max(...RESP.res.map(Math.abs));
function envelope(a){let e=new Float32Array(NS),W=Math.round(.03/DT);for(let i=0;i<NS;i++){let m=0;for(let j=Math.max(0,i-W);j<Math.min(NS,i+W);j++){let q=Math.abs(a[j]);if(q>m)m=q}e[i]=m/NORM}return e}
const ENV={res:envelope(RESP.res),damp:envelope(RESP.damp)};
const WL={'1':['Mode 1 · 3.22 Hz','free vibration, mode 1'],'2':['Mode 2 · 20.18 Hz','free vibration, mode 2'],res:['Engine forcing · 19.99 Hz','undamped, 19.99 Hz forcing'],damp:['Damped forced response','damped (ζ = 1%), 19.99 Hz forcing']};
let tau=0,vph=0,last=0;
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=e=>{e.stopPropagation();wingMode=b.dataset.mode;tau=0;document.querySelectorAll('[data-mode]').forEach(q=>q.classList.toggle('on',q===b));$('#wlabel').textContent=WL[wingMode][0];$('#wnote').textContent=WL[wingMode][1];drawTrace()});
function wing(dt){let[x,w,h]=size(wc);if(!w||!h)return;x.clearRect(0,0,w,h);
 const forced=wingMode==='res'||wingMode==='damp',shape=SH[wingMode==='1'?1:2],fv=wingMode==='1'?.55:1.35;
 if(!RM){vph+=2*Math.PI*fv*dt;tau+=dt*.5;if(tau>TT+.8)tau=0}
 const env=forced?ENV[wingMode][Math.min(NS-1,Math.floor(Math.min(tau,TT)/DT))]:1, q=RM?.8:Math.sin(vph)*env;
 const xr=w*.08,xt=w*.9,yb=h*.66,A=h*.2,cd=h*.32;
 const st=[];for(let i=0;i<=30;i++){let s=i/30,X=xr+s*(xt-xr),c=1-.4*s,d=-A*shape(s)*q,tw=.18*Math.sin(Math.PI*s/2)*q*(wingMode==='1'?.4:1);
  st.push({X,c,le:[X,yb+d-tw*cd*.5],te:[X+cd*.55*c,yb-cd*c+d+tw*cd*.5],u:[[X,yb],[X+cd*.55*c,yb-cd*c]]})}
 /* undeformed */
 x.setLineDash([4,4]);x.strokeStyle='rgba(185,200,210,.25)';x.lineWidth=1;x.beginPath();st.forEach((p,i)=>i?x.lineTo(...p.u[0]):x.moveTo(...p.u[0]));for(let i=st.length-1;i>=0;i--)x.lineTo(...st[i].u[1]);x.closePath();x.stroke();x.setLineDash([]);
 /* deformed */
 x.beginPath();st.forEach((p,i)=>i?x.lineTo(...p.le):x.moveTo(...p.le));for(let i=st.length-1;i>=0;i--)x.lineTo(...st[i].te);x.closePath();
 let g=x.createLinearGradient(0,yb-cd,0,yb+A);g.addColorStop(0,'rgba(30,72,96,.9)');g.addColorStop(1,'rgba(14,33,48,.9)');x.fillStyle=g;x.fill();x.strokeStyle='#7be0ff';x.lineWidth=2;x.stroke();
 x.strokeStyle='rgba(255,255,255,.16)';x.lineWidth=1;for(let i=3;i<30;i+=3){let p=st[i];x.beginPath();x.moveTo(...p.le);x.lineTo(...p.te);x.stroke()}
 x.strokeStyle='rgba(123,224,255,.45)';x.beginPath();st.forEach((p,i)=>{let m=[(p.le[0]+p.te[0])/2,(p.le[1]+p.te[1])/2];i?x.lineTo(...m):x.moveTo(...m)});x.stroke();
 /* root clamp */
 x.strokeStyle='rgba(185,200,210,.5)';x.lineWidth=1.5;x.beginPath();x.moveTo(xr-4,yb+14);x.lineTo(xr+cd*.55+4,yb-cd-14);x.stroke();
 for(let i=0;i<7;i++){let t=i/6,px=xr-4+t*(cd*.55+8),py=yb+14-t*(cd+28);x.beginPath();x.moveTo(px,py);x.lineTo(px-9,py+5);x.stroke()}
 /* force at mid-span */
 if(forced){let p=st[15],fx=p.le[0]+cd*.27*p.c,fy=(p.le[1]+p.te[1])/2,L=RM?20:22*Math.sin(vph);x.strokeStyle='#ff9b64';x.fillStyle='#ff9b64';x.lineWidth=2;x.beginPath();x.moveTo(fx,fy+48);x.lineTo(fx,fy+14);x.stroke();x.beginPath();let dir=L>=0?-1:1;x.moveTo(fx,fy+10);x.lineTo(fx-5,fy+18);x.lineTo(fx+5,fy+18);x.closePath();x.fill();x.font='11px Inter,Arial,sans-serif';x.fillText('F(t) · 19.99 Hz',fx+8,fy+44)}
 /* node marker for mode 2 */
 if(wingMode==='2'){let s0=.774,p=st[Math.round(s0*30)];x.fillStyle='#74d7ff';x.font='11px Inter,Arial,sans-serif';x.fillText('node',p.le[0]-12,yb+30)}
 x.fillStyle='rgba(185,200,210,.7)';x.font='11px Inter,Arial,sans-serif';x.fillText('root',xr-6,yb+34);x.fillText('tip · 8.9 m',xt-10,yb+34);
 drawCursor();
}
let traceImg=null;
function drawTrace(){let[x,w,h]=size(trc);if(!w||!h)return;x.clearRect(0,0,w,h);const m=h/2;x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=1;x.beginPath();x.moveTo(0,m);x.lineTo(w,m);x.stroke();
 const col=wingMode==='res'||wingMode==='damp'?'#ff9b64':'#74d7ff';x.strokeStyle=col;x.lineWidth=1;
 for(let px=0;px<w;px++){let i0=Math.floor(px/w*NS),i1=Math.floor((px+1)/w*NS),lo=1e9,hi=-1e9;for(let i=i0;i<i1;i++){let v;if(wingMode==='res'||wingMode==='damp')v=RESP[wingMode][i]/NORM;else v=Math.sin(2*Math.PI*(wingMode==='1'?3.22:20.18)*i*DT)*.8;if(v<lo)lo=v;if(v>hi)hi=v}x.beginPath();x.moveTo(px+.5,m-hi*(m-4));x.lineTo(px+.5,m-lo*(m-4)+.5);x.stroke()}
 x.fillStyle='rgba(128,153,168,.9)';x.font='10px Inter,Arial,sans-serif';x.fillText('0 s',2,h-3);x.textAlign='right';x.fillText('6 s',w-2,h-3);x.textAlign='left';
 traceImg=x.getImageData(0,0,trc.width,trc.height)}
function drawCursor(){if(!traceImg||traceImg.width!==trc.width)drawTrace();let x=trc.getContext('2d');x.setTransform(1,0,0,1,0,0);x.putImageData(traceImg,0,0);let d=Math.min(devicePixelRatio||1,2);x.setTransform(d,0,0,d,0,0);let w=trc.width/d,h=trc.height/d,px=Math.min(tau,TT)/TT*w;x.strokeStyle='rgba(234,241,245,.7)';x.lineWidth=1;x.beginPath();x.moveTo(px,0);x.lineTo(px,h);x.stroke()}

/* one loop drives the cover and wing only while their page is visible */
const heroPage=pages.indexOf(hc.closest('.page')),wingPage=pages.indexOf(wc.closest('.page'));
function loop(t){let dt=last?Math.min(.05,(t-last)/1000):0;last=t;if(page===heroPage)hero();if(page===wingPage)wing(dt);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
addEventListener('resize',()=>{streaks=[];traceImg=null;if(page===heroPage)hero()});

/* ---------- 10 Electric propulsion: original V2 code, unchanged ---------- */
function fit(c){let r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;let x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return [x,r.width,r.height]}
const pc=document.querySelector('#plasma');let atoms=[],electrons=[],ions=[],flashes=[];function reset(){let r=pc.getBoundingClientRect();atoms=Array.from({length:26},()=>({x:Math.random()*r.width*.42,y:50+Math.random()*(r.height-100),v:.25+Math.random()*.3}));electrons=Array.from({length:15},()=>({x:Math.random()*r.width,y:Math.random()*r.height,v:1.8+Math.random()*1.5,dy:(Math.random()-.5)*1.2}));ions=[]}reset();function plasma(){let[x,w,h]=fit(pc);x.clearRect(0,0,w,h);x.strokeStyle='#ffb07033';for(let i=0;i<6;i++){let yy=h*.25+i*h*.1;x.beginPath();x.moveTo(w*.5,yy);x.lineTo(w*.94,yy);x.stroke()}atoms.forEach(a=>{a.x+=a.v;if(a.x>w*.58)a.x=5;x.strokeStyle='#b7d9e7';x.lineWidth=1.5;x.beginPath();x.arc(a.x,a.y,7,0,7);x.stroke()});electrons.forEach(e=>{e.x+=e.v;e.y+=e.dy;if(e.x>w){e.x=0;e.y=Math.random()*h}x.fillStyle='#77dcff';x.beginPath();x.arc(e.x,e.y,2.3,0,7);x.fill();for(let a of atoms){let dx=e.x-a.x,dy=e.y-a.y;if(a.x<w*.58&&dx*dx+dy*dy<70&&Math.random()<.035){flashes.push({x:a.x,y:a.y,t:1});ions.push({x:a.x,y:a.y,v:1.2});a.x=-30;e.x-=12;electrons.push({x:e.x,y:e.y,v:2.4,dy:-e.dy})}}});ions.forEach(i=>{i.v+=.025;i.x+=i.v;x.fillStyle='#ff9d68';x.strokeStyle='#ffd0b5';x.beginPath();x.arc(i.x,i.y,6,0,7);x.fill();x.stroke();x.fillStyle='#35160b';x.font='9px Arial';x.fillText('+',i.x-2.5,i.y+3)});ions=ions.filter(i=>i.x<w+20);flashes.forEach(f=>{f.t-=.035;x.strokeStyle=`rgba(255,210,130,${f.t})`;x.lineWidth=2;x.beginPath();x.arc(f.x,f.y,(1-f.t)*32,0,7);x.stroke();x.beginPath();for(let k=0;k<8;k++){let a=k*Math.PI/4,r=(1-f.t)*42;x.moveTo(f.x,f.y);x.lineTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r)}x.stroke()});flashes=flashes.filter(f=>f.t>0);x.fillStyle='#a9c3d0';x.font='11px Arial';x.fillText('NEUTRAL Xe',18,25);x.fillStyle='#ffb070';x.fillText('IONISATION / ACCELERATION',w*.55,25);requestAnimationFrame(plasma)}plasma();
window.addEventListener('resize',()=>{reset()});
