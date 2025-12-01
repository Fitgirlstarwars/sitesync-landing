# Phase 3.3: Insurance Integration

> Detailed implementation specification for building and contractor insurance features
> Status: Design Phase
> Priority: HIGH - Significant value for risk management and cost reduction
> Dependencies: Phase 2.1 (Job Marketplace), Phase 0 (Core Platform)

---

## Overview

The Insurance Integration creates connections between SiteSync's maintenance data and the insurance industry to:

1. **Leverage** building maintenance data for better insurance rates
2. **Verify** contractor insurance coverage automatically
3. **Streamline** claims processing with documented maintenance history
4. **Connect** buildings and contractors with insurance providers
5. **Enable** risk-based pricing using Building Health Score

---

## User Stories

### As a Building Owner:

1. **US-INS001:** I want to see how my maintenance impacts insurance so I understand the financial benefit
2. **US-INS002:** I want to generate compliance reports for my insurer so renewals are easier
3. **US-INS003:** I want to compare insurance quotes using my SiteSync data so I get better rates
4. **US-INS004:** I want to document incidents properly so claims are processed faster
5. **US-INS005:** I want to verify my contractor's insurance automatically so I'm always protected
6. **US-INS006:** I want to receive alerts when contractor insurance expires so I don't have gaps
7. **US-INS007:** I want my Building Health Score to help reduce my premiums so maintenance pays off
8. **US-INS008:** I want to understand what incidents affect my rates so I can take preventive action

### As a Service Company:

9. **US-INS009:** I want to manage all my insurance certificates in one place so I stay organized
10. **US-INS010:** I want to share insurance proof with clients automatically so I reduce admin work
11. **US-INS011:** I want to receive renewal reminders so I never have gaps in coverage
12. **US-INS012:** I want to compare insurance providers so I get competitive rates
13. **US-INS013:** I want my safety record to help lower premiums so good performance is rewarded
14. **US-INS014:** I want to track workers' comp across all employees so I maintain compliance

### As a Technician:

15. **US-INS015:** I want to report incidents properly so claims are handled correctly
16. **US-INS016:** I want to document unsafe conditions so there's a record if incidents occur
17. **US-INS017:** I want to understand my coverage when working at different sites so I'm protected

### As an Insurance Company:

18. **US-INS018:** I want to access verified maintenance data so I can assess risk accurately
19. **US-INS019:** I want to see Building Health Scores so I can price policies appropriately
20. **US-INS020:** I want to receive claims with documentation so processing is faster
21. **US-INS021:** I want to detect potential fraud patterns so I reduce losses
22. **US-INS022:** I want to offer preventive recommendations so buildings reduce risk
23. **US-INS023:** I want to integrate my systems with SiteSync so operations are efficient

---

## Feature Breakdown

### 3.3.1 Building Insurance Features

#### 3.3.1.1 Building Health Score to Premium Calculator

**Health Score Components for Insurance:**

```python
# sitesync_v3/domains/insurance/scoring.py

class InsuranceRiskFactors(BaseModel):
    """Risk factors affecting insurance premiums."""

    building_id: UUID

    # Equipment condition (40% of score)
    equipment_condition: dict
    # {
    #     "overall_score": 85,
    #     "equipment_age_factor": 0.9,  # 1.0 = new, 0.5 = end of life
    #     "modernization_status": "current",  # 'current', 'needed', 'overdue'
    #     "critical_defects": 0,
    #     "minor_defects": 2
    # }

    # Maintenance compliance (30% of score)
    maintenance_compliance: dict
    # {
    #     "overall_score": 92,
    #     "inspection_compliance_rate": 100,  # % of inspections on time
    #     "maintenance_schedule_adherence": 95,
    #     "outstanding_work_orders": 1,
    #     "average_response_time_hours": 4.2
    # }

    # Safety record (20% of score)
    safety_record: dict
    # {
    #     "overall_score": 95,
    #     "incidents_last_12_months": 0,
    #     "entrapments_last_12_months": 1,
    #     "safety_violations": 0,
    #     "near_misses_reported": 3  # Good - shows safety culture
    # }

    # Contractor quality (10% of score)
    contractor_quality: dict
    # {
    #     "overall_score": 88,
    #     "contractor_rating": 4.5,
    #     "certified_technicians_rate": 100,
    #     "contractor_insurance_verified": True
    # }

    # Final scores
    composite_risk_score: int  # 0-100, higher = lower risk
    risk_category: str  # 'low', 'moderate', 'high', 'unacceptable'
    estimated_premium_impact: str  # 'discount', 'standard', 'surcharge'

class PremiumEstimate(BaseModel):
    """Estimated premium based on building data."""

    building_id: UUID
    building_name: str

    # Risk assessment
    risk_score: int
    risk_category: str

    # Estimated impact
    base_premium_estimate: float  # Industry average for this building type
    sitesync_adjustment_percent: float  # -20% to +30%
    estimated_premium_range: dict
    # {"min": 15000, "max": 18000, "currency": "USD"}

    # Factors
    positive_factors: list[str]
    # ["100% inspection compliance", "Zero incidents in 24 months", ...]
    negative_factors: list[str]
    # ["Equipment approaching end of life", ...]

    # Recommendations
    premium_reduction_opportunities: list[dict]
    # [{"action": "Complete modernization", "estimated_savings_percent": 5}]
```

