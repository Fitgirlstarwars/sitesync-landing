// SiteSync Pages Animation Logic
// For Buildings and Technicians pages

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// PAGE HERO ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
    // Hero badge entrance
    gsap.from(".hero-badge", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
    });

    // Page title reveal
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        const titleText = pageTitle.innerHTML;
        const titleLines = titleText.split('<br>');
        pageTitle.innerHTML = '';

        titleLines.forEach((lineText, lineIndex) => {
            const lineWrapper = document.createElement('div');
            lineWrapper.className = 'line-wrapper';
            lineWrapper.style.overflow = 'hidden';
            lineWrapper.style.display = 'block';

            const lineInner = document.createElement('span');
            lineInner.className = 'line-inner';
            lineInner.textContent = lineText.trim();
            lineInner.style.display = 'inline-block';

            lineWrapper.appendChild(lineInner);
            pageTitle.appendChild(lineWrapper);
        });

        gsap.from(".page-title .line-inner", {
            y: "100%",
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.15,
            delay: 0.4
        });
    }

    // Hero lead text
    gsap.from(".hero-lead", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.9
    });

    // Hero actions
    gsap.from(".hero-actions", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 1.2
    });

    // Scroll indicator
    gsap.from(".scroll-indicator", {
        opacity: 0,
        duration: 1,
        delay: 1.5
    });
}

// ============================================
// PROBLEM SECTION ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
    gsap.from(".problem-card", {
        scrollTrigger: {
            trigger: ".problem-grid",
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
// SOLUTION SECTION ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
    // Solution headline
    gsap.from(".solution-headline", {
        scrollTrigger: {
            trigger: ".solution-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".solution-text", {
        scrollTrigger: {
            trigger: ".solution-section",
            start: "top 65%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // Building diagram (buildings page)
    const buildingDiagram = document.querySelector('.building-diagram');
    if (buildingDiagram) {
        gsap.from(".building-core", {
            scrollTrigger: {
                trigger: ".building-diagram",
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            scale: 0,
            rotation: -180,
            duration: 1,
            ease: "back.out(1.7)"
        });

        gsap.from(".orbit-item", {
            scrollTrigger: {
                trigger: ".building-diagram",
                start: "top 70%",
                toggleActions: "play none none reverse"
            },
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        });
    }

    // Profile preview (technicians page)
    const profilePreview = document.querySelector('.profile-preview');
    if (profilePreview) {
        gsap.from(".profile-preview", {
            scrollTrigger: {
                trigger: ".profile-preview",
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from(".profile-stat", {
            scrollTrigger: {
                trigger: ".profile-preview",
                start: "top 70%",
                toggleActions: "play none none reverse"
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 0.3,
            ease: "power2.out"
        });

        gsap.from(".p-badge", {
            scrollTrigger: {
                trigger: ".profile-preview",
                start: "top 65%",
                toggleActions: "play none none reverse"
            },
            scale: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.5,
            ease: "back.out(1.7)"
        });
    }
}

// ============================================
// FLOW SECTION ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
    // Flow line grow
    gsap.from(".flow-line", {
        scrollTrigger: {
            trigger: ".flow-timeline",
            start: "top 70%",
            end: "bottom 50%",
            scrub: 1
        },
        scaleY: 0,
        transformOrigin: "top center"
    });

    // Flow steps
    gsap.utils.toArray(".flow-step").forEach((step, i) => {
        const flowNumber = step.querySelector('.flow-number');
        const flowContent = step.querySelector('.flow-content');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: step,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        tl.from(flowNumber, {
            scale: 0,
            rotation: -90,
            duration: 0.6,
            ease: "back.out(1.7)"
        })
        .from(flowContent, {
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.3");
    });
}

// ============================================
// FEATURES SECTION ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    });
}

// ============================================
// COMMUNITY SECTION ANIMATIONS (Technicians)
// ============================================
if (!prefersReducedMotion) {
    const communitySection = document.querySelector('.community-section');
    if (communitySection) {
        gsap.from(".community-text h3", {
            scrollTrigger: {
                trigger: ".community-section",
                start: "top 70%",
                toggleActions: "play none none reverse"
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from(".cf-item", {
            scrollTrigger: {
                trigger: ".community-features",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out"
        });

        gsap.from(".feed-item", {
            scrollTrigger: {
                trigger: ".feed-preview",
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out"
        });
    }
}

// ============================================
// STATS SECTION ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
    const pageStatNumbers = document.querySelectorAll('.page-stats-section .stat-number');

    pageStatNumbers.forEach(stat => {
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

    gsap.from(".stat-card", {
        scrollTrigger: {
            trigger: ".page-stats-section .stats-grid",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });
}

// ============================================
// TESTIMONIAL SECTION ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
    gsap.from(".large-testimonial", {
        scrollTrigger: {
            trigger: ".page-testimonial-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
}

// ============================================
// CTA SECTION ANIMATIONS
// ============================================
if (!prefersReducedMotion) {
    gsap.from(".page-cta-section .cta-content", {
        scrollTrigger: {
            trigger: ".page-cta-section",
            start: "top 75%",
            toggleActions: "play none none reverse"
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from(".page-cta-section .lead-form", {
        scrollTrigger: {
            trigger: ".page-cta-section",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
}

// ============================================
// SCROLL INDICATOR FADE ON SCROLL
// ============================================
if (!prefersReducedMotion) {
    gsap.to(".scroll-indicator", {
        scrollTrigger: {
            trigger: ".page-hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        opacity: 0,
        y: -20
    });
}

console.log('SiteSync Pages JS loaded');
