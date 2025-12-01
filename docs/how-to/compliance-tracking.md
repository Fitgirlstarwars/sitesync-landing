# How to Track Compliance

> Manage inspections, certifications, and regulatory requirements

## Overview

SiteSync tracks compliance requirements for all your building equipment, ensuring you never miss an inspection or certification deadline.

## Compliance Dashboard

Access your compliance overview:

1. Go to **Dashboard**
2. Click **Compliance** tab (or sidebar item)

```
┌─────────────────────────────────────────────────────────┐
│  COMPLIANCE OVERVIEW                                    │
│                                                         │
│  ⚠️  2 inspections due this month                       │
│  ✓  15 items compliant                                  │
│  ❌  1 overdue item                                      │
│                                                         │
│  UPCOMING                                               │
│  • Lift 1 annual inspection — Dec 15                    │
│  • Fire panel test — Dec 20                             │
│                                                         │
│  OVERDUE                                                │
│  • Lift 2 safety cert — expired Nov 30 (5 days)        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Setting Up Compliance Tracking

### Step 1: Define Requirements

For each asset, set compliance requirements:

1. Go to asset detail
2. Click **Compliance** tab
3. Click **+ Add Requirement**

| Field | Example |
|-------|---------|
| **Requirement type** | Annual inspection |
| **Regulation** | AS 1735 (Lifts) |
| **Frequency** | Every 12 months |
| **Lead time** | 30 days notice |
| **Certification required** | Yes |

### Step 2: Record Current Status

Enter last compliance date:

```
┌─────────────────────────────────────────────┐
│  Lift 1 - Annual Inspection (AS 1735)       │
│                                             │
│  Last completed: Jan 15, 2024               │
│  Certificate #: CERT-2024-001               │
│  Inspector: SafetyFirst Pty Ltd             │
│                                             │
│  Next due: Jan 15, 2025                     │
│  Status: ✓ Compliant (42 days remaining)    │
└─────────────────────────────────────────────┘
```

### Step 3: Set Notifications

Configure alerts:

- **Email alerts** — 30, 14, 7 days before due
- **Dashboard alerts** — Show in compliance widget
- **Auto-create work order** — Generate inspection WO automatically

---

## Common Compliance Types

### Lifts & Escalators

| Requirement | Frequency | Regulation |
|-------------|-----------|------------|
| Annual safety inspection | 12 months | AS 1735 |
| 5-year major inspection | 5 years | AS 1735 |
| Registration renewal | Varies by state | State regulations |

### Fire Systems

| Requirement | Frequency | Regulation |
|-------------|-----------|------------|
| Monthly inspection | Monthly | AS 1851 |
| 6-month service | 6 months | AS 1851 |
| Annual certification | 12 months | AS 1851 |

### HVAC

| Requirement | Frequency | Regulation |
|-------------|-----------|------------|
| Filter replacement | 3-6 months | Manufacturer |
| Refrigerant check | 12 months | ARCTick |
| Energy audit | 24 months | NABERS |

### Electrical

| Requirement | Frequency | Regulation |
|-------------|-----------|------------|
| RCD testing | 6 months | AS/NZS 3760 |
| Thermographic scan | 12 months | Best practice |
| Switchboard inspection | 12 months | AS/NZS 3000 |

---

## Managing Inspections

### Schedule an Inspection

1. From compliance dashboard, click **Schedule** on upcoming item
2. This creates a work order of type `inspection`
3. Assign to qualified inspector/contractor
4. Set scheduled date

### Complete an Inspection

When inspection is done:

1. Complete the work order
2. Upload certificate/report
3. Enter next due date
4. Compliance status auto-updates

```
┌─────────────────────────────────────────────┐
│  Complete Inspection                        │
│                                             │
│  Result: ○ Pass  ○ Fail  ○ Conditional      │
│                                             │
│  Certificate #: _____________               │
│                                             │
│  Upload: [ Choose File ]                    │
│                                             │
│  Notes: ______________________________      │
│                                             │
│  Next due: [ Auto-calculated: Jan 2025 ]    │
│                                             │
│  [ Complete ]                               │
└─────────────────────────────────────────────┘
```

### Handle Failed Inspections

If inspection fails:

1. Record failure with details
2. System creates follow-up work order
3. Track remediation work
4. Schedule re-inspection
5. Asset shows `non-compliant` until resolved

---

## Compliance Reports

Generate reports for:

- **Building managers** — Overview of all compliance items
- **Auditors** — Full compliance history with certificates
- **Insurance** — Proof of maintenance

### Export Options

- PDF summary report
- CSV data export
- Certificate bundle (all docs in ZIP)

---

## Automation Features

### Auto-Generated Work Orders

Enable automatic inspection WO creation:

```
Settings → Compliance → Auto-create work orders

☑ Create inspection WOs automatically
   Lead time: [ 30 ] days before due
   Assign to: [ Preferred contractor ▼ ]
   Priority: [ Medium ▼ ]
```

### Recurring Inspections

Set up perpetual schedule:

```
After completion → auto-schedule next
Based on: ○ Fixed interval  ○ Completion date
```

---

## Compliance Calendar

View all requirements in calendar format:

- **Red** — Overdue
- **Yellow** — Due within 30 days
- **Green** — Compliant
- **Gray** — Scheduled (not yet due)

---

## Related

- [Work Orders](../tutorials/work-orders.md) — Create inspection jobs
- [Data Model](../reference/data-model.md) — Compliance fields
- [Security & Compliance](../explanation/security-compliance.md) — Platform compliance

---

**[← Back to How-To Guides](../README.md)**
