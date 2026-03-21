/* All render constants — grouped by category */

// HUD
export const HUD_BAR_H = 36;
export const HUD_GRADIENT_OFFSET = 10;
export const HUD_LABEL_FONT_SIZE = 11;
export const HUD_HINT_FONT_SIZE = 8;
export const HUD_LABEL_Y_OFFSET = 18;
export const HUD_HINT_Y_OFFSET = 6;
export const HUD_DEFAULT_Y_OFFSET = 12;

// Nameplate
export const NAMEPLATE_FONT_SIZE = 10;
export const NAMEPLATE_PAD_X = 10;
export const NAMEPLATE_PAD_Y = 4;
export const NAMEPLATE_RADIUS = 6;
export const NAMEPLATE_STROKE_WIDTH = 1.5;
export const NAMEPLATE_LINE_HEIGHT = 16;
export const NAMEPLATE_Y_OFFSET = 12;
export const NAMEPLATE_FADE_IN_STEP = 0.05;
export const NAMEPLATE_FADE_OUT_STEP = 0.08;

// Proximity indicator
export const PROX_Y_OFFSET = 30;
export const PROX_BOB_SPEED = 4;
export const PROX_BOB_AMP = 6;
export const PROX_SHADOW_BLUR = 12;
export const PROX_HALF_W = 8;
export const PROX_ARROW_H = 12;

// Zone announcement
export const ZONE_FADE_IN = 0.5;
export const ZONE_HOLD_END = 2.0;
export const ZONE_FADE_OUT = 2.5;
export const ZONE_MAX_ALPHA = 0.9;
export const ZONE_FONT_SIZE = 16;
export const ZONE_SHADOW_BLUR = 8;

// Achievement toast
export const TOAST_FADE_IN = 0.4;
export const TOAST_HOLD_END = 2.5;
export const TOAST_FADE_OUT = 3.0;
export const TOAST_W = 280;
export const TOAST_H = 44;
export const TOAST_Y = 60;
export const TOAST_MAX_ALPHA = 0.85;
export const TOAST_RADIUS = 6;
export const TOAST_STROKE_W = 2;
export const TOAST_TITLE_SIZE = 9;
export const TOAST_TITLE_Y = 18;
export const TOAST_DESC_SIZE = 10;
export const TOAST_DESC_Y = 34;

// Intro zoom
export const ZOOM_DURATION = 2000;
export const ZOOM_START_SCALE = 1.3;
export const ZOOM_RANGE = 0.3;
export const ZOOM_EASE_POWER = 3;

// Entity rendering
export const TREE_FRAME_W = 192;
export const TREE_FRAME_H = 256;
export const TREE_DRAW_Y_OFFSET = -56;
export const TREE_BEHIND_ALPHA = 0.4;
export const TREE_DEFAULT_FADE = { xR: 70, yD: 160, base: 200 };
export const TREE_TRUNK_X_OFFSET = 96;
export const NPC_BEHIND_CHECK = { x: 48, y: 80 };

// NPC defaults
export const NPC_DEFAULT_FW = 192;
export const NPC_DEFAULT_FH = 192;
export const NPC_DEFAULT_SCALE = 0.5;
export const NPC_DEFAULT_Y_OFFSET = 5;
export const NPC_SHADOW_RX = 14;
export const NPC_SHADOW_RY = 4;

// Foam / water rock frame sizes
export const FOAM_DRAW_SCALE = 0.5;
export const FOAM_FRAME_SIZE = 192;
export const WATER_ROCK_FRAME_SIZE = 128;

export const DECO_FRAME_SIZE = 128;
export const PARTICLE_FRAME_SIZE = 64;

export const FIRE_FRAME_SIZE = 64;
export const FIRE_Y_OFFSET = -20;
export const FIRE_SCALE = 0.8;

export const SHEEP_FRAME_SIZE = 128;
export const SHEEP_SCALE = 0.7;

export const FLOWER_PULSE_SPEED = 0.003;

// Clouds
export const CLOUD_ALPHA = 0.35;
export const CLOUD_DRIFT_SPEED = 0.003;
export const CLOUD_WRAP_PAD = 400;
export const CLOUD_PARALLAX = 0.3;

// Animation
export const ANIM_SPEED = 0.002;
export const ANIM_FRAMES = 8;

// Culling margins
export const CULL_FOAM = 200;
export const CULL_WATER_ROCKS = 150;
export const CULL_BUILDING = 20;
export const CULL_TREE_X = 200;
export const CULL_TREE_Y_TOP = 300;
export const CULL_TREE_Y_BOT = 100;
export const CULL_DECO = 100;
export const CULL_MONUMENT = 200;
export const CULL_FIRE = 100;
export const CULL_NPC = 150;
export const CULL_SHEEP = 100;

// Y-sort offsets
export const YSORT_TREE = 240;
export const YSORT_DECO = 30;
export const YSORT_MONUMENT = 180;
export const YSORT_FIRE = 30;
export const YSORT_SHEEP = 60;

// Colors
export const COLOR_GOLD = '#eec941';
export const COLOR_GRASS = '#7ab648';
export const COLOR_SHADOW = 'rgba(0,0,0,0.2)';
export const COLOR_NPC_SHADOW = 'rgba(0,0,0,0.15)';
export const COLOR_NAMEPLATE_BG = 'rgba(20,10,5,0.75)';
export const COLOR_NAMEPLATE_BORDER = 'rgba(238,201,65,0.5)';
export const COLOR_TOAST_BG = '#2a1a0a';

// Fonts
export const FONT_PIXEL = "'Press Start 2P',monospace";
export const FONT_BODY = "'Outfit',sans-serif";
