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
    DECO_FRAME_SIZE,
    FIRE_FRAME_SIZE, FIRE_Y_OFFSET, FIRE_SCALE,
    SHEEP_FRAME_SIZE, SHEEP_SCALE, FLOWER_PULSE_SPEED,
    NPC_DEFAULT_FW, NPC_DEFAULT_FH, NPC_DEFAULT_SCALE, NPC_DEFAULT_Y_OFFSET,
    NPC_SHADOW_RX, NPC_SHADOW_RY,
    NAMEPLATE_LINE_HEIGHT, NAMEPLATE_Y_OFFSET, NAMEPLATE_GLOW_BLUR, NAMEPLATE_SLIDE_DIST,
    COLOR_SHADOW, COLOR_NPC_SHADOW, COLOR_NAMEPLATE_BG, COLOR_NAMEPLATE_BORDER, COLOR_GOLD,
    NAMEPLATE_FONT_SIZE, NAMEPLATE_PAD_X, NAMEPLATE_PAD_Y, NAMEPLATE_RADIUS, NAMEPLATE_STROKE_WIDTH,
    FONT_PIXEL,
    BUBBLE_MAX_W, BUBBLE_PAD_X, BUBBLE_PAD_Y, BUBBLE_RADIUS,
    BUBBLE_FONT_SIZE, BUBBLE_LINE_HEIGHT, BUBBLE_Y_OFFSET,
    BUBBLE_TAIL_W, BUBBLE_TAIL_H, BUBBLE_ALPHA,
    COLOR_BUBBLE_BG, COLOR_BUBBLE_BORDER, COLOR_BUBBLE_TEXT,
    FONT_BODY,
} from './RenderConfig.js';

/* ─── Building nameplate ─── */
function drawNameplate(label, cx, cy) {
    ctx.font = `700 ${NAMEPLATE_FONT_SIZE}px ${FONT_PIXEL}`;
    const tw = ctx.measureText(label).width;
    const rx = cx - tw / 2 - NAMEPLATE_PAD_X;
    const ry = cy - NAMEPLATE_FONT_SIZE - NAMEPLATE_PAD_Y;
    const rw = tw + NAMEPLATE_PAD_X * 2;
    const rh = NAMEPLATE_LINE_HEIGHT + NAMEPLATE_PAD_Y * 2;
    ctx.shadowColor = COLOR_GOLD;
    ctx.shadowBlur = NAMEPLATE_GLOW_BLUR;
    ctx.fillStyle = COLOR_NAMEPLATE_BG;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, NAMEPLATE_RADIUS);
    else ctx.rect(rx, ry, rw, rh);
    ctx.fill();
    ctx.shadowBlur = 0;
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

/* ─── Speech bubble ─── */
function wrapText(text, maxW) {
    ctx.font = `400 ${BUBBLE_FONT_SIZE}px ${FONT_BODY}`;
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxW) {
            if (line) lines.push(line);
            line = word;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

function drawSpeechBubble(npc, sx, sy) {
    if (!npc.showSpeech || !npc.dialogue || npc.dialogue.length === 0) return;
    const text = npc.dialogue[npc.dialogueIndex];
    if (!text) return;

    const lines = wrapText(text, BUBBLE_MAX_W - BUBBLE_PAD_X * 2);
    const textW = Math.min(BUBBLE_MAX_W, Math.max(...lines.map(l => ctx.measureText(l).width)) + BUBBLE_PAD_X * 2);
    const textH = lines.length * BUBBLE_LINE_HEIGHT + BUBBLE_PAD_Y * 2;

    const fw = npc.fw || NPC_DEFAULT_FW;
    const s = npc.scale ?? NPC_DEFAULT_SCALE;
    const bx = sx + (fw * s) / 2 - textW / 2;
    const by = sy - textH - BUBBLE_Y_OFFSET - BUBBLE_TAIL_H;

    ctx.globalAlpha = BUBBLE_ALPHA;

    // Bubble background
    ctx.fillStyle = COLOR_BUBBLE_BG;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, textW, textH, BUBBLE_RADIUS);
    else ctx.rect(bx, by, textW, textH);
    ctx.fill();
    ctx.strokeStyle = COLOR_BUBBLE_BORDER;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Tail triangle
    const tailX = bx + textW / 2;
    ctx.fillStyle = COLOR_BUBBLE_BG;
    ctx.beginPath();
    ctx.moveTo(tailX - BUBBLE_TAIL_W, by + textH);
    ctx.lineTo(tailX + BUBBLE_TAIL_W, by + textH);
    ctx.lineTo(tailX, by + textH + BUBBLE_TAIL_H);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.globalAlpha = 1;
    ctx.font = `400 ${BUBBLE_FONT_SIZE}px ${FONT_BODY}`;
    ctx.fillStyle = COLOR_BUBBLE_TEXT;
    ctx.textAlign = 'left';
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], bx + BUBBLE_PAD_X, by + BUBBLE_PAD_Y + BUBBLE_LINE_HEIGHT * (i + 1) - 2);
    }
    ctx.textAlign = 'center';
}

