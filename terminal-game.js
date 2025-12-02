/**
 * SITESYNC TERMINAL GAME
 * Mario/Game Boy style pixel art experience
 * Tells the SiteSync story through animated scenes
 */

class TerminalGame {
    constructor(container) {
        this.container = container;
        this.currentScene = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.abortController = null;

        this.scenes = [
            this.sceneProblem,
            this.sceneChaos,
            this.sceneSiteSync,
            this.sceneNetwork,
            this.sceneVictory
        ];
    }

    // ═══════════════════════════════════════════════════════════════
    // CORE ENGINE
    // ═══════════════════════════════════════════════════════════════

    async start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.currentScene = 0;
        this.abortController = new AbortController();

        // Initialize game container
        this.container.innerHTML = '';
        this.container.classList.add('terminal-game');

        // Create game wrapper
        this.gameWrapper = document.createElement('div');
        this.gameWrapper.className = 'game-scene';
        this.container.appendChild(this.gameWrapper);

        // Create progress indicator
        this.createProgressIndicator();

        // Play all scenes
        try {
            for (let i = 0; i < this.scenes.length; i++) {
                this.currentScene = i;
                this.updateProgress();
                await this.scenes[i].call(this);

                // Wait for click to continue (except last scene)
                if (i < this.scenes.length - 1) {
                    await this.waitForClick();
                }
            }
        } catch (e) {
            if (e.message !== 'GameAborted') {
                console.error('Game error:', e);
            }
        }

