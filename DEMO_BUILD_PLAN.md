# SiteSync Demo - Comprehensive Build Plan

> **Objective**: Build a world-class, production-ready demo that showcases SiteSync's "invisible AI" philosophy through a cinematic video demo and interactive exploration.

---

## Build Philosophy

### Guiding Principles
1. **Mobile-First**: iPhone 17 Pro as the reference device
2. **60fps Minimum**: All animations must be butter-smooth
3. **Invisible AI**: No AI jargon—just results that make users say "How did it know?"
4. **Industry-Accurate**: Real building management terminology
5. **Emotional Impact**: The "Building Remembers Forever" moment should create genuine realization

### Quality Gates
Each phase must pass before proceeding:
- ✅ Visual fidelity matches iOS 26 standards
- ✅ Animations run at 60fps on mid-tier devices
- ✅ No layout shifts or jank
- ✅ Accessible (keyboard, screen reader basics)
- ✅ Works in Chrome, Safari, Firefox, Edge

---

## Phase 1: Research & Competitive Analysis
**Duration**: Research phase
**Skills**: Web Research
**Output**: Research findings document

### 1.1 Product Demo Benchmarking
**Web Research Topics**:
- Best SaaS product demo videos 2025
- Interactive product demo examples (Navattic, Storylane, Walnut competitors)
- Apple keynote product reveal techniques
- Stripe, Linear, Notion demo patterns

### 1.2 Building Management Software Analysis
**Research**:
- BuildingLink demo experience
- Yardi Voyager interface patterns
- AppFolio property management UI
- MRI Software dashboard design

### 1.3 iOS 26 Design Patterns
**Research**:
- iOS 26 Human Interface Guidelines updates
- Dynamic Island interaction patterns
- Notification banner specifications
- SF Symbols usage in iOS 26

### 1.4 Animation Excellence Research
**Research**:
- GSAP showcase examples 2025
- Award-winning web animations (Awwwards, FWA)
- iOS native animation timing curves
- Reduced motion accessibility patterns

### Deliverables:
- [ ] Competitive analysis summary
- [ ] UI pattern library reference
- [ ] Animation timing reference sheet
- [ ] Accessibility checklist

---

## Phase 2: Design System Foundation
**Duration**: Foundation phase
**Skills**: `frontend-design`, `theme-factory`
**Output**: CSS custom properties, design tokens

### 2.1 Color System
```css
:root {
  /* Brand */
  --sitesync-orange: #e65100;
  --sitesync-orange-light: #ff6d00;
  --sitesync-orange-glow: rgba(230, 81, 0, 0.3);

  /* iOS System Colors */
  --ios-blue: #007aff;
  --ios-green: #30d158;
  --ios-yellow: #ffd60a;
  --ios-red: #ff453a;
  --ios-orange: #ff9500;

  /* Dark Mode Surfaces */
  --surface-base: #000000;
  --surface-elevated: #1c1c1e;
  --surface-elevated-2: #2c2c2e;
  --surface-elevated-3: #3a3a3c;

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-tertiary: rgba(255, 255, 255, 0.4);

  /* Borders & Dividers */
  --divider: rgba(255, 255, 255, 0.1);
  --border-subtle: rgba(255, 255, 255, 0.15);
}
```

### 2.2 Typography Scale
```css
:root {
  --font-system: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
  --font-mono: 'SF Mono', 'JetBrains Mono', monospace;

  /* iOS Type Scale */
  --text-large-title: 34px;
  --text-title-1: 28px;
  --text-title-2: 22px;
  --text-title-3: 20px;
  --text-headline: 17px;
  --text-body: 17px;
  --text-callout: 16px;
  --text-subhead: 15px;
  --text-footnote: 13px;
  --text-caption-1: 12px;
  --text-caption-2: 11px;
}
```

