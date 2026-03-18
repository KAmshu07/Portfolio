# Game Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the portfolio game from functional prototype to shipped-quality with audio, particles, NPCs, parallax clouds, organic wayfinding, and polished UI transitions.

**Architecture:** Additive changes to existing ES module architecture. Two new modules (`particles.js`, `audio.js`) follow the same pattern as existing modules. All other changes extend existing files. Rendering uses the established dispatch map pattern.

**Tech Stack:** Vanilla JS ES modules, Canvas 2D API, Web Audio API. No build tools or bundler.

**Spec:** `docs/superpowers/specs/2026-03-19-game-polish-design.md`

**Note:** This is a browser-based canvas game with no test framework. Verification is manual — run `npx serve .` and check in browser. Each task ends with specific visual/audio verification steps.

---

### Task 1: Foundation — State & Config Extensions

**Files:**
- Modify: `js/state.js`
- Modify: `js/config.js`

- [ ] **Step 1: Replace state.js with visited tracking, zone state, and intro zoom**

Replace the entire contents of `js/state.js` with:

```js
/* Shared mutable game state */
export let mode = 'INTRO';
export function setMode(m) { mode = m; }

export const camera = { x: 0, y: 0 };
export const keys = {};

// Visited building tracking (session-only)
export const visitedBuildings = new Set();
export function isAllVisited() { return visitedBuildings.size >= 9; }

// Zone announcements
export const announcedZones = new Set();
export let currentZone = null;
export function setCurrentZone(z) { currentZone = z; }

// Intro zoom
export const introZoom = { scale: 1, active: false, startTime: 0 };
```

- [ ] **Step 2: Replace config.js with zones and wind bias**

Replace the entire contents of `js/config.js` with:

```js
/* Constants, canvas, and viewport */
export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');

export const SPEED = 2.5;
export const WORLD_W = 2800;
export const WORLD_H = 2000;
export const TILE = 64;
export const PSCALE = 0.5;
export const WATER_Y = 1650;

export const viewport = { w: 0, h: 0 };

export function resize() {
    viewport.w = canvas.width = innerWidth;
    viewport.h = canvas.height = innerHeight;
    ctx.imageSmoothingEnabled = false;
}

// Wind wayfinding bias (0 = pure random, 1 = direct line)
export const WIND_BIAS = 0.3;

// Zone boundaries for Dark Souls announcements
export const ZONES = [
    { name: 'The Archives',       test: (x, y) => x < 900 && y < 800 },
    { name: 'Projects District',  test: (x, y) => x > 1400 && y < 1200 },
    { name: 'The Crossing',       test: (x, y) => y > 1200 },
];
```

- [ ] **Step 3: Commit**

```bash
git add js/state.js js/config.js
git commit -m "Add visited tracking, zone boundaries, wind bias to state/config"
```

**Verify:** No visual changes. Game loads and plays as before. Check browser console for zero errors.

---

### Task 2: Particle System Module

**Files:**
- Create: `js/particles.js`

- [ ] **Step 1: Create particle pool module**

```js
/* Particle pool — spawn, update, render */
import { ctx } from './config.js';
import { IMG } from './assets.js';
import { drawFrame } from './sprites.js';

const MAX_PARTICLES = 50;
const pool = [];

export function spawnParticle(type, x, y, opts = {}) {
    const p = {
        x, y,
        vx: opts.vx ?? (Math.random() - 0.5) * 2,
        vy: opts.vy ?? -Math.random() * 1.5,
        life: opts.life ?? 30,
        maxLife: opts.life ?? 30,
        type,
        frame: 0, frameTimer: 0,
        scale: opts.scale ?? 0.5,
        alpha: opts.alpha ?? 1,
    };
    if (pool.length >= MAX_PARTICLES) pool.shift();
    pool.push(p);
    return p;
}

export function updateParticles() {
    for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha = Math.max(0, p.life / p.maxLife);

        // Animate sprite-based particles
        if (p.type === 'dust' || p.type === 'splash') {
            p.frameTimer++;
            if (p.frameTimer >= 4) { p.frameTimer = 0; p.frame = (p.frame + 1) % 8; }
        }

        if (p.life <= 0) { pool.splice(i, 1); }
    }
}

export function getParticles() { return pool; }

export function drawParticle(item) {
    const p = item.data;
    ctx.globalAlpha = p.alpha;
    if (p.type === 'dust' && IMG.dust1) {
        drawFrame(IMG.dust1, p.frame, 64, 64, item.sx, item.sy, p.scale, false);
    } else if (p.type === 'splash' && IMG.splash) {
        drawFrame(IMG.splash, p.frame, 64, 64, item.sx, item.sy, p.scale, false);
    } else if (p.type === 'leaf') {
        // Canvas-drawn leaf particle (no sprite)
        ctx.fillStyle = '#8ab648';
        ctx.beginPath();
        ctx.arc(item.sx, item.sy, 2 * p.scale, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}
```

