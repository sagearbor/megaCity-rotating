import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Edges, Cloud, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { RingConfig, WalkwayConfig, SimulationState } from '../types';

interface SceneProps {
  rings: RingConfig[];
  walkways: WalkwayConfig[]; 
  simState: SimulationState;
  resetTrigger: number;
  isDarkMode: boolean;
  globalOpacity: number;
}

const FLOOR_HEIGHT = 4; // meters

const CityRing: React.FC<{ ring: RingConfig; simState: SimulationState; isDarkMode: boolean; globalOpacity: number }> = ({ ring, simState, isDarkMode, globalOpacity }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current && simState.isPlaying) {
      const radPerSec = (ring.rotationSpeed / 60) * (Math.PI / 180);
      meshRef.current.rotation.y += radPerSec * delta * simState.timeScale;
    }
  });

  // Create geometry for a SINGLE sector
  const segmentGeometry = useMemo(() => {
    if (ring.sectionCount <= 1) {
        // Fallback for Hub (Continuous)
        const shape = new THREE.Shape();
        shape.absarc(0, 0, ring.outerRadius, 0, Math.PI * 2, false);
        if (ring.innerRadius > 0) {
            const hole = new THREE.Path();
            hole.absarc(0, 0, ring.innerRadius, 0, Math.PI * 2, true);
            shape.holes.push(hole);
        }
        return new THREE.ExtrudeGeometry(shape, {
            depth: ring.height,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 2,
            curveSegments: 128
        });
    }

    const fullCircle = Math.PI * 2;
    const sectorAngle = fullCircle / ring.sectionCount;
    // Gap as a percentage of the angle, roughly 10% or fixed width approximation
    // Let's approximate 20m gap
    const midRadius = (ring.innerRadius + ring.outerRadius) / 2;
    const gapAngle = 20 / midRadius; // 20 meters gap in radians
    const actualSegmentAngle = sectorAngle - gapAngle;

    const shape = new THREE.Shape();
    // Arc from -angle/2 to +angle/2
    shape.absarc(0, 0, ring.outerRadius, -actualSegmentAngle/2, actualSegmentAngle/2, false);
    
    // Draw line to inner radius start
    // We need to properly close the shape for extrude to work well with arcs
    // absarc draws clockwise? No, CCW by default.
    // absarc(x, y, radius, startAngle, endAngle, clockwise)
    
    // Outer Arc
    shape.absarc(0, 0, ring.outerRadius, -actualSegmentAngle/2, actualSegmentAngle/2, false);
    // Line to Inner End
    // Inner Arc (drawn backwards/CW to create hole effect or just shape outline)
    // Actually for a solid shape we trace the perimeter: Outer Arc -> Line In -> Inner Arc (Reverse) -> Line Out
    
    const holePath = new THREE.Path();
    // To make it a solid block without using holes array (which is for cutouts inside),
    // we can just draw the full perimeter.
    
    // Let's redo:
    const s = new THREE.Shape();
    s.absarc(0, 0, ring.outerRadius, -actualSegmentAngle/2, actualSegmentAngle/2, false); // Outer
    s.absarc(0, 0, ring.innerRadius, actualSegmentAngle/2, -actualSegmentAngle/2, true); // Inner (Reverse)
    s.closePath();

    return new THREE.ExtrudeGeometry(s, {
        depth: ring.height,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 0.5,
        bevelSegments: 1,
        curveSegments: 16 // Lower detail for segments to save perf
    });
  }, [ring.innerRadius, ring.outerRadius, ring.height, ring.sectionCount]);

  const topTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#bbb'; 
        ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 500; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#888';
            ctx.globalAlpha = 0.2;
            const x = Math.random() * size;
            const y = Math.random() * size;
            ctx.fillRect(x, y, 4, 4);
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(0.5, 0.5);
    return tex;
  }, []);

  // Generate an array of angles for placement
  const segments = useMemo(() => {
    const arr = [];
    const step = (Math.PI * 2) / ring.sectionCount;
    for (let i = 0; i < ring.sectionCount; i++) {
        arr.push(i * step);
    }
    return arr;
  }, [ring.sectionCount]);

  const edgeColor = isDarkMode ? "#271a10" : "#94a3b8";

  return (
    <group ref={meshRef}>
        {/* Render each segment */}
        {segments.map((angle, i) => (
            <group key={i} rotation={[0, -angle, 0]}>
                <mesh geometry={segmentGeometry} rotation={[Math.PI / 2, 0, 0]} position={[0, ring.height, 0]}>
                    <meshStandardMaterial 
                        color={ring.color} 
                        roughness={0.7} 
                        metalness={isDarkMode ? 0.3 : 0.1}
                        map={topTexture}
                        transparent={globalOpacity < 1}
                        opacity={globalOpacity}
                    />
                    <Edges color={edgeColor} threshold={30} opacity={0.3} transparent />
                </mesh>
                
                {/* Optional: Add a light/window feature on the side of each block */}
                <mesh position={[ring.outerRadius + 1, ring.height/2, 0]} rotation={[0, Math.PI/2, 0]}>
                     <planeGeometry args={[10, ring.height - 10]} />
                     <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={isDarkMode ? 1 : 0} transparent opacity={0.5} />
                </mesh>
            </group>
        ))}

        {/* Ring Name Label - Attached to Group so it rotates (User wanted to see rotation) */}
        {/* Actually, text is usually better readable if static? 
            The prompt implies "see the building in pleasant 3D where you can drag o spin around".
            If the text rotates with the ring, it might be hard to read.
            But the user wants to SEE rotation. 
            Let's keep text static relative to world, but maybe place it above just one spot?
            Actually, let's attach it to the first segment so it spins. */}
         <Text 
            position={[ring.outerRadius, ring.height + 120, 0]} 
            rotation={[0, Math.PI/2, 0]} // Billboarded? No, let it spin
            fontSize={80}
            color={isDarkMode ? "white" : "#1e293b"}
            anchorX="center"
            anchorY="middle"
        >
            {ring.name}
        </Text>
    </group>
  );
};

