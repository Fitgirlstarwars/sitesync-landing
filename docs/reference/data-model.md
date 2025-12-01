<!--
---
title: SiteSync V3 Data Model
description: Complete database schemas, entity relationships, and Pydantic models
version: 3.0.0
last_updated: 2025-12
status: stable
implementation_status: design
audience: developer, ai_assistant
prerequisites:
  - Basic SQL knowledge
  - Understanding of PostgreSQL features
related_docs:
  - /docs/GLOSSARY.md (entity terminology)
  - /docs/reference/enums.md (status values)
  - /docs/reference/api.md (API endpoints using these models)
---
-->

# SiteSync V3 - Data Model

## Database Schemas & Relationships

> This document provides the complete data model for SiteSync V3, including SQL schemas, Pydantic models, and multi-tenancy implementation.

## Key Terminology

Before reading this document, understand these terms (see `/docs/GLOSSARY.md` for full definitions):
- **Organization**: Multi-tenant root entity (a company using SiteSync)
- **Site**: A building or location
- **Elevator**: A lift asset being managed
- **Work Order**: A job/task to be performed
- **Contractor**: Person/company performing work

---

## Entity Relationship Overview

```
ENTITY RELATIONSHIP DIAGRAM
══════════════════════════════════════════════════════════════════

Organization (tenant root)
    │
    ├── Users
    │       └── Roles/Permissions
    │
    ├── Sites (buildings/locations)
    │       │
    │       └── Elevators (assets)
    │               │
    │               ├── Work Orders
    │               │       ├── Tasks
    │               │       ├── Parts Used
    │               │       ├── Labor Entries
    │               │       └── AI Diagnoses
    │               │
    │               ├── Maintenance Schedules
    │               ├── Equipment History
    │               └── Documents (linked to V2 extractions)
    │
    ├── Contractors
    │       ├── Certifications
    │       └── Technician Profiles
    │
    ├── Inventory Items
    │       ├── Stock Locations
    │       └── Stock Transactions
    │
    └── Audit Events (immutable log)

══════════════════════════════════════════════════════════════════
```

---

## Core Tables

### Organizations

The tenant root - all data belongs to an organization.

```sql
-- ORGANIZATIONS (Multi-tenant Root)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,  -- {slug}.sitesync.com
    subscription_tier VARCHAR(50) DEFAULT 'free',
    -- 'free', 'pro', 'expert', 'enterprise'

    -- Contact information
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    billing_email VARCHAR(255),

    -- Configuration
    settings JSONB DEFAULT '{}',
    -- {
    --   "timezone": "Australia/Sydney",
    --   "date_format": "DD/MM/YYYY",
    --   "currency": "AUD",
    --   "default_priority": "medium",
    --   "ai_enabled": true
    -- }

    -- Subscription
    subscription_started_at TIMESTAMPTZ,
    subscription_ends_at TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Soft delete
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_deleted ON organizations(deleted_at) WHERE deleted_at IS NULL;
```

### Users

```sql
-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- Authentication
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT false,

    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url VARCHAR(500),

    -- Role & permissions
    role VARCHAR(50) DEFAULT 'user',
    -- 'owner', 'admin', 'manager', 'user', 'technician', 'readonly'
    permissions JSONB DEFAULT '[]',
    -- ["work_orders:create", "work_orders:edit", ...]

    -- Status
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,

    -- Metadata
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(organization_id, email)
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
```

### Sites

```sql
-- SITES (Buildings/Locations)
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- Basic info
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),  -- Short code like "COL-123"

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

    -- Timezone
    timezone VARCHAR(50) DEFAULT 'Australia/Sydney',

    -- Contact
    primary_contact_name VARCHAR(255),
    primary_contact_phone VARCHAR(50),
    primary_contact_email VARCHAR(255),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),

    -- Access
    access_instructions TEXT,
    access_codes JSONB DEFAULT '{}',  -- Encrypted in application

    -- Building info
    building_type VARCHAR(100),  -- 'commercial', 'residential', 'mixed', 'industrial'
    floors_count INTEGER,
    year_built INTEGER,
    total_area_sqm DECIMAL(12, 2),

    -- Health score (computed)
    health_score INTEGER,  -- 0-100
    health_score_updated_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_sites_org ON sites(organization_id);
CREATE INDEX idx_sites_code ON sites(organization_id, code);
CREATE INDEX idx_sites_location ON sites USING GIST (
    point(longitude, latitude)
) WHERE latitude IS NOT NULL;
```

