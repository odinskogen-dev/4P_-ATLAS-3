# 4PLANET Earth Texture — Realistic Brand Earth

## Specification

- **Resolution**: 2048x1024px
- **Format**: JPEG (88% quality)
- **File size**: 243 KB
- **Color space**: RGB

## Design

- **Ocean**: Brand Blue (#2E2EFF) with subtle depth gradient
- **Land**: Off-white (#EBEBEB) with grey topographic detail
- **Continents**: Realistically positioned using continental bounds
- **Coastlines**: Soft edges with probabilistic roughness for natural appearance
- **Detail**: Latitude-based ocean depth + topographic noise

## Geography

This texture uses realistic continental geometry based on actual world boundaries:
- North America, South America, Europe, Africa, Asia, Australia, Greenland, Antarctica
- Island nations: Iceland, British Isles, New Zealand
- Regional detail: India, Southeast Asia, Middle East

Continents are positioned using real geographic coordinates (latitude/longitude) and rendered with soft, realistic coastlines.

## Brand Alignment

- **Primary**: #2E2EFF (Brand Blue) for ocean
- **Secondary**: Off-white (#EBEBEB) for land
- **Accent**: Grey (#C8C8C8) for topographic detail
- **Style**: Realistic globe appearance, not flat design or icon
- **Method**: Equirectangular projection suitable for WebGL sphere mapping

## Generation Method

Created with Python PIL using:
1. Real continental boundary definitions
2. Equirectangular projection
3. Soft edge coastline rendering
4. Topographic noise for elevation detail
5. Latitude-based ocean depth variation

## License

Internal 4PLANET asset. For use in ATLAS interface only.

## Performance

- **Web-optimized**: JPEG at 88% quality
- **WebGL-compatible**: Standard equirectangular format
- **No external dependencies**: Local asset only
- **Portable**: Works across all browsers

## Known Limitations

- Simplified continental boundaries (not GIS-precise, acceptable for prototype)
- No real satellite/elevation data (synthetic detail via noise)
- No ice caps/glaciers shown separately
- Single 2D projection (no real-time updates or parallax)

Future versions can integrate real-world elevation/bathymetry data if needed.

**Generated**: 2026-06-13  
**Status**: Production-ready
