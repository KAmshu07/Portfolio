/* Decoration definitions — positions and generation parameters */

// Flowers around spawn monument (intentionally placed)
export const flowerSpots = [
    [1150, 840], [1280, 830], [1180, 960], [1260, 970], [1140, 900], [1300, 900],
];

// Path decorations (intentionally placed)
export const pathDecos = [
    { x: 900,  y: 500,  asset: 'deco02', scale: 0.8 },
    { x: 1050, y: 600,  asset: 'deco03', scale: 0.7 },
    { x: 1350, y: 550,  asset: 'deco05', scale: 0.6 },
    { x: 800,  y: 750,  asset: 'deco06', scale: 0.7 },
    { x: 450,  y: 800,  asset: 'deco07', scale: 0.6 },
    { x: 1100, y: 1000, asset: 'deco08', scale: 0.7 },
    { x: 700,  y: 1200, asset: 'deco02', scale: 0.6 },
    { x: 1300, y: 1300, asset: 'deco03', scale: 0.7 },
];

// Generation parameters for random bushes
export const bushGeneration = {
    count: 20,
    assets: ['bush1', 'bush2'],
    scale: 0.6,
    xMin: 100, xRange: 2500,
    yMin: 100, yRange: 1400,
    buildingClearance: 40,
};

// Generation parameters for random rocks
export const rockGeneration = {
    count: 12,
    assets: ['rock1', 'rock2'],
    scale: 0.7,
    xMin: 100, xRange: 2500,
    yMin: 100, yRange: 1400,
    buildingClearance: 40,
};
