# Phase 3.1: Manufacturer Integration

> Detailed implementation specification for direct manufacturer partnerships and data exchange
> Status: Design Phase
> Priority: HIGH - Foundation for official documentation and certifications
> Dependencies: Phase 2.1 (Job Marketplace), Phase 2.2 (Parts Marketplace)

---

## Overview

The Manufacturer Integration system creates direct partnerships with elevator and building equipment manufacturers to:

1. **Distribute** official documentation, bulletins, and updates through SiteSync
2. **Manage** certifications and authorized technician networks
3. **Exchange** field data for product improvement and warranty processing
4. **Integrate** parts catalogs with direct ordering capabilities
5. **Enable** equipment telemetry and remote diagnostics

---

## User Stories

### As a Manufacturer:

1. **US-MFG001:** I want to publish technical documents so authorized technicians can access the latest information
2. **US-MFG002:** I want to distribute service bulletins so critical updates reach technicians immediately
3. **US-MFG003:** I want to manage my certification programs so I can maintain quality standards
4. **US-MFG004:** I want to track certified technicians so building owners can verify qualifications
5. **US-MFG005:** I want to receive anonymized field data so I can improve product reliability
6. **US-MFG006:** I want to process warranty claims digitally so we reduce administrative overhead
7. **US-MFG007:** I want to integrate our parts catalog so technicians can order directly
8. **US-MFG008:** I want to see equipment telemetry data so we can provide proactive support
9. **US-MFG009:** I want branded presence on the platform so technicians recognize our commitment
10. **US-MFG010:** I want to run training programs so technicians stay current on our equipment

### As a Technician:

11. **US-MFG011:** I want to access official manuals so I have authoritative reference material
12. **US-MFG012:** I want to receive service bulletins so I know about recalls and updates
13. **US-MFG013:** I want to track my manufacturer certifications so I can prove my qualifications
14. **US-MFG014:** I want to order OEM parts directly so I get genuine components quickly
15. **US-MFG015:** I want to submit warranty claims digitally so paperwork is reduced
16. **US-MFG016:** I want to find certification courses so I can expand my capabilities

### As a Building Owner:

17. **US-MFG017:** I want to verify technician certifications so I know I'm getting qualified service
18. **US-MFG018:** I want to see equipment recall status so I know if my equipment is affected
19. **US-MFG019:** I want warranty status visibility so I understand my coverage

### As a Service Company:

20. **US-MFG020:** I want to track employee certifications so I maintain compliance
21. **US-MFG021:** I want bulk parts ordering so I can manage inventory efficiently
22. **US-MFG022:** I want to become an authorized service provider so I can service equipment under warranty

---

## Feature Breakdown

### 3.1.1 Manufacturer Portal & Account System

#### 3.1.1.1 Manufacturer Account Type

**API Endpoints:**

```
POST   /api/v1/manufacturers                     # Register manufacturer (admin-approved)
GET    /api/v1/manufacturers                     # List manufacturers
GET    /api/v1/manufacturers/{id}                # Get manufacturer details
PUT    /api/v1/manufacturers/{id}                # Update manufacturer profile
DELETE /api/v1/manufacturers/{id}                # Deactivate manufacturer (admin only)
GET    /api/v1/manufacturers/{id}/stats          # Get manufacturer statistics
```

**Manufacturer Account Types:**

| Account Tier | Description | Capabilities | Pricing |
|--------------|-------------|--------------|---------|
| `basic` | Documentation only | Docs, bulletins, basic profile | Free |
| `standard` | Full documentation + certs | + Certification management | $5K/yr |
| `enterprise` | Full integration | + Parts catalog, telemetry, API | Custom |
| `oem_partner` | Strategic partnership | + Co-marketing, revenue share | Negotiated |

**Request Schema:**

```python
# sitesync_v3/domains/manufacturers/contracts.py

from pydantic import BaseModel, Field, HttpUrl
from enum import Enum
from uuid import UUID
from datetime import datetime

class ManufacturerTier(str, Enum):
    BASIC = "basic"
    STANDARD = "standard"
    ENTERPRISE = "enterprise"
    OEM_PARTNER = "oem_partner"

class ManufacturerCategory(str, Enum):
    ELEVATOR = "elevator"
    ESCALATOR = "escalator"
    HVAC = "hvac"
    ELECTRICAL = "electrical"
    FIRE_SAFETY = "fire_safety"
    BUILDING_AUTOMATION = "building_automation"
    SECURITY = "security"
    PLUMBING = "plumbing"

class ManufacturerCreate(BaseModel):
    """Request to register a manufacturer account."""

    # Basic Info
    name: str = Field(..., min_length=2, max_length=255)
    legal_name: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., max_length=2000)

    # Classification
    categories: list[ManufacturerCategory]
    primary_category: ManufacturerCategory

    # Branding
    logo_url: HttpUrl | None = None
    brand_color: str | None = Field(None, pattern=r'^#[0-9A-Fa-f]{6}$')
    website_url: HttpUrl | None = None

    # Contact
    support_email: str
    support_phone: str | None = None
    technical_support_url: HttpUrl | None = None

    # Business
    headquarters_country: str = Field(..., min_length=2, max_length=2)  # ISO 3166-1 alpha-2
    operating_regions: list[str] = []  # List of ISO country codes
    year_founded: int | None = None
    employee_count_range: str | None = None  # "1-50", "51-200", etc.

    # Initial tier request
    requested_tier: ManufacturerTier = ManufacturerTier.BASIC

    # Admin contact for partnership
    admin_contact_name: str
    admin_contact_email: str
    admin_contact_phone: str | None = None

class ManufacturerResponse(BaseModel):
    """Response with manufacturer details."""

    id: UUID

    # Basic Info
    name: str
    legal_name: str
    description: str
    slug: str  # URL-friendly identifier

    # Classification
    categories: list[ManufacturerCategory]
    primary_category: ManufacturerCategory

    # Branding
    logo_url: str | None
    brand_color: str | None
    website_url: str | None

    # Contact
    support_email: str
    support_phone: str | None
    technical_support_url: str | None

    # Status
    tier: ManufacturerTier
    is_verified: bool
    is_active: bool

    # Stats
    equipment_count: int
    certified_technicians: int
    documents_published: int
    active_certifications: int

    # Metadata
    created_at: datetime
    updated_at: datetime

class ManufacturerStats(BaseModel):
    """Statistics for a manufacturer."""

    manufacturer_id: UUID

    # Equipment
    total_equipment_registered: int
    equipment_by_type: dict[str, int]
    equipment_by_region: dict[str, int]

    # Technicians
    certified_technicians_total: int
    certifications_issued_this_year: int
    certifications_expiring_30_days: int

    # Documentation
    total_documents: int
    documents_by_type: dict[str, int]
    bulletin_open_rate: float

    # Parts
    parts_catalog_size: int
    orders_this_month: int
    order_value_this_month: float

    # Warranty
    active_warranties: int
    claims_this_month: int
    claim_approval_rate: float

    # Telemetry (if enabled)
    connected_equipment: int
    anomalies_detected_this_month: int

    # Engagement
    page_views_this_month: int
    document_downloads_this_month: int
    profile_completion_percent: float
```

