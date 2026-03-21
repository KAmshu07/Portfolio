/* NPC AI — state machine (idle/walk/chat), waypoint movement, collision, meetings */
import { buildings } from '../world/WorldBuilder.js';
import { isRectCollidingBuilding } from '../world/Collision.js';
import { NPCState } from '../data/enums.js';

// NPC collision hitbox (centered on position)
const NPC_HITBOX_W = 20;
const NPC_HITBOX_H = 20;

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

export function updateNPCs(npcs, dt) {
    for (const npc of npcs) {
        const wp = npc.waypoints[npc.currentWP];

        if (npc.state === NPCState.IDLE) {
            npc.idleTimer += dt;
            npc.timer += dt;
            if (npc.timer >= IDLE_FRAME_RATE) { npc.timer = 0; npc.frame = (npc.frame + 1) % (npc.idleFrames || IDLE_DEFAULT_FRAMES); }
            if (npc.idleTimer > (wp.idle || DEFAULT_IDLE_DURATION)) {
                npc.state = NPCState.WALK;
                npc.idleTimer = 0;
                npc.currentWP = (npc.currentWP + 1) % npc.waypoints.length;
            }
        } else if (npc.state === NPCState.CHAT) {
            npc.idleTimer += dt;
            npc.timer += dt;
            if (npc.timer >= CHAT_FRAME_RATE) { npc.timer = 0; npc.frame = (npc.frame + 1) % (npc.idleFrames || IDLE_DEFAULT_FRAMES); }
            if (npc.idleTimer > CHAT_DURATION) { npc.state = NPCState.WALK; npc.idleTimer = 0; npc.chatCooldown = CHAT_COOLDOWN; }
        } else {
            const target = npc.waypoints[npc.currentWP];
            const dx = target.x - npc.x;
            const dy = target.y - npc.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < ARRIVAL_THRESHOLD) {
                npc.state = NPCState.IDLE;
                npc.frame = 0;
                npc.idleTimer = 0;
            } else {
                const nx = npc.x + (dx / dist) * npc.speed * dt;
                const ny = npc.y + (dy / dist) * npc.speed * dt;
                let blocked = false;
                for (const b of buildings) {
                    if (isRectCollidingBuilding(nx - NPC_HITBOX_W / 2, ny - NPC_HITBOX_H / 2, NPC_HITBOX_W, NPC_HITBOX_H, b)) { blocked = true; break; }
                }
                if (!blocked) { npc.x = nx; npc.y = ny; }
                else { npc.state = NPCState.IDLE; npc.idleTimer = 0; npc.currentWP = (npc.currentWP + 1) % npc.waypoints.length; }
                npc.facing = dx > 0 ? 1 : -1;
                npc.timer += dt;
                if (npc.timer >= WALK_FRAME_RATE) { npc.timer = 0; npc.frame = (npc.frame + 1) % (npc.runFrames || WALK_DEFAULT_FRAMES); }
            }
        }
    }

    for (const npc of npcs) { if (npc.chatCooldown > 0) npc.chatCooldown = Math.max(0, npc.chatCooldown - dt); }

    for (let i = 0; i < npcs.length; i++) {
        for (let j = i + 1; j < npcs.length; j++) {
            const a = npcs[i], b = npcs[j];
            if (a.state === NPCState.WALK && b.state === NPCState.WALK && !a.chatCooldown && !b.chatCooldown) {
                const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
                if (dist < MEETING_PROXIMITY) {
                    a.state = NPCState.CHAT; a.idleTimer = 0; a.frame = 0;
                    b.state = NPCState.CHAT; b.idleTimer = 0; b.frame = 0;
                    a.facing = b.x > a.x ? 1 : -1;
                    b.facing = a.x > b.x ? 1 : -1;
                }
            }
        }
    }
}
