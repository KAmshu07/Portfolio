/* Main render pipeline — ground, water, Y-sorted entities, HUD */
import { ctx, TILE, WATER_Y, WORLD_W, viewport } from './config.js';
import { mode, camera, isAllVisited, introZoom } from './state.js';
import { IMG } from './assets.js';
import { player, drawPlayer } from './player.js';
import { buildings, trees, decos, monument, fires, sheep, npcs, waterRocks, foamSpots, clouds } from './world.js';
import { drawFrame, drawImg } from './sprites.js';
import { getNearBuilding, zoneAnnouncement } from './ui.js';
import { getParticles, drawParticle } from './particles.js';

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
        ctx.fillText(nearB.label === 'CONTACT' ? '[E] Open resume' : 'Walk closer to explore', w / 2, h - 6);
    } else {
        ctx.font = "400 8px 'Press Start 2P',monospace";
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('WASD to move  •  SPACE to follow the wind', w / 2, h - 12);
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
        const fade = tr.fade || { xR: 70, yD: 160, base: 200 };
        const trunkX = tr.x + 96;
        const trunkY = tr.y + fade.base;
        // Check if player OR any NPC is behind this tree
        let behindTree = false;
        const checkBehind = (fx, fy) => fy < trunkY && fy > trunkY - fade.yD && Math.abs(fx - trunkX) < fade.xR;
        if (checkBehind(player.x + player.w / 2, player.y + player.h)) behindTree = true;
        if (!behindTree) {
            for (const n of npcs) {
                if (checkBehind(n.x + 48, n.y + 80)) { behindTree = true; break; }
            }
        }
        if (behindTree) ctx.globalAlpha = 0.4;
        drawFrame(IMG[tr.asset], tr.frame, 192, 256, item.sx, item.sy - 56, 1.0, false);
        if (behindTree) ctx.globalAlpha = 1;
    },
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
    monument(item) {
        if (IMG.deco18) drawImg(IMG.deco18, item.sx, item.sy, 1.0);
    },
    fire(item) {
        if (IMG.fire) drawFrame(IMG.fire, item.data.frame, 64, 64, item.sx, item.sy - 20, 0.8, false);
    },
    sheep(item) {
        if (IMG.sheep) drawFrame(IMG.sheep, item.data.frame, 128, 128, item.sx, item.sy, 0.7, false);
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
        // Shadow at feet
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(footX, footY, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        // Sprite anchored so feet touch shadow
        drawFrame(img, n.frame, fw, fh, item.sx, footY - dh + yo, s, n.facing === -1);
    },
    player(item) {
        drawPlayer(item.sx, item.sy);
    },
    particle: drawParticle,
};

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

/* ─── Main render ─── */
export function render() {
    const { w, h } = viewport;
    const ox = -camera.x, oy = -camera.y;
    const now = Date.now();

    // Cinematic camera reveal — start zoomed in, slowly pull back to show the world
    if (introZoom.active) {
        const elapsed = (now - introZoom.startTime) / 2000;
        if (elapsed >= 1) { introZoom.active = false; introZoom.scale = 1; }
        else {
            const ease = 1 - Math.pow(1 - elapsed, 3);
            introZoom.scale = 1.3 - 0.3 * ease;
        }
    }
    if (introZoom.scale !== 1) {
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(introZoom.scale, introZoom.scale);
        ctx.translate(-w / 2, -h / 2);
    }

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
    for (const n of npcs) {
        const sx = n.x + ox, sy = n.y + oy;
        // Sort at visual foot position: sprite bottom + yOffset shift
        const sortY = n.y + (n.fh || 192) * (n.scale ?? 0.5);
        if (inView(sx, sy, 150)) drawList.push({ y: sortY, type: 'npc', data: n, sx, sy });
    }
    {
        const sx = sheep.x + ox, sy = sheep.y + oy;
        if (inView(sx, sy, 100)) drawList.push({ y: sheep.y + 60, type: 'sheep', data: sheep, sx, sy });
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

    if (introZoom.scale !== 1) ctx.restore();
}