**Database Schema:**

```sql
-- Manufacturer accounts
CREATE TABLE manufacturers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic info
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Classification
    categories TEXT[] NOT NULL,  -- Array of ManufacturerCategory
    primary_category VARCHAR(50) NOT NULL,

    -- Branding
    logo_url TEXT,
    brand_color CHAR(7),
    website_url TEXT,

    -- Contact
    support_email VARCHAR(255) NOT NULL,
    support_phone VARCHAR(50),
    technical_support_url TEXT,

    -- Business info
    headquarters_country CHAR(2),
    operating_regions TEXT[],
    year_founded INTEGER,
    employee_count_range VARCHAR(20),

    -- Account status
    tier VARCHAR(20) NOT NULL DEFAULT 'basic',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    verified_at TIMESTAMPTZ,

    -- Admin contact
    admin_contact_name VARCHAR(255),
    admin_contact_email VARCHAR(255),
    admin_contact_phone VARCHAR(50),

    -- API access
    api_key_hash VARCHAR(255),
    api_rate_limit INTEGER DEFAULT 1000,  -- requests per hour

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_tier CHECK (tier IN ('basic', 'standard', 'enterprise', 'oem_partner')),
    CONSTRAINT valid_primary_category CHECK (primary_category = ANY(categories))
);

-- Manufacturer users (staff with portal access)
CREATE TABLE manufacturer_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manufacturer_id UUID NOT NULL REFERENCES manufacturers(id),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Role within manufacturer
    role VARCHAR(50) NOT NULL,  -- 'admin', 'editor', 'viewer', 'support'

    -- Permissions
    can_manage_users BOOLEAN DEFAULT FALSE,
    can_publish_documents BOOLEAN DEFAULT FALSE,
    can_manage_certifications BOOLEAN DEFAULT FALSE,
    can_process_warranties BOOLEAN DEFAULT FALSE,
    can_view_telemetry BOOLEAN DEFAULT FALSE,
    can_manage_parts BOOLEAN DEFAULT FALSE,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    invited_by UUID REFERENCES users(id),

    UNIQUE(manufacturer_id, user_id)
);

-- Indexes
CREATE INDEX idx_manufacturers_slug ON manufacturers(slug);
CREATE INDEX idx_manufacturers_category ON manufacturers USING GIN(categories);
CREATE INDEX idx_manufacturers_tier ON manufacturers(tier) WHERE is_active = TRUE;
CREATE INDEX idx_manufacturer_users_mfg ON manufacturer_users(manufacturer_id);
CREATE INDEX idx_manufacturer_users_user ON manufacturer_users(user_id);
```

#### 3.1.1.2 Manufacturer Brand Page

**Page Sections:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    MANUFACTURER BRAND PAGE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  HERO SECTION                                             │   │
│  │  ├── Logo (large)                                         │   │
│  │  ├── Company name                                         │   │
│  │  ├── Tagline/description                                  │   │
│  │  ├── Verified badge                                       │   │
│  │  └── Quick stats (equipment, technicians, docs)           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  TAB NAVIGATION                                           │   │
│  │  ├── Overview                                             │   │
│  │  ├── Documentation                                        │   │
│  │  ├── Certifications                                       │   │
│  │  ├── Parts Catalog                                        │   │
│  │  ├── Training                                             │   │
│  │  └── Support                                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  OVERVIEW TAB                                             │   │
│  │  ├── About section                                        │   │
│  │  ├── Equipment types manufactured                         │   │
│  │  ├── Service regions                                      │   │
│  │  ├── Contact information                                  │   │
│  │  ├── Recent bulletins (preview)                           │   │
│  │  └── Featured certifications                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  DOCUMENTATION TAB                                        │   │
│  │  ├── Document categories                                  │   │
│  │  ├── Search within documents                              │   │
│  │  ├── Filter by equipment model                            │   │
│  │  ├── Document list with download                          │   │
│  │  └── Access restrictions indicator                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.1.2 Documentation Access System

#### 3.1.2.1 Document Publishing

**API Endpoints:**

```
POST   /api/v1/manufacturers/{id}/documents              # Upload document
GET    /api/v1/manufacturers/{id}/documents              # List documents
GET    /api/v1/manufacturers/{id}/documents/{doc_id}     # Get document details
PUT    /api/v1/manufacturers/{id}/documents/{doc_id}     # Update document
DELETE /api/v1/manufacturers/{id}/documents/{doc_id}     # Archive document
POST   /api/v1/manufacturers/{id}/documents/{doc_id}/publish  # Publish document
GET    /api/v1/documents/search                          # Search all documents
```

**Document Types:**

