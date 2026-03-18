# Tiny Swords Portfolio Game — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all manual canvas shape drawing with Tiny Swords pixel art sprites, remove the dual theme system, and ship a polished side-scrolling game portfolio.

**Architecture:** Keep the existing IIFE game engine (physics, camera, input, interactables, info panels) intact. Replace only the rendering layer — swap canvas shape drawing for `drawImage()` calls using preloaded PNG sprites. The 13-section structure is preserved.

**Tech Stack:** Vanilla JS, Canvas 2D API (`drawImage` with source rects for spritesheets), HTML/CSS. No build tools.

**Spec:** `docs/superpowers/specs/2026-03-18-tiny-swords-portfolio-design.md`

**Verification:** Open `index.html` in browser after each task. No test framework — visual verification only.

---

### Task 1: HTML & CSS Cleanup — Remove Theme System

**Files:**
- Modify: `index.html:14` (remove light-theme class), `index.html:25` (remove theme toggle button)
- Modify: `styles.css:477-623` (remove all `.light-theme` overrides)
- Modify: `styles.css:89-109` (remove `.theme-toggle` styles)

- [ ] **Step 1: Remove `class="light-theme"` from body tag in index.html**

Change line 14 from:
```html
<body class="light-theme">
```
to:
```html
<body>
```

- [ ] **Step 2: Remove theme toggle button from HUD in index.html**

Remove this line (line 25):
```html
<button class="theme-toggle" id="themeToggle" title="Toggle theme">&#9790;</button>
```

- [ ] **Step 3: Remove `.theme-toggle` styles from styles.css**

Remove lines 89-109 (the `.theme-toggle` and `.theme-toggle:hover` rules).

- [ ] **Step 4: Remove all `.light-theme` overrides from styles.css**

Remove everything from line 477 (`/* ─── Light Theme Overrides ─── */`) through line 623 (end of light-theme overrides). This is ~145 lines of `.light-theme` and `body.light-theme` selectors.

- [ ] **Step 5: Verify**

Open `index.html` in browser. Should see dark theme only (dark background, teal accents). No theme toggle button in HUD. Intro screen should use dark styling. Game should still function — canvas drawing still works (will be replaced later).

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css
git commit -m "Remove dual theme system, keep dark theme only"
```

---

### Task 2: Script Section 2 — Replace Themes with Asset Loader

**Files:**
- Modify: `script.js:22-58` (replace THEMES section with ASSET LOADER)

- [ ] **Step 1: Replace Section 2 (themes) with asset loader**

Replace lines 22-58 (the entire THEMES section including `themes` object, `curTheme`, and `T`) with:

```js
/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 2 — ASSET LOADER                                ║
   ╚═══════════════════════════════════════════════════════════╝ */
const ASSET_DEFS = {
    // Player
    warrior_idle: 'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Idle.png',
    warrior_run:  'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Run.png',
    // Buildings
    house1:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House1.png',
    house2:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House2.png',
    house3:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House3.png',
    castle:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Castle.png',
    barracks:  'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Barracks.png',
    tower:     'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Tower.png',
    archery:   'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Archery.png',
    monastery: 'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Monastery.png',
    // Trees
    tree1: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree1.png',
    tree2: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree2.png',
    tree3: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree3.png',
    tree4: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree4.png',
    // Bushes
    bush1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe1.png',
    bush2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe2.png',
    bush3: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe3.png',
    bush4: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe4.png',
    // Rocks
    rock1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock1.png',
    rock2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock2.png',
    rock3: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock3.png',
    rock4: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock4.png',
    // Clouds
    cloud1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_01.png',
    cloud2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_02.png',
    cloud3: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_03.png',
    // Special
    sheep:  'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Meat/Sheep/Sheep_Idle.png',
    gold1:  'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Gold/Gold Stones/Gold Stone 1.png',
    // Terrain
    tilemap: 'Assets/Tiny Swords (Free Pack)/Terrain/Tileset/Tilemap_color1.png',
};

const IMG = {};

