# Phase 3.4: Regulatory & Compliance Automation

> Detailed implementation specification for compliance tracking, inspection management, and inspector network
> Status: Design Phase
> Priority: HIGH - Critical for building safety and legal compliance
> Dependencies: Phase 0 (Core Platform), Phase 1.4 (Document Management)

---

## Overview

The Regulatory & Compliance Automation system creates a comprehensive framework that:

1. **Tracks** jurisdiction-specific compliance requirements automatically
2. **Schedules** and manages inspections with reminders and workflows
3. **Connects** buildings with qualified inspectors via the inspector network
4. **Automates** compliance reporting and regulatory submissions
5. **Alerts** stakeholders to requirement changes and upcoming deadlines

---

## User Stories

### As a Building Owner:

1. **US-REG001:** I want to see all compliance requirements for my building so I know what's needed
2. **US-REG002:** I want to receive alerts before deadlines so I never miss an inspection
3. **US-REG003:** I want to schedule inspections easily so compliance is streamlined
4. **US-REG004:** I want one dashboard showing all equipment compliance so I have a complete picture
5. **US-REG005:** I want to generate audit-ready reports so regulatory reviews are painless
6. **US-REG006:** I want to be notified of regulation changes so I can adapt quickly
7. **US-REG007:** I want to track defect remediation so I demonstrate responsiveness
8. **US-REG008:** I want digital copies of all certificates so I can access them anytime

### As a Building Manager:

9. **US-REG009:** I want to manage compliance across my portfolio so I see the full picture
10. **US-REG010:** I want to delegate compliance tasks so work is distributed properly
11. **US-REG011:** I want to track contractor compliance activities so I verify they're doing the work
12. **US-REG012:** I want compliance cost tracking so I can budget appropriately

### As a Service Company:

13. **US-REG013:** I want to know inspection requirements for each building so I prepare properly
14. **US-REG014:** I want to submit inspection-ready packages so inspectors have what they need
15. **US-REG015:** I want to track defects across my portfolio so I prioritize remediation
16. **US-REG016:** I want to verify technician qualifications for inspections so I assign correctly

### As an Inspector:

17. **US-REG017:** I want to find inspection opportunities so I can grow my business
18. **US-REG018:** I want building information before inspections so I'm prepared
19. **US-REG019:** I want to submit inspection reports digitally so paperwork is reduced
20. **US-REG020:** I want to track my inspection history so I have records
21. **US-REG021:** I want to receive payment through the platform so transactions are simple

### As a Regulatory Authority:

22. **US-REG022:** I want to verify inspection compliance across buildings so I enforce requirements
23. **US-REG023:** I want to receive inspection reports electronically so processing is faster
24. **US-REG024:** I want to publish requirement updates so buildings stay informed
25. **US-REG025:** I want to access aggregate compliance data so I understand industry status

---

## Feature Breakdown

### 3.4.1 Compliance Requirements Database

#### 3.4.1.1 Jurisdiction Requirements Engine

**API Endpoints:**

```
GET    /api/v1/compliance/jurisdictions                  # List jurisdictions
GET    /api/v1/compliance/jurisdictions/{id}             # Get jurisdiction details
GET    /api/v1/compliance/jurisdictions/{id}/requirements # Get requirements
GET    /api/v1/compliance/requirements                   # Search requirements
GET    /api/v1/buildings/{id}/compliance/requirements    # Building's requirements
```

**Jurisdiction Model:**

