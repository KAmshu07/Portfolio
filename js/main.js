/* Entry point — init, input bindings, game loop */
import { canvas, resize } from './core/Canvas.js';
import { mode, setMode } from './core/GameState.js';
import { camera, introZoom, followTarget, introPan } from './core/Camera.js';
import { keys, initInput } from './core/Input.js';
import { loadAssets } from './systems/AssetLoader.js';
import { initAudio, toggleMute } from './systems/AudioSystem.js';
import { player, updatePlayer } from './entities/Player.js';
import { buildings, npcs, animateWorld } from './world/WorldBuilder.js';
import { updateNPCs } from './entities/NPC.js';
import { updatePanel, getNearBuilding } from './ui/InfoPanel.js';
import { updateZone, zoneAnnouncement } from './ui/ZoneAnnouncement.js';
import { toggleScroll, closeScroll, isScrollOpen } from './ui/ScrollOverlay.js';
import { toggleAchievePanel, closeAchievePanel, isAchievePanelOpen } from './ui/AchievePanel.js';
import { initIntroScreen, isAssetsReady, startGame, onLoadProgress, onLoadComplete, onLoadFailed } from './ui/IntroScreen.js';
import { updateParticles } from './systems/ParticleSystem.js';
import { render, setRenderDeps } from './rendering/Renderer.js';
import { checkAchievements } from './systems/AchievementSystem.js';
import { updateWind, spawnWindParticles } from './systems/WindSystem.js';
import { WORLD_W, WORLD_H } from './data/gameConfig.js';
import { GameMode, KeyCode, DomId, UIText } from './data/enums.js';
import { NAMEPLATE_FADE_IN_STEP, NAMEPLATE_FADE_OUT_STEP } from './rendering/RenderConfig.js';

// Target frame time (60fps baseline — dt=1.0 at 60fps, 0.5 at 120fps, 2.0 at 30fps)
const TARGET_FRAME_MS = 1000 / 60;
let lastTime = 0;

// Init
resize();
initAudio();
initInput();
initIntroScreen();
addEventListener('resize', resize);

// Wire up render dependencies (avoids circular imports)
setRenderDeps(getNearBuilding, zoneAnnouncement);

// Input bindings — e.repeat filters held-key auto-repeat for UI toggles
addEventListener('keydown', e => {
    if (e.code === KeyCode.ENTER && !e.repeat && isAssetsReady() && mode === GameMode.INTRO) startGame();
    if (e.code === KeyCode.E && !e.repeat && mode === GameMode.PLAYING) toggleScroll();
    if (e.code === KeyCode.TAB && !e.repeat && mode === GameMode.PLAYING) { e.preventDefault(); toggleAchievePanel(); }
    if (e.code === KeyCode.ESCAPE && !e.repeat) { closeAchievePanel(); closeScroll(); }
});
document.getElementById(DomId.MUTE_BTN).addEventListener('click', () => {
    const m = toggleMute();
    document.getElementById(DomId.MUTE_BTN).textContent = m ? UIText.MUTE_ON : UIText.MUTE_OFF;
});

// Update — dt normalizes all frame-counter logic to 60fps regardless of display refresh rate
function update(dt) {
    if (mode === GameMode.INTRO) {
        introPan(WORLD_W, WORLD_H);
        animateWorld(dt);
        updateNPCs(npcs, dt);
        return;
    }
    if (mode !== GameMode.PLAYING) return;
    if (isScrollOpen() || isAchievePanelOpen()) return;

    updatePlayer(dt);
    updateParticles(dt);
    followTarget(player.x + player.w / 2, player.y + player.h / 2, WORLD_W, WORLD_H);

    animateWorld(dt);
    updateNPCs(npcs, dt);
    updatePanel();
    updateWind(dt);
    spawnWindParticles(dt);

    // Nameplate fade
    const nearB = getNearBuilding();
    for (const b of buildings) {
        if (nearB && b.label === nearB.label) {
            b.nameplateAlpha = Math.min(1, b.nameplateAlpha + NAMEPLATE_FADE_IN_STEP * dt);
        } else {
            b.nameplateAlpha = Math.max(0, b.nameplateAlpha - NAMEPLATE_FADE_OUT_STEP * dt);
        }
    }

    updateZone();
    checkAchievements();
}

// Game loop — calculates delta-time normalized to 60fps
function loop(timestamp) {
    const elapsed = timestamp - lastTime;
    lastTime = timestamp;
    const dt = elapsed / TARGET_FRAME_MS;

    update(dt);
    render();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Asset loading
loadAssets(onLoadProgress).then(onLoadComplete).catch(onLoadFailed);
