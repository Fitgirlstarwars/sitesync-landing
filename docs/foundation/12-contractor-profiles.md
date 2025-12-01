# SiteSync V3 - Contractor Profiles

> **Entity Definition** - Complete specification for contractors who perform maintenance work.

---

## What is a Contractor?

A **Contractor** represents any service provider who can be assigned to work orders. This includes service companies, independent technicians, internal staff, and specialized vendors.

### Key Characteristics

| Aspect | Description |
|--------|-------------|
| **Purpose** | Track who can perform work and their qualifications |
| **Scope** | Per-organization (same contractor can exist in multiple orgs) |
| **Relationship** | May link to a platform User (for login access) |
| **Assignment** | Can be assigned to work orders |
| **Visibility** | Within organization + their own work orders |

---

## Contractor Types

Every contractor has a type that determines their relationship to the organization.

```python
contractor_types = [
    "company",
    "independent",
    "internal",
    "vendor",
]
```

### Type Definitions

| Type | Code | Description | Example |
|------|------|-------------|---------|
| **Service Company** | `company` | Multi-technician service business | KONE Australia, Schindler |
| **Independent** | `independent` | Solo contractor/freelancer | John Smith Elevators |
| **Internal** | `internal` | In-house maintenance staff | Building's own technician |
| **Vendor** | `vendor` | Parts/equipment supplier with service | OEM parts supplier |

### Type Selection Guide

```
Who is providing the service?
├── External company with multiple techs → company
├── Solo freelance contractor → independent
├── Your own employee → internal
└── Supplier doing install/warranty → vendor
```

### Type Implications

| Type | Can Have Multiple Techs | External Billing | Platform Account |
|------|-------------------------|------------------|------------------|
| `company` | Yes | Yes | Optional |
| `independent` | No | Yes | Optional |
| `internal` | No | No (payroll) | Usually yes |
| `vendor` | Yes | Yes | Optional |

---

## Contractor Status

Contractors have an active/inactive status plus preference flags.

### Status Fields

| Field | Type | Description |
|-------|------|-------------|
| `is_active` | boolean | Can be assigned work |
| `is_preferred` | boolean | Priority in auto-assignment |

### Status Matrix

| is_active | is_preferred | Meaning |
|-----------|--------------|---------|
| true | true | Active, preferred contractor |
| true | false | Active, standard contractor |
| false | false | Inactive, cannot be assigned |
| false | true | Invalid (reset to false) |

---

## Profile Field Reference

### Identification Fields

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Auto | Unique identifier | System generated |
| `organization_id` | UUID | Yes | Organization they serve | FK → organizations |
| `user_id` | UUID | No | Platform user account | FK → users |

### Type and Classification

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `contractor_type` | string | Yes | company, independent, internal, vendor |
| `trade_types` | array | No | Trades they service |
| `specializations` | array | No | Specific specializations |
| `manufacturer_certifications` | array | No | OEM certifications |

### Company Information

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `company_name` | string | Conditional | 255 | Company name (if company/vendor) |
| `company_abn` | string | No | 20 | Australian Business Number |
| `company_license` | string | No | 100 | Company trade license |

### Contact Information

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `contact_name` | string | Yes | 255 | Primary contact name |
| `email` | string | No | 255 | Contact email |
| `phone` | string | No | 50 | Contact phone |

### Address Fields

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `address_line1` | string | No | 255 | Street address |
| `city` | string | No | 100 | City |
| `state` | string | No | 100 | State/province |
| `postal_code` | string | No | 20 | Postal/ZIP code |

### Professional Credentials

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `license_number` | string | Recommended | Trade license number |
| `license_expiry` | date | Recommended | License expiration date |
| `insurance_policy` | string | Recommended | Insurance policy number |
| `insurance_expiry` | date | Recommended | Insurance expiration date |

### Rate Structure

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `hourly_rate` | decimal | - | Standard hourly rate ($) |
| `callout_fee` | decimal | - | Fixed callout/dispatch fee ($) |
| `emergency_rate_multiplier` | decimal | 1.5 | Multiplier for emergency work |

### Performance Metrics (Computed)

| Field | Type | Description | Calculation |
|-------|------|-------------|-------------|
| `rating` | decimal | Overall rating (0.00-5.00) | Average of work order ratings |
| `total_jobs_completed` | integer | Completed work orders | Count of completed WOs |
| `first_time_fix_rate` | decimal | % fixed without callback | (WOs - Callbacks) / WOs |
| `average_response_time_minutes` | integer | Avg response time | Avg(actual_start - assigned_at) |

### Metadata Fields

