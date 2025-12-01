# Phase 4.1: Real Estate Integration

> Detailed implementation specification for building transaction support and due diligence features
> Status: Design Phase
> Priority: MEDIUM - High value for transactions, lower frequency
> Dependencies: Phase 0 (Core Platform), Phase 3.3 (Insurance), Phase 3.4 (Compliance)

---

## Overview

The Real Estate Integration creates comprehensive support for property transactions by:

1. **Generating** Building Health Reports for due diligence
2. **Packaging** maintenance history and compliance documentation for transactions
3. **Supporting** seamless data transfer when buildings change ownership
4. **Connecting** with real estate professionals through broker/agent portal
5. **Providing** cost projections and risk assessments for buyers

---

## User Stories

### As a Building Seller:

1. **US-RE001:** I want to generate a comprehensive building report so I can demonstrate value to buyers
2. **US-RE002:** I want to showcase my maintenance investment so buyers see the building is well-maintained
3. **US-RE003:** I want to prepare a data room quickly so the transaction moves smoothly
4. **US-RE004:** I want to control what information buyers can access so I maintain confidentiality
5. **US-RE005:** I want to transfer data to the new owner so the building history is preserved

### As a Building Buyer:

6. **US-RE006:** I want to see the complete maintenance history so I know what I'm buying
7. **US-RE007:** I want to understand equipment condition so I can budget for future costs
8. **US-RE008:** I want to verify compliance status so I don't inherit problems
9. **US-RE009:** I want projected maintenance costs so I can plan my investment
10. **US-RE010:** I want to identify red flags before closing so I can negotiate appropriately
11. **US-RE011:** I want to inherit the building's history after purchase so I have continuity

### As a Real Estate Broker/Agent:

12. **US-RE012:** I want to access building reports for my listings so I can market properties better
13. **US-RE013:** I want to compare buildings using standardized metrics so I can advise clients
14. **US-RE014:** I want to share reports with clients securely so transactions are smooth
15. **US-RE015:** I want to coordinate due diligence efficiently so deals close faster

### As a Lender/Investor:

16. **US-RE016:** I want to assess building condition for underwriting so I make informed decisions
17. **US-RE017:** I want standardized reports across properties so I can compare investments
18. **US-RE018:** I want to verify the accuracy of building claims so I reduce risk

---

## Feature Breakdown

### 4.1.1 Building Health Report Generation

#### 4.1.1.1 Report Types

**Report Tiers:**

| Report | Target Audience | Content | Price |
|--------|-----------------|---------|-------|
| `summary` | Marketing | Overview, health score, highlights | Included |
| `standard` | Buyer due diligence | Full history, equipment details | $199 |
| `comprehensive` | Institutional buyers | Everything + projections + AI analysis | $499 |
| `lender` | Financial institutions | Standardized format, risk metrics | $349 |

**API Endpoints:**

```
POST   /api/v1/buildings/{id}/reports                    # Generate report
GET    /api/v1/buildings/{id}/reports                    # List reports
GET    /api/v1/reports/{id}                              # Get report
GET    /api/v1/reports/{id}/download                     # Download PDF
POST   /api/v1/reports/{id}/share                        # Share report
GET    /api/v1/reports/{id}/verify                       # Verify report authenticity
```

**Report Schema:**

