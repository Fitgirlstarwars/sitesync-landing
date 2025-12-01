# SiteSync V3 - Enterprise Facilities Management

## Portfolio-Scale Building Intelligence

> This document details how SiteSync serves large Facilities Management companies managing hundreds or thousands of buildings across regions, countries, and continents.

---

```
         YOUR BUILDING. YOUR DATA. YOUR INTELLIGENCE.

                  Contractors come and go.
                  Your building remembers forever.

         At portfolio scale: Every building remembers.
```

---

## The Enterprise FM Opportunity

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   Large FM companies face a unique challenge:                    ║
║                                                                  ║
║   They manage buildings they don't own, using contractors they   ║
║   don't employ, with data scattered across dozens of systems.    ║
║                                                                  ║
║   SiteSync gives them unified intelligence across their         ║
║   entire portfolio—while ensuring building owners retain         ║
║   permanent ownership of their data.                             ║
║                                                                  ║
║   Everyone wins.                                                 ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Who This Is For

### Target Organizations

| Type | Examples | Portfolio Size |
|------|----------|----------------|
| **Global FM Giants** | CBRE, JLL, Cushman & Wakefield | 10,000+ buildings |
| **Regional Leaders** | Colliers, Knight Frank, Savills | 1,000-10,000 buildings |
| **National Players** | Local FM leaders per country | 100-1,000 buildings |
| **Specialist FM** | Healthcare, education, government | 50-500 buildings |
| **Property Funds** | REITs, pension funds, sovereign wealth | 50-500 buildings |

### The FM Company Pain Points

```
CURRENT STATE: FRAGMENTED CHAOS
═══════════════════════════════════════════════════════════════════

Portfolio: 500 Buildings Across 3 Regions

Region A (200 buildings)
├── CMMS System: Fiix
├── Contractors: 12 different companies
├── Data Format: Their own
└── History: Partial, scattered

Region B (180 buildings)
├── CMMS System: UpKeep
├── Contractors: 8 different companies
├── Data Format: Different
└── History: Incomplete

Region C (120 buildings)
├── CMMS System: Spreadsheets
├── Contractors: 15 different companies
├── Data Format: Chaos
└── History: What history?

RESULT:
• No portfolio-wide visibility
• Can't benchmark buildings against each other
• Compliance tracking is manual nightmare
• Every new building starts from zero
• Losing buildings means losing data

═══════════════════════════════════════════════════════════════════
```

---

## The SiteSync Solution

### Unified Portfolio Intelligence

```
WITH SITESYNC: UNIFIED CLARITY
═══════════════════════════════════════════════════════════════════

Portfolio: 500 Buildings - Single Platform

┌─────────────────────────────────────────────────────────────────┐
│                    PORTFOLIO DASHBOARD                          │
│                                                                 │
│  Overall Health Score: 76                                       │
│  [████████████████████████████░░░░░░░░░░]                      │
│                                                                 │
│  Buildings: 500  │  Equipment: 3,247  │  Open Jobs: 127        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  REGION BREAKDOWN                                               │
│  ─────────────────────────────────────────────────────────────  │
│  Region A (200)    [████████████████████] 82  ▲ +3             │
│  Region B (180)    [█████████████████░░░] 74  ─ 0              │
│  Region C (120)    [██████████████░░░░░░] 68  ▼ -2             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ATTENTION REQUIRED                                             │
│  ─────────────────────────────────────────────────────────────  │
│  ! 3 buildings with health score < 50                          │
│  ! 12 compliance certificates expiring in 30 days              │
│  ! 2 contractors with declining performance                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

RESULT:
• Portfolio-wide visibility in real-time
• Benchmark any building against any other
• Automated compliance tracking
• New buildings come with full history
• Building owners keep their data when contracts end

═══════════════════════════════════════════════════════════════════
```

---

## Organizational Hierarchy

### Multi-Level Structure

```
ENTERPRISE HIERARCHY
═══════════════════════════════════════════════════════════════════

FM COMPANY (Tenant)
│
├── PORTFOLIO (optional grouping)
│   │
│   ├── REGION / DISTRICT
│   │   │
│   │   ├── BUILDING (Site)
│   │   │   │
│   │   │   ├── TRADE (Elevators, HVAC, etc.)
│   │   │   │   │
│   │   │   │   └── EQUIPMENT (Individual assets)
│   │   │   │
│   │   │   └── TRADE
│   │   │       └── EQUIPMENT
│   │   │
│   │   └── BUILDING
│   │       └── ...
│   │
│   └── REGION
│       └── ...
│
└── PORTFOLIO
    └── ...

═══════════════════════════════════════════════════════════════════
```

