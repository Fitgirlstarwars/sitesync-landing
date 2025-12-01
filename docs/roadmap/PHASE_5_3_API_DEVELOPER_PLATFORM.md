# Phase 5.3: API & Developer Platform

> Detailed implementation specification for public APIs, developer tools, and third-party ecosystem
> Status: Design Phase
> Priority: MEDIUM - Platform expansion and ecosystem growth
> Dependencies: Phases 0-4 substantially complete

---

## Overview

The API & Developer Platform creates an extensible ecosystem that:

1. **Exposes** comprehensive APIs for third-party integration
2. **Provides** developer tools, SDKs, and documentation
3. **Enables** third-party apps through an app marketplace
4. **Supports** custom integrations via webhooks and events
5. **Monetizes** API access through tiered pricing

---

## User Stories

### As a Developer/Integrator:

1. **US-API001:** I want comprehensive API documentation so I can integrate effectively
2. **US-API002:** I want a sandbox environment so I can test without affecting production
3. **US-API003:** I want SDKs in popular languages so development is faster
4. **US-API004:** I want webhooks so I receive real-time updates
5. **US-API005:** I want rate limits that scale so my integration grows with usage

### As a Service Company:

6. **US-API006:** I want to integrate SiteSync with my existing systems so data flows seamlessly
7. **US-API007:** I want to build custom reports using API data so I meet specific needs
8. **US-API008:** I want to automate workflows using webhooks so I reduce manual work

### As a Third-Party App Developer:

9. **US-API009:** I want to publish apps in the marketplace so I reach customers
10. **US-API010:** I want OAuth integration so users can connect securely
11. **US-API011:** I want revenue sharing so I can build a business

---

## Feature Breakdown

### 5.3.1 Public API

#### 5.3.1.1 API Design

**API Principles:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    API DESIGN PRINCIPLES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  REST API                                                        │
│  ├── RESTful resource-oriented design                            │
│  ├── JSON request/response bodies                                │
│  ├── Standard HTTP methods (GET, POST, PUT, DELETE)              │
│  ├── Consistent error responses                                  │
│  └── HATEOAS links where appropriate                             │
│                                                                  │
│  VERSIONING                                                      │
│  ├── URL-based versioning (/api/v1/, /api/v2/)                   │
│  ├── Deprecation policy (12 months notice)                       │
│  ├── Changelog for each version                                  │
│  └── Migration guides provided                                   │
│                                                                  │
│  AUTHENTICATION                                                  │
│  ├── OAuth 2.0 for user-context requests                         │
│  ├── API keys for server-to-server                               │
│  ├── JWT tokens with configurable expiry                         │
│  └── Scopes for fine-grained permissions                         │
│                                                                  │
│  RATE LIMITING                                                   │
│  ├── Tiered limits by plan                                       │
│  ├── Headers showing remaining quota                             │
│  ├── Retry-After header on limit                                 │
│  └── Burst allowance for spikes                                  │
│                                                                  │
│  PAGINATION                                                      │
│  ├── Cursor-based pagination                                     │
│  ├── Configurable page size                                      │
│  ├── Total count in response                                     │
│  └── Next/previous links                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Resources:**

| Resource | Endpoints | Description |
|----------|-----------|-------------|
| `/organizations` | CRUD | Organization management |
| `/sites` | CRUD | Building/site management |
| `/equipment` | CRUD + telemetry | Equipment management |
| `/work-orders` | CRUD + lifecycle | Work order management |
| `/inspections` | CRUD + reports | Inspection management |
| `/technicians` | Read + search | Technician directory |
| `/knowledge` | Read + search | Knowledge base access |
| `/compliance` | Read | Compliance status |
| `/reports` | Generate | Report generation |
| `/webhooks` | CRUD | Webhook management |

**API Schema:**

