# Revision 0.5 — direct-step concept and mechanical 3D studies

September 8, 2026.

## Correction to passenger boarding

The designer's intended baseline is direct stepping between a slowly moving ring and a fixed bridge landing, analogous in intent to a moving walkway. The intermediate passenger platform introduced in revision 0.4 was an assistant-proposed alternative. It is removed from the selected boarding presentation; ordinary passenger boarding does not require the city or a passenger carriage to brake.

Keep the published city geometry's 0.5 m/s centerline speed. 1 mph is exactly 0.44704 m/s and 3 mph is 1.34112 m/s. The designer has not committed to 3 mph. The mechanical illustrations expose all three as local-speed comparisons without changing the demand or city geometry baseline.

KONE's TransitMaster 265 lists 0.5, 0.65 and 0.75 m/s speeds: https://www.kone.us/escalators-moving-walkways-autowalks/kone-transitmaster-265.html . Similar speed does not establish the safety of a lateral ring-edge transfer. Threshold clearance, moving-side handrails, entrapment, balance, mobility aids and emergency closing remain unresolved. Two oppositely moving rings also have relative edge speeds that add; the fixed bridge is a separate stationary interface.

The journey model now defaults to zero additional access allowance instead of inventing a 60-second passenger-platform cycle. Users can add an allowance. All other route idealizations remain explicit. The sample numbers recorded in revision 0.4 used 60 seconds per boundary and are historical, not outputs for the current default.

## Mechanical 3D

The main Motion, Fresh water and Wastewater illustrations are actual Three.js meshes rendered in an orbitable WebGL scene, not flowcharts or raster renders. Features include pause/play, camera reset, orbit/zoom, transparent structural surfaces/tanks, component selection, a phase scrubber and local-speed choices. Only the selected system mounts its 3D canvas, and off-screen/hidden animation stops.

- Motion: moving module, fixed curved tracks, rolling support wheels and an illustrative 2:1 reducer coupled coaxially to a traction wheel.
- Fresh water: fixed pump and flexible hose, traveling carriage, isolating connection and moving buffer tank. Flow markers follow the pipe curves toward the tank during connection.
- Wastewater: separate analogous equipment, with flow toward the fixed system; transfer stops before carriage reset.
- Boarding: continuously moving deck beside a fixed bridge and a schematic pedestrian directly approaching/crossing the threshold. No routine passenger-platform deceleration is included.

The teaching radius is 60 m to make curvature visible, not the real 800–3950 m ring-centerline radii. Local module, pipe and tank dimensions are illustrative. Utilities connect during the middle half of a repeating 12 m port-pitch illustration. Finite carriage acceleration, sanitary connection delays, structural stresses, real coupler internals, hose bend limits and fluid dynamics are not solved. Geared tooth shapes are schematic, not manufactured involute profiles. The pedestrian's path does not model gait, inertia or stability.

## Page structure

System navigation now chooses a single panel. The selected 3D mechanism appears before the detailed prose. Legacy functional diagrams and sensitivity calculators remain available in expandable sections. Wastewater alternatives retain their original functional diagrams; the 3D scene explicitly represents the carriage hypothesis only.

## Validation

TypeScript checks, existing numerical regression tests and production build. Browser visual testing was not requested, so no browser validation is claimed. Full-size engineering demonstration remains required before claiming safe operation.