```python
# sitesync_v3/domains/compliance/contracts.py

from pydantic import BaseModel, Field
from enum import Enum
from uuid import UUID
from datetime import datetime, date
from typing import Any

class JurisdictionLevel(str, Enum):
    FEDERAL = "federal"
    STATE = "state"
    COUNTY = "county"
    CITY = "city"
    SPECIAL_DISTRICT = "special_district"

class JurisdictionResponse(BaseModel):
    """Jurisdiction with compliance requirements."""

    id: UUID

    # Basic info
    name: str
    code: str  # e.g., "US-NY-NYC", "US-CA-LA"
    level: JurisdictionLevel

    # Hierarchy
    parent_jurisdiction_id: UUID | None
    child_jurisdictions: list[dict]

    # Geographic coverage
    country: str
    state_province: str | None
    county: str | None
    city: str | None
    geographic_bounds: dict | None  # GeoJSON

    # Regulatory authority
    authority_name: str
    authority_website: str | None
    authority_contact_email: str | None
    authority_contact_phone: str | None

    # Requirements summary
    requirement_count: int
    last_updated: datetime

    # Status
    is_active: bool
    coverage_verified: bool

class RequirementType(str, Enum):
    INSPECTION = "inspection"
    TESTING = "testing"
    CERTIFICATION = "certification"
    REGISTRATION = "registration"
    REPORTING = "reporting"
    PERMIT = "permit"
    TRAINING = "training"

class ComplianceRequirement(BaseModel):
    """A specific compliance requirement."""

    id: UUID
    jurisdiction_id: UUID
    jurisdiction_name: str

    # Requirement info
    name: str
    code: str  # Regulation reference
    description: str
    requirement_type: RequirementType

    # Applicability
    equipment_types: list[str]  # ['elevator', 'escalator', 'dumbwaiter']
    equipment_categories: list[str]  # ['hydraulic', 'traction', 'mrl']
    building_types: list[str] | None  # ['commercial', 'residential', 'industrial']
    building_height_threshold: int | None  # Floors
    building_age_threshold: int | None  # Years

    # Frequency
    frequency_type: str  # 'annual', 'semi_annual', 'quarterly', 'monthly', 'one_time', 'triggered'
    frequency_months: int | None
    trigger_conditions: list[str] | None  # For triggered requirements

    # Timing
    deadline_type: str  # 'anniversary', 'fixed_date', 'completion_based'
    deadline_month: int | None  # For fixed_date
    deadline_day: int | None
    grace_period_days: int

    # Responsible party
    responsible_party: str  # 'owner', 'contractor', 'manufacturer'
    requires_licensed_inspector: bool
    inspector_license_type: str | None

    # Documentation
    required_documentation: list[str]
    certificate_issued: bool
    certificate_validity_months: int | None

    # Penalties
    non_compliance_penalty: str | None
    penalty_amount: float | None
    can_result_in_shutdown: bool

    # Fees
    filing_fee: float | None
    inspection_fee: float | None
    fee_currency: str = "USD"

    # Reference
    regulation_url: str | None
    regulation_section: str | None

    # Status
    is_active: bool
    effective_date: date
    superseded_by_id: UUID | None

    # Metadata
    last_updated: datetime
    last_verified: datetime
```

**Database Schema:**

```sql
-- Jurisdictions
CREATE TABLE compliance_jurisdictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic info
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    level VARCHAR(30) NOT NULL,

    -- Hierarchy
    parent_jurisdiction_id UUID REFERENCES compliance_jurisdictions(id),

    -- Geographic
    country CHAR(2) NOT NULL,
    state_province VARCHAR(100),
    county VARCHAR(100),
    city VARCHAR(100),
    geographic_bounds JSONB,  -- GeoJSON polygon

    -- Authority
    authority_name VARCHAR(255) NOT NULL,
    authority_website TEXT,
    authority_contact_email VARCHAR(255),
    authority_contact_phone VARCHAR(50),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    coverage_verified BOOLEAN DEFAULT FALSE,
    last_verified_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance requirements
CREATE TABLE compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction_id UUID NOT NULL REFERENCES compliance_jurisdictions(id),

    -- Requirement info
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100),
    description TEXT,
    requirement_type VARCHAR(30) NOT NULL,

    -- Applicability
    equipment_types TEXT[] NOT NULL,
    equipment_categories TEXT[],
    building_types TEXT[],
    building_height_threshold INTEGER,
    building_age_threshold INTEGER,

    -- Frequency
    frequency_type VARCHAR(30) NOT NULL,
    frequency_months INTEGER,
    trigger_conditions TEXT[],

    -- Timing
    deadline_type VARCHAR(30) NOT NULL,
    deadline_month INTEGER,
    deadline_day INTEGER,
    grace_period_days INTEGER DEFAULT 0,

    -- Responsible party
    responsible_party VARCHAR(30) NOT NULL,
    requires_licensed_inspector BOOLEAN DEFAULT FALSE,
    inspector_license_type VARCHAR(100),

    -- Documentation
    required_documentation TEXT[],
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_validity_months INTEGER,

    -- Penalties
    non_compliance_penalty TEXT,
    penalty_amount DECIMAL(12, 2),
    can_result_in_shutdown BOOLEAN DEFAULT FALSE,

    -- Fees
    filing_fee DECIMAL(10, 2),
    inspection_fee DECIMAL(10, 2),
    fee_currency CHAR(3) DEFAULT 'USD',

    -- Reference
    regulation_url TEXT,
    regulation_section VARCHAR(100),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL,
    superseded_by_id UUID REFERENCES compliance_requirements(id),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_verified_at TIMESTAMPTZ,

    CONSTRAINT valid_frequency_type CHECK (
        frequency_type IN ('annual', 'semi_annual', 'quarterly', 'monthly', 'one_time', 'triggered')
    ),
    CONSTRAINT valid_deadline_type CHECK (
        deadline_type IN ('anniversary', 'fixed_date', 'completion_based')
    )
);

-- Indexes
CREATE INDEX idx_jurisdictions_parent ON compliance_jurisdictions(parent_jurisdiction_id);
CREATE INDEX idx_jurisdictions_location ON compliance_jurisdictions(country, state_province, city);
CREATE INDEX idx_requirements_jurisdiction ON compliance_requirements(jurisdiction_id);
CREATE INDEX idx_requirements_type ON compliance_requirements(requirement_type);
CREATE INDEX idx_requirements_equipment ON compliance_requirements USING GIN(equipment_types);
```