### 2.3 Spacing System
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
}
```

### 2.4 Animation Tokens
```css
:root {
  /* Durations */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;

  /* Easings */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  --ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 2.5 iPhone 17 Pro Dimensions
```css
:root {
  /* iPhone 17 Pro (2025) */
  --iphone-width: 402px;
  --iphone-height: 874px;
  --iphone-corner-radius: 55px;
  --safe-area-top: 62px;
  --safe-area-bottom: 34px;
  --status-bar-height: 54px;
  --dynamic-island-width: 126px;
  --dynamic-island-height: 37px;
}
```

### Deliverables:
- [ ] CSS custom properties file
- [ ] Design tokens JSON (for future use)
- [ ] Color contrast verification (WCAG AA)
- [ ] Typography specimen sheet

---

## Phase 3: Component Architecture
**Duration**: Component design phase
**Skills**: `frontend-design`
**Output**: Component specifications

### 3.1 Component Inventory

| Component | Variants | States |
|-----------|----------|--------|
| iOS Notification | alert, info, success | visible, hidden, tapped |
| Prompt Overlay | single-action, dual-action | visible, hidden |
| Brief Confirm | - | appearing, visible, disappearing |
| Memory HUD | - | appearing, visible, disappearing |
| Health Ring | small, large | static, animating |
| Equipment Card | - | normal, alert, working, success |
| Status Dot | green, yellow, red, orange | static, pulsing |
| History Item | current, past | hidden, visible, glowing |
| Entry Path Button | primary (watch), secondary (test) | default, hover, active |
| CTA Button | - | default, pulsing |

### 3.2 Component API Design

```javascript
// Notification Component
createNotification({
  type: 'alert' | 'info' | 'success',
  title: string,
  body: string,
  duration: number, // ms, 0 = persistent
  onTap: () => void
})

// Prompt Component
showPrompt({
  text: string,
  context?: string, // "to strata manager"
  primary: { label: string, action: () => void },
  secondary: { label: string, action: () => void }
})

// Memory HUD
showMemoryHUD({
  text: string, // "Saved to Lift 2"
  duration: number // ms
})
```

### 3.3 Component File Structure
```
demo/
├── css/
│   ├── tokens.css          # Design tokens
│   ├── components/
│   │   ├── notification.css
│   │   ├── prompt.css
│   │   ├── memory-hud.css
│   │   ├── health-ring.css
│   │   ├── equipment-card.css
│   │   ├── history-item.css
│   │   └── buttons.css
│   └── views/
│       ├── entry.css
│       ├── dashboard.css
│       ├── emergency.css
│       └── history.css
├── js/
│   ├── components/
│   │   ├── Notification.js
│   │   ├── Prompt.js
│   │   └── MemoryHUD.js
│   ├── timeline/
│   │   └── WatchItInAction.js
│   └── demo.js
└── demo.html
```

### Deliverables:
- [ ] Component specification document
- [ ] Component API documentation
- [ ] File structure created
- [ ] Base CSS files scaffolded

---

## Phase 4: iPhone Frame & Chrome
**Duration**: Frame development
**Skills**: `frontend-design`, Web Research
**Output**: Pixel-perfect iPhone 17 Pro frame

### 4.1 Research
**Web Research**:
- iPhone 17 Pro exact dimensions and bezels
- Dynamic Island exact measurements
- iOS 26 status bar layout
- Home indicator specifications

### 4.2 Frame Construction

```html
<div class="iphone-frame">
  <div class="iphone-screen">
    <!-- Dynamic Island -->
    <div class="dynamic-island">
      <div class="di-camera"></div>
    </div>

    <!-- Status Bar -->
    <div class="status-bar">
      <span class="status-time">9:41</span>
      <div class="status-icons">
        <svg class="icon-signal">...</svg>
        <svg class="icon-wifi">...</svg>
        <svg class="icon-battery">...</svg>
      </div>
    </div>

    <!-- Content Area -->
    <div class="screen-content">
      <!-- Views render here -->
    </div>

    <!-- Home Indicator -->
    <div class="home-indicator"></div>
  </div>
</div>
```

### 4.3 Frame Styling Details
- Titanium-like gradient border effect
- Subtle inner shadow for screen depth
- Ambient glow behind device
- Responsive scaling (clamp-based)

### 4.4 Status Bar Icons
Create accurate SVG icons:
- Signal strength (4 bars)
- WiFi (full)
- Battery (with percentage option)

### Deliverables:
- [ ] iPhone frame HTML/CSS complete
- [ ] Dynamic Island accurate
- [ ] Status bar with icons
- [ ] Home indicator
- [ ] Responsive scaling working
- [ ] Ambient glow effect

---

## Phase 5: Entry Screen
**Duration**: Entry screen development
**Skills**: `frontend-design`
**Output**: Two-path entry UI

### 5.1 Layout Structure
```
┌─────────────────────────────────────┐
│           [Dynamic Island]          │
│                                     │
│              ◆ SITESYNC             │
│     Building Management, Simplified │
│                                     │
│     ┌─────────────────────────┐     │
│     │  ▶ Watch It In Action   │     │
│     │  See a real emergency   │     │
│     │  response unfold ~90sec │     │
│     └─────────────────────────┘     │
│                                     │
│     ┌─────────────────────────┐     │
│     │  ⊞ Test the Demo     →  │     │
│     │  Explore at your own    │     │
│     │  pace                   │     │
│     └─────────────────────────┘     │
│                                     │
│        Choose your experience       │
│                                     │
│           [Home Indicator]          │
└─────────────────────────────────────┘
```

### 5.2 Animations
- Logo breathe animation (ambient glow)
- Path buttons stagger in on load
- Hover: subtle scale + border glow
- Active: scale down feedback
- Selection: ripple effect → transition

### 5.3 Logo Integration
Use SiteSync diamond mark from brand assets:
```html
<svg class="logo-mark" viewBox="0 0 24 24">
  <rect x="4" y="4" width="16" height="16" rx="1"
        transform="rotate(45 12 12)"
        fill="none" stroke="#e65100" stroke-width="1.5"/>
  <rect x="8" y="8" width="8" height="8" rx="0.5"
        transform="rotate(45 12 12)" fill="#e65100"/>
</svg>
```

### Deliverables:
- [ ] Entry screen layout complete
- [ ] Logo with ambient glow
- [ ] Both path buttons styled
- [ ] Hover/active states
- [ ] Entry animations
- [ ] Path selection routing

---

## Phase 6: Dashboard View
**Duration**: Dashboard development
**Skills**: `frontend-design`
**Output**: Building manager dashboard

### 6.1 Layout Structure
```
┌─────────────────────────────────────┐
│           [Dynamic Island]          │
│                                     │
│  Good morning, Sarah                │
│  Collins Tower                      │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  ╭───╮                          ││
│  │  │94 │  Building Health         ││
│  │  ╰───╯  All systems operational ││
│  └─────────────────────────────────┘│
│                                     │
│  EQUIPMENT                          │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🛗 Lift 1   KONE    ● OK        ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 🛗 Lift 2   KONE    ● OK        ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 🛗 Lift 3   KONE    ● OK        ││
│  └─────────────────────────────────┘│
│                                     │
│           [Home Indicator]          │
└─────────────────────────────────────┘
```

### 6.2 Health Ring Component
- SVG-based circular progress
- Gradient stroke (green → orange)
- Animated stroke-dashoffset for value changes
- Large number in center

### 6.3 Equipment Cards
- Elevator emoji icon (🛗)
- Name and model
- Status dot with color
- Status text
- Tap target for detail view (future)

### 6.4 Status Animations
- Status dot color transitions
- Alert state: pulsing red glow
- Working state: orange with rotating icon
- Success state: green with checkmark flash

### Deliverables:
- [ ] Dashboard layout complete
- [ ] Health ring component working
- [ ] Equipment cards styled
- [ ] Status dot states
- [ ] Alert pulse animation
- [ ] Working rotation animation

---

## Phase 7: iOS Notification System
**Duration**: Notification development
**Skills**: `frontend-design`, Web Research
**Output**: iOS-accurate notification banners

### 7.1 Research
**Web Research**:
- iOS 26 notification banner dimensions
- Notification grouping patterns
- Haptic feedback timing (for visual cues)
- Lock screen vs banner differences

### 7.2 Notification Types

**Alert (Red accent)**:
```
┌─────────────────────────────────────┐
│ ▌ [◆] SITESYNC              now    │
│ ▌     🔴 EMERGENCY: Lift 2 stopped │
│ ▌     Passengers may be trapped    │
└─────────────────────────────────────┘
```

**Info (Blue accent)**:
```
┌─────────────────────────────────────┐
│ ▌ [◆] SITESYNC              now    │
│ ▌     Technician Confirmed         │
│ ▌     Marcus Webb • On his way     │
└─────────────────────────────────────┘
```

**Success (Green accent)**:
```
┌─────────────────────────────────────┐
│ ▌ [◆] SITESYNC              now    │
│ ▌     ✓ Lift 2 back in service     │
│ ▌     All systems normal           │
└─────────────────────────────────────┘
```

### 7.3 Animation Sequence
```javascript
// Slide in
gsap.to(notification, {
  y: 0,
  opacity: 1,
  duration: 0.4,
  ease: 'back.out(1.2)'
});

// Auto-dismiss after duration
gsap.to(notification, {
  y: '-120%',
  opacity: 0,
  duration: 0.3,
  delay: duration / 1000,
  ease: 'power2.in'
});
```

### 7.4 Interaction
- Tap: scale feedback → trigger action
- Swipe up: dismiss (optional enhancement)
- Long press: expand (optional enhancement)

### Deliverables:
- [ ] Notification HTML structure
- [ ] Alert/Info/Success variants
- [ ] Slide-in animation
- [ ] Auto-dismiss timing
- [ ] Tap interaction
- [ ] Notification queue system

---

## Phase 8: Emergency Response View
**Duration**: Emergency view development
**Skills**: `frontend-design`
**Output**: Emergency response screen

### 8.1 Layout Structure
```
┌─────────────────────────────────────┐
│           [Dynamic Island]          │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Red gradient
│       🔴 Emergency Response Active  │
│         Lift 2 • Stopped            │
│       Collins Tower • Floor 3       │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ DIAGNOSIS                       ││
│  │ Door sensor fault               ││
│  │ Light curtain misalignment      ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ TECHNICIAN DISPATCHED           ││
│  │ 👤 Marcus Webb    [Dispatched]  ││
│  │    TechServ Pro    ETA 45 min   ││
│  │    ─────────────────────────    ││
│  │    Change         Est: $180-250 ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 💡 Known issue with this model  ││
│  │    in humid conditions...       ││
│  └─────────────────────────────────┘│
│                                     │
│           [Home Indicator]          │
└─────────────────────────────────────┘
```

### 8.2 Card Animations
- Cards cascade in with stagger
- Diagnosis card: fade + slide up
- Technician card: fade + slide up (delay)
- Quirk card: bounce in (later, "How did it know?")

### 8.3 Status Badge Updates
- "Dispatched" → "Confirmed" → "On site"
- Color changes with smooth transition
- Text content swap

### 8.4 Summary Card (Post-Resolution)
```
┌─────────────────────────────────────┐
│         47 min        $220          │
│        Resolution      Cost         │
│                                     │
│   3rd fastest resolution this month │
│                                     │
│      See all Lift 2 repairs →       │
└─────────────────────────────────────┘
```

### Deliverables:
- [ ] Emergency header with gradient
- [ ] Diagnosis card
- [ ] Technician card with status badge
- [ ] Quirk card (blue accent)
- [ ] Summary card
- [ ] History link
- [ ] Card entrance animations
- [ ] Status badge updates

---

## Phase 9: Prompt System
**Duration**: Prompt development
**Skills**: `frontend-design`
**Output**: Bottom sheet prompt component

### 9.1 Prompt Design
```
┌─────────────────────────────────────┐
│                                     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← Overlay (40% black)
│                                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │    Send incident report?        ││
│  │    to strata manager            ││
│  │                                 ││
│  │  ┌─────────┐  ┌─────────┐       ││
│  │  │  Later  │  │   Yes   │       ││
│  │  └─────────┘  └─────────┘       ││
│  │                                 ││
│  └─────────────────────────────────┘│
│           [Home Indicator]          │
└─────────────────────────────────────┘
```

### 9.2 Prompt Variants
1. **Incident Report**: "Send incident report?" [Later] [Yes]
2. **Close Work Order**: "Close work order?" [Review] [Yes]

### 9.3 Animations
- Overlay fades in
- Card slides up from bottom
- Button tap: scale down feedback
- Dismiss: slide down + fade overlay

### 9.4 Brief Confirmation
After tapping Yes:
```
        ┌─────────────┐
        │   Sent ✓    │
        └─────────────┘
```
- Center of screen
- Appears with scale + fade
- Auto-dismisses after 1.2s

### Deliverables:
- [ ] Prompt overlay structure
- [ ] Prompt card styling
- [ ] Button variants (primary/secondary)
- [ ] Show/hide animations
- [ ] Brief confirmation toast
- [ ] Tap feedback

---

## Phase 10: Memory HUD & Bridge Moment
**Duration**: Memory HUD development
**Skills**: `frontend-design`
**Output**: "Saved to Building Memory" HUD

### 10.1 HUD Design
```
        ┌─────────────────────┐
        │                     │
        │         🏢          │
        │                     │
        │   Saved to Lift 2   │
        │                     │
        └─────────────────────┘
```

### 10.2 Building Icon
```html
<svg viewBox="0 0 24 24">
  <path d="M3 21V7l9-5 9 5v14H3z" stroke="currentColor" fill="none"/>
  <rect x="9" y="13" width="6" height="8" stroke="currentColor" fill="none"/>
  <!-- Pulse lines -->
  <path class="pulse-lines" d="M12 8v4M10 10h4" stroke="currentColor"/>
</svg>
```

### 10.3 Animation Sequence
```javascript
// Appear
gsap.to('.memory-hud', {
  opacity: 1,
  scale: 1,
  duration: 0.3,
  ease: 'back.out(1.5)'
});

// Icon pulse
gsap.to('.memory-hud-icon', {
  scale: 1.1,
  duration: 0.2,
  yoyo: true,
  repeat: 1
});

// Disappear
gsap.to('.memory-hud', {
  opacity: 0,
  scale: 0.9,
  duration: 0.25,
  delay: 1.5,
  ease: 'power2.in'
});
```

### 10.4 Purpose
This is the **bridge moment** that connects:
- "Close work order" action
- → "Saved to building memory" HUD
- → Repair history view (showing years of data)

It creates the realization: "This just became part of the building's permanent memory."

### Deliverables:
- [ ] Memory HUD structure
- [ ] Building icon SVG
- [ ] Pulse animation
- [ ] Appear/disappear animations
- [ ] Timing integrated with timeline

---

## Phase 11: Repair History View
**Duration**: History view development
**Skills**: `frontend-design`
**Output**: "Building Remembers" timeline

### 11.1 Layout Structure
```
┌─────────────────────────────────────┐
│           [Dynamic Island]          │
│                                     │
│              🛗 Lift 2              │
│        13 repairs since 2019        │
│                                     │
│  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  │ ┌─────────────────────────────┐ │
│  │ │ JUST NOW ✨                 │ │ ← Glowing!
│  │ │ Door sensor recalibrated    │ │
│  │ │ Marcus Webb • TechServ Pro  │ │
│  │ └─────────────────────────────┘ │
│  │                                  │
│  ○ ┌─────────────────────────────┐ │
│  │ │ Aug 2024                    │ │
│  │ │ Door alignment adjusted     │ │
│  │ │ Jake Torres • ABC Elevators │ │ ← Different!
│  │ └─────────────────────────────┘ │
│  │                                  │
│  ○ ┌─────────────────────────────┐ │
│  │ │ Mar 2023                    │ │
│  │ │ Controller software update  │ │
│  │ │ Ben Park • Smith Maint.     │ │ ← Different!
│  │ └─────────────────────────────┘ │
│  │                                  │
│  ○ ┌─────────────────────────────┐ │
│    │ Nov 2021                    │ │
│    │ Annual service inspection   │ │
│    │ Original • KONE             │ │ ← Different!
│    └─────────────────────────────┘ │
│                                     │
│  ─────────────────────────────────  │
│      Your building remembers.       │
│              Forever.               │
│                                     │
│       [ Try it yourself → ]         │
│                                     │
│           [Home Indicator]          │
└─────────────────────────────────────┘
```

### 11.2 Timeline Styling
- Vertical line connecting dots
- Current item: filled dot + glow
- Past items: hollow dots
- Different contractors highlighted in orange

### 11.3 "Just Saved" Glow Effect
```css
.history-item.just-saved {
  background: rgba(230, 81, 0, 0.1);
  border: 1px solid rgba(230, 81, 0, 0.3);
  animation: justSavedGlow 2s ease-in-out infinite;
}

@keyframes justSavedGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(230, 81, 0, 0); }
  50% { box-shadow: 0 0 12px 2px rgba(230, 81, 0, 0.2); }
}
```

### 11.4 Animation Sequence
```javascript
// Items cascade in
gsap.to('.history-item', {
  opacity: 1,
  x: 0,
  duration: 0.4,
  stagger: 0.15,
  ease: 'power2.out'
});

// Tagline fades in
gsap.to('.memory-tagline', {
  opacity: 1,
  duration: 0.5,
  delay: 0.6
});

// CTA pulses
gsap.to('.demo-cta', {
  boxShadow: '0 0 0 0 rgba(230, 81, 0, 0.7)',
  duration: 1,
  repeat: -1,
  yoyo: true
});
```

### 11.5 The "Aha" Moment
Users realize:
- Different contractor names over the years
- Data persists regardless of who services
- "Contractors come and go. Your building remembers forever."

### Deliverables:
- [ ] History header
- [ ] Timeline vertical line
- [ ] History items (4 entries)
- [ ] "Just saved" glow effect
- [ ] Different contractor highlighting
- [ ] Tagline with impact
- [ ] Pulsing CTA button
- [ ] Cascade animation

---

## Phase 12: Master GSAP Timeline
**Duration**: Timeline development
**Skills**: Web Research (GSAP best practices)
**Output**: Complete 60-second automated sequence

### 12.1 Research
**Web Research**:
- GSAP timeline best practices 2025
- GSAP performance optimization
- Timeline scrubbing patterns
- Pause/resume handling

### 12.2 Timeline Architecture
```javascript
class WatchItInAction {
  constructor() {
    this.timeline = null;
    this.isPlaying = false;
  }

  build() {
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => this.onComplete()
    });

    this.timeline
      .add('start', 0)
      .add('alert', 2)
      .add('tapNotification', 4)
      .add('emergencyScreen', 6)
      .add('quirk', 9)
      .add('confirmed', 13)
      .add('promptReport', 17)
      .add('tapYes1', 19)
      .add('onSite', 25)
      .add('working', 27)
      .add('techUpdate', 35)
      .add('resolved', 41)
      .add('promptClose', 47)
      .add('tapYes2', 49)
      .add('memoryHUD', 51)
      .add('summary', 53)
      .add('historyLink', 57)
      .add('autoHistory', 59);
  }

  play() {
    this.isPlaying = true;
    this.timeline.play();
  }

  pause() {
    this.timeline.pause();
  }

  restart() {
    this.timeline.restart();
  }

  seek(label) {
    this.timeline.seek(label);
  }
}
```

### 12.3 Timeline Segments

| Label | Time | Actions |
|-------|------|---------|
| start | 0s | Dashboard visible |
| alert | 2s | Notification slides in, Lift 2 pulses red |
| tapNotification | 4s | Notification tapped, dismissed |
| emergencyScreen | 6s | Transition to emergency view, cards appear |
| quirk | 9s | Quirk card bounces in |
| confirmed | 13s | Info notification, status badge update |
| promptReport | 17s | Prompt overlay appears |
| tapYes1 | 19s | Button tap, prompt dismissed, "Sent ✓" |
| onSite | 25s | "Marcus on site" notification |
| working | 27s | Status changes to REPAIR (orange) |
| techUpdate | 35s | "Sensor recalibrated" notification |
| resolved | 41s | Success notification, status → OK (green) |
| promptClose | 47s | "Close work order?" prompt |
| tapYes2 | 49s | Button tap, prompt dismissed |
| memoryHUD | 51s | "Saved to Lift 2" HUD appears |
| summary | 53s | Summary card appears with stats |
| historyLink | 57s | "See all Lift 2 repairs →" fades in |
| autoHistory | 59s | Transition to history view |

### 12.4 Performance Optimization
```javascript
// Force GPU acceleration
gsap.config({
  force3D: true,
  nullTargetWarn: false
});

// Only animate transform/opacity for 60fps
// Avoid: width, height, top, left, margin, padding
```

### Deliverables:
- [ ] WatchItInAction class
- [ ] All timeline segments implemented
- [ ] Labels for scrubbing/debugging
- [ ] Play/pause/restart methods
- [ ] Reset function
- [ ] Performance verified at 60fps

---

## Phase 13: Micro-interactions & Polish
**Duration**: Polish phase
**Skills**: `frontend-design`, `webapp-testing`
**Output**: Refined interactions and visual polish

### 13.1 Button Interactions
```css
.button {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.button:active {
  transform: scale(0.96);
}
```

### 13.2 Card Hover Effects
- Subtle border glow on hover
- Slight elevation increase
- Smooth transitions

### 13.3 Status Transitions
- Color morphs smoothly between states
- Scale pulse on change
- Optional: particle effects for success

### 13.4 Loading States
- Skeleton screens (if needed)
- Spinner (if needed)
- Progress indicators

### 13.5 Error States
- Graceful fallbacks
- Retry options
- Error messaging

### 13.6 Focus States
- Visible focus rings for accessibility
- Keyboard navigation support
- Skip links (if needed)

### Deliverables:
- [ ] All button states polished
- [ ] Card hover effects
- [ ] Status transitions smooth
- [ ] Focus states visible
- [ ] Keyboard navigation working
- [ ] No visual glitches

---

## Phase 14: Testing & Quality Assurance
**Duration**: Testing phase
**Skills**: `webapp-testing`
**Output**: Verified, bug-free demo

### 14.1 Browser Testing Matrix

| Browser | Version | Platform | Status |
|---------|---------|----------|--------|
| Chrome | Latest | macOS | ☐ |
| Chrome | Latest | Windows | ☐ |
| Safari | Latest | macOS | ☐ |
| Safari | Latest | iOS | ☐ |
| Firefox | Latest | macOS | ☐ |
| Edge | Latest | Windows | ☐ |

### 14.2 Device Testing

| Device | Viewport | Status |
|--------|----------|--------|
| Desktop 1920x1080 | Large | ☐ |
| Desktop 1440x900 | Medium | ☐ |
| Laptop 1366x768 | Small | ☐ |
| Tablet 768x1024 | iPad | ☐ |
| Mobile 390x844 | iPhone | ☐ |

### 14.3 Performance Testing
- Lighthouse score > 90
- Animation FPS > 55 average
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

### 14.4 Accessibility Testing
- Screen reader announcement verification
- Keyboard navigation complete
- Color contrast WCAG AA
- Reduced motion support

### 14.5 Test Scenarios
1. [ ] Entry screen loads correctly
2. [ ] "Watch It In Action" plays full sequence
3. [ ] All notifications appear/dismiss correctly
4. [ ] All prompts appear/respond correctly
5. [ ] Memory HUD appears at right time
6. [ ] History view animates correctly
7. [ ] CTA navigates to role selection
8. [ ] "Test Demo" path works
9. [ ] Back navigation works
10. [ ] No console errors

### Deliverables:
- [ ] Browser testing complete
- [ ] Device testing complete
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] All scenarios verified
- [ ] Bug list at zero

