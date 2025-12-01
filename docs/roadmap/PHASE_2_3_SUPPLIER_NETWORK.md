# Phase 2.3: Supplier Network

## Overview

The Supplier Network connects building service contractors with authorized distributors, manufacturers, and specialty suppliers. It streamlines procurement with negotiated pricing, automated reordering, bulk discounts, and AI-powered supplier recommendations. The network creates a trusted B2B ecosystem with verified suppliers and transparent pricing.

## Core Philosophy

### Multi-Tier Supplier Ecosystem
```
┌─────────────────────────────────────────────────────────────────┐
│                      SUPPLIER NETWORK                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 OEM / MANUFACTURERS                       │   │
│  │   Otis, ThyssenKrupp, Schindler, KONE, Mitsubishi        │   │
│  │   Direct factory parts, warranties, tech support          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              AUTHORIZED DISTRIBUTORS                      │   │
│  │   Regional distributors with OEM authorization            │   │
│  │   Wholesale pricing, local stock, faster delivery         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              SPECIALTY SUPPLIERS                          │   │
│  │   Legacy parts, refurbished, aftermarket, custom fab      │   │
│  │   Hard-to-find, obsolete equipment support                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            │                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              SERVICE PROVIDERS                            │   │
│  │   Calibration, testing, certification, training          │   │
│  │   Complementary services to parts supply                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│              ┌─────────────────────────┐                        │
│              │   AI PROCUREMENT        │                        │
│              │   Best price finder     │                        │
│              │   Auto-reorder          │                        │
│              │   Supplier matching     │                        │
│              └─────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

### Value Proposition
- **For Contractors**: Access to verified suppliers, negotiated pricing, streamlined procurement
- **For Suppliers**: Qualified buyer network, reduced sales overhead, predictable demand
- **For Platform**: Transaction fees, premium supplier listings, data insights

---

## Data Models

### Enums and Types

```python
from enum import Enum
from decimal import Decimal
from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, Field

class SupplierType(str, Enum):
    OEM = "oem"                     # Original Equipment Manufacturer
    DISTRIBUTOR = "distributor"     # Authorized distributor
    SPECIALTY = "specialty"         # Specialty/niche supplier
    AFTERMARKET = "aftermarket"     # Aftermarket parts
    REFURBISHER = "refurbisher"     # Refurbished parts
    SERVICE = "service"             # Service provider

class SupplierTier(str, Enum):
    PLATINUM = "platinum"           # Highest tier - best pricing/priority
    GOLD = "gold"                   # Premium tier
    SILVER = "silver"               # Standard tier
    BRONZE = "bronze"               # Basic tier

class VerificationStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    SUSPENDED = "suspended"
    REJECTED = "rejected"

class PricingTier(str, Enum):
    LIST = "list"                   # MSRP/List price
    WHOLESALE = "wholesale"         # Standard wholesale
    VOLUME = "volume"               # Volume discount
    CONTRACT = "contract"           # Negotiated contract price
    PROMOTIONAL = "promotional"     # Temporary promotion

class OrderStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    PARTIAL_SHIPPED = "partial_shipped"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"

class PaymentTerms(str, Enum):
    PREPAID = "prepaid"
    NET_15 = "net_15"
    NET_30 = "net_30"
    NET_45 = "net_45"
    NET_60 = "net_60"
    COD = "cod"
    CREDIT_CARD = "credit_card"

class ReorderTrigger(str, Enum):
    MANUAL = "manual"
    LOW_STOCK = "low_stock"
    SCHEDULED = "scheduled"
    PREDICTIVE = "predictive"
```

### Core Supplier Models

```python
class Supplier(BaseModel):
    """Verified supplier on the network"""
    id: UUID
    organization_id: UUID  # Supplier's org in SiteSync

    # Identity
    name: str
    legal_name: str
    supplier_type: SupplierType
    tier: SupplierTier

    # Verification
    verification_status: VerificationStatus
    verified_at: datetime | None
    verification_documents: list[str] = []

    # Contact
    primary_contact_name: str
    primary_contact_email: str
    primary_contact_phone: str
    sales_email: str | None
    support_email: str | None
    support_phone: str | None

    # Location
    headquarters_address: str
    headquarters_city: str
    headquarters_state: str
    headquarters_country: str
    warehouse_locations: list[dict] = []  # Multiple warehouse addresses

    # Business Details
    business_registration: str | None
    tax_id: str | None
    duns_number: str | None
    year_established: int | None
    employee_count: int | None
    annual_revenue_range: str | None

    # Capabilities
    specializations: list[str] = []  # Trades/equipment types
    manufacturers_authorized: list[str] = []
    certifications: list[str] = []
    services_offered: list[str] = []

    # Shipping & Fulfillment
    shipping_regions: list[str] = []  # Countries/regions served
    average_lead_time_days: int | None
    same_day_available: bool = False
    emergency_service: bool = False
    minimum_order_value: Decimal | None
    free_shipping_threshold: Decimal | None

    # Payment
    accepted_payment_methods: list[str] = []
    default_payment_terms: PaymentTerms = PaymentTerms.NET_30

    # Metrics
    total_orders: int = 0
    total_revenue: Decimal = Decimal(0)
    average_rating: float | None
    rating_count: int = 0
    on_time_delivery_rate: float | None
    order_accuracy_rate: float | None
    response_time_hours: float | None

    # Platform
    profile_complete: bool = False
    catalog_synced: bool = False
    catalog_size: int = 0
    featured: bool = False

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SupplierCatalogItem(BaseModel):
    """Item in supplier's catalog with pricing"""
    id: UUID
    supplier_id: UUID

    # Part Reference
    part_id: UUID | None  # Link to platform parts catalog
    part_number: str
    manufacturer: str
    name: str
    description: str | None

    # Classification
    category: str
    trade: str

    # Availability
    in_stock: bool = True
    stock_quantity: int | None
    stock_status: str | None  # "in_stock", "low_stock", "backorder", "discontinued"
    lead_time_days: int | None
    next_restock_date: date | None

    # Pricing
    list_price: Decimal
    wholesale_price: Decimal | None
    currency: str = "USD"
    min_order_quantity: int = 1
    bulk_pricing_tiers: list[dict] = []  # [{min_qty: 10, price: X}, ...]

    # Product Details
    specifications: dict = {}
    images: list[str] = []
    datasheets: list[str] = []
    warranty_months: int | None

    # Search
    keywords: list[str] = []
    embedding: list[float] | None

    is_active: bool = True
    last_synced_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SupplierContract(BaseModel):
    """Negotiated contract between buyer and supplier"""
    id: UUID
    supplier_id: UUID
    buyer_organization_id: UUID

    # Contract Terms
    contract_name: str
    contract_number: str | None
    status: str  # "draft", "pending_approval", "active", "expired", "terminated"

    start_date: date
    end_date: date
    auto_renew: bool = False
    renewal_notice_days: int = 30

    # Pricing
    discount_percentage: Decimal | None  # General discount
    pricing_tier: PricingTier
    custom_pricing: list[dict] = []  # Part-specific pricing

    # Terms
    payment_terms: PaymentTerms
    credit_limit: Decimal | None
    minimum_annual_commitment: Decimal | None
    rebate_percentage: Decimal | None  # Annual rebate based on volume

    # Fulfillment
    priority_fulfillment: bool = False
    dedicated_rep_id: UUID | None
    sla_response_hours: int | None
    sla_shipping_days: int | None

    # Performance
    ytd_spend: Decimal = Decimal(0)
    ytd_orders: int = 0

    # Documents
    contract_document_id: UUID | None
    amendments: list[dict] = []

    signed_by_buyer: UUID | None
    signed_by_supplier: UUID | None
    signed_at: datetime | None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PurchaseOrder(BaseModel):
    """Purchase order to supplier"""
    id: UUID
    buyer_organization_id: UUID
    supplier_id: UUID
    contract_id: UUID | None

    # Order Info
    po_number: str
    order_date: date
    status: OrderStatus

    # Items
    line_items: list["POLineItem"]
    subtotal: Decimal
    discount_amount: Decimal = Decimal(0)
    shipping_cost: Decimal = Decimal(0)
    tax_amount: Decimal = Decimal(0)
    total: Decimal
    currency: str = "USD"

    # Shipping
    ship_to_address: str
    ship_to_city: str
    ship_to_state: str
    ship_to_country: str
    ship_to_postal: str
    ship_to_attention: str | None

    shipping_method: str | None
    requested_delivery_date: date | None
    promised_delivery_date: date | None
    actual_delivery_date: date | None

    # Payment
    payment_terms: PaymentTerms
    payment_status: str  # "pending", "invoiced", "partial", "paid"
    invoice_number: str | None
    invoice_date: date | None
    due_date: date | None
    paid_date: date | None

    # Tracking
    tracking_numbers: list[str] = []
    shipments: list[dict] = []

    # Notes
    buyer_notes: str | None
    supplier_notes: str | None
    internal_notes: str | None

    # Workflow
    requires_approval: bool = False
    approved_by: UUID | None
    approved_at: datetime | None

    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class POLineItem(BaseModel):
    """Line item on a purchase order"""
    id: UUID
    purchase_order_id: UUID
    catalog_item_id: UUID | None

    line_number: int
    part_number: str
    manufacturer: str
    description: str

    quantity_ordered: int
    quantity_shipped: int = 0
    quantity_received: int = 0
    quantity_backordered: int = 0

    unit_price: Decimal
    discount_percent: Decimal = Decimal(0)
    line_total: Decimal

    # Allocation
    for_work_order_id: UUID | None
    for_site_id: UUID | None

    # Status
    status: str  # "pending", "confirmed", "shipped", "partial", "received", "cancelled"
    expected_ship_date: date | None

    notes: str | None