### Elevators (Assets)

```sql
-- ELEVATOR STATUS ENUM
CREATE TYPE elevator_status AS ENUM (
    'operational',      -- Running normally
    'degraded',         -- Running with issues
    'out_of_service',   -- Not running
    'maintenance',      -- Scheduled maintenance
    'decommissioned'    -- No longer in use
);

-- ELEVATORS (Assets)
CREATE TABLE elevators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,

    -- Identification
    unit_number VARCHAR(50) NOT NULL,  -- "Lift 1", "L1", etc.
    serial_number VARCHAR(100),
    registration_number VARCHAR(100),  -- Government registration
    asset_tag VARCHAR(100),  -- Internal asset tag

    -- Equipment details
    manufacturer VARCHAR(100),  -- KONE, Otis, Schindler, etc.
    model VARCHAR(100),
    controller_type VARCHAR(100),
    drive_type VARCHAR(100),  -- 'gearless', 'geared', 'hydraulic', 'MRL'
    machine_type VARCHAR(100),

    -- Specifications
    capacity_kg INTEGER,
    capacity_persons INTEGER,
    speed_mps DECIMAL(4, 2),  -- Meters per second
    floors_served INTEGER,
    stops INTEGER,
    travel_height_m DECIMAL(6, 2),
    door_type VARCHAR(50),  -- 'center_opening', 'side_opening', 'freight'
    door_width_mm INTEGER,
    car_dimensions JSONB,  -- {"width": 1100, "depth": 1400, "height": 2200}

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
    last_inspection_result VARCHAR(50),  -- 'passed', 'failed', 'conditional'
    next_inspection_due DATE,
    inspection_certificate_number VARCHAR(100),

    -- Health (computed)
    health_score INTEGER,  -- 0-100
    health_score_updated_at TIMESTAMPTZ,

    -- AI/Knowledge links
    v2_document_ids INTEGER[],  -- Links to V2 extracted manuals
    known_quirks TEXT[],  -- AI-learned equipment-specific notes

    -- Specifications (flexible)
    specifications JSONB DEFAULT '{}',
    -- {
    --   "rope_count": 6,
    --   "rope_diameter_mm": 10,
    --   "buffer_type": "spring",
    --   "governor_type": "centrifugal",
    --   ...
    -- }

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
```

### Contractors

```sql
-- CONTRACTORS
CREATE TABLE contractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- Type
    contractor_type VARCHAR(50) NOT NULL,
    -- 'employee', 'subcontractor', 'vendor', 'company'

    -- Company info (if company)
    company_name VARCHAR(255),
    company_abn VARCHAR(20),  -- Australian Business Number
    company_license VARCHAR(100),

    -- Individual info
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
    specializations TEXT[],  -- ['KONE', 'Otis', 'hydraulic', 'modernization']
    trade_types TEXT[],  -- ['lifts', 'escalators', 'HVAC']

    -- Rates
    hourly_rate DECIMAL(10, 2),
    callout_fee DECIMAL(10, 2),
    emergency_rate_multiplier DECIMAL(3, 2) DEFAULT 1.5,

    -- Status
    is_active BOOLEAN DEFAULT true,
    is_preferred BOOLEAN DEFAULT false,

    -- Performance (computed)
    rating DECIMAL(3, 2),  -- 0.00-5.00
    total_jobs_completed INTEGER DEFAULT 0,
    first_time_fix_rate DECIMAL(5, 2),  -- Percentage
    average_response_time_minutes INTEGER,

    -- SiteSync profile link
    technician_profile_id UUID,  -- Links to profiles table

    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_contractors_org ON contractors(organization_id);
CREATE INDEX idx_contractors_active ON contractors(is_active) WHERE is_active = true;
CREATE INDEX idx_contractors_specializations ON contractors USING GIN(specializations);
```

