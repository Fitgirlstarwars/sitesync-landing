# SiteSync V3 - Validation Rules

> **Data Requirements** - Complete validation rules for all entities and fields.

---

## Validation Philosophy

SiteSync validation follows these principles:

1. **Fail Early**: Validate at API entry before database operations
2. **Clear Messages**: User-friendly error messages
3. **Consistent Format**: Standard error response structure
4. **Defense in Depth**: Validate at API, model, and database levels

---

## Validation Categories

| Category | Description | Example |
|----------|-------------|---------|
| **Required** | Field must be present | `name` is required |
| **Type** | Correct data type | `email` must be string |
| **Format** | Matches pattern | Valid email format |
| **Length** | Within bounds | 1-255 characters |
| **Range** | Numeric bounds | 0-100 for scores |
| **Enum** | One of allowed values | Status in valid list |
| **Unique** | No duplicates | Email unique per org |
| **Reference** | Foreign key exists | Site ID must exist |
| **Business** | Business logic rules | Can't delete with active work |

---

## Organization Validation

| Field | Type | Required | Constraints | Error Message |
|-------|------|----------|-------------|---------------|
| `name` | string | Yes | 1-255 chars | "Organization name is required (1-255 characters)" |
| `slug` | string | Yes | 1-100 chars, unique | "Slug is required and must be unique" |
| `slug` | string | Yes | Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$` | "Slug can only contain lowercase letters, numbers, and hyphens" |
| `slug` | string | Yes | Cannot start/end with hyphen | "Slug cannot start or end with a hyphen" |
| `organization_type` | string | No | One of: service_company, building_owner, manufacturer, supplier, insurance, trade_school, regulatory_body, individual | "Invalid organization type" |
| `contact_email` | string | No | Valid email format | "Invalid email format" |
| `billing_email` | string | No | Valid email format | "Invalid billing email format" |
| `contact_phone` | string | No | Valid phone format | "Invalid phone number" |
| `abn` | string | No | 11 digits (spaces allowed) | "ABN must be 11 digits" |
| `acn` | string | No | 9 digits (spaces allowed) | "ACN must be 9 digits" |
| `website_url` | string | No | Valid URL format | "Invalid website URL" |
| `logo_url` | string | No | Valid URL format | "Invalid logo URL" |
| `subscription_tier` | string | No | One of: free, pro, expert, enterprise | "Invalid subscription tier" |

### Slug Validation Regex

```python
SLUG_PATTERN = r'^[a-z0-9]+(?:-[a-z0-9]+)*$'

def validate_slug(slug: str) -> list[str]:
    errors = []
    if not slug:
        errors.append("Slug is required")
    elif len(slug) > 100:
        errors.append("Slug must be 100 characters or less")
    elif not re.match(SLUG_PATTERN, slug):
        errors.append("Slug can only contain lowercase letters, numbers, and hyphens")
    return errors
```

### ABN Validation

```python
def validate_abn(abn: str) -> bool:
    """Validate Australian Business Number."""
    # Remove spaces
    abn = abn.replace(" ", "")

    # Must be 11 digits
    if not abn.isdigit() or len(abn) != 11:
        return False

    # ABN checksum validation
    weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    digits = [int(d) for d in abn]
    digits[0] -= 1  # Subtract 1 from first digit

    checksum = sum(d * w for d, w in zip(digits, weights))
    return checksum % 89 == 0
```

---

## Site Validation

| Field | Type | Required | Constraints | Error Message |
|-------|------|----------|-------------|---------------|
| `name` | string | Yes | 1-255 chars | "Site name is required (1-255 characters)" |
| `code` | string | No | 1-50 chars, unique per org | "Site code must be unique within organization" |
| `site_type` | string | No | One of: commercial, residential, mixed, industrial, healthcare, education, retail, hospitality, government, transport | "Invalid site type" |
| `address_line1` | string | No | 1-255 chars | "Address too long (max 255 characters)" |
| `city` | string | No | 1-100 chars | "City name too long (max 100 characters)" |
| `state` | string | No | 1-100 chars | "State name too long (max 100 characters)" |
| `postal_code` | string | No | Valid postal code | "Invalid postal code" |
| `country` | string | No | 1-100 chars | "Country name too long (max 100 characters)" |
| `latitude` | decimal | No | -90 to 90 | "Latitude must be between -90 and 90" |
| `longitude` | decimal | No | -180 to 180 | "Longitude must be between -180 and 180" |
| `timezone` | string | No | Valid IANA timezone | "Invalid timezone" |
| `primary_contact_email` | string | No | Valid email format | "Invalid email format" |
| `floors_count` | integer | No | Positive integer | "Floors count must be positive" |
| `year_built` | integer | No | 1800 to current year | "Invalid year built" |
| `total_area_sqm` | decimal | No | Positive number | "Area must be positive" |

### Postal Code Validation (Australia)

```python
def validate_au_postal_code(postal_code: str) -> bool:
    """Validate Australian postal code."""
    return bool(re.match(r'^\d{4}$', postal_code))
