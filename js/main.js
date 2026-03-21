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

const WORLD_W = 2800;
const WORLD_H = 2000;

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
    if (e.code === 'Enter' && isAssetsReady() && mode === 'INTRO') startGame();
    if (e.code === 'KeyE' && mode === 'PLAYING') toggleScroll();
    if (e.code === 'Tab' && mode === 'PLAYING') { e.preventDefault(); toggleAchievePanel(); }
    if (e.code === 'Escape') { closeAchievePanel(); closeScroll(); }
});
document.getElementById('muteBtn').addEventListener('click', () => {
    const m = toggleMute();
    document.getElementById('muteBtn').textContent = m ? '🔇' : '🔊';
});

// Update
function update() {
    if (mode === 'INTRO') {
        introPan(WORLD_W, WORLD_H);
        animateWorld();
        updateNPCs(npcs);
        return;
    }
    if (mode !== 'PLAYING') return;
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
