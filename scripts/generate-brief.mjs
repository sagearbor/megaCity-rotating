import { readFileSync, writeFileSync } from 'node:fs';
import { baseline, calculateScenario, referenceLinks } from '../model/design.mjs';

const d = calculateScenario();
const fmt = (number, digits=1) => number.toLocaleString('en-US', {maximumFractionDigits:digits});
const assumptions = [
  ['Building coverage',baseline.siteCoverage*100,'% of ring-band area'],
  ['Residential share',baseline.residentialShare*100,'% of gross floor area'],
  ['Net efficiency',baseline.netEfficiency*100,'% of residential gross area'],
  ['Net residential area/person',baseline.residentialM2PerPerson,'m²/person'],
  ['Domestic water',baseline.waterLPerPersonDay,'L/person/day'],
  ['Nonresidential water allowance',baseline.nonResidentialWaterAllowance*100,'% added to domestic water'],
  ['Wastewater return',baseline.wastewaterReturn*100,'% of modeled water'],
  ['Wastewater peak factor',baseline.peakWastewaterFactor,'× average'],
  ['Wastewater storage',baseline.storageHours,'hours at average flow'],
  ['Water equalization buffer',baseline.waterBufferHours,'hours at average flow'],
  ['Target module length',baseline.moduleTargetLengthM,'m'],
  ['Rail bands',baseline.railBandCount,'per ring'],
  ['Support spacing',baseline.supportSpacingM,'m along each rail'],
  ['Water transfer bays',baseline.waterTransferStationsPerRing,'per ring'],
  ['Wastewater transfer bays',baseline.wastewaterTransferStationsPerRing,'per ring'],
  ['Controlled stop',baseline.controlledStopSeconds,'seconds'],
  ['Emergency stop',baseline.emergencyStopSeconds,'seconds'],
  ['Annual building energy',baseline.energyKwhPerM2Year,'kWh/m²/year'],
  ['Preliminary electric peak',baseline.peakElectricWPerM2,'W/m² gross'],
  ['Illustrative transfer efficiency',baseline.transferEfficiency*100,'%']
];
const results = [
  ['Envelope',d.envelopeKm2,'km²'],['Ring-band area',d.footprintM2/1e6,'km²'],
  ['Gross floor area',d.grossFloorM2/1e6,'million m²'],['Indicative residents',d.population/1e6,'million'],
  ['Water',d.waterM3Day/1000,'ML/day'],['Water equalization buffer',d.waterBufferM3/1000,'ML'],
  ['Wastewater',d.wastewaterM3Day/1000,'ML/day'],['Peak wastewater',d.peakWastewaterM3s,'m³/s'],
  ['Six-hour sewage storage',d.sewageStorageM3/1000,'ML'],['Articulated modules',d.articulatedModules,'count'],
  ['Preliminary bogie positions',d.bogiePositions,'count'],['Controlled-stop distance',d.controlledStopDistanceM,'m'],
  ['Emergency-stop distance',d.emergencyStopDistanceM,'m'],['Annual building electricity',d.annualEnergyGwh/1000,'TWh/year'],
  ['Average building power',d.averageElectricMW/1000,'GW'],['Preliminary building peak',d.peakElectricMW/1000,'GW'],
  ['Additional transfer loss at peak',d.transferLossMW/1000,'GW']
];

