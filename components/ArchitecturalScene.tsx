import React, { useRef, useMemo, useEffect, useCallback, Suspense, lazy } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Edges, Cloud, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { RingConfig, WalkwayConfig, SimulationState, UmbilicalTowerConfig, HoverInfo } from '../types';
import { Ring12GapAmenities } from './Ring12GapAmenities';
import { Ring34GapAmenities } from './Ring34GapAmenities';

// Lazy-load showcase/amenity components for faster initial load
const ShowcaseDetailsLazy = lazy(() => import('./ShowcaseDetails').then(m => ({ default: m.ShowcaseDetails })));
const ShowcaseGroundAmenitiesLazy = lazy(() => import('./ShowcaseGroundAmenities').then(m => ({ default: m.ShowcaseGroundAmenities })));
const ShowcaseForestLazy = lazy(() => import('./ShowcaseForest').then(m => ({ default: m.ShowcaseForest })));
const ShowcaseBeaconLazy = lazy(() => import('./ShowcaseBeacon'));
import InfrastructureOverlay from './InfrastructureOverlay';

interface SceneProps {
  rings: RingConfig[];
  walkways: WalkwayConfig[];
  simState: SimulationState;
  resetTrigger: number;
  isDarkMode: boolean;
  globalOpacity: number;
  showUtilities?: boolean;
  showTunnels?: boolean;
  showRooftopAmenities?: boolean;
  showGroundAmenities?: boolean;
  showSolarPanels?: boolean;
  showInfrastructure?: boolean;
  onHover?: (info: HoverInfo | null) => void;
}

const FLOOR_HEIGHT = 4; // meters

const CityRing: React.FC<{ ring: RingConfig; simState: SimulationState; isDarkMode: boolean; globalOpacity: number; showRooftopAmenities?: boolean; onHover?: (info: HoverInfo | null) => void }> = ({ ring, simState, isDarkMode, globalOpacity, showRooftopAmenities = true, onHover }) => {
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

                {/* Rooftop Amenities - deterministic based on segment index */}
                {showRooftopAmenities && ring.sectionCount > 1 && (
                    <>
                        {i % 3 === 0 && (
                            <mesh
                                position={[ring.outerRadius - 10, ring.height + 2, 0]}
                                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                                    e.stopPropagation();
                                    onHover?.({
                                        type: 'rooftop-garden',
                                        name: 'Community Garden',
                                        description: 'Rooftop urban farm providing fresh produce to local residents.',
                                        details: `${ring.name} - Section ${i + 1}`,
                                        position: { x: e.clientX, y: e.clientY }
                                    });
                                }}
                                onPointerOut={() => onHover?.(null)}
                            >
                                <boxGeometry args={[20, 1, 15]} />
                                <meshStandardMaterial color="#22c55e" roughness={0.9} />
                            </mesh>
                        )}
                        {i % 4 === 1 && (
                            <mesh
                                position={[ring.outerRadius - 35, ring.height + 2, 0]}
                                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                                    e.stopPropagation();
                                    onHover?.({
                                        type: 'rooftop-restaurant',
                                        name: 'Sky Terrace Restaurant',
                                        description: 'Panoramic dining with views of the rotating cityscape.',
                                        details: `${ring.name} - Section ${i + 1}`,
                                        position: { x: e.clientX, y: e.clientY }
                                    });
                                }}
                                onPointerOut={() => onHover?.(null)}
                            >
                                <boxGeometry args={[15, 1, 12]} />
                                <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={isDarkMode ? 0.3 : 0} roughness={0.7} />
                            </mesh>
                        )}
                    </>
                )}
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

const StaticBridge: React.FC<{ config: WalkwayConfig, rings: RingConfig[], isDarkMode: boolean, showSolarPanels?: boolean, onHover?: (info: HoverInfo | null) => void }> = ({ config, rings, isDarkMode, showSolarPanels = true, onHover }) => {
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
            <mesh
                position={[midRadius, bridgeY, 0]}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                        type: 'bridge',
                        name: 'Transit Bridge',
                        description: 'Static pedestrian bridge connecting rotating rings.',
                        details: `Floor ${config.floor} • ${source.name} ↔ ${target.name}`,
                        position: { x: e.clientX, y: e.clientY }
                    });
                }}
                onPointerOut={() => onHover?.(null)}
            >
                <boxGeometry args={[length + 4, 3, config.width]} />
                <meshStandardMaterial color={structureColor} metalness={0.5} roughness={0.5} />
                <Edges color={isDarkMode ? "#475569" : "#cbd5e1"} />
            </mesh>

            {/* Glass */}
             <mesh position={[midRadius, bridgeY + 2, 0]}>
                <boxGeometry args={[length, 4, config.width - 2]} />
                <meshStandardMaterial color={glassColor} transparent opacity={0.4} metalness={0.8} />
            </mesh>

            {/* Solar Panel Canopy */}
            {showSolarPanels && (
                <mesh
                    position={[midRadius, bridgeY + 5, 0]}
                    rotation={[0.05, 0, 0]}
                    onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                        e.stopPropagation();
                        onHover?.({
                            type: 'solar-canopy',
                            name: 'Solar Canopy',
                            description: 'Photovoltaic panels powering bridge lighting and climate control.',
                            details: `Output: ~15 kW peak`,
                            position: { x: e.clientX, y: e.clientY }
                        });
                    }}
                    onPointerOut={() => onHover?.(null)}
                >
                    <boxGeometry args={[length + 8, 0.5, config.width + 4]} />
                    <meshStandardMaterial
                        color={isDarkMode ? "#1e1b4b" : "#312e81"}
                        metalness={0.9}
                        roughness={0.2}
                        transparent
                        opacity={0.85}
                    />
                    <Edges color={isDarkMode ? "#6366f1" : "#4f46e5"} />
                </mesh>
            )}

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

