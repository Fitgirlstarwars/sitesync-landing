// SiteSync Industrial Logic v2.0
// Award-winning animation techniques

// Check for reduced motion preference FIRST
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// 1. LENIS SMOOTH SCROLL
// ============================================
let lenis;

if (!prefersReducedMotion) {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

gsap.registerPlugin(ScrollTrigger);

// ============================================
// 2. SPLIT TEXT ANIMATION (Hero)
// ============================================
function splitTextIntoSpans(element) {
    const text = element.textContent;
    element.innerHTML = '';

    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100px) rotateX(-90deg)';
        span.className = 'char';
        element.appendChild(span);
    });

    return element.querySelectorAll('.char');
}

// Split the hero text into lines, then animate each line
const heroLines = document.querySelectorAll('.massive-type');
heroLines.forEach(line => {
    const text = line.innerHTML;
    const lines = text.split('<br>');
    line.innerHTML = '';

    lines.forEach((lineText, lineIndex) => {
        const lineWrapper = document.createElement('div');
        lineWrapper.className = 'line-wrapper';
        lineWrapper.style.overflow = 'hidden';
        lineWrapper.style.display = 'block';

        const lineInner = document.createElement('span');
        lineInner.className = 'line-inner';
        lineInner.textContent = lineText.trim();
        lineInner.style.display = 'inline-block';

        lineWrapper.appendChild(lineInner);
        line.appendChild(lineWrapper);
    });
});

