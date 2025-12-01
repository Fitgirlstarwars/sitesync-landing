# SiteSync V3 - Work Order Profiles

> **Entity Definition** - Complete specification for work orders, the core transactional entity of the CMMS.

---

## What is a Work Order?

A **Work Order** is a record of work to be performed on an asset. It tracks the complete lifecycle from initial report through completion, invoicing, and historical reference.

Work orders are the **primary transactional entity** in SiteSync - every maintenance activity flows through a work order.

### Key Characteristics

| Aspect | Description |
|--------|-------------|
| **Purpose** | Track, assign, and complete maintenance work |
| **Scope** | Single asset, single job (may have multiple tasks) |
| **Lifecycle** | Draft → Pending → Scheduled → In Progress → Completed → Invoiced |
| **Ownership** | Belongs to organization, linked to site and asset |
| **Visibility** | Organization users + assigned contractor |

---

## Work Order Types

Every work order has a type that determines its nature and workflow.

```python
work_order_type = [
    "breakdown",
    "preventive",
    "inspection",
    "installation",
    "modernization",
    "callback",
    "audit",
]
```

### Type Definitions

| Type | Code | Description | Typical Priority | SLA |
|------|------|-------------|------------------|-----|
| **Breakdown** | `breakdown` | Equipment has failed or is malfunctioning | Emergency/High | 1-24 hours |
| **Preventive** | `preventive` | Scheduled routine maintenance | Scheduled | As scheduled |
| **Inspection** | `inspection` | Safety or compliance inspection | Scheduled/Medium | As scheduled |
| **Installation** | `installation` | New equipment being installed | Scheduled | Project-based |
| **Modernization** | `modernization` | Equipment upgrade or replacement | Scheduled | Project-based |
| **Callback** | `callback` | Return visit for previous issue | High | 24-48 hours |
| **Audit** | `audit` | Third-party audit or review | Scheduled | As scheduled |

### Type Selection Guide

```
Equipment stopped working?
├── Yes → breakdown
└── No, but...
    ├── Issue from previous repair → callback
    ├── Scheduled maintenance → preventive
    ├── Required inspection → inspection
    ├── Installing new equipment → installation
    ├── Upgrading equipment → modernization
    └── Third-party review → audit
```

---

## Work Order Priority

Priority determines response expectations and SLA tracking.

```python
work_order_priority = [
    "emergency",
    "high",
    "medium",
    "low",
    "scheduled",
]
```

### Priority Definitions

| Priority | Code | Response Time | Use When |
|----------|------|---------------|----------|
| **Emergency** | `emergency` | Immediate (1-4 hours) | Safety hazard, entrapment, fire, flood |
| **High** | `high` | Same day (24 hours) | Equipment down, significant impact |
| **Medium** | `medium` | 48 hours | Degraded operation, minor issues |
| **Low** | `low` | 1 week | Cosmetic, non-urgent improvements |
| **Scheduled** | `scheduled` | Planned date | PM, inspections, planned work |

### Priority Selection Matrix

| Impact | Safety Risk | Priority |
|--------|-------------|----------|
| Equipment down | Yes | Emergency |
| Equipment down | No | High |
| Degraded service | Yes | High |
| Degraded service | No | Medium |
| Minor inconvenience | No | Low |
| No current impact | No | Scheduled |

---

## Work Order Status

Status tracks where a work order is in its lifecycle.

```python
work_order_status = [
    "draft",
    "pending",
    "scheduled",
    "in_progress",
    "on_hold",
    "completed",
    "cancelled",
    "invoiced",
]
```

### Status Definitions

| Status | Code | Description | Editable Fields |
|--------|------|-------------|-----------------|
| **Draft** | `draft` | Created but not submitted | All fields |
| **Pending** | `pending` | Awaiting assignment | Assignment, schedule |
| **Scheduled** | `scheduled` | Assigned with date/time | Schedule, notes |
| **In Progress** | `in_progress` | Technician actively working | Work details, costs |
| **On Hold** | `on_hold` | Paused (waiting for parts, access, etc.) | Hold reason |
| **Completed** | `completed` | Work finished | Resolution only |
| **Cancelled** | `cancelled` | No longer needed | None (locked) |
| **Invoiced** | `invoiced` | Billing processed | None (locked) |