### Work Orders

```sql
-- ENUMS
CREATE TYPE work_order_status AS ENUM (
    'draft',        -- Created but not submitted
    'pending',      -- Submitted, awaiting assignment
    'scheduled',    -- Assigned and scheduled
    'in_progress',  -- Work started
    'on_hold',      -- Paused
    'completed',    -- Work finished
    'cancelled',    -- Cancelled
    'invoiced'      -- Invoiced/closed
);

CREATE TYPE work_order_priority AS ENUM (
    'emergency',    -- Immediate response required
    'high',         -- Same day
    'medium',       -- Within 48 hours
    'low',          -- Within week
    'scheduled'     -- Planned maintenance
);

CREATE TYPE work_order_type AS ENUM (
    'breakdown',      -- Equipment failure
    'preventive',     -- Scheduled maintenance
    'inspection',     -- Safety inspection
    'installation',   -- New installation
    'modernization',  -- Upgrade project
    'callback',       -- Return visit
    'audit'           -- Compliance audit
);

-- WORK ORDERS
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    elevator_id UUID NOT NULL REFERENCES elevators(id),
    site_id UUID NOT NULL REFERENCES sites(id),

    -- Identification
    work_order_number VARCHAR(50) NOT NULL,  -- WO-2024-001234

    -- Classification
    type work_order_type NOT NULL,
    priority work_order_priority DEFAULT 'medium',
    status work_order_status DEFAULT 'draft',

    -- Description
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Fault information
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
    -- 'repaired', 'replaced', 'adjusted', 'cleaned', 'no_fault_found'

    -- Parts & Labor (summary, detail in related tables)
    parts_cost DECIMAL(10, 2) DEFAULT 0,
    labor_cost DECIMAL(10, 2) DEFAULT 0,
    total_cost DECIMAL(10, 2) DEFAULT 0,

    -- Follow-up
    requires_followup BOOLEAN DEFAULT false,
    followup_notes TEXT,
    parent_work_order_id UUID REFERENCES work_orders(id),

    -- Custom fields (per-org configuration)
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
CREATE INDEX idx_work_orders_number ON work_orders(work_order_number);
```

### Work Order Tasks

```sql
-- WORK ORDER TASKS
CREATE TABLE work_order_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,

    -- Task details
    sequence INTEGER NOT NULL,  -- Order of tasks
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'in_progress', 'completed', 'skipped'
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES users(id),

    -- Notes
    completion_notes TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wo_tasks_work_order ON work_order_tasks(work_order_id);
```

### Parts Used

```sql
-- PARTS USED ON WORK ORDERS
CREATE TABLE work_order_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES inventory_items(id),

    -- Part details (can be manual entry or from inventory)
    part_number VARCHAR(100),
    part_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(100),

    -- Quantity & pricing
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_cost DECIMAL(10, 2),
    total_cost DECIMAL(10, 2),

    -- Source
    source VARCHAR(50),  -- 'inventory', 'purchased', 'customer_supplied'

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX idx_wo_parts_work_order ON work_order_parts(work_order_id);
```

### Labor Entries

```sql
-- LABOR ENTRIES
CREATE TABLE work_order_labor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    contractor_id UUID REFERENCES contractors(id),

    -- Time
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,

    -- Rate
    labor_type VARCHAR(50) DEFAULT 'regular',
    -- 'regular', 'overtime', 'emergency', 'travel'
    hourly_rate DECIMAL(10, 2),
    total_cost DECIMAL(10, 2),

    -- Notes
    description TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wo_labor_work_order ON work_order_labor(work_order_id);
CREATE INDEX idx_wo_labor_contractor ON work_order_labor(contractor_id);
```

