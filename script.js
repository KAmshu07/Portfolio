/* ═══════════════════════════════════════════════════════════════
   GAME PORTFOLIO — Amritanshu Kumar
   Top-down village: "The Kingdom of Amritanshu"
   ═══════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ═══ CONFIG ═══ */
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const SPEED = 2.5;
const WORLD_W = 2800;
const WORLD_H = 2000;
const TILE = 64;
const PSCALE = 0.5;
const WATER_Y = 1650; // river starts here

/* ═══ ASSET LOADER ═══ */
const A = {
    // Player
    idle: 'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Idle.png',
    run:  'Assets/Tiny Swords (Free Pack)/Units/Blue Units/Warrior/Warrior_Run.png',
    // Buildings
    house1:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House1.png',
    house2:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House2.png',
    house3:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/House3.png',
    castle:    'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Castle.png',
    barracks:  'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Barracks.png',
    tower:     'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Tower.png',
    archery:   'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Archery.png',
    monastery: 'Assets/Tiny Swords (Free Pack)/Buildings/Blue Buildings/Monastery.png',
    // Trees
    tree1: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree1.png',
    tree2: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree2.png',
    tree3: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree3.png',
    tree4: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Wood/Trees/Tree4.png',
    // Decorations
    bush1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe1.png',
    bush2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Bushes/Bushe2.png',
    rock1: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock1.png',
    rock2: 'Assets/Tiny Swords (Free Pack)/Terrain/Decorations/Rocks/Rock2.png',
    sheep: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Meat/Sheep/Sheep_Idle.png',
    gold1: 'Assets/Tiny Swords (Free Pack)/Terrain/Resources/Gold/Gold Stones/Gold Stone 1.png',
    // Terrain
    tilemap:  'Assets/Tiny Swords (Free Pack)/Terrain/Tileset/Tilemap_color1.png',
    tilemap3: 'Assets/Tiny Swords (Free Pack)/Terrain/Tileset/Tilemap_color3.png',
    water:    'Assets/Tiny Swords (Update 010)/Terrain/Water/Water.png',
    foam:     'Assets/Tiny Swords (Update 010)/Terrain/Water/Foam/Foam.png',
    bridge:   'Assets/Tiny Swords (Update 010)/Terrain/Bridge/Bridge_All.png',
    // New decorations
    deco01: 'Assets/Tiny Swords (Update 010)/Deco/01.png',
    deco04: 'Assets/Tiny Swords (Update 010)/Deco/04.png',
    deco05: 'Assets/Tiny Swords (Update 010)/Deco/05.png',
    deco18: 'Assets/Tiny Swords (Update 010)/Deco/18.png',
    goldmine: 'Assets/Tiny Swords (Update 010)/Resources/Gold Mine/GoldMine_Active.png',
    // Effects
    fire: 'Assets/Tiny Swords (Free Pack)/Particle FX/Fire_01.png',
    // Water rocks
    wrocks1: 'Assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_01.png',
    wrocks2: 'Assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_02.png',
    wrocks3: 'Assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_03.png',
    wrocks4: 'Assets/Tiny Swords (Update 010)/Terrain/Water/Rocks/Rocks_04.png',
    // Cursor
    cursor: 'Assets/Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_01.png',
};
const IMG = {};
function loadAssets() {
    const entries = Object.entries(A);
    let loaded = 0;
    const btn = document.getElementById('introStart');
    btn.textContent = 'Loading...'; btn.disabled = true;
    return new Promise((resolve, reject) => {
        for (const [key, src] of entries) {
            const img = new Image();
            img.onload = () => {
                IMG[key] = img; loaded++;
                btn.textContent = 'Loading... ' + Math.round(loaded/entries.length*100) + '%';
                if (loaded === entries.length) { btn.textContent = 'Press ENTER or Click to Start'; btn.disabled = false; resolve(); }
            };
            img.onerror = () => { console.warn('Failed: ' + src); IMG[key] = null; loaded++; if (loaded === entries.length) { btn.textContent = 'Press ENTER or Click to Start'; btn.disabled = false; resolve(); } };
            img.src = src;
        }
    });
}

