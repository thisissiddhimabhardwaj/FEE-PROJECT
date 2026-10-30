import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowDown,ArrowUpRight,MoveHorizontal} from 'lucide-react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {dateLabel} from '../data/demo';
import {useStore} from '../store';

gsap.registerPlugin(ScrollTrigger);

function ElasticHeadline({reduced}) {
  const word=useRef(),drag=useRef(null),releaseTimer=useRef();
  const letters=()=>Array.from(word.current.querySelectorAll('.elastic-letter'));
  function pull(dx,dy) {
    const chars=letters();gsap.killTweensOf(chars);
    chars.forEach((char,i)=>{
      const weight=Math.sin((i+1)/(chars.length+1)*Math.PI);
      gsap.set(char,{x:dx*weight,y:dy*weight,rotation:dx*.06*weight,scaleY:1+Math.abs(dy)*.003*weight});
    });
  }
  function release(){drag.current=null;gsap.to(letters(),{x:0,y:0,rotation:0,scaleY:1,duration:reduced?0:1.35,ease:'elastic.out(1, 0.3)',stagger:.015})}
  useEffect(()=>()=>{clearTimeout(releaseTimer.current);if(word.current)gsap.killTweensOf(word.current.querySelectorAll('.elastic-letter'))},[]);
  return <h2 className="passage-headline">Don’t hear about it<br/><button ref={word} className="elastic-word" aria-label="the next day. Stretch this headline with a drag, or press Enter to bounce it."
    onPointerDown={e=>{if(reduced||e.pointerType==='touch')return;drag.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}}
    onPointerMove={e=>{if(!drag.current)return;pull(gsap.utils.clamp(-100,100,e.clientX-drag.current.x),gsap.utils.clamp(-55,55,e.clientY-drag.current.y))}}
    onPointerUp={release} onPointerCancel={release} onLostPointerCapture={()=>{if(drag.current)release()}}
    onClick={e=>{if(e.detail!==0||reduced)return;pull(42,-28);clearTimeout(releaseTimer.current);releaseTimer.current=setTimeout(release,100)}}>
    <span className="sr-only">the next day.</span><span aria-hidden="true">{Array.from('the next day.').map((letter,i)=><span className="elastic-letter" key={i}>{letter===' '?'\u00a0':letter}</span>)}</span>
  </button></h2>;
}

/** Original CSS-3D passage; no licensed React Bits Pro source is included. */
export default function EventPassage({reduced}) {
  const {data}=useStore();const events=data.events.slice(0,8);
  const section=useRef(),world=useRef(),meter=useRef(),count=useRef(),[active,setActive]=useState(0);
  useEffect(()=>{
    const media=gsap.matchMedia();
    media.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)',()=>{
      const cards=Array.from(world.current.querySelectorAll('.passage-frame'));
      const render=p=>{
        let nearest=Infinity,selected=0;
        cards.forEach((card,i)=>{
          const z=-100-i*480+p*(cards.length-1)*480;
          const side=i%2===0?-1:1;
          const x=side*window.innerWidth*.24;
          const y=(i%4<2?-1:1)*window.innerHeight*.075;
          const opacity=gsap.utils.clamp(0,1,(z+2200)/650)*gsap.utils.clamp(0,1,(260-z)/200);
          gsap.set(card,{x,y,z,rotationY:side*-12,rotationZ:side*3,opacity,visibility:opacity>.015?'visible':'hidden'});
          // Invisible frames must also leave the keyboard sequence.
          card.tabIndex=opacity>.15?0:-1;
          card.setAttribute('aria-hidden',opacity>.15?'false':'true');
          const distance=Math.abs(z+350);if(z<100&&distance<nearest){nearest=distance;selected=i}
        });
        setActive(v=>v===selected?v:selected);
        if(meter.current)meter.current.style.transform=`scaleX(${p})`;
        if(count.current)count.current.textContent=`${String(selected+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
      };
      render(0);
      ScrollTrigger.create({id:'event-passage',trigger:section.current,start:'top top',end:()=>`+=${Math.max(2000,window.innerHeight*3)}`,pin:true,scrub:true,invalidateOnRefresh:true,onUpdate:s=>render(s.progress),onRefresh:s=>render(s.progress)});
      return()=>{cards.forEach(card=>{card.removeAttribute('style');card.removeAttribute('tabindex');card.removeAttribute('aria-hidden')})};
    });
    return()=>media.revert();
  },[data.events]);
  return <section id="next-memory" className="event-passage" ref={section} aria-label="Upcoming campus experiences">
    <div className="passage-meta"><span>03 / YOUR NEXT MEMORY</span><Link to="/events">THE FULL CALENDAR <ArrowUpRight size={14}/></Link></div>
    <div className="passage-heading"><div><ElasticHeadline reduced={reduced}/><span className="elastic-hint"><MoveHorizontal size={12}/> GRAB THE WORDS. LET GO. SHOW UP.</span></div><p>Some moments deserve<br/>more than a secondhand story.<br/><strong>Be there for yours.</strong></p></div>
    <div className="passage-stage"><div className="passage-axis" aria-hidden="true"><span>BE<br/><em>there.</em></span><ArrowDown size={18}/></div><div className="passage-world" ref={world}>
      {events.map((event,i)=><Link key={event.id} to={`/events/${event.id}`} className="passage-frame" aria-label={`Explore ${event.title}`}><div className="passage-frame-image"><img src={event.image} alt={event.title} loading="lazy"/><span className="passage-date">{dateLabel(event.date)}</span><span className="passage-open"><ArrowUpRight size={20}/></span></div><div className="passage-caption"><span>{String(i+1).padStart(2,'0')} / {event.category}</span><h3>{event.title}</h3></div></Link>)}
    </div></div>
    <div className="passage-bottom"><div><span className="passage-counter" ref={count}>01 / {String(events.length).padStart(2,'0')}</span><span className="passage-current">{events[active]?.title}</span></div><span className="passage-scroll">SCROLL THROUGH WHAT’S NEXT <ArrowDown size={13}/></span><Link to="/events" className="passage-cta">Make it a plan <ArrowUpRight size={16}/></Link></div>
    <div className="passage-meter" aria-hidden="true"><i ref={meter}/></div>
  </section>;
}
