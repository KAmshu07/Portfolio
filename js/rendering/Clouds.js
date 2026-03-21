/* Parallax cloud layer */
import { ctx } from '../core/Canvas.js';
import { IMG } from '../systems/AssetLoader.js';
import { clouds } from '../world/WorldBuilder.js';
import { drawImg } from '../utils/sprites.js';
import { CLOUD_ALPHA, CLOUD_DRIFT_SPEED, CLOUD_WRAP_PAD, CLOUD_PARALLAX } from './RenderConfig.js';
import { WORLD_W } from '../data/gameConfig.js';

export function drawClouds(ox, oy, now) {
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
