import React from 'react';
export function UtilitySection({mode, playing}: {mode: 'carriage' | 'trough' | 'pumped' | 'docking', playing: boolean}) {
  const transfer = mode === 'carriage' ? 'Traveling dry-break transfer bay' : mode === 'trough' ? 'Covered collector sectors' : mode === 'pumped' ? 'Continuous rotary seal' : 'Stopped interlocked dock';
  return <div className={`schematic ${playing ? 'flow-playing' : ''}`}><div className="diagram-scroll"><svg viewBox="0 0 900 425" role="img" aria-label={`Wastewater transfer concept: ring drains enter a local sump, then ${transfer}, then a fixed sewer and treatment works. Emergency storage and maintenance access are required.`}>
    <defs><marker id="flow-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="var(--accent)"/></marker></defs>
    <rect x="20" y="20" width="860" height="160" rx="2" fill="var(--panel)"/>
    <rect x="20" y="220" width="860" height="165" rx="2" fill="var(--park)"/>
    <text x="42" y="48" fill="var(--accent)" fontSize="14" letterSpacing="2">MOVING RING</text>
    <text x="42" y="249" fill="var(--accent)" fontSize="14" letterSpacing="2">FIXED SERVICE CORRIDOR</text>
    <path d="M20 199H880" stroke="var(--muted)" strokeDasharray="4 6"/>
    <text x="44" y="195" fill="var(--muted)" fontSize="12">MOVING / FIXED BOUNDARY</text>
    <rect x="45" y="74" width="180" height="75" fill="var(--surface)" stroke="var(--line)"/><text x="62" y="101" fill="var(--text)" fontSize="17">Building drains</text><text x="62" y="128" fill="var(--muted)" fontSize="14">Traps + dedicated vents</text>
    <rect x="310" y="74" width="245" height="75" fill="var(--surface)" stroke="var(--accent)"/><text x="330" y="101" fill="var(--text)" fontSize="17">Local collection / sump</text><text x="330" y="128" fill="var(--muted)" fontSize="14">Level alarms + isolation</text>
    <path className="flow-path" d="M225 112H303" fill="none" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#flow-arrow)"/>
    <rect x="630" y="74" width="225" height="75" fill="var(--surface)" stroke="var(--line)"/><text x="648" y="101" fill="var(--text)" fontSize="17">Emergency storage</text><text x="648" y="128" fill="var(--muted)" fontSize="14">Sized for outage + reserve</text>
    <path d="M555 112H622" fill="none" stroke="var(--muted)" markerEnd="url(#flow-arrow)"/>
    <path className="flow-path" d="M430 149V270" fill="none" stroke="var(--accent)" strokeWidth="3" markerEnd="url(#flow-arrow)"/>
    <rect x="300" y="182" width="310" height="34" fill="var(--bg)" stroke="var(--accent)"/><text x="455" y="203" textAnchor="middle" fill="var(--text)" fontSize="14">{mode === 'carriage' ? 'Couple → travel → pump → isolate → reset' : mode === 'trough' ? 'Contained gravity discharge' : mode === 'pumped' ? 'Continuous pumped flow through a rotary seal' : 'Stop → connect → transfer → release'}</text>
    <rect x="310" y="277" width="275" height="65" fill="var(--surface)" stroke="var(--accent)"/><text x="325" y="302" fill="var(--text)" fontSize="16">{transfer}</text><text x="325" y="327" fill="var(--muted)" fontSize="13">Leak detection + service access</text>
    <rect x="640" y="277" width="215" height="65" fill="var(--surface)" stroke="var(--line)"/><text x="657" y="303" fill="var(--text)" fontSize="16">Fixed sewer network</text><text x="657" y="327" fill="var(--muted)" fontSize="13">To treatment / reuse plant</text>
    <path className="flow-path" d="M585 309H632" fill="none" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#flow-arrow)"/>
    <text x="42" y="408" fill="var(--muted)" fontSize="13">Functional section only · no pipe sizes, seal tolerances or structural details have been specified</text>
  </svg></div></div>;
}
