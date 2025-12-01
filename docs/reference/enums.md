<!--
---
title: Enums & Constants Reference
description: All enumeration values and status codes used in SiteSync
version: 3.0.0
last_updated: 2025-12
status: stable
audience: developer, ai_assistant
related_docs:
  - /docs/reference/data-model.md (schema definitions)
  - /docs/reference/api.md (API usage)
---
-->

# Enums & Constants Reference

> All enumeration values used in SiteSync

## Overview

This reference lists all enum values used throughout the SiteSync platform. Use these values when working with the API or database.

---

## Trade Types

Equipment category classification.

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

| Value | Display Name | Description |
|-------|--------------|-------------|
| `lifts_escalators` | Lifts & Escalators | Vertical transportation |
| `hvac` | HVAC | Heating, ventilation, air conditioning |
| `electrical` | Electrical | Power distribution, lighting |
| `plumbing` | Plumbing | Water systems, drainage |
| `fire_systems` | Fire Systems | Detection, suppression, alarms |
| `security` | Security | Access control, CCTV |
| `building_fabric` | Building Fabric | Structural, roofing, facades |
| `generators` | Generators | Backup power systems |
| `bms` | BMS | Building management systems |
| `solar_renewables` | Solar & Renewables | Solar panels, batteries |
| `pools_gyms` | Pools & Gyms | Recreational facilities |
| `parking` | Parking | Parking systems, gates |

---

## Asset Status

Current operational state of equipment.

```python
asset_status = [
    "operational",
    "degraded",
    "out_of_service",
    "maintenance",
    "decommissioned",
]
```

| Value | Display Name | Meaning |
|-------|--------------|---------|
| `operational` | Operational | Running normally |
| `degraded` | Degraded | Running with known issues |
| `out_of_service` | Out of Service | Not running, needs repair |
| `maintenance` | Under Maintenance | Scheduled maintenance in progress |
| `decommissioned` | Decommissioned | No longer in use |

---

## Work Order Types

Classification of work to be done.

```python
work_order_types = [
    "breakdown",
    "preventive",
    "inspection",
    "installation",
    "callback",
    "modification",
    "consultation",
]
```

| Value | Display Name | Use For |
|-------|--------------|---------|
| `breakdown` | Breakdown | Equipment failure, fault |
| `preventive` | Preventive | Scheduled maintenance |
| `inspection` | Inspection | Safety/compliance inspection |
| `installation` | Installation | New equipment |
| `callback` | Callback | Return visit for prior issue |
| `modification` | Modification | Equipment changes/upgrades |
| `consultation` | Consultation | Assessment, quotes |

---

## Work Order Priority

Urgency and response expectation.

```python
work_order_priority = [
    "emergency",
    "high",
    "medium",
    "low",
    "scheduled",
]
```

| Value | Display Name | Expected Response | SLA |
|-------|--------------|-------------------|-----|
| `emergency` | Emergency | Immediate | 1-4 hours |
| `high` | High | Same day | 24 hours |
| `medium` | Medium | Prompt | 48 hours |
| `low` | Low | When convenient | 1 week |
| `scheduled` | Scheduled | Planned date | As scheduled |

---

## Work Order Status

Lifecycle state of a work order.

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

| Value | Display Name | Meaning |
|-------|--------------|---------|
| `draft` | Draft | Created but not submitted |
| `pending` | Pending | Awaiting assignment |
| `scheduled` | Scheduled | Assigned with date/time |
| `in_progress` | In Progress | Technician actively working |
| `on_hold` | On Hold | Paused (parts, access, etc.) |
| `completed` | Completed | Work finished |
| `cancelled` | Cancelled | No longer needed |
| `invoiced` | Invoiced | Billing processed |

### Status Transitions

```
draft → pending → scheduled → in_progress → completed → invoiced
                     ↓              ↓
                  on_hold ←────────┘
                     ↓
                 cancelled
```

---

## Subscription Tiers

Organization subscription levels.

```python
subscription_tiers = [
    "free",
    "pro",
    "expert",
    "enterprise",
]
```

| Value | Display Name | Assets | Users |
|-------|--------------|--------|-------|
| `free` | Free | 5 | 2 |
| `pro` | Pro | 50 | 10 |
| `expert` | Expert | Unlimited | 50 |
| `enterprise` | Enterprise | Unlimited | Unlimited |

---

## User Roles

Permission levels within an organization.

```python
user_roles = [
    "owner",
    "admin",
    "manager",
    "technician",
    "viewer",
]
```

| Value | Display Name | Permissions |
|-------|--------------|-------------|
| `owner` | Owner | Full control, billing |
| `admin` | Admin | Full control, no billing |
| `manager` | Manager | Manage sites, work orders |
| `technician` | Technician | Complete assigned work |
| `viewer` | Viewer | Read-only access |

---

## Contractor Types

Service provider classification.

```python
contractor_types = [
    "company",
    "independent",
    "internal",
]
```

| Value | Display Name | Description |
|-------|--------------|-------------|
| `company` | Service Company | Multi-technician business |
| `independent` | Independent | Solo contractor |
| `internal` | Internal | In-house maintenance staff |

---

## Health Score Ranges

Computed equipment/building health.

| Range | Label | Color | Meaning |
|-------|-------|-------|---------|
| 90-100 | Excellent | Green | Top condition |
| 75-89 | Good | Light green | Minor issues |
| 60-74 | Fair | Yellow | Attention needed |
| 40-59 | Poor | Orange | Significant issues |
| 0-39 | Critical | Red | Urgent intervention |

---

## AI Confidence Levels

Diagnosis confidence thresholds.

| Range | Label | UI Behavior |
|-------|-------|-------------|
| 95-100% | Very confident | Single suggestion |
| 80-94% | Confident | Primary + alternatives |
| 60-79% | Moderate | Multiple options |
| 0-59% | Low | Request more info |

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

| Value | Display Name | Meaning |
|-------|--------------|---------|
| `fixed` | Fixed | Repaired the issue |
| `replaced` | Replaced | Component replacement |
| `adjusted` | Adjusted | Settings/alignment change |
| `cleaned` | Cleaned | Cleaning resolved issue |
| `no_fault_found` | No Fault Found | Could not reproduce |
| `referred` | Referred | Escalated to specialist |
| `deferred` | Deferred | Scheduled for later |

---

## Related

- [Data Model](data-model.md) — Full schema reference
- [API Reference](api.md) — Using enums in API calls
- [Quick Reference](quick-reference.md) — Common patterns

---

**[← Back to Reference](../README.md)**
