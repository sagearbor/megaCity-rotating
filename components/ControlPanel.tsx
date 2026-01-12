import React, { useState } from 'react';
import { RingConfig, SimulationState } from '../types';
import { Play, Pause, RotateCcw, Plus, Trash2, Settings, Info, Layers, Sun, Moon, Palette, ChevronLeft } from 'lucide-react';

interface ControlPanelProps {
  rings: RingConfig[];
  setRings: React.Dispatch<React.SetStateAction<RingConfig[]>>;
  simState: SimulationState;
  setSimState: React.Dispatch<React.SetStateAction<SimulationState>>;
  onGenerateLore: () => void;
  onAskAI: (query: string) => void;
  onReset: () => void;
  visibleFloorGroups: { low: boolean; mid: boolean; high: boolean };
  setVisibleFloorGroups: React.Dispatch<React.SetStateAction<{ low: boolean; mid: boolean; high: boolean }>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  globalOpacity: number;
  setGlobalOpacity: React.Dispatch<React.SetStateAction<number>>;
  showUtilities: boolean;
  setShowUtilities: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  rings, setRings, simState, setSimState, onGenerateLore, onAskAI, onReset,
  visibleFloorGroups, setVisibleFloorGroups,
  isDarkMode, setIsDarkMode,
  globalOpacity, setGlobalOpacity,
  showUtilities, setShowUtilities
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdateRing = (id: string, field: keyof RingConfig, value: any) => {
    setRings(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleGlobalColorChange = (color: string) => {
    setRings(prev => prev.map(r => ({ ...r, color })));
  };

  const addRing = () => {
    const lastRing = rings[rings.length - 1];
    const innerRadius = lastRing ? lastRing.outerRadius + 150 : 500;
    const outerRadius = innerRadius + 300;
    
    const newRing: RingConfig = {
      id: Date.now().toString(),
      name: `Ring ${rings.length + 1}`,
      innerRadius,
      outerRadius,
      height: 150 + Math.random() * 100,
      rotationSpeed: (Math.random() - 0.5) * 5,
      color: "#e2e8f0",
      floorCount: 15,
      sectionCount: 30,
      umbilicalCount: 0,
      umbilicals: []
    };
    setRings([...rings, newRing]);
  };

  const removeRing = (id: string) => {
    setRings(rings.filter(r => r.id !== id));
  };

  const panelBg = isDarkMode ? "bg-slate-900/95 border-slate-700 text-white" : "bg-white/95 border-slate-200 text-slate-800";
  const headerBg = isDarkMode ? "bg-slate-950/50 border-slate-700" : "bg-slate-50/80 border-slate-200";
  const subText = isDarkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = isDarkMode ? "bg-slate-800/50 border-slate-700 hover:border-slate-600" : "bg-slate-50 border-slate-200 hover:border-sky-300";
  const inputBg = isDarkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-white border-slate-300 text-slate-700";

  return (
    <>
        {/* Toggle Button (Always Visible) */}
        <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`absolute top-6 left-6 z-30 p-3 rounded-full shadow-xl transition-all hover:scale-105 ${isOpen ? 'translate-x-80' : 'translate-x-0'} ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-100'}`}
        >
            {isOpen ? <ChevronLeft size={24} /> : <Settings size={24} />}
        </button>

        {/* Sliding Panel */}
        <div className={`absolute top-0 left-0 h-full w-96 backdrop-blur-md border-r flex flex-col z-20 shadow-2xl transition-transform duration-300 ease-in-out ${panelBg} ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`p-6 pl-20 border-b flex items-center justify-between ${headerBg}`}>
            <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Rotunda
                </h1>
                <p className={`text-xs mt-1 ${subText}`}>Procedural Kinetic City</p>
            </div>
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-200 text-indigo-600 hover:bg-slate-300'}`}
            >
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Simulation Controls */}
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-sky-500 uppercase tracking-wider">Simulation</h2>
                <span className={`text-xs font-mono ${subText}`}>
                    {simState.isPlaying ? 'RUNNING' : 'PAUSED'}
                </span>
            </div>
            
            <div className="flex gap-2">
                <button 
                onClick={() => setSimState(s => ({ ...s, isPlaying: !s.isPlaying }))}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${simState.isPlaying ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30'}`}
                >
                {simState.isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Simulate</>}
                </button>
                <button 
                onClick={onReset}
                className={`p-3 rounded-lg hover:bg-opacity-80 transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}
                title="Reset View & Simulation"
                >
                <RotateCcw size={18} />
                </button>
            </div>

            <div className="space-y-2">
                <label className={`text-xs flex justify-between ${subText}`}>
                    <span>Time Scale (Speed)</span>
                    <span>{simState.timeScale.toFixed(0)}x</span>
                </label>
                <input 
                type="range" 
                min="1" 
                max="5000" 
                step="10"
                value={simState.timeScale}
                onChange={(e) => setSimState(s => ({ ...s, timeScale: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-slate-400/30 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
            </div>
            </div>

            {/* Global Appearance */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-sky-500" />
                    <h2 className="text-sm font-semibold text-sky-500 uppercase tracking-wider">Appearance</h2>
                </div>
                
                <div className={`p-4 rounded-lg border space-y-4 ${cardBg}`}>
                    <div className="space-y-2">
                        <label className={`text-xs flex justify-between ${subText}`}>
                            <span>Structure Opacity</span>
                            <span>{(globalOpacity * 100).toFixed(0)}%</span>
                        </label>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="1.0" 
                            step="0.05"
                            value={globalOpacity}
                            onChange={(e) => setGlobalOpacity(parseFloat(e.target.value))}
                            className="w-full h-1 bg-slate-400/30 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className={`text-xs flex justify-between ${subText}`}>
                            <span>Paint All Rings</span>
                        </label>
                        <div className="flex gap-2">
                            <input 
                                type="color" 
                                className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                                onChange={(e) => handleGlobalColorChange(e.target.value)}
                            />
                            <span className={`text-xs self-center ${subText}`}>Click to override all colors</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visibility Controls */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-500" />
                    <h2 className="text-sm font-semibold text-sky-500 uppercase tracking-wider">Bridge Levels</h2>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {Object.entries(visibleFloorGroups).map(([key, isActive]) => (
                        <button 
                            key={key}
                            onClick={() => setVisibleFloorGroups(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                            className={`px-2 py-3 rounded border text-xs font-medium transition-colors capitalize ${isActive ? 'bg-sky-500/20 border-sky-500 text-sky-500' : 'bg-transparent border-slate-500/30 text-slate-500'}`}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                {/* Utility Infrastructure Toggle */}
                <div className="mt-4">
                    <button
                        onClick={() => setShowUtilities(!showUtilities)}
                        className={`w-full px-4 py-3 rounded border text-sm font-medium transition-colors ${
                            showUtilities
                                ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                                : 'bg-transparent border-slate-500/30 text-slate-500 hover:border-indigo-500/50'
                        }`}
                    >
                        {showUtilities ? '✓' : ''} Umbilical Towers
                    </button>
                    {showUtilities && (
                        <p className="text-xs text-slate-500 mt-2">
                            Multi-passage rotary unions for water, sewage, and power transfer
                        </p>
                    )}
                </div>
            </div>

            {/* Rings Configuration */}
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-sky-500 uppercase tracking-wider">Structure Layers</h2>
                <button onClick={addRing} className="p-1 rounded hover:bg-slate-800 text-sky-400 transition-colors">
                    <Plus size={16} />
                </button>
            </div>

            <div className="space-y-4">
                {rings.map((ring, index) => (
                <div key={ring.id} className={`rounded-lg p-4 border relative group transition-colors ${cardBg}`}>
                    <div className="flex justify-between items-start mb-3">
                        <input 
                        value={ring.name}
                        onChange={(e) => handleUpdateRing(ring.id, 'name', e.target.value)}
                        className="bg-transparent text-sm font-medium focus:outline-none border-b border-transparent focus:border-sky-500 w-32"
                        />
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-slate-500/30" style={{ backgroundColor: ring.color }}></div>
                            <button onClick={() => removeRing(ring.id)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <label className={`block mb-1 ${subText}`}>Radius</label>
                            <input 
                            type="number" 
                            value={ring.outerRadius}
                            onChange={(e) => handleUpdateRing(ring.id, 'outerRadius', Number(e.target.value))}
                            className={`w-full rounded px-2 py-1 ${inputBg}`}
                            />
                        </div>
                        <div>
                            <label className={`block mb-1 ${subText}`}>Sections</label>
                            <input 
                            type="number" 
                            value={ring.sectionCount}
                            onChange={(e) => handleUpdateRing(ring.id, 'sectionCount', Number(e.target.value))}
                            className={`w-full rounded px-2 py-1 ${inputBg}`}
                            />
                        </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* AI Features */}
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-sky-500 uppercase tracking-wider">AI Consultant</h2>
                <button 
                    onClick={onGenerateLore}
                    className="w-full py-2 px-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors text-sm flex items-center justify-center gap-2"
                >
                    <Info size={14} /> Generate Project Lore
                </button>
                <div className="flex gap-2">
                    <input 
                        id="ai-query"
                        placeholder="Ask about structure..."
                        className={`flex-1 border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-sky-500 ${inputBg}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onAskAI(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                </div>
            </div>
        </div>
        </div>
    </>
  );
};