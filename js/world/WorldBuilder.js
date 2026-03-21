/* World assembly — builds runtime world state from pure data */
import { buildings as buildingDefs } from '../data/buildings.js';
import { treeSpots, TREE_FADE } from '../data/treeSpots.js';
import { flowerSpots, pathDecos, bushGeneration, rockGeneration } from '../data/decorations.js';
import { WATER_Y, monument as monumentDef, fires as fireDefs, sheep as sheepDef, waterRocks as waterRockDefs, foamSpots as foamSpotDefs, clouds as cloudDefs } from '../data/terrain.js';
import { NPCState, FlowerAssets } from '../data/enums.js';

// Buildings — pure data + runtime state (nameplateAlpha)
export const buildings = buildingDefs.map(b => ({ ...b, nameplateAlpha: 0 }));

// Trees — assign random assets and animation state to spot data
export const trees = treeSpots.map(([x, y]) => {
    const asset = 'tree' + (Math.floor(Math.random() * 4) + 1);
    return {
        x, y, asset,
        frame: Math.floor(Math.random() * 8),
        timer: Math.floor(Math.random() * 10),
        fade: TREE_FADE[asset],
    };
});

// Decorations — assembled from data + randomized placement
export const decos = [];

// Flowers around spawn monument
flowerSpots.forEach(([x, y]) => {
    decos.push({ x, y, asset: Math.random() > 0.5 ? FlowerAssets[0] : FlowerAssets[1], frame: 0, timer: 0, isStatic: true, scale: 1.0 });
});

// Bushes along paths (collision-checked against buildings)
for (let i = 0; i < bushGeneration.count; i++) {
    const x = bushGeneration.xMin + Math.random() * bushGeneration.xRange;
    const y = bushGeneration.yMin + Math.random() * bushGeneration.yRange;
    let ok = true;
    for (const b of buildings) {
        if (Math.abs(x - b.x) < b.w + bushGeneration.buildingClearance && Math.abs(y - b.y) < b.h + bushGeneration.buildingClearance) { ok = false; break; }
    }
    if (ok) decos.push({
        x, y, asset: bushGeneration.assets[Math.random() > 0.5 ? 0 : 1],
        frame: Math.floor(Math.random() * 8),
        timer: Math.floor(Math.random() * 10),
        isStatic: false, scale: bushGeneration.scale,
    });
}

// Rocks scattered (collision-checked against buildings)
for (let i = 0; i < rockGeneration.count; i++) {
    const x = rockGeneration.xMin + Math.random() * rockGeneration.xRange;
    const y = rockGeneration.yMin + Math.random() * rockGeneration.yRange;
    let ok = true;
    for (const b of buildings) {
        if (Math.abs(x - b.x) < b.w + rockGeneration.buildingClearance && Math.abs(y - b.y) < b.h + rockGeneration.buildingClearance) { ok = false; break; }
    }
    if (ok) decos.push({
        x, y, asset: rockGeneration.assets[Math.random() > 0.5 ? 0 : 1],
        frame: 0, timer: 0, isStatic: true, scale: rockGeneration.scale,
    });
}

// Path decorations (intentionally placed)
pathDecos.forEach(d => {
    decos.push({ x: d.x, y: d.y, asset: d.asset, frame: 0, timer: 0, isStatic: true, scale: d.scale });
});

// Monument — static position
export const monument = { ...monumentDef };

// Fire torches — add runtime animation state
export const fires = fireDefs.map(f => ({ ...f, frame: 0, timer: 0 }));

// Sheep — add runtime animation state
export const sheep = { ...sheepDef, frame: 0, timer: 0 };

// Water features — resolve absolute Y from WATER_Y + offset
export const waterRocks = waterRockDefs.map(wr => ({
    x: wr.x, y: WATER_Y + wr.yOffset, asset: wr.asset,
}));

export const foamSpots = foamSpotDefs.map(fs => ({
    x: fs.x, y: WATER_Y + fs.yOffset,
}));

// Clouds — direct pass-through (no runtime state needed at init)
export const clouds = [...cloudDefs];

// Landmarks — single source of truth for positions that NPCs reference
export const landmarks = {
    castle:     { x: buildings[3].x + buildings[3].w / 2, y: buildings[3].y + buildings[3].h },
    barracks:   { x: buildings[4].x + buildings[4].w / 2, y: buildings[4].y + buildings[4].h },
    tower:      { x: buildings[5].x, y: buildings[5].y + buildings[5].h },
    archery:    { x: buildings[6].x + buildings[6].w / 2, y: buildings[6].y },
    monastery:  { x: buildings[7].x + buildings[7].w / 2, y: buildings[7].y },
    contact:    { x: buildings[8].x, y: buildings[8].y },
    techHouse:  { x: buildings[2].x, y: buildings[2].y + buildings[2].h },
    monument,
    sheep,
    torch1:     fires[0],
    torch2:     fires[1],
    treeNW1:    { x: treeSpots[9][0], y: treeSpots[9][1] },
    treeNW2:    { x: treeSpots[10][0], y: treeSpots[10][1] },
    treeGate:   { x: treeSpots[11][0], y: treeSpots[11][1] },
    treeBorder: { x: treeSpots[19][0], y: treeSpots[19][1] },
    treeWater:  { x: treeSpots[25][0], y: treeSpots[25][1] },
    pathDeco:   { x: 800, y: 750 },
};

// NPC villagers — multi-waypoint 2D routes through the village
const NPC_DEFAULTS = { frame: 0, timer: 0, facing: 1, state: NPCState.WALK, idleTimer: 0, currentWP: 0, fw: 192, fh: 192, scale: 0.5, yOffset: 30 };
const L = landmarks;

