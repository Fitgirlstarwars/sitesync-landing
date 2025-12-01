# SiteSync V3 - System Overview

> **The Foundation Document** - Read this first to understand how SiteSync works as a system.

---

## What is SiteSync?

SiteSync is an **AI-native building services operating system** designed for the vertical transportation (elevator/lift) industry, with plans to expand to other building trades (HVAC, electrical, plumbing).

**Core Philosophy**: Buildings own their service history permanently. When contractors change, data stays with the building.

---

## System Purpose

SiteSync solves three critical problems:

| Problem | Solution |
|---------|----------|
| **Data Loss** | When contractors change, service history is lost | Building-centric data ownership |
| **Knowledge Silos** | Expert knowledge trapped in individual technicians | AI-powered knowledge sharing |
| **Operational Chaos** | Paper-based, disconnected workflows | Unified digital platform |

---

## Multi-Tenant Architecture

SiteSync is a **multi-tenant SaaS platform** where each Organization is completely isolated from others.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SITESYNC PLATFORM                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  ORGANIZATION A  │  │  ORGANIZATION B  │  │  ORGANIZATION C  │  │
│  │  (Service Co.)   │  │  (Building Owner)│  │  (Manufacturer)  │  │
│  │                  │  │                  │  │                  │  │
│  │  ├─ Users        │  │  ├─ Users        │  │  ├─ Users        │  │
│  │  ├─ Sites        │  │  ├─ Sites        │  │  ├─ Sites        │  │
│  │  ├─ Assets       │  │  ├─ Assets       │  │  ├─ Assets       │  │
│  │  ├─ Work Orders  │  │  ├─ Work Orders  │  │  ├─ Work Orders  │  │
│  │  └─ Contractors  │  │  └─ Contractors  │  │  └─ Contractors  │  │
│  │                  │  │                  │  │                  │  │
│  │  [ISOLATED]      │  │  [ISOLATED]      │  │  [ISOLATED]      │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                      │
│                    ════════════════════════                          │
│                    SHARED PLATFORM SERVICES                          │
│                    ════════════════════════                          │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │ Triforce AI     │  │ Knowledge Base  │  │ Marketplace     │     │
│  │ (Diagnosis)     │  │ (Shared Docs)   │  │ (Parts Trading) │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Tenant Isolation via Row-Level Security (RLS)

Every query is automatically filtered by organization:

```sql
-- PostgreSQL RLS Policy (automatically applied)
SET app.current_org = 'organization-uuid';

-- This query now ONLY returns sites for that organization
SELECT * FROM sites;  -- Automatically filtered
```

**Security Guarantee**: Even if application code has bugs, the database layer prevents cross-tenant data access.

---

## Core Entity Hierarchy

All data in SiteSync follows this hierarchy:

```
ORGANIZATION (Tenant Root)
│
├── USERS ─────────────────────── People who access the system
│   └── Roles: owner, admin, manager, user, technician, readonly
│
├── SITES ─────────────────────── Buildings/Locations
│   │
│   └── ELEVATORS ─────────────── Equipment/Assets
│       │
│       └── WORK ORDERS ───────── Jobs/Tasks
│           ├── Tasks ─────────── Checklist items
│           ├── Parts Used ────── Materials consumed
│           └── Labor Entries ─── Time tracking
│
├── CONTRACTORS ───────────────── Service providers
│   └── Linked to Work Orders via assignment
│
├── INVENTORY ─────────────────── Parts catalog
│   └── Stock Locations ───────── Van stock, warehouse, site stock
│
└── AUDIT EVENTS ──────────────── Immutable activity log
    └── Hash-chained for integrity
```

### Key Relationships

| Parent | Child | Relationship | On Delete |
|--------|-------|--------------|-----------|
| Organization | Sites | 1:N | Cascade |
| Organization | Users | 1:N | Cascade |
| Organization | Contractors | 1:N | Cascade |
| Site | Elevators | 1:N | Cascade |
| Elevator | Work Orders | 1:N | Restrict |
| Work Order | Tasks | 1:N | Cascade |
| Work Order | Parts | 1:N | Cascade |
| Work Order | Labor | 1:N | Cascade |

---

## Organization Types

SiteSync supports different organization types with different use cases:

| Type | Description | Primary Use |
|------|-------------|-------------|
| `service_company` | Elevator maintenance company | Managing contracts, technicians, work orders |
| `building_owner` | Property owner/manager | Overseeing building assets, hiring contractors |
| `manufacturer` | Equipment manufacturer (KONE, Otis, etc.) | Technical documentation, warranty support |
| `supplier` | Parts supplier | Marketplace listings, fulfillment |
| `insurance` | Insurance provider | Risk assessment, claims |
| `trade_school` | Training institution | Certification, education |
| `regulatory_body` | Government regulator | Compliance oversight |
| `individual` | Independent technician | Personal profile, job seeking |

---

## Subscription Tiers

| Tier | Assets | Users | Features |
|------|--------|-------|----------|
| **Free** | 5 | 2 | Basic CMMS, limited AI |
| **Pro** | 50 | 10 | Full CMMS, AI diagnosis, reports |
| **Expert** | Unlimited | 50 | Everything + marketplace + API |
| **Enterprise** | Unlimited | Unlimited | Custom integrations, SLA support |

---

## Technology Stack

### Backend
- **Language**: Python 3.12+
- **Framework**: FastAPI (async)
- **Database**: PostgreSQL 16+ with pgvector
- **ORM**: SQLAlchemy 2.0 (async)
- **Validation**: Pydantic 2.10+
- **AI**: Pydantic AI + Triforce (multi-model consensus)

