# SiteSync V3 - Architecture

## Technical System Design

> This document provides the technical architecture overview for engineers working on SiteSync V3. It covers system design, technology choices, infrastructure, and the V2/V3 bridge pattern.

---

## Architecture Decision

### Import-Based Bridge (Option C)

SiteSync V3 uses an **Import-Based Bridge** architecture - the best balance of risk, speed, and flexibility.

```
ARCHITECTURE OVERVIEW
══════════════════════════════════════════════════════════════════

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

══════════════════════════════════════════════════════════════════

CODE SPLIT: 65% new code / 35% V2 reuse
```

### Why This Architecture

| Approach | Risk | Speed | Flexibility | Decision |
|----------|------|-------|-------------|----------|
| Full rewrite | High | Slow | High | Too risky |
| Direct port | Low | Fast | Low | Too limiting |
| **Import bridge** | **Medium** | **Medium** | **High** | **Selected** |

---

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERFACES                                │
├─────────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + TanStack Query + Tailwind CSS          │
│  FastAPI 0.115+ (async, OpenAPI 3.1)                            │
│  Mobile: React Native / PWA (Phase 3)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS / WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                 │
├─────────────────────────────────────────────────────────────────┤
│  Cloud Run (auto-scaling)                                        │
│  Cloud Armor (WAF, DDoS protection)                             │
│  Cloud CDN (static assets)                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAINS                                  │
├─────────────────────────────────────────────────────────────────┤
│  V3 (new):                                                       │
│  ├── organizations/    Multi-tenant root                        │
│  ├── assets/           Elevators, sites, equipment              │
│  ├── work_orders/      Job lifecycle                            │
│  ├── contractors/      Workforce management                     │
│  ├── inventory/        Parts & van stock                        │
│  ├── marketplace/      Parts marketplace                        │
│  ├── profiles/         Technician profiles                      │
│  └── audit/            Compliance trail                         │
│                                                                  │
│  V2 (imported):                                                  │
│  ├── diagnosis/        Fault analysis agents (wrapper)          │
│  └── knowledge/        Knowledge base access                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ADAPTERS                                 │
├─────────────────────────────────────────────────────────────────┤
│  V3 Adapters:                                                    │
│  ├── postgres/         AsyncPG + SQLAlchemy 2.0                 │
│  ├── redis/            Caching layer                            │
│  └── storage/          Cloud Storage (documents)                │
│                                                                  │
│  V2 Adapters (imported):                                         │
│  ├── gemini/           LLM calls                                │
│  └── ollama/           Local LLM (development)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE                              │
├─────────────────────────────────────────────────────────────────┤
│  Cloud SQL (PostgreSQL 16+)    │  Primary database              │
│  Memorystore (Redis)           │  Caching, sessions             │
│  Cloud Storage                 │  PDFs, images, documents       │
│  Secret Manager                │  API keys, credentials         │
│  Cloud Tasks                   │  Background jobs               │
│  Pub/Sub                       │  Event streaming               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

### V3 Project Layout

