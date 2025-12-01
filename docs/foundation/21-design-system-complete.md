# SiteSync V3 - Complete Design System

> **Visual Language & Components** - Complete specification for consistent, accessible UI design.

---

## Design Principles

### Core Principles

1. **Mobile-First**: Design for smallest screens first, enhance for larger
2. **Accessibility**: WCAG 2.1 AA compliance minimum
3. **Consistency**: Same patterns across all features
4. **Progressive Disclosure**: Show essentials first, details on demand
5. **Clarity over Cleverness**: Obvious beats clever every time

### Design Values

| Value | Description | Example |
|-------|-------------|---------|
| **Efficient** | Minimize steps to complete tasks | One-click work order creation |
| **Clear** | Obvious meaning, no ambiguity | Status colors consistent everywhere |
| **Trustworthy** | Professional, reliable appearance | Clean typography, consistent spacing |
| **Helpful** | Guide users, prevent errors | Inline validation, smart defaults |

---

## Color System

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#1E40AF` | Primary actions, links, focus |
| **Primary Light** | `#3B82F6` | Hover states, highlights |
| **Primary Dark** | `#1E3A8A` | Active states, headers |

### Secondary Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Secondary** | `#64748B` | Secondary actions, icons |
| **Secondary Light** | `#94A3B8` | Disabled states, borders |
| **Secondary Dark** | `#475569` | Emphasis, subheadings |

### Neutral Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Gray 50** | `#F8FAFC` | Page backgrounds |
| **Gray 100** | `#F1F5F9` | Card backgrounds, stripes |
| **Gray 200** | `#E2E8F0` | Borders, dividers |
| **Gray 300** | `#CBD5E1` | Input borders |
| **Gray 400** | `#94A3B8` | Placeholder text |
| **Gray 500** | `#64748B` | Secondary text |
| **Gray 600** | `#475569` | Body text |
| **Gray 700** | `#334155` | Headings |
| **Gray 800** | `#1E293B` | Primary text |
| **Gray 900** | `#0F172A` | Darkest text |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#10B981` | Success states, completed |
| **Success Light** | `#D1FAE5` | Success backgrounds |
| **Warning** | `#F59E0B` | Warnings, caution |
| **Warning Light** | `#FEF3C7` | Warning backgrounds |
| **Error** | `#EF4444` | Errors, destructive |
| **Error Light** | `#FEE2E2` | Error backgrounds |
| **Info** | `#3B82F6` | Information, links |
| **Info Light** | `#DBEAFE` | Info backgrounds |

### Status Colors

| Status | Color | Hex | Background |
|--------|-------|-----|------------|
| Operational | Green | `#10B981` | `#D1FAE5` |
| Degraded | Yellow | `#F59E0B` | `#FEF3C7` |
| Out of Service | Red | `#EF4444` | `#FEE2E2` |
| Maintenance | Blue | `#3B82F6` | `#DBEAFE` |
| Decommissioned | Gray | `#6B7280` | `#F3F4F6` |

### Priority Colors

| Priority | Color | Hex | Background |
|----------|-------|-----|------------|
| Emergency | Red | `#DC2626` | `#FEE2E2` |
| High | Orange | `#EA580C` | `#FFEDD5` |
| Medium | Yellow | `#CA8A04` | `#FEF9C3` |
| Low | Blue | `#2563EB` | `#DBEAFE` |
| Scheduled | Gray | `#6B7280` | `#F3F4F6` |

### Dark Mode Palette

| Light Mode | Dark Mode | Usage |
|------------|-----------|-------|
| Gray 50 | Gray 900 | Page background |
| Gray 100 | Gray 800 | Card background |
| Gray 200 | Gray 700 | Borders |
| Gray 800 | Gray 100 | Primary text |
| Primary | Primary Light | Actions |
| White | Gray 900 | Card surface |

---

## Typography

### Font Families

