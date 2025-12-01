# SiteSync V3 - Customization & Personalization

> **Making It Yours** - Complete specification for user and organization customization options.

---

## Customization Philosophy

SiteSync follows the principle of **sensible defaults, power when needed**:

1. **Works out of the box**: Zero configuration required to start
2. **Progressive customization**: Reveal options as users need them
3. **Role-appropriate options**: Don't overwhelm with irrelevant settings
4. **Sync across devices**: Preferences follow the user

---

## Customization Layers

```
┌────────────────────────────────────────────────────────────┐
│                    USER PREFERENCES                        │
│  Theme, dashboard layout, notifications, date format       │
├────────────────────────────────────────────────────────────┤
│                 ORGANIZATION SETTINGS                      │
│  Branding, terminology, workflows, security policies       │
├────────────────────────────────────────────────────────────┤
│                  PLATFORM DEFAULTS                         │
│  Base configuration, system behavior                       │
└────────────────────────────────────────────────────────────┘

Precedence: User > Organization > Platform
```

---

## User-Level Settings

### Profile Settings

```json
{
  "profile": {
    "first_name": "John",
    "last_name": "Smith",
    "display_name": "John S.",
    "phone": "+61 400 123 456",
    "avatar_url": "https://...",
    "bio": "Senior lift technician...",
    "job_title": "Service Manager"
  }
}
```

### Display Preferences

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| `theme` | light, dark, system | system | Color theme |
| `language` | en-AU, en-US, en-GB | en-AU | Display language |
| `timezone` | IANA timezone | org default | User's timezone |
| `date_format` | DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD | org default | Date display |
| `time_format` | 12h, 24h | 24h | Time display |
| `number_format` | 1,234.56 or 1.234,56 | 1,234.56 | Number formatting |
| `currency_display` | symbol, code, name | symbol | $100 vs AUD 100 |
| `week_start` | sunday, monday | monday | Calendar week start |

```json
{
  "display": {
    "theme": "dark",
    "language": "en-AU",
    "timezone": "Australia/Sydney",
    "date_format": "DD/MM/YYYY",
    "time_format": "24h",
    "number_format": "1,234.56",
    "currency_display": "symbol",
    "week_start": "monday"
  }
}
```

### Dashboard Customization

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| `layout` | cards, compact, list | cards | Dashboard layout style |
| `default_view` | dashboard, work_orders, sites | dashboard | Landing page |
| `widgets` | array of widget configs | role default | Active widgets |
| `widget_order` | array of widget IDs | default order | Widget arrangement |
| `time_range` | today, week, month, custom | role default | Default time filter |

```json
{
  "dashboard": {
    "layout": "cards",
    "default_view": "dashboard",
    "widgets": [
      {"id": "site_health", "size": "large", "position": 1},
      {"id": "work_order_pipeline", "size": "medium", "position": 2},
      {"id": "emergency_alerts", "size": "small", "position": 3},
      {"id": "my_activity", "size": "medium", "position": 4}
    ],
    "time_range": "week",
    "refresh_interval": 300
  }
}
```

### Available Widgets by Role

| Widget | Owner | Admin | Manager | User | Tech |
|--------|:-----:|:-----:|:-------:|:----:|:----:|
| Site Health Summary | ✓ | ✓ | ✓ | ✓ | - |
| Work Order Pipeline | ✓ | ✓ | ✓ | ✓ | - |
| Emergency Alerts | ✓ | ✓ | ✓ | ✓ | ✓ |
| My Activity | ✓ | ✓ | ✓ | ✓ | ✓ |
| My Jobs Today | - | - | - | - | ✓ |
| My Stats | - | - | ✓ | ✓ | ✓ |
| Team Performance | ✓ | ✓ | ✓ | - | - |
| Contractor Performance | ✓ | ✓ | ✓ | - | - |
| Financial Summary | ✓ | - | - | - | - |
| Inspection Calendar | ✓ | ✓ | ✓ | ✓ | - |
| Recent Activity Feed | ✓ | ✓ | ✓ | ✓ | - |
| System Health | ✓ | ✓ | - | - | - |
| Low Stock Alerts | ✓ | ✓ | ✓ | - | - |