| Type | Description | Typical Access | Update Frequency |
|------|-------------|----------------|------------------|
| `service_manual` | Complete service/repair manual | Certified techs | Rarely |
| `installation_guide` | Installation procedures | Certified techs | Per model |
| `wiring_diagram` | Electrical schematics | Certified techs | Per model |
| `parts_catalog` | Parts list with numbers | All technicians | Quarterly |
| `service_bulletin` | Critical updates/fixes | All technicians | As needed |
| `recall_notice` | Safety recalls | Public | As needed |
| `technical_advisory` | Non-critical updates | Certified techs | Monthly |
| `troubleshooting_guide` | Diagnostic procedures | Certified techs | Per model |
| `specification_sheet` | Equipment specs | Public | Per model |
| `training_material` | Training content | Enrolled users | Per course |
| `safety_notice` | Safety-critical info | Public | As needed |
| `firmware_release` | Software/firmware docs | Certified techs | Per release |

**Access Control Matrix:**

```python
class DocumentAccessLevel(str, Enum):
    PUBLIC = "public"                    # Anyone can access
    REGISTERED = "registered"            # Any SiteSync user
    TECHNICIAN = "technician"            # Verified technicians
    CERTIFIED = "certified"              # Manufacturer-certified only
    AUTHORIZED_COMPANY = "authorized"    # Authorized service companies
    INTERNAL = "internal"                # Manufacturer staff only

# Access level requirements
ACCESS_REQUIREMENTS = {
    DocumentAccessLevel.PUBLIC: [],
    DocumentAccessLevel.REGISTERED: ["authenticated"],
    DocumentAccessLevel.TECHNICIAN: ["authenticated", "technician_profile"],
    DocumentAccessLevel.CERTIFIED: ["authenticated", "technician_profile", "manufacturer_certification"],
    DocumentAccessLevel.AUTHORIZED_COMPANY: ["authenticated", "authorized_service_agreement"],
    DocumentAccessLevel.INTERNAL: ["manufacturer_user"],
}
```

**Request Schema:**

```python
# sitesync_v3/domains/manufacturers/documents/contracts.py

class DocumentType(str, Enum):
    SERVICE_MANUAL = "service_manual"
    INSTALLATION_GUIDE = "installation_guide"
    WIRING_DIAGRAM = "wiring_diagram"
    PARTS_CATALOG = "parts_catalog"
    SERVICE_BULLETIN = "service_bulletin"
    RECALL_NOTICE = "recall_notice"
    TECHNICAL_ADVISORY = "technical_advisory"
    TROUBLESHOOTING_GUIDE = "troubleshooting_guide"
    SPECIFICATION_SHEET = "specification_sheet"
    TRAINING_MATERIAL = "training_material"
    SAFETY_NOTICE = "safety_notice"
    FIRMWARE_RELEASE = "firmware_release"

class ManufacturerDocumentCreate(BaseModel):
    """Request to upload a manufacturer document."""

    # Document info
    title: str = Field(..., min_length=5, max_length=255)
    description: str | None = Field(None, max_length=2000)
    document_type: DocumentType

    # File
    file_id: UUID  # Reference to uploaded file

    # Equipment linking
    equipment_models: list[str] = []  # Model numbers this applies to
    equipment_types: list[str] = []   # General types (hydraulic, traction, etc.)

    # Categorization
    tags: list[str] = []
    language: str = "en"

    # Version control
    version: str | None = None
    supersedes_document_id: UUID | None = None  # Previous version

    # Access control
    access_level: DocumentAccessLevel = DocumentAccessLevel.CERTIFIED

    # Metadata
    effective_date: datetime | None = None
    expiry_date: datetime | None = None
    is_safety_critical: bool = False

class ManufacturerDocumentResponse(BaseModel):
    """Response with document details."""

    id: UUID
    manufacturer_id: UUID
    manufacturer_name: str

    # Document info
    title: str
    description: str | None
    document_type: DocumentType

    # File
    file_url: str  # Signed URL for download
    file_size_bytes: int
    file_type: str
    page_count: int | None

    # Equipment linking
    equipment_models: list[str]
    equipment_types: list[str]

    # Categorization
    tags: list[str]
    language: str

    # Version
    version: str | None
    is_latest_version: bool
    supersedes_document_id: UUID | None
    superseded_by_document_id: UUID | None

    # Access
    access_level: DocumentAccessLevel
    user_has_access: bool
    access_denied_reason: str | None

    # Status
    status: str  # 'draft', 'published', 'archived'
    is_safety_critical: bool

    # Dates
    effective_date: datetime | None
    expiry_date: datetime | None
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime

    # Stats
    download_count: int
    view_count: int
```

**Database Schema:**

```sql
-- Manufacturer documents
CREATE TABLE manufacturer_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manufacturer_id UUID NOT NULL REFERENCES manufacturers(id),

    -- Document info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    document_type VARCHAR(50) NOT NULL,

    -- File reference
    file_id UUID NOT NULL REFERENCES uploaded_files(id),
    page_count INTEGER,

    -- Equipment linking
    equipment_models TEXT[],
    equipment_types TEXT[],

    -- Categorization
    tags TEXT[],
    language CHAR(2) DEFAULT 'en',

    -- Version control
    version VARCHAR(50),
    supersedes_document_id UUID REFERENCES manufacturer_documents(id),

    -- Access control
    access_level VARCHAR(30) NOT NULL DEFAULT 'certified',

    -- Dates
    effective_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,

    -- Flags
    is_safety_critical BOOLEAN DEFAULT FALSE,

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    published_by UUID REFERENCES users(id),

    -- Stats
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,

    -- Full-text search
    search_vector tsvector,

    -- AI processing
    ai_summary TEXT,
    content_embedding vector(1536),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),

    -- Constraints
    CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT valid_access_level CHECK (access_level IN
        ('public', 'registered', 'technician', 'certified', 'authorized', 'internal'))
);

-- Document access log
CREATE TABLE manufacturer_document_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES manufacturer_documents(id),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Access details
    access_type VARCHAR(20) NOT NULL,  -- 'view', 'download'
    access_granted BOOLEAN NOT NULL,
    denial_reason VARCHAR(100),

    -- Context
    ip_address INET,
    user_agent TEXT,

    -- Timestamp
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mfg_docs_manufacturer ON manufacturer_documents(manufacturer_id);
CREATE INDEX idx_mfg_docs_type ON manufacturer_documents(document_type);
CREATE INDEX idx_mfg_docs_models ON manufacturer_documents USING GIN(equipment_models);
CREATE INDEX idx_mfg_docs_search ON manufacturer_documents USING GIN(search_vector);
CREATE INDEX idx_mfg_docs_embedding ON manufacturer_documents USING ivfflat(content_embedding vector_cosine_ops);
CREATE INDEX idx_mfg_docs_published ON manufacturer_documents(published_at) WHERE status = 'published';
```

