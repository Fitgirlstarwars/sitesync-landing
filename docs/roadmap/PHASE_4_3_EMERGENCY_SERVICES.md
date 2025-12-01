# Phase 4.3: Emergency Services Integration

> Detailed implementation specification for emergency response coordination and first responder support
> Status: Design Phase
> Priority: HIGH - Life safety critical
> Dependencies: Phase 0 (Core Platform), Phase 4.2 (Tenant Portal)

---

## Overview

The Emergency Services Integration creates life-safety coordination between buildings and emergency responders to:

1. **Respond** to elevator entrapments with faster rescue times
2. **Share** critical building information with first responders
3. **Coordinate** emergency protocols across stakeholders
4. **Enable** post-disaster building status reporting and recovery
5. **Integrate** with emergency dispatch systems where possible

---

## User Stories

### As an Entrapped Passenger:

1. **US-EMR001:** I want help to arrive quickly so I'm rescued safely
2. **US-EMR002:** I want to communicate with rescuers so I know help is coming
3. **US-EMR003:** I want someone to know I'm trapped even if I can't call so I'm not forgotten

### As a Building Manager:

4. **US-EMR004:** I want immediate alerts for entrapments so I can respond
5. **US-EMR005:** I want to coordinate with emergency services so rescue is efficient
6. **US-EMR006:** I want building information available to responders so they can help faster
7. **US-EMR007:** I want to track entrapment metrics so I can improve safety
8. **US-EMR008:** I want post-incident reporting so I document everything properly

### As a First Responder:

9. **US-EMR009:** I want building access information so I can enter quickly
10. **US-EMR010:** I want equipment location and type so I know what I'm dealing with
11. **US-EMR011:** I want key holder contacts so I can coordinate access
12. **US-EMR012:** I want elevator technical information so I can rescue safely
13. **US-EMR013:** I want real-time status updates so I know the situation

### As a Service Company:

14. **US-EMR014:** I want entrapment alerts so I can dispatch immediately
15. **US-EMR015:** I want to coordinate with emergency services so we work together
16. **US-EMR016:** I want response time tracking so I demonstrate performance

### As Emergency Dispatch:

17. **US-EMR017:** I want automated building data so I have information immediately
18. **US-EMR018:** I want to notify contractors automatically so response is faster
19. **US-EMR019:** I want status updates so I keep callers informed

---

## Feature Breakdown

### 4.3.1 Entrapment Response System

#### 4.3.1.1 Entrapment Detection & Alert

**Detection Methods:**

```
┌─────────────────────────────────────────────────────────────────┐
│               ENTRAPMENT DETECTION METHODS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. EMERGENCY PHONE/INTERCOM                                     │
│     ├── Passenger presses emergency button                       │
│     ├── Auto-dials monitoring center                             │
│     ├── SiteSync integration receives alert                      │
│     └── Location identified by elevator ID                       │
│                                                                  │
│  2. CONNECTED ELEVATOR SYSTEMS                                   │
│     ├── Manufacturer telemetry integration                       │
│     ├── Controller reports entrapment state                      │
│     ├── Door cycle anomaly detection                             │
│     └── Movement pattern analysis                                │
│                                                                  │
│  3. IOT SENSORS (Phase 4.4)                                      │
│     ├── Occupancy sensors detect presence                        │
│     ├── Extended door-close failure                              │
│     ├── Unusual vibration patterns                               │
│     └── Temperature/air quality changes                          │
│                                                                  │
│  4. MANUAL REPORTING                                             │
│     ├── Building staff reports                                   │
│     ├── Tenant app reporting                                     │
│     ├── Phone call to building                                   │
│     └── Monitoring center notification                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
POST   /api/v1/entrapments                               # Report entrapment
GET    /api/v1/entrapments/{id}                          # Get entrapment status
PUT    /api/v1/entrapments/{id}                          # Update status
POST   /api/v1/entrapments/{id}/resolve                  # Resolve entrapment
GET    /api/v1/buildings/{id}/entrapments                # Building entrapment history
GET    /api/v1/entrapments/active                        # Active entrapments
```

**Entrapment Schema:**

