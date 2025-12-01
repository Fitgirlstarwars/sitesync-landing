/**
 * SITESYNC INTEGRATED TERMINAL v4.0
 * Cinematic Story Mode Only
 */

class SiteSyncTerminal {
    constructor() {
        this.overlay = null;
        this.window = null;
        this.body = null;
        
        this.isPaused = false;
        this.abortController = null;
    }

    // ─────────────────────────────────────────────────────────────
    // INITIALIZATION
    // ─────────────────────────────────────────────────────────────

    init() {
        if (document.querySelector('.terminal-overlay')) return;

        const html = `
            <div class="terminal-overlay">
                <div class="terminal-window">
                    <div class="terminal-header">
                        <span id="term-title">SITESYNC_TERMINAL_V4.0</span>
                        <div class="terminal-controls">
                            <div class="term-btn term-min"></div>
                            <div class="term-btn term-max"></div>
                            <div class="term-btn term-close"></div>
                        </div>
                    </div>
                    
                    <div class="terminal-body" id="term-body">
                        <!-- Content injected here -->
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        
        // Elements
        this.overlay = document.querySelector('.terminal-overlay');
        this.window = document.querySelector('.terminal-window');
        this.body = document.getElementById('term-body');

        // Binds
        this.bindEvents();
    }

    bindEvents() {
        this.overlay.querySelector('.term-close').addEventListener('click', () => this.close());
        
        // Close on backdrop click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });
    }

    open() {
        if (!this.overlay) this.init();
        this.overlay.classList.add('open');
        this.startCinematic();
    }

    close() {
        this.overlay.classList.remove('open');
        this.stopCinematic(); // Stop any running demo
    }

    // ─────────────────────────────────────────────────────────────
    // LAUNCHER (Main Menu)
    // ─────────────────────────────────────────────────────────────



    // ─────────────────────────────────────────────────────────────
    // CINEMATIC MODE (The "Text Story")
    // ─────────────────────────────────────────────────────────────

    async startCinematic() {
        this.body.innerHTML = '';
        this.abortController = new AbortController();
        
        const script = [
            {
                lines: [
                    { text: "", pause: 100 },
                    { text: "THE PROBLEM:", style: "highlight" },
                    { text: "Every time a contractor leaves, your building loses its memory.", pause: 800 },
                    { text: "Critical knowledge stays with the service provider.", pause: 1500 }
                ]
            },
            {
                lines: [
                    { text: "", pause: 500 },
                    { text: "THE SOLUTION:", style: "success" },
                    { text: "One platform connecting Buildings, Trades, and AI.", pause: 1000 },
                    { text: "1. PERMANENT MEMORY", style: "info" },
                    { text: "   Data stays with the building, forever." },
                    { text: "2. SHARED INTELLIGENCE", style: "info" },
                    { text: "   When one technician solves a problem, the entire network learns." },
                    { text: "3. TOTAL OVERSIGHT", style: "info" },
                    { text: "   Command the pulse of your building. Every trade, every asset, every moment.", pause: 2000 }
                ]
            },
            {
                lines: [
                    { text: "", pause: 500 },
                    { text: "Your Building. Your Data.", style: "accent", pause: 1000 }
                ]
            },

            {
                custom: () => {
                    const container = document.createElement('div');
                    container.className = 'keycap-container';
                    
                    const btn = document.createElement('div');
                    btn.className = 'keycap-btn';
                    
                    const span = document.createElement('span');
                    span.textContent = 'ESC';
                    
                    btn.appendChild(span);
                    btn.onclick = () => this.close();
                    
                    container.appendChild(btn);
                    this.body.appendChild(container);
                }
            }
        ];


        try {
            for (const scene of script) {
                if (scene.text) {
                    await this.typeLine(scene.text, scene.style || '', scene.speed || 30);
                    await this.wait(scene.pause || 0);
                }
                
                if (scene.lines) {
                    for (const line of scene.lines) {
                        if (line.custom) {
                            line.custom();
                        } else {
                            await this.typeLine(line.text, line.style || '', line.speed || 30);
                            await this.wait(line.pause || 300);
                        }
                    }
                }

                if (scene.custom) {
                    scene.custom();
                }
            }
        } catch (e) {
            if (e.name !== 'AbortError') console.error(e);
        }
    }

    stopCinematic() {
        if (this.abortController) this.abortController.abort();
    }

    // ─────────────────────────────────────────────────────────────
    // UTILS
    // ─────────────────────────────────────────────────────────────

    printLine(text, style = '') {
        const div = document.createElement('div');
        div.className = `terminal-line ${style}`;
        div.textContent = text;
        this.body.appendChild(div);
        this.body.scrollTop = this.body.scrollHeight;
    }

    async typeLine(text, style = '', speed = 30) {
        const div = document.createElement('div');
        div.className = `terminal-line ${style}`;
        this.body.appendChild(div);
        
        for (let i = 0; i < text.length; i++) {
            if (this.abortController && this.abortController.signal.aborted) throw new Error('AbortError');
            div.textContent += text[i];
            this.body.scrollTop = this.body.scrollHeight;
            await new Promise(r => setTimeout(r, speed));
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Init
window.siteSyncTerminal = new SiteSyncTerminal();
console.log("SiteSync Terminal v4.0 loaded");
