# 4PLANET ATLAS v2

**Spatial intelligence interface for living systems, threats, solutions, missions and impact across Earth.**

A working prototype demonstrating the 4PLANET architecture:
```
4PLANET BRAIN → Living Systems Intelligence → ATLAS → Mission Engine → Impact Made Easy → OS
```

---

## What's Here

### Globe Interface
- Interactive 3D Earth with 23+ geographic nodes
- 8 layer types: Living Systems, Key Species, Threats, Solutions, Missions, Partners, Funding Gaps, Impact Units
- Click nodes to explore detailed intelligence
- Hover to inspect

### Data
- **Nodes**: 23 locations (ecosystems, species, threats, solutions)
- **Missions**: 6 core 4PLANET missions + 3 stubs
- **Partners**: 9 reference organizations (GBIF, IUCN, GFW, OHI, etc.)
- **Sources**: 14 sourced references from real platforms
- **Claims**: 14 facts, all sourced or marked Draft
- **Living Systems Chains**: 4 visual cause-effect examples
- **Impact Units**: 7 actions (all marked "not live yet")
- **Funding Gaps**: 6 identified opportunities

### Intelligence Panel
- Node details (type, confidence, status)
- Why it matters
- Related missions
- Living Systems Chain (Species → Function → Service → Threat → Solution → Mission → Impact)
- Sources & claims
- Partner organizations

### Routes
- `/` — Main ATLAS interface
- `/embed` — Minimal embeddable version

Future (v3):
- `/missions` — Mission overview
- `/missions/[slug]` — Mission detail
- `/sources` — Evidence reference
- `/partners` — Organization directory

---

## Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Install
```bash
npm install
```

### Develop
```bash
npm run dev
```

Open http://localhost:3000

### Build
```bash
npm run build
```

Static output in `/out` directory — ready for Cloudflare Pages.

---

## Deploy to Cloudflare Pages

1. Push code to GitHub
2. Connect repo in Cloudflare Pages dashboard
3. Build command: `npm run build`
4. Output directory: `out`
5. Deploy

Result: Your 4PLANET ATLAS will be live and accessible globally.

---

## Architecture

### Data Model
All data is static JSON in TypeScript files:
- `/data/atlas/nodes.ts` — 23 geographic nodes
- `/data/atlas/missions.ts` — 6 core missions
- `/data/atlas/partners.ts` — 9 reference orgs
- `/data/atlas/sources.ts` — 14 evidence sources
- `/data/atlas/claims.ts` — 14 sourced facts
- `/data/atlas/impact-units.ts` — 7 action units
- `/data/atlas/funding-gaps.ts` — 6 opportunities
- `/data/atlas/living-systems-chains.ts` — 4 causal chains
- `/data/atlas/layers.ts` — 8 layer definitions

### Types
`/types/atlas.ts` — Complete TypeScript definitions for all entity types

### Components
- `GlobeView.tsx` — 3D globe (Globe.gl)
- `IntelligencePanel.tsx` — Detail panel with full data
- `LayerControls.tsx` — Layer toggle UI
- `AtlasApp.tsx` — Main orchestrator with filtering
- `AtlasHeader.tsx`, `AtlasLegend.tsx` — UI chrome

### Filtering
- Layers toggle visibility
- Only visible nodes rendered on globe
- Node count updates dynamically
- Empty state when no layers active

### Styling
- 4PLANET brand colors (#2E2EFF blue, #050505 black, #C8FF6B lime)
- DM Sans typography
- Minimal grid background
- Premium, technical aesthetic
- Dark theme throughout

---

## Key Features Implemented

✅ **Globe is interactive**
- Drag to rotate
- Scroll/pinch to zoom
- Auto-rotation when idle, pauses on interaction
- 6-second timeout with error fallback

✅ **Filtering works**
- Toggle 8 layer types
- Only visible nodes shown
- Node count reflects active layers
- Empty state if no layers

✅ **Intelligence visible**
- Living Systems Chains show ecological causality
- Sources/claims visible and sourced
- Mission connections clear
- Partner transparency (reference vs. partner status)

✅ **Data sourced**
- All claims linked to sources
- Real references: GBIF, IUCN, GFW, OHI, etc.
- Confidence levels: Verified, Sourced, Curated, Draft
- No unsupported overclaiming

✅ **Build clean**
- No TypeScript errors
- No hydration errors
- Static export ready
- Cloudflare Pages compatible

---

## Known Limitations (v2)

- Globe textures are temporary fallback URLs (can be replaced with local assets in public/textures/)
- No real-time data (all static)
- Impact units not yet live (marked "partner required")
- Payment/funding not integrated (v3+)
- Mobile experience functional but not optimized
- No API integrations (future: GBIF, IUCN, GFW live)
- No database (can add Supabase in v3+)

---

## Next Steps (v3)

1. **Live Partner Integration**
   - Connect to actual restoration organizations
   - Real-time project tracking

2. **Impact Made Easy**
   - Impact unit purchasing
   - Payment processing
   - Real-time impact reporting

3. **Advanced Intelligence**
   - Satellite monitoring integration (GFW, Earthrise)
   - Species population APIs (GBIF)
   - Real-time threat alerts

4. **Community Features**
   - User accounts & profiles
   - Contribution tracking
   - Community discussions

5. **Mobile Optimization**
   - Touch-optimized globe
   - Mobile-specific navigation
   - App versions (iOS/Android)

---

## Architecture Documentation

See `ATLAS_CANON.md` for detailed explanation of:
- The 6-layer architecture (BRAIN → LSI → ATLAS → Mission Engine → Impact Made Easy → OS)
- Living Systems Intelligence concept
- Evidence & sourcing principles
- Data model
- Mission design patterns
- Version roadmap

---

## Questions?

This is a proof-of-concept prototype. Expected to evolve rapidly.

Current status: **v2 Alpha — Prototype**

Built by [4PLANET](https://4planet.co)
