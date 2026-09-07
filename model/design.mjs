// Rotunda concept baseline, revision 0.1. All demand rates are explicit study
// assumptions, not local code requirements, supplier ratings or predictions.
export const baseline = Object.freeze({
  ringCount: 8, hubRadiusM: 500, ringWidthM: 300, gapM: 150,
  floors: 15, floorHeightM: 4, speedMps: 0.5,
  siteCoverage: 0.6, residentialShare: 0.6, netEfficiency: 0.75,
  residentialM2PerPerson: 35, waterLPerPersonDay: 150,
  nonResidentialWaterAllowance: 0.25, wastewaterReturn: 0.85,
  peakWastewaterFactor: 2.5, energyKwhPerM2Year: 120,
  peakElectricWPerM2: 50, storageHours: 6, transferEfficiency: 0.93,
  moduleTargetLengthM: 200, railBandCount: 3, supportSpacingM: 25,
  waterBufferHours: 12, waterPeakFactor: 1.5,
  waterTransferStationsPerRing: 6, waterTransferDutyFraction: 0.5,
  wastewaterTransferStationsPerRing: 8, wastewaterTransferDutyFraction: 0.5,
  controlledStopSeconds: 120, emergencyStopSeconds: 30
});

export function ringGeometry(input = baseline) {
  return Array.from({ length: input.ringCount }, (_, index) => {
    const innerRadius = input.hubRadiusM + input.gapM + index * (input.ringWidthM + input.gapM);
    const outerRadius = innerRadius + input.ringWidthM;
    const midRadius = (innerRadius + outerRadius) / 2;
    return { index, innerRadius, outerRadius, midRadius,
      areaM2: Math.PI * (outerRadius ** 2 - innerRadius ** 2),
      circumferenceM: 2 * Math.PI * midRadius,
      revolutionHours: input.speedMps > 0 ? 2 * Math.PI * midRadius / input.speedMps / 3600 : Infinity };
  });
}

