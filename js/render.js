/* Main render pipeline — ground, water, Y-sorted entities, HUD */
import { ctx, TILE, WATER_Y, viewport } from './config.js';
import { mode, camera } from './state.js';
import { IMG } from './assets.js';
import { player, drawPlayer } from './player.js';
import { buildings, trees, decos, monument, fires, sheep, waterRocks, foamSpots } from './world.js';
import { drawFrame, drawImg } from './sprites.js';
import { getNearBuilding } from './ui.js';

/* ─── Viewport culling ─── */
function inView(sx, sy, margin) {
    return sx > -margin && sx < viewport.w + margin && sy > -margin && sy < viewport.h + margin;
}

/* ─── Cached HUD gradient (recreated on resize) ─── */
const BAR_H = 36;
let hudGradient = null;
let hudCachedH = 0;

function getHudGradient(h) {
    if (h !== hudCachedH) {
        hudCachedH = h;
        hudGradient = ctx.createLinearGradient(0, h - BAR_H - 10, 0, h);
        hudGradient.addColorStop(0, 'rgba(15,10,5,0)');
        hudGradient.addColorStop(0.4, 'rgba(15,10,5,0.7)');
        hudGradient.addColorStop(1, 'rgba(15,10,5,0.85)');
    }
    return hudGradient;
}

