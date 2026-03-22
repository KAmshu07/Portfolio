/* Story overlay — shows project development journey */
import { projectStories } from '../data/projectStories.js';
import { DomId, DomClass } from '../data/enums.js';

const overlay = document.getElementById(DomId.STORY_OVERLAY);
const content = document.getElementById(DomId.STORY_CONTENT);
let open = false;

export function hasStory(label) {
    return !!projectStories[label];
}

export function toggleStory(label) {
    if (open) { closeStory(); return; }
    const story = projectStories[label];
    if (!story) return;

    let html = `<h2 class="story-title">${story.title}</h2>`;
    html += `<p class="story-subtitle">${story.subtitle}</p>`;
    html += `<div class="story-divider"></div>`;
    for (const ch of story.chapters) {
        html += `<div class="story-chapter">`;
        html += `<h3 class="story-chapter-heading">${ch.heading}</h3>`;
        html += `<p class="story-chapter-text">${ch.text}</p>`;
        html += `</div>`;
    }
    html += `<span class="story-hint">[ESC] or [F] to close</span>`;

    content.innerHTML = html;
    overlay.classList.add(DomClass.VISIBLE);
    open = true;
}

export function closeStory() {
    overlay.classList.remove(DomClass.VISIBLE);
    open = false;
}

export function isStoryOpen() { return open; }
