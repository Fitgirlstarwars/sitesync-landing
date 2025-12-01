<!--
---
title: SiteSync V3 API Reference
description: REST API documentation with authentication, endpoints, and error handling
version: 3.0.0
last_updated: 2025-12
status: design
implementation_status: partial
audience: developer, ai_assistant
prerequisites:
  - Understanding of REST APIs
  - JWT authentication basics
related_docs:
  - /docs/reference/data-model.md (response schemas)
  - /docs/reference/enums.md (status values)
  - /docs/GLOSSARY.md (terminology)
---
-->

# SiteSync V3 - API Reference

## REST API Documentation

> This document provides the complete API reference for SiteSync V3, including authentication, endpoints, request/response formats, and error handling.

---

## Base URL

```
Production:  https://api.sitesync.com/v1
Staging:     https://api.staging.sitesync.com/v1
Development: http://localhost:8000/v1
```

---

## Authentication

### JWT Token Authentication

All API requests require authentication via JWT bearer token.

```
Authorization: Bearer <access_token>
```

### Authentication Endpoints

#### Login

```http
POST /auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "secure_password"
}
```

**Response (200 OK):**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 900,
    "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Smith",
        "organization_id": "550e8400-e29b-41d4-a716-446655440001",
        "role": "admin"
    }
}
```

#### Refresh Token

```http
POST /auth/refresh
Content-Type: application/json

{
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900
}
```

#### Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

---

## API Conventions

### Request Format

- All request bodies use JSON (`Content-Type: application/json`)
- UUIDs are used for all resource identifiers
- Dates use ISO 8601 format (`YYYY-MM-DD`)
- Timestamps use ISO 8601 with timezone (`YYYY-MM-DDTHH:MM:SSZ`)

### Response Format

All responses follow this structure:

**Success Response:**
```json
{
    "data": { ... },
    "meta": {
        "request_id": "req_abc123",
        "timestamp": "2024-12-15T10:30:00Z"
    }
}
```

**List Response:**
```json
{
    "data": [ ... ],
    "meta": {
        "total": 100,
        "page": 1,
        "per_page": 20,
        "total_pages": 5
    }
}
```

**Error Response:**
```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            {
                "field": "email",
                "message": "Invalid email format"
            }
        ]
    },
    "meta": {
        "request_id": "req_abc123",
        "timestamp": "2024-12-15T10:30:00Z"
    }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Rate Limited |
| 500 | Server Error |

### Pagination

List endpoints support pagination:

```
GET /sites?page=1&per_page=20
```

### Filtering

List endpoints support filtering:

```
GET /work-orders?status=in_progress&priority=high
```

### Sorting

List endpoints support sorting:

```
GET /work-orders?sort=-created_at,priority
```

---

## Organizations

### Get Current Organization

```http
GET /organizations/me
Authorization: Bearer <token>
```

**Response:**
```json
{
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Acme Building Management",
        "slug": "acme-bm",
        "subscription_tier": "pro",
        "settings": {
            "timezone": "Australia/Sydney",
            "currency": "AUD"
        },
        "created_at": "2024-01-15T00:00:00Z"
    }
}
```

### Update Organization Settings

```http
PATCH /organizations/me
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Acme Building Management Pty Ltd",
    "settings": {
        "timezone": "Australia/Melbourne"
    }
}
```

---

## Sites

### List Sites

```http
GET /sites
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| per_page | integer | Items per page (default: 20, max: 100) |
| search | string | Search in name, address |
| city | string | Filter by city |

**Response:**
```json
{
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440010",
            "name": "123 Collins Street",
            "code": "COL-123",
            "address_line1": "123 Collins Street",
            "city": "Melbourne",
            "state": "VIC",
            "postal_code": "3000",
            "health_score": 91,
            "elevator_count": 4,
            "open_work_orders": 1,
            "created_at": "2024-01-15T00:00:00Z"
        }
    ],
    "meta": {
        "total": 45,
        "page": 1,
        "per_page": 20,
        "total_pages": 3
    }
}
```

### Create Site

```http
POST /sites
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "456 Queen Street",
    "code": "QUE-456",
    "address_line1": "456 Queen Street",
    "city": "Brisbane",
    "state": "QLD",
    "postal_code": "4000",
    "timezone": "Australia/Brisbane",
    "primary_contact_name": "Jane Smith",
    "primary_contact_phone": "+61 7 1234 5678",
    "primary_contact_email": "jane@example.com"
}
```

**Response (201 Created):**
```json
{
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440011",
        "name": "456 Queen Street",
        ...
    }
}
```

### Get Site

```http
GET /sites/{site_id}
Authorization: Bearer <token>
```

### Update Site

```http
PATCH /sites/{site_id}
Authorization: Bearer <token>
Content-Type: application/json

