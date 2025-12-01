# SiteSync V3 - Implementation Guide

## Code Patterns & Best Practices

> This document provides the implementation patterns, code conventions, and best practices for developing SiteSync V3.

---

## Python Conventions

### Version & Typing

Use Python 3.12+ features:

```python
# PEP 695 type parameter syntax
class Repository[T]:
    async def get(self, id: UUID) -> T | None: ...
    async def list(self) -> list[T]: ...
    async def create(self, data: T) -> T: ...

# Use X | None instead of Optional[X]
def process(data: str | None = None) -> dict: ...

# Use list[X] instead of List[X]
def get_items() -> list[Item]: ...

# Use dict[K, V] instead of Dict[K, V]
def get_mapping() -> dict[str, int]: ...
```

### Imports

```python
# Standard library
from datetime import datetime, date
from decimal import Decimal
from uuid import UUID
from typing import Protocol
from dataclasses import dataclass
from enum import Enum
import asyncio

# Third party
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException

# Local
from sitesync_v3.core.database import get_session
from sitesync_v3.domains.assets.models import Elevator
```

---

## Domain Pattern

### Structure

Each domain follows this pattern:

```
domains/{domain}/
├── __init__.py       # Public exports
├── contracts.py      # Protocol interfaces
├── models.py         # Pydantic models
├── service.py        # Business logic
├── repository.py     # Data access
└── tests/
    └── test_{domain}.py
```

### Contracts (Protocols)

Define interfaces as protocols:

```python
# domains/assets/contracts.py

from typing import Protocol
from uuid import UUID
from .models import Elevator, ElevatorCreate, ElevatorUpdate

class ElevatorRepository(Protocol):
    """Repository interface for elevator data access."""

    async def get(self, elevator_id: UUID) -> Elevator | None:
        """Get elevator by ID."""
        ...

    async def list_by_site(self, site_id: UUID) -> list[Elevator]:
        """List all elevators for a site."""
        ...

    async def create(self, data: ElevatorCreate) -> Elevator:
        """Create a new elevator."""
        ...

    async def update(
        self, elevator_id: UUID, data: ElevatorUpdate
    ) -> Elevator:
        """Update an elevator."""
        ...

    async def delete(self, elevator_id: UUID) -> None:
        """Delete an elevator."""
        ...


class ElevatorService(Protocol):
    """Service interface for elevator business logic."""

    async def register_elevator(
        self, data: ElevatorCreate
    ) -> Elevator:
        """Register a new elevator with validation."""
        ...

    async def update_status(
        self, elevator_id: UUID, status: str, reason: str
    ) -> Elevator:
        """Update elevator status with audit logging."""
        ...

    async def get_health_score(
        self, elevator_id: UUID
    ) -> dict:
        """Calculate and return health score."""
        ...
```

### Models (Pydantic)

```python
# domains/assets/models.py

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class ElevatorStatus(str, Enum):
    OPERATIONAL = "operational"
    DEGRADED = "degraded"
    OUT_OF_SERVICE = "out_of_service"
    MAINTENANCE = "maintenance"
    DECOMMISSIONED = "decommissioned"

class Elevator(BaseModel):
    """Elevator domain model (immutable)."""

    model_config = ConfigDict(frozen=True)

    id: UUID
    organization_id: UUID
    site_id: UUID
    unit_number: str
    serial_number: str | None = None
    manufacturer: str | None = None
    model: str | None = None
    status: ElevatorStatus = ElevatorStatus.OPERATIONAL
    health_score: int | None = None
    created_at: datetime
    updated_at: datetime

class ElevatorCreate(BaseModel):
    """Request model for creating elevator."""

    site_id: UUID
    unit_number: str
    serial_number: str | None = None
    manufacturer: str | None = None
    model: str | None = None

class ElevatorUpdate(BaseModel):
    """Request model for updating elevator."""

    unit_number: str | None = None
    serial_number: str | None = None
    manufacturer: str | None = None
    model: str | None = None
    status: ElevatorStatus | None = None
```