/* ═══ STATE ═══ */
let state = 'INTRO', keys = {}, camera = {x:0,y:0}, w, h;
function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; ctx.imageSmoothingEnabled = false; }
resize(); addEventListener('resize', resize);

/* ═══ INPUT ═══ */
const TOTAL = Object.keys(A).length;
addEventListener('keydown', e => { keys[e.code] = true; if (e.code==='Enter' && state==='INTRO' && Object.keys(IMG).length===TOTAL) startGame(); });
addEventListener('keyup', e => { keys[e.code] = false; });
document.getElementById('introStart').addEventListener('click', () => { if (Object.keys(IMG).length===TOTAL) startGame(); });
function startGame() {
    state = 'PLAYING';
    document.getElementById('intro').classList.add('hidden');
    document.querySelector('.hud').classList.add('visible');
    // Set custom cursor
    canvas.style.cursor = "url('Assets/Tiny Swords (Free Pack)/UI Elements/UI Elements/Cursors/Cursor_01.png') 0 0, auto";
}

/* ═══ PLAYER ═══ */
const player = { x: 500, y: 500, w: 40, h: 30, vx:0, vy:0, facing:1, walking:false, frame:0, ft:0 };

/* ═══ WORLD DATA ═══ */
// Buildings — intentional placement following the design
const buildings = [
    // ABOUT quarter — north-west cozy neighborhood
    { x: 350,  y: 350,  asset:'house1',  w:128, h:192, label:'BIO' },
    { x: 650,  y: 250,  asset:'house2',  w:128, h:192, label:'SKILLS' },
    { x: 250,  y: 650,  asset:'house3',  w:128, h:192, label:'TECH' },
    // PROJECTS district — east, castle is first thing you see from spawn
    { x: 1650, y: 650,  asset:'castle',  w:320, h:256, label:'PONGZ' },
    { x: 2050, y: 400,  asset:'barracks',w:192, h:256, label:'ALNAHSHA' },
    { x: 2350, y: 700,  asset:'tower',   w:128, h:256, label:'ENGINE' },
    { x: 1800, y: 1050, asset:'archery', w:192, h:256, label:'RECURVE' },
    { x: 2200, y: 1000, asset:'monastery',w:192,h:320, label:'SYSTEMS' },
    // CONTACT — south, near the river
    { x: 900,  y: 1350, asset:'house1',  w:128, h:192, label:'CONTACT' },
];

// Trees — placed intentionally along paths and borders
const trees = [];
const treeSpots = [
    // Border trees (frame the world)
    [50,100],[180,50],[2600,100],[2700,300],[2650,600],[2600,1000],[2500,1300],
    // About quarter trees
    [100,200],[550,100],[200,500],[500,550],[700,500],
    // Path from spawn to projects
    [1100,500],[1300,400],[1500,350],[1400,700],
    // Projects district trees
    [1550,300],[2000,200],[2500,400],[2550,850],[2400,1200],
    // Path to contact
    [700,900],[500,1100],[600,1300],[1100,1200],
    // Near water
    [300,1400],[1500,1350],[2000,1350],[2400,1400],
];
for (const [tx,ty] of treeSpots) {
    trees.push({ x:tx, y:ty, asset:'tree'+(Math.floor(Math.random()*4)+1), frame:Math.floor(Math.random()*8), timer:Math.floor(Math.random()*10) });
}

