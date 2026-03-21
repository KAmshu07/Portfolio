/* Terrain features — water rocks, foam, monument, fires, sheep, clouds */

export const WATER_Y = 1650;

// Monument at spawn center
export const monument = { x: 1200, y: 820 };

// Fire torches near castle
export const fires = [
    { x: 1630, y: 680 },
    { x: 1950, y: 680 },
    { x: 1630, y: 880 },
];

// Sheep near about quarter
export const sheep = { x: 500, y: 480 };

// Water rocks in the river
export const waterRocks = [
    { x: 100,  yOffset: 20,  asset: 'wrocks3' },
    { x: 400,  yOffset: 80,  asset: 'wrocks1' },
    { x: 650,  yOffset: 40,  asset: 'wrocks4' },
    { x: 950,  yOffset: 100, asset: 'wrocks2' },
    { x: 1200, yOffset: 30,  asset: 'wrocks3' },
    { x: 1500, yOffset: 70,  asset: 'wrocks1' },
    { x: 1750, yOffset: 120, asset: 'wrocks4' },
    { x: 2050, yOffset: 50,  asset: 'wrocks2' },
    { x: 2350, yOffset: 90,  asset: 'wrocks3' },
    { x: 2600, yOffset: 35,  asset: 'wrocks1' },
    { x: 300,  yOffset: 150, asset: 'wrocks2' },
    { x: 800,  yOffset: 160, asset: 'wrocks4' },
    { x: 1400, yOffset: 140, asset: 'wrocks3' },
    { x: 2200, yOffset: 170, asset: 'wrocks1' },
];

// Foam spots in the water
export const foamSpots = [
    { x: 150,  yOffset: 40 },  { x: 500,  yOffset: 80 },  { x: 750,  yOffset: 30 },
    { x: 1100, yOffset: 60 },  { x: 1400, yOffset: 100 }, { x: 1700, yOffset: 45 },
    { x: 2000, yOffset: 70 },  { x: 2300, yOffset: 35 },  { x: 2600, yOffset: 90 },
    { x: 350,  yOffset: 120 }, { x: 800,  yOffset: 150 }, { x: 1250, yOffset: 130 },
    { x: 1800, yOffset: 160 }, { x: 2400, yOffset: 110 },
];

// Parallax clouds
export const clouds = [
    { x: 200,  y: -300, asset: 'cloud1', speed: 0.15 },
    { x: 900,  y: -150, asset: 'cloud2', speed: 0.2 },
    { x: 1600, y: -350, asset: 'cloud3', speed: 0.12 },
    { x: 2300, y: -200, asset: 'cloud4', speed: 0.18 },
    { x: 500,  y: -100, asset: 'cloud5', speed: 0.22 },
];
