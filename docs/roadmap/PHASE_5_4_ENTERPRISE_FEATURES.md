# Phase 5.4: Enterprise Features

> Detailed implementation specification for large-scale deployment and enterprise requirements
> Status: Design Phase
> Priority: HIGH (for revenue) - Enterprise deals drive significant revenue
> Dependencies: Phases 0-4 substantially complete

---

## Overview

The Enterprise Features create capabilities for large-scale organizations requiring:

1. **Multi-organization management** for corporate portfolios
2. **Advanced security** with SSO, SCIM, and audit controls
3. **Custom workflows** and automation rules
4. **Enterprise analytics** with BI integration
5. **White-labeling** options for resellers and large accounts

---

## User Stories

### As an Enterprise IT Administrator:

1. **US-ENT001:** I want SSO integration so users authenticate through our identity provider
2. **US-ENT002:** I want automated user provisioning so onboarding is seamless
3. **US-ENT003:** I want audit logs so I track all system access
4. **US-ENT004:** I want role customization so I match our organizational structure
5. **US-ENT005:** I want data residency controls so I comply with corporate policies

### As an Enterprise Facilities Executive:

6. **US-ENT006:** I want portfolio-wide dashboards so I see all properties at once
7. **US-ENT007:** I want benchmarking across buildings so I identify outliers
8. **US-ENT008:** I want custom KPIs so I track what matters to my organization
9. **US-ENT009:** I want executive reports so I communicate to leadership
10. **US-ENT010:** I want integration with our BI tools so data flows to existing systems

### As a Managed Services Provider:

11. **US-ENT011:** I want to manage multiple client organizations so I scale operations
12. **US-ENT012:** I want white-labeling so the platform reflects my brand
13. **US-ENT013:** I want consolidated billing so administration is simple
14. **US-ENT014:** I want to segregate client data so I maintain confidentiality

---

## Feature Breakdown

### 5.4.1 Multi-Organization Management

#### 5.4.1.1 Corporate Hierarchy

**Hierarchy Model:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORPORATE HIERARCHY                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ENTERPRISE ACCOUNT                                              │
│  └── Parent Organization (Corporate HQ)                          │
│      ├── Region: North America                                   │
│      │   ├── Division: Eastern                                   │
│      │   │   ├── Organization: NYC Portfolio                     │
│      │   │   │   ├── Site: 123 Main St                           │
│      │   │   │   └── Site: 456 Park Ave                          │
│      │   │   └── Organization: Boston Portfolio                  │
│      │   │       └── Site: 789 State St                          │
│      │   └── Division: Western                                   │
│      │       └── Organization: LA Portfolio                      │
│      │           └── Site: 321 Sunset Blvd                       │
│      └── Region: Europe                                          │
│          └── Organization: London Portfolio                      │
│              └── Site: 100 Oxford St                             │
│                                                                  │
│  ACCESS PATTERNS:                                                │
│  ├── Corporate Admin: Full access all orgs                       │
│  ├── Regional Admin: Access to region orgs                       │
│  ├── Division Admin: Access to division orgs                     │
│  └── Org Admin: Access to single org                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
POST   /api/v1/enterprise/organizations                  # Create child org
GET    /api/v1/enterprise/organizations                  # List all orgs
GET    /api/v1/enterprise/hierarchy                      # Get hierarchy
PUT    /api/v1/enterprise/hierarchy                      # Update hierarchy
GET    /api/v1/enterprise/dashboard                      # Portfolio dashboard
```

**Schema:**

```python
# sitesync_v3/domains/enterprise/contracts.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from enum import Enum

class OrganizationLevel(str, Enum):
    ENTERPRISE = "enterprise"
    REGION = "region"
    DIVISION = "division"
    ORGANIZATION = "organization"

class EnterpriseOrganization(BaseModel):
    """Organization in enterprise hierarchy."""

    id: UUID
    enterprise_id: UUID
    parent_id: UUID | None

    # Organization info
    name: str
    code: str  # Short code for reference
    level: OrganizationLevel

    # Hierarchy
    path: str  # "/enterprise/region/division/org"
    depth: int
    children_count: int

    # Settings
    inherits_settings: bool
    settings_override: dict | None

    # Stats (rollup from children)
    total_sites: int
    total_equipment: int
    total_users: int

    # Status
    is_active: bool
    created_at: datetime