// Decorations — flowers, rocks, bushes along paths
const decos = [];
// Flowers around spawn monument
[[1150,840],[1280,830],[1180,960],[1260,970],[1140,900],[1300,900]].forEach(([x,y]) => {
    decos.push({ x, y, asset: Math.random()>0.5?'deco01':'deco04', frame:0, timer:0, isStatic:true, scale:1.0 });
});
// Bushes along paths
for (let i = 0; i < 20; i++) {
    const x = 100 + Math.random()*2500, y = 100 + Math.random()*1400;
    // Don't place on buildings
    let ok = true;
    for (const b of buildings) { if (Math.abs(x-b.x)<b.w+40 && Math.abs(y-b.y)<b.h+40) { ok=false; break; } }
    if (ok) decos.push({ x, y, asset:Math.random()>0.5?'bush1':'bush2', frame:Math.floor(Math.random()*8), timer:Math.floor(Math.random()*10), isStatic:false, scale:0.6 });
}
// Rocks scattered
for (let i = 0; i < 12; i++) {
    const x = 100+Math.random()*2500, y = 100+Math.random()*1400;
    decos.push({ x, y, asset:Math.random()>0.5?'rock1':'rock2', frame:0, timer:0, isStatic:true, scale:0.7 });
}
// Monument at spawn
const monument = { x: 1200, y: 820 };
// Fire torches near castle (animated)
const fires = [
    { x:1630, y:680, frame:0, timer:0 },
    { x:1950, y:680, frame:0, timer:0 },
    { x:1630, y:880, frame:0, timer:0 },
];
// Sheep
const sheep = { x:500, y:480, frame:0, timer:0 };
// Water rocks scattered in the river (animated)
const waterRocks = [
    { x:100,  y:WATER_Y+20,  asset:'wrocks3' },
    { x:400,  y:WATER_Y+80,  asset:'wrocks1' },
    { x:650,  y:WATER_Y+40,  asset:'wrocks4' },
    { x:950,  y:WATER_Y+100, asset:'wrocks2' },
    { x:1200, y:WATER_Y+30,  asset:'wrocks3' },
    { x:1500, y:WATER_Y+70,  asset:'wrocks1' },
    { x:1750, y:WATER_Y+120, asset:'wrocks4' },
    { x:2050, y:WATER_Y+50,  asset:'wrocks2' },
    { x:2350, y:WATER_Y+90,  asset:'wrocks3' },
    { x:2600, y:WATER_Y+35,  asset:'wrocks1' },
    { x:300,  y:WATER_Y+150, asset:'wrocks2' },
    { x:800,  y:WATER_Y+160, asset:'wrocks4' },
    { x:1400, y:WATER_Y+140, asset:'wrocks3' },
    { x:2200, y:WATER_Y+170, asset:'wrocks1' },
];
// Foam spots scattered IN the water
const foamSpots = [
    { x:150, y:WATER_Y+40 }, { x:500, y:WATER_Y+80 }, { x:750, y:WATER_Y+30 },
    { x:1100, y:WATER_Y+60 }, { x:1400, y:WATER_Y+100 }, { x:1700, y:WATER_Y+45 },
    { x:2000, y:WATER_Y+70 }, { x:2300, y:WATER_Y+35 }, { x:2600, y:WATER_Y+90 },
    { x:350, y:WATER_Y+120 }, { x:800, y:WATER_Y+150 }, { x:1250, y:WATER_Y+130 },
    { x:1800, y:WATER_Y+160 }, { x:2400, y:WATER_Y+110 },
];

