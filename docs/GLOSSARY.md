<!--
---
title: SiteSync Terminology Glossary
description: Consistent terminology definitions for AI assistants and developers
version: 3.0.0
last_updated: 2025-12
status: stable
audience: ai_assistant, developer
purpose: Defines consistent terminology - AI assistants should use these exact terms
related_docs:
  - /AI_CONTEXT.md (quick reference)
  - /docs/reference/data-model.md (entity schemas)
---
-->

# SiteSync Terminology Glossary

## Core Entities

### Organization

**Definition**: The multi-tenant root entity representing a company using SiteSync.

**Database Table**: `organizations`

**Key Fields**:
- `id` (UUID): Unique identifier
- `slug` (string): URL-friendly identifier (e.g., `acme-elevators`)
- `subscription_tier` (enum): `free`, `pro`, `expert`, `enterprise`

**Do NOT call it**: Account, Tenant, Company, Client, Customer

---

### Site

**Definition**: A building or physical location containing equipment.

**Database Table**: `sites`

**Key Fields**:
- `organization_id` (UUID): Parent organization
- `name` (string): Building name
- `address_line1`, `city`, `state`, `postal_code`: Location
- `health_score` (integer): 0-100 building health rating

**Relationships**:
- Belongs to one Organization
- Has many Elevators

**Do NOT call it**: Building, Property, Facility, Location, Premises

---

### Elevator

**Definition**: A vertical transport asset (lift) being managed in SiteSync.

**Database Table**: `elevators`

**Key Fields**:
- `site_id` (UUID): Parent site
- `unit_number` (string): Display identifier (e.g., "Lift 1", "L1")
- `serial_number` (string): Manufacturer serial
- `registration_number` (string): Government registration
- `manufacturer` (string): KONE, Otis, Schindler, etc.
- `status` (enum): See Elevator Status below

**Relationships**:
- Belongs to one Site
- Has many Work Orders
- Has many Documents

**Do NOT call it**: Lift (except in UI for Australian users), Asset, Unit, Equipment

---

### Work Order

**Definition**: A job or task to be performed on equipment.

**Database Table**: `work_orders`

**Key Fields**:
- `work_order_number` (string): Display ID (e.g., "WO-2024-001234")
- `elevator_id` (UUID): Target equipment
- `type` (enum): See Work Order Type below
- `priority` (enum): See Work Order Priority below
- `status` (enum): See Work Order Status below
- `fault_code` (string): Equipment error code if applicable
- `assigned_contractor_id` (UUID): Assigned technician/company

**Relationships**:
- Belongs to one Elevator
- Has many Tasks, Parts Used, Labor Entries
- May have one AI Diagnosis

**Do NOT call it**: Job, Ticket, Request, Task, Service Call, Case

---

### Contractor

**Definition**: A person or company that performs maintenance work.

**Database Table**: `contractors`

**Key Fields**:
- `contractor_type` (string): `employee`, `subcontractor`, `vendor`, `company`
- `contact_name` (string): Primary contact
- `specializations` (array): e.g., `['KONE', 'Otis', 'hydraulic']`
- `rating` (decimal): 0.00-5.00 performance rating
- `first_time_fix_rate` (decimal): Percentage of jobs fixed on first visit

**Relationships**:
- Belongs to one Organization
- Has many assigned Work Orders
- May have Certifications

**Do NOT call it**: Technician (unless referring to individual), Worker, Vendor, Supplier

---

### Inventory Item

**Definition**: A part or material tracked in the inventory system.

**Database Table**: `inventory_items`

**Key Fields**:
- `part_number` (string): Unique part identifier
- `name` (string): Part description
- `manufacturer` (string): Part manufacturer
- `compatible_manufacturers` (array): Compatible equipment brands

**Relationships**:
- Belongs to one Organization
- Has many Stock Locations

**Do NOT call it**: Part (except informally), Material, Component, SKU

---

### Stock Location

**Definition**: A specific place where inventory is stored.

**Database Table**: `stock_locations`

**Key Fields**:
- `location_type` (string): `warehouse`, `van`, `site`, `consignment`
- `quantity_on_hand` (integer): Current quantity
- `contractor_id` (UUID): If van stock, which technician

**Van Stock**: Inventory carried by a technician in their vehicle.

**Do NOT call it**: Warehouse (unless type=warehouse), Storage

---

## AI System Terminology

### Triforce AI

**Definition**: SiteSync's multi-model AI architecture that uses three LLMs in parallel with consensus voting.

