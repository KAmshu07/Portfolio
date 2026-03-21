/* Achievement checklist panel — Tab key toggle */
import { achievements, getCompleted } from '../systems/AchievementSystem.js';
import { DomId, DomClass, UIText } from '../data/enums.js';

const achievePanel = document.getElementById(DomId.ACHIEVE_PANEL);
let achievePanelOpen = false;

export function isAchievePanelOpen() { return achievePanelOpen; }

export function toggleAchievePanel() {
    if (achievePanelOpen) {
        achievePanel.classList.add(DomClass.HIDDEN);
        achievePanelOpen = false;
    } else {
        const completed = getCompleted();
        achievePanel.querySelector(DomClass.ACHIEVE_LIST).innerHTML = achievements.map(a =>
            `<div class="${DomClass.ACHIEVE_ITEM} ${completed.has(a.id) ? DomClass.DONE : ''}">
                <span class="${DomClass.ACHIEVE_CHECK}">${completed.has(a.id) ? UIText.ACHIEVE_COMPLETE : UIText.ACHIEVE_INCOMPLETE}</span>
                <div><strong>${a.title}</strong><br><small>${a.desc}</small></div>
            </div>`
        ).join('');
        achievePanel.classList.remove(DomClass.HIDDEN);
        achievePanelOpen = true;
    }
}

export function closeAchievePanel() {
    if (achievePanelOpen) {
        achievePanel.classList.add(DomClass.HIDDEN);
        achievePanelOpen = false;
    }
}
