import test from 'node:test';
import assert from 'node:assert/strict';
import {baseline,calculateScenario,createCityRings} from './design.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<Math.max(1,Math.abs(b))*1e-10,`${a} != ${b}`);
test('geometry has a real hub corridor and all rings have 150 m gaps',()=>{
 const d=calculateScenario();assert.equal(d.rings.length,8);assert.equal(d.diameterKm,8.2);
 assert.equal(d.rings[0].innerRadius-baseline.hubRadiusM,150);
 d.rings.slice(1).forEach((r,i)=>assert.equal(r.innerRadius-d.rings[i].outerRadius,150));
 near(d.rings[0].revolutionHours,2*Math.PI*800/.5/3600);
});
test('unit conversions and annual/average energy relationship',()=>{
 const d=calculateScenario();near(d.waterM3Day,d.population*150*1.25/1000);
 near(d.peakWastewaterM3s,d.waterM3Day*.85/86400*2.5);
 near(d.sewageStorageM3,d.wastewaterM3Day/4);
 near(d.waterBufferM3,d.waterM3Day/2);
 near(d.averageElectricMW*8760,d.annualEnergyGwh*1000);
 near(d.peakElectricMW,d.grossFloorM2*50/1e6);
});
test('articulated guideway and transfer assumptions reconcile by ring',()=>{
 const d=calculateScenario();
 assert.equal(d.ringSystems.length,8);
 assert.equal(d.articulatedModules,d.ringSystems.reduce((sum,ring)=>sum+ring.moduleCount,0));
 assert.equal(d.bogiePositions,d.ringSystems.reduce((sum,ring)=>sum+ring.supportPositionsPerBand*baseline.railBandCount,0));
 near(d.ringSystems.reduce((sum,ring)=>sum+ring.ringWaterM3Day,0),d.waterM3Day);
 near(d.ringSystems.reduce((sum,ring)=>sum+ring.ringWastewaterM3Day,0),d.wastewaterM3Day);
 d.ringSystems.forEach(ring=>assert.ok(ring.averageModuleLengthM<=baseline.moduleTargetLengthM));
});
test('candidate stopping envelopes and N+1 transfer flows are explicit',()=>{
 const d=calculateScenario();
 near(d.controlledStopDistanceM,baseline.speedMps*baseline.controlledStopSeconds/2);
 near(d.emergencyStopDistanceM,baseline.speedMps*baseline.emergencyStopSeconds/2);
 const ring=d.ringSystems[0];
 near(ring.waterTransferDesignM3s,ring.ringWaterM3Day/86400*baseline.waterPeakFactor/((baseline.waterTransferStationsPerRing-1)*baseline.waterTransferDutyFraction));
 near(ring.wastewaterTransferDesignM3s,ring.ringWastewaterM3Day/86400*baseline.peakWastewaterFactor/((baseline.wastewaterTransferStationsPerRing-1)*baseline.wastewaterTransferDutyFraction));
});
test('sensitivity behaves independently: space, water, energy, storage and transfer',()=>{
 const a=calculateScenario();const b=calculateScenario({residentialM2PerPerson:70});
 near(b.population,a.population/2);near(b.waterM3Day,a.waterM3Day/2);near(b.peakElectricMW,a.peakElectricMW);
 near(calculateScenario({energyKwhPerM2Year:240}).averageElectricMW,a.averageElectricMW*2);
 near(calculateScenario({storageHours:12}).sewageStorageM3,a.sewageStorageM3*2);
 near(calculateScenario({transferEfficiency:1}).transferLossMW,0);
 near(calculateScenario({siteCoverage:0}).population,0);
});
test('ring transfer allocations reconcile to the published baseline',()=>{
 const r=createCityRings().slice(1);const d=calculateScenario();
 near(r.flatMap(r=>r.umbilicals).reduce((s,u)=>s+u.waterCapacityLitersPerDay,0),d.waterM3Day*1000);
 near(r.flatMap(r=>r.umbilicals).reduce((s,u)=>s+u.powerCapacityMW,0),d.peakElectricMW);
 r.forEach((ring,i)=>{const radius=(ring.innerRadius+ring.outerRadius)/2;near(Math.abs(ring.rotationSpeed)/60*Math.PI/180*radius,.5);assert.equal(Math.sign(ring.rotationSpeed),i%2?1:-1);});
});
test('rejects impossible parameter inputs instead of producing misleading results',()=>{
 for(const bad of [{transferEfficiency:0},{ringCount:0},{ringCount:1.5},{siteCoverage:1.1},{waterLPerPersonDay:-1},{storageHours:NaN},{residentialM2PerPerson:0},{railBandCount:1},{waterTransferStationsPerRing:1},{waterTransferDutyFraction:0},{moduleTargetLengthM:0},{emergencyStopSeconds:0}])assert.throws(()=>calculateScenario(bad),RangeError);
 assert.equal(calculateScenario({speedMps:0}).rings[0].revolutionHours,Infinity);
});
