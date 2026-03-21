/* Achievement checklist panel — Tab key toggle */
import { achievements, getCompleted } from '../systems/AchievementSystem.js';

const achievePanel = document.getElementById('achievePanel');
let achievePanelOpen = false;

export function isAchievePanelOpen() { return achievePanelOpen; }

export function toggleAchievePanel() {
    if (achievePanelOpen) {
        achievePanel.classList.add('hidden');
        achievePanelOpen = false;
    } else {
        const completed = getCompleted();
        achievePanel.querySelector('.achieve-list').innerHTML = achievements.map(a =>
            `<div class="achieve-item ${completed.has(a.id) ? 'done' : ''}">
                <span class="achieve-check">${completed.has(a.id) ? '★' : '☆'}</span>
                <div><strong>${a.title}</strong><br><small>${a.desc}</small></div>
            </div>`
        ).join('');
        achievePanel.classList.remove('hidden');
        achievePanelOpen = true;
    }
}

export function closeAchievePanel() {
    if (achievePanelOpen) {
        achievePanel.classList.add('hidden');
        achievePanelOpen = false;
    }
}
