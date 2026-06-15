# 4PLANET ATLAS — Canonical Architecture

## The System

4PLANET is built as a layered intelligence-to-action architecture:

```
                    4PLANET BRAIN
                  (Truth & Sources)
                          ↓
          Living Systems Intelligence
              (Relationships & Logic)
                          ↓
                  4PLANET ATLAS
              (Spatial/Geographic Interface)
                          ↓
                  Mission Engine
          (Converts Intelligence to Missions)
                          ↓
              Impact Made Easy
              (Participation & Action)
                          ↓
                4PLANET OS
         (Operations & Execution)
```

---

## Layer 1: 4PLANET BRAIN

**Purpose**: Single source of truth for all ecosystem, threat, solution, species, partner, and funding data.

**Contains**:
- Curated ecological facts
- Sourced claims with evidence
- Partner organizations (reference + active)
- Mission definitions
- Impact unit specifications
- Funding gap analyses

**Characteristics**:
- All data sourced or marked Draft
- Confidence levels on every claim (Verified, Sourced, Curated, Draft)
- Cross-linked (nodes → missions → partners → impacts)
- Extensible to external databases (GBIF, IUCN, GFW, OHI, etc.)

---

## Layer 2: Living Systems Intelligence

**Purpose**: Explain ecological relationships, dependencies, and causal chains.

**Contains**:
- Ecological functions (predation, pollination, nutrient cycling, etc.)
- Ecosystem services (food production, water purification, climate regulation, etc.)
- Human system dependencies (food, water, climate, health, economy)
- Threat mechanisms (habitat loss → species decline → ecosystem collapse → human impact)
- Solution pathways (protection → restoration → resilience → sustained benefit)

**Example Chain** (Jaguar):
```
Species:            Jaguar (apex predator)
Function:           Predation on large herbivores
Service:            Maintains forest structure & trophic balance
Human Benefit:      Forest stability enables climate regulation & water provision
Threat:             Habitat fragmentation (roads, agriculture, mining)
Impact:             Population isolation → genetic decline → functional loss
Solution:           Habitat corridors connecting protected areas
Mission:            AM4ZONIA
Impact Unit:        Hectares of corridor established & monitored
```

**Characteristics**:
- Shows "why this matters to humans"
- Makes ecological causality explicit
- Enables evidence-based mission design
- Links species to human systems directly

---

## Layer 3: 4PLANET ATLAS

**Purpose**: Geographic & spatial intelligence interface.

**Interface Shows**:
- Living systems (ecosystems) on a map
- Key species locations & ranges
- Ecological threats spatially
- Solution & restoration projects
- 4PLANET missions on the ground
- Partner organizations & their work
- Funding gaps & opportunity areas

**Interaction Model**:
- Layer toggles (show/hide node types)
- Click node to inspect
- View all related data (sources, chains, missions, partners)
- Understand "why this node matters"

**Characteristics**:
- Purely interface layer (does not store data)
- Reads from 4PLANET BRAIN
- Shows Living Systems Intelligence visually
- Entry point for exploration
- Feeds selection into Mission Engine

---

## Layer 4: Mission Engine

**Purpose**: Convert geographic/ecological intelligence into concrete, actionable missions.