**API Endpoints:**

```
GET    /api/v1/buildings/{id}/insurance/risk-assessment  # Get risk assessment
GET    /api/v1/buildings/{id}/insurance/premium-estimate # Estimate premium
GET    /api/v1/buildings/{id}/insurance/report           # Generate insurance report
POST   /api/v1/buildings/{id}/insurance/share            # Share with insurer
```

#### 3.3.1.2 Compliance Documentation Package

**Documentation Bundle Contents:**

```
┌─────────────────────────────────────────────────────────────────┐
│                 INSURANCE DOCUMENTATION PACKAGE                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. BUILDING OVERVIEW                                            │
│     ├── Building information                                     │
│     ├── Equipment inventory                                      │
│     ├── Equipment specifications                                 │
│     ├── Building Health Score                                    │
│     └── Risk assessment summary                                  │
│                                                                  │
│  2. INSPECTION HISTORY                                           │
│     ├── Annual inspection certificates                           │
│     ├── Periodic test results                                    │
│     ├── Code compliance status                                   │
│     ├── Defect history and resolutions                           │
│     └── Inspector certifications                                 │
│                                                                  │
│  3. MAINTENANCE RECORDS                                          │
│     ├── Maintenance schedule and adherence                       │
│     ├── Work order history (summary)                             │
│     ├── Parts replacement history                                │
│     ├── Modernization history                                    │
│     └── Contractor information                                   │
│                                                                  │
│  4. SAFETY RECORDS                                               │
│     ├── Incident reports                                         │
│     ├── Entrapment log                                           │
│     ├── Safety violation history                                 │
│     ├── Near-miss reports                                        │
│     └── Safety improvements made                                 │
│                                                                  │
│  5. CONTRACTOR VERIFICATION                                      │
│     ├── Current contractor information                           │
│     ├── Contractor insurance certificates                        │
│     ├── Technician certifications                                │
│     └── Contractor performance metrics                           │
│                                                                  │
│  6. ATTESTATIONS                                                 │
│     ├── Building owner attestation                               │
│     ├── Contractor attestation                                   │
│     ├── Data verification statement                              │
│     └── Report generation timestamp                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
POST   /api/v1/buildings/{id}/insurance/documentation    # Generate doc package
GET    /api/v1/buildings/{id}/insurance/documentation    # List generated packages
GET    /api/v1/insurance/documentation/{pkg_id}          # Download package
POST   /api/v1/insurance/documentation/{pkg_id}/share    # Share with insurer
```

#### 3.3.1.3 Claims Support System

