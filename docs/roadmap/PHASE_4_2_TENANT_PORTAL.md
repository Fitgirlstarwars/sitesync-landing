# Phase 4.2: Tenant Portal

> Detailed implementation specification for building occupant communication and service features
> Status: Design Phase
> Priority: MEDIUM - Enhances building experience, adds revenue stream
> Dependencies: Phase 0 (Core Platform), Phase 4.1 (Real Estate)

---

## Overview

The Tenant Portal creates a communication bridge between building management and occupants to:

1. **Communicate** service status, maintenance schedules, and announcements
2. **Enable** tenants to report issues and track resolution
3. **Provide** elevator booking and building amenity scheduling
4. **Measure** tenant satisfaction through surveys and feedback
5. **Support** multi-language communication for diverse populations

---

## User Stories

### As a Tenant/Occupant:

1. **US-TEN001:** I want to see elevator status so I know which ones are working
2. **US-TEN002:** I want to receive maintenance notifications so I can plan around disruptions
3. **US-TEN003:** I want to report issues easily so problems get fixed
4. **US-TEN004:** I want to track my reported issues so I know their status
5. **US-TEN005:** I want to book elevator time for moving so I have dedicated access
6. **US-TEN006:** I want emergency alerts so I stay safe
7. **US-TEN007:** I want building announcements so I stay informed
8. **US-TEN008:** I want to provide feedback so my voice is heard
9. **US-TEN009:** I want communication in my language so I understand everything

### As a Building Manager:

10. **US-TEN010:** I want to communicate with all tenants efficiently so I reduce individual inquiries
11. **US-TEN011:** I want to schedule maintenance with automatic notifications so tenants are prepared
12. **US-TEN012:** I want to see tenant-reported issues so I can address concerns
13. **US-TEN013:** I want to measure tenant satisfaction so I can improve service
14. **US-TEN014:** I want to manage elevator bookings so moves are organized
15. **US-TEN015:** I want to send emergency alerts instantly so tenants stay safe

### As a Property Manager (Portfolio):

16. **US-TEN016:** I want tenant satisfaction metrics across buildings so I can compare performance
17. **US-TEN017:** I want to standardize communication templates so messaging is consistent
18. **US-TEN018:** I want to see common issues across buildings so I identify systemic problems

---

## Feature Breakdown

### 4.2.1 Tenant Communication System

#### 4.2.1.1 Service Status Display

**API Endpoints:**

```
GET    /api/v1/buildings/{id}/tenant/status              # Get building status
GET    /api/v1/buildings/{id}/tenant/equipment           # Get equipment status
GET    /api/v1/buildings/{id}/tenant/announcements       # Get announcements
POST   /api/v1/buildings/{id}/tenant/subscribe           # Subscribe to updates
```

**Status Display Schema:**

```python
# sitesync_v3/domains/tenant/contracts.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date, time

class TenantEquipmentStatus(BaseModel):
    """Equipment status visible to tenants."""

    equipment_id: UUID
    equipment_name: str  # "Elevator A", "North Escalator"
    equipment_type: str
    location: str  # "Main Lobby", "Parking Level"

    # Status
    status: str  # 'operational', 'reduced_service', 'out_of_service', 'maintenance'
    status_since: datetime
    estimated_restoration: datetime | None

    # Details (simplified for tenants)
    status_message: str  # "Operating normally", "Under maintenance until 2pm"
    impact_description: str | None  # "Use Elevator B"

class BuildingTenantStatus(BaseModel):
    """Overall building status for tenants."""

    building_id: UUID
    building_name: str
    last_updated: datetime

    # Equipment summary
    total_elevators: int
    operational_elevators: int
    total_escalators: int
    operational_escalators: int

    # Individual equipment
    equipment_status: list[TenantEquipmentStatus]

    # Active alerts
    active_alerts: list[dict]
    # [{"type": "maintenance", "message": "...", "affected": ["Elevator A"]}]

    # Scheduled maintenance
    upcoming_maintenance: list[dict]
    # [{"date": date, "time": "09:00-12:00", "equipment": ["Elevator B"], "impact": "..."}]

class TenantAnnouncement(BaseModel):
    """Building announcement for tenants."""

    id: UUID
    building_id: UUID

    # Content
    title: str
    content: str
    content_html: str

    # Type
    announcement_type: str  # 'general', 'maintenance', 'emergency', 'amenity', 'policy'
    priority: str  # 'low', 'normal', 'high', 'urgent'

    # Targeting
    target_floors: list[int] | None  # None = all floors
    target_units: list[str] | None

    # Timing
    published_at: datetime
    expires_at: datetime | None
    is_pinned: bool

    # Engagement
    view_count: int
    acknowledgment_required: bool
    acknowledgment_count: int

    # Translations
    available_languages: list[str]
```