---

## Inventory & Marketplace

### Inventory Items

```sql
-- INVENTORY ITEMS (Master catalog)
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

    -- Identification
    part_number VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    category VARCHAR(100),  -- 'door_parts', 'drive_parts', 'safety', etc.
    subcategory VARCHAR(100),

    -- Manufacturer
    manufacturer VARCHAR(100),
    manufacturer_part_number VARCHAR(100),

    -- Compatibility
    compatible_manufacturers TEXT[],  -- ['KONE', 'Otis']
    compatible_models TEXT[],

    -- Pricing
    unit_cost DECIMAL(10, 2),
    sale_price DECIMAL(10, 2),

    -- Stock management
    minimum_stock INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 1,

    -- Totals (computed from stock_locations)
    total_on_hand INTEGER DEFAULT 0,
    total_reserved INTEGER DEFAULT 0,
    total_available INTEGER DEFAULT 0,

    -- Metadata
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(organization_id, part_number)
);

CREATE INDEX idx_inventory_org ON inventory_items(organization_id);
CREATE INDEX idx_inventory_part_number ON inventory_items(part_number);
CREATE INDEX idx_inventory_category ON inventory_items(category);
CREATE INDEX idx_inventory_manufacturer ON inventory_items(manufacturer);
CREATE INDEX idx_inventory_compatible ON inventory_items USING GIN(compatible_manufacturers);
```

### Stock Locations (Van Stock)

```sql
-- STOCK LOCATIONS
CREATE TABLE stock_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,

    -- Location
    location_type VARCHAR(50) NOT NULL,
    -- 'warehouse', 'van', 'site', 'consignment'
    location_name VARCHAR(255) NOT NULL,

    -- If van stock, link to contractor
    contractor_id UUID REFERENCES contractors(id),

    -- If site stock, link to site
    site_id UUID REFERENCES sites(id),

    -- Quantity
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0,
    quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,

    -- Reorder settings for this location
    minimum_stock INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,

    -- Metadata
    last_count_date DATE,
    last_count_quantity INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(organization_id, inventory_item_id, location_type, COALESCE(contractor_id::text, site_id::text, location_name))
);

CREATE INDEX idx_stock_org ON stock_locations(organization_id);
CREATE INDEX idx_stock_item ON stock_locations(inventory_item_id);
CREATE INDEX idx_stock_contractor ON stock_locations(contractor_id);
CREATE INDEX idx_stock_location_type ON stock_locations(location_type);
```

### Marketplace Listings

```sql
-- MARKETPLACE LISTINGS
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Seller
    seller_organization_id UUID NOT NULL REFERENCES organizations(id),
    seller_contractor_id UUID REFERENCES contractors(id),

    -- Item
    part_number VARCHAR(100) NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(100),
    condition VARCHAR(50) NOT NULL,  -- 'new', 'refurbished', 'used_tested', 'used_untested'
    description TEXT,

    -- Quantity & pricing
    quantity_available INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,

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

    -- Metadata
    images TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_marketplace_part ON marketplace_listings(part_number);
CREATE INDEX idx_marketplace_manufacturer ON marketplace_listings(manufacturer);
CREATE INDEX idx_marketplace_status ON marketplace_listings(status) WHERE status = 'active';
CREATE INDEX idx_marketplace_location ON marketplace_listings(location_city, location_state);
```

---

## Technician Profiles