#### 3.1.2.2 Service Bulletin Distribution

**Bulletin Priority Levels:**

```python
class BulletinPriority(str, Enum):
    SAFETY_CRITICAL = "safety_critical"    # Immediate action required
    RECALL = "recall"                       # Product recall
    URGENT = "urgent"                       # Action within 24-48 hours
    IMPORTANT = "important"                 # Action within 1-2 weeks
    INFORMATIONAL = "informational"         # For awareness only
```

**Bulletin Distribution Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  SERVICE BULLETIN DISTRIBUTION                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. CREATION                                                     │
│     ├── Manufacturer creates bulletin                            │
│     ├── Attaches affected equipment models                       │
│     ├── Sets priority level                                      │
│     └── Adds required action/deadline                            │
│                                                                  │
│  2. TARGETING                                                    │
│     ├── System identifies affected equipment in SiteSync         │
│     ├── Maps to service companies and technicians                │
│     ├── Maps to building owners                                  │
│     └── Determines notification channels per priority            │
│                                                                  │
│  3. DISTRIBUTION                                                 │
│     ├── SAFETY_CRITICAL:                                         │
│     │   ├── Push notification (immediate)                        │
│     │   ├── SMS to certified techs                               │
│     │   ├── Email to all affected parties                        │
│     │   └── Dashboard alert (persistent)                         │
│     ├── RECALL:                                                  │
│     │   ├── Push notification                                    │
│     │   ├── Email to all affected parties                        │
│     │   └── Dashboard alert                                      │
│     ├── URGENT:                                                  │
│     │   ├── Push notification                                    │
│     │   └── Email to technicians and service companies           │
│     ├── IMPORTANT:                                               │
│     │   └── Email and in-app notification                        │
│     └── INFORMATIONAL:                                           │
│         └── In-app notification only                             │
│                                                                  │
│  4. ACKNOWLEDGMENT TRACKING                                      │
│     ├── Track who has viewed                                     │
│     ├── Track who has acknowledged                               │
│     ├── Track completion of required actions                     │
│     └── Escalate non-acknowledgments                             │
│                                                                  │
│  5. COMPLIANCE REPORTING                                         │
│     ├── % equipment addressed                                    │
│     ├── Response time metrics                                    │
│     ├── Outstanding actions                                      │
│     └── Regulatory reporting (if required)                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
POST   /api/v1/manufacturers/{id}/bulletins              # Create bulletin
GET    /api/v1/manufacturers/{id}/bulletins              # List bulletins
GET    /api/v1/bulletins                                 # List all bulletins (for user)
GET    /api/v1/bulletins/{id}                            # Get bulletin details
PUT    /api/v1/manufacturers/{id}/bulletins/{id}         # Update bulletin
POST   /api/v1/bulletins/{id}/acknowledge                # Acknowledge bulletin
GET    /api/v1/bulletins/{id}/acknowledgments            # Get acknowledgment status
POST   /api/v1/bulletins/{id}/mark-complete              # Mark action complete
```

**Request Schema:**

```python
class ServiceBulletinCreate(BaseModel):
    """Request to create a service bulletin."""

    # Bulletin info
    title: str = Field(..., min_length=10, max_length=255)
    summary: str = Field(..., min_length=50, max_length=500)
    content: str  # Rich text content

    # Priority and type
    priority: BulletinPriority
    bulletin_number: str  # Manufacturer's reference number

    # Affected equipment
    affected_models: list[str]  # Model numbers
    affected_serial_ranges: list[dict] | None = None  # {"start": "...", "end": "..."}
    affected_firmware_versions: list[str] | None = None

    # Required action
    action_required: str | None = None
    action_deadline: datetime | None = None
    requires_acknowledgment: bool = True

    # Attachments
    document_ids: list[UUID] = []

    # Distribution
    notify_building_owners: bool = True
    notify_service_companies: bool = True
    notify_technicians: bool = True

    # Regulatory
    is_regulatory_required: bool = False
    regulatory_reference: str | None = None

class ServiceBulletinResponse(BaseModel):
    """Response with bulletin details."""

    id: UUID
    manufacturer_id: UUID
    manufacturer_name: str

    # Bulletin info
    title: str
    summary: str
    content: str
    content_html: str

    # Priority
    priority: BulletinPriority
    bulletin_number: str

    # Affected equipment
    affected_models: list[str]
    affected_serial_ranges: list[dict] | None
    affected_equipment_count: int  # In SiteSync

    # Required action
    action_required: str | None
    action_deadline: datetime | None
    requires_acknowledgment: bool

    # Attachments
    documents: list[ManufacturerDocumentResponse]

    # User's status
    user_acknowledged: bool
    user_acknowledged_at: datetime | None
    user_completed_action: bool
    user_completed_at: datetime | None

    # Overall status
    total_affected_parties: int
    acknowledgment_count: int
    completion_count: int
    acknowledgment_rate: float

    # Dates
    published_at: datetime
    created_at: datetime
    updated_at: datetime
```

---

### 3.1.3 Manufacturer Certification System

#### 3.1.3.1 Certification Program Management

**API Endpoints:**

```
POST   /api/v1/manufacturers/{id}/certifications                    # Create certification program
GET    /api/v1/manufacturers/{id}/certifications                    # List programs
GET    /api/v1/manufacturers/{id}/certifications/{cert_id}          # Get program details
PUT    /api/v1/manufacturers/{id}/certifications/{cert_id}          # Update program
DELETE /api/v1/manufacturers/{id}/certifications/{cert_id}          # Archive program