### Frontend
- **Framework**: React 18 + TypeScript
- **State**: TanStack Query
- **Styling**: Tailwind CSS
- **Build**: Vite

### Infrastructure
- **Compute**: Google Cloud Run
- **Database**: Cloud SQL (PostgreSQL)
- **Cache**: Memorystore (Redis)
- **Storage**: Cloud Storage
- **CDN**: Cloud CDN
- **Security**: Cloud Armor (WAF)

---

## Key Design Principles

### 1. Building-Centric Data Ownership

Data belongs to the **building**, not the contractor. When service providers change:
- All historical work orders remain
- Equipment specifications persist
- AI-learned quirks transfer
- Compliance records stay intact

### 2. Multi-Model AI Consensus (Triforce)

No single AI model makes critical decisions. Instead:

```
User Query → Jury (3 models) → Consensus → Witness → Judge → Response
```

- **Jury**: Gemini + Claude + GPT-4 analyze independently
- **Consensus**: Agreement threshold determines confidence
- **Witness**: Retrieves supporting documentation
- **Judge**: Final synthesis with citations

### 3. Zero Trust Multi-Tenancy

- RLS enforced at database level
- Tenant context set on every request
- No shared data between organizations (except platform services)
- Audit trail for all data access

### 4. Immutable Audit Trail

All significant actions create audit events:
- Hash-chained for integrity verification
- Partitioned by time for performance
- Cannot be modified or deleted
- Supports compliance requirements

---

## System Boundaries

### What SiteSync Manages

| Domain | Capabilities |
|--------|-------------|
| **Asset Management** | Equipment registration, specifications, health scores |
| **Work Orders** | Creation, assignment, tracking, completion |
| **Contractor Management** | Profiles, assignments, performance tracking |
| **Inventory** | Parts catalog, van stock, reorder points |
| **Compliance** | Inspection tracking, certification management |
| **AI Diagnosis** | Fault analysis, recommended actions, parts suggestions |
| **Knowledge Base** | Technical documentation, community contributions |
| **Marketplace** | Parts buying/selling between organizations |

### What SiteSync Does NOT Manage

| Domain | Reason |
|--------|--------|
| **Accounting/Invoicing** | Integrate with Xero, QuickBooks, MYOB |
| **Payroll** | Integrate with payroll systems |
| **Building Access Control** | Integrate with access systems |
| **Real-time Equipment Monitoring** | Future IoT integration (Phase 4) |
| **Video Surveillance** | Out of scope |

---

## Data Flow Overview

### Creating a Work Order (Breakdown)

```
1. Building Manager reports fault
   └── Via web app or mobile

2. System creates Work Order
   └── Status: 'pending'
   └── Audit event logged

3. AI Triforce analyzes (optional)
   └── Suggests likely causes
   └── Recommends parts
   └── Confidence score

4. Manager assigns to Contractor
   └── Status: 'scheduled'
   └── Contractor notified
   └── Audit event logged

5. Technician arrives on site
   └── Status: 'in_progress'
   └── Clock starts

6. Work completed
   └── Status: 'completed'
   └── Parts logged
   └── Labor logged
   └── Resolution notes

7. Building Manager reviews
   └── Status: 'invoiced'
   └── Equipment health recalculated
```

### Multi-Tenant Data Access

```
Request → Auth Middleware → Extract org_id from JWT
                              │
                              ▼
                    SET app.current_org = 'org-uuid'
                              │
                              ▼
                    All queries filtered by RLS
                              │
                              ▼
                    Response (only org's data)
```

---

## Quick Reference Links

| Document | Purpose |
|----------|---------|
| [02-entity-relationships.md](02-entity-relationships.md) | Detailed entity diagrams |
| [03-organization-profiles.md](03-organization-profiles.md) | Organization structure |
| [04-building-profiles.md](04-building-profiles.md) | Site/building data |
| [05-user-profiles.md](05-user-profiles.md) | User roles and access |
| [06-asset-profiles.md](06-asset-profiles.md) | Elevator/equipment data |
| [07-creation-flows.md](07-creation-flows.md) | How to create entities |
| [08-permissions-matrix.md](08-permissions-matrix.md) | Who can do what |
| [09-state-machines.md](09-state-machines.md) | Status transitions |
| [10-validation-rules.md](10-validation-rules.md) | Data requirements |

---

## Glossary Reference

Key terms used throughout this documentation:

| Term | Definition |
|------|------------|
| **Organization** | Multi-tenant root entity (a company) |
| **Site** | A building or physical location |
| **Elevator** | A lift asset (equipment being managed) |
| **Work Order** | A job or task to be performed |
| **Contractor** | Person or company performing service work |
| **RLS** | Row-Level Security (PostgreSQL feature) |
| **Triforce** | SiteSync's multi-model AI consensus system |

For complete glossary, see `/docs/GLOSSARY.md`.

---

## Next Steps

To understand SiteSync's foundations, read the documents in this order:

1. **This document** (01-system-overview.md) - You are here
2. [02-entity-relationships.md](02-entity-relationships.md) - How entities connect
3. [03-organization-profiles.md](03-organization-profiles.md) - Organization structure
4. [04-building-profiles.md](04-building-profiles.md) - Building data model
5. [05-user-profiles.md](05-user-profiles.md) - User roles and permissions
6. [06-asset-profiles.md](06-asset-profiles.md) - Equipment data model
7. [07-creation-flows.md](07-creation-flows.md) - Creating entities step-by-step

---

**[Next: Entity Relationships →](02-entity-relationships.md)**
