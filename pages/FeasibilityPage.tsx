import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Download, Printer, RotateCcw } from 'lucide-react';
import { baseline, calculateScenario, gates, referenceLinks } from '../model/design.mjs';
import Masterplan from '../components/Masterplan';

const fixed = calculateScenario();
const risks = [
  ['R01', 'Critical', 'Ring support & movement', 'Mass, guideway loads, fatigue, redundancy, settlement and thermal movement', 'Structural + geotechnical + mechanical'],
  ['R02', 'Critical', 'Emergency access & evacuation', 'Egress at any angle, power-loss access, fire compartments and responder routes', 'Fire + accessibility + transport'],
  ['R03', 'Critical', 'Potable-water transfer', 'Sanitary coupling, backflow, pressure zoning, buffer volume, water age and N+1 capacity', 'Water + public health + mechanical'],
  ['R04', 'Critical', 'Wastewater interface', 'Solids, leakage, corrosion, coupling wear, cleaning and alternate discharge', 'Wastewater + mechanical'],
  ['R05', 'Critical', 'Power & fire-water continuity', 'Independent supplies, common-cause faults, reserves and controlled stopping', 'Electrical + fire + controls'],
  ['R06', 'High', 'Motion value & comfort', 'Travel demand, transfer capacity, acceleration, vibration and value versus static', 'Transport + human factors'],
  ['R07', 'High', 'Building habitability', 'Daylight, ventilation, courtyards, privacy and thermal loads in 300 m bands', 'Architecture + building physics'],
  ['R08', 'High', 'Host-site suitability', 'Seismic, flood, heat, dust, water, ecology and regional infrastructure', 'Geotechnical + environment + planning'],
  ['R09', 'High', 'Whole-life economics', 'Construction, replacement cycles, maintenance labor, downtime and demand', 'Quantity surveying + economics']
];

