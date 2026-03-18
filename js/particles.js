/* Particle pool — spawn, update, render */
import { ctx } from './config.js';
import { IMG } from './assets.js';
import { drawFrame } from './sprites.js';

const MAX_PARTICLES = 50;
const pool = [];

export function spawnParticle(type, x, y, opts = {}) {
    const p = {
        x, y,
        vx: opts.vx ?? (Math.random() - 0.5) * 2,
        vy: opts.vy ?? -Math.random() * 1.5,
        life: opts.life ?? 30,
        maxLife: opts.life ?? 30,
        type,
        frame: 0, frameTimer: 0,
        scale: opts.scale ?? 0.5,
        alpha: opts.alpha ?? 1,
    };
    if (pool.length >= MAX_PARTICLES) pool.shift();
    pool.push(p);
    return p;
}

export function updateParticles() {
    for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha = Math.max(0, p.life / p.maxLife);

        // Animate sprite-based particles
        if (p.type === 'dust' || p.type === 'splash') {
            p.frameTimer++;
            if (p.frameTimer >= 4) { p.frameTimer = 0; p.frame = (p.frame + 1) % 8; }
        }

        if (p.life <= 0) { pool.splice(i, 1); }
    }
}

export function getParticles() { return pool; }

export function drawParticle(item) {
    const p = item.data;
    ctx.globalAlpha = p.alpha;
    if (p.type === 'dust' && IMG.dust1) {
        drawFrame(IMG.dust1, p.frame, 64, 64, item.sx, item.sy, p.scale, false);
    } else if (p.type === 'splash' && IMG.splash) {
        drawFrame(IMG.splash, p.frame, 64, 64, item.sx, item.sy, p.scale, false);
    } else if (p.type === 'leaf') {
        // Canvas-drawn leaf particle (no sprite)
        ctx.fillStyle = '#8ab648';
        ctx.beginPath();
        ctx.arc(item.sx, item.sy, 2 * p.scale, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}
