# SiteSync V3 - AI Context Document

<!--
PURPOSE: This document provides essential context for AI assistants (Claude, GPT-4, Gemini)
to understand the SiteSync project quickly and accurately. Read this FIRST before
exploring other documentation.

OPTIMIZED FOR: LLM comprehension with clear structure, consistent terminology, and
self-contained context.
-->

## What Is SiteSync?

**SiteSync V3** is an AI-Native Building Services Operating System.

**Core Function**: Manage building equipment (elevators, HVAC, electrical, plumbing, fire systems) with AI assistance.

**Key Differentiator**: Buildings own their service history permanently. When contractors change, data stays with the building.

**Target Users**:
1. Building managers and facility managers
2. Elevator technicians and maintenance workers
3. Service companies and contractors

## The Three Core Principles

### Principle 1: Buildings Own Their Data

Every service record belongs to the building, not the contractor who performed the work. When a building changes service providers, the complete history remains searchable and accessible.

### Principle 2: Workers Own Their Reputation

Technicians build professional profiles from verified work. Expertise scores, first-time fix rates, and contributions are tracked and portable across employers.

### Principle 3: AI Is Invisible

AI assists at every step but never interrupts workflow. No chatbots, no "AI is thinking" spinners, no "Powered by AI" badges. The system simply works intelligently.

## Entity Hierarchy

```
Organization (tenant root - a company using SiteSync)
├── Users (staff members with roles and permissions)
├── Sites (buildings/locations)
│   └── Elevators (equipment assets)
│       ├── Work Orders (jobs/tasks)
│       │   ├── Tasks (subtasks within a job)
│       │   ├── Parts Used (inventory consumed)
│       │   ├── Labor Entries (time tracking)
│       │   └── AI Diagnoses (Triforce results)
│       ├── Maintenance Schedules
│       └── Documents (manuals, certificates)
├── Contractors (technicians/service companies)
│   └── Certifications
└── Inventory Items
    └── Stock Locations (warehouse, van stock)
```

## Key Terminology (Use These Terms Consistently)

| Term | Definition | NOT This |
|------|------------|----------|
| Organization | Multi-tenant root entity (a company) | Account, Tenant, Company |
| Site | A building or location | Property, Facility, Location |
| Elevator | A lift/vertical transport asset | Lift, Asset, Unit |
| Work Order | A job/task to be performed | Job, Ticket, Request, Task |
| Contractor | Person/company performing work | Technician, Worker, Vendor |
| Triforce AI | Multi-model AI consensus system | AI Engine, LLM System |
| Fault Code | Equipment error identifier | Error Code, Alarm Code |

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Database | PostgreSQL 16+ | Data storage with RLS multi-tenancy |
| Vector Search | pgvector | Embedding storage for AI |
| Backend | FastAPI + Python 3.12+ | REST API |
| Frontend | React 18 + TypeScript | Web dashboard |
| AI Layer | Triforce (Gemini + Claude + GPT-4) | Multi-model consensus |
| Structured AI | Pydantic AI | Type-safe LLM outputs |

## Triforce AI Architecture

Triforce uses multiple AI models in parallel with consensus voting:

```
INPUT (fault code, symptoms, equipment context)
    │
    ▼
┌──────────────────────────────────────┐
│ JURY (3 models evaluate in parallel) │
│ Gemini 2.0 Pro │ Claude Sonnet │ GPT-4│
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ CONSENSUS ENGINE (weighted voting)   │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ WITNESS (validation against KB)      │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ JUDGE (final synthesis - Claude Opus)│
└──────────────────────────────────────┘
    │
    ▼
OUTPUT (structured diagnosis with confidence)
```

## Database Multi-Tenancy

SiteSync uses PostgreSQL Row-Level Security (RLS) for tenant isolation:

```sql
-- Every query automatically filters by organization
SET app.current_org = 'organization-uuid';
-- All subsequent queries only return that organization's data
```

All tenant-scoped tables include `organization_id` and RLS policies.

## Key Enums (Quick Reference)

> **Full enum definitions**: `/docs/reference/enums.md`

| Enum | Common Values |
|------|---------------|
| Elevator Status | `operational`, `degraded`, `out_of_service`, `maintenance` |
| Work Order Status | `draft`, `pending`, `scheduled`, `in_progress`, `completed` |
| Work Order Priority | `emergency`, `high`, `medium`, `low`, `scheduled` |
| Work Order Type | `breakdown`, `preventive`, `inspection`, `callback` |

## API Endpoint Patterns

> **Full API reference**: `/docs/reference/api.md`

```
/api/v1/sites                           # Site CRUD
/api/v1/elevators                       # Elevator CRUD
/api/v1/work-orders                     # Work order CRUD
/api/v1/work-orders/{id}/diagnose       # Request AI diagnosis
/api/v1/contractors                     # Contractor management
/api/v1/inventory/van-stock             # Van stock tracking
```

## Code Patterns (Summary)

> **Full code patterns**: `/CLAUDE_CODE_GUIDE.md` and `/docs/reference/implementation.md`

**Key conventions**:
- Python 3.12+ type syntax: `X | None` not `Optional[X]`, `list[X]` not `List[X]`
- Async/await for all database operations
- Repository pattern for data access
- Service layer for business logic with audit logging
- Domain structure: `contracts.py`, `models.py`, `service.py`, `repository.py`

```python
# Example: Modern type syntax
def get_elevator(id: UUID) -> Elevator | None: ...
def list_sites() -> list[Site]: ...
```

## Directory Structure

```
sitesync/
├── CLAUDE.md               # Concise context (~70 lines)
├── AI_CONTEXT.md           # THIS FILE - extended context
├── CLAUDE_CODE_GUIDE.md    # Complete technical reference
├── llms.txt                # AI discovery index
├── llms-full.txt           # Complete documentation dump
├── .llm-manifest.json      # Machine-readable index
└── docs/
    ├── README.md           # Documentation hub
    ├── GLOSSARY.md         # Terminology definitions
    ├── explanation/        # Concept explanations
    ├── reference/          # Technical specifications
    ├── tutorials/          # Step-by-step guides
    ├── how-to/             # Task-oriented guides
    └── faq.md              # Common questions
```

## Common Tasks for AI Assistants

### When Asked to Implement a Feature
1. Check the data model in `docs/reference/data-model.md`
2. Follow the domain pattern: `contracts.py`, `models.py`, `service.py`, `repository.py`
3. Use async/await for all database operations
4. Add audit events for user-facing changes
5. Include RLS context setting for multi-tenant queries

### When Asked About AI Diagnosis
1. Refer to Triforce architecture in `docs/explanation/triforce-ai.md`
2. Use Pydantic AI for structured outputs
3. Follow the jury → consensus → witness → judge pipeline

### When Asked About the Database
1. PostgreSQL 16+ with pgvector for embeddings
2. All tables have `organization_id` for multi-tenancy
3. RLS policies enforce tenant isolation
4. UUIDs for all primary keys

## Project Status

| Aspect | Status |
|--------|--------|
| Phase | Design & Early Development |
| Database | Schema defined, not yet implemented |
| API | Patterns defined, partial implementation |
| Frontend | React structure defined |
| AI | Triforce architecture designed |

## Related Documentation

For deeper understanding, read in this order:
1. `/AI_CONTEXT.md` (this file)
2. `/CLAUDE_CODE_GUIDE.md` (complete reference)
3. `/docs/reference/data-model.md` (database schemas)
4. `/docs/explanation/triforce-ai.md` (AI system)
5. `/docs/reference/api.md` (API endpoints)
