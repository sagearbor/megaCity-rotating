import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { GroundInterfaceDiagram } from '../components/GroundInterfaceDiagram';
import { WaterSupplyDiagram } from '../components/WaterSupplyDiagram';
import { UtilitySection } from '../components/UtilitySection';
import { BoardingStudy } from '../components/BoardingStudy';
import { StopContinuity } from '../components/StopContinuity';
import { SystemsLab } from '../components/SystemsLab';
import { calculateScenario } from '../model/design.mjs';

const MechanismViewer=lazy(()=>import('../components/MechanismViewer'));
const study = calculateScenario();
type WasteMode = 'carriage' | 'trough' | 'pumped' | 'docking';
const wastewaterOptions: Record<WasteMode, {title:string; status:string; body:string; test:string}> = {
  carriage: {
    title: 'Traveling transfer carriage',
    status: 'Selected full-city research hypothesis',
    body: 'Local pressure sewers feed ring-side holding tanks. At several fixed stations, a carriage matches the local ring-edge speed, makes a verified dry-break connection, pumps during a limited travel stroke, isolates, disconnects and returns. Separate equipment and galleries serve potable water.',
    test: 'Prove connection under motion, solids passage, no-drip isolation, hose and seal fatigue, surge control, carriage reset, missed transfers, N+1 capacity and safe response to a jam.'
  },
  trough: {
    title: 'Covered gravity collector',
    status: 'Retained alternative · not selected',
    body: 'Short stationary drainage sectors could receive discharge from a moving ring and drain to accessible sumps. An entire level circular trough cannot be assumed to self-drain, and a brush seal is not a sanitary barrier.',
    test: 'Demonstrate liquid and aerosol containment, solids transport, cleaning access, odor extraction and operation across the full settlement and movement envelope.'
  },
  pumped: {
    title: 'Continuous rotary seal',
    status: 'Retained alternative · high development risk',
    body: 'A pressure network could cross the boundary through a purpose-designed continuous rotary connection. The old inner-edge multi-passage union never established a buildable load path, sanitary envelope or credible city-scale component.',
    test: 'Demonstrate seal diameter, solids passage, wear life, replaceability, isolation, surge response and continued service with one interface unavailable.'
  },
  docking: {
    title: 'Stopped docking transfer',
    status: 'Selected first demonstrator',
    body: 'A small test platform stops and interlocks at a dock, connects a sealed line, empties its tank and disconnects before motion resumes. It is the safest first experiment, but stopping a test rig does not solve continuous operation of a full inhabited ring.',
    test: 'Prove fail-closed valves, overflow prevention, alignment tolerance, missed-dock storage, emergency emptying and contamination control.'
  }
};

const operatingStates = [
  ['Normal', 'Distributed drives hold 0.5 m/s; utility carriages cycle', 'One drive, support or transfer bay may be isolated'],
  ['Controlled stop', `${study.parameters.controlledStopSeconds} s study ramp / ${study.controlledStopDistanceM.toFixed(0)} m kinematic distance`, 'Utilities switch to ring buffers; boarding interfaces lock'],
  ['Emergency stop', `${study.parameters.emergencyStopSeconds} s study ramp / ${study.emergencyStopDistanceM.toFixed(1)} m kinematic distance`, 'Independent braking zones act; bridges and couplers fail safe'],
  ['Maintenance', 'One structural module or guideway zone is unloaded and isolated', 'Temporary supports preserve a verified alternate load path'],
  ['Seismic / wind hold', 'Ring stops at any angle; guides and hold-downs must already provide restraint', 'Required: fixed emergency routes and local essential services at every stop angle']
];

