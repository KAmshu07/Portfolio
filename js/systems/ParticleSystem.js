/* Particle pool — spawn, update, render */
import { ctx } from '../core/Canvas.js';
import { IMG } from './AssetLoader.js';
import { drawFrame } from '../utils/sprites.js';

const MAX_PARTICLES = 120;
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
        curve: opts.curve,
        thickness: opts.thickness,
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
        const angle = Math.atan2(p.vy, p.vx);
        const len = p.scale;
        const curve = (p.curve ?? 0.5) * len;
        const thick = p.thickness ?? 2;
        ctx.save();
        ctx.translate(item.sx, item.sy);
        ctx.rotate(angle);
        ctx.shadowColor = 'rgba(255,255,255,0.3)';
        ctx.shadowBlur = 4;
        ctx.fillStyle = `rgba(255,255,255,${p.alpha * 0.9})`;
        ctx.beginPath();
        ctx.moveTo(-len, 0);
        ctx.bezierCurveTo(-len * 0.3, -curve, len * 0.3, curve, len, 0);
        ctx.bezierCurveTo(len * 0.3, curve - thick, -len * 0.3, -curve + thick, -len, 0);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}