| Field | Type | Description |
|-------|------|-------------|
| `metadata` | JSONB | Custom/extension data |
| `created_at` | datetime | Creation timestamp |
| `updated_at` | datetime | Last update timestamp |
| `deleted_at` | datetime | Soft delete timestamp |

---

## Trade Types

Contractors specify which trades they service.

```python
trade_types = [
    "lifts_escalators",
    "hvac",
    "electrical",
    "plumbing",
    "fire_systems",
    "security",
    "building_fabric",
    "generators",
    "bms",
    "solar_renewables",
    "pools_gyms",
    "parking",
]
```

### Multi-Trade Contractors

A contractor can service multiple trades:

```json
{
  "trade_types": ["lifts_escalators", "electrical"],
  "specializations": ["KONE lifts", "Otis lifts", "Main switchboards"]
}
```

---

## Manufacturer Certifications

Contractors can hold OEM certifications for specific equipment.

```json
{
  "manufacturer_certifications": [
    "KONE Certified Technician",
    "Otis Gen2 Certified",
    "Schindler 3300 Trained"
  ]
}
```

### Certification Verification

| Status | Meaning | Display |
|--------|---------|---------|
| Claimed | Contractor added | Badge (unverified) |
| Verified | System confirmed | Badge (verified ✓) |
| Expired | Past valid date | Warning indicator |

---

## Rate Structure

### Standard Billing Model

```
Total Cost = Callout Fee + (Hours × Hourly Rate × Multiplier) + Parts
```

### Rate Examples

| Scenario | Calculation |
|----------|-------------|
| Standard 2-hour job | $85 callout + (2 × $95/hr) = $275 |
| Emergency 1.5-hour job | $85 callout + (1.5 × $95 × 1.5) = $298.75 |
| After-hours 3-hour job | $85 callout + (3 × $95 × 1.25) = $441.25 |

### Rate Multipliers

| Condition | Typical Multiplier |
|-----------|-------------------|
| Standard hours | 1.0 |
| After hours | 1.25 |
| Weekend | 1.5 |
| Emergency | 1.5 |
| Public holiday | 2.0 |

---

## Contractor ↔ User Relationship

Contractors may optionally link to a platform User for login access.

### Linked Contractor

```json
{
  "id": "contractor-uuid",
  "user_id": "user-uuid",
  "contact_name": "John Smith",
  "email": "john@smithlifts.com.au"
}
```

The linked user:
- Can log in to SiteSync
- Sees their assigned work orders
- Can update work order status
- Has technician role in the organization

### Unlinked Contractor

```json
{
  "id": "contractor-uuid",
  "user_id": null,
  "contact_name": "KONE Australia",
  "email": "service@kone.com.au"
}
```

Unlinked contractors:
- Cannot log in
- Managed entirely by organization admins
- Work orders assigned via external communication
- Useful for occasional/legacy contractors

---

## Multi-Organization Access

The same real-world contractor can serve multiple organizations.

### How It Works

Each organization has their own contractor record:

```
Building Owner A                   Building Owner B
├── Contractor: KONE              ├── Contractor: KONE
│   id: abc-123                   │   id: xyz-789
│   rates: $95/hr                 │   rates: $100/hr
│   is_preferred: true            │   is_preferred: false
```

### Shared User Account

If the contractor has a platform user, that user can be linked to multiple contractor records:

```
User: john@kone.com.au
├── Org A → Contractor abc-123
├── Org B → Contractor xyz-789
└── Org C → Contractor def-456
```

The user sees all organizations they serve when logging in.

---

## Performance Metrics

### Rating Calculation

```python
def calculate_rating(contractor_id):
    """
    Average rating from completed work orders.
    Scale: 0.00 to 5.00
    """
    ratings = WorkOrder.objects.filter(
        contractor_id=contractor_id,
        status='completed',
        customer_rating__isnull=False
    ).values_list('customer_rating', flat=True)

    if not ratings:
        return None

    return sum(ratings) / len(ratings)
```

### First-Time Fix Rate

```python
def calculate_ftfr(contractor_id):
    """
    Percentage of work orders completed without callback.
    """
    completed = WorkOrder.objects.filter(
        contractor_id=contractor_id,
        status='completed'
    ).count()

    callbacks = WorkOrder.objects.filter(
        contractor_id=contractor_id,
        type='callback'
    ).count()

    if completed == 0:
        return None

    return ((completed - callbacks) / completed) * 100
```

### Response Time

```python
def calculate_avg_response(contractor_id):
    """
    Average minutes from assignment to arrival.
    """
    times = WorkOrder.objects.filter(
        contractor_id=contractor_id,
        assigned_at__isnull=False,
        actual_start__isnull=False
    ).annotate(
        response_time=F('actual_start') - F('assigned_at')
    ).values_list('response_time', flat=True)

    if not times:
        return None

    total_minutes = sum(t.total_seconds() / 60 for t in times)
    return int(total_minutes / len(times))
```

