# Revision 0.3 — systems exploration and 3D discovery

September 8, 2026. Draft implementation; engineering remains pre-feasibility.

- Persistent Motion / Fresh water / Wastewater / Power / Handoff navigation beneath the main navigation, active-section tracking and offset anchors.
- Motion sensitivity: centerline versus edge speed, revolution period and ideal stopping distance.
- Water sensitivity: ring selection, curved connected stroke, reset time, unavailable bays, connection duty, required flow and equivalent bore. Interactive transfer-cycle stages.
- Wastewater sensitivity: initially empty nominal buffer, sustained inflow multiplier and complete transfer outage. Makes average-flow storage versus peak-flow endurance explicit.
- Power sensitivity: delivered building peak held fixed; input and transfer heat vary with efficiency.
- Corrected radial-cutaway direction and clarified upper-floor pumping energy, differential rolling speed and arbitrary-angle stop limitations.
- Original Ring 2–3 showcase code retained. Direct `?view=showcase` entry, camera shortcut, ground and rooftop layers on, motion reset/paused and closer zoom. Explicit secondary-detail loading message.
- Numerical regression checks added to the existing model suite. Type check and production build required. No browser testing performed in this pass.

## Page coverage and remaining work

| Page / surface | This pass | Next work |
|---|---|---|
| How it works | Navigation, interactive sensitivities, physics corrections, handoff demonstration detail | Coupled time-domain tank/port schedule, carriage dynamics, pressure surge, loaded braking, stoppage and recovery model |
| City explorer | Direct showcase entry, camera shortcut, close zoom, visible detail loading | Profile on mobile; audit legacy bridge attachment geometry and utilities overlay against selected systems; replace unsupported amenity-performance tooltip claims |
| About / vision | Reviewed, no layout edits | Quantified benefits versus a static city, daily journeys, consistent evidence labels |
| Project brief | Reviewed, no layout edits | Couple interface sensitivities to scenario controls; mass/load model, cost ranges, site criteria, procurement and evidence register |
| Downloads | Existing briefing retained; revision note added | Reconcile full narrative and diagram set after engineering decisions are confirmed |

Sources for added calculations: OpenStax, Uniform Circular Motion, https://openstax.org/books/physics/pages/6-2-uniform-circular-motion ; US DOE, Improving Pumping System Performance, https://energy.gov/sites/prod/files/2014/05/f16/pump.pdf . Basic continuity and energy balances support the calculators; neither reference validates the proposed city-scale hardware.