const StaticBridge: React.FC<{ config: WalkwayConfig, rings: RingConfig[], isDarkMode: boolean }> = ({ config, rings, isDarkMode }) => {
    const source = rings.find(r => r.id === config.fromRingId);
    const target = rings.find(r => r.id === config.toRingId);
    if (!source || !target) return null;

    const startRadius = source.outerRadius;
    const endRadius = target.innerRadius;
    const length = endRadius - startRadius;
    const midRadius = startRadius + length / 2;
    const bridgeY = config.floor * FLOOR_HEIGHT;
    const angleRad = (config.angleOffset * Math.PI) / 180;
    
    const structureColor = isDarkMode ? "#cbd5e1" : "#64748b";
    const glassColor = isDarkMode ? "#94a3b8" : "#bae6fd";
    const pillarColor = isDarkMode ? "#334155" : "#94a3b8";

    return (
        <group rotation={[0, -angleRad, 0]}>
            {/* Span */}
            <mesh position={[midRadius, bridgeY, 0]}>
                <boxGeometry args={[length + 4, 3, config.width]} />
                <meshStandardMaterial color={structureColor} metalness={0.5} roughness={0.5} />
                <Edges color={isDarkMode ? "#475569" : "#cbd5e1"} />
            </mesh>
            
            {/* Glass */}
             <mesh position={[midRadius, bridgeY + 2, 0]}>
                <boxGeometry args={[length, 4, config.width - 2]} />
                <meshStandardMaterial color={glassColor} transparent opacity={0.4} metalness={0.8} />
            </mesh>

            {/* Pillar */}
            <mesh position={[midRadius, bridgeY / 2, 0]}>
                 <cylinderGeometry args={[3, 5, bridgeY]} />
                 <meshStandardMaterial color={pillarColor} roughness={0.9} />
            </mesh>

            {/* Connectors */}
            <mesh position={[startRadius, bridgeY - 1, 0]}>
                <cylinderGeometry args={[10, 10, 2, 8]} />
                <meshStandardMaterial color={structureColor} />
            </mesh>
            <mesh position={[endRadius, bridgeY - 1, 0]}>
                <cylinderGeometry args={[10, 10, 2, 8]} />
                <meshStandardMaterial color={structureColor} />
            </mesh>
        </group>
    );
};

