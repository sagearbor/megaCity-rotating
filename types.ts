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