# Enrollment & completion
POST   /api/v1/certifications/{cert_id}/enroll                      # Enroll in program
GET    /api/v1/certifications/{cert_id}/enrollments                 # List enrollments
POST   /api/v1/certifications/{cert_id}/complete                    # Mark complete (exam passed)
GET    /api/v1/certifications/{cert_id}/verify/{user_id}            # Verify certification

# User's certifications
GET    /api/v1/me/certifications                                     # My certifications
GET    /api/v1/users/{id}/certifications                             # User's certifications (public)
```

**Certification Program Types:**

| Type | Description | Validity | Requirements |
|------|-------------|----------|--------------|
| `equipment_specific` | Specific model certification | 1-3 years | Training + exam |
| `product_line` | Product line authorization | 2-5 years | Multiple equipment certs |
| `master_technician` | Highest manufacturer level | 3-5 years | Years exp + advanced exam |
| `installer` | Installation authorization | 2-3 years | Training + practical |
| `modernization` | Modernization specialist | 2-3 years | Advanced training |
| `safety` | Safety system specialist | 1-2 years | Annual recert |

**Certification Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    CERTIFICATION FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DISCOVERY                                                    │
│     ├── Browse manufacturer certification programs               │
│     ├── View requirements and prerequisites                      │
│     ├── Check eligibility                                        │
│     └── See training schedule/locations                          │
│                                                                  │
│  2. ENROLLMENT                                                   │
│     ├── Submit enrollment request                                │
│     ├── Employer approval (if required)                          │
│     ├── Pay enrollment fee (if any)                              │
│     └── Access pre-training materials                            │
│                                                                  │
│  3. TRAINING                                                     │
│     ├── Online modules (self-paced)                              │
│     ├── Instructor-led sessions (scheduled)                      │
│     ├── Hands-on practical (in-person)                           │
│     ├── Progress tracking                                        │
│     └── Training completion                                      │
│                                                                  │
│  4. EXAMINATION                                                  │
│     ├── Schedule exam                                            │
│     ├── Online proctored exam OR                                 │
│     ├── In-person exam center                                    │
│     ├── Practical demonstration (if required)                    │
│     └── Results notification                                     │
│                                                                  │
│  5. CERTIFICATION                                                │
│     ├── Certificate issued                                       │
│     ├── Digital badge awarded                                    │
│     ├── Added to certified directory                             │
│     ├── Profile updated                                          │
│     └── Employer notified                                        │
│                                                                  │
│  6. MAINTENANCE                                                  │
│     ├── Validity tracking                                        │
│     ├── Expiry notifications (90, 60, 30 days)                   │
│     ├── Renewal requirements                                     │
│     ├── Continuing education credits                             │
│     └── Recertification process                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Request Schema:**

```python
class CertificationProgramCreate(BaseModel):
    """Request to create a certification program."""

    # Program info
    name: str = Field(..., min_length=5, max_length=255)
    code: str = Field(..., min_length=2, max_length=50)  # e.g., "KONE-MRL-2024"
    description: str

    # Type and level
    certification_type: str
    level: str  # "entry", "intermediate", "advanced", "expert"

    # Equipment scope
    applicable_equipment_types: list[str]
    applicable_models: list[str] = []

    # Requirements
    prerequisites: list[UUID] = []  # Other certifications required
    minimum_experience_years: int = 0
    required_training_hours: int = 0
    requires_practical_exam: bool = False
    requires_employer_sponsorship: bool = False

    # Training structure
    training_modules: list[dict]  # [{"id": "...", "title": "...", "hours": 4}]
    online_training_available: bool = True
    in_person_training_available: bool = True
    training_locations: list[str] = []  # Regions/cities

    # Examination
    exam_format: str  # "online", "in_person", "both"
    exam_duration_minutes: int = 120
    passing_score: int = 70
    max_attempts: int = 3

    # Certification
    validity_months: int = 24
    renewal_requirements: str | None = None
    continuing_education_required: bool = False
    ce_credits_per_year: int = 0

    # Pricing
    enrollment_fee: float = 0.0
    exam_fee: float = 0.0
    renewal_fee: float = 0.0
    currency: str = "USD"

class UserCertificationResponse(BaseModel):
    """Response with user's certification status."""

    id: UUID
    user_id: UUID
    certification_program_id: UUID

    # Program info
    program_name: str
    program_code: str
    manufacturer_id: UUID
    manufacturer_name: str

    # Status
    status: str  # 'enrolled', 'training', 'exam_scheduled', 'certified', 'expired', 'revoked'

    # Training progress
    training_progress_percent: float
    completed_modules: list[str]
    remaining_modules: list[str]

    # Exam
    exam_scheduled_at: datetime | None
    exam_attempts: int
    last_exam_score: int | None

    # Certification
    certified_at: datetime | None
    expires_at: datetime | None
    certificate_number: str | None
    certificate_url: str | None  # Download link

    # Digital badge
    badge_url: str | None
    badge_verification_url: str | None

    # CE tracking
    ce_credits_earned: int
    ce_credits_required: int
    ce_credits_due_date: datetime | None

    # Metadata
    enrolled_at: datetime
    updated_at: datetime
```

**Database Schema:**

```sql
-- Certification programs
CREATE TABLE certification_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manufacturer_id UUID NOT NULL REFERENCES manufacturers(id),

    -- Program info
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,

    -- Type and level
    certification_type VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,

    -- Equipment scope
    applicable_equipment_types TEXT[],
    applicable_models TEXT[],

    -- Requirements
    prerequisites UUID[],  -- Other certification IDs
    minimum_experience_years INTEGER DEFAULT 0,
    required_training_hours INTEGER DEFAULT 0,
    requires_practical_exam BOOLEAN DEFAULT FALSE,
    requires_employer_sponsorship BOOLEAN DEFAULT FALSE,

    -- Training
    training_modules JSONB,
    online_training_available BOOLEAN DEFAULT TRUE,
    in_person_training_available BOOLEAN DEFAULT TRUE,
    training_locations TEXT[],

    -- Examination
    exam_format VARCHAR(20) NOT NULL,
    exam_duration_minutes INTEGER DEFAULT 120,
    passing_score INTEGER DEFAULT 70,
    max_attempts INTEGER DEFAULT 3,

    -- Certification validity
    validity_months INTEGER DEFAULT 24,
    renewal_requirements TEXT,
    continuing_education_required BOOLEAN DEFAULT FALSE,
    ce_credits_per_year INTEGER DEFAULT 0,

    -- Pricing
    enrollment_fee DECIMAL(10, 2) DEFAULT 0,
    exam_fee DECIMAL(10, 2) DEFAULT 0,
    renewal_fee DECIMAL(10, 2) DEFAULT 0,
    currency CHAR(3) DEFAULT 'USD',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(manufacturer_id, code)
);