function loadAssets() {
    const entries = Object.entries(ASSET_DEFS);
    let loaded = 0;
    const btn = document.getElementById('introStart');
    btn.textContent = 'Loading...';
    btn.disabled = true;
    return new Promise((resolve, reject) => {
        for (const [key, src] of entries) {
            const img = new Image();
            img.onload = () => {
                IMG[key] = img;
                loaded++;
                btn.textContent = 'Loading... ' + Math.round(loaded / entries.length * 100) + '%';
                if (loaded === entries.length) {
                    btn.textContent = 'Press ENTER or Click to Start';
                    btn.disabled = false;
                    resolve();
                }
            };
            img.onerror = () => reject(new Error('Failed: ' + src));
            img.src = src;
        }
    });
}
```

- [ ] **Step 2: Verify**

Open in browser. Intro screen should show "Loading... X%" and then switch to "Press ENTER or Click to Start" once all images are loaded. Check browser console for any 404 errors on asset paths.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "Replace theme system with asset loader"
```

---

### Task 3: Script Section 4 — Remove Theme Toggle Handler + Wire Asset Loading

**Files:**
- Modify: `script.js` Section 4 (INPUT)

- [ ] **Step 1: Remove theme toggle handler from Section 4**

Remove these lines from Section 4:
```js
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click', () => {
    curTheme = curTheme === 'light' ? 'dark' : 'light';
    T = themes[curTheme];
    themeBtn.textContent = curTheme === 'light' ? '\u263E' : '\u2606';
    document.body.classList.toggle('light-theme', curTheme === 'light');
});
```

- [ ] **Step 2: Replace input handlers and startGame to require assets loaded**

**IMPORTANT:** Replace the EXISTING keydown handler (line 76-79) and the EXISTING intro click handler (line 82) — do NOT add new handlers alongside old ones, or you'll get duplicates that bypass the asset gate.

Replace the entire Section 4 INPUT block with:

```js
/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 4 — INPUT                                       ║
   ╚═══════════════════════════════════════════════════════════╝ */
const TOTAL_ASSETS = Object.keys(ASSET_DEFS).length;

addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'Enter' && state === 'INTRO' && Object.keys(IMG).length === TOTAL_ASSETS) startGame();
});
addEventListener('keyup', e => { keys[e.code] = false; });

document.getElementById('introStart').addEventListener('click', () => {
    if (Object.keys(IMG).length === TOTAL_ASSETS) startGame();
});

function startGame() {
    state = 'PLAYING';
    document.getElementById('intro').classList.add('hidden');
    document.querySelector('.hud').classList.add('visible');
}
```

Note: Asset gate uses `=== TOTAL_ASSETS` (not `> 0`) to prevent starting with partially loaded sprites. `ctx.imageSmoothingEnabled = false` is handled in `resize()` (see Task 4).

- [ ] **Step 3: Add loadAssets() call at the bottom, before game loop**

Just before the `loop()` call at the bottom of the IIFE, add:

```js
loadAssets().catch(err => {
    console.error(err);
    const btn = document.getElementById('introStart');
    btn.textContent = 'Load failed — Download Resume';
    btn.disabled = false;
    btn.onclick = () => window.open('Amritanshu_Kumar_Resume.pdf');
});
```

- [ ] **Step 4: Verify**