class AutoReorderRule(BaseModel):
    """Automatic reorder configuration"""
    id: UUID
    organization_id: UUID
    inventory_item_id: UUID | None
    part_number: str | None
    supplier_id: UUID | None  # Preferred supplier

    # Trigger
    trigger_type: ReorderTrigger
    reorder_point: int | None  # For low_stock trigger
    reorder_quantity: int
    max_quantity: int | None

    # Schedule (for scheduled trigger)
    schedule_frequency: str | None  # "daily", "weekly", "monthly"
    schedule_day: int | None

    # Supplier Selection
    auto_select_supplier: bool = True  # Auto-pick best price
    max_price: Decimal | None
    require_in_stock: bool = True

    # Approval
    require_approval: bool = True
    auto_approve_under: Decimal | None  # Auto-approve below this amount
    approval_user_ids: list[UUID] = []

    is_active: bool = True
    last_triggered_at: datetime | None
    last_order_id: UUID | None

    created_at: datetime
    updated_at: datetime


class SupplierQuoteRequest(BaseModel):
    """Request for quote from suppliers"""
    id: UUID
    requester_organization_id: UUID
    requester_id: UUID

    # Request Details
    title: str
    description: str | None
    items: list[dict]  # [{part_number, quantity, specs}, ...]

    # Requirements
    delivery_location: str
    delivery_city: str
    delivery_state: str
    delivery_country: str
    required_by_date: date | None

    # Targeting
    target_supplier_ids: list[UUID] = []  # Specific suppliers
    broadcast_to_all: bool = False
    supplier_types: list[SupplierType] = []

    # Response Deadline
    response_deadline: datetime
    status: str = "open"  # "open", "closed", "awarded", "cancelled"

    # Responses
    quotes_received: int = 0
    awarded_to_supplier_id: UUID | None
    awarded_quote_id: UUID | None

    created_at: datetime
    updated_at: datetime


class SupplierQuote(BaseModel):
    """Supplier's response to quote request"""
    id: UUID
    quote_request_id: UUID
    supplier_id: UUID

    # Quote Details
    quote_number: str
    valid_until: date

    line_items: list[dict]  # [{part_number, quantity, unit_price, lead_time}, ...]
    subtotal: Decimal
    shipping_cost: Decimal | None
    tax_estimate: Decimal | None
    total: Decimal
    currency: str = "USD"

    # Terms
    payment_terms: PaymentTerms
    lead_time_days: int
    notes: str | None
    terms_and_conditions: str | None

    # Attachments
    documents: list[str] = []

    status: str = "submitted"  # "submitted", "under_review", "accepted", "rejected", "expired"

    submitted_at: datetime
    reviewed_at: datetime | None