---

## Minimum Viable Contractor

The simplest valid contractor requires:

```json
{
  "contractor_type": "company",
  "contact_name": "KONE Australia"
}
```

System auto-fills:
- `organization_id` from user context
- `is_active` = true
- `is_preferred` = false
- `emergency_rate_multiplier` = 1.5

---

## Complete Contractor Examples

### Example 1: Service Company

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "organization_id": "org-uuid",
  "user_id": null,

  "contractor_type": "company",

  "company_name": "KONE Australia Pty Ltd",
  "company_abn": "12 345 678 901",
  "company_license": "LIC-VIC-12345",

  "contact_name": "Service Desk",
  "email": "service@kone.com.au",
  "phone": "1300 362 262",

  "address_line1": "123 Industrial Drive",
  "city": "Melbourne",
  "state": "VIC",
  "postal_code": "3000",

  "license_number": "EL-VIC-98765",
  "license_expiry": "2025-06-30",
  "insurance_policy": "INS-2024-456789",
  "insurance_expiry": "2025-03-31",

  "trade_types": ["lifts_escalators"],
  "specializations": ["KONE MonoSpace", "KONE EcoSpace"],
  "manufacturer_certifications": ["KONE Certified Service Partner"],

  "hourly_rate": 125.00,
  "callout_fee": 95.00,
  "emergency_rate_multiplier": 1.75,

  "is_active": true,
  "is_preferred": true,

  "rating": 4.65,
  "total_jobs_completed": 847,
  "first_time_fix_rate": 92.5,
  "average_response_time_minutes": 145,

  "created_at": "2023-01-15T10:00:00Z",
  "updated_at": "2024-12-01T09:30:00Z"
}
```

### Example 2: Independent Contractor

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440011",
  "organization_id": "org-uuid",
  "user_id": "user-uuid",

  "contractor_type": "independent",

  "company_name": null,
  "company_abn": "98 765 432 109",

  "contact_name": "Michael Chen",
  "email": "michael@chenlifts.com.au",
  "phone": "0412 345 678",

  "address_line1": "45 Workshop Lane",
  "city": "Richmond",
  "state": "VIC",
  "postal_code": "3121",

  "license_number": "EL-VIC-54321",
  "license_expiry": "2025-12-31",
  "insurance_policy": "PL-2024-123456",
  "insurance_expiry": "2025-06-30",

  "trade_types": ["lifts_escalators"],
  "specializations": ["Hydraulic lifts", "Residential lifts", "Platform lifts"],
  "manufacturer_certifications": ["Schindler 3300", "ThyssenKrupp Synergy"],

  "hourly_rate": 95.00,
  "callout_fee": 75.00,
  "emergency_rate_multiplier": 1.5,

  "is_active": true,
  "is_preferred": false,

  "rating": 4.82,
  "total_jobs_completed": 234,
  "first_time_fix_rate": 88.0,
  "average_response_time_minutes": 95,

  "created_at": "2023-06-20T14:00:00Z",
  "updated_at": "2024-11-28T16:45:00Z"
}
```

### Example 3: Internal Technician

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440012",
  "organization_id": "org-uuid",
  "user_id": "tech-user-uuid",

  "contractor_type": "internal",

  "company_name": null,
  "company_abn": null,

  "contact_name": "David Park",
  "email": "david.park@collinsplace.com.au",
  "phone": "03 9123 4567",

  "license_number": "EL-VIC-11111",
  "license_expiry": "2025-09-30",

  "trade_types": ["lifts_escalators", "electrical"],
  "specializations": ["Minor repairs", "First response"],
  "manufacturer_certifications": [],

  "hourly_rate": null,
  "callout_fee": null,
  "emergency_rate_multiplier": null,

  "is_active": true,
  "is_preferred": true,

  "rating": 4.50,
  "total_jobs_completed": 156,
  "first_time_fix_rate": 75.0,
  "average_response_time_minutes": 15,

  "created_at": "2023-03-01T09:00:00Z",
  "updated_at": "2024-12-01T08:00:00Z"
}
```

---

## Invitation and Onboarding Flow

### Inviting a New Contractor

```
Manager initiates invite
       │
       ▼
┌─────────────────────┐
│  Enter contractor   │
│  details            │
│  - Name             │
│  - Email            │
│  - Type             │
│  - Trades           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Send invitation    │
│  email              │
└──────────┬──────────┘
           │
           ▼
   Contractor receives email
           │
           ├── Clicks link
           │
           ▼
