import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RingConfig } from '../types';

interface InfrastructureOverlayProps {
  rings: RingConfig[];
  isDarkMode: boolean;
}

const DEG2RAD = Math.PI / 180;

/** C2: Overhead Water Mains — blue torus per ring with drop pipes + funnels */
const WaterMains: React.FC<{ rings: RingConfig[] }> = ({ rings }) => {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    particlesRef.current.children.forEach((child) => {
      child.position.y -= delta * 25;
      if (child.position.y < (child.userData.baseY ?? 0)) {
        child.position.y = child.userData.topY ?? 50;
      }
    });
  });

  const dropPipes = useMemo(() => {
    const pipes: { ringIdx: number; midR: number; angle: number; roofY: number; topY: number }[] = [];
    rings.forEach((ring, ri) => {
      if (ring.id === 'hub') return;
      const midR = (ring.innerRadius + ring.outerRadius) / 2;
      const roofY = ring.height;
      const topY = roofY + 50;
      for (let deg = 0; deg < 360; deg += 15) {
        pipes.push({ ringIdx: ri, midR, angle: deg, roofY, topY });
      }
    });
    return pipes;
  }, [rings]);

  return (
    <group>
      {/* Blue torus per ring */}
      {rings.map((ring) => {
        if (ring.id === 'hub') return null;
        const midR = (ring.innerRadius + ring.outerRadius) / 2;
        const tubeR = 4;
        const y = ring.height + 50;
        return (
          <mesh key={`water-main-${ring.id}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[midR, tubeR, 8, 64]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
          </mesh>
        );
      })}

      {/* Drop pipes + funnels */}
      {dropPipes.map((dp, i) => {
        const x = dp.midR * Math.cos(dp.angle * DEG2RAD);
        const z = dp.midR * Math.sin(dp.angle * DEG2RAD);
        const pipeLen = dp.topY - dp.roofY;
        const pipeY = dp.roofY + pipeLen / 2;
        return (
          <group key={`dp-${i}`} position={[x, 0, z]}>
            {/* Vertical drop pipe */}
            <mesh position={[0, pipeY, 0]}>
              <cylinderGeometry args={[1.5, 1.5, pipeLen, 6]} />
              <meshStandardMaterial color="#60a5fa" transparent opacity={0.5} />
            </mesh>
            {/* Inverted cone funnel at rooftop */}
            <mesh position={[0, dp.roofY + 2, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[4, 5, 8]} />
              <meshStandardMaterial color="#93c5fd" transparent opacity={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Animated water particles */}
      <group ref={particlesRef}>
        {dropPipes.filter((_, i) => i % 3 === 0).map((dp, i) => {
          const x = dp.midR * Math.cos(dp.angle * DEG2RAD);
          const z = dp.midR * Math.sin(dp.angle * DEG2RAD);
          const startY = dp.topY - ((i * 7) % 40);
          return (
            <mesh
              key={`wp-${i}`}
              position={[x, startY, z]}
              userData={{ baseY: dp.roofY, topY: dp.topY }}
            >
              <sphereGeometry args={[1, 4, 4]} />
              <meshStandardMaterial color="#3b82f6" emissive="#2563eb" emissiveIntensity={0.5} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};

/** C3: Underring Sewage Troughs — dark torus below ring base + drain sumps + biogas manifold */
const SewageTroughs: React.FC<{ rings: RingConfig[] }> = ({ rings }) => {
  return (
    <group>
      {rings.map((ring) => {
        if (ring.id === 'hub') return null;
        const midR = (ring.innerRadius + ring.outerRadius) / 2;
        const y = -5;
        return (
          <group key={`sewage-${ring.id}`}>
            {/* Main sewage trough */}
            <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[midR, 5, 8, 64]} />
              <meshStandardMaterial color="#44403c" transparent opacity={0.6} />
            </mesh>

            {/* Biogas capture manifold — thin green torus */}
            <mesh position={[0, y - 3, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[midR + 8, 1.5, 6, 64]} />
              <meshStandardMaterial color="#22c55e" transparent opacity={0.5} emissive="#16a34a" emissiveIntensity={0.3} />
            </mesh>

            {/* 6 drain sumps per ring at 60° spacing */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const x = ring.innerRadius * Math.cos(deg * DEG2RAD);
              const z = ring.innerRadius * Math.sin(deg * DEG2RAD);
              return (
                <mesh key={`sump-${ring.id}-${deg}`} position={[x, y - 10, z]}>
                  <cylinderGeometry args={[3, 3, 15, 6]} />
                  <meshStandardMaterial color="#57534e" transparent opacity={0.5} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

/** C4: Inductive Power Coils — copper torus with pulsing glow */
const PowerCoils: React.FC<{ rings: RingConfig[] }> = ({ rings }) => {
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const intensity = 0.5 + 1.5 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2));
    materialsRef.current.forEach((mat) => {
      if (mat) mat.emissiveIntensity = intensity;
    });
  });

  return (
    <group>
      {rings.map((ring, ri) => {
        if (ring.id === 'hub') return null;
        const coilR = ring.innerRadius + 5;
        return (
          <group key={`coil-${ring.id}`}>
            {/* Ring-side coil */}
            <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[coilR, 3, 8, 64]} />
              <meshStandardMaterial
                ref={(m) => { if (m) materialsRef.current[ri * 2] = m; }}
                color="#d97706"
                emissive="#f59e0b"
                emissiveIntensity={1}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Ground-side coil (slightly smaller, stationary) */}
            <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[coilR - 2, 2.5, 8, 64]} />
              <meshStandardMaterial
                ref={(m) => { if (m) materialsRef.current[ri * 2 + 1] = m; }}
                color="#b45309"
                emissive="#d97706"
                emissiveIntensity={1}
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

/** C5: Waste Chute Indicators — 3-color cylinder clusters every 15° + 6 bunkers per ring */
const WasteChutes: React.FC<{ rings: RingConfig[]; simState: { timeScale: number; isPlaying: boolean; currentTime: number } }> = ({ rings, simState }) => {
  const clustersRef = useRef<THREE.Group>(null);

  // Pulse chutes when aligned with bunkers
  useFrame(({ clock }) => {
    if (!clustersRef.current) return;
    clustersRef.current.children.forEach((child) => {
      const chuteDeg = child.userData.chuteDeg as number | undefined;
      const ringSpeed = child.userData.ringSpeed as number | undefined;
      if (chuteDeg === undefined || ringSpeed === undefined) return;

      // Current rotation angle of this ring
      const elapsed = clock.getElapsedTime();
      const currentAngle = ((chuteDeg + (ringSpeed / 60) * elapsed * simState.timeScale) % 360 + 360) % 360;

      // Check alignment with any bunker (every 60°)
      const nearestBunker = Math.round(currentAngle / 60) * 60;
      const diff = Math.abs(currentAngle - nearestBunker);
      const aligned = diff < 3 || diff > 357;

      child.scale.setScalar(aligned ? 1.5 : 1.0);
    });
  });

  const chuteClusters = useMemo(() => {
    const clusters: { ringId: string; midR: number; angle: number; roofY: number; ringSpeed: number }[] = [];
    rings.forEach((ring) => {
      if (ring.id === 'hub') return;
      const midR = (ring.innerRadius + ring.outerRadius) / 2;
      for (let deg = 0; deg < 360; deg += 15) {
        clusters.push({ ringId: ring.id, midR, angle: deg, roofY: ring.height, ringSpeed: ring.rotationSpeed });
      }
    });
    return clusters;
  }, [rings]);

  const bunkers = useMemo(() => {
    const b: { ringId: string; midR: number; angle: number }[] = [];
    rings.forEach((ring) => {
      if (ring.id === 'hub') return;
      const midR = (ring.innerRadius + ring.outerRadius) / 2;
      for (let deg = 0; deg < 360; deg += 60) {
        b.push({ ringId: ring.id, midR, angle: deg });
      }
    });
    return b;
  }, [rings]);

  const chuteColors = ['#6b7280', '#3b82f6', '#22c55e']; // gray, blue, green
  const chuteOffsets = [-3, 0, 3];

  return (
    <group>
      {/* Chute clusters */}
      <group ref={clustersRef}>
        {chuteClusters.map((cc, i) => {
          const x = cc.midR * Math.cos(cc.angle * DEG2RAD);
          const z = cc.midR * Math.sin(cc.angle * DEG2RAD);
          return (
            <group
              key={`chute-${i}`}
              position={[x, cc.roofY + 5, z]}
              userData={{ chuteDeg: cc.angle, ringSpeed: cc.ringSpeed }}
            >
              {chuteColors.map((color, ci) => (
                <mesh key={ci} position={[chuteOffsets[ci], 0, 0]}>
                  <cylinderGeometry args={[1, 1, 8, 6]} />
                  <meshStandardMaterial color={color} transparent opacity={0.7} />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>

      {/* Bunkers below grade */}
      {bunkers.map((bk, i) => {
        const x = bk.midR * Math.cos(bk.angle * DEG2RAD);
        const z = bk.midR * Math.sin(bk.angle * DEG2RAD);
        return (
          <mesh key={`bunker-${i}`} position={[x, -8, z]}>
            <boxGeometry args={[12, 6, 8]} />
            <meshStandardMaterial color="#78716c" transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};

/** C6: Greywater Layer — light blue torus + collection tanks with pulse animation */
const GreywaterLayer: React.FC<{ rings: RingConfig[] }> = ({ rings }) => {
  const tanksRef = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    tanksRef.current.forEach((tank, i) => {
      if (!tank) return;
      // Staggered 30-second cycle
      const phase = (t + i * 5) % 30;
      const pulse = phase < 2 ? 1 + 0.3 * Math.sin((phase / 2) * Math.PI) : 1;
      tank.scale.y = pulse;
    });
  });

  let tankIdx = 0;

  return (
    <group>
      {rings.map((ring) => {
        if (ring.id === 'hub') return null;
        const midR = (ring.innerRadius + ring.outerRadius) / 2;
        const torusR = midR + 12; // slightly outside sewage trough
        const y = -3;
        return (
          <group key={`grey-${ring.id}`}>
            {/* Greywater torus */}
            <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[torusR, 2.5, 8, 64]} />
              <meshStandardMaterial color="#7dd3fc" transparent opacity={0.5} />
            </mesh>

            {/* 6 collection tanks per ring */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const x = torusR * Math.cos(deg * DEG2RAD);
              const z = torusR * Math.sin(deg * DEG2RAD);
              const idx = tankIdx++;
              return (
                <mesh
                  key={`gtank-${ring.id}-${deg}`}
                  ref={(m) => { if (m) tanksRef.current[idx] = m; }}
                  position={[x, y, z]}
                >
                  <cylinderGeometry args={[4, 4, 10, 8]} />
                  <meshStandardMaterial color="#38bdf8" transparent opacity={0.5} />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

/** Main overlay component — renders all infrastructure subsystems */
const InfrastructureOverlay: React.FC<InfrastructureOverlayProps & { simState: { timeScale: number; isPlaying: boolean; currentTime: number } }> = ({ rings, simState }) => {
  return (
    <group>
      <WaterMains rings={rings} />
      <SewageTroughs rings={rings} />
      <PowerCoils rings={rings} />
      <WasteChutes rings={rings} simState={simState} />
      <GreywaterLayer rings={rings} />
    </group>
  );
};

export default InfrastructureOverlay;