```

---

## Database Schema

```sql
-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),

    name VARCHAR(200) NOT NULL,
    legal_name VARCHAR(200),
    supplier_type VARCHAR(30) NOT NULL,
    tier VARCHAR(20) DEFAULT 'bronze',

    verification_status VARCHAR(20) DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    verification_documents JSONB DEFAULT '[]',

    primary_contact_name VARCHAR(100),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(50),
    sales_email VARCHAR(255),
    support_email VARCHAR(255),
    support_phone VARCHAR(50),

    headquarters_address TEXT,
    headquarters_city VARCHAR(100),
    headquarters_state VARCHAR(100),
    headquarters_country VARCHAR(100),
    warehouse_locations JSONB DEFAULT '[]',

    business_registration VARCHAR(100),
    tax_id VARCHAR(50),
    duns_number VARCHAR(20),
    year_established INTEGER,
    employee_count INTEGER,
    annual_revenue_range VARCHAR(50),

    specializations JSONB DEFAULT '[]',
    manufacturers_authorized JSONB DEFAULT '[]',
    certifications JSONB DEFAULT '[]',
    services_offered JSONB DEFAULT '[]',

    shipping_regions JSONB DEFAULT '[]',
    average_lead_time_days INTEGER,
    same_day_available BOOLEAN DEFAULT FALSE,
    emergency_service BOOLEAN DEFAULT FALSE,
    minimum_order_value DECIMAL(12, 2),
    free_shipping_threshold DECIMAL(12, 2),

    accepted_payment_methods JSONB DEFAULT '[]',
    default_payment_terms VARCHAR(20) DEFAULT 'net_30',

    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(14, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2),
    rating_count INTEGER DEFAULT 0,
    on_time_delivery_rate DECIMAL(5, 2),
    order_accuracy_rate DECIMAL(5, 2),
    response_time_hours DECIMAL(6, 2),

    profile_complete BOOLEAN DEFAULT FALSE,
    catalog_synced BOOLEAN DEFAULT FALSE,
    catalog_size INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_suppliers_type ON suppliers(supplier_type);
CREATE INDEX idx_suppliers_tier ON suppliers(tier);
CREATE INDEX idx_suppliers_status ON suppliers(verification_status);
CREATE INDEX idx_suppliers_org ON suppliers(organization_id);


-- Supplier catalog items
CREATE TABLE supplier_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,

    part_id UUID REFERENCES parts_catalog(id),
    part_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    category VARCHAR(50),
    trade VARCHAR(30),

    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER,
    stock_status VARCHAR(30),
    lead_time_days INTEGER,
    next_restock_date DATE,

    list_price DECIMAL(12, 2) NOT NULL,
    wholesale_price DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    min_order_quantity INTEGER DEFAULT 1,
    bulk_pricing_tiers JSONB DEFAULT '[]',

    specifications JSONB DEFAULT '{}',
    images JSONB DEFAULT '[]',
    datasheets JSONB DEFAULT '[]',
    warranty_months INTEGER,

    keywords JSONB DEFAULT '[]',
    embedding vector(1536),

    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(part_number, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(manufacturer, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(name, '')), 'B')
    ) STORED,

    is_active BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_supplier_part UNIQUE(supplier_id, manufacturer, part_number)
);

CREATE INDEX idx_catalog_supplier ON supplier_catalog(supplier_id);
CREATE INDEX idx_catalog_part ON supplier_catalog(part_number, manufacturer);
CREATE INDEX idx_catalog_search ON supplier_catalog USING GIN(search_vector);
CREATE INDEX idx_catalog_embedding ON supplier_catalog USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX idx_catalog_price ON supplier_catalog(wholesale_price);
CREATE INDEX idx_catalog_stock ON supplier_catalog(in_stock) WHERE in_stock = TRUE;


-- Supplier contracts
CREATE TABLE supplier_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    buyer_organization_id UUID NOT NULL REFERENCES organizations(id),

    contract_name VARCHAR(200) NOT NULL,
    contract_number VARCHAR(100),
    status VARCHAR(30) DEFAULT 'draft',

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT FALSE,
    renewal_notice_days INTEGER DEFAULT 30,

    discount_percentage DECIMAL(5, 2),
    pricing_tier VARCHAR(30),
    custom_pricing JSONB DEFAULT '[]',

    payment_terms VARCHAR(20),
    credit_limit DECIMAL(14, 2),
    minimum_annual_commitment DECIMAL(14, 2),
    rebate_percentage DECIMAL(5, 2),

    priority_fulfillment BOOLEAN DEFAULT FALSE,
    dedicated_rep_id UUID REFERENCES users(id),
    sla_response_hours INTEGER,
    sla_shipping_days INTEGER,

    ytd_spend DECIMAL(14, 2) DEFAULT 0,
    ytd_orders INTEGER DEFAULT 0,

    contract_document_id UUID REFERENCES documents(id),
    amendments JSONB DEFAULT '[]',

    signed_by_buyer UUID REFERENCES users(id),
    signed_by_supplier UUID REFERENCES users(id),
    signed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_dates CHECK (end_date > start_date)
);

CREATE INDEX idx_contracts_supplier ON supplier_contracts(supplier_id);
CREATE INDEX idx_contracts_buyer ON supplier_contracts(buyer_organization_id);
CREATE INDEX idx_contracts_status ON supplier_contracts(status);
CREATE INDEX idx_contracts_dates ON supplier_contracts(start_date, end_date);


-- Purchase orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_organization_id UUID NOT NULL REFERENCES organizations(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    contract_id UUID REFERENCES supplier_contracts(id),

    po_number VARCHAR(50) NOT NULL,
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(30) DEFAULT 'draft',

    subtotal DECIMAL(14, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    ship_to_address TEXT NOT NULL,
    ship_to_city VARCHAR(100) NOT NULL,
    ship_to_state VARCHAR(100),
    ship_to_country VARCHAR(100) NOT NULL,
    ship_to_postal VARCHAR(20),
    ship_to_attention VARCHAR(100),

    shipping_method VARCHAR(50),
    requested_delivery_date DATE,
    promised_delivery_date DATE,
    actual_delivery_date DATE,

    payment_terms VARCHAR(20),
    payment_status VARCHAR(20) DEFAULT 'pending',
    invoice_number VARCHAR(100),
    invoice_date DATE,
    due_date DATE,
    paid_date DATE,

    tracking_numbers JSONB DEFAULT '[]',
    shipments JSONB DEFAULT '[]',

    buyer_notes TEXT,
    supplier_notes TEXT,
    internal_notes TEXT,

    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,

    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_po UNIQUE(buyer_organization_id, po_number)
);

CREATE INDEX idx_po_buyer ON purchase_orders(buyer_organization_id);
CREATE INDEX idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_date ON purchase_orders(order_date DESC);
CREATE INDEX idx_po_payment ON purchase_orders(payment_status);


-- Purchase order line items
CREATE TABLE po_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    catalog_item_id UUID REFERENCES supplier_catalog(id),

    line_number INTEGER NOT NULL,
    part_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    description TEXT,

    quantity_ordered INTEGER NOT NULL,
    quantity_shipped INTEGER DEFAULT 0,
    quantity_received INTEGER DEFAULT 0,
    quantity_backordered INTEGER DEFAULT 0,

    unit_price DECIMAL(12, 2) NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    line_total DECIMAL(12, 2) NOT NULL,

    for_work_order_id UUID REFERENCES work_orders(id),
    for_site_id UUID REFERENCES sites(id),

    status VARCHAR(30) DEFAULT 'pending',
    expected_ship_date DATE,

    notes TEXT,

    CONSTRAINT positive_quantities CHECK (
        quantity_ordered > 0 AND
        quantity_shipped >= 0 AND
        quantity_received >= 0
    )
);

