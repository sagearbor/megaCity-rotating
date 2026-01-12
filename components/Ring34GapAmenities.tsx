import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { HoverInfo } from '../types';

interface Ring34GapAmenitiesProps {
  innerRadius: number;  // ring 3 outer (~1400)
  outerRadius: number;  // ring 4 inner (~1550)
  isDarkMode: boolean;
  onHover?: (info: HoverInfo | null) => void;
}

export const Ring34GapAmenities: React.FC<Ring34GapAmenitiesProps> = ({
  innerRadius,
  outerRadius,
  isDarkMode,
  onHover,
}) => {
  const midRadius = (innerRadius + outerRadius) / 2;
  const gapWidth = outerRadius - innerRadius;

  // Color palette
  const colors = {
    exercise: isDarkMode ? '#4ade80' : '#22c55e', // green
    picnic: isDarkMode ? '#fbbf24' : '#f59e0b', // amber
    playground: isDarkMode ? '#f472b6' : '#ec4899', // pink
    garden: isDarkMode ? '#86efac' : '#4ade80', // light green
    amphitheater: isDarkMode ? '#a78bfa' : '#8b5cf6', // violet
    path: isDarkMode ? '#94a3b8' : '#64748b', // slate
  };

  const handleHover = (name: string, type: string) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (onHover) {
      onHover({
        name,
        type,
        details: `Recreation facility in Ring 3-4 gap`,
      });
    }
  };

  const handleHoverEnd = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (onHover) {
      onHover(null);
    }
  };

  // Calculate positions along the gap at angle 0 (positive X)
  const positions = {
    exercise: { r: innerRadius + gapWidth * 0.2, angle: 0 },
    picnic: { r: innerRadius + gapWidth * 0.35, angle: 0 },
    playground: { r: innerRadius + gapWidth * 0.5, angle: 0 },
    garden: { r: innerRadius + gapWidth * 0.65, angle: 0 },
    amphitheater: { r: innerRadius + gapWidth * 0.85, angle: 0 },
  };

  // Helper to convert polar to cartesian
  const polar = (r: number, angle: number) => ({
    x: r * Math.cos(angle),
    z: r * Math.sin(angle),
  });

  return (
    <group name="ring34-gap-amenities">
      {/* Outdoor Exercise Area */}
      <group position={[positions.exercise.r, 0, 0]}>
        {/* Main exercise pad */}
        <mesh
          position={[0, 0.5, 0]}
          onPointerOver={handleHover('Outdoor Exercise Area', 'Recreation')}
          onPointerOut={handleHoverEnd}
        >
          <boxGeometry args={[25, 1, 25]} />
          <meshStandardMaterial color={colors.exercise} />
        </mesh>

        {/* Exercise equipment - represented as simple boxes */}
        {[-8, -3, 3, 8].map((offset, i) => (
          <mesh
            key={i}
            position={[offset, 2.5, 0]}
            onPointerOver={handleHover('Exercise Equipment', 'Fitness')}
            onPointerOut={handleHoverEnd}
          >
            <boxGeometry args={[3, 4, 3]} />
            <meshStandardMaterial color={colors.exercise} />
          </mesh>
        ))}
      </group>

      {/* Picnic Grove */}
      <group position={[positions.picnic.r, 0, 0]}>
        {/* Picnic tables - 3x2 arrangement */}
        {[-10, 0, 10].map((x, i) =>
          [-5, 5].map((z, j) => (
            <group key={`${i}-${j}`} position={[x, 0, z]}>
              {/* Table top */}
              <mesh
                position={[0, 3, 0]}
                onPointerOver={handleHover('Picnic Table', 'Dining')}
                onPointerOut={handleHoverEnd}
              >
                <boxGeometry args={[6, 0.3, 3]} />
                <meshStandardMaterial color={colors.picnic} />
              </mesh>
              {/* Table legs */}
              {[-2.5, 2.5].map((legX, k) =>
                [-1, 1].map((legZ, l) => (
                  <mesh key={`${k}-${l}`} position={[legX, 1.5, legZ]}>
                    <cylinderGeometry args={[0.2, 0.2, 3]} />
                    <meshStandardMaterial color={colors.picnic} />
                  </mesh>
                ))
              )}
            </group>
          ))
        )}

        {/* Trees around picnic area */}
        {[-15, -8, 8, 15].map((x, i) =>
          [-8, 8].map((z, j) => (
            <group key={`tree-${i}-${j}`} position={[x, 0, z]}>
              {/* Trunk */}
              <mesh position={[0, 3, 0]}>
                <cylinderGeometry args={[0.5, 0.6, 6]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
              {/* Canopy */}
              <mesh position={[0, 7, 0]}>
                <sphereGeometry args={[3, 8, 8]} />
                <meshStandardMaterial color="#2d5016" />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* Children's Playground */}
      <group position={[positions.playground.r, 0, 0]}>
        {/* Play structure */}
        <mesh
          position={[0, 2.5, 0]}
          onPointerOver={handleHover('Play Structure', 'Playground')}
          onPointerOut={handleHoverEnd}
        >
          <boxGeometry args={[12, 5, 12]} />
          <meshStandardMaterial color={colors.playground} />
        </mesh>

        {/* Slide */}
        <mesh
          position={[8, 2, 0]}
          rotation={[0, 0, Math.PI / 6]}
          onPointerOver={handleHover('Slide', 'Playground')}
          onPointerOut={handleHoverEnd}
        >
          <boxGeometry args={[2, 8, 3]} />
          <meshStandardMaterial color={colors.playground} />
        </mesh>

        {/* Swings */}
        {[-10, -6, -2].map((x, i) => (
          <group key={i} position={[x, 0, 8]}>
            {/* Swing frame */}
            <mesh position={[0, 4, 0]}>
              <boxGeometry args={[1, 8, 1]} />
              <meshStandardMaterial color={colors.playground} />
            </mesh>
            {/* Swing seat */}
            <mesh
              position={[0, 2, 0]}
              onPointerOver={handleHover('Swing', 'Playground')}
              onPointerOut={handleHoverEnd}
            >
              <boxGeometry args={[1.5, 0.3, 1.5]} />
              <meshStandardMaterial color={colors.playground} />
            </mesh>
          </group>
        ))}

        {/* Safety surface */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[18, 18, 0.2, 16]} />
          <meshStandardMaterial color={isDarkMode ? '#475569' : '#cbd5e1'} />
        </mesh>
      </group>

      {/* Community Garden Plots */}
      <group position={[positions.garden.r, 0, 0]}>
        {/* Garden beds - 4x3 grid */}
        {[-12, -4, 4, 12].map((x, i) =>
          [-8, 0, 8].map((z, j) => (
            <mesh
              key={`${i}-${j}`}
              position={[x, 0.5, z]}
              onPointerOver={handleHover(`Garden Plot ${i * 3 + j + 1}`, 'Community Garden')}
              onPointerOut={handleHoverEnd}
            >
              <boxGeometry args={[3, 1, 3]} />
              <meshStandardMaterial color={colors.garden} />
            </mesh>
          ))
        )}

        {/* Tool shed */}
        <mesh
          position={[18, 2, 0]}
          onPointerOver={handleHover('Garden Tool Shed', 'Storage')}
          onPointerOut={handleHoverEnd}
        >
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color={colors.garden} />
        </mesh>

        {/* Composters */}
        {[-18, -18].map((x, i) =>
          [-5, 5].map((z, j) => (
            <mesh
              key={`${i}-${j}`}
              position={[x, 1.5, z]}
              onPointerOver={handleHover('Composter', 'Garden')}
              onPointerOut={handleHoverEnd}
            >
              <cylinderGeometry args={[1, 1, 3]} />
              <meshStandardMaterial color={colors.garden} />
            </mesh>
          ))
        )}
      </group>

      {/* Small Amphitheater */}
      <group position={[positions.amphitheater.r, 0, 0]}>
        {/* Stage */}
        <mesh
          position={[0, 1, 0]}
          onPointerOver={handleHover('Amphitheater Stage', 'Performance')}
          onPointerOut={handleHoverEnd}
        >
          <boxGeometry args={[20, 2, 15]} />
          <meshStandardMaterial color={colors.amphitheater} />
        </mesh>

        {/* Stage roof/canopy */}
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[22, 0.5, 17]} />
          <meshStandardMaterial color={colors.amphitheater} />
        </mesh>

        {/* Support columns */}
        {[-9, 9].map((x, i) =>
          [-6, 6].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, 3.5, z]}>
              <cylinderGeometry args={[0.5, 0.5, 5]} />
              <meshStandardMaterial color={colors.amphitheater} />
            </mesh>
          ))
        )}

        {/* Seating tiers - semicircular arrangement */}
        {[1, 2, 3, 4, 5].map((tier, i) => (
          <group key={i} position={[0, 0, 15 + tier * 4]}>
            <mesh
              position={[0, 0.5 + tier * 0.5, 0]}
              onPointerOver={handleHover(`Seating Tier ${tier}`, 'Amphitheater')}
              onPointerOut={handleHoverEnd}
            >
              <boxGeometry args={[30 + tier * 4, 1, 3]} />
              <meshStandardMaterial color={colors.amphitheater} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Walking Paths - connecting all amenities */}
      <group name="walking-paths">
        {/* Main path along the gap */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((segment, i) => {
          const r = innerRadius + (gapWidth * segment) / 10;
          return (
            <mesh
              key={i}
              position={[r, 0.05, 0]}
              onPointerOver={handleHover('Walking Path', 'Recreation')}
              onPointerOut={handleHoverEnd}
            >
              <boxGeometry args={[gapWidth / 10 + 2, 0.1, 5]} />
              <meshStandardMaterial color={colors.path} />
            </mesh>
          );
        })}

        {/* Side paths */}
        {[positions.exercise.r, positions.picnic.r, positions.playground.r, positions.garden.r, positions.amphitheater.r].map((r, i) => (
          <React.Fragment key={i}>
            <mesh position={[r, 0.05, 8]}>
              <boxGeometry args={[3, 0.1, 16]} />
              <meshStandardMaterial color={colors.path} />
            </mesh>
            <mesh position={[r, 0.05, -8]}>
              <boxGeometry args={[3, 0.1, 16]} />
              <meshStandardMaterial color={colors.path} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* Lighting posts along paths */}
      {[positions.exercise.r, positions.picnic.r, positions.playground.r, positions.garden.r, positions.amphitheater.r].map((r, i) =>
        [-12, 12].map((z, j) => (
          <group key={`${i}-${j}`} position={[r, 0, z]}>
            {/* Post */}
            <mesh position={[0, 3, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 6]} />
              <meshStandardMaterial color={isDarkMode ? '#475569' : '#94a3b8'} />
            </mesh>
            {/* Light */}
            <mesh position={[0, 6, 0]}>
              <sphereGeometry args={[0.5, 8, 8]} />
              <meshStandardMaterial
                color={isDarkMode ? '#fef3c7' : '#fbbf24'}
                emissive={isDarkMode ? '#fbbf24' : '#f59e0b'}
                emissiveIntensity={isDarkMode ? 0.5 : 0.2}
              />
            </mesh>
            {isDarkMode && (
              <pointLight position={[0, 6, 0]} color="#fbbf24" intensity={0.5} distance={30} />
            )}
          </group>
        ))
      )}
    </group>
  );
};
