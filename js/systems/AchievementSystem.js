/* Achievement system — evaluates declarative conditions, tracks completion, manages toast queue */
import { achievementDefs } from '../data/achievements.js';
import { visitedBuildings, isAllVisited } from '../core/GameState.js';
import { TOTAL_BUILDINGS } from '../data/buildings.js';

// State
const completed = new Set();
let windUsed = false;
let scrollOpened = false;

// Toast queue
const toastQueue = [];
let activeToast = null;

export function markWindUsed() { windUsed = true; }
export function markScrollOpened() { scrollOpened = true; }

// Evaluate a declarative achievement condition
function evaluateCondition(def) {
    switch (def.type) {
        case 'visit':
            return visitedBuildings.has(def.building);
        case 'visitAll':
            return def.buildings.every(l => visitedBuildings.has(l));
        case 'visitCount':
            return def.buildings.filter(l => visitedBuildings.has(l)).length >= def.count;
        case 'visitAllBuildings':
            return isAllVisited();
        case 'flag':
            if (def.flag === 'windUsed') return windUsed;
            if (def.flag === 'scrollOpened') return scrollOpened;
            return false;
        default:
            return false;
    }
}

export function checkAchievements() {
    for (const a of achievementDefs) {
        if (completed.has(a.id)) continue;
        if (evaluateCondition(a)) {
            completed.add(a.id);
            toastQueue.push({ title: a.title, desc: a.desc, startTime: 0, active: false });
        }
    }

    if (!activeToast && toastQueue.length > 0) {
        activeToast = toastQueue.shift();
        activeToast.startTime = Date.now();
        activeToast.active = true;
    }
    if (activeToast) {
        const elapsed = (Date.now() - activeToast.startTime) / 1000;
        if (elapsed > 3) activeToast = null;
    }
}

export function getActiveToast() { return activeToast; }
export function getCompleted() { return completed; }
export function getTotal() { return achievementDefs.length; }

// Re-export definitions for UI panel access
export { achievementDefs as achievements };