**Claim Documentation Flow:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLAIMS DOCUMENTATION FLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. INCIDENT OCCURS                                              │
│     ├── Technician logs incident in SiteSync                     │
│     ├── Auto-capture: date, time, location, equipment            │
│     ├── Photos/videos attached                                   │
│     ├── Witness information collected                            │
│     └── Initial description recorded                             │
│                                                                  │
│  2. INCIDENT ENRICHMENT                                          │
│     ├── Recent maintenance history auto-attached                 │
│     ├── Recent inspection results attached                       │
│     ├── Equipment condition at time of incident                  │
│     ├── Similar incidents flagged                                │
│     └── AI analysis of contributing factors                      │
│                                                                  │
│  3. CLAIM INITIATION                                             │
│     ├── Building owner initiates claim                           │
│     ├── Claim type selected                                      │
│     ├── Preliminary damage assessment                            │
│     └── Notification to insurer (if integrated)                  │
│                                                                  │
│  4. DOCUMENTATION PACKAGE                                        │
│     ├── Incident report                                          │
│     ├── Supporting maintenance records                           │
│     ├── Equipment history                                        │
│     ├── Photo/video evidence                                     │
│     ├── Witness statements                                       │
│     └── Third-party reports (if any)                             │
│                                                                  │
│  5. CLAIM SUBMISSION                                             │
│     ├── Submit to insurer portal (if integrated)                 │
│     ├── Download for manual submission                           │
│     ├── Track claim status                                       │
│     └── Respond to information requests                          │
│                                                                  │
│  6. RESOLUTION                                                   │
│     ├── Claim outcome recorded                                   │
│     ├── Settlement details logged                                │
│     ├── Lessons learned documented                               │
│     └── Preventive measures identified                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Request Schema:**

```python
class IncidentReport(BaseModel):
    """Incident report for insurance purposes."""

    id: UUID
    building_id: UUID
    equipment_id: UUID | None

    # Basic info
    incident_type: str  # 'injury', 'property_damage', 'entrapment', 'near_miss', 'equipment_failure'
    incident_date: datetime
    incident_location: str
    description: str

    # People involved
    injured_parties: list[dict] | None
    # [{"name": "...", "role": "passenger", "injury_description": "...", "treatment_sought": true}]
    witnesses: list[dict] | None
    # [{"name": "...", "contact": "...", "statement": "..."}]

    # Damage
    property_damage_description: str | None
    estimated_damage_amount: float | None

    # Equipment status
    equipment_status_at_incident: str
    equipment_last_inspection_date: date
    equipment_last_maintenance_date: date

    # Evidence
    photo_ids: list[UUID]
    video_ids: list[UUID]
    document_ids: list[UUID]

    # Response
    immediate_actions_taken: str
    equipment_status_after: str  # 'operational', 'out_of_service', 'restricted'

    # Reporting
    reported_by_user_id: UUID
    reported_at: datetime
    authorities_notified: bool
    authority_report_number: str | None

class InsuranceClaim(BaseModel):
    """Insurance claim based on incident."""

    id: UUID
    incident_id: UUID
    building_id: UUID

    # Claim info
    claim_type: str  # 'liability', 'property', 'workers_comp', 'equipment'
    policy_number: str
    insurer_name: str

    # Status
    status: str  # 'draft', 'submitted', 'under_review', 'approved', 'denied', 'settled', 'closed'

    # Amounts
    claimed_amount: float | None
    approved_amount: float | None
    settlement_amount: float | None

    # Documentation
    documentation_package_id: UUID
    supplementary_document_ids: list[UUID]

    # Communication
    adjuster_name: str | None
    adjuster_contact: str | None
    claim_reference_number: str | None

    # Timeline
    submitted_at: datetime | None
    last_activity_at: datetime | None
    resolved_at: datetime | None
```

#### 3.3.1.4 Insurance Quote Comparison

**API Endpoints:**

```
GET    /api/v1/buildings/{id}/insurance/quotes           # Get available quotes
POST   /api/v1/buildings/{id}/insurance/quote-request    # Request quotes
GET    /api/v1/insurance/providers                       # List partner insurers
POST   /api/v1/insurance/compare                         # Compare quotes
```

**Quote Comparison Schema:**