```sql
-- TECHNICIAN PROFILES (Platform-wide, not org-specific)
CREATE TABLE technician_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Account
    user_id UUID UNIQUE,  -- Optional link to user account
    email VARCHAR(255) UNIQUE NOT NULL,

    -- Profile
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255),
    avatar_url VARCHAR(500),
    bio TEXT,

    -- Location
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Australia',

    -- Visibility
    profile_visibility VARCHAR(50) DEFAULT 'public',
    -- 'public', 'employers_only', 'connections_only', 'private'
    open_to_opportunities BOOLEAN DEFAULT false,

    -- Experience
    years_experience INTEGER,
    primary_trade VARCHAR(100),
    specializations TEXT[],

    -- Stats (computed/updated by triggers)
    expertise_score INTEGER DEFAULT 0,  -- 0-100
    total_jobs_completed INTEGER DEFAULT 0,
    first_time_fix_rate DECIMAL(5, 2),
    contributions_count INTEGER DEFAULT 0,
    technicians_helped INTEGER DEFAULT 0,
    endorsements_count INTEGER DEFAULT 0,

    -- Percentile (computed)
    expertise_percentile INTEGER,  -- Top X%

    -- Badges (array of badge IDs)
    badges TEXT[],

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_email ON technician_profiles(email);
CREATE INDEX idx_profiles_expertise ON technician_profiles(expertise_score DESC);
CREATE INDEX idx_profiles_location ON technician_profiles(city, state);
CREATE INDEX idx_profiles_specializations ON technician_profiles USING GIN(specializations);
CREATE INDEX idx_profiles_open ON technician_profiles(open_to_opportunities) WHERE open_to_opportunities = true;
```

### Profile Certifications

```sql
-- PROFILE CERTIFICATIONS
CREATE TABLE profile_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES technician_profiles(id) ON DELETE CASCADE,

    -- Certification
    name VARCHAR(255) NOT NULL,
    issuing_authority VARCHAR(255),
    certificate_number VARCHAR(100),

    -- Dates
    issued_date DATE,
    expiry_date DATE,

    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verification_method VARCHAR(50),

    -- Evidence
    document_url VARCHAR(500),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_certs_profile ON profile_certifications(profile_id);
CREATE INDEX idx_certs_expiry ON profile_certifications(expiry_date);
```

### Knowledge Contributions

```sql
-- KNOWLEDGE CONTRIBUTIONS
CREATE TABLE knowledge_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES technician_profiles(id),

    -- Content
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    contribution_type VARCHAR(50) NOT NULL,
    -- 'solution', 'tip', 'procedure', 'equipment_note', 'safety_note'

    -- Context
    equipment_manufacturer VARCHAR(100),
    equipment_model VARCHAR(100),
    fault_code VARCHAR(50),
    tags TEXT[],

    -- Attribution
    attribution_type VARCHAR(50) DEFAULT 'full',
    -- 'full', 'company', 'anonymous'

    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- 'pending', 'approved', 'rejected'
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID,

    -- Impact (updated by triggers)
    times_used INTEGER DEFAULT 0,
    technicians_helped INTEGER DEFAULT 0,
    estimated_hours_saved DECIMAL(10, 2) DEFAULT 0,

    -- Ratings
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contributions_profile ON knowledge_contributions(profile_id);
CREATE INDEX idx_contributions_equipment ON knowledge_contributions(equipment_manufacturer, equipment_model);
CREATE INDEX idx_contributions_fault ON knowledge_contributions(fault_code);
CREATE INDEX idx_contributions_status ON knowledge_contributions(status);
CREATE INDEX idx_contributions_tags ON knowledge_contributions USING GIN(tags);
```

---

## Audit Trail

