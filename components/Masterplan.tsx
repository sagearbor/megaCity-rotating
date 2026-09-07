import React, { useState } from 'react';
import { baseline, ringGeometry } from '../model/design.mjs';
import { Play, Pause } from 'lucide-react';

export default function Masterplan() {
  const [selected, setSelected] = useState(1);
  const [playing, setPlaying] = useState(false);
  const rings = ringGeometry();
  const active = rings[selected];
  const scale = 240 / rings.at(-1)!.outerRadius;
  return <div className="masterplan">
    <div className="plan-toolbar"><span className="eyebrow">PLAN / 1 : SCHEMATIC</span><button className="text-button" onClick={() => setPlaying(!playing)} aria-pressed={playing}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? 'Pause' : 'Animate'} · 200×</button></div>
    <svg className="plan-svg" viewBox="0 0 560 560" role="img" aria-label="Dimensioned concentric city plan: eight rings, 8.2 kilometres overall diameter. Select a ring using the buttons below.">
      <defs><pattern id="plan-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M 28 0 L 0 0 0 28" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".3" /></pattern></defs>
      <rect width="560" height="560" fill="url(#plan-grid)" />
      <g transform="translate(280 270)">
        <circle r={240} fill="var(--park)" />
        {rings.map((r, i) => <g key={i}>
          <circle r={r.midRadius * scale} fill="none" stroke={selected === i ? 'var(--accent)' : 'var(--ring)'} strokeWidth={baseline.ringWidthM * scale} opacity={selected === i ? 1 : .75} />
          <g className="plan-rotation" style={{ animationDuration: `${r.revolutionHours * 3600 / 200}s`, animationDirection: i % 2 ? 'reverse' : 'normal', animationPlayState: playing ? 'running' : 'paused' }}>
            <circle r={r.midRadius * scale} fill="none" stroke="var(--bg)" strokeWidth={baseline.ringWidthM * scale + 1} strokeDasharray={`1.5 ${2 * Math.PI * r.midRadius * scale / 28 - 1.5}`} />
            <circle cx={r.midRadius * scale} r="3.5" fill="var(--text)" />
          </g>
        </g>)}
        {Array.from({length: 12}, (_, i) => <line key={i} x1={baseline.hubRadiusM * scale} y1="0" x2="240" y2="0" stroke="var(--text)" strokeWidth="1" opacity=".55" transform={`rotate(${i * 30})`} />)}
        <circle r={baseline.hubRadiusM * scale} fill="var(--surface)" stroke="var(--text)" strokeWidth="1" />
        <text textAnchor="middle" y="4" fill="var(--text)" fontSize="11">HUB</text>
      </g>
      <path d="M40 525 H520 M40 519 V531 M520 519 V531" stroke="var(--muted)" fill="none" />
      <text x="280" y="548" textAnchor="middle" fill="var(--muted)" fontSize="13">8,200 m · outer diameter</text>
    </svg>
    <div className="ring-picker" aria-label="Select a ring">{rings.map((r, i) => <button key={i} onClick={() => setSelected(i)} aria-pressed={selected === i}>R{i + 1}</button>)}</div>
    <div className="plan-readout"><strong>Ring {selected + 1}</strong><span>{active.innerRadius.toLocaleString()}–{active.outerRadius.toLocaleString()} m radius</span><span>{active.revolutionHours.toFixed(1)} h / revolution</span></div>
    <p className="caption">Rings to scale. Radial links are indicative, not a bridge layout. Dots show motion; buildings are omitted. Rotation is exaggerated 200× and disabled by default.</p>
  </div>;
}
