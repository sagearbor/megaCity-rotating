# Next Session Fixes - Priority Issues

## Issue 1: Infrastructure Page - Rotary Union Diagram Incorrect (HIGH PRIORITY)

**Problem:** The current Rotary Union System diagram shows the ring section revolving around centered pipes, which is wrong.

**Correct Design:**
- The ring floor section should slide HORIZONTALLY past the rotary union
- Think of it like grooves/channels in the stationary base that the rotating ring slides over
- The ring doesn't spin around a central pipe - it rotates horizontally like a lazy susan
- The rotary union is at the INNER EDGE of the ring, at ground level
- Utilities transfer through grooved channels as the ring passes over them

**Visual Concept:**
- Show a section of ring FLOOR (not the whole ring arc)
- The floor slides horizontally LEFT/RIGHT past stationary utility connections
- Grooves in the ring floor align with grooves in the stationary base
- As ring rotates, different grooves pass over the stationary connections
- This maintains continuous flow even during rotation

**File to modify:** `/home/scb2/PROJECTS/gitRepos-wsl/megaCity-rotating/pages/InfrastructurePage.tsx`

---

## Issue 2: City View - Make Dense Showcase Section Pop Out (MEDIUM PRIORITY)

**Problem:** The dense showcase section on Ring 2 (at angle 0) doesn't visually stand out enough.

**Solution:** Make the Ring 2 section 0 a LIGHTER shade of brown/tan so it's visually distinct from other ring sections.

**Implementation:**
- In `ArchitecturalScene.tsx`, find where Ring 2's segments are rendered
- For segment index 0 (the showcase section), use a lighter color
- Could also add a subtle glow or different material properties
- The goal is to make it obvious "this is the area to zoom into"

**Files to modify:** `/home/scb2/PROJECTS/gitRepos-wsl/megaCity-rotating/components/ArchitecturalScene.tsx`

---

## Issue 3: City View - Slow Loading / Performance (HIGH PRIORITY)

**Problem:** The City View page takes a long time to load. Need to make it extremely responsive.

**Analysis needed:**
1. Profile what's taking the longest (geometry creation? texture loading? component mounting?)
2. Count how many meshes/objects are being created
3. Check if useMemo is being used effectively
4. Look for unnecessary re-renders

**Potential Solutions to Explore:**

### A. Progressive/Lazy Loading
- Show basic rings immediately (low detail)
- Load amenities, people, details progressively after initial render
- Use React.lazy() for showcase components
- Show a loading spinner for secondary content

### B. Instanced Meshes (RECOMMENDED)
- Group similar objects (trees, benches, people, lamps) into InstancedMesh
- Instead of 100 separate mesh objects, use 1 InstancedMesh with 100 instances
- Dramatically reduces draw calls
- Example: All pine trees = 1 InstancedMesh, all oak trees = 1 InstancedMesh

### C. Level of Detail (LOD)
- Show simplified geometry when zoomed out
- Show detailed geometry only when zoomed in
- Three.js has built-in LOD support

### D. Geometry Merging
- Merge static geometries that don't need individual interaction
- Reduces draw calls significantly

### E. Defer Non-Critical Rendering
- Render rings and bridges first (core structure)
- Use requestIdleCallback or setTimeout to add amenities after initial paint
- User can start interacting immediately while details load

**Files to analyze:**
- `/home/scb2/PROJECTS/gitRepos-wsl/megaCity-rotating/components/ArchitecturalScene.tsx`
- `/home/scb2/PROJECTS/gitRepos-wsl/megaCity-rotating/components/ShowcaseGroundAmenities.tsx`
- `/home/scb2/PROJECTS/gitRepos-wsl/megaCity-rotating/components/ShowcaseDetails.tsx`
- `/home/scb2/PROJECTS/gitRepos-wsl/megaCity-rotating/components/ShowcaseForest.tsx`
- `/home/scb2/PROJECTS/gitRepos-wsl/megaCity-rotating/components/Ring12GapAmenities.tsx`
- `/home/scb2/PROJECTS/gitRepos-wsl/megaCity-rotating/components/Ring34GapAmenities.tsx`

**Current object counts (approximate):**
- 80+ people (each = 2 meshes: body + head)
- 35+ trees (each = 2 meshes: trunk + foliage)
- 50+ detail objects (benches, lamps, etc.)
- Multiple ground amenities per gap
- All rooftop amenities

**Priority approach:**
1. First: Implement InstancedMesh for repeated objects (trees, people, lamps)
2. Second: Add progressive loading (core structure first, then details)
3. Third: Add LOD if still needed

---

## Current State Summary

**What's working:**
- v0.03 with dense showcase section
- Navigation between City View and Infrastructure pages
- Hover tooltips on all elements
- Dark/light mode
- Wooded areas with streams
- Beacon to find showcase area
- Infrastructure page with 3D visualization and explanation bubbles

**Live URL:** https://rotunda-architect-805436652134.us-west1.run.app/

**Last commit:** 6e2cb8f - fix: Infrastructure page scrolling, ring orientation, rotary union placement
