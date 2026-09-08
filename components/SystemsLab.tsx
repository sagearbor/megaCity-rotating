import React, {useState} from 'react';
import {calculateScenario} from '../model/design.mjs';
import {motionMetrics, transferMetrics, outageMetrics, powerMetrics} from '../model/interfaces.mjs';
const study=calculateScenario();
const n=(value:number,d=2)=>Number.isFinite(value)?value.toLocaleString(undefined,{maximumFractionDigits:d}):'—';
function Slider({label,value,min,max,step=1,unit='',change}:{label:string;value:number;min:number;max:number;step?:number;unit?:string;change:(n:number)=>void}) {
 return <label>{label}<output>{n(value)} {unit}</output><input type="range" min={min} max={max} step={step} value={value} onChange={e=>change(Number(e.target.value))}/></label>;
}
function Readout({items}:{items:[string,string][]}) {return <div className="result-grid compact-results">{items.map(([v,l])=><div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>}
export function SystemsLab({kind}:{kind:'motion'|'water'|'sewage'|'power'}) {
 const [ringIndex,setRingIndex]=useState(7);
 const [speed,setSpeed]=useState(.5);
 const [stop,setStop]=useState(120);
 const [stroke,setStroke]=useState(30);
 const [reset,setReset]=useState(60);
 const [unavailable,setUnavailable]=useState(1);
 const [hours,setHours]=useState(2);
 const [peak,setPeak]=useState(2.5);
 const [efficiency,setEfficiency]=useState(93);
 const [phase,setPhase]=useState(0);
 const ring=study.ringSystems[ringIndex];
 const geo=study.rings[ringIndex];
 const motion=motionMetrics({radius:geo.midRadius,innerRadius:geo.innerRadius,outerRadius:geo.outerRadius,speed,stopSeconds:stop});
 // Assumes an OUTER-edge port. Must follow the ring's curved path.
 const transfer=transferMetrics({flow:ring.ringWaterM3Day/86400*study.parameters.waterPeakFactor,stations:6,unavailable,stroke,speed:.5*geo.outerRadius/geo.midRadius,resetSeconds:reset,velocity:2});
 const waste=outageMetrics({averageFlow:ring.ringWastewaterM3Day/86400,storageHours:6,peakFactor:peak,outageHours:hours});
 const power=powerMetrics({deliveredMW:study.peakElectricMW,efficiency:efficiency/100});
 const stages=[['Match & verify','Carriage follows a concentric curved track. Speed, position and connection identity must agree before valves can open.'],['Connect & transfer','Both sides remain mechanically secured; the carriage travels with the port while pumps transfer fluid.'],['Isolate & release','Stop pumping, close both sides, depressurize and drain the coupling cavity, then verify disconnection.'],['Return & reset','Carriage returns with valves closed. Return time, acceleration, checks and sanitation reduce the usable connection duty.']];
 return <div className="systems-lab">
  <div className="lab-heading"><div><p className="eyebrow">CHANGE AN ASSUMPTION</p><h3>{kind==='motion'?'Motion & stopping':kind==='water'?'Can the transfer bay keep up?':kind==='sewage'?'How long before the buffer fills?':'Power delivered vs. heat lost'}</h3></div><span className="tag">Exploratory calculation</span></div>
  {kind!=='power'&&<div className="ring-picker" aria-label={`${kind} calculation ring`}>{study.rings.map((r:any,i:number)=><button key={i} aria-pressed={i===ringIndex} onClick={()=>setRingIndex(i)}>R{i+1}</button>)}</div>}
  {kind==='motion'&&<>
   <div className="assumption-controls lab-controls"><Slider label="Centerline speed" value={speed} min={0} max={1} step={.05} unit="m/s" change={setSpeed}/><Slider label="Idealized stopping ramp" value={stop} min={10} max={240} step={10} unit="s" change={setStop}/></div>
   <Readout items={[[speed===0?'Stopped':`${n(motion.periodHours)} h`,'Full revolution'],[`${n(motion.innerSpeed,3)} / ${n(motion.outerSpeed,3)}`,'Inner / outer edge speed · m/s'],[`${n(motion.stopDistance)} m`,'Stop distance · uniform deceleration']]}/>
   <p>Ring {ringIndex+1}: centerline radius {n(geo.midRadius,0)} m. All points share angular speed, so the outer rail travels faster than the inner rail. Each support band needs compatible rolling speed and coordinated steering.</p>
   <details><summary>Equations & limits</summary><p>ω = v/r; edge speed = ω × edge radius; T = 2πr/v; stopping distance = vt/2. Centripetal acceleration: {n(motion.acceleration,6)} m/s². Stop deceleration: {n(motion.deceleration,4)} m/s². Reaction time, jerk limits, gradients and brake faults are excluded. Low centripetal acceleration does not establish structural safety or low drive power: mass, rolling resistance and external loads remain unknown.</p><a className="inline-link" href="https://openstax.org/books/physics/pages/6-2-uniform-circular-motion">Circular-motion equations · OpenStax ↗</a></details>
  </>}
  {kind==='water'&&<>
   <div className="assumption-controls lab-controls"><Slider label="Connected travel stroke" value={stroke} min={10} max={120} step={5} unit="m" change={setStroke}/><Slider label="Return + all non-flow time" value={reset} min={30} max={240} step={10} unit="s" change={setReset}/><Slider label="Unavailable bays (of 6)" value={unavailable} min={0} max={5} change={setUnavailable}/></div>
   <Readout items={[[`${n(transfer.duty*100,1)}%`,'Time connected per cycle'],[`${n(transfer.perStation)} m³/s`,'Required flow / active bay'],[`${n(transfer.diameter)} m`,'Equivalent bore at assumed 2 m/s']]}/>
   <p>{n(transfer.connectedSeconds,1)} seconds connected at the outer-edge speed of {n(.5*geo.outerRadius/geo.midRadius,3)} m/s, then {reset} seconds to reset. {transfer.active} active bays must meet Ring {ringIndex+1}’s assumed 1.5× average water demand. The published 50% duty is an assumption, not a demonstrated cycle.</p>
   <div className="utility-tabs" aria-label="Transfer cycle stages">{stages.map(([title],i)=><button key={title} aria-pressed={phase===i} onClick={()=>setPhase(i)}>{i+1}. {title}</button>)}</div>
   <div className="cycle-stage" aria-live="polite"><strong>{stages[phase][0]}</strong><p>{stages[phase][1]}</p></div>
   <details><summary>Equations & limits</summary><p>Connected time = stroke / local edge speed. Duty = connected time / total cycle time. Bay flow = ring design flow / (active bays × duty). Equivalent bore D = √(4Q/πu) assumes one circular pipe at u = 2 m/s; parallel pipes may be required. This is not pipe sizing: pressure loss, surge, valves, sanitation and port scheduling are unresolved. A 30 m stroke follows an arc, not a straight line. Ring-side tanks must be connected so every sector can receive water between visits and during a stop.</p><p>Elevation pressure = ρgh: a 60 m rise is about 5.9 bar before losses. Pump input = ρgQH/η. Ground supply avoids lifting every litre to a roof header, but does not remove upper-floor lifting energy.</p><a className="inline-link" href="https://energy.gov/sites/prod/files/2014/05/f16/pump.pdf">Pumping-system fundamentals · US DOE ↗</a></details>
  </>}
  {kind==='sewage'&&<>
   <div className="assumption-controls lab-controls"><Slider label="Complete transfer outage" value={hours} min={0} max={12} step={.5} unit="h" change={setHours}/><Slider label="Inflow / average" value={peak} min={1} max={4} step={.1} unit="×" change={setPeak}/></div>
   <Readout items={[[`${n(waste.storage/1000)} ML`,'Nominal six-hour tank volume'],[`${n(waste.required/1000)} ML`,'Volume entering during outage'],[`${n(waste.hoursToFull)} h`,'Time to full · initially empty']]}/>
   <div className="storage-meter" role="meter" aria-label="Wastewater storage used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100,Math.round(waste.required/waste.storage*100))}><span style={{width:`${Math.min(100,waste.required/waste.storage*100)}%`}}/></div>
   <p className="capacity-result">{waste.remaining<0?`Capacity exceeded by ${n(-waste.remaining/1000)} ML.`:`Nominal spare volume: ${n(waste.remaining/1000)} ML.`} Six hours at average flow lasts only {n(waste.hoursToFull)} hours at {n(peak)}× flow.</p>
   <details><summary>Equations & limits</summary><p>Stored volume = average inflow × elapsed time × peak multiplier. Assumes an initially empty, fully usable tank, constant inflow and no outgoing transfer during the outage. Existing contents, freeboard, wet weather, uneven sector loading and emergency reserve reduce the available duration. Restore service with enough surplus transfer capacity to empty the backlog, not merely match new inflow.</p></details>
  </>}
  {kind==='power'&&<>
   <div className="assumption-controls lab-controls"><Slider label="End-to-end transfer efficiency" value={efficiency} min={80} max={99} step={1} unit="%" change={setEfficiency}/></div>
   <Readout items={[[`${n(study.peakElectricMW/1000)} GW`,'Delivered building peak'],[`${n(power.inputMW/1000)} GW`,'Required transfer input'],[`${n(power.lossMW,0)} MW`,'Heat / transfer losses at peak']]}/>
   <p>The same delivered building load is held constant. This sensitivity applies to either candidate technology; it is not a prediction that a city-scale inductive or conductor-rail system achieves this efficiency.</p>
   <details><summary>Equations & limits</summary><p>Input power = delivered power / efficiency; loss = input − delivered. Peak loads are scenario allowances, not a diversified electrical design. Drives, pumping, transit, treatment and cooling plants are additional. Segment and isolate feeds; prove collector continuity, insulation, fault interruption, heat removal and essential backup at arbitrary stop angles.</p></details>
  </>}
 </div>;
}