        this.isPlaying = false;
    }

    stop() {
        if (this.abortController) {
            this.abortController.abort();
        }
        this.isPlaying = false;
        this.container.innerHTML = '';
        this.container.classList.remove('terminal-game');
    }

    // ═══════════════════════════════════════════════════════════════
    // SCENE 1: THE PROBLEM
    // ═══════════════════════════════════════════════════════════════

    async sceneProblem() {
        await this.clearScene();

        // Create stage
        const stage = this.createStage();

        // Add building
        const building = this.createSprite('building');
        building.style.position = 'relative';
        building.style.left = '-40px';
        stage.appendChild(building);

        // Add worker with briefcase
        const worker = this.createSprite('workerWithBriefcase', 0);
        worker.style.position = 'relative';
        worker.style.left = '60px';
        worker.classList.add('sprite-slide-left');
        stage.appendChild(worker);

        this.gameWrapper.appendChild(stage);

        // Add question marks floating above
        await this.sleep(300);
        const questionMark = this.createSprite('questionMark');
        questionMark.style.position = 'absolute';
        questionMark.style.top = '20px';
        questionMark.style.left = '50%';
        questionMark.style.transform = 'translateX(-50%)';
        questionMark.classList.add('sprite-floating');
        stage.appendChild(questionMark);

        // Create text container
        const textContainer = this.createTextContainer();
        this.gameWrapper.appendChild(textContainer);

        // Typewriter text
        await this.typeText(textContainer, 'THE PROBLEM:', 'error', 40);
        await this.sleep(500);

        // Animate worker walking away
        await this.animateWorkerLeaving(worker);

        await this.typeText(textContainer, 'When contractors leave...', 'text', 35);
        await this.sleep(400);
        await this.typeText(textContainer, 'your building loses its memory.', 'text', 35);

        // Add click to continue
        this.addClickToContinue();
    }

    async animateWorkerLeaving(worker) {
        return new Promise(resolve => {
            let frame = 0;
            let position = 60;
            const walkInterval = setInterval(() => {
                // Update frame
                frame = (frame + 1) % 2;
                if (window.PixelRenderer && window.PIXEL_SPRITES.workerWithBriefcase) {
                    worker.style.boxShadow = window.PixelRenderer.toBoxShadow(
                        window.PIXEL_SPRITES.workerWithBriefcase,
                        frame
                    );
                }

                // Move right
                position += 3;
                worker.style.left = position + 'px';

                // Check if off screen
                if (position > 200) {
                    clearInterval(walkInterval);
                    worker.style.opacity = '0';
                    resolve();
                }
            }, 150);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // SCENE 2: CHAOS
    // ═══════════════════════════════════════════════════════════════

    async sceneChaos() {
        await this.fadeOutScene();
        await this.clearScene();

        // Create stage with 3 buildings
        const stage = this.createStage();
        stage.style.justifyContent = 'space-around';

        // Three small buildings
        const buildings = [];
        for (let i = 0; i < 3; i++) {
            const building = this.createSprite('buildingSmall');
            building.style.position = 'relative';
            building.style.opacity = '0';
            buildings.push(building);
            stage.appendChild(building);
        }

        this.gameWrapper.appendChild(stage);

        // Animate buildings appearing
        for (let i = 0; i < buildings.length; i++) {
            await this.sleep(200);
            buildings[i].style.opacity = '1';
            buildings[i].classList.add('sprite-grow-in');
        }

        // Add broken connection lines
        await this.sleep(400);
        this.addBrokenConnections(stage, buildings);

        // Add lightning bolts
        for (let i = 0; i < 2; i++) {
            const lightning = this.createSprite('lightning');
            lightning.style.position = 'absolute';
            lightning.style.top = '30px';
            lightning.style.left = `${30 + i * 40}%`;
            lightning.classList.add('sprite-shake');
            lightning.style.animationDelay = `${i * 0.1}s`;
            stage.appendChild(lightning);
        }

        // Create text container
        const textContainer = this.createTextContainer();
        this.gameWrapper.appendChild(textContainer);

        // Typewriter text
        await this.typeText(textContainer, 'CHAOS:', 'error', 40);
        await this.sleep(300);
        await this.typeText(textContainer, 'Every building an island.', 'text', 35);
        await this.sleep(300);
        await this.typeText(textContainer, 'Every problem solved from scratch.', 'text', 35);

        this.addClickToContinue();
    }

    addBrokenConnections(stage, buildings) {
        // Add dashed lines between buildings
        const line1 = document.createElement('div');
        line1.className = 'broken-connection';
        line1.style.left = '28%';
        line1.style.bottom = '50px';
        line1.style.width = '60px';
        stage.appendChild(line1);

        const line2 = document.createElement('div');
        line2.className = 'broken-connection';
        line2.style.left = '55%';
        line2.style.bottom = '50px';
        line2.style.width = '60px';
        stage.appendChild(line2);
    }

    // ═══════════════════════════════════════════════════════════════
    // SCENE 3: SITESYNC ARRIVES
    // ═══════════════════════════════════════════════════════════════

    async sceneSiteSync() {
        await this.fadeOutScene();
        await this.clearScene();

        // Create stage
        const stage = this.createStage();
        stage.style.justifyContent = 'center';
        stage.style.alignItems = 'center';
        stage.style.height = '180px';

        this.gameWrapper.appendChild(stage);

        // Wait a moment for dramatic effect
        await this.sleep(500);

        // Drop in logo with bounce
        const logo = this.createSprite('logo');
        logo.style.position = 'relative';
        logo.classList.add('sprite-drop-in');
        stage.appendChild(logo);

        // Wait for drop animation
        await this.sleep(800);

        // Add sparkle particles around logo
        this.addSparkles(stage);

        // Create text container
        const textContainer = this.createTextContainer();
        this.gameWrapper.appendChild(textContainer);

        // Epic reveal text
        await this.typeText(textContainer, 'SITESYNC', 'accent', 60);
        await this.sleep(400);
        await this.typeText(textContainer, 'connects everything.', 'success', 40);

        // Short auto-advance for dramatic effect
        await this.sleep(2000);
    }

    addSparkles(stage) {
        const positions = [
            { top: '20px', left: '20%' },
            { top: '40px', right: '25%' },
            { top: '80px', left: '15%' },
            { top: '60px', right: '15%' },
            { bottom: '40px', left: '30%' },
            { bottom: '30px', right: '20%' }
        ];

        positions.forEach((pos, i) => {
            const sparkle = this.createSprite('sparkle');
            sparkle.className = 'pixel-sprite sparkle-particle';
            Object.assign(sparkle.style, pos);
            sparkle.style.animationDelay = `${i * 0.2}s`;
            stage.appendChild(sparkle);
        });
    }

    // ═══════════════════════════════════════════════════════════════
    // SCENE 4: THE NETWORK
    // ═══════════════════════════════════════════════════════════════

    async sceneNetwork() {
        await this.fadeOutScene();
        await this.clearScene();

        // Create stage
        const stage = this.createStage();
        stage.className = 'game-stage network-container';
        stage.style.justifyContent = 'space-around';
        stage.style.alignItems = 'flex-end';
        stage.style.paddingBottom = '20px';

        // Three buildings with connections
        const buildings = [];
        for (let i = 0; i < 3; i++) {
            const building = this.createSprite('buildingSmall');
            building.style.position = 'relative';
            buildings.push(building);
            stage.appendChild(building);
        }

        this.gameWrapper.appendChild(stage);

        // Animate buildings appearing
        for (let i = 0; i < buildings.length; i++) {
            await this.sleep(150);
            buildings[i].classList.add('sprite-slide-left');
        }

        await this.sleep(500);

        // Add glowing connection lines
        this.addConnectionLines(stage);

        // Add AI brain in center
        await this.sleep(400);
        const brain = this.createSprite('aiBrain');
        brain.style.position = 'absolute';
        brain.style.top = '30px';
        brain.style.left = '50%';
        brain.style.transform = 'translateX(-50%)';
        brain.classList.add('sprite-grow-in');
        stage.appendChild(brain);

        // Add flowing data packets
        await this.sleep(500);
        this.addDataFlow(stage);

        // Create text container
        const textContainer = this.createTextContainer();
        this.gameWrapper.appendChild(textContainer);

        // Typewriter text
        await this.typeText(textContainer, 'THE NETWORK:', 'success', 40);
        await this.sleep(300);
        await this.typeText(textContainer, 'Buildings. Trades. AI.', 'info', 35);
        await this.sleep(200);
        await this.typeText(textContainer, 'One Platform.', 'accent', 40);

        this.addClickToContinue();
    }

    addConnectionLines(stage) {
        // Draw lines between buildings and to center
        const lines = [
            { left: '20%', bottom: '60px', width: '60%', transform: 'none' },
            { left: '35%', bottom: '60px', height: '50px', width: '4px' },
            { left: '65%', bottom: '60px', height: '50px', width: '4px' }
        ];

        lines.forEach((style, i) => {
            const line = document.createElement('div');
            line.className = 'connection-line';
            line.style.position = 'absolute';
            Object.assign(line.style, style);
            line.style.opacity = '0';
            line.style.animation = `fadeIn 0.3s ease ${i * 0.1}s forwards`;
            stage.appendChild(line);
        });
    }

    addDataFlow(stage) {
        // Create animated data packets flowing between buildings
        const createPacket = (startX, endX, delay) => {
            const packet = this.createSprite('dataPacket');
            packet.className = 'pixel-sprite data-packet';
            packet.style.position = 'absolute';
            packet.style.bottom = '65px';
            packet.style.left = startX + '%';
            packet.style.setProperty('--flow-distance', (endX - startX) * 3 + 'px');
            packet.style.animationDelay = delay + 's';
            stage.appendChild(packet);
        };

        // Create multiple packets flowing
        createPacket(22, 48, 0);
        createPacket(52, 78, 0.5);
        createPacket(78, 52, 1);
        createPacket(48, 22, 1.5);
    }

    // ═══════════════════════════════════════════════════════════════
    // SCENE 5: VICTORY
    // ═══════════════════════════════════════════════════════════════

    async sceneVictory() {
        await this.fadeOutScene();
        await this.clearScene();

        // Create stage
        const stage = this.createStage();
        stage.style.justifyContent = 'center';
        stage.style.alignItems = 'center';

        // Happy building (with lit windows)
        const building = this.createSprite('buildingHappy');
        building.style.position = 'relative';
        building.classList.add('sprite-drop-in');
        stage.appendChild(building);

        this.gameWrapper.appendChild(stage);

        await this.sleep(600);

        // Add health bar
        const healthBar = this.createHealthBar();
        stage.appendChild(healthBar);

        // Animate health bar filling
        await this.sleep(300);
        healthBar.querySelector('.health-bar-fill').style.width = '100%';

        // Add checkmark
        await this.sleep(800);
        const checkmark = this.createSprite('checkmark');
        checkmark.style.position = 'absolute';
        checkmark.style.top = '10px';
        checkmark.style.right = '30%';
        checkmark.classList.add('sprite-grow-in');
        stage.appendChild(checkmark);

        // Add confetti
        await this.sleep(400);
        this.addConfetti(stage);

        // Create text container
        const textContainer = this.createTextContainer();
        this.gameWrapper.appendChild(textContainer);

        // Victory text
        await this.typeText(textContainer, 'YOUR BUILDING.', 'accent', 50);
        await this.sleep(300);
        await this.typeText(textContainer, 'YOUR DATA.', 'success', 50);
        await this.sleep(300);
        await this.typeText(textContainer, 'FOREVER.', 'info', 60);

        // Add CTA button
        await this.sleep(800);
        this.addCTAButton();
    }

    createHealthBar() {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.bottom = '10px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';

        container.innerHTML = `
            <div class="health-bar">
                <div class="health-bar-label">HEALTH: 100%</div>
                <div class="health-bar-fill"></div>
            </div>
        `;

        return container;
    }

    addConfetti(stage) {
        const colors = ['#f0883e', '#3fb950', '#58a6ff', '#f85149', '#e6edf3'];

        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle';
            confetti.style.position = 'absolute';
            confetti.style.top = '0';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (1.5 + Math.random()) + 's';
            stage.appendChild(confetti);
        }
    }

    addCTAButton() {
        const button = document.createElement('button');
        button.className = 'game-cta';
        button.textContent = 'START YOUR JOURNEY';
        button.addEventListener('click', () => {
            // Close terminal and scroll to CTA or open demo
            if (window.siteSyncTerminal) {
                window.siteSyncTerminal.close();
            }
            // Scroll to demo section
            const demoSection = document.querySelector('.hero-buttons') ||
                               document.querySelector('#demo');
            if (demoSection) {
                demoSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        this.gameWrapper.appendChild(button);
    }

    // ═══════════════════════════════════════════════════════════════
    // UTILITY METHODS
    // ═══════════════════════════════════════════════════════════════

    createStage() {
        const stage = document.createElement('div');
        stage.className = 'game-stage';

        // Add ground
        const ground = document.createElement('div');
        ground.className = 'game-ground';
        stage.appendChild(ground);

        return stage;
    }

    createTextContainer() {
        const container = document.createElement('div');
        container.className = 'game-text-container';
        return container;
    }

    createSprite(spriteName, frameIndex = 0) {
        if (window.PixelRenderer) {
            return window.PixelRenderer.createElement(spriteName, frameIndex);
        }

        // Fallback if PixelRenderer not loaded
        const el = document.createElement('div');
        el.className = 'pixel-sprite';
        el.dataset.sprite = spriteName;
        return el;
    }

    async typeText(container, text, style = '', speed = 30) {
        const line = document.createElement('div');
        line.className = `game-text ${style}`;
        container.appendChild(line);

        // Add cursor
        const cursor = document.createElement('span');
        cursor.className = 'game-cursor';
        line.appendChild(cursor);

        for (let i = 0; i < text.length; i++) {
            if (this.abortController?.signal.aborted) {
                throw new Error('GameAborted');
            }

            // Insert character before cursor
            line.insertBefore(document.createTextNode(text[i]), cursor);
            await this.sleep(speed);
        }

        // Remove cursor after typing
        cursor.remove();
    }

    async clearScene() {
        this.gameWrapper.innerHTML = '';
    }

    async fadeOutScene() {
        this.gameWrapper.classList.add('fade-out');
        await this.sleep(400);
        this.gameWrapper.classList.remove('fade-out');
    }

    createProgressIndicator() {
        const progress = document.createElement('div');
        progress.className = 'game-progress';

        for (let i = 0; i < this.scenes.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            progress.appendChild(dot);
        }

        this.progressIndicator = progress;
        this.container.appendChild(progress);
    }

    updateProgress() {
        if (!this.progressIndicator) return;

        const dots = this.progressIndicator.querySelectorAll('.progress-dot');
        dots.forEach((dot, i) => {
            dot.classList.remove('active', 'complete');
            if (i < this.currentScene) {
                dot.classList.add('complete');
            } else if (i === this.currentScene) {
                dot.classList.add('active');
            }
        });
    }

    addClickToContinue() {
        const prompt = document.createElement('div');
        prompt.className = 'click-continue';
        prompt.textContent = 'CLICK TO CONTINUE';
        this.gameWrapper.appendChild(prompt);
    }

    async waitForClick() {
        return new Promise(resolve => {
            const handler = () => {
                this.container.removeEventListener('click', handler);
                resolve();
            };
            this.container.addEventListener('click', handler);
        });
    }

    sleep(ms) {
        return new Promise(resolve => {
            if (this.abortController?.signal.aborted) {
                throw new Error('GameAborted');
            }
            setTimeout(resolve, ms);
        });
    }
}

// Export for terminal integration
window.TerminalGame = TerminalGame;

console.log('Terminal Game Engine loaded');