CREATE INDEX idx_po_items_order ON po_line_items(purchase_order_id);
CREATE INDEX idx_po_items_part ON po_line_items(part_number, manufacturer);


-- Auto-reorder rules
CREATE TABLE auto_reorder_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    inventory_item_id UUID REFERENCES inventory_items(id),
    part_number VARCHAR(100),
    supplier_id UUID REFERENCES suppliers(id),

    trigger_type VARCHAR(30) NOT NULL,
    reorder_point INTEGER,
    reorder_quantity INTEGER NOT NULL,
    max_quantity INTEGER,

    schedule_frequency VARCHAR(20),
    schedule_day INTEGER,

    auto_select_supplier BOOLEAN DEFAULT TRUE,
    max_price DECIMAL(12, 2),
    require_in_stock BOOLEAN DEFAULT TRUE,

    require_approval BOOLEAN DEFAULT TRUE,
    auto_approve_under DECIMAL(12, 2),
    approval_user_ids JSONB DEFAULT '[]',

    is_active BOOLEAN DEFAULT TRUE,
    last_triggered_at TIMESTAMPTZ,
    last_order_id UUID REFERENCES purchase_orders(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reorder_org ON auto_reorder_rules(organization_id);
CREATE INDEX idx_reorder_active ON auto_reorder_rules(is_active) WHERE is_active = TRUE;


-- Quote requests
CREATE TABLE quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_organization_id UUID NOT NULL REFERENCES organizations(id),
    requester_id UUID NOT NULL REFERENCES users(id),

    title VARCHAR(200) NOT NULL,
    description TEXT,
    items JSONB NOT NULL,

    delivery_location TEXT,
    delivery_city VARCHAR(100),
    delivery_state VARCHAR(100),
    delivery_country VARCHAR(100),
    required_by_date DATE,

    target_supplier_ids JSONB DEFAULT '[]',
    broadcast_to_all BOOLEAN DEFAULT FALSE,
    supplier_types JSONB DEFAULT '[]',

    response_deadline TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'open',

    quotes_received INTEGER DEFAULT 0,
    awarded_to_supplier_id UUID REFERENCES suppliers(id),
    awarded_quote_id UUID,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quotes_org ON quote_requests(requester_organization_id);
CREATE INDEX idx_quotes_status ON quote_requests(status);
CREATE INDEX idx_quotes_deadline ON quote_requests(response_deadline);


-- Supplier quotes (responses)
CREATE TABLE supplier_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_request_id UUID NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),

    quote_number VARCHAR(100),
    valid_until DATE NOT NULL,

    line_items JSONB NOT NULL,
    subtotal DECIMAL(14, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2),
    tax_estimate DECIMAL(10, 2),
    total DECIMAL(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    payment_terms VARCHAR(20),
    lead_time_days INTEGER,
    notes TEXT,
    terms_and_conditions TEXT,

    documents JSONB DEFAULT '[]',

    status VARCHAR(20) DEFAULT 'submitted',

    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,

    CONSTRAINT unique_supplier_quote UNIQUE(quote_request_id, supplier_id)
);

CREATE INDEX idx_sq_request ON supplier_quotes(quote_request_id);
CREATE INDEX idx_sq_supplier ON supplier_quotes(supplier_id);


-- Supplier ratings/reviews
CREATE TABLE supplier_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    reviewer_organization_id UUID NOT NULL REFERENCES organizations(id),
    purchase_order_id UUID REFERENCES purchase_orders(id),

    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5),
    delivery_rating INTEGER CHECK (delivery_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),

    review_text TEXT,
    would_recommend BOOLEAN,

    supplier_response TEXT,
    supplier_responded_at TIMESTAMPTZ,

    is_verified BOOLEAN DEFAULT FALSE,  -- Verified purchase
    is_public BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_supplier ON supplier_reviews(supplier_id);
CREATE INDEX idx_reviews_rating ON supplier_reviews(overall_rating);


-- Favorite suppliers (per org)
CREATE TABLE favorite_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    notes TEXT,
    is_preferred BOOLEAN DEFAULT FALSE,  -- First choice for auto-orders
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_favorite UNIQUE(organization_id, supplier_id)
);

CREATE INDEX idx_favorites_org ON favorite_suppliers(organization_id);


-- Price alerts
CREATE TABLE supplier_price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    part_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100),

    target_price DECIMAL(12, 2) NOT NULL,
    current_lowest_price DECIMAL(12, 2),
    current_lowest_supplier_id UUID REFERENCES suppliers(id),

    notify_email BOOLEAN DEFAULT TRUE,
    notify_push BOOLEAN DEFAULT TRUE,

    is_active BOOLEAN DEFAULT TRUE,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON supplier_price_alerts(user_id);
CREATE INDEX idx_alerts_part ON supplier_price_alerts(part_number, manufacturer);
```

---

## API Design

### Supplier Management

```python
from fastapi import APIRouter, Depends, Query, UploadFile, File, BackgroundTasks
from typing import Annotated

router = APIRouter(prefix="/api/v1/suppliers", tags=["suppliers"])


# ============ Supplier Discovery ============

