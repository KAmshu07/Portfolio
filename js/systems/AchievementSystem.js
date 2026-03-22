/* Achievement system — evaluates declarative conditions, tracks completion, manages toast queue */
import { achievementDefs } from '../data/achievements.js';
import { visitedBuildings, isAllVisited, triggerCelebration } from '../core/GameState.js';
import { AchievementCondition, AchievementFlag } from '../data/enums.js';
import { TOAST_FADE_OUT } from '../rendering/RenderConfig.js';
import { loadAchievements, saveAchievements, loadFlags, saveFlags } from '../systems/SaveSystem.js';

// State
const completed = loadAchievements();
const savedFlags = loadFlags();
let windUsed = savedFlags.windUsed || false;
let scrollOpened = savedFlags.scrollOpened || false;

// Toast queue
const toastQueue = [];
let activeToast = null;

export function markWindUsed() { windUsed = true; saveFlags({ windUsed, scrollOpened }); }
export function markScrollOpened() { scrollOpened = true; saveFlags({ windUsed, scrollOpened }); }

// Evaluate a declarative achievement condition
function evaluateCondition(def) {
    switch (def.type) {
        case AchievementCondition.VISIT:
            return visitedBuildings.has(def.building);
        case AchievementCondition.VISIT_ALL:
            return def.buildings.every(l => visitedBuildings.has(l));
        case AchievementCondition.VISIT_COUNT:
            return def.buildings.filter(l => visitedBuildings.has(l)).length >= def.count;
        case AchievementCondition.VISIT_ALL_BUILDINGS:
            return isAllVisited();
        case AchievementCondition.FLAG:
            if (def.flag === AchievementFlag.WIND_USED) return windUsed;
            if (def.flag === AchievementFlag.SCROLL_OPENED) return scrollOpened;
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
            saveAchievements(completed);
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
        if (elapsed > TOAST_FADE_OUT) activeToast = null;
    }

    if (isAllVisited() && !completed.has(AchievementFlag.CELEBRATION)) {
        completed.add(AchievementFlag.CELEBRATION);
        triggerCelebration();
    }
}

export function getActiveToast() { return activeToast; }
export function getCompleted() { return completed; }
export function getTotal() { return achievementDefs.length; }

// Re-export definitions for UI panel access
export { achievementDefs as achievements };
