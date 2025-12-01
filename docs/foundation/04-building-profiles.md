# SiteSync V3 - Building Profiles

> **Site/Building Data Model** - Complete specification for building/site profiles.

---

## What is a Site?

A **Site** represents a physical building or location that contains equipment (elevators). Sites are the primary organizational unit for managing assets.

- Sites belong to one Organization
- Sites contain one or more Elevators
- Sites have health scores based on equipment condition
- Sites store access information for technicians

---

## Site Types

| Type | Code | Description | Examples |
|------|------|-------------|----------|
| **Commercial** | `commercial` | Office buildings, retail | Office tower, shopping center |
| **Residential** | `residential` | Apartment buildings | Apartment complex, condo |
| **Mixed** | `mixed` | Combined use | Residential + retail podium |
| **Industrial** | `industrial` | Factories, warehouses | Manufacturing plant |
| **Healthcare** | `healthcare` | Medical facilities | Hospital, aged care |
| **Education** | `education` | Schools, universities | University campus |
| **Retail** | `retail` | Shopping centers | Shopping mall |
| **Hospitality** | `hospitality` | Hotels, venues | Hotel, convention center |
| **Government** | `government` | Government buildings | Court house, council |
| **Transport** | `transport` | Transit facilities | Train station, airport |

---

## Profile Field Reference

### Required Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `organization_id` | UUID | FK, NOT NULL | Parent organization |
| `name` | VARCHAR(255) | NOT NULL | Building name |

### Identity Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | UUID | Auto | Primary key | `550e8400-e29b-...` |
| `organization_id` | UUID | Yes | Parent organization | UUID |
| `name` | VARCHAR(255) | Yes | Building display name | "Collins Place Tower 1" |
| `code` | VARCHAR(50) | No | Short identifier | "COL-T1" |
| `site_type` | VARCHAR(100) | No | Building type | "commercial" |

### Address Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `address_line1` | VARCHAR(255) | Recommended | Street address | "55 Collins Street" |
| `address_line2` | VARCHAR(255) | No | Suite/level | "Tower 1" |
| `city` | VARCHAR(100) | Recommended | City | "Melbourne" |
| `state` | VARCHAR(100) | Recommended | State/province | "VIC" |
| `postal_code` | VARCHAR(20) | Recommended | Postal code | "3000" |
| `country` | VARCHAR(100) | No (default) | Country | "Australia" |

### Geolocation Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `latitude` | DECIMAL(10,8) | No | GPS latitude | -37.81361111 |
| `longitude` | DECIMAL(11,8) | No | GPS longitude | 144.97194444 |
| `timezone` | VARCHAR(50) | No (default) | Building timezone | "Australia/Sydney" |

### Contact Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `primary_contact_name` | VARCHAR(255) | Recommended | Main contact | "John Smith" |
| `primary_contact_phone` | VARCHAR(50) | Recommended | Contact phone | "+61 3 9555 1234" |
| `primary_contact_email` | VARCHAR(255) | No | Contact email | "john@building.com" |
| `emergency_contact_name` | VARCHAR(255) | No | Emergency contact | "Security Desk" |
| `emergency_contact_phone` | VARCHAR(50) | Recommended | Emergency phone | "+61 3 9555 0000" |

### Access Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `access_instructions` | TEXT | Recommended | How to access | "Report to security desk..." |
| `access_codes` | JSONB | No | Access codes (encrypted) | `{"gate": "1234", "parking": "5678"}` |
| `after_hours_access` | TEXT | No | After hours procedure | "Call security on..." |
| `key_holder_info` | JSONB | No | Key holder details | `[{"name": "...", "phone": "..."}]` |

### Building Details

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `floors_count` | INTEGER | Recommended | Number of floors | 45 |
| `year_built` | INTEGER | No | Construction year | 1990 |
| `total_area_sqm` | DECIMAL(12,2) | No | Total floor area | 85000.00 |
| `occupancy_count` | INTEGER | No | Building occupancy | 3000 |

### Health Score Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `health_score` | INTEGER | Computed | Overall health 0-100 | 87 |
| `health_score_updated_at` | TIMESTAMPTZ | Computed | Last calculation | "2024-12-01T..." |
| `health_score_components` | JSONB | Computed | Score breakdown | See below |