-- User certifications
CREATE TABLE user_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    certification_program_id UUID NOT NULL REFERENCES certification_programs(id),

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'enrolled',

    -- Training
    training_progress_percent DECIMAL(5, 2) DEFAULT 0,
    completed_modules TEXT[],
    training_completed_at TIMESTAMPTZ,

    -- Exam
    exam_scheduled_at TIMESTAMPTZ,
    exam_location VARCHAR(255),
    exam_attempts INTEGER DEFAULT 0,
    last_exam_score INTEGER,
    exam_passed_at TIMESTAMPTZ,

    -- Certification
    certified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    certificate_number VARCHAR(100) UNIQUE,
    certificate_file_id UUID REFERENCES uploaded_files(id),

    -- Badge
    badge_claim_code VARCHAR(100) UNIQUE,
    badge_claimed_at TIMESTAMPTZ,

    -- CE tracking
    ce_credits_earned INTEGER DEFAULT 0,
    ce_last_updated TIMESTAMPTZ,

    -- Sponsorship
    sponsored_by_organization_id UUID REFERENCES organizations(id),

    -- Metadata
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_status CHECK (status IN
        ('enrolled', 'training', 'exam_scheduled', 'exam_failed', 'certified', 'expired', 'revoked'))
);

-- Indexes
CREATE INDEX idx_cert_programs_manufacturer ON certification_programs(manufacturer_id);
CREATE INDEX idx_cert_programs_type ON certification_programs(certification_type);
CREATE INDEX idx_user_certs_user ON user_certifications(user_id);
CREATE INDEX idx_user_certs_program ON user_certifications(certification_program_id);
CREATE INDEX idx_user_certs_status ON user_certifications(status);
CREATE INDEX idx_user_certs_expires ON user_certifications(expires_at) WHERE status = 'certified';
```

#### 3.1.3.2 Certified Technician Directory

**API Endpoints:**

```
GET    /api/v1/certified-technicians                    # Search certified technicians
GET    /api/v1/certified-technicians/{id}               # Get technician profile
GET    /api/v1/manufacturers/{id}/certified-technicians # Manufacturer's certified techs
POST   /api/v1/certifications/verify                    # Verify a certification
```

**Directory Features:**

```
┌─────────────────────────────────────────────────────────────────┐
│               CERTIFIED TECHNICIAN DIRECTORY                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SEARCH & FILTERS                                                │
│  ├── Manufacturer filter                                         │
│  ├── Certification type filter                                   │
│  ├── Location/region filter                                      │
│  ├── Certification status (active only / all)                    │
│  └── Equipment model expertise                                   │
│                                                                  │
│  SEARCH RESULTS                                                  │
│  ├── Technician name (if public profile)                         │
│  ├── Company name                                                │
│  ├── Certifications held (with badges)                           │
│  ├── Years certified                                             │
│  ├── Service region                                              │
│  └── Contact (via company)                                       │
│                                                                  │
│  VERIFICATION                                                    │
│  ├── Certificate number lookup                                   │
│  ├── QR code verification                                        │
│  ├── Real-time status check                                      │
│  └── Official verification letter generation                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.1.4 Parts Catalog Integration

#### 3.1.4.1 Manufacturer Parts Catalog

**API Endpoints:**

```
POST   /api/v1/manufacturers/{id}/parts-catalog/sync     # Sync catalog
GET    /api/v1/manufacturers/{id}/parts                  # Browse parts
GET    /api/v1/manufacturers/{id}/parts/{part_number}    # Get part details
GET    /api/v1/parts/search                              # Search all manufacturer parts
GET    /api/v1/parts/cross-reference                     # Find alternatives
POST   /api/v1/parts/order                               # Place order
```

**Request Schema:**

```python
class ManufacturerPart(BaseModel):
    """Manufacturer part from catalog."""

    # Identification
    part_number: str
    manufacturer_id: UUID
    manufacturer_name: str

    # Description
    name: str
    description: str
    category: str
    subcategory: str | None

    # Specifications
    specifications: dict
    weight_kg: float | None
    dimensions: dict | None  # {"length": x, "width": y, "height": z, "unit": "mm"}

    # Compatibility
    compatible_models: list[str]
    compatible_equipment_types: list[str]
    supersedes_part_numbers: list[str] = []
    superseded_by: str | None = None

    # Pricing & availability
    list_price: float | None
    currency: str = "USD"
    availability_status: str  # 'in_stock', 'low_stock', 'out_of_stock', 'discontinued', 'special_order'
    lead_time_days: int | None
    minimum_order_quantity: int = 1

    # Media
    image_urls: list[str] = []
    documentation_ids: list[UUID] = []

    # Warranty
    warranty_months: int | None

    # Metadata
    last_updated: datetime
    is_active: bool = True

class PartOrderRequest(BaseModel):
    """Request to order parts."""

    # Items
    items: list[dict]  # [{"part_number": "...", "quantity": 2}]

    # Shipping
    shipping_address_id: UUID
    shipping_method: str

    # Payment
    payment_method_id: UUID

    # Purchase order
    purchase_order_number: str | None = None

    # Notes
    special_instructions: str | None = None
```