#### 3.4.1.2 Requirement Change Tracking

**Change Notification System:**

```
┌─────────────────────────────────────────────────────────────────┐
│               REQUIREMENT CHANGE NOTIFICATION                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CHANGE DETECTION:                                               │
│  ├── Monitor regulatory body websites                            │
│  ├── Subscribe to official bulletins                             │
│  ├── Industry association feeds                                  │
│  ├── Manual updates from legal team                              │
│  └── User-reported changes (verified)                            │
│                                                                  │
│  CHANGE TYPES:                                                   │
│  ├── NEW: New requirement added                                  │
│  ├── MODIFIED: Existing requirement changed                      │
│  ├── REMOVED: Requirement no longer applicable                   │
│  ├── DEADLINE: Deadline changed                                  │
│  └── FEE: Fee amount changed                                     │
│                                                                  │
│  NOTIFICATION FLOW:                                              │
│  1. Change detected/entered                                      │
│  2. Impact analysis (which buildings affected)                   │
│  3. Notification generated per building                          │
│  4. Email + in-app notification to owners                        │
│  5. Update compliance calendar                                   │
│  6. Generate action items if needed                              │
│                                                                  │
│  NOTIFICATION TIMING:                                            │
│  ├── Immediate: Safety-critical changes                          │
│  ├── Daily digest: Non-critical changes                          │
│  └── Monthly summary: Upcoming requirement reviews               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
GET    /api/v1/compliance/changes                        # List recent changes
GET    /api/v1/compliance/changes/{id}                   # Get change details
GET    /api/v1/buildings/{id}/compliance/changes         # Changes affecting building
POST   /api/v1/compliance/changes/{id}/acknowledge       # Acknowledge change
POST   /api/v1/compliance/changes/subscribe              # Subscribe to changes
```

---

### 3.4.2 Inspection Management System

#### 3.4.2.1 Inspection Scheduling

**API Endpoints:**

```
POST   /api/v1/buildings/{id}/inspections                # Schedule inspection
GET    /api/v1/buildings/{id}/inspections                # List inspections
GET    /api/v1/inspections/{id}                          # Get inspection details
PUT    /api/v1/inspections/{id}                          # Update inspection
DELETE /api/v1/inspections/{id}                          # Cancel inspection
POST   /api/v1/inspections/{id}/reschedule               # Reschedule
GET    /api/v1/inspections/calendar                      # Calendar view
```

**Inspection Types:**

| Type | Description | Frequency | Performed By |
|------|-------------|-----------|--------------|
| `annual_safety` | Annual safety inspection | Annual | Licensed inspector |
| `periodic_test` | Category 1/5 tests | 1-5 years | Licensed inspector |
| `routine_maintenance` | Regular maintenance check | Monthly | Contractor |
| `acceptance` | New installation | One-time | Authority |
| `major_alteration` | After major changes | As needed | Authority |
| `accident_investigation` | After incidents | As needed | Authority |
| `complaint` | Following complaint | As needed | Authority |
| `witness_test` | Witnessed tests | As needed | Authority + Contractor |

**Request Schema:**