@router.get("/", response_model=SupplierSearchResponse)
async def search_suppliers(
    q: str | None = Query(None),
    supplier_type: list[SupplierType] | None = Query(None),
    tier: list[SupplierTier] | None = Query(None),
    manufacturers: list[str] | None = Query(None),
    trades: list[str] | None = Query(None),
    has_emergency: bool = False,
    has_same_day: bool = False,
    min_rating: float | None = None,
    region: str | None = None,
    sort_by: str = "rating",
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> SupplierSearchResponse:
    """Search verified suppliers"""
    pass


@router.get("/{supplier_id}", response_model=SupplierDetail)
async def get_supplier(
    supplier_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> SupplierDetail:
    """Get supplier details"""
    pass


@router.get("/{supplier_id}/catalog", response_model=CatalogSearchResponse)
async def search_supplier_catalog(
    supplier_id: UUID,
    q: str | None = Query(None),
    category: str | None = None,
    manufacturer: str | None = None,
    in_stock: bool | None = None,
    max_price: Decimal | None = None,
    page: int = 1,
    page_size: int = 50,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> CatalogSearchResponse:
    """Search supplier's catalog"""
    pass


@router.get("/{supplier_id}/reviews", response_model=list[SupplierReviewResponse])
async def get_supplier_reviews(
    supplier_id: UUID,
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[SupplierReviewResponse]:
    """Get supplier reviews"""
    pass


# ============ Favorites & Preferences ============

@router.post("/{supplier_id}/favorite")
async def add_favorite_supplier(
    supplier_id: UUID,
    is_preferred: bool = False,
    notes: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Add supplier to favorites"""
    pass


@router.delete("/{supplier_id}/favorite")
async def remove_favorite_supplier(
    supplier_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Remove from favorites"""
    pass


@router.get("/favorites", response_model=list[FavoriteSupplier])
async def get_favorite_suppliers(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[FavoriteSupplier]:
    """Get organization's favorite suppliers"""
    pass


# ============ Supplier Onboarding (for suppliers) ============

@router.post("/apply", response_model=SupplierApplicationResponse, status_code=201)
async def apply_as_supplier(
    application: SupplierApplication,
    documents: list[UploadFile] = File([]),
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> SupplierApplicationResponse:
    """Apply to become a verified supplier"""
    pass


@router.patch("/profile", response_model=SupplierResponse)
async def update_supplier_profile(
    updates: SupplierProfileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> SupplierResponse:
    """Update supplier profile (supplier only)"""
    pass


# ============ Catalog Management (for suppliers) ============

@router.post("/catalog/sync")
async def sync_catalog(
    source: str,  # "csv", "api", "edi"
    data: UploadFile | None = File(None),
    api_config: dict | None = None,
    background_tasks: BackgroundTasks = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Sync catalog from external source"""
    pass


@router.post("/catalog/items", response_model=CatalogItemResponse, status_code=201)
async def add_catalog_item(
    item: CatalogItemCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> CatalogItemResponse:
    """Add item to catalog"""
    pass


@router.patch("/catalog/items/{item_id}", response_model=CatalogItemResponse)
async def update_catalog_item(
    item_id: UUID,
    updates: CatalogItemUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> CatalogItemResponse:
    """Update catalog item"""
    pass


@router.post("/catalog/items/bulk-update")
async def bulk_update_catalog(
    updates: list[CatalogBulkUpdate],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Bulk update prices/availability"""
    pass
```

### Contracts & Pricing

```python
router_contracts = APIRouter(prefix="/api/v1/supplier-contracts", tags=["contracts"])


@router_contracts.get("/", response_model=list[ContractSummary])
async def get_contracts(
    status: str | None = None,
    supplier_id: UUID | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[ContractSummary]:
    """Get organization's supplier contracts"""
    pass


@router_contracts.post("/", response_model=ContractResponse, status_code=201)
async def create_contract(
    contract: ContractCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ContractResponse:
    """Create a new supplier contract"""
    pass


@router_contracts.get("/{contract_id}", response_model=ContractDetail)
async def get_contract(
    contract_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ContractDetail:
    """Get contract details"""
    pass


@router_contracts.post("/{contract_id}/sign")
async def sign_contract(
    contract_id: UUID,
    signature: SignatureData,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Sign a contract"""
    pass


@router_contracts.get("/{contract_id}/pricing")
async def get_contract_pricing(
    contract_id: UUID,
    part_numbers: list[str] = Query(...),
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[ContractPrice]:
    """Get contract pricing for specific parts"""
    pass
```

### Purchase Orders

```python
router_po = APIRouter(prefix="/api/v1/purchase-orders", tags=["purchase-orders"])


@router_po.get("/", response_model=list[POSummary])
async def get_purchase_orders(
    status: list[OrderStatus] | None = Query(None),
    supplier_id: UUID | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[POSummary]:
    """Get purchase orders"""
    pass


@router_po.post("/", response_model=POResponse, status_code=201)
async def create_purchase_order(
    po: POCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> POResponse:
    """Create a purchase order"""
    pass


@router_po.get("/{po_id}", response_model=PODetail)
async def get_purchase_order(
    po_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> PODetail:
    """Get PO details"""
    pass


@router_po.post("/{po_id}/submit")
async def submit_purchase_order(
    po_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Submit PO to supplier"""
    pass


@router_po.post("/{po_id}/approve")
async def approve_purchase_order(
    po_id: UUID,
    notes: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Approve a PO (if approval required)"""
    pass


@router_po.post("/{po_id}/receive")
async def receive_items(
    po_id: UUID,
    receipt: ReceiptCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Record receipt of items"""
    pass


@router_po.post("/{po_id}/cancel")
async def cancel_purchase_order(
    po_id: UUID,
    reason: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Cancel a PO"""
    pass


# ============ Auto-Reorder ============

@router_po.get("/auto-reorder/rules", response_model=list[ReorderRuleResponse])
async def get_reorder_rules(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[ReorderRuleResponse]:
    """Get auto-reorder rules"""
    pass


@router_po.post("/auto-reorder/rules", response_model=ReorderRuleResponse, status_code=201)
async def create_reorder_rule(
    rule: ReorderRuleCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ReorderRuleResponse:
    """Create auto-reorder rule"""
    pass


@router_po.patch("/auto-reorder/rules/{rule_id}", response_model=ReorderRuleResponse)
async def update_reorder_rule(
    rule_id: UUID,
    updates: ReorderRuleUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ReorderRuleResponse:
    """Update reorder rule"""
    pass
```

### Quotes (RFQ)

```python
router_quotes = APIRouter(prefix="/api/v1/quote-requests", tags=["quotes"])


@router_quotes.post("/", response_model=QuoteRequestResponse, status_code=201)
async def create_quote_request(
    request: QuoteRequestCreate,
    background_tasks: BackgroundTasks,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> QuoteRequestResponse:
    """Create a request for quote"""
    pass


@router_quotes.get("/", response_model=list[QuoteRequestSummary])
async def get_quote_requests(
    status: str | None = None,
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[QuoteRequestSummary]:
    """Get your quote requests"""
    pass


@router_quotes.get("/{request_id}", response_model=QuoteRequestDetail)
async def get_quote_request(
    request_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> QuoteRequestDetail:
    """Get quote request with responses"""
    pass


@router_quotes.post("/{request_id}/respond", response_model=SupplierQuoteResponse)
async def respond_to_quote(
    request_id: UUID,
    quote: SupplierQuoteCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> SupplierQuoteResponse:
    """Submit a quote (supplier only)"""
    pass


@router_quotes.post("/{request_id}/award/{quote_id}")
async def award_quote(
    request_id: UUID,
    quote_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> POResponse:
    """Award quote and create PO"""
    pass
```

---

## AI-Powered Features

### Supplier Recommendation Service

```python
class SupplierRecommendationService:
    """AI-powered supplier recommendations"""

    async def recommend_suppliers(
        self,
        part_request: PartRequest,
        organization_id: UUID
    ) -> list[SupplierRecommendation]:
        """Recommend best suppliers for a part request"""

        # 1. Find suppliers with this part
        suppliers = await self._find_suppliers_with_part(
            part_request.part_number,
            part_request.manufacturer
        )

        if not suppliers:
            # Try alternative parts
            alternatives = await self._find_alternative_parts(part_request)
            suppliers = await self._find_suppliers_for_alternatives(alternatives)

        # 2. Check for existing contracts
        contracts = await self._get_org_contracts(organization_id)
        contract_suppliers = {c.supplier_id for c in contracts if c.status == 'active'}

        # 3. Score and rank suppliers
        recommendations = []
        for supplier in suppliers:
            score = await self._calculate_supplier_score(
                supplier,
                part_request,
                organization_id,
                has_contract=supplier.id in contract_suppliers
            )
            recommendations.append(SupplierRecommendation(
                supplier=supplier,
                score=score,
                has_contract=supplier.id in contract_suppliers,
                estimated_price=await self._get_best_price(supplier, part_request, organization_id),
                estimated_lead_time=supplier.average_lead_time_days,
                recommendation_reasons=self._get_reasons(score)
            ))

        # 4. Sort by score
        recommendations.sort(key=lambda r: r.score.total, reverse=True)
        return recommendations[:10]

    async def _calculate_supplier_score(
        self,
        supplier: Supplier,
        request: PartRequest,
        org_id: UUID,
        has_contract: bool
    ) -> SupplierScore:
        """Calculate comprehensive supplier score"""

        scores = {}

        # Price score (0-100)
        price = await self._get_supplier_price(supplier.id, request.part_number)
        market_avg = await self._get_market_average_price(request.part_number)
        if price and market_avg:
            scores['price'] = max(0, min(100, 100 - ((price / market_avg - 1) * 100)))
        else:
            scores['price'] = 50

        # Quality/rating score (0-100)
        if supplier.average_rating:
            scores['quality'] = supplier.average_rating * 20
        else:
            scores['quality'] = 50

        # Delivery reliability (0-100)
        if supplier.on_time_delivery_rate:
            scores['delivery'] = supplier.on_time_delivery_rate
        else:
            scores['delivery'] = 50

        # Availability (0-100)
        catalog_item = await self._get_catalog_item(supplier.id, request.part_number)
        if catalog_item:
            if catalog_item.in_stock and catalog_item.stock_quantity:
                scores['availability'] = 100
            elif catalog_item.in_stock:
                scores['availability'] = 80
            else:
                scores['availability'] = 30
        else:
            scores['availability'] = 0

        # Relationship score (contract bonus)
        scores['relationship'] = 100 if has_contract else 0

        # Lead time (0-100)
        if supplier.average_lead_time_days:
            if request.urgency == 'emergency' and supplier.same_day_available:
                scores['lead_time'] = 100
            elif supplier.average_lead_time_days <= 2:
                scores['lead_time'] = 90
            elif supplier.average_lead_time_days <= 5:
                scores['lead_time'] = 70
            elif supplier.average_lead_time_days <= 10:
                scores['lead_time'] = 50
            else:
                scores['lead_time'] = 30
        else:
            scores['lead_time'] = 50

        # Weighted total
        weights = {
            'price': 0.25,
            'quality': 0.20,
            'delivery': 0.15,
            'availability': 0.20,
            'relationship': 0.10,
            'lead_time': 0.10
        }

        total = sum(scores[k] * weights[k] for k in weights)

        return SupplierScore(
            total=round(total, 1),
            components=scores,
            weights=weights
        )


class ProcurementOptimizer:
    """Optimize procurement across multiple suppliers"""

    async def optimize_order(
        self,
        items: list[OrderItem],
        organization_id: UUID,
        constraints: OrderConstraints | None = None
    ) -> OptimizedOrder:
        """Find optimal supplier split for a multi-item order"""

        constraints = constraints or OrderConstraints()

        # Get pricing from all suppliers for all items
        pricing_matrix = await self._build_pricing_matrix(items, organization_id)

        # Run optimization
        if constraints.prefer_single_supplier:
            result = self._optimize_single_supplier(pricing_matrix, items)
        else:
            result = self._optimize_multi_supplier(pricing_matrix, items, constraints)

        return OptimizedOrder(
            items=items,
            supplier_allocations=result.allocations,
            total_cost=result.total_cost,
            estimated_savings=await self._calculate_savings(items, result.total_cost),
            shipping_costs=result.shipping_costs,
            lead_times=result.lead_times,
            recommendations=await self._generate_recommendations(result)
        )

    def _optimize_multi_supplier(
        self,
        pricing: dict,
        items: list[OrderItem],
        constraints: OrderConstraints
    ) -> OptimizationResult:
        """Linear programming optimization for multi-supplier order"""

        from scipy.optimize import linprog

        # Build optimization problem
        # Variables: quantity of each item from each supplier
        suppliers = list(pricing.keys())
        n_suppliers = len(suppliers)
        n_items = len(items)

        # Objective: minimize total cost
        c = []
        for item in items:
            for supplier in suppliers:
                price = pricing.get(supplier, {}).get(item.part_number, float('inf'))
                c.append(price)

        # Constraints: must fulfill each item's quantity
        A_eq = []
        b_eq = []
        for i, item in enumerate(items):
            row = [0] * (n_items * n_suppliers)
            for j in range(n_suppliers):
                row[i * n_suppliers + j] = 1
            A_eq.append(row)
            b_eq.append(item.quantity)

        # Bounds: non-negative, max available
        bounds = []
        for item in items:
            for supplier in suppliers:
                avail = pricing.get(supplier, {}).get(f"{item.part_number}_available", 0)
                bounds.append((0, avail))

        result = linprog(c, A_eq=A_eq, b_eq=b_eq, bounds=bounds, method='highs')

        # Parse result into allocations
        allocations = {}
        idx = 0
        for item in items:
            for supplier in suppliers:
                qty = int(result.x[idx])
                if qty > 0:
                    if supplier not in allocations:
                        allocations[supplier] = []
                    allocations[supplier].append({
                        'part_number': item.part_number,
                        'quantity': qty,
                        'unit_price': pricing[supplier][item.part_number]
                    })
                idx += 1

        return OptimizationResult(
            allocations=allocations,
            total_cost=Decimal(str(result.fun))
        )


class AutoReorderService:
    """Automated reordering based on rules"""

    async def check_and_reorder(self):
        """Check all active reorder rules and create orders"""

        rules = await self._get_active_rules()

        for rule in rules:
            if await self._should_trigger(rule):
                await self._process_rule(rule)

    async def _should_trigger(self, rule: AutoReorderRule) -> bool:
        """Check if rule should trigger"""

        if rule.trigger_type == ReorderTrigger.LOW_STOCK:
            current_qty = await self._get_current_quantity(rule.inventory_item_id)
            return current_qty <= rule.reorder_point

        elif rule.trigger_type == ReorderTrigger.SCHEDULED:
            return self._is_scheduled_today(rule)

        elif rule.trigger_type == ReorderTrigger.PREDICTIVE:
            # AI prediction based on usage patterns
            prediction = await self._predict_stockout(rule.inventory_item_id)
            return prediction.days_until_stockout <= 7

        return False

    async def _process_rule(self, rule: AutoReorderRule):
        """Process a triggered rule"""

        # Find best supplier
        if rule.supplier_id:
            supplier = await self._get_supplier(rule.supplier_id)
        elif rule.auto_select_supplier:
            supplier = await self._find_best_supplier(
                rule.part_number,
                rule.reorder_quantity,
                rule.max_price
            )
        else:
            return  # No supplier configured

        if not supplier:
            await self._notify_no_supplier(rule)
            return

        # Calculate order
        quantity = rule.reorder_quantity
        if rule.max_quantity:
            current = await self._get_current_quantity(rule.inventory_item_id)
            quantity = min(quantity, rule.max_quantity - current)

        price = await self._get_price(supplier.id, rule.part_number)
        total = price * quantity

        # Check if auto-approve
        if rule.require_approval and (not rule.auto_approve_under or total > rule.auto_approve_under):
            await self._create_pending_order(rule, supplier, quantity, price)
            await self._notify_approval_needed(rule)
        else:
            # Auto-approve and submit
            po = await self._create_and_submit_order(rule, supplier, quantity, price)
            await self._update_rule_triggered(rule, po.id)
```

### Price Intelligence

```python
class SupplierPriceIntelligence:
    """Market price intelligence and analysis"""

    async def get_price_comparison(
        self,
        part_number: str,
        manufacturer: str,
        organization_id: UUID
    ) -> PriceComparison:
        """Compare prices across suppliers"""

        # Get all supplier prices
        prices = await self._get_all_prices(part_number, manufacturer)

        # Get contract prices
        contract_prices = await self._get_contract_prices(
            part_number,
            manufacturer,
            organization_id
        )

        # Combine and analyze
        all_prices = prices + contract_prices

        if not all_prices:
            return PriceComparison(part_number=part_number, prices=[])

        sorted_prices = sorted(all_prices, key=lambda p: p.price)

        return PriceComparison(
            part_number=part_number,
            manufacturer=manufacturer,
            lowest_price=sorted_prices[0],
            highest_price=sorted_prices[-1],
            average_price=sum(p.price for p in all_prices) / len(all_prices),
            prices=sorted_prices,
            your_best_price=min((p for p in contract_prices), key=lambda p: p.price, default=None),
            savings_available=self._calculate_savings(sorted_prices, contract_prices)
        )

    async def get_price_trends(
        self,
        part_number: str,
        manufacturer: str,
        days: int = 90
    ) -> PriceTrend:
        """Get price trend analysis"""

        history = await self._get_price_history(part_number, manufacturer, days)

        if len(history) < 2:
            return PriceTrend(trend="insufficient_data")

        # Calculate trend
        prices = [h.price for h in history]
        dates = [h.recorded_at for h in history]

        trend = self._calculate_trend(prices, dates)
        volatility = self._calculate_volatility(prices)

        return PriceTrend(
            part_number=part_number,
            manufacturer=manufacturer,
            trend=trend.direction,
            trend_percentage=trend.percentage,
            volatility=volatility,
            current_price=prices[-1],
            period_low=min(prices),
            period_high=max(prices),
            forecast=await self._forecast_price(history)
        )

    async def set_price_alert(
        self,
        user_id: UUID,
        part_number: str,
        manufacturer: str | None,
        target_price: Decimal
    ) -> PriceAlert:
        """Set up a price alert"""

        current = await self._get_current_lowest_price(part_number, manufacturer)

        alert = PriceAlert(
            user_id=user_id,
            part_number=part_number,
            manufacturer=manufacturer,
            target_price=target_price,
            current_lowest_price=current.price if current else None,
            current_lowest_supplier_id=current.supplier_id if current else None
        )

        await self._save_alert(alert)

        return alert
```

---

## Integration Points

### Catalog Sync

```python
class CatalogSyncService:
    """Sync supplier catalogs from various sources"""

    async def sync_from_csv(
        self,
        supplier_id: UUID,
        file_content: bytes,
        mapping: dict
    ) -> SyncResult:
        """Import catalog from CSV"""

        df = pd.read_csv(BytesIO(file_content))

        # Map columns
        df = df.rename(columns=mapping)

        # Validate required fields
        required = ['part_number', 'manufacturer', 'name', 'list_price']
        missing = [f for f in required if f not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {missing}")

        # Process rows
        created = 0
        updated = 0
        errors = []

        for _, row in df.iterrows():
            try:
                result = await self._upsert_catalog_item(supplier_id, row.to_dict())
                if result == 'created':
                    created += 1
                else:
                    updated += 1
            except Exception as e:
                errors.append({'row': row.to_dict(), 'error': str(e)})

        # Update supplier catalog size
        await self._update_catalog_size(supplier_id)

        return SyncResult(
            created=created,
            updated=updated,
            errors=errors,
            total_processed=len(df)
        )

    async def sync_from_api(
        self,
        supplier_id: UUID,
        api_config: APIConfig
    ) -> SyncResult:
        """Sync catalog from supplier's API"""

        client = self._get_api_client(api_config)

        items = await client.fetch_all_items()

        created = 0
        updated = 0

        for item in items:
            normalized = self._normalize_item(item, api_config.mapping)
            result = await self._upsert_catalog_item(supplier_id, normalized)
            if result == 'created':
                created += 1
            else:
                updated += 1

        return SyncResult(created=created, updated=updated, total_processed=len(items))

    async def sync_from_edi(
        self,
        supplier_id: UUID,
        edi_message: str
    ) -> SyncResult:
        """Process EDI 832 (Price/Sales Catalog) message"""

        parser = EDI832Parser()
        items = parser.parse(edi_message)

        # Process similar to CSV
        pass
```

---

## Frontend Components

### Supplier Search & Comparison

```tsx
// components/suppliers/SupplierSearch.tsx
export function SupplierSearch() {
  const [filters, setFilters] = useState<SupplierFilters>({
    types: [],
    tiers: [],
    manufacturers: [],
    trades: [],
    hasEmergency: false,
    hasSameDay: false,
    minRating: null,
  });

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3">
        <MultiSelect
          label="Supplier Type"
          options={supplierTypes}
          value={filters.types}
          onChange={(types) => setFilters({...filters, types})}
        />
        <MultiSelect
          label="Authorized Manufacturers"
          options={manufacturers}
          value={filters.manufacturers}
          onChange={(m) => setFilters({...filters, manufacturers: m})}
        />
        <MultiSelect
          label="Trades"
          options={trades}
          value={filters.trades}
          onChange={(t) => setFilters({...filters, trades: t})}
        />
        <Toggle
          label="Emergency Service"
          checked={filters.hasEmergency}
          onChange={(v) => setFilters({...filters, hasEmergency: v})}
        />
        <Toggle
          label="Same-Day"
          checked={filters.hasSameDay}
          onChange={(v) => setFilters({...filters, hasSameDay: v})}
        />
      </div>

      {/* Results */}
      <SupplierGrid filters={filters} />
    </div>
  );
}


// components/suppliers/SupplierCard.tsx
interface SupplierCardProps {
  supplier: Supplier;
  hasContract: boolean;
  onContact: () => void;
  onViewCatalog: () => void;
}

export function SupplierCard({ supplier, hasContract, onContact, onViewCatalog }: SupplierCardProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            {supplier.logo ? (
              <img src={supplier.logo} alt={supplier.name} className="w-12 h-12 object-contain" />
            ) : (
              <BuildingOfficeIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{supplier.name}</h3>
              {supplier.verification_status === 'verified' && (
                <CheckBadgeIcon className="w-5 h-5 text-blue-500" title="Verified" />
              )}
              {hasContract && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Contract</span>
              )}
            </div>
            <p className="text-gray-600 text-sm">{formatSupplierType(supplier.supplier_type)}</p>
            <p className="text-gray-500 text-sm">
              {supplier.headquarters_city}, {supplier.headquarters_state}
            </p>
          </div>
        </div>

        <TierBadge tier={supplier.tier} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mt-4 py-4 border-t border-b">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="font-semibold">{supplier.average_rating?.toFixed(1) || 'N/A'}</span>
          </div>
          <p className="text-xs text-gray-500">{supplier.rating_count} reviews</p>
        </div>
        <div className="text-center">
          <span className="font-semibold">{supplier.on_time_delivery_rate?.toFixed(0)}%</span>
          <p className="text-xs text-gray-500">On-time</p>
        </div>
        <div className="text-center">
          <span className="font-semibold">{supplier.average_lead_time_days || 'N/A'}</span>
          <p className="text-xs text-gray-500">Avg lead time</p>
        </div>
        <div className="text-center">
          <span className="font-semibold">{formatNumber(supplier.catalog_size)}</span>
          <p className="text-xs text-gray-500">Products</p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {supplier.manufacturers_authorized.slice(0, 4).map(m => (
            <span key={m} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">{m}</span>
          ))}
          {supplier.manufacturers_authorized.length > 4 && (
            <span className="text-xs text-gray-500">+{supplier.manufacturers_authorized.length - 4} more</span>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="mt-3 flex gap-3 text-sm">
        {supplier.same_day_available && (
          <span className="flex items-center gap-1 text-green-600">
            <BoltIcon className="w-4 h-4" /> Same-Day
          </span>
        )}
        {supplier.emergency_service && (
          <span className="flex items-center gap-1 text-red-600">
            <ExclamationTriangleIcon className="w-4 h-4" /> Emergency
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={onViewCatalog}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Catalog
        </button>
        <button
          onClick={onContact}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Contact
        </button>
        <button className="p-2 border rounded-lg hover:bg-gray-50">
          <HeartIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}


// components/suppliers/PriceComparison.tsx
interface PriceComparisonProps {
  partNumber: string;
  manufacturer: string;
}

export function PriceComparison({ partNumber, manufacturer }: PriceComparisonProps) {
  const { data: comparison, isLoading } = usePriceComparison(partNumber, manufacturer);

  if (isLoading) return <LoadingSpinner />;
  if (!comparison?.prices.length) return <p>No pricing data available</p>;

  const lowestPrice = comparison.prices[0];
  const yourBest = comparison.your_best_price;

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Price Comparison</h3>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-green-600">Lowest Available</p>
          <p className="text-2xl font-bold text-green-700">${lowestPrice.price}</p>
          <p className="text-xs text-green-600">{lowestPrice.supplier_name}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-600">Your Best Price</p>
          <p className="text-2xl font-bold text-blue-700">
            {yourBest ? `$${yourBest.price}` : 'No contract'}
          </p>
          <p className="text-xs text-blue-600">{yourBest?.supplier_name || '-'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Market Average</p>
          <p className="text-2xl font-bold text-gray-700">${comparison.average_price.toFixed(2)}</p>
        </div>
      </div>

      {/* Price List */}
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b">
            <th className="pb-2">Supplier</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Lead Time</th>
            <th className="pb-2">Stock</th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {comparison.prices.map((price, idx) => (
            <tr key={price.supplier_id} className={price.has_contract ? 'bg-blue-50' : ''}>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{price.supplier_name}</span>
                  {price.has_contract && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">Contract</span>
                  )}
                  {idx === 0 && (
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">Best</span>
                  )}
                </div>
              </td>
              <td className="py-3">
                <span className="font-semibold">${price.price}</span>
                {price.discount_percent > 0 && (
                  <span className="ml-1 text-xs text-green-600">-{price.discount_percent}%</span>
                )}
              </td>
              <td className="py-3 text-gray-600">{price.lead_time_days} days</td>
              <td className="py-3">
                {price.in_stock ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-gray-400">Backorder</span>
                )}
              </td>
              <td className="py-3">
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                  Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Implementation Timeline

### Week 1-2: Core Infrastructure
- [ ] Supplier data model and schema
- [ ] Supplier CRUD and verification workflow
- [ ] Basic supplier search and discovery

### Week 3-4: Catalog & Pricing
- [ ] Supplier catalog management
- [ ] Catalog sync from CSV/API
- [ ] Price tiers and contract pricing

### Week 5-6: Procurement
- [ ] Purchase order workflow
- [ ] Order status tracking
- [ ] Receipt and payment processing

### Week 7-8: Contracts & Intelligence
- [ ] Contract management
- [ ] Price comparison tools
- [ ] Auto-reorder rules

### Week 9-10: AI Features
- [ ] Supplier recommendation engine
- [ ] Procurement optimization
- [ ] Price trend analysis

### Week 11-12: Integration & Polish
- [ ] RFQ (Request for Quote) system
- [ ] Supplier ratings and reviews
- [ ] EDI integration
- [ ] Analytics dashboard

---

## Success Metrics

### Network Growth
- Verified suppliers on platform
- Catalog items available
- Active buyer organizations

### Transaction Volume
- Purchase orders processed
- Total GMV (Gross Merchandise Value)
- Average order value

### Efficiency Gains
- Time saved on procurement
- Cost savings from price comparison
- Auto-reorder adoption rate

### Quality
- Supplier rating distribution
- On-time delivery rate
- Order accuracy rate
- Dispute rate
