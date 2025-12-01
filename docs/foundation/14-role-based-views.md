# SiteSync V3 - Role-Based Views

> **What Each User Sees** - Complete specification for role-appropriate interfaces and information density.

---

## View Philosophy

SiteSync surfaces **the right information to the right person at the right time**:

1. **Role-Appropriate Density**: Managers see high-level metrics; technicians see actionable details
2. **Task-Focused Navigation**: Each role's primary workflow is one click away
3. **Progressive Disclosure**: Details available on demand without overwhelming
4. **Mobile-First for Field Roles**: Technicians get optimized mobile experience
5. **Consistent Patterns**: Same UI patterns across roles, different content

---

## Role Summary

| Role | Primary Focus | Key Workflows |
|------|---------------|---------------|
| **Owner** | Business health, billing | Organization settings, subscription, all access |
| **Admin** | System configuration | User management, integrations, all operations |
| **Manager** | Operations oversight | Site health, work order flow, contractor performance |
| **User** | Day-to-day operations | Create/track work orders, manage assets |
| **Technician** | Field work completion | Assigned jobs, time/parts logging, AI diagnosis |
| **Readonly** | Monitoring | View dashboards and reports |
| **Guest** | Limited view | Basic site/asset information |

---

## Navigation Structure by Role

### Owner Navigation

```
SiteSync
├── Dashboard (Business Overview)
├── Sites
│   ├── All Sites
│   ├── Site Health
│   └── Site Map
├── Work Orders
│   ├── All Work Orders
│   ├── By Status
│   └── Scheduled
├── Assets
│   └── All Equipment
├── Contractors
│   ├── All Contractors
│   └── Performance
├── Reports
│   ├── Operations
│   ├── Financial
│   └── Compliance
├── Organization
│   ├── Settings
│   ├── Users
│   ├── Billing
│   └── Subscription
└── Profile
```

### Admin Navigation

```
SiteSync
├── Dashboard (Operations Overview)
├── Sites
│   ├── All Sites
│   ├── Site Health
│   └── Site Map
├── Work Orders
│   ├── All Work Orders
│   ├── By Status
│   └── Scheduled
├── Assets
│   └── All Equipment
├── Contractors
│   ├── All Contractors
│   └── Performance
├── Inventory
│   ├── Parts Catalog
│   ├── Stock Levels
│   └── Reorder Alerts
├── Reports
│   ├── Operations
│   └── Compliance
├── Settings
│   ├── Organization
│   ├── Users
│   ├── Integrations
│   └── Notifications
└── Profile
```

### Manager Navigation

```
SiteSync
├── Dashboard (Site Health Focus)
├── Sites
│   ├── My Sites
│   ├── Site Health
│   └── Inspections Due
├── Work Orders
│   ├── Open Work Orders
│   ├── Pending Assignment
│   ├── In Progress
│   └── Completed Today
├── Assets
│   ├── Equipment List
│   └── Issues Flagged
├── Contractors
│   ├── Active Contractors
│   └── Performance
├── Reports
│   ├── Work Order Summary
│   ├── Site Performance
│   └── Compliance Status
└── Profile
```

### User Navigation

```
SiteSync
├── Dashboard (My Activity)
├── Sites
│   └── All Sites
├── Work Orders
│   ├── Create New
│   ├── My Work Orders
│   ├── Open
│   └── Completed
├── Assets
│   └── All Equipment
├── Contractors
│   └── Directory
└── Profile
```

### Technician Navigation

```
SiteSync
├── My Jobs (Primary View)
│   ├── Today
│   ├── This Week
│   └── All Assigned
├── Schedule
│   └── Calendar View
├── Job Details (Context-Aware)
│   ├── Site Info
│   ├── Equipment
│   ├── AI Diagnosis
│   └── Complete Job
├── My Stats
│   ├── Jobs Completed
│   ├── Earnings (if applicable)
│   └── Performance
└── Profile
```

### Readonly Navigation

```
SiteSync
├── Dashboard (View Only)
├── Sites
│   └── All Sites
├── Work Orders
│   └── All Work Orders
├── Assets
│   └── All Equipment
├── Reports
│   └── Standard Reports
└── Profile
```

### Guest Navigation

```
SiteSync
├── Sites
│   └── Accessible Sites
├── Assets
│   └── Equipment at Sites
└── Profile
```

---

## Dashboard Specifications by Role

### Owner Dashboard

**Purpose**: Business health at a glance with financial focus.

