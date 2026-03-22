/* Centralized string enums — single source of truth for all type discriminators */

export const GameMode = {
    INTRO: 'INTRO',
    PLAYING: 'PLAYING',
};

export const EntityType = {
    BUILDING: 'building',
    TREE: 'tree',
    DECO: 'deco',
    MONUMENT: 'monument',
    FIRE: 'fire',
    SHEEP: 'sheep',
    NPC: 'npc',
    PLAYER: 'player',
    PARTICLE: 'particle',
};

export const NPCState = {
    IDLE: 'idle',
    WALK: 'walk',
    CHAT: 'chat',
};

export const Direction = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
};

export const ParticleType = {
    DUST: 'dust',
    SPLASH: 'splash',
    LEAF: 'leaf',
};

export const AudioKey = {
    FOOTSTEP: 'footstep',
    SPLASH: 'splash',
    PANEL_OPEN: 'panelOpen',
    PANEL_CLOSE: 'panelClose',
    CLICK: 'click',
    CHIME: 'chime',
};

// Player animation asset key mapping — direction to sprite sheet key
export const PlayerAnim = {
    idle: {
        [Direction.UP]: 'idleUp',
        [Direction.DOWN]: 'idleDown',
        [Direction.LEFT]: 'idleLeft',
        [Direction.RIGHT]: 'idleRight',
    },
    run: {
        [Direction.UP]: 'runUp',
        [Direction.DOWN]: 'runDown',
        [Direction.LEFT]: 'runLeft',
        [Direction.RIGHT]: 'runRight',
    },
};

// Deco asset keys used for flower pulse check
export const FlowerAssets = ['deco01', 'deco04'];

// Keyboard input codes
export const KeyCode = {
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    W: 'KeyW',
    A: 'KeyA',
    S: 'KeyS',
    D: 'KeyD',
    E: 'KeyE',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    SPACE: 'Space',
    SHIFT_LEFT: 'ShiftLeft',
    SHIFT_RIGHT: 'ShiftRight',
};

// DOM element IDs
export const DomId = {
    GAME: 'game',
    INTRO: 'intro',
    INTRO_START: 'introStart',
    LOADING_BAR: 'loadingBar',
    MUTE_BTN: 'muteBtn',
    INFO_PANEL: 'infoPanel',
    INFO_PANEL_INNER: 'infoPanelInner',
    SCROLL_OVERLAY: 'scrollOverlay',
    ACHIEVE_PANEL: 'achievePanel',
};

export const DomClass = {
    HUD: '.hud',
    ACHIEVE_LIST: '.achieve-list',
    ACHIEVE_ITEM: 'achieve-item',
    ACHIEVE_CHECK: 'achieve-check',
    DONE: 'done',
    HIDDEN: 'hidden',
    VISIBLE: 'visible',
};

// Achievement condition types (match data/achievements.js `type` field)
export const AchievementCondition = {
    VISIT: 'visit',
    VISIT_ALL: 'visitAll',
    VISIT_COUNT: 'visitCount',
    VISIT_ALL_BUILDINGS: 'visitAllBuildings',
    FLAG: 'flag',
};

// Achievement flag names (match data/achievements.js `flag` field)
export const AchievementFlag = {
    WIND_USED: 'windUsed',
    SCROLL_OPENED: 'scrollOpened',
    CELEBRATION: '_celebration',
};

// Building labels used in comparisons
export const BuildingLabel = {
    CONTACT: 'CONTACT',
};

// UI display text
export const UIText = {
    LOADING: 'Loading...',
    START_PROMPT: 'Press ENTER or Click to Start',
    LOAD_FAILED: 'Load failed — Download Resume',
    HUD_CONTACT_HINT: '[E] Open resume',
    HUD_EXPLORE_HINT: 'Walk closer to explore',
    HUD_DEFAULT_HINT: 'WASD to move  •  SHIFT to sprint  •  SPACE to follow the wind',
    MUTE_ON: '🔇',
    MUTE_OFF: '🔊',
    ACHIEVE_COMPLETE: '★',
    ACHIEVE_INCOMPLETE: '☆',
};

// Asset path
export const FilePath = {
    RESUME: 'Amritanshu_Kumar_Resume.pdf',
    CURSOR: "url('Assets/Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_01.png') 0 0, auto",
};
