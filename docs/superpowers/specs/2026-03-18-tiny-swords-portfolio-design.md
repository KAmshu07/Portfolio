# Tiny Swords Portfolio Game — Design Spec

## Overview

Side-scrolling portfolio game using the **Tiny Swords** (Pixel Frog) asset pack. Player controls a Blue Warrior knight walking through a fantasy kingdom. Each building represents a portfolio section — walk near it to trigger the info panel.

Single bright daytime theme. No dark mode.

## Decisions

- **Player**: Blue Warrior (Free Pack separate spritesheets)
- **Perspective**: Side-scrolling with isometric-style assets (Kingdom: Two Crowns approach)
- **Theme**: Single daytime theme, remove light/dark toggle
- **Art**: All visuals from Tiny Swords PNGs, no canvas shape drawing
- **Engine**: Keep existing update/physics/camera/input, replace render layer only

## Asset Path Root

All asset paths below are relative to:
```
Assets/Tiny Swords (Free Pack)/
Assets/Tiny Swords (Update 010)/
```

Full repo root: `C:/Nimrita/Personal/Portfolio/`

Note: Directory names contain spaces and parentheses. In JS asset loading, use the full relative path from the HTML file.

## Complete Asset Path Table

### Player Sprites (Free Pack — separate files per animation)

| Key | Repo Path | Size | Frames | Frame Size |
|-----|-----------|------|--------|------------|
| warrior_idle | `Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Idle.png` | 1536x192 | 8 | 192x192 |
| warrior_run | `Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Run.png` | 1152x192 | 6 | 192x192 |

All frames are in a single horizontal row. Frame extraction: `drawImage(img, frame * 192, 0, 192, 192, dx, dy, dw, dh)`.

Render scale: ~0.4x (192px -> ~77px on screen). Actual player collision box: `w: 40, h: 64` (centered within the 77px rendered frame since the sprite has transparent padding).

### Buildings (Free Pack — static single images)

| Key | Repo Path | Size | Interactable |
|-----|-----------|------|-------------|
| house1 | `Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House1.png` | 128x192 | BIO |
| house2 | `Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House2.png` | 128x192 | SKILLS |
| house3 | `Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House3.png` | 128x192 | TECH |
| castle | `Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Castle.png` | 320x256 | PONGZ (flagship) |
| barracks | `Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Barracks.png` | 192x256 | ALNAHSHA RUN |
| tower | `Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Tower.png` | 128x256 | NIMIRTA ENGINE |
| archery | `Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Archery.png` | 192x256 | RECURVE 28 |
| monastery | `Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Monastery.png` | 192x320 | UNITY SYSTEMS |

Buildings render at 1x scale. They are placed with their bottom edge on the ground line.

### Trees (Free Pack — animated horizontal spritesheets)

| Key | Repo Path | Size | Frames | Frame Size |
|-----|-----------|------|--------|------------|
| tree1 | `Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree1.png` | 1536x256 | 8 | 192x256 |
| tree2 | `Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree2.png` | 1536x256 | 8 | 192x256 |
| tree3 | `Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree3.png` | 1536x256 | 8 | 192x256 |
| tree4 | `Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree4.png` | 1536x256 | 8 | 192x256 |

Frame extraction: `drawImage(img, frame * 192, 0, 192, 256, dx, dy, dw, dh)`. Animate at ~6fps (slow wind sway).

### Bushes (Free Pack — animated horizontal spritesheets)

| Key | Repo Path | Size | Frames | Frame Size |
|-----|-----------|------|--------|------------|
| bush1 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe1.png` | 1024x128 | 8 | 128x128 |
| bush2 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe2.png` | 1024x128 | 8 | 128x128 |
| bush3 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe3.png` | 1024x128 | 8 | 128x128 |
| bush4 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe4.png` | 1024x128 | 8 | 128x128 |

### Rocks (Free Pack — static single images)

| Key | Repo Path | Size |
|-----|-----------|------|
| rock1 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock1.png` | 64x64 |
| rock2 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock2.png` | 64x64 |
| rock3 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock3.png` | 64x64 |
| rock4 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock4.png` | 64x64 |

### Clouds (Free Pack — static images, varied shapes)

| Key | Repo Path | Size |
|-----|-----------|------|
| cloud1 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_01.png` | 576x256 |
| cloud2 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_02.png` | 576x256 |
| cloud3 | `Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_03.png` | 576x256 |

Use 3 cloud variants. Each is a single static cloud image (not a spritesheet). Scale down ~0.5x for parallax.

