/* Building definitions — position, size, asset, label */
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

export const TOTAL_BUILDINGS = buildings.length;