```sql
-- AUDIT EVENT TYPES
CREATE TYPE audit_event_type AS ENUM (
    -- Work orders
    'work_order_created',
    'work_order_updated',
    'work_order_assigned',
    'work_order_started',
    'work_order_completed',
    'work_order_cancelled',

    -- Assets
    'elevator_created',
    'elevator_updated',
    'elevator_status_changed',

    -- Inspections
    'inspection_scheduled',
    'inspection_completed',
    'inspection_failed',

    -- Inventory
    'part_used',
    'stock_adjusted',
    'stock_transferred',

    -- Labor
    'labor_logged',

    -- AI
    'diagnosis_requested',
    'diagnosis_completed',

    -- Documents
    'document_uploaded',
    'document_linked',

    -- User actions
    'user_login',
    'user_action',
    'settings_changed'
);

-- AUDIT EVENTS (Immutable, partitioned)
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    -- Event classification
    event_type audit_event_type NOT NULL,

    -- What was affected
    entity_type VARCHAR(50) NOT NULL,  -- 'work_order', 'elevator', etc.
    entity_id UUID NOT NULL,

    -- Who did it
    actor_id UUID NOT NULL,
    actor_type VARCHAR(50) DEFAULT 'user',  -- 'user', 'system', 'api'
    actor_email VARCHAR(255),

    -- What happened
    event_data JSONB NOT NULL,
    previous_state JSONB,
    new_state JSONB,

    -- Context
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),

    -- Chain integrity
    previous_hash VARCHAR(64),
    hash VARCHAR(64) NOT NULL,  -- SHA-256

    -- Timestamp (used for partitioning)
    created_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create partitions (monthly)
CREATE TABLE audit_events_2024_12 PARTITION OF audit_events
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

CREATE TABLE audit_events_2025_01 PARTITION OF audit_events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Add more partitions as needed

-- Indexes
CREATE INDEX idx_audit_org ON audit_events(organization_id);
CREATE INDEX idx_audit_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_type ON audit_events(event_type);
CREATE INDEX idx_audit_created ON audit_events(created_at);
```

---

## Row-Level Security

### RLS Implementation

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE elevators ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Create policies (organization isolation)
CREATE POLICY org_isolation_sites ON sites
    USING (organization_id = current_setting('app.current_org')::uuid);

CREATE POLICY org_isolation_elevators ON elevators
    USING (organization_id = current_setting('app.current_org')::uuid);

CREATE POLICY org_isolation_contractors ON contractors
    USING (organization_id = current_setting('app.current_org')::uuid);

CREATE POLICY org_isolation_work_orders ON work_orders
    USING (organization_id = current_setting('app.current_org')::uuid);

CREATE POLICY org_isolation_work_order_tasks ON work_order_tasks
    USING (work_order_id IN (
        SELECT id FROM work_orders
        WHERE organization_id = current_setting('app.current_org')::uuid
    ));

CREATE POLICY org_isolation_inventory ON inventory_items
    USING (organization_id = current_setting('app.current_org')::uuid);

CREATE POLICY org_isolation_users ON users
    USING (organization_id = current_setting('app.current_org')::uuid);

CREATE POLICY org_isolation_audit ON audit_events
    USING (organization_id = current_setting('app.current_org')::uuid);

-- Bypass policy for service account (migrations, admin)
CREATE ROLE sitesync_service BYPASSRLS;
```

### Setting Tenant Context

```python
# In application code, always set context before queries

async def set_tenant_context(
    session: AsyncSession,
    organization_id: UUID
) -> None:
    """Set RLS context for multi-tenant isolation."""
    await session.execute(
        text(f"SET app.current_org = '{organization_id}'")
    )

