/* Wind system — ambient weather that pivots toward objectives on demand */
import { viewport } from './config.js';
import { keys, visitedBuildings, isAllVisited } from './state.js';
import { player } from './player.js';
import { buildings } from './world.js';
import { spawnParticle } from './particles.js';
import { markWindUsed } from './achievements.js';

// ── Wind configuration ──────────────────────────────────────────────

// Ambient default direction (gentle right-to-left breeze)
const AMBIENT_DIR = { x: 0.8, y: 0.2 };

// How long a guidance pulse lasts (~5 seconds at 60 fps)
const GUIDE_DURATION = 300;

// Intensity limits and ramp rates
const MIN_INTENSITY = 1;
const MAX_INTENSITY = 2.5;
const INTENSITY_RAMP = 0.05;
const INTENSITY_DECAY = 0.02;

// How quickly the current direction lerps toward the target
const DIR_LERP_SPEED = 0.015;

// Particle spawn cadence (frames between batches)
const SPAWN_RATE_GUIDING = 2;
const SPAWN_RATE_AMBIENT = 4;

// Particles per batch
const PARTICLE_COUNT_GUIDING = 6;
const PARTICLE_COUNT_AMBIENT = 4;

// Spawn area multipliers (relative to viewport)
const SPREAD_SCALE = 1.2;
const DEPTH_OFFSET = -0.6;

// Per-particle wobble and speed
const WOBBLE_RANGE = 0.15;
const BASE_SPEED_MIN = 0.8;
const BASE_SPEED_RANGE = 0.5;

// Leaf visual parameters
const LEAF_LIFE_MIN = 80;
const LEAF_LIFE_RANGE = 50;
const LEAF_SCALE_MIN = 14;
const LEAF_SCALE_RANGE = 18;
const LEAF_ALPHA_GUIDING = 0.7;
const LEAF_ALPHA_AMBIENT = 0.5;
const LEAF_ALPHA_RANGE = 0.3;
const LEAF_CURVE_MIN = 0.3;
const LEAF_CURVE_RANGE = 0.7;
const LEAF_THICKNESS_MIN = 2.2;
const LEAF_THICKNESS_RANGE = 3.3;

// ── Wind state ──────────────────────────────────────────────────────

export const wind = {
    // Current interpolated direction (what particles actually use)
    dirX: AMBIENT_DIR.x, dirY: AMBIENT_DIR.y,
    // Target direction (what we're lerping toward)
    targetX: AMBIENT_DIR.x, targetY: AMBIENT_DIR.y,
    // Guidance state
    guiding: false, guideTimer: 0,
    // Intensity boost during guidance (more particles, slightly faster)
    intensity: MIN_INTENSITY,
};

let windSpawnTimer = 0;

// ── Functions ───────────────────────────────────────────────────────

/**
 * Find the nearest unvisited building and pivot the wind toward it.
 * Used by both the Space key press and the auto-trigger after game start.
 */
export function triggerGuideWind() {
    if (wind.guiding || isAllVisited()) return;

    let minDist = Infinity, target = null;
    for (const b of buildings) {
        if (visitedBuildings.has(b.label)) continue;
        const dx = (b.x + b.w / 2) - player.x;
        const dy = (b.y + b.h / 2) - player.y;
        const d = dx * dx + dy * dy;
        if (d < minDist) { minDist = d; target = b; }
    }
    if (target) {
        const dx = (target.x + target.w / 2) - player.x;
        const dy = (target.y + target.h / 2) - player.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        wind.targetX = dx / len;
        wind.targetY = dy / len;
        wind.guiding = true;
        wind.guideTimer = GUIDE_DURATION;
    }
}

export function updateWind() {
    // On Space press: pivot wind toward nearest unvisited building
    if (keys.Space && !wind.guiding && !isAllVisited()) {
        markWindUsed();
        triggerGuideWind();
    }

    // Countdown guidance, then ease back to ambient
    if (wind.guiding) {
        wind.guideTimer--;
        wind.intensity = Math.min(MAX_INTENSITY, wind.intensity + INTENSITY_RAMP);
        if (wind.guideTimer <= 0) {
            wind.guiding = false;
            wind.targetX = AMBIENT_DIR.x;
            wind.targetY = AMBIENT_DIR.y;
        }
    } else {
        wind.intensity = Math.max(MIN_INTENSITY, wind.intensity - INTENSITY_DECAY);
    }

    // Smooth lerp current direction toward target (slow = natural)
    wind.dirX += (wind.targetX - wind.dirX) * DIR_LERP_SPEED;
    wind.dirY += (wind.targetY - wind.dirY) * DIR_LERP_SPEED;
    // Renormalize
    const len = Math.sqrt(wind.dirX * wind.dirX + wind.dirY * wind.dirY) || 1;
    wind.dirX /= len;
    wind.dirY /= len;
}

export function spawnWindParticles() {
    windSpawnTimer++;
    const spawnRate = wind.guiding ? SPAWN_RATE_GUIDING : SPAWN_RATE_AMBIENT;
    if (windSpawnTimer < spawnRate) return;
    windSpawnTimer = 0;

    const count = wind.guiding ? PARTICLE_COUNT_GUIDING : PARTICLE_COUNT_AMBIENT;
    const perpX = -wind.dirY, perpY = wind.dirX;
    const { w, h } = viewport;

    for (let i = 0; i < count; i++) {
        // Spawn across the full visible area — upwind edge + scattered through view
        const spread = (Math.random() - 0.5) * Math.max(w, h) * SPREAD_SCALE;
        const depth = (Math.random() + DEPTH_OFFSET) * Math.max(w, h);
        const sx = player.x + wind.dirX * depth + perpX * spread;
        const sy = player.y + wind.dirY * depth + perpY * spread;

        const wobble = (Math.random() - 0.5) * WOBBLE_RANGE;
        const speed = (BASE_SPEED_MIN + Math.random() * BASE_SPEED_RANGE) * wind.intensity;
        const vx = (wind.dirX + wobble) * speed;
        const vy = (wind.dirY + wobble) * speed;

        spawnParticle('leaf', sx, sy, {
            vx, vy,
            life: LEAF_LIFE_MIN + Math.random() * LEAF_LIFE_RANGE,
            scale: LEAF_SCALE_MIN + Math.random() * LEAF_SCALE_RANGE,
            alpha: (wind.guiding ? LEAF_ALPHA_GUIDING : LEAF_ALPHA_AMBIENT) + Math.random() * LEAF_ALPHA_RANGE,
            curve: LEAF_CURVE_MIN + Math.random() * LEAF_CURVE_RANGE,
            thickness: LEAF_THICKNESS_MIN + Math.random() * LEAF_THICKNESS_RANGE,
        });
    }
}
