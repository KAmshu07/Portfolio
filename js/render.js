/* Main render pipeline — ground, water, Y-sorted entities, HUD */
import { ctx, TILE, WATER_Y, WORLD_W, viewport } from './config.js';
import { mode, camera, isAllVisited, introZoom } from './state.js';
import { IMG } from './assets.js';
import { player, drawPlayer } from './player.js';
import { buildings, trees, decos, monument, fires, sheep, npcs, waterRocks, foamSpots, clouds } from './world.js';
import { drawFrame, drawImg } from './sprites.js';
import { getNearBuilding, zoneAnnouncement } from './ui.js';
import { getParticles, drawParticle } from './particles.js';
import { getActiveToast } from './achievements.js';
import {
    HUD_BAR_H, HUD_GRADIENT_OFFSET, HUD_LABEL_FONT_SIZE, HUD_HINT_FONT_SIZE,
    HUD_LABEL_Y_OFFSET, HUD_HINT_Y_OFFSET, HUD_DEFAULT_Y_OFFSET,
    NAMEPLATE_FONT_SIZE, NAMEPLATE_PAD_X, NAMEPLATE_PAD_Y, NAMEPLATE_RADIUS, NAMEPLATE_STROKE_WIDTH,
    PROX_Y_OFFSET, PROX_BOB_SPEED, PROX_BOB_AMP, PROX_SHADOW_BLUR, PROX_HALF_W, PROX_ARROW_H,
    ZONE_FADE_IN, ZONE_HOLD_END, ZONE_FADE_OUT, ZONE_MAX_ALPHA, ZONE_FONT_SIZE, ZONE_SHADOW_BLUR,
    TOAST_FADE_IN, TOAST_HOLD_END, TOAST_FADE_OUT, TOAST_W, TOAST_H, TOAST_Y,
    TOAST_MAX_ALPHA, TOAST_RADIUS, TOAST_STROKE_W, TOAST_TITLE_SIZE, TOAST_TITLE_Y, TOAST_DESC_SIZE, TOAST_DESC_Y,
    ZOOM_DURATION, ZOOM_START_SCALE, ZOOM_RANGE, ZOOM_EASE_POWER,
    TREE_FRAME_W, TREE_FRAME_H, TREE_DRAW_Y_OFFSET, TREE_BEHIND_ALPHA, TREE_DEFAULT_FADE,
    TREE_TRUNK_X_OFFSET, NPC_BEHIND_CHECK,
    FIRE_FRAME_SIZE, FIRE_Y_OFFSET, FIRE_SCALE,
    SHEEP_FRAME_SIZE, SHEEP_SCALE, FLOWER_PULSE_SPEED,
    CLOUD_ALPHA, CLOUD_DRIFT_SPEED, CLOUD_WRAP_PAD, CLOUD_PARALLAX,
    ANIM_SPEED, ANIM_FRAMES,
    CULL_FOAM, CULL_WATER_ROCKS, CULL_BUILDING, CULL_TREE_X, CULL_TREE_Y_TOP, CULL_TREE_Y_BOT,
    CULL_DECO, CULL_MONUMENT, CULL_FIRE, CULL_NPC, CULL_SHEEP,
    YSORT_TREE, YSORT_DECO, YSORT_MONUMENT, YSORT_FIRE, YSORT_SHEEP,
    COLOR_GOLD, COLOR_GRASS, COLOR_NPC_SHADOW, COLOR_NAMEPLATE_BG, COLOR_NAMEPLATE_BORDER, COLOR_TOAST_BG,
    FONT_PIXEL, FONT_BODY,
} from './rendering/RenderConfig.js';

/* ─── Viewport culling ─── */
function inView(sx, sy, margin) {
    return sx > -margin && sx < viewport.w + margin && sy > -margin && sy < viewport.h + margin;
}

/* ─── Cached HUD gradient (recreated on resize) ─── */
let hudGradient = null;
let hudCachedH = 0;