{
    "primary_contact_name": "John Doe"
}
```

### Delete Site

```http
DELETE /sites/{site_id}
Authorization: Bearer <token>
```

**Response (204 No Content)**

### Get Site Health Score

```http
GET /sites/{site_id}/health
Authorization: Bearer <token>
```

**Response:**
```json
{
    "data": {
        "site_id": "550e8400-e29b-41d4-a716-446655440010",
        "health_score": 91,
        "breakdown": {
            "equipment_condition": 94,
            "maintenance_compliance": 88,
            "incident_frequency": 95,
            "first_time_fix_rate": 92,
            "predictive_risk": 87
        },
        "trend": "+7 from last month",
        "percentile": "Top 15% of similar buildings",
        "recommendations": [
            "Schedule HVAC filter replacement",
            "Lift 2 door operator showing wear"
        ],
        "calculated_at": "2024-12-15T00:00:00Z"
    }
}
```

---

## Elevators

### List Elevators

```http
GET /elevators
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| site_id | uuid | Filter by site |
| manufacturer | string | Filter by manufacturer |
| status | string | Filter by status |
| search | string | Search in unit number, serial |

### Create Elevator

```http
POST /elevators
Authorization: Bearer <token>
Content-Type: application/json

{
    "site_id": "550e8400-e29b-41d4-a716-446655440010",
    "unit_number": "Lift 1",
    "serial_number": "KM-2015-78234",
    "registration_number": "EL-VIC-12345",
    "manufacturer": "KONE",
    "model": "MonoSpace 500",
    "controller_type": "KCM",
    "drive_type": "EcoDisc",
    "capacity_kg": 1000,
    "speed_mps": 1.6,
    "floors_served": 12,
    "installation_date": "2015-06-15"
}
```

### Get Elevator

```http
GET /elevators/{elevator_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "site_id": "550e8400-e29b-41d4-a716-446655440010",
        "unit_number": "Lift 1",
        "serial_number": "KM-2015-78234",
        "manufacturer": "KONE",
        "model": "MonoSpace 500",
        "status": "operational",
        "health_score": 92,
        "last_inspection_date": "2024-09-14",
        "next_inspection_due": "2025-09-14",
        "known_quirks": [
            "Humidity sensitive - F505 may be false alarm on humid days"
        ],
        "specifications": {
            "capacity_kg": 1000,
            "speed_mps": 1.6,
            "floors_served": 12
        },
        "site": {
            "id": "550e8400-e29b-41d4-a716-446655440010",
            "name": "123 Collins Street"
        }
    }
}
```

### Get Elevator History

```http
GET /elevators/{elevator_id}/history
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| start_date | date | History start date |
| end_date | date | History end date |
| event_type | string | Filter by event type |

**Response:**
```json
{
    "data": [
        {
            "date": "2024-12-15T10:30:00Z",
            "event_type": "work_order_completed",
            "title": "Preventive maintenance",
            "description": "Routine service, all checks passed",
            "contractor": "Summit Elevator Services",
            "technician": "Maria S.",
            "work_order_id": "550e8400-e29b-41d4-a716-446655440030"
        },
        {
            "date": "2024-11-22T14:15:00Z",
            "event_type": "work_order_completed",
            "title": "Callback - Door hesitation",
            "description": "Adjusted door operator timing",
            "contractor": "Summit Elevator Services",
            "technician": "James T.",
            "parts_used": [],
            "resolution_time_minutes": 45
        }
    ],
    "meta": {
        "total": 112,
        "page": 1,
        "per_page": 20
    }
}
```

### Update Elevator Status

```http
PATCH /elevators/{elevator_id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
    "status": "out_of_service",
    "reason": "Door fault - awaiting parts"
}
```

---

## Work Orders

### List Work Orders

```http
GET /work-orders
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| site_id | uuid | Filter by site |
| elevator_id | uuid | Filter by elevator |
| status | string | Filter by status |
| priority | string | Filter by priority |
| type | string | Filter by type |
| contractor_id | uuid | Filter by assigned contractor |
| from_date | date | From reported date |
| to_date | date | To reported date |

### Create Work Order

```http
POST /work-orders
Authorization: Bearer <token>
Content-Type: application/json

{
    "elevator_id": "550e8400-e29b-41d4-a716-446655440020",
    "type": "breakdown",
    "priority": "high",
    "title": "Door not closing properly",
    "description": "Reported by tenant - door takes multiple attempts to close",
    "fault_code": "F505",
    "reported_symptoms": [
        "Door hesitates before closing",
        "Sometimes requires 2-3 attempts",
        "No unusual sounds"
    ],
    "reported_by_name": "John Tenant",
    "reported_by_phone": "+61 412 345 678"
}
```

