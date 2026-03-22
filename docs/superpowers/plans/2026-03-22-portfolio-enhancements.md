# Portfolio Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 portfolio-first features that surface Amritanshu's skills, projects, and technical depth through gamified elements — NPC dialogue, enhanced panels with links, InstaReload building, discovery celebration, localStorage save state, and OG meta tags.

**Architecture:** All new data goes in `js/data/` (pure data, zero imports). All rendering in `js/rendering/`. All persistence in a new `js/systems/SaveSystem.js`. New enums in `js/data/enums.js`. The existing domain-driven architecture is preserved — no new patterns introduced.

**Tech Stack:** Vanilla ES6+ JavaScript, Canvas 2D, localStorage API, HTML meta tags.

**Key URLs (for panel links):**
- FlowUI Docs: `https://nimritagames.com/flowui/`
- FlowUI GitHub: `https://github.com/nimritagames/Unity-FlowUI`
- Infinite Runners Course: `https://nimritagames.com/Infinite_Runners/`
- Pongz Play Store: `https://play.google.com/store/apps/details?id=com.pixelstackstudios.pongz`
- Pongz App Store: `https://apps.apple.com/in/app/pongz-sg-mahjong/id6755418562`
- Al Nahsha Play Store: `https://play.google.com/store/apps/details?id=com.moderndoctors.alnahsharun`
- Al Nahsha App Store: `https://apps.apple.com/in/app/النحشة-run/id1473582650`
- InstaReload GitHub: `https://github.com/nimritagames/Insta_Reload`
- GitHub Profile: `https://github.com/KAmshu07`
- LinkedIn: `https://www.linkedin.com/in/amritanshu-kumar-/`

---

## File Map

### New Files
| File | Responsibility |
|------|----------------|
| `js/data/npcDialogue.js` | Pure data: dialogue lines per NPC role (no imports) |
| `js/systems/SaveSystem.js` | localStorage read/write for visited buildings + achievements |