### Status Flow Diagram

```
                              ┌─────────────┐
                              │   draft     │
                              └──────┬──────┘
                                     │ Submit
                                     ▼
┌─────────────┐              ┌─────────────┐
│  cancelled  │◄─────────────│   pending   │
└─────────────┘    Cancel    └──────┬──────┘
      ▲                             │ Assign + Schedule
      │                             ▼
      │                      ┌─────────────┐
      │ Cancel               │  scheduled  │◄──────────┐
      │                      └──────┬──────┘           │
      │                             │ Start            │ Resume
      │                             ▼                  │
      │                      ┌─────────────┐    ┌─────────────┐
      ├──────────────────────│ in_progress │───►│   on_hold   │
      │         Cancel       └──────┬──────┘    └─────────────┘
      │                             │ Complete
      │                             ▼
      │                      ┌─────────────┐
      │                      │  completed  │────────┐
      │                      └──────┬──────┘        │ Reopen
      │                             │ Invoice       │
      │                             ▼               │
      │                      ┌─────────────┐        │
      └──────────────────────│  invoiced   │◄───────┘
                             └─────────────┘
```

---

## Profile Field Reference

### Identification Fields

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Auto | Unique identifier | System generated |
| `organization_id` | UUID | Yes | Owning organization | FK → organizations |
| `work_order_number` | string | Auto | Human-readable number | Format: WO-YYYY-NNNNNN |
| `elevator_id` | UUID | Yes | Asset being serviced | FK → elevators |
| `site_id` | UUID | Yes | Building location | FK → sites |

### Classification Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `type` | enum | Yes | - | Work order type |
| `priority` | enum | No | `medium` | Urgency level |
| `status` | enum | No | `draft` | Lifecycle status |

### Description Fields

| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| `title` | string | Yes | 255 | Short description |
| `description` | text | No | 10,000 | Detailed description |
| `fault_code` | string | No | 50 | Equipment fault code |
| `reported_symptoms` | array | No | - | List of symptoms |
| `affected_floors` | array | No | - | Affected floor numbers |

### Timing Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reported_at` | datetime | Auto | When issue was reported |
| `scheduled_start` | datetime | No | Planned start time |
| `scheduled_end` | datetime | No | Planned end time |
| `actual_start` | datetime | No | When work began |
| `actual_end` | datetime | No | When work completed |
| `due_date` | datetime | No | SLA deadline |
| `completed_at` | datetime | No | Completion timestamp |

### Assignment Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assigned_contractor_id` | UUID | Conditional | Contractor doing work |
| `assigned_at` | datetime | No | When assigned |
| `assigned_by` | UUID | No | User who assigned |

### Reporter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reporter_user_id` | UUID | No | User who reported (if logged in) |
| `reported_by_name` | string | No | Reporter name (if not logged in) |
| `reported_by_phone` | string | No | Reporter contact phone |
| `reported_by_email` | string | No | Reporter contact email |

### AI Diagnosis Fields

| Field | Type | Description |
|-------|------|-------------|
| `ai_diagnosis_id` | UUID | Reference to full diagnosis |
| `ai_suggested_causes` | array | AI-suggested root causes |
| `ai_suggested_parts` | array | AI-suggested parts needed |
| `ai_confidence` | decimal | Confidence score (0.00-1.00) |
| `ai_diagnosis_at` | datetime | When diagnosis was generated |

### Resolution Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resolution_notes` | text | For completion | What was done |
| `root_cause` | text | No | Identified cause |
| `resolution_type` | string | No | How resolved (fixed, replaced, etc.) |

### Cost Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `parts_cost` | decimal | 0 | Total parts cost |
| `labor_cost` | decimal | 0 | Total labor cost |
| `total_cost` | decimal | 0 | Calculated total |