function getHudGradient(h) {
    if (h !== hudCachedH) {
        hudCachedH = h;
        hudGradient = ctx.createLinearGradient(0, h - HUD_BAR_H - HUD_GRADIENT_OFFSET, 0, h);
        hudGradient.addColorStop(0, 'rgba(15,10,5,0)');
        hudGradient.addColorStop(0.4, 'rgba(15,10,5,0.7)');
        hudGradient.addColorStop(1, 'rgba(15,10,5,0.85)');
    }
    return hudGradient;
}

/* ─── Building nameplate ─── */
function drawNameplate(label, cx, cy) {
    ctx.font = `700 ${NAMEPLATE_FONT_SIZE}px ${FONT_PIXEL}`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = COLOR_NAMEPLATE_BG;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - tw / 2 - NAMEPLATE_PAD_X, cy - NAMEPLATE_FONT_SIZE - NAMEPLATE_PAD_Y, tw + NAMEPLATE_PAD_X * 2, 16 + NAMEPLATE_PAD_Y * 2, NAMEPLATE_RADIUS);
    else ctx.rect(cx - tw / 2 - NAMEPLATE_PAD_X, cy - NAMEPLATE_FONT_SIZE - NAMEPLATE_PAD_Y, tw + NAMEPLATE_PAD_X * 2, 16 + NAMEPLATE_PAD_Y * 2);
    ctx.fill();
    ctx.strokeStyle = COLOR_NAMEPLATE_BORDER;
    ctx.lineWidth = NAMEPLATE_STROKE_WIDTH;
    ctx.stroke();
    ctx.fillStyle = COLOR_GOLD;
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy);
}

/* ─── Proximity arrow indicator ─── */
function drawProximityIndicator(nearB, ox, oy, now) {
    const t = now * 0.001;
    const bx = nearB.x + ox + nearB.w / 2;
    const by = nearB.y + oy - PROX_Y_OFFSET + Math.sin(t * PROX_BOB_SPEED) * PROX_BOB_AMP;
    ctx.shadowColor = COLOR_GOLD;
    ctx.shadowBlur = PROX_SHADOW_BLUR;
    ctx.fillStyle = COLOR_GOLD;
    ctx.beginPath();
    ctx.moveTo(bx - PROX_HALF_W, by);
    ctx.lineTo(bx + PROX_HALF_W, by);
    ctx.lineTo(bx, by + PROX_ARROW_H);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
}

/* ─── Bottom HUD bar ─── */
function drawBottomHUD(nearB, w, h) {
    ctx.fillStyle = getHudGradient(h);
    ctx.fillRect(0, h - HUD_BAR_H - HUD_GRADIENT_OFFSET, w, HUD_BAR_H + HUD_GRADIENT_OFFSET);
    ctx.textAlign = 'center';
    if (nearB) {
        ctx.font = `700 ${HUD_LABEL_FONT_SIZE}px ${FONT_PIXEL}`;
        ctx.fillStyle = COLOR_GOLD;
        ctx.fillText(nearB.label, w / 2, h - HUD_LABEL_Y_OFFSET);
        ctx.font = `400 ${HUD_HINT_FONT_SIZE}px ${FONT_PIXEL}`;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText(nearB.label === 'CONTACT' ? '[E] Open resume' : 'Walk closer to explore', w / 2, h - HUD_HINT_Y_OFFSET);
    } else {
        ctx.font = `400 ${HUD_HINT_FONT_SIZE}px ${FONT_PIXEL}`;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('WASD to move  •  SHIFT to sprint  •  SPACE to follow the wind', w / 2, h - HUD_DEFAULT_Y_OFFSET);
    }
}

