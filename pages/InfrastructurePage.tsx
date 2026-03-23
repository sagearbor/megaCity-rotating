import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, Droplet, Zap, Wind, Wifi, Trash2, Recycle } from 'lucide-react';

interface InfrastructurePageProps {
  isDarkMode: boolean;
}

// ============================================================
// B1: ROTARY UNION — Horizontal sliding floor over stationary channels
// ============================================================
const RotaryUnionScene: React.FC<{
  isDarkMode: boolean;
}> = ({ isDarkMode }) => {
  const floorRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (floorRef.current) {
      // Oscillate floor left/right ±8 units to show sliding
      floorRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.4) * 8;
    }
  });

  return (
    <>
      <ambientLight intensity={isDarkMode ? 0.4 : 0.6} />
      <directionalLight position={[10, 10, 5]} intensity={isDarkMode ? 0.8 : 1.2} />
      <directionalLight position={[-10, -5, -5]} intensity={0.3} />

      {/* Stationary ground base */}
      <mesh position={[0, -6, 0]} receiveShadow>
        <boxGeometry args={[50, 3, 20]} />
        <meshStandardMaterial
          color={isDarkMode ? '#334155' : '#94a3b8'}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      <Text position={[0, -8.5, 11]} fontSize={1.2} color={isDarkMode ? '#94a3b8' : '#64748b'} anchorX="center">
        STATIONARY GROUND
      </Text>

      {/* Stationary utility channels embedded in ground surface */}
      {/* Water channel - blue */}
      <mesh position={[-8, -4.2, 0]}>
        <boxGeometry args={[4, 0.8, 18]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.5} roughness={0.3} emissive="#06b6d4" emissiveIntensity={0.15} />
      </mesh>
      <Text position={[-8, -4.2, 10]} fontSize={0.8} color="#06b6d4" anchorX="center">
        WATER
      </Text>

      {/* Electric channel - yellow */}
      <mesh position={[0, -4.2, 0]}>
        <boxGeometry args={[3, 0.8, 18]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.2} />
      </mesh>
      <Text position={[0, -4.2, 10]} fontSize={0.8} color="#fbbf24" anchorX="center">
        ELECTRIC
      </Text>

      {/* Telecom channel - orange */}
      <mesh position={[8, -4.2, 0]}>
        <boxGeometry args={[3, 0.8, 18]} />
        <meshStandardMaterial color="#f97316" metalness={0.6} roughness={0.3} emissive="#f97316" emissiveIntensity={0.15} />
      </mesh>
      <Text position={[8, -4.2, 10]} fontSize={0.8} color="#f97316" anchorX="center">
        TELECOM
      </Text>

      {/* Sliding ring floor with grooves */}
      <mesh ref={floorRef} position={[0, -2.5, 0]} castShadow>
        <boxGeometry args={[40, 2, 18]} />
        <meshStandardMaterial
          color={isDarkMode ? '#e2e8f0' : '#fdba74'}
          metalness={0.3}
          roughness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Groove slots in floor (move with floor) */}
      <group ref={useRef<THREE.Group>(null)}>
        {/* These are visual indicators of grooves — rendered as darker insets on the floor */}
        {[-8, 0, 8].map((x, i) => (
          <mesh key={i} position={[x, -2.5, 0]}>
            <boxGeometry args={[4.5, 2.2, 18.5]} />
            <meshStandardMaterial
              color={isDarkMode ? '#475569' : '#d4d4d8'}
              metalness={0.4}
              roughness={0.6}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Ring structure on top of floor */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[40, 3, 18]} />
        <meshStandardMaterial
          color={isDarkMode ? '#1e293b' : '#f1f5f9'}
          metalness={0.2}
          roughness={0.7}
          transparent
          opacity={0.6}
        />
      </mesh>

      <Text position={[0, 3, 0]} fontSize={1.5} color={isDarkMode ? '#ffffff' : '#1e293b'} anchorX="center">
        RING FLOOR (SLIDES HORIZONTALLY)
      </Text>

      {/* Direction arrows */}
      <Text position={[-18, -2.5, 10]} fontSize={2} color={isDarkMode ? '#10b981' : '#059669'} anchorX="center">
        {'←'}
      </Text>
      <Text position={[18, -2.5, 10]} fontSize={2} color={isDarkMode ? '#10b981' : '#059669'} anchorX="center">
        {'→'}
      </Text>

      {/* Label */}
      <Text
        position={[0, -10, 0]}
        fontSize={0.9}
        color={isDarkMode ? '#94a3b8' : '#64748b'}
        anchorX="center"
        maxWidth={40}
        textAlign="center"
      >
        {'Ring rotates at 0.35 mph — floor grooves\ncontinuously pass over stationary utility channels'}
      </Text>
    </>
  );
};