---

## Phase 15: Sound Design (Optional Enhancement)
**Duration**: Audio phase
**Skills**: Web Research
**Output**: Subtle UI sounds

### 15.1 Research
**Web Research**:
- iOS system sound specifications
- Web Audio API best practices
- Sound licensing (royalty-free sources)
- Audio accessibility considerations

### 15.2 Sound Inventory

| Event | Sound | Duration |
|-------|-------|----------|
| Alert notification | Urgent chime | ~0.3s |
| Info notification | Soft ding | ~0.2s |
| Success notification | Pleasant confirmation | ~0.3s |
| Button tap | Subtle click | ~0.1s |
| Prompt appear | Soft whoosh | ~0.2s |
| Memory HUD | Resonant save | ~0.4s |

### 15.3 Implementation
```javascript
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
  }

  async load() {
    this.sounds.alert = await this.loadSound('alert.mp3');
    this.sounds.info = await this.loadSound('info.mp3');
    this.sounds.success = await this.loadSound('success.mp3');
    this.sounds.tap = await this.loadSound('tap.mp3');
  }

  play(name) {
    if (this.enabled && this.sounds[name]) {
      this.sounds[name].play();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
  }
}
```

### 15.4 Accessibility
- Sounds off by default (user opt-in)
- Mute toggle visible
- No critical info conveyed only through sound