```python
class InspectionStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"
    NO_SHOW = "no_show"

class InspectionResult(str, Enum):
    PASSED = "passed"
    PASSED_WITH_CONDITIONS = "passed_with_conditions"
    FAILED = "failed"
    INCOMPLETE = "incomplete"

class InspectionCreate(BaseModel):
    """Request to schedule an inspection."""

    building_id: UUID
    equipment_ids: list[UUID]  # Equipment to inspect

    # Inspection type
    inspection_type: str
    requirement_id: UUID | None  # Link to compliance requirement

    # Scheduling
    preferred_dates: list[date]
    preferred_time_window: str | None  # 'morning', 'afternoon', 'any'
    urgency: str = "standard"  # 'standard', 'urgent', 'emergency'

    # Inspector
    preferred_inspector_id: UUID | None
    inspector_requirements: list[str] | None  # License types needed

    # Preparation
    special_instructions: str | None
    access_requirements: str | None
    contact_name: str
    contact_phone: str

class InspectionResponse(BaseModel):
    """Response with inspection details."""

    id: UUID
    building_id: UUID
    building_name: str

    # Equipment
    equipment: list[dict]
    # [{"id": UUID, "name": "...", "type": "elevator"}]

    # Type
    inspection_type: str
    inspection_type_display: str
    requirement_id: UUID | None
    requirement_name: str | None

    # Schedule
    scheduled_date: date
    scheduled_time: time | None
    estimated_duration_hours: float
    status: InspectionStatus

    # Inspector
    inspector_id: UUID | None
    inspector_name: str | None
    inspector_company: str | None
    inspector_license: str | None

    # Results (after completion)
    result: InspectionResult | None
    result_date: date | None
    defects_found: int | None
    critical_defects: int | None

    # Certificate
    certificate_issued: bool
    certificate_number: str | None
    certificate_expiry: date | None
    certificate_document_id: UUID | None

    # Costs
    inspection_fee: float | None
    filing_fee: float | None
    total_cost: float | None

    # Contacts
    contact_name: str
    contact_phone: str

    # Metadata
    created_at: datetime
    updated_at: datetime
```

**Database Schema:**

```sql
-- Inspections
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES sites(id),

    -- Type
    inspection_type VARCHAR(50) NOT NULL,
    requirement_id UUID REFERENCES compliance_requirements(id),

    -- Schedule
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    estimated_duration_hours DECIMAL(4, 2),
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled',

    -- Inspector
    inspector_id UUID REFERENCES inspectors(id),
    inspector_confirmed BOOLEAN DEFAULT FALSE,
    inspector_confirmed_at TIMESTAMPTZ,

    -- Results
    result VARCHAR(30),
    result_date DATE,
    completion_notes TEXT,

    -- Certificate
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_number VARCHAR(100),
    certificate_expiry DATE,
    certificate_document_id UUID REFERENCES uploaded_files(id),

    -- Costs
    inspection_fee DECIMAL(10, 2),
    filing_fee DECIMAL(10, 2),
    payment_status VARCHAR(20),
    payment_reference VARCHAR(100),

    -- Contact
    contact_name VARCHAR(255),
    contact_phone VARCHAR(50),
    access_requirements TEXT,
    special_instructions TEXT,

    -- Regulatory
    regulatory_submission_required BOOLEAN DEFAULT FALSE,
    regulatory_submitted BOOLEAN DEFAULT FALSE,
    regulatory_submitted_at TIMESTAMPTZ,
    regulatory_reference VARCHAR(100),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),

    CONSTRAINT valid_status CHECK (
        status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled', 'no_show')
    ),
    CONSTRAINT valid_result CHECK (
        result IS NULL OR result IN ('passed', 'passed_with_conditions', 'failed', 'incomplete')
    )
);

-- Inspection equipment (many-to-many)
CREATE TABLE inspection_equipment (
    inspection_id UUID NOT NULL REFERENCES inspections(id),
    equipment_id UUID NOT NULL REFERENCES elevators(id),
    PRIMARY KEY (inspection_id, equipment_id)
);

-- Inspection reminders
CREATE TABLE inspection_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id),

    reminder_type VARCHAR(30) NOT NULL,  -- '30_days', '14_days', '7_days', '1_day'
    scheduled_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    channel VARCHAR(20) NOT NULL,  -- 'email', 'sms', 'push'
    recipient_id UUID REFERENCES users(id),

    UNIQUE(inspection_id, reminder_type, channel, recipient_id)
);

-- Indexes
CREATE INDEX idx_inspections_building ON inspections(building_id);
CREATE INDEX idx_inspections_date ON inspections(scheduled_date);
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_inspections_inspector ON inspections(inspector_id);
CREATE INDEX idx_inspection_equipment ON inspection_equipment(equipment_id);
```

#### 3.4.2.2 Digital Inspection Reports

**Inspection Report Structure:**

