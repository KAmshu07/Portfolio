/* World data — buildings, trees, decorations, water features */
import { WATER_Y } from './config.js';

// Buildings
export const buildings = [
    // ABOUT quarter — north-west
    { x: 350,  y: 350,  asset: 'house1',   w: 128, h: 192, label: 'BIO' },
    { x: 650,  y: 250,  asset: 'house2',   w: 128, h: 192, label: 'SKILLS' },
    { x: 250,  y: 650,  asset: 'house3',   w: 128, h: 192, label: 'TECH' },
    // PROJECTS district — east
    { x: 1650, y: 650,  asset: 'castle',   w: 320, h: 256, label: 'PONGZ' },
    { x: 2050, y: 400,  asset: 'barracks', w: 192, h: 256, label: 'ALNAHSHA' },
    { x: 2350, y: 700,  asset: 'tower',    w: 128, h: 256, label: 'ENGINE' },
    { x: 1800, y: 1050, asset: 'archery',  w: 192, h: 256, label: 'RECURVE' },
    { x: 2200, y: 1000, asset: 'monastery',w: 192, h: 320, label: 'SYSTEMS' },
    // CONTACT — south near river
    { x: 900,  y: 1350, asset: 'house1',   w: 128, h: 192, label: 'CONTACT' },
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

// Animate all world objects (trees, decos, fires, sheep)
export function animateWorld() {
    for (const tr of trees) { tr.timer++; if (tr.timer >= 10) { tr.timer = 0; tr.frame = (tr.frame + 1) % 8; } }
    for (const d of decos) { if (!d.isStatic) { d.timer++; if (d.timer >= 12) { d.timer = 0; d.frame = (d.frame + 1) % 8; } } }
    for (const f of fires) { f.timer++; if (f.timer >= 6) { f.timer = 0; f.frame = (f.frame + 1) % 8; } }
    sheep.timer++; if (sheep.timer >= 10) { sheep.timer = 0; sheep.frame = (sheep.frame + 1) % 6; }
}
