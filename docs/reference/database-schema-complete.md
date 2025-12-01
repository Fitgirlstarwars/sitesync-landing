# SiteSync V3 - Complete Database Schema

> Comprehensive PostgreSQL schema supporting the full ecosystem
> Version: 3.0.0
> Status: Design Phase

---

## Schema Overview

This document contains the complete database schema for SiteSync V3, organized by domain. All tables support:

- UUID primary keys (`gen_random_uuid()`)
- Row-Level Security (RLS) for multi-tenancy
- Audit timestamps (`created_at`, `updated_at`)
- Soft delete where applicable (`deleted_at`)

---

## Table of Contents

1. [Core Entities](#1-core-entities)
2. [Knowledge & Content](#2-knowledge--content)
3. [Forum & Community](#3-forum--community)
4. [Job Marketplace](#4-job-marketplace)
5. [Parts & Inventory](#5-parts--inventory)
6. [Training & Certification](#6-training--certification)
7. [Insurance & Compliance](#7-insurance--compliance)
8. [Tenant & Communication](#8-tenant--communication)
9. [Analytics & Metrics](#9-analytics--metrics)
10. [Audit & Security](#10-audit--security)

---

## 1. Core Entities

### 1.1 Organizations

```sql
-- ORGANIZATIONS (Multi-tenant Root)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url VARCHAR(500),

    -- Type
    organization_type VARCHAR(50) NOT NULL DEFAULT 'service_company',
    -- 'service_company', 'building_owner', 'manufacturer', 'supplier',
    -- 'insurance', 'trade_school', 'regulatory_body', 'individual'

    -- Contact
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website_url VARCHAR(500),

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Australia',

    -- Business Details
    abn VARCHAR(20),  -- Australian Business Number
    acn VARCHAR(20),  -- Australian Company Number

    -- Subscription
    subscription_tier VARCHAR(50) DEFAULT 'free',
    -- 'free', 'pro', 'expert', 'enterprise'
    subscription_started_at TIMESTAMPTZ,
    subscription_ends_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,

    -- Settings
    settings JSONB DEFAULT '{}',
    -- {
    --   "timezone": "Australia/Sydney",
    --   "date_format": "DD/MM/YYYY",
    --   "currency": "AUD",
    --   "language": "en-AU",
    --   "ai_enabled": true,
    --   "features": ["marketplace", "forums", "training"]
    -- }

    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verified_by UUID,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_org_slug ON organizations(slug);
CREATE INDEX idx_org_type ON organizations(organization_type);
CREATE INDEX idx_org_country ON organizations(country);
```

### 1.2 Users

```sql
-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,

    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMPTZ,

    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url VARCHAR(500),
    bio TEXT,

    -- User Type
    user_type VARCHAR(50) NOT NULL DEFAULT 'standard',
    -- 'standard', 'technician', 'manager', 'admin', 'system'

    -- Role & Permissions (within organization)
    role VARCHAR(50) DEFAULT 'user',
    -- 'owner', 'admin', 'manager', 'user', 'technician', 'readonly', 'guest'
    permissions TEXT[] DEFAULT '{}',

    -- Location
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Australia',
    timezone VARCHAR(50) DEFAULT 'Australia/Sydney',

    -- Status
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ,

    -- Notification Preferences
    notification_preferences JSONB DEFAULT '{
        "email": {"marketing": true, "updates": true, "jobs": true},
        "push": {"jobs": true, "messages": true, "alerts": true},
        "sms": {"emergency": true}
    }',

    -- Privacy
    privacy_settings JSONB DEFAULT '{
        "profile_visibility": "public",
        "show_email": false,
        "show_phone": false,
        "open_to_opportunities": false
    }',

    -- Metadata
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_org ON users(organization_id);
CREATE INDEX idx_user_type ON users(user_type);
CREATE INDEX idx_user_active ON users(is_active) WHERE is_active = true;
```

### 1.3 Technician Profiles (Platform-Wide)

```sql
-- TECHNICIAN PROFILES (Platform-wide, portable reputation)
CREATE TABLE technician_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Display
    headline VARCHAR(255),  -- "Master Elevator Technician | KONE Specialist"
    summary TEXT,

    -- Experience
    years_experience INTEGER,
    career_start_date DATE,
    primary_trade VARCHAR(100),  -- 'elevators', 'hvac', 'electrical', etc.

    -- Specializations
    specializations TEXT[],  -- ['KONE', 'Otis', 'door_systems', 'modernization']
    manufacturer_expertise TEXT[],
    equipment_types TEXT[],

    -- Metrics (computed from verified work)
    expertise_score INTEGER DEFAULT 0,  -- 0-100
    expertise_percentile INTEGER,  -- Top X%
    total_jobs_completed INTEGER DEFAULT 0,
    first_time_fix_rate DECIMAL(5,2),
    average_resolution_time_minutes INTEGER,
    buildings_served INTEGER DEFAULT 0,

    -- Contributions
    contributions_count INTEGER DEFAULT 0,
    technicians_helped INTEGER DEFAULT 0,
    estimated_hours_saved DECIMAL(10,2) DEFAULT 0,

    -- Badges (JSON array of badge objects)
    badges JSONB DEFAULT '[]',
    -- [{"id": "first_100", "name": "First 100", "awarded_at": "..."}]

    -- Career Level
    career_level VARCHAR(50) DEFAULT 'apprentice',
    -- 'apprentice', 'rising_star', 'trusted_expert', 'master', 'legend'

    -- Availability
    availability_status VARCHAR(50) DEFAULT 'employed',
    -- 'employed', 'open_to_opportunities', 'actively_looking', 'not_available'
    preferred_job_types TEXT[],  -- ['full_time', 'contract', 'project']
    preferred_locations TEXT[],
    willing_to_relocate BOOLEAN DEFAULT false,

    -- Privacy
    profile_visibility VARCHAR(50) DEFAULT 'public',
    -- 'public', 'employers_only', 'connections_only', 'private'
    show_current_employer BOOLEAN DEFAULT true,
    anonymous_contributions BOOLEAN DEFAULT false,

    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verification_level VARCHAR(50) DEFAULT 'basic',
    -- 'basic', 'identity', 'background_check', 'full'

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tech_profile_user ON technician_profiles(user_id);
CREATE INDEX idx_tech_profile_score ON technician_profiles(expertise_score DESC);
CREATE INDEX idx_tech_profile_trade ON technician_profiles(primary_trade);
CREATE INDEX idx_tech_profile_availability ON technician_profiles(availability_status);
CREATE INDEX idx_tech_profile_specs ON technician_profiles USING GIN(specializations);
```

### 1.4 Building Manager Profiles

```sql
-- BUILDING MANAGER PROFILES
CREATE TABLE manager_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Role
    manager_type VARCHAR(50) NOT NULL,
    -- 'facility_manager', 'building_manager', 'strata_manager',
    -- 'asset_manager', 'property_manager', 'operations_manager'

    -- Experience
    years_experience INTEGER,
    portfolio_size INTEGER,  -- Number of buildings/properties
    total_sqm_managed DECIMAL(12,2),

    -- Specializations
    property_types TEXT[],  -- ['commercial', 'residential', 'industrial']
    certifications TEXT[],

    -- Metrics
    buildings_managed INTEGER DEFAULT 0,
    average_building_health_score DECIMAL(5,2),

    -- Career
    availability_status VARCHAR(50) DEFAULT 'employed',
    preferred_property_types TEXT[],
    preferred_locations TEXT[],

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_manager_profile_user ON manager_profiles(user_id);
CREATE INDEX idx_manager_profile_type ON manager_profiles(manager_type);
```

### 1.5 Employment History

```sql
-- EMPLOYMENT HISTORY (for profiles)
CREATE TABLE employment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Employer
    organization_id UUID REFERENCES organizations(id),
    company_name VARCHAR(255) NOT NULL,  -- Fallback if not on platform

    -- Position
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Duration
    start_date DATE NOT NULL,
    end_date DATE,  -- NULL = current
    is_current BOOLEAN DEFAULT false,

    -- Details
    location VARCHAR(255),
    employment_type VARCHAR(50),  -- 'full_time', 'part_time', 'contract'

    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_by_org BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employment_user ON employment_history(user_id);
CREATE INDEX idx_employment_org ON employment_history(organization_id);
CREATE INDEX idx_employment_current ON employment_history(is_current) WHERE is_current = true;
```

### 1.6 Sites (Buildings)

```sql
-- SITES (Buildings/Locations)
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- Identity
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),  -- Short code like "COL-123"

    -- Type
    site_type VARCHAR(50) DEFAULT 'commercial',
    -- 'commercial', 'residential', 'mixed', 'industrial', 'healthcare',
    -- 'education', 'retail', 'hospitality', 'government'

    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Australia',

    -- Geolocation
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Building Details
    floors_count INTEGER,
    year_built INTEGER,
    total_area_sqm DECIMAL(12, 2),
    occupancy_count INTEGER,

    -- Contacts
    primary_contact_name VARCHAR(255),
    primary_contact_phone VARCHAR(50),
    primary_contact_email VARCHAR(255),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),

    -- Access
    access_instructions TEXT,
    access_codes JSONB DEFAULT '{}',  -- Encrypted in application
    after_hours_access TEXT,
    key_holder_info JSONB DEFAULT '[]',

    -- Health Score (computed)
    health_score INTEGER,  -- 0-100
    health_score_updated_at TIMESTAMPTZ,
    health_score_components JSONB DEFAULT '{}',

    -- Timezone
    timezone VARCHAR(50) DEFAULT 'Australia/Sydney',

    -- Settings
    settings JSONB DEFAULT '{}',

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_sites_org ON sites(organization_id);
CREATE INDEX idx_sites_code ON sites(organization_id, code);
CREATE INDEX idx_sites_type ON sites(site_type);
CREATE INDEX idx_sites_city ON sites(city, state);
CREATE INDEX idx_sites_health ON sites(health_score);
CREATE INDEX idx_sites_location ON sites USING GIST (
    point(longitude, latitude)
) WHERE latitude IS NOT NULL;

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY sites_org_isolation ON sites
    USING (organization_id = current_setting('app.current_org')::uuid);
```

### 1.7 Elevators (Assets)

```sql
-- ELEVATOR STATUS ENUM
CREATE TYPE elevator_status AS ENUM (
    'operational',
    'degraded',
    'out_of_service',
    'maintenance',
    'decommissioned'
);

-- ELEVATORS (Assets)
CREATE TABLE elevators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,

    -- Identification
    unit_number VARCHAR(50) NOT NULL,
    serial_number VARCHAR(100),
    registration_number VARCHAR(100),
    asset_tag VARCHAR(100),

    -- Equipment Details
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    controller_type VARCHAR(100),
    drive_type VARCHAR(100),
    machine_type VARCHAR(100),

    -- Specifications
    capacity_kg INTEGER,
    capacity_persons INTEGER,
    speed_mps DECIMAL(4, 2),
    floors_served INTEGER,
    stops INTEGER,
    travel_height_m DECIMAL(6, 2),
    door_type VARCHAR(50),
    door_width_mm INTEGER,
    car_dimensions JSONB,

    -- Dates
    installation_date DATE,
    modernization_date DATE,
    last_major_service DATE,

    -- Status
    status elevator_status DEFAULT 'operational',
    status_changed_at TIMESTAMPTZ DEFAULT NOW(),
    status_reason TEXT,

    -- Compliance
    last_inspection_date DATE,
    last_inspection_result VARCHAR(50),
    next_inspection_due DATE,
    inspection_certificate_number VARCHAR(100),

    -- Health (computed)
    health_score INTEGER,
    health_score_updated_at TIMESTAMPTZ,

    -- AI/Knowledge Links
    v2_document_ids INTEGER[],
    known_quirks TEXT[],

    -- Specifications (flexible)
    specifications JSONB DEFAULT '{}',

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    UNIQUE(organization_id, site_id, unit_number)
);

CREATE INDEX idx_elevators_org ON elevators(organization_id);
CREATE INDEX idx_elevators_site ON elevators(site_id);
CREATE INDEX idx_elevators_manufacturer ON elevators(manufacturer);
CREATE INDEX idx_elevators_status ON elevators(status);
CREATE INDEX idx_elevators_inspection ON elevators(next_inspection_due);

ALTER TABLE elevators ENABLE ROW LEVEL SECURITY;
CREATE POLICY elevators_org_isolation ON elevators
    USING (organization_id = current_setting('app.current_org')::uuid);
```

### 1.8 Contractors

```sql
-- CONTRACTORS
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- Link to user if on platform
    user_id UUID REFERENCES users(id),

    -- Type
    contractor_type VARCHAR(50) NOT NULL,
    -- 'employee', 'subcontractor', 'vendor', 'company'

    -- Company Info (if company)
    company_name VARCHAR(255),
    company_abn VARCHAR(20),
    company_license VARCHAR(100),

    -- Individual Info
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),

    -- Address
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),

    -- Professional
    license_number VARCHAR(100),
    license_expiry DATE,
    insurance_policy VARCHAR(100),
    insurance_expiry DATE,

    -- Specializations
    specializations TEXT[],
    trade_types TEXT[],
    manufacturer_certifications TEXT[],

    -- Rates
    hourly_rate DECIMAL(10, 2),
    callout_fee DECIMAL(10, 2),
    emergency_rate_multiplier DECIMAL(3, 2) DEFAULT 1.5,

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_preferred BOOLEAN DEFAULT false,

    -- Performance (computed)
    rating DECIMAL(3, 2),
    total_jobs_completed INTEGER DEFAULT 0,
    first_time_fix_rate DECIMAL(5, 2),
    average_response_time_minutes INTEGER,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_contractors_org ON contractors(organization_id);
CREATE INDEX idx_contractors_user ON contractors(user_id);
CREATE INDEX idx_contractors_active ON contractors(is_active) WHERE is_active = true;
CREATE INDEX idx_contractors_specs ON contractors USING GIN(specializations);

ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
CREATE POLICY contractors_org_isolation ON contractors
    USING (organization_id = current_setting('app.current_org')::uuid);
```

### 1.9 Work Orders

```sql
-- WORK ORDER ENUMS
CREATE TYPE work_order_status AS ENUM (
    'draft', 'pending', 'scheduled', 'in_progress',
    'on_hold', 'completed', 'cancelled', 'invoiced'
);

CREATE TYPE work_order_priority AS ENUM (
    'emergency', 'high', 'medium', 'low', 'scheduled'
);

CREATE TYPE work_order_type AS ENUM (
    'breakdown', 'preventive', 'inspection', 'installation',
    'modernization', 'callback', 'audit'
);

-- WORK ORDERS
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    elevator_id UUID NOT NULL REFERENCES elevators(id),
    site_id UUID NOT NULL REFERENCES sites(id),

    -- Identification
    work_order_number VARCHAR(50) NOT NULL,

    -- Classification
    type work_order_type NOT NULL,
    priority work_order_priority DEFAULT 'medium',
    status work_order_status DEFAULT 'draft',

    -- Description
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Fault Information
    fault_code VARCHAR(50),
    reported_symptoms TEXT[],
    affected_floors INTEGER[],

    -- Timing
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    due_date TIMESTAMPTZ,

    -- Assignment
    assigned_contractor_id UUID REFERENCES contractors(id),
    assigned_at TIMESTAMPTZ,
    assigned_by UUID REFERENCES users(id),

    -- Reporter
    reported_by_name VARCHAR(255),
    reported_by_phone VARCHAR(50),
    reported_by_email VARCHAR(255),
    reporter_user_id UUID REFERENCES users(id),

    -- AI Diagnosis
    ai_diagnosis_id UUID,
    ai_suggested_causes TEXT[],
    ai_suggested_parts TEXT[],
    ai_confidence DECIMAL(3, 2),
    ai_diagnosis_at TIMESTAMPTZ,

    -- Resolution
    resolution_notes TEXT,
    root_cause TEXT,
    resolution_type VARCHAR(50),

    -- Costs
    parts_cost DECIMAL(10, 2) DEFAULT 0,
    labor_cost DECIMAL(10, 2) DEFAULT 0,
    total_cost DECIMAL(10, 2) DEFAULT 0,

    -- Follow-up
    requires_followup BOOLEAN DEFAULT false,
    followup_notes TEXT,
    parent_work_order_id UUID REFERENCES work_orders(id),

    -- Custom Fields
    custom_fields JSONB DEFAULT '{}',

    -- Metadata
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    UNIQUE(organization_id, work_order_number)
);

CREATE INDEX idx_work_orders_org ON work_orders(organization_id);
CREATE INDEX idx_work_orders_elevator ON work_orders(elevator_id);
CREATE INDEX idx_work_orders_site ON work_orders(site_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_priority ON work_orders(priority);
CREATE INDEX idx_work_orders_contractor ON work_orders(assigned_contractor_id);
CREATE INDEX idx_work_orders_dates ON work_orders(scheduled_start, due_date);

ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY work_orders_org_isolation ON work_orders
    USING (organization_id = current_setting('app.current_org')::uuid);
```

---

## 2. Knowledge & Content

### 2.1 Knowledge Contributions

```sql
-- KNOWLEDGE CONTRIBUTION TYPES
CREATE TYPE contribution_type AS ENUM (
    'solution', 'tip', 'procedure', 'equipment_quirk', 'safety_note'
);

CREATE TYPE contribution_status AS ENUM (
    'draft', 'pending_review', 'approved', 'rejected', 'deprecated'
);

-- KNOWLEDGE CONTRIBUTIONS
CREATE TABLE knowledge_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Author
    author_id UUID NOT NULL REFERENCES users(id),
    author_profile_id UUID REFERENCES technician_profiles(id),
    organization_id UUID REFERENCES organizations(id),

    -- Content
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_html TEXT,  -- Rendered markdown
    contribution_type contribution_type NOT NULL,

    -- Context
    equipment_manufacturer VARCHAR(100),
    equipment_model VARCHAR(100),
    equipment_type VARCHAR(100),
    fault_code VARCHAR(50),
    tags TEXT[],

    -- Categorization
    trade VARCHAR(50),  -- 'elevators', 'hvac', etc.
    category VARCHAR(100),
    subcategory VARCHAR(100),

    -- Attribution
    attribution_type VARCHAR(50) DEFAULT 'full',
    -- 'full' (name + company), 'company' (company only), 'anonymous'

    -- Status
    status contribution_status DEFAULT 'pending_review',
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id),
    rejection_reason TEXT,

    -- Quality Metrics
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    quality_score DECIMAL(5, 2) DEFAULT 0,

    -- Impact Metrics
    times_viewed INTEGER DEFAULT 0,
    times_used INTEGER DEFAULT 0,
    technicians_helped INTEGER DEFAULT 0,
    estimated_hours_saved DECIMAL(10, 2) DEFAULT 0,

    -- AI Enhancement
    ai_enhanced BOOLEAN DEFAULT false,
    ai_summary TEXT,
    ai_keywords TEXT[],

    -- Versioning
    version INTEGER DEFAULT 1,
    parent_id UUID REFERENCES knowledge_contributions(id),

    -- Embedding for semantic search
    embedding vector(1536),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

CREATE INDEX idx_knowledge_author ON knowledge_contributions(author_id);
CREATE INDEX idx_knowledge_status ON knowledge_contributions(status);
CREATE INDEX idx_knowledge_type ON knowledge_contributions(contribution_type);
CREATE INDEX idx_knowledge_equipment ON knowledge_contributions(equipment_manufacturer, equipment_model);
CREATE INDEX idx_knowledge_fault ON knowledge_contributions(fault_code);
CREATE INDEX idx_knowledge_trade ON knowledge_contributions(trade);
CREATE INDEX idx_knowledge_tags ON knowledge_contributions USING GIN(tags);
CREATE INDEX idx_knowledge_embedding ON knowledge_contributions
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### 2.2 Knowledge Votes

```sql
-- KNOWLEDGE VOTES
CREATE TABLE knowledge_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contribution_id UUID NOT NULL REFERENCES knowledge_contributions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),

    vote_type VARCHAR(10) NOT NULL,  -- 'up', 'down'

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(contribution_id, user_id)
);

CREATE INDEX idx_knowledge_votes_contribution ON knowledge_votes(contribution_id);
```

### 2.3 Knowledge Usage Tracking

```sql
-- KNOWLEDGE USAGE (when someone uses a contribution to solve a problem)
CREATE TABLE knowledge_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contribution_id UUID NOT NULL REFERENCES knowledge_contributions(id),
    user_id UUID NOT NULL REFERENCES users(id),
    work_order_id UUID REFERENCES work_orders(id),

    -- Outcome
    was_helpful BOOLEAN,
    feedback TEXT,
    time_saved_minutes INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_usage_contribution ON knowledge_usage(contribution_id);
CREATE INDEX idx_knowledge_usage_user ON knowledge_usage(user_id);
```

### 2.4 Documents

```sql
-- DOCUMENT VISIBILITY
CREATE TYPE document_visibility AS ENUM (
    'public',           -- Anyone can access
    'platform',         -- Any SiteSync user
    'organization',     -- Only this organization
    'role_based',       -- Specific roles within org
    'building',         -- Linked to specific building
    'equipment',        -- Linked to specific equipment
    'private'           -- Owner only
);

-- DOCUMENTS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    uploaded_by UUID NOT NULL REFERENCES users(id),

    -- File Info
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100),
    storage_path VARCHAR(500) NOT NULL,
    storage_provider VARCHAR(50) DEFAULT 's3',

    -- Metadata
    title VARCHAR(255),
    description TEXT,

    -- Categorization
    document_type VARCHAR(50),
    -- 'manual', 'wiring_diagram', 'parts_catalog', 'safety_procedure',
    -- 'training', 'certificate', 'report', 'image', 'video', 'other'
    category VARCHAR(100),
    tags TEXT[],

    -- Trade/Equipment Context
    trade VARCHAR(50),
    manufacturer VARCHAR(100),
    equipment_model VARCHAR(100),
    equipment_type VARCHAR(100),

    -- Linking
    site_id UUID REFERENCES sites(id),
    elevator_id UUID REFERENCES elevators(id),
    work_order_id UUID REFERENCES work_orders(id),

    -- Access Control
    visibility document_visibility DEFAULT 'organization',
    allowed_roles TEXT[],  -- For role_based visibility

    -- Distribution Tracking
    requires_acknowledgment BOOLEAN DEFAULT false,
    expiry_date DATE,
    review_date DATE,

    -- AI Processing
    text_extracted BOOLEAN DEFAULT false,
    extracted_text TEXT,
    ai_summary TEXT,
    ai_keywords TEXT[],
    embedding vector(1536),

    -- Version Control
    version INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES documents(id),
    is_current_version BOOLEAN DEFAULT true,

    -- Stats
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_documents_uploader ON documents(uploaded_by);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_visibility ON documents(visibility);
CREATE INDEX idx_documents_site ON documents(site_id);
CREATE INDEX idx_documents_elevator ON documents(elevator_id);
CREATE INDEX idx_documents_manufacturer ON documents(manufacturer);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
CREATE INDEX idx_documents_embedding ON documents
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### 2.5 Document Acknowledgments

```sql
-- DOCUMENT ACKNOWLEDGMENTS (for required reading tracking)
CREATE TABLE document_acknowledgments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),

    acknowledged_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(document_id, user_id)
);

CREATE INDEX idx_doc_ack_document ON document_acknowledgments(document_id);
CREATE INDEX idx_doc_ack_user ON document_acknowledgments(user_id);
```

---

## 3. Forum & Community

### 3.1 Forum Categories

```sql
-- FORUM CATEGORIES
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Hierarchy
    parent_id UUID REFERENCES forum_categories(id),

    -- Identity
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),

    -- Scope
    scope_type VARCHAR(50) NOT NULL,
    -- 'global', 'trade', 'manufacturer', 'region', 'organization', 'portfolio'
    scope_value VARCHAR(100),  -- e.g., 'elevators', 'KONE', 'NSW', org_id

    -- Access
    visibility VARCHAR(50) DEFAULT 'public',
    -- 'public', 'authenticated', 'organization', 'role_based'
    required_user_type VARCHAR(50),  -- 'technician', 'manager', NULL for any

    -- Settings
    is_active BOOLEAN DEFAULT true,
    requires_moderation BOOLEAN DEFAULT false,
    allow_anonymous BOOLEAN DEFAULT false,

    -- Stats
    thread_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    last_post_at TIMESTAMPTZ,

    -- Order
    display_order INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forum_cat_parent ON forum_categories(parent_id);
CREATE INDEX idx_forum_cat_scope ON forum_categories(scope_type, scope_value);
CREATE INDEX idx_forum_cat_slug ON forum_categories(slug);
```

### 3.2 Forum Threads

```sql
-- FORUM THREADS
CREATE TABLE forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES forum_categories(id),

    -- Author
    author_id UUID NOT NULL REFERENCES users(id),
    author_organization_id UUID REFERENCES organizations(id),
    is_anonymous BOOLEAN DEFAULT false,

    -- Content
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,

    -- Context (optional equipment linking)
    equipment_manufacturer VARCHAR(100),
    equipment_model VARCHAR(100),
    fault_code VARCHAR(50),
    tags TEXT[],

    -- Status
    status VARCHAR(50) DEFAULT 'open',
    -- 'open', 'answered', 'closed', 'locked'
    is_pinned BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,

    -- Moderation
    is_approved BOOLEAN DEFAULT true,
    moderated_at TIMESTAMPTZ,
    moderated_by UUID REFERENCES users(id),

    -- Stats
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    upvote_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMPTZ,
    last_reply_by UUID REFERENCES users(id),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_forum_thread_category ON forum_threads(category_id);
CREATE INDEX idx_forum_thread_author ON forum_threads(author_id);
CREATE INDEX idx_forum_thread_status ON forum_threads(status);
CREATE INDEX idx_forum_thread_tags ON forum_threads USING GIN(tags);
CREATE INDEX idx_forum_thread_equipment ON forum_threads(equipment_manufacturer, equipment_model);
```

### 3.3 Forum Posts

```sql
-- FORUM POSTS (replies)
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,

    -- Author
    author_id UUID NOT NULL REFERENCES users(id),
    is_anonymous BOOLEAN DEFAULT false,

    -- Content
    content TEXT NOT NULL,
    content_html TEXT,

    -- Reply structure
    parent_post_id UUID REFERENCES forum_posts(id),  -- For nested replies

    -- Status
    is_answer BOOLEAN DEFAULT false,  -- Marked as accepted answer
    is_approved BOOLEAN DEFAULT true,

    -- Moderation
    moderated_at TIMESTAMPTZ,
    moderated_by UUID REFERENCES users(id),

    -- Stats
    upvote_count INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_forum_post_thread ON forum_posts(thread_id);
CREATE INDEX idx_forum_post_author ON forum_posts(author_id);
CREATE INDEX idx_forum_post_parent ON forum_posts(parent_post_id);
```

### 3.4 Forum Subscriptions

```sql
-- FORUM SUBSCRIPTIONS
CREATE TABLE forum_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    -- What they're subscribed to
    category_id UUID REFERENCES forum_categories(id),
    thread_id UUID REFERENCES forum_threads(id),

    -- Notification preferences
    notify_email BOOLEAN DEFAULT true,
    notify_push BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, category_id, thread_id)
);

CREATE INDEX idx_forum_sub_user ON forum_subscriptions(user_id);
```

---

## 4. Job Marketplace

### 4.1 Job Listings

```sql
-- JOB TYPE ENUM
CREATE TYPE job_employment_type AS ENUM (
    'full_time', 'part_time', 'contract', 'casual',
    'apprenticeship', 'project', 'emergency_fill'
);

CREATE TYPE job_status AS ENUM (
    'draft', 'active', 'paused', 'filled', 'cancelled', 'expired'
);

-- JOB LISTINGS
CREATE TABLE job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    posted_by UUID NOT NULL REFERENCES users(id),

    -- Basic Info
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Job Type
    employment_type job_employment_type NOT NULL,
    trade VARCHAR(50) NOT NULL,  -- 'elevators', 'hvac', etc.

    -- Requirements
    required_experience_years INTEGER,
    required_certifications TEXT[],
    required_skills TEXT[],
    required_manufacturer_experience TEXT[],

    -- Preferred (nice to have)
    preferred_certifications TEXT[],
    preferred_skills TEXT[],

    -- Location
    location_type VARCHAR(50),  -- 'on_site', 'hybrid', 'remote', 'travel'
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_country VARCHAR(100) DEFAULT 'Australia',

    -- Compensation
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    salary_type VARCHAR(20),  -- 'hourly', 'annual', 'project'
    salary_currency VARCHAR(3) DEFAULT 'AUD',
    show_salary BOOLEAN DEFAULT true,
    benefits TEXT[],

    -- Details
    start_date DATE,
    end_date DATE,  -- For contracts
    hours_per_week INTEGER,

    -- Status
    status job_status DEFAULT 'draft',

    -- Visibility
    visibility VARCHAR(50) DEFAULT 'public',
    -- 'public', 'platform', 'internal' (org only)

    -- Stats
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,

    -- Expiry
    expires_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

CREATE INDEX idx_job_org ON job_listings(organization_id);
CREATE INDEX idx_job_status ON job_listings(status);
CREATE INDEX idx_job_type ON job_listings(employment_type);
CREATE INDEX idx_job_trade ON job_listings(trade);
CREATE INDEX idx_job_location ON job_listings(address_city, address_state);
CREATE INDEX idx_job_skills ON job_listings USING GIN(required_skills);
```

### 4.2 Job Applications

```sql
-- APPLICATION STATUS ENUM
CREATE TYPE application_status AS ENUM (
    'submitted', 'viewed', 'shortlisted', 'interviewing',
    'offered', 'hired', 'rejected', 'withdrawn'
);

-- JOB APPLICATIONS
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_listing_id UUID NOT NULL REFERENCES job_listings(id),
    applicant_id UUID NOT NULL REFERENCES users(id),

    -- Application Content
    cover_letter TEXT,
    resume_document_id UUID REFERENCES documents(id),

    -- Status
    status application_status DEFAULT 'submitted',

    -- Match Score (AI-calculated)
    match_score DECIMAL(5, 2),
    match_details JSONB,

    -- Internal Notes (employer side)
    employer_notes TEXT,
    employer_rating INTEGER,  -- 1-5

    -- Interview Scheduling
    interview_scheduled_at TIMESTAMPTZ,
    interview_location TEXT,
    interview_notes TEXT,

    -- Offer
    offer_made_at TIMESTAMPTZ,
    offer_details JSONB,
    offer_response VARCHAR(50),  -- 'accepted', 'rejected', 'negotiating'

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(job_listing_id, applicant_id)
);

CREATE INDEX idx_application_job ON job_applications(job_listing_id);
CREATE INDEX idx_application_applicant ON job_applications(applicant_id);
CREATE INDEX idx_application_status ON job_applications(status);
```

### 4.3 Contract/Tender Listings

```sql
-- CONTRACT LISTINGS (Building service contracts, tenders)
CREATE TABLE contract_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    site_id UUID REFERENCES sites(id),
    posted_by UUID NOT NULL REFERENCES users(id),

    -- Basic Info
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Type
    contract_type VARCHAR(50) NOT NULL,
    -- 'maintenance', 'project', 'tender', 'rfp', 'rfq'
    trade VARCHAR(50) NOT NULL,

    -- Scope
    equipment_count INTEGER,
    sites_count INTEGER,

    -- Requirements
    requirements TEXT[],
    required_certifications TEXT[],
    insurance_requirements TEXT,

    -- Timeline
    contract_start_date DATE,
    contract_end_date DATE,
    contract_duration_months INTEGER,
    bid_deadline TIMESTAMPTZ,

    -- Budget
    budget_range_min DECIMAL(12, 2),
    budget_range_max DECIMAL(12, 2),
    budget_type VARCHAR(20),  -- 'fixed', 'hourly', 'annual'

    -- Status
    status VARCHAR(50) DEFAULT 'open',
    -- 'draft', 'open', 'closed', 'awarded', 'cancelled'

    -- Award
    awarded_to_org_id UUID REFERENCES organizations(id),
    awarded_at TIMESTAMPTZ,
    award_amount DECIMAL(12, 2),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contract_org ON contract_listings(organization_id);
CREATE INDEX idx_contract_site ON contract_listings(site_id);
CREATE INDEX idx_contract_status ON contract_listings(status);
CREATE INDEX idx_contract_trade ON contract_listings(trade);
```

### 4.4 Contract Bids

```sql
-- CONTRACT BIDS
CREATE TABLE contract_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_listing_id UUID NOT NULL REFERENCES contract_listings(id),
    bidder_org_id UUID NOT NULL REFERENCES organizations(id),
    submitted_by UUID NOT NULL REFERENCES users(id),

    -- Proposal
    proposal_summary TEXT NOT NULL,
    proposal_document_id UUID REFERENCES documents(id),

    -- Pricing
    bid_amount DECIMAL(12, 2) NOT NULL,
    pricing_breakdown JSONB,

    -- Status
    status VARCHAR(50) DEFAULT 'submitted',
    -- 'draft', 'submitted', 'shortlisted', 'winner', 'rejected'

    -- Evaluation
    evaluation_score DECIMAL(5, 2),
    evaluation_notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(contract_listing_id, bidder_org_id)
);

CREATE INDEX idx_bid_contract ON contract_bids(contract_listing_id);
CREATE INDEX idx_bid_bidder ON contract_bids(bidder_org_id);
```

---

## 5. Parts & Inventory

### 5.1 Inventory Items

```sql
-- INVENTORY ITEMS (Master catalog)
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    -- Identification
    part_number VARCHAR(100) NOT NULL,
    manufacturer_part_number VARCHAR(100),
    upc_code VARCHAR(50),

    -- Description
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    category VARCHAR(100),
    subcategory VARCHAR(100),

    -- Manufacturer
    manufacturer VARCHAR(100),

    -- Compatibility
    compatible_manufacturers TEXT[],
    compatible_models TEXT[],
    compatible_equipment_types TEXT[],

    -- Pricing
    unit_cost DECIMAL(10, 2),
    sale_price DECIMAL(10, 2),

    -- Stock Management
    minimum_stock INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 1,

    -- Totals (computed)
    total_on_hand INTEGER DEFAULT 0,
    total_reserved INTEGER DEFAULT 0,
    total_available INTEGER DEFAULT 0,

    -- Specifications
    specifications JSONB DEFAULT '{}',

    -- Images
    image_urls TEXT[],

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(organization_id, part_number)
);

CREATE INDEX idx_inventory_org ON inventory_items(organization_id);
CREATE INDEX idx_inventory_part ON inventory_items(part_number);
CREATE INDEX idx_inventory_manufacturer ON inventory_items(manufacturer);
CREATE INDEX idx_inventory_compatible ON inventory_items USING GIN(compatible_manufacturers);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY inventory_org_isolation ON inventory_items
    USING (organization_id = current_setting('app.current_org')::uuid);
```

### 5.2 Stock Locations

```sql
-- STOCK LOCATIONS (Van stock, warehouse, etc.)
CREATE TABLE stock_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,

    -- Location Type
    location_type VARCHAR(50) NOT NULL,
    -- 'warehouse', 'van', 'site', 'consignment'
    location_name VARCHAR(255) NOT NULL,

    -- If van stock, link to technician
    contractor_id UUID REFERENCES contractors(id),
    user_id UUID REFERENCES users(id),

    -- If site stock
    site_id UUID REFERENCES sites(id),

    -- Quantity
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0,
    quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,

    -- Reorder
    minimum_stock INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,

    -- Last Count
    last_count_date DATE,
    last_count_quantity INTEGER,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_org ON stock_locations(organization_id);
CREATE INDEX idx_stock_item ON stock_locations(inventory_item_id);
CREATE INDEX idx_stock_contractor ON stock_locations(contractor_id);
CREATE INDEX idx_stock_type ON stock_locations(location_type);

ALTER TABLE stock_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY stock_org_isolation ON stock_locations
    USING (organization_id = current_setting('app.current_org')::uuid);
```

### 5.3 Marketplace Listings

```sql
-- MARKETPLACE CONDITION ENUM
CREATE TYPE part_condition AS ENUM (
    'new', 'refurbished', 'used_tested', 'used_untested', 'for_parts'
);

-- MARKETPLACE LISTINGS
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Seller
    seller_org_id UUID NOT NULL REFERENCES organizations(id),
    seller_user_id UUID NOT NULL REFERENCES users(id),

    -- Item
    part_number VARCHAR(100) NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(100),
    model_compatibility TEXT[],
    description TEXT,

    -- Condition
    condition part_condition NOT NULL,
    condition_notes TEXT,

    -- Quantity & Pricing
    quantity_available INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AUD',

    -- Location
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100) DEFAULT 'Australia',

    -- Shipping
    shipping_available BOOLEAN DEFAULT true,
    shipping_cost DECIMAL(10, 2),
    local_pickup BOOLEAN DEFAULT true,

    -- Status
    status VARCHAR(50) DEFAULT 'active',
    -- 'active', 'sold', 'reserved', 'expired', 'withdrawn'

    -- Images
    image_urls TEXT[],

    -- Stats
    view_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,

    -- Expiry
    expires_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_marketplace_seller ON marketplace_listings(seller_org_id);
CREATE INDEX idx_marketplace_part ON marketplace_listings(part_number);
CREATE INDEX idx_marketplace_manufacturer ON marketplace_listings(manufacturer);
CREATE INDEX idx_marketplace_status ON marketplace_listings(status) WHERE status = 'active';
CREATE INDEX idx_marketplace_location ON marketplace_listings(location_city, location_state);
```

### 5.4 Marketplace Transactions

```sql
-- MARKETPLACE TRANSACTIONS
CREATE TABLE marketplace_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id),

    -- Parties
    seller_org_id UUID NOT NULL REFERENCES organizations(id),
    buyer_org_id UUID NOT NULL REFERENCES organizations(id),
    buyer_user_id UUID NOT NULL REFERENCES users(id),

    -- Transaction Details
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    platform_fee DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,

    -- Shipping
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,

    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'paid', 'shipped', 'delivered', 'completed', 'disputed', 'refunded'

    -- Payment
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    paid_at TIMESTAMPTZ,

    -- Reviews
    buyer_rating INTEGER,
    buyer_review TEXT,
    seller_rating INTEGER,
    seller_review TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transaction_listing ON marketplace_transactions(listing_id);
CREATE INDEX idx_transaction_seller ON marketplace_transactions(seller_org_id);
CREATE INDEX idx_transaction_buyer ON marketplace_transactions(buyer_org_id);
CREATE INDEX idx_transaction_status ON marketplace_transactions(status);
```

---

## 6. Training & Certification

### 6.1 Courses

```sql
-- COURSES
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_org_id UUID REFERENCES organizations(id),  -- NULL = SiteSync

    -- Basic Info
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    course_type VARCHAR(50),
    -- 'certification', 'training', 'safety', 'onboarding', 'skill'
    trade VARCHAR(50),
    manufacturer VARCHAR(100),  -- If manufacturer-specific

    -- Level
    difficulty_level VARCHAR(50),  -- 'beginner', 'intermediate', 'advanced'
    estimated_duration_hours DECIMAL(5, 2),

    -- Requirements
    prerequisites TEXT[],

    -- Certification
    provides_certification BOOLEAN DEFAULT false,
    certification_name VARCHAR(255),
    certification_valid_months INTEGER,

    -- Pricing
    is_free BOOLEAN DEFAULT true,
    price DECIMAL(10, 2),

    -- Status
    is_published BOOLEAN DEFAULT false,

    -- Stats
    enrollment_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_course_provider ON courses(provider_org_id);
CREATE INDEX idx_course_type ON courses(course_type);
CREATE INDEX idx_course_trade ON courses(trade);
CREATE INDEX idx_course_manufacturer ON courses(manufacturer);
```

### 6.2 Course Modules

```sql
-- COURSE MODULES
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    -- Basic Info
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Order
    sequence_order INTEGER NOT NULL,

    -- Content
    content_type VARCHAR(50),  -- 'video', 'text', 'quiz', 'practical'
    content_url VARCHAR(500),
    content_html TEXT,

    -- Duration
    estimated_duration_minutes INTEGER,

    -- Requirements
    is_required BOOLEAN DEFAULT true,
    passing_score INTEGER,  -- For quizzes

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_module_course ON course_modules(course_id);
```

### 6.3 Enrollments

```sql
-- COURSE ENROLLMENTS
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Progress
    status VARCHAR(50) DEFAULT 'enrolled',
    -- 'enrolled', 'in_progress', 'completed', 'failed', 'expired'
    progress_percentage DECIMAL(5, 2) DEFAULT 0,

    -- Completion
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    -- Results
    final_score DECIMAL(5, 2),
    passed BOOLEAN,

    -- Certificate
    certificate_issued BOOLEAN DEFAULT false,
    certificate_id UUID,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(course_id, user_id)
);

CREATE INDEX idx_enrollment_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollment_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollment_status ON course_enrollments(status);
```

### 6.4 Certifications

```sql
-- CERTIFICATIONS (User's held certifications)
CREATE TABLE user_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Certification Details
    name VARCHAR(255) NOT NULL,
    issuing_authority VARCHAR(255),
    certificate_number VARCHAR(100),

    -- Dates
    issued_date DATE NOT NULL,
    expiry_date DATE,

    -- Source
    course_enrollment_id UUID REFERENCES course_enrollments(id),

    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verification_method VARCHAR(50),

    -- Document
    document_id UUID REFERENCES documents(id),

    -- Reminder
    reminder_sent BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cert_user ON user_certifications(user_id);
CREATE INDEX idx_cert_expiry ON user_certifications(expiry_date);
CREATE INDEX idx_cert_authority ON user_certifications(issuing_authority);
```

---

## 7. Insurance & Compliance

### 7.1 Insurance Policies

```sql
-- INSURANCE POLICIES
CREATE TABLE insurance_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    -- Policy Details
    policy_type VARCHAR(50) NOT NULL,
    -- 'liability', 'workers_comp', 'professional', 'property', 'vehicle'
    policy_number VARCHAR(100) NOT NULL,
    insurer_name VARCHAR(255) NOT NULL,

    -- Coverage
    coverage_amount DECIMAL(15, 2),
    deductible DECIMAL(10, 2),
    coverage_description TEXT,

    -- Dates
    effective_date DATE NOT NULL,
    expiry_date DATE NOT NULL,

    -- Contact
    insurer_contact_name VARCHAR(255),
    insurer_contact_phone VARCHAR(50),
    insurer_contact_email VARCHAR(255),

    -- Document
    certificate_document_id UUID REFERENCES documents(id),

    -- Status
    status VARCHAR(50) DEFAULT 'active',
    -- 'active', 'expired', 'cancelled', 'pending_renewal'

    -- Reminders
    reminder_sent_30 BOOLEAN DEFAULT false,
    reminder_sent_7 BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insurance_org ON insurance_policies(organization_id);
CREATE INDEX idx_insurance_type ON insurance_policies(policy_type);
CREATE INDEX idx_insurance_expiry ON insurance_policies(expiry_date);
CREATE INDEX idx_insurance_status ON insurance_policies(status);

ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY insurance_org_isolation ON insurance_policies
    USING (organization_id = current_setting('app.current_org')::uuid);
```

### 7.2 Compliance Requirements

```sql
-- COMPLIANCE REQUIREMENTS (by jurisdiction)
CREATE TABLE compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Scope
    jurisdiction_country VARCHAR(100) NOT NULL,
    jurisdiction_state VARCHAR(100),
    jurisdiction_city VARCHAR(100),

    -- What it applies to
    equipment_type VARCHAR(50) NOT NULL,  -- 'elevator', 'escalator', 'hvac'
    requirement_type VARCHAR(50) NOT NULL,
    -- 'inspection', 'certification', 'test', 'report'

    -- Details
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Frequency
    frequency_type VARCHAR(50),  -- 'annual', 'semi_annual', 'monthly', 'one_time'
    frequency_months INTEGER,

    -- Regulatory Reference
    regulation_code VARCHAR(100),
    regulation_name VARCHAR(255),
    regulation_url VARCHAR(500),

    -- Active
    is_active BOOLEAN DEFAULT true,
    effective_date DATE,
    sunset_date DATE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_jurisdiction ON compliance_requirements(jurisdiction_country, jurisdiction_state);
CREATE INDEX idx_compliance_equipment ON compliance_requirements(equipment_type);
CREATE INDEX idx_compliance_type ON compliance_requirements(requirement_type);
```

### 7.3 Compliance Tracking

```sql
-- COMPLIANCE TRACKING (per equipment)
CREATE TABLE compliance_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    elevator_id UUID NOT NULL REFERENCES elevators(id),
    requirement_id UUID NOT NULL REFERENCES compliance_requirements(id),

    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'compliant', 'pending', 'overdue', 'failed', 'exempt'

    -- Last Completion
    last_completed_at TIMESTAMPTZ,
    last_completed_by UUID REFERENCES users(id),
    last_work_order_id UUID REFERENCES work_orders(id),
    last_result VARCHAR(50),  -- 'passed', 'failed', 'conditional'

    -- Next Due
    next_due_date DATE NOT NULL,

    -- Certificate
    certificate_number VARCHAR(100),
    certificate_document_id UUID REFERENCES documents(id),
    certificate_expiry DATE,

    -- Notes
    notes TEXT,
    exemption_reason TEXT,

    -- Reminders
    reminder_sent_30 BOOLEAN DEFAULT false,
    reminder_sent_7 BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_track_org ON compliance_tracking(organization_id);
CREATE INDEX idx_compliance_track_elevator ON compliance_tracking(elevator_id);
CREATE INDEX idx_compliance_track_status ON compliance_tracking(status);
CREATE INDEX idx_compliance_track_due ON compliance_tracking(next_due_date);

ALTER TABLE compliance_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY compliance_track_org_isolation ON compliance_tracking
    USING (organization_id = current_setting('app.current_org')::uuid);
```

---

## 8. Tenant & Communication

### 8.1 Tenants

```sql
-- TENANTS (Building occupants)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,

    -- Tenant Info
    name VARCHAR(255) NOT NULL,
    unit_number VARCHAR(50),
    floor VARCHAR(50),

    -- Contact
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(50),

    -- Portal Access
    portal_enabled BOOLEAN DEFAULT false,
    portal_user_id UUID REFERENCES users(id),

    -- Status
    is_active BOOLEAN DEFAULT true,
    move_in_date DATE,
    move_out_date DATE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenant_site ON tenants(site_id);
CREATE INDEX idx_tenant_active ON tenants(is_active) WHERE is_active = true;
```

### 8.2 Service Requests (from tenants)

```sql
-- TENANT SERVICE REQUESTS
CREATE TABLE service_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id),
    tenant_id UUID REFERENCES tenants(id),

    -- Request
    request_type VARCHAR(50) NOT NULL,
    -- 'issue_report', 'inquiry', 'move_request', 'access_request'
    subject VARCHAR(255) NOT NULL,
    description TEXT,

    -- Equipment (if applicable)
    elevator_id UUID REFERENCES elevators(id),

    -- Priority (assessed)
    priority VARCHAR(20) DEFAULT 'normal',

    -- Status
    status VARCHAR(50) DEFAULT 'open',
    -- 'open', 'acknowledged', 'in_progress', 'resolved', 'closed'

    -- Assignment
    assigned_work_order_id UUID REFERENCES work_orders(id),

    -- Resolution
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,

    -- Feedback
    satisfaction_rating INTEGER,  -- 1-5
    feedback_text TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_service_req_site ON service_requests(site_id);
CREATE INDEX idx_service_req_tenant ON service_requests(tenant_id);
CREATE INDEX idx_service_req_status ON service_requests(status);
```

### 8.3 Notifications

```sql
-- NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Content
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,

    -- Linking
    link_type VARCHAR(50),  -- 'work_order', 'job', 'message', etc.
    link_id UUID,
    link_url VARCHAR(500),

    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,

    -- Delivery
    email_sent BOOLEAN DEFAULT false,
    push_sent BOOLEAN DEFAULT false,
    sms_sent BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_notification_read ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notification_type ON notifications(notification_type);
```

### 8.4 Messages

```sql
-- MESSAGES (Direct messaging)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Participants
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),

    -- Thread
    thread_id UUID,  -- Groups related messages

    -- Content
    subject VARCHAR(255),
    content TEXT NOT NULL,

    -- Attachments
    attachment_document_ids UUID[],

    -- Context
    context_type VARCHAR(50),  -- 'work_order', 'job_application', etc.
    context_id UUID,

    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_message_sender ON messages(sender_id);
CREATE INDEX idx_message_recipient ON messages(recipient_id);
CREATE INDEX idx_message_thread ON messages(thread_id);
CREATE INDEX idx_message_unread ON messages(recipient_id, is_read) WHERE is_read = false;
```

---

## 9. Analytics & Metrics

### 9.1 Building Health Scores (History)

```sql
-- BUILDING HEALTH SCORE HISTORY
CREATE TABLE health_score_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL REFERENCES sites(id),

    -- Score
    score INTEGER NOT NULL,

    -- Components
    equipment_condition_score INTEGER,
    maintenance_compliance_score INTEGER,
    incident_frequency_score INTEGER,
    first_time_fix_score INTEGER,
    predictive_risk_score INTEGER,

    -- Details
    components JSONB,

    -- Recorded
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_history_site ON health_score_history(site_id);
CREATE INDEX idx_health_history_date ON health_score_history(recorded_at);

-- Partition by month for scalability
-- CREATE TABLE health_score_history_2024_12 PARTITION OF health_score_history ...
```

### 9.2 Technician Metrics (History)

```sql
-- TECHNICIAN METRICS HISTORY
CREATE TABLE technician_metrics_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    technician_profile_id UUID NOT NULL REFERENCES technician_profiles(id),

    -- Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Metrics
    jobs_completed INTEGER DEFAULT 0,
    first_time_fix_rate DECIMAL(5, 2),
    average_resolution_time_minutes INTEGER,
    callbacks INTEGER DEFAULT 0,
    contributions_made INTEGER DEFAULT 0,

    -- Expertise
    expertise_score INTEGER,

    -- Recorded
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tech_metrics_profile ON technician_metrics_history(technician_profile_id);
CREATE INDEX idx_tech_metrics_period ON technician_metrics_history(period_start, period_end);
```

---

## 10. Audit & Security

### 10.1 Audit Events

```sql
-- AUDIT EVENT TYPES
CREATE TYPE audit_event_type AS ENUM (
    -- Work orders
    'work_order_created', 'work_order_updated', 'work_order_assigned',
    'work_order_started', 'work_order_completed', 'work_order_cancelled',
    -- Assets
    'elevator_created', 'elevator_updated', 'elevator_status_changed',
    -- Inspections
    'inspection_scheduled', 'inspection_completed', 'inspection_failed',
    -- Inventory
    'part_used', 'stock_adjusted', 'stock_transferred',
    -- Labor
    'labor_logged',
    -- AI
    'diagnosis_requested', 'diagnosis_completed',
    -- Documents
    'document_uploaded', 'document_linked', 'document_accessed',
    -- Users
    'user_login', 'user_logout', 'user_created', 'user_updated',
    -- Security
    'permission_changed', 'password_changed', 'mfa_enabled',
    -- Settings
    'settings_changed',
    -- Knowledge
    'contribution_created', 'contribution_approved',
    -- Forum
    'thread_created', 'post_created',
    -- Jobs
    'job_posted', 'application_submitted',
    -- Other
    'user_action'
);

-- AUDIT EVENTS
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),

    -- Event
    event_type audit_event_type NOT NULL,

    -- What
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,

    -- Who
    actor_id UUID NOT NULL,
    actor_type VARCHAR(50) DEFAULT 'user',
    actor_email VARCHAR(255),

    -- What happened
    event_data JSONB NOT NULL,
    previous_state JSONB,
    new_state JSONB,

    -- Context
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),

    -- Integrity
    previous_hash VARCHAR(64),
    hash VARCHAR(64) NOT NULL,

    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE audit_events_2024_12 PARTITION OF audit_events
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');
CREATE TABLE audit_events_2025_01 PARTITION OF audit_events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
-- ... continue for future months

CREATE INDEX idx_audit_org ON audit_events(organization_id);
CREATE INDEX idx_audit_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_type ON audit_events(event_type);
CREATE INDEX idx_audit_created ON audit_events(created_at);
```

### 10.2 API Keys

```sql
-- API KEYS
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    created_by UUID NOT NULL REFERENCES users(id),

    -- Key
    key_prefix VARCHAR(10) NOT NULL,  -- First 10 chars for identification
    key_hash VARCHAR(255) NOT NULL,   -- Hashed full key

    -- Metadata
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Permissions
    scopes TEXT[] DEFAULT '{}',

    -- Limits
    rate_limit_per_hour INTEGER DEFAULT 1000,

    -- Status
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMPTZ,

    -- Expiry
    expires_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_api_key_org ON api_keys(organization_id);
CREATE INDEX idx_api_key_prefix ON api_keys(key_prefix);
```

### 10.3 Sessions

```sql
-- USER SESSIONS
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Session
    session_token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),

    -- Device
    device_type VARCHAR(50),
    device_name VARCHAR(255),
    browser VARCHAR(100),
    os VARCHAR(100),

    -- Location
    ip_address INET,
    location_city VARCHAR(100),
    location_country VARCHAR(100),

    -- Status
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_session_user ON user_sessions(user_id);
CREATE INDEX idx_session_token ON user_sessions(session_token_hash);
CREATE INDEX idx_session_active ON user_sessions(user_id, is_active) WHERE is_active = true;
```

---

## Row-Level Security Summary

All organization-scoped tables have RLS enabled:

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE elevators ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Standard policy pattern
CREATE POLICY {table}_org_isolation ON {table}
    USING (organization_id = current_setting('app.current_org')::uuid);

-- Service role bypass
CREATE ROLE sitesync_service BYPASSRLS;
```

---

## Extensions Required

```sql
-- Required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";        -- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";         -- Trigram similarity
CREATE EXTENSION IF NOT EXISTS "vector";          -- pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS "btree_gist";      -- GiST indexes
```

---

## Migration Strategy

1. **Phase 0:** Core tables (organizations, users, sites, elevators, work_orders)
2. **Phase 1:** Knowledge tables (contributions, documents, forums)
3. **Phase 2:** Marketplace tables (jobs, inventory, marketplace)
4. **Phase 3:** Partner tables (courses, certifications, insurance)
5. **Phase 4:** Advanced tables (tenants, IoT, analytics)

Each phase includes:
- Schema migration
- RLS policy creation
- Index creation
- Seed data (enums, defaults)
- Data migration from V2 (if applicable)

---

*Schema Version: 3.0.0*
*Last Updated: December 2025*
