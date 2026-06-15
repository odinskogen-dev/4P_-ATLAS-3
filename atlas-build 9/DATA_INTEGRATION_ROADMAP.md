# 4PLANET ATLAS — Data Integration Roadmap

## Vision

ATLAS should become an interpretive layer on top of trusted, authoritative data sources—not a data authority itself.

**Principle**: Use existing, vetted sources. Do not duplicate or recreate data.

---

## Current State (v3.0)

**Data model**: Hand-curated prototype dataset.

**Sources**:
- Internal BRAIN data structure
- Curated scientific claims (peer-reviewed, institutional)
- Partner references (NGO, research organizations)

**Limitations**:
- Not connected to live data feeds
- Manual updates required
- Small prototype dataset

---

## Phase 1: Enhanced Data Sources (v3.1)

### Earth Imagery

**Target**: NASA Blue Marble / NASA Earth Observatory

- **Provider**: NASA
- **Access**: Public domain (with attribution)
- **What**: High-resolution Earth texture for globe
- **Status**: Planned for v3.1
- **Integration**: Replace `/public/textures/earth-blue-marble.jpg`

### Species Occurrence

**Target**: GBIF (Global Biodiversity Information Facility)

- **Provider**: gbif.org (open data)
- **What**: Where species have been observed / documented
- **Integration**: Layer nodes for species occurrence density
- **Benefit**: Ground-truth species distribution
- **Planned**: v3.2+

### Species Threat Status

**Target**: IUCN Red List

- **Provider**: iucnredlist.org (API available)
- **What**: Conservation status of species (Extinct, Endangered, etc.)
- **Integration**: Update node threat indicators
- **Benefit**: Current, authoritative threat assessment
- **Planned**: v3.2

### Forest Loss & Land Pressure

**Target**: Global Forest Watch

- **Provider**: globalforestwatch.org (API available)
- **What**: Forest cover change, deforestation, land-use change
- **Integration**: Spatial heatmap overlay, ecosystem threat quantification
- **Benefit**: Real-time forest monitoring
- **Planned**: v3.3

### Protected Areas

**Target**: Protected Planet / WDPA

- **Provider**: protectedplanet.net (open data)
- **What**: Mapped protected areas globally
- **Integration**: Overlay protected areas layer, track coverage
- **Benefit**: Visualize conservation effort
- **Planned**: v3.3

### Ocean Health

**Target**: Ocean Health Index

- **Provider**: oceanhealthindex.org (open data)
- **What**: Composite ocean ecosystem health score
- **Integration**: Ocean nodes + threat assessment
- **Benefit**: Quantified ocean system health
- **Planned**: v3.3+

### Fishing Pressure

**Target**: Global Fishing Watch

- **Provider**: globalfishingwatch.org (API available)
- **What**: Detected fishing activity, vessel tracking
- **Integration**: Ocean threat visualization
- **Benefit**: Real-time fishing pressure mapping
- **Planned**: v3.4+

---

## Phase 2: Solutions & Outcomes (v3.4+)

### Climate Solutions

**Target**: Project Drawdown

- **Provider**: drawdown.org
- **What**: Curated climate solutions database
- **Integration**: Solution node enrichment, effectiveness data
- **Benefit**: Vetted, prioritized solutions
- **Planned**: v3.4

### Restoration Outcomes

**Target**: Restor

- **Provider**: restor.eco (API)
- **What**: Restoration project outcomes, ecological monitoring
- **Integration**: Impact unit verification, mission success metrics
- **Benefit**: Demonstrated restoration results
- **Planned**: v3.4+

### Reference Basemap

**Target**: Natural Earth Vector

- **Provider**: naturalearthdata.com (public domain)
- **What**: Coastlines, admin boundaries, geographic context
- **Integration**: Background layer accuracy
- **Benefit**: Geographic reference accuracy
- **Planned**: v3.3 (ongoing)

---

## Phase 3: Real-Time Feeds (v4.0+)

### Satellite Monitoring (Future)

**Candidates**:
- Sentinel-2 (ESA - open access)
- Landsat (USGS - open access)
- Planet Labs (commercial, discounted for nonprofits)

**Use case**: Real-time ecosystem change detection

**Challenge**: Processing, storage, interpretation

---

## Data Quality Standards

### Source Evaluation Checklist

When adding a new data source:

- [ ] **Credibility**: Is the source reputable and peer-reviewed where applicable?
- [ ] **Accessibility**: Is the data openly accessible (not proprietary)?
- [ ] **License**: Are terms clear and compatible with ATLAS mission?
- [ ] **Attribution**: Can/should we credit the source visibly?
- [ ] **API**: Is there a clean technical interface to the data?
- [ ] **Maintenance**: Is the source actively updated?
- [ ] **Verification**: Can outcomes be independently verified?

---

## Data Integration Timeline

| Phase | Version | Focus | Key Sources |
|-------|---------|-------|-------------|
| Current | v3.0 | Curated prototype | Internal data |
| Enhanced | v3.1-v3.2 | Species & imagery | NASA, GBIF, IUCN |
| Spatial | v3.3-v3.4 | Forest, ocean, solutions | GFW, Ocean HI, Drawdown, Restor |
| Real-time | v4.0+ | Monitoring feeds | Sentinel, Landsat |

---

## What NOT to Integrate

❌ **Proprietary sources** (Google Earth, Google Maps, Mapbox)  
❌ **Surveillance data** (without explicit consent)  
❌ **Unverified crowdsourcing** (without peer review layer)  
❌ **Political data** (borders, claims, contested territories)  
❌ **Personal data** (without privacy protection)  

---

## Architecture for Data Integration

```
Trusted External Data Sources
    ↓ (Validated via API/ETL)
4PLANET BRAIN
    ↓ (Interpreted)
Living Systems Intelligence
    ↓ (Visualized)
4PLANET ATLAS
    ↓ (Actionable)
Mission Engine → Impact Made Easy
    ↓ (Tracked)
4PLANET OS
```

---

## Development Workflow

When adding a new data source:

1. **Evaluate**: Does it fit the Canon? Reputable? Compatible?
2. **Research**: How to access? API? License terms? Attribution?
3. **Mock**: Create sample integration (test data)
4. **Implement**: Write ETL/API connector
5. **Verify**: Test data accuracy against source
6. **Document**: Add to PROGRESS.md, update canon
7. **Deploy**: Release in versioned update

---

## Success Metrics

By v4.0, ATLAS should be:

- Connected to 5+ authoritative open data sources
- Updated with fresh data at least monthly
- Providing verifiable, attributable intelligence
- Supporting partner data contribution
- Clear on data limitations + confidence levels

---

**The goal is credibility through transparency and data integrity, not comprehensiveness.**