// Instanced tree rendering for WoodedArea - replaces individual meshes with InstancedMesh
const InstancedWoodedTrees: React.FC<{
    trees: Array<{ x: number; z: number; scale: number; type: 'pine' | 'oak' }>;
    pineColor: string;
    oakColor: string;
    trunkColor: string;
}> = ({ trees, pineColor, oakColor, trunkColor }) => {
    const pineTrunkRef = useRef<THREE.InstancedMesh>(null);
    const pineFoliageRef = useRef<THREE.InstancedMesh>(null);
    const oakTrunkRef = useRef<THREE.InstancedMesh>(null);
    const oakFoliageRef = useRef<THREE.InstancedMesh>(null);

    const { pines, oaks } = useMemo(() => {
        const p: typeof trees = [];
        const o: typeof trees = [];
        trees.forEach(t => (t.type === 'pine' ? p : o).push(t));
        return { pines: p, oaks: o };
    }, [trees]);

    const pineTrunkGeo = useMemo(() => new THREE.CylinderGeometry(0.5, 0.7, 4, 6), []);
    const pineFoliageGeo = useMemo(() => new THREE.ConeGeometry(4, 12, 6), []);
    const oakTrunkGeo = useMemo(() => new THREE.CylinderGeometry(0.6, 0.9, 6, 6), []);
    const oakFoliageGeo = useMemo(() => new THREE.SphereGeometry(5, 8, 6), []);

    const trunkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: trunkColor, roughness: 0.9 }), [trunkColor]);
    const pineMat = useMemo(() => new THREE.MeshStandardMaterial({ color: pineColor, roughness: 0.9 }), [pineColor]);
    const oakMat = useMemo(() => new THREE.MeshStandardMaterial({ color: oakColor, roughness: 0.9 }), [oakColor]);

    useEffect(() => {
        const mat = new THREE.Matrix4();
        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        const scl = new THREE.Vector3();

        if (pineTrunkRef.current && pineFoliageRef.current) {
            pines.forEach((t, i) => {
                scl.set(t.scale, t.scale, t.scale);
                pos.set(t.x, 2 * t.scale, t.z);
                mat.compose(pos, quat, scl);
                pineTrunkRef.current!.setMatrixAt(i, mat);
                pos.set(t.x, 8 * t.scale, t.z);
                mat.compose(pos, quat, scl);
                pineFoliageRef.current!.setMatrixAt(i, mat);
            });
            pineTrunkRef.current.instanceMatrix.needsUpdate = true;
            pineFoliageRef.current.instanceMatrix.needsUpdate = true;
        }

        if (oakTrunkRef.current && oakFoliageRef.current) {
            oaks.forEach((t, i) => {
                scl.set(t.scale, t.scale, t.scale);
                pos.set(t.x, 3 * t.scale, t.z);
                mat.compose(pos, quat, scl);
                oakTrunkRef.current!.setMatrixAt(i, mat);
                pos.set(t.x, 10 * t.scale, t.z);
                mat.compose(pos, quat, scl);
                oakFoliageRef.current!.setMatrixAt(i, mat);
            });
            oakTrunkRef.current.instanceMatrix.needsUpdate = true;
            oakFoliageRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [pines, oaks]);

    return (
        <>
            {pines.length > 0 && (
                <>
                    <instancedMesh ref={pineTrunkRef} args={[pineTrunkGeo, trunkMat, pines.length]} />
                    <instancedMesh ref={pineFoliageRef} args={[pineFoliageGeo, pineMat, pines.length]} />
                </>
            )}
            {oaks.length > 0 && (
                <>
                    <instancedMesh ref={oakTrunkRef} args={[oakTrunkGeo, trunkMat, oaks.length]} />
                    <instancedMesh ref={oakFoliageRef} args={[oakFoliageGeo, oakMat, oaks.length]} />
                </>
            )}
        </>
    );
};

// Wooded area with trees and streams
const WoodedArea: React.FC<{
    position: [number, number, number];
    rotation?: [number, number, number];
    width: number;
    depth: number;
    isDarkMode: boolean;
    hasStream?: boolean;
    onHover?: (info: HoverInfo | null) => void;
}> = ({ position, rotation = [0, 0, 0], width, depth, isDarkMode, hasStream = true, onHover }) => {
    const trees = useMemo(() => {
        const treePositions: Array<{ x: number; z: number; scale: number; type: 'pine' | 'oak' }> = [];
        const count = Math.floor((width * depth) / 400); // Density based on area

        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * width * 0.9;
            const z = (Math.random() - 0.5) * depth * 0.9;
            // Avoid stream area in center
            if (hasStream && Math.abs(z) < depth * 0.1) continue;
            treePositions.push({
                x,
                z,
                scale: 0.8 + Math.random() * 0.6,
                type: Math.random() > 0.4 ? 'pine' : 'oak'
            });
        }
        return treePositions;
    }, [width, depth, hasStream]);

    const forestFloorColor = isDarkMode ? "#0a2e1a" : "#166534";
    const pineColor = isDarkMode ? "#14532d" : "#22c55e";
    const oakColor = isDarkMode ? "#15803d" : "#4ade80";
    const trunkColor = isDarkMode ? "#451a03" : "#78350f";
    const streamColor = isDarkMode ? "#0284c7" : "#38bdf8";

    return (
        <group position={position} rotation={rotation}>
            {/* Forest floor */}
            <mesh
                rotation={[-Math.PI/2, 0, 0]}
                position={[0, 0.5, 0]}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                        type: hasStream ? 'woods' : 'forest',
                        name: hasStream ? 'Woodland Grove' : 'Urban Forest',
                        description: hasStream
                            ? 'Mixed forest with native trees and a meandering stream.'
                            : 'Dense urban forest providing habitat and carbon sequestration.',
                        details: `~${trees.length} trees • ${Math.round(width * depth / 1000)}k m² area`,
                        position: { x: e.clientX, y: e.clientY }
                    });
                }}
                onPointerOut={() => onHover?.(null)}
            >
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color={forestFloorColor} roughness={1} />
            </mesh>

            {/* Stream running through */}
            {hasStream && (
                <>
                    {/* Main stream */}
                    <mesh
                        rotation={[-Math.PI/2, 0, 0]}
                        position={[0, 1, 0]}
                        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                            e.stopPropagation();
                            onHover?.({
                                type: 'stream',
                                name: 'Forest Stream',
                                description: 'Naturalized waterway supporting local ecosystem and stormwater management.',
                                details: 'Flow rate: ~50 L/s',
                                position: { x: e.clientX, y: e.clientY }
                            });
                        }}
                        onPointerOut={() => onHover?.(null)}
                    >
                        <planeGeometry args={[width * 1.1, depth * 0.15]} />
                        <meshStandardMaterial
                            color={streamColor}
                            roughness={0.1}
                            metalness={0.4}
                            transparent
                            opacity={0.85}
                        />
                    </mesh>
                    {/* Stream banks */}
                    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.8, depth * 0.1]}>
                        <planeGeometry args={[width * 1.05, depth * 0.05]} />
                        <meshStandardMaterial color="#78716c" roughness={0.9} />
                    </mesh>
                    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.8, -depth * 0.1]}>
                        <planeGeometry args={[width * 1.05, depth * 0.05]} />
                        <meshStandardMaterial color="#78716c" roughness={0.9} />
                    </mesh>
                </>
            )}

            {/* Instanced Trees */}
            <InstancedWoodedTrees trees={trees} pineColor={pineColor} oakColor={oakColor} trunkColor={trunkColor} />
        </group>
    );
};