```python
# sitesync_v3/domains/real_estate/contracts.py

from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime, date
from decimal import Decimal

class ReportType(str, Enum):
    SUMMARY = "summary"
    STANDARD = "standard"
    COMPREHENSIVE = "comprehensive"
    LENDER = "lender"

class BuildingHealthReport(BaseModel):
    """Comprehensive building health report for transactions."""

    id: UUID
    building_id: UUID
    report_type: ReportType
    generated_at: datetime
    valid_until: date  # Reports valid for 30 days

    # Verification
    verification_code: str
    verification_url: str
    digital_signature: str

    # Executive Summary
    executive_summary: dict
    # {
    #     "building_name": "...",
    #     "address": "...",
    #     "building_type": "commercial",
    #     "year_built": 1985,
    #     "total_floors": 20,
    #     "total_equipment": 6,
    #     "health_score": 85,
    #     "health_grade": "A-",
    #     "overall_condition": "Good",
    #     "key_highlights": ["...", "..."],
    #     "key_concerns": ["...", "..."]
    # }

    # Equipment Inventory
    equipment_inventory: list[dict]
    # [{
    #     "id": UUID,
    #     "type": "elevator",
    #     "designation": "E-1",
    #     "manufacturer": "KONE",
    #     "model": "MonoSpace",
    #     "year_installed": 2005,
    #     "age_years": 20,
    #     "expected_life_years": 25,
    #     "remaining_life_years": 5,
    #     "condition_score": 78,
    #     "condition_rating": "Good",
    #     "last_modernization": 2018,
    #     "modernization_scope": "Controls upgrade"
    # }]

    # Maintenance History
    maintenance_summary: dict
    # {
    #     "maintenance_provider": "ABC Elevator",
    #     "contract_type": "Full Service",
    #     "contract_expiry": "2025-12-31",
    #     "years_of_history": 5,
    #     "total_work_orders": 245,
    #     "average_monthly_visits": 4,
    #     "response_time_avg_hours": 3.2,
    #     "first_time_fix_rate": 89,
    #     "maintenance_spend_5yr": 125000,
    #     "annual_maintenance_cost": 25000
    # }

    # Compliance Status
    compliance_status: dict
    # {
    #     "overall_status": "Compliant",
    #     "jurisdiction": "New York City",
    #     "last_annual_inspection": "2024-08-15",
    #     "inspection_result": "Passed",
    #     "certificate_valid_until": "2025-08-15",
    #     "open_violations": 0,
    #     "historical_violations_5yr": 1,
    #     "violation_details": [...],
    #     "open_defects": {"critical": 0, "major": 0, "minor": 2}
    # }

    # Safety Record
    safety_record: dict
    # {
    #     "incidents_5yr": 0,
    #     "entrapments_5yr": 3,
    #     "avg_entrapment_duration_min": 18,
    #     "insurance_claims_5yr": 0,
    #     "safety_score": 95
    # }

    # Financial Projections (comprehensive only)
    financial_projections: dict | None
    # {
    #     "projected_annual_maintenance": 26000,
    #     "projected_5yr_capex": 150000,
    #     "modernization_needed": true,
    #     "estimated_modernization_cost": 120000,
    #     "recommended_reserve": 50000,
    #     "cost_comparison_benchmark": "15% below average"
    # }

    # Risk Assessment (comprehensive only)
    risk_assessment: dict | None
    # {
    #     "overall_risk": "Low",
    #     "risk_factors": [
    #         {"factor": "Equipment age", "risk": "Medium", "notes": "..."},
    #         {"factor": "Maintenance quality", "risk": "Low", "notes": "..."}
    #     ],
    #     "recommendations": ["...", "..."]
    # }

    # AI Analysis (comprehensive only)
    ai_analysis: dict | None
    # {
    #     "condition_summary": "...",
    #     "investment_recommendation": "...",
    #     "key_questions_for_seller": ["...", "..."],
    #     "negotiation_points": ["...", "..."]
    # }

    # Document References
    supporting_documents: list[dict]
    # [{
    #     "type": "inspection_certificate",
    #     "title": "Annual Inspection 2024",
    #     "date": date,
    #     "document_id": UUID
    # }]

    # Attestation
    attestation: dict
    # {
    #     "data_sources": ["SiteSync platform", "Contractor records", "Inspection reports"],
    #     "data_verification": "Contractor-verified",
    #     "limitations": ["..."],
    #     "disclaimer": "..."
    # }

class ReportGenerationRequest(BaseModel):
    """Request to generate a building report."""

    building_id: UUID
    report_type: ReportType

    # Customization
    include_financial_projections: bool = True
    include_ai_analysis: bool = True
    include_supporting_documents: bool = True

    # Date range
    history_years: int = 5  # How many years of history to include

    # Branding (for brokers)
    custom_branding: dict | None = None
    # {"logo_url": "...", "company_name": "...", "contact_info": "..."}

    # Access
    share_with_emails: list[str] = []
    share_expiry_days: int = 30
```

**Database Schema:**

