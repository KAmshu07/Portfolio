/* NPC definitions — waypoints use landmark keys, resolved at runtime by WorldBuilder */

export const NPC_DEFAULTS = {
    fw: 192, fh: 192, scale: 0.5, yOffset: 30,
    idleFrames: 8, runFrames: 6,
};

export const npcDefinitions = [
    // Kingdom ranger (Red Archer) — patrols the ENTIRE map
    {
        idleAsset: 'archerIdle', runAsset: 'archerRun',
        speed: 1.0, idleFrames: 6, runFrames: 4,
        startLandmark: 'castleExit',
        waypoints: [
            { landmark: 'castleExit', idle: 80 },
            { landmark: 'monumentSE', idle: 60 },
            { x: 800, y: 900, idle: 20 },
            { landmark: 'bioExit', idle: 100 },
            { landmark: 'sheepNear', idle: 40 },
            { x: 700, y: 1100, idle: 20 },
            { landmark: 'contactExit', idle: 80 },
            { x: 1100, y: 1100, idle: 20 },
        ],
    },
    // Monk — monastery to archery, meditates at monument
    {
        idleAsset: 'monkIdle', runAsset: 'monkRun',
        speed: 0.35, idleFrames: 6, runFrames: 4,
        startLandmark: 'monasteryCenter',
        waypoints: [
            { landmark: 'monasteryExit', idle: 300 },
            { landmark: 'archeryExit', idle: 200 },
            { landmark: 'monumentE', idle: 250 },
        ],
    },
    // Woodcutter — chops at trees, hauls to tech house
    {
        idleAsset: 'pawnWoodIdle', runAsset: 'pawnWoodRun',
        speed: 0.4,
        startLandmark: 'treeNW1',
        waypoints: [
            { landmark: 'treeNW1Near', idle: 200 },
            { landmark: 'treeNW2Near', idle: 120 },
            { landmark: 'techExit', idle: 100 },
        ],
    },
    // Gold carrier — monument to castle delivery
    {
        idleAsset: 'pawnGoldIdle', runAsset: 'pawnGoldRun',
        speed: 0.55,
        startLandmark: 'monument',
        waypoints: [
            { landmark: 'monumentNear', idle: 120 },
            { x: 1400, y: 720, idle: 40 },
            { landmark: 'castleCenter', idle: 150 },
        ],
    },
    // Shepherd — sheep to nearby tree shade
    {
        idleAsset: 'pawnMeatIdle', runAsset: 'pawnMeatRun',
        speed: 0.3, startIdle: true,
        startLandmark: 'sheep',
        waypoints: [
            { landmark: 'sheepClose', idle: 300 },
            { landmark: 'treeNW2Shade', idle: 150 },
        ],
    },
    // Border guard (Black Lancer) — full perimeter patrol
    {
        idleAsset: 'blackLancerIdle', runAsset: 'blackLancerRun',
        speed: 1.1, idleFrames: 12, runFrames: 6, fw: 320, fh: 320, yOffset: 60,
        startLandmark: 'contactFootExit',
        waypoints: [
            { landmark: 'contactFootExit', idle: 40 },
            { landmark: 'treeWaterNear', idle: 30 },
            { x: 2200, y: 1380, idle: 30 },
            { x: 2650, y: 1100, idle: 30 },
            { x: 2650, y: 600, idle: 40 },
            { x: 2600, y: 150, idle: 30 },
            { x: 500, y: 150, idle: 30 },
            { x: 100, y: 400, idle: 30 },
            { x: 100, y: 1200, idle: 30 },
        ],
    },
    // Miner — tower quarry to border rocks to barracks
    {
        idleAsset: 'pawnPickIdle', runAsset: 'pawnPickRun',
        speed: 0.45,
        startLandmark: 'towerHigh',
        waypoints: [
            { landmark: 'towerNear', idle: 200 },
            { landmark: 'treeBorderNear', idle: 180 },
            { landmark: 'barracksEntrance', idle: 100 },
        ],
    },
    // Gate warrior — patrols gate, path, tech house
    {
        idleAsset: 'yellowWarriorIdle', runAsset: 'yellowWarriorRun',
        speed: 0.5, startIdle: true,
        startLandmark: 'treeGate',
        waypoints: [
            { landmark: 'treeGateNear', idle: 200 },
            { landmark: 'pathDeco', idle: 100 },
            { landmark: 'techFarExit', idle: 150 },
        ],
    },
    // Lumberjack (Blue Pawn w/ Axe) — chops in projects district
    {
        idleAsset: 'pawnAxeIdle', runAsset: 'pawnAxeRun',
        speed: 0.4,
        startLandmark: 'projectTree1',
        waypoints: [
            { landmark: 'projectTree1Near', idle: 220 },
            { landmark: 'projectTree2Near', idle: 200 },
            { landmark: 'projectTree3Near', idle: 180 },
        ],
    },
    // Builder (Yellow Pawn w/ Hammer) — works near barracks and tower
    {
        idleAsset: 'pawnHammerIdle', runAsset: 'pawnHammerRun',
        speed: 0.45,
        startLandmark: 'barracksFootExit',
        waypoints: [
            { landmark: 'barracksFootFar', idle: 250 },
            { landmark: 'towerFootFar', idle: 200 },
            { landmark: 'barracksTowerMid', idle: 120 },
        ],
    },
    // Castle guard (Blue Warrior) — patrols outside castle walls
    {
        idleAsset: 'blueWarriorIdle', runAsset: 'blueWarriorRun',
        speed: 0.6,
        startLandmark: 'castleLeftFoot',
        waypoints: [
            { landmark: 'castleLeftFoot', idle: 100 },
            { landmark: 'castleCenterFoot', idle: 120 },
            { landmark: 'castleRightFoot', idle: 100 },
        ],
    },
];