Open in browser. Assets should load, button should enable. Pressing Enter or clicking should start the game. Console should show no errors.

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "Wire asset loading into game startup flow"
```

---

### Task 4: Script Sections 1, 5, 8 — Constants, Player Dimensions, Sprite Helpers

**Files:**
- Modify: `script.js` Sections 1, 5, 8

- [ ] **Step 1: Clean up Section 1 constants and fix resize**

Remove `OL_W_THICK` and `OL_W_THIN` constants (no longer needed). Keep `TILE`, `WORLD_W`, `WORLD_H`, `GROUND_Y`, `MOVE_SPEED`, `GRAVITY`.

Add `ctx.imageSmoothingEnabled = false` inside the `resize()` function. This is critical — canvas state resets when `canvas.width`/`canvas.height` are reassigned, which happens on every browser resize. Without this, pixel art renders blurry after any resize.

```js
function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; ctx.imageSmoothingEnabled = false; }
```

- [ ] **Step 2: Update Section 5 player dimensions**

Change the player object from:
```js
const player = {
    x: 200, y: GROUND_Y - 42, w: 22, h: 42,
    vx: 0, vy: 0, onGround: false,
    facing: 1, walking: false, frame: 0, ft: 0
};
```
to:
```js
const player = {
    x: 200, y: GROUND_Y - 64, w: 40, h: 64,
    vx: 0, vy: 0, onGround: false,
    facing: 1, walking: false, frame: 0, ft: 0
};
```

- [ ] **Step 3: Replace Section 8 with sprite helpers**

Replace `ol()` and `rr()` functions with:

```js
/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 8 — SPRITE HELPERS                              ║
   ╚═══════════════════════════════════════════════════════════╝ */
function drawFrame(img, frame, fw, fh, x, y, scale, flip) {
    ctx.save();
    const dw = fw * scale, dh = fh * scale;
    if (flip) {
        ctx.translate(x + dw, y);
        ctx.scale(-1, 1);
        x = 0; y = 0;
    }
    ctx.drawImage(img, frame * fw, 0, fw, fh, x, y, dw, dh);
    ctx.restore();
}

function drawStatic(img, x, y, scale) {
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}
```

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "Update player dimensions and add sprite helpers"
```

---

### Task 5: Script Section 6 — Replace World Data

**Files:**
- Modify: `script.js` Section 6

- [ ] **Step 1: Replace huts, stars, grass arrays with buildings, trees, decorations**

Replace the entire Section 6 (huts, trees, stars, clouds, grass, zones, zoneLabels arrays) with:

```js
/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 6 — WORLD DATA                                  ║
   ╚═══════════════════════════════════════════════════════════╝ */

// Buildings (matched to interactables by position)
const buildings = [
    { x: 900,  asset: 'house1',    w: 128, h: 192 },
    { x: 1200, asset: 'house2',    w: 128, h: 192 },
    { x: 1500, asset: 'house3',    w: 128, h: 192 },
    { x: 2200, asset: 'castle',    w: 320, h: 256 },
    { x: 2700, asset: 'barracks',  w: 192, h: 256 },
    { x: 3200, asset: 'tower',     w: 128, h: 256 },
    { x: 3600, asset: 'archery',   w: 192, h: 256 },
    { x: 3950, asset: 'monastery', w: 192, h: 320 },
];

// Trees (scattered, randomly assigned tree1-4)
const trees = [];
const treePositions = [60, 450, 750, 1050, 1400, 1750, 2000, 2550, 3000, 3500, 4400, 4800, 5200];
for (const tx of treePositions) {
    trees.push({
        x: tx + Math.random() * 30,
        asset: 'tree' + (Math.floor(Math.random() * 4) + 1),
        frame: Math.floor(Math.random() * 8),
        timer: Math.floor(Math.random() * 10),
        depth: Math.random() > 0.3 ? 1.0 : 0.5, // some trees in background
    });
}

// Bushes
const bushes = [];
for (let bx = 100; bx < WORLD_W; bx += 200 + Math.random() * 300) {
    bushes.push({
        x: bx + Math.random() * 40,
        asset: 'bush' + (Math.floor(Math.random() * 4) + 1),
        frame: Math.floor(Math.random() * 8),
        timer: Math.floor(Math.random() * 10),
    });
}

// Rocks
const rocks = [];
for (let rx = 300; rx < WORLD_W; rx += 400 + Math.random() * 500) {
    rocks.push({
        x: rx + Math.random() * 50,
        asset: 'rock' + (Math.floor(Math.random() * 4) + 1),
    });
}

// Clouds (parallax background)
const clouds = [];
for (let i = 0; i < 8; i++) {
    clouds.push({
        x: Math.random() * WORLD_W,
        y: 60 + Math.random() * 180,
        asset: 'cloud' + (Math.floor(Math.random() * 3) + 1),
        spd: 0.08 + Math.random() * 0.12,
        scale: 0.3 + Math.random() * 0.3,
    });
}

// Gold stones (near Projects zone)
const goldStones = [];
for (let gx = 2000; gx < 4200; gx += 350 + Math.random() * 200) {
    goldStones.push({ x: gx + Math.random() * 80 });
}

// Sheep (easter egg in About zone)
const sheep = { x: 1100, frame: 0, timer: 0 };

// Zones
const zones = [
    { name: 'SPAWN', start: 0, end: 750 },
    { name: 'ABOUT', start: 750, end: 1800 },
    { name: 'PROJECTS', start: 1800, end: 4200 },
    { name: 'CONTACT', start: 4200, end: WORLD_W },
];
```