```sql
-- Building health reports
CREATE TABLE building_health_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES sites(id),

    -- Report info
    report_type VARCHAR(20) NOT NULL,
    report_number VARCHAR(50) UNIQUE NOT NULL,

    -- Content
    report_data JSONB NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    valid_until DATE NOT NULL,

    -- Verification
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    digital_signature TEXT NOT NULL,

    -- File
    pdf_file_id UUID REFERENCES uploaded_files(id),

    -- Branding
    custom_branding JSONB,

    -- Billing
    price DECIMAL(10, 2),
    payment_status VARCHAR(20),
    payment_reference VARCHAR(100),

    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_report_type CHECK (
        report_type IN ('summary', 'standard', 'comprehensive', 'lender')
    )
);

-- Report shares
CREATE TABLE report_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES building_health_reports(id),

    -- Share settings
    share_code VARCHAR(50) UNIQUE NOT NULL,
    share_url TEXT NOT NULL,
    recipient_email VARCHAR(255),

    -- Access
    expires_at TIMESTAMPTZ NOT NULL,
    max_views INTEGER,
    view_count INTEGER DEFAULT 0,
    requires_email_verification BOOLEAN DEFAULT FALSE,

    -- Permissions
    can_download BOOLEAN DEFAULT TRUE,
    can_share BOOLEAN DEFAULT FALSE,

    -- Tracking
    last_viewed_at TIMESTAMPTZ,
    viewed_by_ips TEXT[],

    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report verifications
CREATE TABLE report_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES building_health_reports(id),

    -- Verification request
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    verification_result VARCHAR(20) NOT NULL,  -- 'valid', 'expired', 'tampered'
    verifier_ip INET,
    verifier_email VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_reports_building ON building_health_reports(building_id);
CREATE INDEX idx_reports_verification ON building_health_reports(verification_code);
CREATE INDEX idx_report_shares_code ON report_shares(share_code);
CREATE INDEX idx_report_shares_report ON report_shares(report_id);
```

---

### 4.1.2 Due Diligence Data Room

#### 4.1.2.1 Data Room Creation

**API Endpoints:**

```
POST   /api/v1/buildings/{id}/data-room                  # Create data room
GET    /api/v1/buildings/{id}/data-room                  # Get data room
PUT    /api/v1/buildings/{id}/data-room                  # Update data room
POST   /api/v1/buildings/{id}/data-room/documents        # Add documents
DELETE /api/v1/buildings/{id}/data-room/documents/{id}   # Remove document
POST   /api/v1/buildings/{id}/data-room/invite           # Invite user
GET    /api/v1/buildings/{id}/data-room/activity         # View activity log
```

**Data Room Structure:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSACTION DATA ROOM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📁 EXECUTIVE SUMMARY                                            │
│  ├── Building Health Report                                      │
│  ├── Property Overview                                           │
│  └── Key Metrics Summary                                         │
│                                                                  │
│  📁 EQUIPMENT DOCUMENTATION                                      │
│  ├── Equipment Inventory                                         │
│  ├── Specifications & Manuals                                    │
│  ├── Modernization History                                       │
│  └── Warranty Information                                        │
│                                                                  │
│  📁 MAINTENANCE RECORDS                                          │
│  ├── Service Contract                                            │
│  ├── Work Order History                                          │
│  ├── Maintenance Reports                                         │
│  └── Parts Replacement Log                                       │
│                                                                  │
│  📁 COMPLIANCE & INSPECTIONS                                     │
│  ├── Inspection Certificates                                     │
│  ├── Compliance History                                          │
│  ├── Violation Records                                           │
│  └── Permits                                                     │
│                                                                  │
│  📁 FINANCIAL RECORDS                                            │
│  ├── Maintenance Expense History                                 │
│  ├── Capital Expenditure Records                                 │
│  ├── Insurance Claims                                            │
│  └── Budget Projections                                          │
│                                                                  │
│  📁 SAFETY & INCIDENTS                                           │
│  ├── Incident Reports                                            │
│  ├── Safety Certifications                                       │
│  └── Training Records                                            │
│                                                                  │
│  📁 CONTRACTS & AGREEMENTS                                       │
│  ├── Service Agreements                                          │
│  ├── Vendor Contracts                                            │
│  └── Warranty Documents                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Schema:**

