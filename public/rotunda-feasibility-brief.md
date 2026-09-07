# Rotunda — concept feasibility brief

Revision 0.2 · September 7, 2026 · pre-feasibility

## Commission and intended use

Rotunda proposes eight inhabited concentric rings rotating around a stationary civic hub. The next investment is a comparative feasibility study and a bounded moving-interface demonstrator. This brief is suitable for scoping that professional commission. It is not a validated schematic design, a construction specification, an investment valuation or a commitment to a host site.

The public presentation is intended for host-city teams, architects, engineers and development partners. No government endorsement, supplier commitment, proven transport benefit, construction budget or completion date is claimed.

## What is established in this revision

- An explicit geometry and a reproducible, unit-labelled demand model.
- A 150 m corridor between the 500 m radius stationary hub and Ring 1. This corrects the zero-gap hub interface in the previous model and increases outer radius from 3,950 m to 4,100 m.
- Eight inhabited planning bands, each 300 m wide; seven additional 150 m inter-ring corridors.
- Fifteen floors per ring at 4 m floor-to-floor, giving a 60 m concept height. The 100 m high hub is an envelope only and is excluded from the demand model.
- Alternating rotation at 0.5 m/s at each ring centerline. A rigid ring has one angular speed; its inner and outer edges have different linear speeds.
- A selected moving-structure hypothesis: approximately 200 m articulated structural modules carried on multiple stationary rail bands by redundant bogies, with distributed drives, braking zones, guides and uplift restraint.
- A selected freshwater hypothesis: fixed ground loop mains, multiple synchronized transfer carriages, sanitary dry-break couplers, ring-side equalization storage and pressure zones.
- A selected wastewater hypothesis: local sumps and holding tanks feeding separate traveling no-drip transfer carriages; stopped docking remains the first-rig approach.
- An all-electric study baseline with fixed regional services and ring-side sector distribution.
- A public website, a scaled plan, indicative radial section, 3D geometry explorer, utility options diagram, assumptions calculator and initial risk register.

## Design decisions and alternatives

| ID | Decision | Status / rationale |
|---|---|---|
| D01 | Preserve the full rotating-city vision | Research concept; compare against a static circular city and a bounded rotating district |
| D02 | Keep the regional service network fixed | Fixed guideways, galleries, treatment plants and emergency routes; one controlled moving boundary per ring |
| D03 | All-electric buildings | Working baseline; no natural-gas feed across rotating boundaries |
| D04 | Feed potable water from the ground | Open rooftop waterfalls are retired; hub-fed supply would multiply moving interfaces for outer rings |
| D05 | Divide wastewater collection into sectors | Avoid assuming that a level circumferential collector drains itself |
| D06 | Test synchronized transfer carriages | Selected full-city research hypothesis; no continuous interface is approved for construction |
| D07 | Use buffered docking on the first small rig | Recommendation for a bounded demonstrator, not a change to whole-city continuous rotation |
| D08 | Require protected access and independent fixed transit | Casual stepping onto or off a moving building is not an accepted access strategy |
| D09 | Remove unsupported 12 million population claim | Replace with a sensitivity model; do not present the new result as a target |
| D10 | Give no flywheel, sewer-gas or reuse credits | Any contribution must be demonstrated in a separate energy/water balance |
| D11 | Use articulated modules on distributed guideways | Avoid one rigid ring, one giant bearing and one common-cause support failure |

## Geometry, habitability and transport

The 300 m ring width describes a planning band, not a solid building depth. Courtyard dimensions, daylight, ventilation, block porosity, fire compartments and privacy require architectural studies. The 60% ground coverage used in the demand model is an assumption; the old 3D extruded bands do not accurately represent that building coverage. The dimensioned SVG plan is the geometry reference; AI-generated hero imagery is illustrative only.

A revolution takes approximately 2.8 hours at the first ring and 13.8 hours at the eighth. If a person waits at a fixed station for a uniformly distributed target sector, expected wait to its next pass is about half a revolution. This limited calculation is not a network travel-time prediction, but it shows why rotation alone cannot be described as rapid transit. A transport model must include origins and destinations, walking, fixed transit, protected transfers, dwell time, peak queues, service disruptions and accessibility.

