# Rotunda Architect - Implementation Plan

## Overview

This plan covers two enhancements:
1. **Utility Infrastructure**: Multi-Passage Rotary Union system with redundancy
2. **Cloud Run Deployment**: Automated GitHub → Cloud Run pipeline

---

## Part 1: Multi-Passage Rotary Union System

### The Solution

The Kadant Multi-Passage Rotary Union solves plumbing/electrical transfer to rotating rings.

**Video Reference**: https://www.youtube.com/watch?v=IOLcnCO3iOM

### How It Works

```
MULTI-PASSAGE ROTARY UNION - CROSS SECTION

        ROTATING CITY RING
              ↓
    ┌─────────┴─────────┐
    │   ┌───────────┐   │
    │   │ FRESH H2O │───┼──→ To Ring Distribution
    │   │  CHANNEL  │   │
    │   ├───────────┤   │
    │   │  SEWAGE   │←──┼─── From Ring Collection
    │   │  CHANNEL  │   │
    │   ├───────────┤   │
    │   │ ELECTRIC  │───┼──→ Slip Ring Integration
    │   │ + FIBER   │   │
    │   └───────────┘   │
    └─────────┬─────────┘
              ↓
      STATIONARY GROUND
        INFRASTRUCTURE
```

### Redundancy Design

**Problem**: Single umbilical tower per ring = single point of failure

**Solution**: Multiple umbilical towers per ring, scaled by circumference

#### Umbilical Count Formula

```typescript
// Target: One umbilical tower every ~1500m of circumference
const TARGET_UMBILICAL_SPACING = 1500; // meters
const MIN_UMBILICALS = 4; // minimum for redundancy

function calculateUmbilicalCount(ringInnerRadius: number, ringOuterRadius: number): number {
  const midRadius = (ringInnerRadius + ringOuterRadius) / 2;
  const circumference = 2 * Math.PI * midRadius;
  const count = Math.max(MIN_UMBILICALS, Math.round(circumference / TARGET_UMBILICAL_SPACING));
  // Ensure even number for symmetry
  return count % 2 === 0 ? count : count + 1;
}
```

#### Expected Counts

| Ring | Mid-Radius (m) | Circumference (m) | Umbilical Towers |
|------|----------------|-------------------|------------------|
| 1 | 650 | 4,084 | 4 |
| 2 | 1,100 | 6,912 | 6 |
| 3 | 1,550 | 9,739 | 8 |
| 4 | 2,000 | 12,566 | 8 |
| 5 | 2,450 | 15,394 | 10 |
| 6 | 2,900 | 18,221 | 12 |
| 7 | 3,350 | 21,049 | 14 |
| 8 | 3,800 | 23,876 | 16 |

**Total**: ~78 umbilical towers across all rings

#### Benefits of Distributed Umbilicals

1. **Redundancy**: If one umbilical fails, others continue service
2. **Shorter runs**: Sewage doesn't travel half the ring circumference
3. **Load balancing**: Water pressure more uniform
4. **Maintenance**: Can service one tower without full ring shutdown
5. **Capacity**: Each tower handles 1/N of ring's needs (smaller, cheaper units)

#### Architecture

```
RING TOP VIEW - UMBILICAL DISTRIBUTION

                    North
                      │
            ┌─────────┼─────────┐
           ╱    [U1]  │  [U2]    ╲
          ╱           │           ╲
         │    RING    │    RING    │
    West─┼───[U4]─────┼─────[U3]───┼─East
         │            │            │
          ╲           │           ╱
           ╲    [U5]  │  [U6]    ╱
            └─────────┼─────────┘
                      │
                    South

Each [Un] = Umbilical Tower with:
- Multi-passage rotary union
- Fresh water riser
- Sewage drain
- Power/data slip rings
- Positioned at ring INNER edge (facing gap)
```

### New TypeScript Interface

```typescript
interface UmbilicalTowerConfig {
  id: string;
  ringId: string;
  anglePosition: number;     // Degrees (0-360)
  innerRadius: number;       // Position at ring inner edge
  height: number;            // Tower height (matches ring height)
  waterCapacityLitersPerDay: number;
  powerCapacityMW: number;
  status: 'active' | 'maintenance' | 'standby';
}

// Add to types.ts
interface RingConfig {
  // ... existing fields ...
  umbilicalCount: number;
  umbilicals: UmbilicalTowerConfig[];
}
```

