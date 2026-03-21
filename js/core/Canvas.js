/* Canvas element, 2D context, viewport dimensions, and resize handler */
export const canvas = document.getElementById('game');
export const ctx = canvas.getContext('2d');

export const viewport = { w: 0, h: 0 };

export function resize() {
    viewport.w = canvas.width = innerWidth;
    viewport.h = canvas.height = innerHeight;
    ctx.imageSmoothingEnabled = false;
}