export const npcs = [
    {
        ...NPC_DEFAULTS,
        x: buildings[3].x + buildings[3].w + 30, y: buildings[3].y + buildings[3].h + 30,
        waypoints: [
            { x: buildings[3].x + buildings[3].w + 30, y: buildings[3].y + buildings[3].h + 30, idle: 80 },
            { x: L.monument.x + 50, y: L.monument.y + 50, idle: 60 },
            { x: 800, y: 900, idle: 20 },
            { x: buildings[0].x + buildings[0].w + 30, y: buildings[0].y + buildings[0].h + 20, idle: 100 },
            { x: L.sheep.x + 60, y: L.sheep.y + 30, idle: 40 },
            { x: 700, y: 1100, idle: 20 },
            { x: buildings[8].x + buildings[8].w + 30, y: buildings[8].y + buildings[8].h + 20, idle: 80 },
            { x: 1100, y: 1100, idle: 20 },
        ],
        idleAsset: 'archerIdle', runAsset: 'archerRun',
        speed: 1.0, idleFrames: 6, runFrames: 4,
    },
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
    {
        ...NPC_DEFAULTS,
        x: L.sheep.x, y: L.sheep.y,
        waypoints: [
            { x: L.sheep.x + 30, y: L.sheep.y + 10, idle: 300 },
            { x: L.treeNW2.x - 20, y: L.treeNW2.y + 60, idle: 150 },
        ],
        idleAsset: 'pawnMeatIdle', runAsset: 'pawnMeatRun',
        speed: 0.3, state: NPCState.IDLE,
    },
    {
        ...NPC_DEFAULTS,
        x: buildings[8].x + 50, y: buildings[8].y + buildings[8].h + 20,
        waypoints: [
            { x: buildings[8].x + 50, y: buildings[8].y + buildings[8].h + 20, idle: 40 },
            { x: L.treeWater.x, y: L.treeWater.y + 40, idle: 30 },
            { x: 2200, y: 1380, idle: 30 },
            { x: 2650, y: 1100, idle: 30 },
            { x: 2650, y: 600, idle: 40 },
            { x: 2600, y: 150, idle: 30 },
            { x: 500, y: 150, idle: 30 },
            { x: 100, y: 400, idle: 30 },
            { x: 100, y: 1200, idle: 30 },
        ],
        idleAsset: 'blackLancerIdle', runAsset: 'blackLancerRun',
        speed: 1.1, idleFrames: 12, runFrames: 6, fw: 320, fh: 320, yOffset: 60,
    },
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
    {
        ...NPC_DEFAULTS,
        x: L.treeGate.x, y: L.treeGate.y,
        waypoints: [
            { x: L.treeGate.x + 30, y: L.treeGate.y + 50, idle: 200 },
            { x: L.pathDeco.x, y: L.pathDeco.y, idle: 100 },
            { x: buildings[2].x + buildings[2].w + 40, y: buildings[2].y + buildings[2].h + 20, idle: 150 },
        ],
        idleAsset: 'yellowWarriorIdle', runAsset: 'yellowWarriorRun',
        speed: 0.5, state: NPCState.IDLE,
    },
    {
        ...NPC_DEFAULTS,
        x: treeSpots[16][0], y: treeSpots[16][1] + 50,
        waypoints: [
            { x: treeSpots[16][0] + 30, y: treeSpots[16][1] + 50, idle: 220 },
            { x: treeSpots[17][0] + 30, y: treeSpots[17][1] + 50, idle: 200 },
            { x: treeSpots[15][0] + 30, y: treeSpots[15][1] + 50, idle: 180 },
        ],
        idleAsset: 'pawnAxeIdle', runAsset: 'pawnAxeRun',
        speed: 0.4,
    },
    {
        ...NPC_DEFAULTS,
        x: buildings[4].x + 50, y: buildings[4].y + buildings[4].h + 20,
        waypoints: [
            { x: buildings[4].x + 50, y: buildings[4].y + buildings[4].h + 30, idle: 250 },
            { x: buildings[5].x + 50, y: buildings[5].y + buildings[5].h + 30, idle: 200 },
            { x: (buildings[4].x + buildings[5].x) / 2, y: buildings[4].y + buildings[4].h + 50, idle: 120 },
        ],
        idleAsset: 'pawnHammerIdle', runAsset: 'pawnHammerRun',
        speed: 0.45,
    },
    {
        ...NPC_DEFAULTS,
        x: buildings[3].x - 30, y: buildings[3].y + buildings[3].h + 20,
        waypoints: [
            { x: buildings[3].x - 30, y: buildings[3].y + buildings[3].h + 20, idle: 100 },
            { x: buildings[3].x + buildings[3].w / 2, y: buildings[3].y + buildings[3].h + 40, idle: 120 },
            { x: buildings[3].x + buildings[3].w + 30, y: buildings[3].y + buildings[3].h + 20, idle: 100 },
        ],
        idleAsset: 'blueWarriorIdle', runAsset: 'blueWarriorRun',
        speed: 0.6,
    },
];

// Animate all world objects (trees, decos, fires, sheep)
export function animateWorld() {
    for (const tr of trees) { tr.timer++; if (tr.timer >= 10) { tr.timer = 0; tr.frame = (tr.frame + 1) % 8; } }
    for (const d of decos) { if (!d.isStatic) { d.timer++; if (d.timer >= 12) { d.timer = 0; d.frame = (d.frame + 1) % 8; } } }
    for (const f of fires) { f.timer++; if (f.timer >= 6) { f.timer = 0; f.frame = (f.frame + 1) % 8; } }
    sheep.timer++; if (sheep.timer >= 10) { sheep.timer = 0; sheep.frame = (sheep.frame + 1) % 6; }
}