/* ─── Entity renderers (dispatch map replaces switch/case) ─── */
const renderers = {
    building(item) {
        const b = item.data;
        if (IMG[b.asset]) drawImg(IMG[b.asset], item.sx, item.sy, 1.0);
        if (b.nameplateAlpha > 0.01) {
            ctx.globalAlpha = b.nameplateAlpha;
            drawNameplate(b.label, item.sx + b.w / 2, item.sy - 12);
            ctx.globalAlpha = 1;
        }
    },
    tree(item) {
        const tr = item.data;
        if (!IMG[tr.asset]) return;
        const fade = tr.fade || TREE_DEFAULT_FADE;
        const trunkX = tr.x + TREE_TRUNK_X_OFFSET;
        const trunkY = tr.y + fade.base;
        let behindTree = false;
        const checkBehind = (fx, fy) => fy < trunkY && fy > trunkY - fade.yD && Math.abs(fx - trunkX) < fade.xR;
        if (checkBehind(player.x + player.w / 2, player.y + player.h)) behindTree = true;
        if (!behindTree) {
            for (const n of npcs) {
                if (checkBehind(n.x + NPC_BEHIND_CHECK.x, n.y + NPC_BEHIND_CHECK.y)) { behindTree = true; break; }
            }
        }
        if (behindTree) ctx.globalAlpha = TREE_BEHIND_ALPHA;
        drawFrame(IMG[tr.asset], tr.frame, TREE_FRAME_W, TREE_FRAME_H, item.sx, item.sy + TREE_DRAW_Y_OFFSET, 1.0, false);
        if (behindTree) ctx.globalAlpha = 1;
    },
    deco(item) {
        const d = item.data;
        if (!isAllVisited() && (d.asset === 'deco01' || d.asset === 'deco04') && d.scale === 1.0) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() * FLOWER_PULSE_SPEED);
            ctx.globalAlpha = 0.5 + pulse * 0.5;
        }
        if (d.isStatic) {
            if (IMG[d.asset]) drawImg(IMG[d.asset], item.sx, item.sy, d.scale || 0.8);
        } else {
            if (IMG[d.asset]) drawFrame(IMG[d.asset], d.frame, 128, 128, item.sx, item.sy, d.scale || 0.6, false);
        }
        ctx.globalAlpha = 1;
    },
    monument(item) {
        if (IMG.deco18) drawImg(IMG.deco18, item.sx, item.sy, 1.0);
    },
    fire(item) {
        if (IMG.fire) drawFrame(IMG.fire, item.data.frame, FIRE_FRAME_SIZE, FIRE_FRAME_SIZE, item.sx, item.sy + FIRE_Y_OFFSET, FIRE_SCALE, false);
    },
    sheep(item) {
        if (IMG.sheep) drawFrame(IMG.sheep, item.data.frame, SHEEP_FRAME_SIZE, SHEEP_FRAME_SIZE, item.sx, item.sy, SHEEP_SCALE, false);
    },
    npc(item) {
        const n = item.data;
        const img = n.state === 'walk' ? IMG[n.runAsset] : IMG[n.idleAsset];
        if (!img) return;
        const fw = n.fw || 192, fh = n.fh || 192;
        const s = n.scale ?? 0.5;
        const yo = n.yOffset ?? 5;
        const dw = fw * s, dh = fh * s;
        const footX = item.sx + dw / 2;
        const footY = item.sy + dh - yo;
        ctx.fillStyle = COLOR_NPC_SHADOW;
        ctx.beginPath();
        ctx.ellipse(footX, footY, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        drawFrame(img, n.frame, fw, fh, item.sx, footY - dh + yo, s, n.facing === -1);
    },
    player(item) {
        drawPlayer(item.sx, item.sy);
    },
    particle: drawParticle,
};

