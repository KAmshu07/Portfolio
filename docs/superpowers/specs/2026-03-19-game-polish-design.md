# Game Polish Design — Portfolio Village

**Date:** 2026-03-19
**Status:** Approved
**Goal:** Elevate the portfolio game from functional prototype to shipped-quality experience targeting Supercell-level studios.

---

## 1. Audio System

### Background Music
- Single looping fantasy village track, royalty-free, ~2MB MP3
- Fades in over ~1s on game start
- **Muted by default** — pixel-art speaker icon in the HUD corner for toggle
- Respects browser autoplay policy (AudioContext created on first user interaction)

### Ambient Layer
- Looping birds/wind/water ambience, ~1MB
- Plays alongside music at lower volume
- Water sound volume increases based on proximity to WATER_Y (distance-based gain)

### Sound Effects
- Footstep ticks on grass (short, quiet, rhythmic with walk cycle)
- Info panel open/close whoosh
- Button click on intro start
- Soft chime when entering a building's proximity zone for the first time
- Water splash on collision with water boundary

### Implementation
- New `js/audio.js` module
- Web Audio API for spatial SFX, `<audio>` elements for music/ambient loops
- Audio files loaded alongside sprite assets via `assets.js` (add audio paths to PATHS, use `new Audio()` instead of `new Image()` based on file extension)
- All audio gated behind first user click (AudioContext resume)

---

## 2. Movement & Particle Effects

### Movement Feel
- Keep instant start/stop (crisp Zelda style) — no acceleration curves
- No changes to SPEED constant or collision system

### Dust Particles
- On movement start: 3-4 small dust puffs behind player feet using `Dust_01.png` spritesheet
- Puffs fade out over ~0.3s (alpha decay)
- On direction change: smaller 1-2 puff burst
- Every N walking frames: single tiny dust mote at foot position for rhythm

### Water Splash
- When player Y-axis collision triggers against WATER_Y: spawn `Water Splash.png` sprite at collision point
- One-shot animation, ~0.4s lifetime
- Only triggers once per collision (not every frame of holding into water)

### Particle System
- New `js/particles.js` module
- Simple array-based object pool, capped at ~50 active particles
- Each particle: `{ x, y, vx, vy, life, maxLife, sprite, frame, frameTimer, scale, alpha }`
- `spawnParticle(type, x, y, opts)` — factory function for dust, splash, leaf types
- `updateParticles()` — called from `main.js update()`, decrements life, applies velocity, advances frames
- Rendered via existing `renderers` dispatch map in `render.js` (new `particle` entry)
- Particles are rendered at their world Y position in the Y-sort (not as overlay)

---

## 3. Environmental Life

### Parallax Clouds
- 4-6 cloud sprites from the 8 available Cloud variants in the asset pack
- Rendered **above** all Y-sorted entities but **below** UI overlays
- Parallax factor: 0.3x camera movement (clouds drift slower than world)
- Additional slow left-to-right autonomous drift (~0.2 px/frame)
- Semi-transparent: alpha ~0.35
- Wrap horizontally when fully off-screen
- Data: array of `{ x, y, asset, speed }` in `world.js`

### Extra Decorations
- 8-10 additional deco sprites placed intentionally along pathways between building clusters
- Use unused deco assets: 02, 03, 05, 06, 07, 08, 09, 10
- Placement: along the path from spawn to projects, between about quarter and spawn, near the river bank
- Added to existing `decos` array in `world.js` with `isStatic: true`
- Rendered through existing `deco` renderer — no new code needed

### NPC Villagers
- 2-3 decorative NPCs using other Tiny Swords unit types:
  - Red Archer patrolling near the castle (projects district)
  - Purple Monk walking near the monastery
  - (Optional) Yellow Lancer near the about quarter