```css
/* Primary font - UI text */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace - Code, numbers */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| **xs** | 12px | 16px | 400 | Captions, labels |
| **sm** | 14px | 20px | 400 | Body small, secondary |
| **base** | 16px | 24px | 400 | Body text default |
| **lg** | 18px | 28px | 500 | Lead text, emphasis |
| **xl** | 20px | 28px | 600 | Card headings |
| **2xl** | 24px | 32px | 600 | Section headings |
| **3xl** | 30px | 36px | 700 | Page titles |
| **4xl** | 36px | 40px | 700 | Hero headings |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Emphasis, labels |
| Semibold | 600 | Subheadings |
| Bold | 700 | Headings |

### Text Styles

```css
/* Heading 1 - Page titles */
.h1 {
  font-size: 30px;
  line-height: 36px;
  font-weight: 700;
  letter-spacing: -0.025em;
}

/* Heading 2 - Section titles */
.h2 {
  font-size: 24px;
  line-height: 32px;
  font-weight: 600;
  letter-spacing: -0.025em;
}

/* Heading 3 - Card titles */
.h3 {
  font-size: 20px;
  line-height: 28px;
  font-weight: 600;
}

/* Body - Default text */
.body {
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
}

/* Body Small - Secondary text */
.body-sm {
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
}

/* Caption - Labels, metadata */
.caption {
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

---

## Spacing System

### Base Unit

Base unit: **4px**

All spacing values are multiples of 4px for consistency.

### Spacing Scale

| Name | Value | Usage |
|------|-------|-------|
| **0** | 0px | None |
| **1** | 4px | Tight, inline elements |
| **2** | 8px | Related elements |
| **3** | 12px | Small gaps |
| **4** | 16px | Standard gap |
| **5** | 20px | Medium gap |
| **6** | 24px | Section gap |
| **8** | 32px | Large gap |
| **10** | 40px | Extra large |
| **12** | 48px | Layout gap |
| **16** | 64px | Major sections |
| **20** | 80px | Page sections |

### Component Spacing

| Component | Padding | Margin |
|-----------|---------|--------|
| Button (sm) | 8px 12px | - |
| Button (md) | 10px 16px | - |
| Button (lg) | 12px 20px | - |
| Input | 10px 12px | - |
| Card | 16px - 24px | 16px |
| Modal | 24px | - |
| Form Field | - | 0 0 16px 0 |

---

## Grid & Layout

### Grid System

12-column grid with responsive breakpoints.

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

@media (min-width: 640px) {
  .container { padding: 0 24px; }
}

@media (min-width: 1024px) {
  .container { padding: 0 32px; }
}
```

### Breakpoints

| Name | Min Width | Typical Devices |
|------|-----------|-----------------|
| **sm** | 640px | Large phones, small tablets |
| **md** | 768px | Tablets |
| **lg** | 1024px | Small laptops |
| **xl** | 1280px | Desktops |
| **2xl** | 1536px | Large desktops |

### Layout Patterns

#### Sidebar + Content

```
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│ Sidebar  │                  Content Area                     │
│ (240px)  │                  (flex: 1)                        │
│          │                                                   │
│          │                                                   │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

#### Card Grid

```
Desktop (xl):  4 columns
Laptop (lg):   3 columns
Tablet (md):   2 columns
Mobile (sm):   1 column

Gap: 16px (sm), 24px (lg)
```

---

## Components

### Buttons

#### Button Variants

| Variant | Usage | Style |
|---------|-------|-------|
| **Primary** | Main actions | Solid primary color |
| **Secondary** | Alternative actions | Border, transparent bg |
| **Ghost** | Tertiary actions | No border, transparent |
| **Danger** | Destructive actions | Red solid |
| **Link** | Navigation | Text only, underline |

#### Button Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| **xs** | 28px | 6px 10px | 12px |
| **sm** | 32px | 8px 12px | 14px |
| **md** | 40px | 10px 16px | 14px |
| **lg** | 48px | 12px 20px | 16px |

#### Button States

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Default]  [Hover]  [Active]  [Focus]  [Disabled]  [Loading]
│                                                             │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐ │
│  │ Save │  │ Save │  │ Save │  │ Save │  │ Save │  │ ···  │ │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘ │
│   #1E40AF  #3B82F6   #1E3A8A   +ring    opacity   spinner  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Inputs

#### Text Input

```
Label *
┌─────────────────────────────────────┐
│ Placeholder text                    │
└─────────────────────────────────────┘
Helper text goes here

Height: 40px (md), 48px (lg)
Border: 1px solid Gray 300
Border Radius: 6px
Focus: Primary ring
Error: Error border + Error text
```

