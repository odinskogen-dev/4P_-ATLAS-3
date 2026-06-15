# Earth Texture — Upgrade Path for v3.1+

## Current Status (v3.0)

**Active texture**: `/public/textures/earth-blue-marble.jpg` (58 KB)

This is a high-quality, procedurally-generated realistic Earth texture designed for the v3.0 prototype.

**Characteristics**:
- Real continental geometry
- Dark blue realistic oceans
- Subtle bathymetry shading
- Topographic detail
- Soft, natural coastlines
- Professional appearance

**Source**: Procedurally generated using real geographic boundaries  
**License**: 4PLANET asset (internal use)  
**Limitations**: Not satellite-derived; synthetic detail via noise

## Next Upgrade (v3.1+)

For production and maximum credibility, **replace with NASA Blue Marble or NASA Earth Observatory imagery**.

### Why NASA Blue Marble?

- ✅ Authentic satellite imagery
- ✅ NASA provenance (credibility for scientific/environmental projects)
- ✅ Public domain (with proper attribution)
- ✅ High quality (natural Earth appearance)
- ✅ Standard in educational/scientific interfaces

### How to Upgrade

1. **Obtain NASA Blue Marble**:
   - Visit: https://earthobservatory.nasa.gov/images
   - Search: "Blue Marble"
   - Download equirectangular version
   - Save as: `/public/textures/earth-blue-marble.jpg`
   - Recommended size: 2048x1024px (max)
   - Format: JPEG 85-90% quality

2. **Verify settings in GlobeView.tsx**:
   ```typescript
   globeImageUrl="/textures/earth-blue-marble.jpg"
   atmosphereAltitude={0.10}  // Subtle glow
   ```

3. **Add attribution**:
   - Update `/sources` page
   - Add: "Earth imagery: NASA Blue Marble / NASA Earth Observatory"
   - Disclaimer: "NASA does not endorse this prototype"

4. **Test**:
   ```bash
   npm run build
   npm run dev
   # Verify globe looks realistic
   ```

### Attribution Template

```markdown
## Earth Imagery

"Earth Imagery: NASA Blue Marble / NASA Earth Observatory.
Used for informational and educational prototype purposes.
This project is not affiliated with or endorsed by NASA."
```

## Alternative Sources (if NASA unavailable)

If NASA Blue Marble cannot be used, consider:

1. **Natural Earth Vector Data** (naturalearthdata.com)
   - Public domain
   - Coastline shapefiles
   - Can be rasterized to equirectangular

2. **ESA/Copernicus Sentinel**
   - European Space Agency
   - Open access satellite data
   - Good alternative to NASA

3. **GEBCO Bathymetry**
   - General Bathymetric Chart of the Oceans
   - Free, high-resolution ocean data
   - Good for detailed ocean visualization

## Do NOT Use

❌ Google Earth imagery (proprietary)  
❌ Google Maps tiles (proprietary)  
❌ Mapbox (proprietary)  
❌ Synthetic/generated blobs (loses credibility)  
❌ Recolored NASA assets (violates fair use)

## Quality Standards for v3.1+

When upgrading texture:

- **Resolution**: 2048x1024px or better
- **Format**: JPEG (optimized) or WebP
- **File size**: <300 KB
- **Appearance**: Clearly recognizable as Earth
- **Source**: Legitimate (NASA, ESA, etc.)
- **Attribution**: Proper credit included
- **Equirectangular**: Must be correct projection for sphere mapping

---

**Current v3.0 texture** works well for prototype phase.  
**Plan NASA upgrade for v3.1 or production release.**

