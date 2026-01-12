import React, { useMemo } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import { HoverInfo } from '../types';

interface ShowcaseDetailsProps {
  centerRadius: number;
  groundY: number;
  rooftopY: number;
  ringOuterRadius: number;
  isDarkMode: boolean;
  onHover?: (info: HoverInfo | null) => void;
}

export const ShowcaseDetails: React.FC<ShowcaseDetailsProps> = ({
  centerRadius,
  groundY,
  rooftopY,
  ringOuterRadius,
  isDarkMode,
  onHover
}) => {
  // Memoize detail positions for consistent placement
  const details = useMemo(() => {
    const items: Array<{
      type: 'bench' | 'lamp' | 'bin' | 'rack' | 'fountain' | 'planter' | 'sculpture' | 'clock' | 'sign';
      position: [number, number, number];
      rotation: number;
      scale?: number;
      color?: string;
    }> = [];

    // Helper to convert angle and radius to x,z position
    const polarToCart = (angle: number, radius: number): [number, number] => [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius
    ];

    // Benches - scattered near paths (8-10)
    for (let i = 0; i < 9; i++) {
      const angle = (i * Math.PI * 2) / 9 + 0.2; // Slightly offset
      const radius = centerRadius + (Math.random() - 0.5) * 15;
      const [x, z] = polarToCart(angle, radius);
      items.push({
        type: 'bench',
        position: [x, groundY + 0.25, z],
        rotation: angle + Math.PI / 2,
        color: Math.random() > 0.5 ? '#78350f' : '#57534e'
      });
    }

    // Lamp posts - along walkways every ~20m (6-8)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const radius = centerRadius + 18;
      const [x, z] = polarToCart(angle, radius);
      items.push({
        type: 'lamp',
        position: [x, groundY, z],
        rotation: 0
      });
    }

    // Trash bins - scattered (4-5)
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 + 0.5;
      const radius = centerRadius + (Math.random() - 0.5) * 12;
      const [x, z] = polarToCart(angle, radius);
      items.push({
        type: 'bin',
        position: [x, groundY, z],
        rotation: Math.random() * Math.PI * 2
      });
    }

    // Bike racks - near paths (3-4)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4 + 0.1;
      const radius = centerRadius + 20;
      const [x, z] = polarToCart(angle, radius);
      items.push({
        type: 'rack',
        position: [x, groundY + 0.5, z],
        rotation: angle
      });
    }

    // Fountains - focal points (2-3)
    [0, Math.PI * 0.6, Math.PI * 1.4].forEach((angle) => {
      const [x, z] = polarToCart(angle, centerRadius);
      items.push({
        type: 'fountain',
        position: [x, groundY, z],
        rotation: 0,
        scale: 1 + Math.random() * 0.3
      });
    });

    // Planters - at intersections (4-5)
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const radius = centerRadius + 10;
      const [x, z] = polarToCart(angle, radius);
      items.push({
        type: 'planter',
        position: [x, groundY, z],
        rotation: Math.random() * Math.PI * 2,
        color: ['#dc2626', '#2563eb', '#f59e0b', '#8b5cf6', '#10b981'][i]
      });
    }

    // Sculptures - artistic pieces (2)
    [Math.PI * 0.3, Math.PI * 1.2].forEach((angle, i) => {
      const radius = centerRadius + (i === 0 ? -8 : 8);
      const [x, z] = polarToCart(angle, radius);
      items.push({
        type: 'sculpture',
        position: [x, groundY, z],
        rotation: Math.random() * Math.PI * 2,
        scale: 1 + i * 0.3
      });
    });

    // Clock tower - prominent landmark (1)
    items.push({
      type: 'clock',
      position: [centerRadius - 5, groundY, 0],
      rotation: 0
    });

    // Wayfinding signs (3-4)
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4 + 0.3;
      const radius = centerRadius + 22;
      const [x, z] = polarToCart(angle, radius);
      items.push({
        type: 'sign',
        position: [x, groundY, z],
        rotation: angle + Math.PI,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i]
      });
    }

    return items;
  }, [centerRadius, groundY]);

  // Shared colors
  const lampColor = isDarkMode ? "#fbbf24" : "#f59e0b";
  const binColor = isDarkMode ? "#1f2937" : "#374151";
  const fountainColor = isDarkMode ? "#0ea5e9" : "#38bdf8";
  const planterGreen = isDarkMode ? "#15803d" : "#22c55e";
  const sculptureColor = "#f8fafc";
  const signBaseColor = isDarkMode ? "#475569" : "#64748b";

  return (
    <group>
      {details.map((item, index) => {
        const [x, y, z] = item.position;
        const key = `${item.type}-${index}`;

        switch (item.type) {
          case 'bench':
            return (
              <mesh
                key={key}
                position={[x, y, z]}
                rotation={[0, item.rotation, 0]}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                  e.stopPropagation();
                  onHover?.({
                    type: 'ring',
                    name: 'Park Bench',
                    description: 'Public seating for residents and visitors.',
                    position: { x: e.clientX, y: e.clientY }
                  });
                }}
                onPointerOut={() => onHover?.(null)}
              >
                <boxGeometry args={[2, 0.5, 0.5]} />
                <meshStandardMaterial color={item.color || '#78350f'} roughness={0.9} />
              </mesh>
            );

          case 'lamp':
            return (
              <group key={key} position={[x, y, z]}>
                {/* Post */}
                <mesh position={[0, 2, 0]}>
                  <cylinderGeometry args={[0.1, 0.1, 4, 6]} />
                  <meshStandardMaterial color={signBaseColor} roughness={0.6} metalness={0.4} />
                </mesh>
                {/* Light */}
                <mesh
                  position={[0, 4.2, 0]}
                  onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                      type: 'ring',
                      name: 'Street Lamp',
                      description: 'LED lighting for evening illumination.',
                      position: { x: e.clientX, y: e.clientY }
                    });
                  }}
                  onPointerOut={() => onHover?.(null)}
                >
                  <sphereGeometry args={[0.3, 8, 6]} />
                  <meshStandardMaterial
                    color={lampColor}
                    emissive={lampColor}
                    emissiveIntensity={isDarkMode ? 0.8 : 0.2}
                  />
                </mesh>
              </group>
            );

          case 'bin':
            return (
              <mesh
                key={key}
                position={[x, y + 0.4, z]}
                rotation={[0, item.rotation, 0]}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                  e.stopPropagation();
                  onHover?.({
                    type: 'ring',
                    name: 'Waste Receptacle',
                    description: 'Recycling and waste management station.',
                    position: { x: e.clientX, y: e.clientY }
                  });
                }}
                onPointerOut={() => onHover?.(null)}
              >
                <cylinderGeometry args={[0.3, 0.35, 0.8, 8]} />
                <meshStandardMaterial color={binColor} roughness={0.8} />
              </mesh>
            );

          case 'rack':
            return (
              <group key={key} position={[x, y, z]} rotation={[0, item.rotation, 0]}>
                {/* Posts */}
                <mesh position={[-0.5, 0, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 1, 6]} />
                  <meshStandardMaterial color={signBaseColor} metalness={0.6} />
                </mesh>
                <mesh position={[0.5, 0, 0]}>
                  <cylinderGeometry args={[0.05, 0.05, 1, 6]} />
                  <meshStandardMaterial color={signBaseColor} metalness={0.6} />
                </mesh>
                {/* Rail */}
                <mesh
                  position={[0, 0.5, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                  onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                      type: 'ring',
                      name: 'Bike Rack',
                      description: 'Bicycle parking for sustainable transit.',
                      position: { x: e.clientX, y: e.clientY }
                    });
                  }}
                  onPointerOut={() => onHover?.(null)}
                >
                  <cylinderGeometry args={[0.04, 0.04, 1, 6]} />
                  <meshStandardMaterial color={signBaseColor} metalness={0.6} />
                </mesh>
              </group>
            );

          case 'fountain':
            return (
              <group key={key} position={[x, y, z]}>
                {/* Base */}
                <mesh position={[0, 0.3, 0]}>
                  <cylinderGeometry args={[1.5, 1.8, 0.6, 12]} />
                  <meshStandardMaterial color="#94a3b8" roughness={0.7} />
                </mesh>
                {/* Middle tier */}
                <mesh position={[0, 0.8, 0]}>
                  <cylinderGeometry args={[1, 1.2, 0.4, 12]} />
                  <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
                </mesh>
                {/* Water */}
                <mesh
                  position={[0, 1.1, 0]}
                  onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                      type: 'ring',
                      name: 'Decorative Fountain',
                      description: 'Multi-tiered water feature providing ambiance.',
                      position: { x: e.clientX, y: e.clientY }
                    });
                  }}
                  onPointerOut={() => onHover?.(null)}
                >
                  <cylinderGeometry args={[0.9, 0.9, 0.1, 12]} />
                  <meshStandardMaterial
                    color={fountainColor}
                    roughness={0.1}
                    metalness={0.3}
                    transparent
                    opacity={0.7}
                  />
                </mesh>
              </group>
            );

          case 'planter':
            return (
              <group key={key} position={[x, y, z]} rotation={[0, item.rotation, 0]}>
                {/* Box */}
                <mesh position={[0, 0.3, 0]}>
                  <boxGeometry args={[0.8, 0.6, 0.8]} />
                  <meshStandardMaterial color={item.color || '#dc2626'} roughness={0.8} />
                </mesh>
                {/* Plants */}
                <mesh
                  position={[0, 0.7, 0]}
                  onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                      type: 'ring',
                      name: 'Flower Planter',
                      description: 'Seasonal blooms adding color to the plaza.',
                      position: { x: e.clientX, y: e.clientY }
                    });
                  }}
                  onPointerOut={() => onHover?.(null)}
                >
                  <sphereGeometry args={[0.4, 6, 4]} />
                  <meshStandardMaterial color={planterGreen} roughness={0.9} />
                </mesh>
              </group>
            );

          case 'sculpture':
            return (
              <group
                key={key}
                position={[x, y, z]}
                rotation={[0, item.rotation, 0]}
                scale={item.scale || 1}
              >
                {/* Base */}
                <mesh position={[0, 0.3, 0]}>
                  <cylinderGeometry args={[0.5, 0.6, 0.6, 8]} />
                  <meshStandardMaterial color="#94a3b8" roughness={0.6} />
                </mesh>
                {/* Abstract forms */}
                <mesh
                  position={[0, 1.2, 0]}
                  rotation={[0.2, 0.3, 0.1]}
                  onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                      type: 'ring',
                      name: 'Public Art',
                      description: 'Contemporary sculpture by local artist.',
                      position: { x: e.clientX, y: e.clientY }
                    });
                  }}
                  onPointerOut={() => onHover?.(null)}
                >
                  <boxGeometry args={[0.6, 1.2, 0.6]} />
                  <meshStandardMaterial color={sculptureColor} roughness={0.4} metalness={0.2} />
                </mesh>
                <mesh position={[0, 2.1, 0]} rotation={[0.1, 0.5, 0.2]}>
                  <sphereGeometry args={[0.4, 8, 6]} />
                  <meshStandardMaterial color={sculptureColor} roughness={0.4} metalness={0.2} />
                </mesh>
              </group>
            );

          case 'clock':
            return (
              <group key={key} position={[x, y, z]} rotation={[0, item.rotation, 0]}>
                {/* Tower base */}
                <mesh position={[0, 1.5, 0]}>
                  <boxGeometry args={[1, 3, 1]} />
                  <meshStandardMaterial color="#64748b" roughness={0.7} />
                </mesh>
                {/* Tower top */}
                <mesh position={[0, 3.5, 0]}>
                  <boxGeometry args={[1.2, 1, 1.2]} />
                  <meshStandardMaterial color="#475569" roughness={0.7} />
                </mesh>
                {/* Clock face */}
                <mesh
                  position={[0.61, 3.5, 0]}
                  rotation={[0, Math.PI / 2, 0]}
                  onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                      type: 'ring',
                      name: 'Clock Tower',
                      description: 'Historic timepiece and local landmark.',
                      position: { x: e.clientX, y: e.clientY }
                    });
                  }}
                  onPointerOut={() => onHover?.(null)}
                >
                  <circleGeometry args={[0.4, 16]} />
                  <meshStandardMaterial color="#f8fafc" roughness={0.3} />
                </mesh>
              </group>
            );

          case 'sign':
            return (
              <group key={key} position={[x, y, z]} rotation={[0, item.rotation, 0]}>
                {/* Post */}
                <mesh position={[0, 1, 0]}>
                  <cylinderGeometry args={[0.08, 0.08, 2, 6]} />
                  <meshStandardMaterial color={signBaseColor} metalness={0.5} />
                </mesh>
                {/* Sign board */}
                <mesh
                  position={[0, 2.2, 0]}
                  onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                    e.stopPropagation();
                    onHover?.({
                      type: 'ring',
                      name: 'Wayfinding Sign',
                      description: 'Directional signage for navigation.',
                      position: { x: e.clientX, y: e.clientY }
                    });
                  }}
                  onPointerOut={() => onHover?.(null)}
                >
                  <boxGeometry args={[0.8, 0.5, 0.05]} />
                  <meshStandardMaterial color={item.color || '#3b82f6'} roughness={0.6} />
                </mesh>
              </group>
            );

          default:
            return null;
        }
      })}
    </group>
  );
};