// Animate hero lines
if (!prefersReducedMotion) {
    gsap.from(".line-inner", {
        y: "100%",
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.15,
        delay: 0.3
    });

    // Hero subtitle animation
    gsap.from(".hero-sub", {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.9
    });

    // Specs counter animation
    gsap.from(".specs span", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 1.2,
        ease: "power2.out"
    });
} else {
    // No animation, just show content
    document.querySelectorAll('.line-inner, .hero-sub, .specs span').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

// ============================================
// 3. SECTION HEADER REVEAL
// ============================================
if (!prefersReducedMotion) {
    gsap.utils.toArray(".section-header h2").forEach((header) => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
}

// ============================================
// 4. BAUHAUS GRID - STAGGERED 3D REVEAL
// ============================================
if (!prefersReducedMotion) {
    const gridItems = gsap.utils.toArray(".grid-item");

    gsap.set(gridItems, {
        transformPerspective: 1000,
        transformOrigin: "center bottom"
    });

    gsap.from(gridItems, {
        scrollTrigger: {
            trigger: ".bauhaus-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        rotationX: -15,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
}

// ============================================
// 5. TIMELINE - PROGRESSIVE REVEAL
// ============================================
if (!prefersReducedMotion) {
    // Animate the vertical line growing
    gsap.from(".line", {
        scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 70%",
            end: "bottom 50%",
            scrub: 1
        },
        scaleY: 0,
        transformOrigin: "top center"
    });

    // Steps with enhanced animation - ensure visibility first
    gsap.set(".step", { opacity: 1 });
    gsap.set(".step-number", { opacity: 1, scale: 1 });

    gsap.utils.toArray(".step").forEach((step, i) => {
        const stepNumber = step.querySelector('.step-number');
        const stepContent = step.querySelector('.step-content');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: step,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        tl.from(stepNumber, {
            scale: 0.5,
            rotation: -90,
            duration: 0.5,
            ease: "back.out(1.7)"
        })
        .from(stepContent, {
            x: 30,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.2");
    });
} else {
    // Ensure visibility without animation
    gsap.set(".step, .step-number", { opacity: 1 });
}

// ============================================
// 6. SPLIT SECTION - ENHANCED PARALLAX
// ============================================
if (!prefersReducedMotion) {
    // Left side moves slower (creates depth)
    gsap.to(".concrete-side", {
        scrollTrigger: {
            trigger: ".users-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
        },
        backgroundPosition: "50% 100%",
        ease: "none"
    });

    // Right side moves faster
    gsap.to(".wood-side", {
        scrollTrigger: {
            trigger: ".users-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5
        },
        backgroundPosition: "50% 0%",
        ease: "none"
    });

    // Content reveal on each side
    gsap.utils.toArray(".side-content").forEach((content) => {
        gsap.from(content, {
            scrollTrigger: {
                trigger: content,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 80,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
}

// ============================================
// 7. NAVIGATION - MORPHING HEADER
// ============================================
const nav = document.querySelector('.steel-nav');
let navScrolled = false;

if (!prefersReducedMotion) {
    ScrollTrigger.create({
        start: "top -50",
        onUpdate: (self) => {
            if (self.scroll() > 50 && !navScrolled) {
                navScrolled = true;
                gsap.to(nav, {
                    height: '60px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
                    duration: 0.4,
                    ease: "power2.out"
                });
                gsap.to(".brand, .nav-links a", {
                    color: '#1a1a1a',
                    duration: 0.3
                });
            } else if (self.scroll() <= 50 && navScrolled) {
                navScrolled = false;
                gsap.to(nav, {
                    height: '80px',
                    backgroundColor: 'var(--steel-bg)',
                    backdropFilter: 'blur(0px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    duration: 0.4,
                    ease: "power2.out"
                });
                gsap.to(".brand, .nav-links a", {
                    color: '#f4f4f4',
                    duration: 0.3
                });
            }
        }
    });
}

// ============================================
// 8. BUTTON HOVER MICRO-INTERACTIONS
// ============================================
if (!prefersReducedMotion) {
    // CTA Button magnetic effect
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('mouseenter', () => {
            gsap.to(ctaBtn, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        ctaBtn.addEventListener('mouseleave', () => {
            gsap.to(ctaBtn, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }

    // Ghost buttons pulse effect
    document.querySelectorAll('.ghost-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.02,
                boxShadow: "0 0 30px rgba(230, 81, 0, 0.3)",
                duration: 0.3,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                boxShadow: "0 0 0px rgba(230, 81, 0, 0)",
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// ============================================
// 9. GRID OVERLAY PARALLAX
// ============================================
if (!prefersReducedMotion) {
    gsap.to(".grid-overlay", {
        scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        backgroundPosition: "0 100px",
        opacity: 0.3,
        ease: "none"
    });
}

// ============================================
// 10. FOOTER REVEAL
// ============================================
if (!prefersReducedMotion) {
    gsap.from(".footer-top", {
        scrollTrigger: {
            trigger: ".industrial-footer",
            start: "top 95%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    gsap.from(".footer-bottom", {
        scrollTrigger: {
            trigger: ".industrial-footer",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out"
    });
}

// ============================================
// 11. ICON BOX PULSE (On Scroll)
// ============================================
if (!prefersReducedMotion) {
    document.querySelectorAll('.icon-box').forEach(icon => {
        gsap.to(icon, {
            scrollTrigger: {
                trigger: icon,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            keyframes: [
                { scale: 1.2, duration: 0.2 },
                { scale: 1, duration: 0.3 }
            ],
            ease: "power2.out"
        });
    });
}

// ============================================
// 12. STATS COUNTER ANIMATION
// ============================================
if (!prefersReducedMotion) {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.target);

        ScrollTrigger.create({
            trigger: stat,
            start: "top 80%",
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
}

// ============================================
// 13. TESTIMONIALS REVEAL
// ============================================
if (!prefersReducedMotion) {
    gsap.from(".testimonial-card", {
        scrollTrigger: {
            trigger: ".testimonials-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });
}

// ============================================
// 14. CTA SECTION REVEAL
// ============================================
if (!prefersReducedMotion) {
    gsap.from(".cta-content", {
        scrollTrigger: {
            trigger: ".cta-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".lead-form", {
        scrollTrigger: {
            trigger: ".cta-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out"
    });
}

// ============================================
// 15. SOCIAL PROOF PAUSE ON HOVER
// ============================================
const logoTrack = document.querySelector('.logo-track');
if (logoTrack) {
    logoTrack.addEventListener('mouseenter', () => {
        logoTrack.style.animationPlayState = 'paused';
    });
    logoTrack.addEventListener('mouseleave', () => {
        logoTrack.style.animationPlayState = 'running';
    });
}

// ============================================
// 16. MOBILE HAMBURGER MENU
// ============================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded',
            hamburger.classList.contains('active') ? 'true' : 'false'
        );
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

console.log('SiteSync v2.0 loaded | Smooth scroll:', !prefersReducedMotion);

// ============================================
// 17. TERMINAL TOGGLE
// ============================================
const terminalBtn = document.querySelector('.cta-btn');
if (terminalBtn) {
    terminalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.siteSyncTerminal) {
            window.siteSyncTerminal.open();
        }
    });
}