### Deliverables:
- [ ] Sound files sourced
- [ ] SoundManager implemented
- [ ] Mute toggle added
- [ ] Sounds integrated with timeline
- [ ] Accessibility compliant

---

## Phase 16: Documentation & Handoff
**Duration**: Documentation phase
**Skills**: `docx` (optional for formal docs)
**Output**: Complete documentation

### 16.1 Code Documentation
- Inline comments for complex logic
- JSDoc for public functions
- CSS comment blocks for sections

### 16.2 README Updates
```markdown
## Demo Usage

### Watch It In Action
Click "Watch It In Action" to see a 60-second cinematic demo
of SiteSync handling an elevator emergency.

### Test the Demo
Click "Test Demo" to explore the interface at your own pace.
Choose from Building Manager, Technician, or Enterprise views.

## Development

### File Structure
...

### Modifying the Timeline
...

### Adding New Components
...
```

### 16.3 Maintenance Guide
- How to update timeline timing
- How to change notification content
- How to add new history items
- How to modify the sequence

### Deliverables:
- [ ] Code comments complete
- [ ] README updated
- [ ] Maintenance guide created
- [ ] All files organized

---

## Phase 17: Launch Preparation
**Duration**: Final phase
**Output**: Production-ready demo

### 17.1 Pre-Launch Checklist
- [ ] All phases complete
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance verified
- [ ] Accessibility verified
- [ ] Documentation complete