```python
class InsuranceQuoteRequest(BaseModel):
    """Request for insurance quotes."""

    building_id: UUID

    # Coverage needs
    coverage_types: list[str]  # ['general_liability', 'property', 'equipment_breakdown']
    coverage_amount: float
    deductible_preference: str  # 'low', 'medium', 'high'

    # Current policy (if renewing)
    current_insurer: str | None
    current_premium: float | None
    renewal_date: date | None

    # Sharing preferences
    share_full_maintenance_history: bool = True
    share_incident_history: bool = True
    share_building_health_score: bool = True

    # Contact
    contact_email: str
    contact_phone: str

class InsuranceQuote(BaseModel):
    """Quote from an insurance provider."""

    id: UUID
    provider_id: UUID
    provider_name: str
    provider_logo_url: str | None

    # Quote details
    quote_reference: str
    valid_until: date

    # Coverage
    coverage_types: list[str]
    coverage_amount: float
    deductible: float

    # Pricing
    annual_premium: float
    monthly_premium: float
    currency: str

    # Discounts
    sitesync_discount_percent: float  # Discount for using SiteSync
    maintenance_discount_percent: float  # Based on maintenance quality
    total_discount_percent: float
    savings_vs_standard: float

    # Terms
    policy_term_months: int
    key_exclusions: list[str]
    key_inclusions: list[str]

    # Comparison
    vs_current_policy: dict | None
    # {"premium_change_percent": -12, "coverage_change": "equivalent"}

    # Next steps
    can_bind_online: bool
    requires_inspection: bool
    additional_info_required: list[str]
```

---

### 3.3.2 Contractor Insurance Features

#### 3.3.2.1 Certificate Management System

**API Endpoints:**

```
POST   /api/v1/organizations/{id}/insurance/certificates     # Add certificate
GET    /api/v1/organizations/{id}/insurance/certificates     # List certificates
GET    /api/v1/organizations/{id}/insurance/certificates/{id} # Get certificate
PUT    /api/v1/organizations/{id}/insurance/certificates/{id} # Update certificate
DELETE /api/v1/organizations/{id}/insurance/certificates/{id} # Remove certificate
GET    /api/v1/organizations/{id}/insurance/compliance       # Compliance status
```

**Certificate Types:**

| Type | Description | Typical Limit | Renewal |
|------|-------------|---------------|---------|
| `general_liability` | General liability insurance | $1M-$5M | Annual |
| `professional_liability` | Errors & omissions | $1M-$2M | Annual |
| `workers_compensation` | Workers' comp coverage | State minimum | Annual |
| `commercial_auto` | Vehicle coverage | $1M | Annual |
| `umbrella` | Excess liability | $1M-$10M | Annual |
| `equipment_floater` | Tools & equipment | Varies | Annual |
| `pollution_liability` | Environmental | $1M | Annual |

**Request Schema:**

```python
class InsuranceCertificate(BaseModel):
    """Insurance certificate record."""

    id: UUID
    organization_id: UUID

    # Certificate info
    certificate_type: str
    policy_number: str
    insurer_name: str
    insurer_naic_code: str | None

    # Coverage
    coverage_amount: float
    aggregate_limit: float | None
    deductible: float | None
    currency: str = "USD"

    # Dates
    effective_date: date
    expiration_date: date

    # Certificate document
    certificate_document_id: UUID
    certificate_holder: str | None

    # Verification
    verification_status: str  # 'unverified', 'pending', 'verified', 'failed', 'expired'
    verified_at: datetime | None
    verification_method: str | None  # 'manual', 'api', 'document_analysis'

    # Additional insured
    additional_insureds: list[dict]
    # [{"name": "Building Owner LLC", "address": "..."}]

    # Notifications
    renewal_reminder_sent: bool
    expiry_warning_sent: bool

    # Metadata
    created_at: datetime
    updated_at: datetime

class ContractorInsuranceCompliance(BaseModel):
    """Contractor's insurance compliance status."""

    organization_id: UUID
    organization_name: str

    # Overall status
    is_compliant: bool
    compliance_issues: list[str]

    # By certificate type
    certificates: list[dict]
    # [{
    #     "type": "general_liability",
    #     "status": "valid",
    #     "coverage": 1000000,
    #     "expires": "2025-06-30",
    #     "days_until_expiry": 180
    # }]

    # Missing coverage
    missing_certificates: list[str]

    # Expiring soon
    expiring_30_days: list[dict]
    expiring_60_days: list[dict]

    # Verification status
    all_verified: bool
    unverified_certificates: list[str]
```

**Database Schema:**