- [ ] **Step 2: Commit**

```bash
git add script.js
git commit -m "Replace world data with Tiny Swords buildings and decorations"
```

---

### Task 6: Script Section 7 — Update Interactables

**Files:**
- Modify: `script.js` Section 7

- [ ] **Step 1: Update interactable positions and dimensions**

Update each interactable's `x`, `y`, `w`, `h` to match building asset sizes. The content HTML stays the same. Update the array:

```js
const interactables = [
    { x:350, y:GROUND_Y-60, w:60, h:60, type:'sign', label:'?',
      content:`<h2>Welcome!</h2>...` },  // content unchanged
    { x:900, y:GROUND_Y-192, w:128, h:192, type:'building', label:'BIO',
      content:`<h2>About Me</h2>...` },
    { x:1200, y:GROUND_Y-192, w:128, h:192, type:'building', label:'SKILLS',
      content:`<h2>What I Do</h2>...` },
    { x:1500, y:GROUND_Y-192, w:128, h:192, type:'building', label:'TECH',
      content:`<h2>Tech Stack</h2>...` },
    { x:2200, y:GROUND_Y-256, w:320, h:256, type:'building', label:'PONGZ',
      content:`<span class="popup-badge">...` },
    { x:2700, y:GROUND_Y-256, w:192, h:256, type:'building', label:'ALNAHSHA',
      content:`<h2>Alnahsha Run</h2>...` },
    { x:3200, y:GROUND_Y-256, w:128, h:256, type:'building', label:'ENGINE',
      content:`<h2>Nimirta Engine</h2>...` },
    { x:3600, y:GROUND_Y-256, w:192, h:256, type:'building', label:'RECURVE',
      content:`<h2>Recurve 28</h2>...` },
    { x:3950, y:GROUND_Y-320, w:192, h:320, type:'building', label:'SYSTEMS',
      content:`<h2>Unity Systems</h2>...` },
    { x:4500, y:GROUND_Y-80, w:60, h:80, type:'contact', label:'MAIL',
      content:`<h2>Let's Talk</h2>...` },
];
```

**CRITICAL:** All `content` HTML strings remain EXACTLY as they are in the current code. The `content` values shown above as `...` are truncated for readability — do NOT replace them with `...`. Copy the full content strings from the existing `interactables` array. Only change `x`, `y`, `w`, `h`, and `type` fields. Types simplify to `sign`, `building`, and `contact` (no more `terminal`/`arcade` distinction needed since buildings are now sprites).

- [ ] **Step 2: Update proximity detection in updatePanel**

Update the proximity distance check in `updatePanel()` to use the building width:

```js
const dx = Math.abs(player.x + player.w / 2 - (obj.x + obj.w / 2));
const vy = player.y + player.h > obj.y - 20 && player.y < obj.y + obj.h + 20;
if (dx < obj.w / 2 + 30 && vy && dx < dist) { nearest = obj; dist = dx; }
```

The change is `dx < 60` → `dx < obj.w / 2 + 30` so wider buildings have wider trigger zones.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "Update interactable dimensions to match building sprites"
```

---

### Task 7: Script Sections 10 & 11 — Rewrite Render + Player Drawing

**Files:**
- Modify: `script.js` Sections 10, 11