### Hierarchy Configuration

```python
# Example: Large FM Company Structure

fm_company = Organization(
    name="CBRE Australia",
    type="facilities_management",
    tier="enterprise"
)

portfolios = [
    Portfolio(
        name="NSW Commercial",
        regions=[
            Region(
                name="Sydney CBD",
                buildings=[
                    Building(name="123 Pitt Street", ...),
                    Building(name="200 George Street", ...),
                    # ... 50 more buildings
                ]
            ),
            Region(
                name="North Sydney",
                buildings=[...]
            ),
        ]
    ),
    Portfolio(
        name="VIC Commercial",
        regions=[...]
    ),
    Portfolio(
        name="Government Contracts",
        regions=[...]
    ),
]
```

---

## Data Ownership Model

### The Key Question: Who Owns What?

```
DATA OWNERSHIP IN FM RELATIONSHIPS
═══════════════════════════════════════════════════════════════════

BUILDING OWNER (e.g., Property Fund)
│
│   Owns: The building and all data about it
│   │
│   └── Contracts FM Company to manage
│
FM COMPANY (e.g., CBRE)
│
│   Manages: Operations on behalf of owner
│   Accesses: Building data (with owner permission)
│   Owns: Their operational insights, processes, analytics
│   │
│   └── Contracts Service Providers
│
SERVICE PROVIDER (e.g., Elevator Contractor)
│
│   Performs: Actual service work
│   Logs: Work to building record
│   Owns: Their company data, technician data

═══════════════════════════════════════════════════════════════════
```

### Ownership Scenarios

**Scenario 1: FM Company Wins New Building Contract**

```
BEFORE: Building managed by different FM
────────────────────────────────────────────────────────────────

Building: 123 Collins Street
Previous FM: JLL (5 years of history)
History Status: ✓ Complete in SiteSync

TRANSITION:
────────────────────────────────────────────────────────────────

1. Building owner grants access to new FM (CBRE)
2. New FM immediately sees 5 years of complete history
3. No data migration needed
4. No "starting from zero"
5. Full context from day one

AFTER: Building managed by CBRE
────────────────────────────────────────────────────────────────

Building: 123 Collins Street
Current FM: CBRE
History Status: ✓ Complete (5 years + ongoing)

THE VALUE:
• CBRE wins because they have full context immediately
• Building owner wins because no disruption
• Data integrity maintained through transition
```

**Scenario 2: FM Company Loses Building Contract**

```
SITUATION: CBRE loses 123 Collins Street contract
────────────────────────────────────────────────────────────────

WHAT CBRE KEEPS:
✓ Their operational analytics
✓ Contractor performance data (aggregate)
✓ Process documentation they created
✓ Benchmarking data (anonymized)
✓ Knowledge they contributed

WHAT STAYS WITH BUILDING:
✓ All service history
✓ Equipment records
✓ Compliance documents
✓ AI insights about the building
✓ Technician notes and photos

WHAT NEW FM (SAVILLS) GETS:
✓ Complete building history
✓ Full equipment context
✓ All compliance records
✓ Immediate operational readiness

EVERYONE WINS:
• Building owner: Uninterrupted data continuity
• CBRE: Keeps their business intelligence
• Savills: Full context from day one
• No data held hostage
```

**Scenario 3: Building Owner Changes**

```
SITUATION: Property fund sells 123 Collins Street
────────────────────────────────────────────────────────────────

DATA TRANSFER:

Option A: New owner takes over SiteSync account
• Ownership transfers with property
• Complete history maintained
• FM relationship continues or changes

Option B: New owner exports data
• Full export provided
• History archived
• New owner can import to their system

Option C: New owner not using SiteSync
• History preserved in archive
• Available if they sign up later
• Building never loses its memory
```

---

## Portfolio-Level Features