```sql
-- Insurance certificates
CREATE TABLE insurance_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    -- Certificate info
    certificate_type VARCHAR(50) NOT NULL,
    policy_number VARCHAR(100) NOT NULL,
    insurer_name VARCHAR(255) NOT NULL,
    insurer_naic_code VARCHAR(20),

    -- Coverage
    coverage_amount DECIMAL(15, 2) NOT NULL,
    aggregate_limit DECIMAL(15, 2),
    deductible DECIMAL(15, 2),
    currency CHAR(3) DEFAULT 'USD',

    -- Dates
    effective_date DATE NOT NULL,
    expiration_date DATE NOT NULL,

    -- Document
    certificate_document_id UUID REFERENCES uploaded_files(id),
    certificate_holder VARCHAR(255),

    -- Verification
    verification_status VARCHAR(20) DEFAULT 'unverified',
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    verification_method VARCHAR(30),
    verification_reference VARCHAR(255),

    -- Additional insured
    additional_insureds JSONB DEFAULT '[]',

    -- Notifications
    renewal_reminder_30_sent BOOLEAN DEFAULT FALSE,
    renewal_reminder_60_sent BOOLEAN DEFAULT FALSE,
    expiry_warning_sent BOOLEAN DEFAULT FALSE,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),

    CONSTRAINT valid_verification_status CHECK (
        verification_status IN ('unverified', 'pending', 'verified', 'failed', 'expired')
    )
);

-- Certificate verification log
CREATE TABLE certificate_verification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID NOT NULL REFERENCES insurance_certificates(id),

    -- Verification attempt
    verification_method VARCHAR(30) NOT NULL,
    verification_result VARCHAR(20) NOT NULL,
    verification_details JSONB,

    -- Timestamp
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    verified_by UUID REFERENCES users(id)
);

-- Certificate share requests
CREATE TABLE certificate_share_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID NOT NULL REFERENCES insurance_certificates(id),

    -- Requestor
    requested_by_organization_id UUID REFERENCES organizations(id),
    requested_by_building_id UUID REFERENCES sites(id),
    requested_by_email VARCHAR(255),

    -- Request details
    request_reason VARCHAR(255),
    requested_at TIMESTAMPTZ DEFAULT NOW(),

    -- Response
    status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'approved', 'denied'
    responded_at TIMESTAMPTZ,
    responded_by UUID REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_certificates_org ON insurance_certificates(organization_id);
CREATE INDEX idx_certificates_expiry ON insurance_certificates(expiration_date);
CREATE INDEX idx_certificates_type ON insurance_certificates(certificate_type);
CREATE INDEX idx_certificates_status ON insurance_certificates(verification_status);
```

#### 3.3.2.2 Automatic Verification

**Verification Methods:**

```
┌─────────────────────────────────────────────────────────────────┐
│                CERTIFICATE VERIFICATION METHODS                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. API VERIFICATION (Preferred)                                 │
│     ├── Direct integration with major insurers                   │
│     ├── Real-time policy status check                            │
│     ├── Coverage limit verification                              │
│     └── Automatic renewal updates                                │
│                                                                  │
│  2. ACORD INTEGRATION                                            │
│     ├── ACORD 25 certificate parsing                             │
│     ├── Extract policy details                                   │
│     ├── Validate against NAIC database                           │
│     └── Cross-reference with insurer                             │
│                                                                  │
│  3. DOCUMENT ANALYSIS (AI)                                       │
│     ├── OCR extraction from uploaded certificate                 │
│     ├── AI validation of extracted data                          │
│     ├── Anomaly detection                                        │
│     └── Flag for manual review if uncertain                      │
│                                                                  │
│  4. THIRD-PARTY VERIFICATION SERVICES                            │
│     ├── Integration with verification providers                  │
│     ├── (e.g., myCOI, PINS, Certificate Tracker)                 │
│     └── Automated verification requests                          │
│                                                                  │
│  5. MANUAL VERIFICATION                                          │
│     ├── Contact insurer directly                                 │
│     ├── Request verification letter                              │
│     └── Human review and approval                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.3.2.3 Insurance Sharing & Proof Generation

**API Endpoints:**

```
POST   /api/v1/organizations/{id}/insurance/share        # Share certificates
GET    /api/v1/organizations/{id}/insurance/share-links  # List share links
POST   /api/v1/organizations/{id}/insurance/proof        # Generate proof document
GET    /api/v1/insurance/verify/{share_code}             # Verify via share code
```

**Share/Proof Schema:**

```python
class InsuranceShareLink(BaseModel):
    """Shareable link for insurance verification."""

    id: UUID
    organization_id: UUID

    # Share settings
    share_code: str  # Unique code for verification URL
    share_url: str

    # Included certificates
    certificate_ids: list[UUID]
    include_all_active: bool

    # Access control
    expires_at: datetime | None
    max_views: int | None
    views_count: int
    requires_email: bool  # Collect viewer email

    # Permissions
    allow_download: bool
    show_coverage_amounts: bool

    # Metadata
    created_at: datetime
    created_by: UUID