let brief = readFileSync('docs/briefing/FEASIBILITY_BRIEF.md','utf8');
brief += '\n## Reproducible baseline assumptions\n\nThese are project sensitivity assumptions, not local design standards.\n\n| Parameter | Value | Unit |\n|---|---:|---|\n' + assumptions.map(row => `| ${row[0]} | ${row[1]} | ${row[2]} |`).join('\n');
brief += '\n\n## Calculated baseline outputs\n\n| Quantity | Value | Unit |\n|---|---:|---|\n' + results.map(row => `| ${row[0]} | ${fmt(row[1],3)} | ${row[2]} |`).join('\n');
brief += '\n\n### Calculation relationships\n\nRing area = sum(pi × (outer radius² − inner radius²)). Gross floor area = ring area × coverage × floors. Population = gross floor area × residential share × net efficiency / net residential area per person. Water = population × domestic litres/person/day × (1 + nonresidential allowance) / 1,000. Wastewater = water × return fraction. Storage = daily flow × hours / 24. Module count = ceiling(circumference / target module length). Bogie positions = ceiling(circumference / support spacing) × rail bands. Candidate constant-deceleration stop distance = speed × stop time / 2. Transfer-bay flow includes one unavailable station and the stated connection duty. Annual electricity = gross floor area × annual intensity.\n\nThese exclude the hub, fire reserve, irrigation, process cooling, construction water, regional transit, central plants and ring-drive energy. Storage excludes freeboard and design reserve. Module, support, stop and station values are scoping variables—not equipment selections.\n';
brief += '\n## Ring schedule\n\n| Ring | Inner m | Outer m | Centerline m | Direction* | Period h | Modules* | Bogies* |\n|---|---:|---:|---:|---|---:|---:|---:|\n' + d.rings.map((ring,index) => `| ${ring.index+1} | ${ring.innerRadius} | ${ring.outerRadius} | ${ring.midRadius} | ${ring.index%2?'B':'A'} | ${fmt(ring.revolutionHours,3)} | ${d.ringSystems[index].moduleCount} | ${d.ringSystems[index].totalBogiePositions} |`).join('\n') + '\n\n*Alternating directions; absolute clockwise convention depends on view. Modules and bogies are scoping counts.\n';
brief += '\n## References and limits\n\n' + referenceLinks.map(reference => `- [${reference.title}](${reference.url}): ${reference.use}`).join('\n') + '\n\nReviewed September 7, 2026. These precedents do not validate a rotating megacity.\n';
writeFileSync('public/rotunda-feasibility-brief.md', brief);

const ringCsv = ['ring,innerRadiusM,outerRadiusM,centerlineRadiusM,widthM,heightM,floors,circumferenceM,bandAreaM2,centerlineSpeedMps,periodHours,moduleCount,bogiePositions', ...d.rings.map((ring,index) => [ring.index+1,ring.innerRadius,ring.outerRadius,ring.midRadius,baseline.ringWidthM,60,15,ring.circumferenceM,ring.areaM2,.5,ring.revolutionHours,d.ringSystems[index].moduleCount,d.ringSystems[index].totalBogiePositions].join(','))].join('\n') + '\n';
writeFileSync('public/rotunda-ring-schedule.csv', ringCsv);
const interfaceCsv = ['ring,moduleCount,averageModuleLengthM,bogiePositions,waterM3Day,waterBufferM3,waterTransferBays,waterDesignFlowPerBayM3s,wastewaterM3Day,wastewaterStorageM3,wastewaterTransferBays,wastewaterDesignFlowPerBayM3s', ...d.ringSystems.map(ring => [ring.index+1,ring.moduleCount,ring.averageModuleLengthM,ring.totalBogiePositions,ring.ringWaterM3Day,ring.waterBufferM3,baseline.waterTransferStationsPerRing,ring.waterTransferDesignM3s,ring.ringWastewaterM3Day,ring.ringWastewaterM3Day*baseline.storageHours/24,baseline.wastewaterTransferStationsPerRing,ring.wastewaterTransferDesignM3s].join(','))].join('\n') + '\n';
writeFileSync('public/rotunda-interface-schedule.csv', interfaceCsv);