┌─────────────────────┐
│  Contractor creates │
│  account (if new)   │
│  - Set password     │
│  - Verify license   │
│  - Add insurance    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Contractor linked  │
│  to organization    │
│  Can receive work   │
└─────────────────────┘
```

### Invitation Email Content

```
Subject: You've been invited to serve {Organization Name} on SiteSync

Hi {Contact Name},

{Manager Name} from {Organization Name} has invited you to join
SiteSync as a service provider.

Once you accept, you'll be able to:
- Receive work order assignments
- View building and equipment details
- Update job status from the field
- Track your performance metrics

Click here to accept: {invitation_link}

This invitation expires in 7 days.
```

---

## Assignment Rules

How contractors are selected for work orders.

### Manual Assignment

Manager selects contractor directly when creating/editing work order.

### Auto-Assignment Rules

When auto-assign is enabled:

```python
def auto_assign_contractor(work_order):
    """
    Priority order:
    1. Preferred contractor for this asset's manufacturer
    2. Any preferred contractor with matching trade
    3. Best-rated active contractor with matching trade
    """

    # 1. Preferred + manufacturer match
    contractor = Contractor.objects.filter(
        organization_id=work_order.organization_id,
        is_active=True,
        is_preferred=True,
        manufacturer_certifications__contains=[work_order.elevator.manufacturer]
    ).first()

    if contractor:
        return contractor

    # 2. Preferred + trade match
    contractor = Contractor.objects.filter(
        organization_id=work_order.organization_id,
        is_active=True,
        is_preferred=True,
        trade_types__contains=[work_order.elevator.trade_type]
    ).first()

    if contractor:
        return contractor

    # 3. Best rated with trade match
    contractor = Contractor.objects.filter(
        organization_id=work_order.organization_id,
        is_active=True,
        trade_types__contains=[work_order.elevator.trade_type]
    ).order_by('-rating', '-first_time_fix_rate').first()

    return contractor
```

---

## Validation Rules

### Required Field Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| `contractor_type` | Valid enum | "Contractor type is required" |
| `contact_name` | 1-255 chars | "Contact name is required" |

### Conditional Validation

| Condition | Required Fields | Error |
|-----------|-----------------|-------|
| type = "company" | `company_name` | "Company name required for service companies" |
| Has `license_expiry` | Valid date | "Invalid license expiry date" |
| Has `insurance_expiry` | Valid date | "Invalid insurance expiry date" |

### Business Rules

| Rule | Error Message |
|------|---------------|
| Cannot delete with active work orders | "Cannot delete contractor with active work orders" |
| Cannot deactivate with assigned work | "Reassign work orders before deactivating" |
| ABN format (if provided) | "ABN must be 11 digits" |

---

## Compliance Tracking

### License Expiry Alerts

| Days Until Expiry | Action |
|-------------------|--------|
| 60 days | Email reminder to contractor |
| 30 days | Alert to organization admin |
| 7 days | Warning on all assignments |
| Expired | Block new assignments |

### Insurance Expiry Alerts

| Days Until Expiry | Action |
|-------------------|--------|
| 60 days | Email reminder to contractor |
| 30 days | Alert to organization admin |
| 7 days | Warning on all assignments |
| Expired | Block new assignments |

---

## API Operations

### Create Contractor

```http
POST /api/v1/contractors
Authorization: Bearer {token}
Content-Type: application/json

{
  "contractor_type": "company",
  "company_name": "ABC Lifts Pty Ltd",
  "contact_name": "Service Manager",
  "email": "service@abclifts.com.au",
  "phone": "1300 123 456",
  "trade_types": ["lifts_escalators"],
  "hourly_rate": 95.00,
  "callout_fee": 85.00
}
```

### Invite Contractor

```http
POST /api/v1/contractors/invite
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "john@contractor.com.au",
  "contact_name": "John Smith",
  "contractor_type": "independent",
  "message": "We'd like to add you as a service provider."
}
```

### Update Contractor

```http
PATCH /api/v1/contractors/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "hourly_rate": 100.00,
  "is_preferred": true
}
```

### Deactivate Contractor

```http
POST /api/v1/contractors/{id}/deactivate
Authorization: Bearer {token}
```

---

## Related Documents

- [User Profiles](05-user-profiles.md) — User accounts
- [Work Order Profiles](11-work-order-profiles.md) — Work order assignment
- [Permissions Matrix](08-permissions-matrix.md) — Contractor permissions
- [Creation Flows](07-creation-flows.md) — Inviting contractors

---

**[← Previous: Work Order Profiles](11-work-order-profiles.md)** | **[Next: Parts & Inventory Profiles →](13-parts-inventory-profiles.md)**