#### Input States

| State | Border | Background | Ring |
|-------|--------|------------|------|
| Default | Gray 300 | White | None |
| Hover | Gray 400 | White | None |
| Focus | Primary | White | Primary/30% |
| Error | Error | Error Light | None |
| Disabled | Gray 200 | Gray 100 | None |

#### Select

```
Label
┌─────────────────────────────────────┬───┐
│ Select an option                    │ ▼ │
└─────────────────────────────────────┴───┘

┌─────────────────────────────────────────┐
│ Option 1                                │
│ Option 2                    ✓           │
│ Option 3                                │
└─────────────────────────────────────────┘
```

#### Checkbox & Radio

```
Checkbox:
☐ Unchecked          ☑ Checked          ☐ Indeterminate
                                        ─

Radio:
○ Unchecked          ● Selected
```

### Cards

#### Card Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Header (optional)                               [Action]│ │
│ └─────────────────────────────────────────────────────────┘ │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│   Card Content                                              │
│                                                             │
│   Can contain any elements: text, images, forms, etc.       │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Footer (optional)                    [Action] [Action]  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

Border: 1px solid Gray 200
Border Radius: 8px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Padding: 16px (sm), 24px (lg)
```

#### Card Variants

| Variant | Border | Shadow | Usage |
|---------|--------|--------|-------|
| Default | Yes | Subtle | Standard containers |
| Elevated | No | Medium | Important content |
| Outlined | Yes | None | Forms, grouped |
| Interactive | Yes | Hover | Clickable cards |

### Modals

#### Modal Sizes

| Size | Width | Usage |
|------|-------|-------|
| **sm** | 400px | Confirmations |
| **md** | 560px | Forms |
| **lg** | 800px | Complex content |
| **xl** | 1024px | Full features |
| **full** | 100% - 32px | Mobile, full-screen |

#### Modal Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Modal Title                                          [×]│ │
│ └─────────────────────────────────────────────────────────┘ │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│                                                             │
│   Modal Body                                                │
│                                                             │
│   Scrollable if content exceeds max-height                  │
│                                                             │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                     [Cancel] [Confirm]  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

Backdrop: Black/50%
Border Radius: 12px
Animation: Fade + Scale (200ms)
```

### Tables

#### Table Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ☐ │ Column A ▼  │ Column B    │ Column C    │ Actions       │
├───┼─────────────┼─────────────┼─────────────┼───────────────┤
│ ☐ │ Data 1      │ Data        │ Data        │ [···]         │
├───┼─────────────┼─────────────┼─────────────┼───────────────┤
│ ☐ │ Data 2      │ Data        │ Data        │ [···]         │
├───┼─────────────┼─────────────┼─────────────┼───────────────┤
│ ☐ │ Data 3      │ Data        │ Data        │ [···]         │
└───┴─────────────┴─────────────┴─────────────┴───────────────┘

Header: Gray 50 background, semibold text
Row Height: 48px (md), 56px (lg)
Hover: Gray 50 background
Selected: Primary/10% background
Stripe (optional): Alternating Gray 50
```

### Navigation

#### Sidebar Navigation

```
┌──────────────────────────┐
│     ┌─────┐              │
│     │Logo │   SiteSync   │
│     └─────┘              │
├──────────────────────────┤
│                          │
│  ■ Dashboard             │  ← Active: Primary bg
│  □ Sites                 │  ← Default
│  □ Work Orders    (12)   │  ← With badge
│  □ Assets                │
│  □ Contractors           │
│                          │
├──────────────────────────┤
│  REPORTS                 │  ← Section header
│  □ Analytics             │
│  □ Compliance            │
│                          │
├──────────────────────────┤
│  □ Settings              │
│  □ Help                  │
│                          │
│  ┌────────────────────┐  │
│  │ John Smith         │  │  ← User menu
│  │ Admin              │  │
│  └────────────────────┘  │
└──────────────────────────┘

