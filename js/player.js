/* Player state, movement, collision, animation, and drawing */
import { ctx, SPEED, WORLD_W, WORLD_H, WATER_Y } from './config.js';
import { keys } from './state.js';
import { IMG } from './assets.js';
import { buildings } from './world.js';
import { spawnParticle } from './particles.js';
import { play } from './audio.js';
import { isRectCollidingBuilding } from './world/Collision.js';

// Player rendering
const FRAME_W = 96;
const FRAME_H = 80;
const DRAW_SCALE = 2.0;
const DRAW_Y_OFFSET = 42;
const SHADOW_RX = 16;
const SHADOW_RY = 5;

// Player physics
const SPRINT_MULTIPLIER = 2;
const DIAGONAL_FACTOR = 0.707;
const WORLD_PADDING = 20;

// Dust particles
const DUST_COUNT_START = 3;
const DUST_SPREAD = 10;
const DUST_LIFE_START = 20;
const DUST_SCALE_START = 0.4;
const DUST_LIFE_TURN = 15;
const DUST_SCALE_TURN = 0.3;
const DUST_LIFE_SPRINT = 15;
const DUST_SCALE_SPRINT = 0.35;
const SPRINT_DUST_MODULUS = 3;

// Splash
const SPLASH_Y_OFFSET = 10;
const SPLASH_LIFE = 25;
const SPLASH_SCALE = 0.6;

// Animation
const WALK_FRAME_RATE = 5;
const IDLE_FRAME_RATE = 8;
const TOTAL_FRAMES = 8;
const FOOTSTEP_INTERVAL = 4;

// Spawn position
const SPAWN_X = 500;
const SPAWN_Y = 500;
const PLAYER_W = 40;
const PLAYER_H = 40;

export const player = {
    x: SPAWN_X, y: SPAWN_Y, w: PLAYER_W, h: PLAYER_H,
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
    if (mx && my) { mx *= DIAGONAL_FACTOR; my *= DIAGONAL_FACTOR; }
    player.walking = mx !== 0 || my !== 0;

    if (my < 0) player.facing = 'up';
    else if (my > 0) player.facing = 'down';
    else if (mx < 0) player.facing = 'left';
    else if (mx > 0) player.facing = 'right';

    if (player.walking && !player.wasWalking) {
        for (let i = 0; i < DUST_COUNT_START; i++) {
            spawnParticle('dust', player.x + player.w / 2 + (Math.random() - 0.5) * DUST_SPREAD,
                player.y + player.h, { vx: -mx * 0.5 + (Math.random() - 0.5), vy: -0.5 - Math.random(), life: DUST_LIFE_START, scale: DUST_SCALE_START });
        }
    }
    if (player.walking && player.facing !== player.lastFacing) {
        spawnParticle('dust', player.x + player.w / 2, player.y + player.h,
            { vx: -mx * 1.5, vy: -0.8, life: DUST_LIFE_TURN, scale: DUST_SCALE_TURN });
    }
    player.wasWalking = player.walking;
    player.lastFacing = player.facing;

    const sprinting = player.walking && (keys.ShiftLeft || keys.ShiftRight);
    const speed = sprinting ? SPEED * SPRINT_MULTIPLIER : SPEED;

    if (sprinting && player.walking && player.ft % SPRINT_DUST_MODULUS === 0) {
        spawnParticle('dust', player.x + player.w / 2 + (Math.random() - 0.5) * 8,
            player.y + player.h, { vx: (Math.random() - 0.5) * 1.5, vy: -0.8 - Math.random(), life: DUST_LIFE_SPRINT, scale: DUST_SCALE_SPRINT });
    }

    const nx = player.x + mx * speed;
    const ny = player.y + my * speed;

    // Axis-independent collision — test X and Y separately for wall sliding
    let blockedX = false, blockedY = false;
    for (const b of buildings) {
        if (isRectCollidingBuilding(nx, player.y, player.w, player.h, b)) blockedX = true;
        if (isRectCollidingBuilding(player.x, ny, player.w, player.h, b)) blockedY = true;
    }
    if (ny + player.h > WATER_Y) blockedY = true;

    if (ny + player.h > WATER_Y && !player.splashed) {
        spawnParticle('splash', player.x + player.w / 2, WATER_Y - SPLASH_Y_OFFSET,
            { vx: 0, vy: -0.5, life: SPLASH_LIFE, scale: SPLASH_SCALE });
        play('splash');
        player.splashed = true;
    }
    if (ny + player.h <= WATER_Y) player.splashed = false;

    if (!blockedX) player.x = Math.max(WORLD_PADDING, Math.min(WORLD_W - player.w - WORLD_PADDING, nx));
    if (!blockedY) player.y = Math.max(WORLD_PADDING, Math.min(WORLD_H - player.h - WORLD_PADDING, ny));

    if (player.walking) {
        player.ft++;
        if (player.ft > WALK_FRAME_RATE) { player.ft = 0; player.frame = (player.frame + 1) % TOTAL_FRAMES; if (player.frame % FOOTSTEP_INTERVAL === 0) play('footstep'); }
    } else {
        player.ft++;
        if (player.ft > IDLE_FRAME_RATE) { player.ft = 0; player.frame = (player.frame + 1) % TOTAL_FRAMES; }
    }
}

export function drawPlayer(sx, sy) {
    const dirMap = player.walking
        ? { up: 'runUp', down: 'runDown', left: 'runLeft', right: 'runRight' }
        : { up: 'idleUp', down: 'idleDown', left: 'idleLeft', right: 'idleRight' };
    const img = IMG[dirMap[player.facing]];
    if (!img) return;
    const dw = FRAME_W * DRAW_SCALE, dh = FRAME_H * DRAW_SCALE;
    const drawX = sx + player.w / 2 - dw / 2;
    const drawY = sy + player.h - dh + DRAW_Y_OFFSET;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(sx + player.w / 2, sy + player.h, SHADOW_RX, SHADOW_RY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(img, player.frame * FRAME_W, 0, FRAME_W, FRAME_H, drawX, drawY, dw, dh);
}