// ============================================================
// B2: FRESHWATER SUPPLY — Overhead pipe + waterfall funnels + particles
// ============================================================
const FreshwaterScene: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const particlesRef = useRef<THREE.Points>(null);

  const particleGeom = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color(0x06b6d4);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    const dropXPositions = [-10, 0, 10]; // 3 drop pipes
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      const pipeIdx = i % 3;
      const progress = ((time * 0.6 + i / 8) % 1);
      positions[i * 3] = dropXPositions[pipeIdx] + (Math.sin(i * 1.7) * 0.3);
      positions[i * 3 + 1] = 8 - progress * 16; // fall from main pipe to roof level
      positions[i * 3 + 2] = (Math.cos(i * 2.3) * 0.3);
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={isDarkMode ? 0.4 : 0.6} />
      <directionalLight position={[10, 15, 5]} intensity={isDarkMode ? 0.8 : 1.2} />

      {/* Main horizontal pipe running above roofline */}
      <mesh position={[0, 10, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.2, 1.2, 35, 16]} />
        <meshStandardMaterial color="#0891b2" metalness={0.6} roughness={0.3} />
      </mesh>
      <Text position={[0, 12.5, 0]} fontSize={1} color="#06b6d4" anchorX="center">
        OVERHEAD FRESHWATER MAIN
      </Text>

      {/* Drop pipes + funnel collectors every ~100m (3 shown) */}
      {[-10, 0, 10].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Vertical drop pipe */}
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 12, 12]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.5} roughness={0.4} transparent opacity={0.7} />
          </mesh>
          {/* Inverted cone funnel at roof */}
          <mesh position={[0, -3, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[2.5, 3, 16]} />
            <meshStandardMaterial color="#06b6d4" metalness={0.4} roughness={0.5} transparent opacity={0.6} />
          </mesh>
          {/* Mesh screen cap on top of funnel */}
          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[2.6, 2.6, 0.3, 16]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.3} roughness={0.8} wireframe />
          </mesh>
        </group>
      ))}

      {/* Ring roofline */}
      <mesh position={[0, -5.5, 0]}>
        <boxGeometry args={[35, 1, 12]} />
        <meshStandardMaterial
          color={isDarkMode ? '#1e293b' : '#e2e8f0'}
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
      <Text position={[0, -7.5, 7]} fontSize={0.9} color={isDarkMode ? '#94a3b8' : '#64748b'} anchorX="center">
        RING ROOFTOP
      </Text>

      {/* Animated water particles */}
      <points ref={particlesRef} geometry={particleGeom}>
        <pointsMaterial size={0.6} vertexColors transparent opacity={0.85} />
      </points>

      <Text
        position={[0, -10, 0]}
        fontSize={0.8}
        color={isDarkMode ? '#94a3b8' : '#64748b'}
        anchorX="center"
        maxWidth={35}
        textAlign="center"
      >
        {'Gravity-fed freshwater — overhead mains drop into\nrooftop collector funnels. Mesh screens exclude debris/birds.'}
      </Text>
    </>
  );
};