/* ═══ INTERACTABLES ═══ */
const interactables = [
    { label:'BIO', content:`<h2>About Me</h2><p>Client, server, API, and deployment pipeline — I build across the complete stack. Currently leading a production multiplayer game from Unity client through TypeScript game server to cloud deployment.</p><p>Built a game engine in C++ from first principles. Shipped titles with over <strong style="color:#eec941">5M downloads</strong>.</p><p><strong>Current:</strong> Team Lead at RootHoot Pvt Ltd (Remote)</p><p><strong>Previous:</strong> Game Developer at DeftSoft</p>` },
    { label:'SKILLS', content:`<h2>What I Do</h2><p><strong style="color:#eec941">01 — Full-Stack Game Dev</strong><br>Unity client to backend to deployment.</p><br><p><strong style="color:#eec941">02 — Backend & Multiplayer</strong><br>Node.js, Socket.IO, Express, MongoDB, Docker.</p><br><p><strong style="color:#eec941">03 — Engine & Systems</strong><br>C++ engine dev, ECS, reusable Unity frameworks.</p>` },
    { label:'TECH', content:`<h2>Tech Stack</h2><div class="popup-tags"><span class="t-lang">C#</span><span class="t-lang">TypeScript</span><span class="t-lang">C++</span><span class="t-lang">Go</span><span class="t-lang">Python</span><span class="t-engine">Unity</span><span class="t-engine">Unreal</span><span class="t-infra">Node.js</span><span class="t-infra">Express</span><span class="t-infra">MongoDB</span><span class="t-infra">Redis</span><span class="t-infra">Socket.IO</span><span class="t-devops">Docker</span><span class="t-devops">Cloud Run</span><span class="t-devops">GitHub Actions</span></div>` },
    { label:'PONGZ', content:`<span class="popup-badge">FLAGSHIP — EARLY ACCESS</span><h2>Pongz</h2><p class="popup-metrics">14K+ Players • 2,800+ DAU • 62K+ Matches</p><p>Production multiplayer Mahjong game. Unity 6 client, TypeScript/Socket.IO game server, Express/MongoDB REST API. Docker on Cloud Run.</p><ul><li>Ranked matchmaking with 34-tier skill rating</li><li>7,400+ ranked players competing</li><li>AFK detection with bot stand-ins</li><li>CI/CD: GitHub Actions → Docker → Cloud Run</li></ul><div class="popup-pills"><span>Unity 6</span><span>TypeScript</span><span>Socket.IO</span><span>Express</span><span>MongoDB</span><span>Docker</span></div>` },
    { label:'ALNAHSHA', content:`<h2>Alnahsha Run</h2><p class="popup-metrics">5M+ Downloads • 4.6 Stars</p><p>Endless runner reaching 5M+ downloads on Google Play. Improved engagement 30% through player-driven iteration.</p><div class="popup-pills"><span>Unity</span><span>C#</span><span>Google Play</span></div><a href="https://play.google.com/store/apps/details?id=com.moderndoctors.alnahsharun" target="_blank" class="popup-link">Play Store →</a>` },
    { label:'ENGINE', content:`<h2>Nimirta Engine</h2><p class="popup-metrics">C++ from first principles</p><p>Custom 2D game engine in C++/SFML. Physics simulation, ECS architecture, AI opponents across 3 difficulty levels.</p><div class="popup-pills"><span>C++</span><span>SFML</span><span>ECS</span><span>Physics</span></div>` },
    { label:'RECURVE', content:`<h2>Recurve 28</h2><p>Hardware-integrated archery game — camera, Arduino, projector with OpenCV for real-time arrow detection.</p><div class="popup-pills"><span>Unity</span><span>OpenCV</span><span>Arduino</span></div>` },
    { label:'SYSTEMS', content:`<h2>Unity Systems</h2><p>8 reusable engine systems: UI, Event Bus, State Machine, Logging, Save, Pause, Popup, Loading.</p><div class="popup-pills"><span>C#</span><span>Unity</span><span>Patterns</span></div>` },
    { label:'CONTACT', content:`<h2>Let's Talk</h2><p>Open to opportunities at studios that value ownership and shipping games people play.</p><div class="contact-grid"><a href="mailto:kamshu00@gmail.com" class="contact-card"><small>EMAIL</small><span>kamshu00@gmail.com</span></a><a href="https://www.linkedin.com/in/amritanshu-kumar-/" target="_blank" class="contact-card"><small>LINKEDIN</small><span>amritanshu-kumar</span></a><a href="tel:+917903734532" class="contact-card"><small>PHONE</small><span>+91 7903734532</span></a><a href="Amritanshu_Kumar_Resume.pdf" target="_blank" download class="contact-card"><small>RESUME</small><span>Download PDF ↓</span></a></div>` },
];

/* ═══ SPRITE HELPERS ═══ */
function drawFrame(img, frame, fw, fh, x, y, scale, flip) {
    if (!img) return;
    ctx.save();
    const dw = fw*scale, dh = fh*scale;
    if (flip) { ctx.translate(x+dw, y); ctx.scale(-1,1); x=0; y=0; }
    ctx.drawImage(img, frame*fw, 0, fw, fh, x, y, dw, dh);
    ctx.restore();
}
function drawImg(img, x, y, s) { if (img) ctx.drawImage(img, x, y, img.width*s, img.height*s); }

