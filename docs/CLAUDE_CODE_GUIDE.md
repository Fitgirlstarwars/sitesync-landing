<!--
---
title: SiteSync V3 Complete System Reference
description: Complete technical reference for AI assistants working with SiteSync
version: 3.0.0
last_updated: 2025-12
status: design_phase
audience: ai_assistant
prerequisites: none
related_docs:
  - /AI_CONTEXT.md (quick context overview)
  - /docs/GLOSSARY.md (terminology definitions)
  - /llms.txt (documentation index)
---
-->

# SiteSync V3 - Complete System Reference Guide

## For AI Assistants: Read This First

**What is SiteSync?** An AI-native platform for managing building services (elevators, HVAC, electrical). Buildings own their service history permanently.

**Quick Context:** For a shorter overview, read `/AI_CONTEXT.md` first.

**Terminology:** For consistent term definitions, see `/docs/GLOSSARY.md`.

**Key Concept:** "Organization" means a tenant company, "Site" means a building, "Elevator" means an asset, "Work Order" means a job.

---

> **Purpose**: Complete reference for Claude Code to understand and work with the SiteSync V3 AI-Native Building Services Platform
> **Version**: 3.0.0 | December 2025
> **Status**: Design Phase

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Core Philosophy](#2-core-philosophy)
3. [Architecture Overview](#3-architecture-overview)
4. [Technology Stack](#4-technology-stack)
5. [Data Model](#5-data-model)
6. [Domain Structure](#6-domain-structure)
7. [Triforce AI System](#7-triforce-ai-system)
8. [Key Features](#8-key-features)
9. [API Design](#9-api-design)
10. [Security & Multi-Tenancy](#10-security--multi-tenancy)
11. [Market Strategy](#11-market-strategy)
12. [Implementation Roadmap](#12-implementation-roadmap)
13. [Code Patterns](#13-code-patterns)
14. [Quick Reference](#14-quick-reference)

---

## 1. Executive Summary

### What Is SiteSync V3?

**SiteSync V3** is an **AI-Native Multi-Trade Building Services Operating System** - a comprehensive platform for managing ALL building trades (elevators, escalators, HVAC, electrical, plumbing, fire, security, painting, removalists) with **AI assistance at every step**.

### Core Thesis

> Traditional vertical SaaS companies (ServiceTitan, Fiix) are strategically paralyzed by legacy business models. SiteSync exploits this through **counter-positioning**: AI-native architecture delivering **10x value at 1/10th the cost**.

### Key Metrics Target

| Metric | Target | Industry Avg |
|--------|--------|--------------|
| Price | $29/month | $299/month |
| First-time fix rate | 90%+ | 70% |
| Task completion time | -85% | baseline |
| User training time | <1 hour | 2-5 days |
| Gross margin | 98% | 60-70% |
| ARR per FTE | $1.13M | $200K |

### Architecture Decision

**Import-Based Bridge (Option C)** - Best balance of risk/speed/flexibility:

```
V3 CMMS (Clean Build)
├── PostgreSQL + pgvector (replaces SQLite + FAISS)
├── Native hybrid search (single SQL query)
└── domains/ (all NEW except diagnosis wrapper)

V2 (Library - imported)
├── adapters/gemini/ (LLM calls)
└── domains/diagnosis/ (fault analysis agents)

Extraction Service (SEPARATE)
├── Standalone Cloud Function or CLI
├── Gemini 2.0 structured extraction
└── Writes directly to V3 PostgreSQL
```

**Code Split**: 65% new code / 35% V2 reuse

---

## 2. Core Philosophy

### The Invisible AI Principle

> "The best technology is the one you don't think about. When users say 'this tool is amazing', never 'this AI is amazing', you've succeeded."

**Core Rule**: Human is ALWAYS in control, but AI is SEAMLESS and INVISIBLE.

### What Invisible AI Means

| Wrong (Visible AI) | Right (Invisible AI) |
|--------------------|----------------------|
| "Our AI chatbot will help you!" | Form auto-fills before you type |
| "Powered by GPT-4" badge | System suggests exactly what you need |
| "Let AI analyze your data" | Report appears, already written |
| "AI is thinking..." spinner | Instant results (pre-computed) |
| User knows they're using AI | User thinks the tool is brilliant |

### The "Confirm, Don't Create" Pattern

AI NEVER takes action without human confirmation - but confirmation is frictionless:

| AI Confidence | UX Pattern | User Action |
|---------------|------------|-------------|
| **High (95%+)** | "Likely sensor. Order it?" | 1 tap to confirm |
| **Medium (70-95%)** | "Could be A, B, or C" | Tap to choose, then confirm |
| **Low (<70%)** | "What do you see?" | Photo/voice input (no typing) |

### The "How Did It Know?" Moments

These create word-of-mouth marketing:

1. **Jobsite Recognition**: Open app → already knows which building, which job
2. **Photo Intelligence**: Point camera → reads nameplate → downloads manual
3. **Self-Writing Reports**: Finish job → report ready in 30 seconds
4. **Auto-Offline Mode**: Walk into shaft → high-contrast, offline, flashlight
5. **Smart Parts Suggest**: Diagnose fault → AI suggests part → one tap to order
6. **Smart Scheduling**: Wake up → day already optimized, saves 45 min
7. **Colleague Finder**: Stuck on fault → expert nearby, already briefed
8. **Predictive Alerts**: "Motor will fail in 3 weeks. Schedule now?"

### Anti-Patterns (NEVER Do)

- "Powered by AI" badges
- Chatbot interfaces
- "AI is thinking..." spinners
- Confidence scores shown to users
- AI explanations nobody asked for
- Separate "AI Mode" settings

### Three Layers of AI Learning

```
1. PER-USER PERSONALIZATION
   - Preferred report style
   - Communication preferences
   - Common routes and schedules
   - Past decisions and corrections

2. PER-ASSET KNOWLEDGE
   - Equipment quirks ("This KONE always throws false F505 on humid days")
   - Successful procedures
   - Failure patterns (probability/likelihood)
   - Parts history

3. PER-TRADE SPECIALIZED AI
   - LIFTS: Door faults, drive failures, safety circuits
   - HVAC: Compressor issues, refrigerant cycles, airflow
   - ELECTRICAL: Circuit tracing, load balancing
   - PLUMBING: Pressure, flow, drainage
   - FIRE: Detection, suppression, compliance
```

---

## 3. Architecture Overview

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERFACES                           │
├─────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + TanStack Query + Tailwind CSS      │
│  FastAPI 0.115+ (async, OpenAPI 3.1)                        │
│  Mobile: React Native / PWA (Phase 3)                       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                         DOMAINS                             │
├─────────────────────────────────────────────────────────────┤
│  V2 (imported): extraction, search, diagnosis, knowledge    │
│  V3 (new): organizations, assets, work_orders, contractors  │
│            inventory, audit                                 │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                         ADAPTERS                            │
├─────────────────────────────────────────────────────────────┤
│  V2: Gemini, Ollama, SQLite, FAISS, Neo4j                   │
│  V3: PostgreSQL (asyncpg), Redis (caching), S3 (documents)  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                         │
├─────────────────────────────────────────────────────────────┤
│  Cloud Run (API) │ Cloud SQL (PostgreSQL) │ Memorystore     │
│  Cloud Storage (PDFs) │ Secret Manager │ Cloud Armor        │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
~/Desktop/
├── sitesync-claudeV2/           # PRODUCTION (becomes library)
│   ├── sitesync/
│   │   ├── adapters/             # Gemini, SQLite, FAISS, Neo4j
│   │   ├── domains/              # extraction, search, diagnosis
│   │   ├── interfaces/           # Keep running for existing users
│   │   └── config/
│   ├── data/
│   │   ├── processed/platinum/   # 2,307 pre-extracted PDFs
│   │   └── graph/                # 1,043 nodes, 432 edges
│   └── pyproject.toml
│
└── sitesync-v3/                 # DEVELOPMENT (new system)
    ├── sitesync_v3/
    │   ├── core/                 # Triforce v3, shared utilities
    │   ├── domains/
    │   │   ├── organizations/    # Multi-tenant root
    │   │   ├── assets/           # Elevator registry
    │   │   ├── work_orders/      # Job lifecycle
    │   │   ├── contractors/      # Workforce management
    │   │   ├── inventory/        # Parts tracking
    │   │   └── audit/            # Compliance trail
    │   ├── adapters/
    │   │   └── postgres/         # PostgreSQL adapter
    │   └── interfaces/
    │       ├── api/              # FastAPI with new routes
    │       └── web/              # React dashboard
    ├── data → ../sitesync-claudeV2/data  # SYMLINK
    ├── pyproject.toml
    └── alembic/                  # Database migrations
```

### What V3 Does NOT Include

| Component | Reason |
|-----------|--------|
| `domains/extraction/` | Separate microservice |
| `adapters/faiss/` | Replaced by pgvector |
| `adapters/sqlite/` | Replaced by PostgreSQL |
| `domains/search/hybrid_search.py` | Single SQL query now |

---

## 4. Technology Stack

### Database: PostgreSQL 16+

| Feature | Purpose |
|---------|---------|
| Row-Level Security (RLS) | Multi-tenant isolation |
| pgvector | Embedding storage (replaces FAISS) |
| pg_trgm | Fuzzy text search |
| JSONB | Flexible metadata |
| Partitioning | Scale audit_events table |

### Database Migration Path

| V2 Component | V3 Replacement | Reason |
|--------------|----------------|--------|
| SQLite | PostgreSQL | Multi-tenant, concurrent writes |
| FAISS (file) | pgvector | Managed, transactional |
| Neo4j | PostgreSQL + JSONB | Simplify ops, graph via CTEs |

### Python Dependencies (pyproject.toml)

```toml
[project]
name = "sitesync-v3"
version = "3.0.0"
requires-python = ">=3.12"
dependencies = [
    "sitesync @ file://../sitesync-claudeV2",  # Import V2 as library
    "fastapi>=0.115.0",
    "sqlalchemy[asyncio]>=2.0.35",
    "asyncpg>=0.30.0",
    "pydantic>=2.10.0",
    "pydantic-ai>=0.0.9",
    "alembic>=1.14.0",
    "opentelemetry-api>=1.28.0",
    "opentelemetry-sdk>=1.28.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "pytest-cov>=6.0.0",
    "mypy>=1.13.0",
    "ruff>=0.8.0",
]
```

### Frontend Stack

- **React 18** with TypeScript
- **TanStack Query** for server state
- **Tailwind CSS** for styling
- **PWA** for offline-first mobile

---

## 5. Data Model

### Entity Relationship Overview

```
Organization (tenant root)
    │
    ├── Sites (buildings/locations)
    │       │
    │       └── Elevators (assets)
    │               │
    │               ├── Work Orders
    │               │       ├── Tasks
    │               │       ├── Parts Used
    │               │       ├── Labor Entries
    │               │       └── AI Diagnoses
    │               │
    │               ├── Maintenance Schedules
    │               └── Documents (linked to V2 extractions)
    │
    ├── Contractors
    │       └── Certifications
    │
    ├── Inventory Items
    │       └── Stock Transactions
    │
    └── Users
            └── Roles/Permissions
```

### Core SQL Schema

```sql
-- ORGANIZATIONS (Multi-tenant Root)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,  -- {slug}.arprofm.com
    subscription_tier VARCHAR(50) DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITES (Buildings/Locations)
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Australia',
    timezone VARCHAR(50) DEFAULT 'Australia/Sydney',
    contact_name VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ELEVATORS (Assets)
CREATE TYPE elevator_status AS ENUM (
    'operational', 'degraded', 'out_of_service', 'maintenance', 'decommissioned'
);

CREATE TABLE elevators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL,
    serial_number VARCHAR(100),
    registration_number VARCHAR(100),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    controller_type VARCHAR(100),
    drive_type VARCHAR(100),
    capacity_kg INTEGER,
    speed_mps DECIMAL(4,2),
    floors_served INTEGER,
    installation_date DATE,
    status elevator_status DEFAULT 'operational',
    last_inspection_date DATE,
    next_inspection_due DATE,
    v2_document_ids INTEGER[],  -- Links to V2 manuals
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, site_id, unit_number)
);

-- CONTRACTORS
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    license_number VARCHAR(100),
    contractor_type VARCHAR(50),  -- 'employee', 'subcontractor', 'vendor'
    specializations TEXT[],  -- ['KONE', 'OTIS', 'hydraulic']
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    rating DECIMAL(3,2),
    total_jobs_completed INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WORK ORDERS
CREATE TYPE work_order_status AS ENUM (
    'draft', 'pending', 'scheduled', 'in_progress',
    'on_hold', 'completed', 'cancelled', 'invoiced'
);

CREATE TYPE work_order_priority AS ENUM (
    'emergency', 'high', 'medium', 'low', 'scheduled'
);

CREATE TYPE work_order_type AS ENUM (
    'breakdown', 'preventive', 'inspection', 'installation',
    'modernization', 'callback', 'audit'
);

CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    elevator_id UUID NOT NULL REFERENCES elevators(id),
    work_order_number VARCHAR(50) NOT NULL,
    type work_order_type NOT NULL,
    priority work_order_priority DEFAULT 'medium',
    status work_order_status DEFAULT 'draft',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    fault_code VARCHAR(50),
    reported_symptoms TEXT[],
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    assigned_contractor_id UUID REFERENCES contractors(id),
    ai_diagnosis_id UUID,
    ai_suggested_parts TEXT[],
    ai_confidence DECIMAL(3,2),
    resolution_notes TEXT,
    root_cause TEXT,
    custom_fields JSONB DEFAULT '{}',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, work_order_number)
);

-- AUDIT EVENTS (Immutable)
CREATE TYPE audit_event_type AS ENUM (
    'work_order_created', 'work_order_updated', 'work_order_completed',
    'elevator_status_changed', 'inspection_completed',
    'part_used', 'labor_logged', 'diagnosis_requested',
    'document_uploaded', 'user_action'
);

CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    event_type audit_event_type NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    actor_id UUID NOT NULL,
    actor_type VARCHAR(50) DEFAULT 'user',
    event_data JSONB NOT NULL,
    previous_state JSONB,
    new_state JSONB,
    hash VARCHAR(64) NOT NULL,  -- SHA-256 chain
    created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- ROW-LEVEL SECURITY
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE elevators ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_isolation_sites ON sites
    USING (organization_id = current_setting('app.current_org')::uuid);

CREATE POLICY org_isolation_elevators ON elevators
    USING (organization_id = current_setting('app.current_org')::uuid);
```

### Pydantic Models

```python
# sitesync_v3/domains/assets/models.py
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID
from pydantic import BaseModel, Field

class ElevatorStatus(str, Enum):
    OPERATIONAL = "operational"
    DEGRADED = "degraded"
    OUT_OF_SERVICE = "out_of_service"
    MAINTENANCE = "maintenance"
    DECOMMISSIONED = "decommissioned"

class Elevator(BaseModel):
    id: UUID
    organization_id: UUID
    site_id: UUID
    unit_number: str
    serial_number: str | None = None
    registration_number: str | None = None
    manufacturer: str | None = None
    model: str | None = None
    controller_type: str | None = None
    drive_type: str | None = None
    capacity_kg: int | None = None
    speed_mps: Decimal | None = None
    floors_served: int | None = None
    installation_date: date | None = None
    status: ElevatorStatus = ElevatorStatus.OPERATIONAL
    last_inspection_date: date | None = None
    next_inspection_due: date | None = None
    v2_document_ids: list[int] = Field(default_factory=list)
    specifications: dict = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime
    model_config = {"frozen": True}

class WorkOrderStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    INVOICED = "invoiced"

class WorkOrderPriority(str, Enum):
    EMERGENCY = "emergency"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    SCHEDULED = "scheduled"

class WorkOrderType(str, Enum):
    BREAKDOWN = "breakdown"
    PREVENTIVE = "preventive"
    INSPECTION = "inspection"
    INSTALLATION = "installation"
    MODERNIZATION = "modernization"
    CALLBACK = "callback"
    AUDIT = "audit"

class WorkOrder(BaseModel):
    id: UUID
    organization_id: UUID
    elevator_id: UUID
    work_order_number: str
    type: WorkOrderType
    priority: WorkOrderPriority = WorkOrderPriority.MEDIUM
    status: WorkOrderStatus = WorkOrderStatus.DRAFT
    title: str
    description: str | None = None
    fault_code: str | None = None
    reported_symptoms: list[str] = Field(default_factory=list)
    reported_at: datetime
    scheduled_start: datetime | None = None
    scheduled_end: datetime | None = None
    actual_start: datetime | None = None
    actual_end: datetime | None = None
    assigned_contractor_id: UUID | None = None
    ai_diagnosis_id: UUID | None = None
    ai_suggested_parts: list[str] = Field(default_factory=list)
    ai_confidence: Decimal | None = None
    resolution_notes: str | None = None
    root_cause: str | None = None
    custom_fields: dict = Field(default_factory=dict)
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    model_config = {"frozen": True}
```

---

## 6. Domain Structure

### Domain Pattern

Each V3 domain follows this structure:

```
sitesync_v3/domains/{domain}/
├── __init__.py       # Public exports
├── contracts.py      # Protocol interfaces
├── models.py         # Pydantic models
├── service.py        # Business logic
├── repository.py     # Data access
└── test_{domain}.py  # Tests
```

### Domain Contracts (Protocols)

```python
# Organizations Domain
class OrganizationRepository(Protocol):
    async def get(self, org_id: UUID) -> Organization | None: ...
    async def get_by_slug(self, slug: str) -> Organization | None: ...
    async def create(self, data: OrganizationCreate) -> Organization: ...
    async def update(self, org_id: UUID, data: dict) -> Organization: ...
    async def delete(self, org_id: UUID) -> None: ...

class OrganizationService(Protocol):
    async def create_organization(self, data: OrganizationCreate) -> Organization: ...
    async def get_organization(self, org_id: UUID) -> Organization: ...
    async def update_settings(self, org_id: UUID, settings: dict) -> Organization: ...

# Assets Domain
class AssetRepository(Protocol):
    async def get_elevator(self, elevator_id: UUID) -> Elevator | None: ...
    async def list_elevators(self, site_id: UUID) -> list[Elevator]: ...
    async def create_elevator(self, data: ElevatorCreate) -> Elevator: ...
    async def update_elevator_status(self, elevator_id: UUID, status: str) -> Elevator: ...
    async def get_site(self, site_id: UUID) -> Site | None: ...
    async def list_sites(self, org_id: UUID) -> list[Site]: ...
    async def create_site(self, data: SiteCreate) -> Site: ...

class AssetService(Protocol):
    async def register_elevator(self, data: ElevatorCreate) -> Elevator: ...
    async def link_documents(self, elevator_id: UUID, document_ids: list[int]) -> None: ...
    async def get_elevator_with_history(self, elevator_id: UUID) -> dict: ...
    async def get_ai_recommendations(self, elevator_id: UUID) -> dict: ...

# Work Orders Domain
class WorkOrderRepository(Protocol):
    async def get(self, work_order_id: UUID) -> WorkOrder | None: ...
    async def list_by_elevator(self, elevator_id: UUID) -> list[WorkOrder]: ...
    async def list_by_contractor(self, contractor_id: UUID) -> list[WorkOrder]: ...
    async def list_by_status(self, org_id: UUID, status: str) -> list[WorkOrder]: ...
    async def create(self, data: WorkOrderCreate) -> WorkOrder: ...
    async def update(self, work_order_id: UUID, data: WorkOrderUpdate) -> WorkOrder: ...

class WorkOrderService(Protocol):
    async def create_work_order(self, data: WorkOrderCreate) -> WorkOrder: ...
    async def assign_contractor(self, work_order_id: UUID, contractor_id: UUID) -> WorkOrder: ...
    async def start_work(self, work_order_id: UUID) -> WorkOrder: ...
    async def complete_work(self, work_order_id: UUID, resolution: str) -> WorkOrder: ...
    async def request_ai_diagnosis(self, work_order_id: UUID) -> dict: ...
    async def get_suggested_parts(self, work_order_id: UUID) -> list[str]: ...

# Audit Domain
class AuditRepository(Protocol):
    async def create(self, event: AuditEventCreate) -> AuditEvent: ...
    async def list_by_entity(self, entity_type: str, entity_id: UUID) -> list[AuditEvent]: ...
    async def list_by_date_range(self, org_id: UUID, start: datetime, end: datetime) -> list[AuditEvent]: ...
    async def verify_chain(self, org_id: UUID) -> bool: ...

class AuditService(Protocol):
    async def log_event(
        self, event_type: str, entity_type: str, entity_id: UUID,
        actor_id: UUID, data: dict
    ) -> AuditEvent: ...
    async def get_entity_history(self, entity_type: str, entity_id: UUID) -> list[AuditEvent]: ...
    async def export_audit_report(self, org_id: UUID, start: datetime, end: datetime) -> bytes: ...
```

---

## 7. Triforce AI System

### Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TRIFORCE V3                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐                     │
│  │  Gemini   │   │  Claude   │   │   GPT-4   │  ← JURY             │
│  │  2.0 Pro  │   │  Sonnet   │   │   Turbo   │    (Parallel)       │
│  └─────┬─────┘   └─────┬─────┘   └─────┬─────┘                     │
│        │               │               │                            │
│        └───────────────┼───────────────┘                            │
│                        ▼                                            │
│              ┌─────────────────┐                                    │
│              │    CONSENSUS    │  ← Weighted by confidence          │
│              │     VOTING      │    (Majority/Quorum/Unanimous)     │
│              └────────┬────────┘                                    │
│                       ▼                                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    WITNESS (Validation)                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │ Graph RAG    │  │ Hybrid Search│  │ Tool Results │       │   │
│  │  │ (Neo4j)      │  │ (V2)         │  │ Verification │       │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             ▼                                       │
│              ┌─────────────────────────┐                            │
│              │         JUDGE           │  ← Claude Opus 4.5        │
│              │  (Final Synthesis)      │    with Skills            │
│              └─────────────────────────┘                            │
│                             │                                       │
│                             ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 HIERARCHICAL MEMORY                          │   │
│  │  ┌───────────┐  ┌───────────┐  ┌────────────┐               │   │
│  │  │ Episodic  │  │ Semantic  │  │ Procedural │               │   │
│  │  │ (Tasks)   │  │ (Facts)   │  │ (Skills)   │               │   │
│  │  └───────────┘  └───────────┘  └────────────┘               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Consensus Voting

```python
class ConsensusVoting:
    """Aggregate jury responses with weighted voting."""

    async def vote(
        self,
        responses: list[JuryResponse],
        weights: dict[str, float] | None = None
    ) -> ConsensusResult:
        """
        Voting strategies:
        - Majority: Most common answer wins
        - Weighted: Factor in model confidence
        - Unanimous: Require agreement
        - Quorum: N of M must agree
        """
        pass
```

### Hierarchical Memory

```python
class HierarchicalMemory:
    """Three-tier memory system."""

    # Episodic: Task-specific context
    episodic: EpisodicMemory  # "Last time with KONE F505..."

    # Semantic: Factual knowledge
    semantic: SemanticMemory  # "F505 means door zone fault"

    # Procedural: Skills and workflows
    procedural: ProceduralMemory  # "How to diagnose door faults"

    async def recall(self, query: str, memory_types: list[str]) -> MemoryContext:
        """Retrieve relevant memories for current task."""
        pass

    async def consolidate(self, task_result: TaskResult) -> None:
        """Move short-term to long-term memory during idle."""
        pass
```

### Skills Manager

```python
class SkillsManager:
    """Load and inject specialized skills."""

    skills_dir: Path = Path("skills/")

    async def load_skill(self, skill_name: str) -> Skill:
        """Load skill definition from YAML/Markdown."""
        pass

    async def inject_skills(self, task: Task, auto_select: bool = True) -> list[Skill]:
        """Select and inject relevant skills for task."""
        pass
```

### Pydantic AI for Structured Outputs

```python
from pydantic import BaseModel
from pydantic_ai import Agent

class DiagnosisResult(BaseModel):
    fault_code: str
    severity: str
    causes: list[str]
    recommended_actions: list[str]
    parts_needed: list[str]
    confidence: float

diagnosis_agent = Agent(
    'gemini-2.0-flash',
    result_type=DiagnosisResult,
    system_prompt="You are an elevator fault diagnosis expert..."
)

result = await diagnosis_agent.run("Door won't close, error F505")
# result.data is DiagnosisResult with structured fields
```

---

## 8. Key Features

### 8.1 Parts Marketplace & Van Stock

**Van Stock Management:**
- Track inventory each technician carries in their vehicle
- Low stock alerts with auto-reorder
- Share parts between techs (same company)
- "Sarah is 2km away with that sensor"

**Parts Marketplace (Network Effect):**
```
┌─────────────────────────────────────────┐
│  MARKETPLACE: Door Sensor               │
│                                         │
│  $35 New - Sydney (Save $12 vs retail)  │
│  $20 Used - Melbourne (Tested working)  │
│                                         │
│  SUPPLIERS:                             │
│  KONE Direct: $47 • Next day            │
│  Motion: $52 • Same day                 │
└─────────────────────────────────────────┘
```

**Flywheel**: More sellers → Better selection → More buyers → More sellers

**Revenue Model**: 2-5% transaction fees + premium features

### 8.2 Multi-Trade Platform Structure

```
Building Manager Dashboard
│
├── LIFTS & ESCALATORS
│   ├── All lifts with Lift AI (specialized knowledge)
│   ├── Fault reporting with guided AI assistance
│   └── Links to: Parts → Fault Codes → Images
│
├── HVAC
│   ├── All HVAC units with HVAC AI
│   ├── Maintenance schedules, filter changes
│   └── Temperature/comfort complaints
│
├── ELECTRICAL
│   ├── Switchboards, circuits, lighting
│   ├── Power quality, load monitoring
│   └── Emergency lighting tests
│
├── PLUMBING
│   ├── Hot water, pumps, drainage
│   ├── Water quality, backflow testing
│   └── Emergency repairs
│
├── FIRE SYSTEMS
│   ├── Detection, suppression, exits
│   ├── Compliance testing schedules
│   └── Incident reports
│
├── SECURITY
│   ├── Access control, CCTV, intercoms
│   └── Incident reports
│
├── PAINTING & FIT-OUT
│   ├── Scheduled refreshes
│   └── Quote management
│
└── REMOVALISTS & LOGISTICS
    ├── Move-in/move-out scheduling
    └── Lift booking for moves
```

### 8.3 Emergency Response Categories

```
EMERGENCY CATEGORY 1 (Immediate - people safety):
├── People stuck in lift
├── Fire/smoke detected
├── Flooding/water damage active
└── Security breach in progress

EMERGENCY CATEGORY 2 (Urgent - building impact):
├── Lift out of service (single lift building)
├── HVAC failure (extreme weather)
├── Power failure
└── Fire system fault

EMERGENCY CATEGORY 3 (Standard):
├── Lift intermittent fault
├── Comfort complaints
├── Minor damage reports
└── Vandalism
```

### 8.4 Breakthrough Innovations (12 Categories)

1. **AI Magic**: AI Vision, Ambient Intelligence, Predictive Summoning
2. **Hardware/IoT**: Smart Stickers (<$5), Acoustic Monitors, Diagnostic Dongle
3. **Collaboration**: Remote Expert AR, Anonymous Knowledge Network
4. **Automation**: Self-Healing Systems, Predictive Parts Ordering
5. **Data & Analytics**: Building Health Score (0-100), Anonymous Benchmarking
6. **Integration**: Universal BMS Connector, API Marketplace
7. **Payment**: Instant Technician Payouts, Equipment-as-a-Service
8. **Training**: AI-Generated Videos, VR Safety Simulations, Micro-Credentials
9. **Communication**: Tech-to-Human Translation, Sentiment Escalation
10. **Accessibility**: Voice-First, Visual Guides, 100+ Languages
11. **Sustainability**: Carbon Footprint Dashboard, ESG Reporting
12. **Security**: Zero-Knowledge Architecture, Blockchain Audit Trail

### 8.5 Building Health Score

**Concept**: Single score (0-100) representing building health

**Calculated from:**
- Equipment age and condition
- Maintenance history and compliance
- Predictive failure risk
- Energy efficiency
- Tenant satisfaction

**Features:**
- Trend over time
- Benchmark against similar buildings
- Predictive: "Score will drop to 65 in 6 months without action"

---

## 9. API Design

### FastAPI Structure

```python
# sitesync_v3/interfaces/api/main.py
from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database pool, cache connections
    await init_db_pool()
    await init_redis()
    yield
    # Shutdown: Close connections
    await close_db_pool()
    await close_redis()

app = FastAPI(
    title="SiteSync V3 API",
    version="3.0.0",
    lifespan=lifespan,
)

# Include routers
app.include_router(organizations_router, prefix="/api/v1/organizations", tags=["organizations"])
app.include_router(sites_router, prefix="/api/v1/sites", tags=["sites"])
app.include_router(elevators_router, prefix="/api/v1/elevators", tags=["elevators"])
app.include_router(work_orders_router, prefix="/api/v1/work-orders", tags=["work-orders"])
app.include_router(contractors_router, prefix="/api/v1/contractors", tags=["contractors"])
app.include_router(inventory_router, prefix="/api/v1/inventory", tags=["inventory"])
app.include_router(diagnosis_router, prefix="/api/v1/diagnosis", tags=["diagnosis"])
```

### Key Endpoints

```
# Organizations
GET    /api/v1/organizations/{org_id}
PATCH  /api/v1/organizations/{org_id}

# Sites
GET    /api/v1/sites
POST   /api/v1/sites
GET    /api/v1/sites/{site_id}
PATCH  /api/v1/sites/{site_id}
DELETE /api/v1/sites/{site_id}

# Elevators
GET    /api/v1/elevators
POST   /api/v1/elevators
GET    /api/v1/elevators/{elevator_id}
PATCH  /api/v1/elevators/{elevator_id}
GET    /api/v1/elevators/{elevator_id}/history

# Work Orders
GET    /api/v1/work-orders
POST   /api/v1/work-orders
GET    /api/v1/work-orders/{work_order_id}
PATCH  /api/v1/work-orders/{work_order_id}
POST   /api/v1/work-orders/{work_order_id}/assign
POST   /api/v1/work-orders/{work_order_id}/start
POST   /api/v1/work-orders/{work_order_id}/complete

# AI Diagnosis
POST   /api/v1/diagnosis/request
GET    /api/v1/diagnosis/{diagnosis_id}
POST   /api/v1/diagnosis/{diagnosis_id}/feedback

# Van Stock
GET    /api/v1/inventory/van-stock
POST   /api/v1/inventory/van-stock
PATCH  /api/v1/inventory/van-stock/{item_id}
GET    /api/v1/inventory/nearby/{part_number}

# Marketplace
GET    /api/v1/marketplace/listings
POST   /api/v1/marketplace/listings
POST   /api/v1/marketplace/search
POST   /api/v1/marketplace/buy
```

---

## 10. Security & Multi-Tenancy

### Row-Level Security (RLS)

All tables enable RLS with organization-scoped policies:

```sql
-- Enable RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE elevators ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users only see their organization's data
CREATE POLICY org_isolation ON sites
    USING (organization_id = current_setting('app.current_org')::uuid);

-- Set organization context on each request
SET app.current_org = 'uuid-of-current-org';
```

### JWT Authentication Pattern

```python
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return User(**payload)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def set_org_context(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(f"SET app.current_org = '{user.organization_id}'")
    return user
```

### Audit Trail with Hash Chain

```python
import hashlib
import json

async def create_audit_event(
    session: AsyncSession,
    event_type: str,
    entity_type: str,
    entity_id: UUID,
    actor_id: UUID,
    data: dict,
    previous_hash: str | None = None
) -> AuditEvent:
    # Compute hash including previous hash for chain integrity
    hash_input = json.dumps({
        "event_type": event_type,
        "entity_id": str(entity_id),
        "actor_id": str(actor_id),
        "data": data,
        "previous_hash": previous_hash or ""
    }, sort_keys=True)

    event_hash = hashlib.sha256(hash_input.encode()).hexdigest()

    event = AuditEvent(
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        actor_id=actor_id,
        event_data=data,
        hash=event_hash
    )
    session.add(event)
    await session.commit()
    return event
```

---

## 11. Market Strategy

### 4-Phase Growth Plan

| Phase | Timeline | ARR Target | Focus |
|-------|----------|------------|-------|
| **1: Foundation** | Months 1-12 | $0-$1M | Australia/NZ, 1000 users, elevator-only |
| **2: Validation** | Months 13-36 | $1M-$10M | North America, marketplace launch |
| **3: Domination** | Years 4-7 | $10M-$100M | Global, multi-trade, IPO prep |
| **4: Global** | Years 8-10 | $100M+ | Industry standard, 1M+ users |

### Pricing Strategy

**Disruptive Pricing (10x undercut):**
| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 10 lookups/month |
| Pro | $29/month | Unlimited lookups, basic features |
| Expert | $79/month | AI diagnosis, custom procedures |
| Enterprise | $500+/month | Team features, analytics |

**Enterprise Volume:**
- 1-10 techs: $29/month each
- 11-50 techs: $24/month each (17% discount)
- 51+ techs: $19/month each (34% discount)

### Competitive Counter-Positioning

| ServiceTitan (Incumbent) | SiteSync (Counter) |
|--------------------------|---------------------|
| $299-899/month | $29/month |
| Weeks to setup | 5 minutes |
| Dedicated hardware | Any device |
| 21 trades (shallow) | 1 trade (deep) → expand |
| Seat-based pricing | Usage-based option |

### Distribution Channels

1. **Trade Associations**: EEAA (Australia), NAEC (North America), LEIA (Europe)
2. **Manufacturer Partners**: KONE, Otis, Schindler white-label deals (20% revenue share)
3. **SEO/Content**: Own every "elevator fault code" search
4. **Trade Schools**: Free for students (lifetime loyalty)
5. **Viral Loop**: Invite 3 colleagues → unlock 50 lookups/month

### Moat Construction

1. **Data Moat**: 100K+ fault diagnoses, temporal patterns (impossible to replicate)
2. **Network Effects**: Parts marketplace, knowledge sharing
3. **Regulatory Moat**: AS 1735, ASME A17.1, ISO 9001 certifications
4. **Ecosystem Moat**: 50+ third-party integrations
5. **Brand Moat**: "SiteSync" synonymous with elevator intelligence

---

## 12. Implementation Roadmap

### Phase 1: Foundation (Months 1-6)

**Must-Have Features:**
1. AI Vision (point camera, get diagnosis)
2. Voice-First Interface (zero typing)
3. Self-Healing Systems (detect → dispatch → resolve)
4. Building Health Score
5. Instant Technician Payouts

**Technical:**
- PostgreSQL + pgvector setup
- FastAPI core routes
- React dashboard MVP
- V2 import bridge
- Basic RLS implementation

### Phase 2: Scale (Months 7-12)

**Focus:**
1. Smart Stickers (ultra-cheap sensors)
2. Anonymous Knowledge Network
3. API Marketplace
4. Green Recommendations
5. Universal BMS Connector

**Technical:**
- Parts marketplace backend
- Van stock management
- Mobile PWA
- Extended integrations

### Phase 3: Advanced (Months 13-24)

**Focus:**
1. VR Training
2. Drone Inspector
3. Equipment-as-a-Service
4. Zero-Knowledge Architecture
5. Blockchain Audit Trail

**Technical:**
- Multi-trade expansion (HVAC, electrical)
- Enterprise features
- Advanced AI (predictive maintenance)
- Global deployment

---

## 13. Code Patterns

### Python 3.12+ Type Syntax

```python
# Use PEP 695 type parameter syntax
class Repository[T]:
    async def get(self, id: UUID) -> T | None: ...
    async def list(self) -> list[T]: ...
    async def create(self, data: T) -> T: ...

# Use X | None instead of Optional[X]
def process(data: str | None = None) -> dict: ...

# Use list[X] instead of List[X]
def get_items() -> list[Item]: ...
```

### Async Repository Pattern

```python
class PostgresElevatorRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, elevator_id: UUID) -> Elevator | None:
        result = await self.session.execute(
            select(ElevatorModel).where(ElevatorModel.id == elevator_id)
        )
        row = result.scalar_one_or_none()
        return Elevator.model_validate(row) if row else None

    async def list_by_site(self, site_id: UUID) -> list[Elevator]:
        result = await self.session.execute(
            select(ElevatorModel).where(ElevatorModel.site_id == site_id)
        )
        return [Elevator.model_validate(row) for row in result.scalars()]

    async def create(self, data: ElevatorCreate) -> Elevator:
        elevator = ElevatorModel(**data.model_dump())
        self.session.add(elevator)
        await self.session.commit()
        await self.session.refresh(elevator)
        return Elevator.model_validate(elevator)
```

### Service Layer Pattern

```python
class WorkOrderService:
    def __init__(
        self,
        repository: WorkOrderRepository,
        audit_service: AuditService,
        diagnosis_client: DiagnosisClient,
    ):
        self.repository = repository
        self.audit = audit_service
        self.diagnosis = diagnosis_client

    async def create_work_order(
        self, data: WorkOrderCreate, actor_id: UUID
    ) -> WorkOrder:
        # Generate work order number
        data.work_order_number = await self._generate_wo_number(data.organization_id)

        # Create work order
        work_order = await self.repository.create(data)

        # Log audit event
        await self.audit.log_event(
            event_type="work_order_created",
            entity_type="work_order",
            entity_id=work_order.id,
            actor_id=actor_id,
            data=work_order.model_dump(),
        )

        return work_order

    async def request_ai_diagnosis(self, work_order_id: UUID) -> DiagnosisResult:
        work_order = await self.repository.get(work_order_id)
        if not work_order:
            raise NotFoundError("Work order not found")

        # Call V2 diagnosis via import bridge
        result = await self.diagnosis.diagnose(
            fault_code=work_order.fault_code,
            symptoms=work_order.reported_symptoms,
            equipment_type=work_order.elevator.manufacturer,
        )

        # Update work order with AI results
        await self.repository.update(work_order_id, {
            "ai_diagnosis_id": result.id,
            "ai_suggested_parts": result.parts_needed,
            "ai_confidence": result.confidence,
        })

        return result
```

### FastAPI Router Pattern

```python
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID

router = APIRouter()

@router.get("/{work_order_id}", response_model=WorkOrderResponse)
async def get_work_order(
    work_order_id: UUID,
    user: User = Depends(set_org_context),
    service: WorkOrderService = Depends(get_work_order_service),
):
    work_order = await service.get_work_order(work_order_id)
    if not work_order:
        raise HTTPException(status_code=404, detail="Work order not found")
    return work_order

@router.post("/", response_model=WorkOrderResponse, status_code=status.HTTP_201_CREATED)
async def create_work_order(
    data: WorkOrderCreate,
    user: User = Depends(set_org_context),
    service: WorkOrderService = Depends(get_work_order_service),
):
    data.organization_id = user.organization_id
    data.created_by = user.id
    return await service.create_work_order(data, actor_id=user.id)

@router.post("/{work_order_id}/diagnose", response_model=DiagnosisResponse)
async def request_diagnosis(
    work_order_id: UUID,
    user: User = Depends(set_org_context),
    service: WorkOrderService = Depends(get_work_order_service),
):
    return await service.request_ai_diagnosis(work_order_id)
```

---

## 14. Quick Reference

### Key Enums

```python
# Elevator Status
'operational' | 'degraded' | 'out_of_service' | 'maintenance' | 'decommissioned'

# Work Order Status
'draft' | 'pending' | 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled' | 'invoiced'

# Work Order Priority
'emergency' | 'high' | 'medium' | 'low' | 'scheduled'

# Work Order Type
'breakdown' | 'preventive' | 'inspection' | 'installation' | 'modernization' | 'callback' | 'audit'

# Audit Event Type
'work_order_created' | 'work_order_updated' | 'work_order_completed' | 'elevator_status_changed' | 'inspection_completed' | 'part_used' | 'labor_logged' | 'diagnosis_requested' | 'document_uploaded' | 'user_action'
```

### Important UUIDs Pattern

All entities use UUID primary keys generated by `gen_random_uuid()`.

### Tenant Isolation Pattern

```python
# Always set organization context before queries
await db.execute(f"SET app.current_org = '{org_id}'")

# RLS policies automatically filter all queries
```

### V2 Import Bridge Pattern

```python
# Import V2 components for reuse
from sitesync.adapters.gemini import GeminiAdapter
from sitesync.domains.diagnosis import DiagnosisAgent

# Use V2 diagnosis in V3 service
class V3DiagnosisService:
    def __init__(self):
        self.v2_agent = DiagnosisAgent(adapter=GeminiAdapter())

    async def diagnose(self, fault_code: str, symptoms: list[str]) -> DiagnosisResult:
        v2_result = await self.v2_agent.run(fault_code, symptoms)
        return DiagnosisResult.from_v2(v2_result)
```

### Success Metrics

| Metric | Target |
|--------|--------|
| Task completion time | -85% |
| First-time fix rate | 90%+ |
| Technician productivity | +30% jobs/day |
| NPS | >70 |
| Churn rate | <5% annual |
| Carbon reduction | 20% per building |

### File Locations

```
V2 Source:     ~/Desktop/sitesync-claudeV2/
V3 Source:     ~/Desktop/sitesync-v3/
Design Docs:   ~/Desktop/SiteSync_V3_Design/
Guide:         ~/Desktop/sitesync/SITESYNC_V3_CLAUDE_CODE_GUIDE.md
```

---

## End of Guide

**Last Updated**: December 2025
**Maintained By**: SiteSync Development Team
**For Claude Code**: This document is optimized for AI assistant context. Update as the system evolves.
