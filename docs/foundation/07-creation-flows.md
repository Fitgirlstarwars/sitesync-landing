# SiteSync V3 - Creation Flows

> **Step-by-Step Entity Creation** - How managers and trades create buildings, users, and assets.

---

## Creation Order Dependencies

Entities must be created in this order due to foreign key relationships:

```
1. ORGANIZATION ─────────────────────────────────────────► First (root)
   │
   ├──► 2a. USERS ───────────────────────────────────────► Parallel
   │
   ├──► 2b. SITES (Buildings) ───────────────────────────► Parallel
   │         │
   │         └──► 3. ELEVATORS (Assets) ─────────────────► After Site
   │                   │
   │                   └──► 4. WORK ORDERS ──────────────► After Elevator
   │
   ├──► 2c. CONTRACTORS ─────────────────────────────────► Parallel
   │
   └──► 2d. INVENTORY ITEMS ─────────────────────────────► Parallel
             │
             └──► 3. STOCK LOCATIONS ────────────────────► After Inventory
```

---

## 1. System Bootstrap Flow

### First Organization + Admin User

When the system starts or a new organization signs up:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM BOOTSTRAP                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User visits sitesync.com/signup                              │
│                                                                  │
│  2. Enters company details:                                      │
│     ├── Company name: "Collins Lift Services"                   │
│     ├── Slug: "collins-lift"                                    │
│     └── Admin email: "admin@collinslift.com.au"                 │
│                                                                  │
│  3. System creates:                                              │
│     ├── Organization (subscription_tier: 'free')                │
│     └── User (role: 'owner', email_verified: false)             │
│                                                                  │
│  4. Verification email sent                                      │
│                                                                  │
│  5. User clicks verification link                                │
│     └── email_verified: true                                    │
│                                                                  │
│  6. User sets password                                           │
│                                                                  │
│  7. Redirected to onboarding wizard                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### API Flow

```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "company_name": "Collins Lift Services",
  "slug": "collins-lift",
  "email": "admin@collinslift.com.au",
  "password": "SecurePassword123!"
}
```

**Response** (201 Created):
```json
{
  "organization": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Collins Lift Services",
    "slug": "collins-lift",
    "subscription_tier": "free"
  },
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "admin@collinslift.com.au",
    "role": "owner",
    "email_verified": false
  },
  "message": "Verification email sent"
}
```

---

## 2. Manager Creates Building/Site

### Prerequisites
- User is authenticated
- User has role: `owner`, `admin`, or `manager`
- User has permission: `sites:create`

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CREATE BUILDING                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Manager clicks "Add Building"                           │
│                                                                  │
│  Step 2: Enters building details                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Building Name: [Collins Place Tower 1          ]        │    │
│  │ Building Code: [COL-T1                        ] (opt)   │    │
│  │ Building Type: [Commercial                    ▼]        │    │
│  │                                                         │    │
│  │ Street Address: [55 Collins Street            ]         │    │
│  │ City:          [Melbourne                     ]         │    │
│  │ State:         [VIC                          ▼]         │    │
│  │ Postal Code:   [3000                          ]         │    │
│  │                                                         │    │
│  │ Primary Contact: [John Smith                  ]         │    │
│  │ Contact Phone:   [+61 3 9555 1234            ]         │    │
│  │ Contact Email:   [john@collinsplace.com      ]         │    │
│  │                                                         │    │
│  │ Number of Floors: [45                         ]         │    │
│  │                                                         │    │
│  │              [Cancel]  [Create Building]                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Step 3: System validates input                                  │
│  ├── Name is required ✓                                         │
│  ├── Code is unique per org ✓                                   │
│  └── Email format valid ✓                                       │
│                                                                  │
│  Step 4: System creates Site record                              │
│  ├── organization_id: (from auth context)                       │
│  ├── timezone: (default from org settings)                      │
│  └── health_score: null (computed later)                        │
│                                                                  │
│  Step 5: Audit event logged                                      │
│  └── 'site_created' with full details                           │
│                                                                  │
│  Step 6: Redirect to building detail page                        │
│  └── Prompt to add elevators                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### API Flow