### Modified Files
| File | Changes |
|------|---------|
| `js/data/assetPaths.js` | Add `forge` asset path (Knight's Tower from Update 010) |
| `js/data/buildings.js` | Add INSTA_RELOAD building entry |
| `js/data/content.js` | Enhance all panels with links/metrics/roles; add INSTA_RELOAD content |
| `js/data/achievements.js` | Add INSTA_RELOAD to workshop list; update count; add discovery celebration achievement |
| `js/data/enums.js` | Add `AchievementFlag.ALL_DISCOVERED`, `SaveKey` constants |
| `js/data/gameConfig.js` | Add speech bubble config constants |
| `js/world/WorldBuilder.js` | Add forge landmark; add `dialogue` property to each NPC from npcDialogue data |
| `js/entities/NPC.js` | Track player proximity for dialogue display |
| `js/rendering/EntityRenderers.js` | Draw speech bubbles above NPCs when player is near |
| `js/rendering/RenderConfig.js` | Add speech bubble render constants |
| `js/rendering/Overlays.js` | Add discovery celebration overlay |
| `js/rendering/Renderer.js` | Hook celebration overlay into render |
| `js/core/GameState.js` | Integrate SaveSystem; add `allDiscovered` flag |
| `js/systems/AchievementSystem.js` | Fire discovery celebration; expose save-friendly state |
| `js/main.js` | Init SaveSystem on startup; wire celebration |
| `index.html` | Add `og:image` meta, `<link rel="icon">`, GitHub profile link in mobile warning |

---

## Task 1: Add InstaReload Building

**Files:**
- Modify: `js/data/assetPaths.js:17` (add forge asset)
- Modify: `js/data/buildings.js:12` (add building entry)
- Modify: `js/data/content.js` (add INSTA_RELOAD panel content)
- Modify: `js/data/achievements.js:23` (add to workshop building list)
- Modify: `js/data/enums.js` (no changes needed — BuildingLabel only has CONTACT for special behavior)
- Modify: `js/world/WorldBuilder.js` (add forge landmark)

- [ ] **Step 1: Add forge asset path**

In `js/data/assetPaths.js`, add after the `monastery` line:

```js
forge:     'Assets/Tiny Swords (Update 010)/Factions/Knights/Buildings/Tower/Tower_Blue.png',
```

- [ ] **Step 2: Add building definition**

In `js/data/buildings.js`, add after the SYSTEMS building entry (line 12), before the CONTACT comment:

```js
{ x: 1500, y: 1050, asset: 'forge',    w: 192, h: 256, label: 'INSTA_RELOAD' },
```

Position: Projects District, south of PONGZ castle, west of RECURVE. Fills the gap between castle and archery range.

- [ ] **Step 3: Add panel content for InstaReload**

In `js/data/content.js`, add entry before CONTACT:

```js
{
    label: 'INSTA_RELOAD',
    content: `<h2>InstaReload</h2>
        <p class="popup-metrics">7ms Hot Reload &bull; 100x Faster Than Unity</p>
        <p>Unity Editor hot reload system that patches running code in 7ms
        without domain reload. 5-stage IL pipeline: detect &rarr; analyze &rarr;
        compile (Roslyn) &rarr; patch (MonoMod) &rarr; dispatch.</p>
        <ul>
            <li>Dual compilation: Debug path (7ms) vs Release path (700ms)</li>
            <li>IL-level method patching via MonoMod runtime detours</li>
            <li>Blocks Unity's compilation pipeline to prevent race conditions</li>
        </ul>
        <div class="popup-pills">
            <span>C#</span><span>Roslyn</span><span>MonoMod</span>
            <span>Mono.Cecil</span><span>IL Patching</span>
        </div>
        <a href="https://github.com/nimritagames/Insta_Reload"
           target="_blank" class="popup-link">GitHub &rarr;</a>`,
},
```

- [ ] **Step 4: Update achievements — add INSTA_RELOAD to workshop list**

In `js/data/achievements.js`, update the `workshop` achievement's buildings array:

```js
buildings: ['PONGZ', 'ALNAHSHA', 'ENGINE', 'RECURVE', 'SYSTEMS', 'INSTA_RELOAD'],
```

- [ ] **Step 5: Add forge landmark in WorldBuilder**

In `js/world/WorldBuilder.js`, add to the `landmarks` object:

```js
forge: bCenter('INSTA_RELOAD'),
```

- [ ] **Step 6: Verify building renders and panel opens**

Open the game in browser. Walk to the new forge building in the Projects District (south of PONGZ). Verify:
- Building sprite renders correctly (Knight's Tower, blue)
- Nameplate shows "INSTA_RELOAD" on proximity
- Info panel opens with InstaReload content
- GitHub link is clickable
- Achievement "Engineer's Workshop" now counts INSTA_RELOAD

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add InstaReload building with forge sprite and panel content"
```

---

## Task 2: Enhance Project Panels with Links & Metrics

**Files:**
- Modify: `js/data/content.js` (update all 9 existing panels)

- [ ] **Step 1: Update PONGZ panel with role, contribution, and store links**

Replace the PONGZ entry in `js/data/content.js`:

```js
{
    label: 'PONGZ',
    content: `<span class="popup-badge">FLAGSHIP — EARLY ACCESS</span>
        <h2>Pongz</h2>
        <p class="popup-metrics">14K+ Players &bull; 2,800+ DAU &bull; 62K+ Matches</p>
        <p><strong class="highlight">Team Lead</strong> &bull; 7-person team &bull; 55% of codebase</p>
        <p>Production multiplayer Mahjong game. Unity 6 client, TypeScript/Socket.IO game server,
        Express/MongoDB REST API. Docker on Cloud Run.</p>
        <ul>
            <li>Built socket framework, reconnection system, event bus</li>
            <li>Ranked matchmaking with 34-tier skill rating</li>
            <li>7,400+ ranked players competing</li>
            <li>AFK detection with bot stand-ins</li>
        </ul>
        <div class="popup-pills">
            <span>Unity 6</span><span>TypeScript</span><span>Socket.IO</span>
            <span>Express</span><span>MongoDB</span><span>Docker</span>
        </div>
        <div class="popup-links">
            <a href="https://play.google.com/store/apps/details?id=com.pixelstackstudios.pongz"
               target="_blank" class="popup-link">Play Store &rarr;</a>
            <a href="https://apps.apple.com/in/app/pongz-sg-mahjong/id6755418562"
               target="_blank" class="popup-link">App Store &rarr;</a>
        </div>`,
},
```

- [ ] **Step 2: Update ALNAHSHA panel with App Store link**

Replace the ALNAHSHA entry:

```js
{
    label: 'ALNAHSHA',
    content: `<h2>Alnahsha Run</h2>
        <p class="popup-metrics">5M+ Downloads &bull; 4.6 Stars</p>
        <p>Endless runner reaching 5M+ downloads on Google Play.
        Improved engagement 30% through player-driven iteration.</p>
        <div class="popup-pills"><span>Unity</span><span>C#</span><span>Google Play</span></div>
        <div class="popup-links">
            <a href="https://play.google.com/store/apps/details?id=com.moderndoctors.alnahsharun"
               target="_blank" class="popup-link">Play Store &rarr;</a>
            <a href="https://apps.apple.com/in/app/النحشة-run/id1473582650"
               target="_blank" class="popup-link">App Store &rarr;</a>
        </div>`,
},
```

- [ ] **Step 3: Update ENGINE panel with GitHub link**

Replace the ENGINE entry:

```js
{
    label: 'ENGINE',
    content: `<h2>Nimirta Engine</h2>
        <p class="popup-metrics">C++ from first principles</p>
        <p>Custom 2D game engine in C++/SFML. Physics simulation, ECS architecture,
        AI opponents across 3 difficulty levels.</p>
        <div class="popup-pills"><span>C++</span><span>SFML</span><span>ECS</span><span>Physics</span></div>
        <a href="https://github.com/KAmshu07" target="_blank" class="popup-link">GitHub &rarr;</a>`,
},
```

- [ ] **Step 4: Update SYSTEMS panel — surface FlowUI and Infinite Runners course**

Replace the SYSTEMS entry:

```js
{
    label: 'SYSTEMS',
    content: `<h2>Unity Systems & Open Source</h2>
        <p>8 reusable engine systems: UI, Event Bus, State Machine, Logging,
        Save, Pause, Popup, Loading.</p>
        <p><strong class="highlight">FlowUI</strong> — Open-source Unity UI framework.
        MIT licensed, full docs site.</p>
        <p><strong class="highlight">Infinite Runners</strong> — 25-chapter deep technical
        course on game architecture.</p>
        <div class="popup-pills"><span>C#</span><span>Unity</span><span>Open Source</span></div>
        <div class="popup-links">
            <a href="https://github.com/nimritagames/Unity-FlowUI"
               target="_blank" class="popup-link">FlowUI GitHub &rarr;</a>
            <a href="https://nimritagames.com/flowui/"
               target="_blank" class="popup-link">FlowUI Docs &rarr;</a>
            <a href="https://nimritagames.com/Infinite_Runners/"
               target="_blank" class="popup-link">Runner Course &rarr;</a>
        </div>`,
},
```

- [ ] **Step 5: Update CONTACT panel — add GitHub link**

Replace the CONTACT entry in `js/data/content.js`:

```js
{
    label: 'CONTACT',
    content: `<h2>Let's Talk</h2>
        <p>Open to opportunities at studios that value ownership and shipping games people play.</p>
        <div class="contact-grid">
            <a href="mailto:kamshu00@gmail.com" class="contact-card">
                <small>EMAIL</small><span>kamshu00@gmail.com</span></a>
            <a href="https://www.linkedin.com/in/amritanshu-kumar-/" target="_blank" class="contact-card">
                <small>LINKEDIN</small><span>amritanshu-kumar</span></a>
            <a href="https://github.com/KAmshu07" target="_blank" class="contact-card">
                <small>GITHUB</small><span>KAmshu07</span></a>
            <a href="tel:+917903734532" class="contact-card">
                <small>PHONE</small><span>+91 7903734532</span></a>
            <a href="Amritanshu_Kumar_Resume.pdf" target="_blank" download class="contact-card">
                <small>RESUME</small><span>Download PDF &darr; <span style="font-size:9px;color:#9a8a7a;margin-left:8px">[E] view here</span></span></a>
        </div>`,
},
```

- [ ] **Step 6: Add CSS for popup-links container**

In `styles/info-panel.css`, add:

```css
.popup-links {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 8px;
}
```

- [ ] **Step 7: Verify all panels**

Open game, visit each building. Verify:
- PONGZ shows role, contribution %, store links
- ALNAHSHA shows both store links
- ENGINE has GitHub link
- SYSTEMS shows FlowUI + Infinite Runners links
- INSTA_RELOAD has GitHub link
- CONTACT has GitHub card
- All links open in new tabs

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: enhance project panels with links, metrics, and contribution info"
```

---

## Task 3: NPC Dialogue System

**Files:**
- Create: `js/data/npcDialogue.js`
- Modify: `js/data/gameConfig.js` (add speech bubble config)
- Modify: `js/world/WorldBuilder.js` (attach dialogue to NPCs)
- Modify: `js/entities/NPC.js` (track player proximity, cycle dialogue)
- Modify: `js/rendering/RenderConfig.js` (add speech bubble render constants)
- Modify: `js/rendering/EntityRenderers.js` (draw speech bubbles)

- [ ] **Step 1: Create NPC dialogue data**

Create `js/data/npcDialogue.js`:

```js
/* NPC dialogue lines — keyed by NPC index matching WorldBuilder order */
/* Each NPC gets 2-3 lines that rotate. Lines talk about the player's work. */
export const npcDialogue = [
    // 0: Kingdom Ranger (Red Archer) — roams entire map
    [
        'This kingdom has 14,000 visitors and counting.',
        'The lord built everything — client, server, pipeline.',
        'I patrol from the Archives to the Crossing. Much to guard.',
    ],
    // 1: Monk — monastery/archery/monument
    [
        '25 chapters on infinite runners. I have read them all.',
        'FlowUI brings order to chaos. Open source, MIT licensed.',
        'The systems in the monastery? Eight of them. All reusable.',
    ],
    // 2: Woodcutter — trees, tech house
    [
        'C++, C#, TypeScript, Go, Python... he never stops learning.',
        'The tech house holds more tools than I have axes.',
    ],
    // 3: Gold Carrier — monument to castle
    [
        'I deliver gold to the castle. 62,000 matches worth.',
        'Seven builders raised that castle. He leads the charge.',
    ],
    // 4: Shepherd — sheep area
    [
        'Even the sheep know about the 5 million downloads.',
        'Peaceful here by the Archives. Good place to start.',
    ],
    // 5: Border Guard (Black Lancer) — perimeter
    [
        'The border is secure. Docker on Cloud Run, they say.',
        'CI/CD pipelines guard this kingdom day and night.',
    ],
    // 6: Miner — tower/barracks
    [
        'The engine tower? C++ and SFML. Built from bedrock.',
        'I mine resources for the barracks. 5 million downloads need fuel.',
    ],
    // 7: Gate Warrior — gate/path/tech house
    [
        'Socket.IO keeps the gates open for real-time play.',
        'AFK players get replaced by bots. No idle hands here.',
    ],
    // 8: Lumberjack — projects district trees
    [
        'Hot reload in 7 milliseconds. The forge never cools.',
        'IL patching, Roslyn compilation... the forge is something else.',
    ],
    // 9: Builder — barracks/tower
    [
        'He built a reconnection system. 9 out of 10 rating.',
        'The event bus carries messages across the whole kingdom.',
    ],
    // 10: Castle Guard (Blue Warrior) — castle perimeter
    [
        '2,800 players visit the castle every day.',
        '7,400 ranked warriors compete in the tournament.',
        'Team Lead of seven. He built 55% of these walls.',
    ],
];
```

- [ ] **Step 2: Add speech bubble config constants**

In `js/data/gameConfig.js`, add:

```js
// Speech bubble
export const SPEECH_PROXIMITY = 120;
export const SPEECH_DISPLAY_FRAMES = 300;
export const SPEECH_CYCLE_FRAMES = 420;
```

- [ ] **Step 3: Add speech bubble render constants**

In `js/rendering/RenderConfig.js`, add at the end (before the Colors section):

```js
// Speech bubble
export const BUBBLE_MAX_W = 180;
export const BUBBLE_PAD_X = 10;
export const BUBBLE_PAD_Y = 6;
export const BUBBLE_RADIUS = 8;
export const BUBBLE_FONT_SIZE = 9;
export const BUBBLE_LINE_HEIGHT = 13;
export const BUBBLE_Y_OFFSET = 20;
export const BUBBLE_TAIL_W = 6;
export const BUBBLE_TAIL_H = 8;
export const BUBBLE_ALPHA = 0.9;
export const COLOR_BUBBLE_BG = 'rgba(20,10,5,0.85)';
export const COLOR_BUBBLE_BORDER = 'rgba(238,201,65,0.6)';
export const COLOR_BUBBLE_TEXT = '#e8e4e0';
```

- [ ] **Step 4: Attach dialogue to NPCs in WorldBuilder**

In `js/world/WorldBuilder.js`, add import at the top:

```js
import { npcDialogue } from '../data/npcDialogue.js';
```

After the `npcs` array is built, attach dialogue and runtime state. Add after the closing `];` of the npcs array:

```js
// Attach dialogue lines and runtime state to each NPC
npcs.forEach((npc, i) => {
    npc.dialogue = npcDialogue[i] || [];
    npc.dialogueIndex = 0;
    npc.speechTimer = 0;
    npc.showSpeech = false;
});
```

- [ ] **Step 5: Update NPC.js — track player proximity for speech**

In `js/entities/NPC.js`, add imports:

```js
import { player } from './Player.js';
import { SPEECH_PROXIMITY, SPEECH_DISPLAY_FRAMES, SPEECH_CYCLE_FRAMES } from '../data/gameConfig.js';
```

At the end of `updateNPCs()`, after the chat cooldown block and meeting check, add:

```js
// Speech bubble — show dialogue when player is near an idle/chat NPC
for (const npc of npcs) {
    if (!npc.dialogue || npc.dialogue.length === 0) continue;
    const dx = (player.x + player.w / 2) - npc.x;
    const dy = (player.y + player.h / 2) - npc.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const near = dist < SPEECH_PROXIMITY;

    if (near && npc.state !== NPCState.WALK) {
        npc.speechTimer += dt;
        npc.showSpeech = npc.speechTimer < SPEECH_DISPLAY_FRAMES;
        if (npc.speechTimer >= SPEECH_CYCLE_FRAMES) {
            npc.speechTimer = 0;
            npc.dialogueIndex = (npc.dialogueIndex + 1) % npc.dialogue.length;
        }
    } else {
        if (npc.showSpeech) {
            npc.dialogueIndex = (npc.dialogueIndex + 1) % npc.dialogue.length;
        }
        npc.speechTimer = 0;
        npc.showSpeech = false;
    }
}
```

- [ ] **Step 6: Draw speech bubbles in EntityRenderers**

In `js/rendering/EntityRenderers.js`, add imports:

```js
import {
    BUBBLE_MAX_W, BUBBLE_PAD_X, BUBBLE_PAD_Y, BUBBLE_RADIUS,
    BUBBLE_FONT_SIZE, BUBBLE_LINE_HEIGHT, BUBBLE_Y_OFFSET,
    BUBBLE_TAIL_W, BUBBLE_TAIL_H, BUBBLE_ALPHA,
    COLOR_BUBBLE_BG, COLOR_BUBBLE_BORDER, COLOR_BUBBLE_TEXT,
    FONT_BODY,
} from './RenderConfig.js';
```

Add a `drawSpeechBubble` function before the `renderers` map:

```js
/* ─── Speech bubble ─── */
function wrapText(text, maxW) {
    ctx.font = `400 ${BUBBLE_FONT_SIZE}px ${FONT_BODY}`;
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const word of words) {
        const test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxW) {
            if (line) lines.push(line);
            line = word;
        } else {
            line = test;
        }
    }
    if (line) lines.push(line);
    return lines;
}

function drawSpeechBubble(npc, sx, sy) {
    if (!npc.showSpeech || !npc.dialogue || npc.dialogue.length === 0) return;
    const text = npc.dialogue[npc.dialogueIndex];
    if (!text) return;

    const lines = wrapText(text, BUBBLE_MAX_W - BUBBLE_PAD_X * 2);
    const textW = Math.min(BUBBLE_MAX_W, Math.max(...lines.map(l => ctx.measureText(l).width)) + BUBBLE_PAD_X * 2);
    const textH = lines.length * BUBBLE_LINE_HEIGHT + BUBBLE_PAD_Y * 2;

    const fw = npc.fw || NPC_DEFAULT_FW;
    const s = npc.scale ?? NPC_DEFAULT_SCALE;
    const bx = sx + (fw * s) / 2 - textW / 2;
    const by = sy - textH - BUBBLE_Y_OFFSET - BUBBLE_TAIL_H;

    ctx.globalAlpha = BUBBLE_ALPHA;

    // Bubble background
    ctx.fillStyle = COLOR_BUBBLE_BG;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(bx, by, textW, textH, BUBBLE_RADIUS);
    else ctx.rect(bx, by, textW, textH);
    ctx.fill();
    ctx.strokeStyle = COLOR_BUBBLE_BORDER;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Tail triangle
    const tailX = bx + textW / 2;
    ctx.fillStyle = COLOR_BUBBLE_BG;
    ctx.beginPath();
    ctx.moveTo(tailX - BUBBLE_TAIL_W, by + textH);
    ctx.lineTo(tailX + BUBBLE_TAIL_W, by + textH);
    ctx.lineTo(tailX, by + textH + BUBBLE_TAIL_H);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.globalAlpha = 1;
    ctx.font = `400 ${BUBBLE_FONT_SIZE}px ${FONT_BODY}`;
    ctx.fillStyle = COLOR_BUBBLE_TEXT;
    ctx.textAlign = 'left';
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], bx + BUBBLE_PAD_X, by + BUBBLE_PAD_Y + BUBBLE_LINE_HEIGHT * (i + 1) - 2);
    }
    ctx.textAlign = 'center';
}
```

Then in the NPC renderer, add the speech bubble call after the NPC is drawn:

```js
[EntityType.NPC](item) {
    const n = item.data;
    const img = n.state === NPCState.WALK ? IMG[n.runAsset] : IMG[n.idleAsset];
    if (!img) return;
    const fw = n.fw || NPC_DEFAULT_FW, fh = n.fh || NPC_DEFAULT_FH;
    const s = n.scale ?? NPC_DEFAULT_SCALE;
    const yo = n.yOffset ?? NPC_DEFAULT_Y_OFFSET;
    const dw = fw * s, dh = fh * s;
    const footX = item.sx + dw / 2;
    const footY = item.sy + dh - yo;
    ctx.fillStyle = COLOR_NPC_SHADOW;
    ctx.beginPath();
    ctx.ellipse(footX, footY, NPC_SHADOW_RX, NPC_SHADOW_RY, 0, 0, Math.PI * 2);
    ctx.fill();
    drawFrame(img, n.frame, fw, fh, item.sx, footY - dh + yo, s, n.facing === -1);
    drawSpeechBubble(n, item.sx, item.sy);
},
```

- [ ] **Step 7: Verify speech bubbles**

Open game. Walk near an idle NPC (e.g., the Shepherd near sheep). Verify:
- Speech bubble appears with dark background and gold border
- Text wraps correctly within bubble
- Dialogue cycles after ~7 seconds
- Bubble disappears when you walk away
- Bubble only shows when NPC is idle/chatting, not walking

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add NPC dialogue system with speech bubbles"
```

---

## Task 4: Discovery Celebration

**Files:**
- Modify: `js/data/enums.js` (add `CELEBRATION` to AchievementFlag)
- Modify: `js/core/GameState.js` (add celebration state + trigger)
- Modify: `js/rendering/RenderConfig.js` (add celebration render constants)
- Modify: `js/rendering/Overlays.js` (add `updateCelebrationAnim` + `drawCelebration`)
- Modify: `js/rendering/Renderer.js` (draw celebration overlay)
- Modify: `js/systems/AchievementSystem.js` (fire celebration trigger)
- Modify: `js/main.js` (call `updateCelebrationAnim` during update phase)

- [ ] **Step 1: Add celebration enum to enums.js**

In `js/data/enums.js`, add to `AchievementFlag`:

```js
export const AchievementFlag = {
    WIND_USED: 'windUsed',
    SCROLL_OPENED: 'scrollOpened',
    CELEBRATION: '_celebration',
};
```

- [ ] **Step 2: Add celebration constants to RenderConfig**

In `js/rendering/RenderConfig.js`, add:

```js
// Discovery celebration
export const CELEB_FADE_IN = 1.0;
export const CELEB_HOLD_END = 5.0;
export const CELEB_FADE_OUT = 6.0;
export const CELEB_TITLE_SIZE = 14;
export const CELEB_SUBTITLE_SIZE = 10;
export const CELEB_CTA_SIZE = 9;
export const CELEB_TITLE_Y_RATIO = 0.4;
export const CELEB_SUBTITLE_Y_OFFSET = 30;
export const CELEB_CTA_Y_OFFSET = 60;
```

- [ ] **Step 3: Add celebration state to GameState**

In `js/core/GameState.js`, add:

```js
// Discovery celebration state
export const celebration = { active: false, startTime: 0, alpha: 0 };

export function triggerCelebration() {
    if (celebration.active) return;
    celebration.active = true;
    celebration.startTime = Date.now();
}
```

- [ ] **Step 4: Add celebration update + draw to Overlays (state mutation in update, not render)**

In `js/rendering/Overlays.js`, add imports and two functions. Following the same pattern as `updateZoneAnnouncementAnim` / `drawZoneAnnouncement`:

```js
import {
    CELEB_FADE_IN, CELEB_HOLD_END, CELEB_FADE_OUT,
    CELEB_TITLE_SIZE, CELEB_SUBTITLE_SIZE, CELEB_CTA_SIZE,
    CELEB_TITLE_Y_RATIO, CELEB_SUBTITLE_Y_OFFSET, CELEB_CTA_Y_OFFSET,
    COLOR_GOLD, FONT_PIXEL, FONT_BODY,
} from './RenderConfig.js';

/* ─── Celebration state progression (call during update, not render) ─── */
export function updateCelebrationAnim(celebration) {
    if (!celebration.active) return;
    const elapsed = (Date.now() - celebration.startTime) / 1000;
    if (elapsed < CELEB_FADE_IN) celebration.alpha = elapsed / CELEB_FADE_IN;
    else if (elapsed < CELEB_HOLD_END) celebration.alpha = 1;
    else if (elapsed < CELEB_FADE_OUT) celebration.alpha = 1 - (elapsed - CELEB_HOLD_END) / (CELEB_FADE_OUT - CELEB_HOLD_END);
    else { celebration.active = false; celebration.alpha = 0; }
}

/* ─── Celebration overlay (pure draw, no state mutation) ─── */
export function drawCelebration(celebration, w, h) {
    if (!celebration.active) return;

    // Dim background
    ctx.globalAlpha = celebration.alpha * 0.3;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = celebration.alpha;
    ctx.textAlign = 'center';

    // Title
    ctx.font = `700 ${CELEB_TITLE_SIZE}px ${FONT_PIXEL}`;
    ctx.fillStyle = COLOR_GOLD;
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 12;
    const ty = h * CELEB_TITLE_Y_RATIO;
    ctx.fillText('Kingdom Complete', w / 2, ty);

    // Subtitle
    ctx.font = `400 ${CELEB_SUBTITLE_SIZE}px ${FONT_BODY}`;
    ctx.fillStyle = '#e8e4e0';
    ctx.shadowBlur = 6;
    ctx.fillText("You've explored the full kingdom.", w / 2, ty + CELEB_SUBTITLE_Y_OFFSET);

    // CTA
    ctx.font = `400 ${CELEB_CTA_SIZE}px ${FONT_BODY}`;
    ctx.fillStyle = COLOR_GOLD;
    ctx.fillText("Let's build the next one together.", w / 2, ty + CELEB_CTA_Y_OFFSET);

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
}
```

- [ ] **Step 5: Wire celebration into AchievementSystem**

In `js/systems/AchievementSystem.js`, add imports:

```js
import { triggerCelebration } from '../core/GameState.js';
import { AchievementFlag } from '../data/enums.js';
```

Inside `checkAchievements()`, after the condition evaluation loop, add:

```js
if (isAllVisited() && !completed.has(AchievementFlag.CELEBRATION)) {
    completed.add(AchievementFlag.CELEBRATION);
    triggerCelebration();
}
```

Note: `AchievementFlag` is already imported — just add `CELEBRATION` usage.

- [ ] **Step 6: Wire celebration into Renderer (draw only)**

In `js/rendering/Renderer.js`, add import:

```js
import { drawCelebration } from './Overlays.js';
import { celebration } from '../core/GameState.js';
```

In `render()`, add after the achievement toast draw call (line ~141):

```js
drawCelebration(celebration, w, h);
```

- [ ] **Step 7: Wire celebration update into main.js (state mutation during update phase)**

In `js/main.js`, add import:

```js
import { updateCelebrationAnim } from './rendering/Overlays.js';
import { celebration } from './core/GameState.js';
```

In the `update()` function, add after `checkAchievements();`:

```js
updateCelebrationAnim(celebration);
```

- [ ] **Step 8: Verify celebration**

Open game. Visit all 10 buildings. On the last building visit, verify:
- Dark overlay fades in
- "Kingdom Complete" appears in gold pixel font
- "You've explored the full kingdom." subtitle
- "Let's build the next one together." CTA
- Fades out after ~6 seconds
- Only triggers once

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: add discovery celebration overlay when all buildings visited"
```

---

## Task 5: LocalStorage Save State

**Files:**
- Create: `js/systems/SaveSystem.js`
- Modify: `js/core/GameState.js` (load saved state on init)
- Modify: `js/systems/AchievementSystem.js` (expose/restore completed set)
- Modify: `js/main.js` (init save system, auto-save on visit)
- Modify: `js/ui/InfoPanel.js` (trigger save on building visit)
- Modify: `js/data/enums.js` (add save key constants)

- [ ] **Step 1: Add save key constants to enums**

In `js/data/enums.js`, add:

```js
// LocalStorage keys
export const SaveKey = {
    VISITED: 'portfolio_visited',
    ACHIEVEMENTS: 'portfolio_achievements',
    FLAGS: 'portfolio_flags',
};
```

- [ ] **Step 2: Create SaveSystem**

Create `js/systems/SaveSystem.js`:

```js
/* Save/load game progress to localStorage */
import { SaveKey } from '../data/enums.js';

export function saveVisited(visitedSet) {
    try {
        localStorage.setItem(SaveKey.VISITED, JSON.stringify([...visitedSet]));
    } catch { /* quota exceeded or private mode — fail silently */ }
}

export function loadVisited() {
    try {
        const raw = localStorage.getItem(SaveKey.VISITED);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
}

export function saveAchievements(completedSet) {
    try {
        localStorage.setItem(SaveKey.ACHIEVEMENTS, JSON.stringify([...completedSet]));
    } catch { /* fail silently */ }
}

export function loadAchievements() {
    try {
        const raw = localStorage.getItem(SaveKey.ACHIEVEMENTS);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
}

export function saveFlags(flags) {
    try {
        localStorage.setItem(SaveKey.FLAGS, JSON.stringify(flags));
    } catch { /* fail silently */ }
}

export function loadFlags() {
    try {
        const raw = localStorage.getItem(SaveKey.FLAGS);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}
```

- [ ] **Step 3: Integrate save/load into GameState**

In `js/core/GameState.js`, add:

```js
import { loadVisited } from '../systems/SaveSystem.js';

// Restore saved visited buildings on init
const saved = loadVisited();
for (const label of saved) visitedBuildings.add(label);
```

- [ ] **Step 4: Integrate save/load into AchievementSystem**

In `js/systems/AchievementSystem.js`, add:

```js
import { loadAchievements, saveAchievements, loadFlags, saveFlags } from '../systems/SaveSystem.js';
```

Replace `const completed = new Set();` with:

```js
const completed = loadAchievements();
```

Replace `let windUsed = false; let scrollOpened = false;` with:

```js
const savedFlags = loadFlags();
let windUsed = savedFlags.windUsed || false;
let scrollOpened = savedFlags.scrollOpened || false;
```

In `markWindUsed()` and `markScrollOpened()`, add saves:

```js
export function markWindUsed() { windUsed = true; saveFlags({ windUsed, scrollOpened }); }
export function markScrollOpened() { scrollOpened = true; saveFlags({ windUsed, scrollOpened }); }
```

After `completed.add(a.id)` inside the evaluation loop, add:

```js
saveAchievements(completed);
```

- [ ] **Step 5: Auto-save visited buildings on visit**

In `js/ui/InfoPanel.js`, add import:

```js
import { saveVisited } from '../systems/SaveSystem.js';
```

Inside `updatePanel()`, after `visitedBuildings.add(cachedNearB.label)`, add:

```js
saveVisited(visitedBuildings);
```

- [ ] **Step 6: Verify persistence**

Open game. Visit 3 buildings. Close and reopen the page. Verify:
- The 3 buildings are still in visited set (no chime plays when revisiting)
- Achievement progress is preserved
- Wind Walker / Scroll achievements persist if triggered

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add localStorage save state for visited buildings and achievements"
```

---

## Task 6: OG Meta Tags & Social Preview

**Files:**
- Modify: `index.html` (add og:image, favicon, update mobile warning)

- [ ] **Step 1: Add og:image placeholder and favicon**

In `index.html`, add after the existing og:type meta tag (line 11):

```html
<meta property="og:image" content="Assets/og-preview.png">
<meta name="twitter:image" content="Assets/og-preview.png">
<link rel="icon" type="image/png" href="Assets/favicon.png">
```

Note: The actual `og-preview.png` and `favicon.png` images need to be created separately. This wires up the HTML references.

- [ ] **Step 2: Update mobile warning with GitHub link**

In `index.html`, the mobile-links section already has GitHub. Verify it points to `https://github.com/KAmshu07`. It does (line 152). No change needed.

- [ ] **Step 3: Add LinkedIn profile link to intro screen**

In `index.html`, after the resume download link in the intro section (line 135), add:

```html
<div class="intro-social">
    <a href="https://github.com/KAmshu07" target="_blank" class="intro-social-link">GitHub</a>
    <a href="https://www.linkedin.com/in/amritanshu-kumar-/" target="_blank" class="intro-social-link">LinkedIn</a>
</div>
```

- [ ] **Step 4: Style intro social links**

In `styles/intro.css`, add:

```css
.intro-social {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 8px;
}
.intro-social-link {
    color: var(--gold);
    font-family: var(--font-body);
    font-size: 11px;
    text-decoration: none;
    opacity: 0.7;
    transition: opacity 0.2s;
}
.intro-social-link:hover {
    opacity: 1;
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add OG meta tags, favicon reference, and intro social links"
```

---

## Verification Checklist

After all tasks are complete, full walkthrough:

- [ ] **New building:** InstaReload forge renders in Projects District, panel opens with content and GitHub link
- [ ] **Enhanced panels:** PONGZ shows role + stores, ALNAHSHA has both stores, SYSTEMS shows FlowUI + course, ENGINE has GitHub
- [ ] **NPC dialogue:** Walk near idle NPCs, speech bubbles appear with project-relevant dialogue, cycle through lines
- [ ] **Discovery celebration:** Visit all 10 buildings, celebration overlay triggers once with CTA
- [ ] **Save state:** Refresh browser, visited buildings and achievements persist
- [ ] **OG tags:** View page source, confirm og:image and favicon meta tags present
- [ ] **Achievements:** "Engineer's Workshop" counts INSTA_RELOAD, "Kingdom Explorer" works with 10 buildings
- [ ] **No regressions:** Wind guidance, achievement toasts, zone announcements, scroll overlay all still work
