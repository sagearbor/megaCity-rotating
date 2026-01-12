export interface UmbilicalTowerConfig {
  id: string;
  ringId: string;
  anglePosition: number;     // Degrees (0-360)
  innerRadius: number;       // Position at ring inner edge
  height: number;            // Tower height (matches ring height)
  waterCapacityLitersPerDay: number;
  powerCapacityMW: number;
  status: 'active' | 'maintenance' | 'standby';
}

export interface RingConfig {
  id: string;
  name: string;
  innerRadius: number;
  outerRadius: number;
  height: number;
  rotationSpeed: number; // Degrees per minute
  color: string;
  floorCount: number;
  sectionCount: number; // Number of distinct building blocks in the ring
  description?: string;
  umbilicalCount: number;
  umbilicals: UmbilicalTowerConfig[];
}

export interface WalkwayConfig {
  id: string;
  fromRingId: string;
  toRingId: string;
  angleOffset: number; // Angle in world space
  width: number;
  type: 'static';
  floor: number; // Floor number (e.g., 2-9)
}

export interface SimulationState {
  isPlaying: boolean;
  timeScale: number;
  currentTime: number; // Simulated seconds
}

export interface AIAnalysisResult {
  title: string;
  content: string;
  type: 'structural' | 'philosophical' | 'logistical';
}

export interface HoverInfo {
  type: 'rooftop-garden' | 'rooftop-restaurant' | 'pool' | 'soccer' | 'baseball' | 'forest' | 'woods' | 'stream' | 'tunnel' | 'bridge' | 'solar-canopy' | 'umbilical' | 'ring' | 'skatepark' | 'outdoor-gym' | 'dog-park' | 'koi-pond' | 'food-truck' | 'farmers-market' | 'basketball' | 'picnic' | 'fountain' | 'botanical-garden' | 'mini-golf';
  name: string;
  description: string;
  details?: string;
  position: { x: number; y: number };
}