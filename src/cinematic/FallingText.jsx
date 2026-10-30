import {useEffect,useRef,useState} from 'react';
import gsap from 'gsap';

/** Original, bounded word physics. No external component source or license required. */
export default function FallingText({text,highlightWords=[],gravity=1,restoreDelay=2,reduced=false}) {
  const field=useRef(),frame=useRef(),timer=useRef(),running=useRef(false);
  const [active,setActive]=useState(false);
  const words=text.split(' ');
  function reset(animate=true){
    cancelAnimationFrame(frame.current);clearTimeout(timer.current);
    if(!field.current)return;
    const elements=field.current.querySelectorAll('.falling-word');
    gsap.killTweensOf(elements);
    if(animate){gsap.to(elements,{x:0,y:0,rotation:0,duration:.8,ease:'power3.inOut',stagger:.018,onComplete:()=>{running.current=false;setActive(false)}})}
    else{gsap.set(elements,{clearProps:'transform'});running.current=false;setActive(false)}
  }
  function fall(){
    if(reduced||running.current||!field.current)return;
    running.current=true;setActive(true);
    const area=field.current.getBoundingClientRect();
    const bodies=Array.from(field.current.querySelectorAll('.falling-word')).map((el,i)=>{
      const box=el.getBoundingClientRect();
      return {el,x:box.left-area.left,y:box.top-area.top,ox:box.left-area.left,oy:box.top-area.top,w:box.width,h:box.height,vx:Math.sin(i*13.7)*110,vy:-70-(i%4)*20,angle:0,spin:Math.sin(i*3.1)*16};
    });
    let last=0;
    const tick=time=>{
      const dt=last?Math.min((time-last)/1000,.032):.016;last=time;
      for(const b of bodies){
        b.vy+=900*gravity*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.angle+=b.spin*dt;
        if(b.x<8){b.x=8;b.vx=Math.abs(b.vx)*.5}
        if(b.x+b.w>area.width-8){b.x=Math.max(8,area.width-8-b.w);b.vx=-Math.abs(b.vx)*.5}
        if(b.y+b.h>area.height-15){b.y=area.height-15-b.h;b.vy=-Math.abs(b.vy)*.36;b.vx*=.95;b.spin*=.8}
        if(b.y<8){b.y=8;b.vy=Math.abs(b.vy)}
      }
      // Resolve overlapping word boxes so they collect rather than pass through one another.
      for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
        const a=bodies[i],b=bodies[j],dx=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),dy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);
        if(dx>0&&dy>0){if(dy<dx){const direction=a.y<b.y?-1:1;a.y+=direction*dy*.5;b.y-=direction*dy*.5;const v=a.vy;a.vy=b.vy*.4;b.vy=v*.4}else{const direction=a.x<b.x?-1:1;a.x+=direction*dx*.5;b.x-=direction*dx*.5;const v=a.vx;a.vx=b.vx*.4;b.vx=v*.4}}
      }
      for(const b of bodies){b.x=gsap.utils.clamp(8,Math.max(8,area.width-8-b.w),b.x);b.y=gsap.utils.clamp(8,area.height-15-b.h,b.y);gsap.set(b.el,{x:b.x-b.ox,y:b.y-b.oy,rotation:gsap.utils.clamp(-12,12,b.angle)})}
      frame.current=requestAnimationFrame(tick);
    };
    frame.current=requestAnimationFrame(tick);
    timer.current=setTimeout(()=>reset(true),restoreDelay*1000);
  }
  useEffect(()=>{
    const onResize=()=>reset(false);
    window.addEventListener('resize',onResize);
    const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting&&running.current)reset(false)});
    observer.observe(field.current);
    return()=>{observer.disconnect();window.removeEventListener('resize',onResize);cancelAnimationFrame(frame.current);clearTimeout(timer.current);if(field.current)gsap.killTweensOf(field.current.querySelectorAll('.falling-word'))};
  },[]);
  return <div className="falling-interlude"><div className="falling-label"><span>THE BEAUTY OF NOT HAVING IT ALL FIGURED OUT</span><span aria-hidden="true">{reduced?'A MOMENT BETWEEN CHAPTERS':active?'LET IT HAPPEN.':'HOVER, TAP, OR PRESS ENTER ↘'}</span></div>
    <button ref={field} className="falling-field" disabled={reduced} aria-label={`${text} ${reduced?'':'Activate to let the words fall; they restore automatically.'}`} onPointerEnter={e=>{if(e.pointerType==='mouse')fall()}} onClick={fall}>
      <span aria-hidden="true">{words.map((word,i)=><span className={`falling-word ${highlightWords.includes(word.replace(/[.,!?]/g,''))?'highlighted':''}`} key={i}>{word}</span>)}</span>
    </button><span className="falling-footnote">PLANS ARE TEMPORARY. THE MEMORIES STAY.</span>
  </div>;
}