- [ ] **Step 2: Commit**

```bash
git add js/particles.js
git commit -m "Add particle pool module with dust, splash, leaf types"
```

**Verify:** Module loads without errors (imported but not yet called). No visual changes.

---

### Task 3: Assets Expansion

**Files:**
- Modify: `js/assets.js` — add new sprite paths after existing entries

- [ ] **Step 1: Add dust, splash, cloud, NPC, and extra deco paths to PATHS**

Add these entries to the PATHS object in `assets.js`, grouped by category:

```js
    // Particle effects
    dust1:   'Assets/Tiny Swords (Free Pack)/Particle FX/Dust_01.png',
    dust2:   'Assets/Tiny Swords (Free Pack)/Particle FX/Dust_02.png',
    splash:  'Assets/Tiny Swords (Free Pack)/Particle FX/Water Splash.png',
    // Clouds
    cloud1:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_01.png',
    cloud2:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_02.png',
    cloud3:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_03.png',
    cloud4:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_04.png',
    cloud5:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_05.png',
    // NPC units
    archerIdle: 'Assets/Tiny Swords (Free Pack)/Units/Red Units/Archer/Archer_Idle.png',
    archerRun:  'Assets/Tiny Swords (Free Pack)/Units/Red Units/Archer/Archer_Run.png',
    monkIdle:   'Assets/Tiny Swords (Free Pack)/Units/Purple Units/Monk/Idle.png',
    monkRun:    'Assets/Tiny Swords (Free Pack)/Units/Purple Units/Monk/Run.png',
    // Extra decorations
    deco02:  'Assets/Tiny Swords (Update 010)/Deco/02.png',
    deco03:  'Assets/Tiny Swords (Update 010)/Deco/03.png',
    deco05:  'Assets/Tiny Swords (Update 010)/Deco/05.png',
    deco06:  'Assets/Tiny Swords (Update 010)/Deco/06.png',
    deco07:  'Assets/Tiny Swords (Update 010)/Deco/07.png',
    deco08:  'Assets/Tiny Swords (Update 010)/Deco/08.png',
```

- [ ] **Step 2: Commit**

```bash
git add js/assets.js
git commit -m "Add dust, splash, cloud, NPC, deco asset paths"
```

**Verify:** Game loads. Loading percentage goes to 100%. Check console — no "Failed:" warnings for any new asset paths.

---

### Task 4: Extra Decorations

**Files:**
- Modify: `js/world.js` — add intentional deco placements after the rocks section (line 89)

- [ ] **Step 1: Add path decorations between building clusters**

Insert after the rocks `for` loop (before the monument line) in `world.js`:

```js
// Path decorations (intentionally placed)
[
    { x: 900,  y: 500,  asset: 'deco02', scale: 0.8 },
    { x: 1050, y: 600,  asset: 'deco03', scale: 0.7 },
    { x: 1350, y: 550,  asset: 'deco05', scale: 0.6 },
    { x: 800,  y: 750,  asset: 'deco06', scale: 0.7 },
    { x: 450,  y: 800,  asset: 'deco07', scale: 0.6 },
    { x: 1100, y: 1000, asset: 'deco08', scale: 0.7 },
    { x: 700,  y: 1200, asset: 'deco02', scale: 0.6 },
    { x: 1300, y: 1300, asset: 'deco03', scale: 0.7 },
].forEach(d => {
    decos.push({ x: d.x, y: d.y, asset: d.asset, frame: 0, timer: 0, isStatic: true, scale: d.scale });
});
```

- [ ] **Step 2: Commit**

```bash
git add js/world.js
git commit -m "Add intentional path decorations between building clusters"
```

**Verify:** Walk around — new deco sprites visible along paths between About quarter, spawn, and Projects district. They render correctly through the existing deco renderer.

---

### Task 5: NPC Villagers

**Files:**
- Modify: `js/world.js` — add NPC data + updateNPCs()
- Modify: `js/render.js` — add `npc` renderer to dispatch map + NPCs in draw list
- Modify: `js/main.js` — call updateNPCs() in update loop

- [ ] **Step 1: Add NPC data and update function to world.js**

Add after the `foamSpots` export (before `animateWorld`):