class EnterpriseHierarchy(BaseModel):
    """Full enterprise hierarchy."""

    enterprise_id: UUID
    enterprise_name: str

    # Tree structure
    hierarchy: dict
    # Nested structure of organizations

    # Summary
    total_organizations: int
    total_sites: int
    total_equipment: int
    total_users: int

    # As of
    generated_at: datetime

class PortfolioDashboard(BaseModel):
    """Enterprise portfolio dashboard."""

    enterprise_id: UUID
    as_of: datetime

    # Overview
    total_sites: int
    total_equipment: int
    overall_health_score: int

    # By organization
    organizations: list[dict]
    # [{
    #     "id": UUID,
    #     "name": "NYC Portfolio",
    #     "sites": 10,
    #     "equipment": 45,
    #     "health_score": 82,
    #     "open_work_orders": 15,
    #     "compliance_status": "compliant"
    # }]

    # Rollup metrics
    work_orders_summary: dict
    # {"open": 45, "in_progress": 23, "completed_30d": 156}

    compliance_summary: dict
    # {"compliant": 42, "at_risk": 5, "overdue": 1}

    # Benchmarking
    benchmarks: dict
    # {
    #     "health_score": {"best": 95, "worst": 68, "average": 82},
    #     "response_time": {"best": 2.1, "worst": 8.5, "average": 4.2}
    # }

    # Alerts
    enterprise_alerts: list[dict]
```

---

### 5.4.2 Enterprise Security

#### 5.4.2.1 SSO Integration

**Supported Providers:**

| Provider | Protocol | Status |
|----------|----------|--------|
| Okta | SAML 2.0, OIDC | Supported |
| Azure AD | SAML 2.0, OIDC | Supported |
| Google Workspace | OIDC | Supported |
| OneLogin | SAML 2.0 | Supported |
| Ping Identity | SAML 2.0 | Supported |
| Custom | SAML 2.0, OIDC | Supported |

**SSO Configuration:**

```python
class SSOConfiguration(BaseModel):
    """SSO configuration for enterprise."""

    id: UUID
    organization_id: UUID

    # Provider
    provider_type: str  # 'okta', 'azure_ad', 'google', 'custom'
    protocol: str  # 'saml', 'oidc'

    # SAML settings
    saml_entity_id: str | None
    saml_sso_url: str | None
    saml_certificate: str | None
    saml_sign_requests: bool = True

    # OIDC settings
    oidc_client_id: str | None
    oidc_client_secret_hint: str | None
    oidc_issuer_url: str | None
    oidc_scopes: list[str] | None

    # User mapping
    attribute_mapping: dict
    # {
    #     "email": "user.email",
    #     "first_name": "user.firstName",
    #     "last_name": "user.lastName",
    #     "role": "user.department"
    # }

    # Behavior
    auto_create_users: bool = True
    default_role: str = "viewer"
    jit_provisioning: bool = True

    # Status
    is_enabled: bool
    last_test_at: datetime | None
    last_test_result: str | None
```

#### 5.4.2.2 SCIM Provisioning

**SCIM Endpoints:**

```
GET    /scim/v2/Users                                    # List users
POST   /scim/v2/Users                                    # Create user
GET    /scim/v2/Users/{id}                               # Get user
PUT    /scim/v2/Users/{id}                               # Update user
DELETE /scim/v2/Users/{id}                               # Delete user
GET    /scim/v2/Groups                                   # List groups
POST   /scim/v2/Groups                                   # Create group
```

#### 5.4.2.3 Audit Logging

**Audit Events:**

| Category | Events |
|----------|--------|
| Authentication | Login, logout, failed login, SSO |
| Users | Create, update, delete, role change |
| Data access | View, export, bulk download |
| Configuration | Settings change, integration change |
| Work orders | Create, assign, complete |
| Admin actions | Org changes, user management |

**Audit Schema:**

```python
class AuditLogEntry(BaseModel):
    """Audit log entry."""

    id: UUID
    organization_id: UUID

    # Event
    event_type: str
    event_category: str
    event_description: str

    # Actor
    actor_id: UUID | None
    actor_email: str | None
    actor_type: str  # 'user', 'api_key', 'system'

    # Target
    target_type: str | None
    target_id: UUID | None
    target_name: str | None

    # Context
    ip_address: str
    user_agent: str
    location: dict | None  # GeoIP

    # Changes
    changes: dict | None
    # {"field": {"from": "...", "to": "..."}}

    # Timestamp
    occurred_at: datetime

    # Retention
    retention_until: datetime
