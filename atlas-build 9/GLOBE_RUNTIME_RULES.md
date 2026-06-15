# 4PLANET ATLAS — Globe Runtime Architecture Rules

## ✅ APPROVED: react-globe.gl

The globe must be implemented as a React component using **react-globe.gl**.

```typescript
// ✅ CORRECT
import dynamic from 'next/dynamic';
const ReactGlobe = dynamic(() => import('react-globe.gl'), { ssr: false });

export function GlobeView() {
  const globeRef = useRef(null);
  return (
    <ReactGlobe
      ref={globeRef}
      globeImageUrl="/textures/4planet-earth-blue-white-2048.jpg"
      pointsData={points}
      onPointClick={handleClick}
    />
  );
}
```

## ❌ BANNED: Direct globe.gl

All direct usage of `globe.gl` is permanently banned.

### What NOT to do:

```typescript
// ❌ BANNED: Direct import
import { Globe } from 'globe.gl';
from 'globe.gl'
import('globe.gl')
Globe()(container)
Globe({ ... })(container)
```

### Why?

The original runtime crash ("Failed to execute 'removeChild' on 'Node'") was caused by:
1. Imperative lifecycle: `Globe()(containerRef.current)`
2. Manual canvas mounting/removal
3. React/Next DOM conflict with canvas lifecycle
4. removeChild/appendChild on globe-managed DOM

This cannot happen with react-globe.gl because it's a proper React component with hooks.

## ✅ APPROVED: Safe ref methods

Only these ref methods are allowed:

```typescript
// ✅ SAFE: Read-only or controlled methods
globeRef.current.pointOfView()      // Get/set camera
globeRef.current.controls()          // Get camera controls
globeRef.current.controls().autoRotate = true;
```

## ✅ APPROVED: Package dependencies

```json
{
  "react-globe.gl": "^2.38.0",
  "three": "^0.184.0"
}
```

**Direct "globe.gl" dependency is NOT in package.json.**

If it appears, `npm run check:globe` will fail.

## ✅ APPROVED: Local textures

All textures must be local (no remote unpkg/CDN):

```typescript
// ✅ CORRECT
globeImageUrl="/textures/4planet-earth-blue-white-2048.jpg"

// ❌ BANNED: Remote texture
globeImageUrl="https://unpkg.com/three-globe@2.27/example/img/earth-dark.jpg"
```

## ✅ APPROVED: Performance settings

```typescript
// ✅ SAFE defaults
<ReactGlobe
  atmosphereAltitude={0.15}       // Restrained glow
  pointsData={memoizedPoints}     // Memoized
  pointResolution={performanceMode === 'low' ? 8 : 12}
/>
```

No:
- clouds
- arcs
- rings
- polygons
- continuous redraws
- heavy WebGL features

## Guardrail: npm run check:globe

Before every build, a script checks:

1. **No direct "globe.gl" in package.json**
2. **No banned patterns in source code**:
   - `from 'globe.gl'`
   - `import('globe.gl')`
   - `removeChild(`
   - `appendChild(`
   - `innerHTML` for lifecycle

Run manually:
```bash
npm run check:globe
```

If a banned pattern is detected, build will fail.

## If the globe breaks:

1. **Check for removeChild errors** in browser console
2. **Verify react-globe.gl import** is dynamic with `ssr: false`
3. **Ensure no new require() calls** added
4. **Check GlobeView memoization** of pointsData
5. **Review useEffect hooks** for double-mounting

## Migration from old code:

If you have old imperative globe.gl code:

```typescript
// ❌ OLD (BREAKS)
const Globe = (await import('globe.gl')).default;
const globe = Globe({ animateIn: false })(containerRef.current);
globe.controls().autoRotate = true;

// ✅ NEW (WORKS)
import dynamic from 'next/dynamic';
const ReactGlobe = dynamic(() => import('react-globe.gl'), { ssr: false });
const globeRef = useRef(null);
useEffect(() => {
  if (globeRef.current?.controls()) {
    globeRef.current.controls().autoRotate = true;
  }
}, []);
return <ReactGlobe ref={globeRef} {...props} />;
```

## Status

**ENFORCED: All checks must pass before production build.**

Questions? See `/components/atlas/GlobeView.tsx` for reference implementation.