**Mission Anatomy**:
- Name & domain (OCE4N_, E4RTH_, S4PIENS_, 4CULTURE)
- Problem statement (why this matters)
- Living systems summary (ecological context)
- Threat summary (what's going wrong)
- Solution summary (what we're doing)
- Geographic nodes involved
- Partner organizations involved
- Impact units (how to measure success)
- Funding gaps (what's underfunded)

**Example** (AM4ZONIA):
- Problem: Amazon deforestation accelerating
- Solution: Indigenous stewardship + protection + restoration + monitoring
- Nodes: Amazon Rainforest + Jaguar + Forest Elephant + ...
- Partners: Amazon Frontlines, Global Forest Watch, ...
- Impact Unit: 1 hectare monitored & protected
- Funding Gap: Community monitoring systems chronically underfunded

**Characteristics**:
- Bridges intelligence to action
- Defines success metrics (impact units)
- Identifies implementation partners
- Shows funding opportunities

---

## Layer 5: Impact Made Easy

**Purpose**: Enable people to act on 4PLANET missions.

**Not Implemented in v2** (placeholder stage):

Would contain:
- Impact unit purchasing/funding
- Real-time impact tracking
- Partner payment & reporting
- Community engagement
- Verification & claims

**Current Placeholder**:
- Impact units defined
- Caveats shown (e.g., "partner required", "not live yet")
- Clear indication: "This impact unit is not yet available for action"

---

## Layer 6: 4PLANET OS

**Purpose**: Operational infrastructure for mission execution.

**Not Implemented in v2**:

Would contain:
- Partner relationship management
- Financial tracking & accounting
- Impact reporting & verification
- Task management
- Community coordination
- Performance analytics

---

## Data Model (as of v2)

### Core Entities

#### AtlasNode
Type: ecosystem | species | threat | solution | mission | partner | impact-unit | funding-gap

Represents any geographic entity or concept with a location.

#### Mission
Named initiative (AM4ZONIA, CLIM4TE, SPECIES, WH4LES, COR4L, E4RTH/RE:WILD)

Links nodes → partners → impact units → funding gaps

#### PartnerProject
Organization or project contributing to mission

Types: nonprofit, company, research, public, indigenous-led, community-led, unknown

Partnership Status: reference-only | potential | in-dialogue | partner

#### ImpactUnit
Measurable action specification (e.g., "1 hectare forest protected")

Includes caveat explaining what's required before launch

#### Source
Evidence reference (GBIF, IUCN, GFW, OHI, scientific papers, internal research)

Every claim links to a source.

#### Claim
Factual statement with confidence level

Examples: "Amazon stores 150-200 billion tonnes of carbon", "Jaguars are keystone predators"

#### LivingSystemsChain
Visual + narrative representation of cause-effect in living systems

Shows: Species → Function → Service → Human System → Threat → Solution → Mission → Impact

#### FundingGap
Identified underfunded area within a mission

Shows market failure & sponsor opportunity

---

## Key Principles

### 1. Sourcing & Evidence
- Every factual claim must be sourced or marked Draft
- Confidence levels are explicit: Verified, Sourced, Curated, Draft
- Sources are real (GBIF, IUCN, GFW, OHI, scientific papers)
- Never overclaim

### 2. Living Systems Intelligence
- Make ecological relationships explicit
- Show human relevance (why ecosystems matter to people)
- Explain causality: species → function → service → human benefit → threat → solution
- No "nature-for-nature's sake" framing — always connect to human systems

### 3. Geographic Honesty
- All nodes have coordinates
- Coordinates are approximate for v2
- Future versions: precise geographies, polygon boundaries, precise ranges

### 4. Partnership Transparency
- Clear distinction: reference-only vs. in-dialogue vs. partner
- Never misrepresent external organizations
- External platforms (GBIF, IUCN, GFW) are "reference-only" — not 4PLANET partners
- Only mark as "partner" if confirmed

### 5. Impact Credibility
- Impact units are not yet live (v2)
- Clear caveat: "Partner required / not live / needs verification method"
- No false claims of "availability"
- Placeholder stage: definition + feasibility, not implementation

### 6. Mission Clarity
- Every mission is linked to geographic nodes (where?)
- Every mission has a problem statement (why?)
- Every mission has a solution direction (how?)
- Every mission has partners (who?)
- Every mission has impact units (what success looks like?)

---

## From ATLAS to Impact

1. **ATLAS shows**: Interactive globe with living systems, threats, solutions, missions
2. **User explores**: Clicks on Amazon Rainforest
3. **ATLAS displays**: 
   - Living Systems Chain showing Jaguar → Predation → Forest Health → Climate → Habitat Loss → Corridors
   - Related Mission: AM4ZONIA
   - Related Partners: Amazon Frontlines, GFW
   - Related Sources: GFW, GBIF, IUCN
4. **User learns**: Why this ecosystem matters, what threatens it, how 4PLANET is addressing it
5. **User wants to act**: Clicks "Learn more about AM4ZONIA"
6. **Mission Page shows**:
   - Problem: Deforestation accelerating
   - Solution: Indigenous stewardship + protection + monitoring
   - Impact Unit: 1 hectare monitored (caveat: partner required)
   - Funding Gap: Community monitoring underfunded
7. **User takes action** (v3+):
   - Sponsors impact unit
   - Receives real-time updates on progress
   - Sees verified impact (via 4PLANET OS reporting)

---

## Version Roadmap

### v2 (Current)
- ✅ ATLAS spatial interface operational
- ✅ Living Systems Chains visible
- ✅ Mission definitions complete
- ✅ Data sourced & evidence-based
- ✅ Partner reference layer complete
- ✅ Impact units defined (not live)
- ✅ Funding gaps identified
- ⏳ Embed route working
- 🔲 Impact Made Easy not yet built
- 🔲 Payment integration not yet built

### v3 (Planned)
- Real-time partner integration
- Live impact unit purchasing
- Payment infrastructure
- Community engagement features
- Advanced analytics & reporting
- Mobile app

### v4 + (Vision)
- Live satellite monitoring (integration with GFW, Earthrise, etc.)
- Real-time species population data
- Community monitoring network integration
- Advanced verification & claims logic
- Decentralized impact tracking

---

## This is not:
- A marketplace or donation platform (yet)
- A CMS or content management system
- A real-time satellite monitoring system
- A community fundraising app (yet)
- A research database (though it references them)
- A GIS platform (though it's geospatial)
- A NGO website (though it could look like one)

## This is:
- An intelligence interface
- A mission definition system
- A spatial knowledge base
- A evidence-based storytelling platform
- An entry point to 4PLANET action (v3+)

---

Last updated: June 2026
Version: 2.0 — Prototype Alpha