// ============================================================
// B3: CONTACTLESS POWER TRANSFER — Inductive coils + pulsing
// ============================================================
const PowerTransferScene: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const glowRef = useRef<THREE.Mesh>(null);
  const ringCoilRef = useRef<THREE.Group>(null);
  const pulseRef = useRef(0);

  useFrame((state) => {
    pulseRef.current = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5; // 0..1 pulsing
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + pulseRef.current * 1.5;
      mat.opacity = 0.3 + pulseRef.current * 0.4;
    }
    // Slight oscillation on ring coils to show they move
    if (ringCoilRef.current) {
      ringCoilRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
    }
  });

  return (
    <>
      <ambientLight intensity={isDarkMode ? 0.4 : 0.6} />
      <directionalLight position={[10, 10, 5]} intensity={isDarkMode ? 0.8 : 1.2} />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#fbbf24" />

      {/* Ring base edge (top) */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[25, 4, 12]} />
        <meshStandardMaterial
          color={isDarkMode ? '#1e293b' : '#e2e8f0'}
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
      <Text position={[0, 8, 0]} fontSize={1} color={isDarkMode ? '#e2e8f0' : '#1e293b'} anchorX="center">
        RING BASE (INNER EDGE)
      </Text>

      {/* Ring-side coil array (moves with ring) */}
      <group ref={ringCoilRef} position={[0, 2, 0]}>
        {[-4, 0, 4].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.8, 0.4, 8, 24]} />
            <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.2} emissive="#b87333" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Glow field between coils */}
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <boxGeometry args={[14, 1.5, 10]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Stationary ground coil array */}
      <group position={[0, -2, 0]}>
        {[-4, 0, 4].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.8, 0.4, 8, 24]} />
            <meshStandardMaterial color="#b87333" metalness={0.8} roughness={0.2} emissive="#b87333" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Stationary ground rail */}
      <mesh position={[0, -5, 0]}>
        <boxGeometry args={[25, 4, 12]} />
        <meshStandardMaterial
          color={isDarkMode ? '#334155' : '#94a3b8'}
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      <Text position={[0, -8, 0]} fontSize={1} color={isDarkMode ? '#94a3b8' : '#64748b'} anchorX="center">
        STATIONARY GROUND RAIL
      </Text>

      {/* Flywheel icon at side */}
      <mesh position={[16, 2, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[2, 0.5, 8, 24]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.4} />
      </mesh>
      <Text position={[16, 2, 0]} fontSize={0.7} color={isDarkMode ? '#e2e8f0' : '#1e293b'} anchorX="center">
        FW
      </Text>
      {/* Bidirectional arrows */}
      <Text position={[13, 2, 3]} fontSize={1.2} color="#fbbf24" anchorX="center">
        {'⟷'}
      </Text>

      <Text
        position={[0, -10, 0]}
        fontSize={0.7}
        color={isDarkMode ? '#94a3b8' : '#64748b'}
        anchorX="center"
        maxWidth={35}
        textAlign="center"
      >
        {'Kilometer-Scale Resonant Inductive Power Transfer —\ncontactless, bidirectional. Ring functions as flywheel\nenergy storage via regenerative braking.'}
      </Text>
    </>
  );
};