```
┌─────────────────────────────────────────────────────────────┐
│  SITESYNC                                    [Search] [Bell] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Good morning, John                     Organization: Collins│
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │   12         │ │   3          │ │   $24,500    │        │
│  │ Active Sites │ │ Critical     │ │ This Month   │        │
│  │ ↑ 2 new     │ │ ↓ from 5     │ │ ↑ 12%       │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                             │
│  Portfolio Health                    Revenue Trend          │
│  ┌─────────────────────────┐        ┌─────────────────────┐│
│  │ ████████████████░░░░    │        │     ___/\          ││
│  │ 85% Operational         │        │ ___/     \___      ││
│  │ 15% Degraded            │        │              \___  ││
│  │ 0% Out of Service       │        │                    ││
│  └─────────────────────────┘        └─────────────────────┘│
│                                                             │
│  Attention Required                                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ! 3 inspections overdue                      View All → ││
│  │ ! 2 work orders past SLA                     View All → ││
│  │ ! Subscription renewal in 14 days            Manage →   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Recent Activity                     Top Sites by Issues    │
│  ┌─────────────────────────┐        ┌─────────────────────┐│
│  │ WO-2024-0234 completed  │        │ 1. Collins Tower (4)││
│  │ WO-2024-0235 created    │        │ 2. Bourke St (2)    ││
│  │ Site inspection passed  │        │ 3. Exhibition (1)   ││
│  └─────────────────────────┘        └─────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Metrics**:
- Total active sites
- Critical issues count
- Monthly revenue/costs
- Portfolio health percentage
- SLA compliance rate
- Subscription status

### Admin Dashboard

**Purpose**: System health and operational oversight.

```
┌─────────────────────────────────────────────────────────────┐
│  SITESYNC                                    [Search] [Bell] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Operations Dashboard                                        │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────┐│
│  │   47         │ │   8          │ │   23         │ │  94% ││
│  │ Active WOs   │ │ Emergency    │ │ Completed    │ │ SLA  ││
│  │              │ │ ↑ 2 new      │ │ Today        │ │      ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────┘│
│                                                             │
│  Work Order Pipeline                                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Pending: 12 │ Scheduled: 15 │ In Progress: 20 │ On Hold: 5│
│  │ ████████████│███████████████│█████████████████│██████   ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  User Activity                      System Health           │
│  ┌─────────────────────────┐        ┌─────────────────────┐│
│  │ 24 users active today   │        │ API: ✓ Healthy      ││
│  │ 8 technicians in field  │        │ AI: ✓ Operational   ││
│  │ 3 pending invitations   │        │ Storage: 45% used   ││
│  └─────────────────────────┘        └─────────────────────┘│
│                                                             │
│  Needs Attention              Recent Audit Events           │
│  ┌─────────────────────────┐ ┌─────────────────────────────┐│
│  │ ! Unassigned WOs: 5     │ │ User login: John S.         ││
│  │ ! Expiring licenses: 2  │ │ WO created: WO-2024-0235    ││
│  │ ! Low stock alerts: 8   │ │ Settings changed: Notifs    ││
│  └─────────────────────────┘ └─────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Metrics**:
- Active work order count by status
- Emergency work orders
- SLA compliance percentage
- Active users today
- System health indicators
- Unassigned work orders

### Manager Dashboard

**Purpose**: Site health and work order flow management.

