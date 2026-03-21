/* Per-type entity draw functions */
import { ctx } from '../core/Canvas.js';
import { isAllVisited } from '../core/GameState.js';
import { IMG } from '../systems/AssetLoader.js';
import { player } from '../entities/Player.js';
import { npcs } from '../world/WorldBuilder.js';
import { drawFrame, drawImg } from '../utils/sprites.js';
import { drawParticle } from '../systems/ParticleSystem.js';
import { EntityType, NPCState, PlayerAnim, FlowerAssets } from '../data/enums.js';
import {
    TREE_FRAME_W, TREE_FRAME_H, TREE_DRAW_Y_OFFSET, TREE_BEHIND_ALPHA,
    TREE_DEFAULT_FADE, TREE_TRUNK_X_OFFSET, NPC_BEHIND_CHECK,
    FIRE_FRAME_SIZE, FIRE_Y_OFFSET, FIRE_SCALE,
    SHEEP_FRAME_SIZE, SHEEP_SCALE, FLOWER_PULSE_SPEED,
    COLOR_NPC_SHADOW, COLOR_NAMEPLATE_BG, COLOR_NAMEPLATE_BORDER, COLOR_GOLD,
    NAMEPLATE_FONT_SIZE, NAMEPLATE_PAD_X, NAMEPLATE_PAD_Y, NAMEPLATE_RADIUS, NAMEPLATE_STROKE_WIDTH,
    FONT_PIXEL,
} from './RenderConfig.js';

/* ─── Building nameplate ─── */
function drawNameplate(label, cx, cy) {
    ctx.font = `700 ${NAMEPLATE_FONT_SIZE}px ${FONT_PIXEL}`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = COLOR_NAMEPLATE_BG;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(cx - tw / 2 - NAMEPLATE_PAD_X, cy - NAMEPLATE_FONT_SIZE - NAMEPLATE_PAD_Y, tw + NAMEPLATE_PAD_X * 2, 16 + NAMEPLATE_PAD_Y * 2, NAMEPLATE_RADIUS);
    else ctx.rect(cx - tw / 2 - NAMEPLATE_PAD_X, cy - NAMEPLATE_FONT_SIZE - NAMEPLATE_PAD_Y, tw + NAMEPLATE_PAD_X * 2, 16 + NAMEPLATE_PAD_Y * 2);
    ctx.fill();
    ctx.strokeStyle = COLOR_NAMEPLATE_BORDER;
    ctx.lineWidth = NAMEPLATE_STROKE_WIDTH;
    ctx.stroke();
    ctx.fillStyle = COLOR_GOLD;
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy);
}

// Player rendering constants
const PLAYER_FRAME_W = 96;
const PLAYER_FRAME_H = 80;
const PLAYER_DRAW_SCALE = 2.0;
const PLAYER_DRAW_Y_OFFSET = 42;
const PLAYER_SHADOW_RX = 16;
const PLAYER_SHADOW_RY = 5;

/* ─── Dispatch map ─── */
export const renderers = {
    [EntityType.BUILDING](item) {
        const b = item.data;
        if (IMG[b.asset]) drawImg(IMG[b.asset], item.sx, item.sy, 1.0);
        if (b.nameplateAlpha > 0.01) {
            ctx.globalAlpha = b.nameplateAlpha;
            drawNameplate(b.label, item.sx + b.w / 2, item.sy - 12);
            ctx.globalAlpha = 1;
        }
    },
    [EntityType.TREE](item) {
        const tr = item.data;
        if (!IMG[tr.asset]) return;
        const fade = tr.fade || TREE_DEFAULT_FADE;
        const trunkX = tr.x + TREE_TRUNK_X_OFFSET;
        const trunkY = tr.y + fade.base;
        let behindTree = false;
        const checkBehind = (fx, fy) => fy < trunkY && fy > trunkY - fade.yD && Math.abs(fx - trunkX) < fade.xR;
        if (checkBehind(player.x + player.w / 2, player.y + player.h)) behindTree = true;
        if (!behindTree) {
            for (const n of npcs) {
                if (checkBehind(n.x + NPC_BEHIND_CHECK.x, n.y + NPC_BEHIND_CHECK.y)) { behindTree = true; break; }
            }
        }
        if (behindTree) ctx.globalAlpha = TREE_BEHIND_ALPHA;
        drawFrame(IMG[tr.asset], tr.frame, TREE_FRAME_W, TREE_FRAME_H, item.sx, item.sy + TREE_DRAW_Y_OFFSET, 1.0, false);
        if (behindTree) ctx.globalAlpha = 1;
    },
    [EntityType.DECO](item) {
        const d = item.data;
        if (!isAllVisited() && FlowerAssets.includes(d.asset) && d.scale === 1.0) {
            const pulse = 0.5 + 0.5 * Math.sin(Date.now() * FLOWER_PULSE_SPEED);
            ctx.globalAlpha = 0.5 + pulse * 0.5;
        }
        if (d.isStatic) {
            if (IMG[d.asset]) drawImg(IMG[d.asset], item.sx, item.sy, d.scale || 0.8);
        } else {
            if (IMG[d.asset]) drawFrame(IMG[d.asset], d.frame, 128, 128, item.sx, item.sy, d.scale || 0.6, false);
        }
        ctx.globalAlpha = 1;
    },
    [EntityType.MONUMENT](item) {
        if (IMG.deco18) drawImg(IMG.deco18, item.sx, item.sy, 1.0);
    },
    [EntityType.FIRE](item) {
        if (IMG.fire) drawFrame(IMG.fire, item.data.frame, FIRE_FRAME_SIZE, FIRE_FRAME_SIZE, item.sx, item.sy + FIRE_Y_OFFSET, FIRE_SCALE, false);
    },
    [EntityType.SHEEP](item) {
        if (IMG.sheep) drawFrame(IMG.sheep, item.data.frame, SHEEP_FRAME_SIZE, SHEEP_FRAME_SIZE, item.sx, item.sy, SHEEP_SCALE, false);
    },
    [EntityType.NPC](item) {
        const n = item.data;
        const img = n.state === NPCState.WALK ? IMG[n.runAsset] : IMG[n.idleAsset];
        if (!img) return;
        const fw = n.fw || 192, fh = n.fh || 192;
        const s = n.scale ?? 0.5;
        const yo = n.yOffset ?? 5;
        const dw = fw * s, dh = fh * s;
        const footX = item.sx + dw / 2;
        const footY = item.sy + dh - yo;
        ctx.fillStyle = COLOR_NPC_SHADOW;
        ctx.beginPath();
        ctx.ellipse(footX, footY, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        drawFrame(img, n.frame, fw, fh, item.sx, footY - dh + yo, s, n.facing === -1);
    },
    [EntityType.PLAYER](item) {
        const animMap = player.walking ? PlayerAnim.run : PlayerAnim.idle;
        const img = IMG[animMap[player.facing]];
        if (!img) return;
        const dw = PLAYER_FRAME_W * PLAYER_DRAW_SCALE, dh = PLAYER_FRAME_H * PLAYER_DRAW_SCALE;
        const drawX = item.sx + player.w / 2 - dw / 2;
        const drawY = item.sy + player.h - dh + PLAYER_DRAW_Y_OFFSET;
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(item.sx + player.w / 2, item.sy + player.h, PLAYER_SHADOW_RX, PLAYER_SHADOW_RY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(img, player.frame * PLAYER_FRAME_W, 0, PLAYER_FRAME_W, PLAYER_FRAME_H, drawX, drawY, dw, dh);
    },
    [EntityType.PARTICLE]: drawParticle,
};