const GroundAmenities: React.FC<{
    innerRadius: number;
    outerRadius: number;
    index: number;
    isDarkMode: boolean;
    onHover?: (info: HoverInfo | null) => void;
}> = ({ innerRadius, outerRadius, index, isDarkMode, onHover }) => {
    const midRadius = (innerRadius + outerRadius) / 2;
    const gapWidth = outerRadius - innerRadius;

    // Place amenities at cardinal directions and diagonals
    const amenities = [];

    // Soccer field at 0 degrees
    amenities.push(
        <group key="soccer" position={[midRadius, 1, 0]}>
            <mesh
                rotation={[-Math.PI/2, 0, 0]}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                        type: 'soccer',
                        name: 'Community Soccer Field',
                        description: 'Full-size pitch for recreational and league play.',
                        details: 'Capacity: 500 spectators',
                        position: { x: e.clientX, y: e.clientY }
                    });
                }}
                onPointerOut={() => onHover?.(null)}
            >
                <planeGeometry args={[gapWidth * 0.7, 50]} />
                <meshStandardMaterial color="#166534" roughness={0.95} />
            </mesh>
            {/* Field lines */}
            <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.1, 0]}>
                <planeGeometry args={[gapWidth * 0.65, 45]} />
                <meshStandardMaterial color="#22c55e" roughness={0.9} />
            </mesh>
        </group>
    );

    // Wooded area with stream at 45 degrees
    const angle45 = Math.PI / 4;
    amenities.push(
        <WoodedArea
            key="woods-45"
            position={[Math.cos(angle45) * midRadius, 0, Math.sin(angle45) * midRadius]}
            rotation={[0, -angle45, 0]}
            width={gapWidth * 0.8}
            depth={60}
            isDarkMode={isDarkMode}
            hasStream={true}
            onHover={onHover}
        />
    );

    // Swimming pool at 90 degrees
    amenities.push(
        <group key="pool" position={[0, 1, midRadius]} rotation={[0, Math.PI/2, 0]}>
            <mesh
                rotation={[-Math.PI/2, 0, 0]}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                        type: 'pool',
                        name: 'Aquatic Center',
                        description: 'Olympic-sized pool complex with lap lanes and recreational areas.',
                        details: 'Capacity: 250 swimmers • Heated year-round',
                        position: { x: e.clientX, y: e.clientY }
                    });
                }}
                onPointerOut={() => onHover?.(null)}
            >
                <planeGeometry args={[gapWidth * 0.5, 30]} />
                <meshStandardMaterial color="#0ea5e9" roughness={0.1} metalness={0.3} />
            </mesh>
        </group>
    );

    // Wooded area at 135 degrees
    const angle135 = (3 * Math.PI) / 4;
    amenities.push(
        <WoodedArea
            key="woods-135"
            position={[Math.cos(angle135) * midRadius, 0, Math.sin(angle135) * midRadius]}
            rotation={[0, -angle135, 0]}
            width={gapWidth * 0.7}
            depth={50}
            isDarkMode={isDarkMode}
            hasStream={true}
            onHover={onHover}
        />
    );

    // Forest at 180 degrees (enhanced with trees)
    amenities.push(
        <WoodedArea
            key="forest-180"
            position={[-midRadius, 0, 0]}
            rotation={[0, Math.PI, 0]}
            width={gapWidth * 0.8}
            depth={60}
            isDarkMode={isDarkMode}
            hasStream={false}
            onHover={onHover}
        />
    );

    // Wooded area at 225 degrees
    const angle225 = (5 * Math.PI) / 4;
    amenities.push(
        <WoodedArea
            key="woods-225"
            position={[Math.cos(angle225) * midRadius, 0, Math.sin(angle225) * midRadius]}
            rotation={[0, -angle225, 0]}
            width={gapWidth * 0.75}
            depth={55}
            isDarkMode={isDarkMode}
            hasStream={true}
            onHover={onHover}
        />
    );

    // Baseball at 270 degrees
    amenities.push(
        <group key="baseball" position={[0, 1, -midRadius]} rotation={[0, -Math.PI/2, 0]}>
            <mesh
                rotation={[-Math.PI/2, 0, Math.PI/4]}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                        type: 'baseball',
                        name: 'Baseball Diamond',
                        description: 'Community baseball field for leagues and casual play.',
                        details: 'Regulation size • Night lighting available',
                        position: { x: e.clientX, y: e.clientY }
                    });
                }}
                onPointerOut={() => onHover?.(null)}
            >
                <circleGeometry args={[25, 4, 0, Math.PI/2]} />
                <meshStandardMaterial color="#92400e" roughness={0.9} />
            </mesh>
        </group>
    );

    // Wooded area at 315 degrees
    const angle315 = (7 * Math.PI) / 4;
    amenities.push(
        <WoodedArea
            key="woods-315"
            position={[Math.cos(angle315) * midRadius, 0, Math.sin(angle315) * midRadius]}
            rotation={[0, -angle315, 0]}
            width={gapWidth * 0.7}
            depth={50}
            isDarkMode={isDarkMode}
            hasStream={true}
            onHover={onHover}
        />
    );

    return <group>{amenities}</group>;
};