### Repository (Data Access)

```python
# domains/assets/repository.py

from uuid import UUID
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Elevator, ElevatorCreate, ElevatorUpdate
from sitesync_v3.adapters.postgres.models import ElevatorModel

class PostgresElevatorRepository:
    """PostgreSQL implementation of elevator repository."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, elevator_id: UUID) -> Elevator | None:
        """Get elevator by ID."""
        result = await self.session.execute(
            select(ElevatorModel).where(ElevatorModel.id == elevator_id)
        )
        row = result.scalar_one_or_none()
        return Elevator.model_validate(row) if row else None

    async def list_by_site(self, site_id: UUID) -> list[Elevator]:
        """List all elevators for a site."""
        result = await self.session.execute(
            select(ElevatorModel)
            .where(ElevatorModel.site_id == site_id)
            .order_by(ElevatorModel.unit_number)
        )
        return [Elevator.model_validate(row) for row in result.scalars()]

    async def create(self, data: ElevatorCreate) -> Elevator:
        """Create a new elevator."""
        elevator = ElevatorModel(**data.model_dump())
        self.session.add(elevator)
        await self.session.flush()
        await self.session.refresh(elevator)
        return Elevator.model_validate(elevator)

    async def update(
        self,
        elevator_id: UUID,
        data: ElevatorUpdate,
    ) -> Elevator:
        """Update an elevator."""
        update_data = data.model_dump(exclude_unset=True)
        await self.session.execute(
            update(ElevatorModel)
            .where(ElevatorModel.id == elevator_id)
            .values(**update_data)
        )
        return await self.get(elevator_id)

    async def delete(self, elevator_id: UUID) -> None:
        """Soft delete an elevator."""
        await self.session.execute(
            update(ElevatorModel)
            .where(ElevatorModel.id == elevator_id)
            .values(deleted_at=datetime.now())
        )
```

### Service (Business Logic)

```python
# domains/assets/service.py

from uuid import UUID
from datetime import datetime

from .contracts import ElevatorRepository
from .models import Elevator, ElevatorCreate, ElevatorUpdate, ElevatorStatus
from ..audit.service import AuditService
from sitesync_v3.core.exceptions import NotFoundError, ValidationError

class ElevatorService:
    """Business logic for elevator management."""

    def __init__(
        self,
        repository: ElevatorRepository,
        audit_service: AuditService,
    ):
        self.repository = repository
        self.audit = audit_service

    async def register_elevator(
        self,
        data: ElevatorCreate,
        actor_id: UUID,
    ) -> Elevator:
        """
        Register a new elevator.

        Validates input, creates elevator, and logs audit event.
        """
        # Validation
        if not data.unit_number:
            raise ValidationError("Unit number is required")

        # Create
        elevator = await self.repository.create(data)

        # Audit
        await self.audit.log_event(
            event_type="elevator_created",
            entity_type="elevator",
            entity_id=elevator.id,
            actor_id=actor_id,
            data=elevator.model_dump(),
        )

        return elevator

    async def update_status(
        self,
        elevator_id: UUID,
        status: ElevatorStatus,
        reason: str,
        actor_id: UUID,
    ) -> Elevator:
        """
        Update elevator status with audit logging.
        """
        # Get current state
        current = await self.repository.get(elevator_id)
        if not current:
            raise NotFoundError("Elevator not found")

        previous_status = current.status

        # Update
        elevator = await self.repository.update(
            elevator_id,
            ElevatorUpdate(status=status),
        )

        # Audit
        await self.audit.log_event(
            event_type="elevator_status_changed",
            entity_type="elevator",
            entity_id=elevator_id,
            actor_id=actor_id,
            data={
                "previous_status": previous_status,
                "new_status": status,
                "reason": reason,
            },
            previous_state={"status": previous_status},
            new_state={"status": status},
        )

        return elevator

    async def get_health_score(
        self,
        elevator_id: UUID,
    ) -> dict:
        """
        Calculate elevator health score.
        """
        elevator = await self.repository.get(elevator_id)
        if not elevator:
            raise NotFoundError("Elevator not found")

        # Calculate components (simplified)
        age_score = self._calculate_age_score(elevator)
        maintenance_score = await self._get_maintenance_score(elevator_id)
        incident_score = await self._get_incident_score(elevator_id)

        overall = int(
            age_score * 0.3 +
            maintenance_score * 0.4 +
            incident_score * 0.3
        )

        return {
            "elevator_id": elevator_id,
            "health_score": overall,
            "breakdown": {
                "age_condition": age_score,
                "maintenance_compliance": maintenance_score,
                "incident_frequency": incident_score,
            },
        }

    def _calculate_age_score(self, elevator: Elevator) -> int:
        """Calculate score based on equipment age."""
        if not elevator.installation_date:
            return 70  # Default for unknown

        age_years = (date.today() - elevator.installation_date).days / 365

        if age_years < 5:
            return 95
        elif age_years < 10:
            return 85
        elif age_years < 20:
            return 70
        else:
            return 55
```

