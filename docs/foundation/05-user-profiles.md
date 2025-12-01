# SiteSync V3 - User Profiles

> **User Roles & Access** - Complete specification for user profiles and permissions.

---

## What is a User?

A **User** is a person who has access to SiteSync within an Organization. Users have:

- Authentication credentials (email/password)
- A role that determines base permissions
- Optional granular permissions for specific actions
- Preferences for notifications and interface

---

## User Types

| Type | Code | Description | Typical Use |
|------|------|-------------|-------------|
| **Standard** | `standard` | Regular employee | Office staff, managers |
| **Technician** | `technician` | Field technician | Service technicians |
| **Manager** | `manager` | Operations manager | Team leads, supervisors |
| **Admin** | `admin` | System administrator | IT staff |
| **System** | `system` | Automated user | API integrations |

---

## Role Hierarchy

Roles determine base permission levels:

```
OWNER ─────────────────────────────────────────────► Highest Access
  │
  ├─► ADMIN ──────────────────────────────────────► Full Control (no billing)
  │     │
  │     ├─► MANAGER ──────────────────────────────► Site & Work Management
  │     │     │
  │     │     ├─► USER ───────────────────────────► Standard Operations
  │     │     │     │
  │     │     │     ├─► TECHNICIAN ───────────────► Field Work
  │     │     │     │
  │     │     │     └─► READONLY ─────────────────► View Only
  │     │     │
  │     │     └─► GUEST ──────────────────────────► Temporary Access
```

### Role Definitions

| Role | Code | Description | Capabilities |
|------|------|-------------|--------------|
| **Owner** | `owner` | Organization owner | Full control including billing, can delete org |
| **Admin** | `admin` | Administrator | Full control except billing/delete org |
| **Manager** | `manager` | Operations manager | Manage sites, assets, work orders, contractors |
| **User** | `user` | Standard user | Create/edit work orders, view assets |
| **Technician** | `technician` | Field technician | View assigned work, log time/parts |
| **Readonly** | `readonly` | Read-only access | View only, no modifications |
| **Guest** | `guest` | Temporary access | Limited view access, time-limited |

---

## Profile Field Reference

### Required Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `organization_id` | UUID | FK, NOT NULL | Parent organization |
| `email` | VARCHAR(255) | NOT NULL | Login email |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password |

### Identity Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | UUID | Auto | Primary key | UUID |
| `organization_id` | UUID | Yes | Parent organization | UUID |
| `email` | VARCHAR(255) | Yes | Login email (unique per org) | "john@company.com" |
| `password_hash` | VARCHAR(255) | Yes | Bcrypt hashed password | "$2b$12$..." |
| `email_verified` | BOOLEAN | No (default: false) | Email verified | true |

### Profile Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `first_name` | VARCHAR(100) | Recommended | First name | "John" |
| `last_name` | VARCHAR(100) | Recommended | Last name | "Smith" |
| `display_name` | VARCHAR(255) | No | Display name | "John S." |
| `phone` | VARCHAR(50) | Recommended | Phone number | "+61 400 123 456" |
| `avatar_url` | VARCHAR(500) | No | Profile picture URL | "https://..." |
| `bio` | TEXT | No | Bio/description | "Senior technician..." |

### Role & Permission Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `user_type` | VARCHAR(50) | No (default: 'standard') | User type | "technician" |
| `role` | VARCHAR(50) | No (default: 'user') | Base role | "manager" |
| `permissions` | JSONB | No (default: []) | Additional permissions | `["reports:view"]` |

### Location Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `city` | VARCHAR(100) | No | City | "Melbourne" |
| `state` | VARCHAR(100) | No | State | "VIC" |
| `country` | VARCHAR(100) | No (default) | Country | "Australia" |
| `timezone` | VARCHAR(50) | No (default) | Timezone | "Australia/Sydney" |

### Status Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `is_active` | BOOLEAN | No (default: true) | Account active | true |
| `last_login_at` | TIMESTAMPTZ | No | Last login | "2024-12-01T..." |
| `last_activity_at` | TIMESTAMPTZ | No | Last activity | "2024-12-01T..." |

### System Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `notification_preferences` | JSONB | No | Notification settings |
| `privacy_settings` | JSONB | No | Privacy settings |
| `preferences` | JSONB | No | UI preferences |
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Auto | Last update |
| `deleted_at` | TIMESTAMPTZ | No | Soft delete |

---

## Permissions System

### Permission Format

Permissions follow the format: `resource:action`

```
work_orders:create    - Can create work orders
work_orders:edit      - Can edit work orders
work_orders:delete    - Can delete work orders
work_orders:assign    - Can assign work orders to contractors
sites:create          - Can create sites
sites:edit            - Can edit sites
reports:view          - Can view reports
reports:export        - Can export reports
users:manage          - Can manage users
settings:edit         - Can edit organization settings
```