```

### Timezone Validation

```python
import pytz

def validate_timezone(timezone: str) -> bool:
    """Validate IANA timezone."""
    return timezone in pytz.all_timezones
```

---

## User Validation

| Field | Type | Required | Constraints | Error Message |
|-------|------|----------|-------------|---------------|
| `email` | string | Yes | Valid email format | "Valid email is required" |
| `email` | string | Yes | Unique within organization | "Email already exists in this organization" |
| `password` | string | Yes (create) | Min 8 chars | "Password must be at least 8 characters" |
| `password` | string | Yes (create) | Complexity: 1 uppercase, 1 lowercase, 1 number | "Password must contain uppercase, lowercase, and number" |
| `first_name` | string | No | 1-100 chars | "First name too long (max 100 characters)" |
| `last_name` | string | No | 1-100 chars | "Last name too long (max 100 characters)" |
| `phone` | string | No | Valid phone format | "Invalid phone number" |
| `role` | string | No | One of: owner, admin, manager, user, technician, readonly, guest | "Invalid role" |
| `user_type` | string | No | One of: standard, technician, manager, admin, system | "Invalid user type" |
| `timezone` | string | No | Valid IANA timezone | "Invalid timezone" |

### Password Validation

```python
import re

def validate_password(password: str) -> list[str]:
    errors = []

    if len(password) < 8:
        errors.append("Password must be at least 8 characters")

    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")

    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")

    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")

    return errors
```

### Email Validation

```python
import re

EMAIL_PATTERN = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

def validate_email(email: str) -> bool:
    return bool(re.match(EMAIL_PATTERN, email))
```

---

## Elevator Validation

| Field | Type | Required | Constraints | Error Message |
|-------|------|----------|-------------|---------------|
| `site_id` | UUID | Yes | Must exist | "Site not found" |
| `unit_number` | string | Yes | 1-50 chars | "Unit number is required (1-50 characters)" |
| `unit_number` | string | Yes | Unique per site | "Unit number already exists at this site" |
| `serial_number` | string | No | 1-100 chars | "Serial number too long (max 100 characters)" |
| `registration_number` | string | No | 1-100 chars | "Registration number too long (max 100 characters)" |
| `manufacturer` | string | No | 1-100 chars | "Manufacturer name too long (max 100 characters)" |
| `model` | string | No | 1-100 chars | "Model name too long (max 100 characters)" |
| `capacity_kg` | integer | No | Positive integer | "Capacity must be positive" |
| `capacity_persons` | integer | No | Positive integer | "Capacity must be positive" |
| `speed_mps` | decimal | No | Positive number | "Speed must be positive" |
| `floors_served` | integer | No | Positive integer | "Floors must be positive" |
| `installation_date` | date | No | Not future date | "Installation date cannot be in the future" |
| `status` | enum | No | One of: operational, degraded, out_of_service, maintenance, decommissioned | "Invalid status" |
| `last_inspection_result` | string | No | One of: passed, failed, conditional | "Invalid inspection result" |
| `health_score` | integer | No | 0-100 | "Health score must be 0-100" |

### Unit Number Uniqueness

```python
async def validate_unit_number_unique(
    db: AsyncSession,
    site_id: UUID,
    unit_number: str,
    exclude_id: UUID | None = None,
) -> bool:
    query = select(Elevator).where(
        Elevator.site_id == site_id,
        Elevator.unit_number == unit_number,
        Elevator.deleted_at.is_(None),
    )
    if exclude_id:
        query = query.where(Elevator.id != exclude_id)

    result = await db.execute(query)
    return result.scalar_one_or_none() is None
