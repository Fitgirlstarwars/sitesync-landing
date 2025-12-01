# Work Orders Tutorial

> Create and manage maintenance jobs in SiteSync

## Overview

Work orders track maintenance tasks from request to completion. This tutorial covers creating, assigning, completing work orders, and handling special cases like callbacks and bulk operations.

## Prerequisites

- Active SiteSync account
- At least one asset registered
- Contractor invited (for assignment)

---

## Work Order Types

| Type | Code | Use When |
|------|------|----------|
| **Breakdown** | `breakdown` | Equipment has failed or has issues |
| **Preventive** | `preventive` | Scheduled routine maintenance |
| **Inspection** | `inspection` | Compliance or safety inspection |
| **Installation** | `installation` | New equipment being installed |
| **Modernization** | `modernization` | Equipment upgrade/replacement |
| **Callback** | `callback` | Follow-up to previous work |
| **Audit** | `audit` | Third-party audit or review |

---

## Creating a Work Order

### Step 1: Start New Work Order

From any view:
- **Dashboard**: Click **+ New Work Order**
- **Asset detail**: Click **Report Issue**
- **Quick action**: Use keyboard shortcut `N`

### Step 2: Select Asset

Choose the equipment needing work:

```
┌─────────────────────────────────────────────────────────┐
│  Select Asset                                           │
│                                                         │
│  🔍 Search...                                           │
│                                                         │
│  Recent:                                                │
│  ○ Lift 1 - KONE MonoSpace (Collins Place T1)          │
│  ○ Lift 2 - Otis Gen2 (Collins Place T1)               │
│  ○ AHU-01 - Daikin (Collins Place T1)                  │
│                                                         │
│  [ Browse All Assets ]                                  │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Describe the Issue

**Required fields:**
- **Title** — Short description (e.g., "Door not closing properly")
- **Type** — Breakdown, Preventive, Inspection, etc.

**Recommended fields:**
- **Priority** — Emergency, High, Medium, Low, Scheduled
- **Description** — Detailed explanation
- **Fault code** — If known from equipment panel
- **Affected floors** — For multi-stop equipment

```
┌─────────────────────────────────────────────────────────┐
│  Create Work Order                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Asset:       Lift 1 - KONE MonoSpace                   │
│  Building:    Collins Place Tower 1                     │
│                                                         │
│  Type:        [Breakdown                      ▼]        │
│  Priority:    [High                           ▼]        │
│                                                         │
│  Title:       [Door not closing properly       ]        │
│                                                         │
│  Description:                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Lift 1 door on level 5 is not closing fully.     │  │
│  │ Making scraping noise. Started this morning.     │  │
│  │ No fault code displayed on panel.                │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Fault Code:  [                               ] (opt)   │
│  Affected:    [5                              ] floors  │
│                                                         │
│  ☑ Request AI Diagnosis                                 │
│                                                         │
│  [ Cancel ]  [ Create as Draft ]  [ Create & Submit ]   │
└─────────────────────────────────────────────────────────┘
```

### Step 4: Get AI Diagnosis (Optional)

Click **Request AI Diagnosis** for intelligent suggestions:

```
┌─────────────────────────────────────────────────────────┐
│  🤖 AI Diagnosis (92% confidence)                       │
│                                                         │
│  Likely cause: Door operator belt worn                  │
│                                                         │
│  Supporting evidence:                                   │
│  • Scraping noise suggests mechanical wear              │
│  • Level 5 door has high usage (lobby floor)            │
│  • Similar issue on this unit 14 months ago             │
│                                                         │
│  Suggested parts:                                       │
│  □ Door belt assembly                                   │
│  □ Belt tensioner                                       │
│                                                         │
│  Est. repair time: 45-60 min                            │
│                                                         │
│  [ Accept ]  [ View Alternatives ]  [ Dismiss ]         │
└─────────────────────────────────────────────────────────┘
```

### Step 5: Assign Contractor

Select who should do the work:

| Assignment Method | When to Use |
|-------------------|-------------|
| **Direct assign** | Known contractor for this equipment |
| **Auto-assign** | Use routing rules (preferred contractor first) |
| **Quote request** | Get competitive bids for larger jobs |
| **Leave unassigned** | Assign later after review |

```
┌─────────────────────────────────────────────────────────┐
│  Assign Contractor                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ○ Auto-assign (uses routing rules)                     │
│                                                         │
│  ● Direct assign:                                       │
│    ├── ⭐ KONE Australia (Preferred)                    │
│    │       Response: 2-4 hours │ Rate: $125/hr          │
│    ├── Smith Elevator Services                         │
│    │       Response: 4-8 hours │ Rate: $95/hr           │
│    └── Metro Lifts                                     │
│            Response: Same day │ Rate: $110/hr           │
│                                                         │
│  ○ Request quotes (sends to multiple contractors)       │
│                                                         │
│  ○ Leave unassigned (assign later)                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 6: Create Work Order

