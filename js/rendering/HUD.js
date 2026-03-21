/* Bottom HUD bar and proximity indicator */
import { ctx } from '../core/Canvas.js';
import {
    HUD_BAR_H, HUD_GRADIENT_OFFSET, HUD_LABEL_FONT_SIZE, HUD_HINT_FONT_SIZE,
    HUD_LABEL_Y_OFFSET, HUD_HINT_Y_OFFSET, HUD_DEFAULT_Y_OFFSET,
    PROX_Y_OFFSET, PROX_BOB_SPEED, PROX_BOB_AMP, PROX_SHADOW_BLUR, PROX_HALF_W, PROX_ARROW_H,
    COLOR_GOLD, FONT_PIXEL,
} from './RenderConfig.js';

/* ─── Cached HUD gradient (recreated on resize) ─── */
let hudGradient = null;
let hudCachedH = 0;

function getHudGradient(h) {
    if (h !== hudCachedH) {
        hudCachedH = h;
        hudGradient = ctx.createLinearGradient(0, h - HUD_BAR_H - HUD_GRADIENT_OFFSET, 0, h);
        hudGradient.addColorStop(0, 'rgba(15,10,5,0)');
        hudGradient.addColorStop(0.4, 'rgba(15,10,5,0.7)');
        hudGradient.addColorStop(1, 'rgba(15,10,5,0.85)');
    }
    return hudGradient;
}

/* ─── Proximity arrow indicator ─── */
export function drawProximityIndicator(nearB, ox, oy, now) {
    const t = now * 0.001;
    const bx = nearB.x + ox + nearB.w / 2;
    const by = nearB.y + oy - PROX_Y_OFFSET + Math.sin(t * PROX_BOB_SPEED) * PROX_BOB_AMP;
    ctx.shadowColor = COLOR_GOLD;
    ctx.shadowBlur = PROX_SHADOW_BLUR;
    ctx.fillStyle = COLOR_GOLD;
    ctx.beginPath();
    ctx.moveTo(bx - PROX_HALF_W, by);
    ctx.lineTo(bx + PROX_HALF_W, by);
    ctx.lineTo(bx, by + PROX_ARROW_H);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
}

/* ─── Bottom HUD bar ─── */
export function drawBottomHUD(nearB, w, h) {
    ctx.fillStyle = getHudGradient(h);
    ctx.fillRect(0, h - HUD_BAR_H - HUD_GRADIENT_OFFSET, w, HUD_BAR_H + HUD_GRADIENT_OFFSET);
    ctx.textAlign = 'center';
    if (nearB) {
        ctx.font = `700 ${HUD_LABEL_FONT_SIZE}px ${FONT_PIXEL}`;
        ctx.fillStyle = COLOR_GOLD;
        ctx.fillText(nearB.label, w / 2, h - HUD_LABEL_Y_OFFSET);
        ctx.font = `400 ${HUD_HINT_FONT_SIZE}px ${FONT_PIXEL}`;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText(nearB.label === 'CONTACT' ? '[E] Open resume' : 'Walk closer to explore', w / 2, h - HUD_HINT_Y_OFFSET);
    } else {
        ctx.font = `400 ${HUD_HINT_FONT_SIZE}px ${FONT_PIXEL}`;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('WASD to move  •  SHIFT to sprint  •  SPACE to follow the wind', w / 2, h - HUD_DEFAULT_Y_OFFSET);
    }
}
