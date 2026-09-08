import React,{useMemo,useRef,useEffect} from 'react';
import {Canvas,useThree} from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';
import * as THREE from 'three';
import type {Mechanism} from './MechanismViewer';
type V=[number,number,number];
interface Props{system:Mechanism;time:number;speed:number;cutaway:boolean;selected:string;reset:number;onSelect:(s:string)=>void}
const steel='#839b9d',amber='#e2a979',blue='#4cd8ef',ground='#172723';
const R=60;
const pose=(s:number)=>({x:R*Math.sin(s/R),z:R*(1-Math.cos(s/R)),a:-s/R});
function Block({at,size,color=steel,opacity=1}:{at:V;size:V;color?:string;opacity?:number}){return <mesh position={at}><boxGeometry args={size}/><meshStandardMaterial color={color} transparent={opacity<1} opacity={opacity} roughness={.65}/></mesh>}
function Pipe({points,color=blue,r=.1}:{points:V[];color?:string;r?:number}){
 const geo=useMemo(()=>new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),32,r,8,false),[JSON.stringify(points),r]);
 useEffect(()=>()=>geo.dispose(),[geo]);return <mesh geometry={geo}><meshStandardMaterial color={color} roughness={.3} metalness={.4}/></mesh>
}
function Wheel({at,angle,r=.45,color=steel}:{at:V;angle:number;r?:number;color?:string}){return <group position={at} rotation={[0,0,angle]}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[r,r,.25,24]}/><meshStandardMaterial color={color} metalness={.7} roughness={.35}/></mesh><Block at={[0,0,.15]} size={[r*1.7,.07,.05]} color={amber}/></group>}
function Gear({at,r,angle,teeth}:{at:V;r:number;angle:number;teeth:number}){return <group position={at} rotation={[0,0,angle]}><mesh rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[r,r,.22,32]}/><meshStandardMaterial color={amber} metalness={.65} roughness={.35}/></mesh>{Array.from({length:teeth},(_,i)=>{const a=i/teeth*Math.PI*2;return <group key={i} position={[r*Math.cos(a),r*Math.sin(a),0]} rotation={[0,0,a]}><Block at={[.03,0,0]} size={[.16,.12,.24]} color={amber}/></group>})}<mesh position={[0,0,.16]}><sphereGeometry args={[.1,12,8]}/><meshStandardMaterial color="#20352f"/></mesh></group>}
function Track({z=0,color=steel}:{z?:number;color?:string}){const points:V[]=Array.from({length:31},(_,i)=>{const a=(-15+i)/R;return [(R-z)*Math.sin(a),.28,R-(R-z)*Math.cos(a)]});return <Pipe points={points} r={.12} color={color}/>}
function Tank({sewage,transparent,time}:{sewage:boolean;transparent:boolean;time:number}){return <group position={[0,2.65,0]}><mesh><cylinderGeometry args={[1.2,1.2,2.2,32]}/><meshStandardMaterial color={sewage?'#b48968':'#adddea'} transparent opacity={transparent?.2:1} side={THREE.DoubleSide}/></mesh><mesh position={[0,-.3,0]}><cylinderGeometry args={[1.13,1.13,1.5,32]}/><meshStandardMaterial color={sewage?'#bc9664':blue} transparent opacity={.7}/></mesh><mesh position={[0,1.15,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.2,.08,8,32]}/><meshStandardMaterial color={steel}/></mesh></group>}
function Person({at,walk}:{at:V;walk:number}){return <group position={at}><mesh position={[0,1.45,0]}><sphereGeometry args={[.19,16,12]}/><meshStandardMaterial color="#eddcc4"/></mesh><Block at={[0,.95,0]} size={[.4,.6,.26]} color={amber}/>{[-1,1].map(s=><group key={s} position={[s*.11,.68,0]} rotation={[Math.sin(walk)*.35*s,0,0]}><Block at={[0,-.29,0]} size={[.13,.58,.14]} color="#a9b8bd"/></group>)}</group>}
function Model(p:Props){
 const {system,time,speed,cutaway,selected,onSelect}=p;
 const utility=system==='water'||system==='sewage',sewage=system==='sewage';
 const cycle=12/speed,phase=(time%cycle)/cycle,s=-6+phase*12,pos=pose(s);
 const carS=phase<.25?-3:phase<.75?s:3-6*(phase-.75)/.25,car=pose(carS),connected=phase>=.25&&phase<.75;
 const c=(id:string,base:string)=>selected===id?'#ffffff':base;
 const selectable=(id:string)=>({onClick:(e:any)=>{e.stopPropagation();onSelect(id)}});
 const lineColor=sewage?'#dcad74':blue;
 const movingTip=new THREE.Vector3(0,1.85,3.5).applyAxisAngle(new THREE.Vector3(0,1,0),pos.a).add(new THREE.Vector3(pos.x,0,pos.z));
 const carriageTip=new THREE.Vector3(0,1.85,3.5).applyAxisAngle(new THREE.Vector3(0,1,0),car.a).add(new THREE.Vector3(car.x,0,car.z));
 const C=(v:V)=>new THREE.Vector3(...v).applyAxisAngle(new THREE.Vector3(0,1,0),car.a).add(new THREE.Vector3(car.x,0,car.z));
 const M=(v:V)=>new THREE.Vector3(...v).applyAxisAngle(new THREE.Vector3(0,1,0),pos.a).add(new THREE.Vector3(pos.x,0,pos.z));
 const fixedHose:V[]=[[0,.95,9],[1,1,8],[car.x-1,1,car.z+7],C([0,1.7,5.5]).toArray() as V];
 const flowCurves=[new THREE.CatmullRomCurve3(fixedHose.map(v=>new THREE.Vector3(...v))),new THREE.CatmullRomCurve3([[0,1.7,5.5],[0,1.85,4.6],[0,1.85,3.5]].map(v=>C(v as V))),new THREE.CatmullRomCurve3([[0,1.85,3.5],[0,1.85,2],[0,1.8,0]].map(v=>M(v as V)))];
 return <>
 <Block at={[0,-.55,2]} size={[36,.8,20]} color={ground}/>
 {[-12,-6,0,6,12].map(x=><Block key={x} at={[x,-.05,0]} size={[.55,.5,8]} color="#475f57"/>)}
 {[-2,0,2].map(z=><group key={z} {...selectable('rails')}><Track z={z} color={c('rails',steel)}/></group>)}
 {system==='boarding'?<>
 <group {...selectable('deck')}><Block at={[0,1.35,0]} size={[32,.5,6]} color={c('deck','#456459')}/>{Array.from({length:24},(_,i)=><Block key={i} at={[-16+(i*1.5+time*speed)%32,1.615,0]} size={[.05,.025,6]} color={amber}/>)}</group>
 <group {...selectable('bridge')}><Block at={[0,1.35,7]} size={[4,.5,7.7]} color={c('bridge',steel)}/>{[-1.8,1.8].map(x=><group key={x}><Pipe points={[[x,2.6,3.45],[x,2.6,10.5]]} color={steel}/>{[4,7,10].map(z=><Block key={z} at={[x,2.05,z]} size={[.08,1,.08]} color={steel}/>)}</group>)}{[-1.5,1.5].map(x=><Block key={x} at={[x,.4,9]} size={[.3,1.5,.3]}/>)}</group>
 <group {...selectable('threshold')}><Block at={[0,1.62,3.08]} size={[3.5,.045,.12]} color={c('threshold','#f6c261')}/></group>
 <group {...selectable('person')}><Person at={[(time%12)<4?-2+.5*(time%12):0,1.62,(time%12)<4?1:Math.min(9,1+((time%12)-4))]} walk={time*5}/></group>
 </>:<>
 <group position={[pos.x,0,pos.z]} rotation={[0,pos.a,0]}>
 <group {...selectable('deck')}><Block at={[0,1.35,0]} size={[8,.5,6]} color={c('deck','#78968a')} opacity={cutaway?.32:1}/>{[-2.5,2.5].map(x=><Block key={x} at={[x,2.75,-2]} size={[.25,2.3,.25]} color={steel}/>)}<Block at={[0,3.9,-2]} size={[6,.25,.3]} color={steel}/></group>
 <group {...selectable('wheels')}>{[-2.5,2.5].flatMap(x=>[-2,0,2].map(z=><Wheel key={`${x}-${z}`} at={[x,.72,z]} color={c('wheels',steel)} r={.3} angle={-time*speed*(R-z)/R/.3}/>))}</group>
 {system==='motion'&&<group {...selectable('drive')}><Gear at={[2.5,.72,2.3]} r={.3} angle={-time*speed*(R-2)/R/.3} teeth={16}/><Gear at={[2.95,.72,2.3]} r={.15} angle={2*time*speed*(R-2)/R/.3} teeth={8}/><Block at={[2.95,.72,1.8]} size={[.35,.35,.65]} color={c('drive',blue)}/></group>}

 {utility&&<><group {...selectable('tank')}><Tank sewage={sewage} transparent={cutaway} time={time}/></group><Pipe points={[[0,1.8,0],[0,1.85,2],[0,1.85,3.5]]} color={c('tank',lineColor)} r={.13}/><Block at={[0,1.85,3.25]} size={[.4,.4,.3]} color={connected?lineColor:'#b86a56'}/></>}
 </group>
 {utility&&<>
 <group {...selectable('carriage')}><Track z={5.4}/><Track z={6.4}/><group position={[car.x,0,car.z]} rotation={[0,car.a,0]}><Block at={[0,.8,5.9]} size={[1.7,.35,1.7]} color={c('carriage',amber)}/>{[-.6,.6].map(x=><Wheel key={x} at={[x,.48,6.5]} angle={-carS/.25} r={.25}/>)}<Block at={[0,1.3,5.5]} size={[.55,.9,.6]} color={steel}/><Pipe points={[[0,1.7,5.5],[0,1.85,4.6],[0,1.85,connected?3.5:4.1]]} r={.13} color={lineColor}/></group></group>
 <group {...selectable('pump')}><Block at={[0,.5,9]} size={[3,.3,2]} color={steel}/><mesh position={[0,.95,9]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.45,.45,1.4,24]}/><meshStandardMaterial color={c('pump',lineColor)}/></mesh><Pipe points={[[0,.95,9],[0,.95,10],[10,.95,10]]} color={lineColor} r={.2}/><Pipe points={fixedHose} color={lineColor} r={.13}/></group>
 <group {...selectable('coupler')}><mesh position={connected?movingTip:C([0,1.85,4.1])}><sphereGeometry args={[.2,16,12]}/><meshStandardMaterial color={c('coupler',connected?'#8edcba':'#dd8269')} emissive={connected?'#19432f':'#321a15'}/></mesh></group>
 {connected&&Array.from({length:10},(_,i)=>{let f=((time*.5+i/10)%1);if(sewage)f=1-f;const segment=Math.min(2,Math.floor(f*3));const v=flowCurves[segment].getPoint((f*3)%1);return <mesh key={i} position={v}><sphereGeometry args={[.09,8,6]}/><meshBasicMaterial color={lineColor}/></mesh>})}
 </>}
 </>}
 </>;
}
function Camera({reset}:{reset:number}){const {camera,invalidate}=useThree();const controls=useRef<any>(null);useEffect(()=>{camera.position.set(17,14,22);controls.current?.target.set(0,1,2);controls.current?.update();invalidate()},[reset]);return <OrbitControls ref={controls} target={[0,1,2]} minDistance={5} maxDistance={65} maxPolarAngle={Math.PI*.49} enableDamping/>}
export default function MechanismScene(props:Props){return <Canvas camera={{position:[17,14,22],fov:45,near:.1,far:160}} dpr={[1,1.5]} frameloop="demand" gl={{antialias:true}}><color attach="background" args={['#101c19']}/><ambientLight intensity={1.3}/><directionalLight position={[8,20,12]} intensity={2.8}/><directionalLight position={[-12,8,-8]} intensity={1.6} color="#8ec8ed"/><Model {...props}/><Camera reset={props.reset}/></Canvas>}
