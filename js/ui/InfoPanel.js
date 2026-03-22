/* Info panel — building proximity detection and content display */
import { player } from '../entities/Player.js';
import { buildings } from '../world/WorldBuilder.js';
import { interactables } from '../data/content.js';
import { visitedBuildings } from '../core/GameState.js';
import { play } from '../systems/AudioSystem.js';
import { saveVisited } from '../systems/SaveSystem.js';
import { AudioKey, DomId, DomClass } from '../data/enums.js';

const infoPanel = document.getElementById(DomId.INFO_PANEL);
const infoPanelInner = document.getElementById(DomId.INFO_PANEL_INNER);
let activeLabel = null;
let cachedNearB = null;

function findNearBuilding() {
    const pcx = player.x + player.w / 2;
    const pcy = player.y + player.h / 2;
    let nearest = null, dist = Infinity;
    for (const b of buildings) {
        const bcx = b.x + b.w / 2;
        const bcy = b.y + b.h / 2;
        const d = Math.sqrt((pcx - bcx) ** 2 + (pcy - bcy) ** 2);
        const threshold = Math.max(b.w, b.h) * 0.7;
        if (d < threshold && d < dist) { nearest = b; dist = d; }
    }
    return nearest;
}

export function getNearBuilding() { return cachedNearB; }

export function updatePanel() {
    cachedNearB = findNearBuilding();
    if (cachedNearB) {
        if (cachedNearB.label !== activeLabel) {
            play(AudioKey.PANEL_OPEN);
            activeLabel = cachedNearB.label;
            const data = interactables.find(i => i.label === cachedNearB.label);
            if (data) {
                if (!visitedBuildings.has(cachedNearB.label)) play(AudioKey.CHIME);
                visitedBuildings.add(cachedNearB.label);
                saveVisited(visitedBuildings);
                infoPanelInner.innerHTML = data.content;
            }
        }
        infoPanel.classList.add(DomClass.VISIBLE);
    } else {
        if (activeLabel) play(AudioKey.PANEL_CLOSE);
        infoPanel.classList.remove(DomClass.VISIBLE);
        activeLabel = null;
    }
}