```python
class DataRoom(BaseModel):
    """Transaction data room for building sale."""

    id: UUID
    building_id: UUID
    building_name: str

    # Status
    status: str  # 'draft', 'active', 'closed'
    transaction_name: str | None
    transaction_stage: str | None  # 'marketing', 'due_diligence', 'closing', 'closed'

    # Access
    owner_organization_id: UUID
    created_by: UUID

    # Structure
    folders: list[dict]
    # [{
    #     "id": UUID,
    #     "name": "Executive Summary",
    #     "order": 1,
    #     "documents": [{
    #         "id": UUID,
    #         "name": "Building Health Report",
    #         "file_type": "pdf",
    #         "uploaded_at": datetime,
    #         "access_level": "all" | "approved_only"
    #     }]
    # }]

    # Auto-populated sections
    auto_populated: dict
    # {
    #     "equipment_inventory": true,
    #     "maintenance_history": true,
    #     "inspection_records": true,
    #     "compliance_status": true,
    #     "last_refreshed": datetime
    # }

    # Participants
    participants: list[dict]
    # [{
    #     "user_id": UUID,
    #     "email": "...",
    #     "role": "buyer" | "seller" | "broker" | "lender" | "attorney",
    #     "access_level": "full" | "limited" | "view_only",
    #     "invited_at": datetime,
    #     "accepted_at": datetime,
    #     "nda_signed": bool
    # }]

    # Activity
    total_documents: int
    total_views: int
    last_activity_at: datetime

    # Dates
    created_at: datetime
    updated_at: datetime
    closes_at: datetime | None

class DataRoomActivity(BaseModel):
    """Activity log entry for data room."""

    id: UUID
    data_room_id: UUID

    # Actor
    user_id: UUID
    user_email: str
    user_role: str

    # Action
    action: str  # 'viewed', 'downloaded', 'uploaded', 'invited', 'commented'
    target_type: str | None  # 'document', 'folder', 'participant'
    target_id: UUID | None
    target_name: str | None

    # Details
    details: dict | None

    # Timestamp
    occurred_at: datetime
```

---

### 4.1.3 Ownership Transfer

#### 4.1.3.1 Transfer Workflow

**Transfer Process:**

```
┌─────────────────────────────────────────────────────────────────┐
│                  OWNERSHIP TRANSFER WORKFLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. INITIATION                                                   │
│     ├── Seller initiates transfer                                │
│     ├── New owner email/account specified                        │
│     ├── Transfer terms agreed                                    │
│     └── Transfer code generated                                  │
│                                                                  │
│  2. BUYER ACCEPTANCE                                             │
│     ├── Buyer receives transfer invitation                       │
│     ├── Creates account (if needed)                              │
│     ├── Reviews transfer terms                                   │
│     ├── Accepts transfer                                         │
│     └── Verifies building information                            │
│                                                                  │
│  3. DATA TRANSFER                                                │
│     ├── Full history transferred                                 │
│     │   ├── Equipment records                                    │
│     │   ├── Maintenance history                                  │
│     │   ├── Inspection records                                   │
│     │   ├── Documents                                            │
│     │   └── Compliance records                                   │
│     ├── Contractor relationships reviewed                        │
│     └── Pending items flagged                                    │
│                                                                  │
│  4. TRANSITION PERIOD                                            │
│     ├── Dual access period (optional)                            │
│     ├── Seller retains read-only access temporarily              │
│     ├── Contractor notified of ownership change                  │
│     └── Outstanding items transferred                            │
│                                                                  │
│  5. COMPLETION                                                   │
│     ├── Full ownership transferred                               │
│     ├── Seller access revoked                                    │
│     ├── Transfer certificate generated                           │
│     └── Historical record preserved                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
POST   /api/v1/buildings/{id}/transfer                   # Initiate transfer
GET    /api/v1/buildings/{id}/transfer                   # Get transfer status
POST   /api/v1/buildings/{id}/transfer/accept            # Accept transfer
POST   /api/v1/buildings/{id}/transfer/complete          # Complete transfer
POST   /api/v1/buildings/{id}/transfer/cancel            # Cancel transfer
GET    /api/v1/transfer/pending                          # List pending transfers
```

**Transfer Schema:**