```python
class InspectionReport(BaseModel):
    """Digital inspection report."""

    id: UUID
    inspection_id: UUID

    # Report header
    report_number: str
    report_date: date
    inspector_name: str
    inspector_license: str
    inspector_signature_id: UUID | None

    # Building info
    building_name: str
    building_address: str
    building_id_number: str | None

    # Equipment inspected
    equipment_reports: list[dict]
    # [{
    #     "equipment_id": UUID,
    #     "equipment_type": "elevator",
    #     "equipment_number": "E-1",
    #     "manufacturer": "KONE",
    #     "model": "MonoSpace",
    #     "serial_number": "...",
    #     "capacity": "2500 lbs",
    #     "speed": "350 fpm",
    #     "result": "passed",
    #     "items_inspected": [...],
    #     "defects": [...]
    # }]

    # Inspection items
    inspection_checklist: list[dict]
    # [{
    #     "category": "Safety Devices",
    #     "item": "Governor",
    #     "code_reference": "ASME A17.1 2.26",
    #     "result": "pass" | "fail" | "n/a",
    #     "notes": "..."
    # }]

    # Defects
    defects: list[dict]
    # [{
    #     "id": UUID,
    #     "equipment_id": UUID,
    #     "severity": "critical" | "major" | "minor",
    #     "code_violation": "ASME A17.1 8.6.4.20",
    #     "description": "...",
    #     "recommended_action": "...",
    #     "deadline": date,
    #     "photo_ids": [UUID]
    # }]

    # Test results
    test_results: list[dict]
    # [{
    #     "test_name": "Safety Device Test",
    #     "test_type": "Category 1",
    #     "result": "pass",
    #     "measurements": {...}
    # }]

    # Overall result
    overall_result: str
    result_notes: str

    # Certificate info
    certificate_issued: bool
    certificate_number: str | None
    certificate_valid_until: date | None

    # Signatures
    inspector_signature: str | None
    witness_signature: str | None

    # Attachments
    photo_ids: list[UUID]
    document_ids: list[UUID]

    # Metadata
    created_at: datetime
    submitted_at: datetime | None
    approved_at: datetime | None
```

#### 3.4.2.3 Defect Tracking & Remediation

**API Endpoints:**

```
GET    /api/v1/buildings/{id}/defects                    # List defects
GET    /api/v1/defects/{id}                              # Get defect details
PUT    /api/v1/defects/{id}                              # Update defect
POST   /api/v1/defects/{id}/remediate                    # Mark remediated
POST   /api/v1/defects/{id}/verify                       # Verify remediation
GET    /api/v1/defects/summary                           # Defect summary
```

**Defect Workflow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEFECT REMEDIATION WORKFLOW                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DEFECT IDENTIFIED                                            │
│     ├── Inspector documents defect                               │
│     ├── Photos attached                                          │
│     ├── Code reference cited                                     │
│     ├── Severity assigned                                        │
│     └── Deadline calculated                                      │
│                                                                  │
│  2. NOTIFICATION                                                 │
│     ├── Building owner notified immediately                      │
│     ├── Service contractor notified                              │
│     ├── Added to compliance dashboard                            │
│     └── Work order created (optional)                            │
│                                                                  │
│  3. REMEDIATION PLANNING                                         │
│     ├── Contractor reviews defect                                │
│     ├── Proposes remediation plan                                │
│     ├── Estimates timeline                                       │
│     └── Owner approves plan                                      │
│                                                                  │
│  4. REMEDIATION EXECUTION                                        │
│     ├── Work performed                                           │
│     ├── Progress documented                                      │
│     ├── Photos of corrected condition                            │
│     └── Marked as remediated                                     │
│                                                                  │
│  5. VERIFICATION                                                 │
│     ├── Re-inspection scheduled (if required)                    │
│     ├── Inspector verifies correction                            │
│     ├── Defect closed                                            │
│     └── Compliance status updated                                │
│                                                                  │
│  6. DOCUMENTATION                                                │
│     ├── Full history preserved                                   │
│     ├── Available for audits                                     │
│     └── Included in compliance reports                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Defect Schema:**

```python
class DefectSeverity(str, Enum):
    CRITICAL = "critical"  # Immediate shutdown required
    MAJOR = "major"        # Correct within 30 days
    MINOR = "minor"        # Correct by next inspection

class DefectStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    REMEDIATED = "remediated"
    VERIFIED = "verified"
    CLOSED = "closed"
    DISPUTED = "disputed"

class ComplianceDefect(BaseModel):
    """A compliance defect requiring remediation."""

    id: UUID
    inspection_id: UUID
    equipment_id: UUID

    # Defect info
    severity: DefectSeverity
    code_reference: str
    description: str
    location: str

    # Status
    status: DefectStatus
    deadline: date
    extended_deadline: date | None
    extension_approved_by: str | None

    # Evidence
    defect_photo_ids: list[UUID]
    inspector_notes: str

    # Remediation
    remediation_plan: str | None
    remediation_assigned_to: UUID | None
    remediation_work_order_id: UUID | None
    remediated_at: datetime | None
    remediation_notes: str | None
    remediation_photo_ids: list[UUID]

    # Verification
    requires_reinspection: bool
    reinspection_id: UUID | None
    verified_at: datetime | None
    verified_by: UUID | None
    verification_notes: str | None

    # Regulatory
    reported_to_authority: bool
    authority_reference: str | None

    # Metadata
    identified_at: datetime
    updated_at: datetime
```

---

### 3.4.3 Inspector Network

