/* World data — buildings, trees, decorations, water features */
import { WATER_Y } from './config.js';

// Buildings
export const buildings = [
    // ABOUT quarter — north-west
    { x: 350,  y: 350,  asset: 'house1',   w: 128, h: 192, label: 'BIO',      nameplateAlpha: 0 },
    { x: 650,  y: 250,  asset: 'house2',   w: 128, h: 192, label: 'SKILLS',   nameplateAlpha: 0 },
    { x: 250,  y: 650,  asset: 'house3',   w: 128, h: 192, label: 'TECH',     nameplateAlpha: 0 },
    // PROJECTS district — east
    { x: 1650, y: 650,  asset: 'castle',   w: 320, h: 256, label: 'PONGZ',    nameplateAlpha: 0 },
    { x: 2050, y: 400,  asset: 'barracks', w: 192, h: 256, label: 'ALNAHSHA', nameplateAlpha: 0 },
    { x: 2350, y: 700,  asset: 'tower',    w: 128, h: 256, label: 'ENGINE',   nameplateAlpha: 0 },
    { x: 1800, y: 1050, asset: 'archery',  w: 192, h: 256, label: 'RECURVE',  nameplateAlpha: 0 },
    { x: 2200, y: 1000, asset: 'monastery',w: 192, h: 320, label: 'SYSTEMS',  nameplateAlpha: 0 },
    // CONTACT — south near river
    { x: 900,  y: 1350, asset: 'house1',   w: 128, h: 192, label: 'CONTACT',  nameplateAlpha: 0 },
];

// Tree transparency config per type
const TREE_FADE = {
    tree1: { xR: 75, yD: 180, base: 220 },
    tree2: { xR: 70, yD: 220, base: 210 },
    tree3: { xR: 55, yD: 180, base: 140 },
    tree4: { xR: 50, yD: 130, base: 140 },
};

const treeSpots = [
    // Border trees
    [50,100],[180,50],[2600,100],[2700,300],[2650,600],[2600,1000],[2500,1300],
    // About quarter
    [100,200],[550,100],[200,500],[500,550],[700,500],
    // Path: spawn to projects
    [1100,500],[1300,400],[1500,350],[1400,700],
    // Projects district
    [1550,300],[2000,200],[2500,400],[2550,850],[2400,1200],
    // Path to contact
    [700,900],[500,1100],[600,1300],[1100,1200],
    // Near water
    [300,1400],[1500,1350],[2000,1350],[2400,1400],
];

export const trees = treeSpots.map(([x, y]) => {
    const asset = 'tree' + (Math.floor(Math.random() * 4) + 1);
    return {
        x, y, asset,
        frame: Math.floor(Math.random() * 8),
        timer: Math.floor(Math.random() * 10),
        fade: TREE_FADE[asset],
    };
});

// Decorations
export const decos = [];

// Flowers around spawn monument
[[1150,840],[1280,830],[1180,960],[1260,970],[1140,900],[1300,900]].forEach(([x, y]) => {
    decos.push({ x, y, asset: Math.random() > 0.5 ? 'deco01' : 'deco04', frame: 0, timer: 0, isStatic: true, scale: 1.0 });
});

// Bushes along paths
for (let i = 0; i < 20; i++) {
    const x = 100 + Math.random() * 2500;
    const y = 100 + Math.random() * 1400;
    let ok = true;
    for (const b of buildings) {
        if (Math.abs(x - b.x) < b.w + 40 && Math.abs(y - b.y) < b.h + 40) { ok = false; break; }
    }
    if (ok) decos.push({
        x, y, asset: Math.random() > 0.5 ? 'bush1' : 'bush2',
        frame: Math.floor(Math.random() * 8),
        timer: Math.floor(Math.random() * 10),
        isStatic: false, scale: 0.6,
    });
}

// Rocks scattered (collision-checked against buildings like bushes)
for (let i = 0; i < 12; i++) {
    const x = 100 + Math.random() * 2500;
    const y = 100 + Math.random() * 1400;
    let ok = true;
    for (const b of buildings) {
        if (Math.abs(x - b.x) < b.w + 40 && Math.abs(y - b.y) < b.h + 40) { ok = false; break; }
    }
    if (ok) decos.push({
        x, y, asset: Math.random() > 0.5 ? 'rock1' : 'rock2',
        frame: 0, timer: 0, isStatic: true, scale: 0.7,
    });
}

