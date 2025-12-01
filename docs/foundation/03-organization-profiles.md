# SiteSync V3 - Organization Profiles

> **The Tenant Root** - Complete specification for organization/company profiles.

---

## What is an Organization?

An **Organization** is the multi-tenant root entity in SiteSync. It represents a company, business, or individual account that uses the platform.

- Every other entity belongs to an Organization
- Organizations are completely isolated from each other
- One Organization = One tenant in the multi-tenant architecture

---

## Organization Types

| Type | Code | Description | Primary Use Cases |
|------|------|-------------|-------------------|
| **Service Company** | `service_company` | Elevator maintenance company | Managing contracts, dispatching technicians, work orders |
| **Building Owner** | `building_owner` | Property owner/manager | Overseeing building assets, hiring contractors |
| **Manufacturer** | `manufacturer` | Equipment manufacturer | Technical documentation, warranty support, parts supply |
| **Supplier** | `supplier` | Parts supplier/distributor | Marketplace listings, order fulfillment |
| **Insurance** | `insurance` | Insurance provider | Risk assessment, claims management |
| **Trade School** | `trade_school` | Training institution | Certification programs, education content |
| **Regulatory Body** | `regulatory_body` | Government regulator | Compliance oversight, inspection records |
| **Individual** | `individual` | Independent technician | Personal profile, job seeking, freelance work |

---

## Profile Field Reference

### Required Fields

| Field | Type | Constraints | Description | Example |
|-------|------|-------------|-------------|---------|
| `name` | VARCHAR(255) | NOT NULL | Organization display name | "Collins Lift Services" |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL-safe identifier | "collins-lift" |

### Identity Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | UUID | Auto | Primary key | `550e8400-e29b-...` |
| `name` | VARCHAR(255) | Yes | Display name | "Collins Lift Services" |
| `slug` | VARCHAR(100) | Yes | URL slug ({slug}.sitesync.com) | "collins-lift" |
| `organization_type` | VARCHAR(50) | No (default: 'service_company') | Type of organization | "service_company" |

### Contact Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `contact_email` | VARCHAR(255) | No | Primary contact email | "info@collinslift.com.au" |
| `contact_phone` | VARCHAR(50) | No | Primary phone number | "+61 3 9555 1234" |
| `billing_email` | VARCHAR(255) | No | Billing contact email | "accounts@collinslift.com.au" |

### Address Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `address_line1` | VARCHAR(255) | No | Street address | "123 Collins Street" |
| `address_line2` | VARCHAR(255) | No | Suite/unit | "Level 5" |
| `city` | VARCHAR(100) | No | City | "Melbourne" |
| `state` | VARCHAR(100) | No | State/province | "VIC" |
| `postal_code` | VARCHAR(20) | No | Postal/ZIP code | "3000" |
| `country` | VARCHAR(100) | No (default: 'Australia') | Country | "Australia" |

### Business Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `abn` | VARCHAR(20) | No | Australian Business Number | "12 345 678 901" |
| `acn` | VARCHAR(20) | No | Australian Company Number | "123 456 789" |
| `logo_url` | VARCHAR(500) | No | Logo image URL | "https://..." |
| `website_url` | VARCHAR(500) | No | Company website | "https://collinslift.com.au" |

### Subscription Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `subscription_tier` | VARCHAR(50) | No (default: 'free') | Current subscription | "pro" |
| `subscription_started_at` | TIMESTAMPTZ | No | Subscription start date | "2024-01-15T00:00:00Z" |
| `subscription_ends_at` | TIMESTAMPTZ | No | Subscription end date | "2025-01-15T00:00:00Z" |
| `trial_ends_at` | TIMESTAMPTZ | No | Trial period end | "2024-02-15T00:00:00Z" |

### Verification Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `is_verified` | BOOLEAN | No (default: false) | Organization verified | true |
| `verified_at` | TIMESTAMPTZ | No | Verification timestamp | "2024-03-01T10:00:00Z" |
| `verified_by` | UUID | No | Who verified (user ID) | UUID |

### System Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp | "2024-01-01T00:00:00Z" |
| `updated_at` | TIMESTAMPTZ | Auto | Last update timestamp | "2024-06-15T14:30:00Z" |
| `deleted_at` | TIMESTAMPTZ | No | Soft delete timestamp | null |

---

## Settings Schema

The `settings` field is a JSONB column storing organization preferences:

```json
{
  "timezone": "Australia/Sydney",
  "date_format": "DD/MM/YYYY",
  "time_format": "HH:mm",
  "currency": "AUD",
  "language": "en-AU",
  "default_priority": "medium",
  "ai_enabled": true,
  "features": {
    "marketplace": true,
    "forums": true,
    "training": false,
    "api_access": false
  },
  "notifications": {
    "email_work_orders": true,
    "email_inspections": true,
    "sms_emergency": true
  },
  "work_order_settings": {
    "auto_number_prefix": "WO",
    "require_photos": false,
    "require_signature": true
  }
}
```

### Settings Reference

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `timezone` | string | "Australia/Sydney" | Default timezone |
| `date_format` | string | "DD/MM/YYYY" | Date display format |
| `time_format` | string | "HH:mm" | Time display format |
| `currency` | string | "AUD" | Currency for costs |
| `language` | string | "en-AU" | Interface language |
| `default_priority` | string | "medium" | Default work order priority |
| `ai_enabled` | boolean | true | Enable AI features |
| `features.*` | boolean | varies | Feature flags by subscription |

---

## Subscription Tiers

| Tier | Code | Assets | Users | Monthly Price | Features |
|------|------|--------|-------|---------------|----------|
| **Free** | `free` | 5 | 2 | $0 | Basic CMMS, limited AI |
| **Pro** | `pro` | 50 | 10 | $99 | Full CMMS, AI diagnosis, reports |
| **Expert** | `expert` | Unlimited | 50 | $299 | Everything + marketplace + API |
| **Enterprise** | `enterprise` | Unlimited | Unlimited | Custom | Custom integrations, SLA support |

### Feature Matrix by Tier

| Feature | Free | Pro | Expert | Enterprise |
|---------|------|-----|--------|------------|
| Sites | 1 | 10 | Unlimited | Unlimited |
| Assets per site | 5 | 50 | Unlimited | Unlimited |
| Users | 2 | 10 | 50 | Unlimited |
| Work Orders | 20/month | Unlimited | Unlimited | Unlimited |
| AI Diagnosis | 5/month | 50/month | Unlimited | Unlimited |
| Reports | Basic | Advanced | Advanced | Custom |
| Marketplace | View only | Buy | Buy + Sell | Buy + Sell |
| API Access | No | No | Yes | Yes |
| Support | Community | Email | Priority | Dedicated |
| Custom Fields | No | Yes | Yes | Yes |
| Integrations | No | Basic | Full | Custom |

---

## Creation Requirements

### Minimum Required Data

To create an organization, you need:

```json
{
  "name": "Collins Lift Services",
  "slug": "collins-lift"
}
```

### Recommended Data

For a functional organization:

```json
{
  "name": "Collins Lift Services",
  "slug": "collins-lift",
  "organization_type": "service_company",
  "contact_email": "info@collinslift.com.au",
  "contact_phone": "+61 3 9555 1234",
  "city": "Melbourne",
  "state": "VIC",
  "country": "Australia",
  "abn": "12 345 678 901"
}
```

---

## Profile Completeness Levels

### Minimal Profile (Required Only)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Collins Lift Services",
  "slug": "collins-lift",
  "organization_type": "service_company",
  "subscription_tier": "free",
  "settings": {},
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: ~15%

### Standard Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Collins Lift Services",
  "slug": "collins-lift",
  "organization_type": "service_company",
  "contact_email": "info@collinslift.com.au",
  "contact_phone": "+61 3 9555 1234",
  "billing_email": "accounts@collinslift.com.au",
  "address_line1": "123 Collins Street",
  "city": "Melbourne",
  "state": "VIC",
  "postal_code": "3000",
  "country": "Australia",
  "abn": "12 345 678 901",
  "subscription_tier": "pro",
  "settings": {
    "timezone": "Australia/Sydney",
    "date_format": "DD/MM/YYYY",
    "currency": "AUD",
    "ai_enabled": true
  },
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: ~60%

