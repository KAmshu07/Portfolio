/* Player state, movement, collision, animation, and drawing */
import { ctx, PSCALE, SPEED, WORLD_W, WORLD_H, WATER_Y } from './config.js';
import { keys } from './state.js';
import { IMG } from './assets.js';
import { drawFrame } from './sprites.js';
import { buildings } from './world.js';
import { spawnParticle } from './particles.js';

export const player = {
    x: 500, y: 500, w: 40, h: 30,
    vx: 0, vy: 0, facing: 1, walking: false,
    frame: 0, ft: 0,
    wasWalking: false, lastFacing: 1, splashed: false,
};

export function updatePlayer() {
    let mx = 0, my = 0;
    if (keys.ArrowLeft || keys.KeyA) { mx = -1; player.facing = -1; }
    if (keys.ArrowRight || keys.KeyD) { mx = 1; player.facing = 1; }
    if (keys.ArrowUp || keys.KeyW) my = -1;
    if (keys.ArrowDown || keys.KeyS) my = 1;
    if (mx && my) { mx *= 0.707; my *= 0.707; }
    player.walking = mx !== 0 || my !== 0;

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

    const nx = player.x + mx * SPEED;
    const ny = player.y + my * SPEED;

    // Axis-independent collision — test X and Y separately for wall sliding
    let blockedX = false, blockedY = false;
    for (const b of buildings) {
        const bx = b.x + b.w * 0.15, by = b.y + b.h * 0.6, bw = b.w * 0.7, bh = b.h * 0.35;
        if (nx < bx + bw && nx + player.w > bx && player.y < by + bh && player.y + player.h > by) blockedX = true;
        if (player.x < bx + bw && player.x + player.w > bx && ny < by + bh && ny + player.h > by) blockedY = true;
    }
    if (ny + player.h > WATER_Y) blockedY = true;

    // Water splash on collision
    if (ny + player.h > WATER_Y && !player.splashed) {
        spawnParticle('splash', player.x + player.w / 2, WATER_Y - 10,
            { vx: 0, vy: -0.5, life: 25, scale: 0.6 });
        player.splashed = true;
    }
    if (ny + player.h <= WATER_Y) player.splashed = false;

    if (!blockedX) player.x = Math.max(20, Math.min(WORLD_W - player.w - 20, nx));
    if (!blockedY) player.y = Math.max(20, Math.min(WORLD_H - player.h - 20, ny));

    // Animation
    if (player.walking) {
        player.ft++;
        if (player.ft > 5) { player.ft = 0; player.frame = (player.frame + 1) % 6; }
    } else {
        player.ft++;
        if (player.ft > 8) { player.ft = 0; player.frame = (player.frame + 1) % 8; }
    }
}

export function drawPlayer(sx, sy) {
    const img = player.walking ? IMG.run : IMG.idle;
    if (!img) return;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(sx + player.w / 2, sy + player.h, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    drawFrame(img, player.frame, 192, 192, sx - 28, sy - 38, PSCALE, player.facing === -1);
}