```python
class OwnershipTransfer(BaseModel):
    """Building ownership transfer record."""

    id: UUID
    building_id: UUID
    building_name: str

    # Parties
    seller_organization_id: UUID
    seller_organization_name: str
    buyer_email: str
    buyer_organization_id: UUID | None
    buyer_organization_name: str | None

    # Status
    status: str  # 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'

    # Transfer details
    transfer_code: str
    transfer_terms: dict
    # {
    #     "include_full_history": true,
    #     "include_documents": true,
    #     "include_contractor_info": true,
    #     "transition_period_days": 30,
    #     "effective_date": date
    # }

    # Timeline
    initiated_at: datetime
    accepted_at: datetime | None
    completed_at: datetime | None
    transition_ends_at: datetime | None

    # Data transfer
    data_transfer_status: str | None
    data_items_transferred: dict | None
    # {
    #     "equipment_records": 6,
    #     "work_orders": 245,
    #     "inspections": 12,
    #     "documents": 89
    # }

    # Notifications
    contractor_notified: bool
    contractor_notified_at: datetime | None

class TransferCertificate(BaseModel):
    """Certificate documenting ownership transfer."""

    transfer_id: UUID
    certificate_number: str

    # Building
    building_id: UUID
    building_name: str
    building_address: str

    # Parties
    from_organization: str
    to_organization: str

    # Transfer
    transfer_date: date
    effective_date: date

    # Data summary
    data_transferred: dict

    # Verification
    verification_code: str
    verification_url: str
    digital_signature: str

    # Document
    certificate_url: str
    generated_at: datetime
```

---

### 4.1.4 Real Estate Professional Portal

#### 4.1.4.1 Broker/Agent Account

**API Endpoints:**

```
POST   /api/v1/real-estate/professionals                 # Register professional
GET    /api/v1/real-estate/professionals/{id}            # Get profile
PUT    /api/v1/real-estate/professionals/{id}            # Update profile
GET    /api/v1/real-estate/professionals/{id}/buildings  # Associated buildings
POST   /api/v1/real-estate/professionals/{id}/request-access # Request building access
```

**Professional Portal Features:**

```python
class RealEstateProfessional(BaseModel):
    """Real estate professional profile."""

    id: UUID
    user_id: UUID

    # Basic info
    name: str
    company_name: str
    title: str
    bio: str | None
    profile_photo_url: str | None

    # Contact
    email: str
    phone: str
    website: str | None

    # Credentials
    license_number: str
    license_state: str
    license_type: str  # 'broker', 'agent', 'appraiser'
    license_verified: bool
    license_expiry: date

    # Specializations
    property_types: list[str]  # 'commercial', 'residential', 'industrial'
    specializations: list[str]  # 'high-rise', 'office', 'retail'
    service_area: list[str]

    # SiteSync access
    buildings_with_access: int
    reports_generated: int
    data_rooms_participated: int

    # Stats
    verified_professional: bool
    member_since: date

class BuildingAccessRequest(BaseModel):
    """Request for building access by professional."""

    id: UUID
    professional_id: UUID
    building_id: UUID

    # Request
    purpose: str  # 'listing', 'buyer_representation', 'appraisal', 'lending'
    access_level_requested: str  # 'view_report', 'full_data_room', 'generate_reports'
    notes: str | None

    # Status
    status: str  # 'pending', 'approved', 'denied'
    reviewed_by: UUID | None
    reviewed_at: datetime | None
    denial_reason: str | None

    # If approved
    access_expires_at: datetime | None
    access_level_granted: str | None

    # Metadata
    requested_at: datetime
```

#### 4.1.4.2 Market Comparison Tools

**API Endpoints:**

```
POST   /api/v1/real-estate/compare                       # Compare buildings
GET    /api/v1/real-estate/benchmarks                    # Get market benchmarks
GET    /api/v1/real-estate/market-data                   # Get market statistics
```

**Comparison Schema:**