```http
POST /api/v1/sites
Authorization: Bearer {token}
Content-Type: application/json

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
  "primary_contact_email": "john@collinsplace.com.au",
  "floors_count": 45
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
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
  "floors_count": 45,
  "health_score": null,
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

### Validation Errors

```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "field required",
      "type": "value_error.missing"
    },
    {
      "loc": ["body", "code"],
      "msg": "Site code 'COL-T1' already exists",
      "type": "value_error.unique"
    }
  ]
}
```

---

## 3. Manager/Trade Creates Asset (Elevator)

### Prerequisites
- User is authenticated
- User has role: `owner`, `admin`, `manager`, or `user`
- User has permission: `assets:create`
- Target Site exists

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CREATE ELEVATOR                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Manager navigates to site "Collins Place Tower 1"       │
│                                                                  │
│  Step 2: Clicks "Add Elevator"                                   │
│                                                                  │
│  Step 3: Choice presented:                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  How would you like to add this elevator?               │    │
│  │                                                         │    │
│  │  [📷 Smart Capture]     [📝 Manual Entry]              │    │
│  │                                                         │    │
│  │  Take a photo of the    Enter details manually          │    │
│  │  nameplate and we'll                                   │    │
│  │  extract the details                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Step 4a: SMART CAPTURE (optional)                               │
│  ├── User takes photo of nameplate                              │
│  ├── AI extracts: manufacturer, model, serial, capacity         │
│  └── Pre-fills form with extracted data                         │
│                                                                  │
│  Step 4b: MANUAL ENTRY                                           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Unit Number: [Lift 1                     ] (required)   │    │
│  │                                                         │    │
│  │ ── Equipment Details ──────────────────────────────     │    │
│  │ Manufacturer: [KONE                      ▼]             │    │
│  │ Model:        [MonoSpace 500              ]             │    │
│  │ Serial Number:[KM-2015-78234              ]             │    │
│  │ Registration: [EL-VIC-12345               ]             │    │
│  │                                                         │    │
│  │ ── Specifications ─────────────────────────────────     │    │
│  │ Capacity (kg):    [1000                   ]             │    │
│  │ Speed (m/s):      [1.6                    ]             │    │
│  │ Floors Served:    [12                     ]             │    │
│  │ Drive Type:       [Gearless              ▼]             │    │
│  │ Door Type:        [Center Opening        ▼]             │    │
│  │                                                         │    │
│  │ Installation Date:[15/06/2015            📅]            │    │
│  │                                                         │    │
│  │              [Cancel]  [Create Elevator]                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Step 5: System validates input                                  │
│  ├── Unit number required ✓                                     │
│  ├── Unit number unique per site ✓                              │
│  └── Capacity is positive ✓                                     │
│                                                                  │
│  Step 6: System creates Elevator record                          │
│  ├── organization_id: (from auth context)                       │
│  ├── site_id: (from URL/selection)                              │
│  ├── status: 'operational' (default)                            │
│  └── health_score: null (computed after first work order)       │
│                                                                  │
│  Step 7: Audit event logged                                      │
│                                                                  │
│  Step 8: Site health score recalculated                          │
│                                                                  │
│  Step 9: Prompt to add another elevator or create work order     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### API Flow

```http
POST /api/v1/elevators
Authorization: Bearer {token}
Content-Type: application/json