```python
# sitesync_v3/domains/api/contracts.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class APICredentials(BaseModel):
    """API credentials for an integration."""

    id: UUID
    organization_id: UUID

    # Credentials
    api_key: str
    api_secret_hint: str  # Last 4 characters
    client_id: str  # For OAuth

    # Configuration
    name: str
    description: str
    scopes: list[str]

    # Limits
    rate_limit_tier: str  # 'basic', 'standard', 'premium'
    requests_per_hour: int
    requests_per_day: int

    # Status
    is_active: bool
    created_at: datetime
    last_used_at: datetime | None

    # Security
    allowed_ips: list[str] | None
    allowed_origins: list[str] | None

class APIScope(BaseModel):
    """API permission scope."""

    scope: str
    description: str
    resources: list[str]
    actions: list[str]  # 'read', 'write', 'delete'

# Available scopes
API_SCOPES = [
    APIScope(scope="sites:read", description="Read building information", resources=["sites"], actions=["read"]),
    APIScope(scope="sites:write", description="Manage buildings", resources=["sites"], actions=["read", "write"]),
    APIScope(scope="equipment:read", description="Read equipment data", resources=["equipment"], actions=["read"]),
    APIScope(scope="equipment:write", description="Manage equipment", resources=["equipment"], actions=["read", "write"]),
    APIScope(scope="work_orders:read", description="Read work orders", resources=["work_orders"], actions=["read"]),
    APIScope(scope="work_orders:write", description="Manage work orders", resources=["work_orders"], actions=["read", "write"]),
    APIScope(scope="telemetry:read", description="Read telemetry data", resources=["telemetry"], actions=["read"]),
    APIScope(scope="telemetry:write", description="Write telemetry data", resources=["telemetry"], actions=["write"]),
    APIScope(scope="webhooks:manage", description="Manage webhooks", resources=["webhooks"], actions=["read", "write", "delete"]),
]
```

#### 5.3.1.2 Rate Limiting Tiers

| Tier | Requests/Hour | Requests/Day | Price |
|------|---------------|--------------|-------|
| Free | 100 | 1,000 | $0 |
| Basic | 1,000 | 10,000 | $99/mo |
| Standard | 10,000 | 100,000 | $499/mo |
| Premium | 100,000 | 1,000,000 | $1,999/mo |
| Enterprise | Custom | Custom | Custom |

---

### 5.3.2 Developer Portal

#### 5.3.2.1 Documentation Site

**Documentation Structure:**

```
docs.sitesync.com/
├── Getting Started
│   ├── Introduction
│   ├── Authentication
│   ├── Making Your First Request
│   └── Error Handling
│
├── API Reference
│   ├── Organizations
│   ├── Sites
│   ├── Equipment
│   ├── Work Orders
│   ├── Inspections
│   ├── Knowledge
│   └── Webhooks
│
├── Guides
│   ├── Building an Integration
│   ├── Real-time Updates with Webhooks
│   ├── Bulk Data Operations
│   └── Best Practices
│
├── SDKs
│   ├── Python SDK
│   ├── JavaScript/Node SDK
│   ├── C# SDK
│   └── Java SDK
│
├── Webhooks
│   ├── Event Types
│   ├── Payload Format
│   ├── Security & Verification
│   └── Retry Policy
│
└── Resources
    ├── Changelog
    ├── Status Page
    ├── Support
    └── Community
```

#### 5.3.2.2 Sandbox Environment

**Sandbox Features:**

```python
class SandboxEnvironment(BaseModel):
    """Sandbox environment for testing."""

    id: UUID
    organization_id: UUID

    # Environment
    environment_url: str  # sandbox.api.sitesync.com
    environment_name: str

    # Credentials
    sandbox_api_key: str
    sandbox_api_secret: str

    # Data
    sample_data_loaded: bool
    custom_test_data: dict | None

    # Limits
    requests_per_hour: int = 10000  # Higher for testing
    data_retention_days: int = 30

    # Status
    created_at: datetime
    expires_at: datetime  # Auto-cleanup
    last_accessed: datetime | None
```

---

### 5.3.3 Webhooks

#### 5.3.3.1 Event Types

**Available Events:**