```
┌─────────────────────────────────────────────────────────────┐
│  SITESYNC                                    [Search] [Bell] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Good morning, Sarah                    My Sites: 8         │
│                                                             │
│  Site Health Overview                                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Site              │ Health │ Open WOs │ Next Inspection ││
│  │ ─────────────────────────────────────────────────────── ││
│  │ Collins Tower     │ ██░░ 45│    3     │ Overdue!        ││
│  │ Bourke Place      │ ████ 92│    1     │ 14 days         ││
│  │ Exhibition Centre │ ███░ 78│    2     │ 30 days         ││
│  │ [View All Sites →]                                      ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌────────────────────────┐  ┌─────────────────────────────┐│
│  │ Work Orders Today      │  │ This Week                   ││
│  │ ────────────────────── │  │ ─────────────────────────── ││
│  │ 🔴 Emergency: 1        │  │ Created: 12                 ││
│  │ 🟡 Pending: 4          │  │ Completed: 18               ││
│  │ 🔵 In Progress: 6      │  │ Avg Response: 2.3 hrs       ││
│  │ ✓ Completed: 5         │  │ First-time Fix: 87%         ││
│  │ [Create Work Order]    │  │                             ││
│  └────────────────────────┘  └─────────────────────────────┘│
│                                                             │
│  Contractor Performance (This Month)                        │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Contractor         │ Jobs │ Response │ Fix Rate │Rating ││
│  │ ─────────────────────────────────────────────────────── ││
│  │ KONE Service       │  24  │  1.5 hrs │   92%    │ ⭐4.8 ││
│  │ ABC Elevators      │  18  │  2.1 hrs │   85%    │ ⭐4.5 ││
│  │ Smith Maintenance  │  12  │  3.0 hrs │   78%    │ ⭐4.2 ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Upcoming Inspections                                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Collins Tower - Lift 1      │ Dec 5   │ [Schedule]      ││
│  │ Collins Tower - Lift 2      │ Dec 5   │ [Schedule]      ││
│  │ Bourke Place - Main Lift    │ Dec 18  │ Scheduled       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Metrics**:
- Site health scores (sortable)
- Open work orders per site
- Emergency work orders count
- Work order completion rate
- Contractor performance comparison
- Upcoming/overdue inspections

### User Dashboard

**Purpose**: Personal activity and quick actions.

```
┌─────────────────────────────────────────────────────────────┐
│  SITESYNC                                    [Search] [Bell] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Hi Alex,                              [+ New Work Order]   │
│                                                             │
│  My Work Orders                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ WO-2024-0235  │ Lift stuck on floor 3     │ 🔴 Emergency ││
│  │ Collins Tower │ Created 10 mins ago       │ Pending      ││
│  │               │                           │ [View →]     ││
│  │ ─────────────────────────────────────────────────────── ││
│  │ WO-2024-0230  │ Door not closing properly │ 🟡 Medium    ││
│  │ Bourke Place  │ Assigned to KONE          │ Scheduled    ││
│  │               │ ETA: Tomorrow 9am         │ [View →]     ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  Quick Stats                         Recent Sites           │
│  ┌─────────────────────────┐        ┌─────────────────────┐│
│  │ Created this week: 4    │        │ Collins Tower →     ││
│  │ Open: 3                 │        │ Bourke Place →      ││
│  │ Completed: 1            │        │ Exhibition →        ││
│  └─────────────────────────┘        └─────────────────────┘│
│                                                             │
│  Site Equipment Status                                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Collins Tower                                           ││
│  │ ✓ Lift 1: Operational    ⚠ Lift 2: Degraded            ││
│  │                                                         ││
│  │ Bourke Place                                            ││
│  │ ✓ Main Lift: Operational  ✓ Service Lift: Operational  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Metrics**:
- My work orders (created by me)
- Quick create work order action
- Recent sites visited
- Equipment status at frequented sites

### Technician Dashboard (Mobile-Optimized)

**Purpose**: Today's jobs and quick job completion.

```
┌───────────────────────────┐
│  SITESYNC          [≡]    │
├───────────────────────────┤
│                           │
│  Good morning, Mike       │
│                           │
│  TODAY'S JOBS (3)         │
│  ─────────────────────    │
│                           │
│  ┌───────────────────────┐│
│  │ 🔴 EMERGENCY          ││
│  │ WO-2024-0235          ││
│  │ Collins Tower         ││
│  │ Lift 1 - Stuck        ││
│  │                       ││
│  │ 📍 123 Collins St     ││
│  │ [Navigate] [Start Job]││
│  └───────────────────────┘│
│                           │
│  ┌───────────────────────┐│
│  │ 🟡 SCHEDULED 10:30am  ││
│  │ WO-2024-0220          ││
│  │ Bourke Place          ││
│  │ PM Service - Lift 1   ││
│  │                       ││
│  │ 📍 456 Bourke St      ││
│  │ [Navigate] [View]     ││
│  └───────────────────────┘│
│                           │
│  ┌───────────────────────┐│
│  │ 🟢 SCHEDULED 2:00pm   ││
│  │ WO-2024-0218          ││
│  │ Exhibition Centre     ││
│  │ Inspection - Lift 2   ││
│  │                       ││
│  │ 📍 1 Exhibition St    ││
│  │ [Navigate] [View]     ││
│  └───────────────────────┘│
│                           │
│  ─────────────────────    │
│  MY STATS THIS WEEK       │
│  ┌─────────┬─────────────┐│
│  │ Jobs    │     8       ││
│  │ Avg Time│   1.5 hrs   ││
│  │ Rating  │   ⭐ 4.9    ││
│  └─────────┴─────────────┘│
│                           │
│  [View Schedule] [My Van] │
│                           │
└───────────────────────────┘
```

**Key Features**:
- Jobs sorted by priority/time
- One-tap navigation to site
- Quick "Start Job" action
- Site access codes visible when on job
- AI diagnosis button on job detail
- Timer for labor tracking
- Parts logging interface
- Photo capture for documentation