Click **Create & Submit** to generate the work order.

- Work order number assigned (e.g., WO-2024-001234)
- Status set to `pending` or `scheduled` (if assigned)
- Notifications sent to assigned contractor
- Asset status may update based on priority

---

## Work Order Lifecycle

### Status Flow

```
draft → pending → scheduled → in_progress → completed → invoiced
                      ↓              ↓
                   on_hold ←────────┘
                      ↓
                  cancelled
```

### Status Definitions

| Status | Meaning | Who Can Change |
|--------|---------|----------------|
| `draft` | Not yet submitted | Creator |
| `pending` | Awaiting assignment | Manager+ |
| `scheduled` | Assigned with date | Manager+ |
| `in_progress` | Technician on-site | Technician, Manager+ |
| `on_hold` | Temporarily paused | Manager+ |
| `completed` | Work finished | Technician, Manager+ |
| `cancelled` | Job cancelled | Manager+ |
| `invoiced` | Payment processed | Manager+ |

### Status Change Requirements

| Transition | Requirements |
|------------|--------------|
| → `pending` | Title required |
| → `scheduled` | Contractor assigned, date set |
| → `in_progress` | None (technician starts) |
| → `on_hold` | Reason required |
| → `completed` | Resolution notes required |
| → `cancelled` | Reason required |
| → `invoiced` | Costs finalized |

---

## Completing a Work Order

When work is done, the technician completes the job:

### Step 1: Start Completion

From the work order, click **Complete Job** or swipe to complete on mobile.

### Step 2: Enter Resolution Details