- Each NPC has: `{ x, y, targetX, patrol: [pointA, pointB], asset, frame, timer, facing, speed }`
- Patrols a 2-point path, walks back and forth (100-150px range)
- Uses same sprite animation pattern as player (idle when at endpoint for ~2s, walk between points)
- Y-sorted with all other entities
- Non-collidable — purely decorative, player passes through them
- NPC data in `world.js`, NPC assets added to `assets.js`
- New `npc` renderer in dispatch map
- `updateNPCs()` function in `world.js` (next to `animateWorld()`)

---

## 4. Organic Wayfinding (Ghost of Tsushima Style)

### Design Philosophy
No UI overlays, no minimap, no arrows. The world itself guides the player through environmental cues.

### Guiding Wind Particles
- 8-12 lightweight leaf/petal particles visible at a time
- Canvas-drawn: small colored circles (3-4px) with slight motion trail, no sprite needed
- Drift from player's general area toward the nearest **unvisited** building
- Velocity has a directional bias (tunable: 0 = pure random, 1 = straight line) — start at ~0.3 bias
- Natural float: base random velocity + directional nudge. Should feel like wind, not GPS
- Once all 9 buildings visited: wind becomes ambient (random drift, no target)
- Spawn continuously around the player (~200px radius), despawn after ~3s lifetime

### Visited Building Tracking
- `visitedBuildings` Set added to `state.js`
- Building marked as visited when its info panel content is first shown (`ui.js updatePanel()`)
- Session-only persistence — page refresh resets discovery
- Exported getter: `isAllVisited()` for wind system to check

### Glowing Flowers
- The 6 existing flower decos around the spawn monument
- While unvisited buildings remain: flowers pulse with golden glow (globalAlpha oscillates 0.5→1.0, sine wave, ~2s period)
- Once all buildings visited: flowers go static (normal alpha)
- Visual signal: "there's more to discover"

### Tunability
- Wind bias strength as a constant in `config.js` — easy to adjust or zero out
- Glow pulse can be disabled by setting amplitude to 0
- Both systems degrade gracefully to pure decoration when all buildings visited

---

## 5. UI Transitions & Intro Polish

### Loading Bar
- Pixel-art horizontal progress bar on the intro screen, below the start button
- Small bar (~200px wide, 8px tall) with golden fill color and dark border
- Fills left-to-right synchronized with the existing loading percentage
- Implemented in CSS on the intro screen (not canvas) — div with width transition

### Intro-to-Gameplay Transition
- On clicking "Start": brief camera zoom effect
- Canvas context scales 1.0 → 1.05 → 1.0 over ~0.4s (ease-out-back curve)
- Combined with the existing CSS intro fade-out (0.6s)
- Creates a "diving into the world" sensation

### Building Nameplate Fade
- Each building tracks its own nameplate alpha (0 to 1)
- When player enters proximity: alpha lerps toward 1 at rate ~0.05/frame
- When player leaves: alpha lerps toward 0 at rate ~0.08/frame (slightly faster fade-out)
- Applied to the existing `drawNameplate()` function via `ctx.globalAlpha`
- Requires adding a `nameplateAlpha` property to each building in `world.js`

### Typewriter Effect
- First time each building's info panel content is revealed: text appears character-by-character
- Speed: ~30 characters/second
- Implemented in `ui.js`: on new content, inject empty innerHTML then use `requestAnimationFrame` loop to reveal characters from the full HTML string
- Track which labels have been "typed" in a Set — subsequent visits show content instantly
- Skip animation if player walks away mid-typing (panel closes)

### Zone Announcements (Dark Souls Style)
- 3 zones defined in `config.js` with rectangular boundaries:
  - "About" (north-west, x < 900, y < 800)
  - "Projects" (east, x > 1400, y < 1200)
  - "Contact" (south, y > 1100)
- When player first crosses into a new zone: large text fades in at screen center
- Text style: Press Start 2P font, 16px, golden color, text-shadow
- Animation: fade in 0→1 over 0.5s, hold 1.5s, fade out 1→0 over 0.5s
- Triggered once per zone per session
- Rendered on canvas above entities but below info panel
- `currentZone` and `announcedZones` tracked in `state.js`

