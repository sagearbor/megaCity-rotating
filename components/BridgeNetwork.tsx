import React, { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { RingConfig, WalkwayConfig, HoverInfo } from '../types';
// Three draw calls for the entire schematic bridge network (deck, support, canopy).
export default function BridgeNetwork({rings, walkways, isDarkMode, showSolarPanels, onHover}: {rings:RingConfig[];walkways:WalkwayConfig[];isDarkMode:boolean;showSolarPanels:boolean;onHover?:(info:HoverInfo|null)=>void}) {
 const decks=useRef<THREE.InstancedMesh>(null), supports=useRef<THREE.InstancedMesh>(null), roofs=useRef<THREE.InstancedMesh>(null);
 const links=useMemo(()=>walkways.flatMap(w=>{const a=rings.find(r=>r.id===w.fromRingId),b=rings.find(r=>r.id===w.toRingId);if(!a||!b||b.innerRadius<=a.outerRadius)return [];return [{w,length:b.innerRadius-a.outerRadius,radius:(a.outerRadius+b.innerRadius)/2}];}),[rings,walkways]);
 useLayoutEffect(()=>{
  const object=new THREE.Object3D();
  links.forEach(({w,length,radius},i)=>{
   const angle=w.angleOffset*Math.PI/180,y=w.floor*4;
   object.position.set(Math.cos(angle)*radius,y,Math.sin(angle)*radius);object.rotation.set(0,-angle,0);object.scale.set(length,3,w.width);object.updateMatrix();decks.current?.setMatrixAt(i,object.matrix);
   object.position.y=y/2;object.scale.set(3,y,3);object.updateMatrix();supports.current?.setMatrixAt(i,object.matrix);
   object.position.y=y+5;object.scale.set(length,1,w.width);object.updateMatrix();roofs.current?.setMatrixAt(i,object.matrix);
  });
  [decks,supports,roofs].forEach(ref=>{if(ref.current){ref.current.instanceMatrix.needsUpdate=true;ref.current.computeBoundingSphere();}});
 },[links,showSolarPanels]);
 const hover=(e:ThreeEvent<PointerEvent>)=>{if(e.instanceId===undefined)return;const row=links[e.instanceId];e.stopPropagation();onHover?.({type:'bridge',name:'Indicative fixed link',description:'Supports, protected transfers and evacuation require engineering.',details:`Floor ${row.w.floor} · ${row.length.toFixed(0)} m span · ${row.w.fromRingId} to ${row.w.toRingId}`,position:{x:e.clientX,y:e.clientY}});};
 if(!links.length)return null;
 return <><instancedMesh ref={decks} args={[undefined,undefined,links.length]} onPointerOver={hover} onPointerOut={()=>onHover?.(null)}><boxGeometry/><meshStandardMaterial color={isDarkMode?'#a7b7af':'#617b6e'}/></instancedMesh><instancedMesh ref={supports} args={[undefined,undefined,links.length]}><boxGeometry/><meshStandardMaterial color="#65786b"/></instancedMesh>{showSolarPanels&&<instancedMesh ref={roofs} args={[undefined,undefined,links.length]}><boxGeometry/><meshStandardMaterial color="#2b4c61"/></instancedMesh>}</>;
}