---

## FastAPI Patterns

### Router Structure

```python
# interfaces/api/routers/elevators.py

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status

from sitesync_v3.core.dependencies import (
    get_current_user,
    get_elevator_service,
)
from sitesync_v3.domains.assets.models import (
    Elevator,
    ElevatorCreate,
    ElevatorUpdate,
)
from sitesync_v3.domains.assets.service import ElevatorService
from ..schemas.responses import ElevatorResponse, ElevatorListResponse

router = APIRouter()

@router.get("", response_model=ElevatorListResponse)
async def list_elevators(
    site_id: UUID | None = None,
    status: str | None = None,
    page: int = 1,
    per_page: int = 20,
    user = Depends(get_current_user),
    service: ElevatorService = Depends(get_elevator_service),
):
    """List elevators with optional filtering."""
    elevators = await service.list_elevators(
        site_id=site_id,
        status=status,
        page=page,
        per_page=per_page,
    )
    return ElevatorListResponse(data=elevators)

@router.get("/{elevator_id}", response_model=ElevatorResponse)
async def get_elevator(
    elevator_id: UUID,
    user = Depends(get_current_user),
    service: ElevatorService = Depends(get_elevator_service),
):
    """Get elevator by ID."""
    elevator = await service.get_elevator(elevator_id)
    if not elevator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Elevator not found"
        )
    return ElevatorResponse(data=elevator)

@router.post("", response_model=ElevatorResponse, status_code=status.HTTP_201_CREATED)
async def create_elevator(
    data: ElevatorCreate,
    user = Depends(get_current_user),
    service: ElevatorService = Depends(get_elevator_service),
):
    """Create a new elevator."""
    elevator = await service.register_elevator(data, actor_id=user.id)
    return ElevatorResponse(data=elevator)

@router.patch("/{elevator_id}", response_model=ElevatorResponse)
async def update_elevator(
    elevator_id: UUID,
    data: ElevatorUpdate,
    user = Depends(get_current_user),
    service: ElevatorService = Depends(get_elevator_service),
):
    """Update an elevator."""
    elevator = await service.update_elevator(
        elevator_id, data, actor_id=user.id
    )
    return ElevatorResponse(data=elevator)

@router.patch("/{elevator_id}/status", response_model=ElevatorResponse)
async def update_status(
    elevator_id: UUID,
    status: str,
    reason: str,
    user = Depends(get_current_user),
    service: ElevatorService = Depends(get_elevator_service),
):
    """Update elevator status."""
    elevator = await service.update_status(
        elevator_id=elevator_id,
        status=status,
        reason=reason,
        actor_id=user.id,
    )
    return ElevatorResponse(data=elevator)

@router.get("/{elevator_id}/health")
async def get_health(
    elevator_id: UUID,
    user = Depends(get_current_user),
    service: ElevatorService = Depends(get_elevator_service),
):
    """Get elevator health score."""
    return await service.get_health_score(elevator_id)
```

