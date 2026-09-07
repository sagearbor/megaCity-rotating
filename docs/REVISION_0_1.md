# Revision 0.1 — review record

Baseline inspected: `194d16085533e3c028e57171cea695c4b4a8f29d` (March 23, 2026).
Revision date: September 7, 2026.

## Product changes

- New architectural overview with optimized AI-generated concept image; no host site implied.
- Lightweight scaled interactive plan, on-demand 3D explorer, infrastructure options and printable professional brief.
- Six-input scenario calculator, CSV export, sortable risk register, geometry schedule and downloadable SVG drawings.
- Keyboard-operable navigation and controls, visible focus, native modal focus management, reduced-motion support, responsive layouts and print styles.
- Conventional-system references are separated from project assumptions and unsupported city-scale claims.

## Design corrections

- Added the missing 150 m hub-to-ring gap: outer radius 3,950 → 4,100 m; diameter 7.9 → 8.2 km.
- Consolidated geometry and demand assumptions in `model/design.mjs`; removed the duplicated obsolete app implementation.
- Replaced the unsupported 12 million population claim with a transparent occupancy model (4.144 million in the default scenario; not a forecast or target).
- Replaced 150 L/day/m² footprint water demand with an occupancy-based assumption and explicit nonresidential allowance.
- Replaced 0.05 MW/m² footprint with separate annual-energy and 50 W/m² gross-floor peak assumptions.
- Reconciled transfer-point allocations to baseline water and power totals; these are not equipment ratings.
- Removed assertions that open rooftop funnels are an adequate potable supply, a brush seal is a sanitary barrier, negative pressure guarantees no odor escape, a rotating city is proven energy storage, sewer gas is a credited energy source, or ring rotation proves short travel times.
- Continuous wastewater transfer remains a research issue. Buffered docking is proposed only as an initial small-rig demonstrator, not as a silent replacement for continuous full-city rotation.

## Loading and rendering changes

| Measure | Before | After | Interpretation |
|---|---:|---:|---|
| Initial JavaScript, minified | 1,518.82 kB | 206.60 kB | About 86% smaller |
| Initial JavaScript, gzip | 413.90 kB | 68.14 kB | About 84% smaller |
| Infrastructure WebGL canvases | 6 | 0 | SVG functional diagram replaces simultaneous 3D scenes |
| 3D initial download on landing | Required | Deferred | Loaded only after selecting detailed 3D |
| Bridge network | Multiple meshes per bridge | 3 instanced meshes | Deck, support and optional canopy batches |
| Default decorative layers | Enabled | Opt-in | Landscape and rooftop detail remain available |
| 3D pixel ratio upper bound | 2 | 1.5 | Limits GPU work on dense displays |
| Paused 3D rendering | Continuous | On demand | Also suspends continuous rendering in hidden tabs |

Sizes are Vite build output for the initial JavaScript bundle, excluding the new hero image, CSS and fonts. They are not measured load-time, frame-rate or Core Web Vitals improvements. The optional 3D bundle remains about 922 kB minified / 248 kB gzip. Actual device timings and visual/browser QA were not performed in this session.

A shared simulation clock keeps the ring, utility tower and featured rooftop group aligned when layers are enabled, paused or reset. The 3D model is still an illustrative massing study; detailed land-use geometry, all amenity attachments and the historical utility-route overlay are not fully coordinated engineering representations.

## Verification

- TypeScript check and production build.
- Five focused calculation tests covering geometry, dimensional conversions, sensitivities, utility allocation reconciliation and invalid inputs.
- Generated brief, schedule and drawings derive from the same baseline source.
- No browser API keys are injected or required. The former AI-consultant interface now returns explicitly identified offline design notes; live AI would require a separately secured server integration.

## Remaining work

Engineering: site selection, moving load path, drive/braking, foundations, thermal/settlement tolerances, validated utility interfaces, protected accessible transfers, evacuation and cost analysis.

Software: device performance profiling, browser/visual QA, refinement of detailed 3D land-use geometry and coordination of legacy amenity/utility layers. Static public content does not depend on those optional layers.

GitHub write access was unavailable. The original remote and Cloud Run deployment configuration are retained. A Sites review copy and an applyable Git patch preserve the completed revision without claiming the GitHub repository was updated.
