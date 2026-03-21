/* Main render orchestrator — ground, water, Y-sort assembly, dispatch */
import { ctx, viewport } from '../core/Canvas.js';
import { camera, introZoom } from '../core/Camera.js';
import { mode } from '../core/GameState.js';
import { IMG } from '../systems/AssetLoader.js';
import { player } from '../entities/Player.js';
import { buildings, trees, decos, monument, fires, sheep, npcs, waterRocks, foamSpots } from '../world/WorldBuilder.js';
import { drawFrame } from '../utils/sprites.js';
import { getParticles } from '../systems/ParticleSystem.js';
import { WATER_Y } from '../data/terrain.js';
import { renderers } from './EntityRenderers.js';
import { drawProximityIndicator, drawBottomHUD } from './HUD.js';
import { drawZoneAnnouncement, drawAchievementToast } from './Overlays.js';
import { drawClouds } from './Clouds.js';
import {
    ZOOM_DURATION, ZOOM_START_SCALE, ZOOM_RANGE, ZOOM_EASE_POWER,
    ANIM_SPEED, ANIM_FRAMES, COLOR_GRASS,
    CULL_FOAM, CULL_WATER_ROCKS, CULL_BUILDING, CULL_TREE_X, CULL_TREE_Y_TOP, CULL_TREE_Y_BOT,
    CULL_DECO, CULL_MONUMENT, CULL_FIRE, CULL_NPC, CULL_SHEEP,
    YSORT_TREE, YSORT_DECO, YSORT_MONUMENT, YSORT_FIRE, YSORT_SHEEP,
} from './RenderConfig.js';

const TILE = 64;

function inView(sx, sy, margin) {
    return sx > -margin && sx < viewport.w + margin && sy > -margin && sy < viewport.h + margin;
}

// getNearBuilding is injected at render time to avoid circular imports
let _getNearBuilding = () => null;
let _zoneAnnouncement = { active: false };

export function setRenderDeps(getNearBuilding, zoneAnnouncement) {
    _getNearBuilding = getNearBuilding;
    _zoneAnnouncement = zoneAnnouncement;
}

export function render() {
    const { w, h } = viewport;
    const ox = -camera.x, oy = -camera.y;
    const now = Date.now();

    // Intro zoom
    if (introZoom.active) {
        const elapsed = (now - introZoom.startTime) / ZOOM_DURATION;
        if (elapsed >= 1) { introZoom.active = false; introZoom.scale = 1; }
        else {
            const ease = 1 - Math.pow(1 - elapsed, ZOOM_EASE_POWER);
            introZoom.scale = ZOOM_START_SCALE - ZOOM_RANGE * ease;
        }
    }
    if (introZoom.scale !== 1) {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(introZoom.scale, introZoom.scale);
        ctx.translate(-w / 2, -h / 2);
    }

    // Ground tiles
    ctx.fillStyle = COLOR_GRASS;
    ctx.fillRect(0, 0, w, h);
    if (IMG.tilemap) {
        const sx = -(camera.x % TILE), sy = -(camera.y % TILE);
        for (let gx = sx; gx < w + TILE; gx += TILE) {
            for (let gy = sy; gy < h + TILE; gy += TILE) {
                if (gy + camera.y >= WATER_Y) {
                    if (IMG.water) ctx.drawImage(IMG.water, 0, 0, 64, 64, gx, gy, TILE, TILE);
                } else {
                    ctx.drawImage(IMG.tilemap, 64, 64, 64, 64, gx, gy, TILE, TILE);
                }
            }
        }
    }

    // Shore foam
    const animFrame = Math.floor(now * ANIM_SPEED) % ANIM_FRAMES;
    if (IMG.foam) {
        for (const fs of foamSpots) {
            const fx = fs.x + ox, fy = fs.y + oy;
            if (inView(fx, fy, CULL_FOAM)) drawFrame(IMG.foam, animFrame, 192, 192, fx, fy, 0.5, false);
        }
    }

    // Water rocks
    for (const wr of waterRocks) {
        const rx = wr.x + ox, ry = wr.y + oy;
        if (inView(rx, ry, CULL_WATER_ROCKS) && IMG[wr.asset]) {
            drawFrame(IMG[wr.asset], animFrame, 128, 128, rx, ry, 1.0, false);
        }
    }

    // Y-sorted draw list assembly
    const drawList = [];

    for (const b of buildings) {
        const sx = b.x + ox, sy = b.y + oy;
        if (sx < -b.w - CULL_BUILDING || sx > w + CULL_BUILDING || sy < -b.h - CULL_BUILDING || sy > h + CULL_BUILDING) continue;
        drawList.push({ y: b.y + b.h, type: 'building', data: b, sx, sy });
    }
    for (const tr of trees) {
        const sx = tr.x + ox, sy = tr.y + oy;
        if (sx < -CULL_TREE_X || sx > w + CULL_TREE_X || sy < -CULL_TREE_Y_TOP || sy > h + CULL_TREE_Y_BOT) continue;
        drawList.push({ y: tr.y + YSORT_TREE, type: 'tree', data: tr, sx, sy });
    }
    for (const d of decos) {
        const sx = d.x + ox, sy = d.y + oy;
        if (inView(sx, sy, CULL_DECO)) drawList.push({ y: d.y + YSORT_DECO, type: 'deco', data: d, sx, sy });
    }
    {
        const sx = monument.x + ox, sy = monument.y + oy;
        if (inView(sx, sy, CULL_MONUMENT)) drawList.push({ y: monument.y + YSORT_MONUMENT, type: 'monument', sx, sy });
    }
    for (const f of fires) {
        const sx = f.x + ox, sy = f.y + oy;
        if (inView(sx, sy, CULL_FIRE)) drawList.push({ y: f.y + YSORT_FIRE, type: 'fire', data: f, sx, sy });
    }
    for (const n of npcs) {
        const sx = n.x + ox, sy = n.y + oy;
        const sortY = n.y + (n.fh || 192) * (n.scale ?? 0.5);
        if (inView(sx, sy, CULL_NPC)) drawList.push({ y: sortY, type: 'npc', data: n, sx, sy });
    }
    {
        const sx = sheep.x + ox, sy = sheep.y + oy;
        if (inView(sx, sy, CULL_SHEEP)) drawList.push({ y: sheep.y + YSORT_SHEEP, type: 'sheep', data: sheep, sx, sy });
    }
    drawList.push({ y: player.y + player.h, type: 'player', sx: player.x + ox, sy: player.y + oy });

    for (const p of getParticles()) {
        const sx = p.x + ox, sy = p.y + oy;
        drawList.push({ y: p.y, type: 'particle', data: p, sx, sy });
    }

    // Y-sort and dispatch
    drawList.sort((a, b) => a.y - b.y);
    for (const item of drawList) {
        const fn = renderers[item.type];
        if (fn) fn(item);
    }

    // Cloud layer (above entities, below HUD)
    drawClouds(ox, oy, now);
    drawZoneAnnouncement(_zoneAnnouncement, w, h, now);

    // Overlays (only during gameplay)
    const nearB = _getNearBuilding();
    if (nearB && mode === 'PLAYING') drawProximityIndicator(nearB, ox, oy, now);
    if (mode === 'PLAYING') drawBottomHUD(nearB, w, h);
    if (mode === 'PLAYING') drawAchievementToast(w, h);

    if (introZoom.scale !== 1) ctx.restore();
}
