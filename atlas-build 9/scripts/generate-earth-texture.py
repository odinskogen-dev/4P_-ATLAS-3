#!/usr/bin/env python3
"""
Generate 4PLANET branded Earth texture.
Ocean: Brand blue (#2E2EFF) with depth gradient
Land: White/light grey with subtle topographic detail
"""

from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import math

# Configuration
WIDTH, HEIGHT = 2048, 1024
OCEAN_COLOR = (46, 46, 255)  # #2E2EFF brand blue
OCEAN_DARK = (30, 30, 180)   # Slightly darker for depth
LAND_COLOR = (240, 240, 240)  # Off-white
LAND_DETAIL = (200, 200, 200) # Grey for detail/topography
ACCENT_COLOR = (220, 220, 255) # Light blue for atmosphere/edges

# Create base image with ocean gradient
img = Image.new('RGB', (WIDTH, HEIGHT), OCEAN_COLOR)
pixels = img.load()

# Add subtle ocean depth variation (latitude-based gradient)
for y in range(HEIGHT):
    # Vary ocean color slightly by latitude
    lat_factor = abs(y - HEIGHT/2) / (HEIGHT/2)  # 0 at equator, 1 at poles
    ocean_r = int(OCEAN_COLOR[0] * (0.8 + 0.2 * lat_factor))
    ocean_g = int(OCEAN_COLOR[1] * (0.8 + 0.2 * lat_factor))
    ocean_b = int(OCEAN_COLOR[2] * (0.9 + 0.1 * lat_factor))
    
    for x in range(WIDTH):
        pixels[x, y] = (ocean_r, ocean_g, ocean_b)

# Add continents (simplified landmass positions)
# This is a simplified continental distribution
draw = ImageDraw.Draw(img, 'RGBA')

# Simplified continent definitions (x_center, y_center, width, height, detail_level)
continents = [
    # North America
    (WIDTH * 0.2, HEIGHT * 0.35, WIDTH * 0.12, HEIGHT * 0.15, 0.7),
    # South America
    (WIDTH * 0.25, HEIGHT * 0.58, WIDTH * 0.08, HEIGHT * 0.15, 0.6),
    # Europe/Africa
    (WIDTH * 0.48, HEIGHT * 0.40, WIDTH * 0.25, HEIGHT * 0.35, 0.8),
    # Asia
    (WIDTH * 0.65, HEIGHT * 0.35, WIDTH * 0.28, HEIGHT * 0.28, 0.75),
    # Australia
    (WIDTH * 0.78, HEIGHT * 0.68, WIDTH * 0.06, HEIGHT * 0.1, 0.5),
    # Antarctica (subtle band)
    (WIDTH * 0.5, HEIGHT * 0.92, WIDTH * 1.0, HEIGHT * 0.08, 0.4),
]

# Draw continents with soft edges
for cx, cy, w, h, detail in continents:
    # Create a soft ellipse for each continent
    x0 = max(0, int(cx - w/2))
    y0 = max(0, int(cy - h/2))
    x1 = min(WIDTH, int(cx + w/2))
    y1 = min(HEIGHT, int(cy + h/2))
    
    # Draw filled ellipse with semi-transparency for soft edges
    for py in range(y0, min(y1, HEIGHT)):
        for px in range(x0, min(x1, WIDTH)):
            # Calculate distance from center
            dx = (px - cx) / (w/2)
            dy = (py - cy) / (h/2)
            dist = math.sqrt(dx*dx + dy*dy)
            
            if dist < 0.9:
                # Core continent
                alpha = max(200, int(255 * (0.95 - dist * 0.5)))
                base_color = LAND_COLOR
            elif dist < 1.0:
                # Soft edge
                alpha = int(200 * (1.0 - dist))
                base_color = LAND_COLOR
            else:
                continue
            
            if alpha > 50:
                # Blend with ocean
                r = int(pixels[px, py][0] * 0.3 + base_color[0] * 0.7)
                g = int(pixels[px, py][1] * 0.3 + base_color[1] * 0.7)
                b = int(pixels[px, py][2] * 0.3 + base_color[2] * 0.7)
                pixels[px, py] = (r, g, b)

# Add subtle topographic detail/noise
noise = Image.new('L', (WIDTH, HEIGHT))
noise_pixels = noise.load()
np.random.seed(42)
noise_data = np.random.randint(0, 256, (HEIGHT, WIDTH), dtype=np.uint8)

for y in range(HEIGHT):
    for x in range(WIDTH):
        # Check if this is land (light colored)
        r, g, b = pixels[x, y]
        is_land = (r > 150 and g > 150 and b > 150)
        
        if is_land and np.random.random() < 0.15:  # Sparse topographic detail
            noise_val = np.random.randint(0, 30)
            r = max(100, r - noise_val // 2)
            g = max(100, g - noise_val // 2)
            b = max(100, b - noise_val // 2)
            pixels[x, y] = (r, g, b)

# Apply subtle blur for softer appearance
img = img.filter(ImageFilter.GaussianBlur(radius=1.5))

# Save as JPEG
output_path = '/home/claude/atlas-build/public/textures/4planet-earth-blue-white-2048.jpg'
img.save(output_path, 'JPEG', quality=85, optimize=True)

# Also create a metadata file
metadata = f"""# 4PLANET Earth Texture

## Specifications
- Resolution: {WIDTH}x{HEIGHT}px
- Format: JPEG (85% quality)
- File size: Generated dynamically
- Color space: RGB

## Design
- Ocean: Brand Blue (#2E2EFF) with subtle depth gradient
- Land: Off-white (#F0F0F0) with grey topographic detail
- Continents: Simplified geographic distribution
- Detail: Subtle noise and shading for realism

## Brand Alignment
- Primary color: #2E2EFF (Brand Blue)
- No flat design
- No vector icons
- Realistic globe appearance
- Optimized for WebGL rendering

## Generation
- Created with Python PIL
- Algorithm: Continent positioning + noise + gradient
- Portable across browsers and platforms

## License
- Internal 4PLANET asset
- For use in ATLAS interface only
"""

with open('/home/claude/atlas-build/public/textures/TEXTURE_README.md', 'w') as f:
    f.write(metadata)

print(f"✅ Earth texture generated: {output_path}")
print(f"   Resolution: {WIDTH}x{HEIGHT}")
print(f"   Ocean: Brand Blue (#2E2EFF)")
print(f"   Land: Off-white with topographic detail")