### System Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `settings` | JSONB | No | Site-specific settings |
| `metadata` | JSONB | No | Additional data |
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Auto | Last update |
| `deleted_at` | TIMESTAMPTZ | No | Soft delete |

---

## Health Score Components

The `health_score_components` field breaks down the overall health score:

```json
{
  "equipment_condition": 94,
  "maintenance_compliance": 88,
  "incident_frequency": 95,
  "first_time_fix_rate": 92,
  "predictive_risk": 87
}
```

| Component | Weight | Description | Calculation |
|-----------|--------|-------------|-------------|
| `equipment_condition` | 25% | Average equipment health | Mean of all elevator health scores |
| `maintenance_compliance` | 25% | On-time maintenance | % of preventive work orders completed on time |
| `incident_frequency` | 20% | Breakdown frequency | Inverse of breakdowns per elevator per month |
| `first_time_fix_rate` | 15% | Repair effectiveness | % of issues fixed on first visit |
| `predictive_risk` | 15% | AI risk assessment | AI-predicted risk score |

**Overall Health Score** = Weighted average of components

---

## Access Codes Schema

The `access_codes` field stores encrypted access information:

```json
{
  "main_entry": {
    "code": "encrypted:...",
    "type": "pin",
    "notes": "Entry after 6pm"
  },
  "loading_dock": {
    "code": "encrypted:...",
    "type": "swipe_card",
    "notes": "Request card from security"
  },
  "machine_room": {
    "code": "encrypted:...",
    "type": "key",
    "location": "Security lockbox"
  },
  "roof_access": {
    "code": "encrypted:...",
    "type": "pin",
    "notes": "Notify security 24h in advance"
  }
}
```

**Security Note**: Access codes are encrypted at rest and decrypted only when needed.

---

## Settings Schema

Site-specific settings in the `settings` field:

```json
{
  "work_hours": {
    "start": "07:00",
    "end": "18:00",
    "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  "quiet_hours": {
    "start": "22:00",
    "end": "07:00",
    "notes": "No noisy work during quiet hours"
  },
  "notification_contacts": [
    {
      "name": "Building Manager",
      "email": "manager@building.com",
      "notify_on": ["emergency", "completed"]
    }
  ],
  "parking": {
    "available": true,
    "instructions": "Loading dock, spaces 5-8"
  },
  "safety_requirements": [
    "Sign in at security",
    "PPE required in machine rooms",
    "Hot work permit required"
  ]
}
```

---

## Creation Requirements

### Minimum Required Data

```json
{
  "name": "Collins Place Tower 1"
}
```

**Note**: `organization_id` is automatically set from authentication context.

### Recommended Data

```json
{
  "name": "Collins Place Tower 1",
  "code": "COL-T1",
  "site_type": "commercial",
  "address_line1": "55 Collins Street",
  "city": "Melbourne",
  "state": "VIC",
  "postal_code": "3000",
  "primary_contact_name": "John Smith",
  "primary_contact_phone": "+61 3 9555 1234",
  "floors_count": 45
}
```

---

## Profile Completeness Levels

### Minimal Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Collins Place Tower 1",
  "site_type": "commercial",
  "country": "Australia",
  "timezone": "Australia/Sydney",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: ~10%

### Standard Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Collins Place Tower 1",
  "code": "COL-T1",
  "site_type": "commercial",
  "address_line1": "55 Collins Street",
  "city": "Melbourne",
  "state": "VIC",
  "postal_code": "3000",
  "country": "Australia",
  "timezone": "Australia/Sydney",
  "primary_contact_name": "John Smith",
  "primary_contact_phone": "+61 3 9555 1234",
  "primary_contact_email": "john@collinsplace.com.au",
  "emergency_contact_phone": "+61 3 9555 0000",
  "floors_count": 45,
  "access_instructions": "Report to security desk at ground floor reception. Present photo ID.",
  "health_score": 87,
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: ~50%