### Relationship Fields

| Field | Type | Description |
|-------|------|-------------|
| `parent_work_order_id` | UUID | Parent work order (for callbacks) |
| `requires_followup` | boolean | Needs follow-up visit |
| `followup_notes` | text | Follow-up details |

### Metadata Fields

| Field | Type | Description |
|-------|------|-------------|
| `custom_fields` | JSONB | Organization-defined fields |
| `created_by` | UUID | User who created |
| `created_at` | datetime | Creation timestamp |
| `updated_at` | datetime | Last update timestamp |

---

## Work Order Number Generation

Work orders receive a human-readable number on creation.

### Format

```
WO-{YEAR}-{SEQUENCE}

Examples:
WO-2024-000001
WO-2024-000002
WO-2025-000001  (resets each year)
```

### Generation Rules

1. Sequence is per-organization, per-year
2. Six-digit zero-padded sequence
3. Automatically assigned on first save
4. Never reused (even if cancelled)
5. Immutable after creation

---

## Work Order Relationships

### Entity Relationships

```
Organization (1) ──────┬────── (*) Work Orders
                       │
Site (1) ──────────────┼────── (*) Work Orders
                       │
Elevator (1) ──────────┼────── (*) Work Orders
                       │
Contractor (1) ────────┼────── (*) Work Orders (assigned)
                       │
User (1) ──────────────┼────── (*) Work Orders (created_by)
                       │
User (1) ──────────────┴────── (*) Work Orders (reporter)
```

### Work Order to Work Order (Self-Reference)

```
Parent Work Order (1) ────── (*) Child Work Orders (callbacks)
```

A callback work order links to its parent:

```json
{
  "id": "callback-uuid",
  "parent_work_order_id": "original-uuid",
  "type": "callback"
}
```

### Related Entities

| Entity | Relationship | Description |
|--------|--------------|-------------|
| **Work Order Tasks** | 1:N | Individual tasks within work order |
| **Work Order Parts** | 1:N | Parts used on work order |
| **Work Order Labor** | 1:N | Labor entries |
| **Work Order Photos** | 1:N | Attached photos |
| **Work Order Documents** | 1:N | Attached documents |
| **Work Order Comments** | 1:N | Discussion/notes |
| **Diagnosis Results** | 1:1 | AI diagnosis details |

---

## Resolution Types

How a work order was resolved.

```python
resolution_types = [
    "fixed",
    "replaced",
    "adjusted",
    "cleaned",
    "no_fault_found",
    "referred",
    "deferred",
]
```

| Type | Description | Affects Health Score |
|------|-------------|---------------------|
| `fixed` | Repaired the issue | Positive |
| `replaced` | Component replacement | Positive |
| `adjusted` | Settings/alignment change | Positive |
| `cleaned` | Cleaning resolved issue | Positive |
| `no_fault_found` | Could not reproduce | Neutral |
| `referred` | Escalated to specialist | Neutral |
| `deferred` | Scheduled for later | Negative |

---

## SLA Tracking

Work orders track SLA compliance based on priority.

### Default SLA Times

| Priority | Response SLA | Resolution SLA |
|----------|--------------|----------------|
| Emergency | 1 hour | 4 hours |
| High | 4 hours | 24 hours |
| Medium | 24 hours | 48 hours |
| Low | 48 hours | 1 week |
| Scheduled | As scheduled | As scheduled |

### SLA Calculation

```
Response SLA: reported_at → actual_start
Resolution SLA: reported_at → completed_at

SLA Status:
├── Green: Within SLA
├── Yellow: < 2 hours remaining
└── Red: SLA breached
```

### SLA Breach Actions

When SLA approaches breach:
1. Notification to assigned contractor
2. Escalation to site manager
3. Dashboard highlighting
4. SLA breach recorded in metrics

---

## Work Order Templates

Common work orders can be templated.

### Template Structure