const UmbilicalTower: React.FC<{
  config: UmbilicalTowerConfig;
  ring: RingConfig;
  simState: SimulationState;
  isDarkMode: boolean;
  onHover?: (info: HoverInfo | null) => void;
}> = ({ config, ring, simState, isDarkMode, onHover }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current && simState.isPlaying) {
      const radPerSec = (ring.rotationSpeed / 60) * (Math.PI / 180);
      meshRef.current.rotation.y += radPerSec * delta * simState.timeScale;
    }
  });

  const angleRad = (config.anglePosition * Math.PI) / 180;
  const towerColor = config.status === 'active' ? (isDarkMode ? "#6366f1" : "#3b82f6") :
                     config.status === 'maintenance' ? "#fbbf24" : "#6b7280";
  const pipeColor = isDarkMode ? "#475569" : "#94a3b8";

  return (
    <group ref={meshRef} rotation={[0, -angleRad, 0]}>
      {/* Main Tower Body at ring inner edge */}
      <mesh
        position={[config.innerRadius, config.height / 2, 0]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover?.({
            type: 'umbilical',
            name: 'Umbilical Tower',
            description: 'Utility conduit providing water, power, and data to the rotating ring.',
            details: `Status: ${config.status} • Water: ${Math.round(config.waterCapacityLitersPerDay/1000)}k L/day • Power: ${config.powerCapacityMW.toFixed(1)} MW`,
            position: { x: e.clientX, y: e.clientY }
          });
        }}
        onPointerOut={() => onHover?.(null)}
      >
        <cylinderGeometry args={[8, 12, config.height, 8]} />
        <meshStandardMaterial
          color={towerColor}
          metalness={0.7}
          roughness={0.3}
          emissive={config.status === 'active' ? towerColor : '#000000'}
          emissiveIntensity={0.2}
        />
        <Edges color={isDarkMode ? "#1e293b" : "#e2e8f0"} />
      </mesh>

      {/* Rotary Union Housing (at base) */}
      <mesh position={[config.innerRadius, 0, 0]}>
        <cylinderGeometry args={[15, 15, 4, 12]} />
        <meshStandardMaterial color={pipeColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Multi-passage indicators (3 rings showing channels) */}
      {[0.3, 0.5, 0.7].map((heightRatio, i) => (
        <mesh key={i} position={[config.innerRadius, config.height * heightRatio, 0]}>
          <torusGeometry args={[10, 0.8, 8, 16]} />
          <meshStandardMaterial
            color={i === 0 ? "#3b82f6" : i === 1 ? "#84cc16" : "#f59e0b"}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Ground Connection Pipe */}
      <mesh position={[config.innerRadius / 2, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[4, 4, config.innerRadius, 8]} />
        <meshStandardMaterial color={pipeColor} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};

const TunnelSystem: React.FC<{
    rings: RingConfig[];
    isDarkMode: boolean;
    onHover?: (info: HoverInfo | null) => void;
}> = ({ rings, isDarkMode, onHover }) => {
    const tunnelColor = isDarkMode ? "#334155" : "#64748b";
    const tunnelEntryColor = isDarkMode ? "#475569" : "#94a3b8";

    return (
        <group>
            {rings.slice(1).map((ring, i) => {
                // Create 4 tunnels per ring at cardinal directions
                const tunnels = [0, 90, 180, 270].map((angle, j) => {
                    const angleRad = (angle * Math.PI) / 180;
                    const x = Math.cos(angleRad) * ring.innerRadius;
                    const z = Math.sin(angleRad) * ring.innerRadius;

                    // Ring width to tunnel under
                    const ringWidth = ring.outerRadius - ring.innerRadius;

                    return (
                        <group key={`tunnel-${ring.id}-${j}`} position={[x, -15, z]} rotation={[0, -angleRad, 0]}>
                            {/* Main Tunnel Tube */}
                            <mesh
                                rotation={[0, 0, Math.PI/2]}
                                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                                    e.stopPropagation();
                                    onHover?.({
                                        type: 'tunnel',
                                        name: 'Transit Tunnel',
                                        description: 'Underground rail passage allowing travel beneath rotating rings.',
                                        details: `${ring.name} • Direction: ${['North', 'East', 'South', 'West'][j]}`,
                                        position: { x: e.clientX, y: e.clientY }
                                    });
                                }}
                                onPointerOut={() => onHover?.(null)}
                            >
                                <cylinderGeometry args={[12, 12, ringWidth + 40, 16]} />
                                <meshStandardMaterial
                                    color={tunnelColor}
                                    side={THREE.DoubleSide}
                                    metalness={0.3}
                                    roughness={0.7}
                                />
                            </mesh>

                            {/* Tunnel Entry Portal (inner side) */}
                            <mesh position={[-ringWidth/2 - 20, 0, 0]} rotation={[0, Math.PI/2, 0]}>
                                <ringGeometry args={[8, 14, 16]} />
                                <meshStandardMaterial color={tunnelEntryColor} />
                            </mesh>

                            {/* Tunnel Entry Portal (outer side) */}
                            <mesh position={[ringWidth/2 + 20, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
                                <ringGeometry args={[8, 14, 16]} />
                                <meshStandardMaterial color={tunnelEntryColor} />
                            </mesh>

                            {/* Rail track indicator */}
                            <mesh position={[0, -8, 0]} rotation={[0, 0, Math.PI/2]}>
                                <boxGeometry args={[2, ringWidth + 40, 6]} />
                                <meshStandardMaterial color="#78716c" metalness={0.8} roughness={0.3} />
                            </mesh>
                        </group>
                    );
                });

                return <group key={`tunnels-${ring.id}`}>{tunnels}</group>;
            })}
        </group>
    );
};

// Instanced people rendering - 2 InstancedMesh (body cylinders + head spheres) instead of ~160 individual meshes
interface ShowcasePeopleProps {
    ring2OuterRadius: number;
    ring2Height: number;
    ring3InnerRadius: number;
    bridgeY: number;
    isDarkMode: boolean;
}

const ShowcasePeople: React.FC<ShowcasePeopleProps> = ({
    ring2OuterRadius,
    ring2Height,
    ring3InnerRadius,
    bridgeY,
}) => {
    const bodyRef = useRef<THREE.InstancedMesh>(null);
    const headRef = useRef<THREE.InstancedMesh>(null);

    const bodyGeo = useMemo(() => new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8), []);
    const headGeo = useMemo(() => new THREE.SphereGeometry(0.3, 8, 8), []);
    const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8 }), []);
    const headMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f5d0c5', roughness: 0.9 }), []);

    // Memoize all person positions and colors deterministically (no Math.random in render)
    const people = useMemo(() => {
        const colors = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#f97316'];
        let ci = 0;
        const c = () => colors[ci++ % colors.length];

        const bridgeLength = ring3InnerRadius - ring2OuterRadius;
        const groundMid = ring2OuterRadius + bridgeLength / 2;
        const groundY = 2;
        const rooftopY = ring2Height + 2;
        const ring1To2Mid = ring2OuterRadius * 0.4;
        const ring3To4Mid = ring3InnerRadius + (ring3InnerRadius - ring2OuterRadius) * 0.5;

        const p: Array<{ pos: [number, number, number]; color: string }> = [];
        const add = (pos: [number, number, number], color?: string) => p.push({ pos, color: color || c() });

        // Bridge people
        add([ring2OuterRadius + bridgeLength * 0.2, bridgeY, 0]);
        add([ring2OuterRadius + bridgeLength * 0.4, bridgeY, 2]);
        add([ring2OuterRadius + bridgeLength * 0.6, bridgeY, -1.5]);
        add([ring2OuterRadius + bridgeLength * 0.8, bridgeY, 1]);

        // Rooftop - yoga deck
        add([ring2OuterRadius - 10, rooftopY, -3]);
        add([ring2OuterRadius - 10, rooftopY, 3]);

        // Rooftop bar
        add([ring2OuterRadius - 35, rooftopY, -2]);
        add([ring2OuterRadius - 35, rooftopY, 2]);
        add([ring2OuterRadius - 35, rooftopY, 6]);
        add([ring2OuterRadius - 38, rooftopY, 0]);

        // Viewing area
        add([ring2OuterRadius - 5, rooftopY, 8]);
        add([ring2OuterRadius - 5, rooftopY, -8]);

        // Joggers
        add([groundMid + 10, groundY, 15]);
        add([groundMid + 15, groundY, 18]);

        // Food truck area
        add([groundMid - 20, groundY, 10]);
        add([groundMid - 18, groundY, 13]);
        add([groundMid - 22, groundY, 8]);
        add([groundMid - 15, groundY, 11]);

        // Outdoor gym
        add([groundMid + 25, groundY, -10]);
        add([groundMid + 28, groundY, -12]);

        // Kids at playground
        add([groundMid, groundY, -20]);
        add([groundMid + 3, groundY, -22]);
        add([groundMid - 3, groundY, -18]);
        add([groundMid + 5, groundY, -25]);
        add([groundMid - 2, groundY, -23]);

        // Dog park
        add([groundMid - 30, groundY, -15]);
        add([groundMid - 35, groundY, -18]);

        // Benches
        add([ring2OuterRadius + 5, groundY, 25]);
        add([ring2OuterRadius + 5, groundY, -25]);

        // Ring 1-2 gap transit hub - bike racks
        add([ring1To2Mid, groundY, 12]);
        add([ring1To2Mid + 2, groundY, 14]);
        add([ring1To2Mid - 1, groundY, 10]);

        // Transit coffee area
        add([ring1To2Mid + 5, groundY, -8]);
        add([ring1To2Mid + 7, groundY, -6]);
        add([ring1To2Mid + 4, groundY, -10]);

        // Transit walkers
        add([ring1To2Mid - 8, groundY, 0]);
        add([ring1To2Mid + 10, groundY, 3]);
        add([ring1To2Mid, groundY, -15]);
        add([ring1To2Mid + 3, groundY, 18]);

        // More food trucks (lunch crowd)
        add([groundMid + 15, groundY, -18]);
        add([groundMid + 18, groundY, -20]);
        add([groundMid + 12, groundY, -22]);
        add([groundMid + 20, groundY, -19]);
        add([groundMid + 16, groundY, -16]);

        // Farmers market
        add([groundMid + 50, groundY, 8]);
        add([groundMid + 52, groundY, 12]);
        add([groundMid + 48, groundY, 14]);
        add([groundMid + 50, groundY, 6]);

        // Koi pond
        add([groundMid, groundY, 8]);
        add([groundMid + 6, groundY, -1]);
        add([groundMid - 5, groundY, 3]);

        // Ring 3-4 gap - skate park
        add([ring3To4Mid - 50, groundY, 15]);
        add([ring3To4Mid - 48, groundY, 18]);
        add([ring3To4Mid - 55, groundY, 13]);
        add([ring3To4Mid - 52, groundY, 20]);

        // Outdoor gym area
        add([ring3To4Mid - 38, groundY, -8]);
        add([ring3To4Mid - 40, groundY, -12]);
        add([ring3To4Mid - 35, groundY, -10]);
        add([ring3To4Mid - 42, groundY, -6]);

        // Basketball court
        add([ring3To4Mid + 37, groundY, -28]);
        add([ring3To4Mid + 39, groundY, -32]);
        add([ring3To4Mid + 35, groundY, -30]);
        add([ring3To4Mid + 38, groundY, -26]);
        add([ring3To4Mid + 36, groundY, -34]);

        // Picnic area
        add([ring3To4Mid - 10, groundY, -33]);
        add([ring3To4Mid - 6, groundY, -35]);
        add([ring3To4Mid - 2, groundY, -37]);
        add([ring3To4Mid - 8, groundY, -31]);

        // Botanical garden
        add([ring3To4Mid - 28, groundY, -43]);
        add([ring3To4Mid - 32, groundY, -46]);
        add([ring3To4Mid - 25, groundY, -48]);

        // More rooftop - yoga
        add([ring2OuterRadius - 12, rooftopY, 0]);
        add([ring2OuterRadius - 8, rooftopY, -5]);
        add([ring2OuterRadius - 14, rooftopY, 5]);

        // Greenhouse
        add([ring2OuterRadius - 45, rooftopY, 10]);
        add([ring2OuterRadius - 43, rooftopY, 14]);

        // Amphitheater
        add([ring2OuterRadius - 58, rooftopY, -3]);
        add([ring2OuterRadius - 62, rooftopY, -6]);
        add([ring2OuterRadius - 60, rooftopY, -8]);

        return p;
    }, [ring2OuterRadius, ring2Height, ring3InnerRadius, bridgeY]);

    useEffect(() => {
        if (!bodyRef.current || !headRef.current || people.length === 0) return;
        const mat = new THREE.Matrix4();
        const col = new THREE.Color();

        people.forEach((p, i) => {
            // Body at pos + 0.75 Y
            mat.makeTranslation(p.pos[0], p.pos[1] + 0.75, p.pos[2]);
            bodyRef.current!.setMatrixAt(i, mat);
            col.set(p.color);
            bodyRef.current!.setColorAt(i, col);

            // Head at pos + 1.8 Y
            mat.makeTranslation(p.pos[0], p.pos[1] + 1.8, p.pos[2]);
            headRef.current!.setMatrixAt(i, mat);
        });

        bodyRef.current.instanceMatrix.needsUpdate = true;
        if (bodyRef.current.instanceColor) bodyRef.current.instanceColor.needsUpdate = true;
        headRef.current.instanceMatrix.needsUpdate = true;
    }, [people]);

    return (
        <group>
            <instancedMesh ref={bodyRef} args={[bodyGeo, bodyMat, people.length]} />
            <instancedMesh ref={headRef} args={[headGeo, headMat, people.length]} />
        </group>
    );
};