```js
// NPC villagers (decorative, non-collidable)
export const npcs = [
    {
        x: 1700, y: 580, patrolA: 1650, patrolB: 1800,
        idleAsset: 'archerIdle', runAsset: 'archerRun',
        frame: 0, timer: 0, facing: 1, speed: 0.8,
        state: 'walk', idleTimer: 0,
    },
    {
        x: 2250, y: 1100, patrolA: 2200, patrolB: 2350,
        idleAsset: 'monkIdle', runAsset: 'monkRun',
        frame: 0, timer: 0, facing: 1, speed: 0.6,
        state: 'walk', idleTimer: 0,
    },
];

export function updateNPCs() {
    for (const npc of npcs) {
        if (npc.state === 'idle') {
            npc.idleTimer++;
            npc.timer++; if (npc.timer >= 10) { npc.timer = 0; npc.frame = (npc.frame + 1) % 8; }
            if (npc.idleTimer > 120) { npc.state = 'walk'; npc.idleTimer = 0; }
        } else {
            // Walk toward patrol endpoint
            const target = npc.facing === 1 ? npc.patrolB : npc.patrolA;
            npc.x += npc.speed * npc.facing;
            npc.timer++; if (npc.timer >= 6) { npc.timer = 0; npc.frame = (npc.frame + 1) % 6; }
            if ((npc.facing === 1 && npc.x >= target) || (npc.facing === -1 && npc.x <= target)) {
                npc.state = 'idle'; npc.facing *= -1; npc.frame = 0;
            }
        }
    }
}
```

- [ ] **Step 2: Add `npc` renderer to render.js dispatch map**

Import `npcs` from world.js (add to existing import line 6). Add `npc` renderer to the `renderers` object:

```js
    npc(item) {
        const n = item.data;
        const img = n.state === 'walk' ? IMG[n.runAsset] : IMG[n.idleAsset];
        if (!img) return;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(item.sx + 48, item.sy + 88, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        drawFrame(img, n.frame, 192, 192, item.sx, item.sy, 0.5, n.facing === -1);
    },
```

Add NPCs to the draw list assembly (after fires, before sheep):

```js
    for (const n of npcs) {
        const sx = n.x + ox, sy = n.y + oy;
        if (inView(sx, sy, 150)) drawList.push({ y: n.y + 90, type: 'npc', data: n, sx, sy });
    }
```

- [ ] **Step 3: Call updateNPCs() in main.js**

Import `updateNPCs` from world.js (add to existing import line 6). Call it in `update()` after `animateWorld()` on line 56:

```js
    animateWorld();
    updateNPCs();
    updatePanel();
```

Also call it in the INTRO branch (line 43) so NPCs move during the intro camera pan:

```js
        animateWorld();
        updateNPCs();
        return;
```

- [ ] **Step 4: Commit**

```bash
git add js/world.js js/render.js js/main.js
git commit -m "Add NPC villagers with patrol behavior near castle and monastery"
```

**Verify:** Red Archer walks back and forth near the castle. Purple Monk patrols near the monastery. Both have shadows, face the correct direction, pause at endpoints. Y-sorted correctly with buildings and trees.

---

### Task 6: Parallax Clouds

**Files:**
- Modify: `js/world.js` — add cloud data
- Modify: `js/render.js` — add cloud rendering after Y-sorted entities

- [ ] **Step 1: Add cloud data to world.js**

Add after the `npcs` export:

```js
// Parallax clouds (rendered above entities)
export const clouds = [
    { x: 200,  y: 100,  asset: 'cloud1', speed: 0.15 },
    { x: 900,  y: 300,  asset: 'cloud2', speed: 0.2 },
    { x: 1600, y: 50,   asset: 'cloud3', speed: 0.12 },
    { x: 2300, y: 250,  asset: 'cloud4', speed: 0.18 },
    { x: 500,  y: 500,  asset: 'cloud5', speed: 0.22 },
];
```

- [ ] **Step 2: Add cloud rendering to render.js**

Import `clouds` from world.js. Add a `drawClouds` function and call it after the Y-sort dispatch (after line 204, before the overlays):

```js
/* ─── Parallax clouds ─── */
function drawClouds(ox, oy, now) {
    ctx.globalAlpha = 0.35;
    for (const c of clouds) {
        const drift = (now * 0.003 * c.speed) % (WORLD_W + 400);
        const cx = (c.x + drift) % (WORLD_W + 400) - 200;
        const sx = cx + ox * 0.3;
        const sy = c.y + oy * 0.3;
        if (IMG[c.asset]) drawImg(IMG[c.asset], sx, sy, 1.0);
    }
    ctx.globalAlpha = 1;
}
```

Call `drawClouds(ox, oy, now)` after line 204 (after the Y-sort loop, before overlays).

- [ ] **Step 3: Commit**

```bash
git add js/world.js js/render.js
git commit -m "Add parallax cloud layer drifting above entities"
```

**Verify:** 5 semi-transparent clouds drift slowly left-to-right above buildings and trees. They move at 0.3x parallax speed relative to the camera. They wrap around.

---

### Task 7: Dust & Splash Particles