```

---

### 5.4.3 Enterprise Analytics

#### 5.4.3.1 Custom Dashboards

**Dashboard Builder:**

```python
class CustomDashboard(BaseModel):
    """Custom dashboard configuration."""

    id: UUID
    organization_id: UUID

    # Dashboard info
    name: str
    description: str
    is_default: bool

    # Layout
    layout: list[dict]
    # [{
    #     "widget_id": UUID,
    #     "widget_type": "metric_card",
    #     "position": {"x": 0, "y": 0, "w": 4, "h": 2},
    #     "config": {...}
    # }]

    # Filters
    global_filters: dict
    # {"organizations": [...], "date_range": "last_30_days"}

    # Sharing
    shared_with: list[UUID]  # User IDs
    is_public: bool  # Org-wide

    # Metadata
    created_by: UUID
    created_at: datetime
    updated_at: datetime

class DashboardWidget(BaseModel):
    """Widget on a dashboard."""

    id: UUID
    widget_type: str  # 'metric_card', 'chart', 'table', 'map'

    # Data source
    data_source: str  # 'work_orders', 'equipment', 'compliance'
    query: dict  # Query configuration
    refresh_interval_minutes: int

    # Display
    title: str
    visualization_type: str
    visualization_config: dict
```

#### 5.4.3.2 BI Integration

**Export Options:**

| Format | Use Case |
|--------|----------|
| CSV/Excel | Ad-hoc analysis |
| JSON | API consumption |
| Direct database | Data warehouse |
| Streaming | Real-time analytics |

**Data Warehouse Schema:**

```python
class DataWarehouseConfig(BaseModel):
    """Data warehouse integration."""

    id: UUID
    organization_id: UUID

    # Connection
    warehouse_type: str  # 'snowflake', 'bigquery', 'redshift', 'databricks'
    connection_config: dict
    # {
    #     "host": "...",
    #     "database": "...",
    #     "schema": "sitesync",
    #     "credentials_secret_id": "..."
    # }

    # Sync configuration
    tables_to_sync: list[str]
    sync_frequency: str  # 'hourly', 'daily', 'real_time'
    full_refresh_day: int | None  # Day of month

    # Status
    is_active: bool
    last_sync_at: datetime | None
    last_sync_status: str | None
    rows_synced: int
```

---

### 5.4.4 White-Labeling

#### 5.4.4.1 Branding Customization

**Customization Options:**

```python
class WhiteLabelConfig(BaseModel):
    """White-label configuration."""

    id: UUID
    organization_id: UUID

    # Branding
    company_name: str
    logo_url: str
    logo_icon_url: str  # For mobile/favicon
    primary_color: str
    secondary_color: str
    accent_color: str

    # Domain
    custom_domain: str | None
    domain_verified: bool

    # Email
    from_email_address: str | None
    from_email_name: str | None
    email_footer: str | None

    # Content
    support_url: str | None
    support_email: str | None
    terms_url: str | None
    privacy_url: str | None

    # Features
    hide_sitesync_branding: bool
    custom_login_page: bool
    custom_email_templates: bool

    # Status
    is_active: bool
    verified_at: datetime | None
```

---

### 5.4.5 Enterprise Support

#### 5.4.5.1 Support Tiers

| Tier | Response Time | Channels | Features |
|------|---------------|----------|----------|
| Standard | 24 hours | Email, Chat | Knowledge base |
| Premium | 4 hours | Email, Chat, Phone | Dedicated queue |
| Enterprise | 1 hour | All + dedicated contact | CSM, training |
| Critical | 15 minutes (P1) | All + escalation | 24/7 coverage |

---

## Success Metrics

### Phase 5.4 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Enterprise accounts | 50+ | Active enterprises |
| SSO integrations | 80%+ | Enterprise SSO adoption |
| Enterprise ARR | $2M+ | Annual recurring revenue |
| NPS (Enterprise) | 50+ | Net promoter score |
| White-label deployments | 10+ | Active white-labels |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