The old visualization generates bridges roughly every 80 m around each gap and spreads them among 12 levels. Those are illustrative links, not a validated bridge count, evacuation capacity or structural scheme. The lightweight plan shows twelve radial lines for legibility, explicitly not the detailed link layout.

## Structure and moving mechanisms

The selected hypothesis is not a single giant slewing bearing. Divide each inhabited ring into nominal 200 m structural modules. Keep buildings within one module and provide engineered movement joints between modules. Carry modules on preliminary inner, center and outer circumferential rail bands using redundant bogies; provide separate lateral guides and uplift restraint. Distribute electric traction and braking zones around each ring. Place the stationary guideway and maintenance galleries on foundations derived from the host-site ground model.

The model currently produces about 601 articulated modules and about 14,340 bogie positions using 25 m spacing along three rail bands. These values expose scale; they are not equipment selections. Commission structural, geotechnical and mechanical engineers jointly to establish:

1. Mass and load budget by sector: structural self-weight, permanent loads, use-dependent live loads, facade, services, water storage, moving machinery and maintenance equipment.
2. Load path: articulated modules, flexible structural joints, vertical bogies, lateral guides, uplift restraint, rail beams, stationary guideway, foundations and soil.
3. Settlement and thermal movement: a common tolerance envelope shared by structures, utilities and access systems. A seal gap cannot be specified independently of movement at its support.
4. Drive and braking: distributed torque, traction/adhesion or other propulsion choice, start/stop acceleration, jams, loss of one drive sector, emergency stop loads, wind/seismic actions and isolation procedures.
5. Replacement: unloading and swapping a support, drive or track section while maintaining a safe load path and service access.
6. Controls: redundant sensing, safe local response to communication failure, supervisory control, position verification and interlocks.

Candidate operating envelopes use 120 seconds for a controlled stop and 30 seconds for an emergency stop, giving idealized constant-deceleration distances of 30 m and 7.5 m from 0.5 m/s. These are human-factors and coordination assumptions, not brake sizing. Useful calculation relationships, not design results: tangential drive force F = rolling/resistance force + mass × tangential acceleration; mechanical power P = F × velocity; torque T = F × effective radius; idealized kinetic energy E = 0.5 × sum(m_i × v_i²). Required masses, rolling resistance and wind forces are not established. Regenerative braking is not credited as city-scale energy storage.

## Wastewater — primary utility study

Separate building drainage, ring-side collection, the moving transfer boundary and the fixed downstream sewer.

### Selected hypothesis: traveling transfer carriage

Short gravity branches within each structural module drain to isolated sumps. Ring-side pressure sewers feed distributed holding tanks. At preliminary fixed transfer stations, a dedicated wastewater carriage matches ring speed, verifies alignment, joins a no-drip solids-rated coupling, pumps during a bounded travel stroke, isolates both sides, drains the coupling cavity, disconnects and resets. Eight stations per ring are a study assumption; seven must meet the modeled peak transfer duty with a 50% connection duty fraction. Potable water uses separate stations, galleries and equipment.

This arrangement avoids a kilometre-scale rotary seal and an exposed continuous trough, but it introduces unproven moving couplers, hoses, valves and carriage controls at very high flow. It must be tested for missed connection, leakage, solids, surge, blockage, fatigue, collision, jam, power loss, gas control and catch-up capacity.

### Option A: covered gravity collector

Use short, sloped stationary collection sectors with sumps, access and an engineered containment envelope. A rotating discharge passes over the receiving zone. Do not assume an entire level closed loop can provide a continuous downhill path. For illustration only, a 100 m run at 1% slope requires 1 m of fall; this is not a selected design slope. An engineer must determine solids transport, invert levels, capacities and access.

The old 5 mm gap with a brush seal and negative pressure is not a validated sanitary barrier. Demonstrate containment of liquid and aerosols across actual motion, settlement, thermal movement and faults. Extraction alone does not establish leak tightness or prevent odors under every operating condition.

### Option B: pumped sealed transfer

Use local sumps and a pressure network to a purpose-designed moving interface. A conventional force main addresses conveyance, not the rotary connection. Assess solids passage, seal wear, surge, isolation, redundant pumps/feeds, cleaning and maintainability. Off-the-shelf industrial rotary unions are precedents, not proof that a kilometre-scale ring interface can be sealed.

### Option C: buffered docking transfer

