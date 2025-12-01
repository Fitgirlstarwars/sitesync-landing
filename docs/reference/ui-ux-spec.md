# UI/UX Specification

> Design system and interface patterns for SiteSync

## Design Principles

### 1. Mobile-First
Technicians work in the field. Design for phone screens first, then expand.

### 2. Minimal Clicks
Every tap costs time. Reduce steps to complete common tasks.

### 3. Progressive Disclosure
Show essential info first. Hide details behind taps.

### 4. Invisible AI
AI assists silently. No "AI is thinking" spinners. Results appear ready.

### 5. Offline-Capable
Core functions work without connectivity. Sync when online.

---

## Information Architecture

### Navigation Hierarchy

**Building Managers:**
```
Dashboard → Sites → Assets → Work Orders
```

**Technicians:**
```
My Schedule → Work Order Detail → Complete Job
```

### Primary Views

| View | Primary User | Purpose |
|------|--------------|---------|
| Dashboard | Manager | Overview of all sites |
| Site Detail | Manager | Single building deep-dive |
| Schedule | Technician | Today's jobs |
| Work Order | Both | Job details & actions |
| Asset | Both | Equipment history |

---

## Dashboard (Building Manager)

### Layout

| Zone | Content | Priority |
|------|---------|----------|
| **Header** | Building selector, notifications | Fixed |
| **Hero** | Health Score (large number) | Highest |
| **Trade Grid** | 6 trade summary cards | High |
| **Insights** | AI recommendations (3-5 items) | Medium |
| **Upcoming** | Next 5 scheduled items | Medium |
| **Activity** | Recent events feed | Low |

### Health Score Display

**Visual:**
- Large number (48-72px)
- Color-coded ring: Green (75+), Yellow (50-74), Red (<50)
- Trend arrow: ↑ improving, ↓ declining, → stable
- Comparison text: "Top 15% of similar buildings"

**Behavior:**
- Tap → drill into Health Score breakdown
- Updates in real-time when data changes

### Trade Summary Grid

**Layout:** 2x3 grid on mobile, 6 columns on desktop

**Each card shows:**
- Trade icon + name
- Health score (mini)
- Asset count
- Open work orders count
- Status indicator (dot: green/yellow/red)

**Behavior:**
- Tap card → filter to that trade
- Long press → quick actions menu

### AI Insights Panel

**Content:** 3-5 actionable recommendations

**Format per insight:**
```
[Icon] [Headline]
[Supporting detail - one line]
[Action button if applicable]
```

**Examples:**
- "Lift 2 door operator showing wear" → [Schedule Service]
- "Fire inspection due in 14 days" → [View Schedule]
- "HVAC filter replacement recommended" → [Create Work Order]

**Behavior:**
- Swipe to dismiss (remembers for 7 days)
- Tap → expand with full details
- Maximum 5 visible, "Show more" for additional

---

## Work Order List

### Layout Options

**Default: Card View**
Each work order as a card (better for scanning)

**Alternative: Table View**
Dense list (better for bulk management)

### Work Order Card

**Visual hierarchy (top to bottom):**

1. **Priority badge** — Color-coded chip (Emergency=red, High=orange, Medium=blue, Low=gray)
2. **Title** — Bold, 1-2 lines max
3. **Location** — Site name + Asset number
4. **Status pill** — Current state
5. **AI insight** — If available, one-line summary
6. **Footer** — Assigned to, time info

**Dimensions:**
- Full width on mobile
- Max 400px on desktop
- Padding: 16px
- Border radius: 8px
- Shadow: subtle (elevation 1)

**States:**
- Default: white background
- Selected: light blue background
- Overdue: red left border

**Actions:**
- Tap → Open detail
- Swipe right → Quick assign
- Swipe left → Change status

### Filters

**Always visible:** Status, Priority
**Expandable:** Trade, Date range, Assigned to

**Behavior:**
- Active filters shown as removable chips
- Filter counts shown in dropdown options
- "Clear all" when any filter active

---

## Work Order Detail

### Mobile Layout (Primary)

**Screen sections (scrollable):**

1. **Header (sticky)**
   - Back button
   - WO number
   - Status dropdown
   - Actions menu (•••)

2. **Summary Card**
   - Priority + Type badges
   - Title (large)
   - Asset link → tap to view
   - Site link → tap to view

3. **AI Diagnosis Card** (if available)
   - Confidence indicator (pie or bar)
   - Likely cause
   - Suggested parts (checkable)
   - "Why this diagnosis?" expandable

4. **Details Section**
   - Description
   - Fault details
   - Reported by
   - Timestamps

5. **Assignment Section**
   - Assigned contractor (avatar + name)
   - Scheduled time
   - [Reassign] button