```

---

## Work Order Validation

| Field | Type | Required | Constraints | Error Message |
|-------|------|----------|-------------|---------------|
| `elevator_id` | UUID | Yes | Must exist | "Elevator not found" |
| `type` | enum | Yes | One of: breakdown, preventive, inspection, installation, modernization, callback, audit | "Work order type is required" |
| `priority` | enum | No | One of: emergency, high, medium, low, scheduled | "Invalid priority" |
| `status` | enum | No | Valid transition | "Invalid status transition" |
| `title` | string | Yes | 1-255 chars | "Title is required (1-255 characters)" |
| `description` | string | No | Max 10000 chars | "Description too long (max 10000 characters)" |
| `fault_code` | string | No | 1-50 chars | "Fault code too long (max 50 characters)" |
| `scheduled_start` | datetime | No | Not past (if future) | "Scheduled start must be in the future" |
| `scheduled_end` | datetime | No | After scheduled_start | "Scheduled end must be after start" |
| `due_date` | datetime | No | Not past | "Due date must be in the future" |
| `assigned_contractor_id` | UUID | Conditional | Must exist if provided | "Contractor not found" |
| `resolution_notes` | string | Conditional | Required for completion | "Resolution notes required to complete" |
| `parts_cost` | decimal | No | Non-negative | "Parts cost cannot be negative" |
| `labor_cost` | decimal | No | Non-negative | "Labor cost cannot be negative" |

### Work Order Number Generation

```python
async def generate_work_order_number(
    db: AsyncSession,
    organization_id: UUID,
) -> str:
    """Generate unique work order number: WO-{YEAR}-{SEQUENCE}"""
    year = datetime.now().year

    # Get next sequence for this org/year
    result = await db.execute(
        select(func.count(WorkOrder.id))
        .where(WorkOrder.organization_id == organization_id)
        .where(WorkOrder.work_order_number.like(f"WO-{year}-%"))
    )
    count = result.scalar() or 0

    return f"WO-{year}-{str(count + 1).zfill(6)}"
```

---

## Contractor Validation

| Field | Type | Required | Constraints | Error Message |
|-------|------|----------|-------------|---------------|
| `contact_name` | string | Yes | 1-255 chars | "Contact name is required (1-255 characters)" |
| `contractor_type` | string | Yes | One of: employee, subcontractor, vendor, company | "Contractor type is required" |
| `company_name` | string | No | 1-255 chars | "Company name too long (max 255 characters)" |
| `email` | string | No | Valid email format | "Invalid email format" |
| `phone` | string | No | Valid phone format | "Invalid phone number" |
| `company_abn` | string | No | 11 digits | "Invalid ABN format" |
| `license_number` | string | No | 1-100 chars | "License number too long (max 100 characters)" |
| `license_expiry` | date | No | Valid date | "Invalid license expiry date" |
| `insurance_expiry` | date | No | Valid date | "Invalid insurance expiry date" |
| `hourly_rate` | decimal | No | Non-negative | "Hourly rate cannot be negative" |
| `callout_fee` | decimal | No | Non-negative | "Callout fee cannot be negative" |
| `emergency_rate_multiplier` | decimal | No | Positive, typically 1.0-3.0 | "Invalid rate multiplier" |
| `rating` | decimal | No | 0.00-5.00 | "Rating must be between 0 and 5" |

---

## Inventory Item Validation

| Field | Type | Required | Constraints | Error Message |
|-------|------|----------|-------------|---------------|
| `part_number` | string | Yes | 1-100 chars | "Part number is required (1-100 characters)" |
| `part_number` | string | Yes | Unique per org | "Part number already exists" |
| `name` | string | Yes | 1-255 chars | "Item name is required (1-255 characters)" |
| `category` | string | No | 1-100 chars | "Category too long (max 100 characters)" |
| `manufacturer` | string | No | 1-100 chars | "Manufacturer too long (max 100 characters)" |
| `unit_cost` | decimal | No | Non-negative | "Unit cost cannot be negative" |
| `sale_price` | decimal | No | Non-negative | "Sale price cannot be negative" |
| `minimum_stock` | integer | No | Non-negative | "Minimum stock cannot be negative" |
| `reorder_point` | integer | No | Non-negative | "Reorder point cannot be negative" |
| `reorder_quantity` | integer | No | Positive | "Reorder quantity must be positive" |

---

## Cross-Entity Validation

### Foreign Key Validation

```python
async def validate_foreign_key(
    db: AsyncSession,
    model: type,
    id: UUID,
    field_name: str,
) -> str | None:
    """Validate foreign key exists."""
    result = await db.execute(
        select(model.id).where(model.id == id)
    )
    if result.scalar_one_or_none() is None:
        return f"{field_name} not found"
    return None
```

### Business Rule Validation

```python
async def validate_can_delete_site(
    db: AsyncSession,
    site_id: UUID,
) -> list[str]:
    """Check if site can be deleted."""
    errors = []

    # Check for active work orders
    result = await db.execute(
        select(func.count(WorkOrder.id))
        .join(Elevator)
        .where(
            Elevator.site_id == site_id,
            WorkOrder.status.not_in(['completed', 'cancelled', 'invoiced'])
        )
    )
    active_count = result.scalar() or 0
    if active_count > 0:
        errors.append(f"Cannot delete: {active_count} active work orders exist")

    return errors