### Special Decorations

| Key | Repo Path | Size | Frames | Frame Size |
|-----|-----------|------|--------|------------|
| sheep | `Assets/Tiny Swords (Free Pack)/Terrain/Resources/Meat/Sheep/Sheep_Idle.png` | 768x128 | 6 | 128x128 |
| gold1 | `Assets/Tiny Swords (Free Pack)/Terrain/Resources/Gold/Gold Stones/Gold Stone 1.png` | 128x128 | 1 (static) | 128x128 |

### Terrain Tilemap

| Key | Repo Path | Size | Notes |
|-----|-----------|------|-------|
| tilemap | `Assets/Tiny Swords (Free Pack)/Terrain/Tileset/Tilemap_color1.png` | 576x384 | Combined grass + stone autotile set, 64x64 tiles |
| tilemap_flat | `Assets/Tiny Swords (Update 010)/Terrain/Ground/Tilemap_Flat.png` | 640x256 | Flat grass + sand tiles |
| tilemap_elev | `Assets/Tiny Swords (Update 010)/Terrain/Ground/Tilemap_Elevation.png` | 256x512 | Stone cliff tiles |

**Ground rendering strategy:**
1. Use grass center-fill tile from `tilemap` (the repeatable 64x64 grass tile at approximately row 1, col 1 of the left half) — tile this horizontally as the ground surface strip (2 rows high = 128px)
2. Use stone cliff tiles from `tilemap_elev` or the right-half stone tiles from `tilemap` — draw below the grass for cliff depth (1-2 rows)
3. The exact tile source rects will be determined during implementation by inspecting the tilemap grid

Alternative simpler approach: Draw a canvas-filled green rect for ground (matching the tilemap green `#8ABF4B`) and overlay the grass edge tile strip on top for the surface detail. This is faster and still looks good.

## World Layout

Total width: ~5500px. `GROUND_Y = WORLD_H - TILE * 2` (WORLD_H=1200, TILE=40, so GROUND_Y=1120).

### Updated Interactables Array

Each building's interactable zone is derived from the building asset size. The `y` value positions the building so its bottom edge sits on GROUND_Y. The `w` and `h` match the building render size.

| Zone | X | Building | Asset W | Asset H | Interactable y | Section |
|------|---|----------|---------|---------|-----------------|---------|
| SPAWN | 350 | (sign/banner) | 60 | 60 | GROUND_Y - 60 | Welcome |
| ABOUT | 900 | House1 | 128 | 192 | GROUND_Y - 192 | BIO |
| ABOUT | 1200 | House2 | 128 | 192 | GROUND_Y - 192 | SKILLS |
| ABOUT | 1500 | House3 | 128 | 192 | GROUND_Y - 192 | TECH |
| PROJECTS | 2200 | Castle | 320 | 256 | GROUND_Y - 256 | PONGZ |
| PROJECTS | 2700 | Barracks | 192 | 256 | GROUND_Y - 256 | ALNAHSHA |
| PROJECTS | 3200 | Tower | 128 | 256 | GROUND_Y - 256 | ENGINE |
| PROJECTS | 3600 | Archery | 192 | 256 | GROUND_Y - 256 | RECURVE |
| PROJECTS | 3950 | Monastery | 192 | 320 | GROUND_Y - 320 | SYSTEMS |
| CONTACT | 4500 | (banner) | 60 | 80 | GROUND_Y - 80 | MAIL |

Proximity detection: trigger at distance < building width (so wider buildings have a larger trigger zone).

### Updated Player Dimensions

```js
const player = {
    x: 200, y: GROUND_Y - 64, w: 40, h: 64,
    vx: 0, vy: 0, onGround: false,
    facing: 1, walking: false, frame: 0, ft: 0
};
```

The sprite is 192x192 but the actual character occupies roughly the center ~40x64px area. The collision box uses these smaller values. The sprite is drawn offset so the character's feet align with `player.y + player.h`.

Sprite draw offset: `drawX = player.x - 38`, `drawY = player.y - 13` (to center the 77px rendered sprite over the 40x64 collision box).

## Technical Architecture

### All 13 Sections — What Changes

