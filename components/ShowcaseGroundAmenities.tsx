import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { HoverInfo } from '../types';

interface ShowcaseGroundAmenitiesProps {
  innerRadius: number;  // outer radius of ring 2
  outerRadius: number;  // inner radius of ring 3
  isDarkMode: boolean;
  onHover?: (info: HoverInfo | null) => void;
}

export const ShowcaseGroundAmenities: React.FC<ShowcaseGroundAmenitiesProps> = ({
  innerRadius,
  outerRadius,
  isDarkMode,
  onHover
}) => {
  const midRadius = (innerRadius + outerRadius) / 2;
  const gapWidth = outerRadius - innerRadius;

  // Position everything around angle 0 (positive X direction)
  // Spread features across the ~150m gap width and along a 60-degree sector
  const centerAngle = 0;

  // Color scheme
  const concreteGray = isDarkMode ? "#475569" : "#94a3b8";
  const metalGray = isDarkMode ? "#64748b" : "#71717a";
  const grassGreen = isDarkMode ? "#166534" : "#22c55e";
  const waterBlue = isDarkMode ? "#0369a1" : "#38bdf8";
  const orangeAccent = isDarkMode ? "#ea580c" : "#f97316";

  return (
    <group position={[midRadius, 0, 0]}>
      {/* 1. Skate Park - positioned at inner edge */}
      <group position={[-gapWidth * 0.35, 1, 15]}>
        {/* Quarter pipe */}
        <mesh
          rotation={[0, 0, Math.PI / 6]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'skatepark',
              name: 'Community Skate Park',
              description: 'Street-style skating area with ramps, rails, and quarter pipes.',
              details: 'Open dawn to dusk • All skill levels',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <boxGeometry args={[12, 4, 8]} />
          <meshStandardMaterial color={concreteGray} roughness={0.95} />
        </mesh>
        {/* Rail */}
        <mesh position={[8, 1.5, 0]}>
          <boxGeometry args={[10, 0.3, 0.3]} />
          <meshStandardMaterial color={metalGray} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Flat ramp */}
        <mesh position={[-8, 0.5, -3]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[8, 2, 6]} />
          <meshStandardMaterial color={concreteGray} roughness={0.95} />
        </mesh>
      </group>

      {/* 2. Outdoor Gym - positioned at inner-mid */}
      <group position={[-gapWidth * 0.25, 1, -10]}>
        {/* Pull-up bar frame */}
        <group
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'outdoor-gym',
              name: 'Outdoor Fitness Station',
              description: 'Free outdoor gym equipment with pull-up bars, dip stations, and workout platforms.',
              details: '10 exercise stations • Weatherproof equipment',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 6, 8]} />
            <meshStandardMaterial color={metalGray} metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, 6, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 8, 8]} />
            <meshStandardMaterial color={metalGray} metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[4, 3, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 6, 8]} />
            <meshStandardMaterial color={metalGray} metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Platform */}
          <mesh position={[2, 0.5, 0]}>
            <boxGeometry args={[5, 1, 4]} />
            <meshStandardMaterial color={concreteGray} roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 3. Dog Park - positioned at center-inner */}
      <group position={[-gapWidth * 0.15, 1, 25]}>
        {/* Floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'dog-park',
              name: 'Off-Leash Dog Park',
              description: 'Fenced recreation area for dogs with separate small and large dog sections.',
              details: 'Water stations • Waste disposal • Shaded seating',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <planeGeometry args={[18, 15]} />
          <meshStandardMaterial color={grassGreen} roughness={0.95} />
        </mesh>
        {/* Low fence (represented by thin boxes) */}
        <mesh position={[9, 1, 0]}>
          <boxGeometry args={[0.2, 2, 15]} />
          <meshStandardMaterial color={metalGray} />
        </mesh>
        <mesh position={[-9, 1, 0]}>
          <boxGeometry args={[0.2, 2, 15]} />
          <meshStandardMaterial color={metalGray} />
        </mesh>
        {/* Small dog figures (simple boxes) */}
        <mesh position={[2, 0.5, 2]}>
          <boxGeometry args={[1.5, 1, 1]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        <mesh position={[-3, 0.5, -2]}>
          <boxGeometry args={[1.5, 1, 1]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

      {/* 4. Koi Pond - positioned at center */}
      <group position={[0, 1, 0]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'koi-pond',
              name: 'Koi Meditation Pond',
              description: 'Tranquil water feature with ornamental koi fish and zen garden elements.',
              details: '50+ koi • Natural filtration system',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <circleGeometry args={[8, 32]} />
          <meshStandardMaterial
            color={waterBlue}
            roughness={0.1}
            metalness={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Rocks around edge */}
        {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 9, 0.3, Math.sin(angle) * 9]}>
            <sphereGeometry args={[0.8, 8, 6]} />
            <meshStandardMaterial color="#78716c" roughness={0.95} />
          </mesh>
        ))}
      </group>

      {/* 5. Food Truck Area - positioned at center-outer */}
      <group position={[gapWidth * 0.15, 1, -20]}>
        {/* Food Truck 1 - Taco truck */}
        <group
          position={[0, 1.5, 0]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'food-truck',
              name: 'Food Truck Plaza',
              description: 'Rotating selection of gourmet food trucks offering diverse cuisine.',
              details: '3-5 trucks daily • Lunch 11am-3pm, Dinner 5pm-9pm',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <mesh>
            <boxGeometry args={[8, 3, 3]} />
            <meshStandardMaterial color="#dc2626" roughness={0.7} />
          </mesh>
          {/* Wheels */}
          <mesh position={[-2.5, -1.8, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 12]} />
            <meshStandardMaterial color="#171717" />
          </mesh>
          <mesh position={[2.5, -1.8, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 12]} />
            <meshStandardMaterial color="#171717" />
          </mesh>
        </group>
        {/* Food Truck 2 - Coffee truck */}
        <group position={[10, 1.5, 0]}>
          <mesh>
            <boxGeometry args={[7, 3, 3]} />
            <meshStandardMaterial color="#0891b2" roughness={0.7} />
          </mesh>
          <mesh position={[-2, -1.8, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 12]} />
            <meshStandardMaterial color="#171717" />
          </mesh>
          <mesh position={[2, -1.8, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 12]} />
            <meshStandardMaterial color="#171717" />
          </mesh>
        </group>
        {/* Food Truck 3 - Pizza truck */}
        <group position={[20, 1.5, 0]}>
          <mesh>
            <boxGeometry args={[8, 3, 3]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.7} />
          </mesh>
          <mesh position={[-2.5, -1.8, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 12]} />
            <meshStandardMaterial color="#171717" />
          </mesh>
          <mesh position={[2.5, -1.8, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 12]} />
            <meshStandardMaterial color="#171717" />
          </mesh>
        </group>
      </group>

      {/* 6. Farmers Market - positioned at outer edge */}
      <group position={[gapWidth * 0.35, 1, 10]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <group
            key={i}
            position={[0, 0, i * 6 - 12]}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              onHover?.({
                type: 'farmers-market',
                name: 'Weekend Farmers Market',
                description: 'Local vendors selling fresh produce, artisan goods, and crafts.',
                details: 'Saturdays 8am-2pm • 30+ vendors',
                position: { x: e.clientX, y: e.clientY }
              });
            }}
            onPointerOut={() => onHover?.(null)}
          >
            {/* Booth base */}
            <mesh position={[0, 1, 0]}>
              <boxGeometry args={[4, 2, 4]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#ffffff" : "#fef3c7"} roughness={0.8} />
            </mesh>
            {/* Canopy roof */}
            <mesh position={[0, 3.5, 0]}>
              <coneGeometry args={[3, 1.5, 4]} />
              <meshStandardMaterial color={i % 3 === 0 ? "#dc2626" : i % 3 === 1 ? "#16a34a" : "#2563eb"} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 7. Basketball Court - positioned at outer-mid */}
      <group position={[gapWidth * 0.25, 1, -30]}>
        {/* Court surface */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'basketball',
              name: 'Basketball Court',
              description: 'Full-court basketball with night lighting for evening games.',
              details: 'Regulation size • LED lighting • Free access',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <planeGeometry args={[15, 28]} />
          <meshStandardMaterial color={orangeAccent} roughness={0.8} />
        </mesh>
        {/* Hoop 1 */}
        <group position={[0, 0, 13]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 6, 8]} />
            <meshStandardMaterial color={metalGray} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 6, 1]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.9, 0.1, 8, 16]} />
            <meshStandardMaterial color={orangeAccent} metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, 6.5, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.9, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
        </group>
        {/* Hoop 2 */}
        <group position={[0, 0, -13]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 6, 8]} />
            <meshStandardMaterial color={metalGray} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 6, -1]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.9, 0.1, 8, 16]} />
            <meshStandardMaterial color={orangeAccent} metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* 8. Picnic Area - positioned near center */}
      <group position={[-gapWidth * 0.05, 1, -35]}>
        {[0, 1, 2, 3].map((i) => (
          <group
            key={i}
            position={[i * 6 - 9, 0, (i % 2) * 4]}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              onHover?.({
                type: 'picnic',
                name: 'Picnic Grove',
                description: 'Shaded picnic area with tables, grills, and family-friendly spaces.',
                details: '12 tables • 6 grills • Playground nearby',
                position: { x: e.clientX, y: e.clientY }
              });
            }}
            onPointerOut={() => onHover?.(null)}
          >
            {/* Table top */}
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[4, 0.2, 2]} />
              <meshStandardMaterial color="#78350f" roughness={0.9} />
            </mesh>
            {/* Legs */}
            <mesh position={[-1.5, 0.75, -0.7]}>
              <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
              <meshStandardMaterial color={metalGray} />
            </mesh>
            <mesh position={[1.5, 0.75, -0.7]}>
              <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
              <meshStandardMaterial color={metalGray} />
            </mesh>
            <mesh position={[-1.5, 0.75, 0.7]}>
              <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
              <meshStandardMaterial color={metalGray} />
            </mesh>
            <mesh position={[1.5, 0.75, 0.7]}>
              <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
              <meshStandardMaterial color={metalGray} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 9. Fountain - positioned center-front */}
      <group position={[gapWidth * 0.05, 1, 35]}>
        {/* Base tier */}
        <mesh
          position={[0, 0.5, 0]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'fountain',
              name: 'Plaza Fountain',
              description: 'Multi-tiered decorative fountain with programmable water displays.',
              details: 'Evening light shows • Recirculating water system',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <cylinderGeometry args={[6, 7, 1, 16]} />
          <meshStandardMaterial color={concreteGray} roughness={0.8} />
        </mesh>
        {/* Water in base */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[5.5, 5.5, 0.5, 16]} />
          <meshStandardMaterial color={waterBlue} transparent opacity={0.7} roughness={0.1} />
        </mesh>
        {/* Middle tier */}
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[3, 4, 1.5, 12]} />
          <meshStandardMaterial color={concreteGray} roughness={0.8} />
        </mesh>
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[2.8, 2.8, 0.3, 12]} />
          <meshStandardMaterial color={waterBlue} transparent opacity={0.7} roughness={0.1} />
        </mesh>
        {/* Top tier */}
        <mesh position={[0, 4.5, 0]}>
          <cylinderGeometry args={[1.5, 2, 1, 10]} />
          <meshStandardMaterial color={concreteGray} roughness={0.8} />
        </mesh>
        <mesh position={[0, 5.3, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 0.2, 10]} />
          <meshStandardMaterial color={waterBlue} transparent opacity={0.7} roughness={0.1} />
        </mesh>
        {/* Water stream effect */}
        <mesh position={[0, 6.5, 0]}>
          <cylinderGeometry args={[0.3, 0.1, 2, 8]} />
          <meshStandardMaterial color={waterBlue} transparent opacity={0.5} />
        </mesh>
      </group>

      {/* 10. Botanical Garden - positioned inner-mid section */}
      <group position={[-gapWidth * 0.2, 1, -45]}>
        {/* Various planted sections */}
        {[
          { color: "#f43f5e", pos: [0, 0, 0] },
          { color: "#a855f7", pos: [4, 0, 2] },
          { color: "#eab308", pos: [8, 0, 0] },
          { color: "#ec4899", pos: [2, 0, -3] },
          { color: "#22d3ee", pos: [6, 0, -3] },
          { color: "#84cc16", pos: [10, 0, -2] },
          { color: "#fb923c", pos: [4, 0, 4] },
          { color: "#8b5cf6", pos: [8, 0, 4] },
        ].map((plant, i) => (
          <mesh
            key={i}
            position={plant.pos as [number, number, number]}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              onHover?.({
                type: 'botanical-garden',
                name: 'Botanical Display Garden',
                description: 'Curated collection of native and exotic plants with educational signage.',
                details: '200+ species • Seasonal displays • Guided tours available',
                position: { x: e.clientX, y: e.clientY }
              });
            }}
            onPointerOut={() => onHover?.(null)}
          >
            <boxGeometry args={[2, 0.5, 2]} />
            <meshStandardMaterial color={plant.color} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 11. Mini Golf - positioned outer-front */}
      <group position={[gapWidth * 0.3, 1, 40]}>
        {/* Winding path */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'mini-golf',
              name: 'Mini Golf Course',
              description: '9-hole miniature golf course with creative obstacles and landscaping.',
              details: '$8 per round • Family-friendly • All ages',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <planeGeometry args={[20, 35]} />
          <meshStandardMaterial color="#15803d" roughness={0.95} />
        </mesh>
        {/* Obstacles - simple boxes and cylinders */}
        <mesh position={[2, 0.5, 5]}>
          <boxGeometry args={[3, 1, 2]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[-3, 1, -5]}>
          <cylinderGeometry args={[1.5, 1.5, 2, 8]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
        <mesh position={[4, 0.3, -10]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[4, 0.6, 1]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[-5, 1.5, 8]}>
          <coneGeometry args={[1.2, 3, 6]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
        {/* Windmill obstacle */}
        <group position={[0, 2, -15]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.8, 4, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 4, 0]}>
            <boxGeometry args={[5, 0.3, 1]} />
            <meshStandardMaterial color="#f97316" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
