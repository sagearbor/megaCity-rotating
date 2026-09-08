import React, { useState, useMemo, useEffect } from 'react';
import { ArchitecturalScene } from '../components/ArchitecturalScene';
import { ControlPanel } from '../components/ControlPanel';
import { AnalysisModal } from '../components/AnalysisModal';
import { RingConfig, WalkwayConfig, SimulationState, AIAnalysisResult, UmbilicalTowerConfig, HoverInfo } from '../types';
import { analyzeStructure, generateLore } from '../services/geminiService';
import { ChevronDown, Activity, Info, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

import { baseline, createCityRings } from '../model/design.mjs';
const TARGET_EDGE_SPEED = baseline.speedMps;
const TARGET_BRIDGE_SPACING = 80;
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

const INITIAL_RINGS = createCityRings() as RingConfig[];

export default function HomePage({ initialView = 'overview' }: { initialView?: 'overview' | 'showcase' }) {
  const [cameraView, setCameraView] = useState(initialView);
  const [cameraTrigger, setCameraTrigger] = useState(0);
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [rings, setRings] = useState<RingConfig[]>(INITIAL_RINGS);
  const walkways = useMemo(() => generateWalkways(rings), [rings]);

  const [simState, setSimState] = useState<SimulationState>({
    isPlaying: false,
    timeScale: 200.0,
    currentTime: 0
  });

  const [globalOpacity, setGlobalOpacity] = useState(1.0);
  const [showUtilities, setShowUtilities] = useState(false);
  const [showTunnels, setShowTunnels] = useState(false);
  const [showSolarPanels, setShowSolarPanels] = useState(true);
  const [showRooftopAmenities, setShowRooftopAmenities] = useState(initialView === 'showcase');
  const [showGroundAmenities, setShowGroundAmenities] = useState(initialView === 'showcase');
  const [showInfrastructure, setShowInfrastructure] = useState(false);

  const [visibleFloorGroups, setVisibleFloorGroups] = useState({
    low: true,
    mid: true,
    high: true
  });

  const [statusOpen, setStatusOpen] = useState(false);
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
        title: "Illustrative city vignette",
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

  const visit = (view: 'overview' | 'showcase') => {
    setCameraView(view); setCameraTrigger(t => t + 1);
    if (view === 'showcase') {
      setShowGroundAmenities(true); setShowRooftopAmenities(true);
      setSimState(s => ({...s, isPlaying:false, currentTime:0}));
      setResetCameraTrigger(t => t + 1);
    }
  };
  useEffect(() => { visit(initialView); }, [initialView]);
  const handleReset = () => {
    setCameraView('overview');
    setRings(createCityRings() as RingConfig[]);
    setSimState(s => ({ ...s, isPlaying: false, currentTime: 0 }));
    setResetCameraTrigger(t => t + 1);
  };

  return (
    <><div className="scene-toolbar" aria-label="3D camera shortcuts"><button className="button secondary" onClick={()=>visit('overview')}>Whole city</button><button className="button primary" onClick={()=>visit('showcase')}>Visit detailed neighborhood</button><span>Ring 2–3 · ground amenities, people, forest & rooftops</span></div><div style={{height:"min(85svh, 900px)", minHeight:560}} className={`w-full relative overflow-hidden transition-colors duration-700 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="explorer-notice">Concept model · {simState.isPlaying ? `${simState.timeScale}× motion` : "Paused"} · Drag to orbit · pinch / scroll to zoom</div>
      <div className="absolute inset-0 z-0">
         <ArchitecturalScene
            rings={rings}
            walkways={visibleWalkways}
            simState={simState}
            resetTrigger={resetCameraTrigger}
            cameraView={cameraView}
            cameraTrigger={cameraTrigger}
            isDarkMode={isDarkMode}
            globalOpacity={globalOpacity}
            showUtilities={showUtilities}
            showTunnels={showTunnels}
            showSolarPanels={showSolarPanels}
            showRooftopAmenities={showRooftopAmenities}
            showGroundAmenities={showGroundAmenities}
            showInfrastructure={showInfrastructure}
            onHover={setHoverInfo}
         />
      </div>

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
        showInfrastructure={showInfrastructure}
        setShowInfrastructure={setShowInfrastructure}
      />

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
                        A <strong className="text-sky-500">concentric city model</strong> exploring density, shared landscape and movement.
                        Transport benefit versus a static city has not been demonstrated.
                    </p>

                    <div>
                        <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Transit Mechanics</h4>
                        <p>
                            Rings rotate in <span className="text-amber-500 font-mono">alternating directions</span>.
                            Protected, accessible transfers and safe evacuation at any ring angle require engineering development.
                            A full revolution takes about 2.8–13.8 hours at the baseline speed.
                        </p>
                    </div>

                    <div>
                        <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Capacity</h4>
                        <p>
                            The baseline has 8 rings, 15 floors per ring and an 8.2 km overall diameter. Indicative population depends on coverage and net residential area; see the Project brief scenario model.
                        </p>
                    </div>
                </div>
            </div>
         )}
      </div>

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
                    <Activity size={14} /> MODEL SETTINGS
                </h3>
                <div className="space-y-2">
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <strong className={isDarkMode ? 'text-slate-100' : 'text-slate-800'}>Configuration:</strong> {rings.filter(r => r.id !== "hub").length} Concept Rings
                    </p>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <strong className="text-sky-500">Bridge System:</strong> {visibleWalkways.length} Indicative Links.
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
          <p className="text-xs mb-2">Illustrative geometry · not engineered</p>
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
    </div></>
  );
}
