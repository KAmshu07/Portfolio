/* Zone announcement (Dark Souls style) and achievement toast */
import { ctx } from '../core/Canvas.js';
import { getActiveToast } from '../systems/AchievementSystem.js';
import {
    ZONE_FADE_IN, ZONE_HOLD_END, ZONE_FADE_OUT, ZONE_MAX_ALPHA, ZONE_FONT_SIZE, ZONE_SHADOW_BLUR,
    TOAST_FADE_IN, TOAST_HOLD_END, TOAST_FADE_OUT, TOAST_W, TOAST_H, TOAST_Y,
    TOAST_MAX_ALPHA, TOAST_RADIUS, TOAST_STROKE_W, TOAST_TITLE_SIZE, TOAST_TITLE_Y,
    TOAST_DESC_SIZE, TOAST_DESC_Y,
    COLOR_GOLD, COLOR_TOAST_BG, FONT_PIXEL, FONT_BODY,
} from './RenderConfig.js';

/* ─── Zone announcement ─── */
export function drawZoneAnnouncement(za, w, h, now) {
    if (!za.active) return;
    const elapsed = (now - za.startTime) / 1000;
    if (elapsed < ZONE_FADE_IN) za.alpha = elapsed / ZONE_FADE_IN;
    else if (elapsed < ZONE_HOLD_END) za.alpha = 1;
    else if (elapsed < ZONE_FADE_OUT) za.alpha = 1 - (elapsed - ZONE_HOLD_END) / (ZONE_FADE_OUT - ZONE_HOLD_END);
    else { za.active = false; za.alpha = 0; return; }

    ctx.globalAlpha = za.alpha * ZONE_MAX_ALPHA;
    ctx.font = `700 ${ZONE_FONT_SIZE}px ${FONT_PIXEL}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = COLOR_GOLD;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = ZONE_SHADOW_BLUR;
    ctx.fillText(za.text, w / 2, h / 2);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}

/* ─── Achievement toast ─── */
export function drawAchievementToast(w, h) {
    const toast = getActiveToast();
    if (!toast || !toast.active) return;
    const elapsed = (Date.now() - toast.startTime) / 1000;
    let alpha;
    if (elapsed < TOAST_FADE_IN) alpha = elapsed / TOAST_FADE_IN;
    else if (elapsed < TOAST_HOLD_END) alpha = 1;
    else if (elapsed < TOAST_FADE_OUT) alpha = 1 - (elapsed - TOAST_HOLD_END) / (TOAST_FADE_OUT - TOAST_HOLD_END);
    else return;

    const bx = w / 2 - TOAST_W / 2, by = TOAST_Y;

    ctx.globalAlpha = alpha * TOAST_MAX_ALPHA;
    ctx.fillStyle = COLOR_TOAST_BG;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, TOAST_W, TOAST_H, TOAST_RADIUS);
    else ctx.rect(bx, by, TOAST_W, TOAST_H);
    ctx.fill();
    ctx.strokeStyle = COLOR_GOLD;
    ctx.lineWidth = TOAST_STROKE_W;
    ctx.stroke();

    ctx.globalAlpha = alpha;
    ctx.font = `700 ${TOAST_TITLE_SIZE}px ${FONT_PIXEL}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = COLOR_GOLD;
    ctx.fillText(toast.title, w / 2, by + TOAST_TITLE_Y);
    ctx.font = `400 ${TOAST_DESC_SIZE}px ${FONT_BODY}`;
    ctx.fillStyle = 'rgba(232,228,224,0.8)';
    ctx.fillText(toast.desc, w / 2, by + TOAST_DESC_Y);
    ctx.globalAlpha = 1;
}