---

## 6. Module Changes Summary

### New Modules
| Module | Responsibility |
|---|---|
| `js/audio.js` | Audio loading, playback, mute toggle, distance-based volume |
| `js/particles.js` | Particle pool with spawn/update/render for dust, splash, leaves |

### Modified Modules
| Module | Changes |
|---|---|
| `js/assets.js` | Add dust, splash, cloud, NPC sprite paths. Add audio file paths with type detection. |
| `js/config.js` | Add zone boundary definitions. Add wind bias constant. |
| `js/state.js` | Add `visitedBuildings` Set, `currentZone`, `announcedZones` Set, `isAllVisited()` |
| `js/world.js` | Add cloud data array, extra deco placements, NPC patrol data, `updateNPCs()`, `nameplateAlpha` on buildings |
| `js/player.js` | Spawn dust particles on movement start/change. Trigger splash on water collision. |
| `js/ui.js` | Mark buildings visited on panel open. Typewriter effect. Zone detection + announcement trigger. |
| `js/render.js` | Add cloud layer rendering (post-entities, pre-UI). Add `npc` and `particle` to dispatch map. Nameplate fade via alpha. Zone announcement text. Loading bar (or delegate to CSS). Intro zoom transition. Glowing flowers. |
| `js/main.js` | Init audio on first click. Call `updateParticles()` and `updateNPCs()` in update loop. Spawn wind particles. Update intro zoom state. |
| `index.html` | Add mute button to HUD. Add loading bar div to intro screen. |
| `styles.css` | Style loading bar. Style mute button. |

### Audio Assets Needed (royalty-free)
- `audio/music.mp3` — Fantasy village loop (~2MB)
- `audio/ambient.mp3` — Nature ambience loop (~1MB)
- `audio/footstep.mp3` — Short grass footstep (~10KB)
- `audio/panel-open.mp3` — UI whoosh (~15KB)
- `audio/panel-close.mp3` — UI whoosh reverse (~15KB)
- `audio/click.mp3` — Button click (~5KB)
- `audio/chime.mp3` — Discovery chime (~20KB)
- `audio/splash.mp3` — Water splash (~20KB)

### Sprite Assets to Load (already on disk, currently unused)
- `Dust_01.png`, `Dust_02.png` — footstep dust
- `Water Splash.png` — water collision
- Cloud variants 1-8 — parallax layer
- Deco 02, 03, 05-10 — path decorations
- NPC unit spritesheets (Red Archer, Purple Monk idle/run)

---

## 7. Rendering Order (updated)

1. Ground tiles (grass + water)
2. Shore foam + water rocks
3. Y-sorted entity draw list (buildings, trees, decos, NPCs, fires, sheep, monument, particles, player)
4. **Parallax clouds** (above entities, below UI)
5. **Zone announcement text** (canvas overlay)
6. Proximity indicator arrow
7. Bottom HUD bar
8. (HTML overlays: info panel, HUD, intro screen)

---

## 8. Risk & Tunability

| Feature | Risk | Mitigation |
|---|---|---|
| Guiding wind | May feel too gamey or too subtle | Wind bias is a single constant — tune from 0 (disabled) to 1 (obvious) |
| Typewriter effect | May feel slow for repeat visitors | Instant on revisit. Can reduce chars/sec. |
| NPC pathing | Edge cases at patrol endpoints | Simple 2-point lerp, no pathfinding complexity |
| Audio licensing | Need royalty-free tracks | Use CC0/public domain sources (OpenGameArt, Freesound) |
| Audio file size | Adds ~3-4MB to initial load | Lazy-load audio after game starts (don't block sprite loading) |
| Particle count | Performance on low-end | Capped at 50, canvas-drawn (no sprite overhead for wind leaves) |