// Path decorations (intentionally placed)
[
    { x: 900,  y: 500,  asset: 'deco02', scale: 0.8 },
    { x: 1050, y: 600,  asset: 'deco03', scale: 0.7 },
    { x: 1350, y: 550,  asset: 'deco05', scale: 0.6 },
    { x: 800,  y: 750,  asset: 'deco06', scale: 0.7 },
    { x: 450,  y: 800,  asset: 'deco07', scale: 0.6 },
    { x: 1100, y: 1000, asset: 'deco08', scale: 0.7 },
    { x: 700,  y: 1200, asset: 'deco02', scale: 0.6 },
    { x: 1300, y: 1300, asset: 'deco03', scale: 0.7 },
].forEach(d => {
    decos.push({ x: d.x, y: d.y, asset: d.asset, frame: 0, timer: 0, isStatic: true, scale: d.scale });
});

// Monument at spawn center
export const monument = { x: 1200, y: 820 };

// Fire torches near castle
export const fires = [
    { x: 1630, y: 680, frame: 0, timer: 0 },
    { x: 1950, y: 680, frame: 0, timer: 0 },
    { x: 1630, y: 880, frame: 0, timer: 0 },
];

// Sheep near about quarter
export const sheep = { x: 500, y: 480, frame: 0, timer: 0 };

// Water rocks in the river
export const waterRocks = [
    { x: 100,  y: WATER_Y + 20,  asset: 'wrocks3' },
    { x: 400,  y: WATER_Y + 80,  asset: 'wrocks1' },
    { x: 650,  y: WATER_Y + 40,  asset: 'wrocks4' },
    { x: 950,  y: WATER_Y + 100, asset: 'wrocks2' },
    { x: 1200, y: WATER_Y + 30,  asset: 'wrocks3' },
    { x: 1500, y: WATER_Y + 70,  asset: 'wrocks1' },
    { x: 1750, y: WATER_Y + 120, asset: 'wrocks4' },
    { x: 2050, y: WATER_Y + 50,  asset: 'wrocks2' },
    { x: 2350, y: WATER_Y + 90,  asset: 'wrocks3' },
    { x: 2600, y: WATER_Y + 35,  asset: 'wrocks1' },
    { x: 300,  y: WATER_Y + 150, asset: 'wrocks2' },
    { x: 800,  y: WATER_Y + 160, asset: 'wrocks4' },
    { x: 1400, y: WATER_Y + 140, asset: 'wrocks3' },
    { x: 2200, y: WATER_Y + 170, asset: 'wrocks1' },
];

// Foam spots in the water
export const foamSpots = [
    { x: 150,  y: WATER_Y + 40 },  { x: 500,  y: WATER_Y + 80 },  { x: 750,  y: WATER_Y + 30 },
    { x: 1100, y: WATER_Y + 60 },  { x: 1400, y: WATER_Y + 100 }, { x: 1700, y: WATER_Y + 45 },
    { x: 2000, y: WATER_Y + 70 },  { x: 2300, y: WATER_Y + 35 },  { x: 2600, y: WATER_Y + 90 },
    { x: 350,  y: WATER_Y + 120 }, { x: 800,  y: WATER_Y + 150 }, { x: 1250, y: WATER_Y + 130 },
    { x: 1800, y: WATER_Y + 160 }, { x: 2400, y: WATER_Y + 110 },
];

// Landmarks — single source of truth for world positions that NPCs reference
// Derived from actual world objects above. Move a building/tree → NPCs auto-update.
const L = {
    // Buildings (center X of each)
    castle:     { x: buildings[3].x + buildings[3].w / 2, y: buildings[3].y + buildings[3].h },
    barracks:   { x: buildings[4].x + buildings[4].w / 2, y: buildings[4].y + buildings[4].h },
    tower:      { x: buildings[5].x, y: buildings[5].y + buildings[5].h },
    archery:    { x: buildings[6].x + buildings[6].w / 2, y: buildings[6].y },
    monastery:  { x: buildings[7].x + buildings[7].w / 2, y: buildings[7].y },
    contact:    { x: buildings[8].x, y: buildings[8].y },
    techHouse:  { x: buildings[2].x, y: buildings[2].y + buildings[2].h },
    // Key objects
    monument:   monument,
    sheep:      sheep,
    torch1:     fires[0],
    torch2:     fires[1],
    // Named trees (by index in treeSpots: about quarter trees are indices 7-11)
    treeNW1:    { x: treeSpots[9][0], y: treeSpots[9][1] },   // (200,500)
    treeNW2:    { x: treeSpots[10][0], y: treeSpots[10][1] },  // (500,550)
    treeGate:   { x: treeSpots[11][0], y: treeSpots[11][1] },  // (700,500)
    treeBorder: { x: treeSpots[19][0], y: treeSpots[19][1] },  // (2550,850)
    treeWater:  { x: treeSpots[25][0], y: treeSpots[25][1] },  // (1500,1350)
    // Path decorations
    pathDeco:   { x: 800, y: 750 },
};