### List View Preferences

```json
{
  "list_views": {
    "work_orders": {
      "items_per_page": 25,
      "columns": ["number", "title", "site", "status", "priority", "assigned", "created"],
      "default_sort": {"field": "created_at", "direction": "desc"},
      "saved_filter": null
    },
    "sites": {
      "items_per_page": 25,
      "columns": ["name", "address", "health_score", "open_wos", "last_inspection"],
      "default_sort": {"field": "name", "direction": "asc"},
      "saved_filter": null
    },
    "assets": {
      "items_per_page": 50,
      "columns": ["unit", "site", "manufacturer", "model", "status", "health"],
      "default_sort": {"field": "unit_number", "direction": "asc"},
      "saved_filter": null
    }
  }
}
```

### Sidebar Preferences

```json
{
  "sidebar": {
    "collapsed": false,
    "pinned_items": [
      {"type": "site", "id": "uuid", "name": "Collins Tower"},
      {"type": "saved_filter", "id": "uuid", "name": "Emergency WOs"}
    ],
    "recent_items_count": 5,
    "show_quick_actions": true
  }
}
```

### Keyboard Shortcuts

```json
{
  "shortcuts": {
    "enabled": true,
    "custom_bindings": {
      "global_search": "/",
      "new_work_order": "n",
      "my_jobs": "j",
      "dashboard": "d"
    }
  }
}
```

---

## Notification Preferences

### Channel Preferences

```json
{
  "notifications": {
    "channels": {
      "in_app": {
        "enabled": true
      },
      "email": {
        "enabled": true,
        "digest_mode": "immediate",
        "quiet_hours": null
      },
      "push": {
        "enabled": true,
        "quiet_hours": {
          "start": "22:00",
          "end": "07:00",
          "timezone": "Australia/Sydney"
        }
      },
      "sms": {
        "enabled": true,
        "emergency_only": true
      }
    }
  }
}
```

### Event Preferences by Category

```json
{
  "notifications": {
    "events": {
      "work_orders": {
        "assigned": {"email": true, "push": true, "in_app": true},
        "status_changed": {"email": false, "push": true, "in_app": true},
        "completed": {"email": true, "push": false, "in_app": true},
        "emergency_created": {"email": true, "push": true, "sms": true},
        "overdue": {"email": true, "push": true, "in_app": true}
      },
      "assets": {
        "status_changed": {"email": false, "push": false, "in_app": true},
        "inspection_due": {"email": true, "push": true, "in_app": true},
        "inspection_overdue": {"email": true, "push": true, "in_app": true},
        "health_critical": {"email": true, "push": true, "in_app": true}
      },
      "system": {
        "announcements": {"email": true, "push": false, "in_app": true},
        "security_alerts": {"email": true, "push": true, "in_app": true}
      }
    }
  }
}
```

### Digest Options

| Option | Description |
|--------|-------------|
| `immediate` | Send as events occur |
| `hourly` | Batch and send hourly |
| `daily` | Daily summary at specified time |
| `weekly` | Weekly summary on specified day |

```json
{
  "notifications": {
    "digest": {
      "mode": "daily",
      "time": "09:00",
      "timezone": "Australia/Sydney",
      "include": ["work_orders", "inspections"]
    }
  }
}
```

---

## Privacy Settings

```json
{
  "privacy": {
    "profile_visibility": "public",
    "show_email": false,
    "show_phone": false,
    "show_location": true,
    "activity_visibility": "organization",
    "allow_mentions": true,
    "show_online_status": true,
    "open_to_opportunities": false
  }
}
```

### Visibility Options

| Setting | Options | Description |
|---------|---------|-------------|
| `profile_visibility` | public, organization, private | Who can view profile |
| `activity_visibility` | public, organization, private | Who can see activity |

---

## Organization-Level Settings

### General Settings