/* ─── Parallax clouds ─── */
function drawClouds(ox, oy, now) {
    ctx.globalAlpha = CLOUD_ALPHA;
    for (const c of clouds) {
        const drift = (now * CLOUD_DRIFT_SPEED * c.speed) % (WORLD_W + CLOUD_WRAP_PAD);
        const cx = (c.x + drift) % (WORLD_W + CLOUD_WRAP_PAD) - CLOUD_WRAP_PAD / 2;
        const sx = cx + ox * CLOUD_PARALLAX;
        const sy = c.y + oy * CLOUD_PARALLAX;
        if (IMG[c.asset]) drawImg(IMG[c.asset], sx, sy, 1.0);
    }
    ctx.globalAlpha = 1;
}

/* ─── Zone announcement (Dark Souls style) ─── */
function drawZoneAnnouncement(w, h, now) {
    const za = zoneAnnouncement;
    if (!za.active) return;
    const elapsed = (now - za.startTime) / 1000;
    if (elapsed < ZONE_FADE_IN) za.alpha = elapsed / ZONE_FADE_IN;
    else if (elapsed < ZONE_HOLD_END) za.alpha = 1;
    else if (elapsed < ZONE_FADE_OUT) za.alpha = 1 - (elapsed - ZONE_HOLD_END) / (ZONE_FADE_OUT - ZONE_HOLD_END);
    else { za.active = false; za.alpha = 0; return; }

    ctx.globalAlpha = za.alpha * ZONE_MAX_ALPHA;
    ctx.font = `700 ${ZONE_FONT_SIZE}px ${FONT_PIXEL}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = COLOR_GOLD;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = ZONE_SHADOW_BLUR;
    ctx.fillText(za.text, w / 2, h / 2);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

/* ─── Achievement toast ─── */
function drawAchievementToast(w, h) {
    const toast = getActiveToast();
    if (!toast || !toast.active) return;
    const elapsed = (Date.now() - toast.startTime) / 1000;
    let alpha;
    if (elapsed < TOAST_FADE_IN) alpha = elapsed / TOAST_FADE_IN;
    else if (elapsed < TOAST_HOLD_END) alpha = 1;
    else if (elapsed < TOAST_FADE_OUT) alpha = 1 - (elapsed - TOAST_HOLD_END) / (TOAST_FADE_OUT - TOAST_HOLD_END);
    else return;

    const bx = w / 2 - TOAST_W / 2, by = TOAST_Y;

    ctx.globalAlpha = alpha * TOAST_MAX_ALPHA;
    ctx.fillStyle = COLOR_TOAST_BG;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, TOAST_W, TOAST_H, TOAST_RADIUS);
    else ctx.rect(bx, by, TOAST_W, TOAST_H);
    ctx.fill();
    ctx.strokeStyle = COLOR_GOLD;
    ctx.lineWidth = TOAST_STROKE_W;
    ctx.stroke();

    ctx.globalAlpha = alpha;
    ctx.font = `700 ${TOAST_TITLE_SIZE}px ${FONT_PIXEL}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = COLOR_GOLD;
    ctx.fillText(toast.title, w / 2, by + TOAST_TITLE_Y);
    ctx.font = `400 ${TOAST_DESC_SIZE}px ${FONT_BODY}`;
    ctx.fillStyle = 'rgba(232,228,224,0.8)';
    ctx.fillText(toast.desc, w / 2, by + TOAST_DESC_Y);
    ctx.globalAlpha = 1;
}

/* ─── Main render ─── */
export function render() {
    const { w, h } = viewport;
    const ox = -camera.x, oy = -camera.y;
    const now = Date.now();

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
        else console.warn('Unknown entity type:', item.type);
    }

    // Cloud layer (above entities, below HUD)
    drawClouds(ox, oy, now);
    drawZoneAnnouncement(w, h, now);

    // Overlays (only during gameplay)
    const nearB = getNearBuilding();
    if (nearB && mode === 'PLAYING') drawProximityIndicator(nearB, ox, oy, now);
    if (mode === 'PLAYING') drawBottomHUD(nearB, w, h);
    if (mode === 'PLAYING') drawAchievementToast(w, h);

    if (introZoom.scale !== 1) ctx.restore();
}