```python
class BuildingComparison(BaseModel):
    """Comparison of multiple buildings."""

    buildings: list[dict]
    # [{
    #     "id": UUID,
    #     "name": "...",
    #     "address": "...",
    #     "building_type": "...",
    #     "year_built": 1985,
    #     "floors": 20,
    #     "equipment_count": 6,
    #     "health_score": 85,
    #     "condition_rating": "Good",
    #     "maintenance_cost_per_sqft": 0.75,
    #     "compliance_status": "Compliant"
    # }]

    # Comparison metrics
    comparison_metrics: list[dict]
    # [{
    #     "metric": "Health Score",
    #     "building_a": 85,
    #     "building_b": 78,
    #     "market_average": 75,
    #     "notes": "Building A above average"
    # }]

    # Market context
    market_benchmarks: dict
    # {
    #     "average_health_score": 75,
    #     "average_equipment_age": 15,
    #     "average_maintenance_cost": 0.80,
    #     "sample_size": 250
    # }

class MarketBenchmarks(BaseModel):
    """Market benchmark data."""

    # Filters
    building_type: str | None
    region: str | None
    building_age_range: str | None

    # Benchmarks
    benchmarks: dict
    # {
    #     "health_score": {
    #         "average": 75,
    #         "median": 77,
    #         "top_quartile": 85,
    #         "bottom_quartile": 65
    #     },
    #     "equipment_age": {...},
    #     "maintenance_cost_per_sqft": {...},
    #     "inspection_compliance_rate": {...}
    # }

    # Sample info
    sample_size: int
    data_as_of: date
```

---

### 4.1.5 Cost Projection Engine

**API Endpoints:**

```
GET    /api/v1/buildings/{id}/projections                # Get cost projections
POST   /api/v1/buildings/{id}/projections/custom         # Custom projection
GET    /api/v1/buildings/{id}/projections/scenarios      # Scenario analysis
```

**Projection Schema:**

```python
class CostProjection(BaseModel):
    """Cost projection for building equipment."""

    building_id: UUID
    projection_period_years: int
    generated_at: datetime

    # Maintenance costs
    maintenance_projection: dict
    # {
    #     "current_annual": 25000,
    #     "projected_annual": [26000, 27000, 28500, 30000, 32000],
    #     "cumulative_5yr": 143500,
    #     "growth_rate": 5.2
    # }

    # Capital expenditures
    capex_projection: dict
    # {
    #     "year_1": {"items": [...], "total": 15000},
    #     "year_2": {"items": [...], "total": 5000},
    #     "year_3": {"items": [...], "total": 120000, "note": "Modernization recommended"},
    #     "year_4": {"items": [...], "total": 10000},
    #     "year_5": {"items": [...], "total": 8000},
    #     "cumulative_5yr": 158000
    # }

    # Equipment lifecycle
    equipment_lifecycle: list[dict]
    # [{
    #     "equipment_id": UUID,
    #     "name": "Elevator 1",
    #     "current_age": 20,
    #     "expected_life": 25,
    #     "remaining_life": 5,
    #     "replacement_cost": 250000,
    #     "modernization_cost": 120000,
    #     "recommendation": "Modernize in 2-3 years"
    # }]

    # Reserve recommendation
    reserve_recommendation: dict
    # {
    #     "recommended_annual_reserve": 50000,
    #     "recommended_total_reserve": 200000,
    #     "rationale": "Based on equipment age and projected modernization"
    # }

    # Risk scenarios
    scenarios: list[dict]
    # [{
    #     "scenario": "Best case",
    #     "assumptions": ["No major failures", "Routine maintenance only"],
    #     "5yr_total_cost": 175000
    # }, {
    #     "scenario": "Base case",
    #     "assumptions": ["One major repair", "Planned modernization"],
    #     "5yr_total_cost": 300000
    # }, {
    #     "scenario": "Worst case",
    #     "assumptions": ["Major failures", "Accelerated modernization"],
    #     "5yr_total_cost": 450000
    # }]

    # Assumptions
    assumptions: list[str]
    # ["Inflation rate: 3%", "Equipment usage: Average", ...]

    # Confidence
    confidence_level: str  # 'high', 'medium', 'low'
    confidence_notes: str
```

---

## Success Metrics

### Phase 4.1 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Reports generated | 500+/year | Annual report count |
| Data rooms created | 100+/year | Transaction data rooms |
| Ownership transfers | 50+/year | Completed transfers |
| Professional registrations | 200+ | Active professionals |
| Report revenue | $50K+/year | Report sales |
| Transaction value supported | $500M+/year | Total property value |

### KPIs

1. **Transaction Support**
   - Reports generated per building
   - Data room utilization
   - Transfer completion rate
   - Time to close with SiteSync data

2. **User Adoption**
   - Seller report generation rate
   - Buyer report request rate
   - Professional engagement

3. **Data Quality**
   - Report accuracy feedback
   - Dispute rate
   - Verification success rate

4. **Revenue**
   - Report revenue
   - Data room fees
   - Professional subscription revenue

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