```json
{
  "template_id": "uuid",
  "name": "Monthly PM - KONE MRL",
  "type": "preventive",
  "priority": "scheduled",
  "title": "Monthly preventive maintenance",
  "description": "Monthly PM checklist for KONE MRL lifts",
  "estimated_duration_minutes": 120,
  "checklist": [
    {"task": "Check door operation", "required": true},
    {"task": "Inspect safety circuits", "required": true},
    {"task": "Clean car top and pit", "required": true},
    {"task": "Test emergency features", "required": true}
  ],
  "applies_to": {
    "manufacturer": "KONE",
    "model_pattern": "MonoSpace*"
  }
}
```

### Template Usage

1. Select template when creating work order
2. Fields pre-populated from template
3. Checklist items created as tasks
4. User can modify before saving

---

## Minimum Viable Work Order

The simplest valid work order requires:

```json
{
  "elevator_id": "asset-uuid",
  "type": "breakdown",
  "title": "Lift not working"
}
```

System auto-fills:
- `organization_id` from user context
- `site_id` from elevator
- `work_order_number` generated
- `status` = "draft"
- `priority` = "medium"
- `reported_at` = now
- `created_by` = current user

---

## Complete Work Order Examples

### Example 1: Breakdown Report

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "organization_id": "org-uuid",
  "site_id": "site-uuid",
  "elevator_id": "elevator-uuid",
  "work_order_number": "WO-2024-001234",

  "type": "breakdown",
  "priority": "high",
  "status": "pending",

  "title": "Door not closing properly",
  "description": "Lift 1 door on level 5 is not closing fully. Making scraping noise. Started this morning.",
  "fault_code": "F505",
  "reported_symptoms": ["door_not_closing", "unusual_noise"],
  "affected_floors": [5],

  "reported_at": "2024-12-01T09:15:00Z",
  "due_date": "2024-12-01T17:15:00Z",

  "reporter_user_id": "user-uuid",

  "ai_diagnosis_id": "diagnosis-uuid",
  "ai_suggested_causes": ["Door zone sensor misalignment", "Door belt worn"],
  "ai_suggested_parts": ["Door zone sensor", "Door belt assembly"],
  "ai_confidence": 0.88,
  "ai_diagnosis_at": "2024-12-01T09:15:30Z",

  "created_by": "user-uuid",
  "created_at": "2024-12-01T09:15:00Z",
  "updated_at": "2024-12-01T09:15:30Z"
}
```

### Example 2: Completed PM

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "organization_id": "org-uuid",
  "site_id": "site-uuid",
  "elevator_id": "elevator-uuid",
  "work_order_number": "WO-2024-001200",

  "type": "preventive",
  "priority": "scheduled",
  "status": "completed",

  "title": "Monthly preventive maintenance",
  "description": "Monthly PM checklist for Lift 1",

  "reported_at": "2024-11-15T08:00:00Z",
  "scheduled_start": "2024-11-28T09:00:00Z",
  "scheduled_end": "2024-11-28T11:00:00Z",
  "actual_start": "2024-11-28T09:15:00Z",
  "actual_end": "2024-11-28T10:45:00Z",
  "completed_at": "2024-11-28T10:45:00Z",

  "assigned_contractor_id": "contractor-uuid",
  "assigned_at": "2024-11-15T08:30:00Z",
  "assigned_by": "manager-uuid",

  "resolution_notes": "Completed monthly PM. All checks passed. Door belt showing wear - recommend replacement within 3 months.",
  "root_cause": null,
  "resolution_type": "fixed",

  "parts_cost": 0.00,
  "labor_cost": 187.50,
  "total_cost": 187.50,

  "requires_followup": true,
  "followup_notes": "Door belt replacement needed within 3 months",

  "created_by": "system-uuid",
  "created_at": "2024-11-15T08:00:00Z",
  "updated_at": "2024-11-28T10:45:00Z"
}
```

