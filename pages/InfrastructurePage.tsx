import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, Droplet, Zap, Wind, Wifi } from 'lucide-react';

interface InfrastructurePageProps {
  isDarkMode: boolean;
}

// 3D Rotary Union Visualization Component
const RotaryUnionScene: React.FC<{
  rotationAngle: number;
  isAutoplay: boolean;
  isDarkMode: boolean;
  onAngleChange: (angle: number) => void;
}> = ({ rotationAngle, isAutoplay, isDarkMode, onAngleChange }) => {
  const ringRef = useRef<THREE.Group>(null);
  const waterParticlesRef = useRef<THREE.Points>(null);
  const sewageParticlesRef = useRef<THREE.Points>(null);
  const dataParticlesRef = useRef<THREE.Points>(null);
  const electricParticlesRef = useRef<THREE.Points>(null);

  // Create animated particles for utility flow
  const { waterParticles, sewageParticles, dataParticles, electricParticles } = useMemo(() => {
    const createParticles = (count: number, color: number) => {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const c = new THREE.Color(color);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      return geometry;
    };

    return {
      waterParticles: createParticles(30, 0x06b6d4),
      sewageParticles: createParticles(25, 0x78716c),
      dataParticles: createParticles(40, 0x8b5cf6),
      electricParticles: createParticles(35, 0xfbbf24)
    };
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (isAutoplay && ringRef.current) {
      const newAngle = (rotationAngle + delta * 20) % 360;
      onAngleChange(newAngle);
      ringRef.current.rotation.y = (newAngle * Math.PI) / 180;
    } else if (ringRef.current) {
      ringRef.current.rotation.y = (rotationAngle * Math.PI) / 180;
    }

    const time = state.clock.elapsedTime;

    // Animate water particles (blue) - flows UPWARD from ground through rotary union to ring
    if (waterParticlesRef.current) {
      const positions = waterParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        const progress = ((time * 0.5 + i / 10) % 1);
        positions[i * 3] = -15; // x position (pipe 1)
        positions[i * 3 + 1] = -40 + progress * 37; // y position (flows upward from -40 to -3)
        positions[i * 3 + 2] = 0;
      }
      waterParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate sewage particles (brown/gray) - flows DOWNWARD from ring through rotary union to ground
    if (sewageParticlesRef.current) {
      const positions = sewageParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        const progress = ((time * 0.4 + i / 8) % 1);
        positions[i * 3] = -5; // x position (pipe 2)
        positions[i * 3 + 1] = -3 - progress * 37; // y position (flows downward from -3 to -40)
        positions[i * 3 + 2] = 0;
      }
      sewageParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate electricity particles (yellow) - flows UPWARD
    if (electricParticlesRef.current) {
      const positions = electricParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        const progress = ((time * 0.6 + i / 12) % 1);
        positions[i * 3] = 5; // x position (pipe 3)
        positions[i * 3 + 1] = -40 + progress * 37; // y position (flows upward)
        positions[i * 3 + 2] = 0;
      }
      electricParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate data particles (purple) - flows UPWARD
    if (dataParticlesRef.current) {
      const positions = dataParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length / 3; i++) {
        const progress = ((time * 0.8 + i / 15) % 1);
        positions[i * 3] = 15; // x position (pipe 4)
        positions[i * 3 + 1] = -40 + progress * 37; // y position (flows upward)
        positions[i * 3 + 2] = 0;
      }
      dataParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Create flat ring section geometry (horizontal, not curved)
  const ringArcGeometry = useMemo(() => {
    // Create a flat ring section that's horizontal (parallel to ground)
    const width = 25; // Width of the ring section
    const depth = 30; // Depth (radial dimension)
    const height = 10; // Vertical height of the ring section

    const geometry = new THREE.BoxGeometry(width, height, depth);
    return geometry;
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={isDarkMode ? 0.4 : 0.6} />
      <directionalLight position={[10, 10, 5]} intensity={isDarkMode ? 0.8 : 1.2} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#06b6d4" />

      {/* Ground Platform (Stationary) - Bottom layer */}
      <mesh position={[0, -30, 0]} receiveShadow>
        <boxGeometry args={[50, 8, 35]} />
        <meshStandardMaterial
          color={isDarkMode ? '#334155' : '#cbd5e1'}
          metalness={0.2}
          roughness={0.7}
        />
      </mesh>
      <Text
        position={[0, -26, 18]}
        fontSize={2.5}
        color={isDarkMode ? '#94a3b8' : '#64748b'}
        anchorX="center"
        anchorY="middle"
      >
        STATIONARY GROUND
      </Text>

      {/* Utility pipes coming up from ground */}
      {/* Water Pipe (Blue) */}
      <mesh position={[-15, -35, 0]}>
        <cylinderGeometry args={[2, 2, 10, 16]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Sewage Pipe (Gray) */}
      <mesh position={[-5, -35, 0]}>
        <cylinderGeometry args={[2, 2, 10, 16]} />
        <meshStandardMaterial color="#78716c" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Electricity Conduit (Yellow) */}
      <mesh position={[5, -35, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 10, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.2} />
      </mesh>

      {/* Data Fiber (Purple) */}
      <mesh position={[15, -35, 0]}>
        <cylinderGeometry args={[1, 1, 10, 16]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} emissive="#8b5cf6" emissiveIntensity={0.3} />
      </mesh>

      {/* Rotary Union Assembly - At the EDGE where ground meets ring */}
      {/* Main rotary union housing (like a bearing) */}
      <mesh position={[0, -18, 0]} castShadow>
        <boxGeometry args={[42, 8, 30]} />
        <meshStandardMaterial
          color={isDarkMode ? '#1e293b' : '#e2e8f0'}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Rotary union channels (visible cross-section) */}
      <mesh position={[-15, -18, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 8.5, 16]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.6} roughness={0.3} emissive="#06b6d4" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[-5, -18, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 8.5, 16]} />
        <meshStandardMaterial color="#78716c" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[5, -18, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 8.5, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[15, -18, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 8.5, 16]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} emissive="#8b5cf6" emissiveIntensity={0.3} />
      </mesh>

      {/* Rotary Union Label */}
      <Text
        position={[0, -18, 16]}
        fontSize={2}
        color={isDarkMode ? '#e2e8f0' : '#1e293b'}
        anchorX="center"
        anchorY="middle"
      >
        ROTARY UNION
      </Text>
      <Text
        position={[0, -21, 16]}
        fontSize={1.5}
        color={isDarkMode ? '#94a3b8' : '#64748b'}
        anchorX="center"
        anchorY="middle"
      >
        (Multi-Passage)
      </Text>

      {/* Pipes from Rotary Union to Ring (going UP) */}
      {/* Water */}
      <mesh position={[-15, -8, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 10, 16]} />
        <meshStandardMaterial color="#06b6d4" metalness={0.5} roughness={0.4} transparent opacity={0.8} />
      </mesh>

      {/* Sewage */}
      <mesh position={[-5, -8, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 10, 16]} />
        <meshStandardMaterial color="#78716c" metalness={0.4} roughness={0.6} transparent opacity={0.8} />
      </mesh>

      {/* Electricity */}
      <mesh position={[5, -8, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 10, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.3} emissive="#fbbf24" emissiveIntensity={0.2} transparent opacity={0.8} />
      </mesh>

      {/* Data */}
      <mesh position={[15, -8, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 10, 16]} />
        <meshStandardMaterial color="#8b5cf6" metalness={0.8} roughness={0.2} emissive="#8b5cf6" emissiveIntensity={0.3} transparent opacity={0.8} />
      </mesh>

      {/* Rotating Ring Section - FLAT and HORIZONTAL */}
      <group ref={ringRef} position={[0, 0, 0]}>
        <mesh geometry={ringArcGeometry} castShadow receiveShadow position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isDarkMode ? '#e2e8f0' : '#fdba74'}
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>

        {/* Connection points at BOTTOM of ring (where it meets rotary union) */}
        <mesh position={[-15, -5, 0]}>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" metalness={0.6} />
        </mesh>
        <mesh position={[-5, -5, 0]}>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshStandardMaterial color="#78716c" metalness={0.6} />
        </mesh>
        <mesh position={[5, -5, 0]}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.7} emissive="#fbbf24" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[15, -5, 0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.8} emissive="#8b5cf6" emissiveIntensity={0.3} />
        </mesh>

        {/* Ring Label */}
        <Text
          position={[0, 8, 0]}
          fontSize={2.5}
          color={isDarkMode ? '#ffffff' : '#1e293b'}
          anchorX="center"
          anchorY="middle"
        >
          ROTATING RING SECTION
        </Text>
        <Text
          position={[0, 5, 0]}
          fontSize={1.8}
          color={isDarkMode ? '#94a3b8' : '#64748b'}
          anchorX="center"
          anchorY="middle"
        >
          (Spins horizontally)
        </Text>
      </group>

      {/* Animated Particles */}
      <points ref={waterParticlesRef} geometry={waterParticles}>
        <pointsMaterial size={1} vertexColors transparent opacity={0.8} />
      </points>
      <points ref={sewageParticlesRef} geometry={sewageParticles}>
        <pointsMaterial size={0.9} vertexColors transparent opacity={0.7} />
      </points>
      <points ref={electricParticlesRef} geometry={electricParticles}>
        <pointsMaterial size={0.8} vertexColors transparent opacity={0.9} />
      </points>
      <points ref={dataParticlesRef} geometry={dataParticles}>
        <pointsMaterial size={0.6} vertexColors transparent opacity={0.95} />
      </points>

      {/* Pipe Labels below ground */}
      <Text
        position={[-15, -42, 3]}
        fontSize={1.5}
        color="#06b6d4"
        anchorX="center"
      >
        WATER IN
      </Text>
      <Text
        position={[-5, -42, 3]}
        fontSize={1.5}
        color="#78716c"
        anchorX="center"
      >
        SEWAGE OUT
      </Text>
      <Text
        position={[5, -42, 3]}
        fontSize={1.5}
        color="#fbbf24"
        anchorX="center"
      >
        POWER IN
      </Text>
      <Text
        position={[15, -42, 3]}
        fontSize={1.5}
        color="#8b5cf6"
        anchorX="center"
      >
        DATA IN
      </Text>

      {/* Rotation indicator on ring */}
      <mesh position={[0, 8, 16]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 2, 4, 8]} />
        <meshStandardMaterial color={isAutoplay ? '#10b981' : '#ef4444'} emissive={isAutoplay ? '#10b981' : '#ef4444'} emissiveIntensity={0.5} />
      </mesh>

      {/* Flow direction arrows */}
      <Text
        position={[-15, -25, 3]}
        fontSize={2}
        color="#06b6d4"
        anchorX="center"
      >
        ↑
      </Text>
      <Text
        position={[-5, -25, 3]}
        fontSize={2}
        color="#78716c"
        anchorX="center"
      >
        ↓
      </Text>
      <Text
        position={[5, -25, 3]}
        fontSize={2}
        color="#fbbf24"
        anchorX="center"
      >
        ↑
      </Text>
      <Text
        position={[15, -25, 3]}
        fontSize={2}
        color="#8b5cf6"
        anchorX="center"
      >
        ↑
      </Text>
    </>
  );
};