/* ─── Building nameplate ─── */
function drawNameplate(label, cx, cy) {
    ctx.font = "700 10px 'Press Start 2P',monospace";
    const tw = ctx.measureText(label).width;
    const px = 10, py = 4;
    ctx.fillStyle = 'rgba(20,10,5,0.75)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - tw / 2 - px, cy - 10 - py, tw + px * 2, 16 + py * 2, 6);
    else ctx.rect(cx - tw / 2 - px, cy - 10 - py, tw + px * 2, 16 + py * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(238,201,65,0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#eec941';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy);
}

/* ─── Proximity arrow indicator ─── */
function drawProximityIndicator(nearB, ox, oy, now) {
    const t = now * 0.001;
    const bx = nearB.x + ox + nearB.w / 2;
    const by = nearB.y + oy - 30 + Math.sin(t * 4) * 6;
    ctx.shadowColor = '#eec941';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#eec941';
    ctx.beginPath();
    ctx.moveTo(bx - 8, by);
    ctx.lineTo(bx + 8, by);
    ctx.lineTo(bx, by + 12);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
}

/* ─── Bottom HUD bar ─── */
function drawBottomHUD(nearB, w, h) {
    ctx.fillStyle = getHudGradient(h);
    ctx.fillRect(0, h - BAR_H - 10, w, BAR_H + 10);
    ctx.textAlign = 'center';
    if (nearB) {
        ctx.font = "700 11px 'Press Start 2P',monospace";
        ctx.fillStyle = '#eec941';
        ctx.fillText(nearB.label, w / 2, h - 18);
        ctx.font = "400 8px 'Press Start 2P',monospace";
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('Walk closer to explore', w / 2, h - 6);
    } else {
        ctx.font = "400 8px 'Press Start 2P',monospace";
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('WASD to move  •  Walk to buildings to explore', w / 2, h - 12);
    }
}

/* ─── Entity renderers (dispatch map replaces switch/case) ─── */
const renderers = {
    building(item) {
        const b = item.data;
        if (IMG[b.asset]) drawImg(IMG[b.asset], item.sx, item.sy, 1.0);
        drawNameplate(b.label, item.sx + b.w / 2, item.sy - 12);
    },
    tree(item) {
        const tr = item.data;
        if (!IMG[tr.asset]) return;
        const fade = tr.fade || { xR: 70, yD: 160, base: 200 };
        const trunkX = tr.x + 96;
        const trunkY = tr.y + fade.base;
        const feetX = player.x + player.w / 2;
        const feetY = player.y + player.h;
        const behindTree = feetY < trunkY && feetY > trunkY - fade.yD
            && Math.abs(feetX - trunkX) < fade.xR;
        if (behindTree) ctx.globalAlpha = 0.4;
        drawFrame(IMG[tr.asset], tr.frame, 192, 256, item.sx, item.sy - 56, 1.0, false);
        if (behindTree) ctx.globalAlpha = 1;
    },
    deco(item) {
        const d = item.data;
        if (d.isStatic) {
            if (IMG[d.asset]) drawImg(IMG[d.asset], item.sx, item.sy, d.scale || 0.8);
        } else {
            if (IMG[d.asset]) drawFrame(IMG[d.asset], d.frame, 128, 128, item.sx, item.sy, d.scale || 0.6, false);
        }
    },
    monument(item) {
        if (IMG.deco18) drawImg(IMG.deco18, item.sx, item.sy, 1.0);
    },
    fire(item) {
        if (IMG.fire) drawFrame(IMG.fire, item.data.frame, 64, 64, item.sx, item.sy - 20, 0.8, false);
    },
    sheep(item) {
        if (IMG.sheep) drawFrame(IMG.sheep, item.data.frame, 128, 128, item.sx, item.sy, 0.7, false);
    },
    player(item) {
        drawPlayer(item.sx, item.sy);
    },
};

/* ─── Main render ─── */
export function render() {
    const { w, h } = viewport;
    const ox = -camera.x, oy = -camera.y;
    const now = Date.now();

    // Ground tiles
    ctx.fillStyle = '#7ab648';
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
    const animFrame = Math.floor(now * 0.002) % 8;
    if (IMG.foam) {
        for (const fs of foamSpots) {
            const fx = fs.x + ox, fy = fs.y + oy;
            if (inView(fx, fy, 200)) drawFrame(IMG.foam, animFrame, 192, 192, fx, fy, 0.5, false);
        }
    }

    // Water rocks
    for (const wr of waterRocks) {
        const rx = wr.x + ox, ry = wr.y + oy;
        if (inView(rx, ry, 150) && IMG[wr.asset]) {
            drawFrame(IMG[wr.asset], animFrame, 128, 128, rx, ry, 1.0, false);
        }
    }

    // Y-sorted draw list assembly
    const drawList = [];

    for (const b of buildings) {
        const sx = b.x + ox, sy = b.y + oy;
        if (sx < -b.w - 20 || sx > w + 20 || sy < -b.h - 20 || sy > h + 20) continue;
        drawList.push({ y: b.y + b.h, type: 'building', data: b, sx, sy });
    }
    for (const tr of trees) {
        const sx = tr.x + ox, sy = tr.y + oy;
        if (sx < -200 || sx > w + 200 || sy < -300 || sy > h + 100) continue;
        drawList.push({ y: tr.y + 240, type: 'tree', data: tr, sx, sy });
    }
    for (const d of decos) {
        const sx = d.x + ox, sy = d.y + oy;
        if (inView(sx, sy, 100)) drawList.push({ y: d.y + 30, type: 'deco', data: d, sx, sy });
    }
    {
        const sx = monument.x + ox, sy = monument.y + oy;
        if (inView(sx, sy, 200)) drawList.push({ y: monument.y + 180, type: 'monument', sx, sy });
    }
    for (const f of fires) {
        const sx = f.x + ox, sy = f.y + oy;
        if (inView(sx, sy, 100)) drawList.push({ y: f.y + 30, type: 'fire', data: f, sx, sy });
    }
    {
        const sx = sheep.x + ox, sy = sheep.y + oy;
        if (inView(sx, sy, 100)) drawList.push({ y: sheep.y + 60, type: 'sheep', data: sheep, sx, sy });
    }
    drawList.push({ y: player.y + player.h, type: 'player', sx: player.x + ox, sy: player.y + oy });

    // Y-sort and dispatch
    drawList.sort((a, b) => a.y - b.y);
    for (const item of drawList) {
        const fn = renderers[item.type];
        if (fn) fn(item);
        else console.warn('Unknown entity type:', item.type);
    }

    // Overlays (only during gameplay)
    const nearB = getNearBuilding();
    if (nearB && mode === 'PLAYING') drawProximityIndicator(nearB, ox, oy, now);
    if (mode === 'PLAYING') drawBottomHUD(nearB, w, h);
}