class InsuranceProofDocument(BaseModel):
    """Generated proof of insurance document."""

    id: UUID
    organization_id: UUID

    # Document info
    document_type: str  # 'summary', 'full_certificate', 'verification_letter'
    generated_at: datetime
    valid_until: datetime

    # Content
    certificates_included: list[UUID]
    additional_insured: str | None  # If requesting as additional insured

    # Verification
    verification_code: str
    verification_url: str
    qr_code_url: str

    # File
    document_url: str
    document_format: str  # 'pdf'
```

---

### 3.3.3 Insurance Company Portal

#### 3.3.3.1 Insurer Account System

**API Endpoints:**

```
POST   /api/v1/insurers                                  # Register insurer (admin)
GET    /api/v1/insurers                                  # List partner insurers
GET    /api/v1/insurers/{id}                             # Get insurer details
PUT    /api/v1/insurers/{id}                             # Update insurer
POST   /api/v1/insurers/{id}/api-key                     # Generate API key
```

**Insurer Portal Features:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    INSURER PORTAL FEATURES                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  RISK ASSESSMENT TOOLS:                                          │
│  ├── Building Health Score access (with consent)                 │
│  ├── Maintenance history viewer                                  │
│  ├── Incident history (anonymized or consented)                  │
│  ├── Compliance status checker                                   │
│  └── Risk trend analysis                                         │
│                                                                  │
│  PORTFOLIO ANALYSIS:                                             │
│  ├── Buildings in portfolio                                      │
│  ├── Aggregate risk metrics                                      │
│  ├── Claims history (their policies)                             │
│  ├── Renewal pipeline                                            │
│  └── Benchmark comparisons                                       │
│                                                                  │
│  INTEGRATION APIs:                                               │
│  ├── Building data API                                           │
│  ├── Maintenance verification API                                │
│  ├── Claims submission API                                       │
│  ├── Webhook notifications                                       │
│  └── Batch data export                                           │
│                                                                  │
│  MARKETING TOOLS:                                                │
│  ├── Quote request receiving                                     │
│  ├── Quote submission                                            │
│  ├── Program promotion                                           │
│  └── Preferred partner badge                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Request Schema:**

```python
class InsurerAccount(BaseModel):
    """Insurance company account."""

    id: UUID

    # Company info
    name: str
    legal_name: str
    naic_code: str
    am_best_rating: str | None

    # Contact
    contact_email: str
    contact_phone: str
    website_url: str

    # Partnership level
    partnership_tier: str  # 'basic', 'preferred', 'strategic'

    # API access
    api_enabled: bool
    api_rate_limit: int
    webhook_url: str | None

    # Capabilities
    offers_quotes_online: bool
    offers_bind_online: bool
    coverage_types: list[str]
    service_regions: list[str]

    # Status
    is_active: bool
    verified_at: datetime

class InsurerDataAccess(BaseModel):
    """Data access consent for an insurer."""

    building_id: UUID
    insurer_id: UUID

    # Consent
    consented_by: UUID
    consented_at: datetime

    # Scope
    access_building_info: bool
    access_equipment_info: bool
    access_maintenance_history: bool
    access_inspection_history: bool
    access_incident_history: bool
    access_health_score: bool
    access_contractor_info: bool

    # Limits
    history_months: int  # How far back they can see
    expires_at: datetime | None

    # Purpose
    purpose: str  # 'quote', 'underwriting', 'claims', 'renewal'