```json
{
  "organization": {
    "name": "Collins Lift Services",
    "slug": "collins-lift",
    "legal_name": "Collins Lift Services Pty Ltd",
    "abn": "12 345 678 901",
    "industry": "elevator_maintenance",
    "size": "small",
    "website": "https://collinslifts.com.au"
  }
}
```

### Contact Information

```json
{
  "contact": {
    "primary_email": "info@collinslifts.com.au",
    "billing_email": "accounts@collinslifts.com.au",
    "support_email": "support@collinslifts.com.au",
    "phone": "+61 3 9000 0000",
    "address": {
      "line1": "123 Collins Street",
      "line2": "Level 10",
      "city": "Melbourne",
      "state": "VIC",
      "postal_code": "3000",
      "country": "Australia"
    }
  }
}
```

### Branding Settings

```json
{
  "branding": {
    "logo_url": "https://cdn.sitesync.io/orgs/collins/logo.png",
    "logo_dark_url": "https://cdn.sitesync.io/orgs/collins/logo-dark.png",
    "favicon_url": "https://cdn.sitesync.io/orgs/collins/favicon.ico",
    "primary_color": "#1E40AF",
    "secondary_color": "#64748B",
    "accent_color": "#F59E0B",
    "custom_domain": "portal.collinslifts.com.au",
    "email_footer": "Collins Lift Services | Melbourne, Australia",
    "support_text": "Contact support: support@collinslifts.com.au"
  }
}
```

### Default Settings for New Users

```json
{
  "user_defaults": {
    "role": "user",
    "timezone": "Australia/Sydney",
    "date_format": "DD/MM/YYYY",
    "time_format": "24h",
    "theme": "system",
    "dashboard_layout": "cards",
    "notifications": {
      "email_enabled": true,
      "push_enabled": true
    }
  }
}
```

---

## Terminology Customization

Organizations can rename system terms to match their vocabulary:

### Customizable Terms

| System Term | Customizable | Example Custom |
|-------------|--------------|----------------|
| Site | Yes | Building, Property, Location |
| Elevator | Yes | Lift, Asset, Equipment |
| Work Order | Yes | Job, Ticket, Task, Service Request |
| Contractor | Yes | Technician, Service Provider, Vendor |

### Terminology Configuration

```json
{
  "terminology": {
    "site": {
      "singular": "Building",
      "plural": "Buildings"
    },
    "elevator": {
      "singular": "Lift",
      "plural": "Lifts"
    },
    "work_order": {
      "singular": "Job",
      "plural": "Jobs"
    },
    "contractor": {
      "singular": "Service Provider",
      "plural": "Service Providers"
    }
  }
}
```

### Usage in UI

```
// System default
"Create Work Order" → "Create Job"
"All Sites" → "All Buildings"
"Assign Contractor" → "Assign Service Provider"

// Validation messages
"Site is required" → "Building is required"
```

---

## Custom Fields Architecture

### Overview

Organizations can add custom fields to entities for tracking data specific to their operations.

### Supported Entities

| Entity | Custom Fields Supported |
|--------|------------------------|
| Sites | Yes |
| Assets/Elevators | Yes |
| Work Orders | Yes |
| Contractors | Yes |
| Parts/Inventory | Yes |

### Custom Field Types

| Type | Code | Description | Validation |
|------|------|-------------|------------|
| Text | `text` | Single line text | max_length |
| Long Text | `textarea` | Multi-line text | max_length |
| Number | `number` | Integer or decimal | min, max, decimal_places |
| Currency | `currency` | Money value | min, max, currency_code |
| Date | `date` | Date only | min_date, max_date |
| DateTime | `datetime` | Date and time | min_date, max_date |
| Select | `select` | Single choice | options |
| Multi-Select | `multi_select` | Multiple choices | options, max_selections |
| Checkbox | `checkbox` | Yes/No boolean | - |
| URL | `url` | Web link | must_be_https |
| Email | `email` | Email address | - |
| Phone | `phone` | Phone number | format |
| File | `file` | File attachment | allowed_types, max_size |