**Files:**
- Modify: `js/player.js` — spawn dust on movement, splash on water collision
- Modify: `js/render.js` — add particles to draw list + import drawParticle
- Modify: `js/main.js` — call updateParticles()

- [ ] **Step 1: Add dust spawning to player.js**

Import `spawnParticle` from particles.js. Add tracking state to player object: `wasWalking: false, lastFacing: 1`. After the walking state is computed (line 21) but before collision:

```js
    // Dust on movement start or direction change
    if (player.walking && !player.wasWalking) {
        for (let i = 0; i < 3; i++) {
            spawnParticle('dust', player.x + player.w / 2 + (Math.random() - 0.5) * 10,
                player.y + player.h, { vx: -mx * 0.5 + (Math.random() - 0.5), vy: -0.5 - Math.random(), life: 20, scale: 0.4 });
        }
    }
    if (player.walking && player.facing !== player.lastFacing) {
        spawnParticle('dust', player.x + player.w / 2, player.y + player.h,
            { vx: -player.facing * 1.5, vy: -0.8, life: 15, scale: 0.3 });
    }
    player.wasWalking = player.walking;
    player.lastFacing = player.facing;
```

After the water collision check (line 33), add splash trigger:

```js
    // Water splash on collision
    if (ny + player.h > WATER_Y && !player.splashed) {
        spawnParticle('splash', player.x + player.w / 2, WATER_Y - 10,
            { vx: 0, vy: -0.5, life: 25, scale: 0.6 });
        player.splashed = true;
    }
    if (ny + player.h <= WATER_Y) player.splashed = false;
```

Add `wasWalking: false, lastFacing: 1, splashed: false` to the player object.

- [ ] **Step 2: Add particles to render.js draw list**

Import `{ getParticles, drawParticle }` from particles.js. Add `particle` to the renderers map:

```js
    particle: drawParticle,
```

Add particles to the draw list assembly (after player push, before sort):

```js
    for (const p of getParticles()) {
        const sx = p.x + ox, sy = p.y + oy;
        drawList.push({ y: p.y, type: 'particle', data: p, sx, sy });
    }
```

- [ ] **Step 3: Call updateParticles() in main.js**

Import `{ updateParticles }` from particles.js. Call after `updatePlayer()` in the PLAYING update branch:

```js
    updatePlayer();
    updateParticles();
```

- [ ] **Step 4: Commit**

```bash
git add js/player.js js/render.js js/main.js
git commit -m "Add dust particles on movement and water splash on collision"
```

**Verify:** Walk around — small dust puffs appear behind the player when starting to move and on direction changes. Walk into the water boundary — splash sprite plays once. No particles when standing still.

---

### Task 8: Wayfinding — Visited Tracking + Guiding Wind + Glowing Flowers

**Files:**
- Modify: `js/ui.js` — mark buildings visited on panel open
- Modify: `js/main.js` — spawn wind leaf particles each frame
- Modify: `js/render.js` — glowing flower effect on deco renderer

- [ ] **Step 1: Mark buildings visited in ui.js**

Import `{ visitedBuildings }` from state.js. In `updatePanel()`, when content is shown for the first time (inside the `if (data)` block at line 33):

```js
            if (data) {
                infoPanelInner.innerHTML = data.content;
                visitedBuildings.add(cachedNearB.label);
            }
```

- [ ] **Step 2: Add wind leaf spawning in main.js**

Import `{ visitedBuildings, isAllVisited }` from state.js, `{ WIND_BIAS }` from config.js, `{ spawnParticle }` from particles.js, and `{ buildings }` from world.js.

Add a wind spawning function called every ~10 frames during PLAYING:

```js
let windTimer = 0;
function spawnWindLeaves() {
    windTimer++;
    if (windTimer < 10) return;
    windTimer = 0;

    // Find nearest unvisited building
    let target = null;
    if (!isAllVisited()) {
        let minDist = Infinity;
        for (const b of buildings) {
            if (visitedBuildings.has(b.label)) continue;
            const dx = (b.x + b.w / 2) - player.x;
            const dy = (b.y + b.h / 2) - player.y;
            const d = dx * dx + dy * dy;
            if (d < minDist) { minDist = d; target = { x: b.x + b.w / 2, y: b.y + b.h / 2 }; }
        }
    }

    // Spawn 1-2 leaves near player
    for (let i = 0; i < 2; i++) {
        const sx = player.x + (Math.random() - 0.5) * 400;
        const sy = player.y + (Math.random() - 0.5) * 300;
        let vx = (Math.random() - 0.5) * 1.5;
        let vy = (Math.random() - 0.5) * 1.0;
        if (target) {
            const dx = target.x - sx, dy = target.y - sy;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            vx += (dx / len) * WIND_BIAS * 1.5;
            vy += (dy / len) * WIND_BIAS * 1.0;
        }
        spawnParticle('leaf', sx, sy, { vx, vy, life: 90, scale: 1 + Math.random(), alpha: 0.6 });
    }
}
```