/* ═══ UPDATE ═══ */
function update() {
    if (state === 'INTRO') {
        const t = Date.now() * 0.0002;
        camera.x = WORLD_W*0.3 + Math.sin(t)*400;
        camera.y = WORLD_H*0.25 + Math.cos(t*0.7)*300;
        animateWorld();
        return;
    }
    if (state !== 'PLAYING') return;

    let mx=0, my=0;
    if (keys.ArrowLeft||keys.KeyA) { mx=-1; player.facing=-1; }
    if (keys.ArrowRight||keys.KeyD) { mx=1; player.facing=1; }
    if (keys.ArrowUp||keys.KeyW) my=-1;
    if (keys.ArrowDown||keys.KeyS) my=1;
    if (mx&&my) { mx*=0.707; my*=0.707; }
    player.walking = mx!==0||my!==0;

    const nx = player.x + mx*SPEED, ny = player.y + my*SPEED;

    // Collision: buildings + water
    let blocked = false;
    const pf = { x:nx, y:ny, w:player.w, h:player.h };
    for (const b of buildings) {
        const bf = { x:b.x+b.w*0.15, y:b.y+b.h*0.6, w:b.w*0.7, h:b.h*0.35 };
        if (pf.x<bf.x+bf.w && pf.x+pf.w>bf.x && pf.y<bf.y+bf.h && pf.y+pf.h>bf.y) { blocked=true; break; }
    }
    // Water collision (can't walk into river)
    if (ny + player.h > WATER_Y) blocked = true;

    if (!blocked) {
        player.x = Math.max(20, Math.min(WORLD_W-player.w-20, nx));
        player.y = Math.max(20, Math.min(WORLD_H-player.h-20, ny));
    }

    camera.x += ((player.x+player.w/2-w/2)-camera.x)*0.08;
    camera.y += ((player.y+player.h/2-h/2)-camera.y)*0.08;
    camera.x = Math.max(0, Math.min(WORLD_W-w, camera.x));
    camera.y = Math.max(0, Math.min(WORLD_H-h, camera.y));

    if (player.walking) { player.ft++; if (player.ft>5) { player.ft=0; player.frame=(player.frame+1)%6; } }
    else { player.ft++; if (player.ft>8) { player.ft=0; player.frame=(player.frame+1)%8; } }

    animateWorld();
    updatePanel();
}

function animateWorld() {
    for (const tr of trees) { tr.timer++; if (tr.timer>=10) { tr.timer=0; tr.frame=(tr.frame+1)%8; } }
    for (const d of decos) { if (!d.isStatic) { d.timer++; if (d.timer>=12) { d.timer=0; d.frame=(d.frame+1)%8; } } }
    for (const f of fires) { f.timer++; if (f.timer>=6) { f.timer=0; f.frame=(f.frame+1)%8; } }
    sheep.timer++; if (sheep.timer>=10) { sheep.timer=0; sheep.frame=(sheep.frame+1)%6; }
}