### Custom Field Definition

```json
{
  "id": "uuid",
  "organization_id": "uuid",
  "entity_type": "work_order",
  "field_name": "purchase_order_number",
  "display_name": "PO Number",
  "description": "Customer purchase order reference",
  "field_type": "text",
  "required": false,
  "show_in_list": true,
  "show_in_card": false,
  "searchable": true,
  "filterable": true,
  "position": 1,
  "validation": {
    "max_length": 50,
    "pattern": "^PO-[0-9]+$"
  },
  "default_value": null,
  "created_at": "2024-12-01T10:00:00Z"
}
```

### Custom Field Examples

#### Work Order Custom Fields

```json
[
  {
    "field_name": "purchase_order",
    "display_name": "PO Number",
    "field_type": "text",
    "required": false
  },
  {
    "field_name": "building_contact",
    "display_name": "Building Contact",
    "field_type": "text",
    "required": true
  },
  {
    "field_name": "access_required",
    "display_name": "Special Access Required",
    "field_type": "multi_select",
    "options": ["Keys", "Swipe Card", "Security Escort", "After Hours"]
  },
  {
    "field_name": "invoice_amount",
    "display_name": "Invoice Amount",
    "field_type": "currency",
    "validation": {"min": 0, "currency": "AUD"}
  }
]
```

#### Site Custom Fields

```json
[
  {
    "field_name": "building_manager",
    "display_name": "Building Manager",
    "field_type": "text"
  },
  {
    "field_name": "contract_type",
    "display_name": "Contract Type",
    "field_type": "select",
    "options": ["Full Service", "Parts Only", "Ad-hoc"]
  },
  {
    "field_name": "contract_expiry",
    "display_name": "Contract Expiry Date",
    "field_type": "date"
  }
]
```

### Custom Fields in API

```json
// Work order with custom fields
{
  "id": "uuid",
  "work_order_number": "WO-2024-0234",
  "title": "Door not closing",
  // ... standard fields ...
  "custom_fields": {
    "purchase_order": "PO-12345",
    "building_contact": "John Smith",
    "access_required": ["Keys", "After Hours"],
    "invoice_amount": 1250.00
  }
}
```

### Custom Fields in Search/Filter

Searchable custom fields appear in search results:

```sql
-- Custom field index
CREATE INDEX idx_work_orders_custom_fields ON work_orders
USING GIN (custom_fields);

-- Query with custom field filter
SELECT * FROM work_orders
WHERE custom_fields->>'purchase_order' = 'PO-12345';
```

---

## Workflow Customization

### Custom Work Order Types

Organizations can define additional work order types:

```json
{
  "work_order_types": {
    "standard": ["breakdown", "preventive", "inspection", "callback", "installation", "modernization", "audit"],
    "custom": [
      {
        "code": "warranty",
        "name": "Warranty Repair",
        "description": "Repairs covered under warranty",
        "color": "#10B981",
        "default_priority": "medium",
        "requires_approval": false
      },
      {
        "code": "vandalism",
        "name": "Vandalism Repair",
        "description": "Damage from vandalism",
        "color": "#EF4444",
        "default_priority": "high",
        "requires_photos": true,
        "requires_police_report": true
      }
    ]
  }
}
```

### Custom Status Workflows

Define custom statuses for specific work order types:

```json
{
  "workflows": {
    "work_order": {
      "default": {
        "statuses": ["draft", "pending", "scheduled", "in_progress", "on_hold", "completed", "cancelled", "invoiced"],
        "transitions": {
          "draft": ["pending", "cancelled"],
          "pending": ["scheduled", "in_progress", "cancelled"],
          "scheduled": ["in_progress", "pending", "cancelled"],
          "in_progress": ["on_hold", "completed", "cancelled"],
          "on_hold": ["in_progress", "cancelled"],
          "completed": ["invoiced"],
          "cancelled": [],
          "invoiced": []
        }
      },
      "warranty": {
        "statuses": ["draft", "pending_approval", "approved", "scheduled", "in_progress", "completed", "claim_submitted", "claim_paid"],
        "transitions": {
          "draft": ["pending_approval"],
          "pending_approval": ["approved", "cancelled"],
          "approved": ["scheduled"],
          "scheduled": ["in_progress"],
          "in_progress": ["completed"],
          "completed": ["claim_submitted"],
          "claim_submitted": ["claim_paid"],
          "claim_paid": []
        }
      }
    }
  }
}
```