// ============================================================
// B4: SEWAGE EGRESS — Annular trough cross-section + particle flow
// ============================================================
const SewageEgressScene: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const particlesRef = useRef<THREE.Points>(null);

  const particleGeom = useMemo(() => {
    const count = 40;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color(0x78716c);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    const count = positions.length / 3;

    for (let i = 0; i < count; i++) {
      // Flow path: plenum -> lip -> trough -> sump (right to left, then down)
      const totalProgress = ((time * 0.3 + i / count) % 1);

      if (totalProgress < 0.4) {
        // Phase 1: flowing along plenum (right to left)
        const p = totalProgress / 0.4;
        positions[i * 3] = 10 - p * 12;
        positions[i * 3 + 1] = 4 + Math.sin(i * 1.3) * 0.2;
        positions[i * 3 + 2] = (Math.sin(i * 2.1) * 0.5);
      } else if (totalProgress < 0.6) {
        // Phase 2: dripping from lip into trough
        const p = (totalProgress - 0.4) / 0.2;
        positions[i * 3] = -2 + Math.sin(i * 0.7) * 0.3;
        positions[i * 3 + 1] = 4 - p * 6;
        positions[i * 3 + 2] = (Math.sin(i * 2.1) * 0.5);
      } else if (totalProgress < 0.8) {
        // Phase 3: flowing along trough
        const p = (totalProgress - 0.6) / 0.2;
        positions[i * 3] = -2 - p * 8;
        positions[i * 3 + 1] = -2 + Math.sin(i * 1.5) * 0.2;
        positions[i * 3 + 2] = (Math.sin(i * 2.1) * 0.5);
      } else {
        // Phase 4: down sump
        const p = (totalProgress - 0.8) / 0.2;
        positions[i * 3] = -10 + Math.sin(i * 0.5) * 0.2;
        positions[i * 3 + 1] = -2 - p * 8;
        positions[i * 3 + 2] = (Math.sin(i * 2.1) * 0.3);
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={isDarkMode ? 0.4 : 0.6} />
      <directionalLight position={[10, 10, 5]} intensity={isDarkMode ? 0.8 : 1.0} />

      {/* Ring base at top */}
      <mesh position={[4, 8, 0]}>
        <boxGeometry args={[22, 3, 12]} />
        <meshStandardMaterial color={isDarkMode ? '#1e293b' : '#e2e8f0'} metalness={0.2} roughness={0.7} />
      </mesh>
      <Text position={[4, 10.5, 0]} fontSize={0.9} color={isDarkMode ? '#e2e8f0' : '#1e293b'} anchorX="center">
        RING BASE
      </Text>

      {/* Sealed U-channel plenum (dark gray trough under ring) */}
      <mesh position={[4, 4.5, 0]}>
        <boxGeometry args={[18, 2.5, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.3} roughness={0.7} />
      </mesh>
      <Text position={[14, 4.5, 5]} fontSize={0.6} color="#9ca3af" anchorX="left">
        SEALED PLENUM
      </Text>

      {/* Discharge lip at inner edge */}
      <mesh position={[-3, 3, 0]}>
        <boxGeometry args={[3, 1, 8]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.7} roughness={0.2} />
      </mesh>
      <Text position={[-3, 1.5, 5]} fontSize={0.55} color="#d4d4d8" anchorX="center">
        DISCHARGE LIP
      </Text>

      {/* Stationary annular collection trough (below, does NOT rotate) */}
      <mesh position={[-6, -2, 0]}>
        <boxGeometry args={[12, 2, 10]} />
        <meshStandardMaterial color="#78716c" metalness={0.2} roughness={0.8} />
      </mesh>
      <Text position={[-6, -4.5, 6]} fontSize={0.6} color="#a8a29e" anchorX="center">
        STATIONARY COLLECTION TROUGH
      </Text>

      {/* Drain sumps as downward pipes */}
      {[-10, -6].map((x, i) => (
        <mesh key={i} position={[x, -6, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 6, 12]} />
          <meshStandardMaterial color="#57534e" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
      <Text position={[-10, -10, 3]} fontSize={0.5} color="#78716c" anchorX="center">
        DRAIN SUMPS
      </Text>

      {/* Biogas capture pipe (green-tinted) */}
      <mesh position={[-1, -2, 5]}>
        <cylinderGeometry args={[0.5, 0.5, 8, 12]} />
        <meshStandardMaterial color="#22c55e" metalness={0.5} roughness={0.4} emissive="#22c55e" emissiveIntensity={0.1} transparent opacity={0.7} />
      </mesh>
      <Text position={[-1, -2, 7]} fontSize={0.5} color="#22c55e" anchorX="center">
        BIOGAS
      </Text>

      {/* Negative pressure arrows (pointing downward) */}
      {[2, 7, 12].map((x, i) => (
        <Text key={i} position={[x, 6.5, 6]} fontSize={1} color="#ef4444" anchorX="center">
          {'↓'}
        </Text>
      ))}
      <Text position={[10, 7.5, 6]} fontSize={0.5} color="#ef4444" anchorX="center">
        NEG. PRESSURE
      </Text>

      {/* Sewage particles */}
      <points ref={particlesRef} geometry={particleGeom}>
        <pointsMaterial size={0.5} vertexColors transparent opacity={0.8} />
      </points>

      {/* Labels */}
      <Text position={[0, -12, 0]} fontSize={0.6} color={isDarkMode ? '#94a3b8' : '#64748b'} anchorX="center" maxWidth={35} textAlign="center">
        {'Sewage drains by gravity to sealed underring plenum.\nDischarge lip interfaces with stationary collection trough (5mm gap, brush seal).\nAll chutes and plenum under NEGATIVE PRESSURE — odors sucked down, never escape upward.\nBiogas recovered → ring energy supply.'}
      </Text>
    </>
  );
};

// ============================================================
// B5: SOLID WASTE EGRESS — Timed-gate chutes + bunkers + alignment
// ============================================================
const WasteChutesScene: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const ringArcRef = useRef<THREE.Group>(null);
  const gateRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    // Rotate ring arc slowly
    if (ringArcRef.current) {
      ringArcRef.current.rotation.y = time * 0.15;
    }

    // Check alignment of chutes with bunkers and animate gates
    gateRefs.current.forEach((gate, idx) => {
      if (!gate) return;
      const chuteAngle = (idx * (Math.PI / 6)) + ringArcRef.current!.rotation.y;
      const normalizedAngle = ((chuteAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      // Bunkers at 60° spacing = PI/3
      const bunkerAngles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];
      let aligned = false;
      for (const ba of bunkerAngles) {
        let diff = Math.abs(normalizedAngle - ba);
        if (diff > Math.PI) diff = Math.PI * 2 - diff;
        if (diff < 0.12) { aligned = true; break; }
      }
      const mat = gate.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = aligned ? 1.5 : 0.1;
      mat.color.set(aligned ? '#10b981' : '#6b7280');
      mat.emissive.set(aligned ? '#10b981' : '#000000');
    });
  });

  // Chute clusters at ~30° intervals around partial arc
  const chutePositions = useMemo(() => {
    const positions: { angle: number; x: number; z: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = i * (Math.PI / 6); // 30° apart
      const radius = 12;
      positions.push({
        angle,
        x: Math.sin(angle) * radius,
        z: Math.cos(angle) * radius,
      });
    }
    return positions;
  }, []);

  // Bunker positions (stationary, 60° spacing)
  const bunkerPositions = useMemo(() => {
    const positions: { x: number; z: number; angle: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = i * (Math.PI / 3);
      const radius = 12;
      positions.push({
        x: Math.sin(angle) * radius,
        z: Math.cos(angle) * radius,
        angle,
      });
    }
    return positions;
  }, []);

  return (
    <>
      <ambientLight intensity={isDarkMode ? 0.4 : 0.6} />
      <directionalLight position={[10, 15, 5]} intensity={isDarkMode ? 0.8 : 1.0} />

      {/* Top-down view label */}
      <Text position={[0, 0.1, -18]} fontSize={1} color={isDarkMode ? '#e2e8f0' : '#1e293b'} anchorX="center">
        TOP-DOWN VIEW — PARTIAL RING ARC
      </Text>

      {/* Ring rotation arrow */}
      <Text position={[18, 0.1, 0]} fontSize={1.5} color="#10b981" anchorX="center">
        {'↻'}
      </Text>
      <Text position={[18, 0.1, -2]} fontSize={0.6} color="#10b981" anchorX="center">
        ROTATION
      </Text>

      {/* Rotating ring arc with chute clusters */}
      <group ref={ringArcRef}>
        {/* Ring arc (partial) */}
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[12, 3, 4, 32, Math.PI * 1.2]} />
          <meshStandardMaterial
            color={isDarkMode ? '#334155' : '#cbd5e1'}
            metalness={0.2}
            roughness={0.7}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Chute clusters (3 per position: gray, blue, green) */}
        {chutePositions.map((pos, i) => (
          <group key={i} position={[pos.x, 0, pos.z]}>
            {/* General waste - gray */}
            <mesh position={[-0.6, 0.5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
              <meshStandardMaterial color="#6b7280" metalness={0.3} roughness={0.6} />
            </mesh>
            {/* Recycling - blue */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
              <meshStandardMaterial color="#3b82f6" metalness={0.3} roughness={0.6} />
            </mesh>
            {/* Organics - green */}
            <mesh position={[0.6, 0.5, 0]}>
              <cylinderGeometry args={[0.3, 0.3, 1.5, 8]} />
              <meshStandardMaterial color="#22c55e" metalness={0.3} roughness={0.6} />
            </mesh>
            {/* Negative pressure arrows */}
            <Text position={[0, -0.5, 0.8]} fontSize={0.5} color="#ef4444" anchorX="center" rotation={[-Math.PI / 2, 0, 0]}>
              {'↓↓↓'}
            </Text>
            {/* Gate indicator at chute base */}
            <mesh
              position={[0, -0.3, 0]}
              ref={(el) => { if (el) gateRefs.current[i] = el; }}
            >
              <boxGeometry args={[2, 0.3, 1]} />
              <meshStandardMaterial color="#6b7280" emissive="#000000" emissiveIntensity={0.1} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Stationary bunkers below grade */}
      {bunkerPositions.map((pos, i) => (
        <mesh key={i} position={[pos.x, -1.5, pos.z]}>
          <boxGeometry args={[2.5, 1, 2.5]} />
          <meshStandardMaterial
            color="#44403c"
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Legend */}
      <group position={[-18, 0.1, 8]}>
        <Text position={[0, 0, 0]} fontSize={0.5} color="#6b7280" anchorX="left">{'■ General Waste'}</Text>
        <Text position={[0, 0, 1.2]} fontSize={0.5} color="#3b82f6" anchorX="left">{'■ Recycling'}</Text>
        <Text position={[0, 0, 2.4]} fontSize={0.5} color="#22c55e" anchorX="left">{'■ Organics'}</Text>
        <Text position={[0, 0, 3.6]} fontSize={0.5} color="#44403c" anchorX="left">{'■ Sealed Bunker'}</Text>
        <Text position={[0, 0, 4.8]} fontSize={0.5} color="#10b981" anchorX="left">{'● Gate OPEN (aligned)'}</Text>
      </group>

      <Text position={[0, 0.1, 20]} fontSize={0.55} color={isDarkMode ? '#94a3b8' : '#64748b'} anchorX="center" maxWidth={35} textAlign="center">
        {'ALL chutes under negative pressure — smells sucked down, not up.\n3 chute types per cluster every 100m. 6 sealed bunkers per ring.\nTimed gate valve opens on alignment. Organic waste → anaerobic digestion → biogas.'}
      </Text>
    </>
  );
};

// ============================================================
// B6: GREYWATER RECOVERY — Collection tank + pulse bolus + irrigation split
// ============================================================
const GreywaterScene: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const bolusRef = useRef<THREE.Mesh>(null);
  const tankFillRef = useRef<THREE.Mesh>(null);
  const pulsePhase = useRef(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const cycle = time % 6; // 6-second cycle

    // Tank filling phase (0-4s), then pulse release (4-6s)
    if (tankFillRef.current) {
      const fillLevel = cycle < 4 ? (cycle / 4) : Math.max(0, 1 - (cycle - 4) / 0.5);
      tankFillRef.current.scale.y = Math.max(0.05, fillLevel);
      tankFillRef.current.position.y = -3 + fillLevel * 1.5;
    }

    // Bolus animation — moves through pipe after pulse
    if (bolusRef.current) {
      if (cycle >= 4) {
        const p = (cycle - 4) / 2; // 0..1 over 2 seconds
        bolusRef.current.visible = true;
        bolusRef.current.position.x = -2 + p * 22; // travel along pipe
        bolusRef.current.scale.set(1 + Math.sin(p * Math.PI) * 0.3, 1, 1);
      } else {
        bolusRef.current.visible = false;
      }
    }

    pulsePhase.current = cycle;
  });

  return (
    <>
      <ambientLight intensity={isDarkMode ? 0.4 : 0.6} />
      <directionalLight position={[10, 10, 5]} intensity={isDarkMode ? 0.8 : 1.2} />

      {/* Ring cross-section backdrop */}
      <mesh position={[0, 4, -2]}>
        <boxGeometry args={[8, 10, 2]} />
        <meshStandardMaterial color={isDarkMode ? '#1e293b' : '#e2e8f0'} metalness={0.2} roughness={0.7} transparent opacity={0.5} />
      </mesh>
      <Text position={[0, 10, 0]} fontSize={0.8} color={isDarkMode ? '#e2e8f0' : '#1e293b'} anchorX="center">
        RING CROSS-SECTION
      </Text>

      {/* Greywater pipe (light blue) running alongside */}
      <mesh position={[-3, 2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 6, 12]} />
        <meshStandardMaterial color="#67e8f9" metalness={0.5} roughness={0.3} transparent opacity={0.7} />
      </mesh>
      <Text position={[-3, 6, 1]} fontSize={0.5} color="#67e8f9" anchorX="center">
        GREYWATER PIPE
      </Text>

      {/* Sewage pipe (dark gray) adjacent */}
      <mesh position={[3, 2, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 6, 12]} />
        <meshStandardMaterial color="#57534e" metalness={0.4} roughness={0.6} />
      </mesh>
      <Text position={[3, 6, 1]} fontSize={0.5} color="#78716c" anchorX="center">
        SEWAGE PIPE
      </Text>

      {/* Collection tank (cylinder at ring base) */}
      <mesh position={[-2, -3, 0]}>
        <cylinderGeometry args={[2, 2, 5, 16]} />
        <meshStandardMaterial color="#164e63" metalness={0.4} roughness={0.5} transparent opacity={0.5} />
      </mesh>
      {/* Tank fill level (animated) */}
      <mesh ref={tankFillRef} position={[-2, -3, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 4.5, 16]} />
        <meshStandardMaterial color="#67e8f9" metalness={0.3} roughness={0.4} transparent opacity={0.6} />
      </mesh>
      <Text position={[-2, -7, 1]} fontSize={0.6} color="#67e8f9" anchorX="center">
        COLLECTION TANK
      </Text>

      {/* Pulse valve icon */}
      <mesh position={[2, -3, 0]}>
        <boxGeometry args={[1.5, 1.5, 1]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} emissive="#f59e0b" emissiveIntensity={0.3} />
      </mesh>
      <Text position={[2, -5, 1]} fontSize={0.45} color="#f59e0b" anchorX="center">
        PULSE VALVE
      </Text>

      {/* Outflow pipe (horizontal) */}
      <mesh position={[10, -3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 18, 12]} />
        <meshStandardMaterial color="#67e8f9" metalness={0.4} roughness={0.4} transparent opacity={0.5} />
      </mesh>

      {/* Animated bolus flowing through pipe */}
      <mesh ref={bolusRef} position={[4, -3, 0]} visible={false}>
        <sphereGeometry args={[0.8, 12, 12]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.5} roughness={0.3} emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>

      {/* Downstream split */}
      {/* Green branch - irrigation */}
      <mesh position={[16, -1, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.4, 0.4, 5, 12]} />
        <meshStandardMaterial color="#22c55e" metalness={0.4} roughness={0.4} />
      </mesh>
      <Text position={[19, 1, 1]} fontSize={0.5} color="#22c55e" anchorX="center">
        {'→ IRRIGATION\n(trees, gardens)'}
      </Text>

      {/* Gray branch - merging into sewage */}
      <mesh position={[16, -5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.4, 0.4, 5, 12]} />
        <meshStandardMaterial color="#78716c" metalness={0.4} roughness={0.5} />
      </mesh>
      <Text position={[19, -6.5, 1]} fontSize={0.5} color="#78716c" anchorX="center">
        {'→ SEWAGE LINE\n(surplus)'}
      </Text>

      {/* Labels */}
      <Text position={[6, -10, 0]} fontSize={0.55} color={isDarkMode ? '#94a3b8' : '#64748b'} anchorX="center" maxWidth={35} textAlign="center">
        {'Greywater (sinks, showers, laundry) collected separately from blackwater.\nIntermittent pulse release creates scouring bolus — keeps lines clear and odor-free.\nSurplus greywater → ring irrigation (trees, gardens, cooling).'}
      </Text>
    </>
  );
};

// ============================================================
// Section wrapper for 3D diagrams
// ============================================================
const DiagramSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  color: string;
  isDarkMode: boolean;
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  canvasHeight?: string;
}> = ({ title, icon, color, isDarkMode, children, cameraPosition = [0, 5, 35], cameraFov = 50, canvasHeight = '450px' }) => {
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-slate-200';
  const bgColor = isDarkMode ? 'bg-slate-900/50' : 'bg-white';

  return (
    <div className={`p-6 rounded-xl border mb-8 ${borderColor} ${bgColor}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg`} style={{ backgroundColor: color + '22', color }}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="relative w-full rounded-lg overflow-hidden" style={{
        height: canvasHeight,
        background: isDarkMode
          ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <Canvas camera={{ position: cameraPosition, fov: cameraFov }} shadows>
          {children}
          <OrbitControls enablePan enableZoom enableRotate minDistance={15} maxDistance={80} />
        </Canvas>
      </div>
    </div>
  );
};

// ============================================================
// MAIN PAGE
// ============================================================
export default function InfrastructurePage({ isDarkMode }: InfrastructurePageProps) {
  return (
    <div className={`h-screen overflow-y-auto transition-colors duration-700 ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Infrastructure & Utilities
          </h1>
          <p className={`text-lg ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            How utilities flow in and out of a rotating city — water, power, sewage, waste, and greywater
          </p>
        </div>

        {/* B1: Rotary Union */}
        <DiagramSection
          title="Rotary Union System"
          icon={<Wifi className="w-6 h-6" />}
          color="#06b6d4"
          isDarkMode={isDarkMode}
          cameraPosition={[0, 8, 30]}
          cameraFov={45}
        >
          <RotaryUnionScene isDarkMode={isDarkMode} />
        </DiagramSection>

        {/* B2: Freshwater Supply */}
        <DiagramSection
          title="Freshwater Supply"
          icon={<Droplet className="w-6 h-6" />}
          color="#06b6d4"
          isDarkMode={isDarkMode}
          cameraPosition={[0, 5, 35]}
        >
          <FreshwaterScene isDarkMode={isDarkMode} />
        </DiagramSection>

        {/* B3: Contactless Power Transfer */}
        <DiagramSection
          title="Contactless Power Transfer"
          icon={<Zap className="w-6 h-6" />}
          color="#fbbf24"
          isDarkMode={isDarkMode}
          cameraPosition={[0, 3, 30]}
        >
          <PowerTransferScene isDarkMode={isDarkMode} />
        </DiagramSection>

        {/* B4: Sewage Egress */}
        <DiagramSection
          title="Sewage Egress"
          icon={<Wind className="w-6 h-6" />}
          color="#78716c"
          isDarkMode={isDarkMode}
          cameraPosition={[0, 5, 35]}
        >
          <SewageEgressScene isDarkMode={isDarkMode} />
        </DiagramSection>

        {/* B5: Solid Waste Egress */}
        <DiagramSection
          title="Solid Waste Egress"
          icon={<Trash2 className="w-6 h-6" />}
          color="#22c55e"
          isDarkMode={isDarkMode}
          cameraPosition={[0, 25, 25]}
          cameraFov={50}
        >
          <WasteChutesScene isDarkMode={isDarkMode} />
        </DiagramSection>

        {/* B6: Greywater Recovery */}
        <DiagramSection
          title="Greywater Recovery"
          icon={<Recycle className="w-6 h-6" />}
          color="#67e8f9"
          isDarkMode={isDarkMode}
          cameraPosition={[6, 3, 30]}
        >
          <GreywaterScene isDarkMode={isDarkMode} />
        </DiagramSection>

        {/* YouTube Video Card */}
        <div className={`p-6 rounded-xl border-2 mb-8 ${
          isDarkMode ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-600' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-400'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-red-600' : 'bg-red-500'
            }`}>
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Watch How Multi-Passage Rotary Unions Work</h3>
              <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                See a real industrial rotary union in action - the same technology that would enable rotating city infrastructure
              </p>
              <a
                href="https://www.youtube.com/watch?v=IOLcnCO3iOM"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/50'
                    : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Video on YouTube
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
