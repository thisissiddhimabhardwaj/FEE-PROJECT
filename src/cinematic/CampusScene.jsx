import React,{useMemo,useRef,useEffect,useState,Component} from 'react';
import {Canvas,useFrame,useThree} from '@react-three/fiber';
import {Html,Billboard,useTexture,useCursor} from '@react-three/drei';
import * as THREE from 'three';
import {Link} from 'react-router-dom';

const colors={stone:'#b7b7b1',trim:'#d4d4ce',glass:'#303739',dark:'#535959',warm:'#aaa18d',paving:'#777b77'};
function campusGeometry(){const parts={};const box=(m,x,y,z,w,h,d)=>{(parts[m]??=[]).push({p:[x,y,z],s:[w,h,d]})};
function block(x,z,w,h,d,columns=6){box('stone',x,h/2,z,w,h,d);box('trim',x,h+.16,z,w+.6,.32,d+.6);box('dark',x,h+.5,z,w*.7,.4,d*.7);for(let side of [-1,1]){for(let row=0;row<Math.floor(h/3);row++){for(let col=0;col<columns;col++){let wx=x-w/2+(col+.5)*w/columns;box('glass',wx,1.6+row*3,z+side*(d/2+.03),w/columns*.64,2.1,.10);box('trim',wx,2.75+row*3,z+side*(d/2+.17),w/columns*.75,.10,.40)}}}for(let side of [-1,1])for(let i=0;i<Math.floor(d/3);i++){for(let row=0;row<Math.floor(h/3);row++)box('glass',x+side*(w/2+.03),1.6+row*3,z-d/2+(i+.5)*3,.08,2,1.7)}box('dark',x,.2,z,w+.4,.4,d+.4)}
// Main hall: a real open portico, visible interior, and tall structural piers.
block(-12,-15,9,15,16,4);block(12,-15,9,15,16,4);block(0,-24,16,13,7,7);
box('stone',0,16,-10,33,2,8);box('trim',0,17.1,-10,34,.25,9);
for(let x=-7.5;x<=7.5;x+=3){box('trim',x,7.3,-6.4,.65,14.6,.8);box('glass',x+1.35,7.1,-8.5,2,12,.14);for(let y=1;y<14;y+=2.7)box('dark',x+1.35,y,-8.4,2,.08,.17)}
box('paving',0,.15,-14,16,.3,17);box('trim',0,14.8,-14,16,.3,16);
for(let x of [-5,5])for(let z of [-12,-18])box('stone',x,6,z,.5,12,.5);
// Lobby artwork and inner corridor.
box('dark',0,5,-25,6,9,.4);box('warm',0,5,-24.7,3,6,.2);for(let z=-30;z>-50;z-=6){box('trim',-7,6,z,.6,12,.6);box('trim',7,6,z,.6,12,.6);box('paving',0,0,z,15,.2,7)}
// Campus wings, terraces, connecting walkways.
block(-33,-8,21,9,12,8);block(34,-7,21,12,13,8);block(-49,-29,19,10,13,7);block(45,-31,23,9,14,8);block(-18,-42,18,12,10,7);block(19,-43,20,10,12,8);block(0,-51,14,9,9,5);
block(-40,25,19,6,14,7);block(40,28,17,7,14,6);block(-60,5,14,6,23,5);block(61,-4,15,8,25,5);
for(let x of [-23,23]){box('paving',x,4.4,-9,14,.5,3);box('glass',x,5.5,-7.6,14,1.8,.12);box('glass',x,5.5,-10.4,14,1.8,.12);box('trim',x,6.6,-9,14,.3,3.4);for(let j=-5;j<7;j+=2)box('trim',x+j,5.5,-7.4,.1,2,.1)}
// Ground, stepped central axis, water gardens, boundaries.
box('paving',0,-1.5,-4,142,2,117);box('stone',0,-.3,8,37,.5,19);
for(let i=0;i<13;i++){box('trim',0,-.6+i*.12,17-i*.55,19,.22,.64);box('trim',0,-1.0+i*.1,40-i*.65,16,.2,.75)}
box('stone',0,-.5,26,18,.4,15);box('stone',0,-1,48,19,.4,13);
for(let side of [-1,1]){box('dark',side*21,-.38,29,20,.1,28);for(let x of [-10,10])box('trim',side*21+x,-.1,29,.35,.5,28);for(let z of [15,43])box('trim',side*21,-.1,z,20,.5,.4);box('trim',side*21,.05,29,21,.35,2);for(let x of [-9,9]){box('dark',side*21+x,1,29,.08,1.7,.08)} }
for(let side of [-1,1])for(let z of [4,50]){box('trim',side*27,.1,z,35,.3,3);for(let x=-16;x<17;x+=4){box('dark',side*27+x,1,z+1.2,.08,1.8,.08)}box('trim',side*27,1.8,z+1.2,35,.07,.08)}
// Long benches, planters, bollards.
for(let x of [-11,11,-38,38])for(let z of [1,10,20,40]){box('dark',x,.3,z,2.3,.6,2.3);box('stone',x,0,z+3,3,.6,1)}
for(let x of [-9,9])for(let z=4;z<51;z+=6){box('dark',x,.65,z,.15,1.4,.15);box('warm',x,1.4,z,.22,.2,.22)}
// Clock tower and observatory.
box('stone',-28,11,-39,4,22,4);box('trim',-28,22.2,-39,4.8,.35,4.8);box('glass',-28,17,-36.96,2,3,.1);
// Distant sports grandstand.
for(let i=0;i<6;i++)box('stone',-48,i*.45,-52+i*1.1,35,.4,1.2);
for(let x of [-64,-32]){box('dark',x,8,-52,.18,16,.18);box('trim',x,16,-52,2,.7,.4)}
return parts}
function Instances({items,color}){const ref=useRef();useEffect(()=>{const o=new THREE.Object3D();items.forEach((b,i)=>{o.position.set(...b.p);o.scale.set(...b.s);o.updateMatrix();ref.current.setMatrixAt(i,o.matrix)});ref.current.instanceMatrix.needsUpdate=true},[items]);return <instancedMesh ref={ref} args={[null,null,items.length]} castShadow receiveShadow><boxGeometry/><meshStandardMaterial color={color} roughness={.86}/></instancedMesh>}
function Trees(){const ref=useRef(),trunks=useRef();const trees=useMemo(()=>Array.from({length:140},(_,i)=>{let x=(Math.sin(i*32.7)*.5+.5)*126-63,z=(Math.sin(i*17.8+4)*.5+.5)*99-46;if(Math.abs(x)<34&&z>-24&&z<45)x=Math.sign(x||1)*(34+Math.abs(x)*.4);if(Math.abs(x)>28&&z<-3&&z>-18)z=4;return [x,z,1.1+(i%5)*.25]}),[]);useEffect(()=>{const o=new THREE.Object3D();trees.forEach(([x,z,s],i)=>{o.position.set(x,3.2*s,z);o.scale.set(s*2,s*2.3,s*2);o.rotation.set(i*.3,i*.7,0);o.updateMatrix();ref.current.setMatrixAt(i,o.matrix);o.position.set(x,1.1*s,z);o.scale.set(.23,2.3*s,.23);o.updateMatrix();trunks.current.setMatrixAt(i,o.matrix)});ref.current.instanceMatrix.needsUpdate=true;trunks.current.instanceMatrix.needsUpdate=true},[trees]);return <><instancedMesh ref={ref} args={[null,null,trees.length]} castShadow receiveShadow><icosahedronGeometry args={[1,1]}/><meshStandardMaterial color="#424b43" roughness={1}/></instancedMesh><instancedMesh ref={trunks} args={[null,null,trees.length]}><cylinderGeometry/><meshStandardMaterial color="#64655a"/></instancedMesh></>}
function Details(){return <>{[-21,21].map(x=><mesh key={x} position={[x,-.25,29]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[19,27]}/><meshStandardMaterial color="#202e30" metalness={.65} roughness={.22}/></mesh>)}<mesh position={[-28,19,-36.85]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[1,1,.06,32]}/><meshStandardMaterial color="#dddcd3"/></mesh><mesh position={[-28,19.3,-36.75]} rotation={[0,0,-.4]}><boxGeometry args={[.06,.8,.08]}/><meshStandardMaterial color="#343a3b"/></mesh><mesh position={[56,10,-40]}><sphereGeometry args={[5,20,12,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color="#b7b7b1"/></mesh><mesh position={[-48,-.4,-52]} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[34,17]}/><meshStandardMaterial color="#4a504a"/></mesh></>}
const positions=[[-44,20,-5],[35,22,-24],[-31,12,27],[31,13,35],[0,24,-34]];
const names=['COMMUNITY','INNOVATION','CULTURE','AFTER HOURS','ACADEMICS'];
function CampusPhoto({position,index,progress}) {
  const texture=useTexture(`/images/${['gathering','workshop','culture','community','library'][index]}.jpg`);
  const group=useRef(),[hovered,setHovered]=useState(false);
  useCursor(hovered);
  useEffect(()=>{texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true},[texture]);
  const width=7,height=width/(texture.image.width/texture.image.height);
  useFrame(()=>{
    // Once the camera enters the lobby, exterior photographs leave the journey.
    group.current.visible=progress.current<.7;
    const scale=hovered?1.06:1;
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x,scale,.12));
  });
  return <group ref={group} position={position}>
    <Billboard>
      <group onPointerOver={()=>setHovered(true)} onPointerOut={()=>setHovered(false)} onClick={e=>{e.stopPropagation();window.location.assign(`/events/e${index}`)}}>
        <mesh position={[0,0,-.035]}><planeGeometry args={[width+.25,height+.25]}/><meshBasicMaterial color="#c6cbc2" side={THREE.DoubleSide}/></mesh>
        <mesh><planeGeometry args={[width,height]}/><meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide}/></mesh>
      </group>
      <Html position={[0,height/2+.45,0]} center occlude distanceFactor={80} zIndexRange={[10,1]}>
        <a href={`/events/e${index}`} className="spatial-caption">{names[index]} ↗</a>
      </Html>
    </Billboard>
  </group>;
}
function FloatingPhotos({progress}){return <>{positions.map((position,index)=><CampusPhoto key={index} position={position} index={index} progress={progress}/>)}{[[[-48,2,-4],'01 / LIBRARY'],[[0,18,-7],'02 / MAIN ACADEMIC BLOCK'],[[38,2,2],'03 / STUDENT CENTRE']].map(([p,t])=><Html key={t} position={p} center occlude distanceFactor={120} zIndexRange={[4,0]}><span className="building-label">{t}</span></Html>)}</>}
function Atmosphere({intro,progress}){const ref=useRef();const [points,targets]=useMemo(()=>{let a=new Float32Array(1500),b=new Float32Array(1500);for(let i=0;i<500;i++){a.set([(Math.sin(i*93)*.5)*155,3+(Math.sin(i*31)*.5+.5)*65,(Math.cos(i*74)*.5)*130],i*3);b.set([Math.sin(i*93)*26,Math.abs(Math.sin(i*31))*16,-15+Math.cos(i*74)*12],i*3)}return [a,b]},[]);useFrame(({clock})=>{const a=ref.current.geometry.attributes.position.array;const t=intro.current;for(let i=0;i<500;i++){for(let j=0;j<3;j++){a[i*3+j]=THREE.MathUtils.lerp(points[i*3+j],targets[i*3+j],t<.8?Math.sin(t*Math.PI)*.65:0)+(j===1?Math.sin(clock.elapsedTime*.2+i)*.3:0)}}ref.current.geometry.attributes.position.needsUpdate=true;ref.current.material.opacity=.3*(1-progress.current*.8)});return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[points.slice(),3]}/></bufferGeometry><pointsMaterial size={.14} transparent opacity={.3} color="white" sizeAttenuation/></points>}
const path=new THREE.CatmullRomCurve3([new THREE.Vector3(73,49,86),new THREE.Vector3(30,28,64),new THREE.Vector3(4,13,39),new THREE.Vector3(0,5,14),new THREE.Vector3(0,4,-4),new THREE.Vector3(0,4,-17),new THREE.Vector3(0,4,-38)]);
function Rig({progress,reduced,intro,skip}){const {camera}=useThree();const target=new THREE.Vector3();useFrame(({clock})=>{intro.current=skip?1:Math.min(1,clock.elapsedTime/3.4);const p=reduced?0:Math.min(.999,progress.current);const pos=path.getPointAt(p);camera.position.copy(pos);target.set(0,p>.65?4:2,-12-p*29);camera.lookAt(target);camera.fov=THREE.MathUtils.lerp(39,56,p);camera.updateProjectionMatrix()});return null}
function World({progress,reduced,skip}){const geometry=useMemo(campusGeometry,[]),intro=useRef(0),group=useRef();useFrame(()=>{group.current.scale.y=.03+.97*THREE.MathUtils.smoothstep(intro.current,0,.95)});return <><color attach="background" args={['#0b0d0e']}/><fog attach="fog" args={['#0b0d0e',100,260]}/><ambientLight intensity={1.25}/><hemisphereLight args={['#ededdf','#353b41',1.6]}/><directionalLight position={[-35,65,35]} intensity={3.8} castShadow shadow-mapSize={[2048,2048]} shadow-camera-left={-90} shadow-camera-right={90} shadow-camera-top={85} shadow-camera-bottom={-80} shadow-bias={-.001}/><directionalLight position={[40,20,-40]} intensity={1.5}/><group ref={group}>{Object.entries(geometry).map(([m,items])=><Instances key={m} items={items} color={colors[m]}/>)}<Trees/><Details/></group><Atmosphere intro={intro} progress={progress}/><FloatingPhotos progress={progress}/><Rig progress={progress} reduced={reduced} intro={intro} skip={skip}/></>}
class SceneBoundary extends Component{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<div className="webgl-fallback"><p>There’s a whole campus waiting.</p><span>The 3D view isn’t available on this device. All campus stories and features are still accessible.</span><Link to="/explore" className="pill">Explore campus ↗</Link></div>:this.props.children}}
export default function CampusScene({progress,reduced,skip}){return <SceneBoundary><Canvas shadows dpr={[1,1.5]} gl={{antialias:true,powerPreference:'high-performance'}} camera={{position:[73,49,86],fov:39,near:.1,far:400}}><World progress={progress} reduced={reduced} skip={skip}/></Canvas></SceneBoundary>}