6. **Activity Timeline**
   - Chronological events
   - Collapsible older items

7. **Action Bar (sticky bottom)**
   - Primary action (context-dependent)
   - e.g., [Start Job] or [Complete] or [Assign]

### Status Transitions

**Allowed actions by status:**

| Current | Actions Available |
|---------|-------------------|
| `draft` | Submit, Edit, Delete |
| `pending` | Assign, Edit, Cancel |
| `scheduled` | Start, Reassign, Cancel |
| `in_progress` | Complete, Pause, Add Notes |
| `on_hold` | Resume, Cancel |
| `completed` | Reopen, Invoice |

### Complete Job Flow

**Step 1: Resolution**
- Required: Resolution type dropdown
- Required: Resolution notes (min 10 chars)
- Optional: Root cause

**Step 2: Parts Used**
- Add from inventory (searchable)
- Or manual entry (part, qty, cost)
- Van stock auto-suggested

**Step 3: Labor**
- Auto-calculated from start/end
- Adjustable
- Labor type: Regular, Overtime, Emergency

**Step 4: Confirm**
- Summary of costs
- [Complete Job] button

---

## Technician Mobile App

### Schedule View

**Layout:** Vertical timeline (infinite scroll)

**Day header:** Sticky when scrolling

**Job cards show:**
- Time block (start - end)
- Priority indicator
- Title
- Location
- [Navigate] button

**Gestures:**
- Pull down → refresh
- Swipe between days
- Tap job → detail
- Long press → quick actions

### On-Site Job Flow

**Step 1: Arrive**
- [I've Arrived] button
- Auto-detects location (optional)
- Starts timer

**Step 2: Work**
- View AI diagnosis
- Access asset history
- View/download manuals
- Add photos
- Add notes (voice or text)

**Step 3: Parts**
- Select from van stock (auto-suggested based on diagnosis)
- Scan barcode
- Record usage

**Step 4: Complete**
- Resolution notes
- Customer signature (optional)
- [Complete Job]

### Offline Mode

**Available offline:**
- Today's scheduled jobs (pre-cached)
- Asset details for scheduled jobs
- Manuals for scheduled assets
- Parts list for van stock

**Queued for sync:**
- Status changes
- Notes added
- Photos taken
- Time logged

**Visual indicator:**
- Offline banner at top
- Sync status icon
- Pending changes count

---

## Components Library

### Buttons

| Type | Use for | Style |
|------|---------|-------|
| Primary | Main action | Solid, brand color |
| Secondary | Alternative action | Outlined |
| Destructive | Delete, cancel | Red |
| Ghost | Tertiary actions | Text only |

**Sizes:** Large (48px), Medium (40px), Small (32px)

### Status Pills

| Status | Color | Background |
|--------|-------|------------|
| Draft | Gray | Gray-100 |
| Pending | Yellow | Yellow-100 |
| Scheduled | Blue | Blue-100 |
| In Progress | Purple | Purple-100 |
| Completed | Green | Green-100 |
| Cancelled | Red | Red-100 |

### Priority Badges

| Priority | Color | Icon |
|----------|-------|------|
| Emergency | Red-600 | Alert triangle |
| High | Orange-500 | Arrow up |
| Medium | Blue-500 | Minus |
| Low | Gray-400 | Arrow down |

### Health Score

| Range | Color | Label |
|-------|-------|-------|
| 90-100 | Green-500 | Excellent |
| 75-89 | Green-400 | Good |
| 60-74 | Yellow-500 | Fair |
| 40-59 | Orange-500 | Poor |
| 0-39 | Red-500 | Critical |

### Trade Icons

Use consistent iconography:
- Lifts: Elevator icon
- HVAC: Snowflake/thermometer
- Electrical: Lightning bolt
- Plumbing: Water drop
- Fire: Flame
- Security: Shield

---

## Responsive Breakpoints

| Name | Width | Layout |
|------|-------|--------|
| Mobile | < 640px | Single column |
| Tablet | 640-1024px | 2 columns |
| Desktop | > 1024px | 3+ columns, sidebar |

### Mobile Adaptations

- Navigation → bottom tab bar
- Filters → slide-up sheet
- Tables → cards
- Side-by-side → stacked
- Hover states → tap states

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First paint | < 1.5s |
| Full load | < 3s |
| Interaction response | < 100ms |
| Scroll | 60 fps |
| Offline launch | < 500ms |

---

## Accessibility

- Touch targets: minimum 44x44px
- Color contrast: WCAG AA (4.5:1)
- Screen reader labels on all interactive elements
- Keyboard navigation on desktop
- Focus indicators visible
- Reduced motion option

---

**[← Back to Docs](../README.md)**