/* ─── Dispatch map ─── */
export const renderers = {
    [EntityType.BUILDING](item) {
        const b = item.data;
        if (IMG[b.asset]) drawImg(IMG[b.asset], item.sx, item.sy, 1.0);
        if (b.nameplateAlpha > 0.01) {
            ctx.globalAlpha = b.nameplateAlpha;
            const slideY = (1 - b.nameplateAlpha) * NAMEPLATE_SLIDE_DIST;
            drawNameplate(b.label, item.sx + b.w / 2, item.sy - NAMEPLATE_Y_OFFSET + slideY);
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
            if (IMG[d.asset]) drawImg(IMG[d.asset], item.sx, item.sy, d.scale);
        } else {
            if (IMG[d.asset]) drawFrame(IMG[d.asset], d.frame, DECO_FRAME_SIZE, DECO_FRAME_SIZE, item.sx, item.sy, d.scale, false);
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
        const fw = n.fw || NPC_DEFAULT_FW, fh = n.fh || NPC_DEFAULT_FH;
        const s = n.scale ?? NPC_DEFAULT_SCALE;
        const yo = n.yOffset ?? NPC_DEFAULT_Y_OFFSET;
        const dw = fw * s, dh = fh * s;
        const footX = item.sx + dw / 2;
        const footY = item.sy + dh - yo;
        ctx.fillStyle = COLOR_NPC_SHADOW;
        ctx.beginPath();
        ctx.ellipse(footX, footY, NPC_SHADOW_RX, NPC_SHADOW_RY, 0, 0, Math.PI * 2);
        ctx.fill();
        drawFrame(img, n.frame, fw, fh, item.sx, footY - dh + yo, s, n.facing === -1);
        drawSpeechBubble(n, item.sx, item.sy);
    },
    [EntityType.PLAYER](item) {
        const animMap = player.walking ? PlayerAnim.run : PlayerAnim.idle;
        const img = IMG[animMap[player.facing]];
        if (!img) return;
        const dw = PLAYER_FRAME_W * PLAYER_DRAW_SCALE, dh = PLAYER_FRAME_H * PLAYER_DRAW_SCALE;
        const drawX = item.sx + player.w / 2 - dw / 2;
        const drawY = item.sy + player.h - dh + PLAYER_DRAW_Y_OFFSET;
        ctx.fillStyle = COLOR_SHADOW;
        ctx.beginPath();
        ctx.ellipse(item.sx + player.w / 2, item.sy + player.h, PLAYER_SHADOW_RX, PLAYER_SHADOW_RY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(img, player.frame * PLAYER_FRAME_W, 0, PLAYER_FRAME_W, PLAYER_FRAME_H, drawX, drawY, dw, dh);
    },
    [EntityType.PARTICLE]: drawParticle,
};