---

## Part 2: Cloud Run Deployment Setup

### Files to Create

All files will be created automatically by Claude Code.

#### 1. Dockerfile

```dockerfile
# Build stage - compile TypeScript and bundle with Vite
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**Note**: GEMINI_API_KEY is baked into the build at compile time via vite.config.ts.
The key is already in `.env.local` which is copied during build.

#### 2. nginx.conf

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 3. .dockerignore

```
node_modules
dist
.git
.gitignore
*.md
.claude
```

#### 4. cloudbuild.yaml

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - 'us-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/rotunda-architect:$COMMIT_SHA'
      - '.'

  # Push to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - 'us-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/rotunda-architect:$COMMIT_SHA'

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'rotunda-architect'
      - '--image'
      - 'us-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/rotunda-architect:$COMMIT_SHA'
      - '--region'
      - 'us-west1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'us-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/rotunda-architect:$COMMIT_SHA'
```

### Cloud Build Trigger Setup (One-Time Console Action)

Since AI Studio already deployed this, Cloud Build may already be connected. Check:
https://console.cloud.google.com/cloud-build/triggers?project=gen-lang-client-0612863988

If not connected:
1. Go to Cloud Build → Triggers → Create Trigger
2. Connect GitHub repo: `sagearbor/megaCity-rotating`
3. Branch: `^main$`
4. Config: Cloud Build configuration file
5. Location: `/cloudbuild.yaml`

---

## Implementation Checklist

### Phase 1: Deployment Files (Claude Code - Autonomous)

- [ ] Create `/Dockerfile`
- [ ] Create `/nginx.conf`
- [ ] Create `/.dockerignore`
- [ ] Create `/cloudbuild.yaml`
- [ ] Update `/README.md` with live URL and workflow
- [ ] Create `/docs/REFERENCES.md` with Kadant video link

### Phase 2: Verify Deployment (Claude Code - Autonomous)

- [ ] Build Docker image locally: `docker build -t test .`
- [ ] Run locally: `docker run -p 8080:8080 test`
- [ ] Verify app works at http://localhost:8080
- [ ] Commit and push all files
- [ ] Verify Cloud Build triggers (check console)

### Phase 3: Umbilical System Visualization (Claude Code - Autonomous)

- [ ] Add `UmbilicalTowerConfig` interface to `types.ts`
- [ ] Add `calculateUmbilicalCount()` function to `App.tsx`
- [ ] Generate umbilical tower configs for each ring
- [ ] Add umbilical tower 3D geometry to `ArchitecturalScene.tsx`
- [ ] Add toggle in `ControlPanel.tsx` for utility layer visibility
- [ ] Test and push changes

---

## URLs Reference

| Resource | URL |
|----------|-----|
| **Live App** | https://rotunda-architect-805436652134.us-west1.run.app/ |
| **GitHub Repo** | https://github.com/sagearbor/megaCity-rotating |
| **Cloud Run Console** | https://console.cloud.google.com/run/detail/us-west1/rotunda-architect/ |
| **Cloud Build** | https://console.cloud.google.com/cloud-build/builds?project=gen-lang-client-0612863988 |
| **AI Studio** | https://aistudio.google.com/apps |
| **Kadant Video** | https://www.youtube.com/watch?v=IOLcnCO3iOM |

---

## Key Technical References

### Multi-Passage Rotary Union

- [Kadant - Rotary Joints](https://kadant.com/en/blog/maintenance/what-are-rotary-joints-rotary-unions)
- [Deublin - Rotating Unions](https://www.deublin.com/en/Rotating-Union)
- [Wikipedia - Rotary Union](https://en.wikipedia.org/wiki/Rotary_union)

### Cloud Run Deployment

- [Cloud Run Continuous Deployment](https://cloud.google.com/run/docs/continuous-deployment-with-cloud-build)
- [Vite + Docker Guide](https://vitejs.dev/guide/static-deploy.html)

---

## Notes for Future Session

When starting a new session, tell Claude Code:

```
Read /docs/IMPLEMENTATION_PLAN.md and execute the implementation checklist.
Start with Phase 1 (deployment files), then Phase 2 (verify), then Phase 3 (umbilical visualization).
```

All tasks are designed to be autonomous - no human input required except:
- Checking Cloud Build console to verify trigger exists (or creating one if not)