### Approval Workflows

Configure approval requirements:

```json
{
  "approvals": {
    "work_order_creation": {
      "enabled": false,
      "threshold": null
    },
    "work_order_cost": {
      "enabled": true,
      "threshold": 5000,
      "approvers": ["manager", "admin"],
      "auto_approve_below": 1000
    },
    "contractor_assignment": {
      "enabled": false
    },
    "expense_approval": {
      "enabled": true,
      "threshold": 500,
      "approvers": ["manager"]
    }
  }
}
```

### Auto-Assignment Rules

Configure automatic work order assignment:

```json
{
  "auto_assignment": {
    "enabled": true,
    "rules": [
      {
        "name": "KONE equipment to KONE",
        "priority": 1,
        "conditions": {
          "asset_manufacturer": "KONE"
        },
        "assign_to": {
          "type": "contractor",
          "contractor_id": "uuid"
        }
      },
      {
        "name": "Emergency to preferred contractor",
        "priority": 2,
        "conditions": {
          "priority": "emergency"
        },
        "assign_to": {
          "type": "preferred_contractor_for_site"
        }
      },
      {
        "name": "Round-robin for regular jobs",
        "priority": 99,
        "conditions": {},
        "assign_to": {
          "type": "round_robin",
          "contractor_pool": ["uuid1", "uuid2", "uuid3"]
        }
      }
    ],
    "fallback": {
      "action": "leave_unassigned",
      "notify": ["manager"]
    }
  }
}
```

---

## Security Policies

### Password Policy

```json
{
  "security": {
    "password": {
      "min_length": 12,
      "require_uppercase": true,
      "require_lowercase": true,
      "require_numbers": true,
      "require_special": true,
      "disallow_common": true,
      "disallow_user_info": true,
      "history_count": 5,
      "max_age_days": 90,
      "lockout_attempts": 5,
      "lockout_duration_minutes": 30
    }
  }
}
```

### Two-Factor Authentication

```json
{
  "security": {
    "two_factor": {
      "required": true,
      "required_roles": ["owner", "admin"],
      "allowed_methods": ["totp", "sms", "email"],
      "remember_device_days": 30
    }
  }
}
```

### Session Policy

```json
{
  "security": {
    "session": {
      "max_duration_hours": 24,
      "idle_timeout_minutes": 60,
      "single_session": false,
      "require_reverification_for_sensitive": true
    }
  }
}
```

### IP Restrictions (Enterprise)

```json
{
  "security": {
    "ip_restrictions": {
      "enabled": true,
      "mode": "allowlist",
      "addresses": [
        "203.0.113.0/24",
        "198.51.100.50"
      ],
      "exempt_roles": ["technician"]
    }
  }
}
```

---

## Subscription & Billing

### Plan Limits

| Feature | Free | Pro | Expert | Enterprise |
|---------|------|-----|--------|------------|
| Sites | 1 | 10 | 50 | Unlimited |
| Assets | 5 | 100 | 500 | Unlimited |
| Users | 3 | 25 | 100 | Unlimited |
| Work Orders/month | 50 | 500 | Unlimited | Unlimited |
| Storage | 1 GB | 10 GB | 100 GB | Unlimited |
| Custom Fields | - | 5 | 20 | Unlimited |
| API Access | - | Basic | Full | Full |
| Custom Branding | - | - | ✓ | ✓ |
| Custom Domain | - | - | ✓ | ✓ |
| SSO | - | - | - | ✓ |
| Audit Log Export | - | - | ✓ | ✓ |

