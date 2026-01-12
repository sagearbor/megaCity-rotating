import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ShowcaseBeaconProps {
  position: [number, number, number];
  isDarkMode: boolean;
}

/**
 * ShowcaseBeacon - A tall, glowing landmark to help users locate the showcase area
 *
 * Features:
 * - Central spire reaching 120m tall
 * - 4 smaller accent spires arranged in a circle
 * - Animated glowing rings that pulse and rotate
 * - Emissive materials for visibility in all lighting conditions
 * - Color scheme adapts to dark/light mode
 */
export default function ShowcaseBeacon({ position, isDarkMode }: ShowcaseBeaconProps) {
  const mainSpireRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const accentSpiresRef = useRef<THREE.Group>(null);

  // Color scheme based on mode
  const colors = useMemo(() => {
    if (isDarkMode) {
      return {
        primary: '#00ffff',    // Bright cyan
        secondary: '#ff00ff',  // Bright magenta
        accent: '#ffdd00',     // Gold
        emissiveIntensity: 2.5
      };
    } else {
      return {
        primary: '#0088ff',    // Deep blue
        secondary: '#ff0088',  // Deep pink
        accent: '#ff8800',     // Orange
        emissiveIntensity: 1.5
      };
    }
  }, [isDarkMode]);

  // Animate the beacon with pulsing and rotation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Pulse the main spire
    if (mainSpireRef.current) {
      const pulse = Math.sin(time * 2) * 0.1 + 1;
      mainSpireRef.current.scale.y = pulse;
    }

    // Rotate the rings at different speeds
    if (ringsRef.current) {
      ringsRef.current.rotation.y = time * 0.5;
      ringsRef.current.children.forEach((ring, index) => {
        ring.rotation.x = time * (0.3 + index * 0.1);
      });
    }

    // Gentle rotation of accent spires
    if (accentSpiresRef.current) {
      accentSpiresRef.current.rotation.y = time * 0.2;
    }
  });

  // Calculate positions for accent spires in a circle
  const accentSpirePositions = useMemo(() => {
    const radius = 15;
    const count = 4;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotation: angle
      };
    });
  }, []);

  return (
    <group position={position}>
      {/* Main Central Spire - 120m tall */}
      <group ref={mainSpireRef} position={[0, 60, 0]}>
        {/* Base cylinder */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[3, 5, 40, 8]} />
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.primary}
            emissiveIntensity={colors.emissiveIntensity}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Middle section */}
        <mesh position={[0, 30, 0]}>
          <cylinderGeometry args={[2, 3, 40, 8]} />
          <meshStandardMaterial
            color={colors.secondary}
            emissive={colors.secondary}
            emissiveIntensity={colors.emissiveIntensity}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Top section */}
        <mesh position={[0, 55, 0]}>
          <cylinderGeometry args={[1, 2, 30, 8]} />
          <meshStandardMaterial
            color={colors.accent}
            emissive={colors.accent}
            emissiveIntensity={colors.emissiveIntensity}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Top cone/spire tip */}
        <mesh position={[0, 75, 0]}>
          <coneGeometry args={[1.5, 10, 8]} />
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.primary}
            emissiveIntensity={colors.emissiveIntensity * 1.5}
            metalness={1}
            roughness={0}
          />
        </mesh>
      </group>

      {/* Accent Spires - 4 smaller spires around the main one */}
      <group ref={accentSpiresRef}>
        {accentSpirePositions.map((pos, index) => (
          <group key={index} position={[pos.x, 0, pos.z]} rotation={[0, pos.rotation, 0]}>
            {/* Base */}
            <mesh position={[0, 15, 0]}>
              <cylinderGeometry args={[1.5, 2, 30, 6]} />
              <meshStandardMaterial
                color={index % 2 === 0 ? colors.secondary : colors.accent}
                emissive={index % 2 === 0 ? colors.secondary : colors.accent}
                emissiveIntensity={colors.emissiveIntensity * 0.8}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Top cone */}
            <mesh position={[0, 32, 0]}>
              <coneGeometry args={[2, 8, 6]} />
              <meshStandardMaterial
                color={colors.primary}
                emissive={colors.primary}
                emissiveIntensity={colors.emissiveIntensity}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Animated Glowing Rings */}
      <group ref={ringsRef}>
        {/* Large outer ring */}
        <mesh position={[0, 40, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[20, 0.8, 16, 32]} />
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.primary}
            emissiveIntensity={colors.emissiveIntensity * 1.2}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Middle ring */}
        <mesh position={[0, 60, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[15, 0.6, 16, 32]} />
          <meshStandardMaterial
            color={colors.secondary}
            emissive={colors.secondary}
            emissiveIntensity={colors.emissiveIntensity * 1.2}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Upper ring */}
        <mesh position={[0, 80, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[10, 0.5, 16, 32]} />
          <meshStandardMaterial
            color={colors.accent}
            emissive={colors.accent}
            emissiveIntensity={colors.emissiveIntensity * 1.2}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Top ring - smallest */}
        <mesh position={[0, 95, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[6, 0.4, 16, 32]} />
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.primary}
            emissiveIntensity={colors.emissiveIntensity * 1.5}
            metalness={1}
            roughness={0}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>

      {/* Ground base platform - helps anchor the beacon visually */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[25, 28, 1, 32]} />
        <meshStandardMaterial
          color={colors.accent}
          emissive={colors.accent}
          emissiveIntensity={colors.emissiveIntensity * 0.5}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Decorative ground rings */}
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[30, 0.5, 16, 32]} />
        <meshStandardMaterial
          color={colors.primary}
          emissive={colors.primary}
          emissiveIntensity={colors.emissiveIntensity * 0.6}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[35, 0.4, 16, 32]} />
        <meshStandardMaterial
          color={colors.secondary}
          emissive={colors.secondary}
          emissiveIntensity={colors.emissiveIntensity * 0.6}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
