(function(root){
const W=768,H=512,DURATION=3200;let layout={};
const clamp=x=>Math.max(0,Math.min(1,x)),lerp=(a,b,p)=>a+(b-a)*p,cubic=x=>1-(1-x)**3,back=x=>1+2.70158*(x-1)**3+1.70158*(x-1)**2;
const top=['mo_1','du','mo_2','yeo'],bottom=['word_backplate','tap','pa','ti','bang'],mascots=['ghost','chick','crown'];
function configure(assets){layout=assets;}
function states(timeMs){const t=Math.max(0,timeMs),out=[];
for(const[id,a]of Object.entries(layout)){let x=a.x,y=a.y,s=1,opacity=1,z=0,p;
 if(top.includes(id)){p=clamp((t-100-top.indexOf(id)*155)/420);if(!p)continue;y+=(1-back(p))*42;z=20;opacity=Math.min(1,p*8);}
 else if(bottom.includes(id)){p=clamp((t-1080)/430);if(!p)continue;s=p<.46?lerp(.22,1.08,cubic(p/.46)):p<.73?lerp(1.08,.98,(p-.46)/.27):lerp(.98,1,(p-.73)/.27);const cx=430,cy=318;x=cx+(x-cx)*s;y=cy+(y-cy)*s+(1-back(p))*18;z=id==='word_backplate'?21:22;opacity=Math.min(1,p*10);}
 else if(mascots.includes(id)){p=clamp((t-(1180+mascots.indexOf(id)*80))/520);if(!p)continue;y+=(1-back(p))*38;s=lerp(.7,1,back(p));z=12;opacity=Math.min(1,p*8);}
 else if(id==='cursor'){p=clamp((t-1600)/480);if(!p)continue;y+=(1-back(p))*20;const tap=t>1840&&t<2180?Math.sin((t-1840)/340*Math.PI*2)**2:0;y+=tap*4;s=lerp(.9,1,cubic(p));z=30;opacity=Math.min(1,p*8);}
 else if(id==='tap_ring'){p=clamp((t-1840)/430);if(!p)continue;s=lerp(.65,1,back(p));z=25;opacity=Math.min(1,p*8);}
 else{const i=Object.keys(layout).indexOf(id);p=clamp((t-1090-(i%5)*35)/660);if(!p)continue;const e=cubic(p);x=lerp(384,x,e);y=lerp(290,y,e)-Math.sin(p*Math.PI)*22;s=p<.28?lerp(.15,1.12,p/.28):lerp(1.12,1,(p-.28)/.72);opacity=Math.min(1,p*8);z=0;}
 out.push({id,key:id,x,y,size:Math.max(a.width,a.height),z,scale:s,opacity});
}
return out.sort((a,b)=>a.z-b.z);}
function createPlayer(canvas,images,options={}){const ctx=canvas.getContext('2d');let raf=0,start=0,stopped=false;canvas.width=W;canvas.height=H;
function render(ms){ctx.clearRect(0,0,W,H);ctx.imageSmoothingEnabled=false;for(const s of states(ms)){const im=images[s.id],w=im.naturalWidth||im.width,h=im.naturalHeight||im.height,r=s.size/Math.max(w,h)*s.scale,dw=Math.max(1,Math.round(w*r)),dh=Math.max(1,Math.round(h*r));ctx.globalAlpha=s.opacity;ctx.drawImage(im,Math.round(s.x-dw/2),Math.round(s.y-dh/2),dw,dh);}ctx.globalAlpha=1;}
function tick(now){if(stopped)return;const elapsed=now-start;render(options.loop?elapsed%(DURATION+800):Math.min(elapsed,DURATION));if(options.loop||elapsed<DURATION)raf=requestAnimationFrame(tick);else options.onComplete?.();}
return {render,play(){cancelAnimationFrame(raf);stopped=false;start=performance.now();raf=requestAnimationFrame(tick);},stop(){stopped=true;cancelAnimationFrame(raf);},finish(){this.stop();render(DURATION);}};}
async function loadAssets(baseUrl='./'){const base=baseUrl.endsWith('/')?baseUrl:baseUrl+'/',response=await fetch(base+'assets.json');if(!response.ok)throw new Error('Logo metadata could not load');const meta=await response.json(),images={};configure(meta.assets);await Promise.all(Object.entries(meta.assets).map(([id,a])=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[id]=im;resolve();};im.onerror=()=>reject(new Error('Logo image could not load: '+id));im.src=base+a.file;})));return images;}
const API={width:W,height:H,durationMs:DURATION,configure,states,createPlayer,loadAssets};if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.TapPartyIntro=API;
})(typeof window!=='undefined'?window:globalThis);