```

#### 3.3.3.2 Risk Assessment API

**API Endpoints:**

```
GET    /api/v1/insurers/{id}/buildings/{building_id}/assessment  # Get risk assessment
GET    /api/v1/insurers/{id}/buildings/{building_id}/history     # Get maintenance history
GET    /api/v1/insurers/{id}/portfolio/analytics                 # Portfolio analytics
POST   /api/v1/insurers/{id}/buildings/{building_id}/alert       # Set up alerts
```

**Risk Assessment Response:**

```python
class InsurerRiskAssessment(BaseModel):
    """Risk assessment data for insurer."""

    building_id: UUID
    assessment_date: datetime

    # Building basics
    building_info: dict
    # {
    #     "name": "...",
    #     "address": "...",
    #     "building_type": "commercial",
    #     "year_built": 1985,
    #     "floors": 20,
    #     "occupancy_type": "office"
    # }

    # Equipment summary
    equipment_summary: dict
    # {
    #     "elevator_count": 4,
    #     "escalator_count": 2,
    #     "average_equipment_age_years": 12,
    #     "oldest_equipment_age_years": 25,
    #     "modernization_status": "partial"
    # }

    # Risk scores
    risk_scores: dict
    # {
    #     "overall": 82,
    #     "equipment_condition": 78,
    #     "maintenance_compliance": 95,
    #     "safety_record": 88,
    #     "contractor_quality": 85
    # }

    # Maintenance metrics
    maintenance_metrics: dict
    # {
    #     "maintenance_frequency": "monthly",
    #     "schedule_adherence_rate": 96,
    #     "average_response_time_hours": 3.5,
    #     "first_time_fix_rate": 89,
    #     "outstanding_work_orders": 2
    # }

    # Inspection compliance
    inspection_compliance: dict
    # {
    #     "last_annual_inspection": "2024-08-15",
    #     "inspection_result": "passed",
    #     "open_violations": 0,
    #     "violation_history_5_years": 1
    # }

    # Incident history (if consented)
    incident_history: dict | None
    # {
    #     "incidents_12_months": 0,
    #     "incidents_36_months": 1,
    #     "entrapments_12_months": 2,
    #     "claims_12_months": 0
    # }

    # Contractor info
    contractor_info: dict
    # {
    #     "contractor_name": "...",
    #     "contractor_rating": 4.7,
    #     "years_servicing": 5,
    #     "certified_technicians": true
    # }

    # Recommendations
    risk_factors: list[dict]
    # [{"factor": "Aging equipment", "severity": "medium", "recommendation": "..."}]

    # Data freshness
    data_as_of: datetime
    next_update: datetime
```

#### 3.3.3.3 Claims Integration API

**API Endpoints:**

```
POST   /api/v1/insurers/{id}/claims                      # Receive claim submission
GET    /api/v1/insurers/{id}/claims                      # List claims
GET    /api/v1/insurers/{id}/claims/{id}                 # Get claim details
PUT    /api/v1/insurers/{id}/claims/{id}/status          # Update claim status
POST   /api/v1/insurers/{id}/claims/{id}/request-info    # Request additional info
```

**Claims Integration Schema:**

```python
class InsurerClaimSubmission(BaseModel):
    """Claim submitted to insurer via API."""

    # Identifiers
    sitesync_claim_id: UUID
    policy_number: str

    # Building & equipment
    building_id: UUID
    building_info: dict
    equipment_id: UUID | None
    equipment_info: dict | None

    # Incident
    incident_date: datetime
    incident_type: str
    incident_description: str
    incident_location: str

    # Parties
    claimant_info: dict
    injured_parties: list[dict] | None
    witnesses: list[dict] | None

    # Damages
    damage_description: str
    estimated_amount: float | None

    # Evidence
    evidence_urls: list[dict]
    # [{"type": "photo", "url": "...", "description": "..."}]

    # Supporting documentation
    maintenance_history_url: str  # Link to maintenance records
    inspection_history_url: str   # Link to inspection records
    equipment_condition_report_url: str

    # Verification
    building_health_score_at_incident: int
    last_inspection_date: date
    last_maintenance_date: date
    maintenance_compliant: bool

class InsurerClaimStatusUpdate(BaseModel):
    """Status update from insurer."""

    sitesync_claim_id: UUID
    insurer_claim_number: str

    # Status
    status: str  # 'received', 'under_review', 'approved', 'denied', 'settled'
    status_reason: str | None

    # Assignment
    adjuster_name: str | None
    adjuster_contact: str | None

    # Amounts
    approved_amount: float | None
    settlement_amount: float | None

    # Next steps
    additional_info_required: list[str] | None
    expected_resolution_date: date | None
