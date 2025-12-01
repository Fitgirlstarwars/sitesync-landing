# SiteSync V3 - Quick Reference

## Cheatsheet & Lookup Guide

> This document provides quick access to commonly needed information, enums, patterns, and reference material.

---

## The Tagline

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║         YOUR BUILDING. YOUR DATA. YOUR INTELLIGENCE.             ║
║                                                                  ║
║                  Contractors come and go.                        ║
║                  Your building remembers forever.                ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Why It Works

| Element | Purpose |
|---------|---------|
| "YOUR" (×3) | Hammers ownership - the core differentiator |
| "BUILDING → DATA → INTELLIGENCE" | Escalation - not just storage, but wisdom |
| "Contractors come and go" | Acknowledges reality without blame |
| "Your building remembers forever" | Building as protagonist, permanence |

### Where To Use It

| Location | Format |
|----------|--------|
| **Website hero** | Full tagline, large text |
| **Pitch deck slide 1** | Full tagline |
| **Email signatures** | Line 1 only |
| **App loading screen** | Full tagline |
| **Marketing materials** | Full tagline |
| **Social media bio** | Line 1 only |
| **Business cards** | Line 2 only ("Your building remembers forever") |

### Variations

**Full (preferred):**
> YOUR BUILDING. YOUR DATA. YOUR INTELLIGENCE.
> Contractors come and go. Your building remembers forever.

**Short (Line 1 only):**
> YOUR BUILDING. YOUR DATA. YOUR INTELLIGENCE.

**Emotional (Line 2 only):**
> Contractors come and go. Your building remembers forever.

**Ultra-short:**
> Your building remembers forever.

---

## Key Enums

### Elevator Status

```python
'operational'      # Running normally
'degraded'         # Running with issues
'out_of_service'   # Not running
'maintenance'      # Scheduled maintenance
'decommissioned'   # No longer in use
```

### Work Order Status

```python
'draft'        # Created but not submitted
'pending'      # Awaiting assignment
'scheduled'    # Assigned and scheduled
'in_progress'  # Work started
'on_hold'      # Paused
'completed'    # Work finished
'cancelled'    # Cancelled
'invoiced'     # Invoiced/closed
```

### Work Order Priority

```python
'emergency'    # Immediate response
'high'         # Same day
'medium'       # Within 48 hours
'low'          # Within week
'scheduled'    # Planned maintenance
```

### Work Order Type

```python
'breakdown'      # Equipment failure
'preventive'     # Scheduled maintenance
'inspection'     # Safety inspection
'installation'   # New installation
'modernization'  # Upgrade project
'callback'       # Return visit
'audit'          # Compliance audit
```

### Audit Event Types

```python
'work_order_created'
'work_order_updated'
'work_order_assigned'
'work_order_started'
'work_order_completed'
'work_order_cancelled'
'elevator_created'
'elevator_updated'
'elevator_status_changed'
'inspection_scheduled'
'inspection_completed'
'part_used'
'labor_logged'
'diagnosis_requested'
'document_uploaded'
'user_action'
```

---

## File Locations

```
DEVELOPMENT DIRECTORIES
═══════════════════════════════════════════════════

V2 Source (Library):
~/Desktop/sitesync-claudeV2/

V3 Source (New System):
~/Desktop/sitesync-v3/

Design Documents:
~/Desktop/SiteSync_V3_Design/

Reference Guide:
~/Desktop/sitesync/SITESYNC_V3_REFERENCE/

V2 Data (Symlinked):
~/Desktop/sitesync-v3/data → ../sitesync-claudeV2/data
```

---

## Technology Stack Quick Reference

### Backend

| What | Technology |
|------|------------|
| Language | Python 3.12+ |
| Framework | FastAPI 0.115+ |
| ORM | SQLAlchemy 2.0+ |
| Database Driver | asyncpg |
| Validation | Pydantic 2.10+ |
| AI | Pydantic AI 0.0.9+ |

### Database

| What | Technology |
|------|------------|
| Primary | PostgreSQL 16+ |
| Vectors | pgvector |
| Text Search | pg_trgm |
| Cache | Redis 7+ |

### Frontend

| What | Technology |
|------|------------|
| Framework | React 18 |
| Language | TypeScript 5+ |
| State | TanStack Query |
| Styling | Tailwind CSS |

### Infrastructure

| What | Technology |
|------|------------|
| Compute | Cloud Run |
| Database | Cloud SQL |
| Cache | Memorystore |
| Storage | Cloud Storage |

---

## Common Patterns

### Set Tenant Context

```python
# Always set before queries
await session.execute(
    f"SET app.current_org = '{organization_id}'"
)
```

### V2 Import Bridge

```python
from sitesync.adapters.gemini import GeminiAdapter
from sitesync.domains.diagnosis import DiagnosisAgent

agent = DiagnosisAgent(adapter=GeminiAdapter())
result = await agent.diagnose(fault_code, symptoms)
```

### Repository Pattern

```python
class PostgresRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, id: UUID) -> Model | None:
        result = await self.session.execute(
            select(DBModel).where(DBModel.id == id)
        )
        row = result.scalar_one_or_none()
        return Model.model_validate(row) if row else None
```

### Service Pattern

```python
class Service:
    def __init__(
        self,
        repository: Repository,
        audit: AuditService,
    ):
        self.repository = repository
        self.audit = audit

    async def create(self, data: CreateDTO, actor_id: UUID) -> Model:
        result = await self.repository.create(data)
        await self.audit.log_event(
            event_type="created",
            entity_id=result.id,
            actor_id=actor_id,
            data=result.model_dump(),
        )
        return result
```

### FastAPI Router