### Permission Array Example

```json
[
  "work_orders:create",
  "work_orders:edit",
  "work_orders:view",
  "sites:view",
  "assets:view",
  "assets:edit",
  "reports:view"
]
```

### Default Permissions by Role

| Permission | Owner | Admin | Manager | User | Tech | Readonly |
|------------|-------|-------|---------|------|------|----------|
| `org:manage` | Yes | No | No | No | No | No |
| `org:billing` | Yes | No | No | No | No | No |
| `users:manage` | Yes | Yes | No | No | No | No |
| `users:view` | Yes | Yes | Yes | No | No | No |
| `sites:create` | Yes | Yes | Yes | No | No | No |
| `sites:edit` | Yes | Yes | Yes | No | No | No |
| `sites:delete` | Yes | Yes | No | No | No | No |
| `sites:view` | Yes | Yes | Yes | Yes | Yes | Yes |
| `assets:create` | Yes | Yes | Yes | Yes | No | No |
| `assets:edit` | Yes | Yes | Yes | Yes | No | No |
| `assets:delete` | Yes | Yes | Yes | No | No | No |
| `assets:view` | Yes | Yes | Yes | Yes | Yes | Yes |
| `work_orders:create` | Yes | Yes | Yes | Yes | No | No |
| `work_orders:edit` | Yes | Yes | Yes | Yes | Yes* | No |
| `work_orders:delete` | Yes | Yes | Yes | No | No | No |
| `work_orders:assign` | Yes | Yes | Yes | No | No | No |
| `work_orders:view` | Yes | Yes | Yes | Yes | Yes* | Yes |
| `contractors:manage` | Yes | Yes | Yes | No | No | No |
| `contractors:view` | Yes | Yes | Yes | Yes | Yes | Yes |
| `inventory:manage` | Yes | Yes | Yes | No | No | No |
| `inventory:view` | Yes | Yes | Yes | Yes | Yes | Yes |
| `reports:view` | Yes | Yes | Yes | Yes | No | Yes |
| `reports:export` | Yes | Yes | Yes | No | No | No |
| `settings:edit` | Yes | Yes | No | No | No | No |
| `ai:use` | Yes | Yes | Yes | Yes | Yes | No |

*Technicians can only view/edit work orders assigned to them.

---

## Notification Preferences Schema

```json
{
  "email": {
    "work_order_assigned": true,
    "work_order_updated": true,
    "work_order_completed": true,
    "inspection_due": true,
    "marketing": false,
    "weekly_digest": true
  },
  "push": {
    "work_order_assigned": true,
    "work_order_urgent": true,
    "messages": true
  },
  "sms": {
    "emergency": true,
    "work_order_assigned": false
  }
}
```

---

## Privacy Settings Schema

```json
{
  "profile_visibility": "public",
  "show_email": false,
  "show_phone": false,
  "show_location": true,
  "open_to_opportunities": false,
  "allow_endorsements": true
}
```

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| `profile_visibility` | public, employers_only, private | public | Who can see profile |
| `show_email` | boolean | false | Display email publicly |
| `show_phone` | boolean | false | Display phone publicly |
| `show_location` | boolean | true | Show city/state |
| `open_to_opportunities` | boolean | false | Visible in job marketplace |
| `allow_endorsements` | boolean | true | Allow skill endorsements |

---

## UI Preferences Schema

```json
{
  "theme": "light",
  "dashboard_layout": "cards",
  "default_view": "work_orders",
  "items_per_page": 25,
  "date_format": "DD/MM/YYYY",
  "time_format": "HH:mm",
  "sidebar_collapsed": false,
  "recent_sites": ["uuid-1", "uuid-2", "uuid-3"]
}
```

---

## Creation Requirements

### Minimum Required Data (System)

```json
{
  "email": "john@company.com",
  "password": "SecurePassword123!"
}
```

**Note**: `organization_id` set from context, `role` defaults to 'user'.

### Recommended Data

```json
{
  "email": "john@company.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+61 400 123 456",
  "role": "technician",
  "user_type": "technician"
}
```

---

## Profile Completeness Levels

### Minimal Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@company.com",
  "email_verified": false,
  "user_type": "standard",
  "role": "user",
  "permissions": [],
  "is_active": true,
  "country": "Australia",
  "timezone": "Australia/Sydney",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: ~20%

### Standard Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@company.com",
  "email_verified": true,
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+61 400 123 456",
  "user_type": "technician",
  "role": "technician",
  "permissions": [],
  "city": "Melbourne",
  "state": "VIC",
  "country": "Australia",
  "timezone": "Australia/Sydney",
  "is_active": true,
  "last_login_at": "2024-12-01T08:00:00Z",
  "notification_preferences": {
    "email": {"work_order_assigned": true}
  },
  "created_at": "2024-06-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: ~60%

