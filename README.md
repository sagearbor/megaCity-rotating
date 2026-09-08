# Rotunda

A public-facing proposal for a rotating, concentric city—paired with an explicit engineering feasibility brief. **Status: pre-feasibility concept, not a construction-ready design.**

## Quick start

```sh
npm ci
npm run dev
```

No API key is needed. The public site contains offline design notes; it does not expose credentials or claim AI engineering certification.

## Website

| Route | Purpose |
|---|---|
| `/` | About/vision overview, operating concept and development proposition |
| `/explore` | Lightweight interactive plan; optional detailed 3D explorer |
| `/infrastructure` | Ground/rotation mechanism, freshwater route, wastewater transfer and handoff register |
| `/feasibility` | Printable brief, assumptions calculator, risk register, stage gates and sources |

The hero is an AI-generated concept impression, not an exact model or a selected host site. The dimensioned drawings and `model/design.mjs` define the geometry.

## Design basis

Eight 300 m wide ring planning bands, a 500 m radius fixed hub and 150 m corridors, including the corrected hub-to-ring corridor. Overall diameter: 8.2 km. Fifteen floors per ring; 0.5 m/s centerline speed; alternating rotation. Full revolutions take about 2.8–13.8 hours.

All-electric is the working baseline. Revision 0.2 selects an engineering hypothesis for study: approximately 200 m articulated modules on distributed rail-and-bogie guideways; fixed ground loop mains; synchronized transfer carriages; ring-side water and wastewater buffers; and physically separate potable and sewage equipment. It replaces the old single giant rotary-union and rooftop-waterfall ideas. The system remains unvalidated.

## Professional handoff

- [Feasibility brief source](docs/briefing/FEASIBILITY_BRIEF.md)
- [Complete generated brief with assumptions, results and references](public/rotunda-feasibility-brief.md)
- [Ring schedule CSV](public/rotunda-ring-schedule.csv)
- [Mechanical and utility interface schedule](public/rotunda-interface-schedule.csv)
- [Dimensioned concept plan](public/rotunda-concept-plan.svg)
- [Indicative radial section](public/rotunda-concept-section.svg)
- [Ground-interface hypothesis](public/rotunda-ground-interface.svg)
- [Baseline and calculations](model/design.mjs)
- [Revision 0.2 engineering notes](docs/REVISION_0_2.md)
- [Engineer handoff checklist](docs/ENGINEER_HANDOFF_CHECKLIST.md)
- [Revision 0.1 review and software verification](docs/REVISION_0_1.md)

The website lets readers print/save the brief and export their scenario assumptions/results. The independent calculation tests verify geometry, units, sensitivities and allocation totals; they do not validate engineering feasibility.

## Build and verify

```sh
npm run check
npm test
npm run build
npm run preview
```

The build regenerates public briefing downloads from their source. Preserve `package-lock.json`. The 3D model loads only on request; the overview, interactive 2D plan and infrastructure pages do not depend on WebGL.

## Deployment

The original Google Cloud Run Docker/Cloud Build configuration is retained. A separate Sites deployment is configured by `.openai/hosting.json`; GitHub remains the source project.

For another static host, publish `dist` after `npm run build` and configure SPA fallback to `index.html`. For a subpath deployment, supply Vite `--base` and use the same router base. GitHub Pages additionally needs an appropriate SPA fallback strategy; no Pages deployment is claimed.

## Maintenance notes

`pages/HomePage.tsx` is the optional legacy 3D explorer. `App.tsx` is now a compatibility export of the active router. Experimental 3D geometry controls do not modify the published baseline or scenario calculator. Existing amenity and utility overlays are explicitly illustrative and need further coordination with the engineering concept.

Historical January/March implementation notes in `docs/` are retained with superseded notices. Their old “complete” wording referred to software tasks, not an engineered city.


## Stop continuity and daily journeys (revision 0.4)

See [the revision note](docs/REVISION_0_4.md) for the all-angle gallery bounds, emergency utility assumptions, 30-destination walking comparison and boarding animation. These are conditional models, not engineering certification. The new journey study is at `/journeys`; arbitrary stops are at `/infrastructure#stopped`.


## Mechanical 3D studies (revision 0.5)

[Revision 0.5](docs/REVISION_0_5.md) restores the designer’s direct-step boarding concept and replaces primary infrastructure flowcharts with orbitable mechanical 3D illustrations. Speed options are local comparisons; the city baseline remains 0.5 m/s.