```
~/Desktop/sitesync-v3/
├── sitesync_v3/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Settings & environment
│   │   ├── database.py            # Database connection
│   │   ├── dependencies.py        # FastAPI dependencies
│   │   ├── exceptions.py          # Custom exceptions
│   │   ├── security.py            # Auth utilities
│   │   └── triforce/              # AI system (see docs/explanation/triforce-ai.md)
│   │       ├── __init__.py
│   │       ├── jury.py
│   │       ├── consensus.py
│   │       ├── memory.py
│   │       └── skills.py
│   │
│   ├── domains/
│   │   ├── __init__.py
│   │   ├── organizations/
│   │   │   ├── __init__.py
│   │   │   ├── contracts.py       # Protocol interfaces
│   │   │   ├── models.py          # Pydantic models
│   │   │   ├── service.py         # Business logic
│   │   │   ├── repository.py      # Data access
│   │   │   └── tests/
│   │   │       └── test_organizations.py
│   │   │
│   │   ├── assets/
│   │   │   ├── __init__.py
│   │   │   ├── contracts.py
│   │   │   ├── models.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── tests/
│   │   │
│   │   ├── work_orders/
│   │   │   ├── __init__.py
│   │   │   ├── contracts.py
│   │   │   ├── models.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── tests/
│   │   │
│   │   ├── contractors/
│   │   │   └── ... (same pattern)
│   │   │
│   │   ├── inventory/
│   │   │   └── ... (same pattern)
│   │   │
│   │   ├── marketplace/
│   │   │   └── ... (same pattern)
│   │   │
│   │   ├── profiles/
│   │   │   └── ... (same pattern)
│   │   │
│   │   ├── audit/
│   │   │   └── ... (same pattern)
│   │   │
│   │   └── diagnosis/             # V2 wrapper
│   │       ├── __init__.py
│   │       ├── v2_bridge.py       # Imports from V2
│   │       └── service.py         # V3-compatible interface
│   │
│   ├── adapters/
│   │   ├── __init__.py
│   │   ├── postgres/
│   │   │   ├── __init__.py
│   │   │   ├── connection.py
│   │   │   ├── models.py          # SQLAlchemy models
│   │   │   └── migrations/        # Alembic migrations
│   │   │
│   │   ├── redis/
│   │   │   ├── __init__.py
│   │   │   └── cache.py
│   │   │
│   │   └── storage/
│   │       ├── __init__.py
│   │       └── gcs.py             # Google Cloud Storage
│   │
│   └── interfaces/
│       ├── __init__.py
│       ├── api/
│       │   ├── __init__.py
│       │   ├── main.py            # FastAPI app
│       │   ├── middleware.py
│       │   ├── routers/
│       │   │   ├── __init__.py
│       │   │   ├── organizations.py
│       │   │   ├── sites.py
│       │   │   ├── elevators.py
│       │   │   ├── work_orders.py
│       │   │   ├── contractors.py
│       │   │   ├── inventory.py
│       │   │   ├── marketplace.py
│       │   │   ├── profiles.py
│       │   │   ├── diagnosis.py
│       │   │   └── health.py
│       │   └── schemas/
│       │       ├── __init__.py
│       │       ├── requests.py
│       │       └── responses.py
│       │
│       └── web/                   # React app (separate build)
│           └── ...
│
├── alembic/
│   ├── alembic.ini
│   ├── env.py
│   └── versions/
│
├── data → ../sitesync-claudeV2/data  # SYMLINK to V2 data
│
├── tests/
│   ├── conftest.py
│   ├── integration/
│   └── e2e/
│
├── scripts/
│   ├── migrate.py
│   ├── seed.py
│   └── extract.py
│
├── pyproject.toml
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### V2 Project (Library)

```
~/Desktop/sitesync-claudeV2/
├── sitesync/
│   ├── adapters/
│   │   ├── gemini/              # LLM adapter (reused)
│   │   ├── ollama/              # Local LLM (reused)
│   │   ├── sqlite/              # NOT used in V3
│   │   └── faiss/               # Replaced by pgvector
│   │
│   ├── domains/
│   │   ├── extraction/          # Separate service
│   │   ├── search/              # Replaced by native SQL
│   │   ├── diagnosis/           # REUSED via import
│   │   └── knowledge/           # REUSED via import
│   │
│   └── interfaces/              # V2 interfaces (still running)
│
├── data/
│   ├── processed/platinum/      # 2,307 pre-extracted PDFs
│   └── graph/                   # 1,043 nodes, 432 edges
│
└── pyproject.toml
```

---

## Technology Stack

### Backend

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Language | Python | 3.12+ | Primary backend language |
| Framework | FastAPI | 0.115+ | Async API framework |
| ORM | SQLAlchemy | 2.0+ | Database abstraction |
| Async DB | asyncpg | 0.30+ | PostgreSQL async driver |
| Validation | Pydantic | 2.10+ | Data validation & serialization |
| AI Framework | Pydantic AI | 0.0.9+ | Structured AI outputs |
| Migrations | Alembic | 1.14+ | Database migrations |
| Observability | OpenTelemetry | 1.28+ | Tracing & metrics |

### Database

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Primary DB | PostgreSQL | 16+ | Main data store |
| Vector Store | pgvector | 0.5+ | Embedding storage |
| Text Search | pg_trgm | Built-in | Fuzzy text matching |
| Cache | Redis | 7+ | Caching, sessions |

### Frontend

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | React | 18+ | UI framework |
| Language | TypeScript | 5+ | Type safety |
| State | TanStack Query | 5+ | Server state management |
| Styling | Tailwind CSS | 3+ | Utility-first CSS |
| Build | Vite | 5+ | Build tooling |

### Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| Compute | Cloud Run | Container hosting |
| Database | Cloud SQL | Managed PostgreSQL |
| Cache | Memorystore | Managed Redis |
| Storage | Cloud Storage | File storage |
| Secrets | Secret Manager | Credential storage |
| WAF | Cloud Armor | Security |
| CDN | Cloud CDN | Static assets |
| Tasks | Cloud Tasks | Background jobs |
| Events | Pub/Sub | Event streaming |

---

## V2/V3 Bridge Pattern

### Import Strategy

V3 imports specific V2 components as a library:

```python
# sitesync_v3/domains/diagnosis/v2_bridge.py