/* ═══ RENDER ═══ */
function render() {
    const ox = -camera.x, oy = -camera.y;

    // Ground tiles
    ctx.fillStyle = '#7ab648';
    ctx.fillRect(0, 0, w, h);
    if (IMG.tilemap) {
        const sx=-(camera.x%TILE), sy=-(camera.y%TILE);
        for (let gx=sx; gx<w+TILE; gx+=TILE) for (let gy=sy; gy<h+TILE; gy+=TILE) {
            // Check if this tile is in the water zone
            const wy = gy + camera.y;
            if (wy >= WATER_Y) {
                if (IMG.water) ctx.drawImage(IMG.water, 0,0,64,64, gx, gy, TILE, TILE);
            } else {
                ctx.drawImage(IMG.tilemap, 64,64,64,64, gx, gy, TILE, TILE);
            }
        }
    }

    // Shore foam — individual blobs at specific spots
    if (IMG.foam) {
        const foamFrame = Math.floor(Date.now()*0.002) % 8;
        for (const fs of foamSpots) {
            const fx = fs.x+ox, fy = fs.y+oy;
            if (fx>-200&&fx<w+200&&fy>-200&&fy<h+200) {
                drawFrame(IMG.foam, foamFrame, 192, 192, fx, fy, 0.5, false);
            }
        }
    }

    // Water rocks — animated, scattered in river
    const wrFrame = Math.floor(Date.now()*0.002) % 8;
    for (const wr of waterRocks) {
        const rx = wr.x+ox, ry = wr.y+oy;
        if (rx>-150&&rx<w+150&&ry>-150&&ry<h+150 && IMG[wr.asset]) {
            drawFrame(IMG[wr.asset], wrFrame, 128, 128, rx, ry, 1.0, false);
        }
    }

    // Collect drawables for Y-sort
    const drawList = [];

    for (const b of buildings) {
        const sx=b.x+ox, sy=b.y+oy;
        if (sx<-b.w-20||sx>w+20||sy<-b.h-20||sy>h+20) continue;
        drawList.push({ y:b.y+b.h, type:'building', data:b, sx, sy });
    }
    for (const tr of trees) {
        const sx=tr.x+ox, sy=tr.y+oy;
        if (sx<-200||sx>w+200||sy<-300||sy>h+100) continue;
        drawList.push({ y:tr.y+200, type:'tree', data:tr, sx, sy });
    }
    for (const d of decos) {
        const sx=d.x+ox, sy=d.y+oy;
        if (sx<-100||sx>w+100||sy<-100||sy>h+100) continue;
        drawList.push({ y:d.y+50, type:'deco', data:d, sx, sy });
    }
    // Monument
    { const sx=monument.x+ox, sy=monument.y+oy;
      if (sx>-200&&sx<w+200&&sy>-200&&sy<h+200) drawList.push({ y:monument.y+150, type:'monument', sx, sy }); }
    // Fires
    for (const f of fires) {
        const sx=f.x+ox, sy=f.y+oy;
        if (sx>-100&&sx<w+100&&sy>-100&&sy<h+100) drawList.push({ y:f.y+30, type:'fire', data:f, sx, sy });
    }
    // Sheep
    { const sx=sheep.x+ox, sy=sheep.y+oy;
      if (sx>-100&&sx<w+100&&sy>-100&&sy<h+100) drawList.push({ y:sheep.y+60, type:'sheep', sx, sy }); }
    // Player
    drawList.push({ y:player.y+player.h, type:'player', sx:player.x+ox, sy:player.y+oy });

    drawList.sort((a,b) => a.y - b.y);

    for (const item of drawList) {
        switch(item.type) {
            case 'building': {
                const b = item.data;
                if (IMG[b.asset]) drawImg(IMG[b.asset], item.sx, item.sy, 1.0);
                // Nameplate
                const lx = item.sx+b.w/2, ly = item.sy-12;
                ctx.font = "700 10px 'Press Start 2P',monospace";
                const tw = ctx.measureText(b.label).width;
                const px=10, py=4;
                ctx.fillStyle = 'rgba(20,10,5,0.75)';
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(lx-tw/2-px, ly-10-py, tw+px*2, 16+py*2, 6);
                else ctx.rect(lx-tw/2-px, ly-10-py, tw+px*2, 16+py*2);
                ctx.fill();
                ctx.strokeStyle='rgba(238,201,65,0.5)'; ctx.lineWidth=1.5; ctx.stroke();
                ctx.fillStyle='#eec941'; ctx.textAlign='center'; ctx.fillText(b.label, lx, ly);
                break;
            }
            case 'tree': {
                const tr = item.data;
                if (IMG[tr.asset]) drawFrame(IMG[tr.asset], tr.frame, 192, 256, item.sx, item.sy-56, 1.0, false);
                break;
            }
            case 'deco': {
                const d = item.data;
                if (d.isStatic) { if (IMG[d.asset]) drawImg(IMG[d.asset], item.sx, item.sy, d.scale||0.8); }
                else { if (IMG[d.asset]) drawFrame(IMG[d.asset], d.frame, 128, 128, item.sx, item.sy, d.scale||0.6, false); }
                break;
            }
            case 'monument':
                if (IMG.deco18) drawImg(IMG.deco18, item.sx, item.sy, 1.0);
                break;
            case 'fire': {
                const f = item.data;
                if (IMG.fire) drawFrame(IMG.fire, f.frame, 64, 64, item.sx, item.sy-20, 0.8, false);
                break;
            }
            case 'sheep':
                if (IMG.sheep) drawFrame(IMG.sheep, sheep.frame, 128, 128, item.sx, item.sy, 0.7, false);
                break;
            case 'player':
                drawPlayer(item.sx, item.sy);
                break;
        }
    }

    // Proximity indicator
    const nearB = getNearBuilding();
    if (nearB && state === 'PLAYING') {
        const t = Date.now()*0.001;
        const bx = nearB.x+ox+nearB.w/2, by = nearB.y+oy-30+Math.sin(t*4)*6;
        ctx.shadowColor='#eec941'; ctx.shadowBlur=12;
        ctx.fillStyle='#eec941'; ctx.beginPath();
        ctx.moveTo(bx-8,by); ctx.lineTo(bx+8,by); ctx.lineTo(bx,by+12); ctx.closePath(); ctx.fill();
        ctx.shadowBlur=0;
    }

    // Bottom HUD
    if (state === 'PLAYING') {
        const barH = 36;
        const bg = ctx.createLinearGradient(0,h-barH-10,0,h);
        bg.addColorStop(0,'rgba(15,10,5,0)'); bg.addColorStop(0.4,'rgba(15,10,5,0.7)'); bg.addColorStop(1,'rgba(15,10,5,0.85)');
        ctx.fillStyle=bg; ctx.fillRect(0,h-barH-10,w,barH+10);
        ctx.textAlign='center';
        if (nearB) {
            ctx.font="700 11px 'Press Start 2P',monospace"; ctx.fillStyle='#eec941';
            ctx.fillText(nearB.label, w/2, h-18);
            ctx.font="400 8px 'Press Start 2P',monospace"; ctx.fillStyle='rgba(255,255,255,0.6)';
            ctx.fillText('Walk closer to explore', w/2, h-6);
        } else {
            ctx.font="400 8px 'Press Start 2P',monospace"; ctx.fillStyle='rgba(255,255,255,0.4)';
            ctx.fillText('WASD to move  •  Walk to buildings to explore', w/2, h-12);
        }
    }
}