```
┌─────────────────────────────────────────────────────────┐
│  Complete Work Order                                    │
│  WO-2024-001234: Door not closing properly              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Resolution Notes: (required)                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Replaced worn door belt assembly on Level 5 door. │  │
│  │ Adjusted belt tension to spec. Tested 20 cycles,  │  │
│  │ operating normally.                               │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Root Cause:     [Worn belt - normal wear    ▼]        │
│                                                         │
│  Parts Used:                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ☑ Door belt assembly (P/N: KB-2001)    $145.00 │   │
│  │ ☐ Belt tensioner (P/N: KB-2002)        $35.00  │   │
│  │ [ + Add Part ]                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Labor:                                                 │
│  ├── Time on site:      1h 15m (auto-tracked)          │
│  ├── Travel time:       30m                            │
│  └── Billable hours:    [1.75            ]             │
│                                                         │
│  Photos:                                                │
│  [ 📷 Before ] [ 📷 After ] [ 📷 Parts Used ]          │
│                                                         │
│  ☑ AI diagnosis was correct                            │
│                                                         │
│  [ Save Draft ]  [ Complete Job ]                       │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Confirm Completion

- Asset status returns to `operational` (or `degraded` if partial fix)
- Building health score recalculates
- Contractor can generate invoice
- AI learns from diagnosis feedback

---

## Handling Callbacks

A **callback** occurs when the same issue recurs or the original fix didn't hold.

### Creating a Callback

From a completed work order:

1. Click **Report Callback**
2. Select callback reason:

```
┌─────────────────────────────────────────────────────────┐
│  Report Callback                                        │
│  Original: WO-2024-001234 (completed Dec 1)             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Callback Reason:                                       │
│  ○ Same issue recurred                                  │
│  ○ Related issue discovered                             │
│  ○ Original fix failed                                  │
│  ○ Customer reported new symptoms                       │
│  ○ Follow-up inspection required                        │
│                                                         │
│  Description:                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Door making same noise again. Started 3 days     │  │
│  │ after original repair.                           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ☑ Assign to original contractor (KONE Australia)       │
│  ☐ No charge callback (warranty period)                 │
│                                                         │
│  [ Cancel ]  [ Create Callback ]                        │
└─────────────────────────────────────────────────────────┘
```

### Callback Tracking

Callbacks are linked to the original work order:

```
┌─────────────────────────────────────────────────────────┐
│  WO-2024-001234                                         │
│  Door not closing properly                              │
├─────────────────────────────────────────────────────────┤
│  Status: completed                                      │
│  Completed: Dec 1, 2024                                 │
│                                                         │
│  ⚠ Callback reported                                   │
│  └── WO-2024-001567 (in_progress)                      │
│      Same issue recurred - Dec 4, 2024                 │
│                                                         │
│  History:                                               │
│  ├── WO-2024-001234 (this) - Original                  │
│  └── WO-2024-001567 - Callback                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Reopening a Work Order

Alternatively, reopen the original work order:

1. From completed work order, click **Reopen**
2. Provide reason for reopening
3. Status changes back to `in_progress`
4. Original contractor notified

---

## Work Order Templates

Create templates for common maintenance tasks.

### Creating a Template

Navigate to **Settings > Work Order Templates > Create**

```
┌─────────────────────────────────────────────────────────┐
│  Create Work Order Template                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Template Name: [Monthly PM - KONE MRL Lifts  ]        │
│                                                         │
│  Default Values:                                        │
│  ├── Type:      [Preventive                   ▼]       │
│  ├── Priority:  [Scheduled                    ▼]       │
│  └── Title:     [Monthly preventive maintenance]       │
│                                                         │
│  Description Template:                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Monthly PM checklist:                            │  │
│  │ - Check door operation                           │  │
│  │ - Inspect safety circuits                        │  │
│  │ - Clean car top and pit                          │  │
│  │ - Test emergency features                        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Checklist Items:                                       │
│  ☑ Door operation check                                │
│  ☑ Safety circuit test                                 │
│  ☑ Car top inspection                                  │
│  ☑ Pit inspection and clean                           │
│  ☑ Emergency phone test                               │
│  ☑ Emergency lighting test                            │
│  [ + Add Item ]                                         │
│                                                         │
│  Estimated Duration: [2         ] hours                │
│                                                         │
│  Applies To:                                            │
│  ☑ All KONE lifts                                      │
│  ☐ Specific assets: [Select...]                        │
│                                                         │
│  [ Cancel ]  [ Save Template ]                          │
└─────────────────────────────────────────────────────────┘
```

### Using a Template

When creating a work order:

1. Click **Use Template**
2. Select from available templates
3. Fields pre-fill with template values
4. Modify as needed for this specific job

```
┌─────────────────────────────────────────────────────────┐
│  Select Template                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Recent:                                                │
│  ○ Monthly PM - KONE MRL Lifts                         │
│  ○ Annual Inspection - All Lifts                       │
│  ○ Emergency Callback Response                         │
│                                                         │
│  By Type:                                               │
│  ├── Preventive (4 templates)                          │
│  ├── Inspection (3 templates)                          │
│  └── Breakdown (2 templates)                           │
│                                                         │
│  [ Browse All ]  [ Create New Template ]               │
└─────────────────────────────────────────────────────────┘
```