// NPC villagers — multi-waypoint 2D routes through the village
// Each NPC has a waypoints array: [{x, y, idle}] defining their daily loop
// NPCs walk in 2D toward each waypoint, idle there, then move to the next
const NPC_DEFAULTS = { frame: 0, timer: 0, facing: 1, state: 'walk', idleTimer: 0, currentWP: 0, fw: 192, fh: 192, scale: 0.5, yOffset: 30 };

export const npcs = [
    // Castle guard — patrols OUTSIDE the castle: left side → front → right side
    {
        ...NPC_DEFAULTS,
        x: buildings[3].x - 30, y: L.castle.y,
        waypoints: [
            { x: buildings[3].x - 30, y: buildings[3].y + buildings[3].h + 20, idle: 60 },
            { x: buildings[3].x + buildings[3].w / 2, y: buildings[3].y + buildings[3].h + 30, idle: 80 },
            { x: buildings[3].x + buildings[3].w + 30, y: buildings[3].y + buildings[3].h + 20, idle: 60 },
        ],
        idleAsset: 'archerIdle', runAsset: 'archerRun',
        speed: 0.8, idleFrames: 6, runFrames: 4,
    },
    // Monk — walks from monastery to archery, stops at monument to meditate, loops back
    {
        ...NPC_DEFAULTS,
        x: L.monastery.x, y: L.monastery.y,
        waypoints: [
            { x: L.monastery.x + 50, y: buildings[7].y + buildings[7].h + 30, idle: 300 },
            { x: L.archery.x + 50, y: buildings[6].y + buildings[6].h + 30, idle: 200 },
            { x: L.monument.x + 100, y: L.monument.y, idle: 250 },
        ],
        idleAsset: 'monkIdle', runAsset: 'monkRun',
        speed: 0.35, idleFrames: 6, runFrames: 4,
    },
    // Woodcutter — chops at tree, hauls to tech house, rests, loops
    {
        ...NPC_DEFAULTS,
        x: L.treeNW1.x, y: L.treeNW1.y,
        waypoints: [
            { x: L.treeNW1.x + 30, y: L.treeNW1.y + 50, idle: 200 },
            { x: L.treeNW2.x + 30, y: L.treeNW2.y + 50, idle: 120 },
            { x: buildings[2].x + buildings[2].w + 30, y: buildings[2].y + buildings[2].h + 20, idle: 100 },
        ],
        idleAsset: 'pawnWoodIdle', runAsset: 'pawnWoodRun',
        speed: 0.4,
    },
    // Gold carrier — monument → midway rest → castle delivery → back
    {
        ...NPC_DEFAULTS,
        x: L.monument.x, y: L.monument.y,
        waypoints: [
            { x: L.monument.x + 30, y: L.monument.y - 30, idle: 120 },
            { x: 1400, y: 720, idle: 40 },
            { x: buildings[3].x + buildings[3].w / 2, y: buildings[3].y + buildings[3].h + 30, idle: 150 },
        ],
        idleAsset: 'pawnGoldIdle', runAsset: 'pawnGoldRun',
        speed: 0.55,
    },
    // Shepherd — sheep → nearby tree shade → back to sheep
    {
        ...NPC_DEFAULTS,
        x: L.sheep.x, y: L.sheep.y,
        waypoints: [
            { x: L.sheep.x + 30, y: L.sheep.y + 10, idle: 300 },
            { x: L.treeNW2.x - 20, y: L.treeNW2.y + 60, idle: 150 },
        ],
        idleAsset: 'pawnMeatIdle', runAsset: 'pawnMeatRun',
        speed: 0.3, state: 'idle',
    },
    // Border guard — long patrol: contact house → south trees → water tree → back
    {
        ...NPC_DEFAULTS,
        x: L.contact.x, y: L.contact.y + 30,
        waypoints: [
            { x: L.contact.x + 50, y: L.contact.y + 30, idle: 40 },
            { x: 1100, y: 1380, idle: 30 },
            { x: L.treeWater.x, y: L.treeWater.y + 30, idle: 50 },
        ],
        idleAsset: 'blackLancerIdle', runAsset: 'blackLancerRun',
        speed: 0.9, idleFrames: 12, runFrames: 6, fw: 320, fh: 320, yOffset: 60,
    },
    // Miner — tower quarry → border rocks → barracks supply drop → loop
    {
        ...NPC_DEFAULTS,
        x: L.tower.x, y: L.tower.y - 100,
        waypoints: [
            { x: L.tower.x + 30, y: L.tower.y - 100, idle: 200 },
            { x: L.treeBorder.x - 30, y: L.treeBorder.y, idle: 180 },
            { x: buildings[4].x - 30, y: buildings[4].y + buildings[4].h + 20, idle: 100 },
        ],
        idleAsset: 'pawnPickIdle', runAsset: 'pawnPickRun',
        speed: 0.45,
    },
    // Gate warrior — patrols between gate, path, and tech house
    {
        ...NPC_DEFAULTS,
        x: L.treeGate.x, y: L.treeGate.y,
        waypoints: [
            { x: L.treeGate.x + 30, y: L.treeGate.y + 50, idle: 200 },
            { x: L.pathDeco.x, y: L.pathDeco.y, idle: 100 },
            { x: buildings[2].x + buildings[2].w + 40, y: buildings[2].y + buildings[2].h + 20, idle: 150 },
        ],
        idleAsset: 'yellowWarriorIdle', runAsset: 'yellowWarriorRun',
        speed: 0.5, state: 'idle',
    },
];