### Example 3: Callback

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "organization_id": "org-uuid",
  "site_id": "site-uuid",
  "elevator_id": "elevator-uuid",
  "work_order_number": "WO-2024-001250",

  "type": "callback",
  "priority": "high",
  "status": "in_progress",

  "title": "Door issue recurring (callback)",
  "description": "Same door noise returned 3 days after original repair. Customer reports identical symptoms.",

  "parent_work_order_id": "550e8400-e29b-41d4-a716-446655440001",

  "reported_at": "2024-12-04T14:00:00Z",
  "scheduled_start": "2024-12-04T16:00:00Z",
  "actual_start": "2024-12-04T16:30:00Z",

  "assigned_contractor_id": "contractor-uuid",
  "assigned_at": "2024-12-04T14:05:00Z",

  "ai_diagnosis_id": "diagnosis-uuid-2",
  "ai_suggested_causes": ["Belt tensioner also needs replacement"],
  "ai_confidence": 0.82,

  "created_by": "manager-uuid",
  "created_at": "2024-12-04T14:00:00Z",
  "updated_at": "2024-12-04T16:30:00Z"
}
```

---

## Validation Rules

### Required Field Validation

| Field | Rule | Error Message |
|-------|------|---------------|
| `elevator_id` | Must exist | "Elevator not found" |
| `type` | Valid enum | "Work order type is required" |
| `title` | 1-255 chars | "Title is required (1-255 characters)" |

### Conditional Validation

| Transition | Required Fields | Error Message |
|------------|-----------------|---------------|
| → `scheduled` | `assigned_contractor_id` | "Contractor must be assigned" |
| → `completed` | `resolution_notes` | "Resolution notes required" |
| → `cancelled` | Status reason | "Cancellation reason required" |
| → `on_hold` | Status reason | "Hold reason required" |

### Business Rule Validation

| Rule | Condition | Error Message |
|------|-----------|---------------|
| No future report date | `reported_at <= now` | "Report date cannot be in future" |
| Schedule after report | `scheduled_start >= reported_at` | "Cannot schedule before report" |
| End after start | `scheduled_end > scheduled_start` | "End must be after start" |
| Unique WO number | Per org unique | "Work order number exists" |

---

## API Operations

### Create Work Order

```http
POST /api/v1/work-orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "elevator_id": "uuid",
  "type": "breakdown",
  "priority": "high",
  "title": "Door not closing",
  "description": "Details...",
  "fault_code": "F505"
}
```

### Update Work Order

```http
PATCH /api/v1/work-orders/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Updated details"
}
```

### Change Status

```http
POST /api/v1/work-orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed",
  "resolution_notes": "Replaced door belt. Tested OK."
}
```

### Assign Contractor

```http
POST /api/v1/work-orders/{id}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "contractor_id": "uuid",
  "scheduled_start": "2024-12-01T14:00:00Z",
  "scheduled_end": "2024-12-01T16:00:00Z"
}
```

---

## Work Order Impact

### On Asset

| Event | Asset Impact |
|-------|--------------|
| Breakdown created (emergency) | Status → `out_of_service` |
| Breakdown created (high) | Status → `degraded` |
| Work order completed | Status may → `operational` |
| Work order completed (partial) | Status → `degraded` |

### On Building Health Score

| Event | Score Impact |
|-------|--------------|
| Open emergency work order | -10 to -20 points |
| Overdue work order | -5 per day |
| Completed on time | +5 points |
| First-time fix | +10 points |

### On Contractor Metrics

| Event | Metric Impact |
|-------|---------------|
| Completed on time | +rating, +response_time |
| Completed late | -rating |
| Callback within 7 days | -first_time_fix_rate |

---

## Related Documents

- [State Machines](09-state-machines.md) — Status transitions in detail
- [Validation Rules](10-validation-rules.md) — All validation rules
- [Permissions Matrix](08-permissions-matrix.md) — Who can do what
- [Asset Profiles](06-asset-profiles.md) — Equipment being serviced
- [Contractor Profiles](12-contractor-profiles.md) — Who does the work
- [Work Orders Tutorial](../tutorials/work-orders.md) — User guide

---

**[← Previous: Validation Rules](10-validation-rules.md)** | **[Next: Contractor Profiles →](12-contractor-profiles.md)**
