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

// Init
resize();
initAudio();
initInput();
initIntroScreen();
addEventListener('resize', resize);

// Wire up render dependencies (avoids circular imports)
setRenderDeps(getNearBuilding, zoneAnnouncement);

// Input bindings
addEventListener('keydown', e => {
    if (e.code === KeyCode.ENTER && isAssetsReady() && mode === GameMode.INTRO) startGame();
    if (e.code === KeyCode.E && mode === GameMode.PLAYING) toggleScroll();
    if (e.code === KeyCode.TAB && mode === GameMode.PLAYING) { e.preventDefault(); toggleAchievePanel(); }
    if (e.code === KeyCode.ESCAPE) { closeAchievePanel(); closeScroll(); }
});
document.getElementById(DomId.MUTE_BTN).addEventListener('click', () => {
    const m = toggleMute();
    document.getElementById(DomId.MUTE_BTN).textContent = m ? UIText.MUTE_ON : UIText.MUTE_OFF;
});

// Update
function update() {
    if (mode === GameMode.INTRO) {
        introPan(WORLD_W, WORLD_H);
        animateWorld();
        updateNPCs(npcs);
        return;
    }
    if (mode !== GameMode.PLAYING) return;
    if (isScrollOpen() || isAchievePanelOpen()) return;

    updatePlayer();
    updateParticles();
    followTarget(player.x + player.w / 2, player.y + player.h / 2, WORLD_W, WORLD_H);

    animateWorld();
    updateNPCs(npcs);
    updatePanel();
    updateWind();
    spawnWindParticles();

    // Nameplate fade
    const nearB = getNearBuilding();
    for (const b of buildings) {
        if (nearB && b.label === nearB.label) {
            b.nameplateAlpha = Math.min(1, b.nameplateAlpha + 0.05);
        } else {
            b.nameplateAlpha = Math.max(0, b.nameplateAlpha - 0.08);
        }
    }

    updateZone();
    checkAchievements();
}

// Game loop
function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}
loop();

// Asset loading
loadAssets(onLoadProgress).then(onLoadComplete).catch(onLoadFailed);