function exportScenario(result: ReturnType<typeof calculateScenario>) {
  const rows = [
    ['type','metric','value','unit'],
    ...Object.entries(result.parameters).map(([key,value]) => ['assumption',key,String(value),'see technical brief']),
    ['result','population',String(result.population),'people'],
    ['result','grossFloorArea',String(result.grossFloorM2),'m2'],
    ['result','water',String(result.waterM3Day),'m3/day'],
    ['result','waterBuffer',String(result.waterBufferM3),'m3'],
    ['result','wastewater',String(result.wastewaterM3Day),'m3/day'],
    ['result','peakWastewater',String(result.peakWastewaterM3s),'m3/s'],
    ['result','sewageStorage',String(result.sewageStorageM3),'m3'],
    ['result','articulatedModules',String(result.articulatedModules),'count'],
    ['result','bogiePositions',String(result.bogiePositions),'count'],
    ['result','annualBuildingEnergy',String(result.annualEnergyGwh),'GWh/year'],
    ['result','averageBuildingPower',String(result.averageElectricMW),'MW'],
    ['result','peakBuildingPower',String(result.peakElectricMW),'MW'],
    ['result','peakTransferLoss',String(result.transferLossMW),'MW']
  ];
  const csv = rows.map(row => row.map(value => `"${value.replaceAll('"','""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8;'}));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'rotunda-concept-scenario.csv';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function FeasibilityPage() {
  const [residentialM2PerPerson, setArea] = useState<number>(baseline.residentialM2PerPerson);
  const [siteCoverage, setCoverage] = useState<number>(baseline.siteCoverage);
  const [waterLPerPersonDay, setWater] = useState<number>(baseline.waterLPerPersonDay);
  const [energyKwhPerM2Year, setEnergy] = useState<number>(baseline.energyKwhPerM2Year);
  const [storageHours, setStorage] = useState<number>(baseline.storageHours);
  const [transferEfficiency, setEfficiency] = useState<number>(baseline.transferEfficiency);
  const [sort, setSort] = useState({column:0, descending:false});
  const scenario = useMemo(() => calculateScenario({residentialM2PerPerson,siteCoverage,waterLPerPersonDay,energyKwhPerM2Year,storageHours,transferEfficiency}), [residentialM2PerPerson,siteCoverage,waterLPerPersonDay,energyKwhPerM2Year,storageHours,transferEfficiency]);
  const sorted = [...risks].sort((a,b) => a[sort.column].localeCompare(b[sort.column]) * (sort.descending ? -1 : 1));
  const reset = () => { setArea(35); setCoverage(.6); setWater(150); setEnergy(120); setStorage(6); setEfficiency(.93); };

  return <main id="main-content" className="editorial">
    <header className="page-header">
      <p className="eyebrow">ROTUNDA / CONCEPT BRIEF · REVISION 0.2</p>
      <h1>An ambitious proposition.<br/><em>A testable next step.</em></h1>
      <p>A briefing for host-city teams, architects, engineers and development partners. Revision 0.2 defines a mechanical and utility-transfer hypothesis; the immediate commission is still comparative feasibility and a bounded demonstrator.</p>
      <div className="hero-actions no-print"><button className="button primary" onClick={()=>window.print()}>Print / save brief <Printer size={18}/></button><a className="button secondary" href={`${import.meta.env.BASE_URL}rotunda-feasibility-brief.md`} download>Download technical brief <Download size={18}/></a></div>
      <nav className="page-subnav no-print" aria-label="Brief sections"><a href="#readiness">Readiness</a><a href="#baseline">Design basis</a><a href="#calculator">Scenario model</a><a href="#risks">Risk register</a><a href="#commission">Commission</a><a href="#sources">Sources</a></nav>
    </header>

    <section id="readiness" className="section technical-section">
      <p className="eyebrow">01 / WHERE THE PROJECT STANDS</p><h2>Ready to discuss.<br/>Ready to investigate.</h2>
      <div className="two-column"><div><p>The project now has a coherent spatial concept, an articulated guideway hypothesis, ground-fed utility topology, interactive diagrams, explicit demand assumptions and an initial failure-state register. It is suitable for briefing a professional team and commissioning feasibility work.</p><p>It does not yet have a selected site, validated moving structure, coordinated building design, tested couplers, approvals or a defensible capital estimate. A completion percentage would imply a defined project scope that does not yet exist.</p></div><div className="brief-card"><span className="tag">Pre-feasibility concept</span><h3>The current funding proposition</h3><p>Fund the evidence: compare a static city, rotating district and full Rotunda; shortlist sites; create mass, foundation and utility models; then build a representative guideway-and-transfer rig.</p></div></div>
      <div className="table-scroll"><table className="technical-table"><thead><tr><th>Handoff</th><th>Ready?</th><th>What it supports</th></tr></thead><tbody><tr><td>Concept presentation</td><td>Y</td><td>Communicating the vision and open questions</td></tr><tr><td>Feasibility commission brief</td><td>Y</td><td>Scoping professional studies; site and budget to agree</td></tr><tr><td>Validated schematic design</td><td>N</td><td>Needs engineering, site studies and integrated drawings</td></tr><tr><td>Permit / tender / construction set</td><td>N</td><td>Needs professional design, specifications and approvals</td></tr></tbody></table></div>
    </section>

    <section id="baseline" className="section technical-section">
      <p className="eyebrow">02 / THE DESIGN BASIS</p>
      <div className="two-column"><div><h2>One geometry.<br/>Explicit assumptions.</h2><p style={{marginTop:24}}>Eight 300 m ring bands, 150 m fixed corridors and a 500 m stationary hub produce an 8.2 km diameter. The moving structure is now represented as articulated modules on distributed guideways—not a single rigid turntable.</p><div className="table-scroll"><table className="technical-table" style={{minWidth:0}}><tbody>
        <tr><td>City envelope</td><td>{fixed.envelopeKm2.toFixed(1)} km²</td></tr><tr><td>Ring planning bands</td><td>{(fixed.footprintM2/1e6).toFixed(1)} km²</td></tr><tr><td>Building height / floors</td><td>60 m / 15 per ring</td></tr><tr><td>Hub</td><td>500 m radius / 100 m envelope</td></tr><tr><td>Band coverage</td><td>60% baseline; layout unresolved</td></tr><tr><td>Centerline speed</td><td>0.5 m/s · 1.8 km/h</td></tr><tr><td>Rotation period</td><td>2.8–13.8 hours / revolution</td></tr><tr><td>Moving structure</td><td>{fixed.articulatedModules} ~200 m modules*</td></tr><tr><td>Ground interface</td><td>3 rail bands / distributed bogies*</td></tr><tr><td>Freshwater route</td><td>Ground-fed / 6 stations per ring*</td></tr>
      </tbody></table></div></div><Masterplan/></div>
      <div className="callout"><p><strong>Rotation is not yet a transport benefit.</strong> At a fixed station, a uniformly distributed target sector could imply an average wait of about 1.4–6.9 hours. A transport model must test real journeys, walking, fixed transit, boarding and service interruptions.</p></div>
      <div className="two-column"><div className="brief-card"><h3>Mechanical hypothesis</h3><p>Articulated structural modules, multiple circumferential rails, redundant bogies, lateral guides, uplift restraint, distributed electric drives and independent braking zones.</p><Link className="inline-link" to="/infrastructure#motion">Inspect ground and rotation <ArrowUpRight size={16}/></Link></div><div className="brief-card"><h3>Utility hypothesis</h3><p>Fixed underground loop mains, synchronized transfer carriages, sanitary or no-drip couplers, ring-side buffers and separate pressure zones. Potable and wastewater systems never share equipment.</p><Link className="inline-link" to="/infrastructure#water">Inspect water transfer <ArrowUpRight size={16}/></Link></div></div>
      <p className="caption" style={{marginTop:18}}>*Scoping assumptions, not equipment selections. The website diagrams are functional—not coordinated engineering drawings.</p>
    </section>

    <section id="calculator" className="section technical-section">
      <p className="eyebrow">03 / TRANSPARENT SCENARIO MODEL</p><h2>Change the assumptions.<br/>See the implications.</h2>
      <p>This is a sensitivity model, not a population forecast or engineering sizing tool. The hub and regional infrastructure are excluded from building-demand totals.</p>
      <div className="assumption-controls" style={{marginTop:35}}>
        <label>Net residential area / person<output>{residentialM2PerPerson} m²</output><input aria-label="Net residential area per person" type="range" min="20" max="65" step="1" value={residentialM2PerPerson} onChange={event=>setArea(+event.target.value)}/></label>
        <label>Building coverage of ring bands<output>{Math.round(siteCoverage*100)}%</output><input aria-label="Building coverage" type="range" min=".3" max=".8" step=".05" value={siteCoverage} onChange={event=>setCoverage(+event.target.value)}/></label>
        <label>Domestic water / person / day<output>{waterLPerPersonDay} L</output><input aria-label="Daily domestic water" type="range" min="80" max="250" step="10" value={waterLPerPersonDay} onChange={event=>setWater(+event.target.value)}/></label>
        <label>Annual building electricity / gross area<output>{energyKwhPerM2Year} kWh/m²/year</output><input aria-label="Building energy intensity" type="range" min="60" max="300" step="10" value={energyKwhPerM2Year} onChange={event=>setEnergy(+event.target.value)}/></label>
        <label>Wastewater storage at average flow<output>{storageHours} hours</output><input aria-label="Wastewater storage hours" type="range" min="2" max="24" step="1" value={storageHours} onChange={event=>setStorage(+event.target.value)}/></label>
        <label>Hypothetical power transfer efficiency<output>{Math.round(transferEfficiency*100)}%</output><input aria-label="Transfer efficiency assumption" type="range" min=".85" max=".99" step=".01" value={transferEfficiency} onChange={event=>setEfficiency(+event.target.value)}/></label>
      </div>
      <div className="result-grid" aria-live="polite">
        <div><strong>{(scenario.population/1e6).toFixed(2)} M</strong><span>Indicative residents</span></div><div><strong>{(scenario.grossFloorM2/1e6).toFixed(1)} M m²</strong><span>Gross ring floor area</span></div><div><strong>{(scenario.waterM3Day/1000).toFixed(0)} ML/day</strong><span>Water incl. nonresidential allowance</span></div><div><strong>{(scenario.waterBufferM3/1000).toFixed(0)} ML</strong><span>12 h water equalization storage*</span></div><div><strong>{(scenario.wastewaterM3Day/1000).toFixed(0)} ML/day</strong><span>Wastewater · 85% return</span></div><div><strong>{scenario.peakWastewaterM3s.toFixed(1)} m³/s</strong><span>Wastewater peak · factor 2.5</span></div><div><strong>{(scenario.sewageStorageM3/1000).toFixed(0)} ML</strong><span>{storageHours} h sewage storage*</span></div><div><strong>{scenario.articulatedModules}</strong><span>~200 m ring modules*</span></div><div><strong>{scenario.bogiePositions.toLocaleString()}</strong><span>Preliminary bogie positions*</span></div><div><strong>{(scenario.averageElectricMW/1000).toFixed(2)} GW</strong><span>Average building electricity</span></div><div><strong>{(scenario.peakElectricMW/1000).toFixed(2)} GW</strong><span>Preliminary building peak</span></div><div><strong>{(scenario.transferLossMW/1000).toFixed(2)} GW</strong><span>Additional transfer loss at peak**</span></div>
      </div>
      <div className="hero-actions no-print"><button className="button secondary" onClick={()=>exportScenario(scenario)}>Export assumptions & results <Download size={18}/></button><button className="text-button" onClick={reset}><RotateCcw size={16}/> Reset baseline</button></div>
      <div className="callout"><p><strong>Calculation boundary:</strong> ring-band area × coverage × floors drives floor area. Population uses residential share, net efficiency and area per person. Water adds a 25% nonresidential allowance; wastewater is 85% of modeled water. Module and bogie counts divide circumference by explicit scoping intervals.</p><p className="caption">*Storage excludes freeboard, water-age limits, wet-weather inflow, fire reserve and emergency reserve. Counts are not structural selections. **The 93% power-transfer starting point is illustrative. Energy excludes ring drives, transit, central plants and transfer losses. No reuse or generation credits are assumed.</p></div>
    </section>

    <section id="risks" className="section technical-section">
      <p className="eyebrow">04 / INITIAL RISK REGISTER</p><h2>The questions that<br/>determine feasibility.</h2><p>Priorities express the consequence of an unresolved issue, not a quantified probability. Select a heading to sort.</p>
      <div className="table-scroll"><table className="technical-table"><thead><tr>{['ID','Priority','Issue','Required evidence','Lead disciplines'].map((heading,index)=><th key={heading} aria-sort={sort.column===index?(sort.descending?'descending':'ascending'):'none'}><button onClick={()=>setSort({column:index,descending:sort.column===index?!sort.descending:false})}>{heading} {sort.column===index?(sort.descending?'↓':'↑'):'↕'}</button></th>)}</tr></thead><tbody>{sorted.map(row=><tr key={row[0]}>{row.map((cell,index)=><td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
    </section>

    <section id="commission" className="section technical-section">
      <p className="eyebrow">05 / THE PROFESSIONAL COMMISSION</p><h2>Four gates.<br/>Evidence before expansion.</h2>
      <div className="roadmap" style={{marginTop:35}}>{gates.map(gate=><article key={gate.phase}><span className="phase">{gate.phase}</span><span className="tag">{gate.status}</span><h3>{gate.title}</h3><p>{gate.detail}</p><p style={{marginTop:16,color:'var(--text)'}}>{gate.evidence}.</p></article>)}</div>
      <h3 style={{marginTop:45}}>Required first-stage work packages</h3>
      <ul className="check-list"><li><strong>Urban & host-site case.</strong> Shortlist sites; establish water, energy, climate, land use, transport and environmental requirements; compare full rotation, a rotating district and a static circular city.</li><li><strong>Moving structure.</strong> Model mass and loads by module, guideway alternatives, fatigue, distributed drive/braking, derailment/uplift, seismic/wind response, settlement, thermal movement, jams and support replacement.</li><li><strong>Access & life safety.</strong> Design protected boarding, accessible routes, evacuation at arbitrary angles, fire-water reliability, responder access and stopped/jammed-ring operation.</li><li><strong>Utility demonstrator.</strong> Build a full-size guideway segment and synchronized carriage; test potable sanitary connection, wastewater solids, leakage, blockage, coupling wear, missed transfer, power loss and maintenance.</li><li><strong>Commercial & delivery study.</strong> Estimate land, enabling works, structures, machinery, utilities, buildings, commissioning, contingency, operations, renewals and decommissioning.</li></ul>
      <div className="two-column"><div className="brief-card"><h3>Prototype release criteria</h3><p>Engineers must set quantitative limits for leakage, settlement, flow, transfer power, braking, fatigue, reliability and maintenance before procurement. Tests must include faults and independently witnessed results.</p></div><div className="brief-card"><h3>Handoff package</h3><p>The website, technical brief, schedules, assumption model, diagrams and risk register can start a professional commission. Surveys, geotechnical reports, coordinated CAD/BIM, calculations and specifications come next.</p><a className="inline-link" href={`${import.meta.env.BASE_URL}rotunda-ring-schedule.csv`} download>Ring schedule <Download size={16}/></a><br/><a className="inline-link" href={`${import.meta.env.BASE_URL}rotunda-concept-plan.svg`} download>Dimensioned plan <Download size={16}/></a><br/><a className="inline-link" href={`${import.meta.env.BASE_URL}rotunda-ground-interface.svg`} download>Ground interface <Download size={16}/></a><br/><a className="inline-link" href={`${import.meta.env.BASE_URL}rotunda-interface-schedule.csv`} download>Interface schedule <Download size={16}/></a></div></div>
    </section>

    <section id="sources" className="section technical-section">
      <p className="eyebrow">06 / EVIDENCE & REFERENCES</p><h2>Precedents, with limits.</h2><p>These sources support conventional subsystem principles. None establishes the feasibility of a rotating megacity. All population, water, energy and component-spacing values are disclosed study assumptions.</p><div className="evidence-list">{referenceLinks.map(source=><div key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><p>{source.use}</p></div>)}</div><p style={{marginTop:30}}>Design baseline revision 0.2: September 7, 2026. Concept imagery does not define dimensions or a selected location.</p><Link className="inline-link" to="/infrastructure">Return to the systems study <ArrowUpRight size={18}/></Link>
    </section>
  </main>;
}
