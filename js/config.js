/* Config shim — re-exports from core/ and data/ for backward compatibility */
import { WATER_Y } from './data/terrain.js';

export { canvas, ctx, viewport, resize } from './core/Canvas.js';
export { WATER_Y };

// Game constants
export const SPEED = 2.5;
export const WORLD_W = 2800;
export const WORLD_H = 2000;
export const TILE = 64;
export const PSCALE = 0.5;

// Wind wayfinding bias (0 = pure random, 1 = direct line)
export const WIND_BIAS = 0.8;

// Zone boundaries for Dark Souls announcements
export const ZONES = [
    { name: 'The Archives',       test: (x, y) => x < 900 && y < 800 },
    { name: 'Projects District',  test: (x, y) => x > 1400 && y < 1200 },
    { name: 'The Crossing',       test: (x, y) => y > 1200 },
];
