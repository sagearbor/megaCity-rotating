import React, { useState, useMemo } from 'react';
import { ArchitecturalScene } from './components/ArchitecturalScene';
import { ControlPanel } from './components/ControlPanel';
import { AnalysisModal } from './components/AnalysisModal';
import { RingConfig, WalkwayConfig, SimulationState, AIAnalysisResult, UmbilicalTowerConfig, HoverInfo } from './types';
import { analyzeStructure, generateLore } from './services/geminiService';
import { ChevronDown, Activity, Info, X } from 'lucide-react';

const RING_WIDTH = 300;
const GAP_WIDTH = 150;
const BUILDING_HEIGHT = 60;
const TARGET_EDGE_SPEED = 0.5; // m/s
const TARGET_BRIDGE_SPACING = 80;
const TARGET_SECTION_LENGTH = 400; // Target length of each building block in meters
const TARGET_UMBILICAL_SPACING = 1500; // meters
const MIN_UMBILICALS = 4;

const calculateUmbilicalCount = (ringInnerRadius: number, ringOuterRadius: number): number => {
  const midRadius = (ringInnerRadius + ringOuterRadius) / 2;
  const circumference = 2 * Math.PI * midRadius;
  const count = Math.max(MIN_UMBILICALS, Math.round(circumference / TARGET_UMBILICAL_SPACING));
  return count % 2 === 0 ? count : count + 1;
};

const generateUmbilicals = (ring: RingConfig): UmbilicalTowerConfig[] => {
  const umbilicals: UmbilicalTowerConfig[] = [];
  const count = ring.umbilicalCount;
  const angleStep = 360 / count;

  // Calculate capacity per umbilical based on ring size
  const ringArea = Math.PI * (ring.outerRadius ** 2 - ring.innerRadius ** 2);
  const waterPerM2 = 150; // liters per day per square meter (residential estimate)
  const powerPerM2 = 0.05; // MW per square meter

  const totalWater = ringArea * waterPerM2;
  const totalPower = ringArea * powerPerM2;

  for (let i = 0; i < count; i++) {
    umbilicals.push({
      id: `${ring.id}-umb-${i}`,
      ringId: ring.id,
      anglePosition: i * angleStep,
      innerRadius: ring.innerRadius,
      height: ring.height,
      waterCapacityLitersPerDay: totalWater / count,
      powerCapacityMW: totalPower / count,
      status: 'active'
    });
  }

  return umbilicals;
};

const generateRings = (): RingConfig[] => {
  const rings: RingConfig[] = [];
  
  // Central Hub (Continuous, no sections)
  const hubRing: RingConfig = {
    id: 'hub',
    name: 'Central Hub',
    innerRadius: 0,
    outerRadius: 500,
    height: 100,
    rotationSpeed: 0,
    color: '#cbd5e1',
    floorCount: 25,
    sectionCount: 1,
    umbilicalCount: 0,
    umbilicals: []
  };
  rings.push(hubRing);

  // 8 Concentric Rotating Rings
  let currentInner = 500;
  
  for (let i = 0; i < 8; i++) {
    const ringNum = i + 1;
    const outer = currentInner + RING_WIDTH;
    const avgRadius = (currentInner + outer) / 2;
    const circumference = 2 * Math.PI * avgRadius;
    
    // Calculate how many sections fit in this ring
    const idealSectionCount = Math.round(circumference / TARGET_SECTION_LENGTH);
    // Ensure even number for symmetry, minimum 4
    const sectionCount = Math.max(4, idealSectionCount % 2 === 0 ? idealSectionCount : idealSectionCount + 1);

    const omegaRadSec = TARGET_EDGE_SPEED / avgRadius;
    const speedDegMin = omegaRadSec * (180 / Math.PI) * 60;
    
    // Alternating directions
    const direction = i % 2 === 0 ? -1 : 1;

    const umbilicalCount = calculateUmbilicalCount(currentInner, outer);

    const ring: RingConfig = {
      id: `r${ringNum}`,
      name: `Ring ${ringNum}`,
      innerRadius: currentInner,
      outerRadius: outer,
      height: BUILDING_HEIGHT,
      rotationSpeed: speedDegMin * direction,
      color: i % 2 === 0 ? '#e2e8f0' : '#fdba74',
      floorCount: 15,
      sectionCount: sectionCount,
      umbilicalCount: umbilicalCount,
      umbilicals: []
    };

    ring.umbilicals = generateUmbilicals(ring);
    rings.push(ring);

    currentInner = outer + GAP_WIDTH;
  }
  return rings;
};