---

## Mobile/Field Technician Flow

Technicians use the mobile app for field work.

### Viewing Assigned Jobs

```
┌─────────────────────────────────────────────────────────┐
│  My Jobs                           Today: Dec 4, 2024   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  NOW                                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔴 WO-2024-001567                               │   │
│  │    Door not closing (Callback)                  │   │
│  │    Collins Place T1 - Lift 1                    │   │
│  │    High priority                                │   │
│  │                                                 │   │
│  │    [ Navigate ]  [ Start Job ]                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  LATER TODAY                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟡 WO-2024-001580                               │   │
│  │    Monthly PM                                   │   │
│  │    Riverside Towers - Lift 2                    │   │
│  │    Scheduled: 2:00 PM                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🟡 WO-2024-001581                               │   │
│  │    Monthly PM                                   │   │
│  │    Riverside Towers - Lift 3                    │   │
│  │    Scheduled: 3:30 PM                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Starting a Job

1. Tap **Start Job** when arriving on-site
2. Clock starts automatically
3. Access building info, asset history, AI diagnosis

```
┌─────────────────────────────────────────────────────────┐
│  WO-2024-001567 - In Progress           ⏱ 0:15:32     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Door not closing (Callback)                            │
│  Collins Place T1 - Lift 1 - KONE MonoSpace             │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  🤖 AI Diagnosis (88%)                                 │
│  Belt tensioner may need replacement in addition to     │
│  belt. Previous repair only addressed belt.             │
│                                                         │
│  [ View Full Diagnosis ]                                │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Quick Actions:                                         │
│  [ 📷 Photo ]  [ 📋 Checklist ]  [ 🔧 Log Parts ]      │
│                                                         │
│  [ ⏸ Pause ]              [ ✓ Complete Job ]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Completing on Mobile

Swipe or tap **Complete Job**:

1. Enter resolution notes (voice-to-text available)
2. Log parts used (scan barcode or select from list)
3. Take before/after photos
4. Confirm AI diagnosis accuracy
5. Submit completion

---

## Bulk Operations

Manage multiple work orders at once.

### Bulk Create (Scheduled PM)

Create work orders for multiple assets:

1. Navigate to **Work Orders > Bulk Create**
2. Select assets (or use filter)
3. Apply template
4. Set schedule

```
┌─────────────────────────────────────────────────────────┐
│  Bulk Create Work Orders                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Template: [Monthly PM - All Lifts           ▼]        │
│                                                         │
│  Select Assets:                                         │
│  ☑ Collins Place T1 - Lift 1                           │
│  ☑ Collins Place T1 - Lift 2                           │
│  ☑ Collins Place T1 - Lift 3                           │
│  ☑ Collins Place T1 - Goods Lift                       │
│  ☐ Collins Place T2 - Lift 1                           │
│  ☐ Collins Place T2 - Lift 2                           │
│                                                         │
│  [ Select All ]  [ Select by Building ]                 │
│                                                         │
│  Schedule:                                              │
│  ├── Start Date:    [Dec 15, 2024          📅]         │
│  ├── Spacing:       [1 hour apart           ▼]         │
│  └── Assign To:     [KONE Australia         ▼]         │
│                                                         │
│  Preview: 4 work orders will be created                 │
│                                                         │
│  [ Cancel ]  [ Preview ]  [ Create All ]                │
└─────────────────────────────────────────────────────────┘
```

### Bulk Update

Update multiple work orders:

1. Select work orders from list (checkbox)
2. Click **Bulk Actions**
3. Choose action:

| Action | Use Case |
|--------|----------|
| **Reassign** | Change contractor for multiple jobs |
| **Reschedule** | Move dates for multiple jobs |
| **Change Priority** | Escalate or de-escalate batch |
| **Cancel** | Cancel multiple pending jobs |
| **Export** | Download as CSV/PDF |

