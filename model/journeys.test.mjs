import test from 'node:test';import assert from 'node:assert/strict';
import {destinations,home,journey,interceptFixed,separation,stopGeometry} from './journeys.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('30 unique destinations include local and far-side restaurants',()=>{assert.equal(destinations.length,30);assert.equal(new Set(destinations.map(d=>d.name)).size,30);});
test('same-ring trip invariant to rotation and departure time',()=>{const d=destinations[0];near(journey(d,{speed:0}).seconds,journey(d,{departureHours:12}).seconds);near(journey({...home,id:99}).seconds,0);});
test('interception catches stationary angular location with chosen walking direction',()=>{for(const start of [0,1,5])for(const target of [.1,2,6]){const r=1250,w=.5/r,u=1.3;const trip=interceptFixed(start,target,r,w,u);near(separation(start+(w+trip.direction*u/r)*trip.seconds,target),0);}});
test('stationary journeys independent of clock; phases affect rotating journeys',()=>{const d=destinations[5];near(journey(d,{speed:0}).seconds,journey(d,{speed:0,departureHours:15}).seconds);assert.ok(Math.abs(journey(d).seconds-journey(d,{departureHours:3}).seconds)>60);});
test('travel accounting and geometric distance lower bound',()=>{for(const d of destinations){const j=journey(d);near(j.seconds,j.first+j.radial+j.last+j.boarding);assert.ok(Number.isFinite(j.seconds)&&j.seconds>=0);near(j.walkMeters,(j.seconds-j.boarding)*1.3);}});
test('stop-phase walk stays below analytical half-pitch bound for all sampled phases',()=>{for(let phaseDegrees=0;phaseDegrees<360;phaseDegrees+=.5){const m=stopGeometry({radius:3950,phaseDegrees});assert.ok(m.worstWalk<=m.allAngleBound+1e-7);near(m.requiredHose,29);near(m.hoseMargin,1);}});