### Dependency Injection

```python
# core/dependencies.py

from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .database import async_session
from .security import get_current_user_from_token

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Get database session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_session),
):
    """Get current authenticated user and set tenant context."""
    user = await get_current_user_from_token(token, session)

    # Set RLS context
    await session.execute(
        f"SET app.current_org = '{user.organization_id}'"
    )

    return user

def get_elevator_service(
    session: AsyncSession = Depends(get_session),
) -> ElevatorService:
    """Get elevator service with dependencies."""
    repository = PostgresElevatorRepository(session)
    audit_service = AuditService(session)
    return ElevatorService(repository, audit_service)
```

---

## Error Handling

### Custom Exceptions

```python
# core/exceptions.py

class SiteSyncError(Exception):
    """Base exception for SiteSync."""
    pass

class NotFoundError(SiteSyncError):
    """Resource not found."""
    pass

class ValidationError(SiteSyncError):
    """Validation failed."""
    pass

class AuthenticationError(SiteSyncError):
    """Authentication failed."""
    pass

class AuthorizationError(SiteSyncError):
    """Authorization failed."""
    pass

class ConflictError(SiteSyncError):
    """Resource conflict."""
    pass
```

### Exception Handlers

```python
# interfaces/api/middleware.py

from fastapi import Request
from fastapi.responses import JSONResponse

from sitesync_v3.core.exceptions import (
    NotFoundError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
)

async def not_found_handler(request: Request, exc: NotFoundError):
    return JSONResponse(
        status_code=404,
        content={
            "error": {
                "code": "NOT_FOUND",
                "message": str(exc),
            }
        },
    )

async def validation_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": str(exc),
            }
        },
    )

# Register in main.py
app.add_exception_handler(NotFoundError, not_found_handler)
app.add_exception_handler(ValidationError, validation_handler)
```

---

## Testing

### Test Structure

```python
# domains/assets/tests/test_elevators.py

import pytest
from uuid import uuid4
from unittest.mock import AsyncMock

from sitesync_v3.domains.assets.service import ElevatorService
from sitesync_v3.domains.assets.models import (
    Elevator,
    ElevatorCreate,
    ElevatorStatus,
)

@pytest.fixture
def mock_repository():
    return AsyncMock()

@pytest.fixture
def mock_audit():
    return AsyncMock()

@pytest.fixture
def service(mock_repository, mock_audit):
    return ElevatorService(mock_repository, mock_audit)

class TestElevatorService:

    async def test_register_elevator_success(
        self, service, mock_repository, mock_audit
    ):
        """Test successful elevator registration."""
        # Arrange
        data = ElevatorCreate(
            site_id=uuid4(),
            unit_number="Lift 1",
            manufacturer="KONE",
        )
        expected = Elevator(
            id=uuid4(),
            organization_id=uuid4(),
            site_id=data.site_id,
            unit_number=data.unit_number,
            manufacturer=data.manufacturer,
            status=ElevatorStatus.OPERATIONAL,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        mock_repository.create.return_value = expected

        # Act
        result = await service.register_elevator(data, actor_id=uuid4())

        # Assert
        assert result.unit_number == "Lift 1"
        assert result.manufacturer == "KONE"
        mock_repository.create.assert_called_once()
        mock_audit.log_event.assert_called_once()

    async def test_register_elevator_missing_unit_number(self, service):
        """Test validation failure for missing unit number."""
        data = ElevatorCreate(site_id=uuid4(), unit_number="")

        with pytest.raises(ValidationError):
            await service.register_elevator(data, actor_id=uuid4())

    async def test_update_status_logs_audit(
        self, service, mock_repository, mock_audit
    ):
        """Test that status changes are audited."""
        elevator_id = uuid4()
        current = Elevator(
            id=elevator_id,
            organization_id=uuid4(),
            site_id=uuid4(),
            unit_number="Lift 1",
            status=ElevatorStatus.OPERATIONAL,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        mock_repository.get.return_value = current
        mock_repository.update.return_value = current

        await service.update_status(
            elevator_id=elevator_id,
            status=ElevatorStatus.OUT_OF_SERVICE,
            reason="Door fault",
            actor_id=uuid4(),
        )

        mock_audit.log_event.assert_called_once()
        call_kwargs = mock_audit.log_event.call_args.kwargs
        assert call_kwargs["event_type"] == "elevator_status_changed"
```

