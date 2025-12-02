/**
 * SITESYNC PIXEL SPRITES
 * Game Boy style pixel art data for terminal game
 * Each sprite is a 2D array of hex colors ('t' = transparent)
 */

const PIXEL_SPRITES = {
    // Color palette - Game Boy inspired + SiteSync brand
    palette: {
        // Game Boy greenscale
        gbLightest: '#9bbc0f',
        gbLight: '#8bac0f',
        gbDark: '#306230',
        gbDarkest: '#0f380f',

        // SiteSync brand
        bg: '#0d1117',
        dark: '#1a1f26',
        accent: '#f0883e',
        text: '#e6edf3',
        success: '#3fb950',
        error: '#f85149',
        info: '#58a6ff',

        // Sprite colors
        wall: '#4a5568',
        wallDark: '#2d3748',
        window: '#58a6ff',
        windowLit: '#90cdf4',
        roof: '#718096',
        door: '#f0883e',
        skin: '#ffd5b5',
        shirt: '#58a6ff',
        pants: '#2d3748',
        hair: '#4a3728',
        briefcase: '#8b6914',
        heart: '#f85149',
        heartGlow: '#ff6b6b'
    },

    // ═══════════════════════════════════════════════════════════════
    // BUILDING SPRITES (16x20)
    // ═══════════════════════════════════════════════════════════════

    building: {
        width: 16,
        height: 20,
        scale: 3,
        pixels: [
            // t = transparent, use palette keys
            ['t','t','t','t','roof','roof','roof','roof','roof','roof','roof','roof','t','t','t','t'],
            ['t','t','t','roof','roof','roof','roof','roof','roof','roof','roof','roof','roof','t','t','t'],
            ['t','t','roof','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','roof','t','t'],
            ['t','t','wall','wall','window','window','wall','wall','wall','window','window','wall','wall','wall','t','t'],
            ['t','t','wall','wall','window','window','wall','wall','wall','window','window','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','window','window','wall','wall','wall','window','window','wall','wall','wall','t','t'],
            ['t','t','wall','wall','window','window','wall','wall','wall','window','window','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','window','window','wall','wall','wall','window','window','wall','wall','wall','t','t'],
            ['t','t','wall','wall','window','window','wall','wall','wall','window','window','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','window','window','wall','wall','wall','window','window','wall','wall','wall','t','t'],
            ['t','t','wall','wall','window','window','wall','wall','wall','window','window','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','door','door','door','door','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','door','door','door','door','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','door','door','door','door','wall','wall','wall','wall','t','t'],
            ['t','t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t','t'],
            ['t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t']
        ]
    },

    // Building with lit windows (happy state)
    buildingHappy: {
        width: 16,
        height: 20,
        scale: 3,
        pixels: [
            ['t','t','t','t','roof','roof','roof','roof','roof','roof','roof','roof','t','t','t','t'],
            ['t','t','t','roof','roof','roof','roof','roof','roof','roof','roof','roof','roof','t','t','t'],
            ['t','t','roof','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','roof','t','t'],
            ['t','t','wall','wall','windowLit','windowLit','wall','wall','wall','windowLit','windowLit','wall','wall','wall','t','t'],
            ['t','t','wall','wall','windowLit','windowLit','wall','wall','wall','windowLit','windowLit','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','windowLit','windowLit','wall','wall','wall','windowLit','windowLit','wall','wall','wall','t','t'],
            ['t','t','wall','wall','windowLit','windowLit','wall','wall','wall','windowLit','windowLit','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','windowLit','windowLit','wall','wall','wall','windowLit','windowLit','wall','wall','wall','t','t'],
            ['t','t','wall','wall','windowLit','windowLit','wall','wall','wall','windowLit','windowLit','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','windowLit','windowLit','wall','wall','wall','windowLit','windowLit','wall','wall','wall','t','t'],
            ['t','t','wall','wall','windowLit','windowLit','wall','wall','wall','windowLit','windowLit','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','success','success','success','success','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','success','success','success','success','wall','wall','wall','wall','t','t'],
            ['t','t','wall','wall','wall','wall','success','success','success','success','wall','wall','wall','wall','t','t'],
            ['t','t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t','t'],
            ['t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t']
        ]
    },

    // Small building for network scene (12x14)
    buildingSmall: {
        width: 12,
        height: 14,
        scale: 2,
        pixels: [
            ['t','t','roof','roof','roof','roof','roof','roof','roof','roof','t','t'],
            ['t','roof','wall','wall','wall','wall','wall','wall','wall','wall','roof','t'],
            ['t','wall','wall','window','window','wall','wall','window','window','wall','wall','t'],
            ['t','wall','wall','window','window','wall','wall','window','window','wall','wall','t'],
            ['t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t'],
            ['t','wall','wall','window','window','wall','wall','window','window','wall','wall','t'],
            ['t','wall','wall','window','window','wall','wall','window','window','wall','wall','t'],
            ['t','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','t'],
            ['t','wall','wall','window','window','wall','wall','window','window','wall','wall','t'],
            ['t','wall','wall','window','window','wall','wall','window','window','wall','wall','t'],
            ['t','wall','wall','wall','wall','door','door','wall','wall','wall','wall','t'],
            ['t','wall','wall','wall','wall','door','door','wall','wall','wall','wall','t'],
            ['t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t'],
            ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark']
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // WORKER SPRITE (8x12) - 2 frames for walking
    // ═══════════════════════════════════════════════════════════════

    worker: {
        width: 8,
        height: 12,
        scale: 3,
        frames: [
            // Frame 1 - standing/walk1
            [
                ['t','t','hair','hair','hair','hair','t','t'],
                ['t','hair','hair','hair','hair','hair','hair','t'],
                ['t','hair','skin','skin','skin','skin','hair','t'],
                ['t','t','skin','skin','skin','skin','t','t'],
                ['t','t','shirt','shirt','shirt','shirt','t','t'],
                ['t','shirt','shirt','shirt','shirt','shirt','shirt','t'],
                ['t','shirt','shirt','shirt','shirt','shirt','shirt','t'],
                ['t','t','shirt','shirt','shirt','shirt','t','t'],
                ['t','t','pants','pants','pants','pants','t','t'],
                ['t','t','pants','t','t','pants','t','t'],
                ['t','t','pants','t','t','pants','t','t'],
                ['t','wallDark','wallDark','t','t','wallDark','wallDark','t']
            ],
            // Frame 2 - walk2
            [
                ['t','t','hair','hair','hair','hair','t','t'],
                ['t','hair','hair','hair','hair','hair','hair','t'],
                ['t','hair','skin','skin','skin','skin','hair','t'],
                ['t','t','skin','skin','skin','skin','t','t'],
                ['t','t','shirt','shirt','shirt','shirt','t','t'],
                ['t','shirt','shirt','shirt','shirt','shirt','shirt','t'],
                ['t','shirt','shirt','shirt','shirt','shirt','shirt','t'],
                ['t','t','shirt','shirt','shirt','shirt','t','t'],
                ['t','t','pants','pants','pants','pants','t','t'],
                ['t','pants','t','t','t','t','pants','t'],
                ['t','pants','t','t','t','t','pants','t'],
                ['wallDark','wallDark','t','t','t','t','wallDark','wallDark']
            ]
        ]
    },

    // Worker with briefcase (leaving)
    workerWithBriefcase: {
        width: 12,
        height: 12,
        scale: 3,
        frames: [
            // Frame 1
            [
                ['t','t','t','t','hair','hair','hair','hair','t','t','t','t'],
                ['t','t','t','hair','hair','hair','hair','hair','hair','t','t','t'],
                ['t','t','t','hair','skin','skin','skin','skin','hair','t','t','t'],
                ['t','t','t','t','skin','skin','skin','skin','t','t','t','t'],
                ['t','t','t','t','shirt','shirt','shirt','shirt','t','t','t','t'],
                ['t','t','t','shirt','shirt','shirt','shirt','shirt','shirt','t','t','t'],
                ['t','t','t','shirt','shirt','shirt','shirt','shirt','shirt','briefcase','briefcase','t'],
                ['t','t','t','t','shirt','shirt','shirt','shirt','t','briefcase','briefcase','t'],
                ['t','t','t','t','pants','pants','pants','pants','t','briefcase','briefcase','t'],
                ['t','t','t','t','pants','t','t','pants','t','t','t','t'],
                ['t','t','t','t','pants','t','t','pants','t','t','t','t'],
                ['t','t','t','wallDark','wallDark','t','t','wallDark','wallDark','t','t','t']
            ],
            // Frame 2
            [
                ['t','t','t','t','hair','hair','hair','hair','t','t','t','t'],
                ['t','t','t','hair','hair','hair','hair','hair','hair','t','t','t'],
                ['t','t','t','hair','skin','skin','skin','skin','hair','t','t','t'],
                ['t','t','t','t','skin','skin','skin','skin','t','t','t','t'],
                ['t','t','t','t','shirt','shirt','shirt','shirt','t','t','t','t'],
                ['t','t','t','shirt','shirt','shirt','shirt','shirt','shirt','t','t','t'],
                ['t','t','t','shirt','shirt','shirt','shirt','shirt','shirt','briefcase','briefcase','t'],
                ['t','t','t','t','shirt','shirt','shirt','shirt','t','briefcase','briefcase','t'],
                ['t','t','t','t','pants','pants','pants','pants','t','briefcase','briefcase','t'],
                ['t','t','t','pants','t','t','t','t','pants','t','t','t'],
                ['t','t','t','pants','t','t','t','t','pants','t','t','t'],
                ['t','t','wallDark','wallDark','t','t','t','t','wallDark','wallDark','t','t']
            ]
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // SITESYNC LOGO (16x16)
    // ═══════════════════════════════════════════════════════════════

    logo: {
        width: 16,
        height: 16,
        scale: 3,
        pixels: [
            ['t','t','t','t','t','accent','accent','accent','accent','accent','accent','t','t','t','t','t'],
            ['t','t','t','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','t','t','t'],
            ['t','t','accent','accent','accent','t','t','t','t','t','t','accent','accent','accent','t','t'],
            ['t','accent','accent','accent','t','t','t','t','t','t','t','t','accent','accent','accent','t'],
            ['t','accent','accent','t','t','t','t','t','t','t','t','t','t','accent','accent','t'],
            ['accent','accent','t','t','t','accent','accent','accent','accent','accent','t','t','t','t','accent','accent'],
            ['accent','accent','t','t','accent','accent','accent','accent','accent','accent','accent','t','t','t','accent','accent'],
            ['accent','accent','t','t','accent','accent','t','t','t','accent','accent','t','t','t','accent','accent'],
            ['accent','accent','t','t','accent','accent','t','t','t','accent','accent','t','t','t','accent','accent'],
            ['accent','accent','t','t','accent','accent','accent','accent','accent','accent','accent','t','t','t','accent','accent'],
            ['accent','accent','t','t','t','accent','accent','accent','accent','accent','t','t','t','t','accent','accent'],
            ['t','accent','accent','t','t','t','t','t','t','t','t','t','t','accent','accent','t'],
            ['t','accent','accent','accent','t','t','t','t','t','t','t','t','accent','accent','accent','t'],
            ['t','t','accent','accent','accent','t','t','t','t','t','t','accent','accent','accent','t','t'],
            ['t','t','t','accent','accent','accent','accent','accent','accent','accent','accent','accent','accent','t','t','t'],
            ['t','t','t','t','t','accent','accent','accent','accent','accent','accent','t','t','t','t','t']
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // UI ELEMENTS
    // ═══════════════════════════════════════════════════════════════

    // Heart icon (8x8)
    heart: {
        width: 8,
        height: 8,
        scale: 2,
        pixels: [
            ['t','heart','heart','t','t','heart','heart','t'],
            ['heart','heart','heart','heart','heart','heart','heart','heart'],
            ['heart','heart','heart','heart','heart','heart','heart','heart'],
            ['heart','heart','heart','heart','heart','heart','heart','heart'],
            ['t','heart','heart','heart','heart','heart','heart','t'],
            ['t','t','heart','heart','heart','heart','t','t'],
            ['t','t','t','heart','heart','t','t','t'],
            ['t','t','t','t','t','t','t','t']
        ]
    },

    // Lightning bolt (8x12)
    lightning: {
        width: 8,
        height: 12,
        scale: 2,
        pixels: [
            ['t','t','t','t','t','accent','accent','t'],
            ['t','t','t','t','accent','accent','t','t'],
            ['t','t','t','accent','accent','t','t','t'],
            ['t','t','accent','accent','t','t','t','t'],
            ['t','accent','accent','accent','accent','accent','t','t'],
            ['t','t','t','t','accent','accent','t','t'],
            ['t','t','t','accent','accent','t','t','t'],
            ['t','t','accent','accent','t','t','t','t'],
            ['t','accent','accent','t','t','t','t','t'],
            ['accent','accent','t','t','t','t','t','t'],
            ['accent','t','t','t','t','t','t','t'],
            ['t','t','t','t','t','t','t','t']
        ]
    },

    // Question mark (8x10)
    questionMark: {
        width: 8,
        height: 10,
        scale: 2,
        pixels: [
            ['t','t','error','error','error','error','t','t'],
            ['t','error','error','error','error','error','error','t'],
            ['t','error','error','t','t','error','error','t'],
            ['t','t','t','t','t','error','error','t'],
            ['t','t','t','t','error','error','t','t'],
            ['t','t','t','error','error','t','t','t'],
            ['t','t','t','error','error','t','t','t'],
            ['t','t','t','t','t','t','t','t'],
            ['t','t','t','error','error','t','t','t'],
            ['t','t','t','error','error','t','t','t']
        ]
    },

    // Checkmark (8x8)
    checkmark: {
        width: 8,
        height: 8,
        scale: 2,
        pixels: [
            ['t','t','t','t','t','t','t','success'],
            ['t','t','t','t','t','t','success','success'],
            ['t','t','t','t','t','success','success','t'],
            ['t','t','t','t','success','success','t','t'],
            ['success','t','t','success','success','t','t','t'],
            ['success','success','success','success','t','t','t','t'],
            ['t','success','success','t','t','t','t','t'],
            ['t','t','t','t','t','t','t','t']
        ]
    },

    // Data packet (4x4)
    dataPacket: {
        width: 4,
        height: 4,
        scale: 2,
        pixels: [
            ['t','info','info','t'],
            ['info','info','info','info'],
            ['info','info','info','info'],
            ['t','info','info','t']
        ]
    },

    // AI Brain icon (10x10)
    aiBrain: {
        width: 10,
        height: 10,
        scale: 2,
        pixels: [
            ['t','t','info','info','info','info','info','info','t','t'],
            ['t','info','info','info','info','info','info','info','info','t'],
            ['info','info','t','info','info','info','info','t','info','info'],
            ['info','info','info','info','info','info','info','info','info','info'],
            ['info','t','info','info','t','t','info','info','t','info'],
            ['info','info','info','info','info','info','info','info','info','info'],
            ['info','info','t','info','info','info','info','t','info','info'],
            ['info','info','info','info','info','info','info','info','info','info'],
            ['t','info','info','info','info','info','info','info','info','t'],
            ['t','t','info','info','info','info','info','info','t','t']
        ]
    },

    // Star/sparkle (6x6)
    sparkle: {
        width: 6,
        height: 6,
        scale: 2,
        pixels: [
            ['t','t','accent','accent','t','t'],
            ['t','t','accent','accent','t','t'],
            ['accent','accent','accent','accent','accent','accent'],
            ['accent','accent','accent','accent','accent','accent'],
            ['t','t','accent','accent','t','t'],
            ['t','t','accent','accent','t','t']
        ]
    },

    // Connection line segment (horizontal, 8x2)
    connectionH: {
        width: 8,
        height: 2,
        scale: 2,
        pixels: [
            ['success','success','success','success','success','success','success','success'],
            ['success','success','success','success','success','success','success','success']
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // NEW ASSETS: ELEVATOR STORY
    // ═══════════════════════════════════════════════════════════════

    elevator: {
        width: 14,
        height: 20,
        scale: 3,
        frames: [
            // Frame 0: Closed
            [
                ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark'],
                ['wallDark','t','t','t','t','t','t','t','t','t','t','t','t','wallDark'],
                ['wallDark','t','accent','accent','t','t','wallDark','wallDark','t','t','t','t','t','wallDark'], // Floor indicator
                ['wallDark','t','t','t','t','t','t','t','t','t','t','t','t','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wall','wallDark','wallDark','wall','wall','wall','wall','wall','wallDark'],
                ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark']
            ],
            // Frame 1: Open (Dark inside)
            [
                ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark'],
                ['wallDark','t','t','t','t','t','t','t','t','t','t','t','t','wallDark'],
                ['wallDark','t','success','success','t','t','wallDark','wallDark','t','t','t','t','t','wallDark'], // Green light
                ['wallDark','t','t','t','t','t','t','t','t','t','t','t','t','wallDark'],
                ['wallDark','wall','t','t','t','t','t','t','t','t','t','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wall','t','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','gbDarkest','t','wall','wallDark'],
                ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark']
            ]
        ]
    },

    phone: {
        width: 8,
        height: 10,
        scale: 2,
        pixels: [
            ['t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t'],
            ['wallDark','info','info','info','info','info','info','wallDark'],
            ['wallDark','info','info','info','info','info','info','wallDark'],
            ['wallDark','info','info','info','info','info','info','wallDark'],
            ['wallDark','info','info','info','info','info','info','wallDark'],
            ['wallDark','info','info','info','info','info','info','wallDark'],
            ['wallDark','info','info','info','info','info','info','wallDark'],
            ['wallDark','info','info','info','info','info','info','wallDark'],
            ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark'],
            ['t','t','t','t','t','t','t','t']
        ]
    },

    accessPanel: {
        width: 6,
        height: 8,
        scale: 2,
        frames: [
            // Red (Locked)
            [
                ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark'],
                ['wallDark','error','error','error','error','wallDark'],
                ['wallDark','error','error','error','error','wallDark'],
                ['wallDark','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wallDark'],
                ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark']
            ],
            // Green (Unlocked)
            [
                ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark'],
                ['wallDark','success','success','success','success','wallDark'],
                ['wallDark','success','success','success','success','wallDark'],
                ['wallDark','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wallDark'],
                ['wallDark','wall','wall','wall','wall','wallDark'],
                ['wallDark','wallDark','wallDark','wallDark','wallDark','wallDark']
            ]
        ]
    },

    battery: {
        width: 8,
        height: 12,
        scale: 3,
        frames: [
            // Low
            [
                ['t','t','wallDark','wallDark','wallDark','wallDark','t','t'],
                ['t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t'],
                ['t','wallDark','t','t','t','t','wallDark','t'],
                ['t','wallDark','t','t','t','t','wallDark','t'],
                ['t','wallDark','t','t','t','t','wallDark','t'],
                ['t','wallDark','t','t','t','t','wallDark','t'],
                ['t','wallDark','t','t','t','t','wallDark','t'],
                ['t','wallDark','t','t','t','t','wallDark','t'],
                ['t','wallDark','error','error','error','error','wallDark','t'],
                ['t','wallDark','error','error','error','error','wallDark','t'],
                ['t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t'],
                ['t','t','t','t','t','t','t','t']
            ],
            // Full
            [
                ['t','t','wallDark','wallDark','wallDark','wallDark','t','t'],
                ['t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t'],
                ['t','wallDark','success','success','success','success','wallDark','t'],
                ['t','wallDark','success','success','success','success','wallDark','t'],
                ['t','wallDark','success','success','success','success','wallDark','t'],
                ['t','wallDark','success','success','success','success','wallDark','t'],
                ['t','wallDark','success','success','success','success','wallDark','t'],
                ['t','wallDark','success','success','success','success','wallDark','t'],
                ['t','wallDark','success','success','success','success','wallDark','t'],
                ['t','wallDark','success','success','success','success','wallDark','t'],
                ['t','wallDark','wallDark','wallDark','wallDark','wallDark','wallDark','t'],
                ['t','t','t','t','t','t','t','t']
            ]
        ]
    },

    trophy: {
        width: 10,
        height: 10,
        scale: 2,
        pixels: [
            ['door','door','door','door','door','door','door','door','door','door'],
            ['t','door','door','door','door','door','door','door','door','t'],
            ['t','door','door','door','door','door','door','door','door','t'],
            ['t','t','door','door','door','door','door','door','t','t'],
            ['t','t','t','door','door','door','door','t','t','t'],
            ['t','t','t','door','door','door','door','t','t','t'],
            ['t','t','t','t','door','door','t','t','t','t'],
            ['t','t','t','t','door','door','t','t','t','t'],
            ['t','t','door','door','door','door','door','door','t','t'],
            ['t','t','door','door','door','door','door','door','t','t']
        ]
    }
};

// ═══════════════════════════════════════════════════════════════
// PIXEL ART RENDERER
// ═══════════════════════════════════════════════════════════════

const PixelRenderer = {
    /**
     * Convert sprite data to CSS box-shadow string
     */
    toBoxShadow(sprite, frameIndex = 0) {
        const palette = PIXEL_SPRITES.palette;
        const pixels = sprite.frames ? sprite.frames[frameIndex] : sprite.pixels;
        const scale = sprite.scale || 1;
        const shadows = [];

        pixels.forEach((row, y) => {
            row.forEach((colorKey, x) => {
                if (colorKey !== 't') {
                    const color = palette[colorKey] || colorKey;
                    shadows.push(`${x * scale}px ${y * scale}px 0 ${color}`);
                }
            });
        });

        return shadows.join(', ');
    },

    /**
     * Create a DOM element with pixel art
     */
    createElement(spriteName, frameIndex = 0, className = '') {
        const sprite = PIXEL_SPRITES[spriteName];
        if (!sprite) {
            console.error(`Sprite "${spriteName}" not found`);
            return null;
        }

        const el = document.createElement('div');
        el.className = `pixel-sprite ${className}`.trim();
        el.style.width = `${sprite.scale || 1}px`;
        el.style.height = `${sprite.scale || 1}px`;
        el.style.boxShadow = this.toBoxShadow(sprite, frameIndex);
        el.dataset.sprite = spriteName;
        el.dataset.frame = frameIndex;

        return el;
    },

    /**
     * Update sprite frame (for animation)
     */
    updateFrame(element, frameIndex) {
        const spriteName = element.dataset.sprite;
        const sprite = PIXEL_SPRITES[spriteName];
        if (sprite && sprite.frames) {
            element.style.boxShadow = this.toBoxShadow(sprite, frameIndex);
            element.dataset.frame = frameIndex;
        }
    },

    /**
     * Get sprite dimensions in actual pixels
     */
    getDimensions(spriteName) {
        const sprite = PIXEL_SPRITES[spriteName];
        if (!sprite) return { width: 0, height: 0 };
        const scale = sprite.scale || 1;
        return {
            width: sprite.width * scale,
            height: sprite.height * scale
        };
    }
};

// Export for use in terminal-game.js
window.PIXEL_SPRITES = PIXEL_SPRITES;
window.PixelRenderer = PixelRenderer;

console.log('Pixel Sprites loaded');