Call `spawnWindLeaves()` at the end of the PLAYING update branch (after `updatePanel()`).

- [ ] **Step 3: Add glowing flower effect in render.js deco renderer**

Import `{ isAllVisited }` from state.js. Modify the `deco` renderer — for flower assets (`deco01`, `deco04`) near the monument, add a glow pulse when unvisited buildings remain:

```js
    deco(item) {
        const d = item.data;
        // Glowing flowers when unvisited buildings remain
        if (!isAllVisited() && (d.asset === 'deco01' || d.asset === 'deco04') && d.scale === 1.0) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.003);
            ctx.globalAlpha = 0.5 + pulse * 0.5;
        }
        if (d.isStatic) {
            if (IMG[d.asset]) drawImg(IMG[d.asset], item.sx, item.sy, d.scale || 0.8);
        } else {
            if (IMG[d.asset]) drawFrame(IMG[d.asset], d.frame, 128, 128, item.sx, item.sy, d.scale || 0.6, false);
        }
        ctx.globalAlpha = 1;
    },
```

- [ ] **Step 4: Commit**

```bash
git add js/ui.js js/main.js js/render.js
git commit -m "Add wayfinding wind particles, visited tracking, glowing flowers"
```

**Verify:** Walk around — small green leaf particles drift subtly toward the nearest unvisited building. Approach a building, read its panel — that building is now visited. Leaves redirect toward the next unvisited building. Flowers near monument pulse with golden glow. Visit all 9 buildings — leaves become ambient (random drift), flowers stop pulsing.

---

### Task 9: Nameplate Fade + Zone Announcements

**Files:**
- Modify: `js/world.js` — add `nameplateAlpha` to buildings
- Modify: `js/render.js` — fade nameplates, draw zone text
- Modify: `js/ui.js` — detect zone changes
- Modify: `js/main.js` — update nameplate alphas

- [ ] **Step 1: Add nameplateAlpha to buildings in world.js**

Add `nameplateAlpha: 0` to each building object in the array.

- [ ] **Step 2: Update nameplate alphas in main.js**

Import `buildings` from world.js (already available via other imports). In the PLAYING update branch, after `updatePanel()`:

```js
    // Nameplate fade
    const nearB = getNearBuilding();
    for (const b of buildings) {
        if (nearB && b.label === nearB.label) {
            b.nameplateAlpha = Math.min(1, b.nameplateAlpha + 0.05);
        } else {
            b.nameplateAlpha = Math.max(0, b.nameplateAlpha - 0.08);
        }
    }
```

Import `getNearBuilding` from ui.js.

- [ ] **Step 3: Apply alpha in render.js drawNameplate**

Modify the building renderer to pass alpha:

```js
    building(item) {
        const b = item.data;
        if (IMG[b.asset]) drawImg(IMG[b.asset], item.sx, item.sy, 1.0);
        if (b.nameplateAlpha > 0.01) {
            ctx.globalAlpha = b.nameplateAlpha;
            drawNameplate(b.label, item.sx + b.w / 2, item.sy - 12);
            ctx.globalAlpha = 1;
        }
    },
```

- [ ] **Step 4: Add zone detection to ui.js**

Import `{ ZONES }` from config.js and `{ currentZone, setCurrentZone, announcedZones }` from state.js and `{ player }` from player.js.

Add and export a zone detection function:

```js
export const zoneAnnouncement = { text: '', alpha: 0, startTime: 0, active: false };

export function updateZone() {
    for (const zone of ZONES) {
        if (zone.test(player.x, player.y)) {
            if (currentZone !== zone.name) {
                setCurrentZone(zone.name);
                if (!announcedZones.has(zone.name)) {
                    announcedZones.add(zone.name);
                    zoneAnnouncement.text = zone.name;
                    zoneAnnouncement.alpha = 0;
                    zoneAnnouncement.startTime = Date.now();
                    zoneAnnouncement.active = true;
                }
            }
            return;
        }
    }
}
```

- [ ] **Step 5: Call updateZone() in main.js and render zone text**

Call `updateZone()` after nameplate updates in main.js. Import from ui.js.

In render.js, import `{ zoneAnnouncement }` from ui.js. Add zone announcement rendering after clouds, before proximity indicator:

```js
/* ─── Zone announcement (Dark Souls style) ─── */
function drawZoneAnnouncement(w, h, now) {
    const za = zoneAnnouncement;
    if (!za.active) return;
    const elapsed = (now - za.startTime) / 1000;
    if (elapsed < 0.5) za.alpha = elapsed / 0.5;
    else if (elapsed < 2.0) za.alpha = 1;
    else if (elapsed < 2.5) za.alpha = 1 - (elapsed - 2.0) / 0.5;
    else { za.active = false; za.alpha = 0; return; }

    ctx.globalAlpha = za.alpha * 0.9;
    ctx.font = "700 16px 'Press Start 2P',monospace";
    ctx.textAlign = 'center';
    ctx.fillStyle = '#eec941';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 8;
    ctx.fillText(za.text, w / 2, h / 2);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}
```

Call `drawZoneAnnouncement(w, h, now)` after `drawClouds()`.

- [ ] **Step 6: Commit**

```bash
git add js/world.js js/render.js js/ui.js js/main.js
git commit -m "Add nameplate fade transitions and Dark Souls zone announcements"
```

**Verify:** Walk toward a building — nameplate fades in smoothly. Walk away — fades out. Walk from spawn into the About quarter — "The Archives" text fades in large at center screen, holds 1.5s, fades out. Only triggers once per zone.

---

### Task 10: Typewriter Effect

**Note:** This task completely rewrites `updatePanel()` in `ui.js`. It supersedes the `visitedBuildings.add()` change from Task 8 Step 1 — the rewrite includes that logic. If Task 8 was already applied, this replaces the entire function.

**Files:**
- Modify: `js/ui.js` — character-by-character reveal on first visit

- [ ] **Step 1: Add typewriter logic to updatePanel()**

Add state tracking and animation:

```js
const typedLabels = new Set();
let typewriterState = null; // { fullHTML, charIndex, label, rafId }

function startTypewriter(html, label) {
    if (typewriterState?.rafId) cancelAnimationFrame(typewriterState.rafId);
    typewriterState = { fullHTML: html, charIndex: 0, label, rafId: 0 };
    infoPanelInner.innerHTML = '';
    typewriterState.rafId = requestAnimationFrame(typewriterTick);
}

function typewriterTick() {
    if (!typewriterState || typewriterState.charIndex >= typewriterState.fullHTML.length) {
        if (typewriterState) {
            infoPanelInner.innerHTML = typewriterState.fullHTML;
            typedLabels.add(typewriterState.label);
            typewriterState = null;
        }
        return;
    }
    // Advance ~30 chars per second at 60fps
    typewriterState.accumulator = (typewriterState.accumulator || 0) + 0.5;
    if (typewriterState.accumulator >= 1) {
        const advance = Math.floor(typewriterState.accumulator);
        typewriterState.accumulator -= advance;
        typewriterState.charIndex = Math.min(typewriterState.charIndex + advance, typewriterState.fullHTML.length);
    }
    infoPanelInner.innerHTML = typewriterState.fullHTML.substring(0, typewriterState.charIndex);
    typewriterState.rafId = requestAnimationFrame(typewriterTick);
}
```

Modify `updatePanel()` to use typewriter on first visit:

```js
export function updatePanel() {
    cachedNearB = findNearBuilding();
    if (cachedNearB) {
        if (cachedNearB.label !== activeLabel) {
            activeLabel = cachedNearB.label;
            const data = interactables.find(i => i.label === cachedNearB.label);
            if (data) {
                visitedBuildings.add(cachedNearB.label);
                if (typedLabels.has(cachedNearB.label)) {
                    infoPanelInner.innerHTML = data.content;
                } else {
                    startTypewriter(data.content, cachedNearB.label);
                }
            } else {
                console.warn('No content for building label:', cachedNearB.label);
            }
        }
        infoPanel.classList.add('visible');
    } else {
        infoPanel.classList.remove('visible');
        activeLabel = null;
        // Cancel typewriter if player walks away
        if (typewriterState?.rafId) {
            cancelAnimationFrame(typewriterState.rafId);
            typewriterState = null;
        }
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add js/ui.js
git commit -m "Add typewriter effect for first-time building content reveal"
```

**Verify:** Approach a building for the first time — content appears character-by-character in the panel. Walk away mid-typing — stops cleanly. Return — content appears instantly (already typed). Approach a different building — typewriter plays again for that new building.

---

### Task 11: Loading Bar + Intro Zoom

**Files:**
- Modify: `index.html` — add loading bar div
- Modify: `styles.css` — loading bar styles
- Modify: `js/main.js` — update loading bar width, intro zoom logic

- [ ] **Step 1: Add loading bar to index.html**

After the intro-skip link (line 51), inside `.intro-content`:

```html
            <div class="loading-bar-container">
                <div class="loading-bar-fill" id="loadingBar"></div>
            </div>
```

- [ ] **Step 2: Add loading bar styles to styles.css**

Add after `.intro-skip:hover`:

```css
.loading-bar-container {
    width: 200px;
    height: 8px;
    margin: 16px auto 0;
    background: #3a2a1a;
    border: 2px solid #2a1a0a;
    border-radius: 2px;
    overflow: hidden;
}
.loading-bar-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #b8956a, #eec941);
    transition: width 0.2s ease;
    border-radius: 1px;
}
```

- [ ] **Step 3: Update main.js — loading bar + intro zoom**

Add loading bar element ref and update width in the progress callback:

```js
const loadingBar = document.getElementById('loadingBar');

loadAssets((done, total) => {
    const pct = Math.round(done / total * 100);
    btn.textContent = `Loading... ${pct}%`;
    loadingBar.style.width = pct + '%';
}).then(() => {
```

Import `introZoom` from state.js. In `startGame()`, add zoom trigger:

```js
function startGame() {
    setMode('PLAYING');
    document.getElementById('intro').classList.add('hidden');
    document.querySelector('.hud').classList.add('visible');
    canvas.style.cursor = "url('Assets/Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_01.png') 0 0, auto";
    // Trigger intro zoom
    introZoom.active = true;
    introZoom.startTime = Date.now();
}
```

In render.js, add zoom effect at the start of `render()` after computing `now`:

```js
    // Intro zoom effect
    if (introZoom.active) {
        const elapsed = (now - introZoom.startTime) / 400;
        if (elapsed >= 1) { introZoom.active = false; introZoom.scale = 1; }
        else { introZoom.scale = 1 + 0.05 * Math.sin(elapsed * Math.PI); }
    }
    if (introZoom.scale !== 1) {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(introZoom.scale, introZoom.scale);
        ctx.translate(-w / 2, -h / 2);
    }
```

At the very end of `render()`, close the transform:

```js
    if (introZoom.scale !== 1) ctx.restore();
```

Import `introZoom` from state.js in render.js.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css js/main.js js/render.js
git commit -m "Add pixel-art loading bar and intro zoom transition"
```

**Verify:** Reload page — golden loading bar fills beneath the start button as assets load. Click start — brief zoom-in effect (subtle scale 1.0→1.05→1.0) combined with the existing overlay fade. Feels like "diving in."

---

### Task 12: Audio System + Integration

**Files:**
- Create: `js/audio.js`
- Create: `audio/` directory with placeholder structure
- Modify: `index.html` — add mute button to HUD
- Modify: `styles.css` — mute button styles
- Modify: `js/main.js` — init audio, play music on start
- Modify: `js/player.js` — footstep sounds
- Modify: `js/ui.js` — panel open/close sounds

- [ ] **Step 1: Create audio directory and source audio files**

Create `audio/` directory. Source royalty-free audio files from OpenGameArt, Freesound, or similar CC0 sources:

```
audio/
├── music.mp3       (~2MB, fantasy village loop)
├── ambient.mp3     (~1MB, nature ambience)
├── footstep.mp3    (~10KB, grass step)
├── panel-open.mp3  (~15KB, UI whoosh)
├── panel-close.mp3 (~15KB, UI reverse whoosh)
├── click.mp3       (~5KB, button click)
├── chime.mp3       (~20KB, discovery tone)
└── splash.mp3      (~20KB, water splash)
```

**Note:** Audio files must be sourced externally. The code will work with any MP3 files placed at these paths. If files are unavailable, the audio system degrades silently (all play calls are null-guarded).

- [ ] **Step 2: Create js/audio.js**

```js
/* Audio system — music, ambient, SFX with mute toggle */
let audioCtx = null;
let muted = true;
const sounds = {};
const loops = {};

function ensureContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

export function loadAudio(key, src, opts = {}) {
    if (opts.loop) {
        const el = new Audio(src);
        el.loop = true;
        el.volume = opts.volume ?? 0.3;
        el.preload = 'auto';
        loops[key] = el;
    } else {
        const el = new Audio(src);
        el.volume = opts.volume ?? 0.5;
        el.preload = 'auto';
        sounds[key] = el;
    }
}

export function play(key) {
    if (muted) return;
    ensureContext();
    const s = sounds[key];
    if (s) { s.currentTime = 0; s.play().catch(() => {}); }
}

export function startLoops() {
    if (muted) return;
    ensureContext();
    for (const el of Object.values(loops)) { el.play().catch(() => {}); }
}

export function stopLoops() {
    for (const el of Object.values(loops)) { el.pause(); el.currentTime = 0; }
}

export function toggleMute() {
    muted = !muted;
    if (muted) stopLoops();
    else startLoops();
    return muted;
}

export function isMuted() { return muted; }