**Database Schema:**

```sql
-- Tenant announcements
CREATE TABLE tenant_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES sites(id),

    -- Content
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,

    -- Type
    announcement_type VARCHAR(30) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',

    -- Targeting
    target_floors INTEGER[],
    target_units TEXT[],

    -- Timing
    published_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ,
    is_pinned BOOLEAN DEFAULT FALSE,

    -- Engagement
    view_count INTEGER DEFAULT 0,
    acknowledgment_required BOOLEAN DEFAULT FALSE,

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft',

    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived'))
);

-- Announcement translations
CREATE TABLE announcement_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES tenant_announcements(id),

    language_code CHAR(2) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,

    -- Translation info
    translated_by VARCHAR(50),  -- 'human', 'ai', 'professional'
    reviewed BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(announcement_id, language_code)
);

-- Tenant subscriptions
CREATE TABLE tenant_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES sites(id),

    -- Subscriber
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    unit_number VARCHAR(50),
    floor_number INTEGER,

    -- Preferences
    preferred_language CHAR(2) DEFAULT 'en',
    notification_channels TEXT[] DEFAULT ARRAY['email'],

    -- Subscription types
    receive_maintenance BOOLEAN DEFAULT TRUE,
    receive_announcements BOOLEAN DEFAULT TRUE,
    receive_emergencies BOOLEAN DEFAULT TRUE,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    verified_at TIMESTAMPTZ,

    -- Metadata
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(building_id, email)
);

-- Indexes
CREATE INDEX idx_announcements_building ON tenant_announcements(building_id);
CREATE INDEX idx_announcements_published ON tenant_announcements(published_at) WHERE status = 'published';
CREATE INDEX idx_subscriptions_building ON tenant_subscriptions(building_id);
CREATE INDEX idx_subscriptions_email ON tenant_subscriptions(email);
```

#### 4.2.1.2 Notification System

**Notification Types:**

| Type | Trigger | Channels | Timing |
|------|---------|----------|--------|
| `maintenance_scheduled` | Maintenance planned | Email, Push | 24-48 hrs before |
| `maintenance_starting` | Maintenance begins | Push | Immediate |
| `maintenance_complete` | Maintenance ends | Push | Immediate |
| `equipment_outage` | Equipment fails | Push, SMS | Immediate |
| `equipment_restored` | Equipment fixed | Push | Immediate |
| `emergency_alert` | Emergency situation | Push, SMS, Email | Immediate |
| `announcement` | New announcement | Email, Push | As published |

**Notification Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  TENANT NOTIFICATION FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. TRIGGER EVENT                                                │
│     ├── Maintenance scheduled                                    │
│     ├── Equipment status change                                  │
│     ├── Emergency declared                                       │
│     └── Announcement published                                   │
│                                                                  │
│  2. AUDIENCE DETERMINATION                                       │
│     ├── All building tenants                                     │
│     ├── Affected floors only                                     │
│     ├── Specific units                                           │
│     └── Subscribed tenants only                                  │
│                                                                  │
│  3. CONTENT PREPARATION                                          │
│     ├── Generate message from template                           │
│     ├── Translate to recipient languages                         │
│     ├── Personalize (unit, name if known)                        │
│     └── Add relevant links                                       │
│                                                                  │
│  4. DELIVERY                                                     │
│     ├── Email (bulk)                                             │
│     ├── Push notification (app users)                            │
│     ├── SMS (emergencies, opt-in)                                │
│     └── In-app notification                                      │
│                                                                  │
│  5. TRACKING                                                     │
│     ├── Delivery status                                          │
│     ├── Open rates                                               │
│     ├── Click-through                                            │
│     └── Acknowledgments                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.2.2 Tenant Issue Reporting

#### 4.2.2.1 Issue Submission

**API Endpoints:**

