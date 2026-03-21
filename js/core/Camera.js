/* Camera state and follow logic */
import { viewport } from './Canvas.js';

export const camera = { x: 0, y: 0 };

// Intro zoom state
export const introZoom = { scale: 1, active: false, startTime: 0 };

// Camera lerp speed
const FOLLOW_LERP = 0.08;

// Intro pan constants
const INTRO_PAN_SPEED = 0.0002;
const INTRO_PAN_X_ORIGIN = 0.3;
const INTRO_PAN_X_AMP = 400;
const INTRO_PAN_Y_ORIGIN = 0.25;
const INTRO_PAN_Y_FREQ = 0.7;
const INTRO_PAN_Y_AMP = 300;

export function followTarget(targetX, targetY, worldW, worldH) {
    const { w, h } = viewport;
    camera.x += ((targetX - w / 2) - camera.x) * FOLLOW_LERP;
    camera.y += ((targetY - h / 2) - camera.y) * FOLLOW_LERP;
    camera.x = Math.max(0, Math.min(worldW - w, camera.x));
    camera.y = Math.max(0, Math.min(worldH - h, camera.y));
}

export function introPan(worldW, worldH) {
    const t = Date.now() * INTRO_PAN_SPEED;
    camera.x = worldW * INTRO_PAN_X_ORIGIN + Math.sin(t) * INTRO_PAN_X_AMP;
    camera.y = worldH * INTRO_PAN_Y_ORIGIN + Math.cos(t * INTRO_PAN_Y_FREQ) * INTRO_PAN_Y_AMP;
}
