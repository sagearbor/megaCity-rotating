import React from 'react';

export function WaterSupplyDiagram({ playing }: { playing: boolean }) {
  return <div className={`schematic ${playing ? 'flow-playing' : ''}`}>
    <div className="diagram-scroll"><svg viewBox="0 0 1000 455" role="img" aria-label="Selected freshwater concept. Regional treated-water mains feed a stationary loop beneath each landscape corridor. Multiple separated transfer bays use synchronized carriages and sanitary dry-break couplers to fill protected ring-side buffer tanks. Booster pressure zones distribute water through the rotating ring.">
      <defs><marker id="water-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#65c8d0"/></marker></defs>
      <rect x="20" y="20" width="960" height="168" fill="var(--panel)"/>
      <rect x="20" y="230" width="960" height="175" fill="var(--park)"/>
      <text x="42" y="50" fill="var(--accent)" fontSize="14" letterSpacing="2">MOVING RING</text>
      <text x="42" y="260" fill="var(--accent)" fontSize="14" letterSpacing="2">STATIONARY GROUND NETWORK</text>
      <path d="M20 209H980" stroke="var(--muted)" strokeDasharray="5 6"/>
      <text x="42" y="205" fill="var(--muted)" fontSize="12">ONE CONTROLLED MOVING BOUNDARY PER RING</text>

      <rect x="675" y="75" width="255" height="76" fill="var(--surface)" stroke="#65c8d0"/>
      <text x="695" y="103" fill="var(--text)" fontSize="17">Ring-side buffer tanks</text>
      <text x="695" y="130" fill="var(--muted)" fontSize="14">12 h equalization assumption*</text>
      <rect x="360" y="75" width="235" height="76" fill="var(--surface)" stroke="var(--line)"/>
      <text x="380" y="103" fill="var(--text)" fontSize="17">Pressure zones</text>
      <text x="380" y="130" fill="var(--muted)" fontSize="14">Boosters + isolation</text>
      <path className="flow-path water-flow" d="M675 113H603" fill="none" stroke="#65c8d0" strokeWidth="3" markerEnd="url(#water-arrow)"/>
      <rect x="75" y="75" width="210" height="76" fill="var(--surface)" stroke="var(--line)"/>
      <text x="95" y="103" fill="var(--text)" fontSize="17">Ring distribution</text>
      <text x="95" y="130" fill="var(--muted)" fontSize="14">Metered sectors</text>
      <path className="flow-path water-flow" d="M360 113H293" fill="none" stroke="#65c8d0" strokeWidth="3" markerEnd="url(#water-arrow)"/>

      <rect x="665" y="180" width="275" height="58" fill="var(--bg)" stroke="#65c8d0"/>
      <text x="802" y="203" textAnchor="middle" fill="var(--text)" fontSize="15">Synchronized transfer carriage</text>
      <text x="802" y="224" textAnchor="middle" fill="var(--muted)" fontSize="12">couple → travel → fill → isolate → reset</text>
      <path className="flow-path water-flow" d="M802 180V158" fill="none" stroke="#65c8d0" strokeWidth="3" markerEnd="url(#water-arrow)"/>

      <rect x="690" y="292" width="240" height="72" fill="var(--surface)" stroke="#65c8d0"/>
      <text x="710" y="319" fill="var(--text)" fontSize="17">Six transfer bays / ring*</text>
      <text x="710" y="345" fill="var(--muted)" fontSize="13">N+1 study basis · sanitary enclosure</text>
      <path className="flow-path water-flow" d="M810 292V245" fill="none" stroke="#65c8d0" strokeWidth="3" markerEnd="url(#water-arrow)"/>
      <rect x="370" y="292" width="235" height="72" fill="var(--surface)" stroke="var(--line)"/>
      <text x="390" y="319" fill="var(--text)" fontSize="17">Fixed loop main</text>
      <text x="390" y="345" fill="var(--muted)" fontSize="13">Under each landscape corridor</text>
      <path className="flow-path water-flow" d="M605 328H682" fill="none" stroke="#65c8d0" strokeWidth="3" markerEnd="url(#water-arrow)"/>
      <rect x="70" y="292" width="230" height="72" fill="var(--surface)" stroke="var(--line)"/>
      <text x="90" y="319" fill="var(--text)" fontSize="17">Regional treated water</text>
      <text x="90" y="345" fill="var(--muted)" fontSize="13">Two independent feeds*</text>
      <path className="flow-path water-flow" d="M300 328H362" fill="none" stroke="#65c8d0" strokeWidth="3" markerEnd="url(#water-arrow)"/>
      <text x="42" y="433" fill="var(--muted)" fontSize="13">Potable transfer remains sealed, monitored and physically separated from wastewater transfer galleries.</text>
    </svg></div>
    <p className="caption">*Twelve hours, six bays and two regional feeds are explicit pre-feasibility assumptions—not code minima or equipment selections. Fire water, cooling and irrigation require separate supplies and storage.</p>
  </div>;
}