### Billing Settings

```json
{
  "billing": {
    "plan": "pro",
    "billing_cycle": "annual",
    "billing_email": "accounts@company.com",
    "payment_method": {
      "type": "card",
      "last_four": "4242",
      "expiry": "12/25"
    },
    "auto_renew": true,
    "invoice_prefix": "CLS",
    "tax_id": "AU 12 345 678 901"
  }
}
```

---

## Settings UI Structure

### User Settings Menu

```
Settings
├── Profile
│   ├── Personal Information
│   ├── Avatar
│   └── Contact Details
├── Preferences
│   ├── Display
│   │   ├── Theme
│   │   ├── Language
│   │   └── Date/Time Format
│   ├── Dashboard
│   │   ├── Layout
│   │   ├── Widgets
│   │   └── Default View
│   └── Lists
│       ├── Items Per Page
│       └── Column Selection
├── Notifications
│   ├── Email Preferences
│   ├── Push Preferences
│   ├── Digest Settings
│   └── Quiet Hours
├── Privacy
│   ├── Profile Visibility
│   └── Activity Visibility
├── Security
│   ├── Change Password
│   ├── Two-Factor Auth
│   └── Active Sessions
└── Connected Apps
    └── API Keys
```

### Organization Settings Menu (Admin)

```
Organization Settings
├── General
│   ├── Organization Info
│   ├── Contact Details
│   └── Branding
├── Customization
│   ├── Terminology
│   ├── Custom Fields
│   ├── Work Order Types
│   └── Workflows
├── Users & Permissions
│   ├── User Management
│   ├── Role Configuration
│   └── Invitation Settings
├── Integrations
│   ├── Connected Services
│   ├── API Keys
│   └── Webhooks
├── Notifications
│   ├── Email Templates
│   └── Default Preferences
├── Security
│   ├── Password Policy
│   ├── Two-Factor Policy
│   └── Session Settings
├── Billing (Owner only)
│   ├── Subscription
│   ├── Payment Method
│   └── Invoices
└── Data
    ├── Import/Export
    ├── Backup Settings
    └── Data Retention
```

---

## Settings API

### Get User Preferences

```http
GET /api/v1/users/me/preferences

Response:
{
  "display": {...},
  "dashboard": {...},
  "notifications": {...},
  "privacy": {...}
}
```

### Update User Preferences

```http
PATCH /api/v1/users/me/preferences
{
  "display": {
    "theme": "dark"
  },
  "dashboard": {
    "layout": "compact"
  }
}
```

### Get Organization Settings

```http
GET /api/v1/organization/settings

Response:
{
  "general": {...},
  "branding": {...},
  "terminology": {...},
  "security": {...}
}
```

### Update Organization Settings

```http
PATCH /api/v1/organization/settings
{
  "terminology": {
    "site": {
      "singular": "Building",
      "plural": "Buildings"
    }
  }
}
```

### Manage Custom Fields

```http
# List custom fields
GET /api/v1/organization/custom-fields?entity=work_order

# Create custom field
POST /api/v1/organization/custom-fields
{
  "entity_type": "work_order",
  "field_name": "purchase_order",
  "display_name": "PO Number",
  "field_type": "text"
}

# Update custom field
PATCH /api/v1/organization/custom-fields/{field_id}

# Delete custom field
DELETE /api/v1/organization/custom-fields/{field_id}
```

---

## Import/Export Settings

### Export Organization Settings

```http
GET /api/v1/organization/settings/export

Response: {
  "exported_at": "2024-12-01T10:00:00Z",
  "version": "1.0",
  "settings": {
    "branding": {...},
    "terminology": {...},
    "custom_fields": [...],
    "workflows": {...}
  }
}
```

### Import Organization Settings

```http
POST /api/v1/organization/settings/import
{
  "settings": {...},
  "overwrite_existing": false
}
```

---

**[← Previous: Search & Filtering](15-search-filtering-architecture.md)** | **[Next: Notification System →](17-notification-system.md)**
