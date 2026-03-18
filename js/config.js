/* Constants, canvas, and viewport */
export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');

export const SPEED = 2.5;
export const WORLD_W = 2800;
export const WORLD_H = 2000;
export const TILE = 64;
export const PSCALE = 0.5;
export const WATER_Y = 1650;

export const viewport = { w: 0, h: 0 };

export function resize() {
    viewport.w = canvas.width = innerWidth;
    viewport.h = canvas.height = innerHeight;
    ctx.imageSmoothingEnabled = false;
}