**Response (201 Created):**
```json
{
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440030",
        "work_order_number": "WO-2024-001234",
        "elevator_id": "550e8400-e29b-41d4-a716-446655440020",
        "type": "breakdown",
        "priority": "high",
        "status": "pending",
        "title": "Door not closing properly",
        "ai_suggested_causes": [
            "Door zone sensor fault",
            "Door operator timing",
            "Obstruction in door track"
        ],
        "ai_confidence": 0.85,
        "created_at": "2024-12-15T10:30:00Z"
    }
}
```

### Get Work Order

```http
GET /work-orders/{work_order_id}
Authorization: Bearer <token>
```

### Update Work Order

```http
PATCH /work-orders/{work_order_id}
Authorization: Bearer <token>
Content-Type: application/json

{
    "priority": "medium",
    "description": "Updated: Issue is intermittent"
}
```

### Assign Work Order

```http
POST /work-orders/{work_order_id}/assign
Authorization: Bearer <token>
Content-Type: application/json

{
    "contractor_id": "550e8400-e29b-41d4-a716-446655440040",
    "scheduled_start": "2024-12-16T09:00:00Z",
    "scheduled_end": "2024-12-16T12:00:00Z"
}
```

### Start Work Order

```http
POST /work-orders/{work_order_id}/start
Authorization: Bearer <token>
```

### Complete Work Order

```http
POST /work-orders/{work_order_id}/complete
Authorization: Bearer <token>
Content-Type: application/json

{
    "resolution_notes": "Replaced door zone sensor. Tested operation - now functioning correctly.",
    "root_cause": "Door zone sensor failure due to age",
    "parts_used": [
        {
            "part_number": "KM-DZ-505",
            "part_name": "Door Zone Sensor",
            "quantity": 1,
            "unit_cost": 85.00
        }
    ],
    "labor_entries": [
        {
            "start_time": "2024-12-16T09:15:00Z",
            "end_time": "2024-12-16T10:45:00Z",
            "labor_type": "regular",
            "hourly_rate": 120.00
        }
    ],
    "requires_followup": false
}
```

---

## AI Diagnosis

### Request Diagnosis

```http
POST /diagnosis/request
Authorization: Bearer <token>
Content-Type: application/json

{
    "elevator_id": "550e8400-e29b-41d4-a716-446655440020",
    "fault_code": "F505",
    "symptoms": [
        "Door won't close",
        "Display shows F505",
        "Occurs intermittently"
    ],
    "additional_context": "Issue worse on humid days"
}
```

**Response:**
```json
{
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440050",
        "fault_code": "F505",
        "severity": "medium",
        "primary_cause": "Door zone sensor fault",
        "secondary_causes": [
            "Door operator timing misconfiguration",
            "Wiring connection loose"
        ],
        "diagnostic_steps": [
            "Check door zone sensor alignment",
            "Test sensor output with multimeter",
            "Inspect wiring connections at terminal block",
            "Check for moisture ingress in sensor housing"
        ],
        "recommended_actions": [
            "Replace door zone sensor (KM-DZ-505)",
            "Apply moisture sealant if housing compromised"
        ],
        "parts_needed": [
            {
                "part_number": "KM-DZ-505",
                "name": "Door Zone Sensor",
                "estimated_cost": 85.00
            }
        ],
        "estimated_repair_time_minutes": 90,
        "confidence": 0.87,
        "similar_cases": 847,
        "safety_notes": [
            "Ensure lift is on inspection mode before accessing shaft",
            "Lock out main power before sensor replacement"
        ],
        "sources": [
            "KONE MonoSpace Service Manual - Section 7.4",
            "Community: 847 similar cases resolved"
        ]
    }
}
```

### Get Diagnosis

```http
GET /diagnosis/{diagnosis_id}
Authorization: Bearer <token>
```

### Submit Diagnosis Feedback

```http
POST /diagnosis/{diagnosis_id}/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
    "was_accurate": true,
    "actual_cause": "Door zone sensor fault - confirmed",
    "additional_notes": "Sensor housing seal was compromised"
}
```

---

## Contractors

### List Contractors

```http
GET /contractors
Authorization: Bearer <token>
```

### Create Contractor

```http
POST /contractors
Authorization: Bearer <token>
Content-Type: application/json

{
    "contractor_type": "subcontractor",
    "company_name": "Summit Elevator Services",
    "contact_name": "Mike Johnson",
    "email": "mike@summifelevator.com",
    "phone": "+61 2 9876 5432",
    "license_number": "EL-NSW-12345",
    "specializations": ["KONE", "Otis", "modernization"],
    "hourly_rate": 120.00
}
```

### Get Contractor Performance

```http
GET /contractors/{contractor_id}/performance
Authorization: Bearer <token>
```