# Usage in FastAPI dependency
async def get_db_with_tenant(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    await set_tenant_context(session, user.organization_id)
    yield session
```

---

## Pydantic Models

### Core Models

```python
# sitesync_v3/domains/assets/models.py

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID
from pydantic import BaseModel, Field, ConfigDict

class ElevatorStatus(str, Enum):
    OPERATIONAL = "operational"
    DEGRADED = "degraded"
    OUT_OF_SERVICE = "out_of_service"
    MAINTENANCE = "maintenance"
    DECOMMISSIONED = "decommissioned"

class Elevator(BaseModel):
    """Elevator domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID
    organization_id: UUID
    site_id: UUID

    # Identification
    unit_number: str
    serial_number: str | None = None
    registration_number: str | None = None

    # Equipment
    manufacturer: str | None = None
    model: str | None = None
    controller_type: str | None = None
    drive_type: str | None = None

    # Specs
    capacity_kg: int | None = None
    speed_mps: Decimal | None = None
    floors_served: int | None = None

    # Dates
    installation_date: date | None = None

    # Status
    status: ElevatorStatus = ElevatorStatus.OPERATIONAL
    health_score: int | None = None

    # Compliance
    last_inspection_date: date | None = None
    next_inspection_due: date | None = None

    # AI links
    v2_document_ids: list[int] = Field(default_factory=list)
    known_quirks: list[str] = Field(default_factory=list)

    # Flexible
    specifications: dict = Field(default_factory=dict)
    metadata: dict = Field(default_factory=dict)

    # Timestamps
    created_at: datetime
    updated_at: datetime


class ElevatorCreate(BaseModel):
    """Create elevator request."""

    site_id: UUID
    unit_number: str
    serial_number: str | None = None
    registration_number: str | None = None
    manufacturer: str | None = None
    model: str | None = None
    controller_type: str | None = None
    drive_type: str | None = None
    capacity_kg: int | None = None
    speed_mps: Decimal | None = None
    floors_served: int | None = None
    installation_date: date | None = None
    specifications: dict = Field(default_factory=dict)


class ElevatorUpdate(BaseModel):
    """Update elevator request."""

    unit_number: str | None = None
    serial_number: str | None = None
    registration_number: str | None = None
    manufacturer: str | None = None
    model: str | None = None
    controller_type: str | None = None
    drive_type: str | None = None
    capacity_kg: int | None = None
    speed_mps: Decimal | None = None
    floors_served: int | None = None
    status: ElevatorStatus | None = None
    specifications: dict | None = None
```

### Work Order Models

```python
# sitesync_v3/domains/work_orders/models.py

class WorkOrderStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    ON_HOLD = "on_hold"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    INVOICED = "invoiced"

class WorkOrderPriority(str, Enum):
    EMERGENCY = "emergency"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    SCHEDULED = "scheduled"

class WorkOrderType(str, Enum):
    BREAKDOWN = "breakdown"
    PREVENTIVE = "preventive"
    INSPECTION = "inspection"
    INSTALLATION = "installation"
    MODERNIZATION = "modernization"
    CALLBACK = "callback"
    AUDIT = "audit"

class WorkOrder(BaseModel):
    """Work order domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID
    organization_id: UUID
    elevator_id: UUID
    site_id: UUID

    work_order_number: str
    type: WorkOrderType
    priority: WorkOrderPriority = WorkOrderPriority.MEDIUM
    status: WorkOrderStatus = WorkOrderStatus.DRAFT

    title: str
    description: str | None = None
    fault_code: str | None = None
    reported_symptoms: list[str] = Field(default_factory=list)

    reported_at: datetime
    scheduled_start: datetime | None = None
    scheduled_end: datetime | None = None
    actual_start: datetime | None = None
    actual_end: datetime | None = None

    assigned_contractor_id: UUID | None = None

    # AI
    ai_diagnosis_id: UUID | None = None
    ai_suggested_parts: list[str] = Field(default_factory=list)
    ai_confidence: Decimal | None = None

    # Resolution
    resolution_notes: str | None = None
    root_cause: str | None = None

    # Costs
    parts_cost: Decimal = Decimal("0")
    labor_cost: Decimal = Decimal("0")
    total_cost: Decimal = Decimal("0")

    custom_fields: dict = Field(default_factory=dict)

    created_by: UUID
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None = None
```

---

## Database Migrations

### Alembic Setup

```python
# alembic/env.py

from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config
from alembic import context

config = context.config
fileConfig(config.config_file_name)

target_metadata = None  # Import from models

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    import asyncio
    asyncio.run(run_migrations_online())
```

---

## Next Steps

For implementation patterns using these models:
- [Triforce AI](../explanation/triforce-ai.md) - AI system integration
- [API Reference](api.md) - API endpoints
- [Implementation](implementation.md) - Code patterns

---

**[← Back to Architecture](architecture.md)** | **[Next: Triforce AI →](../explanation/triforce-ai.md)**