const circles = d.rings.map(ring => `<circle cx="420" cy="410" r="${ring.midRadius/4100*340}" fill="none" stroke="#aabda8" stroke-width="${300/4100*340}"/><circle cx="420" cy="410" r="${ring.outerRadius/4100*340}" fill="none" stroke="#254934" stroke-width="0.7"/>`).join('');
const legend = d.rings.map((ring,index) => `<text x="825" y="${210+index*38}" font-size="16">R${index+1}: ${ring.innerRadius}–${ring.outerRadius} m</text>`).join('');
writeFileSync('public/rotunda-concept-plan.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#fff"/><g font-family="sans-serif" fill="#183a26"><text x="50" y="55" font-size="27">ROTUNDA / CONCEPT PLAN</text><text x="50" y="82" font-size="15">Revision 0.2 · 2026-09-07 · dimensional study only</text>${circles}<circle cx="420" cy="410" r="${500/4100*340}" fill="#254934"/><text x="420" y="415" text-anchor="middle" font-size="14" fill="#fff">HUB</text><path d="M80 790H760M80 780V800M760 780V800" fill="none" stroke="#183a26"/><text x="420" y="817" text-anchor="middle" font-size="18">8,200 m outer diameter</text><text x="825" y="160" font-size="20">Ring radii</text>${legend}<text x="825" y="550" font-size="16">Band width: 300 m</text><text x="825" y="581" font-size="16">Edge-to-edge gap: 150 m</text><text x="825" y="612" font-size="16">Hub radius: 500 m</text><text x="825" y="643" font-size="16">Ring height: 60 m / 15 floors</text><text x="50" y="860" font-size="14">Bands are planning envelopes. See separate functional interface drawing. Do not scale for construction.</text></g></svg>`);
writeFileSync('public/rotunda-concept-section.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="430" viewBox="0 0 1200 430"><rect width="1200" height="430" fill="white"/><g font-family="sans-serif" fill="#183a26"><text x="50" y="50" font-size="27">ROTUNDA / INDICATIVE RADIAL SECTION</text><text x="50" y="78" font-size="15">Revision 0.2 · dimensions in metres · vertical scale exaggerated</text><path d="M80 300H1120" stroke="#183a26"/><path d="M100 290V150H500V290M700 290V150H1100V290" stroke="#183a26" fill="#aabda8"/><path d="M500 218H700" stroke="#183a26" stroke-width="3"/><g font-size="18"><text x="300" y="200" text-anchor="middle">15 floors / 60 m</text><text x="900" y="200" text-anchor="middle">15 floors / 60 m</text><text x="600" y="195" text-anchor="middle">Fixed protected link*</text><text x="300" y="340" text-anchor="middle">300 m planning band</text><text x="600" y="340" text-anchor="middle">150 m fixed corridor</text><text x="900" y="340" text-anchor="middle">300 m planning band</text></g><text x="50" y="389" font-size="14">*Boarding, clearance and life-safety details remain unresolved. Bands do not represent solid building depth.</text><text x="50" y="414" font-size="14">Concept briefing only. Not a coordinated engineering drawing. Do not scale for construction.</text></g></svg>`);
const bogies = [360,700,1040].map(x => `<g><rect x="${x-75}" y="355" width="150" height="45" fill="#edf1eb" stroke="#183a26"/><circle cx="${x-38}" cy="430" r="28" fill="#fff" stroke="#ad6b3d" stroke-width="5"/><circle cx="${x+38}" cy="430" r="28" fill="#fff" stroke="#ad6b3d" stroke-width="5"/><path d="M${x-95} 466H${x+95}" stroke="#183a26" stroke-width="11"/></g>`).join('');
writeFileSync('public/rotunda-ground-interface.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="720" viewBox="0 0 1400 720"><rect width="1400" height="720" fill="#fff"/><g font-family="sans-serif" fill="#183a26"><text x="60" y="55" font-size="29">ROTUNDA / GROUND INTERFACE HYPOTHESIS</text><text x="60" y="84" font-size="16">Revision 0.2 · functional section · not sized for construction</text><path d="M280 125H1120" stroke="#ad6b3d" stroke-width="4"/><path d="M1100 112L1130 125L1100 138" fill="none" stroke="#ad6b3d" stroke-width="4"/><text x="700" y="115" text-anchor="middle" font-size="18">0.5 m/s tangential motion</text><rect x="180" y="170" width="1040" height="180" fill="#aabda8" stroke="#183a26" stroke-width="3"/><text x="700" y="235" text-anchor="middle" font-size="25">ARTICULATED INHABITED MODULE</text><text x="700" y="275" text-anchor="middle" font-size="17">Flexible joints between modules · no inhabited room crosses a joint</text><text x="700" y="310" text-anchor="middle" font-size="17">Distributed drive and braking zones</text>${bogies}<g font-size="16"><text x="360" y="502" text-anchor="middle">INNER RAIL</text><text x="700" y="502" text-anchor="middle">CENTER RAIL</text><text x="1040" y="502" text-anchor="middle">OUTER RAIL</text></g><rect x="130" y="540" width="1140" height="105" fill="#dce8dd" stroke="#183a26"/><text x="700" y="582" text-anchor="middle" font-size="23">STATIONARY GUIDEWAY + FIXED SERVICE GALLERY</text><text x="700" y="616" text-anchor="middle" font-size="17">Rail beams distribute reactions to site-specific continuous foundations or piles</text><text x="60" y="690" font-size="15">Working hypothesis: ~${d.articulatedModules} modules and ${d.bogiePositions.toLocaleString('en-US')} bogie positions. Counts are scoping assumptions; engineers must derive the load path.</text></g></svg>`);
console.log('Generated technical brief, schedules, plan, section and ground-interface drawing.');