**Components**:
- **Jury**: Multiple LLMs evaluating in parallel (Gemini, Claude, GPT-4)
- **Consensus Engine**: Aggregates jury responses via weighted voting
- **Witness Panel**: Validates claims against knowledge base
- **Judge**: Makes final decision (Claude Opus 4.5)
- **Hierarchical Memory**: Episodic, semantic, and procedural memory stores

**Do NOT call it**: AI Engine, LLM System, ChatGPT, The AI

---

### AI Diagnosis

**Definition**: A structured analysis produced by Triforce AI for a fault.

**Output Fields**:
- `fault_code` (string): Identified fault
- `severity` (string): `critical`, `high`, `medium`, `low`
- `primary_cause` (string): Most likely cause
- `recommended_actions` (array): Steps to resolve
- `parts_needed` (array): Required parts
- `confidence` (float): 0.0-1.0 confidence score

**Do NOT call it**: AI Response, Prediction, Analysis

---

## Status Enums

### Elevator Status

| Value | Meaning |
|-------|---------|
| `operational` | Running normally |
| `degraded` | Running with issues |
| `out_of_service` | Not running |
| `maintenance` | Scheduled maintenance |
| `decommissioned` | Permanently out of use |

---

### Work Order Status

| Value | Meaning |
|-------|---------|
| `draft` | Created but not submitted |
| `pending` | Submitted, awaiting assignment |
| `scheduled` | Assigned and scheduled |
| `in_progress` | Work started |
| `on_hold` | Paused |
| `completed` | Work finished |
| `cancelled` | Cancelled |
| `invoiced` | Invoiced/closed |

---

### Work Order Priority

| Value | Meaning |
|-------|---------|
| `emergency` | Immediate response required |
| `high` | Same day |
| `medium` | Within 48 hours |
| `low` | Within week |
| `scheduled` | Planned maintenance |

---

### Work Order Type

| Value | Meaning |
|-------|---------|
| `breakdown` | Equipment failure |
| `preventive` | Scheduled maintenance |
| `inspection` | Safety inspection |
| `installation` | New installation |
| `modernization` | Upgrade project |
| `callback` | Return visit |
| `audit` | Compliance audit |

---

## Technical Terms

### Row-Level Security (RLS)

**Definition**: PostgreSQL feature that automatically filters query results based on the current user's organization. Ensures multi-tenant data isolation at the database level.

**Implementation**: `SET app.current_org = 'uuid'` before queries.

---

### pgvector

**Definition**: PostgreSQL extension for storing and querying vector embeddings. Used for AI semantic search.

---

### Hybrid Search

**Definition**: Search combining keyword matching (BM25/trigram) with semantic vector similarity for better results.

---

### Domain (Architecture)

**Definition**: A bounded context in the codebase containing related functionality.

**Structure**:
```
domains/{name}/
├── contracts.py   # Protocol interfaces
├── models.py      # Pydantic models
├── service.py     # Business logic
├── repository.py  # Data access
└── test_{name}.py # Tests
```

**Examples**: `organizations`, `assets`, `work_orders`, `contractors`, `inventory`, `audit`

---

## Acronyms

| Acronym | Meaning |
|---------|---------|
| RLS | Row-Level Security |
| UUID | Universally Unique Identifier |
| CRUD | Create, Read, Update, Delete |
| API | Application Programming Interface |
| RPC | Remote Procedure Call |
| JWT | JSON Web Token |
| CMMS | Computerized Maintenance Management System |
| FM | Facilities Management |
| BMS | Building Management System |
| MRL | Machine Room-Less (elevator type) |
| VFD | Variable Frequency Drive |

---

## Industry Terms

### Fault Code

**Definition**: A standardized error identifier displayed by elevator controllers. Format varies by manufacturer.

**Examples**:
- KONE: `F505` (door zone fault)
- Otis: `ALM-123`
- Schindler: `E001`

---

### First-Time Fix Rate

**Definition**: Percentage of work orders resolved on the first technician visit without requiring a return trip.

**Calculation**: `(Jobs fixed on first visit / Total jobs) × 100`

**Target**: 90%+ is excellent

---

### Building Health Score

**Definition**: A composite 0-100 score representing overall building condition.

**Factors**:
- Equipment age and condition
- Maintenance history compliance
- Predictive failure risk
- Recent incident count

---

## Usage Guidelines

1. **Always use the defined term** - Do not substitute synonyms
2. **Use singular form for entity names** - "Work Order" not "Work Orders" when referring to the concept
3. **Use exact enum values in code** - `in_progress` not `inProgress` or `IN_PROGRESS`
4. **Capitalize proper nouns** - "Triforce AI", "SiteSync", "PostgreSQL"
5. **Use lowercase for enum values** - `operational`, `emergency`, `breakdown`
