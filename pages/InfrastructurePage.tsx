import React, { useState } from 'react';
import { Play, Pause, Droplet, Zap, Wind, Wifi } from 'lucide-react';

interface InfrastructurePageProps {
  isDarkMode: boolean;
}

export default function InfrastructurePage({ isDarkMode }: InfrastructurePageProps) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId === selectedElement ? null : elementId);
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
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

        {/* Interactive Diagram Section */}
        <div className={`p-8 rounded-xl border mb-8 ${
          isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Water Distribution System</h2>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'
              }`}
              title={isAnimating ? "Pause Animation" : "Play Animation"}
            >
              {isAnimating ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>

          {/* Interactive SVG Diagram */}
          <div className="relative w-full h-[500px] flex items-center justify-center">
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full"
              style={{ maxHeight: '500px' }}
            >
              {/* Define gradients and animations */}
              <defs>
                {/* Water flow gradient */}
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="1" />
                </linearGradient>

                {/* Animated water flow */}
                {isAnimating && (
                  <>
                    <style>{`
                      @keyframes flow {
                        0% { offset-distance: 0%; }
                        100% { offset-distance: 100%; }
                      }
                      .water-particle {
                        animation: flow 3s linear infinite;
                      }
                      @keyframes pulse {
                        0%, 100% { opacity: 0.6; r: 4; }
                        50% { opacity: 1; r: 6; }
                      }
                      .pulse-animation {
                        animation: pulse 2s ease-in-out infinite;
                      }
                    `}</style>
                  </>
                )}
              </defs>

              {/* Ground Level - Stationary Hub */}
              <g id="ground-level">
                <rect
                  x="50"
                  y="350"
                  width="700"
                  height="100"
                  fill={isDarkMode ? '#334155' : '#cbd5e1'}
                  stroke={isDarkMode ? '#475569' : '#94a3b8'}
                  strokeWidth="2"
                  rx="8"
                />
                <text
                  x="400"
                  y="390"
                  textAnchor="middle"
                  className="font-semibold text-sm"
                  fill={isDarkMode ? '#e2e8f0' : '#1e293b'}
                >
                  Stationary Ground Infrastructure
                </text>
                <text
                  x="400"
                  y="410"
                  textAnchor="middle"
                  className="text-xs"
                  fill={isDarkMode ? '#94a3b8' : '#475569'}
                >
                  Water Reservoir & Treatment
                </text>
              </g>

              {/* Central Rotary Union */}
              <g
                id="rotary-union"
                onClick={() => handleElementClick('rotary-union')}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                {/* Union body */}
                <rect
                  x="350"
                  y="250"
                  width="100"
                  height="100"
                  fill={isDarkMode ? '#1e293b' : '#f1f5f9'}
                  stroke={selectedElement === 'rotary-union' ? '#06b6d4' : (isDarkMode ? '#64748b' : '#cbd5e1')}
                  strokeWidth={selectedElement === 'rotary-union' ? 4 : 2}
                  rx="4"
                />

                {/* Multi-passage channels */}
                <line x1="365" y1="270" x2="365" y2="330" stroke="#06b6d4" strokeWidth="3" />
                <line x1="385" y1="270" x2="385" y2="330" stroke="#fbbf24" strokeWidth="3" />
                <line x1="405" y1="270" x2="405" y2="330" stroke="#6b7280" strokeWidth="3" />
                <line x1="425" y1="270" x2="425" y2="330" stroke="#8b5cf6" strokeWidth="3" />

                <text
                  x="400"
                  y="300"
                  textAnchor="middle"
                  className="text-xs font-semibold"
                  fill={isDarkMode ? '#e2e8f0' : '#1e293b'}
                >
                  Rotary Union
                </text>

                {/* Rotation indicator */}
                {isAnimating && (
                  <circle
                    cx="400"
                    cy="280"
                    r="4"
                    fill="#06b6d4"
                    className="pulse-animation"
                  />
                )}
              </g>

              {/* Rotating Ring 1 */}
              <g
                id="ring-1"
                onClick={() => handleElementClick('ring-1')}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <ellipse
                  cx="400"
                  cy="150"
                  rx="200"
                  ry="40"
                  fill="none"
                  stroke={selectedElement === 'ring-1' ? '#06b6d4' : (isDarkMode ? '#64748b' : '#94a3b8')}
                  strokeWidth={selectedElement === 'ring-1' ? 4 : 2}
                  strokeDasharray="10,5"
                />
                <text
                  x="400"
                  y="155"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                  fill={isDarkMode ? '#e2e8f0' : '#1e293b'}
                >
                  Rotating Ring
                </text>
              </g>

              {/* Rotating Ring 2 */}
              <g
                id="ring-2"
                onClick={() => handleElementClick('ring-2')}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <ellipse
                  cx="400"
                  cy="80"
                  rx="250"
                  ry="30"
                  fill="none"
                  stroke={selectedElement === 'ring-2' ? '#06b6d4' : (isDarkMode ? '#64748b' : '#94a3b8')}
                  strokeWidth={selectedElement === 'ring-2' ? 4 : 2}
                  strokeDasharray="10,5"
                />
                <text
                  x="400"
                  y="85"
                  textAnchor="middle"
                  className="text-sm font-semibold"
                  fill={isDarkMode ? '#e2e8f0' : '#1e293b'}
                >
                  Outer Ring
                </text>
              </g>

              {/* Water pipes from ground to rotary union */}
              <g id="ground-pipes">
                <line
                  x1="365"
                  y1="350"
                  x2="365"
                  y2="330"
                  stroke="#06b6d4"
                  strokeWidth="4"
                />
                {isAnimating && (
                  <>
                    <circle r="3" fill="#06b6d4" opacity="0.8">
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path="M 365,350 L 365,330"
                      />
                    </circle>
                  </>
                )}
              </g>

              {/* Water distribution to Ring 1 */}
              <g id="ring1-pipes">
                <line
                  x1="365"
                  y1="270"
                  x2="365"
                  y2="150"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                {isAnimating && (
                  <circle r="3" fill="#06b6d4" opacity="0.8">
                    <animateMotion
                      dur="2.5s"
                      repeatCount="indefinite"
                      path="M 365,270 L 365,150"
                    />
                  </circle>
                )}
              </g>

              {/* Water distribution to Ring 2 */}
              <g id="ring2-pipes">
                <line
                  x1="365"
                  y1="270"
                  x2="300"
                  y2="80"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
                {isAnimating && (
                  <circle r="3" fill="#06b6d4" opacity="0.8">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path="M 365,270 L 300,80"
                    />
                  </circle>
                )}
              </g>

              {/* Distribution points */}
              <circle cx="365" cy="150" r="6" fill="#06b6d4" />
              <circle cx="300" cy="80" r="6" fill="#06b6d4" />
              <circle cx="365" cy="350" r="8" fill="#0891b2" />
            </svg>
          </div>

          {/* Detail Panel */}
          {selectedElement && (
            <div className={`mt-6 p-4 rounded-lg border-l-4 ${
              isDarkMode ? 'bg-slate-800/50 border-cyan-500' : 'bg-cyan-50 border-cyan-400'
            }`}>
              <h3 className="font-semibold mb-2">
                {selectedElement === 'rotary-union' && 'Multi-Passage Rotary Union'}
                {selectedElement === 'ring-1' && 'Inner Rotating Ring'}
                {selectedElement === 'ring-2' && 'Outer Rotating Ring'}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {selectedElement === 'rotary-union' &&
                  'The rotary union contains multiple sealed channels that allow water, power, sewage, and data to transfer between stationary and rotating components without leakage. Each channel rotates independently while maintaining continuous connection.'
                }
                {selectedElement === 'ring-1' &&
                  'The inner rotating ring receives fresh water through the rotary union and distributes it to buildings via an internal pipe network. Water pressure is maintained through the distribution system.'
                }
                {selectedElement === 'ring-2' &&
                  'The outer ring operates on the same principle, with water flowing through umbilical connections to reach all residential and commercial buildings on this level.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Utility Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UtilityCard
            icon={<Droplet className="w-6 h-6" />}
            title="Water System"
            color="cyan"
            isDarkMode={isDarkMode}
          >
            <p className="mb-3">Fresh water flows from ground reservoirs through umbilical towers, passing through rotary union seals into the rotating ring distribution network.</p>
            <ul className="space-y-1 text-sm">
              <li>• Pressurized distribution at 60-80 PSI</li>
              <li>• Redundant supply lines for reliability</li>
              <li>• Real-time flow monitoring</li>
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
            </ul>
          </UtilityCard>

          <UtilityCard
            icon={<Wind className="w-6 h-6" />}
            title="Sewage System"
            color="gray"
            isDarkMode={isDarkMode}
          >
            <p className="mb-3">Wastewater drains from buildings into ring collection systems, flows through rotary unions to ground treatment facilities.</p>
            <ul className="space-y-1 text-sm">
              <li>• Gravity-assisted drainage</li>
              <li>• Vacuum-assist backup system</li>
              <li>• Real-time blockage detection</li>
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

        {/* Technical Reference */}
        <div className={`mt-8 p-6 rounded-xl border ${
          isDarkMode ? 'bg-indigo-900/20 border-indigo-700' : 'bg-indigo-50 border-indigo-200'
        }`}>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span>Technical Reference</span>
          </h4>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Watch: <a
              href="https://www.youtube.com/watch?v=IOLcnCO3iOM"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline hover:no-underline ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}
            >
              Kadant Multi-Passage Rotary Union Overview
            </a>
            <span className="mx-2">|</span>
            Learn how rotary unions enable fluid and electrical transfer between stationary and rotating components.
          </p>
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
