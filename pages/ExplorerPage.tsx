import React, { lazy, Suspense, useState, Component, ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Box, Map } from 'lucide-react';
import Masterplan from '../components/Masterplan';
const DetailedCity = lazy(() => import('./HomePage'));
class SceneBoundary extends Component<{children:ReactNode}, {failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div className="loading-page"><h2>3D is unavailable on this device.</h2><p>The interactive plan and full technical brief remain available. Switch to the plan above to continue.</p></div>:this.props.children;}
}
export default function ExplorerPage(){
 const [params, setParams] = useSearchParams();
 const selected = params.get('view');
 const view = selected === '3d' || selected === 'showcase' ? selected : 'plan';
 const setView = (next: string) => setParams({view:next}, {replace:true});
 return <main id="main-content"><header className="page-header"><p className="eyebrow">ROTUNDA / INTERACTIVE CITY EXPLORER</p><h1>Understand the city<br/><em>one ring at a time.</em></h1><p>Start with the scaled plan. Open the detailed 3D model to orbit, zoom and explore layers. Motion shows the proposed geometry, not a validated mechanical simulation.</p><div className="utility-tabs" aria-label="Explorer view"><button aria-pressed={view==='plan'} onClick={()=>setView('plan')}><Map size={16} style={{display:'inline',marginRight:8}}/>Interactive plan</button><button aria-pressed={view==='3d'} onClick={()=>setView('3d')}><Box size={16} style={{display:'inline',marginRight:8}}/>Whole city in 3D</button><button aria-pressed={view==='showcase'} onClick={()=>setView('showcase')}>Visit detailed neighborhood</button></div></header>
 {view==='plan'?<section className="section plan-section"><Masterplan/><div className="plan-story"><p className="eyebrow">AN EXPLORATION, NOT A CERTIFICATION</p><h2>Slow movement.<br/>Large implications.</h2><p>Rings turn in alternating directions at 0.5 m/s along their centerlines. One full revolution takes approximately 2.8 hours at the inner ring and 13.8 hours at the outer ring.</p><div className="numbered-note"><span>01</span><div><h3>Select a ring</h3><p>Inspect its dimensions and rotation period in the readout below the plan.</p></div></div><div className="numbered-note"><span>02</span><div><h3>Reveal the movement</h3><p>Animation runs at 200× real time. Pause it to study the geometry.</p></div></div><div className="numbered-note"><span>03</span><div><h3>Go deeper</h3><p>Use “Visit detailed neighborhood” above to go directly to the original Ring 2–3 showcase with its ground and rooftop layers enabled. The 3D model also includes experimental geometry controls and optional landscape, utilities and bridge layers. Those visual edits do not change the published baseline.</p></div></div><Link className="inline-link" to="/journeys">Compare 30 everyday walking journeys →</Link><br/><Link className="inline-link" to="/feasibility#calculator">Explore the demand model <ArrowUpRight size={18}/></Link></div></section>:<SceneBoundary><Suspense fallback={<div className="loading-page"><h2>Loading the detailed city…</h2><p>The 3D engine loads only when requested. Switch to the plan above at any time.</p></div>}><DetailedCity initialView={view==='showcase'?'showcase':'overview'}/></Suspense></SceneBoundary>}
 </main>;
}
