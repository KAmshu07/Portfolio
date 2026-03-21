/* Camera state and follow logic */
import { viewport } from './Canvas.js';

export const camera = { x: 0, y: 0 };

// Intro zoom state
export const introZoom = { scale: 1, active: false, startTime: 0 };

// Camera lerp speed
const FOLLOW_LERP = 0.08;

export function followTarget(targetX, targetY, worldW, worldH) {
    const { w, h } = viewport;
    camera.x += ((targetX - w / 2) - camera.x) * FOLLOW_LERP;
    camera.y += ((targetY - h / 2) - camera.y) * FOLLOW_LERP;
    camera.x = Math.max(0, Math.min(worldW - w, camera.x));
    camera.y = Math.max(0, Math.min(worldH - h, camera.y));
}

export function introPan(worldW, worldH) {
    const t = Date.now() * 0.0002;
    camera.x = worldW * 0.3 + Math.sin(t) * 400;
    camera.y = worldH * 0.25 + Math.cos(t * 0.7) * 300;
}
