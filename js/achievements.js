/* Achievement system — definitions, state, toast triggers */
import { visitedBuildings, isAllVisited } from './state.js';

// Achievement definitions — each has a condition function
export const achievements = [
    {
        id: 'archives',
        title: 'The Archives',
        desc: 'Discover who Amritanshu is',
        condition: () => ['BIO', 'SKILLS', 'TECH'].every(l => visitedBuildings.has(l)),
    },
    {
        id: 'castle',
        title: 'The Castle',
        desc: 'See the flagship project',
        condition: () => visitedBuildings.has('PONGZ'),
    },
    {
        id: 'workshop',
        title: "The Engineer's Workshop",
        desc: 'Explore 3+ project buildings',
        condition: () => ['PONGZ', 'ALNAHSHA', 'ENGINE', 'RECURVE', 'SYSTEMS'].filter(l => visitedBuildings.has(l)).length >= 3,
    },
    {
        id: 'contact',
        title: 'First Contact',
        desc: 'Find the way to connect',
        condition: () => visitedBuildings.has('CONTACT'),
    },
    {
        id: 'explorer',
        title: 'Kingdom Explorer',
        desc: 'Visit every building in the kingdom',
        condition: () => isAllVisited(),
    },
    {
        id: 'wind',
        title: 'Wind Walker',
        desc: 'Let the wind guide you',
        condition: () => windUsed,
    },
    {
        id: 'scroll',
        title: 'The Scroll',
        desc: 'Read the resume scroll',
        condition: () => scrollOpened,
    },
];

// State
const completed = new Set();
let windUsed = false;
let scrollOpened = false;

// Toast queue
const toastQueue = [];
let activeToast = null;

export function markWindUsed() { windUsed = true; }
export function markScrollOpened() { scrollOpened = true; }

export function checkAchievements() {
    for (const a of achievements) {
        if (completed.has(a.id)) continue;
        if (a.condition()) {
            completed.add(a.id);
            toastQueue.push({ title: a.title, desc: a.desc, startTime: 0, active: false });
        }
    }

    // Process toast queue one at a time
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
export function getTotal() { return achievements.length; }