### 1. Portfolio Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  PORTFOLIO OVERVIEW                            December 2025    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  KEY METRICS                                                    │
│  ───────────────────────────────────────────────────────────    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Buildings   │  │ Equipment   │  │ Open Jobs   │             │
│  │    500      │  │   3,247     │  │    127      │             │
│  │  ▲ +12 MTD  │  │  ▲ +89 MTD  │  │  ▼ -23 WoW  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Health Avg  │  │ Compliance  │  │ Response    │             │
│  │    76/100   │  │   94.2%     │  │   2.3 hrs   │             │
│  │  ▲ +2 MoM   │  │  ▲ +1.2%    │  │  ▼ -18 min  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HEALTH DISTRIBUTION                                            │
│  ───────────────────────────────────────────────────────────    │
│                                                                 │
│  Excellent (90-100)  ████████████ 89 buildings (18%)           │
│  Good (70-89)        ████████████████████████████ 298 (60%)    │
│  Fair (50-69)        ████████████ 94 buildings (19%)           │
│  Poor (<50)          ██ 19 buildings (4%)                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ALERTS                                                         │
│  ───────────────────────────────────────────────────────────    │
│                                                                 │
│  🔴 CRITICAL (3)                                                │
│     • 200 George St - Elevator trapped passenger (15 min ago)  │
│     • Tower Plaza - Fire panel fault                           │
│     • 55 Market St - Health score dropped to 42                │
│                                                                 │
│  🟡 WARNING (12)                                                │
│     • 8 compliance certificates expiring in 14 days            │
│     • 4 buildings trending downward                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Cross-Portfolio Benchmarking

```
BENCHMARKING CAPABILITIES
═══════════════════════════════════════════════════════════════════

BUILDING VS BUILDING
────────────────────
Compare any building to any other:
• Health scores
• Maintenance costs per sqm
• Incident frequency
• First-time fix rates
• Contractor performance

REGION VS REGION
────────────────
Compare regions/districts:
• Aggregate health
• Cost efficiency
• Compliance rates
• Response times

PORTFOLIO VS INDUSTRY
─────────────────────
Compare to anonymized benchmarks:
• How do your buildings compare to similar buildings?
• Industry average metrics
• Best-in-class targets

EXAMPLE INSIGHT:
───────────────
"Your Melbourne CBD portfolio has 23% higher maintenance
costs than Sydney CBD, but 15% fewer breakdowns. The
investment in preventive maintenance is paying off."
```

### 3. Compliance Command Center

```
┌─────────────────────────────────────────────────────────────────┐
│  COMPLIANCE CENTER                              Portfolio: All   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OVERALL COMPLIANCE                                             │
│  ───────────────────────────────────────────────────────────    │
│                                                                 │
│  [████████████████████████████████████░░░] 94.2% Compliant     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Status          │ Buildings │ Equipment │ Action        │    │
│  ├─────────────────┼───────────┼───────────┼───────────────┤    │
│  │ ✓ Compliant     │ 471       │ 3,058     │ None          │    │
│  │ ⚠ Expiring Soon │ 23        │ 156       │ Schedule Now  │    │
│  │ ✗ Overdue       │ 6         │ 33        │ URGENT        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  EXPIRING IN NEXT 30 DAYS                                       │
│  ───────────────────────────────────────────────────────────    │
│                                                                 │
│  Building              Equipment           Expires    Status    │
│  ─────────────────────────────────────────────────────────────  │
│  123 Pitt Street       Elevator 1          Dec 15    Scheduled │
│  200 George Street     Elevator 2          Dec 18    Scheduled │
│  Tower Plaza           Escalator 1         Dec 20    UNSCHEDULED│
│  ...                                                            │
│                                                                 │
│  [ Export Report ]  [ Schedule All ]  [ Notify Contractors ]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Contractor Performance Tracking

```
CONTRACTOR PERFORMANCE ACROSS PORTFOLIO
═══════════════════════════════════════════════════════════════════

ELEVATOR CONTRACTORS (Ranked by Performance Score)
──────────────────────────────────────────────────────────────────

Rank  Contractor           Buildings  FTF Rate  Response  Score
────  ─────────────────    ─────────  ────────  ────────  ─────
1     KONE Direct          89         94%       1.8 hrs   92
2     Schindler Service    67         91%       2.1 hrs   88
3     Otis Signature       45         89%       2.4 hrs   85
4     ThyssenKrupp        38         87%       2.2 hrs   83
5     ABC Elevators        34         85%       1.9 hrs   82
6     Local Lift Co        28         82%       3.1 hrs   74
...