### Complete Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Collins Place Tower 1",
  "code": "COL-T1",
  "site_type": "commercial",
  "address_line1": "55 Collins Street",
  "address_line2": "Tower 1",
  "city": "Melbourne",
  "state": "VIC",
  "postal_code": "3000",
  "country": "Australia",
  "latitude": -37.81361111,
  "longitude": 144.97194444,
  "timezone": "Australia/Sydney",
  "primary_contact_name": "John Smith",
  "primary_contact_phone": "+61 3 9555 1234",
  "primary_contact_email": "john@collinsplace.com.au",
  "emergency_contact_name": "Security Desk",
  "emergency_contact_phone": "+61 3 9555 0000",
  "access_instructions": "Report to security desk at ground floor reception. Present photo ID. Sign visitor log.",
  "access_codes": {
    "loading_dock": {"type": "pin", "notes": "Get code from security"},
    "machine_room": {"type": "key", "location": "Security lockbox #5"}
  },
  "after_hours_access": "Call security on +61 3 9555 0000 at least 30 minutes before arrival",
  "key_holder_info": [
    {"name": "Building Manager", "phone": "+61 400 123 456"},
    {"name": "Security Supervisor", "phone": "+61 400 789 012"}
  ],
  "floors_count": 45,
  "year_built": 1990,
  "total_area_sqm": 85000.00,
  "occupancy_count": 3000,
  "health_score": 87,
  "health_score_updated_at": "2024-12-01T06:00:00Z",
  "health_score_components": {
    "equipment_condition": 94,
    "maintenance_compliance": 88,
    "incident_frequency": 95,
    "first_time_fix_rate": 92,
    "predictive_risk": 87
  },
  "settings": {
    "work_hours": {"start": "07:00", "end": "18:00"},
    "parking": {"available": true, "instructions": "Loading dock, spaces 5-8"},
    "safety_requirements": ["Sign in at security", "PPE required"]
  },
  "metadata": {
    "building_class": "A-grade",
    "owner": "Collins Place Management",
    "management_company": "Jones Lang LaSalle"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: 100%

---

## Related Entities

A Site contains and is referenced by:

| Entity | Relationship | Description |
|--------|--------------|-------------|
| Elevators | 1:N | Equipment in building |
| Work Orders | 1:N (via Elevator) | Jobs at this site |
| Stock Locations | 1:N | Site-based inventory |

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Required, 1-255 chars | "Site name is required" |
| `code` | 1-50 chars, unique per org | "Site code must be unique" |
| `site_type` | One of defined types | "Invalid site type" |
| `latitude` | -90 to 90 | "Invalid latitude" |
| `longitude` | -180 to 180 | "Invalid longitude" |
| `floors_count` | Positive integer | "Floors must be positive" |
| `year_built` | 1800-current year | "Invalid year built" |
| `primary_contact_email` | Valid email format | "Invalid email format" |
| `postal_code` | 4 digits (Australia) | "Invalid postal code" |

---

## Pydantic Models

```python
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr

class Site(BaseModel):
    """Site/Building domain model."""

    id: UUID
    organization_id: UUID
    name: str
    code: str | None = None
    site_type: str = "commercial"

    # Address
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str = "Australia"

    # Geolocation
    latitude: Decimal | None = None
    longitude: Decimal | None = None
    timezone: str = "Australia/Sydney"

    # Contacts
    primary_contact_name: str | None = None
    primary_contact_phone: str | None = None
    primary_contact_email: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None

    # Access
    access_instructions: str | None = None
    access_codes: dict = Field(default_factory=dict)
    after_hours_access: str | None = None
    key_holder_info: list = Field(default_factory=list)

    # Building
    floors_count: int | None = None
    year_built: int | None = None
    total_area_sqm: Decimal | None = None
    occupancy_count: int | None = None

    # Health
    health_score: int | None = None
    health_score_updated_at: datetime | None = None
    health_score_components: dict = Field(default_factory=dict)

    # System
    settings: dict = Field(default_factory=dict)
    metadata: dict = Field(default_factory=dict)
    created_at: datetime
    updated_at: datetime


class SiteCreate(BaseModel):
    """Create site request."""

    name: str = Field(..., min_length=1, max_length=255)
    code: str | None = Field(None, max_length=50)
    site_type: str = "commercial"
    address_line1: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    primary_contact_name: str | None = None
    primary_contact_phone: str | None = None


class SiteUpdate(BaseModel):
    """Update site request."""

    name: str | None = Field(None, min_length=1, max_length=255)
    code: str | None = Field(None, max_length=50)
    site_type: str | None = None
    address_line1: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    primary_contact_name: str | None = None
    primary_contact_phone: str | None = None
    access_instructions: str | None = None
    settings: dict | None = None
```

---

**[← Previous: Organization Profiles](03-organization-profiles.md)** | **[Next: User Profiles →](05-user-profiles.md)**
