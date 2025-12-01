# Phase 2.1: Universal Job Marketplace

## Overview

The Universal Job Marketplace creates a multi-tiered employment ecosystem connecting building service professionals across all roles with job opportunities ranging from internal company transfers to global positions. The system leverages AI for intelligent matching, integrates with reputation/certification systems, and supports various employment types from emergency coverage to permanent positions.

## Core Philosophy

### Multi-Level Job Visibility
```
┌─────────────────────────────────────────────────────────────────┐
│                        GLOBAL MARKETPLACE                        │
│   Cross-industry positions visible to all verified users         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    INDUSTRY LEVEL                            │ │
│  │   Trade-specific jobs (elevator, HVAC, electrical, etc.)    │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │                 REGIONAL LEVEL                          ││ │
│  │  │   Jobs within geographic regions (city, state, country) ││ │
│  │  │  ┌─────────────────────────────────────────────────────┐││ │
│  │  │  │              NETWORK LEVEL                          │││ │
│  │  │  │   Jobs shared within contractor networks            │││ │
│  │  │  │  ┌─────────────────────────────────────────────────┐│││ │
│  │  │  │  │           COMPANY INTERNAL                      ││││ │
│  │  │  │  │   Internal postings, transfers, promotions      ││││ │
│  │  │  │  └─────────────────────────────────────────────────┘│││ │
│  │  │  └─────────────────────────────────────────────────────┘││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Job Types Supported
1. **Permanent Positions** - Full-time employment opportunities
2. **Contract Work** - Fixed-term project-based contracts
3. **Temporary Coverage** - Fill-in work for vacations, leaves
4. **Emergency Staffing** - Urgent same-day or next-day needs
5. **Apprenticeships** - Training positions for newcomers
6. **Management Roles** - Building managers, property directors
7. **Internal Transfers** - Company internal movements
8. **Subcontract Opportunities** - Overflow work from contractors

---

## Data Models

### Enums and Types

```python
from enum import Enum
from decimal import Decimal
from datetime import datetime, date, time
from uuid import UUID
from pydantic import BaseModel, Field

class JobType(str, Enum):
    PERMANENT = "permanent"
    CONTRACT = "contract"
    TEMPORARY = "temporary"
    EMERGENCY = "emergency"
    APPRENTICESHIP = "apprenticeship"
    INTERNSHIP = "internship"
    SUBCONTRACT = "subcontract"

class JobCategory(str, Enum):
    # Technical Trades
    ELEVATOR_TECHNICIAN = "elevator_technician"
    ELEVATOR_MECHANIC = "elevator_mechanic"
    ELEVATOR_HELPER = "elevator_helper"
    ELEVATOR_INSPECTOR = "elevator_inspector"
    HVAC_TECHNICIAN = "hvac_technician"
    HVAC_ENGINEER = "hvac_engineer"
    ELECTRICAL_TECHNICIAN = "electrical_technician"
    ELECTRICIAN = "electrician"
    PLUMBER = "plumber"
    FIRE_SAFETY_TECH = "fire_safety_tech"
    BUILDING_AUTOMATION = "building_automation"
    SECURITY_SYSTEMS = "security_systems"
    GENERAL_MAINTENANCE = "general_maintenance"

    # Management
    BUILDING_MANAGER = "building_manager"
    PROPERTY_MANAGER = "property_manager"
    FACILITIES_DIRECTOR = "facilities_director"
    MAINTENANCE_SUPERVISOR = "maintenance_supervisor"
    OPERATIONS_MANAGER = "operations_manager"
    REGIONAL_MANAGER = "regional_manager"

    # Support Roles
    DISPATCHER = "dispatcher"
    COORDINATOR = "coordinator"
    ADMINISTRATOR = "administrator"
    ESTIMATOR = "estimator"
    INSPECTOR = "inspector"

class JobVisibility(str, Enum):
    INTERNAL = "internal"           # Company employees only
    NETWORK = "network"             # Partner/network companies
    REGIONAL = "regional"           # Geographic region
    INDUSTRY = "industry"           # Specific trade/industry
    GLOBAL = "global"               # All verified users

class ExperienceLevel(str, Enum):
    ENTRY = "entry"                 # 0-1 years
    JUNIOR = "junior"               # 1-3 years
    MID = "mid"                     # 3-5 years
    SENIOR = "senior"               # 5-10 years
    EXPERT = "expert"               # 10+ years
    LEAD = "lead"                   # Leadership experience
    ANY = "any"                     # No requirement

class CompensationType(str, Enum):
    HOURLY = "hourly"
    SALARY = "salary"
    CONTRACT_TOTAL = "contract_total"
    DAY_RATE = "day_rate"
    NEGOTIABLE = "negotiable"

class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    VIEWED = "viewed"
    SHORTLISTED = "shortlisted"
    INTERVIEW_SCHEDULED = "interview_scheduled"
    INTERVIEW_COMPLETED = "interview_completed"
    OFFER_EXTENDED = "offer_extended"
    OFFER_ACCEPTED = "offer_accepted"
    OFFER_DECLINED = "offer_declined"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
    HIRED = "hired"

class UrgencyLevel(str, Enum):
    STANDARD = "standard"           # Normal hiring timeline
    PRIORITY = "priority"           # Need within 2 weeks
    URGENT = "urgent"               # Need within days
    EMERGENCY = "emergency"         # Need immediately (same-day)
```

### Core Job Listing Model

```python
class JobListing(BaseModel):
    """Core job listing model"""
    id: UUID
    organization_id: UUID

    # Basic Info
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=100)
    job_category: JobCategory
    job_type: JobType
    visibility: JobVisibility

    # Requirements
    experience_level: ExperienceLevel
    required_certifications: list[str] = []
    preferred_certifications: list[str] = []
    required_skills: list[str] = []
    preferred_skills: list[str] = []
    required_licenses: list[str] = []
    manufacturer_experience: list[str] = []  # e.g., ["Otis", "ThyssenKrupp"]
    equipment_types: list[str] = []

    # Location
    location_type: str  # "on_site", "remote", "hybrid"
    address: str | None
    city: str
    state_province: str
    country: str
    postal_code: str | None
    region_id: UUID | None
    travel_required: bool = False
    travel_percentage: int | None  # 0-100
    relocation_offered: bool = False
    relocation_assistance: str | None

    # Compensation
    compensation_type: CompensationType
    salary_min: Decimal | None
    salary_max: Decimal | None
    currency: str = "USD"
    show_compensation: bool = True
    benefits_summary: str | None
    benefits_details: list[str] = []

    # Schedule
    schedule_type: str  # "full_time", "part_time", "flexible"
    hours_per_week: int | None
    shift_type: str | None  # "day", "night", "rotating", "on_call"
    start_date: date | None
    end_date: date | None  # For contracts/temp
    duration_months: int | None

    # Urgency & Timeline
    urgency: UrgencyLevel = UrgencyLevel.STANDARD
    application_deadline: datetime | None
    target_hire_date: date | None
    positions_available: int = 1
    positions_filled: int = 0

    # Posting Controls
    status: str = "draft"  # draft, active, paused, filled, closed, expired
    posted_at: datetime | None
    expires_at: datetime | None
    auto_renew: bool = False
    featured: bool = False

    # Contact
    hiring_manager_id: UUID | None
    contact_email: str | None
    contact_phone: str | None

    # AI Enhancement
    ai_optimized: bool = False
    embedding: list[float] | None  # For semantic search
    match_keywords: list[str] = []  # AI-extracted keywords

    # Metrics
    views_count: int = 0
    applications_count: int = 0
    shortlisted_count: int = 0

    # Timestamps
    created_at: datetime
    updated_at: datetime
    created_by: UUID

    class Config:
        from_attributes = True