INSIGHTS:
─────────
• KONE Direct outperforming on FTF rate (+9% vs average)
• Local Lift Co struggling with response times
• Consider consolidating to top performers

ACTIONS:
────────
[ Generate Performance Report ]
[ Schedule Contractor Review ]
[ Adjust Preferred Contractor List ]

═══════════════════════════════════════════════════════════════════
```

### 5. Cost Analytics

```
PORTFOLIO COST ANALYSIS
═══════════════════════════════════════════════════════════════════

ANNUAL SPEND OVERVIEW
─────────────────────
Total Maintenance Spend:     $4,234,000
Per Building Average:        $8,468
Per Square Meter:            $12.34

BREAKDOWN BY TRADE
──────────────────
Elevators        $1,856,000  (44%)  ████████████████████████
HVAC             $1,269,000  (30%)  ██████████████
Electrical       $423,000    (10%)  █████
Fire Systems     $338,000    (8%)   ████
Other            $348,000    (8%)   ████

BREAKDOWN BY TYPE
─────────────────
Preventive       $2,117,000  (50%)  ██████████████████████
Breakdown        $1,270,000  (30%)  ██████████████
Compliance       $635,000    (15%)  ███████
Emergency        $212,000    (5%)   ███

COST TRENDS
───────────
This Year vs Last Year:
• Total spend: ▼ -8% ($368,000 saved)
• Breakdown costs: ▼ -15% (preventive investment paying off)
• Emergency costs: ▼ -22% (better response times)

OPTIMIZATION OPPORTUNITIES
──────────────────────────
• 12 buildings have above-average costs - review needed
• Consolidating HVAC contractors could save ~$120,000/year
• Predictive maintenance could reduce breakdowns by 20%

═══════════════════════════════════════════════════════════════════
```

---

## User Management at Scale

### Role Hierarchy

```
ENTERPRISE USER ROLES
═══════════════════════════════════════════════════════════════════

EXECUTIVE LEVEL
───────────────
Portfolio Director
├── View: All portfolios, all buildings
├── Access: Strategic dashboards, executive reports
├── Actions: High-level configuration, approvals
└── Typical: 2-5 per organization

REGIONAL LEVEL
──────────────
Regional Manager
├── View: Assigned regions/portfolios
├── Access: Regional dashboards, performance reports
├── Actions: Contractor management, escalations
└── Typical: 5-20 per organization

BUILDING LEVEL
──────────────
Facility Manager
├── View: Assigned buildings only
├── Access: Building dashboards, work orders
├── Actions: Day-to-day operations, contractor coordination
└── Typical: 50-500 per organization

SPECIALIST ROLES
────────────────
Compliance Manager
├── View: Compliance data across portfolio
├── Access: Compliance center, certificate management
├── Actions: Schedule inspections, manage certificates
└── Typical: 2-10 per organization

Finance Analyst
├── View: Cost data across portfolio
├── Access: Cost analytics, invoicing
├── Actions: Budget tracking, cost analysis
└── Typical: 2-10 per organization

Contractor Coordinator
├── View: Contractor performance data
├── Access: Contractor management, assignment
├── Actions: Onboard contractors, manage relationships
└── Typical: 5-20 per organization

═══════════════════════════════════════════════════════════════════
```

### Permission Templates

```python
# Pre-configured role templates for rapid deployment

role_templates = {
    "portfolio_director": {
        "scope": "all_portfolios",
        "buildings": "read",
        "work_orders": "read",
        "compliance": "read",
        "costs": "read",
        "contractors": "read",
        "users": "manage",
        "reports": "all",
        "settings": "manage"
    },

    "regional_manager": {
        "scope": "assigned_regions",
        "buildings": "read_write",
        "work_orders": "read_write",
        "compliance": "read_write",
        "costs": "read",
        "contractors": "manage",
        "users": "manage_region",
        "reports": "region",
        "settings": "region"
    },

    "facility_manager": {
        "scope": "assigned_buildings",
        "buildings": "read",
        "work_orders": "read_write",
        "compliance": "read",
        "costs": "view_building",
        "contractors": "coordinate",
        "users": "none",
        "reports": "building",
        "settings": "none"
    },

    "compliance_manager": {
        "scope": "all_buildings",
        "buildings": "read",
        "work_orders": "read",
        "compliance": "manage_all",
        "costs": "none",
        "contractors": "read",
        "users": "none",
        "reports": "compliance",
        "settings": "compliance"
    }
}
```

### SSO Integration

```
ENTERPRISE SSO SUPPORT
═══════════════════════════════════════════════════════════════════

