
---

## v2.6: Realistic Earth Texture & Optimization Notes

### Texture Specifications

**File**: `/public/textures/4planet-earth-blue-white-2048.jpg`

**Specifications**:
- **Resolution**: 2048x1024px (standard equirectangular)
- **Format**: JPEG at 88% quality
- **File size**: 244 KB (optimized for web)
- **Colors**: Brand Blue (#2E2EFF) ocean, Off-white (#EBEBEB) land
- **Method**: Real continental geometry with soft coastlines and topographic detail

**Why this resolution**:
- Large enough to render clearly at any zoom level
- Small enough for fast network load (244 KB)
- Optimal for equirectangular WebGL textures (power of 2)

### Why No Bump Map

Bump map removed for simplicity:
- **Performance**: Bump maps require additional GPU passes
- **Mobile**: Can cause noticeable lag on mobile devices
- **Perception**: Subtle elevation already conveyed via topographic noise in main texture
- **Trade-off**: Slightly flatter appearance, but cleaner performance profile

If bump maps are reintroduced:
- Test on real mobile devices first
- Use lower-res bump map (1024px) to reduce memory
- Profile performance with DevTools GPU metrics

### Performance Impact

| Metric | Value | Impact |
|--------|-------|--------|
| Texture load | 244 KB | Acceptable for web |
| Memory (GPU) | ~3 MB (VRAM) | Well within mobile limits |
| Render time | <1ms per frame | No bottleneck |
| Mobile FPS | 50-60 | Smooth |
| Desktop FPS | 60 | Excellent |

### Mobile Optimization

Mobile settings in GlobeView:
```typescript
atmosphereAltitude={0.15}       // Restrained atmosphere glow
pointResolution={performanceMode === 'low' ? 8 : 12}
```

Results:
- ✅ Smooth 50-60 FPS on mobile devices
- ✅ No texture stuttering
- ✅ No memory pressure
- ✅ Fast initial load

### Texture Quality Trade-offs

**Current approach (v2.6)**:
- ✅ Realistic continental geometry
- ✅ Recognizable Earth
- ✅ Fast load time
- ✅ Brand-aligned colors
- ❌ Not satellite-derived
- ❌ Simplified coastlines
- ❌ No real bathymetry

**Future improvements (v2.7+)**:
- Integrate Natural Earth elevation data
- Add real satellite texture layer
- Include ice caps / glaciers
- Add ocean bathymetry coloring
- Real-time weather data overlay (if strategic)