For the first test rig, stop a small platform, verify alignment, engage an interlocked sealed connection, transfer waste, isolate and disconnect before allowing movement. Size storage for missed transfers and credible outages. This is recommended as an initial contained demonstrator. Extending it to a whole ring changes the operating model and must be separately justified; do not imply fixed hoses can serve unlimited rotations.

### Required safeguards for all options

- Traps and a properly engineered vent network within buildings; separate assessment of extraction at collectors.
- Independent high-level detection, overflow prevention, secondary containment and accessible isolation.
- Maintainable alternate discharge or a demonstrated storage/shutdown strategy.
- Corrosion, hazardous gas, confined-space and occupational access assessment by relevant engineers.
- Peak-flow, wet-weather/infiltration and recovery scenarios; reserve and freeboard beyond the illustrative average-flow storage.
- Treatment plant capacity, discharge/reuse route and applicable local requirements.

The default scenario has about 660 ML/day of wastewater, a 19.1 m³/s preliminary peak and 165 ML of distributed six-hour storage at average flow. These quantities make a city-scale moving wastewater network a central feasibility gate.

## Freshwater and firefighting

The selected topology is ground-fed. Two or more independent regional treated-water feeds supply fixed loop mains in the stationary landscape corridors. Six preliminary transfer bays surround each ring. A synchronized carriage matches ring speed, confirms identity and alignment, makes a sanitary dry-break connection, fills protected ring-side tanks while traveling, closes double isolation, drains the coupling cavity, disconnects and resets. Five stations must meet the modeled duty with one unavailable.

The baseline 12-hour equalization assumption is about 389 ML citywide. It is not a regulatory minimum and excludes freeboard, fire reserve, cooling, irrigation and emergency supply. Engineers must establish water age, disinfectant residual, turnover, redundancy and outage duration. Any break tank, air gap, backflow device or enclosure requires project-specific sanitary design. A stopped interlocked dock remains the first-rig approach.

The open top-fed or “waterfall” concept is rejected for potable supply because it lifts the full flow above the occupied ring, creates contamination and weather exposure, and does not eliminate storage or pressure control. A hub-fed cascade is also rejected because an outer-ring supply would cross multiple inner moving boundaries. Ground supply creates one controlled moving boundary per ring and direct maintenance access.

A 60 m height difference implies approximately 589 kPa / 5.9 bar static head from rho × g × h for water, before friction or residual pressure. Pump and pressure-zone selection requires a complete hydraulic model.

Fire-water pumps, distribution, independent supplies and reserve are a separate fire-engineering work package. They are not included in the domestic-water allowance. Do not permit an arbitrary ring stop or utility fault to silently disable firefighting.

## Electrical supply

Compare segmented inductive transfer and protected conductor rail/current collection. Commission load diversity, protection, grounding/bonding, fault interruption, essential supplies, electromagnetic compatibility, cooling and maintainability studies.

The example 93% efficiency is a sensitivity assumption. A cited Conductix product is rated 3 kW with up to 93% efficiency; it does not substantiate gigawatt-scale transfer. The website exposes the heat/loss consequence instead of asserting feasibility. Building peak demand is a separate gross-area intensity assumption; annual energy does not determine peak without a load profile.

Do not transfer a natural-gas pipe across the boundary in the baseline. Any later gas or district-thermal alternative needs its own moving-interface case. Renewable contribution requires location, area, yield, intermittency and storage analysis. No energy-autonomy claim is made.

## Waste, reuse and stormwater

Start with segregated waste rooms and scheduled enclosed service transfers. Automated aligned chutes require interlocks, jam access, missed-transfer storage and a fire strategy. Evaluate organics digestion at a controlled treatment facility, not by crediting sewer-gas capture.

Treat greywater to the intended reuse quality and keep it separate from potable supplies. No untreated irrigation or guaranteed scouring/odor benefit is assumed. Stormwater, landscape irrigation, process cooling and construction water are outside the current demand model and require their own balances.

## Life safety and operations

Protect boarding interfaces; develop accessible paths, gates, clearances and controlled transfers. Demonstrate evacuation and responder access at arbitrary ring angles, under power loss, fire, stopped movement and a jammed sector. Fixed bridges alone do not resolve the last moving connection.

