// ============================================
// PLATFORM.JS - Advanced Ecosystem Animations
// Techniques: SVG line drawing, sticky scroll, node activation
// ============================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// HERO ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
    gsap.from(".hero-badge", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
    });

    gsap.from(".platform-title .line-inner", {
        y: "100%",
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.2,
        delay: 0.4
    });

    gsap.from(".platform-hero .hero-lead", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1
    });

    gsap.from(".platform-hero .scroll-indicator", {
        opacity: 0,
        duration: 1,
        delay: 1.5
    });
}

// ============================================
// SVG LINE DRAWING SETUP
// ============================================
const connectionLines = document.querySelectorAll('.connection-line');
const lineLengths = {};

connectionLines.forEach(line => {
    const length = line.getTotalLength();
    lineLengths[line.classList[1]] = length;
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
});

// ============================================
// ECOSYSTEM PINNED SCROLL ANIMATION
// ============================================
if (!prefersReducedMotion) {
    const ecosystemSection = document.querySelector('.ecosystem-section');
    const diagramGrid = document.querySelector('.diagram-grid');
    const nodes = {
        building: document.querySelector('.node-building'),
        technician: document.querySelector('.node-technician'),
        core: document.querySelector('.node-core'),
        ai: document.querySelector('.node-ai'),
        community: document.querySelector('.node-community')
    };
    const panels = document.querySelectorAll('.eco-panel');
    const particles = document.querySelector('.data-particles');
    const progressFill = document.querySelector('.progress-fill');
    const markers = document.querySelectorAll('.marker');

    // Main ScrollTrigger for ecosystem section
    ScrollTrigger.create({
        trigger: ecosystemSection,
        start: "top top",
        end: "bottom bottom",
        pin: ".ecosystem-container",
        pinSpacing: false,
        onUpdate: (self) => {
            const progress = self.progress;
            updateEcosystem(progress);
            updateProgressIndicator(progress);
        }
    });

    function updateEcosystem(progress) {
        // Phase 1: 0-20% - Grid appears
        if (progress >= 0.05) {
            diagramGrid.classList.add('visible');
        }

        // Phase 2: 20-35% - Building node
        if (progress >= 0.15) {
            nodes.building.classList.add('active');
            drawLine('line-building-core', Math.min((progress - 0.15) / 0.15, 0.5));
        }
        activatePanel(progress < 0.15 ? 'intro' : progress < 0.30 ? 'building' : null);

        // Phase 3: 35-50% - Technician node
        if (progress >= 0.30) {
            nodes.technician.classList.add('active');
            drawLine('line-tech-core', Math.min((progress - 0.30) / 0.15, 0.5));
        }
        if (progress >= 0.30 && progress < 0.50) {
            activatePanel('technician');
        }

        // Phase 4: 50-70% - Core connects
        if (progress >= 0.50) {
            nodes.core.classList.add('active');
            // Complete the lines to core
            drawLine('line-building-core', 1);
            drawLine('line-tech-core', 1);
            drawLine('line-core-ai', Math.min((progress - 0.50) / 0.15, 1));
        }
        if (progress >= 0.50 && progress < 0.70) {
            activatePanel('core');
        }

        // Phase 5: 70-100% - AI, Community, full ecosystem
        if (progress >= 0.65) {
            nodes.ai.classList.add('active');
            drawLine('line-ai-community', Math.min((progress - 0.65) / 0.15, 1));
        }

        if (progress >= 0.75) {
            nodes.community.classList.add('active');
            particles.classList.add('active');
            drawLine('line-feedback-left', Math.min((progress - 0.75) / 0.20, 1));
            drawLine('line-feedback-right', Math.min((progress - 0.75) / 0.20, 1));
        }

        if (progress >= 0.70) {
            activatePanel('complete');
        }
    }

    function drawLine(lineClass, progress) {
        const line = document.querySelector('.' + lineClass);
        if (line && lineLengths[lineClass]) {
            const length = lineLengths[lineClass];
            line.style.strokeDashoffset = length * (1 - progress);
        }
    }

    function activatePanel(panelName) {
        panels.forEach(panel => {
            if (panel.dataset.panel === panelName) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    }

    function updateProgressIndicator(progress) {
        if (progressFill) {
            progressFill.style.height = (progress * 100) + '%';
        }

        const step = Math.min(Math.floor(progress * 5) + 1, 5);
        markers.forEach((marker, index) => {
            if (index < step) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }
}

// ============================================
// VIRTUOUS CYCLE ANIMATION
// ============================================
if (!prefersReducedMotion) {
    const cycleRing = document.querySelector('.cycle-ring-progress');
    const cycleSteps = document.querySelectorAll('.cycle-step');

    if (cycleRing) {
        // Continuous rotation animation
        let cycleProgress = 0;

        ScrollTrigger.create({
            trigger: ".cycle-section",
            start: "top 80%",
            end: "bottom 20%",
            onUpdate: (self) => {
                const ringLength = 942; // 2 * PI * 150
                cycleRing.style.strokeDashoffset = ringLength * (1 - self.progress);

                // Activate steps based on progress
                const activeStep = Math.floor(self.progress * 4);
                cycleSteps.forEach((step, index) => {
                    if (index <= activeStep) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active');
                    }
                });
            }
        });
    }
}

// ============================================
// IMPACT STATS COUNTER
// ============================================
if (!prefersReducedMotion) {
    const impactNumbers = document.querySelectorAll('.impact-number');

    impactNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);

        ScrollTrigger.create({
            trigger: stat,
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(stat, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    ease: "power2.out"
                });
            }
        });
    });

    // Impact cards reveal
    gsap.from(".impact-card", {
        scrollTrigger: {
            trigger: ".impact-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });
}

// ============================================
// CTA SECTION ANIMATION
// ============================================
if (!prefersReducedMotion) {
    gsap.from(".platform-cta h2, .platform-cta > .section-container > p", {
        scrollTrigger: {
            trigger: ".platform-cta",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    gsap.from(".cta-card", {
        scrollTrigger: {
            trigger: ".cta-buttons",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });
}

// ============================================
// SCROLL INDICATOR FADE
// ============================================
if (!prefersReducedMotion) {
    gsap.to(".platform-hero .scroll-indicator", {
        scrollTrigger: {
            trigger: ".platform-hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        opacity: 0,
        y: -20
    });
}

// ============================================
// NODE HOVER INTERACTIONS
// ============================================
const allNodes = document.querySelectorAll('.ecosystem-node');

allNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
            gsap.to(node.querySelector('.node-icon'), {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    node.addEventListener('mouseleave', () => {
        if (!prefersReducedMotion) {
            gsap.to(node.querySelector('.node-icon'), {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
});

// ============================================
// FALLBACK FOR REDUCED MOTION
// ============================================
if (prefersReducedMotion) {
    // Show all elements immediately
    document.querySelector('.diagram-grid')?.classList.add('visible');
    document.querySelectorAll('.ecosystem-node').forEach(node => {
        node.classList.add('active');
    });
    document.querySelectorAll('.connection-line').forEach(line => {
        line.style.strokeDashoffset = '0';
    });
    document.querySelector('.data-particles')?.classList.add('active');
    document.querySelector('.eco-panel[data-panel="complete"]')?.classList.add('active');
}

console.log('Platform.js loaded | Reduced motion:', prefersReducedMotion);