```
POST   /api/v1/buildings/{id}/tenant/issues              # Report issue
GET    /api/v1/buildings/{id}/tenant/issues              # List issues (manager)
GET    /api/v1/tenant/issues/{id}                        # Get issue status
PUT    /api/v1/tenant/issues/{id}                        # Update issue
POST   /api/v1/tenant/issues/{id}/comment                # Add comment
GET    /api/v1/tenant/my-issues                          # My reported issues
```

**Issue Schema:**

```python
class TenantIssueCategory(str, Enum):
    ELEVATOR = "elevator"
    ESCALATOR = "escalator"
    DOOR = "door"
    LIGHTING = "lighting"
    SAFETY = "safety"
    CLEANLINESS = "cleanliness"
    NOISE = "noise"
    TEMPERATURE = "temperature"
    OTHER = "other"

class TenantIssueCreate(BaseModel):
    """Tenant-reported issue."""

    building_id: UUID

    # Issue details
    category: TenantIssueCategory
    equipment_id: UUID | None  # If related to specific equipment
    location: str  # "Floor 15", "Main lobby"
    description: str

    # Reporter info
    reporter_name: str | None
    reporter_email: str
    reporter_phone: str | None
    reporter_unit: str | None

    # Urgency
    urgency: str = "normal"  # 'low', 'normal', 'urgent'

    # Evidence
    photo_ids: list[UUID] = []

    # Preferences
    preferred_contact_method: str = "email"
    preferred_language: str = "en"

class TenantIssueResponse(BaseModel):
    """Response with issue details."""

    id: UUID
    issue_number: str  # Human-readable number

    # Issue
    category: TenantIssueCategory
    category_display: str
    location: str
    description: str
    urgency: str

    # Status
    status: str  # 'submitted', 'acknowledged', 'in_progress', 'resolved', 'closed'
    status_message: str

    # Timeline
    submitted_at: datetime
    acknowledged_at: datetime | None
    resolved_at: datetime | None

    # Communication
    updates: list[dict]
    # [{"timestamp": datetime, "message": "...", "from": "manager"}]

    # Resolution
    resolution_summary: str | None
    resolution_rating: int | None  # 1-5 if tenant rated

    # Photos
    photo_urls: list[str]
```

**Database Schema:**

```sql
-- Tenant issues
CREATE TABLE tenant_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES sites(id),
    issue_number VARCHAR(20) UNIQUE NOT NULL,

    -- Issue details
    category VARCHAR(30) NOT NULL,
    equipment_id UUID REFERENCES elevators(id),
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    urgency VARCHAR(20) NOT NULL DEFAULT 'normal',

    -- Reporter
    reporter_name VARCHAR(255),
    reporter_email VARCHAR(255) NOT NULL,
    reporter_phone VARCHAR(50),
    reporter_unit VARCHAR(50),
    preferred_contact_method VARCHAR(20) DEFAULT 'email',
    preferred_language CHAR(2) DEFAULT 'en',

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'submitted',
    status_message TEXT,

    -- Timeline
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    assigned_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,

    -- Assignment
    assigned_to_user_id UUID REFERENCES users(id),
    work_order_id UUID REFERENCES work_orders(id),

    -- Resolution
    resolution_summary TEXT,
    resolution_rating INTEGER CHECK (resolution_rating BETWEEN 1 AND 5),
    resolution_feedback TEXT,
    rated_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_urgency CHECK (urgency IN ('low', 'normal', 'urgent')),
    CONSTRAINT valid_status CHECK (status IN (
        'submitted', 'acknowledged', 'in_progress', 'resolved', 'closed', 'cancelled'
    ))
);

-- Issue photos
CREATE TABLE tenant_issue_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES tenant_issues(id),
    file_id UUID NOT NULL REFERENCES uploaded_files(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Issue updates/communication
CREATE TABLE tenant_issue_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id UUID NOT NULL REFERENCES tenant_issues(id),

    -- Update
    message TEXT NOT NULL,
    update_type VARCHAR(30) NOT NULL,  -- 'status_change', 'comment', 'internal_note'
    is_visible_to_tenant BOOLEAN DEFAULT TRUE,

    -- Author
    author_type VARCHAR(20) NOT NULL,  -- 'tenant', 'manager', 'contractor', 'system'
    author_id UUID REFERENCES users(id),
    author_name VARCHAR(255),

    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tenant_issues_building ON tenant_issues(building_id);
CREATE INDEX idx_tenant_issues_status ON tenant_issues(status);
CREATE INDEX idx_tenant_issues_email ON tenant_issues(reporter_email);
CREATE INDEX idx_issue_updates_issue ON tenant_issue_updates(issue_id);
```