```

---

## Error Response Format

### Standard Error Response

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "Invalid email format",
      "type": "value_error.email"
    },
    {
      "loc": ["body", "name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Error Types

| Type | Description |
|------|-------------|
| `value_error.missing` | Required field missing |
| `value_error.email` | Invalid email format |
| `value_error.url` | Invalid URL format |
| `value_error.any_str.min_length` | String too short |
| `value_error.any_str.max_length` | String too long |
| `value_error.number.not_gt` | Number not greater than |
| `value_error.number.not_lt` | Number not less than |
| `value_error.enum` | Not in allowed values |
| `value_error.uuid` | Invalid UUID format |
| `value_error.unique` | Value not unique |
| `value_error.foreign_key` | Foreign key not found |
| `value_error.state_transition` | Invalid state transition |
| `value_error.business_rule` | Business rule violation |

---

## Pydantic Validation Example

```python
from pydantic import BaseModel, Field, field_validator, EmailStr
from uuid import UUID
import re

class SiteCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    code: str | None = Field(None, max_length=50)
    site_type: str = "commercial"
    address_line1: str | None = Field(None, max_length=255)
    city: str | None = Field(None, max_length=100)
    state: str | None = Field(None, max_length=100)
    postal_code: str | None = None
    primary_contact_email: EmailStr | None = None
    floors_count: int | None = Field(None, gt=0)
    year_built: int | None = None

    @field_validator('site_type')
    @classmethod
    def validate_site_type(cls, v):
        valid_types = [
            'commercial', 'residential', 'mixed', 'industrial',
            'healthcare', 'education', 'retail', 'hospitality',
            'government', 'transport'
        ]
        if v not in valid_types:
            raise ValueError(f"Invalid site type. Must be one of: {valid_types}")
        return v

    @field_validator('postal_code')
    @classmethod
    def validate_postal_code(cls, v):
        if v and not re.match(r'^\d{4}$', v):
            raise ValueError("Invalid postal code (must be 4 digits)")
        return v

    @field_validator('year_built')
    @classmethod
    def validate_year_built(cls, v):
        if v:
            current_year = datetime.now().year
            if v < 1800 or v > current_year:
                raise ValueError(f"Year built must be between 1800 and {current_year}")
        return v
```

---

## Database Constraints

### NOT NULL Constraints

```sql
CREATE TABLE sites (
    id UUID PRIMARY KEY,
    organization_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    ...
);
```

### UNIQUE Constraints

```sql
-- Organization slug
CREATE UNIQUE INDEX idx_org_slug ON organizations(slug);

-- User email per org
CREATE UNIQUE INDEX idx_user_email ON users(organization_id, email);

-- Elevator unit per site
CREATE UNIQUE INDEX idx_elevator_unit ON elevators(organization_id, site_id, unit_number);

-- Work order number
CREATE UNIQUE INDEX idx_wo_number ON work_orders(organization_id, work_order_number);
```

### CHECK Constraints

```sql
-- Health score range
ALTER TABLE elevators ADD CONSTRAINT chk_health_score
    CHECK (health_score IS NULL OR (health_score >= 0 AND health_score <= 100));

-- Non-negative costs
ALTER TABLE work_orders ADD CONSTRAINT chk_costs_positive
    CHECK (parts_cost >= 0 AND labor_cost >= 0 AND total_cost >= 0);

-- Rating range
ALTER TABLE contractors ADD CONSTRAINT chk_rating_range
    CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5));
```

---

## Validation Testing

### Unit Test Example

```python
import pytest
from app.domains.sites.models import SiteCreate

def test_site_name_required():
    with pytest.raises(ValidationError) as exc:
        SiteCreate(code="TEST")
    assert "name" in str(exc.value)

def test_site_type_validation():
    with pytest.raises(ValidationError) as exc:
        SiteCreate(name="Test", site_type="invalid")
    assert "Invalid site type" in str(exc.value)

def test_postal_code_validation():
    with pytest.raises(ValidationError) as exc:
        SiteCreate(name="Test", postal_code="123")
    assert "Invalid postal code" in str(exc.value)

def test_valid_site_creation():
    site = SiteCreate(
        name="Test Site",
        code="TEST",
        site_type="commercial",
        postal_code="3000"
    )
    assert site.name == "Test Site"
```

---

**[← Previous: State Machines](09-state-machines.md)** | **[Back to Foundation Plan](00-FOUNDATION-PLAN.md)**
