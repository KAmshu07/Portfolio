/* Asset paths and loader — reports progress via callback, no DOM access */
const PATHS = {
    // Player (old Blue Warrior — kept for reference)
    idle: 'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Idle.png',
    run:  'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Run.png',
    // Player (4-directional)
    idleDown:  'Assets/Ritik_Char/Idle/player_idle_down.png',
    idleUp:    'Assets/Ritik_Char/Idle/player_idle_up.png',
    idleLeft:  'Assets/Ritik_Char/Idle/player_idle_left.png',
    idleRight: 'Assets/Ritik_Char/Idle/player_idle_right.png',
    runDown:   'Assets/Ritik_Char/Movement/player_run_down.png',
    runUp:     'Assets/Ritik_Char/Movement/player_run_up.png',
    runLeft:   'Assets/Ritik_Char/Movement/player_run_left.png',
    runRight:  'Assets/Ritik_Char/Movement/player_run_right.png',
    // Buildings
    house1:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House1.png',
    house2:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House2.png',
    house3:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House3.png',
    castle:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Castle.png',
    barracks:  'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Barracks.png',
    tower:     'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Tower.png',
    archery:   'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Archery.png',
    monastery: 'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Monastery.png',
    // Trees
    tree1: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree1.png',
    tree2: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree2.png',
    tree3: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree3.png',
    tree4: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree4.png',
    // Decorations
    bush1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe1.png',
    bush2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe2.png',
    rock1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock1.png',
    rock2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock2.png',
    sheep: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Meat/Sheep/Sheep_Idle.png',
    // Terrain
    tilemap:  'Assets/Tiny Swords (Free Pack)/Terrain/Tileset/Tilemap_color1.png',
    water:    'Assets/Tiny Swords (Update 010)/Terrain/Water/Water.png',
    foam:     'Assets/Tiny Swords (Update 010)/Terrain/Water/Foam/Foam.png',
    // Deco (Update pack)
    deco01:   'Assets/Tiny Swords (Update 010)/Deco/01.png',
    deco04:   'Assets/Tiny Swords (Update 010)/Deco/04.png',
    deco18:   'Assets/Tiny Swords (Update 010)/Deco/18.png',
    // Effects
    fire: 'Assets/Tiny Swords (Free Pack)/Particle FX/Fire_01.png',
    // Water rocks
    wrocks1: 'Assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_01.png',
    wrocks2: 'Assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_02.png',
    wrocks3: 'Assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_03.png',
    wrocks4: 'Assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_04.png',
    // Particle effects
    dust1:   'Assets/Tiny Swords (Free Pack)/Particle FX/Dust_01.png',
    dust2:   'Assets/Tiny Swords (Free Pack)/Particle FX/Dust_02.png',
    splash:  'Assets/Tiny Swords (Free Pack)/Particle FX/Water Splash.png',
    // Clouds
    cloud1:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_01.png',
    cloud2:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_02.png',
    cloud3:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_03.png',
    cloud4:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_04.png',
    cloud5:  'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Clouds/Clouds_05.png',
    // NPC units
    archerIdle: 'Assets/Tiny Swords (Free Pack)/Units/Red Units/Archer/Archer_Idle.png',
    archerRun:  'Assets/Tiny Swords (Free Pack)/Units/Red Units/Archer/Archer_Run.png',
    monkIdle:   'Assets/Tiny Swords (Free Pack)/Units/Purple Units/Monk/Idle.png',
    monkRun:    'Assets/Tiny Swords (Free Pack)/Units/Purple Units/Monk/Run.png',
    // Village workers
    pawnWoodIdle:    'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Pawn/Pawn_Idle Wood.png',
    pawnWoodRun:     'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Pawn/Pawn_Run Wood.png',
    pawnGoldIdle:    'Assets/Tiny Swords (Free Pack)/Units/Yellow Units/Pawn/Pawn_Idle Gold.png',
    pawnGoldRun:     'Assets/Tiny Swords (Free Pack)/Units/Yellow Units/Pawn/Pawn_Run Gold.png',
    pawnMeatIdle:    'Assets/Tiny Swords (Free Pack)/Units/Red Units/Pawn/Pawn_Idle Meat.png',
    pawnMeatRun:     'Assets/Tiny Swords (Free Pack)/Units/Red Units/Pawn/Pawn_Run Meat.png',
    pawnPickIdle:    'Assets/Tiny Swords (Free Pack)/Units/Purple Units/Pawn/Pawn_Idle Pickaxe.png',
    pawnPickRun:     'Assets/Tiny Swords (Free Pack)/Units/Purple Units/Pawn/Pawn_Run Pickaxe.png',
    blackLancerIdle: 'Assets/Tiny Swords (Free Pack)/Units/Black Units/Lancer/Lancer_Idle.png',
    blackLancerRun:  'Assets/Tiny Swords (Free Pack)/Units/Black Units/Lancer/Lancer_Run.png',
    yellowWarriorIdle: 'Assets/Tiny Swords (Free Pack)/Units/Yellow Units/Warrior/Warrior_Idle.png',
    yellowWarriorRun:  'Assets/Tiny Swords (Free Pack)/Units/Yellow Units/Warrior/Warrior_Run.png',
    // Extra decorations
    deco02:  'Assets/Tiny Swords (Update 010)/Deco/02.png',
    deco03:  'Assets/Tiny Swords (Update 010)/Deco/03.png',
    deco05:  'Assets/Tiny Swords (Update 010)/Deco/05.png',
    deco06:  'Assets/Tiny Swords (Update 010)/Deco/06.png',
    deco07:  'Assets/Tiny Swords (Update 010)/Deco/07.png',
    deco08:  'Assets/Tiny Swords (Update 010)/Deco/08.png',
};

export const IMG = {};
export const TOTAL_ASSETS = Object.keys(PATHS).length;

export function loadAssets(onProgress) {
    const entries = Object.entries(PATHS);
    let loaded = 0, failed = 0;
    return new Promise((resolve, reject) => {
        for (const [key, src] of entries) {
            const img = new Image();
            img.onload = () => {
                IMG[key] = img;
                loaded++;
                onProgress?.(loaded + failed, entries.length, failed);
                if (loaded + failed === entries.length) resolve();
            };
            img.onerror = () => {
                console.warn('Failed: ' + src);
                IMG[key] = null;
                failed++;
                onProgress?.(loaded + failed, entries.length, failed);
                if (loaded + failed === entries.length) {
                    if (failed > entries.length / 2) reject(new Error(`${failed}/${entries.length} assets failed`));
                    else resolve();
                }
            };
            img.src = src;
        }
    });
}