---

### 4.2.3 Tenant Services

#### 4.2.3.1 Elevator Booking System

**API Endpoints:**

```
GET    /api/v1/buildings/{id}/tenant/elevator-bookings/availability  # Check availability
POST   /api/v1/buildings/{id}/tenant/elevator-bookings   # Create booking
GET    /api/v1/buildings/{id}/tenant/elevator-bookings   # List bookings
GET    /api/v1/tenant/elevator-bookings/{id}             # Get booking
PUT    /api/v1/tenant/elevator-bookings/{id}             # Update booking
DELETE /api/v1/tenant/elevator-bookings/{id}             # Cancel booking
```

**Booking Schema:**

```python
class ElevatorBookingType(str, Enum):
    MOVE_IN = "move_in"
    MOVE_OUT = "move_out"
    DELIVERY = "delivery"
    CONSTRUCTION = "construction"
    EVENT = "event"

class ElevatorBookingCreate(BaseModel):
    """Request to book elevator."""

    building_id: UUID
    elevator_id: UUID | None  # None = any available

    # Booking details
    booking_type: ElevatorBookingType
    booking_date: date
    start_time: time
    end_time: time

    # Contact
    contact_name: str
    contact_phone: str
    contact_email: str
    unit_number: str

    # Details
    company_name: str | None  # Moving company, etc.
    estimated_trips: int | None
    special_requirements: str | None

    # Payment
    accept_fee: bool = True

class ElevatorBookingResponse(BaseModel):
    """Response with booking details."""

    id: UUID
    booking_number: str

    # Elevator
    building_id: UUID
    building_name: str
    elevator_id: UUID | None
    elevator_name: str | None

    # Booking
    booking_type: ElevatorBookingType
    booking_date: date
    start_time: time
    end_time: time
    duration_hours: float

    # Contact
    contact_name: str
    contact_phone: str
    contact_email: str
    unit_number: str

    # Details
    company_name: str | None
    special_requirements: str | None

    # Status
    status: str  # 'pending', 'confirmed', 'cancelled', 'completed'
    confirmation_code: str | None

    # Payment
    fee_amount: float | None
    fee_paid: bool
    payment_reference: str | None

    # Instructions
    access_instructions: str | None
    building_rules: str | None

class ElevatorAvailability(BaseModel):
    """Elevator availability for booking."""

    building_id: UUID
    date: date

    # Available slots
    available_slots: list[dict]
    # [{
    #     "elevator_id": UUID,
    #     "elevator_name": "Freight Elevator",
    #     "start_time": "08:00",
    #     "end_time": "18:00",
    #     "max_duration_hours": 4,
    #     "fee_per_hour": 50.00
    # }]

    # Booked slots
    booked_slots: list[dict]
    # [{"elevator_id": UUID, "start_time": "09:00", "end_time": "13:00"}]

    # Rules
    booking_rules: dict
    # {
    #     "advance_booking_days": 7,
    #     "max_booking_hours": 8,
    #     "available_days": ["monday", "tuesday", ...],
    #     "available_hours": {"start": "07:00", "end": "19:00"}
    # }
```

#### 4.2.3.2 Amenity Scheduling

**API Endpoints:**

```
GET    /api/v1/buildings/{id}/tenant/amenities           # List amenities
GET    /api/v1/buildings/{id}/tenant/amenities/{id}/availability  # Check availability
POST   /api/v1/buildings/{id}/tenant/amenity-bookings    # Book amenity
GET    /api/v1/tenant/amenity-bookings                   # My bookings
DELETE /api/v1/tenant/amenity-bookings/{id}              # Cancel booking
```

**Amenity Types:**

- Loading dock
- Conference rooms
- Party room
- Gym (if capacity controlled)
- Pool (if capacity controlled)
- Parking (visitor)
- Storage areas

---

### 4.2.4 Tenant Satisfaction

#### 4.2.4.1 Survey System

**API Endpoints:**