**Catalog Sync Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARTS CATALOG SYNC                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SYNC METHODS:                                                   │
│                                                                  │
│  1. API Integration (Preferred)                                  │
│     ├── Manufacturer provides API endpoint                       │
│     ├── Real-time inventory & pricing                            │
│     ├── Order submission API                                     │
│     └── Order status webhook                                     │
│                                                                  │
│  2. File Upload                                                  │
│     ├── CSV/Excel catalog upload                                 │
│     ├── Scheduled sync (daily/weekly)                            │
│     ├── Manual price updates                                     │
│     └── Inventory flags only                                     │
│                                                                  │
│  3. Hybrid                                                       │
│     ├── Catalog via file upload                                  │
│     ├── Inventory via API                                        │
│     └── Orders via email/EDI                                     │
│                                                                  │
│  PROCESSING:                                                     │
│                                                                  │
│  1. Receive catalog data                                         │
│  2. Validate schema                                              │
│  3. Match to existing parts (update vs create)                   │
│  4. Update compatibility mappings                                │
│  5. Update search index                                          │
│  6. Generate change report                                       │
│  7. Notify affected users (price changes, discontinuations)      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3.1.5 Manufacturer Data Exchange

#### 3.1.5.1 Equipment Telemetry Integration

**API Endpoints:**

```
POST   /api/v1/manufacturers/{id}/telemetry/register     # Register telemetry source
POST   /api/v1/telemetry/ingest                          # Ingest telemetry data
GET    /api/v1/manufacturers/{id}/telemetry/equipment    # View connected equipment
GET    /api/v1/manufacturers/{id}/telemetry/anomalies    # View detected anomalies
POST   /api/v1/manufacturers/{id}/telemetry/subscribe    # Subscribe to equipment
```

**Telemetry Data Model:**

```python
class TelemetryDataPoint(BaseModel):
    """Single telemetry reading."""

    # Equipment identification
    equipment_serial: str
    manufacturer_id: UUID

    # Reading
    metric_name: str
    metric_value: float
    metric_unit: str

    # Timestamp
    timestamp: datetime

    # Context
    operating_mode: str | None
    floor_position: int | None
    door_status: str | None

    # Quality
    data_quality: str = "good"  # 'good', 'suspect', 'bad'

class TelemetryBatch(BaseModel):
    """Batch of telemetry data."""

    source_id: str
    batch_timestamp: datetime
    data_points: list[TelemetryDataPoint]
    checksum: str

class AnomalyAlert(BaseModel):
    """Detected anomaly from telemetry."""

    id: UUID
    equipment_id: UUID
    equipment_serial: str
    manufacturer_id: UUID

    # Anomaly details
    anomaly_type: str
    severity: str  # 'low', 'medium', 'high', 'critical'
    description: str

    # Evidence
    metric_name: str
    expected_range: dict  # {"min": x, "max": y}
    actual_value: float

    # Context
    detected_at: datetime
    detection_method: str  # 'threshold', 'ml_model', 'pattern'
    confidence_score: float

    # Related data
    related_metrics: list[dict]

    # Actions
    recommended_action: str | None
    auto_work_order_created: bool
    work_order_id: UUID | None
```

#### 3.1.5.2 Anonymized Field Data Sharing

**Data Sharing Agreement:**

```python
class ManufacturerDataSharingAgreement(BaseModel):
    """Agreement for sharing field data with manufacturer."""

    manufacturer_id: UUID

    # Data types shared
    share_failure_patterns: bool = True
    share_part_replacement_data: bool = True
    share_service_duration_data: bool = True
    share_environmental_conditions: bool = False
    share_usage_patterns: bool = False

    # Anonymization level
    anonymization_level: str  # 'full', 'regional', 'model_only'

    # Aggregation
    minimum_aggregation_count: int = 10  # Don't share if < 10 data points

    # Exclusions
    excluded_organizations: list[UUID] = []  # Orgs that opt out
    excluded_regions: list[str] = []

    # Timing
    data_retention_months: int = 24
    sharing_frequency: str = "monthly"

    # Legal
    agreement_signed_at: datetime
    agreement_version: str
    signed_by: str
```

#### 3.1.5.3 Warranty Claim Processing

**API Endpoints:**

```
POST   /api/v1/warranty/claims                           # Submit warranty claim
GET    /api/v1/warranty/claims                           # List claims
GET    /api/v1/warranty/claims/{id}                      # Get claim details
PUT    /api/v1/warranty/claims/{id}                      # Update claim
GET    /api/v1/warranty/check                            # Check warranty status
```

**Warranty Claim Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    WARRANTY CLAIM FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. WARRANTY CHECK                                               │
│     ├── Technician enters equipment serial                       │
│     ├── System checks warranty status                            │
│     ├── Returns coverage details                                 │
│     └── Shows claim requirements                                 │
│                                                                  │
│  2. CLAIM INITIATION                                             │
│     ├── Pre-populated from work order                            │
│     ├── Add failure description                                  │
│     ├── Attach photos (before/after)                             │
│     ├── Attach failed part photo                                 │
│     └── Select claim type (parts/labor/both)                     │
│                                                                  │
│  3. AUTOMATIC VALIDATION                                         │
│     ├── Verify equipment in warranty                             │
│     ├── Verify part covered                                      │
│     ├── Check for previous claims (same issue)                   │
│     ├── Verify authorized servicer                               │
│     └── AI review of photos and description                      │
│                                                                  │
│  4. SUBMISSION                                                   │
│     ├── Auto-approved (if criteria met)                          │
│     ├── Pending review (if flags raised)                         │
│     └── Rejected (if clearly not covered)                        │
│                                                                  │
│  5. MANUFACTURER PROCESSING                                      │
│     ├── Claim received notification                              │
│     ├── Review by warranty team                                  │
│     ├── Request additional info (if needed)                      │
│     ├── Approve/deny with reason                                 │
│     └── Process payment/credit                                   │
│                                                                  │
│  6. RESOLUTION                                                   │
│     ├── Credit issued / payment sent                             │
│     ├── Replacement part shipped                                 │
│     ├── Claim closed                                             │
│     └── Feedback requested                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Request Schema:**

