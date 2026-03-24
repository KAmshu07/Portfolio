/* Project development stories — keyed by building label.
   To add a story: just add a new entry here. No other file changes needed. */
export const projectStories = {
    INSTA_RELOAD: {
        title: 'InstaReload',
        subtitle: 'The Forge That Never Cools',
        chapters: [
            {
                heading: 'The Problem',
                text: "Unity's domain reload takes 3-5 seconds and wipes all game state. Every code edit during Play Mode means restarting. The goal: patch running code instantly without Unity interfering.",
            },
            {
                heading: 'Attempt 1 — Hook Unity Events',
                text: "Tried using Unity's CompilationPipeline events to intercept compilation. Failed — events fire AFTER Unity already starts processing. They're notifications, not interception points.",
            },
            {
                heading: 'Attempt 2 — Outrun Unity',
                text: "If we compile faster than Unity, maybe we patch before domain reload? Both FileSystemWatchers fire from the same OS event simultaneously. Race condition — Unity always wins.",
            },
            {
                heading: 'Attempt 3 — Hide Files',
                text: "Renamed .cs to .tmp during processing to hide changes from Unity. Corrupted the project state — meta files confused, Git chaos, mid-rename domain reload crashed everything. Had to restore from backup.",
            },
            {
                heading: 'The Breakthrough',
                text: "Researching commercial hot reload tools revealed two Unity APIs: DisallowAutoRefresh() and LockReloadAssemblies(). You can't stop Unity from SEEING changes, but you CAN stop it from PROCESSING them. Block the reaction, not the detection.",
            },
            {
                heading: 'The Result',
                text: "5-stage IL pipeline: detect → analyze → compile (Roslyn) → patch (MonoMod) → dispatch. Dual compilation — Debug path for method bodies (7ms), Release path for structural changes (700ms). 90% of real-world edits take the fast path. 100x faster than Unity's default.",
            },
        ],
    },
    PONGZ: {
        title: 'Pongz',
        subtitle: 'Building a Live Game',
        chapters: [
            {
                heading: 'The Challenge',
                text: "Multiplayer Mahjong with real-time gameplay across mobile devices with unreliable connections. The game server can't trust the client, the client can't wait for the server, and every edge case is someone's money.",
            },
            {
                heading: 'The Socket Framework',
                text: "Built a custom event-driven socket framework on Socket.IO. Type-safe message contracts between Unity C# client and TypeScript server. Automatic serialization. The same pattern that makes the event bus in the 8 reusable systems work \u2014 scaled up to production.",
            },
            {
                heading: 'Reconnection',
                text: "Mobile players lose connection constantly. The reconnection system snapshots game state server-side, detects disconnects within 2 seconds, and seamlessly resynchronizes the client. If they don't return, a bot takes over \u2014 no one else's game is ruined.",
            },
            {
                heading: 'Ranked Matchmaking',
                text: "34-tier skill rating system. Players are matched by skill, not just availability. 7,400+ ranked players competing. The algorithm balances queue times against match quality \u2014 too strict and people wait, too loose and matches are unfair.",
            },
            {
                heading: 'The Team',
                text: "Seven engineers. 55% of the codebase is mine. Team Lead means architecture decisions, code reviews, sprint planning, and still writing more code than anyone else. The 8 reusable systems were extracted from this project to accelerate the whole team.",
            },
        ],
    },
    ENGINE: {
        title: 'Nimirta Engine',
        subtitle: 'Starting from Zero',
        chapters: [
            {
                heading: 'Why Build an Engine?',
                text: "Unity and Unreal handle everything. That's the problem. When something breaks at the engine level, most developers are stuck. Building a custom engine means understanding what actually happens between your code and the pixels on screen.",
            },
            {
                heading: 'The Architecture',
                text: "Entity Component System from scratch. Not Unity's version \u2014 a pure ECS where entities are just IDs, components are just data, and systems process them. The separation matters when you need to reason about performance at the instruction level.",
            },
            {
                heading: 'Physics',
                text: "Collision detection, resolution, and response. Broad phase with spatial hashing, narrow phase with SAT. Every physics tutorial gets the easy case right. The hard part is stacking \u2014 multiple objects resting on each other without jittering or sinking.",
            },
            {
                heading: 'The Result',
                text: "A 2D engine in C++/SFML with physics simulation, ECS architecture, and AI opponents across 3 difficulty levels. More importantly: the deep understanding that made InstaReload possible. You don't patch IL unless you know what's underneath.",
            },
        ],
    },
    ALNAHSHA: {
        title: 'Alnahsha Run',
        subtitle: 'The First Five Million',
        chapters: [
            {
                heading: 'The Start',
                text: "An endless runner at DeftSoft. The brief was straightforward \u2014 build a game, ship it, see what happens. What happened was 5 million downloads.",
            },
            {
                heading: 'Player-Driven Iteration',
                text: "The first version shipped and the metrics told the story. Session length was short. Drop-off was high. Instead of guessing, every update was driven by player data. Engagement improved 30% through systematic iteration, not inspiration.",
            },
            {
                heading: 'The Engineering Discipline',
                text: "Introduced TDD to the team. User ratings improved by 1.5 stars \u2014 not because of features, but because bugs stopped reaching players. Built procedural generation tools that cut level design time by 40%.",
            },
            {
                heading: 'The Lesson',
                text: "5 million people used something I built. That changes how you think about code. Every shortcut is a million-user bug. Every optimization reaches millions of devices. The discipline from this project powered everything that came after.",
            },
        ],
    },
};