SUPPORTED PROVIDERS
───────────────────
• Azure Active Directory
• Okta
• Google Workspace
• OneLogin
• Ping Identity
• Custom SAML 2.0
• Custom OIDC

FEATURES
────────
• Just-in-time user provisioning
• Group-based role assignment
• Automatic deprovisioning
• MFA enforcement via IdP
• Session management

EXAMPLE: AZURE AD MAPPING
─────────────────────────
Azure AD Group                → SiteSync Role
────────────────────────────────────────────────
FM-Portfolio-Directors        → portfolio_director
FM-Regional-Managers-NSW      → regional_manager (NSW)
FM-Regional-Managers-VIC      → regional_manager (VIC)
FM-Facility-Managers          → facility_manager
FM-Compliance-Team            → compliance_manager

═══════════════════════════════════════════════════════════════════
```

---

## Enterprise Integrations

### ERP Integration

```
ERP INTEGRATION ARCHITECTURE
═══════════════════════════════════════════════════════════════════

SUPPORTED SYSTEMS
─────────────────
• SAP (S/4HANA, ECC)
• Oracle (Cloud, E-Business Suite)
• Microsoft Dynamics 365
• Workday
• NetSuite

DATA FLOWS
──────────

SiteSync → ERP
───────────────
• Work order costs → Cost center allocation
• Contractor invoices → Accounts payable
• Asset data → Fixed asset register
• Compliance status → Risk management

ERP → SiteSync
───────────────
• Cost center structure → Portfolio hierarchy
• Vendor master → Contractor records
• Budget allocations → Spending limits
• Employee data → User provisioning

INTEGRATION METHODS
───────────────────
• REST API (real-time)
• Batch file exchange (daily/weekly)
• Middleware (MuleSoft, Dell Boomi, etc.)
• Direct database connectors

═══════════════════════════════════════════════════════════════════
```

### BMS/BAS Integration

```
BUILDING MANAGEMENT SYSTEM INTEGRATION
═══════════════════════════════════════════════════════════════════

SUPPORTED PROTOCOLS
───────────────────
• BACnet (IP, MS/TP)
• Modbus (TCP, RTU)
• OPC-UA
• REST APIs (vendor-specific)

USE CASES
─────────
1. Automatic Fault Detection
   BMS detects HVAC fault → Creates SiteSync work order

2. Performance Monitoring
   BMS sends runtime data → SiteSync tracks equipment health

3. Energy Correlation
   BMS energy data + SiteSync maintenance data → Insights

4. Predictive Maintenance
   BMS sensor trends + SiteSync history → Failure prediction

EXAMPLE FLOW
────────────
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│     BMS     │ ──► │  SiteSync  │ ──► │   Action    │
│  Fault Alert│     │ Work Order  │     │  Dispatch   │
└─────────────┘     └─────────────┘     └─────────────┘

═══════════════════════════════════════════════════════════════════
```

### Reporting Integration

```
BUSINESS INTELLIGENCE INTEGRATION
═══════════════════════════════════════════════════════════════════

SUPPORTED PLATFORMS
───────────────────
• Power BI
• Tableau
• Looker
• Qlik
• Custom BI solutions

DATA EXPORT OPTIONS
───────────────────
• Scheduled data exports (CSV, JSON)
• Direct database connection (read replica)
• REST API for real-time queries
• Pre-built data models

SAMPLE POWER BI DASHBOARD
─────────────────────────
┌─────────────────────────────────────────────────────────────────┐
│  FM COMPANY - EXECUTIVE DASHBOARD                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────┐  ┌───────────────────┐                  │
│  │ Portfolio Health  │  │ Spend vs Budget   │                  │
│  │     [GAUGE]       │  │    [BAR CHART]    │                  │
│  │       76          │  │                   │                  │
│  └───────────────────┘  └───────────────────┘                  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Health Trend by Region (12 months)                        │  │
│  │                              [LINE CHART]                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Contractor Performance Matrix                             │  │
│  │                            [SCATTER PLOT]                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
```

---

## Client Reporting

### White-Label Reports

```
CLIENT-FACING REPORTS
═══════════════════════════════════════════════════════════════════