This is the biggest task — replaces ALL visual output.

- [ ] **Step 1: Rewrite Section 10 render function**

Replace the entire `render()` function with:

```js
/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 10 — RENDER                                     ║
   ╚═══════════════════════════════════════════════════════════╝ */
function render() {
    const gY = GROUND_Y + (h - WORLD_H);
    const ox = -camera.x;
    const t = Date.now() * 0.001;

    // 1. Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, gY);
    sky.addColorStop(0, '#4a90d9');
    sky.addColorStop(0.7, '#87CEEB');
    sky.addColorStop(1, '#b8e4f0');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, gY);

    // 2. Clouds (parallax 0.15)
    for (const c of clouds) {
        const cx = ((c.x + t * c.spd * 20) % (WORLD_W + 600)) - 300;
        const sx = cx - camera.x * 0.15;
        if (sx < -300 || sx > w + 300) continue;
        if (IMG[c.asset]) drawStatic(IMG[c.asset], sx, c.y + (h - WORLD_H) * 0.2, c.scale);
    }

    // 3. Background trees (parallax 0.5)
    for (const tr of trees) {
        if (tr.depth !== 0.5) continue;
        const tx = tr.x - camera.x * 0.5;
        if (tx < -200 || tx > w + 200) continue;
        if (IMG[tr.asset]) drawFrame(IMG[tr.asset], tr.frame, 192, 256, tx, gY - 200, 0.7, false);
    }

    // 4. Buildings (parallax 1.0, bottom-aligned to ground)
    for (const b of buildings) {
        const bx = b.x + ox;
        if (bx < -b.w - 20 || bx > w + 20) continue;
        if (IMG[b.asset]) drawStatic(IMG[b.asset], bx, gY - b.h, 1.0);
    }

    // 5. Foreground trees (parallax 1.0)
    for (const tr of trees) {
        if (tr.depth !== 1.0) continue;
        const tx = tr.x + ox;
        if (tx < -200 || tx > w + 200) continue;
        if (IMG[tr.asset]) drawFrame(IMG[tr.asset], tr.frame, 192, 256, tx, gY - 230, 0.9, false);
    }

    // 6. Ground
    ctx.fillStyle = '#5a9a42';
    ctx.fillRect(0, gY, w, h - gY);
    // Grass edge using tilemap (draw repeating grass top tiles)
    if (IMG.tilemap) {
        for (let gx = -(camera.x % 64); gx < w + 64; gx += 64) {
            ctx.drawImage(IMG.tilemap, 64, 0, 64, 64, gx, gY - 16, 64, 64);
        }
    }
    // Stone layer below
    ctx.fillStyle = '#4a7a6a';
    ctx.fillRect(0, gY + 48, w, h - gY);

    // 7. Near decorations
    // Gold stones
    for (const gs of goldStones) {
        const gsx = gs.x + ox;
        if (gsx < -64 || gsx > w + 64) continue;
        if (IMG.gold1) drawStatic(IMG.gold1, gsx, gY - 40, 0.5);
    }
    // Bushes
    for (const b of bushes) {
        const bx = b.x + ox;
        if (bx < -128 || bx > w + 128) continue;
        if (IMG[b.asset]) drawFrame(IMG[b.asset], b.frame, 128, 128, bx, gY - 80, 0.7, false);
    }
    // Rocks
    for (const r of rocks) {
        const rx = r.x + ox;
        if (rx < -64 || rx > w + 64) continue;
        if (IMG[r.asset]) drawStatic(IMG[r.asset], rx, gY - 30, 0.6);
    }
    // Sheep
    if (IMG.sheep) {
        const sx = sheep.x + ox;
        if (sx > -128 && sx < w + 128) {
            drawFrame(IMG.sheep, sheep.frame, 128, 128, sx, gY - 70, 0.6, false);
        }
    }

    // 8. Player
    drawPlayer(player.x + ox, player.y + (h - WORLD_H), t);

    // 9. Proximity indicators (bouncing arrows above interactables)
    for (const obj of interactables) {
        const ix = obj.x + ox;
        if (ix < -80 || ix > w + 80) continue;
        const near = Math.abs(player.x + player.w / 2 - (obj.x + obj.w / 2)) < obj.w / 2 + 30 &&
                     player.y + player.h > obj.y - 20 && player.y < obj.y + obj.h + 20;
        if (near && state === 'PLAYING') {
            const cx = ix + obj.w / 2;
            const iy = obj.y + (h - WORLD_H);
            const b = Math.sin(t * 4) * 4;
            ctx.fillStyle = '#eec941';
            ctx.beginPath();
            ctx.moveTo(cx - 6, iy - 16 + b);
            ctx.lineTo(cx + 6, iy - 16 + b);
            ctx.lineTo(cx, iy - 8 + b);
            ctx.closePath();
            ctx.fill();
        }
    }

    // Arrow hint at start
    if (player.x < 180 && state === 'PLAYING') {
        const px = player.x + ox;
        const py = player.y + (h - WORLD_H);
        ctx.font = "400 10px 'Press Start 2P',monospace";
        ctx.fillStyle = '#eec941';
        ctx.globalAlpha = 0.4;
        ctx.textAlign = 'center';
        ctx.fillText('→→→', px + 70 + Math.sin(t * 3) * 5, py + player.h / 2);
        ctx.globalAlpha = 1;
    }
}
```