```python
# sitesync_v3/domains/emergency/contracts.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from enum import Enum

class EntrapmentSeverity(str, Enum):
    STANDARD = "standard"          # Normal entrapment
    MEDICAL = "medical"            # Passenger medical issue
    MULTIPLE = "multiple"          # Multiple passengers
    CHILD = "child"               # Child involved
    ELDERLY = "elderly"           # Elderly passenger
    DISABLED = "disabled"         # Passenger with disability
    EMERGENCY = "emergency"       # Additional emergency (fire, etc.)

class EntrapmentStatus(str, Enum):
    REPORTED = "reported"
    CONFIRMED = "confirmed"
    RESPONDER_DISPATCHED = "responder_dispatched"
    RESPONDER_ON_SITE = "responder_on_site"
    RESCUE_IN_PROGRESS = "rescue_in_progress"
    RESOLVED = "resolved"
    FALSE_ALARM = "false_alarm"

class EntrapmentReport(BaseModel):
    """Entrapment incident record."""

    id: UUID
    incident_number: str

    # Location
    building_id: UUID
    building_name: str
    building_address: str
    elevator_id: UUID
    elevator_name: str
    floor_location: str | None  # If known

    # Detection
    detection_method: str
    detected_at: datetime
    reported_by: str | None
    reporter_contact: str | None

    # Severity
    severity: EntrapmentSeverity
    passengers_count: int | None
    special_circumstances: list[str]

    # Status
    status: EntrapmentStatus
    status_updated_at: datetime

    # Communication
    passenger_contact_established: bool
    passenger_phone: str | None
    passenger_condition: str | None

    # Response
    contractor_notified_at: datetime | None
    contractor_eta_minutes: int | None
    fire_department_notified_at: datetime | None
    building_staff_on_scene: bool
    key_holder_contacted: bool

    # Resolution
    resolved_at: datetime | None
    resolution_method: str | None  # 'contractor', 'fire_department', 'self_release', 'building_staff'
    total_duration_minutes: int | None

    # Post-incident
    incident_report_id: UUID | None
    follow_up_required: bool
    follow_up_notes: str | None

class EntrapmentAlert(BaseModel):
    """Alert sent for entrapment."""

    id: UUID
    entrapment_id: UUID

    # Alert info
    alert_type: str  # 'initial', 'update', 'resolved'
    severity: EntrapmentSeverity

    # Building info (for responders)
    building_info: dict
    # {
    #     "name": "...",
    #     "address": "...",
    #     "access_info": "...",
    #     "key_location": "...",
    #     "key_holder_name": "...",
    #     "key_holder_phone": "..."
    # }

    # Elevator info
    elevator_info: dict
    # {
    #     "name": "Elevator A",
    #     "type": "traction",
    #     "manufacturer": "KONE",
    #     "capacity": "2500 lbs",
    #     "floors_served": "1-20",
    #     "machine_room_location": "Roof level",
    #     "power_shutoff_location": "Basement electrical room"
    # }

    # Current status
    current_status: str
    passengers_info: str | None
    responder_eta: str | None

    # Sent to
    recipients: list[dict]
    # [{"type": "contractor", "name": "...", "sent_at": datetime}]
```

**Database Schema:**

```sql
-- Entrapment incidents
CREATE TABLE entrapments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_number VARCHAR(50) UNIQUE NOT NULL,

    -- Location
    building_id UUID NOT NULL REFERENCES sites(id),
    elevator_id UUID NOT NULL REFERENCES elevators(id),
    floor_location VARCHAR(50),

    -- Detection
    detection_method VARCHAR(30) NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL,
    reported_by VARCHAR(255),
    reporter_contact VARCHAR(100),

    -- Severity
    severity VARCHAR(30) NOT NULL DEFAULT 'standard',
    passengers_count INTEGER,
    special_circumstances TEXT[],

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'reported',
    status_updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Passenger communication
    passenger_contact_established BOOLEAN DEFAULT FALSE,
    passenger_phone VARCHAR(50),
    passenger_condition TEXT,

    -- Response
    contractor_notified_at TIMESTAMPTZ,
    contractor_eta_minutes INTEGER,
    contractor_arrived_at TIMESTAMPTZ,
    fire_department_notified_at TIMESTAMPTZ,
    fire_department_arrived_at TIMESTAMPTZ,
    building_staff_on_scene BOOLEAN DEFAULT FALSE,
    key_holder_contacted BOOLEAN DEFAULT FALSE,

    -- Resolution
    resolved_at TIMESTAMPTZ,
    resolution_method VARCHAR(50),
    total_duration_minutes INTEGER,

    -- Post-incident
    incident_report_id UUID,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_severity CHECK (severity IN (
        'standard', 'medical', 'multiple', 'child', 'elderly', 'disabled', 'emergency'
    )),
    CONSTRAINT valid_status CHECK (status IN (
        'reported', 'confirmed', 'responder_dispatched', 'responder_on_site',
        'rescue_in_progress', 'resolved', 'false_alarm'
    ))
);

-- Entrapment timeline events
CREATE TABLE entrapment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entrapment_id UUID NOT NULL REFERENCES entrapments(id),

    -- Event
    event_type VARCHAR(50) NOT NULL,
    event_description TEXT,
    event_time TIMESTAMPTZ DEFAULT NOW(),

    -- Actor
    actor_type VARCHAR(30),  -- 'system', 'building_staff', 'contractor', 'fire_dept', 'passenger'
    actor_name VARCHAR(255),

    -- Details
    details JSONB
);

-- Entrapment alerts
CREATE TABLE entrapment_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entrapment_id UUID NOT NULL REFERENCES entrapments(id),

    -- Alert
    alert_type VARCHAR(30) NOT NULL,
    recipient_type VARCHAR(30) NOT NULL,
    recipient_id UUID,
    recipient_contact VARCHAR(255),

    -- Delivery
    channel VARCHAR(20) NOT NULL,  -- 'sms', 'call', 'push', 'email'
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,

    -- Content
    message_content TEXT
);

-- Indexes
CREATE INDEX idx_entrapments_building ON entrapments(building_id);
CREATE INDEX idx_entrapments_elevator ON entrapments(elevator_id);
CREATE INDEX idx_entrapments_status ON entrapments(status);
CREATE INDEX idx_entrapments_active ON entrapments(status)
    WHERE status NOT IN ('resolved', 'false_alarm');
CREATE INDEX idx_entrapment_events ON entrapment_events(entrapment_id);
CREATE INDEX idx_entrapment_alerts ON entrapment_alerts(entrapment_id);
```

