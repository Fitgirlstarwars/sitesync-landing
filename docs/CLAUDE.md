# SiteSync V3 - Project Context

> AI-Native Building Services Operating System. Buildings own their service history permanently.

## What This Is

SiteSync manages building equipment (elevators, HVAC, electrical) with AI assistance. When contractors change, data stays with the building.

## Key Entities

- **Organization**: Multi-tenant root (a company)
- **Site**: A building/location
- **Elevator**: Equipment asset
- **Work Order**: A job/task
- **Contractor**: Service provider
- **Triforce AI**: Multi-model consensus (Gemini + Claude + GPT-4)

## Tech Stack

- Database: PostgreSQL 16+ with RLS, pgvector
- Backend: FastAPI, Python 3.12+
- Frontend: React 18, TypeScript
- AI: Triforce + Pydantic AI

## Code Patterns

```python
# Modern Python type syntax
def get_elevator(id: UUID) -> Elevator | None: ...
def list_sites() -> list[Site]: ...
```

- Use `X | None` not `Optional[X]`
- Use `list[X]` not `List[X]`
- Async/await for all DB operations
- Domain structure: contracts.py, models.py, service.py, repository.py

## Multi-Tenancy

```sql
SET app.current_org = 'organization-uuid';
-- All queries now filter by organization
```

## Directory Structure

```
sitesync/
├── CLAUDE.md          # This file
├── AI_CONTEXT.md      # Detailed AI context
├── CLAUDE_CODE_GUIDE.md # Complete reference
├── llms.txt           # AI discovery index
├── .llm-manifest.json # Machine-readable index
└── docs/              # Full documentation
```

## Reading Order

1. This file (CLAUDE.md)
2. docs/GLOSSARY.md - Terminology
3. AI_CONTEXT.md - Extended context
4. docs/reference/data-model.md - Schemas
5. CLAUDE_CODE_GUIDE.md - Complete reference

## Common Tasks

### Implement a Feature
1. Check data model: `docs/reference/data-model.md`
2. Follow domain pattern: contracts, models, service, repository
3. Use async/await, add audit events, set RLS context

### AI Diagnosis
1. See Triforce: `docs/explanation/triforce-ai.md`
2. Pipeline: jury → consensus → witness → judge

## Project Status

Design & Early Development phase. Schemas defined, partial implementation.

## Full Documentation

See `AI_CONTEXT.md` for extended context or `CLAUDE_CODE_GUIDE.md` for complete reference.
