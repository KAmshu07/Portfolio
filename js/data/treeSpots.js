/* Tree spot coordinates and per-type transparency config */

export const TREE_FADE = {
    tree1: { xR: 75, yD: 180, base: 220 },
    tree2: { xR: 70, yD: 220, base: 210 },
    tree3: { xR: 55, yD: 180, base: 140 },
    tree4: { xR: 50, yD: 130, base: 140 },
};

export const treeSpots = [
    // Border trees
    [50,100],[180,50],[2600,100],[2700,300],[2650,600],[2600,1000],[2500,1300],
    // About quarter
    [100,200],[550,100],[200,500],[500,550],[700,500],
    // Path: spawn to projects
    [1100,500],[1300,400],[1500,350],[1400,700],
    // Projects district
    [1550,300],[2000,200],[2500,400],[2550,850],[2400,1200],
    // Path to contact
    [700,900],[500,1100],[600,1300],[1100,1200],
    // Near water
    [300,1400],[1500,1350],[2000,1350],[2400,1400],
];