export function calculateScenario(overrides = {}) {
  const p = { ...baseline, ...overrides };
  for (const [key, value] of Object.entries(p)) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`Invalid ${key}`);
  }
  if (!Number.isInteger(p.ringCount) || p.ringCount < 1 || p.residentialM2PerPerson <= 0 || p.transferEfficiency <= 0) throw new RangeError('Invalid scenario');
  for (const key of ['railBandCount', 'waterTransferStationsPerRing', 'wastewaterTransferStationsPerRing']) {
    if (!Number.isInteger(p[key]) || p[key] < 2) throw new RangeError(`${key} must be an integer >= 2`);
  }
  for (const key of ['siteCoverage', 'residentialShare', 'netEfficiency', 'wastewaterReturn', 'transferEfficiency']) {
    if (p[key] > 1) throw new RangeError(`${key} must be <= 1`);
  }
  for (const key of ['waterTransferDutyFraction', 'wastewaterTransferDutyFraction']) {
    if (p[key] <= 0 || p[key] > 1) throw new RangeError(`${key} must be > 0 and <= 1`);
  }
  for (const key of ['moduleTargetLengthM', 'supportSpacingM', 'controlledStopSeconds', 'emergencyStopSeconds']) {
    if (p[key] <= 0) throw new RangeError(`${key} must be > 0`);
  }
  const rings = ringGeometry(p);
  const footprintM2 = rings.reduce((sum, r) => sum + r.areaM2, 0);
  const grossFloorM2 = footprintM2 * p.siteCoverage * p.floors;
  const population = grossFloorM2 * p.residentialShare * p.netEfficiency / p.residentialM2PerPerson;
  const waterM3Day = population * p.waterLPerPersonDay * (1 + p.nonResidentialWaterAllowance) / 1000;
  const wastewaterM3Day = waterM3Day * p.wastewaterReturn;
  const annualEnergyGwh = grossFloorM2 * p.energyKwhPerM2Year / 1e6;
  const peakElectricMW = grossFloorM2 * p.peakElectricWPerM2 / 1e6;
  const waterBufferM3 = waterM3Day * p.waterBufferHours / 24;
  const ringSystems = rings.map((ring) => {
    const ringGrossM2 = ring.areaM2 * p.siteCoverage * p.floors;
    const ringPopulation = ringGrossM2 * p.residentialShare * p.netEfficiency / p.residentialM2PerPerson;
    const ringWaterM3Day = ringPopulation * p.waterLPerPersonDay * (1 + p.nonResidentialWaterAllowance) / 1000;
    const ringWastewaterM3Day = ringWaterM3Day * p.wastewaterReturn;
    const moduleCount = Math.max(4, Math.ceil(ring.circumferenceM / p.moduleTargetLengthM));
    const supportPositionsPerBand = Math.ceil(ring.circumferenceM / p.supportSpacingM);
    return {
      index: ring.index,
      moduleCount,
      averageModuleLengthM: ring.circumferenceM / moduleCount,
      supportPositionsPerBand,
      totalBogiePositions: supportPositionsPerBand * p.railBandCount,
      ringWaterM3Day,
      waterBufferM3: ringWaterM3Day * p.waterBufferHours / 24,
      ringWastewaterM3Day,
      waterTransferDesignM3s: ringWaterM3Day / 86400 * p.waterPeakFactor /
        ((p.waterTransferStationsPerRing - 1) * p.waterTransferDutyFraction),
      wastewaterTransferDesignM3s: ringWastewaterM3Day / 86400 * p.peakWastewaterFactor /
        ((p.wastewaterTransferStationsPerRing - 1) * p.wastewaterTransferDutyFraction)
    };
  });
  return { parameters: p, rings, footprintM2, grossFloorM2, population, waterM3Day,
    wastewaterM3Day, peakWastewaterM3s: wastewaterM3Day / 86400 * p.peakWastewaterFactor,
    sewageStorageM3: wastewaterM3Day * p.storageHours / 24,
    waterStorageM3: waterBufferM3, waterBufferM3, ringSystems,
    articulatedModules: ringSystems.reduce((sum, ring) => sum + ring.moduleCount, 0),
    bogiePositions: ringSystems.reduce((sum, ring) => sum + ring.totalBogiePositions, 0),
    controlledStopDistanceM: p.speedMps * p.controlledStopSeconds / 2,
    emergencyStopDistanceM: p.speedMps * p.emergencyStopSeconds / 2,
    controlledDecelerationMps2: p.speedMps / p.controlledStopSeconds,
    emergencyDecelerationMps2: p.speedMps / p.emergencyStopSeconds,
    annualEnergyGwh, averageElectricMW: annualEnergyGwh * 1000 / 8760, peakElectricMW,
    transferLossMW: peakElectricMW * (1 / p.transferEfficiency - 1),
    diameterKm: rings.at(-1).outerRadius * 2 / 1000,
    envelopeKm2: Math.PI * (rings.at(-1).outerRadius / 1000) ** 2 };
}

export function createCityRings() {
  const p = baseline;
  const hub = { id: 'hub', name: 'Central Hub', innerRadius: 0, outerRadius: p.hubRadiusM,
    height: 100, rotationSpeed: 0, color: '#9faca9', floorCount: 25, sectionCount: 1,
    umbilicalCount: 0, umbilicals: [] };
  return [hub, ...ringGeometry().map((r) => {
    const sectionCount = Math.max(4, Math.round(r.circumferenceM / 400 / 2) * 2);
    const umbilicalCount = Math.max(4, Math.round(r.circumferenceM / 1500 / 2) * 2);
    const grossM2 = r.areaM2 * p.siteCoverage * p.floors;
    const occupants = grossM2 * p.residentialShare * p.netEfficiency / p.residentialM2PerPerson;
    const ring = { id: `r${r.index + 1}`, name: `Ring ${r.index + 1}`,
      innerRadius: r.innerRadius, outerRadius: r.outerRadius,
      height: p.floors * p.floorHeightM, floorCount: p.floors, sectionCount,
      rotationSpeed: p.speedMps / r.midRadius * 180 / Math.PI * 60 * (r.index % 2 ? 1 : -1),
      color: r.index % 2 ? '#c69368' : '#9fa7a0', umbilicalCount, umbilicals: [] };
    ring.umbilicals = Array.from({ length: umbilicalCount }, (_, i) => ({
      id: `${ring.id}-umb-${i}`, ringId: ring.id, anglePosition: i * 360 / umbilicalCount,
      innerRadius: r.innerRadius, height: ring.height,
      waterCapacityLitersPerDay: occupants * p.waterLPerPersonDay * (1 + p.nonResidentialWaterAllowance) / umbilicalCount,
      powerCapacityMW: grossM2 * p.peakElectricWPerM2 / 1e6 / umbilicalCount, status: 'standby'
    }));
    return ring;
  })];
}