- [ ] **Step 2: Rewrite Section 11 player drawing**

Replace the entire `drawPlayer()` function with:

```js
/* ╔═══════════════════════════════════════════════════════════╗
   ║  SECTION 11 — DRAW PLAYER                                ║
   ╚═══════════════════════════════════════════════════════════╝ */
function drawPlayer(screenX, screenY) {
    const img = player.walking ? IMG.warrior_run : IMG.warrior_idle;
    if (!img) return;
    const scale = 0.4;
    const flip = player.facing === -1;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(screenX + player.w / 2, screenY + player.h, 16, 4, 0, 0, 6.28);
    ctx.fill();

    // Sprite (offset to center 77px sprite over 40x64 collision box)
    drawFrame(img, player.frame, 192, 192, screenX - 18, screenY - 13, scale, flip);
}
```

- [ ] **Step 3: Verify**

Open in browser. Should see:
- Blue sky gradient
- Clouds drifting
- Trees with parallax depth
- Buildings placed on grass ground
- Player as Blue Warrior sprite walking left/right
- Bushes, rocks, gold stones, sheep as decorations
- Info panels still trigger when near buildings
- Bouncing gold arrows on proximity

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "Rewrite render pipeline with Tiny Swords sprites"
```

---

### Task 8: Script Section 9 — Update Animation Ticks

**Files:**
- Modify: `script.js` Section 9 (UPDATE)

- [ ] **Step 1: Add decoration animation updates to update()**

Add these lines at the end of the `update()` function (before `updatePanel()`):

```js
    // Animate trees
    for (const tr of trees) {
        tr.timer++;
        if (tr.timer >= 10) { tr.timer = 0; tr.frame = (tr.frame + 1) % 8; }
    }
    // Animate bushes
    for (const b of bushes) {
        b.timer++;
        if (b.timer >= 12) { b.timer = 0; b.frame = (b.frame + 1) % 8; }
    }
    // Animate sheep
    sheep.timer++;
    if (sheep.timer >= 10) { sheep.timer = 0; sheep.frame = (sheep.frame + 1) % 6; }
```

- [ ] **Step 2: Update player walk animation frame count**

In the walk anim section of `update()`, change the frame modulo from 4 to match spritesheet:

Current:
```js
if (player.walking && player.onGround) { player.ft++; if (player.ft > 8) { player.ft = 0; player.frame = (player.frame + 1) % 4; } }
else player.frame = 0;
```

New:
```js
if (player.walking && player.onGround) {
    player.ft++;
    if (player.ft > 6) { player.ft = 0; player.frame = (player.frame + 1) % 6; }
} else {
    player.ft++;
    if (player.ft > 8) { player.ft = 0; player.frame = (player.frame + 1) % 8; }
}
```

This gives walk animation 6 frames (matching Warrior_Run) and idle animation 8 frames (matching Warrior_Idle).

- [ ] **Step 3: Verify**

Open in browser. Trees should sway gently, bushes should animate, sheep should idle-animate, player idle and walk animations should cycle smoothly.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "Add sprite animation ticks for trees, bushes, sheep, player"
```