### 17.2 Deployment
- [ ] Files minified (if needed)
- [ ] Assets optimized
- [ ] Cache headers configured
- [ ] SSL verified

### 17.3 Analytics (Optional)
- Track "Watch It In Action" starts
- Track completion rate
- Track "Try Demo" clicks
- Track role selections

### 17.4 Post-Launch
- Monitor for issues
- Gather feedback
- Plan iterations

---

## Summary

| Phase | Description | Skills Used |
|-------|-------------|-------------|
| 1 | Research & Competitive Analysis | Web Research |
| 2 | Design System Foundation | frontend-design, theme-factory |
| 3 | Component Architecture | frontend-design |
| 4 | iPhone Frame & Chrome | frontend-design, Web Research |
| 5 | Entry Screen | frontend-design |
| 6 | Dashboard View | frontend-design |
| 7 | iOS Notification System | frontend-design, Web Research |
| 8 | Emergency Response View | frontend-design |
| 9 | Prompt System | frontend-design |
| 10 | Memory HUD & Bridge Moment | frontend-design |
| 11 | Repair History View | frontend-design |
| 12 | Master GSAP Timeline | Web Research |
| 13 | Micro-interactions & Polish | frontend-design, webapp-testing |
| 14 | Testing & Quality Assurance | webapp-testing |
| 15 | Sound Design (Optional) | Web Research |
| 16 | Documentation & Handoff | docx (optional) |
| 17 | Launch Preparation | - |

---

## Success Metrics

1. **Completion Rate**: 80%+ of users watch full video demo
2. **Conversion**: 50%+ click "Try Demo" after watching
3. **Performance**: 60fps animations, <3s load time
4. **Accessibility**: WCAG AA compliant
5. **Engagement**: "How did it know?" moments create genuine realization
6. **Emotional Impact**: "Building Remembers" creates differentiation clarity

---

*Build Plan Created: December 3, 2025*
*Builds Upon: DEMO_VIDEO_EXTENSION_PLAN.md*
*Current Implementation: demo.html*