### Technician Job Detail View (Mobile)

```
┌───────────────────────────┐
│  ← Back      WO-2024-0235 │
├───────────────────────────┤
│                           │
│  🔴 EMERGENCY             │
│  Lift stuck on floor 3    │
│                           │
│  STATUS: In Progress      │
│  ⏱️ 00:45:32              │
│                           │
│  ──── SITE INFO ────      │
│  Collins Tower            │
│  123 Collins St, Melb     │
│                           │
│  Access: Gate code 1234   │
│  Contact: John 0400123456 │
│                           │
│  [📍 Navigate] [📞 Call]  │
│                           │
│  ──── EQUIPMENT ────      │
│  Lift 1                   │
│  KONE MonoSpace 500       │
│  Serial: KM-2015-78234    │
│                           │
│  Known quirks:            │
│  • Door sensor sensitive  │
│  • Reboot for E15 fault   │
│                           │
│  ──── AI DIAGNOSIS ────   │
│  ┌───────────────────────┐│
│  │ 🤖 Triforce Analysis  ││
│  │                       ││
│  │ Likely cause: Door    ││
│  │ obstruction sensor    ││
│  │ (85% confidence)      ││
│  │                       ││
│  │ Suggested parts:      ││
│  │ • Light curtain       ││
│  │ • Door operator belt  ││
│  │                       ││
│  │ [View Full Analysis]  ││
│  └───────────────────────┘│
│                           │
│  ──── LOG WORK ────       │
│  [+ Add Parts]            │
│  [+ Add Notes]            │
│  [📷 Take Photo]          │
│                           │
│  Parts used:              │
│  • Light curtain (1) ✓    │
│                           │
│  Notes:                   │
│  • Found broken sensor    │
│                           │
│  [Complete Job]           │
│                           │
└───────────────────────────┘
```

---

## Default Views and Filters by Role

### Work Orders Default View

| Role | Default Filter | Sort Order |
|------|----------------|------------|
| Owner | All | Priority, then Date |
| Admin | All | Priority, then Date |
| Manager | Open (not completed/cancelled) | Priority, then Date |
| User | My Created | Date (newest first) |
| Technician | My Assigned | Priority, then Scheduled Time |
| Readonly | All | Date (newest first) |

### Sites Default View

| Role | Default Filter | Sort Order |
|------|----------------|------------|
| Owner | All | Name A-Z |
| Admin | All | Name A-Z |
| Manager | My Sites (if assigned) | Health Score (worst first) |
| User | All | Name A-Z |
| Technician | Sites with Assigned Jobs | Next Job Date |
| Readonly | All | Name A-Z |

### Dashboard Time Range

| Role | Default Range |
|------|---------------|
| Owner | Last 30 days |
| Admin | Last 7 days |
| Manager | Today + Next 7 days |
| User | Today |
| Technician | Today |
| Readonly | Last 7 days |

---

## Mobile vs Desktop Differences

### Technician Experience

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Navigation | Bottom tab bar | Left sidebar |
| Job List | Card stack | Table with filters |
| Job Actions | Floating action buttons | Toolbar buttons |
| Photos | Camera capture | Upload from device |
| Timer | Large, prominent | Compact in header |
| AI Diagnosis | Expandable card | Side panel |
| Parts Logging | Bottom sheet | Modal dialog |
| Signature | Touch signature | Mouse/touch signature |

### Manager Experience

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Dashboard | Scrolling cards | Grid layout |
| Site Health | List view | Table with charts |
| Work Orders | Card list | Full table |
| Reports | Basic charts | Advanced analytics |
| Bulk Actions | Not available | Full bulk selection |

---

## First-Time User Experience by Role

### Owner Onboarding

```
Step 1: Welcome & Organization Setup
├── Confirm organization name
├── Set timezone and currency
└── Upload logo (optional)

Step 2: Create First Site
├── Add building name and address
└── Add first elevator

Step 3: Invite Team
├── Invite admin/managers
└── Set up contractor (optional)

Step 4: Quick Tour
├── Dashboard overview
├── Creating work orders
└── Viewing reports
```

### Technician Onboarding

```
Step 1: Welcome
├── Download mobile app prompt
└── Profile setup (name, phone)

Step 2: Mobile App Tour
├── Viewing your jobs
├── Starting and completing work
├── Using AI diagnosis
└── Logging parts and time

Step 3: First Job Simulation
├── Sample job walkthrough
└── Practice completing a job
```

---

## View Customization Options

### User-Configurable Settings