---

### Task 9: Final Cleanup + Full Walkthrough

**Files:**
- Modify: `script.js` — verify no dead references remain

- [ ] **Step 1: Search for any remaining `T.` or `curTheme` or `themes` references**

Search script.js for `T.`, `curTheme`, `themes[`, `themeBtn`. If Tasks 2-7 executed correctly, none should remain. If any are found, it means a prior task missed something — fix by replacing with hardcoded values or removing.

- [ ] **Step 2: Verify — full walkthrough**

Full walkthrough: load page → see intro with loading progress → click start → walk right through all zones → verify all buildings show info panels → reach contact → walk back left. No console errors. No visual glitches. Resize browser window mid-game — pixel art should stay crisp (no blurry anti-aliasing).

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "Final cleanup of dead theme references"
```

---

### Task 10: Visual Polish — Adjust Scales and Positions

**Files:**
- Modify: `script.js` (various position/scale tweaks)

- [ ] **Step 1: Open in browser and visually audit**

Check each element:
- Player size relative to buildings (should be roughly 1/3 of a house)
- Building bottom alignment with ground
- Tree canopy position (should extend above buildings)
- Bush and rock positions (should sit on ground, not float)
- Cloud height and drift speed
- Parallax depth feel (background trees should move slower)
- Gold stones visibility
- Sheep position relative to nearby bush

- [ ] **Step 2: Adjust any scales/positions that look off**

Common adjustments:
- Tree Y offset (if trees float above ground)
- Bush Y offset (if bushes overlap ground too much)
- Player sprite offset (if feet don't align with ground)
- Building spacing (if buildings overlap or are too far apart)

- [ ] **Step 3: Test edge cases**

- Walk to far left (x=0) — player should stop at boundary
- Walk to far right (x=5500) — player should stop at boundary
- Resize browser window — canvas should resize, positions should stay correct
- Info panel should appear/disappear smoothly on proximity

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "Polish sprite positions and scales"
```

---

### Task 11: Update Intro Screen Colors

**Files:**
- Modify: `styles.css` intro section

- [ ] **Step 1: Update intro screen to match Tiny Swords palette**

The intro screen background currently uses COC colors. Update it to match the in-game sky/ground:

```css
.intro {
    background: linear-gradient(180deg, #4a90d9 0%, #87CEEB 50%, #5a9a42 80%, #4a7a6a 100%);
}
```

Update intro text colors to work on this background:
```css
.intro-title {
    color: #ffe8a0;
    text-shadow: 2px 2px 0 rgba(0,0,0,0.4);
}
.intro-sub {
    color: rgba(255,255,255,0.9);
}
.intro-hint {
    color: rgba(255,255,255,0.7);
}
```

- [ ] **Step 2: Verify**

Intro screen should show sky blue gradient matching the in-game sky, text should be readable and match the fantasy theme.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "Update intro screen colors to match Tiny Swords palette"
```

---

## Execution Order

Tasks 1-9 must be sequential (each builds on the previous).
Task 10 is a visual polish pass after everything works.
Task 11 is independent and can run after Task 1.

```
Task 1 (HTML/CSS cleanup)
  → Task 2 (Asset loader)
    → Task 3 (Input + loading wire-up)
      → Task 4 (Constants, player, sprite helpers)
        → Task 5 (World data)
          → Task 6 (Interactables update)
            → Task 7 (Render + player rewrite) ← THE BIG ONE
              → Task 8 (Animation ticks)
                → Task 9 (Dead code cleanup)
                  → Task 10 (Visual polish)

Task 11 (Intro colors) — after Task 1, independent
```