// Explanation step type
interface ExplanationStep {
  angle: number;
  text: string;
  position: 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';
  utility?: 'water' | 'sewage' | 'electricity' | 'data';
}

// Explanation steps that trigger at different rotation angles
const explanationSteps: ExplanationStep[] = [
  { angle: 0, text: "Ring rotates horizontally while utilities flow through edge-mounted rotary union", position: 'top-right', utility: 'water' },
  { angle: 45, text: "Water flows UP from ground, through rotary union channels, into rotating ring", position: 'left', utility: 'water' },
  { angle: 90, text: "Rotary union at ring's base maintains sealed connections during rotation", position: 'bottom' },
  { angle: 135, text: "Sewage flows DOWN from ring through dedicated channel to ground treatment", position: 'right', utility: 'sewage' },
  { angle: 180, text: "Multiple rotary unions around ring perimeter provide N+1 redundancy", position: 'top' },
  { angle: 225, text: "Power transfers through slip rings in rotary union assembly", position: 'left', utility: 'electricity' },
  { angle: 270, text: "Fiber optic channels enable high-speed data with minimal loss", position: 'bottom-right', utility: 'data' },
  { angle: 315, text: "Ring completes 360° rotation - utilities never wrap or twist", position: 'top-left' },
];

// Explanation Bubble Component
const ExplanationBubble: React.FC<{
  step: ExplanationStep;
  isVisible: boolean;
  isDarkMode: boolean;
}> = ({ step, isVisible, isDarkMode }) => {
  // Position classes based on bubble position
  const positionClasses = {
    'top': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'right': 'top-1/2 right-4 -translate-y-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'left': 'top-1/2 left-4 -translate-y-1/2',
    'top-left': 'top-4 left-4',
  };

  // Arrow position classes
  const arrowClasses = {
    'top': 'top-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent',
    'top-right': 'top-full right-4 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent',
    'right': 'right-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent',
    'bottom-right': 'bottom-full right-4 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent',
    'bottom': 'bottom-full left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent',
    'bottom-left': 'bottom-full left-4 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent',
    'left': 'left-full top-1/2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent',
    'top-left': 'top-full left-4 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent',
  };

  // Utility-specific colors
  const utilityColors = {
    water: {
      bg: isDarkMode ? 'bg-cyan-900/95' : 'bg-cyan-100/95',
      border: isDarkMode ? 'border-cyan-500' : 'border-cyan-400',
      text: isDarkMode ? 'text-cyan-100' : 'text-cyan-900',
      arrow: isDarkMode ? 'border-t-cyan-900 border-r-cyan-900 border-b-cyan-900 border-l-cyan-900' : 'border-t-cyan-100 border-r-cyan-100 border-b-cyan-100 border-l-cyan-100',
    },
    sewage: {
      bg: isDarkMode ? 'bg-gray-800/95' : 'bg-gray-100/95',
      border: isDarkMode ? 'border-gray-500' : 'border-gray-400',
      text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
      arrow: isDarkMode ? 'border-t-gray-800 border-r-gray-800 border-b-gray-800 border-l-gray-800' : 'border-t-gray-100 border-r-gray-100 border-b-gray-100 border-l-gray-100',
    },
    electricity: {
      bg: isDarkMode ? 'bg-amber-900/95' : 'bg-amber-100/95',
      border: isDarkMode ? 'border-amber-500' : 'border-amber-400',
      text: isDarkMode ? 'text-amber-100' : 'text-amber-900',
      arrow: isDarkMode ? 'border-t-amber-900 border-r-amber-900 border-b-amber-900 border-l-amber-900' : 'border-t-amber-100 border-r-amber-100 border-b-amber-100 border-l-amber-100',
    },
    data: {
      bg: isDarkMode ? 'bg-violet-900/95' : 'bg-violet-100/95',
      border: isDarkMode ? 'border-violet-500' : 'border-violet-400',
      text: isDarkMode ? 'text-violet-100' : 'text-violet-900',
      arrow: isDarkMode ? 'border-t-violet-900 border-r-violet-900 border-b-violet-900 border-l-violet-900' : 'border-t-violet-100 border-r-violet-100 border-b-violet-100 border-l-violet-100',
    },
    default: {
      bg: isDarkMode ? 'bg-slate-800/95' : 'bg-white/95',
      border: isDarkMode ? 'border-slate-500' : 'border-slate-300',
      text: isDarkMode ? 'text-slate-100' : 'text-slate-900',
      arrow: isDarkMode ? 'border-t-slate-800 border-r-slate-800 border-b-slate-800 border-l-slate-800' : 'border-t-white border-r-white border-b-white border-l-white',
    },
  };

  const colors = step.utility ? utilityColors[step.utility] : utilityColors.default;

  return (
    <div
      className={`absolute ${positionClasses[step.position]} z-20 pointer-events-none transition-all duration-500 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className={`relative px-4 py-3 rounded-lg border-2 ${colors.bg} ${colors.border} ${colors.text} shadow-2xl backdrop-blur-sm max-w-xs`}>
        <p className="text-sm font-medium leading-relaxed">{step.text}</p>
        {/* Arrow pointer */}
        <div className={`absolute ${arrowClasses[step.position]} ${colors.arrow} w-0 h-0`}></div>
      </div>
    </div>
  );
};

export default function InfrastructurePage({ isDarkMode }: InfrastructurePageProps) {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAngle = parseFloat(e.target.value);
    setRotationAngle(newAngle);
    setIsAutoplay(false); // Pause autoplay when user drags slider
  };

  // Calculate which explanation bubbles should be visible
  const getVisibleSteps = (angle: number) => {
    // Normalize angle to 0-360
    const normalizedAngle = angle % 360;

    return explanationSteps.map(step => {
      // Calculate angular distance (handling wrap-around at 0/360)
      let distance = Math.abs(normalizedAngle - step.angle);
      if (distance > 180) {
        distance = 360 - distance;
      }

      // Show bubble if within 20 degrees of trigger angle
      const isVisible = distance <= 20;

      return { step, isVisible };
    });
  };

  const visibleSteps = getVisibleSteps(rotationAngle);

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
            How utilities reach a rotating city through multi-passage rotary unions
          </p>
        </div>

        {/* 3D Visualization Section */}
        <div className={`p-8 rounded-xl border mb-8 ${
          isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Rotary Union System</h2>
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'
              }`}
              title={isAutoplay ? "Pause Animation" : "Play Animation"}
            >
              {isAutoplay ? <Pause size={20} /> : <Play size={20} />}
              <span className="text-sm font-medium">{isAutoplay ? 'Autoplay On' : 'Autoplay Off'}</span>
            </button>
          </div>

          {/* Three.js Canvas */}
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden" style={{
            background: isDarkMode
              ? 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)'
              : 'linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 100%)'
          }}>
            <Canvas
              camera={{ position: [60, 5, 70], fov: 50 }}
              shadows
            >
              <RotaryUnionScene
                rotationAngle={rotationAngle}
                isAutoplay={isAutoplay}
                isDarkMode={isDarkMode}
                onAngleChange={setRotationAngle}
              />
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={50}
                maxDistance={200}
              />
            </Canvas>

            {/* Explanation Bubbles Overlay */}
            {visibleSteps.map(({ step, isVisible }) => (
              <ExplanationBubble
                key={step.angle}
                step={step}
                isVisible={isVisible}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>

          {/* Rotation Control Slider */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Manual Rotation Control</label>
              <span className={`text-sm font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {rotationAngle.toFixed(1)}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="0.5"
              value={rotationAngle}
              onChange={handleSliderChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: isDarkMode
                  ? `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(rotationAngle / 360) * 100}%, #334155 ${(rotationAngle / 360) * 100}%, #334155 100%)`
                  : `linear-gradient(to right, #0891b2 0%, #0891b2 ${(rotationAngle / 360) * 100}%, #cbd5e1 ${(rotationAngle / 360) * 100}%, #cbd5e1 100%)`
              }}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>0°</span>
              <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>90°</span>
              <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>180°</span>
              <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>270°</span>
              <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>360°</span>
            </div>
          </div>

          {/* Explanation */}
          <div className={`mt-6 p-4 rounded-lg border-l-4 ${
            isDarkMode ? 'bg-slate-800/50 border-cyan-500' : 'bg-cyan-50 border-cyan-400'
          }`}>
            <h3 className="font-semibold mb-2">How It Works - Cross-Section View</h3>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              This cross-section shows utilities flowing UP from stationary ground infrastructure, THROUGH the rotary union
              (like a bearing with multiple sealed channels), and INTO the rotating ring section. The rotary union is positioned
              at the EDGE/BASE of the ring where it meets the ground - think of it like a giant lazy susan with utilities coming
              up through the connection point. The ring spins horizontally while utilities flow continuously without cable wrapping
              or pipe twisting.
            </p>
          </div>
        </div>

        {/* YouTube Video Card - Prominent */}
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

        {/* Utility Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UtilityCard
            icon={<Droplet className="w-6 h-6" />}
            title="Water System"
            color="cyan"
            isDarkMode={isDarkMode}
          >
            <p className="mb-3">Fresh water flows from ground reservoirs through the rotary union, passing through sealed rotating channels into the ring distribution network.</p>
            <ul className="space-y-1 text-sm">
              <li>• Pressurized distribution at 60-80 PSI</li>
              <li>• Redundant supply lines for reliability</li>
              <li>• Real-time flow monitoring</li>
              <li>• Zero leakage through precision seals</li>
            </ul>
          </UtilityCard>

          <UtilityCard
            icon={<Zap className="w-6 h-6" />}
            title="Electricity"
            color="amber"
            isDarkMode={isDarkMode}
          >
            <p className="mb-3">Power transfers via slip rings - stationary brushes contact rotating conductors, enabling continuous electrical flow without cables wrapping.</p>
            <ul className="space-y-1 text-sm">
              <li>• 3-phase AC power distribution</li>
              <li>• Slip ring capacity: 50MW per tower</li>
              <li>• Minimal transmission loss (&lt;2%)</li>
              <li>• Self-cleaning carbon brushes</li>
            </ul>
          </UtilityCard>

          <UtilityCard
            icon={<Wind className="w-6 h-6" />}
            title="Sewage System"
            color="gray"
            isDarkMode={isDarkMode}
          >
            <p className="mb-3">Wastewater drains from buildings into ring collection systems, flows through rotary union passages to ground treatment facilities.</p>
            <ul className="space-y-1 text-sm">
              <li>• Gravity-assisted drainage</li>
              <li>• Vacuum-assist backup system</li>
              <li>• Real-time blockage detection</li>
              <li>• Separated from water supply channels</li>
            </ul>
          </UtilityCard>

          <UtilityCard
            icon={<Wifi className="w-6 h-6" />}
            title="Data & Internet"
            color="violet"
            isDarkMode={isDarkMode}
          >
            <p className="mb-3">Fiber optic rotary joints maintain high-speed connectivity, with hundreds of fiber channels rotating freely without signal loss.</p>
            <ul className="space-y-1 text-sm">
              <li>• 100 Gbps per fiber channel</li>
              <li>• &lt;0.5 dB insertion loss</li>
              <li>• Redundant fiber paths (N+1)</li>
              <li>• Multi-wavelength DWDM support</li>
            </ul>
          </UtilityCard>
        </div>

        {/* Redundancy Section */}
        <div className={`p-6 rounded-xl border ${
          isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <h3 className="text-xl font-bold mb-4">Redundancy & Reliability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Distributed Architecture</h4>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Each ring has 4-16 umbilical towers (scaled by circumference), providing N+1 redundancy.
                If one tower requires maintenance, others continue service without interruption.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Benefits</h4>
              <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <li>• Reduced pipe run distances (shorter = more reliable)</li>
                <li>• Load balancing across multiple connection points</li>
                <li>• Maintenance without service disruption</li>
                <li>• Uniform water pressure throughout ring</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

interface UtilityCardProps {
  icon: React.ReactNode;
  title: string;
  color: 'cyan' | 'amber' | 'gray' | 'violet';
  children: React.ReactNode;
  isDarkMode: boolean;
}

const UtilityCard: React.FC<UtilityCardProps> = ({ icon, title, color, children, isDarkMode }) => {
  const colorClasses = {
    cyan: {
      border: isDarkMode ? 'border-cyan-700' : 'border-cyan-200',
      bg: isDarkMode ? 'bg-cyan-900/20' : 'bg-cyan-50',
      iconBg: isDarkMode ? 'bg-cyan-900/50' : 'bg-cyan-100',
      iconText: isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
    },
    amber: {
      border: isDarkMode ? 'border-amber-700' : 'border-amber-200',
      bg: isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50',
      iconBg: isDarkMode ? 'bg-amber-900/50' : 'bg-amber-100',
      iconText: isDarkMode ? 'text-amber-400' : 'text-amber-600'
    },
    gray: {
      border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
      bg: isDarkMode ? 'bg-gray-900/20' : 'bg-gray-50',
      iconBg: isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100',
      iconText: isDarkMode ? 'text-gray-400' : 'text-gray-600'
    },
    violet: {
      border: isDarkMode ? 'border-violet-700' : 'border-violet-200',
      bg: isDarkMode ? 'bg-violet-900/20' : 'bg-violet-50',
      iconBg: isDarkMode ? 'bg-violet-900/50' : 'bg-violet-100',
      iconText: isDarkMode ? 'text-violet-400' : 'text-violet-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`p-6 rounded-xl border ${colors.border} ${colors.bg}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colors.iconBg} ${colors.iconText}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <div className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
        {children}
      </div>
    </div>
  );
};