const SceneContent: React.FC<SceneProps> = ({ rings, walkways, simState, resetTrigger, isDarkMode, globalOpacity }) => {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, [resetTrigger]);

  return (
    <>
      <ambientLight intensity={isDarkMode ? 0.4 : 0.8} />
      <directionalLight position={[2000, 4000, 1000]} intensity={isDarkMode ? 1.5 : 2.0} castShadow shadow-bias={-0.0005} />
      <hemisphereLight color={isDarkMode ? "#bae6fd" : "#fff"} groundColor={isDarkMode ? "#0f172a" : "#e2e8f0"} intensity={0.5} />
      
      {isDarkMode ? (
          <>
            <Stars radius={8000} depth={100} count={8000} factor={6} saturation={0} fade speed={0.1} />
            <Cloud opacity={0.3} speed={0.2} bounds={[5000, 200, 5000]} segments={20} position={[0, 200, 0]} color="#a5b4fc" />
          </>
      ) : (
          <>
            <Sky sunPosition={[1000, 500, 100]} turbidity={0.5} rayleigh={0.5} />
            <Cloud opacity={0.5} speed={0.1} bounds={[5000, 500, 5000]} segments={40} position={[0, 400, 0]} color="#ffffff" />
          </>
      )}

      {/* Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[25000, 25000]} />
          <meshStandardMaterial color={isDarkMode ? "#0f172a" : "#f1f5f9"} roughness={0.8} />
      </mesh>

      {/* Park Zones between rings */}
      {rings.map((ring, i) => {
          if (i === rings.length - 1) return null;
          const nextRing = rings[i+1];
           // Simple Green Ring for parks
           const shape = new THREE.Shape();
           shape.absarc(0, 0, nextRing.innerRadius, 0, Math.PI*2, false);
           const hole = new THREE.Path();
           hole.absarc(0, 0, ring.outerRadius, 0, Math.PI*2, true);
           shape.holes.push(hole);
           const geo = new THREE.ShapeGeometry(shape);
           
           return (
            <mesh key={`park-${i}`} geometry={geo} rotation={[-Math.PI/2, 0, 0]} position={[0, 0.5, 0]}>
                 <meshStandardMaterial color={isDarkMode ? "#064e3b" : "#bbf7d0"} roughness={1} />
             </mesh>
           );
      })}

      {rings.map(ring => (
        <CityRing key={ring.id} ring={ring} simState={simState} isDarkMode={isDarkMode} globalOpacity={globalOpacity} />
      ))}

      {walkways.map(w => (
          <StaticBridge key={w.id} config={w} rings={rings} isDarkMode={isDarkMode} />
      ))}

      <OrbitControls 
        ref={controlsRef}
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={200}
        maxDistance={12000}
        enablePan={true}
        zoomSpeed={1.0}
        rotateSpeed={0.4}
        target={[0, 0, 0]} 
        enableDamping
      />
    </>
  );
};

export const ArchitecturalScene: React.FC<SceneProps> = (props) => {
  return (
    <div className={`w-full h-full ${props.isDarkMode ? 'bg-slate-950' : 'bg-sky-50'}`}>
      <Canvas 
        camera={{ position: [0, 5000, 5000], fov: 40, far: 30000 }} 
        shadows
        dpr={[1, 2]} 
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <SceneContent {...props} />
        {props.isDarkMode ? (
             <fog attach="fog" args={['#0f172a', 3000, 20000]} />
        ) : (
             <fog attach="fog" args={['#f0f9ff', 4000, 25000]} />
        )}
      </Canvas>
    </div>
  );
};