"""Bridge to V2 diagnosis functionality."""

from sitesync.adapters.gemini import GeminiAdapter
from sitesync.domains.diagnosis import DiagnosisAgent
from sitesync.domains.knowledge import KnowledgeBase

# Create shared adapter instance
_gemini_adapter = None

def get_gemini_adapter() -> GeminiAdapter:
    """Get or create Gemini adapter singleton."""
    global _gemini_adapter
    if _gemini_adapter is None:
        _gemini_adapter = GeminiAdapter()
    return _gemini_adapter

def get_diagnosis_agent() -> DiagnosisAgent:
    """Get diagnosis agent with V2 implementation."""
    return DiagnosisAgent(adapter=get_gemini_adapter())

def get_knowledge_base() -> KnowledgeBase:
    """Get knowledge base with V2 implementation."""
    return KnowledgeBase(adapter=get_gemini_adapter())
```

### V3-Compatible Service

```python
# sitesync_v3/domains/diagnosis/service.py

"""V3 diagnosis service wrapping V2 implementation."""

from uuid import UUID
from .v2_bridge import get_diagnosis_agent, get_knowledge_base
from ..work_orders.models import WorkOrder
from .models import DiagnosisResult, DiagnosisRequest

class DiagnosisService:
    """V3 service layer for AI diagnosis."""

    def __init__(self):
        self._agent = get_diagnosis_agent()
        self._knowledge = get_knowledge_base()

    async def diagnose(
        self,
        request: DiagnosisRequest
    ) -> DiagnosisResult:
        """
        Run AI diagnosis for a fault.

        Uses V2 diagnosis agent internally but returns
        V3-compatible result models.
        """
        # Call V2 diagnosis
        v2_result = await self._agent.diagnose(
            fault_code=request.fault_code,
            symptoms=request.symptoms,
            equipment_type=request.equipment_type,
            equipment_model=request.equipment_model,
        )

        # Convert to V3 model
        return DiagnosisResult(
            id=UUID(),
            fault_code=v2_result.fault_code,
            severity=v2_result.severity,
            causes=v2_result.causes,
            recommended_actions=v2_result.actions,
            parts_needed=v2_result.parts,
            confidence=v2_result.confidence,
            sources=v2_result.sources,
        )

    async def search_knowledge(
        self,
        query: str,
        equipment_type: str | None = None,
    ) -> list[dict]:
        """Search the knowledge base."""
        return await self._knowledge.search(
            query=query,
            filters={"equipment_type": equipment_type} if equipment_type else None,
        )
```

### pyproject.toml Configuration

```toml
# sitesync_v3/pyproject.toml

[project]
name = "sitesync-v3"
version = "3.0.0"
requires-python = ">=3.12"
dependencies = [
    # V2 as local library
    "sitesync @ file://../sitesync-claudeV2",

    # Core framework
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.32.0",

    # Database
    "sqlalchemy[asyncio]>=2.0.35",
    "asyncpg>=0.30.0",
    "alembic>=1.14.0",

    # Validation & serialization
    "pydantic>=2.10.0",
    "pydantic-settings>=2.6.0",

    # AI
    "pydantic-ai>=0.0.9",

    # Observability
    "opentelemetry-api>=1.28.0",
    "opentelemetry-sdk>=1.28.0",
    "opentelemetry-instrumentation-fastapi>=0.49b0",

    # Utilities
    "httpx>=0.27.0",
    "python-multipart>=0.0.12",
    "python-jose[cryptography]>=3.3.0",
    "passlib[bcrypt]>=1.7.4",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.3.0",
    "pytest-asyncio>=0.24.0",
    "pytest-cov>=6.0.0",
    "mypy>=1.13.0",
    "ruff>=0.8.0",
    "pre-commit>=4.0.0",
]
```

---

## Database Architecture

### PostgreSQL Features Used

| Feature | Purpose |
|---------|---------|
| **Row-Level Security (RLS)** | Multi-tenant data isolation |
| **pgvector** | Embedding storage for semantic search |
| **pg_trgm** | Fuzzy text matching |
| **JSONB** | Flexible metadata storage |
| **Table Partitioning** | Scale audit_events table |
| **CTEs** | Complex queries (graph-like traversal) |

### Connection Management

```python
# sitesync_v3/core/database.py

from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from .config import settings

# Create async engine
engine = create_async_engine(
    settings.database_url,
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,
    echo=settings.debug,
)

# Session factory
async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