**Response:**
```json
{
    "data": {
        "contractor_id": "550e8400-e29b-41d4-a716-446655440040",
        "period": "last_12_months",
        "total_jobs": 156,
        "first_time_fix_rate": 0.94,
        "average_response_time_minutes": 127,
        "average_resolution_time_minutes": 72,
        "callbacks": 9,
        "callback_rate": 0.058,
        "customer_satisfaction": 4.8,
        "comparison": {
            "vs_average_first_fix": "+8%",
            "vs_average_response": "-23%"
        }
    }
}
```

---

## Inventory

### List Inventory Items

```http
GET /inventory
Authorization: Bearer <token>
```

### Get Van Stock

```http
GET /inventory/van-stock
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| contractor_id | uuid | Filter by contractor |
| below_minimum | boolean | Show only low stock items |

**Response:**
```json
{
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440060",
            "part_number": "KM-DZ-505",
            "name": "Door Zone Sensor - KONE",
            "location": "Van - Mike J.",
            "quantity_on_hand": 2,
            "quantity_reserved": 0,
            "minimum_stock": 1,
            "status": "ok"
        },
        {
            "id": "550e8400-e29b-41d4-a716-446655440061",
            "part_number": "OT-ENC-01",
            "name": "Encoder Belt - Otis",
            "location": "Van - Mike J.",
            "quantity_on_hand": 0,
            "quantity_reserved": 0,
            "minimum_stock": 1,
            "status": "below_minimum"
        }
    ]
}
```

### Find Nearby Parts

```http
GET /inventory/nearby/{part_number}
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| latitude | decimal | Current location |
| longitude | decimal | Current location |
| radius_km | integer | Search radius (default: 50) |

**Response:**
```json
{
    "data": [
        {
            "part_number": "KM-DZ-505",
            "location_type": "van",
            "holder_name": "Sarah M.",
            "holder_phone": "+61 412 345 678",
            "distance_km": 2.3,
            "quantity_available": 1,
            "can_share": true
        },
        {
            "part_number": "KM-DZ-505",
            "location_type": "warehouse",
            "holder_name": "Main Warehouse",
            "distance_km": 15.7,
            "quantity_available": 12,
            "can_share": true
        }
    ]
}
```

---

## Marketplace

### Search Listings

```http
GET /marketplace/listings
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| part_number | string | Search by part number |
| manufacturer | string | Filter by manufacturer |
| condition | string | Filter by condition |
| max_price | decimal | Maximum price |
| city | string | Filter by city |

### Create Listing

```http
POST /marketplace/listings
Authorization: Bearer <token>
Content-Type: application/json

{
    "part_number": "KM-DZ-505",
    "part_name": "Door Zone Sensor - KONE",
    "manufacturer": "KONE",
    "condition": "new",
    "quantity_available": 2,
    "unit_price": 35.00,
    "description": "Ordered spare, project cancelled. Original packaging.",
    "location_city": "Sydney",
    "location_state": "NSW",
    "shipping_available": true,
    "shipping_cost": 15.00,
    "local_pickup": true
}
```

---

## Technician Profiles

### Get My Profile

```http
GET /profiles/me
Authorization: Bearer <token>
```

### Update My Profile

```http
PATCH /profiles/me
Authorization: Bearer <token>
Content-Type: application/json

{
    "bio": "15 years experience in elevator maintenance",
    "specializations": ["KONE", "Otis", "door systems"],
    "open_to_opportunities": true
}
```

### Search Profiles (Employers)

```http
GET /profiles/search
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| specialization | string | Filter by specialization |
| city | string | Filter by city |
| min_score | integer | Minimum expertise score |
| open_to_opportunities | boolean | Only show available |

---

## Webhooks

### Configure Webhook

```http
POST /webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
    "url": "https://your-server.com/webhook",
    "events": [
        "work_order.created",
        "work_order.completed",
        "elevator.status_changed"
    ],
    "secret": "your_webhook_secret"
}
```

### Webhook Payload Example

```json
{
    "event": "work_order.completed",
    "timestamp": "2024-12-15T10:30:00Z",
    "data": {
        "work_order_id": "550e8400-e29b-41d4-a716-446655440030",
        "work_order_number": "WO-2024-001234",
        "elevator_id": "550e8400-e29b-41d4-a716-446655440020",
        "status": "completed",
        "resolution_notes": "Replaced door sensor"
    }
}
```

---

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| Authentication | 10 requests/minute |
| Standard API | 100 requests/minute |
| Search/List | 30 requests/minute |
| AI Diagnosis | 10 requests/minute |

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1702636200
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `AUTH_INVALID` | Invalid credentials |
| `AUTH_EXPIRED` | Token expired |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid input data |
| `DUPLICATE` | Resource already exists |
| `RATE_LIMITED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

---

**[← Back to Triforce AI](../explanation/triforce-ai.md)** | **[Next: Features →](features.md)**