```
POST   /api/v1/buildings/{id}/tenant/surveys             # Create survey
GET    /api/v1/buildings/{id}/tenant/surveys             # List surveys
GET    /api/v1/buildings/{id}/tenant/surveys/{id}        # Get survey results
POST   /api/v1/tenant/surveys/{id}/respond               # Submit response
GET    /api/v1/buildings/{id}/tenant/satisfaction        # Satisfaction dashboard
```

**Survey Schema:**

```python
class TenantSurvey(BaseModel):
    """Tenant satisfaction survey."""

    id: UUID
    building_id: UUID

    # Survey info
    title: str
    description: str
    survey_type: str  # 'satisfaction', 'service_feedback', 'post_maintenance', 'annual'

    # Questions
    questions: list[dict]
    # [{
    #     "id": UUID,
    #     "question": "How satisfied are you with elevator service?",
    #     "question_type": "rating",  # 'rating', 'choice', 'text', 'nps'
    #     "options": null,  # For choice questions
    #     "required": true
    # }]

    # Targeting
    target_all_tenants: bool
    target_units: list[str] | None

    # Timing
    start_date: date
    end_date: date

    # Status
    status: str  # 'draft', 'active', 'closed'
    response_count: int
    completion_rate: float

class SatisfactionDashboard(BaseModel):
    """Tenant satisfaction metrics."""

    building_id: UUID
    period: str  # 'month', 'quarter', 'year'

    # Overall score
    overall_satisfaction: float  # 0-100
    satisfaction_trend: float  # Change from previous period

    # By category
    category_scores: dict
    # {
    #     "elevator_service": 85,
    #     "maintenance_response": 78,
    #     "communication": 90,
    #     "cleanliness": 82
    # }

    # NPS
    nps_score: int  # -100 to 100
    promoters_percent: float
    detractors_percent: float

    # Issues
    common_complaints: list[dict]
    # [{"category": "elevator", "count": 15, "description": "Wait times"}]

    # Response metrics
    survey_response_rate: float
    total_responses: int

    # Trend
    historical_scores: list[dict]
    # [{"period": "2024-Q1", "score": 82}, ...]
```

---

### 4.2.5 Multi-Language Support

**Supported Languages:**

| Code | Language | Coverage |
|------|----------|----------|
| `en` | English | Full |
| `es` | Spanish | Full |
| `zh` | Chinese (Simplified) | Full |
| `fr` | French | Full |
| `de` | German | Partial |
| `pt` | Portuguese | Partial |
| `ja` | Japanese | Partial |
| `ko` | Korean | Partial |
| `ar` | Arabic | Partial |
| `hi` | Hindi | Partial |

**Translation Approach:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  TRANSLATION WORKFLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CONTENT TYPES:                                                  │
│                                                                  │
│  1. STATIC UI                                                    │
│     ├── Professional translation                                 │
│     ├── Reviewed by native speakers                              │
│     └── Updated with releases                                    │
│                                                                  │
│  2. ANNOUNCEMENTS                                                │
│     ├── AI translation (Claude/GPT)                              │
│     ├── Human review option                                      │
│     └── Building manager approval                                │
│                                                                  │
│  3. NOTIFICATIONS                                                │
│     ├── Template-based                                           │
│     ├── Pre-translated templates                                 │
│     └── Dynamic content insertion                                │
│                                                                  │
│  4. USER-GENERATED                                               │
│     ├── Issue descriptions: Keep original                        │
│     ├── Survey responses: Keep original                          │
│     └── Provide translation on request                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Success Metrics

### Phase 4.2 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Buildings with tenant portal | 100+ | Active portals |
| Tenant subscriptions | 10,000+ | Active subscribers |
| Issue reports handled | 500+/month | Monthly issues |
| Satisfaction surveys | 1,000+/month | Monthly responses |
| Elevator bookings | 200+/month | Monthly bookings |
| Average satisfaction score | 80%+ | Survey results |

### KPIs

1. **Engagement**
   - Subscription rate (% of building occupancy)
   - Notification open rate
   - Portal visit frequency

2. **Service Quality**
   - Issue resolution time
   - Issue satisfaction rating
   - First response time

3. **Communication**
   - Announcement read rate
   - Emergency alert acknowledgment rate
   - Multi-language adoption

4. **Business Value**
   - Booking revenue
   - Premium feature adoption
   - Tenant retention correlation

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