#### 3.4.3.1 Inspector Directory

**API Endpoints:**

```
GET    /api/v1/inspectors                                # Search inspectors
GET    /api/v1/inspectors/{id}                           # Get inspector profile
POST   /api/v1/inspectors/register                       # Register as inspector
PUT    /api/v1/inspectors/{id}                           # Update profile
GET    /api/v1/inspectors/{id}/availability              # Get availability
POST   /api/v1/inspectors/{id}/availability              # Set availability
GET    /api/v1/inspectors/{id}/reviews                   # Get reviews
```

**Inspector Profile:**

```python
class InspectorProfile(BaseModel):
    """Inspector profile in the network."""

    id: UUID
    user_id: UUID

    # Basic info
    name: str
    company_name: str | None
    bio: str
    profile_photo_url: str | None

    # Contact
    email: str
    phone: str
    address: dict

    # Licensing
    licenses: list[dict]
    # [{
    #     "type": "QEI",
    #     "number": "...",
    #     "jurisdiction": "New York",
    #     "issued_date": date,
    #     "expiry_date": date,
    #     "verified": bool
    # }]

    # Qualifications
    certifications: list[dict]
    years_experience: int
    equipment_specialties: list[str]
    manufacturer_authorizations: list[str]

    # Service area
    service_jurisdictions: list[str]
    service_radius_miles: int
    will_travel: bool
    travel_fee_per_mile: float | None

    # Availability
    accepting_new_clients: bool
    typical_response_time: str  # 'same_day', '1-3_days', '1_week'
    available_days: list[str]
    available_hours: dict  # {"start": "08:00", "end": "17:00"}

    # Pricing
    hourly_rate: float | None
    flat_rate_available: bool
    rate_negotiable: bool
    accepts_sitesync_payment: bool

    # Stats
    inspections_completed: int
    average_rating: float
    review_count: int
    on_time_rate: float
    response_rate: float

    # Status
    is_active: bool
    is_verified: bool
    background_check_date: date | None

class InspectorAvailability(BaseModel):
    """Inspector's availability calendar."""

    inspector_id: UUID

    # Regular hours
    regular_hours: dict
    # {
    #     "monday": {"start": "08:00", "end": "17:00"},
    #     "tuesday": {"start": "08:00", "end": "17:00"},
    #     ...
    # }

    # Blocked dates
    blocked_dates: list[dict]
    # [{"date": date, "reason": "vacation"}]

    # Booked slots
    booked_slots: list[dict]
    # [{"date": date, "start": "09:00", "end": "12:00", "inspection_id": UUID}]

    # Available slots (computed)
    available_slots: list[dict]
    # [{"date": date, "start": "13:00", "end": "17:00"}]
```

**Database Schema:**

```sql
-- Inspectors
CREATE TABLE inspectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id),

    -- Basic info
    company_name VARCHAR(255),
    bio TEXT,
    profile_photo_id UUID REFERENCES uploaded_files(id),

    -- Contact
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address JSONB,

    -- Service area
    service_jurisdictions TEXT[],
    service_radius_miles INTEGER DEFAULT 50,
    will_travel BOOLEAN DEFAULT FALSE,
    travel_fee_per_mile DECIMAL(6, 2),

    -- Availability
    accepting_new_clients BOOLEAN DEFAULT TRUE,
    typical_response_time VARCHAR(20),
    regular_hours JSONB,

    -- Pricing
    hourly_rate DECIMAL(8, 2),
    flat_rate_available BOOLEAN DEFAULT FALSE,
    rate_negotiable BOOLEAN DEFAULT FALSE,
    accepts_sitesync_payment BOOLEAN DEFAULT TRUE,

    -- Stats (denormalized)
    inspections_completed INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2),
    review_count INTEGER DEFAULT 0,
    on_time_rate DECIMAL(5, 2),
    response_rate DECIMAL(5, 2),

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    background_check_date DATE,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inspector licenses
CREATE TABLE inspector_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspector_id UUID NOT NULL REFERENCES inspectors(id),

    -- License info
    license_type VARCHAR(50) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    jurisdiction_id UUID REFERENCES compliance_jurisdictions(id),
    jurisdiction_name VARCHAR(100) NOT NULL,

    -- Dates
    issued_date DATE NOT NULL,
    expiry_date DATE,

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    verification_document_id UUID REFERENCES uploaded_files(id),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    UNIQUE(inspector_id, license_type, jurisdiction_name)
);

-- Inspector blocked dates
CREATE TABLE inspector_blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspector_id UUID NOT NULL REFERENCES inspectors(id),

    blocked_date DATE NOT NULL,
    block_type VARCHAR(20) NOT NULL,  -- 'all_day', 'morning', 'afternoon'
    reason VARCHAR(255),

    UNIQUE(inspector_id, blocked_date, block_type)
);

-- Inspector reviews
CREATE TABLE inspector_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspector_id UUID NOT NULL REFERENCES inspectors(id),
    inspection_id UUID NOT NULL REFERENCES inspections(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),

    -- Rating
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    professionalism_rating INTEGER CHECK (professionalism_rating BETWEEN 1 AND 5),
    thoroughness_rating INTEGER CHECK (thoroughness_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),

    -- Review
    review_text TEXT,
    would_recommend BOOLEAN,

    -- Response
    inspector_response TEXT,
    response_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(inspection_id, reviewer_id)
);

-- Indexes
CREATE INDEX idx_inspectors_jurisdictions ON inspectors USING GIN(service_jurisdictions);
CREATE INDEX idx_inspectors_rating ON inspectors(average_rating DESC) WHERE is_active = TRUE;
CREATE INDEX idx_inspector_licenses_inspector ON inspector_licenses(inspector_id);
CREATE INDEX idx_inspector_licenses_jurisdiction ON inspector_licenses(jurisdiction_id);
CREATE INDEX idx_inspector_reviews_inspector ON inspector_reviews(inspector_id);
```