Width: 240px (expanded), 64px (collapsed)
Item Height: 40px
Active: Primary background
Hover: Gray 100 background
```

#### Tabs

```
┌──────────────────────────────────────────────────────────────┐
│  Details   │  History   │  Attachments (3)  │  Notes        │
│ ──────────                                                   │
│                                                              │
│  Tab Content                                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Active: Primary underline (2px), semibold
Inactive: Gray text, no underline
Hover: Gray 700 text
```

### Badges & Pills

#### Badge Variants

| Variant | Background | Text | Usage |
|---------|------------|------|-------|
| Default | Gray 100 | Gray 700 | Neutral |
| Primary | Primary/10% | Primary | Highlight |
| Success | Success Light | Success | Completed |
| Warning | Warning Light | Warning | Attention |
| Error | Error Light | Error | Critical |

#### Badge Sizes

| Size | Height | Padding | Font |
|------|--------|---------|------|
| sm | 20px | 2px 6px | 11px |
| md | 24px | 2px 8px | 12px |
| lg | 28px | 4px 10px | 14px |

### Alerts & Toasts

#### Alert Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ⓘ  Alert title                                         [×] │
│    Alert description text can span multiple lines.         │
│    [Action Button]                                         │
└─────────────────────────────────────────────────────────────┘

Types: Info (blue), Success (green), Warning (yellow), Error (red)
Border-left: 4px solid color
Background: Color Light
Padding: 16px
```

#### Toast Notification

```
┌─────────────────────────────────────┐
│ ✓  Work order created successfully  │
│                               [×]   │
└─────────────────────────────────────┘

Position: Top-right
Animation: Slide in from right
Auto-dismiss: 5 seconds
Max visible: 3
```

### Loading States

#### Spinner

```
  ○ ○
○     ○     Sizes: sm (16px), md (24px), lg (32px), xl (48px)
  ○ ○       Color: Primary (default), White (on dark bg)
```

#### Skeleton

```
┌─────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                           │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░        │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░                 │
└─────────────────────────────────────────────────────────────┘

Animation: Pulse (opacity 0.4 → 0.7)
Color: Gray 200
Border Radius: 4px
```

### Empty States

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                           📋                                 │
│                                                             │
│                   No work orders yet                        │
│                                                             │
│         Create your first work order to get started.        │
│                                                             │
│                   [+ Create Work Order]                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Icon: 48px, Gray 400
Heading: Gray 700, semibold
Description: Gray 500
CTA: Primary button
```

---

## Icons

### Icon Library

Use **Lucide Icons** (consistent with React ecosystem):

```
https://lucide.dev/icons/
```

### Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| xs | 12px | Inline, badges |
| sm | 16px | Buttons, inputs |
| md | 20px | Navigation, cards |
| lg | 24px | Headers, features |
| xl | 32px | Empty states |
| 2xl | 48px | Hero, illustrations |

### Icon Colors

| Context | Color |
|---------|-------|
| Default | Gray 500 |
| Interactive | Gray 700 → Primary (hover) |
| Active | Primary |
| Success | Success |
| Warning | Warning |
| Error | Error |
| Disabled | Gray 300 |

---

## Motion & Animation

### Timing Functions

```css
/* Standard easing */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Spring-like easing */
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Duration Scale

| Duration | Value | Usage |
|----------|-------|-------|
| instant | 0ms | Disable animations |
| fast | 100ms | Micro-interactions |
| normal | 200ms | Standard transitions |
| slow | 300ms | Complex animations |
| slower | 500ms | Page transitions |

### Transition Patterns

| Pattern | Duration | Easing | Usage |
|---------|----------|--------|-------|
| Hover | 150ms | ease-out | Buttons, links |
| Focus | 200ms | ease-out | Focus rings |
| Modal Open | 200ms | ease-out | Modal appear |
| Modal Close | 150ms | ease-in | Modal dismiss |
| Slide | 300ms | ease-in-out | Panels, drawers |
| Fade | 200ms | ease-in-out | Toasts, tooltips |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Elevation & Shadows

### Shadow Scale

| Level | Shadow | Usage |
|-------|--------|-------|
| **0** | none | Flat elements |
| **1** | `0 1px 2px rgba(0,0,0,0.05)` | Cards, inputs |
| **2** | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Elevated cards |
| **3** | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Dropdowns |
| **4** | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals |
| **5** | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Popovers |

