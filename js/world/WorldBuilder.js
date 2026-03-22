/* World assembly — builds runtime world state from pure data */
import { buildings as buildingDefs } from '../data/buildings.js';
import { treeSpots, TREE_FADE, namedTrees } from '../data/treeSpots.js';
import { flowerSpots, pathDecos, bushGeneration, rockGeneration } from '../data/decorations.js';
import { WATER_Y, monument as monumentDef, fires as fireDefs, sheep as sheepDef, waterRocks as waterRockDefs, foamSpots as foamSpotDefs, clouds as cloudDefs } from '../data/terrain.js';
import { NPCState, FlowerAssets } from '../data/enums.js';

// Animation rates and frame counts for animateWorld()
const TREE_ANIM_RATE = 10;
const TREE_ANIM_FRAMES = 8;
const DECO_ANIM_RATE = 12;
const DECO_ANIM_FRAMES = 8;
const FIRE_ANIM_RATE = 6;
const FIRE_ANIM_FRAMES = 8;
const SHEEP_ANIM_RATE = 10;
const SHEEP_ANIM_FRAMES = 6;

// Buildings — pure data + runtime state (nameplateAlpha)
export const buildings = buildingDefs.map(b => ({ ...b, nameplateAlpha: 0 }));

// Label-based building lookup — no index-based access
const buildingMap = new Map(buildings.map(b => [b.label, b]));
function b(label) { return buildingMap.get(label); }

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
    for (const bld of buildings) {
        if (Math.abs(x - bld.x) < bld.w + bushGeneration.buildingClearance && Math.abs(y - bld.y) < bld.h + bushGeneration.buildingClearance) { ok = false; break; }
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
    for (const bld of buildings) {
        if (Math.abs(x - bld.x) < bld.w + rockGeneration.buildingClearance && Math.abs(y - bld.y) < bld.h + rockGeneration.buildingClearance) { ok = false; break; }
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

// Clouds — direct pass-through
export const clouds = [...cloudDefs];

// Helper: derive a position relative to a building's footprint
function bCenter(label) { const bld = b(label); return { x: bld.x + bld.w / 2, y: bld.y + bld.h }; }

// Landmarks — label-based, no index access
const T = namedTrees;
export const landmarks = {
    castle:     bCenter('PONGZ'),
    barracks:   bCenter('ALNAHSHA'),
    tower:      { x: b('ENGINE').x, y: b('ENGINE').y + b('ENGINE').h },
    archery:    { x: b('RECURVE').x + b('RECURVE').w / 2, y: b('RECURVE').y },
    monastery:  { x: b('SYSTEMS').x + b('SYSTEMS').w / 2, y: b('SYSTEMS').y },
    forge:      bCenter('INSTA_RELOAD'),
    contact:    { x: b('CONTACT').x, y: b('CONTACT').y },
    techHouse:  { x: b('TECH').x, y: b('TECH').y + b('TECH').h },
    monument,
    sheep,
    torch1:     fires[0],
    torch2:     fires[1],
    treeNW1:    T.nw1,
    treeNW2:    T.nw2,
    treeGate:   T.gate,
    treeBorder: T.border,
    treeWater:  T.water,
    pathDeco:   { x: 800, y: 750 },
};

// NPC villagers — all positions derived from labels and named landmarks
const NPC_DEFAULTS = { frame: 0, timer: 0, facing: 1, state: NPCState.WALK, idleTimer: 0, chatCooldown: 0, currentWP: 0, fw: 192, fh: 192, scale: 0.5, yOffset: 30 };
const L = landmarks;

export const npcs = [
    // Kingdom ranger (Red Archer) — patrols the entire map
    {
        ...NPC_DEFAULTS,
        x: b('PONGZ').x + b('PONGZ').w + 30, y: b('PONGZ').y + b('PONGZ').h + 30,
        waypoints: [
            { x: b('PONGZ').x + b('PONGZ').w + 30, y: b('PONGZ').y + b('PONGZ').h + 30, idle: 80 },
            { x: L.monument.x + 50, y: L.monument.y + 50, idle: 60 },
            { x: 800, y: 900, idle: 20 },
            { x: b('BIO').x + b('BIO').w + 30, y: b('BIO').y + b('BIO').h + 20, idle: 100 },
            { x: L.sheep.x + 60, y: L.sheep.y + 30, idle: 40 },
            { x: 700, y: 1100, idle: 20 },
            { x: b('CONTACT').x + b('CONTACT').w + 30, y: b('CONTACT').y + b('CONTACT').h + 20, idle: 80 },
            { x: 1100, y: 1100, idle: 20 },
        ],
        idleAsset: 'archerIdle', runAsset: 'archerRun',
        speed: 1.0, idleFrames: 6, runFrames: 4,
    },
    // Monk — monastery to archery, meditates at monument
    {
        ...NPC_DEFAULTS,
        x: L.monastery.x, y: L.monastery.y,
        waypoints: [
            { x: L.monastery.x + 50, y: b('SYSTEMS').y + b('SYSTEMS').h + 30, idle: 300 },
            { x: L.archery.x + 50, y: b('RECURVE').y + b('RECURVE').h + 30, idle: 200 },
            { x: L.monument.x + 100, y: L.monument.y, idle: 250 },
        ],
        idleAsset: 'monkIdle', runAsset: 'monkRun',
        speed: 0.35, idleFrames: 6, runFrames: 4,
    },
    // Woodcutter — chops at trees, hauls to tech house
    {
        ...NPC_DEFAULTS,
        x: T.nw1.x, y: T.nw1.y,
        waypoints: [
            { x: T.nw1.x + 30, y: T.nw1.y + 50, idle: 200 },
            { x: T.nw2.x + 30, y: T.nw2.y + 50, idle: 120 },
            { x: b('TECH').x + b('TECH').w + 30, y: b('TECH').y + b('TECH').h + 20, idle: 100 },
        ],
        idleAsset: 'pawnWoodIdle', runAsset: 'pawnWoodRun',
        speed: 0.4,
    },
    // Gold carrier — monument to castle delivery
    {
        ...NPC_DEFAULTS,
        x: L.monument.x, y: L.monument.y,
        waypoints: [
            { x: L.monument.x + 30, y: L.monument.y - 30, idle: 120 },
            { x: 1400, y: 720, idle: 40 },
            { x: b('PONGZ').x + b('PONGZ').w / 2, y: b('PONGZ').y + b('PONGZ').h + 30, idle: 150 },
        ],
        idleAsset: 'pawnGoldIdle', runAsset: 'pawnGoldRun',
        speed: 0.55,
    },
    // Shepherd — sheep to nearby tree shade
    {
        ...NPC_DEFAULTS,
        x: L.sheep.x, y: L.sheep.y,
        waypoints: [
            { x: L.sheep.x + 30, y: L.sheep.y + 10, idle: 300 },
            { x: T.nw2.x - 20, y: T.nw2.y + 60, idle: 150 },
        ],
        idleAsset: 'pawnMeatIdle', runAsset: 'pawnMeatRun',
        speed: 0.3, state: NPCState.IDLE,
    },
    // Border guard (Black Lancer) — full perimeter patrol
    {
        ...NPC_DEFAULTS,
        x: b('CONTACT').x + 50, y: b('CONTACT').y + b('CONTACT').h + 20,
        waypoints: [
            { x: b('CONTACT').x + 50, y: b('CONTACT').y + b('CONTACT').h + 20, idle: 40 },
            { x: T.water.x, y: T.water.y + 40, idle: 30 },
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
    // Miner — tower quarry to border rocks to barracks
    {
        ...NPC_DEFAULTS,
        x: L.tower.x, y: L.tower.y - 100,
        waypoints: [
            { x: L.tower.x + 30, y: L.tower.y - 100, idle: 200 },
            { x: T.border.x - 30, y: T.border.y, idle: 180 },
            { x: b('ALNAHSHA').x - 30, y: b('ALNAHSHA').y + b('ALNAHSHA').h + 20, idle: 100 },
        ],
        idleAsset: 'pawnPickIdle', runAsset: 'pawnPickRun',
        speed: 0.45,
    },
    // Gate warrior — patrols gate, path, tech house
    {
        ...NPC_DEFAULTS,
        x: T.gate.x, y: T.gate.y,
        waypoints: [
            { x: T.gate.x + 30, y: T.gate.y + 50, idle: 200 },
            { x: L.pathDeco.x, y: L.pathDeco.y, idle: 100 },
            { x: b('TECH').x + b('TECH').w + 40, y: b('TECH').y + b('TECH').h + 20, idle: 150 },
        ],
        idleAsset: 'yellowWarriorIdle', runAsset: 'yellowWarriorRun',
        speed: 0.5, state: NPCState.IDLE,
    },
    // Lumberjack (Blue Pawn w/ Axe) — chops in projects district
    {
        ...NPC_DEFAULTS,
        x: T.projectTree1.x, y: T.projectTree1.y + 50,
        waypoints: [
            { x: T.projectTree1.x + 30, y: T.projectTree1.y + 50, idle: 220 },
            { x: T.projectTree2.x + 30, y: T.projectTree2.y + 50, idle: 200 },
            { x: T.projectTree3.x + 30, y: T.projectTree3.y + 50, idle: 180 },
        ],
        idleAsset: 'pawnAxeIdle', runAsset: 'pawnAxeRun',
        speed: 0.4,
    },
    // Builder (Yellow Pawn w/ Hammer) — works near barracks and tower
    {
        ...NPC_DEFAULTS,
        x: b('ALNAHSHA').x + 50, y: b('ALNAHSHA').y + b('ALNAHSHA').h + 20,
        waypoints: [
            { x: b('ALNAHSHA').x + 50, y: b('ALNAHSHA').y + b('ALNAHSHA').h + 30, idle: 250 },
            { x: b('ENGINE').x + 50, y: b('ENGINE').y + b('ENGINE').h + 30, idle: 200 },
            { x: (b('ALNAHSHA').x + b('ENGINE').x) / 2, y: b('ALNAHSHA').y + b('ALNAHSHA').h + 50, idle: 120 },
        ],
        idleAsset: 'pawnHammerIdle', runAsset: 'pawnHammerRun',
        speed: 0.45,
    },
    // Castle guard (Blue Warrior) — patrols outside castle walls
    {
        ...NPC_DEFAULTS,
        x: b('PONGZ').x - 30, y: b('PONGZ').y + b('PONGZ').h + 20,
        waypoints: [
            { x: b('PONGZ').x - 30, y: b('PONGZ').y + b('PONGZ').h + 20, idle: 100 },
            { x: b('PONGZ').x + b('PONGZ').w / 2, y: b('PONGZ').y + b('PONGZ').h + 40, idle: 120 },
            { x: b('PONGZ').x + b('PONGZ').w + 30, y: b('PONGZ').y + b('PONGZ').h + 20, idle: 100 },
        ],
        idleAsset: 'blueWarriorIdle', runAsset: 'blueWarriorRun',
        speed: 0.6,
    },
];

// Animate all world objects (trees, decos, fires, sheep)
export function animateWorld(dt) {
    for (const tr of trees) { tr.timer += dt; if (tr.timer >= TREE_ANIM_RATE) { tr.timer = 0; tr.frame = (tr.frame + 1) % TREE_ANIM_FRAMES; } }
    for (const d of decos) { if (!d.isStatic) { d.timer += dt; if (d.timer >= DECO_ANIM_RATE) { d.timer = 0; d.frame = (d.frame + 1) % DECO_ANIM_FRAMES; } } }
    for (const f of fires) { f.timer += dt; if (f.timer >= FIRE_ANIM_RATE) { f.timer = 0; f.frame = (f.frame + 1) % FIRE_ANIM_FRAMES; } }
    sheep.timer += dt; if (sheep.timer >= SHEEP_ANIM_RATE) { sheep.timer = 0; sheep.frame = (sheep.frame + 1) % SHEEP_ANIM_FRAMES; }
}