#### 3.4.3.2 Inspector Booking System

**Booking Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    INSPECTOR BOOKING FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. SEARCH                                                       │
│     ├── Building owner enters inspection need                    │
│     ├── System determines jurisdiction requirements              │
│     ├── Filters inspectors by license/qualification              │
│     ├── Shows available inspectors with ratings                  │
│     └── Displays pricing and availability                        │
│                                                                  │
│  2. SELECT                                                       │
│     ├── Owner views inspector profiles                           │
│     ├── Reviews ratings and past work                            │
│     ├── Checks availability calendar                             │
│     └── Selects inspector and time slot                          │
│                                                                  │
│  3. REQUEST                                                      │
│     ├── Booking request sent to inspector                        │
│     ├── Building details shared                                  │
│     ├── Equipment info provided                                  │
│     └── Special requirements noted                               │
│                                                                  │
│  4. CONFIRMATION                                                 │
│     ├── Inspector reviews request                                │
│     ├── Accepts or proposes alternative                          │
│     ├── Payment authorization                                    │
│     └── Booking confirmed                                        │
│                                                                  │
│  5. PREPARATION                                                  │
│     ├── Pre-inspection checklist sent to owner                   │
│     ├── Equipment access instructions                            │
│     ├── Reminders sent (7 days, 1 day, morning of)               │
│     └── Inspector receives building packet                       │
│                                                                  │
│  6. COMPLETION                                                   │
│     ├── Inspection performed                                     │
│     ├── Report submitted                                         │
│     ├── Payment processed                                        │
│     └── Review requested                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.4.4 Compliance Automation

#### 3.4.4.1 Compliance Dashboard

**Dashboard Components:**

```python
class ComplianceDashboard(BaseModel):
    """Building compliance dashboard."""

    building_id: UUID
    building_name: str
    as_of: datetime

    # Overall status
    overall_status: str  # 'compliant', 'at_risk', 'non_compliant'
    compliance_score: int  # 0-100

    # Summary
    total_requirements: int
    compliant_count: int
    at_risk_count: int  # Due within 30 days
    overdue_count: int
    not_applicable_count: int

    # Upcoming deadlines
    upcoming_deadlines: list[dict]
    # [{
    #     "requirement_name": "Annual Safety Inspection",
    #     "equipment_name": "Elevator 1",
    #     "deadline": date,
    #     "days_remaining": 15,
    #     "status": "scheduled" | "needs_scheduling"
    # }]

    # Open defects
    open_defects: dict
    # {
    #     "critical": 0,
    #     "major": 2,
    #     "minor": 5
    # }

    # Recent activity
    recent_inspections: list[dict]
    recent_certificates: list[dict]
    recent_defect_closures: list[dict]

    # Equipment status
    equipment_compliance: list[dict]
    # [{
    #     "equipment_id": UUID,
    #     "equipment_name": "Elevator 1",
    #     "status": "compliant",
    #     "next_requirement": "...",
    #     "next_deadline": date
    # }]

    # Cost summary
    ytd_compliance_costs: float
    projected_annual_costs: float
```

#### 3.4.4.2 Automated Scheduling

**Auto-Scheduling Rules:**

