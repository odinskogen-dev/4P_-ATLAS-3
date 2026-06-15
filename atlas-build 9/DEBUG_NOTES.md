# 4PLANET ATLAS — Debug Notes

## Current Status (v2.6)

✅ **Runtime**: Stable and working  
✅ **Globe**: react-globe.gl implementation  
✅ **Build**: Passes consistently  
✅ **Texture**: Real Earth-like texture with proper continents  
✅ **Mobile**: Functional and responsive  

---

## If Globe Fails to Load

### Error: "Failed to execute 'removeChild'"

**This was the v2.4 error — should not happen in v2.5+**

**If it returns**:
1. Check that `GlobeView.tsx` uses `dynamic(() => import('react-globe.gl'), { ssr: false })`
2. Ensure no imperative globe.gl code exists
3. Run `npm run check:globe` — should pass
4. Check browser console for full error

### Error: WebGL not supported

Globe will fallback to node list view. This is acceptable.

Users can still:
- See node list
- Click nodes to inspect
- Toggle layers
- Read intelligence

---

## Performance Debugging

### Globe Rendering Slow

1. **Check performance mode**:
   - Should default to 'standard' (not 'low')
   - Desktop performance mode toggle available
   - Mobile has auto-detection

2. **Check point count**:
   - Should only render visible layer nodes
   - Not all 23 nodes at once
   - Check `activeLayers` filter

3. **Check mobile viewport**:
   - Mobile may run in 'low' mode automatically
   - Point resolution: 8 (low) vs 12 (standard)
   - Atmosphere altitude: 0.15 (restrained)

### Mobile Bottom Sheet Scrolling Slow

1. Check `WebkitOverflowScrolling: 'touch'` is set
2. Verify content is not too tall (62dvh max)
3. Check for JS overhead in scroll event listeners

### First Load Slow

1. Texture should load quickly (244 KB)
2. Check network in DevTools
3. Verify Cloudflare caching is enabled
4. Check bundle size with `npm run build` output

---

## Common Issues & Fixes

### "Cannot find module 'react-globe.gl'"

```bash
npm install
npm run check:globe
npm run build
```

### Package Lock Out of Sync

```bash
rm package-lock.json
npm install
npm run check:globe
```

### Texture Not Loading (404)

1. Verify file exists: `/public/textures/4planet-earth-blue-white-2048.jpg`
2. Check Cloudflare Pages serving `/public/*` correctly
3. Check browser Network tab for texture request
4. Check MIME type is `image/jpeg`

### Mobile Layout Broken

1. Check viewport width detection (768px breakpoint)
2. Test actual mobile device, not just browser responsive mode
3. Check safe-area-inset CSS variables work (iOS Safari)
4. Verify `MobileBottomSheet` maxHeight is `62dvh`, not `85vh`

### Routes Not Scrolling

1. Verify `globals.css` has `html, body { min-height: 100%; overflow-x: hidden; }`
2. Check `.atlas-shell` class has `overflow: hidden` only
3. Support pages should NOT have `overflow: hidden`

---

## Build Debugging

### npm run build Fails

1. Run `npm run check:globe` first
2. Look for "BANNED PATTERN" messages
3. Check for any `require()` in components (should be static imports)
4. Verify no new direct globe.gl imports added

### Build Succeeds But Page Blank

1. Check `npm run dev` locally
2. Check browser console for JS errors
3. Verify `/` route renders AtlasApp
4. Check `out/index.html` exists

### Build Succeeds But Globe Doesn't Load

1. Check texture is served (`/textures/...` request in Network tab)
2. Check react-globe.gl loads (should see <Globe> component)
3. Check browser console for WebGL errors
4. Fall back to node list if WebGL unavailable

---

## Testing Checklist

Before deployment:

- [ ] `npm run check:globe` passes
- [ ] `npm run build` passes
- [ ] `npm run dev` loads locally
- [ ] Globe renders on `/`
- [ ] Globe is brand-blue ocean + white land
- [ ] Mobile (<768px) responsive
- [ ] No console errors
- [ ] `/missions` scrolls
- [ ] `/partners` scrolls
- [ ] `/sources` scrolls

---

## Monitoring Production

### CloudFlare Pages Dashboard

Watch for:
- Build failures (check build output)
- DNS issues (should resolve to Pages domain)
- Cache hits (should be >80% for static files)

### Browser Console (Production)

Check periodically:
- No JS errors on `/`
- No 404s on `/textures/...`
- No WebGL errors in console
- Smooth frame rate (60 FPS desktop, 50+ FPS mobile)

### User Reports

Most common issues:
- Black screen = WebGL not supported (fallback shows node list)
- Slow loading = Network throttling or Cloudflare cache miss
- Mobile layout broken = Browser version issue (iOS <14, Android <5)
- Blur on node select = Only in v2.4 (fixed in v2.5+)

---

## Version History

| Version | Status | Notes |
|---------|--------|-------|
| v2.4 | Stable | Mobile blur issue, fake Earth texture |
| v2.5 | Stable | Fixed blur, local texture (blob-based) |
| v2.6 | Current | Realistic Earth texture, enhanced checks |

---

## Next Steps (v2.7+)

- Real satellite Earth texture
- Mission arcs on globe
- Database integration
- Real-time partner APIs
- Advanced spatial filters