const generateWalkways = (rings: RingConfig[]): WalkwayConfig[] => {
  const walkways: WalkwayConfig[] = [];
  
  for (let i = 0; i < rings.length - 1; i++) {
    const source = rings[i];
    const target = rings[i+1];
    
    const gapMidRadius = (source.outerRadius + target.innerRadius) / 2;
    const circumference = 2 * Math.PI * gapMidRadius;
    
    const bridgeCount = Math.max(20, Math.round(circumference / TARGET_BRIDGE_SPACING));
    
    for (let b = 0; b < bridgeCount; b++) {
      const floor = 1 + (b % 12);
      
      walkways.push({
        id: `br-${source.id}-${target.id}-${b}`,
        fromRingId: source.id,
        toRingId: target.id,
        angleOffset: (360 / bridgeCount) * b,
        width: 8,
        type: 'static',
        floor: floor
      });
    }
  }

  return walkways;
};

const INITIAL_RINGS = generateRings();
const INITIAL_WALKWAYS = generateWalkways(INITIAL_RINGS);

export default function App() {
  const [rings, setRings] = useState<RingConfig[]>(INITIAL_RINGS);
  const [walkways] = useState<WalkwayConfig[]>(INITIAL_WALKWAYS);
  
  const [simState, setSimState] = useState<SimulationState>({
    isPlaying: true,
    timeScale: 200.0,
    currentTime: 0
  });

  // Visual State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [globalOpacity, setGlobalOpacity] = useState(1.0);
  const [showUtilities, setShowUtilities] = useState(false);
  const [showTunnels, setShowTunnels] = useState(true);
  const [showSolarPanels, setShowSolarPanels] = useState(true);
  const [showRooftopAmenities, setShowRooftopAmenities] = useState(true);
  const [showGroundAmenities, setShowGroundAmenities] = useState(true);

  const [visibleFloorGroups, setVisibleFloorGroups] = useState({
    low: true,
    mid: true,
    high: true
  });

  const [statusOpen, setStatusOpen] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  
  const [resetCameraTrigger, setResetCameraTrigger] = useState(0);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);

  const visibleWalkways = useMemo(() => {
    return walkways.filter(w => {
        if (w.floor <= 4) return visibleFloorGroups.low;
        if (w.floor <= 8) return visibleFloorGroups.mid;
        return visibleFloorGroups.high;
    });
  }, [walkways, visibleFloorGroups]);

  const handleGenerateLore = async () => {
    setAiLoading(true);
    setAiModalOpen(true);
    const lore = await generateLore(rings);
    setAiResult({
        title: "City Archives",
        content: lore,
        type: 'philosophical'
    });
    setAiLoading(false);
  };

  const handleAskAI = async (query: string) => {
    setAiLoading(true);
    setAiModalOpen(true);
    const result = await analyzeStructure(rings, query);
    setAiResult(result);
    setAiLoading(false);
  };

  const handleReset = () => {
    setSimState(s => ({ ...s, isPlaying: true, currentTime: 0 }));
    setResetCameraTrigger(t => t + 1);
  };

  return (
    <div className={`w-full h-screen relative overflow-hidden transition-colors duration-700 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
         <ArchitecturalScene
            rings={rings}
            walkways={visibleWalkways}
            simState={simState}
            resetTrigger={resetCameraTrigger}
            isDarkMode={isDarkMode}
            globalOpacity={globalOpacity}
            showUtilities={showUtilities}
            showTunnels={showTunnels}
            showSolarPanels={showSolarPanels}
            showRooftopAmenities={showRooftopAmenities}
            showGroundAmenities={showGroundAmenities}
            onHover={setHoverInfo}
         />
      </div>

      {/* Main Control Panel (Left) */}
      <ControlPanel
        rings={rings}
        setRings={setRings}
        simState={simState}
        setSimState={setSimState}
        onGenerateLore={handleGenerateLore}
        onAskAI={handleAskAI}
        onReset={handleReset}
        visibleFloorGroups={visibleFloorGroups}
        setVisibleFloorGroups={setVisibleFloorGroups}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        globalOpacity={globalOpacity}
        setGlobalOpacity={setGlobalOpacity}
        showUtilities={showUtilities}
        setShowUtilities={setShowUtilities}
        showTunnels={showTunnels}
        setShowTunnels={setShowTunnels}
        showSolarPanels={showSolarPanels}
        setShowSolarPanels={setShowSolarPanels}
        showRooftopAmenities={showRooftopAmenities}
        setShowRooftopAmenities={setShowRooftopAmenities}
        showGroundAmenities={showGroundAmenities}
        setShowGroundAmenities={setShowGroundAmenities}
      />

      {/* Top Right: About / Mega Structure Info */}
      <div className="absolute top-6 right-6 z-20 flex flex-col items-end">
         <button 
            onClick={() => setAboutOpen(!aboutOpen)}
            className={`p-3 rounded-full shadow-lg transition-transform hover:scale-105 ${isDarkMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
            title="About The Rotunda"
         >
            {aboutOpen ? <X size={24} /> : <Info size={24} />}
         </button>

         {aboutOpen && (
            <div className={`mt-4 p-6 rounded-xl border shadow-2xl max-w-md animate-fade-in-up ${isDarkMode ? 'bg-slate-900/95 border-indigo-500/50' : 'bg-white/95 border-indigo-200'}`}>
                <h2 className={`text-xl font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                   The Rotunda Concept
                </h2>
                <div className={`space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <p>
                        A <strong className="text-sky-500">concentric city model</strong> designed to maximize density while minimizing transit times. 
                        Unlike linear cities, the Rotunda brings all points closer together through rotation.
                    </p>
                    
                    <div>
                        <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Transit Mechanics</h4>
                        <p>
                            Rings rotate in <span className="text-amber-500 font-mono">alternating directions</span>. 
                            To travel, citizens step onto a static bridge, wait for their destination sector to align, and step off. 
                            At 0.5 m/s, a new sector arrives every few minutes.
                        </p>
                    </div>

                    <div>
                        <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Capacity</h4>
                        <p>
                            With 8 active rings and average building height of 20 floors (simulated here as ~15), 
                            this structure houses approximately <strong className="text-emerald-500">12 Million</strong> inhabitants 
                            within a 5km radius.
                        </p>
                    </div>
                </div>
            </div>
         )}
      </div>

      {/* Bottom Right: Status Panel */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end">
        <button 
            onClick={() => setStatusOpen(!statusOpen)}
            className={`backdrop-blur-md border p-2 rounded-full mb-2 transition-colors shadow-lg ${isDarkMode ? 'bg-slate-900/90 border-amber-900/50 text-amber-500 hover:bg-slate-800' : 'bg-white/90 border-amber-200 text-amber-600 hover:bg-amber-50'}`}
            title="Toggle System Status"
        >
            {statusOpen ? <ChevronDown size={20} /> : <Activity size={20} />}
        </button>

        {statusOpen && (
            <div className={`backdrop-blur-md p-6 rounded-xl border shadow-2xl max-w-sm animate-fade-in-up ${isDarkMode ? 'bg-slate-900/90 border-amber-900/50' : 'bg-white/90 border-amber-200'}`}>
                <h3 className={`font-bold text-sm mb-2 tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-amber-500' : 'text-amber-600'}`}>
                    <Activity size={14} /> SYSTEM STATUS
                </h3>
                <div className="space-y-2">
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <strong className={isDarkMode ? 'text-slate-100' : 'text-slate-800'}>Configuration:</strong> 8 Alternating Toroids
                    </p>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <strong className="text-sky-500">Bridge System:</strong> {visibleWalkways.length} Active Units.
                    </p>
                    <div className={`h-px my-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <div className={`grid grid-cols-2 gap-2 text-[10px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                         <div>SPEED: {TARGET_EDGE_SPEED} m/s</div>
                         <div>DENSITY: {TARGET_BRIDGE_SPACING}m</div>
                    </div>
                </div>
            </div>
        )}
      </div>

      <AnalysisModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        isLoading={aiLoading}
        data={aiResult}
      />

      {/* Hover Tooltip */}
      {hoverInfo && (
        <div
          className={`fixed z-50 pointer-events-none px-4 py-3 rounded-lg shadow-xl border max-w-xs ${
            isDarkMode
              ? 'bg-slate-900/95 border-slate-700 text-white'
              : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
          style={{
            left: Math.min(hoverInfo.position.x + 15, window.innerWidth - 280),
            top: Math.min(hoverInfo.position.y + 15, window.innerHeight - 120),
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${
              hoverInfo.type === 'rooftop-garden' ? 'bg-green-500' :
              hoverInfo.type === 'rooftop-restaurant' ? 'bg-orange-500' :
              hoverInfo.type === 'pool' ? 'bg-sky-500' :
              hoverInfo.type === 'soccer' || hoverInfo.type === 'baseball' ? 'bg-emerald-500' :
              hoverInfo.type === 'forest' || hoverInfo.type === 'woods' ? 'bg-green-700' :
              hoverInfo.type === 'stream' ? 'bg-blue-400' :
              hoverInfo.type === 'tunnel' ? 'bg-slate-500' :
              hoverInfo.type === 'bridge' ? 'bg-slate-400' :
              hoverInfo.type === 'solar-canopy' ? 'bg-indigo-500' :
              hoverInfo.type === 'umbilical' ? 'bg-purple-500' :
              'bg-slate-400'
            }`} />
            <h4 className="font-semibold text-sm">{hoverInfo.name}</h4>
          </div>
          <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {hoverInfo.description}
          </p>
          {hoverInfo.details && (
            <p className={`text-xs mt-1 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {hoverInfo.details}
            </p>
          )}
        </div>
      )}
    </div>
  );
}