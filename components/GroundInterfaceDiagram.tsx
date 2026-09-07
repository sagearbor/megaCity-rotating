import React from 'react';

export function GroundInterfaceDiagram({ playing }: { playing: boolean }) {
  return <div className={`schematic mechanism-diagram ${playing ? 'mechanism-playing' : ''}`}>
    <div className="diagram-scroll"><svg viewBox="0 0 1000 470" role="img" aria-label="Concept section through a rotating city module. An articulated inhabited module is carried on three rail bands by redundant bogies above a stationary piled guideway and service gallery. Separate guide rollers resist lateral movement and hold-down devices resist uplift.">
      <defs>
        <marker id="motion-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0L7 4L0 8" fill="none" stroke="var(--accent)" strokeWidth="1.5"/></marker>
        <linearGradient id="module-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--ring)"/><stop offset="1" stopColor="var(--surface)"/></linearGradient>
      </defs>
      <text x="30" y="35" fill="var(--accent)" fontSize="14" letterSpacing="2">RADIAL SECTION / SELECTED WORKING HYPOTHESIS</text>
      <text x="970" y="35" textAnchor="end" fill="var(--muted)" fontSize="13">Not sized for construction</text>
      <path className="motion-stroke" d="M240 72H760" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#motion-arrow)"/>
      <text x="500" y="62" textAnchor="middle" fill="var(--text)" fontSize="15">0.5 m/s tangential motion</text>

      <path d="M145 220V112H855V220Z" fill="url(#module-fill)" stroke="var(--accent)" strokeWidth="2"/>
      <path d="M215 112V220M500 112V220M785 112V220" stroke="var(--line)" strokeDasharray="5 6"/>
      <text x="500" y="145" textAnchor="middle" fill="var(--text)" fontSize="21">Articulated inhabited module</text>
      <text x="500" y="175" textAnchor="middle" fill="var(--muted)" fontSize="14">Independent structural bays · flexible joints between modules</text>
      <text x="500" y="201" textAnchor="middle" fill="var(--muted)" fontSize="14">Buildings remain within one module; no room crosses a movement joint</text>

      {[270,500,730].map((x) => <g key={x}>
        <rect x={x-54} y="224" width="108" height="36" fill="var(--panel)" stroke="var(--text)"/>
        <circle cx={x-30} cy="274" r="18" fill="var(--bg)" stroke="var(--accent)" strokeWidth="3"/>
        <circle cx={x+30} cy="274" r="18" fill="var(--bg)" stroke="var(--accent)" strokeWidth="3"/>
        <path d={`M${x-62} 297H${x+62}`} stroke="var(--text)" strokeWidth="7"/>
      </g>)}
      <text x="270" y="326" textAnchor="middle" fill="var(--muted)" fontSize="13">Inner rail band</text>
      <text x="500" y="326" textAnchor="middle" fill="var(--muted)" fontSize="13">Center rail band</text>
      <text x="730" y="326" textAnchor="middle" fill="var(--muted)" fontSize="13">Outer rail band</text>
      <path d="M182 286V304H212" fill="none" stroke="var(--accent)" strokeWidth="2"/>
      <text x="176" y="278" textAnchor="end" fill="var(--text)" fontSize="13">Lateral guide + uplift restraint</text>

      <path d="M115 337H885V420H115Z" fill="var(--park)" stroke="var(--line)"/>
      <path d="M155 420V458M270 420V458M385 420V458M500 420V458M615 420V458M730 420V458M845 420V458" stroke="var(--muted)" strokeWidth="9"/>
      <text x="500" y="368" textAnchor="middle" fill="var(--text)" fontSize="18">Stationary guideway + fixed service gallery</text>
      <text x="500" y="396" textAnchor="middle" fill="var(--muted)" fontSize="14">Rail beams distribute load to a continuous foundation or piles selected for the host site</text>
      <text x="30" y="457" fill="var(--muted)" fontSize="13">Vertical load: module → bogies → rails → guideway → foundations → ground</text>
    </svg></div>
    <p className="caption">The concept uses many replaceable supports—not one 8 km bearing. Exact rail count, spacing and module length are calculation assumptions for scoping only. Engineers must derive them from mass, live load, fatigue, settlement, thermal movement, wind, seismic and replacement cases.</p>
  </div>;
}