### Complete Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john@company.com",
  "email_verified": true,
  "first_name": "John",
  "last_name": "Smith",
  "display_name": "John S.",
  "phone": "+61 400 123 456",
  "avatar_url": "https://storage.sitesync.com/avatars/john-smith.jpg",
  "bio": "Senior lift technician with 15 years experience specializing in KONE and Otis equipment.",
  "user_type": "technician",
  "role": "technician",
  "permissions": ["reports:view"],
  "city": "Melbourne",
  "state": "VIC",
  "country": "Australia",
  "timezone": "Australia/Sydney",
  "is_active": true,
  "last_login_at": "2024-12-01T08:00:00Z",
  "last_activity_at": "2024-12-01T10:30:00Z",
  "notification_preferences": {
    "email": {
      "work_order_assigned": true,
      "work_order_updated": true,
      "inspection_due": true,
      "marketing": false
    },
    "push": {
      "work_order_assigned": true,
      "work_order_urgent": true
    },
    "sms": {
      "emergency": true
    }
  },
  "privacy_settings": {
    "profile_visibility": "public",
    "show_email": false,
    "show_phone": false,
    "open_to_opportunities": true
  },
  "preferences": {
    "theme": "light",
    "dashboard_layout": "cards",
    "items_per_page": 25
  },
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: 100%

---

## Internal vs External Users

### Internal Users

Users who are employees of the organization:

```json
{
  "email": "john@collinslift.com.au",
  "user_type": "technician",
  "role": "technician",
  "organization_id": "collinslift-org-uuid"
}
```

### External Users (Contractors)

Contractors are separate entities, but may have linked user accounts:

```json
// Contractor entity
{
  "id": "contractor-uuid",
  "organization_id": "collinslift-org-uuid",
  "contact_name": "Bob Builder",
  "email": "bob@subcontractor.com",
  "technician_profile_id": "platform-profile-uuid"  // Links to platform-wide profile
}
```

Contractors access via the **Contractor Portal**, not as internal users.

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `email` | Required, valid email format | "Valid email is required" |
| `email` | Unique within organization | "Email already exists" |
| `password` | Min 8 chars, complexity required | "Password must be at least 8 characters" |
| `first_name` | 1-100 chars | "First name too long" |
| `last_name` | 1-100 chars | "Last name too long" |
| `phone` | Valid phone format | "Invalid phone number" |
| `role` | One of defined roles | "Invalid role" |
| `user_type` | One of defined types | "Invalid user type" |
| `timezone` | Valid IANA timezone | "Invalid timezone" |

---

## Authentication Flow

```
1. User submits email + password
   └── POST /api/v1/auth/login

2. Server validates credentials
   ├── Check email exists
   ├── Verify password hash
   └── Check user is_active

3. Server issues tokens
   ├── Access token (JWT, 15 min)
   └── Refresh token (JWT, 7 days)

4. Access token contains:
   {
     "sub": "user-uuid",
     "org": "organization-uuid",
     "role": "manager",
     "permissions": ["work_orders:create", ...],
     "exp": 1234567890
   }

5. Every request:
   ├── Validate JWT signature
   ├── Check not expired
   ├── SET app.current_org = '{org_id}'
   └── RLS filters all queries
```

---

## Pydantic Models

```python
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr

class User(BaseModel):
    """User domain model."""

    id: UUID
    organization_id: UUID
    email: EmailStr
    email_verified: bool = False

    # Profile
    first_name: str | None = None
    last_name: str | None = None
    display_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    bio: str | None = None

    # Role
    user_type: str = "standard"
    role: str = "user"
    permissions: list[str] = Field(default_factory=list)

    # Location
    city: str | None = None
    state: str | None = None
    country: str = "Australia"
    timezone: str = "Australia/Sydney"

    # Status
    is_active: bool = True
    last_login_at: datetime | None = None
    last_activity_at: datetime | None = None

    # Preferences
    notification_preferences: dict = Field(default_factory=dict)
    privacy_settings: dict = Field(default_factory=dict)
    preferences: dict = Field(default_factory=dict)

    # Timestamps
    created_at: datetime
    updated_at: datetime


class UserCreate(BaseModel):
    """Create user request."""

    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    role: str = "user"
    user_type: str = "standard"


class UserUpdate(BaseModel):
    """Update user request."""

    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    role: str | None = None
    is_active: bool | None = None
    notification_preferences: dict | None = None
    preferences: dict | None = None
```

---

**[← Previous: Building Profiles](04-building-profiles.md)** | **[Next: Asset Profiles →](06-asset-profiles.md)**
