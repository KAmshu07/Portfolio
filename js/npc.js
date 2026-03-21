/* NPC AI — state machine (idle/walk/chat), waypoint movement, collision, meetings */
import { buildings } from './world.js';

// NPC behavior constants
const IDLE_FRAME_RATE = 10;
const IDLE_DEFAULT_FRAMES = 8;
const DEFAULT_IDLE_DURATION = 120;
const WALK_FRAME_RATE = 6;
const WALK_DEFAULT_FRAMES = 6;
const CHAT_FRAME_RATE = 10;
const CHAT_DURATION = 90;
const CHAT_COOLDOWN = 180;
const ARRIVAL_THRESHOLD = 5;
const MEETING_PROXIMITY = 60;

// Building collision insets — single source of truth (player.js should import these too)
export const COLLISION_X_INSET = 0.1;
export const COLLISION_Y_INSET = 0.3;
export const COLLISION_W_RATIO = 0.8;
export const COLLISION_H_RATIO = 0.65;

export function updateNPCs(npcs) {
    for (const npc of npcs) {
        const wp = npc.waypoints[npc.currentWP];

        if (npc.state === 'idle') {
            npc.idleTimer++;
            npc.timer++;
            if (npc.timer >= IDLE_FRAME_RATE) { npc.timer = 0; npc.frame = (npc.frame + 1) % (npc.idleFrames || IDLE_DEFAULT_FRAMES); }
            if (npc.idleTimer > (wp.idle || DEFAULT_IDLE_DURATION)) {
                npc.state = 'walk';
                npc.idleTimer = 0;
                npc.currentWP = (npc.currentWP + 1) % npc.waypoints.length;
            }
        } else if (npc.state === 'chat') {
            // Brief stop when meeting another NPC
            npc.idleTimer++;
            npc.timer++;
            if (npc.timer >= CHAT_FRAME_RATE) { npc.timer = 0; npc.frame = (npc.frame + 1) % (npc.idleFrames || IDLE_DEFAULT_FRAMES); }
            if (npc.idleTimer > CHAT_DURATION) { npc.state = 'walk'; npc.idleTimer = 0; npc.chatCooldown = CHAT_COOLDOWN; }
        } else {
            // Walk toward current waypoint in 2D
            const target = npc.waypoints[npc.currentWP];
            const dx = target.x - npc.x;
            const dy = target.y - npc.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < ARRIVAL_THRESHOLD) {
                npc.state = 'idle';
                npc.frame = 0;
                npc.idleTimer = 0;
            } else {
                const nx = npc.x + (dx / dist) * npc.speed;
                const ny = npc.y + (dy / dist) * npc.speed;
                // Building collision — same footprint as player uses
                let blocked = false;
                for (const b of buildings) {
                    const bx = b.x + b.w * COLLISION_X_INSET, by = b.y + b.h * COLLISION_Y_INSET, bw = b.w * COLLISION_W_RATIO, bh = b.h * COLLISION_H_RATIO;
                    if (nx > bx && nx < bx + bw && ny > by && ny < by + bh) { blocked = true; break; }
                }
                if (!blocked) { npc.x = nx; npc.y = ny; }
                else { npc.state = 'idle'; npc.idleTimer = 0; npc.currentWP = (npc.currentWP + 1) % npc.waypoints.length; }
                npc.facing = dx > 0 ? 1 : -1;
                npc.timer++;
                if (npc.timer >= WALK_FRAME_RATE) { npc.timer = 0; npc.frame = (npc.frame + 1) % (npc.runFrames || WALK_DEFAULT_FRAMES); }
            }
        }
    }

    // Tick cooldowns
    for (const npc of npcs) { if (npc.chatCooldown > 0) npc.chatCooldown--; }

    // NPC meetings — when two walking NPCs cross paths, they stop and face each other
    for (let i = 0; i < npcs.length; i++) {
        for (let j = i + 1; j < npcs.length; j++) {
            const a = npcs[i], b = npcs[j];
            if (a.state === 'walk' && b.state === 'walk' && !a.chatCooldown && !b.chatCooldown) {
                const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
                if (dist < MEETING_PROXIMITY) {
                    a.state = 'chat'; a.idleTimer = 0; a.frame = 0;
                    b.state = 'chat'; b.idleTimer = 0; b.frame = 0;
                    a.facing = b.x > a.x ? 1 : -1;
                    b.facing = a.x > b.x ? 1 : -1;
                }
            }
        }
    }
}
