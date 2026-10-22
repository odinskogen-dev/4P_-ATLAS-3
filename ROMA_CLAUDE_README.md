# ROMA WORLD: geodata acquisition and provenance

Project CUB ROMA, source acquisition, 2026-10-23. **No synthetic elevation data is included.**

## Already delivered as real source data

Natural Earth 1:10m rivers: https://github.com/odinskogen-dev/4P_-ATLAS-3/blob/cub-roma-world-assets-20261023/assets/world/ne_10m_rivers_crop.geojson

The file is a clipped copy of the 1:10m rivers and lake centre-lines dataset. 273 actual features and 47,463 vertices in EPSG:4326. Public domain, Natural Earth. This is separate from the earlier LGPL GSHHG/WDBII fallback.

## Build the remaining original data

Run from project root (requires ordinary internet connectivity to upstream agencies):

```sh
python -m pip install --disable-pip-version-check numpy pillow requests rasterio netcdf4
python tools/build_roma_geodata.py
```

The script attempts **independent downloads** from NASA and NOAA and writes `assets/world/MANIFEST.json`, recording what actually succeeded or failed. It does not synthesize heights or silently upsample the old Blue Marble preview.

Optional isolated GitHub Actions pipeline: [Branch](https://github.com/odinskogen-dev/4P_-ATLAS-3/tree/cub-roma-world-assets-20261023), [Workflow](https://github.com/odinskogen-dev/4P_-ATLAS-3/blob/cub-roma-world-assets-20261023/.github/workflows/cub-roma-geodata.yml). It emits a temporary 30-day artifact named `ROMA_WORLD_GEO_ACTUAL_DATA` if the workflow actually executes. The job's success has **not** been confirmed. No production branch is modified.

## Exact intended output

- `assets/world/bluemarble_july_500m_source/bluemarble_july_r{0,1}c{0,1,2,3}.jpg`: 8 JPGs, 4096px wide each, source original NASA full-resolution (500m class), topography only; each tile has lat/lon extent 22.5° × 22°.
- Same output for January as separate optional source, seasonal snow reference.
- `assets/world/etopo2022_surface_60s_crop_16bit.png`: unsigned 16-bit PNG, ~4096 x 2002. Elevation must be decoded as `metres = pixelValue - 32768`, capturing negative submarine elevations; **never** interpret the PNG's unsigned pixel values as metres.
- `assets/world/etopo2022_height_decode.json`: actual observed source min/max, source link, bounds, datum and decoding.
- `assets/world/ne_10m_rivers_crop.geojson`: actual Natural Earth 1:10m, CC0/public domain.
- `assets/world/MANIFEST.json`: individual success/failure status and SHA256 hashes. Check this before replacing placeholder terrain.

## Spatial alignment

All source rasters and features correspond to BBOX `[-15,22,75,66]`, lat/lon EPSG:4326. Raster pixel 0,0 is northwestern-most. Output NASA tiles are arranged left-to-right then north-to-south. ETOPO vertical reference is EGM2008, not WGS84 ellipsoidal height, so use it for physical terrain and not GPS navigation.

## License and sources

- ETOPO 2022 NOAA NCEI, CC0-1.0. Official dataset: https://www.ncei.noaa.gov/metadata/geoportal/rest/metadata/item/gov.noaa.ngdc.mgg.dem:etopo_2022/html ; DOI https://doi.org/10.25921/fd45-gt74 . NOAA specifies EGM2008 elevations. 
- Natural Earth rivers 1:10m, public domain: https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/ ; GeoJSON source https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_rivers_lake_centerlines.geojson .
- NASA Blue Marble: Next Generation, base map with topography, January and July, 500m source tiles. Source: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-topography/ . NASA material is generally available for public use under NASA media usage guidelines, subject to terms and endorsement restrictions, not an unconditional CC0 dedication. https://www.nasa.gov/nasa-brand-center/images-and-media/ .

## Status as of this package's creation

Natural Earth: committed actual valid clipped GeoJSON to public source-data branch.
NASA Blue Marble 500m: source URLs identified; physical JPEGs not yet delivered.
NOAA ETOPO 2022: numeric cutout acquisition endpoints identified; 16-bit PNG not yet delivered.

Do not publish claims that NASA/NOAA downloads succeeded without inspecting the MANIFEST and the image files.