### Z-Index System

| Name | Value | Usage |
|------|-------|-------|
| base | 0 | Default |
| dropdown | 10 | Dropdown menus |
| sticky | 20 | Sticky headers |
| fixed | 30 | Fixed elements |
| modal-backdrop | 40 | Modal overlay |
| modal | 50 | Modal dialog |
| popover | 60 | Popovers, tooltips |
| toast | 70 | Toast notifications |

---

## Accessibility

### Color Contrast

All text must meet WCAG 2.1 AA requirements:

| Size | Ratio Required |
|------|----------------|
| Normal text (< 18px) | 4.5:1 |
| Large text (≥ 18px bold, ≥ 24px) | 3:1 |
| UI components | 3:1 |

### Focus Indicators

```css
/* Focus ring style */
.focus-ring {
  outline: none;
  box-shadow:
    0 0 0 2px white,
    0 0 0 4px var(--color-primary);
}

/* Focus-visible only (keyboard) */
:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}

:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px white,
    0 0 0 4px var(--color-primary);
}
```

### Touch Targets

| Target Type | Minimum Size |
|-------------|--------------|
| Buttons | 44px × 44px |
| Links (inline) | 24px height |
| Checkboxes/Radios | 44px × 44px (with padding) |
| Mobile tap targets | 48px × 48px |

### Screen Reader Support

- All images have alt text
- Form inputs have associated labels
- ARIA landmarks for regions
- Live regions for dynamic content
- Skip links for navigation

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move to next focusable |
| Shift + Tab | Move to previous focusable |
| Enter | Activate button/link |
| Space | Toggle checkbox, activate button |
| Escape | Close modal/dropdown |
| Arrow keys | Navigate within component |

---

## Voice & Tone

### Writing Style

| Do | Don't |
|----|-------|
| Use active voice | Use passive voice |
| Be concise | Be wordy |
| Use simple words | Use jargon |
| Address user directly (you) | Use third person |

### UI Copy Guidelines

#### Button Labels

| Action | Good | Avoid |
|--------|------|-------|
| Create | Create Work Order | Submit |
| Save | Save Changes | OK |
| Delete | Delete | Remove from System |
| Cancel | Cancel | Go Back |

#### Error Messages

```
Good: "Email address is required"
Bad:  "Error: Field validation failed (email)"

Good: "Password must be at least 8 characters"
Bad:  "Invalid password"

Good: "Unable to save. Please try again."
Bad:  "Error 500: Internal Server Error"
```

#### Empty States

```
Good: "No work orders yet. Create your first one to get started."
Bad:  "No results found."

Good: "You're all caught up! No jobs assigned today."
Bad:  "Empty"
```

### Confirmation Messages

```
Success: "Work order created successfully"
Warning: "Are you sure you want to delete this? This action cannot be undone."
Error:   "Unable to complete request. Please check your connection and try again."
```

---

## Component Library Structure

```
components/
├── atoms/
│   ├── Button/
│   ├── Input/
│   ├── Badge/
│   ├── Icon/
│   └── Spinner/
├── molecules/
│   ├── FormField/
│   ├── SearchInput/
│   ├── Card/
│   ├── Alert/
│   └── Toast/
├── organisms/
│   ├── Sidebar/
│   ├── Header/
│   ├── DataTable/
│   ├── Modal/
│   └── Form/
├── templates/
│   ├── DashboardLayout/
│   ├── ListLayout/
│   └── DetailLayout/
└── pages/
    ├── Dashboard/
    ├── WorkOrders/
    └── Sites/
```

---

## Responsive Design Patterns

### Mobile-First Approach

```css
/* Base styles (mobile) */
.card {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .card {
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card {
    padding: 32px;
  }
}
```

### Component Adaptations

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Sidebar | Bottom nav | Collapsed | Expanded |
| Table | Cards/List | Scrollable | Full |
| Modal | Full screen | Centered | Centered |
| Filters | Bottom sheet | Sidebar | Inline |
| Forms | Full width | 2 columns | 3 columns |

---

**[← Previous: Data Lifecycle & Retention](20-data-lifecycle-retention.md)** | **[Back to Foundation Plan →](00-FOUNDATION-PLAN.md)**
