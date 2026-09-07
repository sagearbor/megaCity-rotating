import { RingConfig, AIAnalysisResult } from '../types';
// Public static site: never embed API keys in a browser bundle.
// A future authenticated server integration can replace these explicit offline notes.
export async function analyzeStructure(rings: RingConfig[], query: string): Promise<AIAnalysisResult> {
  const topic = /water|sewage|waste|plumb/i.test(query) ? 'Utilities' : /power|energy|electric|gas/i.test(query) ? 'Electricity' : 'City concept';
  const notes = {
    Utilities: 'The current study compares covered gravity collection, pumped sealed transfer and buffered docking. No city-scale moving interface is validated. Protected potable supply, fire water, wastewater containment and outage storage require separate engineering. Open the Infrastructure page for the full options study.',
    Electricity: 'The working baseline is all-electric. Compare segmented inductive transfer with protected conductor rails. Capacity, losses, grounding, protection and backup remain open. The ring is not credited as an energy-storage system. Inspect the Project brief for demand assumptions.',
    'City concept': `This editable visualization currently contains ${rings.filter(r => r.id !== 'hub').length} concept rings. It is not a structural simulation. Ring support, drive systems, protected access and emergency evacuation require professional studies. Use the Project brief to review the published baseline, initial risks and proposed commission.`
  };
  return {title:`${topic} · offline design note`, content:notes[topic], type:'logistical'};
}
export async function generateLore(_rings: RingConfig[]): Promise<string> {
  return 'Illustrative vignette, not a performance claim: morning light reaches a courtyard as a neighborhood slowly changes its view. People walk to school and shared gardens within their own ring. Regional journeys use the fixed transit network. At a protected interchange, movement is controlled by the transfer system. The experience depends on engineering that still needs to be developed and tested.';
}