interface ShowcaseRooftopAmenitiesProps {
  ringOuterRadius: number;
  ringHeight: number;
  isDarkMode: boolean;
  onHover?: (info: HoverInfo | null) => void;
}

const ShowcaseRooftopAmenities: React.FC<ShowcaseRooftopAmenitiesProps> = ({
  ringOuterRadius,
  ringHeight,
  isDarkMode,
  onHover
}) => {
  const rooftopY = ringHeight + 3;
  const yogaColor = isDarkMode ? "#06b6d4" : "#22d3ee";
  const barColor = isDarkMode ? "#f97316" : "#fb923c";
  const beehiveColor = isDarkMode ? "#eab308" : "#fde047";
  const greenhouseColor = isDarkMode ? "#16a34a" : "#86efac";
  const seatingColor = isDarkMode ? "#3b82f6" : "#60a5fa";
  const cisternColor = isDarkMode ? "#0284c7" : "#38bdf8";
  const gardenColor = isDarkMode ? "#15803d" : "#4ade80";
  const solarColor = isDarkMode ? "#1e3a8a" : "#3730a3";
  const petParkColor = isDarkMode ? "#22c55e" : "#86efac";
  const sculptureColor = isDarkMode ? "#f3f4f6" : "#ffffff";

  return (
    <group>
      {/* 1. Yoga Deck - flat cyan platform with silhouettes */}
      <group position={[ringOuterRadius - 15, rooftopY, -25]}>
        <mesh
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'rooftop-garden',
              name: 'Yoga Deck',
              description: 'Open-air yoga and meditation space with sunrise views.',
              details: 'Capacity: 20 practitioners • Classes daily at 6am',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <boxGeometry args={[12, 0.5, 10]} />
          <meshStandardMaterial color={yogaColor} roughness={0.6} />
        </mesh>
        {/* Yoga figure silhouettes */}
        {[-3, 0, 3].map((x, i) => (
          <mesh key={i} position={[x, 1, 0]}>
            <boxGeometry args={[0.5, 2, 0.5]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        ))}
      </group>

      {/* 2. Rooftop Bar/Lounge - orange platform with tables and umbrellas */}
      <group position={[ringOuterRadius - 40, rooftopY, -10]}>
        <mesh
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'rooftop-restaurant',
              name: 'Sky Lounge',
              description: 'Cocktail bar and social space with panoramic views.',
              details: 'Open 5pm-midnight • Capacity: 40 guests',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <boxGeometry args={[18, 0.5, 12]} />
          <meshStandardMaterial color={barColor} roughness={0.5} emissive={barColor} emissiveIntensity={isDarkMode ? 0.2 : 0} />
        </mesh>
        {/* Tables (cylinders) */}
        {[[-4, -3], [4, -3], [-4, 3], [4, 3]].map(([x, z], i) => (
          <mesh key={`table-${i}`} position={[x, 1, z]}>
            <cylinderGeometry args={[0.8, 0.8, 1.5, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        ))}
        {/* Umbrella canopies (cones) */}
        {[[-4, -3], [4, -3]].map(([x, z], i) => (
          <mesh key={`umbrella-${i}`} position={[x, 3.5, z]}>
            <coneGeometry args={[2, 2.5, 8]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        ))}
      </group>

      {/* 3. Beehive Cluster - 3-4 small yellow hexagonal boxes */}
      <group position={[ringOuterRadius - 20, rooftopY, 8]}>
        <mesh
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'rooftop-garden',
              name: 'Urban Apiary',
              description: 'Rooftop beehives producing local honey and pollinating city gardens.',
              details: '4 hives • ~200k bees • 150kg honey/year',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <boxGeometry args={[8, 0.3, 6]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        {[[-2, -1.5], [2, -1.5], [-2, 1.5], [2, 1.5]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.8, z]}>
            <cylinderGeometry args={[0.7, 0.7, 1.2, 6]} />
            <meshStandardMaterial color={beehiveColor} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* 4. Greenhouse - transparent green-tinted box */}
      <mesh
        position={[ringOuterRadius - 45, rooftopY + 2, 12]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover?.({
            type: 'rooftop-garden',
            name: 'Climate-Controlled Greenhouse',
            description: 'Year-round food production with hydroponics and aquaponics.',
            details: 'Yields: 500kg vegetables/month • 80% water savings',
            position: { x: e.clientX, y: e.clientY }
          });
        }}
        onPointerOut={() => onHover?.(null)}
      >
        <boxGeometry args={[14, 4, 10]} />
        <meshStandardMaterial
          color={greenhouseColor}
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* 5. Small Amphitheater - curved seating facing stage */}
      <group position={[ringOuterRadius - 60, rooftopY, -5]}>
        <mesh
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'rooftop-restaurant',
              name: 'Amphitheater',
              description: 'Outdoor performance venue for concerts, theater, and community events.',
              details: 'Capacity: 150 seats • Weekly live performances',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <cylinderGeometry args={[10, 10, 0.5, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={seatingColor} roughness={0.7} />
        </mesh>
        {/* Seating tiers */}
        {[0, 1, 2].map((tier) => (
          <mesh key={tier} position={[0, tier * 0.8, -8 + tier * 1.5]} rotation={[Math.PI / 6, 0, 0]}>
            <boxGeometry args={[16, 0.4, 1.5]} />
            <meshStandardMaterial color={seatingColor} />
          </mesh>
        ))}
        {/* Stage */}
        <mesh position={[0, 0.5, 8]}>
          <boxGeometry args={[8, 1, 4]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

      {/* 6. Rain Cistern - blue cylinder tank */}
      <mesh
        position={[ringOuterRadius - 10, rooftopY + 2, 20]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover?.({
            type: 'rooftop-garden',
            name: 'Rainwater Cistern',
            description: 'Collects and stores rainwater for irrigation and non-potable uses.',
            details: 'Capacity: 10,000 liters • Reduces water demand by 30%',
            position: { x: e.clientX, y: e.clientY }
          });
        }}
        onPointerOut={() => onHover?.(null)}
      >
        <cylinderGeometry args={[3, 3, 4, 16]} />
        <meshStandardMaterial color={cisternColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 7. Vertical Garden Wall - tall thin green box at edge */}
      <mesh
        position={[ringOuterRadius - 2, rooftopY + 4, -20]}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          onHover?.({
            type: 'rooftop-garden',
            name: 'Living Wall',
            description: 'Vertical garden with native plants providing insulation and air filtration.',
            details: '200+ plant species • Reduces building heat by 15%',
            position: { x: e.clientX, y: e.clientY }
          });
        }}
        onPointerOut={() => onHover?.(null)}
      >
        <boxGeometry args={[0.8, 8, 15]} />
        <meshStandardMaterial color={gardenColor} roughness={0.9} />
      </mesh>

      {/* 8. Solar Array - angled dark blue panels */}
      <group position={[ringOuterRadius - 30, rooftopY + 2, -30]}>
        <mesh
          rotation={[0.3, 0, 0]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'solar-canopy',
              name: 'Rooftop Solar Array',
              description: 'High-efficiency photovoltaic panels generating renewable energy.',
              details: 'Output: 25 kW peak • Powers building commons',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <boxGeometry args={[12, 0.3, 8]} />
          <meshStandardMaterial
            color={solarColor}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 9. Pet Park - small fenced area with green floor */}
      <group position={[ringOuterRadius - 25, rooftopY, 22]}>
        <mesh
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'rooftop-garden',
              name: 'Rooftop Dog Park',
              description: 'Safe off-leash area for resident pets with artificial turf and agility equipment.',
              details: 'Open sunrise to sunset • Water station included',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <boxGeometry args={[10, 0.3, 8]} />
          <meshStandardMaterial color={petParkColor} roughness={0.9} />
        </mesh>
        {/* Fence outline */}
        {[[-5, 0, 0], [5, 0, 0], [0, 0, -4], [0, 0, 4]].map(([x, y, z], i) => (
          <mesh
            key={i}
            position={[x, 1.5, z]}
            rotation={i < 2 ? [0, 0, 0] : [0, Math.PI / 2, 0]}
          >
            <boxGeometry args={i < 2 ? [0.2, 3, 8] : [0.2, 3, 10]} />
            <meshStandardMaterial color="#6b7280" />
          </mesh>
        ))}
      </group>

      {/* 10. Art Sculpture - abstract white geometric shape */}
      <group position={[ringOuterRadius - 50, rooftopY + 3, 20]}>
        <mesh
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'rooftop-restaurant',
              name: 'Kinetic Art Installation',
              description: 'Abstract sculpture "Convergence" by local artist collective.',
              details: 'Illuminated at night • Rotates slowly with wind',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
          rotation={[0.2, 0.7, 0.3]}
        >
          <boxGeometry args={[3, 6, 1]} />
          <meshStandardMaterial
            color={sculptureColor}
            metalness={0.8}
            roughness={0.2}
            emissive={sculptureColor}
            emissiveIntensity={isDarkMode ? 0.1 : 0}
          />
        </mesh>
        <mesh position={[2, 1, 1]} rotation={[0.5, 0.3, 0.1]}>
          <sphereGeometry args={[1.5, 12, 8]} />
          <meshStandardMaterial color={sculptureColor} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-1, -1, 2]} rotation={[0.3, 1, 0.4]}>
          <coneGeometry args={[1.2, 4, 6]} />
          <meshStandardMaterial color={sculptureColor} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// Memoized park zone geometries to avoid recreating Shape/ShapeGeometry every render
const MemoizedParkZones: React.FC<{
    rings: RingConfig[];
    isDarkMode: boolean;
    showGroundAmenities: boolean;
    onHover?: (info: HoverInfo | null) => void;
}> = ({ rings, isDarkMode, showGroundAmenities, onHover }) => {
    const parkGeos = useMemo(() => {
        return rings.slice(0, -1).map((ring, i) => {
            const nextRing = rings[i + 1];
            const shape = new THREE.Shape();
            shape.absarc(0, 0, nextRing.innerRadius, 0, Math.PI * 2, false);
            const hole = new THREE.Path();
            hole.absarc(0, 0, ring.outerRadius, 0, Math.PI * 2, true);
            shape.holes.push(hole);
            return {
                geo: new THREE.ShapeGeometry(shape),
                innerRadius: ring.outerRadius,
                outerRadius: nextRing.innerRadius,
                index: i,
            };
        });
    }, [rings]);

    return (
        <>
            {parkGeos.map((park, i) => (
                <group key={`park-${i}`}>
                    <mesh geometry={park.geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
                        <meshStandardMaterial color={isDarkMode ? "#064e3b" : "#bbf7d0"} roughness={1} />
                    </mesh>
                    {showGroundAmenities && (
                        <GroundAmenities
                            innerRadius={park.innerRadius}
                            outerRadius={park.outerRadius}
                            index={park.index}
                            isDarkMode={isDarkMode}
                            onHover={onHover}
                        />
                    )}
                </group>
            ))}
        </>
    );
};

const SceneContent: React.FC<SceneProps> = ({ rings, walkways, simState, resetTrigger, isDarkMode, globalOpacity, showUtilities = false, showTunnels = false, showRooftopAmenities = true, showGroundAmenities = true, showSolarPanels = true, showInfrastructure = false, onHover }) => {
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

      {/* Park Zones between rings - memoized geometries */}
      <MemoizedParkZones rings={rings} isDarkMode={isDarkMode} showGroundAmenities={showGroundAmenities} onHover={onHover} />

      {rings.map(ring => (
        <CityRing key={ring.id} ring={ring} simState={simState} isDarkMode={isDarkMode} globalOpacity={globalOpacity} showRooftopAmenities={showRooftopAmenities} onHover={onHover} />
      ))}

      {walkways.map(w => (
          <StaticBridge key={w.id} config={w} rings={rings} isDarkMode={isDarkMode} showSolarPanels={showSolarPanels} onHover={onHover} />
      ))}

      {/* Umbilical Towers */}
      {showUtilities && rings.map(ring =>
        ring.umbilicals.map(umbilical => (
          <UmbilicalTower
            key={umbilical.id}
            config={umbilical}
            ring={ring}
            simState={simState}
            isDarkMode={isDarkMode}
            onHover={onHover}
          />
        ))
      )}

      {/* Underground Transit Tunnels */}
      {showTunnels && <TunnelSystem rings={rings} isDarkMode={isDarkMode} onHover={onHover} />}

      {/* Showcase Rooftop Amenities - Dense display on Ring 2, Section 0 */}
      {showRooftopAmenities && (() => {
        const ring2 = rings.find(r => r.id === 'r2');
        if (!ring2) return null;

        return (
          <group>
            <ShowcaseRooftopAmenities
              ringOuterRadius={ring2.outerRadius}
              ringHeight={ring2.height}
              isDarkMode={isDarkMode}
              onHover={onHover}
            />
          </group>
        );
      })()}

      {/* Lazy-loaded showcase components wrapped in Suspense */}
      <Suspense fallback={null}>
        {/* Showcase Ground Details - Urban furniture and decorative elements in gap between Ring 2 and Ring 3 */}
        {showGroundAmenities && (() => {
          const ring2 = rings.find(r => r.id === 'r2');
          const ring3 = rings.find(r => r.id === 'r3');
          if (!ring2 || !ring3) return null;

          const centerRadius = (ring2.outerRadius + ring3.innerRadius) / 2;
          const groundY = 0.5;

          return (
            <ShowcaseDetailsLazy
              centerRadius={centerRadius}
              groundY={groundY}
              rooftopY={ring2.height}
              ringOuterRadius={ring2.outerRadius}
              isDarkMode={isDarkMode}
              onHover={onHover}
            />
          );
        })()}

        {/* Showcase Ground Amenities - Dense variety of ground-level features in one sector */}
        {showGroundAmenities && (() => {
          const ring2 = rings.find(r => r.id === 'r2');
          const ring3 = rings.find(r => r.id === 'r3');
          if (!ring2 || !ring3) return null;

          return (
            <ShowcaseGroundAmenitiesLazy
              innerRadius={ring2.outerRadius}
              outerRadius={ring3.innerRadius}
              isDarkMode={isDarkMode}
              onHover={onHover}
            />
          );
        })()}

        {/* Showcase People - Human figures for scale and life (InstancedMesh) */}
        {showGroundAmenities && (() => {
          const ring2 = rings.find(r => r.id === 'r2');
          const ring3 = rings.find(r => r.id === 'r3');
          if (!ring2 || !ring3) return null;

          return (
            <ShowcasePeople
              ring2OuterRadius={ring2.outerRadius}
              ring2Height={ring2.height}
              ring3InnerRadius={ring3.innerRadius}
              bridgeY={4 * 4}
              isDarkMode={isDarkMode}
            />
          );
        })()}

        {/* Showcase Forest */}
        {showGroundAmenities && (() => {
          const ring2 = rings.find(r => r.id === 'r2');
          const ring3 = rings.find(r => r.id === 'r3');
          if (!ring2 || !ring3) return null;
          return (
            <ShowcaseForestLazy
              innerRadius={ring2.outerRadius}
              outerRadius={ring3.innerRadius}
              isDarkMode={isDarkMode}
              onHover={onHover}
            />
          );
        })()}

      {/* Ring 1-2 Gap Transit Hub */}
      {showGroundAmenities && (() => {
        const ring1 = rings.find(r => r.id === 'r1');
        const ring2 = rings.find(r => r.id === 'r2');
        if (!ring1 || !ring2) return null;
        return (
          <Ring12GapAmenities
            innerRadius={ring1.outerRadius}
            outerRadius={ring2.innerRadius}
            isDarkMode={isDarkMode}
            onHover={onHover}
          />
        );
      })()}

      {/* Ring 3-4 Gap Recreation Area */}
      {showGroundAmenities && (() => {
        const ring3 = rings.find(r => r.id === 'r3');
        const ring4 = rings.find(r => r.id === 'r4');
        if (!ring3 || !ring4) return null;
        return (
          <Ring34GapAmenities
            innerRadius={ring3.outerRadius}
            outerRadius={ring4.innerRadius}
            isDarkMode={isDarkMode}
            onHover={onHover}
          />
        );
      })()}

        {/* Showcase Beacon - Visible marker */}
        {showGroundAmenities && (
          <ShowcaseBeaconLazy
            position={[1175, 0, 0]}
            isDarkMode={isDarkMode}
          />
        )}
      </Suspense>

      {/* Infrastructure Overlay — water, sewage, power, waste, greywater */}
      {showInfrastructure && (
        <InfrastructureOverlay rings={rings} isDarkMode={isDarkMode} simState={simState} />
      )}

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