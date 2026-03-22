/* Portfolio content for each interactable building */
export const interactables = [
    {
        label: 'BIO',
        content: `<h2>About Me</h2>
            <p>Client, server, API, and deployment pipeline — I build across the complete stack.
            Currently leading a production multiplayer game from Unity client through TypeScript
            game server to cloud deployment.</p>
            <p>Built a game engine in C++ from first principles.
            Shipped titles with over <strong class="highlight">5M downloads</strong>.</p>
            <p><strong>Current:</strong> Team Lead at RootHoot Pvt Ltd (Remote)</p>
            <p><strong>Previous:</strong> Game Developer at DeftSoft</p>`,
    },
    {
        label: 'SKILLS',
        content: `<h2>What I Do</h2>
            <p><strong class="highlight">01 — Full-Stack Game Dev</strong><br>
            Unity client to backend to deployment.</p><br>
            <p><strong class="highlight">02 — Backend & Multiplayer</strong><br>
            Node.js, Socket.IO, Express, MongoDB, Docker.</p><br>
            <p><strong class="highlight">03 — Engine & Systems</strong><br>
            C++ engine dev, ECS, reusable Unity frameworks.</p>`,
    },
    {
        label: 'TECH',
        content: `<h2>Tech Stack</h2>
            <div class="popup-tags">
                <span class="t-lang">C#</span><span class="t-lang">TypeScript</span>
                <span class="t-lang">C++</span><span class="t-lang">Go</span>
                <span class="t-lang">Python</span><span class="t-engine">Unity</span>
                <span class="t-engine">Unreal</span><span class="t-infra">Node.js</span>
                <span class="t-infra">Express</span><span class="t-infra">MongoDB</span>
                <span class="t-infra">Redis</span><span class="t-infra">Socket.IO</span>
                <span class="t-devops">Docker</span><span class="t-devops">Cloud Run</span>
                <span class="t-devops">GitHub Actions</span>
            </div>`,
    },
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
    {
        label: 'ENGINE',
        content: `<h2>Nimirta Engine</h2>
        <p class="popup-metrics">C++ from first principles</p>
        <p>Custom 2D game engine in C++/SFML. Physics simulation, ECS architecture,
        AI opponents across 3 difficulty levels.</p>
        <div class="popup-pills"><span>C++</span><span>SFML</span><span>ECS</span><span>Physics</span></div>
        <a href="https://github.com/KAmshu07" target="_blank" class="popup-link">GitHub &rarr;</a>`,
    },
    {
        label: 'RECURVE',
        content: `<h2>Recurve 28</h2>
            <p>Hardware-integrated archery game — camera, Arduino, projector
            with OpenCV for real-time arrow detection.</p>
            <div class="popup-pills"><span>Unity</span><span>OpenCV</span><span>Arduino</span></div>`,
    },
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
];