```

---

### 3.3.4 Insurance Marketplace

#### 3.3.4.1 Partner Insurer Directory

**API Endpoints:**

```
GET    /api/v1/insurance/marketplace                     # Browse marketplace
GET    /api/v1/insurance/marketplace/providers           # List providers
GET    /api/v1/insurance/marketplace/providers/{id}      # Provider details
GET    /api/v1/insurance/marketplace/programs            # Special programs
```

**Marketplace Features:**

```python
class InsuranceProvider(BaseModel):
    """Insurance provider in marketplace."""

    id: UUID
    name: str
    logo_url: str

    # Ratings
    am_best_rating: str
    customer_rating: float
    review_count: int

    # Coverage
    coverage_types: list[str]
    service_regions: list[str]
    specialties: list[str]  # ['elevators', 'commercial', 'high-rise']

    # SiteSync integration
    sitesync_partner_tier: str
    sitesync_discount_available: bool
    sitesync_discount_percent: float

    # Capabilities
    offers_online_quotes: bool
    offers_online_binding: bool
    average_quote_time: str  # '24 hours', 'Instant'

    # Featured programs
    featured_programs: list[dict]

class InsuranceProgram(BaseModel):
    """Special insurance program."""

    id: UUID
    provider_id: UUID
    provider_name: str

    # Program info
    name: str
    description: str
    program_type: str  # 'discount', 'affinity', 'captive', 'guaranteed'

    # Eligibility
    eligibility_requirements: list[str]
    minimum_health_score: int | None
    required_certifications: list[str]

    # Benefits
    discount_percent: float
    additional_benefits: list[str]

    # Application
    application_url: str | None
    requires_sitesync_data: bool
```

---

## Success Metrics

### Phase 3.3 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Insurance partner integrations | 5+ | Signed partnerships |
| Buildings with insurance data | 500+ | Active buildings |
| Certificates managed | 2,000+ | Active certificates |
| Quote requests generated | 200+/month | Monthly requests |
| Claims with SiteSync data | 50+ | Claims submitted |
| Premium savings documented | $500K+ | Annual savings |
| Verification automation | 80%+ | Auto-verified certs |

### KPIs

1. **Building Owner Value**
   - Average premium savings
   - Claims processing time reduction
   - Risk score improvement over time

2. **Contractor Value**
   - Certificate management time saved
   - Coverage gap incidents prevented
   - Verification request response time

3. **Insurer Value**
   - Quote conversion rate
   - Loss ratio for SiteSync buildings
   - Data-driven underwriting accuracy

4. **Business Metrics**
   - Insurance partner revenue share
   - Quote lead revenue
   - Premium financing revenue

---

## Implementation Notes

### Partnership Development

| Partner Type | Priority | Value Proposition |
|--------------|----------|-------------------|
| National carriers | HIGH | Scale, credibility |
| Elevator specialists | HIGH | Industry expertise |
| Regional carriers | MEDIUM | Local relationships |
| InsurTech | MEDIUM | Innovation, integration |
| Verification services | HIGH | Automation |

### Data Privacy & Compliance

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA PRIVACY REQUIREMENTS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CONSENT REQUIREMENTS:                                           │
│  ├── Explicit consent for sharing with insurers                  │
│  ├── Granular control (which data, which insurer)                │
│  ├── Easy revocation                                             │
│  └── Audit trail of all access                                   │
│                                                                  │
│  DATA PROTECTION:                                                │
│  ├── Encryption at rest and in transit                           │
│  ├── Access logging                                              │
│  ├── Data minimization (share only what's needed)                │
│  └── Retention limits                                            │
│                                                                  │
│  REGULATORY COMPLIANCE:                                          │
│  ├── State insurance regulations                                 │
│  ├── CCPA/GDPR for personal data                                 │
│  ├── Insurance data handling requirements                        │
│  └── Industry-specific regulations                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Risk Considerations

1. **Liability concerns**: Incorrect data affecting underwriting
   - Mitigation: Clear disclaimers, verification processes, E&O insurance

2. **Privacy backlash**: Users uncomfortable with data sharing
   - Mitigation: Transparency, opt-in only, clear value proposition

3. **Insurer adoption**: Slow to change underwriting processes
   - Mitigation: Start with forward-thinking partners, prove ROI

4. **Regulatory complexity**: Varying state insurance regulations
   - Mitigation: Legal review, state-by-state rollout, compliance monitoring

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