export function updateNPCs() {
    for (const npc of npcs) {
        const wp = npc.waypoints[npc.currentWP];

        if (npc.state === 'idle') {
            npc.idleTimer++;
            npc.timer++;
            if (npc.timer >= 10) { npc.timer = 0; npc.frame = (npc.frame + 1) % (npc.idleFrames || 8); }
            if (npc.idleTimer > (wp.idle || 120)) {
                npc.state = 'walk';
                npc.idleTimer = 0;
                npc.currentWP = (npc.currentWP + 1) % npc.waypoints.length;
            }
        } else if (npc.state === 'chat') {
            // Brief stop when meeting another NPC
            npc.idleTimer++;
            npc.timer++;
            if (npc.timer >= 10) { npc.timer = 0; npc.frame = (npc.frame + 1) % (npc.idleFrames || 8); }
            if (npc.idleTimer > 90) { npc.state = 'walk'; npc.idleTimer = 0; npc.chatCooldown = 180; }
        } else {
            // Walk toward current waypoint in 2D
            const target = npc.waypoints[npc.currentWP];
            const dx = target.x - npc.x;
            const dy = target.y - npc.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                npc.state = 'idle';
                npc.frame = 0;
                npc.idleTimer = 0;
            } else {
                const nx = npc.x + (dx / dist) * npc.speed;
                const ny = npc.y + (dy / dist) * npc.speed;
                // Building collision — same footprint as player uses
                let blocked = false;
                for (const b of buildings) {
                    const bx = b.x + b.w * 0.1, by = b.y + b.h * 0.3, bw = b.w * 0.8, bh = b.h * 0.65;
                    if (nx > bx && nx < bx + bw && ny > by && ny < by + bh) { blocked = true; break; }
                }
                if (!blocked) { npc.x = nx; npc.y = ny; }
                else { npc.state = 'idle'; npc.idleTimer = 0; npc.currentWP = (npc.currentWP + 1) % npc.waypoints.length; }
                npc.facing = dx > 0 ? 1 : -1;
                npc.timer++;
                if (npc.timer >= 6) { npc.timer = 0; npc.frame = (npc.frame + 1) % (npc.runFrames || 6); }
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
                if (dist < 60) {
                    a.state = 'chat'; a.idleTimer = 0; a.frame = 0;
                    b.state = 'chat'; b.idleTimer = 0; b.frame = 0;
                    a.facing = b.x > a.x ? 1 : -1;
                    b.facing = a.x > b.x ? 1 : -1;
                }
            }
        }
    }
}

// Animate all world objects (trees, decos, fires, sheep)
export function animateWorld() {
    for (const tr of trees) { tr.timer++; if (tr.timer >= 10) { tr.timer = 0; tr.frame = (tr.frame + 1) % 8; } }
    for (const d of decos) { if (!d.isStatic) { d.timer++; if (d.timer >= 12) { d.timer = 0; d.frame = (d.frame + 1) % 8; } } }
    for (const f of fires) { f.timer++; if (f.timer >= 6) { f.timer = 0; f.frame = (f.frame + 1) % 8; } }
    sheep.timer++; if (sheep.timer >= 10) { sheep.timer = 0; sheep.frame = (sheep.frame + 1) % 6; }
}

// Parallax clouds (rendered above entities)
export const clouds = [
    { x: 200,  y: -300, asset: 'cloud1', speed: 0.15 },
    { x: 900,  y: -150, asset: 'cloud2', speed: 0.2 },
    { x: 1600, y: -350, asset: 'cloud3', speed: 0.12 },
    { x: 2300, y: -200, asset: 'cloud4', speed: 0.18 },
    { x: 500,  y: -100, asset: 'cloud5', speed: 0.22 },
];