FM companies can generate branded reports for building owners:

REPORT TYPES
────────────
• Monthly Performance Summary
• Quarterly Business Review
• Annual Compliance Report
• Ad-hoc Incident Reports
• Budget vs Actual Analysis

BRANDING OPTIONS
────────────────
• FM company logo
• Custom color scheme
• Custom cover page
• Co-branded (FM + Building Owner)
• White-label (no SiteSync branding)

DELIVERY OPTIONS
────────────────
• Scheduled email delivery
• Client portal access
• API for client systems
• PDF download

SAMPLE REPORT STRUCTURE
───────────────────────
┌─────────────────────────────────────────────────────────────────┐
│  [FM COMPANY LOGO]                                              │
│                                                                 │
│  MONTHLY PROPERTY REPORT                                        │
│  123 Collins Street | November 2025                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EXECUTIVE SUMMARY                                              │
│  Your building health score improved to 82 this month,         │
│  up from 78 last month. All compliance requirements are        │
│  current. Two preventive maintenance visits were completed.    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  KEY METRICS                                                    │
│  • Health Score: 82 (▲ +4)                                     │
│  • Work Orders: 5 completed                                    │
│  • Response Time: 1.8 hours average                            │
│  • Compliance: 100% current                                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SERVICE ACTIVITY                                               │
│  [Detailed work order summary]                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  COST SUMMARY                                                   │
│  [Month spend, YTD, vs budget]                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════
```

---

## Enterprise Pricing

### Volume Pricing Structure

```
ENTERPRISE PRICING MODEL
═══════════════════════════════════════════════════════════════════

BUILDING VOLUME PRICING
───────────────────────
Buildings         Per Building/Month      Annual Commitment
──────────        ─────────────────       ─────────────────
1-50              $29                     Optional
51-100            $24 (17% discount)      Required
101-250           $19 (34% discount)      Required
251-500           $15 (48% discount)      Required
501-1000          $12 (59% discount)      Required
1000+             Custom                  Required

ENTERPRISE ADD-ONS
──────────────────
Feature                          Price
───────────────────────────      ─────────────────
SSO Integration                  Included (100+ buildings)
Custom Integrations              $5,000-25,000 setup
Dedicated Support Manager        Included (250+ buildings)
Custom Reporting                 $2,000/month
White-Label Reports              $500/month
API Premium (higher limits)      $1,000/month
Data Residency (specific region) $2,000/month

EXAMPLE: 500 BUILDING PORTFOLIO
───────────────────────────────
Base: 500 × $15 = $7,500/month ($90,000/year)
Add-ons:
  + SSO: Included
  + Custom BI Integration: $15,000 one-time
  + White-Label Reports: $500/month ($6,000/year)
  + Dedicated CSM: Included

Total Year 1: $111,000
Total Year 2+: $96,000/year

COMPARED TO ALTERNATIVES:
• 500 buildings × $200/month (typical CMMS) = $1.2M/year
• SiteSync saves ~$1.1M/year with better functionality

═══════════════════════════════════════════════════════════════════
```

---

## Implementation Process

### Enterprise Onboarding

```
ENTERPRISE IMPLEMENTATION TIMELINE
═══════════════════════════════════════════════════════════════════

PHASE 1: DISCOVERY (Week 1-2)
─────────────────────────────
□ Stakeholder alignment workshop
□ Current state assessment
□ Data inventory and mapping
□ Integration requirements
□ Success criteria definition

PHASE 2: SETUP (Week 3-4)
─────────────────────────
□ Organization structure configuration
□ User role definition
□ SSO integration
□ Initial data migration
□ Integration development (if needed)

PHASE 3: PILOT (Week 5-8)
─────────────────────────
□ Select pilot region (50-100 buildings)
□ User training (train-the-trainer)
□ Pilot launch
□ Feedback collection
□ Iteration and refinement

PHASE 4: ROLLOUT (Week 9-16)
────────────────────────────
□ Phased regional rollout
□ Ongoing training
□ Data migration completion
□ Full integration activation
□ Go-live support