| Section | Name | Change |
|---------|------|--------|
| 1 | CONSTANTS & CONFIG | Minor: remove OL_W constants, keep TILE/WORLD/GROUND constants |
| 2 | THEMES → ASSET LOADER | **Replace**: theme system → image preloader + asset registry |
| 3 | STATE | **Keep** as-is |
| 4 | INPUT | **Minor**: remove theme toggle handler, keep keyboard + intro start |
| 5 | PLAYER | **Minor**: update w/h/y values for new sprite size |
| 6 | WORLD DATA | **Modify**: replace huts/stars/grass arrays → buildings/decorations/clouds arrays |
| 7 | INTERACTABLES | **Minor**: update y/w/h values per building sizes |
| 8 | COC HELPERS → SPRITE HELPERS | **Replace**: ol()/rr() → drawSprite()/drawAnimSprite() |
| 9 | UPDATE | **Keep** as-is (physics, camera, walk anim, zone detection) |
| 10 | RENDER | **Rewrite**: all drawing → sprite-based render pipeline |
| 11 | DRAW PLAYER | **Rewrite**: manual shapes → spritesheet frame drawing |
| 12 | INFO PANEL | **Keep** as-is |
| 13 | GAME LOOP | **Keep** as-is |

### Section 2 — ASSET LOADER (new)

```js
const ASSET_DEFS = {
    warrior_idle: 'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Idle.png',
    warrior_run:  'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Run.png',
    castle:       'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Castle.png',
    // ... all other assets
};

const IMG = {}; // loaded Image objects keyed by asset name

function loadAssets() {
    const entries = Object.entries(ASSET_DEFS);
    let loaded = 0;
    return new Promise((resolve, reject) => {
        for (const [key, src] of entries) {
            const img = new Image();
            img.onload = () => { IMG[key] = img; loaded++; if (loaded === entries.length) resolve(); };
            img.onerror = () => reject(new Error('Failed to load: ' + src));
            img.src = src;
        }
    });
}
```

On error: show a fallback message on the intro screen ("Assets failed to load. Download resume instead.") with the resume download link.

### Section 8 — SPRITE HELPERS (new)

```js
// Draw a single frame from a horizontal spritesheet
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

// Draw a static image (full image, no spritesheet)
function drawStatic(img, x, y, scale) {
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}
```

Note: `drawFrame` flip logic zeroes BOTH `x` and `y` after translate to avoid Y-doubling.

### Section 10 — RENDER (drawing order)

```
1. Sky gradient fill (canvas rect, bright blue #87CEEB to lighter at horizon)
2. Clouds (parallax 0.15, static cloud PNGs drifting slowly)
3. Far trees (parallax 0.5, scaled down slightly for depth)
4. Buildings (parallax 1.0, bottom-aligned to GROUND_Y)
5. Foreground trees (parallax 1.0, between buildings)
6. Ground tile strip (tiled grass across world width at GROUND_Y, 2 rows deep)
7. Near decorations (bushes, rocks, gold stones on ground line)
8. Player sprite (animated)
9. Proximity indicators (bouncing arrows above interactables)
```

### Section 11 — DRAW PLAYER (new)

```js
function drawPlayer(screenX, screenY) {
    const img = player.walking ? IMG.warrior_run : IMG.warrior_idle;
    const totalFrames = player.walking ? 6 : 8;
    const scale = 0.4;
    const flip = player.facing === -1;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(screenX + 20, screenY + player.h, 16, 4, 0, 0, 6.28);
    ctx.fill();

    // Sprite (offset to center over collision box)
    drawFrame(img, player.frame, 192, 192, screenX - 18, screenY - 13, scale, flip);
}
```

## CSS Changes

- Remove ALL `.light-theme` overrides (~150 lines)
- Remove `.theme-toggle` styles
- Keep the dark theme CSS variables as the single theme
- The dark info-panel styling works well with pixel art

## HTML Changes

- Remove `class="light-theme"` from `<body>` tag (line 14)
- Remove the theme toggle `<button>` from HUD (line 25)
- Keep everything else

## Loading UX

1. Intro screen shows immediately (existing)
2. Start button text changes to "Loading..." and is disabled
3. `loadAssets()` runs, on each image load update a counter
4. When all loaded, button text changes to "Press ENTER or Click to Start" and is enabled
5. On error, show "Could not load game assets" with resume download link as fallback

## File Changes Summary

| File | Action |
|------|--------|
| script.js | Rewrite sections 2, 8, 10, 11. Modify sections 1, 4, 5, 6, 7. Keep sections 3, 9, 12, 13 |
| styles.css | Remove ~150 lines of .light-theme overrides and theme toggle styles |
| index.html | Remove `class="light-theme"` from body, remove theme toggle button |

The IIFE structure and 13-section layout is preserved. Section purposes shift but the architecture stays clean.
