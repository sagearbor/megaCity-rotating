import React,{Component,lazy,Suspense,useEffect,useRef,useState} from 'react';
const Scene=lazy(()=>import('./MechanismScene'));
export type Mechanism='motion'|'water'|'sewage'|'boarding';
class Boundary extends Component<{children:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<div className="mechanism-empty"><h3>3D could not start on this device.</h3><p>The written mechanism and calculations remain available below. Try reloading with hardware acceleration enabled.</p></div>:this.props.children}}
const parts:Record<Mechanism,[string,string][]>={
 motion:[['deck','Moving structural module'],['wheels','Load-bearing bogies'],['rails','Fixed rails & foundations'],['drive','Drive reducer & traction wheel']],
 water:[['tank','Moving potable buffer'],['carriage','Synchronized utility carriage'],['coupler','Isolating coupling'],['pump','Fixed pump & flexible supply']],
 sewage:[['tank','Moving wastewater holding tank'],['carriage','Separate wastewater carriage'],['coupler','Isolating sewage coupling'],['pump','Fixed pumping / collection line']],
 boarding:[['deck','Continuously moving ring edge'],['bridge','Fixed bridge landing'],['person','Direct-step pedestrian path'],['threshold','Moving / fixed threshold']]
};
export default function MechanismViewer({system}:{system:Mechanism}){
 const [playing,setPlaying]=useState(true),[time,setTime]=useState(6),[speed,setSpeed]=useState(.5),[cutaway,setCutaway]=useState(true),[part,setPart]=useState(''),[reset,setReset]=useState(0),[visible,setVisible]=useState(true);
 const container=useRef<HTMLDivElement>(null);
 useEffect(()=>{setTime(6);setPart('');},[system]);
 useEffect(()=>{const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting));if(container.current)observer.observe(container.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(!playing||!visible)return;let id=0,last=0;const tick=(now:number)=>{if(last&&!document.hidden)setTime(t=>t+Math.min((now-last)/1000,.05));last=now;id=requestAnimationFrame(tick)};id=requestAnimationFrame(tick);return()=>cancelAnimationFrame(id)},[playing,visible]);
 const cycle=system==='boarding'?12:12/speed;
 const phase=(time%cycle)/cycle;
 const stage=system==='boarding'?'Continuous motion · no passenger platform braking':system==='motion'?'Wheel rolling and reducer rotation follow ring travel':phase<.25?'Carriage waits for the approaching port':phase<.75?'Carriage tracks port · coupling connected · flow enabled':'Valves isolated · coupling released · carriage returns';
 return <div className="mechanism-viewer" ref={container}>
 <div className="mechanism-toolbar"><div><span className="tag">LIVE 3D / CONCEPT CUTAWAY</span><p>Drag to orbit · scroll / pinch to zoom · choose a component</p></div><button className="button secondary" aria-pressed={playing} onClick={()=>setPlaying(!playing)}>{playing?'Pause':'Play'}</button><button className="button secondary" onClick={()=>setReset(v=>v+1)}>Reset view</button></div>
 <div className="mechanism-canvas" role="group" aria-label={`${system} interactive three-dimensional mechanical model`}><Boundary><Suspense fallback={<div className="mechanism-empty" role="status">Loading the 3D mechanism…</div>}><Scene system={system} time={time} speed={speed} cutaway={cutaway} selected={part} reset={reset} onSelect={setPart}/></Suspense></Boundary></div>
 <div className="mechanism-state"><span className="tag">{playing?'Playing at 1×':'Paused'}</span><strong>{stage}</strong></div>
 <div className="mechanism-controls"><label>Local travel speed<select value={speed} onChange={e=>{setSpeed(+e.target.value);setTime(0)}}><option value={.5}>Study baseline · 0.5 m/s / 1.12 mph</option><option value={.44704}>1 mph / 0.447 m/s</option><option value={1.34112}>3 mph / 1.341 m/s</option></select></label><label className="cutaway-toggle"><input type="checkbox" checked={cutaway} onChange={e=>setCutaway(e.target.checked)}/>Transparent deck / tanks</label><label>Scrub illustration<input type="range" min="0" max="99.9" step=".1" value={phase*100} onChange={e=>{setPlaying(false);setTime(+e.target.value/100*cycle)}}/></label></div>
 <div className="mechanism-parts">{parts[system].map(([id,label])=><button key={id} aria-pressed={part===id} onClick={()=>setPart(part===id?'':id)}>{label}</button>)}</div>
 <p className="caption">{system==='boarding'?'Direct-step concept requested by the designer. The ring keeps moving; no synchronized passenger platform is assumed. The crossing path is illustrative, not a gait or stability simulation. Sideways relative motion, edge gaps, handrails, entrapment and wheelchair access require testing.':'Geometry and timing are explanatory. Curvature is exaggerated using a 60 m teaching radius; components are not sized for a real ring. Utility-carriage acceleration, connection checks, hose fatigue and fluid transients are not simulated. Blue particles show flow direction, not fluid dynamics.'} Speed selection changes this illustration only, not the city baseline or journey model.</p>
 </div>;
}
