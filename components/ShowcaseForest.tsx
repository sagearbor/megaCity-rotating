import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
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
        title: 'Showcase Forest',
        description: 'Dense urban forest with native trees and natural stream',
        position: [midRadius, 15, 0]
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

      {/* Trees */}
      {trees.map((tree, index) => (
        <group key={`tree-${index}`} position={[tree.x, 0, tree.z]}>
          {/* Trunk */}
          <mesh position={[0, tree.height / 2, 0]}>
            <cylinderGeometry args={[0.8 * tree.scale, 1 * tree.scale, tree.height, 8]} />
            <meshStandardMaterial color={trunkColor} />
          </mesh>

          {/* Foliage */}
          {tree.type === 'pine' ? (
            // Pine tree: cone shape
            <mesh position={[0, tree.height + 6 * tree.scale, 0]}>
              <coneGeometry args={[5 * tree.scale, 12 * tree.scale, 8]} />
              <meshStandardMaterial color={pineColor} />
            </mesh>
          ) : (
            // Oak tree: sphere shape
            <mesh position={[0, tree.height + 4 * tree.scale, 0]}>
              <sphereGeometry args={[6 * tree.scale, 8, 8]} />
              <meshStandardMaterial color={oakColor} />
            </mesh>
          )}
        </group>
      ))}

      {/* Rocks */}
      {rocks.map((rock, index) => (
        <mesh key={`rock-${index}`} position={[rock.x, rock.scale * 0.5, rock.z]}>
          <sphereGeometry args={[rock.scale, 6, 6]} />
          <meshStandardMaterial color={rockColor} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};