/* ═══ DRAW PLAYER ═══ */
function drawPlayer(sx, sy) {
    const img = player.walking ? IMG.run : IMG.idle;
    if (!img) return;
    ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.beginPath();
    ctx.ellipse(sx+player.w/2, sy+player.h, 18, 5, 0, 0, 6.28); ctx.fill();
    drawFrame(img, player.frame, 192, 192, sx-28, sy-38, PSCALE, player.facing===-1);
}

/* ═══ INFO PANEL ═══ */
const infoPanel = document.getElementById('infoPanel');
const infoPanelInner = document.getElementById('infoPanelInner');
let activeLabel = null;

function getNearBuilding() {
    const pcx=player.x+player.w/2, pcy=player.y+player.h/2;
    let nearest=null, dist=999;
    for (const b of buildings) {
        const bcx=b.x+b.w/2, bcy=b.y+b.h/2;
        const d = Math.sqrt((pcx-bcx)**2 + (pcy-bcy)**2);
        const threshold = Math.max(b.w, b.h)*0.7;
        if (d<threshold && d<dist) { nearest=b; dist=d; }
    }
    return nearest;
}
function updatePanel() {
    const nearB = getNearBuilding();
    if (nearB) {
        if (nearB.label !== activeLabel) {
            activeLabel = nearB.label;
            const data = interactables.find(i => i.label===nearB.label);
            if (data) infoPanelInner.innerHTML = data.content;
        }
        infoPanel.classList.add('visible');
    } else { infoPanel.classList.remove('visible'); activeLabel=null; }
}

/* ═══ GAME LOOP ═══ */
function loop() { update(); render(); requestAnimationFrame(loop); }
loop();
loadAssets().catch(err => {
    console.error(err);
    const btn = document.getElementById('introStart');
    btn.textContent='Load failed — Download Resume'; btn.disabled=false;
    btn.onclick=()=>window.open('Amritanshu_Kumar_Resume.pdf');
});
})();
