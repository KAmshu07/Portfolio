# Portfolio Game — Domain-Driven Architecture Refactoring

**Date:** 2026-03-21
**Status:** Approved
**Goal:** Refactor the flat-file vanilla JS portfolio game into a proper domain-driven architecture with strict separation of concerns — data separate from logic, no monoliths, clean dependency flow. This codebase will be presented to companies like Supercell; the architecture must demonstrate professional-grade engineering.

---

## 1. Current State

~2,000 lines of vanilla JavaScript across 15 flat files in `/js/`. Canvas 2D game-style interactive portfolio.

### Problems
- **`render.js` (462 lines):** God file — 8 entity renderers, 4 UI layers, 60+ magic constants, viewport culling, Y-sorting all in one file.
- **`world.js` (346 lines):** Static data (buildings, trees, decos, NPCs) mixed with randomization logic, animation ticking, and landmark resolution.
- **State scattered** across 6 files (`state.js`, `ui.js`, `main.js`, `achievements.js`, `wind.js`, `player.js`).
- **`content.js`:** Portfolio content as hardcoded HTML strings — fine as data, but lives in wrong location.
- **Collision constants** owned by `npc.js` but imported by `player.js` — no shared physics module.
- **No folder hierarchy** — everything flat in `/js/`.
- **Zone definitions** have inline `test()` functions in config — data mixed with logic.
- **Achievement definitions** have inline `condition()` functions — data mixed with logic.

### What works well (preserve)
- ES6 module exports — clean import/export boundaries
- Functional approach — no unnecessary classes
- Data-driven NPC waypoints with landmark references
- Particle pool pattern
- Asset loading abstraction
- Y-sort dispatch map pattern in render.js

---

## 2. Target Architecture

### Approach: Domain-Driven Game Architecture

Organize by domain: each folder owns a single responsibility. Data is inert. Logic reads data. Rendering is read-only.

### Folder Structure

```
js/
├── core/                    ← Engine fundamentals (no game-specific logic)
│   ├── Canvas.js            ← Canvas element, ctx, viewport, resize
│   ├── Input.js             ← Keyboard state management
│   ├── Camera.js            ← Camera follow + intro pan + zoom
│   └── Game.js              ← Game loop, state machine (INTRO/PLAYING), init
│
├── data/                    ← Pure static data — ZERO functions, ZERO imports
│   ├── assetPaths.js        ← { idle: 'Assets/...', house1: '...' }
│   ├── audioPaths.js        ← { music: { src, loop, volume }, ... }
│   ├── buildings.js         ← Position, size, asset, label for each building
│   ├── treeSpots.js         ← Coordinates + fade configs
│   ├── decorations.js       ← Flower positions, path decos, bush/rock generation params
│   ├── npcDefinitions.js    ← Waypoints (landmark keys), assets, speed per NPC
│   ├── terrain.js           ← waterRocks, foamSpots, monument, fires, sheep, clouds
│   ├── zones.js             ← Zone names + boundary conditions as data
│   ├── achievements.js      ← Declarative: { id, title, desc, type, params }
│   └── content.js           ← Portfolio HTML strings per building label
│
├── entities/                ← Entity behavior — logic only, reads data
│   ├── Player.js            ← Movement, collision response, animation state
│   └── NPC.js               ← AI state machine (idle/walk/chat), waypoint movement
│
├── world/                   ← World assembly & spatial logic
│   ├── WorldBuilder.js      ← Assembles trees/decos from data (randomization lives here)
│   └── Collision.js         ← Shared collision constants + AABB helpers
│
├── systems/                 ← Independent game systems
│   ├── AssetLoader.js       ← Image loading with progress callback
│   ├── AudioSystem.js       ← AudioContext, play, loops, mute
│   ├── ParticleSystem.js    ← Particle pool, spawn, update
│   ├── WindSystem.js        ← Direction, guidance pulse, leaf spawning
│   └── AchievementSystem.js ← Condition evaluation, completion tracking, toast queue
│
├── rendering/               ← Canvas rendering pipeline (READ-ONLY — never mutates game state)
│   ├── RenderConfig.js      ← ALL render constants (colors, fonts, sizes, culling margins)
│   ├── Renderer.js          ← Orchestrator: ground tiles, Y-sort assembly, dispatch
│   ├── EntityRenderers.js   ← Per-type draw functions (building, tree, NPC, player, etc.)
│   ├── HUD.js               ← Bottom bar, nameplates, proximity indicator
│   ├── Overlays.js          ← Zone announcement, achievement toast
│   └── Clouds.js            ← Parallax cloud layer
│
├── ui/                      ← DOM-based overlays (never draws to canvas)
│   ├── InfoPanel.js         ← Building proximity → panel show/hide
│   ├── ScrollOverlay.js     ← Resume scroll (E key)
│   ├── AchievePanel.js      ← Tab achievement checklist
│   └── IntroScreen.js       ← Loading bar, start button, intro state
│
├── utils/                   ← Shared pure helpers
│   └── sprites.js           ← drawFrame, drawImg
│
└── main.js                  ← Entry point: creates Game, kicks off
```

---

## 3. Data Separation Rules

### Rule: data/ files are inert
- **No `import` statements** — if you see an import in `data/`, something is wrong
- **No functions** — no `test()`, no `condition()`, no `Math.random()`
- **No computed values** — no `buildings[3].x + buildings[3].w / 2`
- Export only plain objects, arrays, strings, numbers

### Key transformations

**Zones** — from functions to boundary data:
```js
// BEFORE (config.js)
{ name: 'The Archives', test: (x, y) => x < 900 && y < 800 }

// AFTER (data/zones.js)
{ name: 'The Archives', bounds: { maxX: 900, maxY: 800 } }
```