### Test Configuration

```python
# tests/conftest.py

import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(
        "postgresql+asyncpg://test:test@localhost:5432/test_db",
        echo=True,
    )
    yield engine
    await engine.dispose()

@pytest.fixture
async def test_session(test_engine):
    async_session = sessionmaker(
        test_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
        await session.rollback()
```

---

## Audit Logging

### Audit Service

```python
# domains/audit/service.py

import hashlib
import json
from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .models import AuditEvent, AuditEventCreate

class AuditService:
    """Service for immutable audit logging."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def log_event(
        self,
        event_type: str,
        entity_type: str,
        entity_id: UUID,
        actor_id: UUID,
        data: dict,
        previous_state: dict | None = None,
        new_state: dict | None = None,
    ) -> AuditEvent:
        """
        Log an audit event with hash chain integrity.
        """
        # Get previous hash for chain
        previous_hash = await self._get_last_hash(entity_id)

        # Compute event hash
        hash_input = json.dumps({
            "event_type": event_type,
            "entity_id": str(entity_id),
            "actor_id": str(actor_id),
            "data": data,
            "previous_hash": previous_hash or "",
            "timestamp": datetime.now().isoformat(),
        }, sort_keys=True)

        event_hash = hashlib.sha256(hash_input.encode()).hexdigest()

        # Create event
        event = AuditEventModel(
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            actor_id=actor_id,
            event_data=data,
            previous_state=previous_state,
            new_state=new_state,
            previous_hash=previous_hash,
            hash=event_hash,
        )

        self.session.add(event)
        await self.session.flush()

        return AuditEvent.model_validate(event)

    async def _get_last_hash(self, entity_id: UUID) -> str | None:
        """Get the hash of the last event for this entity."""
        result = await self.session.execute(
            select(AuditEventModel.hash)
            .where(AuditEventModel.entity_id == entity_id)
            .order_by(AuditEventModel.created_at.desc())
            .limit(1)
        )
        row = result.scalar_one_or_none()
        return row

    async def verify_chain(self, entity_id: UUID) -> bool:
        """Verify the integrity of the audit chain for an entity."""
        # Implementation would recompute hashes and verify chain
        pass
```

---

## Configuration

### Settings

```python
# core/config.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings from environment."""

    # Database
    database_url: str
    database_pool_size: int = 20

    # Redis
    redis_url: str

    # Security
    secret_key: str
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # AI
    gemini_api_key: str
    anthropic_api_key: str
    openai_api_key: str

    # Environment
    environment: str = "development"
    debug: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Code Quality

### Ruff Configuration

```toml
# pyproject.toml

[tool.ruff]
target-version = "py312"
line-length = 88

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "B",   # flake8-bugbear
    "C4",  # flake8-comprehensions
    "UP",  # pyupgrade
]

[tool.ruff.lint.isort]
known-first-party = ["sitesync_v3"]
```

### MyPy Configuration

```toml
# pyproject.toml

[tool.mypy]
python_version = "3.12"
strict = true
plugins = ["pydantic.mypy"]
```

---

**[← Back to Features](features.md)** | **[Next: Market Strategy →](../strategy/market-strategy.md)**