| Category | Event | Trigger |
|----------|-------|---------|
| **Work Orders** | `work_order.created` | New work order |
| | `work_order.assigned` | Technician assigned |
| | `work_order.started` | Work started |
| | `work_order.completed` | Work completed |
| **Equipment** | `equipment.status_changed` | Status change |
| | `equipment.alert_triggered` | Alert threshold |
| | `equipment.telemetry_received` | New telemetry |
| **Inspections** | `inspection.scheduled` | Inspection scheduled |
| | `inspection.completed` | Inspection done |
| | `inspection.defect_found` | Defect identified |
| **Compliance** | `compliance.deadline_approaching` | 30/14/7 days |
| | `compliance.status_changed` | Status change |
| **Entrapments** | `entrapment.reported` | Entrapment started |
| | `entrapment.resolved` | Entrapment resolved |

**Webhook Schema:**

```python
class WebhookEndpoint(BaseModel):
    """Webhook endpoint configuration."""

    id: UUID
    organization_id: UUID

    # Endpoint
    url: str
    description: str

    # Events
    events: list[str]  # Event types to receive
    filter_expression: str | None  # Optional filter

    # Security
    secret: str  # For signature verification
    auth_header: str | None  # Optional auth header

    # Configuration
    is_active: bool
    retry_policy: str  # 'exponential', 'linear', 'none'
    max_retries: int = 5

    # Status
    created_at: datetime
    last_triggered: datetime | None
    failure_count: int = 0

class WebhookDelivery(BaseModel):
    """Webhook delivery attempt."""

    id: UUID
    webhook_id: UUID
    event_id: UUID

    # Delivery
    event_type: str
    payload: dict
    signature: str

    # Response
    response_status: int | None
    response_body: str | None
    response_time_ms: int | None

    # Status
    status: str  # 'pending', 'delivered', 'failed', 'retrying'
    attempt_number: int
    next_retry_at: datetime | None

    # Timestamps
    created_at: datetime
    delivered_at: datetime | None
```

---

### 5.3.4 App Marketplace

#### 5.3.4.1 Marketplace Platform

**App Categories:**

| Category | Examples |
|----------|----------|
| Integrations | ERP, accounting, BMS |
| Analytics | Custom dashboards, BI |
| Automation | Workflow, scheduling |
| Communication | SMS, chat, voice |
| Compliance | Audit, reporting |
| Hardware | IoT devices, diagnostic tools |

**App Schema:**

```python
class MarketplaceApp(BaseModel):
    """App listing in marketplace."""

    id: UUID
    developer_id: UUID

    # App info
    name: str
    slug: str
    tagline: str
    description: str
    category: str

    # Media
    icon_url: str
    screenshots: list[str]
    video_url: str | None

    # Pricing
    pricing_model: str  # 'free', 'paid', 'freemium', 'subscription'
    price_monthly: float | None
    price_annual: float | None
    free_trial_days: int | None

    # Technical
    required_scopes: list[str]
    webhook_events: list[str]
    setup_url: str
    support_url: str

    # Stats
    install_count: int
    average_rating: float
    review_count: int

    # Status
    status: str  # 'draft', 'pending_review', 'published', 'suspended'
    published_at: datetime | None

    # Revenue
    revenue_share_percent: float = 70  # Developer gets 70%

class AppInstallation(BaseModel):
    """App installation for an organization."""

    id: UUID
    app_id: UUID
    organization_id: UUID

    # Installation
    installed_by: UUID
    installed_at: datetime

    # Configuration
    config: dict | None
    granted_scopes: list[str]

    # Status
    status: str  # 'active', 'suspended', 'uninstalled'

    # Subscription
    subscription_status: str | None
    current_period_end: datetime | None
```

---

## Success Metrics

### Phase 5.3 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| API registrations | 500+ | Active API keys |
| API calls | 1M+/month | Monthly requests |
| Marketplace apps | 50+ | Published apps |
| App installations | 1,000+ | Total installs |
| Developer revenue share | $100K+/year | Paid to developers |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
