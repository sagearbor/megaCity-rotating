import React, { useMemo, useRef, useEffect } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { HoverInfo } from '../types';

interface ShowcaseForestProps {
  innerRadius: number;  // ring 2 outer
  outerRadius: number;  // ring 3 inner
  isDarkMode: boolean;
  onHover?: (info: HoverInfo | null) => void;
}

interface TreeData {
  x: number;
  z: number;
  type: 'pine' | 'oak';
  height: number;
  scale: number;
}

interface RockData {
  x: number;
  z: number;
  scale: number;
}

export const ShowcaseForest: React.FC<ShowcaseForestProps> = ({
  innerRadius,
  outerRadius,
  isDarkMode,
  onHover
}) => {
  // Calculate forest position (midpoint between rings at angle 0)
  const midRadius = (innerRadius + outerRadius) / 2;
  const forestWidth = outerRadius - innerRadius;
  const forestDepth = 150; // Depth along the arc

  // Generate random trees
  const trees = useMemo((): TreeData[] => {
    const treeCount = 35;
    const treesArray: TreeData[] = [];

    for (let i = 0; i < treeCount; i++) {
      // Random position within forest area
      const radiusOffset = (Math.random() - 0.5) * forestWidth * 0.8;
      const angleOffset = (Math.random() - 0.5) * forestDepth;

      const x = midRadius + radiusOffset;
      const z = angleOffset;

      treesArray.push({
        x,
        z,
        type: Math.random() > 0.5 ? 'pine' : 'oak',
        height: 15 + Math.random() * 10, // Height between 15-25
        scale: 0.8 + Math.random() * 0.4 // Scale variation
      });
    }

    return treesArray;
  }, [midRadius, forestWidth, forestDepth]);

  // Generate random rocks
  const rocks = useMemo((): RockData[] => {
    const rockCount = 20;
    const rocksArray: RockData[] = [];

    for (let i = 0; i < rockCount; i++) {
      const radiusOffset = (Math.random() - 0.5) * forestWidth * 0.8;
      const angleOffset = (Math.random() - 0.5) * forestDepth;

      rocksArray.push({
        x: midRadius + radiusOffset,
        z: angleOffset,
        scale: 1 + Math.random() * 2 // Size between 1-3
      });
    }

    return rocksArray;
  }, [midRadius, forestWidth, forestDepth]);

  // Split trees into pine and oak for instancing
  const { pines, oaks } = useMemo(() => {
    const p: TreeData[] = [];
    const o: TreeData[] = [];
    trees.forEach(t => (t.type === 'pine' ? p : o).push(t));
    return { pines: p, oaks: o };
  }, [trees]);

  // Stream path (slightly winding through the forest)
  const streamPath = useMemo(() => {
    const points = [];
    const segments = 20;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const z = (t - 0.5) * forestDepth;
      const x = midRadius + Math.sin(t * Math.PI * 2) * 15; // Slight winding

      points.push({ x, z });
    }

    return points;
  }, [midRadius, forestDepth]);

  // Handle hover events
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (onHover) {
      onHover({
        type: 'forest',
        name: 'Showcase Forest',
        description: 'Dense urban forest with native trees and natural stream',
        position: { x: e.clientX, y: e.clientY }
      });
    }
  };

  const handlePointerOut = () => {
    if (onHover) {
      onHover(null);
    }
  };

  // Color variations based on dark mode
  const forestFloorColor = isDarkMode ? '#1a3a1a' : '#2d5a2d';
  const pineColor = isDarkMode ? '#1a4d1a' : '#2d6b2d';
  const oakColor = isDarkMode ? '#267326' : '#3d9b3d';
  const trunkColor = isDarkMode ? '#4d3319' : '#6b4423';
  const streamColor = isDarkMode ? '#1a4d66' : '#4d9fcc';
  const rockColor = isDarkMode ? '#4d4d4d' : '#737373';

  // InstancedMesh refs for trees
  const pineTrunkRef = useRef<THREE.InstancedMesh>(null);
  const pineFoliageRef = useRef<THREE.InstancedMesh>(null);
  const oakTrunkRef = useRef<THREE.InstancedMesh>(null);
  const oakFoliageRef = useRef<THREE.InstancedMesh>(null);
  const rockRef = useRef<THREE.InstancedMesh>(null);

  // Memoized geometries
  const pineTrunkGeo = useMemo(() => new THREE.CylinderGeometry(0.8, 1, 1, 8), []);
  const pineFoliageGeo = useMemo(() => new THREE.ConeGeometry(5, 12, 8), []);
  const oakTrunkGeo = useMemo(() => new THREE.CylinderGeometry(0.8, 1, 1, 8), []);
  const oakFoliageGeo = useMemo(() => new THREE.SphereGeometry(6, 8, 8), []);
  const rockGeo = useMemo(() => new THREE.SphereGeometry(1, 6, 6), []);

  // Memoized materials
  const trunkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: trunkColor }), [trunkColor]);
  const pineMat = useMemo(() => new THREE.MeshStandardMaterial({ color: pineColor }), [pineColor]);
  const oakMat = useMemo(() => new THREE.MeshStandardMaterial({ color: oakColor }), [oakColor]);
  const rockMat = useMemo(() => new THREE.MeshStandardMaterial({ color: rockColor, roughness: 0.9 }), [rockColor]);

  // Set instance matrices for trees
  useEffect(() => {
    const mat = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scl = new THREE.Vector3();

    // Pine trees
    if (pineTrunkRef.current && pineFoliageRef.current) {
      pines.forEach((t, i) => {
        // Trunk: scale XZ by t.scale, Y by height
        pos.set(t.x, t.height / 2, t.z);
        scl.set(t.scale, t.height, t.scale);
        mat.compose(pos, quat, scl);
        pineTrunkRef.current!.setMatrixAt(i, mat);

        // Foliage: at top of trunk
        pos.set(t.x, t.height + 6 * t.scale, t.z);
        scl.set(t.scale, t.scale, t.scale);
        mat.compose(pos, quat, scl);
        pineFoliageRef.current!.setMatrixAt(i, mat);
      });
      pineTrunkRef.current.instanceMatrix.needsUpdate = true;
      pineFoliageRef.current.instanceMatrix.needsUpdate = true;
    }

    // Oak trees
    if (oakTrunkRef.current && oakFoliageRef.current) {
      oaks.forEach((t, i) => {
        pos.set(t.x, t.height / 2, t.z);
        scl.set(t.scale, t.height, t.scale);
        mat.compose(pos, quat, scl);
        oakTrunkRef.current!.setMatrixAt(i, mat);

        pos.set(t.x, t.height + 4 * t.scale, t.z);
        scl.set(t.scale, t.scale, t.scale);
        mat.compose(pos, quat, scl);
        oakFoliageRef.current!.setMatrixAt(i, mat);
      });
      oakTrunkRef.current.instanceMatrix.needsUpdate = true;
      oakFoliageRef.current.instanceMatrix.needsUpdate = true;
    }

    // Rocks
    if (rockRef.current) {
      rocks.forEach((r, i) => {
        pos.set(r.x, r.scale * 0.5, r.z);
        scl.set(r.scale, r.scale, r.scale);
        mat.compose(pos, quat, scl);
        rockRef.current!.setMatrixAt(i, mat);
      });
      rockRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [pines, oaks, rocks]);

  return (
    <group position={[0, 0, 0]}>
      {/* Forest floor */}
      <mesh
        position={[midRadius, 0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[forestWidth * 0.9, forestDepth]} />
        <meshStandardMaterial color={forestFloorColor} />
      </mesh>

      {/* Stream segments */}
      {streamPath.map((point, index) => {
        if (index === streamPath.length - 1) return null;

        const nextPoint = streamPath[index + 1];
        const dx = nextPoint.x - point.x;
        const dz = nextPoint.z - point.z;
        const length = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dz, dx);

        return (
          <mesh
            key={`stream-${index}`}
            position={[(point.x + nextPoint.x) / 2, 0.6, (point.z + nextPoint.z) / 2]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[length, 8]} />
            <meshStandardMaterial
              color={streamColor}
              transparent
              opacity={0.7}
              metalness={0.3}
              roughness={0.2}
            />
          </mesh>
        );
      })}

      {/* Instanced Trees */}
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

      {/* Instanced Rocks */}
      {rocks.length > 0 && (
        <instancedMesh ref={rockRef} args={[rockGeo, rockMat, rocks.length]} />
      )}
    </group>
  );
};