```python
class WarrantyClaimCreate(BaseModel):
    """Request to submit a warranty claim."""

    # Equipment
    equipment_id: UUID
    equipment_serial: str

    # Linked work order
    work_order_id: UUID | None = None

    # Failure info
    failure_date: datetime
    failure_description: str
    fault_code: str | None = None

    # Failed part
    failed_part_number: str
    failed_part_serial: str | None = None

    # Replacement
    replacement_part_number: str
    replacement_part_serial: str | None = None

    # Claim type
    claim_type: str  # 'parts_only', 'labor_only', 'parts_and_labor'

    # Costs
    parts_cost: float | None = None
    labor_hours: float | None = None
    labor_rate: float | None = None

    # Evidence
    photo_ids: list[UUID] = []  # Before, after, failed part

    # Additional info
    notes: str | None = None

class WarrantyClaimResponse(BaseModel):
    """Response with warranty claim details."""

    id: UUID
    claim_number: str

    # Equipment
    equipment_id: UUID
    equipment_serial: str
    manufacturer_id: UUID
    manufacturer_name: str

    # Status
    status: str  # 'submitted', 'under_review', 'approved', 'denied', 'paid', 'closed'
    status_reason: str | None

    # Claim details
    claim_type: str
    failure_date: datetime
    failure_description: str

    # Parts
    failed_part_number: str
    replacement_part_number: str

    # Financials
    claimed_amount: float
    approved_amount: float | None
    currency: str

    # Processing
    submitted_at: datetime
    reviewed_at: datetime | None
    reviewed_by: str | None
    resolved_at: datetime | None

    # Payment
    payment_method: str | None
    payment_reference: str | None
    paid_at: datetime | None
```

---

### 3.1.6 Authorized Service Provider Program

**API Endpoints:**

```
POST   /api/v1/manufacturers/{id}/asp/apply              # Apply for ASP status
GET    /api/v1/manufacturers/{id}/asp/applications       # List applications
GET    /api/v1/manufacturers/{id}/asp/providers          # List authorized providers
PUT    /api/v1/manufacturers/{id}/asp/{org_id}/status    # Update ASP status
GET    /api/v1/asp/directory                             # Public ASP directory
```

**ASP Requirements Matrix:**

```python
class ASPRequirements(BaseModel):
    """Requirements for Authorized Service Provider status."""

    manufacturer_id: UUID

    # Certification requirements
    minimum_certified_technicians: int = 2
    required_certification_types: list[str]

    # Insurance requirements
    minimum_liability_coverage: float = 1_000_000
    minimum_workers_comp: bool = True

    # Equipment requirements
    required_diagnostic_tools: list[str]
    required_special_tools: list[str]

    # Training requirements
    annual_training_hours_per_tech: int = 20

    # Performance requirements
    minimum_first_time_fix_rate: float = 0.80
    maximum_callback_rate: float = 0.10
    minimum_customer_satisfaction: float = 4.0

    # Business requirements
    minimum_years_in_business: int = 2
    minimum_annual_revenue: float | None = None

    # Geographic coverage
    required_service_area: str | None = None
    response_time_requirements: dict | None = None

class ASPApplication(BaseModel):
    """Application for ASP status."""

    manufacturer_id: UUID
    organization_id: UUID

    # Certifications
    certified_technician_ids: list[UUID]

    # Insurance
    liability_policy_document_id: UUID
    workers_comp_document_id: UUID

    # Equipment proof
    tool_inventory_document_id: UUID

    # Business info
    years_in_business: int
    annual_revenue_range: str
    employee_count: int

    # Service area
    primary_service_region: str
    secondary_regions: list[str] = []

    # References
    customer_references: list[dict]  # [{"company": "...", "contact": "...", "phone": "..."}]

    # Commitment
    agrees_to_terms: bool
    agrees_to_training_requirements: bool
    agrees_to_quality_standards: bool
```

---

## Success Metrics

### Phase 3.1 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Manufacturer partnerships | 3+ | Signed agreements |
| Documents published | 10,000+ | Unique documents |
| Bulletin distribution | 90%+ | Acknowledgment rate |
| Certifications tracked | 5,000+ | Active certifications |
| Parts orders | $50K+/mo | GMV through platform |
| Warranty claims processed | 500+ | Monthly claims |
| Connected equipment | 1,000+ | Telemetry-enabled |

### KPIs

1. **Manufacturer Engagement**
   - Documents uploaded per manufacturer
   - Bulletin response time
   - Portal login frequency
   - Support ticket volume

2. **Technician Adoption**
   - Document downloads per tech
   - Certification enrollment rate
   - Parts ordering adoption
   - Bulletin acknowledgment time

3. **Building Owner Value**
   - Certification verifications
   - Warranty visibility usage
   - Recall notification delivery

4. **Business Metrics**
   - Parts marketplace GMV from OEM
   - Warranty processing efficiency
   - Training revenue share

---

## Implementation Notes

### Initial Manufacturer Targets

| Manufacturer | Priority | Rationale |
|--------------|----------|-----------|
| KONE | HIGH | Innovation leader, API-friendly |
| Otis | HIGH | Market leader, large install base |
| Schindler | HIGH | Global presence |
| ThyssenKrupp | MEDIUM | Strong in modernization |
| Mitsubishi | MEDIUM | Growing market share |
| Fujitec | LOW | Regional presence |
| Hyundai | LOW | Emerging player |

### Partnership Development Timeline

```
Month 1-2: Initial outreach, NDAs
Month 2-3: Technical discovery, API assessment
Month 3-4: Pilot agreement, integration development
Month 4-5: Testing with select customers
Month 5-6: Production launch
Month 6+: Expansion and optimization
```

### Risk Considerations

1. **Competitive concerns**: Manufacturers may view platform as competition
   - Mitigation: Position as distribution channel, not replacement

2. **Data sensitivity**: Reluctance to share field data
   - Mitigation: Strong anonymization, clear value proposition

3. **Integration complexity**: Legacy systems difficult to integrate
   - Mitigation: Multiple integration options (API, file, manual)

4. **Certification cannibalization**: Fear of undermining direct training
   - Mitigation: Revenue share on training, expanded reach

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