```
┌─────────────────────────────────────────────────────────┐
│  Bulk Actions (4 selected)                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [ Reassign Contractor ]                                │
│  [ Reschedule ]                                         │
│  [ Change Priority ]                                    │
│  [ Cancel Selected ]                                    │
│  [ Export ]                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Recurring Work Orders

Set up automatically recurring jobs:

```
┌─────────────────────────────────────────────────────────┐
│  Create Recurring Schedule                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Template: [Monthly PM - KONE MRL Lifts      ▼]        │
│                                                         │
│  Assets:                                                │
│  ☑ Collins Place T1 - Lift 1                           │
│  ☑ Collins Place T1 - Lift 2                           │
│                                                         │
│  Recurrence:                                            │
│  ├── Frequency:     [Monthly                  ▼]       │
│  ├── Day:           [First Monday             ▼]       │
│  ├── Time:          [9:00 AM                  ]        │
│  └── Auto-assign:   [KONE Australia           ▼]       │
│                                                         │
│  Duration:                                              │
│  ├── Start:         [Jan 1, 2025             📅]       │
│  └── End:           [Dec 31, 2025            📅]       │
│                                                         │
│  Preview: 12 work orders over 12 months                 │
│                                                         │
│  [ Cancel ]  [ Create Schedule ]                        │
└─────────────────────────────────────────────────────────┘
```

---

## Priority Levels

| Priority | Response Time | Use When |
|----------|---------------|----------|
| **Emergency** | Immediate dispatch | Safety hazard, entrapment, fire |
| **High** | Same day | Equipment down, significant impact |
| **Medium** | Within 48 hours | Degraded operation, minor issues |
| **Low** | Within 1 week | Cosmetic, non-urgent improvements |
| **Scheduled** | Planned date | PM, inspections, planned work |

### Priority Escalation

Work orders can be escalated:

1. Select work order
2. Click **Escalate Priority**
3. Provide reason
4. Notifications sent to relevant parties

---

## Filtering and Search

### Filter Options

| Filter | Options |
|--------|---------|
| **Status** | Draft, Pending, Scheduled, In Progress, etc. |
| **Priority** | Emergency, High, Medium, Low, Scheduled |
| **Type** | Breakdown, Preventive, Inspection, etc. |
| **Building** | Select specific site |
| **Asset** | Select specific elevator |
| **Contractor** | Assigned contractor |
| **Date Range** | Created, scheduled, or completed date |

### Saved Filters

Save common filter combinations:

- "My Open Jobs" — Assigned to me, not completed
- "Overdue" — Past due date, not completed
- "This Week's PM" — Preventive, scheduled this week
- "Emergency Queue" — Emergency priority, pending/scheduled

---

## Troubleshooting

### Work Order Not Appearing

**Problem**: Created work order not visible

**Solutions**:
1. Check status filter (may be filtered out)
2. Check building/asset filters
3. Verify you have permission to view
4. Refresh the list

### Cannot Change Status

**Problem**: Status change button disabled

**Solutions**:
1. Check your role permissions
2. Verify transition is valid (see status flow)
3. Complete required fields (e.g., resolution notes)
4. Ensure contractor is assigned (for scheduling)

### Contractor Not Notified

**Problem**: Assigned contractor didn't receive notification

**Solutions**:
1. Verify contractor email is correct
2. Check contractor's notification preferences
3. Check spam/junk folder
4. Resend notification manually

---

## Related Guides

- [AI Diagnosis](ai-diagnosis.md) — Deep dive on AI features
- [Add Assets](add-assets.md) — Register equipment first
- [Compliance Tracking](../how-to/compliance-tracking.md) — Manage inspections
- [Switch Contractors](../how-to/switch-contractors.md) — Change providers
- [State Machines Reference](../foundation/09-state-machines.md) — Status transitions

---

**[← Back to Add Assets](add-assets.md)** | **[Next: AI Diagnosis →](ai-diagnosis.md)**