### Complete Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Collins Lift Services Pty Ltd",
  "slug": "collins-lift",
  "organization_type": "service_company",
  "logo_url": "https://storage.sitesync.com/logos/collins-lift.png",
  "contact_email": "info@collinslift.com.au",
  "contact_phone": "+61 3 9555 1234",
  "billing_email": "accounts@collinslift.com.au",
  "website_url": "https://collinslift.com.au",
  "address_line1": "123 Collins Street",
  "address_line2": "Level 5, Suite 501",
  "city": "Melbourne",
  "state": "VIC",
  "postal_code": "3000",
  "country": "Australia",
  "abn": "12 345 678 901",
  "acn": "123 456 789",
  "subscription_tier": "expert",
  "subscription_started_at": "2024-01-15T00:00:00Z",
  "subscription_ends_at": "2025-01-15T00:00:00Z",
  "is_verified": true,
  "verified_at": "2024-02-01T10:00:00Z",
  "settings": {
    "timezone": "Australia/Sydney",
    "date_format": "DD/MM/YYYY",
    "time_format": "HH:mm",
    "currency": "AUD",
    "language": "en-AU",
    "default_priority": "medium",
    "ai_enabled": true,
    "features": {
      "marketplace": true,
      "forums": true,
      "training": true,
      "api_access": true
    },
    "notifications": {
      "email_work_orders": true,
      "email_inspections": true,
      "sms_emergency": true
    },
    "work_order_settings": {
      "auto_number_prefix": "CLS",
      "require_photos": true,
      "require_signature": true
    }
  },
  "metadata": {
    "industry_segment": "commercial",
    "employee_count": 25,
    "service_area": ["VIC", "NSW"]
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: 100%

---

## Related Entities

An Organization contains:

| Entity | Relationship | Description |
|--------|--------------|-------------|
| Users | 1:N | People with access |
| Sites | 1:N | Buildings managed |
| Contractors | 1:N | Service providers |
| Inventory Items | 1:N | Parts catalog |
| Audit Events | 1:N | Activity log |

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `name` | Required, 1-255 chars | "Organization name is required" |
| `slug` | Required, 1-100 chars, unique | "Slug is required and must be unique" |
| `slug` | Lowercase alphanumeric + hyphens | "Slug can only contain lowercase letters, numbers, and hyphens" |
| `slug` | Cannot start/end with hyphen | "Slug cannot start or end with a hyphen" |
| `contact_email` | Valid email format | "Invalid email format" |
| `billing_email` | Valid email format | "Invalid billing email format" |
| `abn` | 11 digits (spaces allowed) | "ABN must be 11 digits" |
| `acn` | 9 digits (spaces allowed) | "ACN must be 9 digits" |
| `website_url` | Valid URL format | "Invalid website URL" |
| `logo_url` | Valid URL format | "Invalid logo URL" |
| `subscription_tier` | One of: free, pro, expert, enterprise | "Invalid subscription tier" |
| `organization_type` | One of defined types | "Invalid organization type" |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/organizations` | Create organization (signup) |
| GET | `/api/v1/organizations/{id}` | Get organization by ID |
| GET | `/api/v1/organizations/me` | Get current user's organization |
| PATCH | `/api/v1/organizations/{id}` | Update organization |
| DELETE | `/api/v1/organizations/{id}` | Soft delete organization |

---

## Pydantic Models

```python
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr, HttpUrl

class Organization(BaseModel):
    """Organization domain model."""

    id: UUID
    name: str
    slug: str
    organization_type: str = "service_company"

    # Contact
    contact_email: EmailStr | None = None
    contact_phone: str | None = None
    billing_email: EmailStr | None = None

    # Address
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country: str = "Australia"

    # Business
    abn: str | None = None
    acn: str | None = None
    logo_url: HttpUrl | None = None
    website_url: HttpUrl | None = None

    # Subscription
    subscription_tier: str = "free"
    subscription_started_at: datetime | None = None
    subscription_ends_at: datetime | None = None
    trial_ends_at: datetime | None = None

    # Verification
    is_verified: bool = False
    verified_at: datetime | None = None

    # Settings
    settings: dict = Field(default_factory=dict)
    metadata: dict = Field(default_factory=dict)

    # Timestamps
    created_at: datetime
    updated_at: datetime


class OrganizationCreate(BaseModel):
    """Create organization request."""

    name: str = Field(..., min_length=1, max_length=255)
    slug: str = Field(..., min_length=1, max_length=100, pattern=r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    organization_type: str = "service_company"
    contact_email: EmailStr | None = None
    contact_phone: str | None = None


class OrganizationUpdate(BaseModel):
    """Update organization request."""

    name: str | None = Field(None, min_length=1, max_length=255)
    contact_email: EmailStr | None = None
    contact_phone: str | None = None
    billing_email: EmailStr | None = None
    address_line1: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    settings: dict | None = None
```

---

**[← Previous: Entity Relationships](02-entity-relationships.md)** | **[Next: Building Profiles →](04-building-profiles.md)**