**Achievements** — from inline conditions to declarative types:
```js
// BEFORE (achievements.js)
{ id: 'archives', condition: () => ['BIO','SKILLS','TECH'].every(l => visited.has(l)) }

// AFTER (data/achievements.js)
{ id: 'archives', type: 'visitAll', buildings: ['BIO', 'SKILLS', 'TECH'] }
```

**NPC waypoints** — from index references to landmark keys:
```js
// BEFORE (world.js)
{ x: buildings[3].x + buildings[3].w + 30, y: buildings[3].y + buildings[3].h + 30, idle: 80 }

// AFTER (data/npcDefinitions.js)
{ landmark: 'castle', offsetX: 30, offsetY: 30, idle: 80 }
```
WorldBuilder resolves landmark keys → absolute coordinates using a landmarks map built from buildings data.

**Audio** — from hardcoded init to config:
```js
// BEFORE (audio.js)
loadAudio('music', 'audio/music.mp3', { loop: true, volume: 0.25 });

// AFTER (data/audioPaths.js)
export const audioPaths = [
  { key: 'music', src: 'audio/music.mp3', loop: true, volume: 0.25 },
  ...
];
```

---

## 4. Dependency Flow

```
data/  ←── imports NOTHING
utils/ ←── imports NOTHING
core/  ←── imports nothing game-specific (only utils/)
world/ ←── imports data/ + core/
entities/ ←── imports world/ + core/ + systems/
systems/ ←── imports core/ + data/ + entities/ (where needed)
rendering/ ←── imports everything above (READ-ONLY)
ui/ ←── imports core/ + entities/ + systems/
main.js ←── imports core/Game.js
```

### Constraints
- `rendering/` NEVER mutates game state
- `data/` has ZERO import statements
- `entities/` NEVER touches DOM
- `systems/` NEVER touches DOM or canvas
- `ui/` NEVER draws to canvas

---

## 5. Phased Implementation

Each phase produces a compilable, runnable game. Commit after each.

### Phase 1: Extract data layer + render constants + utils
- Create all folder directories
- Extract pure data files from world.js, config.js, assets.js, content.js, achievements.js, audio.js
- Move render constants to rendering/RenderConfig.js
- Move sprites.js to utils/sprites.js
- Update all imports in consuming files
- **Verify:** Game loads and plays identically
- **Commit:** `refactor: extract data layer and render constants`

### Phase 2: Extract core engine modules
- Canvas.js from config.js (canvas, ctx, viewport, resize)
- Input.js from state.js + main.js (keys object, event listeners)
- Camera.js from state.js + main.js (camera state, follow logic, intro pan/zoom)
- **Verify:** Game loads and plays identically
- **Commit:** `refactor: extract core engine modules`

### Phase 3: Extract world builder and collision
- WorldBuilder.js: move randomization (tree asset selection, bush/rock placement) from data
- WorldBuilder.js: landmark resolution — build landmarks map from buildings, resolve NPC waypoints
- Collision.js: shared constants (COLLISION_X_INSET etc.) + AABB check function
- **Verify:** Game loads and plays identically
- **Commit:** `refactor: extract world builder and collision`

### Phase 4: Extract independent game systems
- AssetLoader.js from assets.js (loading logic, IMG dict)
- AudioSystem.js from audio.js (AudioContext, play, loops, mute)
- ParticleSystem.js from particles.js (pool, spawn, update, draw)
- WindSystem.js from wind.js (direction, guidance, leaf spawning)
- AchievementSystem.js from achievements.js (condition interpreter, completion, toast queue)
- **Verify:** Game loads and plays identically
- **Commit:** `refactor: extract independent game systems`

### Phase 5: Extract entity modules
- Player.js to entities/ (movement, collision, animation, drawing)
- NPC.js to entities/ (AI state machine, waypoint movement, meetings)
- **Verify:** Game loads and plays identically
- **Commit:** `refactor: extract entity modules`

### Phase 6: Split render pipeline
- Renderer.js: ground tiles, Y-sort assembly, dispatch loop
- EntityRenderers.js: per-type draw functions (building, tree, NPC, player, deco, monument, fire, sheep, particle)
- HUD.js: bottom bar, nameplates, proximity indicator
- Overlays.js: zone announcement, achievement toast
- Clouds.js: parallax cloud layer
- **Verify:** Game loads and renders identically
- **Commit:** `refactor: split render pipeline into layers`

### Phase 7: Extract UI modules and clean entry point
- InfoPanel.js: building proximity detection, panel show/hide, content injection
- ScrollOverlay.js: resume scroll toggle (E key)
- AchievePanel.js: achievement checklist panel (Tab key)
- IntroScreen.js: loading bar, start button
- Game.js: game loop, state transitions, update orchestration
- main.js: thin entry point that creates Game
- **Verify:** Game loads and plays identically
- **Commit:** `refactor: extract UI modules and clean entry point`

### Phase 8: Remove legacy files and final audit
- Delete all old flat js/ files that have been fully migrated
- Import audit: verify no circular dependencies, no data/ imports
- Verify rendering/ never mutates state
- Verify data/ has zero imports
- Full playthrough test
- **Commit:** `refactor: remove legacy flat files`

---

## 6. Style Decisions

- **Functional approach preserved** — no classes unless they genuinely improve clarity
- **camelCase** for variables/functions, **UPPER_SNAKE_CASE** for constants
- **No comments on obvious code** — let the architecture speak
- **Each file under ~150 lines** — if it grows past that, it's doing too much
- **Named exports only** — no default exports (better for refactoring/grep)