Document normal motion, controlled stop, emergency stop, maintenance isolation, restart and prolonged outage. Define authority over each state and each utility interface. Test common-cause failures rather than relying on the count of redundant devices.

## Host-site and commercial work

No location is selected. Compare candidates on geotechnics, seismicity, flood, heat, dust, water security, generation/transmission access, regional transport, land/ecology constraints, workforce, supply chain, planning rules and market demand. The coastal arid hero image is an impression, not a host-site recommendation.

Request a cost plan covering land and enabling works, civil/structural works, moving equipment, utility systems, buildings, approvals, commissioning, contingency, operations, replacement cycles and decommissioning. Compare equivalent floor area and urban service levels in the static, district-demonstrator and full-rotation alternatives. No defensible headline budget, return or timeline exists at this stage.

## Initial risk register

| ID | Priority | Issue | Lead | Evidence to close |
|---|---|---|---|---|
| R01 | Critical | Support and movement | Structural / geotechnical / mechanical | Load path, support reliability, deformation and drive/braking analysis |
| R02 | Critical | Access and evacuation | Fire / accessibility / transport | Protected transfers and safe egress at arbitrary positions and faults |
| R03 | Critical | Potable-water transfer | Water / public health / mechanical | Sanitary coupling, pressure zones, backflow, water age and N+1 flow |
| R04 | Critical | Wastewater transfer | Wastewater / mechanical | Solids, containment, wear, cleanability and alternate discharge |
| R05 | Critical | Essential power and fire water | Electrical / fire / controls | Independent supplies and common-cause failure response |
| R06 | High | Transport value and comfort | Transport / human factors | Demand model, motion comfort and comparison to static city |
| R07 | High | Habitability | Architecture / building physics | Daylight, ventilation, courtyard and thermal studies |
| R08 | High | Host site | Planning / environment / geotechnical | Site-specific constraints and enabling infrastructure |
| R09 | High | Whole-life economics | Quantity surveying / economics | Costed construction, operations, renewals and demand scenarios |

Priorities are qualitative consequences of unresolved issues, not estimated probabilities.

## Stage gates and deliverables

1. **Establish the case:** site shortlist, agreed requirements, land-use/transport/climate studies, three alternatives, quantified success criteria and an independently reviewed feasibility brief.
2. **Prove the interfaces:** full-size guideway segment and moving carriage with representative potable and wastewater connections; measured leakage, water quality, solids transport, wear, missed transfer, fault response, braking and maintenance evidence. Engineers must set numerical acceptance limits before procurement.
3. **Bounded district demonstrator:** conditional on successful tests and professional review; fixed services, protected access, a static fallback and operating evidence before expansion.
4. **Masterplan and professional design:** site surveys, geotechnical reports, coordinated CAD/BIM, structural/mechanical/electrical/plumbing/fire calculations, specifications, environmental studies, cost plan, procurement strategy and authority approvals.

The current package includes this brief, a website, ring and interface schedules, illustrative SVG plan/section/ground-interface drawing, calculation source, scenario export and software checks. It does not substitute for professional design responsibility or certification.

## Reproducible baseline assumptions

These are project sensitivity assumptions, not local design standards.

| Parameter | Value | Unit |
|---|---:|---|
| Building coverage | 60 | % of ring-band area |
| Residential share | 60 | % of gross floor area |
| Net efficiency | 75 | % of residential gross area |
| Net residential area/person | 35 | m²/person |
| Domestic water | 150 | L/person/day |
| Nonresidential water allowance | 25 | % added to domestic water |
| Wastewater return | 85 | % of modeled water |
| Wastewater peak factor | 2.5 | × average |
| Wastewater storage | 6 | hours at average flow |
| Water equalization buffer | 12 | hours at average flow |
| Target module length | 200 | m |
| Rail bands | 3 | per ring |
| Support spacing | 25 | m along each rail |
| Water transfer bays | 6 | per ring |
| Wastewater transfer bays | 8 | per ring |
| Controlled stop | 120 | seconds |
| Emergency stop | 30 | seconds |
| Annual building energy | 120 | kWh/m²/year |
| Preliminary electric peak | 50 | W/m² gross |
| Illustrative transfer efficiency | 93 | % |

## Calculated baseline outputs