```python
class AutoSchedulingConfig(BaseModel):
    """Configuration for automatic inspection scheduling."""

    building_id: UUID

    # Enable/disable
    auto_schedule_enabled: bool

    # Timing
    schedule_days_before_deadline: int = 30
    preferred_days_of_week: list[str]  # ['monday', 'tuesday', 'wednesday']
    preferred_time_window: str  # 'morning', 'afternoon', 'any'
    blackout_dates: list[date]

    # Inspector preferences
    preferred_inspector_ids: list[UUID]
    require_same_inspector: bool = False
    auto_assign_inspector: bool = True

    # Notifications
    notify_on_schedule: bool = True
    notify_contacts: list[UUID]

    # Approvals
    require_approval: bool = True
    auto_approve_under_amount: float | None  # Auto-approve if cost < amount
```

#### 3.4.4.3 Regulatory Submission

**Submission Types:**

| Type | Description | Method | Timing |
|------|-------------|--------|--------|
| `inspection_report` | Submit inspection results | API/Portal/Email | After inspection |
| `certificate_application` | Apply for certificate | API/Portal | After passing |
| `defect_notification` | Report critical defects | API/Portal | Immediate |
| `annual_registration` | Annual equipment registration | API/Portal | Before expiry |
| `accident_report` | Report incidents | Portal/Mail | Within timeframe |

**API Endpoints:**

```
POST   /api/v1/compliance/submissions                    # Submit to authority
GET    /api/v1/compliance/submissions                    # List submissions
GET    /api/v1/compliance/submissions/{id}               # Get submission status
POST   /api/v1/compliance/submissions/{id}/retry         # Retry failed submission
```

**Submission Schema:**

```python
class RegulatorySubmission(BaseModel):
    """Regulatory submission record."""

    id: UUID
    building_id: UUID
    jurisdiction_id: UUID

    # Submission info
    submission_type: str
    reference_id: UUID  # inspection_id, certificate_id, etc.

    # Authority
    authority_name: str
    submission_method: str  # 'api', 'portal', 'email', 'mail'

    # Status
    status: str  # 'pending', 'submitted', 'accepted', 'rejected', 'requires_action'
    submitted_at: datetime | None
    response_received_at: datetime | None

    # Reference numbers
    submission_reference: str | None
    authority_reference: str | None

    # Response
    response_status: str | None
    response_notes: str | None
    required_actions: list[str] | None

    # Documents
    submitted_document_ids: list[UUID]
    response_document_ids: list[UUID]

    # Fees
    fee_amount: float | None
    fee_paid: bool
    payment_reference: str | None
```

---

## Success Metrics

### Phase 3.4 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Jurisdictions covered | 50+ | US + Canada major cities |
| Buildings using compliance | 1,000+ | Active buildings |
| Inspectors in network | 200+ | Verified inspectors |
| Inspections booked | 500+/month | Monthly bookings |
| Auto-scheduling adoption | 30%+ | Buildings with auto-schedule |
| Defect closure rate | 95%+ | Closed before deadline |
| On-time inspection rate | 98%+ | Completed by deadline |

### KPIs

1. **Compliance Effectiveness**
   - Inspection completion rate
   - Defect closure rate
   - Average time to remediation
   - Non-compliance incidents prevented

2. **User Adoption**
   - Dashboard usage frequency
   - Auto-scheduling adoption
   - Digital report adoption
   - Inspector booking vs. manual

3. **Inspector Network**
   - Inspector utilization rate
   - Average response time
   - Review ratings
   - Network coverage by jurisdiction

4. **Business Metrics**
   - Inspection booking revenue
   - Regulatory submission fees
   - Inspector platform fees
   - Premium feature adoption

---

## Implementation Notes

### Jurisdiction Rollout Priority

| Priority | Jurisdictions | Rationale |
|----------|---------------|-----------|
| P0 | New York City | Largest, complex requirements |
| P0 | Chicago | Major market |
| P0 | Los Angeles | Large market |
| P1 | Boston, Philadelphia | Established markets |
| P1 | San Francisco | Tech-forward |
| P2 | Major Canadian cities | International expansion |
| P2 | Other US metros | Volume markets |

### Data Sources for Requirements

1. **Official regulatory codes** (ASME A17.1/CSA B44)
2. **State/local amendments**
3. **Authority websites and bulletins**
4. **Industry associations** (NAESA, NEIEP)
5. **Legal counsel review**
6. **Inspector community feedback**

### Risk Considerations

1. **Regulatory accuracy**: Incorrect requirements could cause non-compliance
   - Mitigation: Multiple verification sources, legal review, user reporting

2. **Inspector quality**: Network quality varies
   - Mitigation: Verification, ratings, background checks, quality standards

3. **Liability exposure**: Platform involved in compliance
   - Mitigation: Clear terms, disclaimers, E&O insurance, advisory only positioning

4. **Regulatory relationships**: Authorities may resist private platforms
   - Mitigation: Partner approach, demonstrate value, pilot programs

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