export function initAudio() {
    loadAudio('music', 'audio/music.mp3', { loop: true, volume: 0.25 });
    loadAudio('ambient', 'audio/ambient.mp3', { loop: true, volume: 0.15 });
    loadAudio('footstep', 'audio/footstep.mp3', { volume: 0.1 });
    loadAudio('panelOpen', 'audio/panel-open.mp3', { volume: 0.3 });
    loadAudio('panelClose', 'audio/panel-close.mp3', { volume: 0.3 });
    loadAudio('click', 'audio/click.mp3', { volume: 0.4 });
    loadAudio('chime', 'audio/chime.mp3', { volume: 0.3 });
    loadAudio('splash', 'audio/splash.mp3', { volume: 0.4 });
}
```

- [ ] **Step 3: Add mute button to index.html HUD**

In the `.hud-right` div (line 26-28), before the resume link:

```html
            <button class="hud-mute" id="muteBtn" aria-label="Toggle sound">🔇</button>
```

- [ ] **Step 4: Add mute button styles to styles.css**

```css
.hud-mute {
    font-size: 14px;
    background: rgba(15,10,5,0.4);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px;
    padding: 4px 8px;
    cursor: pointer;
    transition: border-color 0.3s, background 0.3s;
    line-height: 1;
}
.hud-mute:hover {
    border-color: #eec941;
    background: rgba(15,10,5,0.6);
}
```

- [ ] **Step 5: Integrate audio in main.js**

Import `{ initAudio, play, startLoops, toggleMute, isMuted }` from audio.js. Call `initAudio()` at module level. In `startGame()`, add:

```js
    play('click');
    startLoops();
```

Add mute button handler:

```js
document.getElementById('muteBtn').addEventListener('click', () => {
    const muted = toggleMute();
    document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊';
});
```

- [ ] **Step 6: Add footstep sounds to player.js**

Import `{ play }` from audio.js. In the walking animation section, play footstep on frame advance:

```js
    if (player.walking) {
        player.ft++;
        if (player.ft > 5) { player.ft = 0; player.frame = (player.frame + 1) % 6; play('footstep'); }
    }
```

Add splash sound when water collision triggers (next to the splash particle spawn):

```js
        play('splash');
```

- [ ] **Step 7: Add panel sounds to ui.js**

Import `{ play }` from audio.js. In `updatePanel()`, guard sounds so they only fire on **transitions**, not every frame:
- Play `panelOpen` only inside the `if (cachedNearB.label !== activeLabel)` block (when switching to a new building)
- Play `panelClose` only when `cachedNearB` transitions from non-null to null (use the existing `activeLabel` as the guard — when `activeLabel` was set and is now being cleared)
- Play `chime` only on first visit (when `!visitedBuildings.has(label)` before adding it)

```js
// Inside updatePanel(), when a new building is entered:
if (cachedNearB.label !== activeLabel) {
    play('panelOpen');
    if (!visitedBuildings.has(cachedNearB.label)) play('chime');
    // ... existing content logic
}

// When panel closes:
} else {
    if (activeLabel) play('panelClose'); // only if panel was actually open
    infoPanel.classList.remove('visible');
    activeLabel = null;
}
```

- [ ] **Step 8: Commit**

```bash
git add js/audio.js index.html styles.css js/main.js js/player.js js/ui.js
git commit -m "Add full audio system with music, ambient, SFX, and mute toggle"
```

**Verify:** Click start — click sound plays. If audio files exist and mute is toggled on (🔊): music and ambient loop. Walking produces footstep sounds. Info panel opens/closes with whoosh. First building visit plays chime. Water collision plays splash. Mute button toggles all audio. If audio files don't exist — game works silently with no errors.

---

### Task 13: Final Integration & Polish Pass

**Files:**
- All modified files — final consistency check

- [ ] **Step 1: Verify all imports are correct across modules**

Run: `npx serve . -p 3000` and open `http://localhost:3000`. Open browser console. Zero errors expected.

- [ ] **Step 2: Playtest full flow**

1. Page loads — loading bar fills, percentage text updates
2. Click Start — click sound, zoom effect, overlay fades
3. Walk with WASD — dust particles, footstep sounds (if unmuted)
4. Approach building — nameplate fades in, panel slides in with typewriter on first visit, chime plays
5. Walk away — nameplate fades out, panel closes with whoosh
6. Enter new zone — "The Archives" / "Projects District" / "The Crossing" announcement fades in/out
7. Observe NPCs — Archer and Monk patrol near their buildings
8. Observe wind — leaf particles drift toward nearest unvisited building
9. Observe flowers — spawn monument flowers pulse while unvisited buildings remain
10. Walk into water — splash particle + sound, one-shot
11. Look up — clouds drift above everything
12. Visit all 9 buildings — wind becomes ambient, flowers stop pulsing
13. Toggle mute button — all audio toggles

- [ ] **Step 3: Commit final state**

```bash
git add -A
git commit -m "Game polish complete — audio, particles, NPCs, wayfinding, transitions"
```

- [ ] **Step 4: Push**

```bash
git push origin Development
```
