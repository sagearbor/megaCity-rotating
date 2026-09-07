import React, { createContext, useContext, useRef, useEffect, ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SimulationState } from '../types';
const MotionContext=createContext<React.MutableRefObject<number>|null>(null);
export function MotionProvider({simState, resetTrigger, children}:{simState:SimulationState;resetTrigger:number;children:ReactNode}){
 const seconds=useRef(0);
 useEffect(()=>{seconds.current=0;},[resetTrigger]);
 useFrame((_,delta)=>{if(simState.isPlaying)seconds.current+=Math.min(delta,.1)*simState.timeScale;},-1);
 return <MotionContext.Provider value={seconds}>{children}</MotionContext.Provider>;
}
export function useSimulationSeconds(){const ref=useContext(MotionContext);if(!ref)throw new Error('Missing motion provider');return ref;}
export function RotatingGroup({speed,children}:{speed:number;children:ReactNode}){const seconds=useSimulationSeconds();const ref=useRef<THREE.Group>(null);useFrame(()=>{if(ref.current)ref.current.rotation.y=speed*Math.PI/180/60*seconds.current;});return <group ref={ref}>{children}</group>;}