class EmergencyJobListing(BaseModel):
    """Specialized model for emergency/same-day staffing needs"""
    id: UUID
    organization_id: UUID

    # Urgent Details
    title: str
    description: str
    job_category: JobCategory
    urgency: UrgencyLevel = UrgencyLevel.EMERGENCY

    # When/Where
    site_id: UUID | None  # Specific site if applicable
    site_name: str
    address: str
    date_needed: date
    time_start: time
    time_end: time | None
    estimated_hours: float

    # What's Needed
    required_skills: list[str]
    equipment_context: str | None  # "Otis Gen2, stuck between floors"

    # Compensation
    pay_rate: Decimal
    pay_type: str  # "hourly", "flat_rate"
    currency: str = "USD"
    overtime_rate: Decimal | None

    # Visibility
    broadcast_radius_miles: int = 50
    visibility: JobVisibility = JobVisibility.INDUSTRY

    # Status
    status: str = "active"  # active, filled, cancelled, expired
    filled_by: UUID | None

    # Notifications
    notifications_sent: int = 0
    responses_count: int = 0

    created_at: datetime
    expires_at: datetime


class JobApplication(BaseModel):
    """Job application with full tracking"""
    id: UUID
    job_id: UUID
    applicant_id: UUID

    # Application Content
    cover_letter: str | None
    resume_document_id: UUID | None  # Link to document system
    portfolio_url: str | None

    # Applicant Snapshot (frozen at application time)
    applicant_snapshot: dict  # Profile data at time of application
    certifications_at_application: list[dict]
    experience_years: float
    reputation_score: float | None

    # Questions & Answers
    screening_answers: list[dict] = []  # Answers to job-specific questions

    # AI Analysis
    ai_match_score: float | None  # 0-100
    ai_match_reasons: list[str] = []
    ai_concerns: list[str] = []
    ai_summary: str | None

    # Status Tracking
    status: ApplicationStatus = ApplicationStatus.SUBMITTED
    status_history: list[dict] = []

    # Interview
    interviews: list[dict] = []
    interview_notes: str | None
    interview_rating: int | None  # 1-5

    # Offer
    offer_details: dict | None
    offer_sent_at: datetime | None
    offer_response_at: datetime | None

    # Rejection
    rejection_reason: str | None
    rejection_feedback: str | None
    send_rejection_feedback: bool = False

    # Communication
    messages_count: int = 0
    last_message_at: datetime | None

    # Timestamps
    applied_at: datetime
    viewed_at: datetime | None
    updated_at: datetime

    class Config:
        from_attributes = True


class JobAlert(BaseModel):
    """User job alert preferences"""
    id: UUID
    user_id: UUID

    # Filter Criteria
    job_categories: list[JobCategory] = []
    job_types: list[JobType] = []
    experience_levels: list[ExperienceLevel] = []

    # Location Preferences
    locations: list[str] = []  # Cities or regions
    remote_only: bool = False
    max_distance_miles: int | None
    home_coordinates: tuple[float, float] | None

    # Compensation
    min_salary: Decimal | None
    compensation_types: list[CompensationType] = []

    # Skills/Requirements
    matching_skills: list[str] = []
    required_manufacturers: list[str] = []

    # Alert Settings
    alert_frequency: str = "daily"  # "instant", "daily", "weekly"
    email_enabled: bool = True
    push_enabled: bool = True
    sms_enabled: bool = False

    # Status
    is_active: bool = True
    last_sent_at: datetime | None
    matches_count: int = 0

    created_at: datetime
    updated_at: datetime


class TechnicianAvailability(BaseModel):
    """Technician availability for emergency/temp work"""
    id: UUID
    user_id: UUID

    # Availability Status
    available_for_emergency: bool = False
    available_for_temp: bool = False
    available_for_subcontract: bool = False

    # Schedule
    available_days: list[str] = []  # ["monday", "tuesday", ...]
    available_hours_start: time | None
    available_hours_end: time | None
    timezone: str = "America/New_York"

    # Location
    service_radius_miles: int = 50
    home_coordinates: tuple[float, float] | None
    willing_to_travel: bool = False

    # Rate Expectations
    min_hourly_rate: Decimal | None
    min_daily_rate: Decimal | None
    currency: str = "USD"

    # Skills/Capabilities
    skills: list[str] = []
    certifications: list[str] = []
    equipment_experience: list[str] = []
    manufacturers: list[str] = []

    # Notification Preferences
    notify_emergency: bool = True
    notify_temp: bool = True
    notify_subcontract: bool = True
    notification_method: str = "push"  # "push", "sms", "email"

    # Status
    is_active: bool = True
    last_active_at: datetime | None
    response_rate: float = 0.0  # Historical response rate
    avg_response_time_minutes: float | None

    updated_at: datetime
```

---

## Database Schema

```sql
-- Job listings table
CREATE TABLE job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    -- Basic Info
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    job_category VARCHAR(50) NOT NULL,
    job_type VARCHAR(30) NOT NULL,
    visibility VARCHAR(20) NOT NULL DEFAULT 'regional',

    -- Requirements (JSONB for flexibility)
    experience_level VARCHAR(20) NOT NULL,
    required_certifications JSONB DEFAULT '[]',
    preferred_certifications JSONB DEFAULT '[]',
    required_skills JSONB DEFAULT '[]',
    preferred_skills JSONB DEFAULT '[]',
    required_licenses JSONB DEFAULT '[]',
    manufacturer_experience JSONB DEFAULT '[]',
    equipment_types JSONB DEFAULT '[]',

    -- Location
    location_type VARCHAR(20) NOT NULL DEFAULT 'on_site',
    address TEXT,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    region_id UUID REFERENCES regions(id),
    coordinates POINT,  -- For proximity search
    travel_required BOOLEAN DEFAULT FALSE,
    travel_percentage INTEGER,
    relocation_offered BOOLEAN DEFAULT FALSE,
    relocation_assistance TEXT,

    -- Compensation
    compensation_type VARCHAR(30) NOT NULL,
    salary_min DECIMAL(12, 2),
    salary_max DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    show_compensation BOOLEAN DEFAULT TRUE,
    benefits_summary TEXT,
    benefits_details JSONB DEFAULT '[]',

    -- Schedule
    schedule_type VARCHAR(20) NOT NULL DEFAULT 'full_time',
    hours_per_week INTEGER,
    shift_type VARCHAR(20),
    start_date DATE,
    end_date DATE,
    duration_months INTEGER,

    -- Urgency & Timeline
    urgency VARCHAR(20) DEFAULT 'standard',
    application_deadline TIMESTAMPTZ,
    target_hire_date DATE,
    positions_available INTEGER DEFAULT 1,
    positions_filled INTEGER DEFAULT 0,

    -- Posting Controls
    status VARCHAR(20) DEFAULT 'draft',
    posted_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    auto_renew BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,

    -- Contact
    hiring_manager_id UUID REFERENCES users(id),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),

    -- AI Enhancement
    ai_optimized BOOLEAN DEFAULT FALSE,
    embedding vector(1536),
    match_keywords JSONB DEFAULT '[]',

    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(city, '')), 'C')
    ) STORED,

    -- Metrics
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    shortlisted_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),

    CONSTRAINT valid_salary CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max),
    CONSTRAINT valid_positions CHECK (positions_filled <= positions_available)
);

-- Indexes for job listings
CREATE INDEX idx_job_listings_org ON job_listings(organization_id);
CREATE INDEX idx_job_listings_category ON job_listings(job_category);
CREATE INDEX idx_job_listings_type ON job_listings(job_type);
CREATE INDEX idx_job_listings_visibility ON job_listings(visibility);
CREATE INDEX idx_job_listings_status ON job_listings(status);
CREATE INDEX idx_job_listings_location ON job_listings(city, state_province, country);
CREATE INDEX idx_job_listings_coordinates ON job_listings USING GIST(coordinates);
CREATE INDEX idx_job_listings_search ON job_listings USING GIN(search_vector);
CREATE INDEX idx_job_listings_embedding ON job_listings USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX idx_job_listings_posted ON job_listings(posted_at DESC) WHERE status = 'active';
CREATE INDEX idx_job_listings_urgency ON job_listings(urgency, posted_at DESC) WHERE status = 'active';


-- Emergency job listings (separate table for speed)
CREATE TABLE emergency_job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    job_category VARCHAR(50) NOT NULL,
    urgency VARCHAR(20) DEFAULT 'emergency',

    -- When/Where
    site_id UUID REFERENCES sites(id),
    site_name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    coordinates POINT NOT NULL,
    date_needed DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME,
    estimated_hours DECIMAL(4, 1),

    -- What's Needed
    required_skills JSONB DEFAULT '[]',
    equipment_context TEXT,

    -- Compensation
    pay_rate DECIMAL(10, 2) NOT NULL,
    pay_type VARCHAR(20) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    overtime_rate DECIMAL(10, 2),

    -- Visibility
    broadcast_radius_miles INTEGER DEFAULT 50,
    visibility VARCHAR(20) DEFAULT 'industry',

    -- Status
    status VARCHAR(20) DEFAULT 'active',
    filled_by UUID REFERENCES users(id),
    filled_at TIMESTAMPTZ,

    -- Metrics
    notifications_sent INTEGER DEFAULT 0,
    responses_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_emergency_jobs_status ON emergency_job_listings(status);
