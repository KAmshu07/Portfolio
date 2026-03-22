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
};
