# Revision 0.4 — arbitrary-stop continuity and daily journeys

September 8, 2026. Extension to the pre-feasibility study. Version 3 was published before this work; this extension is saved separately.

## Arbitrary-position stops

The former traveling-carriage architecture alone cannot guarantee service at an arbitrary stop angle. This extension proposes:

1. Independently supported, continuous fixed landing galleries beside ring edges.
2. Short module-side threshold bridges deployed only after independently verified zero speed and restraint.
3. Independent fixed exits from the gallery, with protected paths to ultimate discharge.
4. Separate emergency potable and wastewater outlets spaced along the gallery, used only with approved isolation, sanitation and deployment procedures.
5. Ring-side usable domestic storage, spare wastewater storage, separately sized fire water and essential energy.

No continuous gallery, crossing, coupler or evacuation mechanism is certified by this study. Fixed radial spines must clear the complete moving building envelope, such as above roofs with independent supports in fixed corridors. Long spans and vertical access remain unresolved. A bridge cannot simply intersect occupied moving buildings.

### Established conditional bounds

For a gallery radius R and N equally spaced, available fixed exits, the longest unobstructed gallery leg to the nearest exit is πR/N, independent of ring phase. With one isolated failed exit, the bound doubles. Blocked gallery sectors need alternate routes, not this bound. Neither result includes interior travel, stairs, pre-movement, queues, assisted evacuation or discharge distance.

With outlets at no more than 50 m spacing and a 4 m radial crossing, a conservative routed hose length is 25 + 4 = 29 m before slack/bends. The interactive reach check is only geometry. Actual connector access, pressure drop, bends, sanitation, crew response and simultaneous service capacity are separate release tests.

At 1.5× domestic demand, nominal 12-hour storage gives eight hours if fully available. At 2.5× wastewater inflow, nominal six-hour average-flow storage gives 2.4 hours if initially empty. The interface varies the credited reserve fraction and restoration delay. Fire-water and essential-power endurance are explicitly unknown rather than assigned invented capacities.

## Thirty daily destinations

New `/journeys` route includes exactly 30 illustrative locations: groceries, library, four restaurants, café, bakery, health services, schools, childcare, university, workspaces, gym, pool, sports, entertainment, community, worship, parcel/hardware shops, friend and rail station.

Home is on Ring 2, angle zero at 00:00. Routes use 32 equally spaced fixed grade-separated radial spines and assumed protected boarding availability. Each candidate route solves interception of a fixed station from the moving home ring, adds radial walking and configurable boundary allowances, then computes the destination's phase at boarding. It takes the fastest of those routes. Same-ring trips use the direct shorter arc and do not change with rotation.

Comparisons: a fixed 00:00 city layout, or freezing the current departure layout. The latter separates motion during travel from changes to relative departure locations. Table sorting, category filters, selectable destinations, departure slider, 24-hour animation and 15-minute-sample chart are included. No demand weighting, actual land-use survey, multimodal optimization or citywide benefit claim is implied. Routes exclude voluntary waiting, intermediate-ring shortcuts, queues, interiors and vertical travel.

Illustrative baseline far-side restaurant: approximately 58.1 min in the fixed 00:00 layout; sampled rotating minimum 8.7 min at 13:45 and maximum 50.7 min at 09:30. These depend on all stated assumptions and are not measured travel times or exact optimized departure times.

## Boarding animation

A local tangential kinematic illustration keeps the bridge fixed. The transfer platform matches a 0.5 m/s ring for 15 s, decelerates uniformly for 10 s, then stays stopped for 10 s while a pedestrian exits. Forward stroke = 7.5 + 2.5 = 10 m. The ring-side gate closes before deceleration; fixed-side opening occurs only at the stopped endpoint. Horizontal motion is calculated; vertical geometry and the pedestrian path are schematic. Platform return, queue capacity, access for wheelchairs, restraint and failure cases remain unproven. Playback is 3.5×, with pause and scrub.

## Evidence and tests

- US Access Board: https://www.access-board.gov/ada/guides/chapter-4-accessible-routes/
- NIST evacuation behavior: https://www.nist.gov/programs-projects/safety-building-occupants-project
- EPA emergency utility response: https://www.epa.gov/waterutilityresponse
- `npm test` includes numerical tests for interception, same-ring invariance, stationary comparisons, travel accounting and all-phase gallery bounds.
- Production build and TypeScript checks are run before saving. No browser QA was requested or performed.

## Next unresolved priorities

1. Design and test the independent gallery, moving-building clearance, threshold deployment and accessible upper-floor evacuation.
2. Simulate queues, pre-movement, smoke, unavailable exits and alternative protected paths.
3. Specify essential energy/fire-water reserves and emergency service manifold capacity, staffing and restoration times.
4. Cost and compare fixed spines/boarding with a static city and conventional transit.
5. Profile the 3D explorer and validate legacy bridge and infrastructure overlays against the new concepts.