@asynccontextmanager
async def get_session():
    """Get database session with automatic cleanup."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def set_tenant_context(
    session: AsyncSession,
    organization_id: str
) -> None:
    """Set RLS context for multi-tenant isolation."""
    await session.execute(
        f"SET app.current_org = '{organization_id}'"
    )
```

---

## Caching Strategy

### Redis Usage

```python
# sitesync_v3/adapters/redis/cache.py

import redis.asyncio as redis
from typing import Any
import json

class CacheService:
    """Redis caching service."""

    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)

    async def get(self, key: str) -> Any | None:
        """Get value from cache."""
        value = await self.redis.get(key)
        if value:
            return json.loads(value)
        return None

    async def set(
        self,
        key: str,
        value: Any,
        ttl: int = 3600
    ) -> None:
        """Set value in cache with TTL."""
        await self.redis.setex(
            key,
            ttl,
            json.dumps(value)
        )

    async def invalidate(self, pattern: str) -> None:
        """Invalidate keys matching pattern."""
        keys = await self.redis.keys(pattern)
        if keys:
            await self.redis.delete(*keys)

# Cache key patterns
CACHE_KEYS = {
    "elevator": "elevator:{elevator_id}",
    "site_elevators": "site:{site_id}:elevators",
    "org_stats": "org:{org_id}:stats",
    "diagnosis": "diagnosis:{work_order_id}",
}
```

### Cache Invalidation Strategy

| Event | Invalidation |
|-------|--------------|
| Elevator updated | `elevator:{id}`, `site:{site_id}:elevators` |
| Work order created | `org:{org_id}:stats` |
| Work order completed | `org:{org_id}:stats`, `elevator:{id}` |
| Site modified | `site:{id}:*` |

---

## Infrastructure Architecture

### Cloud Run Configuration

```yaml
# cloudrun.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: sitesync-api
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "1"
        autoscaling.knative.dev/maxScale: "100"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
        - image: gcr.io/PROJECT_ID/sitesync-api
          ports:
            - containerPort: 8080
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-url
                  key: latest
          resources:
            limits:
              cpu: "2"
              memory: "2Gi"
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir -e .

# Copy application
COPY sitesync_v3/ ./sitesync_v3/

# Run with uvicorn
CMD ["uvicorn", "sitesync_v3.interfaces.api.main:app", \
     "--host", "0.0.0.0", "--port", "8080"]
```

---

## Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User logs in with credentials                               │
│     └── POST /api/v1/auth/login                                 │
│                                                                 │
│  2. Server validates credentials                                │
│     └── Check password hash                                     │
│     └── Verify user active                                      │
│                                                                 │
│  3. Server issues JWT tokens                                    │
│     └── Access token (15 min)                                   │
│     └── Refresh token (7 days)                                  │
│                                                                 │
│  4. Client stores tokens                                        │
│     └── Access token in memory                                  │
│     └── Refresh token in httpOnly cookie                        │
│                                                                 │
│  5. Client makes authenticated requests                         │
│     └── Authorization: Bearer {access_token}                    │
│                                                                 │
│  6. Server validates token & sets tenant context                │
│     └── Verify JWT signature                                    │
│     └── SET app.current_org = '{org_id}'                        │
│     └── RLS policies filter all queries                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Multi-Tenant Isolation

```sql
-- Every table has organization_id
-- RLS policies ensure users only see their org's data

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_isolation ON sites
    USING (organization_id = current_setting('app.current_org')::uuid);

-- This happens automatically on every query
-- No application code can bypass it
```

---

## Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐     │
│  │  Code   │───►│  Test   │───►│  Build  │───►│ Deploy  │     │
│  │  Push   │    │  Suite  │    │  Image  │    │  Cloud  │     │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘     │
│       │              │              │              │           │
│       │              │              │              │           │
│       ▼              ▼              ▼              ▼           │
│   GitHub        pytest         Docker         Cloud Run       │
│   Actions       + mypy         + GCR          + Traffic       │
│                 + ruff                         Splitting       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

ENVIRONMENTS:
├── Development: Local Docker Compose
├── Staging: Cloud Run (auto-deploy from main)
└── Production: Cloud Run (manual promotion)
```

---

## What V3 Does NOT Include

These V2 components are explicitly excluded from V3:

| Component | Reason | Replacement |
|-----------|--------|-------------|
| `domains/extraction/` | Separate microservice | Cloud Function |
| `adapters/faiss/` | Replaced | pgvector |
| `adapters/sqlite/` | Replaced | PostgreSQL |
| `domains/search/hybrid_search.py` | Replaced | Native SQL query |

---

## Next Steps

For implementation details, see:
- [Data Model](data-model.md) - Database schemas
- [Triforce AI](../explanation/triforce-ai.md) - AI system architecture
- [Implementation](implementation.md) - Code patterns

---

**[← Back to Platform Ecosystem](../explanation/platform-ecosystem.md)** | **[Next: Data Model →](data-model.md)**