| Setting | Options | Default |
|---------|---------|---------|
| Theme | Light, Dark, System | System |
| Dashboard Layout | Cards, Compact, Table | Cards |
| Items Per Page | 10, 25, 50, 100 | 25 |
| Date Format | DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD | DD/MM/YYYY |
| Time Format | 12h, 24h | 24h |
| Default Work Order View | All, My Created, My Assigned | Role default |
| Sidebar Collapsed | Yes, No | No |
| Week Start Day | Sunday, Monday | Monday |

### Dashboard Widget Configuration (Manager+)

Available widgets (can add/remove/reorder):

- **Site Health Summary** - Health scores for sites
- **Work Order Pipeline** - Status breakdown
- **Emergency Alerts** - Critical issues
- **Inspection Calendar** - Upcoming inspections
- **Contractor Performance** - Metrics table
- **Recent Activity** - Activity feed
- **My Stats** - Personal metrics
- **Team Performance** - Team metrics (Admin+)
- **Financial Summary** - Revenue/costs (Owner)

### Saved Filters

Users can save custom filter combinations:

```json
{
  "name": "My Emergency WOs",
  "entity": "work_orders",
  "filters": {
    "priority": "emergency",
    "status": ["pending", "scheduled", "in_progress"],
    "created_by": "me"
  },
  "is_default": false,
  "show_in_sidebar": true
}
```

---

## Information Density by Role

### Work Order List Columns

| Column | Owner | Admin | Manager | User | Tech | Readonly |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|
| WO Number | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Title | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Site | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Asset | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Priority | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Status | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Contractor | ✓ | ✓ | ✓ | - | - | ✓ |
| Created By | - | ✓ | ✓ | - | - | - |
| Created Date | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| Scheduled Date | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cost | ✓ | ✓ | ✓ | - | - | - |
| SLA Status | ✓ | ✓ | ✓ | - | - | - |

### Asset Detail Sections

| Section | Owner | Admin | Manager | User | Tech | Readonly |
|---------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|
| Basic Info | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Specifications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Health Score | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Work History | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Compliance | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AI Quirks | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Documents | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cost Analysis | ✓ | ✓ | ✓ | - | - | - |
| Audit Trail | ✓ | ✓ | - | - | - | - |

---

## Empty States by Role

### No Work Orders (Manager)

```
┌─────────────────────────────────────┐
│                                     │
│         📋                          │
│                                     │
│    No open work orders              │
│                                     │
│    Great news! All your sites are   │
│    running smoothly.                │
│                                     │
│    [View Completed] [Create New]    │
│                                     │
└─────────────────────────────────────┘
```

### No Assigned Jobs (Technician)

```
┌─────────────────────────────────────┐
│                                     │
│         ✓                           │
│                                     │
│    No jobs assigned                 │
│                                     │
│    You're all caught up! Check      │
│    back later for new assignments.  │
│                                     │
│    [View Schedule]                  │
│                                     │
└─────────────────────────────────────┘
```

### No Sites (New User)

```
┌─────────────────────────────────────┐
│                                     │
│         🏢                          │
│                                     │
│    No sites yet                     │
│                                     │
│    Add your first building to get   │
│    started with SiteSync.           │
│                                     │
│    [+ Add Site]                     │
│                                     │
└─────────────────────────────────────┘
```

---

## Contextual Actions by Role

### Quick Actions Menu

| Action | Owner | Admin | Manager | User | Tech | Readonly |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|
| Create Work Order | ✓ | ✓ | ✓ | ✓ | - | - |
| Create Site | ✓ | ✓ | ✓ | - | - | - |
| Add Asset | ✓ | ✓ | ✓ | ✓ | - | - |
| Add Contractor | ✓ | ✓ | ✓ | - | - | - |
| Invite User | ✓ | ✓ | - | - | - | - |
| Export Report | ✓ | ✓ | ✓ | - | - | - |
| Start Job | - | - | - | - | ✓ | - |
| Request AI Diagnosis | ✓ | ✓ | ✓ | ✓ | ✓ | - |

---

## Notification Badges by Role

### Where badges appear

| Location | What it shows | Roles |
|----------|---------------|-------|
| Bell icon | Unread notifications | All |
| Work Orders nav | Emergency count | Admin, Manager |
| My Jobs nav | Today's jobs count | Technician |
| Contractors nav | Pending invites | Admin, Manager |
| Inventory nav | Low stock alerts | Admin, Manager |
| Settings nav | Action required | Owner, Admin |

---

**[← Previous: Parts & Inventory](13-parts-inventory-profiles.md)** | **[Next: Search & Filtering →](15-search-filtering-architecture.md)**