CREATE INDEX idx_emergency_jobs_date ON emergency_job_listings(date_needed);
CREATE INDEX idx_emergency_jobs_location ON emergency_job_listings USING GIST(coordinates);
CREATE INDEX idx_emergency_jobs_category ON emergency_job_listings(job_category);


-- Job applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES users(id),

    -- Application Content
    cover_letter TEXT,
    resume_document_id UUID REFERENCES documents(id),
    portfolio_url VARCHAR(500),

    -- Applicant Snapshot
    applicant_snapshot JSONB NOT NULL,
    certifications_at_application JSONB DEFAULT '[]',
    experience_years DECIMAL(4, 1),
    reputation_score DECIMAL(5, 2),

    -- Questions & Answers
    screening_answers JSONB DEFAULT '[]',

    -- AI Analysis
    ai_match_score DECIMAL(5, 2),
    ai_match_reasons JSONB DEFAULT '[]',
    ai_concerns JSONB DEFAULT '[]',
    ai_summary TEXT,

    -- Status Tracking
    status VARCHAR(30) DEFAULT 'submitted',
    status_history JSONB DEFAULT '[]',

    -- Interview
    interviews JSONB DEFAULT '[]',
    interview_notes TEXT,
    interview_rating INTEGER CHECK (interview_rating BETWEEN 1 AND 5),

    -- Offer
    offer_details JSONB,
    offer_sent_at TIMESTAMPTZ,
    offer_response_at TIMESTAMPTZ,

    -- Rejection
    rejection_reason VARCHAR(100),
    rejection_feedback TEXT,
    send_rejection_feedback BOOLEAN DEFAULT FALSE,

    -- Communication
    messages_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMPTZ,

    -- Timestamps
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    viewed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_application UNIQUE(job_id, applicant_id)
);

CREATE INDEX idx_applications_job ON job_applications(job_id);
CREATE INDEX idx_applications_applicant ON job_applications(applicant_id);
CREATE INDEX idx_applications_status ON job_applications(status);
CREATE INDEX idx_applications_score ON job_applications(ai_match_score DESC NULLS LAST);


-- Job screening questions
CREATE TABLE job_screening_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,

    question_text TEXT NOT NULL,
    question_type VARCHAR(30) NOT NULL, -- "text", "multiple_choice", "yes_no", "number"
    options JSONB, -- For multiple choice
    required BOOLEAN DEFAULT TRUE,
    order_index INTEGER NOT NULL,

    -- Deal-breaker settings
    is_knockout BOOLEAN DEFAULT FALSE,
    knockout_answer TEXT, -- The answer that disqualifies

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_screening_questions_job ON job_screening_questions(job_id);


-- Job alerts
CREATE TABLE job_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Filter Criteria
    job_categories JSONB DEFAULT '[]',
    job_types JSONB DEFAULT '[]',
    experience_levels JSONB DEFAULT '[]',

    -- Location
    locations JSONB DEFAULT '[]',
    remote_only BOOLEAN DEFAULT FALSE,
    max_distance_miles INTEGER,
    home_coordinates POINT,

    -- Compensation
    min_salary DECIMAL(12, 2),
    compensation_types JSONB DEFAULT '[]',

    -- Skills
    matching_skills JSONB DEFAULT '[]',
    required_manufacturers JSONB DEFAULT '[]',

    -- Settings
    alert_frequency VARCHAR(20) DEFAULT 'daily',
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,

    is_active BOOLEAN DEFAULT TRUE,
    last_sent_at TIMESTAMPTZ,
    matches_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_alerts_user ON job_alerts(user_id);
CREATE INDEX idx_job_alerts_active ON job_alerts(is_active) WHERE is_active = TRUE;


-- Technician availability for temp/emergency work
CREATE TABLE technician_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) UNIQUE,

    -- Availability Status
    available_for_emergency BOOLEAN DEFAULT FALSE,
    available_for_temp BOOLEAN DEFAULT FALSE,
    available_for_subcontract BOOLEAN DEFAULT FALSE,

    -- Schedule
    available_days JSONB DEFAULT '[]',
    available_hours_start TIME,
    available_hours_end TIME,
    timezone VARCHAR(50) DEFAULT 'America/New_York',

    -- Location
    service_radius_miles INTEGER DEFAULT 50,
    home_coordinates POINT,
    willing_to_travel BOOLEAN DEFAULT FALSE,

    -- Rates
    min_hourly_rate DECIMAL(10, 2),
    min_daily_rate DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',

    -- Capabilities (denormalized for fast matching)
    skills JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    equipment_experience JSONB DEFAULT '[]',
    manufacturers JSONB DEFAULT '[]',

    -- Notifications
    notify_emergency BOOLEAN DEFAULT TRUE,
    notify_temp BOOLEAN DEFAULT TRUE,
    notify_subcontract BOOLEAN DEFAULT TRUE,
    notification_method VARCHAR(20) DEFAULT 'push',

    is_active BOOLEAN DEFAULT TRUE,
    last_active_at TIMESTAMPTZ,
    response_rate DECIMAL(5, 2) DEFAULT 0,
    avg_response_time_minutes DECIMAL(8, 2),

    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tech_availability_active ON technician_availability(is_active)
    WHERE is_active = TRUE AND (available_for_emergency OR available_for_temp OR available_for_subcontract);
CREATE INDEX idx_tech_availability_location ON technician_availability USING GIST(home_coordinates);
CREATE INDEX idx_tech_availability_emergency ON technician_availability(available_for_emergency)
    WHERE is_active = TRUE AND available_for_emergency = TRUE;


-- Saved jobs (bookmarks)
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_saved_job UNIQUE(user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user ON saved_jobs(user_id);


-- Job views tracking
CREATE TABLE job_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    view_duration_seconds INTEGER,
    source VARCHAR(50)  -- "search", "alert", "direct", "referral"
);

CREATE INDEX idx_job_views_job ON job_views(job_id);
CREATE INDEX idx_job_views_time ON job_views(viewed_at);


-- Interview scheduling
CREATE TABLE job_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,

    interview_type VARCHAR(50) NOT NULL, -- "phone", "video", "in_person", "technical"
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location TEXT,  -- Address or video link

    interviewers JSONB DEFAULT '[]',  -- List of interviewer user IDs

    status VARCHAR(30) DEFAULT 'scheduled', -- "scheduled", "completed", "cancelled", "rescheduled", "no_show"

    notes TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback JSONB,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interviews_application ON job_interviews(application_id);
CREATE INDEX idx_interviews_scheduled ON job_interviews(scheduled_at);


-- Job offer tracking
CREATE TABLE job_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,

    -- Offer Details
    position_title VARCHAR(200) NOT NULL,
    compensation_type VARCHAR(30) NOT NULL,
    salary_offered DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',

    start_date DATE,
    benefits_offered JSONB DEFAULT '[]',
    additional_terms TEXT,

    -- Status
    status VARCHAR(30) DEFAULT 'pending', -- "pending", "accepted", "declined", "expired", "withdrawn"
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,

    -- If declined
    decline_reason TEXT,
    counter_offer_requested BOOLEAN DEFAULT FALSE,

    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_offers_application ON job_offers(application_id);
CREATE INDEX idx_offers_status ON job_offers(status);


