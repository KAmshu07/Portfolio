/* Player state, movement, collision, animation, and drawing */
import { ctx, SPEED, WORLD_W, WORLD_H, WATER_Y } from './config.js';
import { keys } from './state.js';
import { IMG } from './assets.js';
import { buildings } from './world.js';
import { spawnParticle } from './particles.js';
import { play } from './audio.js';

export const player = {
    x: 500, y: 500, w: 40, h: 40,
    vx: 0, vy: 0, facing: 'down', walking: false,
    frame: 0, ft: 0,
    wasWalking: false, lastFacing: 'down', splashed: false,
};

export function updatePlayer() {
    let mx = 0, my = 0;
    if (keys.ArrowLeft || keys.KeyA) mx = -1;
    if (keys.ArrowRight || keys.KeyD) mx = 1;
    if (keys.ArrowUp || keys.KeyW) my = -1;
    if (keys.ArrowDown || keys.KeyS) my = 1;
    if (mx && my) { mx *= 0.707; my *= 0.707; }
    player.walking = mx !== 0 || my !== 0;

    // Determine facing direction (4-way)
    if (my < 0) player.facing = 'up';
    else if (my > 0) player.facing = 'down';
    else if (mx < 0) player.facing = 'left';
    else if (mx > 0) player.facing = 'right';

    // Dust on movement start or direction change
    if (player.walking && !player.wasWalking) {
        for (let i = 0; i < 3; i++) {
            spawnParticle('dust', player.x + player.w / 2 + (Math.random() - 0.5) * 10,
                player.y + player.h, { vx: -mx * 0.5 + (Math.random() - 0.5), vy: -0.5 - Math.random(), life: 20, scale: 0.4 });
        }
    }
    if (player.walking && player.facing !== player.lastFacing) {
        spawnParticle('dust', player.x + player.w / 2, player.y + player.h,
            { vx: -mx * 1.5, vy: -0.8, life: 15, scale: 0.3 });
    }
    player.wasWalking = player.walking;
    player.lastFacing = player.facing;

    // Sprint — hold Shift for 2x speed
    const sprinting = player.walking && (keys.ShiftLeft || keys.ShiftRight);
    const speed = sprinting ? SPEED * 2 : SPEED;

    // Extra dust when sprinting
    if (sprinting && player.walking && player.ft % 3 === 0) {
        spawnParticle('dust', player.x + player.w / 2 + (Math.random() - 0.5) * 8,
            player.y + player.h, { vx: (Math.random() - 0.5) * 1.5, vy: -0.8 - Math.random(), life: 15, scale: 0.35 });
    }

    const nx = player.x + mx * speed;
    const ny = player.y + my * speed;

    // Axis-independent collision — test X and Y separately for wall sliding
    let blockedX = false, blockedY = false;
    for (const b of buildings) {
        const bx = b.x + b.w * 0.1, by = b.y + b.h * 0.3, bw = b.w * 0.8, bh = b.h * 0.65;
        if (nx < bx + bw && nx + player.w > bx && player.y < by + bh && player.y + player.h > by) blockedX = true;
        if (player.x < bx + bw && player.x + player.w > bx && ny < by + bh && ny + player.h > by) blockedY = true;
    }
    if (ny + player.h > WATER_Y) blockedY = true;

    // Water splash on collision
    if (ny + player.h > WATER_Y && !player.splashed) {
        spawnParticle('splash', player.x + player.w / 2, WATER_Y - 10,
            { vx: 0, vy: -0.5, life: 25, scale: 0.6 });
        play('splash');
        player.splashed = true;
    }
    if (ny + player.h <= WATER_Y) player.splashed = false;

    if (!blockedX) player.x = Math.max(20, Math.min(WORLD_W - player.w - 20, nx));
    if (!blockedY) player.y = Math.max(20, Math.min(WORLD_H - player.h - 20, ny));

    // Animation (8 frames for both idle and run)
    if (player.walking) {
        player.ft++;
        if (player.ft > 5) { player.ft = 0; player.frame = (player.frame + 1) % 8; play('footstep'); }
    } else {
        player.ft++;
        if (player.ft > 8) { player.ft = 0; player.frame = (player.frame + 1) % 8; }
    }
}

const FRAME_W = 96, FRAME_H = 80;

export function drawPlayer(sx, sy) {
    const dirMap = player.walking
        ? { up: 'runUp', down: 'runDown', left: 'runLeft', right: 'runRight' }
        : { up: 'idleUp', down: 'idleDown', left: 'idleLeft', right: 'idleRight' };
    const img = IMG[dirMap[player.facing]];
    if (!img) return;
    // Draw sprite anchored so feet sit on the ground
    const scale = 2.0;
    const dw = FRAME_W * scale, dh = FRAME_H * scale;
    const drawX = sx + player.w / 2 - dw / 2;
    const drawY = sy + player.h - dh + 42;
    // Shadow (directly under feet)
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(sx + player.w / 2, sy + player.h, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(img, player.frame * FRAME_W, 0, FRAME_W, FRAME_H, drawX, drawY, dw, dh);
}
