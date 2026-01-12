import React from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { HoverInfo } from '../types';

interface Ring12GapAmenitiesProps {
  innerRadius: number;  // ring 1 outer (~800)
  outerRadius: number;  // ring 2 inner (~950)
  isDarkMode: boolean;
  onHover?: (info: HoverInfo | null) => void;
}

/**
 * Renders transit-focused amenities in the gap between Ring 1 and Ring 2 at angle 0.
 * This area extends the showcase zone inward, creating a vibrant transit hub.
 */
export const Ring12GapAmenities: React.FC<Ring12GapAmenitiesProps> = ({
  innerRadius,
  outerRadius,
  isDarkMode,
  onHover
}) => {
  const midRadius = (innerRadius + outerRadius) / 2;
  const gapWidth = outerRadius - innerRadius;

  // Color scheme optimized for transit amenities
  const concreteGray = isDarkMode ? "#475569" : "#94a3b8";
  const metalGray = isDarkMode ? "#64748b" : "#71717a";
  const glassBlue = isDarkMode ? "#1e3a8a" : "#60a5fa";
  const accentRed = isDarkMode ? "#dc2626" : "#ef4444";
  const accentGreen = isDarkMode ? "#16a34a" : "#22c55e";
  const woodBrown = isDarkMode ? "#78350f" : "#92400e";
  const pavingGray = isDarkMode ? "#334155" : "#cbd5e1";

  return (
    <group position={[midRadius, 0, 0]}>
      {/* 1. Transit Shelter/Bus Stop - positioned at inner edge */}
      <group position={[-gapWidth * 0.35, 0, 0]}>
        {/* Shelter structure */}
        <group
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'tunnel',
              name: 'Transit Shelter',
              description: 'Climate-controlled transit stop with real-time arrival displays.',
              details: 'Serves Routes 12, 34, 56 • 24/7 service • WiFi available',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          {/* Back wall */}
          <mesh position={[0, 2.5, -2]}>
            <boxGeometry args={[8, 5, 0.3]} />
            <meshStandardMaterial color={concreteGray} roughness={0.8} />
          </mesh>
          {/* Roof */}
          <mesh position={[0, 5.2, 0]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[8, 0.2, 4]} />
            <meshStandardMaterial
              color={glassBlue}
              transparent
              opacity={0.6}
              roughness={0.1}
              metalness={0.3}
            />
          </mesh>
          {/* Support posts */}
          <mesh position={[-3.5, 2.5, 1.5]}>
            <cylinderGeometry args={[0.15, 0.15, 5, 8]} />
            <meshStandardMaterial color={metalGray} metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[3.5, 2.5, 1.5]}>
            <cylinderGeometry args={[0.15, 0.15, 5, 8]} />
            <meshStandardMaterial color={metalGray} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Benches */}
          <mesh position={[-2, 0.8, -1.2]}>
            <boxGeometry args={[3, 0.3, 1]} />
            <meshStandardMaterial color={woodBrown} roughness={0.9} />
          </mesh>
          <mesh position={[2, 0.8, -1.2]}>
            <boxGeometry args={[3, 0.3, 1]} />
            <meshStandardMaterial color={woodBrown} roughness={0.9} />
          </mesh>
          {/* Digital display board */}
          <mesh position={[0, 3, -1.8]}>
            <boxGeometry args={[2, 1, 0.1]} />
            <meshStandardMaterial
              color={isDarkMode ? "#000000" : "#1f2937"}
              emissive={accentGreen}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      </group>

      {/* 2. Bike Share Station - positioned at inner-mid */}
      <group position={[-gapWidth * 0.15, 0, 8]}>
        <group
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'tunnel',
              name: 'Bike Share Station',
              description: 'Automated bike rental with electric and standard bikes.',
              details: '20 bikes • $2/hour • App or card payment',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          {/* Station kiosk */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[1.5, 3, 1]} />
            <meshStandardMaterial color={accentRed} roughness={0.6} />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 2, 0.6]}>
            <boxGeometry args={[1.2, 1.5, 0.05]} />
            <meshStandardMaterial
              color="#000000"
              emissive="#60a5fa"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Bike rack array */}
          {[0, 1, 2, 3, 4].map((i) => (
            <group key={i} position={[i * 2 - 4, 0, 4]}>
              {/* Bike dock */}
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[1, 0.6, 1.5]} />
                <meshStandardMaterial color={metalGray} metalness={0.6} roughness={0.4} />
              </mesh>
              {/* Bike frame */}
              <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.6, 0.08, 8, 12]} />
                <meshStandardMaterial color={i % 2 === 0 ? accentRed : "#0ea5e9"} metalness={0.5} roughness={0.5} />
              </mesh>
              {/* Handlebars */}
              <mesh position={[0, 1.5, 0.4]} rotation={[0, Math.PI / 2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
              {/* Wheels */}
              <mesh position={[0.5, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.35, 0.05, 8, 12]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
              <mesh position={[-0.5, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.35, 0.05, 8, 12]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* 3. Coffee Kiosk - positioned at center */}
      <group position={[0, 0, -6]}>
        <group
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'food-truck',
              name: 'Transit Coffee Kiosk',
              description: 'Quick-service coffee and pastries for commuters.',
              details: 'Open 5am-8pm • Coffee, tea, pastries • Grab and go',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          {/* Kiosk building */}
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[4, 4, 3]} />
            <meshStandardMaterial color={woodBrown} roughness={0.7} />
          </mesh>
          {/* Window/serving area */}
          <mesh position={[0, 2.5, 1.6]}>
            <boxGeometry args={[3, 2, 0.1]} />
            <meshStandardMaterial
              color={glassBlue}
              transparent
              opacity={0.4}
              metalness={0.3}
              roughness={0.1}
            />
          </mesh>
          {/* Counter */}
          <mesh position={[0, 1.5, 2]}>
            <boxGeometry args={[3.5, 0.3, 1]} />
            <meshStandardMaterial color={concreteGray} roughness={0.8} />
          </mesh>
          {/* Awning */}
          <mesh position={[0, 4.3, 2]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[4.5, 0.1, 1.5]} />
            <meshStandardMaterial color={accentRed} roughness={0.7} />
          </mesh>
          {/* Sign */}
          <mesh position={[0, 5, 0]}>
            <boxGeometry args={[2, 0.8, 0.1]} />
            <meshStandardMaterial
              color="#000000"
              emissive={accentRed}
              emissiveIntensity={0.5}
            />
          </mesh>
          {/* Coffee machine (decorative) */}
          <mesh position={[-0.8, 2, 0.5]}>
            <boxGeometry args={[0.8, 1.2, 0.6]} />
            <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* 4. Information Kiosk - positioned at center-outer */}
      <group position={[gapWidth * 0.15, 0, -10]}>
        <group
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'tunnel',
              name: 'Transit Information Kiosk',
              description: 'Interactive wayfinding and transit information terminal.',
              details: 'Maps • Schedules • City services • Emergency contact',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          {/* Kiosk pillar */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.6, 0.7, 3.6, 8]} />
            <meshStandardMaterial color={metalGray} metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Main screen */}
          <mesh position={[0, 2.5, 0.65]}>
            <boxGeometry args={[1, 1.5, 0.05]} />
            <meshStandardMaterial
              color="#000000"
              emissive={glassBlue}
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Top cap */}
          <mesh position={[0, 3.8, 0]}>
            <cylinderGeometry args={[0.65, 0.5, 0.3, 8]} />
            <meshStandardMaterial color={accentRed} roughness={0.5} />
          </mesh>
          {/* Base */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.8, 0.8, 0.6, 8]} />
            <meshStandardMaterial color={concreteGray} roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 5. Waiting Area with Benches - positioned at outer edge */}
      <group position={[gapWidth * 0.3, 0, 5]}>
        <group
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'picnic',
              name: 'Transit Waiting Area',
              description: 'Comfortable seating area with charging stations and shelter.',
              details: 'USB charging ports • WiFi • Weather protection',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          {/* Benches in an arc arrangement */}
          {[0, 1, 2].map((i) => (
            <group key={i} position={[0, 0, i * 3 - 3]}>
              {/* Bench seat */}
              <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[4, 0.3, 1.2]} />
                <meshStandardMaterial color={woodBrown} roughness={0.9} />
              </mesh>
              {/* Bench back */}
              <mesh position={[0, 1.3, -0.5]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[4, 0.8, 0.2]} />
                <meshStandardMaterial color={woodBrown} roughness={0.9} />
              </mesh>
              {/* Metal legs */}
              <mesh position={[-1.5, 0.4, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
                <meshStandardMaterial color={metalGray} metalness={0.8} roughness={0.3} />
              </mesh>
              <mesh position={[1.5, 0.4, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
                <meshStandardMaterial color={metalGray} metalness={0.8} roughness={0.3} />
              </mesh>
            </group>
          ))}

          {/* Overhead lighting */}
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 4, 8]} />
            <meshStandardMaterial color={metalGray} metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 4.8, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={isDarkMode ? 0.5 : 0.1}
            />
          </mesh>
        </group>
      </group>

      {/* 6. Small Plaza with Paving - ground level decorative area */}
      <group position={[gapWidth * 0.05, 0.05, 0]}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover?.({
              type: 'tunnel',
              name: 'Transit Plaza',
              description: 'Central gathering space connecting all transit amenities.',
              details: 'Decorative paving • Lighting • Landscaping',
              position: { x: e.clientX, y: e.clientY }
            });
          }}
          onPointerOut={() => onHover?.(null)}
        >
          <circleGeometry args={[12, 32]} />
          <meshStandardMaterial color={pavingGray} roughness={0.85} />
        </mesh>

        {/* Decorative paving patterns - radial lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * Math.PI) / 4;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 6, 0.08, Math.sin(angle) * 6]}
              rotation={[-Math.PI / 2, 0, angle]}
            >
              <planeGeometry args={[12, 0.3]} />
              <meshStandardMaterial color={concreteGray} roughness={0.9} />
            </mesh>
          );
        })}

        {/* Central circular inlay */}
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2, 32]} />
          <meshStandardMaterial color={accentRed} roughness={0.7} />
        </mesh>
      </group>

      {/* 7. Planters and greenery for visual appeal */}
      {[-10, -5, 5, 10].map((zOffset, i) => (
        <group key={i} position={[-gapWidth * 0.4, 0, zOffset]}>
          {/* Planter box */}
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2, 1, 2]} />
            <meshStandardMaterial color={concreteGray} roughness={0.8} />
          </mesh>
          {/* Plant/tree representation */}
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[1, 3, 8]} />
            <meshStandardMaterial color={accentGreen} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 8. Trash and recycling stations */}
      {[[-6, 8], [-6, -8], [6, 8], [6, -8]].map((pos, i) => (
        <group key={i} position={[gapWidth * 0.2, 0, pos[1]]}>
          {/* Trash bin */}
          <mesh position={[-0.6, 1, 0]}>
            <cylinderGeometry args={[0.4, 0.5, 2, 12]} />
            <meshStandardMaterial color="#374151" roughness={0.7} />
          </mesh>
          {/* Recycling bin */}
          <mesh position={[0.6, 1, 0]}>
            <cylinderGeometry args={[0.4, 0.5, 2, 12]} />
            <meshStandardMaterial color="#059669" roughness={0.7} />
          </mesh>
          {/* Lid indicators */}
          <mesh position={[-0.6, 2.2, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.1, 12]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0.6, 2.2, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.1, 12]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </group>
      ))}
    </group>
  );
};