-- Contract/Subcontract opportunities (different from jobs - for overflow work)
CREATE TABLE contract_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    -- Contract Details
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    contract_type VARCHAR(30) NOT NULL, -- "subcontract", "overflow", "specialized", "project"
    trade VARCHAR(50) NOT NULL,

    -- Scope
    scope_summary TEXT,
    estimated_hours DECIMAL(8, 1),
    estimated_duration_days INTEGER,
    equipment_count INTEGER,
    site_count INTEGER,

    -- Location
    region VARCHAR(100),
    sites JSONB DEFAULT '[]',  -- List of site IDs or addresses

    -- Compensation
    rate_type VARCHAR(20) NOT NULL, -- "hourly", "per_unit", "flat_rate"
    rate_amount DECIMAL(12, 2),
    total_budget DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',

    -- Requirements
    required_certifications JSONB DEFAULT '[]',
    insurance_requirements JSONB,

    -- Timeline
    start_date DATE,
    end_date DATE,
    response_deadline TIMESTAMPTZ,

    -- Visibility
    visibility VARCHAR(20) DEFAULT 'network',
    invited_organizations JSONB DEFAULT '[]',

    status VARCHAR(20) DEFAULT 'open', -- "open", "in_negotiation", "awarded", "completed", "cancelled"
    awarded_to UUID REFERENCES organizations(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id)
);

CREATE INDEX idx_contracts_org ON contract_opportunities(organization_id);
CREATE INDEX idx_contracts_status ON contract_opportunities(status);
CREATE INDEX idx_contracts_trade ON contract_opportunities(trade);


-- Contract bids
CREATE TABLE contract_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contract_opportunities(id) ON DELETE CASCADE,
    bidder_organization_id UUID NOT NULL REFERENCES organizations(id),

    -- Bid Details
    proposed_rate DECIMAL(12, 2),
    proposed_total DECIMAL(12, 2),
    rate_type VARCHAR(20),

    proposal_text TEXT,
    attachments JSONB DEFAULT '[]',

    -- Timeline
    proposed_start_date DATE,
    proposed_end_date DATE,

    -- Status
    status VARCHAR(30) DEFAULT 'submitted', -- "submitted", "under_review", "shortlisted", "selected", "rejected", "withdrawn"

    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_by UUID NOT NULL REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,

    CONSTRAINT unique_contract_bid UNIQUE(contract_id, bidder_organization_id)
);

CREATE INDEX idx_bids_contract ON contract_bids(contract_id);
CREATE INDEX idx_bids_bidder ON contract_bids(bidder_organization_id);
```

---

## API Design

### Job Listings Endpoints

```python
from fastapi import APIRouter, Depends, Query, BackgroundTasks
from typing import Annotated

router = APIRouter(prefix="/api/v1/jobs", tags=["jobs"])


# ============ Job Listing CRUD ============