```python
@router.get("/{id}", response_model=Response)
async def get_item(
    id: UUID,
    user = Depends(get_current_user),
    service = Depends(get_service),
):
    item = await service.get(id)
    if not item:
        raise HTTPException(404, "Not found")
    return Response(data=item)
```

---

## API Quick Reference

### Authentication

```
POST /auth/login          # Get tokens
POST /auth/refresh        # Refresh access token
POST /auth/logout         # Invalidate tokens
```

### Sites

```
GET    /sites             # List sites
POST   /sites             # Create site
GET    /sites/{id}        # Get site
PATCH  /sites/{id}        # Update site
DELETE /sites/{id}        # Delete site
GET    /sites/{id}/health # Get health score
```

### Elevators

```
GET    /elevators              # List elevators
POST   /elevators              # Create elevator
GET    /elevators/{id}         # Get elevator
PATCH  /elevators/{id}         # Update elevator
GET    /elevators/{id}/history # Get history
PATCH  /elevators/{id}/status  # Update status
```

### Work Orders

```
GET    /work-orders                    # List
POST   /work-orders                    # Create
GET    /work-orders/{id}               # Get
PATCH  /work-orders/{id}               # Update
POST   /work-orders/{id}/assign        # Assign
POST   /work-orders/{id}/start         # Start
POST   /work-orders/{id}/complete      # Complete
```

### Diagnosis

```
POST   /diagnosis/request              # Request AI diagnosis
GET    /diagnosis/{id}                 # Get diagnosis
POST   /diagnosis/{id}/feedback        # Submit feedback
```

### Inventory

```
GET    /inventory                      # List items
GET    /inventory/van-stock            # Get van stock
GET    /inventory/nearby/{part}        # Find nearby
```

---

## Database Quick Reference

### Core Tables

```
organizations        # Tenant root
users               # User accounts
sites               # Buildings/locations
elevators           # Assets
contractors         # Service providers
work_orders         # Jobs
work_order_tasks    # Task checklist
work_order_parts    # Parts used
work_order_labor    # Labor logged
inventory_items     # Parts catalog
stock_locations     # Van/warehouse stock
audit_events        # Immutable log
```

### Profile Tables

```
technician_profiles      # Tech profiles (platform-wide)
profile_certifications   # Verified certs
knowledge_contributions  # Shared knowledge
```

### RLS Policy

```sql
CREATE POLICY org_isolation ON {table}
    USING (organization_id = current_setting('app.current_org')::uuid);
```

---

## Health Score Calculation

```
BUILDING HEALTH SCORE (0-100)
═══════════════════════════════════════════════════

Component               Weight
─────────────────────────────────
Equipment Condition      25%
Maintenance Compliance   25%
Incident Frequency       20%
First-Time Fix Rate      15%
Predictive Risk          15%
─────────────────────────────────
Total                   100%
```

---

## Emergency Categories

| Category | Response | Examples |
|----------|----------|----------|
| **Cat 1** | Immediate | Trapped passengers, fire |
| **Cat 2** | 1 hour | Out of service, HVAC fail |
| **Cat 3** | Next day | Intermittent fault, complaints |

---

## Pricing Quick Reference

### Buildings

| Tier | Price | Features |
|------|-------|----------|
| Free | $0 | 10 lookups/month |
| Pro | $29/mo | Unlimited |
| Enterprise | $500+/mo | Custom |

### Volume Discounts

| Buildings | Price |
|-----------|-------|
| 1-10 | $29/mo |
| 11-50 | $24/mo |
| 51+ | $19/mo |

### Technicians

| Tier | Price |
|------|-------|
| Basic | $0 |
| Premium | $9/mo |

### Marketplace

| Type | Fee |
|------|-----|
| P2P | 5% |
| Supplier | 3% |

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Task completion time | -85% |
| First-time fix rate | 90%+ |
| Technician productivity | +30% |
| NPS | >70 |
| Annual churn | <5% |

---

## Common Commands

### Development

```bash
# Start development server
uvicorn sitesync_v3.interfaces.api.main:app --reload

# Run tests
pytest

# Run with coverage
pytest --cov=sitesync_v3

# Type check
mypy sitesync_v3

# Lint
ruff check sitesync_v3

# Format
ruff format sitesync_v3
```

### Database

```bash
# Create migration
alembic revision --autogenerate -m "description"

# Run migrations
alembic upgrade head

# Rollback one
alembic downgrade -1
```

### Docker

```bash
# Build
docker build -t sitesync-api .

# Run
docker-compose up -d

# Logs
docker-compose logs -f api
```

---

## Document Map

| Location | Purpose | Audience |
|----------|---------|----------|
| docs/README.md | Navigation hub | Everyone |
| docs/explanation/vision.md | Core message | Everyone |
| docs/explanation/for-buildings.md | Building value prop | Sales, Product |
| docs/explanation/for-technicians.md | Tech value prop | Sales, Product |
| docs/explanation/platform-ecosystem.md | Ecosystem design | Strategy |
| docs/reference/architecture.md | System design | Engineering |
| docs/reference/data-model.md | Database schemas | Engineering |
| docs/explanation/triforce-ai.md | AI system | Engineering |
| docs/reference/api.md | API docs | Engineering |
| docs/reference/features.md | Feature specs | Product |
| docs/reference/implementation.md | Code patterns | Engineering |
| docs/strategy/market-strategy.md | GTM plan | Leadership |
| docs/reference/quick-reference.md | Cheatsheet | Everyone |

---

## Contact & Resources

```
Documentation:  ~/Desktop/sitesync/SITESYNC_V3_REFERENCE/
Source (V3):    ~/Desktop/sitesync-v3/
Source (V2):    ~/Desktop/sitesync-claudeV2/
```

---

**[← Back to Market Strategy](../strategy/market-strategy.md)** | **[Back to Documentation Hub →](../README.md)**
