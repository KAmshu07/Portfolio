/* Player state, movement, collision, and animation */
import { keys } from '../core/Input.js';
import { buildings } from '../world/WorldBuilder.js';
import { spawnParticle } from '../systems/ParticleSystem.js';
import { play } from '../systems/AudioSystem.js';
import { isRectCollidingBuilding } from '../world/Collision.js';
import { WATER_Y } from '../data/terrain.js';
import { SPEED, WORLD_W, WORLD_H } from '../data/gameConfig.js';
import { Direction, ParticleType, AudioKey, KeyCode } from '../data/enums.js';

// Player physics
const SPRINT_MULTIPLIER = 2;
const DIAGONAL_FACTOR = 0.707;
const WORLD_PADDING = 20;

// Dust particles
const DUST_COUNT_START = 3;
const DUST_SPREAD = 10;
const DUST_LIFE_START = 20;
const DUST_SCALE_START = 0.4;
const DUST_VX_START = 0.5;
const DUST_VY_START = 0.5;
const DUST_LIFE_TURN = 15;
const DUST_SCALE_TURN = 0.3;
const DUST_VX_TURN = 1.5;
const DUST_VY_TURN = 0.8;
const DUST_LIFE_SPRINT = 15;
const DUST_SCALE_SPRINT = 0.35;
const SPRINT_DUST_SPREAD = 8;
const SPRINT_DUST_VX = 1.5;
const SPRINT_DUST_VY = 0.8;
const SPRINT_DUST_MODULUS = 3;

// Splash
const SPLASH_Y_OFFSET = 10;
const SPLASH_LIFE = 25;
const SPLASH_SCALE = 0.6;
const SPLASH_VY = 0.5;

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
    vx: 0, vy: 0, facing: Direction.DOWN, walking: false,
    frame: 0, ft: 0,
    wasWalking: false, lastFacing: Direction.DOWN, splashed: false,
};

export function updatePlayer(dt) {
    let mx = 0, my = 0;
    if (keys[KeyCode.LEFT] || keys[KeyCode.A]) mx = -1;
    if (keys[KeyCode.RIGHT] || keys[KeyCode.D]) mx = 1;
    if (keys[KeyCode.UP] || keys[KeyCode.W]) my = -1;
    if (keys[KeyCode.DOWN] || keys[KeyCode.S]) my = 1;
    if (mx && my) { mx *= DIAGONAL_FACTOR; my *= DIAGONAL_FACTOR; }
    player.walking = mx !== 0 || my !== 0;

    if (my < 0) player.facing = Direction.UP;
    else if (my > 0) player.facing = Direction.DOWN;
    else if (mx < 0) player.facing = Direction.LEFT;
    else if (mx > 0) player.facing = Direction.RIGHT;

    if (player.walking && !player.wasWalking) {
        for (let i = 0; i < DUST_COUNT_START; i++) {
            spawnParticle(ParticleType.DUST, player.x + player.w / 2 + (Math.random() - 0.5) * DUST_SPREAD,
                player.y + player.h, { vx: -mx * DUST_VX_START + (Math.random() - 0.5), vy: -DUST_VY_START - Math.random(), life: DUST_LIFE_START, scale: DUST_SCALE_START });
        }
    }
    if (player.walking && player.facing !== player.lastFacing) {
        spawnParticle(ParticleType.DUST, player.x + player.w / 2, player.y + player.h,
            { vx: -mx * DUST_VX_TURN, vy: -DUST_VY_TURN, life: DUST_LIFE_TURN, scale: DUST_SCALE_TURN });
    }
    player.wasWalking = player.walking;
    player.lastFacing = player.facing;

    const sprinting = player.walking && (keys[KeyCode.SHIFT_LEFT] || keys[KeyCode.SHIFT_RIGHT]);
    const speed = sprinting ? SPEED * SPRINT_MULTIPLIER * dt : SPEED * dt;

    if (sprinting && player.walking && Math.floor(player.ft) % SPRINT_DUST_MODULUS === 0 && Math.floor(player.ft) !== Math.floor(player.ft - dt)) {
        spawnParticle(ParticleType.DUST, player.x + player.w / 2 + (Math.random() - 0.5) * SPRINT_DUST_SPREAD,
            player.y + player.h, { vx: (Math.random() - 0.5) * SPRINT_DUST_VX, vy: -SPRINT_DUST_VY - Math.random(), life: DUST_LIFE_SPRINT, scale: DUST_SCALE_SPRINT });
    }

    const nx = player.x + mx * speed;
    const ny = player.y + my * speed;

    let blockedX = false, blockedY = false;
    for (const b of buildings) {
        if (isRectCollidingBuilding(nx, player.y, player.w, player.h, b)) blockedX = true;
        if (isRectCollidingBuilding(player.x, ny, player.w, player.h, b)) blockedY = true;
    }
    if (ny + player.h > WATER_Y) blockedY = true;

    if (ny + player.h > WATER_Y && !player.splashed) {
        spawnParticle(ParticleType.SPLASH, player.x + player.w / 2, WATER_Y - SPLASH_Y_OFFSET,
            { vx: 0, vy: -SPLASH_VY, life: SPLASH_LIFE, scale: SPLASH_SCALE });
        play(AudioKey.SPLASH);
        player.splashed = true;
    }
    if (ny + player.h <= WATER_Y) player.splashed = false;

    if (!blockedX) player.x = Math.max(WORLD_PADDING, Math.min(WORLD_W - player.w - WORLD_PADDING, nx));
    if (!blockedY) player.y = Math.max(WORLD_PADDING, Math.min(WORLD_H - player.h - WORLD_PADDING, ny));

    if (player.walking) {
        player.ft += dt;
        if (player.ft > WALK_FRAME_RATE) { player.ft = 0; player.frame = (player.frame + 1) % TOTAL_FRAMES; if (player.frame % FOOTSTEP_INTERVAL === 0) play(AudioKey.FOOTSTEP); }
    } else {
        player.ft += dt;
        if (player.ft > IDLE_FRAME_RATE) { player.ft = 0; player.frame = (player.frame + 1) % TOTAL_FRAMES; }
    }
}