export default function InfrastructurePage() {
  const validSections=['motion','water','sewage','power','boarding','stopped','interfaces'];
  const [activeSection,setActiveSection]=useState(validSections.includes(window.location.hash.slice(1))?window.location.hash.slice(1):'motion');
  useEffect(()=>{const update=()=>{const id=window.location.hash.slice(1);if(validSections.includes(id))setActiveSection(id)};window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update)},[]);
  const choose=(id:string)=>{setActiveSection(id);history.replaceState(null,'',`#${id}`);document.querySelector('.systems-nav')?.scrollIntoView({block:'start'});};
  const [wasteMode, setWasteMode] = useState<WasteMode>('carriage');
  const [motionPlaying, setMotionPlaying] = useState(true);
  const [waterPlaying, setWaterPlaying] = useState(true);
  const [wastePlaying, setWastePlaying] = useState(false);
  const item = wastewaterOptions[wasteMode];
  const maxWaterStation = Math.max(...study.ringSystems.map(r => r.waterTransferDesignM3s));
  const maxWasteStation = Math.max(...study.ringSystems.map(r => r.wastewaterTransferDesignM3s));

  return <main id="main-content" className="editorial mechanism-page">
    <header className="page-header systems-header">
      <p className="eyebrow">ROTUNDA / HOW THE CITY WORKS · REVISION 0.5</p>
      <h1>Inside the<br/><em>moving city.</em></h1>
      <p>The selected pre-feasibility architecture places articulated inhabited modules on distributed rail-and-bogie guideways. Regional utilities remain underground and stationary; buffered transfer stations cross each moving boundary.</p>
      <div className="decision-banner"><span>Working hypothesis</span><strong>Articulated modules + distributed guideways + ground-fed buffered utilities</strong><small>Selected for engineering study—not validated for construction</small></div>
    </header>
    <nav className="systems-nav" aria-label="Infrastructure sections">{[['motion','Motion'],['water','Fresh water'],['sewage','Wastewater'],['power','Power'],['boarding','Boarding'],['stopped','Stopped ring'],['interfaces','Handoff']].map(([id,label],i)=><a key={id} href={`#${id}`} aria-current={activeSection===id?'location':undefined} onClick={e=>{e.preventDefault();choose(id)}}><span>0{i+1}</span>{label}</a>)}</nav>

    <section id="motion" hidden={activeSection!=='motion'} className="section technical-section">
      {activeSection==='motion'&&<Suspense fallback={<p>Loading the 3D mechanism…</p>}><MechanismViewer system="motion"/></Suspense>}
      <div className="section-heading"><div><p className="eyebrow">01 / GROUND & ROTATION</p><h2>A railway under<br/>each neighborhood.</h2></div><button className="text-button" aria-pressed={motionPlaying} onClick={()=>setMotionPlaying(!motionPlaying)}>{motionPlaying?<Pause size={16}/>:<Play size={16}/>} {motionPlaying?'Pause motion':'Show motion'}</button></div>
      <div className="two-column"><div><p className="lead">Do not build one rigid, kilometre-scale lazy Susan.</p><p>Divide each ring into approximately 200 m structural modules. Carry every module on redundant wheel or roller bogies running on three preliminary circumferential rail bands. Separate guide rollers and hold-down devices resist lateral movement and uplift.</p><p>Distributed electric drives share traction around the circumference. A stationary concrete guideway spreads the reactions into site-specific foundations. All modules must share a coordinated angular speed and compatible joint motion. Inner and outer rail bands have different linear speeds; wheels across the width cannot be rigidly locked to equal rolling speed. Flexible joints between modules accommodate thermal movement and local guideway tolerances; inhabited rooms do not bridge those joints.</p></div><div className="brief-card"><span className="tag">Why this direction</span><h3>Faults stay local and components stay replaceable</h3><p>A single giant bearing, central shaft or inner-edge utility union would create an extreme common-cause failure. Segmentation allows one support, drive, rail zone or transfer station to be isolated—but only after engineers prove the alternate load and service paths.</p></div></div>
      <details className="handoff-detail"><summary>Open the functional flow diagram</summary><GroundInterfaceDiagram playing={motionPlaying}/></details>
      <details className="handoff-detail"><summary>Motion calculations and speed sensitivity</summary><SystemsLab kind="motion"/></details>
      <div className="result-grid compact-results"><div><strong>{study.articulatedModules}</strong><span>~200 m modules, calculated</span></div><div><strong>{study.bogiePositions.toLocaleString()}</strong><span>Preliminary bogie positions*</span></div><div><strong>3</strong><span>Rail bands / ring*</span></div></div>
      <p className="caption">*Counts are scoping variables, not selections. A structural mass model may require a different module length, rail count and support spacing.</p>
      <h3 style={{marginTop:38}}>Operating states must be designed together</h3>
      <div className="table-scroll"><table className="technical-table"><thead><tr><th>State</th><th>Mechanical response</th><th>Service / life-safety response</th></tr></thead><tbody>{operatingStates.map(row=><tr key={row[0]}>{row.map((cell,i)=><td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>
      <div className="callout"><p><strong>The stop distances are kinematics, not brake sizing.</strong> Force, torque, heat and foundation reactions cannot be calculated until a mass and resistance model exists. Wind, seismic movement, rail defects, differential settlement, a jammed module and simultaneous utility faults are mandatory load cases.</p></div>
    </section>

    <section id="water" hidden={activeSection!=='water'} className="section technical-section">
      {activeSection==='water'&&<Suspense fallback={<p>Loading the 3D mechanism…</p>}><MechanismViewer system="water"/></Suspense>}
      <div className="section-heading"><div><p className="eyebrow">02 / FRESHWATER</p><h2>Feed every ring<br/>from the ground.</h2></div><button className="text-button" aria-pressed={waterPlaying} onClick={()=>setWaterPlaying(!waterPlaying)}>{waterPlaying?<Pause size={16}/>:<Play size={16}/>} {waterPlaying?'Pause flow':'Animate flow'}</button></div>
      <p className="lead">The open rooftop-waterfall idea is retired. The selected study path is a sealed, distributed ground supply with ring-side storage.</p>
      <div className="table-scroll"><table className="technical-table option-table"><thead><tr><th>Route</th><th>Assessment</th><th>Decision</th></tr></thead><tbody>
        <tr><td>Top-fed / “pour from above”</td><td>An open transfer exposes water to contamination and weather. Lifting all supply above roof level adds avoidable head for lower-floor demand; ground-fed water still needs pumping to upper floors.</td><td><span className="status no">Not selected</span></td></tr>
        <tr><td>Hub-fed through concentric rings</td><td>Forces outer-ring supply across every inner moving boundary, multiplying common-cause interfaces and pipe lengths.</td><td><span className="status no">Not selected</span></td></tr>
        <tr><td>Ground-fed at each ring</td><td>Fixed loop mains in landscape corridors create one moving boundary per ring, multiple independent stations and direct maintenance access.</td><td><span className="status yes">Selected to test</span></td></tr>
      </tbody></table></div>
      <details className="handoff-detail"><summary>Open the functional flow diagram</summary><WaterSupplyDiagram playing={waterPlaying}/></details>
      <details className="handoff-detail"><summary>Transfer duty, capacity and pipe-bore calculations</summary><SystemsLab kind="water"/></details>
      <div className="two-column"><div><h3>How the transfer works</h3><p style={{marginTop:14}}>Six preliminary stations surround each ring. The carriage follows a curved guideway concentric with that ring; a straight tangential track would diverge from the coupling path. A transfer carriage accelerates to match the ring, verifies alignment, joins a sanitary dry-break connection, fills protected tanks while traveling alongside the ring, closes two isolation valves, drains the coupling cavity, disconnects and returns. Five stations must meet the modeled design flow with one unavailable.</p></div><div className="brief-card"><h3>Scale check</h3><p>The baseline implies {(study.waterM3Day/1000).toFixed(0)} ML/day and {(study.waterBufferM3/1000).toFixed(0)} ML of distributed 12-hour equalization storage. The most demanding preliminary station must transfer about {maxWaterStation.toFixed(2)} m³/s while connected. These figures exclude fire water, cooling, irrigation, freeboard and emergency reserve.</p></div></div>
      <div className="callout"><p><strong>Potable protection is the release criterion.</strong> Transfer bays require sanitary enclosures, positive identification, double isolation, backflow protection, leak detection, automated sampling points and physical separation from wastewater. The ring’s 60 m height also requires pressure zoning; 60 m of water creates approximately 5.9 bar of static head before friction and delivery pressure.</p></div>
    </section>

    <section id="sewage" hidden={activeSection!=='sewage'} className="section technical-section">
      {activeSection==='sewage'&&<Suspense fallback={<p>Loading the 3D mechanism…</p>}><MechanismViewer system="sewage"/></Suspense>}
      <p className="eyebrow">03 / WASTEWATER · PRIMARY FEASIBILITY GATE</p>
      <h2>Buffer the flow.<br/>Transfer it deliberately.</h2>
      <p>Short gravity branches within each structural module drain to isolated sumps. Ring-side pressure sewers and holding tanks separate normal building drainage from the moving transfer boundary. The fixed side then conveys flow to treatment and reuse facilities.</p>
      <p className="caption">The 3D model above shows the traveling carriage hypothesis. The alternatives below have functional diagrams only.</p><div className="utility-tabs" aria-label="Compare wastewater transfer options">{Object.entries(wastewaterOptions).map(([key, option])=><button key={key} aria-pressed={wasteMode===key} onClick={()=>setWasteMode(key as WasteMode)}>{option.title}</button>)}</div>
      <div className="section-heading" style={{marginBottom:0}}><div><span className="tag">{item.status}</span><h3 style={{marginTop:16}}>{item.title}</h3></div><button className="text-button" aria-pressed={wastePlaying} onClick={()=>setWastePlaying(!wastePlaying)}>{wastePlaying?<Pause size={16}/>:<Play size={16}/>} {wastePlaying?'Pause flow':'Animate flow'}</button></div>
      <details className="handoff-detail"><summary>Open the functional flow diagram</summary><UtilitySection mode={wasteMode} playing={wastePlaying}/></details>
      <details className="handoff-detail"><summary>Wastewater storage and outage calculations</summary><SystemsLab kind="sewage"/></details>
      <div className="two-column"><p>{item.body}</p><div className="brief-card"><h3>What the test must prove</h3><p>{item.test}</p></div></div>
      <div className="callout"><p><strong>The scale remains decisive.</strong> The default scenario implies {(study.wastewaterM3Day/1000).toFixed(0)} ML/day, a {study.peakWastewaterM3s.toFixed(1)} m³/s preliminary system peak and {(study.sewageStorageM3/1000).toFixed(0)} ML of six-hour average-flow storage. The most demanding preliminary carriage is about {maxWasteStation.toFixed(2)} m³/s. All values need freeboard, wet-weather, missed-transfer and outage allowances. <Link className="inline-link" to="/feasibility#calculator">Inspect the model <ArrowUpRight size={16}/></Link></p></div>
      <div className="table-scroll"><table className="technical-table"><thead><tr><th>Failure</th><th>Designed response</th><th>Evidence required</th></tr></thead><tbody>
        <tr><td>Missed connection</td><td>Close both sides; route next station; use local storage</td><td>Detection time, reserve duration and catch-up flow</td></tr>
        <tr><td>Coupler leak</td><td>Automatic isolation, contained drain, washdown and alarm</td><td>Leak rate, contamination envelope and recovery procedure</td></tr>
        <tr><td>Carriage jam</td><td>Ring controlled stop; neighboring bays remain isolated</td><td>Collision envelope, independent sensing and removal plan</td></tr>
        <tr><td>Power loss</td><td>Fail-closed valves, essential controls and bounded pumping</td><td>Black-start, overflow time and common-cause analysis</td></tr>
        <tr><td>Blockage / gas</td><td>Accessible cleanouts, duty/standby pumps and ventilation</td><td>Solids testing, hazardous-area and confined-space design</td></tr>
      </tbody></table></div>
    </section>

    <section id="power" hidden={activeSection!=='power'} className="section technical-section">
      <p className="eyebrow">04 / POWER, FIRE & MATERIALS</p><h2>All-electric baseline.<br/>Independent essential systems.</h2>
      <SystemsLab kind="power"/>
      <div className="two-column"><div><h3>Electricity</h3><p style={{marginTop:14}}>Keep regional substations fixed. Compare segmented inductive transfer with protected conductor rails and collectors at each ring. The baseline building estimate is {(study.averageElectricMW/1000).toFixed(1)} GW average and {(study.peakElectricMW/1000).toFixed(1)} GW preliminary peak; drives, pumps, transit and central plants are additional. Do not cross the moving boundary with natural gas in the baseline.</p></div><div><h3>Fire water and essential services</h3><p style={{marginTop:14}}>Use physically independent fire-water storage, pumps, distribution and fixed responder access. Ring-side essential power, communications and safe-state controls must survive a regional feed loss and a stopped ring. Domestic-water storage is not credited as fire reserve.</p></div></div>
      <div className="two-column" style={{marginTop:32}}><div className="brief-card"><h3>Waste & reuse</h3><p>Use enclosed, segregated collection rooms and scheduled sealed transfers. Treat greywater to its intended use and keep it separate from potable water. No untreated irrigation, sewer-gas energy or guaranteed reuse credit is assumed.</p></div><div className="brief-card"><h3>Fixed backbone</h3><p>Regional rail, treatment plants, main substations, emergency roads and service galleries stay fixed. Required, not yet demonstrated: a stopped ring must retain water, power, responder access and evacuation at any angle. Traveling carriages cannot be assumed to reach a port after an arbitrary stop; an independent emergency connection and reserve strategy is required.</p></div></div>
    </section>

    <section id="boarding" hidden={activeSection!=='boarding'} className="section technical-section">{activeSection==='boarding'&&<BoardingStudy/>}</section>
    <section id="stopped" hidden={activeSection!=='stopped'} className="section technical-section"><p className="eyebrow">05 / ARBITRARY-POSITION STOP</p><h2>Stop anywhere.<br/>Keep a route to fixed ground.</h2><StopContinuity/><Link className="inline-link" to="/journeys">Compare daily walking journeys and boarding →</Link></section>
    <section id="interfaces" hidden={activeSection!=='interfaces'} className="section technical-section">
      <p className="eyebrow">06 / ENGINEER HANDOFF</p><h2>Every interface<br/>has a release test.</h2>
      <div className="table-scroll"><table className="technical-table"><thead><tr><th>Package</th><th>Current definition</th><th>Next professional deliverable</th></tr></thead><tbody>
        <tr><td>Module / guideway</td><td>Articulated modules; three rail bands; distributed bogies</td><td>Mass model, global/local analysis, fatigue, derailment and uplift checks</td></tr>
        <tr><td>Guideway / ground</td><td>Continuous stationary foundation concept</td><td>Geotechnical model, settlement limits, seismic isolation and drainage</td></tr>
        <tr><td>Drive / brake / controls</td><td>Distributed traction and independent braking zones</td><td>Hazard analysis, torque/power/heat model, SIL allocation and witnessed stop tests</td></tr>
        <tr><td>Public transfer</td><td>Fixed stations with protected moving interfaces</td><td>Accessibility, capacity, clearance, entrapment, evacuation and responder strategy</td></tr>
        <tr><td>Potable water</td><td>Ground-fed loop + traveling sanitary couplers + ring buffers</td><td>Hydraulic model, water-quality plan and full-size endurance rig</td></tr>
        <tr><td>Wastewater</td><td>Sector sumps + pressure sewer + traveling dry-break carriage</td><td>Solids, surge, containment, gas, blockage and missed-transfer tests</td></tr>
        <tr><td>Fire / essential services</td><td>Independent ring-side reserves and fixed access</td><td>Performance-based fire strategy and common-cause failure assessment</td></tr>
      </tbody></table></div>
      <details className="handoff-detail"><summary>What must the next integrated demonstration show?</summary><p>A representative loaded module follows a curved guideway while a separate carriage synchronizes, connects, transfers, isolates and resets. Repeat with a missed port, failed sensor, leaking valve, blocked wastewater line and loss of power. Record loads, position error, pressure transients, leakage, flow and recovery time. Test a stopped ring at an arbitrary angle, not only at a convenient docking position.</p></details>
      <div className="callout"><p><strong>Construction readiness: no.</strong> This revision turns missing ideas into a coordinated hypothesis and test program. It still needs a host site, surveyed ground conditions, code basis, requirements, mass and load model, professional calculations, CAD/BIM coordination, full-scale component tests, cost plan, approvals and an independent safety case.</p></div>
      <Link to="/feasibility#commission" className="inline-link">Open the complete commission brief <ArrowUpRight size={18}/></Link>
    </section>
  </main>;
}