| Quantity | Value | Unit |
|---|---:|---|
| Envelope | 52.81 | km² |
| Ring-band area | 35.814 | km² |
| Gross floor area | 322.327 | million m² |
| Indicative residents | 4.144 | million |
| Water | 777.039 | ML/day |
| Water equalization buffer | 388.52 | ML |
| Wastewater | 660.483 | ML/day |
| Peak wastewater | 19.111 | m³/s |
| Six-hour sewage storage | 165.121 | ML |
| Articulated modules | 601 | count |
| Preliminary bogie positions | 14,340 | count |
| Controlled-stop distance | 30 | m |
| Emergency-stop distance | 7.5 | m |
| Annual building electricity | 38.679 | TWh/year |
| Average building power | 4.415 | GW |
| Preliminary building peak | 16.116 | GW |
| Additional transfer loss at peak | 1.213 | GW |

### Calculation relationships

Ring area = sum(pi × (outer radius² − inner radius²)). Gross floor area = ring area × coverage × floors. Population = gross floor area × residential share × net efficiency / net residential area per person. Water = population × domestic litres/person/day × (1 + nonresidential allowance) / 1,000. Wastewater = water × return fraction. Storage = daily flow × hours / 24. Module count = ceiling(circumference / target module length). Bogie positions = ceiling(circumference / support spacing) × rail bands. Candidate constant-deceleration stop distance = speed × stop time / 2. Transfer-bay flow includes one unavailable station and the stated connection duty. Annual electricity = gross floor area × annual intensity.

These exclude the hub, fire reserve, irrigation, process cooling, construction water, regional transit, central plants and ring-drive energy. Storage excludes freeboard and design reserve. Module, support, stop and station values are scoping variables—not equipment selections.

## Ring schedule

| Ring | Inner m | Outer m | Centerline m | Direction* | Period h | Modules* | Bogies* |
|---|---:|---:|---:|---|---:|---:|---:|
| 1 | 650 | 950 | 800 | A | 2.793 | 26 | 606 |
| 2 | 1100 | 1400 | 1250 | B | 4.363 | 40 | 945 |
| 3 | 1550 | 1850 | 1700 | A | 5.934 | 54 | 1284 |
| 4 | 2000 | 2300 | 2150 | B | 7.505 | 68 | 1623 |
| 5 | 2450 | 2750 | 2600 | A | 9.076 | 82 | 1962 |
| 6 | 2900 | 3200 | 3050 | B | 10.647 | 96 | 2301 |
| 7 | 3350 | 3650 | 3500 | A | 12.217 | 110 | 2640 |
| 8 | 3800 | 4100 | 3950 | B | 13.788 | 125 | 2979 |

*Alternating directions; absolute clockwise convention depends on view. Modules and bogies are scoping counts.

## References and limits

- [ASCE · Minimum design loads](https://www.asce.org/publications-and-news/asce-7): Framework for load combinations and site-specific hazards; it does not cover a city-scale moving structure.
- [IEC · Functional safety](https://www.iec.ch/functional-safety): Safety lifecycle and independent protection principles for electrical/electronic control systems.
- [EPA · Gravity sewers](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P10053D9.TXT): Conventional drainage principles; does not validate a moving interface.
- [EPA · Force mains](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P10099PU.TXT): Pressure conveyance, valves, surge control and cleaning.
- [EPA · Lift stations](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=901U0X00.TXT): Pumping, reliability and emergency controls.
- [EPA · Water reuse](https://www.epa.gov/waterreuse/basic-information-about-water-reuse): Treatment matched to reuse purpose; no untreated greywater claim.
- [EPA · Cross-connection protection](https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=60000RF8.TXT): Backflow and cross-connection controls support keeping potable and nonpotable systems physically protected.
- [Deublin · Rotary unions](https://www.deublin.eu/): Industrial precedent only. The selected concept avoids treating one kilometre-scale union as proven.
- [Conductix · Wireless charging](https://www.conductix.co.uk/gb/energy-transmission/inductive-power-transfer-wireless-charging/wireless-charging/wirelesscharger-30): 3 kW product, up to 93% efficiency. Not evidence for gigawatt city supply.
- [Conductix · Transit conductor rails](https://www.conductix.de/en/de/energy-transmission/conductor-rails/non-insulated-transit-welded-cap-rails): Contact-based power transfer precedent; custom integration required.

Reviewed September 7, 2026. These precedents do not validate a rotating megacity.