#### 4.3.1.2 Response Coordination

**Response Workflow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                ENTRAPMENT RESPONSE WORKFLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  T+0: DETECTION                                                  │
│  ├── Alert generated                                             │
│  ├── Building manager notified                                   │
│  ├── Service contractor notified                                 │
│  └── If severe: Fire department auto-notified                    │
│                                                                  │
│  T+0-2min: CONFIRMATION                                          │
│  ├── Attempt passenger communication                             │
│  ├── Assess situation severity                                   │
│  ├── Confirm contractor dispatch                                 │
│  └── Alert key holder if needed                                  │
│                                                                  │
│  T+2-15min: CONTRACTOR RESPONSE                                  │
│  ├── Contractor provides ETA                                     │
│  ├── Building staff monitors situation                           │
│  ├── Passenger reassured and monitored                           │
│  └── If ETA > 15min or medical: Call fire dept                   │
│                                                                  │
│  T+15-30min: ESCALATION (if needed)                              │
│  ├── Fire department dispatch                                    │
│  ├── Share building access info                                  │
│  ├── Coordinate with contractor                                  │
│  └── Update all stakeholders                                     │
│                                                                  │
│  RESOLUTION:                                                     │
│  ├── Passenger released                                          │
│  ├── Passenger welfare check                                     │
│  ├── Equipment status assessed                                   │
│  ├── All parties notified                                        │
│  └── Incident report initiated                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.3.2 First Responder Information

#### 4.3.2.1 Building Emergency Information Package

**API Endpoints:**

```
GET    /api/v1/buildings/{id}/emergency-info             # Get emergency info
PUT    /api/v1/buildings/{id}/emergency-info             # Update emergency info
GET    /api/v1/buildings/{id}/emergency-info/responder   # Responder-specific view
POST   /api/v1/buildings/{id}/emergency-info/share       # Share with responders
```

**Emergency Info Package:**