{
  "site_id": "550e8400-e29b-41d4-a716-446655440002",
  "unit_number": "Lift 1",
  "serial_number": "KM-2015-78234",
  "registration_number": "EL-VIC-12345",
  "manufacturer": "KONE",
  "model": "MonoSpace 500",
  "controller_type": "KCM",
  "drive_type": "gearless",
  "capacity_kg": 1000,
  "speed_mps": 1.6,
  "floors_served": 12,
  "door_type": "center_opening",
  "installation_date": "2015-06-15"
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "site_id": "550e8400-e29b-41d4-a716-446655440002",
  "unit_number": "Lift 1",
  "serial_number": "KM-2015-78234",
  "registration_number": "EL-VIC-12345",
  "manufacturer": "KONE",
  "model": "MonoSpace 500",
  "controller_type": "KCM",
  "drive_type": "gearless",
  "capacity_kg": 1000,
  "speed_mps": 1.6,
  "floors_served": 12,
  "door_type": "center_opening",
  "installation_date": "2015-06-15",
  "status": "operational",
  "status_changed_at": "2024-12-01T10:00:00Z",
  "health_score": null,
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

---

## 4. Manager Creates User

### Prerequisites
- User is authenticated
- User has role: `owner` or `admin`
- User has permission: `users:manage`

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CREATE USER                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Admin goes to Settings > Users > Add User               │
│                                                                  │
│  Step 2: Enters user details                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Email:       [john.tech@collinslift.com   ] (required)  │    │
│  │                                                         │    │
│  │ First Name:  [John                        ]             │    │
│  │ Last Name:   [Smith                       ]             │    │
│  │ Phone:       [+61 400 123 456             ]             │    │
│  │                                                         │    │
│  │ Role:        [Technician                 ▼]             │    │
│  │                                                         │    │
│  │ ☑ Send invitation email                                 │    │
│  │                                                         │    │
│  │              [Cancel]  [Create User]                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Step 3: System validates                                        │
│  ├── Email required ✓                                           │
│  ├── Email unique in org ✓                                      │
│  └── Role valid ✓                                               │
│                                                                  │
│  Step 4: System creates User record                              │
│  ├── organization_id: (from auth context)                       │
│  ├── password_hash: (temporary random)                          │
│  ├── email_verified: false                                      │
│  └── is_active: true                                            │
│                                                                  │
│  Step 5: Invitation email sent                                   │
│  └── Contains password reset link                               │
│                                                                  │
│  Step 6: User clicks link, sets password                         │
│  └── email_verified: true                                       │
│                                                                  │
│  Step 7: User can now log in                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### API Flow

```http
POST /api/v1/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "john.tech@collinslift.com.au",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+61 400 123 456",
  "role": "technician",
  "send_invitation": true
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.tech@collinslift.com.au",
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+61 400 123 456",
  "role": "technician",
  "user_type": "technician",
  "email_verified": false,
  "is_active": true,
  "invitation_sent_at": "2024-12-01T10:00:00Z",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

---

## 5. Manager Creates Work Order

### Prerequisites
- User is authenticated
- User has permission: `work_orders:create`
- Target Elevator exists

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CREATE WORK ORDER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Manager clicks "Report Issue" or "Create Work Order"    │
│                                                                  │
│  Step 2: Selects building and elevator                           │
│  ├── Building: Collins Place Tower 1                            │
│  └── Elevator: Lift 1                                           │
│                                                                  │
│  Step 3: Enters work order details                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Type:     [Breakdown                     ▼] (required)  │    │
│  │ Priority: [High                          ▼]             │    │
│  │                                                         │    │
│  │ Title:    [Door not closing properly      ] (required)  │    │
│  │                                                         │    │
│  │ Description:                                            │    │
│  │ ┌───────────────────────────────────────────────────┐   │    │
│  │ │ Lift 1 door on level 5 is not closing fully.     │   │    │
│  │ │ Making scraping noise. Started this morning.     │   │    │
│  │ └───────────────────────────────────────────────────┘   │    │
│  │                                                         │    │
│  │ Affected Floors: [5                       ]             │    │
│  │                                                         │    │
│  │ ☑ Request AI Diagnosis                                  │    │
│  │                                                         │    │
│  │              [Cancel]  [Create Work Order]              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Step 4: System generates work order number                      │
│  └── Format: WO-{YEAR}-{SEQUENCE} → "WO-2024-001234"            │
│                                                                  │
│  Step 5: If AI requested, Triforce diagnosis runs                │
│  ├── Analyzes symptoms                                          │
│  ├── Checks equipment history                                   │
│  └── Returns suggested causes and parts                         │
│                                                                  │
│  Step 6: Work Order created with status 'pending'                │
│                                                                  │
│  Step 7: Elevator status may change                              │
│  └── If breakdown: status → 'out_of_service' or 'degraded'      │
│                                                                  │
│  Step 8: Option to assign contractor immediately                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### API Flow

```http
POST /api/v1/work-orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "elevator_id": "550e8400-e29b-41d4-a716-446655440003",
  "type": "breakdown",
  "priority": "high",
  "title": "Door not closing properly",
  "description": "Lift 1 door on level 5 is not closing fully. Making scraping noise. Started this morning.",
  "affected_floors": [5],
  "request_ai_diagnosis": true
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "elevator_id": "550e8400-e29b-41d4-a716-446655440003",
  "site_id": "550e8400-e29b-41d4-a716-446655440002",
  "work_order_number": "WO-2024-001234",
  "type": "breakdown",
  "priority": "high",
  "status": "pending",
  "title": "Door not closing properly",
  "description": "Lift 1 door on level 5 is not closing fully...",
  "affected_floors": [5],
  "reported_at": "2024-12-01T10:00:00Z",
  "ai_diagnosis_id": "550e8400-e29b-41d4-a716-446655440010",
  "ai_suggested_causes": [
    "Door operator misalignment",
    "Worn door rollers",
    "Debris in door track"
  ],
  "ai_suggested_parts": [
    "Door roller assembly",
    "Door guide shoe"
  ],
  "ai_confidence": 0.85,
  "created_by": "550e8400-e29b-41d4-a716-446655440001",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

---

## 6. Inviting Contractors

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    INVITE CONTRACTOR                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Step 1: Manager goes to Contractors > Add Contractor            │
│                                                                  │
│  Step 2: Enters contractor details                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Contractor Type: [Company                  ▼]           │    │
│  │                                                         │    │
│  │ Company Name:    [Smith Elevator Services   ]           │    │
│  │ Contact Name:    [Bob Smith                ] (required) │    │
│  │ Email:           [bob@smithelevator.com.au ]            │    │
│  │ Phone:           [+61 400 987 654          ]            │    │
│  │                                                         │    │
│  │ ABN:             [98 765 432 109           ]            │    │
│  │ License Number:  [EL-12345                 ]            │    │
│  │                                                         │    │
│  │ Specializations: ☑ KONE  ☑ Otis  ☐ Schindler          │    │
│  │                                                         │    │
│  │ Hourly Rate:     [$95.00                   ]            │    │
│  │ Callout Fee:     [$150.00                  ]            │    │
│  │                                                         │    │
│  │ ☑ Send invitation to contractor portal                  │    │
│  │                                                         │    │
│  │              [Cancel]  [Add Contractor]                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Step 3: Contractor record created                               │
│  ├── is_active: true                                            │
│  └── is_preferred: false                                        │
│                                                                  │
│  Step 4: If invitation sent:                                     │
│  ├── Email with portal invitation sent                          │
│  └── Contractor creates portal account                          │
│                                                                  │
│  Step 5: Contractor can now be assigned to work orders           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Common Creation Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `401 Unauthorized` | Invalid/expired token | Re-authenticate |
| `403 Forbidden` | Insufficient permissions | Contact admin for access |
| `404 Not Found` | Parent entity doesn't exist | Create parent first |
| `409 Conflict` | Duplicate entry | Use different identifier |
| `422 Validation Error` | Invalid data | Fix validation errors |

### Error Response Format

```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "Human-readable error message",
      "type": "error_type"
    }
  ]
}
```

---

## Post-Creation Actions

### Automatic Actions After Entity Creation

| Entity | Automatic Actions |
|--------|-------------------|
| **Organization** | Create audit event, send welcome email |
| **Site** | Create audit event, initialize health score |
| **Elevator** | Create audit event, recalculate site health |
| **User** | Create audit event, send invitation email |
| **Work Order** | Create audit event, update elevator status, notify assigned |
| **Contractor** | Create audit event, send portal invitation |

---

## Quick Reference

### Minimum Data Required

| Entity | Required Fields |
|--------|-----------------|
| Organization | `name`, `slug` |
| Site | `name` |
| Elevator | `site_id`, `unit_number` |
| User | `email` |
| Work Order | `elevator_id`, `type`, `title` |
| Contractor | `contact_name`, `contractor_type` |

---

**[← Previous: Asset Profiles](06-asset-profiles.md)** | **[Next: Permissions Matrix →](08-permissions-matrix.md)**