@router.post("/", response_model=JobListingResponse, status_code=201)
async def create_job_listing(
    job: JobListingCreate,
    background_tasks: BackgroundTasks,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> JobListingResponse:
    """Create a new job listing"""
    pass


@router.get("/{job_id}", response_model=JobListingDetail)
async def get_job_listing(
    job_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> JobListingDetail:
    """Get job listing details with AI match score for current user"""
    pass


@router.patch("/{job_id}", response_model=JobListingResponse)
async def update_job_listing(
    job_id: UUID,
    updates: JobListingUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> JobListingResponse:
    """Update job listing"""
    pass


@router.post("/{job_id}/publish")
async def publish_job_listing(
    job_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Publish a draft job listing"""
    pass


@router.post("/{job_id}/close")
async def close_job_listing(
    job_id: UUID,
    reason: str = Query(...),
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Close a job listing"""
    pass


# ============ Job Search ============

@router.get("/", response_model=JobSearchResponse)
async def search_jobs(
    # Text Search
    q: str | None = Query(None, description="Search query"),

    # Filters
    categories: list[JobCategory] | None = Query(None),
    job_types: list[JobType] | None = Query(None),
    experience_levels: list[ExperienceLevel] | None = Query(None),
    visibility: list[JobVisibility] | None = Query(None),
    urgency: list[UrgencyLevel] | None = Query(None),

    # Location
    city: str | None = None,
    state: str | None = None,
    country: str | None = None,
    near_lat: float | None = None,
    near_lng: float | None = None,
    radius_miles: int = 50,
    remote_only: bool = False,

    # Compensation
    min_salary: Decimal | None = None,
    max_salary: Decimal | None = None,

    # Skills/Requirements
    manufacturers: list[str] | None = Query(None),
    certifications: list[str] | None = Query(None),

    # Sorting
    sort_by: str = "relevance",  # "relevance", "posted_date", "salary", "distance"
    sort_order: str = "desc",

    # Pagination
    page: int = 1,
    page_size: int = 20,

    # AI Features
    use_semantic: bool = True,
    show_match_score: bool = True,

    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> JobSearchResponse:
    """Search jobs with AI-powered matching and ranking"""
    pass


@router.get("/recommended", response_model=list[JobRecommendation])
async def get_recommended_jobs(
    limit: int = Query(10, le=50),
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[JobRecommendation]:
    """Get AI-recommended jobs based on user profile and history"""
    pass


# ============ Applications ============

@router.post("/{job_id}/apply", response_model=ApplicationResponse, status_code=201)
async def apply_to_job(
    job_id: UUID,
    application: ApplicationCreate,
    background_tasks: BackgroundTasks,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ApplicationResponse:
    """Submit an application to a job"""
    pass


@router.get("/{job_id}/applications", response_model=list[ApplicationSummary])
async def get_job_applications(
    job_id: UUID,
    status: ApplicationStatus | None = None,
    sort_by: str = "match_score",
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[ApplicationSummary]:
    """Get applications for a job (employer view)"""
    pass


@router.get("/applications/{application_id}", response_model=ApplicationDetail)
async def get_application(
    application_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ApplicationDetail:
    """Get application details"""
    pass


@router.patch("/applications/{application_id}/status")
async def update_application_status(
    application_id: UUID,
    status: ApplicationStatus,
    notes: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Update application status"""
    pass


@router.post("/applications/{application_id}/interview", response_model=InterviewResponse)
async def schedule_interview(
    application_id: UUID,
    interview: InterviewCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InterviewResponse:
    """Schedule an interview"""
    pass


@router.post("/applications/{application_id}/offer", response_model=OfferResponse)
async def extend_offer(
    application_id: UUID,
    offer: OfferCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> OfferResponse:
    """Extend a job offer"""
    pass


# ============ User's Applications ============

@router.get("/my-applications", response_model=list[MyApplicationSummary])
async def get_my_applications(
    status: list[ApplicationStatus] | None = Query(None),
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[MyApplicationSummary]:
    """Get current user's job applications"""
    pass


@router.delete("/my-applications/{application_id}")
async def withdraw_application(
    application_id: UUID,
    reason: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Withdraw an application"""
    pass


# ============ Saved Jobs ============

@router.post("/{job_id}/save")
async def save_job(
    job_id: UUID,
    notes: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Save/bookmark a job"""
    pass


@router.delete("/{job_id}/save")
async def unsave_job(
    job_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Remove a saved job"""
    pass


@router.get("/saved", response_model=list[SavedJobSummary])
async def get_saved_jobs(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[SavedJobSummary]:
    """Get user's saved jobs"""
    pass


# ============ Job Alerts ============

@router.post("/alerts", response_model=JobAlertResponse, status_code=201)
async def create_job_alert(
    alert: JobAlertCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> JobAlertResponse:
    """Create a job alert"""
    pass


@router.get("/alerts", response_model=list[JobAlertResponse])
async def get_my_alerts(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[JobAlertResponse]:
    """Get user's job alerts"""
    pass


@router.patch("/alerts/{alert_id}", response_model=JobAlertResponse)
async def update_alert(
    alert_id: UUID,
    updates: JobAlertUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> JobAlertResponse:
    """Update a job alert"""
    pass


@router.delete("/alerts/{alert_id}")
async def delete_alert(
    alert_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Delete a job alert"""
    pass
```

### Emergency Jobs Endpoints

```python
router_emergency = APIRouter(prefix="/api/v1/emergency-jobs", tags=["emergency-jobs"])


@router_emergency.post("/", response_model=EmergencyJobResponse, status_code=201)
async def create_emergency_job(
    job: EmergencyJobCreate,
    background_tasks: BackgroundTasks,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> EmergencyJobResponse:
    """Create an emergency job posting - immediately broadcasts to available techs"""
    pass


@router_emergency.get("/", response_model=list[EmergencyJobSummary])
async def get_emergency_jobs(
    near_lat: float | None = None,
    near_lng: float | None = None,
    radius_miles: int = 50,
    categories: list[JobCategory] | None = Query(None),
    date: date | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[EmergencyJobSummary]:
    """Get available emergency jobs near location"""
    pass


@router_emergency.post("/{job_id}/respond")
async def respond_to_emergency(
    job_id: UUID,
    available: bool,
    eta_minutes: int | None = None,
    message: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Respond to an emergency job (accept/decline)"""
    pass


@router_emergency.post("/{job_id}/assign")
async def assign_emergency_job(
    job_id: UUID,
    technician_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Assign emergency job to a technician"""
    pass


# ============ Technician Availability ============

@router_emergency.get("/availability/me", response_model=TechnicianAvailabilityResponse)
async def get_my_availability(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> TechnicianAvailabilityResponse:
    """Get current user's availability settings"""
    pass


@router_emergency.put("/availability/me", response_model=TechnicianAvailabilityResponse)
async def update_my_availability(
    availability: TechnicianAvailabilityUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> TechnicianAvailabilityResponse:
    """Update availability settings"""
    pass


@router_emergency.post("/availability/me/toggle")
async def toggle_availability(
    available_type: str,  # "emergency", "temp", "subcontract"
    is_available: bool,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Quick toggle for availability status"""
    pass
```

### Contract Opportunities Endpoints

```python
router_contracts = APIRouter(prefix="/api/v1/contracts", tags=["contracts"])


@router_contracts.post("/", response_model=ContractOpportunityResponse, status_code=201)
async def create_contract_opportunity(
    contract: ContractOpportunityCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ContractOpportunityResponse:
    """Create a contract/subcontract opportunity"""
    pass


@router_contracts.get("/", response_model=list[ContractOpportunitySummary])
async def search_contracts(
    trade: str | None = None,
    contract_type: str | None = None,
    region: str | None = None,
    min_budget: Decimal | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[ContractOpportunitySummary]:
    """Search contract opportunities"""
    pass


@router_contracts.get("/{contract_id}", response_model=ContractOpportunityDetail)
async def get_contract(
    contract_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ContractOpportunityDetail:
    """Get contract opportunity details"""
    pass


@router_contracts.post("/{contract_id}/bid", response_model=ContractBidResponse, status_code=201)
async def submit_bid(
    contract_id: UUID,
    bid: ContractBidCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ContractBidResponse:
    """Submit a bid on a contract opportunity"""
    pass


@router_contracts.get("/{contract_id}/bids", response_model=list[ContractBidSummary])
async def get_contract_bids(
    contract_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[ContractBidSummary]:
    """Get bids for a contract (contract owner only)"""
    pass


@router_contracts.post("/{contract_id}/award")
async def award_contract(
    contract_id: UUID,
    bid_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Award contract to a bidder"""
    pass
```

---

## AI-Powered Features

### Job Matching Service

```python
from typing import TypedDict
from anthropic import AsyncAnthropic
import numpy as np

class MatchScore(TypedDict):
    overall: float  # 0-100
    skills_match: float
    experience_match: float
    location_match: float
    certification_match: float
    culture_match: float
    reasons: list[str]
    concerns: list[str]
    recommendations: list[str]


class JobMatchingService:
    """AI-powered job matching and ranking"""

    def __init__(
        self,
        db: AsyncSession,
        anthropic: AsyncAnthropic,
        embedding_service: EmbeddingService
    ):
        self.db = db
        self.anthropic = anthropic
        self.embedding_service = embedding_service

    async def calculate_match_score(
        self,
        job: JobListing,
        applicant: User,
        profile: TechnicianProfile | ManagerProfile
    ) -> MatchScore:
        """Calculate AI match score between job and applicant"""

        # 1. Calculate component scores
        skills_score = self._calculate_skills_match(
            job.required_skills,
            job.preferred_skills,
            profile.skills
        )

        experience_score = self._calculate_experience_match(
            job.experience_level,
            profile.experience_years
        )

        cert_score = self._calculate_certification_match(
            job.required_certifications,
            job.preferred_certifications,
            await self._get_user_certifications(applicant.id)
        )

        location_score = await self._calculate_location_match(
            job,
            profile
        )

        # 2. Get semantic similarity
        profile_embedding = await self._get_or_create_profile_embedding(profile)
        if job.embedding and profile_embedding:
            semantic_similarity = self._cosine_similarity(
                job.embedding,
                profile_embedding
            )
        else:
            semantic_similarity = 0.5

        # 3. Calculate weighted overall score
        overall = (
            skills_score * 0.30 +
            experience_score * 0.20 +
            cert_score * 0.20 +
            location_score * 0.15 +
            semantic_similarity * 100 * 0.15
        )

        # 4. Get AI analysis for detailed insights
        analysis = await self._get_ai_analysis(job, profile)

        return MatchScore(
            overall=round(overall, 1),
            skills_match=round(skills_score, 1),
            experience_match=round(experience_score, 1),
            location_match=round(location_score, 1),
            certification_match=round(cert_score, 1),
            culture_match=round(semantic_similarity * 100, 1),
            reasons=analysis["reasons"],
            concerns=analysis["concerns"],
            recommendations=analysis["recommendations"]
        )

    def _calculate_skills_match(
        self,
        required: list[str],
        preferred: list[str],
        user_skills: list[str]
    ) -> float:
        """Calculate skills match percentage"""
        if not required:
            return 100.0

        user_skills_lower = {s.lower() for s in user_skills}

        # Required skills - must have
        required_matched = sum(
            1 for s in required
            if s.lower() in user_skills_lower
        )
        required_score = (required_matched / len(required)) * 100 if required else 100

        # Preferred skills - bonus
        if preferred:
            preferred_matched = sum(
                1 for s in preferred
                if s.lower() in user_skills_lower
            )
            preferred_score = (preferred_matched / len(preferred)) * 20
        else:
            preferred_score = 0

        return min(100, required_score + preferred_score)

    def _calculate_experience_match(
        self,
        required_level: ExperienceLevel,
        user_years: float
    ) -> float:
        """Calculate experience level match"""
        level_ranges = {
            ExperienceLevel.ENTRY: (0, 1),
            ExperienceLevel.JUNIOR: (1, 3),
            ExperienceLevel.MID: (3, 5),
            ExperienceLevel.SENIOR: (5, 10),
            ExperienceLevel.EXPERT: (10, 50),
            ExperienceLevel.LEAD: (7, 50),
            ExperienceLevel.ANY: (0, 50),
        }

        min_years, max_years = level_ranges.get(required_level, (0, 50))

        if user_years >= min_years:
            return 100.0
        elif user_years >= min_years * 0.75:
            return 80.0
        elif user_years >= min_years * 0.5:
            return 60.0
        else:
            return max(20, user_years / min_years * 100)

    async def _get_ai_analysis(
        self,
        job: JobListing,
        profile: TechnicianProfile | ManagerProfile
    ) -> dict:
        """Get detailed AI analysis of job-candidate match"""

        prompt = f"""Analyze the match between this job and candidate:

JOB:
Title: {job.title}
Category: {job.job_category}
Requirements: {job.description}
Required Skills: {job.required_skills}
Required Certifications: {job.required_certifications}
Experience Level: {job.experience_level}
Location: {job.city}, {job.state_province}

CANDIDATE:
Experience: {profile.experience_years} years
Skills: {profile.skills}
Certifications: [from profile]
Location: [from profile]

Provide analysis in JSON format:
{{
    "reasons": ["list of 2-4 reasons this is a good match"],
    "concerns": ["list of 0-3 potential concerns or gaps"],
    "recommendations": ["list of 1-2 suggestions for the candidate"]
}}"""

        response = await self.anthropic.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )

        return json.loads(response.content[0].text)

    async def get_recommended_jobs(
        self,
        user_id: UUID,
        limit: int = 10
    ) -> list[JobRecommendation]:
        """Get personalized job recommendations"""

        # 1. Get user profile and history
        profile = await self._get_user_profile(user_id)
        applied_jobs = await self._get_applied_job_ids(user_id)
        viewed_jobs = await self._get_viewed_job_ids(user_id)

        # 2. Get profile embedding
        profile_embedding = await self._get_or_create_profile_embedding(profile)

        # 3. Find semantically similar jobs
        query = """
            SELECT
                j.*,
                1 - (j.embedding <=> $1::vector) as similarity
            FROM job_listings j
            WHERE j.status = 'active'
            AND j.id NOT IN (SELECT unnest($2::uuid[]))
            AND j.embedding IS NOT NULL
            ORDER BY j.embedding <=> $1::vector
            LIMIT $3
        """

        jobs = await self.db.execute(
            query,
            [profile_embedding, list(applied_jobs), limit * 2]
        )

        # 4. Calculate full match scores
        recommendations = []
        for job in jobs:
            score = await self.calculate_match_score(job, profile)
            recommendations.append(JobRecommendation(
                job=job,
                match_score=score["overall"],
                match_reasons=score["reasons"],
                recommendation_type=self._get_recommendation_type(job, viewed_jobs)
            ))

        # 5. Sort by match score and return top results
        recommendations.sort(key=lambda r: r.match_score, reverse=True)
        return recommendations[:limit]

    async def rank_applicants(
        self,
        job_id: UUID,
        applications: list[JobApplication]
    ) -> list[RankedApplicant]:
        """Rank applicants for a job by match score"""

        job = await self._get_job(job_id)
        ranked = []

        for app in applications:
            profile = await self._get_user_profile(app.applicant_id)
            score = await self.calculate_match_score(job, profile)

            ranked.append(RankedApplicant(
                application=app,
                match_score=score["overall"],
                skills_match=score["skills_match"],
                experience_match=score["experience_match"],
                reasons=score["reasons"],
                concerns=score["concerns"]
            ))

        ranked.sort(key=lambda r: r.match_score, reverse=True)
        return ranked


class EmergencyMatchingService:
    """Fast matching for emergency staffing needs"""

    async def find_available_technicians(
        self,
        emergency_job: EmergencyJobListing,
        max_results: int = 20
    ) -> list[AvailableTechnician]:
        """Find available technicians near emergency job"""

        # 1. Query available technicians within radius
        query = """
            SELECT
                ta.*,
                u.*,
                tp.*,
                ST_Distance(
                    ta.home_coordinates::geography,
                    ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
                ) / 1609.34 as distance_miles
            FROM technician_availability ta
            JOIN users u ON ta.user_id = u.id
            JOIN technician_profiles tp ON u.id = tp.user_id
            WHERE ta.is_active = TRUE
            AND ta.available_for_emergency = TRUE
            AND ta.notify_emergency = TRUE
            AND ST_DWithin(
                ta.home_coordinates::geography,
                ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
                $3 * 1609.34  -- Convert miles to meters
            )
            ORDER BY distance_miles ASC
            LIMIT $4
        """

        technicians = await self.db.execute(
            query,
            [
                emergency_job.coordinates.x,
                emergency_job.coordinates.y,
                emergency_job.broadcast_radius_miles,
                max_results * 2  # Get extra for filtering
            ]
        )

        # 2. Filter by skills and category match
        qualified = []
        for tech in technicians:
            if self._matches_requirements(tech, emergency_job):
                qualified.append(AvailableTechnician(
                    user_id=tech.user_id,
                    name=tech.full_name,
                    distance_miles=tech.distance_miles,
                    estimated_eta_minutes=self._estimate_eta(tech.distance_miles),
                    response_rate=tech.response_rate,
                    avg_response_time=tech.avg_response_time_minutes,
                    hourly_rate=tech.min_hourly_rate,
                    skills_match=self._calculate_skills_overlap(
                        emergency_job.required_skills,
                        tech.skills
                    )
                ))

        return qualified[:max_results]

    async def broadcast_emergency(
        self,
        emergency_job: EmergencyJobListing,
        technicians: list[AvailableTechnician]
    ) -> int:
        """Send emergency notifications to available technicians"""

        notifications_sent = 0

        for tech in technicians:
            # Get notification preference
            pref = await self._get_notification_preference(tech.user_id)

            notification = EmergencyNotification(
                title=f"🚨 Emergency: {emergency_job.title}",
                body=f"{emergency_job.site_name} - {emergency_job.estimated_hours}hrs - ${emergency_job.pay_rate}/hr",
                data={
                    "type": "emergency_job",
                    "job_id": str(emergency_job.id),
                    "expires_at": emergency_job.expires_at.isoformat()
                }
            )

            # Send via preferred method
            if pref.notification_method == "push":
                await self._send_push(tech.user_id, notification)
            elif pref.notification_method == "sms":
                await self._send_sms(tech.user_id, notification)
            else:
                await self._send_email(tech.user_id, notification)

            notifications_sent += 1

        # Update job metrics
        await self._update_notifications_sent(
            emergency_job.id,
            notifications_sent
        )

        return notifications_sent
```

### Job Listing Optimizer

```python
class JobListingOptimizer:
    """AI service to optimize job listings for better results"""

    async def optimize_listing(
        self,
        listing: JobListing
    ) -> OptimizedListing:
        """Optimize a job listing with AI suggestions"""

        prompt = f"""Review and optimize this job listing:

TITLE: {listing.title}
DESCRIPTION: {listing.description}
REQUIREMENTS:
- Skills: {listing.required_skills}
- Certifications: {listing.required_certifications}
- Experience: {listing.experience_level}

COMPENSATION:
- Type: {listing.compensation_type}
- Range: {listing.salary_min} - {listing.salary_max} {listing.currency}

Provide improvements in JSON format:
{{
    "optimized_title": "improved title if needed, or null",
    "optimized_description": "improved description with better structure and keywords",
    "suggested_skills": ["any missing skills to add"],
    "salary_competitive": true/false,
    "market_salary_range": {{"min": X, "max": Y}},
    "improvement_tips": ["specific actionable suggestions"],
    "seo_keywords": ["keywords to improve searchability"],
    "estimated_applicant_increase": "X-Y%"
}}"""

        response = await self.anthropic.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )

        suggestions = json.loads(response.content[0].text)

        # Generate embedding for optimized content
        optimized_text = f"{suggestions.get('optimized_title', listing.title)} {suggestions.get('optimized_description', listing.description)}"
        embedding = await self.embedding_service.generate(optimized_text)

        return OptimizedListing(
            original=listing,
            suggestions=suggestions,
            embedding=embedding,
            keywords=suggestions.get("seo_keywords", [])
        )

    async def generate_screening_questions(
        self,
        listing: JobListing,
        num_questions: int = 5
    ) -> list[ScreeningQuestion]:
        """Generate relevant screening questions for a job"""

        prompt = f"""Generate {num_questions} screening questions for this job:

Title: {listing.title}
Category: {listing.job_category}
Required Skills: {listing.required_skills}
Required Certifications: {listing.required_certifications}
Key Requirements from Description: {listing.description[:500]}

Generate questions in JSON format:
{{
    "questions": [
        {{
            "question": "the question text",
            "type": "yes_no" | "multiple_choice" | "text" | "number",
            "options": ["for multiple choice only"],
            "is_knockout": true/false,
            "knockout_answer": "the disqualifying answer if knockout",
            "purpose": "what this question reveals"
        }}
    ]
}}

Include a mix of:
- Experience verification questions
- Technical competency questions
- Availability/logistics questions
- At least one knockout question for essential requirements"""

        response = await self.anthropic.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=800,
            messages=[{"role": "user", "content": prompt}]
        )

        result = json.loads(response.content[0].text)
        return [ScreeningQuestion(**q) for q in result["questions"]]
```

---

## Search Implementation

### Hybrid Search

```python
class JobSearchService:
    """Hybrid search combining full-text and semantic search"""

    async def search(
        self,
        params: JobSearchParams,
        user_id: UUID | None = None
    ) -> JobSearchResults:
        """Execute hybrid job search"""

        # Build base query with filters
        base_conditions = self._build_filter_conditions(params)

        if params.q and params.use_semantic:
            # Hybrid search: combine text and semantic
            return await self._hybrid_search(params, base_conditions, user_id)
        elif params.q:
            # Text-only search
            return await self._text_search(params, base_conditions, user_id)
        else:
            # Filter-only search
            return await self._filter_search(params, base_conditions, user_id)

    async def _hybrid_search(
        self,
        params: JobSearchParams,
        conditions: list,
        user_id: UUID | None
    ) -> JobSearchResults:
        """Combine full-text and semantic search with RRF"""

        # 1. Get query embedding
        query_embedding = await self.embedding_service.generate(params.q)

        # 2. Execute parallel searches
        text_results, semantic_results = await asyncio.gather(
            self._text_search_raw(params.q, conditions),
            self._semantic_search_raw(query_embedding, conditions)
        )

        # 3. Combine with Reciprocal Rank Fusion
        combined_scores = {}
        k = 60  # RRF constant

        for rank, job_id in enumerate(text_results):
            combined_scores[job_id] = combined_scores.get(job_id, 0) + 1 / (k + rank + 1)

        for rank, job_id in enumerate(semantic_results):
            combined_scores[job_id] = combined_scores.get(job_id, 0) + 1 / (k + rank + 1)

        # 4. Sort by combined score
        sorted_ids = sorted(combined_scores.keys(), key=lambda x: combined_scores[x], reverse=True)

        # 5. Fetch full job data
        jobs = await self._fetch_jobs_by_ids(sorted_ids)

        # 6. Calculate match scores if user is logged in
        if user_id and params.show_match_score:
            jobs = await self._add_match_scores(jobs, user_id)

        # 7. Apply location sorting if requested
        if params.sort_by == "distance" and params.near_lat and params.near_lng:
            jobs = self._sort_by_distance(jobs, params.near_lat, params.near_lng)

        return JobSearchResults(
            jobs=jobs[params.offset:params.offset + params.limit],
            total=len(jobs),
            page=params.page,
            has_more=len(jobs) > params.offset + params.limit
        )

    async def _text_search_raw(
        self,
        query: str,
        conditions: list
    ) -> list[UUID]:
        """Full-text search returning job IDs"""

        sql = """
            SELECT id, ts_rank(search_vector, websearch_to_tsquery('english', $1)) as rank
            FROM job_listings
            WHERE search_vector @@ websearch_to_tsquery('english', $1)
            AND status = 'active'
            {conditions}
            ORDER BY rank DESC
            LIMIT 100
        """

        results = await self.db.execute(sql.format(conditions=self._conditions_to_sql(conditions)), [query])
        return [r.id for r in results]

    async def _semantic_search_raw(
        self,
        embedding: list[float],
        conditions: list
    ) -> list[UUID]:
        """Semantic/vector search returning job IDs"""

        sql = """
            SELECT id, 1 - (embedding <=> $1::vector) as similarity
            FROM job_listings
            WHERE embedding IS NOT NULL
            AND status = 'active'
            {conditions}
            ORDER BY embedding <=> $1::vector
            LIMIT 100
        """

        results = await self.db.execute(sql.format(conditions=self._conditions_to_sql(conditions)), [embedding])
        return [r.id for r in results]

    def _build_filter_conditions(self, params: JobSearchParams) -> list[str]:
        """Build SQL conditions from search parameters"""
        conditions = []

        if params.categories:
            conditions.append(f"job_category IN ({','.join(repr(c) for c in params.categories)})")

        if params.job_types:
            conditions.append(f"job_type IN ({','.join(repr(t) for t in params.job_types)})")

        if params.experience_levels:
            conditions.append(f"experience_level IN ({','.join(repr(e) for e in params.experience_levels)})")

        if params.city:
            conditions.append(f"LOWER(city) = LOWER({repr(params.city)})")

        if params.state:
            conditions.append(f"LOWER(state_province) = LOWER({repr(params.state)})")

        if params.country:
            conditions.append(f"LOWER(country) = LOWER({repr(params.country)})")

        if params.near_lat and params.near_lng and params.radius_miles:
            conditions.append(f"""
                ST_DWithin(
                    coordinates::geography,
                    ST_SetSRID(ST_MakePoint({params.near_lng}, {params.near_lat}), 4326)::geography,
                    {params.radius_miles * 1609.34}
                )
            """)

        if params.remote_only:
            conditions.append("location_type = 'remote'")

        if params.min_salary:
            conditions.append(f"salary_max >= {params.min_salary}")

        if params.max_salary:
            conditions.append(f"salary_min <= {params.max_salary}")

        if params.manufacturers:
            for m in params.manufacturers:
                conditions.append(f"manufacturer_experience @> '[\"{m}\"]'")

        return conditions
```

---

## Real-Time Features

### WebSocket for Emergency Jobs

```python
from fastapi import WebSocket
from typing import Set

class EmergencyJobsWebSocket:
    """Real-time emergency job notifications"""

    def __init__(self):
        self.active_connections: dict[str, Set[WebSocket]] = {}  # region -> connections

    async def connect(self, websocket: WebSocket, user_id: UUID, region: str):
        await websocket.accept()
        if region not in self.active_connections:
            self.active_connections[region] = set()
        self.active_connections[region].add(websocket)

    async def disconnect(self, websocket: WebSocket, region: str):
        self.active_connections[region].discard(websocket)

    async def broadcast_emergency(
        self,
        emergency_job: EmergencyJobListing,
        regions: list[str]
    ):
        """Broadcast new emergency job to connected clients"""

        message = {
            "type": "new_emergency_job",
            "job": {
                "id": str(emergency_job.id),
                "title": emergency_job.title,
                "site_name": emergency_job.site_name,
                "date_needed": emergency_job.date_needed.isoformat(),
                "time_start": emergency_job.time_start.isoformat(),
                "pay_rate": str(emergency_job.pay_rate),
                "estimated_hours": emergency_job.estimated_hours,
                "category": emergency_job.job_category,
                "urgency": "EMERGENCY"
            }
        }

        for region in regions:
            if region in self.active_connections:
                for connection in self.active_connections[region]:
                    try:
                        await connection.send_json(message)
                    except:
                        await self.disconnect(connection, region)

    async def notify_job_filled(self, job_id: UUID, regions: list[str]):
        """Notify that an emergency job has been filled"""

        message = {
            "type": "emergency_job_filled",
            "job_id": str(job_id)
        }

        for region in regions:
            if region in self.active_connections:
                for connection in self.active_connections[region]:
                    try:
                        await connection.send_json(message)
                    except:
                        pass
```

---

## Background Jobs

### Alert Processing

```python
from celery import Celery

app = Celery('jobs')


@app.task
def process_job_alerts():
    """Process job alerts and send notifications"""

    # Get alerts due to be processed
    alerts = get_due_alerts()

    for alert in alerts:
        matches = find_matching_jobs(alert)

        if matches:
            if alert.email_enabled:
                send_job_alert_email(alert.user_id, matches)

            if alert.push_enabled:
                send_job_alert_push(alert.user_id, matches)

            if alert.sms_enabled:
                send_job_alert_sms(alert.user_id, matches)

            update_alert_sent(alert.id, len(matches))


@app.task
def expire_job_listings():
    """Expire old job listings"""

    expired_count = db.execute("""
        UPDATE job_listings
        SET status = 'expired'
        WHERE status = 'active'
        AND expires_at < NOW()
    """)

    # Notify employers of expiring listings
    expiring_soon = db.execute("""
        SELECT * FROM job_listings
        WHERE status = 'active'
        AND expires_at BETWEEN NOW() AND NOW() + INTERVAL '3 days'
        AND NOT expiry_notification_sent
    """)

    for job in expiring_soon:
        send_expiry_reminder(job)
        mark_notification_sent(job.id)


@app.task
def calculate_market_insights():
    """Calculate job market insights and salary data"""

    # Aggregate salary data by category and region
    insights = db.execute("""
        SELECT
            job_category,
            city,
            state_province,
            country,
            AVG(salary_min) as avg_salary_min,
            AVG(salary_max) as avg_salary_max,
            COUNT(*) as job_count,
            AVG(applications_count) as avg_applications
        FROM job_listings
        WHERE status IN ('active', 'filled', 'closed')
        AND posted_at > NOW() - INTERVAL '90 days'
        AND salary_min IS NOT NULL
        GROUP BY job_category, city, state_province, country
    """)

    # Store insights for salary benchmarking
    for insight in insights:
        upsert_market_insight(insight)
```

---

## Frontend Components

### Job Search Interface

```tsx
// components/jobs/JobSearch.tsx
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface JobSearchProps {
  onResults: (jobs: JobListing[]) => void;
}

export function JobSearch({ onResults }: JobSearchProps) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<JobFilters>({
    categories: [],
    jobTypes: [],
    experienceLevels: [],
    remoteOnly: false,
    location: null,
    radius: 50,
    minSalary: null,
    maxSalary: null,
  });
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    performSearch();
  }, [debouncedQuery, filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const results = await searchJobs({
        q: debouncedQuery,
        ...filters,
      });
      onResults(results.jobs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs, skills, or companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <CategoryFilter
          selected={filters.categories}
          onChange={(categories) => setFilters({...filters, categories})}
        />
        <JobTypeFilter
          selected={filters.jobTypes}
          onChange={(jobTypes) => setFilters({...filters, jobTypes})}
        />
        <ExperienceFilter
          selected={filters.experienceLevels}
          onChange={(levels) => setFilters({...filters, experienceLevels: levels})}
        />
        <LocationFilter
          location={filters.location}
          radius={filters.radius}
          onChange={(location, radius) => setFilters({...filters, location, radius})}
        />
        <Toggle
          label="Remote Only"
          checked={filters.remoteOnly}
          onChange={(remoteOnly) => setFilters({...filters, remoteOnly})}
        />
      </div>

      {/* Salary Range */}
      <SalaryRangeSlider
        min={filters.minSalary}
        max={filters.maxSalary}
        onChange={(min, max) => setFilters({...filters, minSalary: min, maxSalary: max})}
      />

      {loading && <LoadingSpinner />}
    </div>
  );
}


// components/jobs/JobCard.tsx
interface JobCardProps {
  job: JobListing;
  matchScore?: number;
  saved?: boolean;
  onSave: () => void;
  onApply: () => void;
}

export function JobCard({ job, matchScore, saved, onSave, onApply }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            {job.urgency === 'emergency' && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                🚨 URGENT
              </span>
            )}
            {job.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                ⭐ Featured
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            <Link href={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>

          <p className="text-gray-600 mb-2">{job.organization_name}</p>

          {/* Location & Type */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              {job.city}, {job.state_province}
            </span>
            <span className="flex items-center gap-1">
              <BriefcaseIcon className="h-4 w-4" />
              {formatJobType(job.job_type)}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              {formatTimeAgo(job.posted_at)}
            </span>
          </div>

          {/* Salary */}
          {job.show_compensation && job.salary_min && (
            <p className="text-green-600 font-medium mb-3">
              {formatSalary(job.salary_min, job.salary_max, job.compensation_type)}
            </p>
          )}

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2">
            {job.required_skills.slice(0, 5).map(skill => (
              <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {skill}
              </span>
            ))}
            {job.required_skills.length > 5 && (
              <span className="text-xs text-gray-500">+{job.required_skills.length - 5} more</span>
            )}
          </div>
        </div>

        {/* Right Side - Match Score & Actions */}
        <div className="flex flex-col items-end gap-3 ml-4">
          {matchScore !== undefined && (
            <div className={`text-center px-3 py-2 rounded-lg ${getMatchScoreColor(matchScore)}`}>
              <div className="text-2xl font-bold">{matchScore}%</div>
              <div className="text-xs">Match</div>
            </div>
          )}

          <button
            onClick={onSave}
            className={`p-2 rounded-full ${saved ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookmarkIcon className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={onApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}


// components/jobs/EmergencyJobBanner.tsx
export function EmergencyJobBanner({ job }: { job: EmergencyJobListing }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(job.expires_at).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
      } else {
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        setTimeLeft(`${hours}h ${mins}m left`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [job.expires_at]);

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-pulse-slow">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-600 font-bold text-lg">🚨 EMERGENCY</span>
            <span className="text-red-500 text-sm">{timeLeft}</span>
          </div>
          <h3 className="font-semibold text-gray-900">{job.title}</h3>
          <p className="text-gray-600">{job.site_name}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span>📍 {job.address}</span>
            <span>🕐 {formatTime(job.time_start)} - {job.estimated_hours}hrs</span>
            <span className="font-medium text-green-600">${job.pay_rate}/hr</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            View Details
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            I'm Available
          </button>
        </div>
      </div>
    </div>
  );
}


// components/jobs/ApplicationTracker.tsx
export function ApplicationTracker({ applications }: { applications: JobApplication[] }) {
  const stages = [
    { key: 'submitted', label: 'Applied', icon: PaperAirplaneIcon },
    { key: 'viewed', label: 'Viewed', icon: EyeIcon },
    { key: 'shortlisted', label: 'Shortlisted', icon: StarIcon },
    { key: 'interview_scheduled', label: 'Interview', icon: CalendarIcon },
    { key: 'offer_extended', label: 'Offer', icon: GiftIcon },
  ];

  return (
    <div className="space-y-4">
      {applications.map(app => (
        <div key={app.id} className="bg-white rounded-lg border p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold">{app.job_title}</h3>
              <p className="text-gray-600 text-sm">{app.company_name}</p>
              <p className="text-gray-500 text-xs">Applied {formatTimeAgo(app.applied_at)}</p>
            </div>
            {app.ai_match_score && (
              <div className={`px-2 py-1 rounded ${getMatchScoreColor(app.ai_match_score)}`}>
                {app.ai_match_score}% Match
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-1">
            {stages.map((stage, index) => {
              const isComplete = getStageOrder(app.status) >= index;
              const isCurrent = stages[getStageOrder(app.status)]?.key === stage.key;

              return (
                <div key={stage.key} className="flex items-center flex-1">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full
                    ${isComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                    ${isCurrent ? 'ring-2 ring-green-300' : ''}
                  `}>
                    <stage.icon className="h-4 w-4" />
                  </div>
                  {index < stages.length - 1 && (
                    <div className={`
                      flex-1 h-1 mx-1
                      ${isComplete && getStageOrder(app.status) > index ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Stage Labels */}
          <div className="flex justify-between mt-2">
            {stages.map(stage => (
              <span key={stage.key} className="text-xs text-gray-500">{stage.label}</span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {app.status === 'interview_scheduled' && (
              <button className="text-sm text-blue-600 hover:underline">
                View Interview Details
              </button>
            )}
            {app.status === 'offer_extended' && (
              <>
                <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                  Accept Offer
                </button>
                <button className="px-3 py-1 border text-sm rounded hover:bg-gray-50">
                  Decline
                </button>
              </>
            )}
            <button className="text-sm text-gray-600 hover:underline ml-auto">
              Withdraw Application
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Implementation Timeline

### Week 1-2: Core Job Infrastructure
- [ ] Database schema implementation
- [ ] Job listing CRUD operations
- [ ] Basic search with filters
- [ ] Job visibility/access control

### Week 3-4: Application System
- [ ] Application submission flow
- [ ] Application tracking and status updates
- [ ] Screening questions
- [ ] Employer applicant management

### Week 5-6: AI Features
- [ ] Job-candidate matching algorithm
- [ ] Semantic search with embeddings
- [ ] AI job recommendations
- [ ] Listing optimizer

### Week 7-8: Emergency Jobs & Availability
- [ ] Emergency job creation and broadcasting
- [ ] Technician availability management
- [ ] Real-time notifications
- [ ] WebSocket implementation

### Week 9-10: Advanced Features
- [ ] Interview scheduling
- [ ] Offer management
- [ ] Job alerts system
- [ ] Contract opportunities and bidding

### Week 11-12: Polish & Integration
- [ ] Frontend components
- [ ] Mobile responsiveness
- [ ] Analytics and reporting
- [ ] Integration with other SiteSync modules

---

## Success Metrics

### Engagement
- Jobs posted per month
- Applications per job
- Time to first application
- Application completion rate

### Matching Quality
- AI match score correlation with hire rate
- Candidate satisfaction with recommendations
- Employer satisfaction with applicant quality

### Emergency Staffing
- Average response time to emergency postings
- Fill rate for emergency jobs
- Technician availability pool size
- Response rate from notified technicians

### Platform Health
- Active job seekers (monthly)
- Active employers (monthly)
- Successful placements per month
- Average time to hire

---

## Security & Privacy

### Data Protection
- Salary information visibility controls
- Application data retention policies
- Right to be forgotten support
- GDPR/CCPA compliance

### Access Control
- Employers can only see applications to their jobs
- Applicant identity protection until mutual interest
- Anonymous browsing for job seekers
- Company internal jobs hidden from external users

### Fraud Prevention
- Job posting verification
- Employer identity verification
- Fake job detection
- Application spam prevention