PHASE 5: OPTIMIZATION (Ongoing)
───────────────────────────────
□ Quarterly business reviews
□ Performance optimization
□ Feature enhancement requests
□ Continuous improvement

═══════════════════════════════════════════════════════════════════
```

### Dedicated Support

```
ENTERPRISE SUPPORT MODEL
═══════════════════════════════════════════════════════════════════

DEDICATED CUSTOMER SUCCESS MANAGER
──────────────────────────────────
• Named CSM for your account
• Quarterly business reviews
• Escalation path
• Feature request advocacy
• Best practice guidance

SUPPORT CHANNELS
────────────────
• Priority support queue (4-hour response)
• Direct Slack channel (optional)
• Phone support for critical issues
• On-site support (as needed)

TRAINING RESOURCES
──────────────────
• Custom training programs
• Train-the-trainer sessions
• Role-based training materials
• Video library access
• Certification program

SERVICE LEVEL AGREEMENT
───────────────────────
• 99.9% uptime guarantee
• Scheduled maintenance windows
• Incident communication SLA
• Data backup guarantees
• Disaster recovery commitments

═══════════════════════════════════════════════════════════════════
```

---

## Success Stories (Templates)

### Large FM Company

```
CASE STUDY: [FM COMPANY NAME]
═══════════════════════════════════════════════════════════════════

PROFILE
───────
• 800 buildings under management
• 3 regions (NSW, VIC, QLD)
• 45 facility managers
• 120+ contractors

CHALLENGE
─────────
• Fragmented data across 5 different systems
• No portfolio-wide visibility
• Compliance tracking was manual
• New contracts started from zero

SOLUTION
────────
• Deployed SiteSync across entire portfolio
• Integrated with existing ERP (SAP)
• Centralized compliance management
• Standardized contractor onboarding

RESULTS (12 months)
───────────────────
• Portfolio health visibility: 0% → 100%
• Compliance tracking time: -85%
• New contract onboarding: 2 weeks → 2 days
• Contractor performance: +15% improvement
• Annual savings: $800,000+

QUOTE
─────
"For the first time, we can see our entire portfolio on one screen.
When we win new buildings, we have full history from day one.
This is transformational for how we manage properties."

— Regional Director, [FM Company]

═══════════════════════════════════════════════════════════════════
```

---

## Why FM Companies Choose SiteSync

### The Value Proposition

```
FOR FM COMPANIES
═══════════════════════════════════════════════════════════════════

1. WIN MORE CONTRACTS
   • Demonstrate data-driven management
   • Show building owners what you'll deliver
   • Differentiate from competitors

2. ONBOARD FASTER
   • New buildings come with full history
   • No starting from zero
   • Immediate operational readiness

3. OPERATE BETTER
   • Portfolio-wide visibility
   • Benchmark buildings against each other
   • Identify and fix underperformers

4. REDUCE COSTS
   • Prevent breakdowns with AI insights
   • Optimize contractor selection
   • Reduce compliance overhead

5. RETAIN CLIENTS
   • Transparent reporting
   • Demonstrable value
   • Data-backed recommendations

6. SCALE EFFICIENTLY
   • Add buildings without adding systems
   • Standardized processes
   • Centralized management

THE BOTTOM LINE:
────────────────
FM companies that use SiteSync manage more buildings,
more efficiently, with better outcomes—and they can prove it.

═══════════════════════════════════════════════════════════════════
```

---

## Getting Started

### Contact Enterprise Sales

```
ENTERPRISE INQUIRIES
═══════════════════════════════════════════════════════════════════

Ready to transform your portfolio management?

Email: enterprise@sitesync.com
Phone: 1800-XXX-XXX (Australia)
Web: sitesync.com/enterprise

REQUEST INCLUDES:
─────────────────
□ Portfolio size (number of buildings)
□ Geographic regions
□ Current systems in use
□ Key pain points
□ Timeline

WE'LL PROVIDE:
──────────────
□ Custom demo for your use case
□ ROI analysis
□ Implementation proposal
□ Reference customers
□ Pricing proposal

═══════════════════════════════════════════════════════════════════
```

---

**[← Back to FAQ](../faq.md)** | **[Back to Documentation Hub →](../README.md)**
