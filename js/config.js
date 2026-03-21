/* Constants, canvas, and viewport */
import { WATER_Y } from './data/terrain.js';

export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');

export const SPEED = 2.5;
export const WORLD_W = 2800;
export const WORLD_H = 2000;
export const TILE = 64;
export const PSCALE = 0.5;
export { WATER_Y };

export const viewport = { w: 0, h: 0 };

export function resize() {
    viewport.w = canvas.width = innerWidth;
    viewport.h = canvas.height = innerHeight;
    ctx.imageSmoothingEnabled = false;
}

// Wind wayfinding bias (0 = pure random, 1 = direct line)
export const WIND_BIAS = 0.8;

// Zone boundaries for Dark Souls announcements
export const ZONES = [
    { name: 'The Archives',       test: (x, y) => x < 900 && y < 800 },
    { name: 'Projects District',  test: (x, y) => x > 1400 && y < 1200 },
    { name: 'The Crossing',       test: (x, y) => y > 1200 },
];