export const referenceLinks = [
  { title: 'ASCE · Minimum design loads', url: 'https://www.asce.org/publications-and-news/asce-7', use: 'Framework for load combinations and site-specific hazards; it does not cover a city-scale moving structure.' },
  { title: 'IEC · Functional safety', url: 'https://www.iec.ch/functional-safety', use: 'Safety lifecycle and independent protection principles for electrical/electronic control systems.' },
  { title: 'EPA · Gravity sewers', url: 'https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P10053D9.TXT', use: 'Conventional drainage principles; does not validate a moving interface.' },
  { title: 'EPA · Force mains', url: 'https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P10099PU.TXT', use: 'Pressure conveyance, valves, surge control and cleaning.' },
  { title: 'EPA · Lift stations', url: 'https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=901U0X00.TXT', use: 'Pumping, reliability and emergency controls.' },
  { title: 'EPA · Water reuse', url: 'https://www.epa.gov/waterreuse/basic-information-about-water-reuse', use: 'Treatment matched to reuse purpose; no untreated greywater claim.' },
  { title: 'EPA · Cross-connection protection', url: 'https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=60000RF8.TXT', use: 'Backflow and cross-connection controls support keeping potable and nonpotable systems physically protected.' },
  { title: 'Deublin · Rotary unions', url: 'https://www.deublin.eu/', use: 'Industrial precedent only. The selected concept avoids treating one kilometre-scale union as proven.' },
  { title: 'Conductix · Wireless charging', url: 'https://www.conductix.co.uk/gb/energy-transmission/inductive-power-transfer-wireless-charging/wireless-charging/wirelesscharger-30', use: '3 kW product, up to 93% efficiency. Not evidence for gigawatt city supply.' },
  { title: 'Conductix · Transit conductor rails', url: 'https://www.conductix.de/en/de/energy-transmission/conductor-rails/non-insulated-transit-welded-cap-rails', use: 'Contact-based power transfer precedent; custom integration required.' }
];

export const gates = [
  { phase: '01', title: 'Establish the case', status: 'Current stage', detail: 'Select a site and compare a static circular city, a rotating district and the full rotating vision. Model travel demand, climate, land use and whole-life cost.', evidence: 'Independent feasibility brief and agreed success criteria' },
  { phase: '02', title: 'Prove the interfaces', status: 'Next investment', detail: 'Build a representative moving test rig for utilities, support, braking and accessible boarding. Test contamination, blockage, settlement, power loss and emergency stop.', evidence: 'Measured leakage, reliability, maintainability and safe failure results' },
  { phase: '03', title: 'Build a district demonstrator', status: 'Conditional', detail: 'Proceed only after independent review. Integrate one bounded rotating demonstrator with fixed services, protected access and a static fallback operating mode.', evidence: 'Approved design, operating evidence and costed expansion decision' },
  { phase: '04', title: 'Commission the masterplan', status: 'Conditional', detail: 'Develop site-specific architecture, structures, infrastructure, environmental studies, fire strategy and commercial phasing with the relevant authorities.', evidence: 'Coordinated professional design and authority approvals' }
];