```python
class BuildingEmergencyInfo(BaseModel):
    """Emergency information package for building."""

    building_id: UUID
    last_updated: datetime

    # Building basics
    building_name: str
    address: dict
    building_type: str
    floors: int
    year_built: int

    # Access information
    access_info: dict
    # {
    #     "main_entrance": "123 Main St, glass doors",
    #     "after_hours_access": "Side entrance, keypad 1234#",
    #     "fire_department_lockbox": "Left of main entrance",
    #     "lockbox_code": "FD only - contact dispatch",
    #     "loading_dock": "Rear of building, Ring bell",
    #     "parking": "Street parking, fire lane marked"
    # }

    # Key holders
    key_holders: list[dict]
    # [{
    #     "name": "John Smith",
    #     "role": "Building Manager",
    #     "phone": "555-0100",
    #     "priority": 1,
    #     "available_hours": "24/7"
    # }]

    # Equipment inventory
    elevators: list[dict]
    # [{
    #     "id": UUID,
    #     "name": "Elevator A",
    #     "type": "traction",
    #     "manufacturer": "KONE",
    #     "floors_served": "1-20",
    #     "machine_room_location": "Roof level",
    #     "key_required": "Fire service key",
    #     "power_shutoff": "MR panel, breaker 15"
    # }]

    # Utility shutoffs
    utility_shutoffs: dict
    # {
    #     "main_electrical": "Basement, Room B-1",
    #     "elevator_power": "Per elevator in MR",
    #     "gas": "Exterior, NW corner",
    #     "water": "Basement, near stairs",
    #     "fire_pump": "Basement, Fire pump room"
    # }

    # Building systems
    fire_alarm_panel: str
    sprinkler_connections: str
    standpipe_connections: str
    elevator_recall: str

    # Hazards
    known_hazards: list[dict]
    # [{"location": "Basement", "hazard": "Chemical storage", "notes": "..."}]

    # Floor plans
    floor_plan_urls: list[dict]  # Links to floor plans

    # Contractor info
    elevator_contractor: dict
    # {
    #     "company": "ABC Elevator",
    #     "phone": "555-0200",
    #     "after_hours": "555-0201",
    #     "average_response": "20 minutes"
    # }

class ResponderView(BaseModel):
    """Simplified view for first responders."""

    # Quick reference
    address: str
    building_type: str
    floors: int

    # Access (most critical)
    fastest_access: str
    lockbox_location: str
    key_holder_phone: str

    # Elevator quick ref
    elevator_count: int
    machine_room_locations: list[str]
    elevator_key_type: str

    # Active incident
    active_entrapment: dict | None
    # {
    #     "elevator": "Elevator A",
    #     "duration_minutes": 15,
    #     "passengers": 2,
    #     "special_circumstances": ["medical"]
    # }

    # Map/navigation
    gps_coordinates: dict
    building_photo_url: str | None
```

#### 4.3.2.2 Fire Service Integration

**Integration Approaches:**

| Method | Description | Adoption |
|--------|-------------|----------|
| CAD Integration | Direct dispatch system integration | Major cities |
| RapidSOS | Emergency data platform | Growing |
| Manual Protocol | Phone/radio communication | Universal |
| Building Portal | Web access for responders | Universal |

---

### 4.3.3 Disaster Response

#### 4.3.3.1 Building Status Reporting

**API Endpoints:**

```
POST   /api/v1/disasters                                 # Report disaster event
GET    /api/v1/disasters/{id}                            # Get disaster details
POST   /api/v1/buildings/{id}/disaster-status            # Report building status
GET    /api/v1/buildings/{id}/disaster-status            # Get building status
GET    /api/v1/disasters/{id}/buildings                  # All affected buildings
```

**Disaster Status Schema:**

```python
class DisasterType(str, Enum):
    EARTHQUAKE = "earthquake"
    FIRE = "fire"
    FLOOD = "flood"
    POWER_OUTAGE = "power_outage"
    SEVERE_WEATHER = "severe_weather"
    STRUCTURAL = "structural"
    OTHER = "other"

class BuildingDisasterStatus(BaseModel):
    """Building status after disaster event."""

    building_id: UUID
    disaster_id: UUID
    reported_at: datetime
    reported_by: UUID

    # Overall status
    overall_status: str  # 'operational', 'limited', 'closed', 'evacuated', 'unknown'

    # Equipment status
    equipment_status: list[dict]
    # [{
    #     "equipment_id": UUID,
    #     "name": "Elevator A",
    #     "status": "operational" | "out_of_service" | "damaged" | "unknown",
    #     "notes": "...",
    #     "inspection_required": true
    # }]

    # Damage assessment
    damage_assessment: dict
    # {
    #     "structural_damage": false,
    #     "equipment_damage": true,
    #     "estimated_repair_cost": 50000,
    #     "estimated_downtime_days": 5
    # }

    # Occupancy
    occupancy_status: str  # 'normal', 'restricted', 'evacuated'
    safe_areas: list[str]
    restricted_areas: list[str]

    # Required actions
    required_actions: list[dict]
    # [{"action": "Seismic inspection", "priority": "high", "assigned_to": "..."}]

    # Recovery timeline
    estimated_full_recovery: date | None
```

---

## Success Metrics

### Phase 4.3 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Response time improvement | 20%+ | Average entrapment duration |
| First responder data access | 500+ buildings | Buildings with emergency info |
| Entrapment resolution time | <30 min avg | Average resolution time |
| False alarm reduction | 15%+ | False alarm rate |
| Disaster response buildings | 100+ | Buildings with disaster reporting |

### KPIs

1. **Response Effectiveness**
   - Average entrapment duration
   - Time to first responder arrival
   - Contractor response time
   - Passenger welfare outcomes

2. **Information Quality**
   - Emergency info completeness
   - Information accuracy rate
   - Responder satisfaction

3. **System Reliability**
   - Alert delivery rate
   - System uptime during emergencies
   - Integration success rate

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
