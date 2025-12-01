# Phase 2.2: Enhanced Parts Marketplace

## Overview

The Enhanced Parts Marketplace creates a comprehensive ecosystem for sourcing, trading, and managing building equipment parts. It connects technicians needing parts urgently, companies with surplus inventory, specialized suppliers, and salvage operations—all with AI-powered matching, pricing intelligence, and compatibility verification.

## Core Philosophy

### Multi-Channel Parts Sourcing
```
┌─────────────────────────────────────────────────────────────────┐
│                      PARTS MARKETPLACE                           │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   INTERNAL   │  │    PEER      │  │  SUPPLIER    │          │
│  │   INVENTORY  │  │   NETWORK    │  │   CATALOG    │          │
│  │              │  │              │  │              │          │
│  │ Your company │  │ Trade parts  │  │ Authorized   │          │
│  │ stock across │  │ with other   │  │ distributors │          │
│  │ all sites    │  │ contractors  │  │ & OEMs       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   SALVAGE    │  │  EMERGENCY   │  │    WANTED    │          │
│  │   MARKET     │  │    PARTS     │  │    BOARD     │          │
│  │              │  │              │  │              │          │
│  │ Decommission │  │ Same-day     │  │ Post what    │          │
│  │ & surplus    │  │ local        │  │ you need,    │          │
│  │ equipment    │  │ pickup       │  │ get offers   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│              ┌─────────────────────────┐                        │
│              │      AI ASSISTANT       │                        │
│              │  Compatibility Check    │                        │
│              │  Price Intelligence     │                        │
│              │  Alternative Finder     │                        │
│              └─────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

### Part Lifecycle
1. **Need Identification** - Fault diagnosis identifies required part
2. **Compatibility Verification** - AI confirms part fits equipment
3. **Source Discovery** - Search internal, network, suppliers, salvage
4. **Price Intelligence** - Market pricing and fair value assessment
5. **Procurement** - Purchase, trade, or emergency pickup
6. **Tracking** - Delivery tracking and installation confirmation
7. **History** - Part linked to equipment service history

---

## Data Models

### Enums and Types

```python
from enum import Enum
from decimal import Decimal
from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, Field

class PartCategory(str, Enum):
    # Elevator
    ELEVATOR_CONTROLLER = "elevator_controller"
    ELEVATOR_MOTOR = "elevator_motor"
    ELEVATOR_DRIVE = "elevator_drive"
    ELEVATOR_DOOR = "elevator_door"
    ELEVATOR_SAFETY = "elevator_safety"
    ELEVATOR_SENSOR = "elevator_sensor"
    ELEVATOR_BUTTON = "elevator_button"
    ELEVATOR_DISPLAY = "elevator_display"
    ELEVATOR_CABLE = "elevator_cable"
    ELEVATOR_BRAKE = "elevator_brake"

    # HVAC
    HVAC_COMPRESSOR = "hvac_compressor"
    HVAC_CONDENSER = "hvac_condenser"
    HVAC_BLOWER = "hvac_blower"
    HVAC_THERMOSTAT = "hvac_thermostat"
    HVAC_FILTER = "hvac_filter"
    HVAC_VALVE = "hvac_valve"
    HVAC_SENSOR = "hvac_sensor"

    # Electrical
    ELECTRICAL_BREAKER = "electrical_breaker"
    ELECTRICAL_TRANSFORMER = "electrical_transformer"
    ELECTRICAL_SWITCH = "electrical_switch"
    ELECTRICAL_RELAY = "electrical_relay"
    ELECTRICAL_CONTACTOR = "electrical_contactor"

    # General
    GENERAL_FASTENER = "general_fastener"
    GENERAL_LUBRICANT = "general_lubricant"
    GENERAL_TOOL = "general_tool"

class PartCondition(str, Enum):
    NEW = "new"
    REFURBISHED = "refurbished"
    USED_EXCELLENT = "used_excellent"
    USED_GOOD = "used_good"
    USED_FAIR = "used_fair"
    SALVAGE = "salvage"
    FOR_PARTS = "for_parts"

class ListingType(str, Enum):
    SALE = "sale"
    TRADE = "trade"
    WANTED = "wanted"
    AUCTION = "auction"
    EMERGENCY = "emergency"

class ListingVisibility(str, Enum):
    INTERNAL = "internal"       # Company only
    NETWORK = "network"         # Partner network
    INDUSTRY = "industry"       # Same trade
    PUBLIC = "public"           # All platform users

class ListingStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    RESERVED = "reserved"
    SOLD = "sold"
    TRADED = "traded"
    EXPIRED = "expired"
    CANCELLED = "cancelled"

class OfferStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    COUNTERED = "countered"
    WITHDRAWN = "withdrawn"
    EXPIRED = "expired"

class FulfillmentType(str, Enum):
    SHIPPING = "shipping"
    LOCAL_PICKUP = "local_pickup"
    WILL_CALL = "will_call"
    EMERGENCY_DELIVERY = "emergency_delivery"
```

### Core Part Models

```python
class Part(BaseModel):
    """Universal part definition"""
    id: UUID
    organization_id: UUID | None  # Null for platform-wide catalog

    # Identification
    part_number: str
    manufacturer: str
    name: str
    description: str | None

    # Classification
    category: PartCategory
    subcategory: str | None
    trade: str  # elevator, hvac, electrical, etc.

    # Compatibility
    compatible_equipment: list[str] = []  # Equipment model numbers
    compatible_manufacturers: list[str] = []
    supersedes: list[str] = []  # Part numbers this replaces
    superseded_by: str | None  # Newer part number

    # Specifications
    specifications: dict = {}  # Voltage, dimensions, ratings, etc.
    weight_kg: float | None
    dimensions_cm: dict | None  # {length, width, height}

    # Media
    images: list[str] = []  # URLs
    datasheets: list[str] = []
    installation_guides: list[str] = []

    # Pricing Reference
    msrp: Decimal | None
    currency: str = "USD"

    # Search
    keywords: list[str] = []
    embedding: list[float] | None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InventoryItem(BaseModel):
    """Actual inventory held by an organization"""
    id: UUID
    organization_id: UUID
    part_id: UUID | None  # Link to catalog part, if exists

    # Part Info (may differ from catalog)
    part_number: str
    manufacturer: str
    name: str
    description: str | None

    # Location
    stock_location_id: UUID
    bin_location: str | None  # Shelf/bin identifier

    # Quantity & Status
    quantity_on_hand: int
    quantity_reserved: int
    quantity_available: int  # on_hand - reserved
    quantity_on_order: int
    reorder_point: int | None
    reorder_quantity: int | None

    # Condition & Value
    condition: PartCondition
    acquisition_cost: Decimal | None
    current_value: Decimal | None
    currency: str = "USD"

    # Tracking
    serial_numbers: list[str] = []  # For serialized parts
    lot_number: str | None
    manufacture_date: date | None
    expiration_date: date | None  # For consumables

    # Origin
    source: str | None  # "purchased", "salvaged", "transferred"
    source_equipment_id: UUID | None  # If salvaged from equipment
    purchase_order_id: UUID | None
    supplier_id: UUID | None

    # Availability for marketplace
    available_for_sale: bool = False
    available_for_trade: bool = False
    list_price: Decimal | None

    # Audit
    last_counted_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class StockLocation(BaseModel):
    """Physical location where parts are stored"""
    id: UUID
    organization_id: UUID

    name: str
    location_type: str  # "warehouse", "truck", "site", "office"

    # Address (if fixed location)
    address: str | None
    city: str | None
    state_province: str | None
    country: str | None
    postal_code: str | None
    coordinates: tuple[float, float] | None

    # For mobile locations (trucks)
    is_mobile: bool = False
    assigned_user_id: UUID | None  # Truck technician

    # Access
    contact_name: str | None
    contact_phone: str | None
    contact_email: str | None
    pickup_hours: str | None  # "M-F 8am-5pm"

    is_active: bool = True
    created_at: datetime


class MarketplaceListing(BaseModel):
    """Part listed for sale, trade, or wanted"""
    id: UUID
    organization_id: UUID
    seller_id: UUID

    # Listing Type
    listing_type: ListingType
    visibility: ListingVisibility

    # Part Info
    inventory_item_id: UUID | None  # If from inventory
    part_number: str
    manufacturer: str
    name: str
    description: str

    category: PartCategory
    condition: PartCondition

    # Quantity
    quantity_available: int
    minimum_order_quantity: int = 1

    # Pricing
    price: Decimal | None  # Null for wanted/trade listings
    price_negotiable: bool = True
    currency: str = "USD"
    accepts_trade: bool = False
    trade_for: list[str] = []  # Part numbers interested in trading for

    # For Auctions
    is_auction: bool = False
    starting_bid: Decimal | None
    current_bid: Decimal | None
    bid_count: int = 0
    auction_end: datetime | None
    reserve_price: Decimal | None  # Hidden minimum

    # Location & Fulfillment
    stock_location_id: UUID | None
    city: str
    state_province: str
    country: str
    postal_code: str | None
    coordinates: tuple[float, float] | None

    fulfillment_options: list[FulfillmentType] = []
    shipping_cost: Decimal | None
    estimated_shipping_days: int | None
    local_pickup_available: bool = True
    emergency_available: bool = False
    emergency_premium: Decimal | None  # Extra charge for same-day

    # Media
    images: list[str] = []
    videos: list[str] = []

    # Compatibility (important for buyers)
    compatible_equipment: list[str] = []
    compatible_manufacturers: list[str] = []

    # Warranty/Guarantee
    warranty_days: int = 0
    return_policy: str | None

    # AI Enhancement
    ai_verified_compatibility: bool = False
    ai_price_assessment: dict | None  # Market comparison
    embedding: list[float] | None

    # Status
    status: ListingStatus = ListingStatus.DRAFT
    featured: bool = False
    expires_at: datetime | None

    # Metrics
    views_count: int = 0
    inquiry_count: int = 0
    offer_count: int = 0

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PartOffer(BaseModel):
    """Offer/inquiry on a listing"""
    id: UUID
    listing_id: UUID
    buyer_id: UUID
    buyer_organization_id: UUID

    # Offer Details
    offer_type: str  # "purchase", "trade", "inquiry"
    quantity: int
    offered_price: Decimal | None
    currency: str = "USD"

    # Trade Offer
    trade_items: list[dict] = []  # Parts offered in trade

    # Message
    message: str | None

    # Fulfillment Preference
    fulfillment_preference: FulfillmentType
    delivery_address: str | None
    needed_by_date: date | None
    is_urgent: bool = False

    # Status
    status: OfferStatus = OfferStatus.PENDING
    counter_offer: dict | None  # If seller countered

    # Response
    response_message: str | None
    responded_at: datetime | None

    created_at: datetime
    expires_at: datetime | None

    class Config:
        from_attributes = True


class PartTransaction(BaseModel):
    """Completed part sale/trade"""
    id: UUID
    listing_id: UUID
    offer_id: UUID | None

    seller_organization_id: UUID
    buyer_organization_id: UUID

    # Transaction Details
    transaction_type: str  # "sale", "trade", "emergency_sale"
    parts: list[dict]  # {part_number, quantity, unit_price}
    subtotal: Decimal
    shipping_cost: Decimal
    tax: Decimal
    total: Decimal
    currency: str = "USD"

    # Trade Details (if applicable)
    trade_parts_received: list[dict] = []
    trade_value_difference: Decimal | None

    # Payment
    payment_method: str | None
    payment_status: str  # "pending", "paid", "refunded"
    payment_reference: str | None

    # Fulfillment
    fulfillment_type: FulfillmentType
    shipping_address: str | None
    tracking_number: str | None
    shipped_at: datetime | None
    delivered_at: datetime | None
    pickup_code: str | None  # For local pickup

    # Status
    status: str  # "pending", "paid", "shipped", "delivered", "completed", "disputed", "refunded"

    # Reviews
    seller_rating: int | None  # 1-5
    seller_review: str | None
    buyer_rating: int | None
    buyer_review: str | None

    created_at: datetime
    completed_at: datetime | None


class WantedPost(BaseModel):
    """Part wanted request"""
    id: UUID
    organization_id: UUID
    requester_id: UUID

    # What's Needed
    part_number: str | None  # May not know exact part
    manufacturer: str | None
    description: str
    category: PartCategory

    # Equipment Context
    equipment_type: str | None
    equipment_manufacturer: str | None
    equipment_model: str | None
    equipment_serial: str | None
    fault_code: str | None

    # Requirements
    quantity_needed: int
    acceptable_conditions: list[PartCondition]
    needed_by_date: date | None
    urgency: str  # "standard", "priority", "urgent", "emergency"

    # Budget
    max_price: Decimal | None
    currency: str = "USD"

    # Location
    city: str
    state_province: str
    country: str

    # Visibility
    visibility: ListingVisibility = ListingVisibility.INDUSTRY

    # Status
    status: str = "active"  # "active", "fulfilled", "cancelled"
    responses_count: int = 0

    created_at: datetime
    expires_at: datetime

    class Config:
        from_attributes = True
```

---

## Database Schema

```sql
-- Parts catalog (platform-wide reference)
CREATE TABLE parts_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),  -- Null = platform catalog

    part_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    trade VARCHAR(30) NOT NULL,

    compatible_equipment JSONB DEFAULT '[]',
    compatible_manufacturers JSONB DEFAULT '[]',
    supersedes JSONB DEFAULT '[]',
    superseded_by VARCHAR(100),

    specifications JSONB DEFAULT '{}',
    weight_kg DECIMAL(10, 3),
    dimensions_cm JSONB,

    images JSONB DEFAULT '[]',
    datasheets JSONB DEFAULT '[]',
    installation_guides JSONB DEFAULT '[]',

    msrp DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',

    keywords JSONB DEFAULT '[]',
    embedding vector(1536),

    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(part_number, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(manufacturer, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(name, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'C')
    ) STORED,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT unique_part UNIQUE(organization_id, manufacturer, part_number)
);

CREATE INDEX idx_parts_manufacturer ON parts_catalog(manufacturer);
CREATE INDEX idx_parts_category ON parts_catalog(category);
CREATE INDEX idx_parts_trade ON parts_catalog(trade);
CREATE INDEX idx_parts_search ON parts_catalog USING GIN(search_vector);
CREATE INDEX idx_parts_embedding ON parts_catalog USING ivfflat(embedding vector_cosine_ops);


-- Stock locations
CREATE TABLE stock_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),

    name VARCHAR(100) NOT NULL,
    location_type VARCHAR(30) NOT NULL,

    address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    coordinates POINT,

    is_mobile BOOLEAN DEFAULT FALSE,
    assigned_user_id UUID REFERENCES users(id),

    contact_name VARCHAR(100),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    pickup_hours VARCHAR(100),

    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stock_locations_org ON stock_locations(organization_id);
CREATE INDEX idx_stock_locations_type ON stock_locations(location_type);
CREATE INDEX idx_stock_locations_coords ON stock_locations USING GIST(coordinates);


-- Inventory items
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    part_id UUID REFERENCES parts_catalog(id),

    part_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,

    stock_location_id UUID NOT NULL REFERENCES stock_locations(id),
    bin_location VARCHAR(50),

    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER DEFAULT 0,
    quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
    quantity_on_order INTEGER DEFAULT 0,
    reorder_point INTEGER,
    reorder_quantity INTEGER,

    condition VARCHAR(30) NOT NULL,
    acquisition_cost DECIMAL(12, 2),
    current_value DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',

    serial_numbers JSONB DEFAULT '[]',
    lot_number VARCHAR(100),
    manufacture_date DATE,
    expiration_date DATE,

    source VARCHAR(30),
    source_equipment_id UUID REFERENCES elevators(id),
    purchase_order_id UUID,
    supplier_id UUID,

    available_for_sale BOOLEAN DEFAULT FALSE,
    available_for_trade BOOLEAN DEFAULT FALSE,
    list_price DECIMAL(12, 2),

    last_counted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT positive_quantities CHECK (
        quantity_on_hand >= 0 AND
        quantity_reserved >= 0 AND
        quantity_on_order >= 0 AND
        quantity_reserved <= quantity_on_hand
    )
);

CREATE INDEX idx_inventory_org ON inventory_items(organization_id);
CREATE INDEX idx_inventory_part ON inventory_items(part_number, manufacturer);
CREATE INDEX idx_inventory_location ON inventory_items(stock_location_id);
CREATE INDEX idx_inventory_available ON inventory_items(available_for_sale, available_for_trade)
    WHERE quantity_on_hand > quantity_reserved;


-- Marketplace listings
CREATE TABLE marketplace_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    seller_id UUID NOT NULL REFERENCES users(id),

    listing_type VARCHAR(30) NOT NULL,
    visibility VARCHAR(20) NOT NULL DEFAULT 'industry',

    inventory_item_id UUID REFERENCES inventory_items(id),
    part_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    category VARCHAR(50) NOT NULL,
    condition VARCHAR(30) NOT NULL,

    quantity_available INTEGER NOT NULL,
    minimum_order_quantity INTEGER DEFAULT 1,

    price DECIMAL(12, 2),
    price_negotiable BOOLEAN DEFAULT TRUE,
    currency VARCHAR(3) DEFAULT 'USD',
    accepts_trade BOOLEAN DEFAULT FALSE,
    trade_for JSONB DEFAULT '[]',

    is_auction BOOLEAN DEFAULT FALSE,
    starting_bid DECIMAL(12, 2),
    current_bid DECIMAL(12, 2),
    bid_count INTEGER DEFAULT 0,
    auction_end TIMESTAMPTZ,
    reserve_price DECIMAL(12, 2),

    stock_location_id UUID REFERENCES stock_locations(id),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    coordinates POINT,

    fulfillment_options JSONB DEFAULT '["shipping", "local_pickup"]',
    shipping_cost DECIMAL(10, 2),
    estimated_shipping_days INTEGER,
    local_pickup_available BOOLEAN DEFAULT TRUE,
    emergency_available BOOLEAN DEFAULT FALSE,
    emergency_premium DECIMAL(10, 2),

    images JSONB DEFAULT '[]',
    videos JSONB DEFAULT '[]',

    compatible_equipment JSONB DEFAULT '[]',
    compatible_manufacturers JSONB DEFAULT '[]',

    warranty_days INTEGER DEFAULT 0,
    return_policy TEXT,

    ai_verified_compatibility BOOLEAN DEFAULT FALSE,
    ai_price_assessment JSONB,
    embedding vector(1536),

    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(part_number, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(manufacturer, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(name, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'C')
    ) STORED,

    status VARCHAR(20) DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,

    views_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,
    offer_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_org ON marketplace_listings(organization_id);
CREATE INDEX idx_listings_status ON marketplace_listings(status) WHERE status = 'active';
CREATE INDEX idx_listings_type ON marketplace_listings(listing_type);
CREATE INDEX idx_listings_category ON marketplace_listings(category);
CREATE INDEX idx_listings_manufacturer ON marketplace_listings(manufacturer);
CREATE INDEX idx_listings_location ON marketplace_listings USING GIST(coordinates);
CREATE INDEX idx_listings_search ON marketplace_listings USING GIN(search_vector);
CREATE INDEX idx_listings_embedding ON marketplace_listings USING ivfflat(embedding vector_cosine_ops);
CREATE INDEX idx_listings_price ON marketplace_listings(price) WHERE status = 'active' AND price IS NOT NULL;
CREATE INDEX idx_listings_emergency ON marketplace_listings(emergency_available) WHERE status = 'active' AND emergency_available = TRUE;


-- Part offers
CREATE TABLE part_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id),
    buyer_organization_id UUID NOT NULL REFERENCES organizations(id),

    offer_type VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL,
    offered_price DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',

    trade_items JSONB DEFAULT '[]',

    message TEXT,

    fulfillment_preference VARCHAR(30),
    delivery_address TEXT,
    needed_by_date DATE,
    is_urgent BOOLEAN DEFAULT FALSE,

    status VARCHAR(20) DEFAULT 'pending',
    counter_offer JSONB,

    response_message TEXT,
    responded_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_offers_listing ON part_offers(listing_id);
CREATE INDEX idx_offers_buyer ON part_offers(buyer_id);
CREATE INDEX idx_offers_status ON part_offers(status);


-- Part transactions
CREATE TABLE part_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES marketplace_listings(id),
    offer_id UUID REFERENCES part_offers(id),

    seller_organization_id UUID NOT NULL REFERENCES organizations(id),
    buyer_organization_id UUID NOT NULL REFERENCES organizations(id),

    transaction_type VARCHAR(30) NOT NULL,
    parts JSONB NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',

    trade_parts_received JSONB DEFAULT '[]',
    trade_value_difference DECIMAL(12, 2),

    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_reference VARCHAR(100),

    fulfillment_type VARCHAR(30),
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    pickup_code VARCHAR(20),

    status VARCHAR(20) DEFAULT 'pending',

    seller_rating INTEGER CHECK (seller_rating BETWEEN 1 AND 5),
    seller_review TEXT,
    buyer_rating INTEGER CHECK (buyer_rating BETWEEN 1 AND 5),
    buyer_review TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_transactions_seller ON part_transactions(seller_organization_id);
CREATE INDEX idx_transactions_buyer ON part_transactions(buyer_organization_id);
CREATE INDEX idx_transactions_status ON part_transactions(status);


-- Wanted posts
CREATE TABLE wanted_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    requester_id UUID NOT NULL REFERENCES users(id),

    part_number VARCHAR(100),
    manufacturer VARCHAR(100),
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,

    equipment_type VARCHAR(100),
    equipment_manufacturer VARCHAR(100),
    equipment_model VARCHAR(100),
    equipment_serial VARCHAR(100),
    fault_code VARCHAR(50),

    quantity_needed INTEGER NOT NULL DEFAULT 1,
    acceptable_conditions JSONB NOT NULL,
    needed_by_date DATE,
    urgency VARCHAR(20) DEFAULT 'standard',

    max_price DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',

    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    coordinates POINT,

    visibility VARCHAR(20) DEFAULT 'industry',

    status VARCHAR(20) DEFAULT 'active',
    responses_count INTEGER DEFAULT 0,

    embedding vector(1536),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_wanted_status ON wanted_posts(status) WHERE status = 'active';
CREATE INDEX idx_wanted_category ON wanted_posts(category);
CREATE INDEX idx_wanted_urgency ON wanted_posts(urgency);
CREATE INDEX idx_wanted_location ON wanted_posts USING GIST(coordinates);


-- Auction bids
CREATE TABLE auction_bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    bidder_id UUID NOT NULL REFERENCES users(id),
    bidder_organization_id UUID NOT NULL REFERENCES organizations(id),

    bid_amount DECIMAL(12, 2) NOT NULL,
    max_bid DECIMAL(12, 2),  -- For auto-bidding

    is_winning BOOLEAN DEFAULT FALSE,
    outbid_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT bid_amount_positive CHECK (bid_amount > 0)
);

CREATE INDEX idx_bids_listing ON auction_bids(listing_id);
CREATE INDEX idx_bids_bidder ON auction_bids(bidder_id);


-- Saved listings (watchlist)
CREATE TABLE saved_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    notes TEXT,
    price_alert_threshold DECIMAL(12, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_saved UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_saved_user ON saved_listings(user_id);


-- Seller ratings aggregate
CREATE TABLE seller_ratings (
    organization_id UUID PRIMARY KEY REFERENCES organizations(id),
    total_transactions INTEGER DEFAULT 0,
    total_sales_volume DECIMAL(14, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2),
    rating_count INTEGER DEFAULT 0,
    on_time_shipping_rate DECIMAL(5, 2),
    response_time_hours DECIMAL(6, 2),
    return_rate DECIMAL(5, 2),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);


-- Price history for market intelligence
CREATE TABLE part_price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_number VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    condition VARCHAR(30) NOT NULL,

    price DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    source VARCHAR(50),  -- "listing", "transaction", "supplier"
    source_id UUID,

    region VARCHAR(100),

    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_part ON part_price_history(part_number, manufacturer);
CREATE INDEX idx_price_history_time ON part_price_history(recorded_at);
```

---

## API Design

### Parts Catalog Endpoints

```python
from fastapi import APIRouter, Depends, Query, UploadFile, File
from typing import Annotated

router = APIRouter(prefix="/api/v1/parts", tags=["parts"])


# ============ Parts Catalog ============

@router.get("/catalog/search", response_model=PartSearchResponse)
async def search_parts_catalog(
    q: str | None = Query(None),
    manufacturer: str | None = None,
    category: PartCategory | None = None,
    trade: str | None = None,
    compatible_with: str | None = None,  # Equipment model
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> PartSearchResponse:
    """Search the parts catalog"""
    pass


@router.get("/catalog/{part_id}", response_model=PartDetail)
async def get_part(
    part_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> PartDetail:
    """Get part details including compatibility and alternatives"""
    pass


@router.get("/catalog/lookup", response_model=list[PartMatch])
async def lookup_part(
    part_number: str,
    manufacturer: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[PartMatch]:
    """Look up a part by number with fuzzy matching"""
    pass


@router.post("/catalog/identify", response_model=PartIdentification)
async def identify_part(
    image: UploadFile = File(...),
    context: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> PartIdentification:
    """AI-powered part identification from image"""
    pass


# ============ Inventory Management ============

@router.get("/inventory", response_model=list[InventoryItemResponse])
async def get_inventory(
    location_id: UUID | None = None,
    category: PartCategory | None = None,
    low_stock: bool = False,
    available_for_sale: bool | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[InventoryItemResponse]:
    """Get organization's inventory"""
    pass


@router.post("/inventory", response_model=InventoryItemResponse, status_code=201)
async def add_inventory_item(
    item: InventoryItemCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InventoryItemResponse:
    """Add new inventory item"""
    pass


@router.patch("/inventory/{item_id}", response_model=InventoryItemResponse)
async def update_inventory_item(
    item_id: UUID,
    updates: InventoryItemUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> InventoryItemResponse:
    """Update inventory item"""
    pass


@router.post("/inventory/{item_id}/adjust")
async def adjust_inventory(
    item_id: UUID,
    adjustment: InventoryAdjustment,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Adjust inventory quantity with reason tracking"""
    pass


@router.post("/inventory/transfer")
async def transfer_inventory(
    transfer: InventoryTransfer,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Transfer inventory between locations"""
    pass


@router.get("/inventory/low-stock", response_model=list[LowStockAlert])
async def get_low_stock_alerts(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[LowStockAlert]:
    """Get items below reorder point"""
    pass
```

### Marketplace Endpoints

```python
router_marketplace = APIRouter(prefix="/api/v1/marketplace", tags=["marketplace"])


# ============ Listings ============

@router_marketplace.post("/listings", response_model=ListingResponse, status_code=201)
async def create_listing(
    listing: ListingCreate,
    background_tasks: BackgroundTasks,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ListingResponse:
    """Create a marketplace listing"""
    pass


@router_marketplace.get("/listings", response_model=ListingSearchResponse)
async def search_listings(
    q: str | None = Query(None),
    listing_type: ListingType | None = None,
    category: PartCategory | None = None,
    manufacturer: str | None = None,
    condition: list[PartCondition] | None = Query(None),
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
    near_lat: float | None = None,
    near_lng: float | None = None,
    radius_miles: int = 100,
    emergency_only: bool = False,
    compatible_with: str | None = None,  # Equipment model
    sort_by: str = "relevance",
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ListingSearchResponse:
    """Search marketplace listings"""
    pass


@router_marketplace.get("/listings/{listing_id}", response_model=ListingDetail)
async def get_listing(
    listing_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ListingDetail:
    """Get listing details"""
    pass


@router_marketplace.patch("/listings/{listing_id}", response_model=ListingResponse)
async def update_listing(
    listing_id: UUID,
    updates: ListingUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> ListingResponse:
    """Update a listing"""
    pass


@router_marketplace.post("/listings/{listing_id}/publish")
async def publish_listing(
    listing_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Publish a draft listing"""
    pass


@router_marketplace.delete("/listings/{listing_id}")
async def cancel_listing(
    listing_id: UUID,
    reason: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Cancel a listing"""
    pass


# ============ Offers & Transactions ============

@router_marketplace.post("/listings/{listing_id}/offer", response_model=OfferResponse)
async def make_offer(
    listing_id: UUID,
    offer: OfferCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> OfferResponse:
    """Make an offer on a listing"""
    pass


@router_marketplace.get("/offers/received", response_model=list[OfferSummary])
async def get_received_offers(
    status: OfferStatus | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[OfferSummary]:
    """Get offers received on your listings"""
    pass


@router_marketplace.get("/offers/sent", response_model=list[OfferSummary])
async def get_sent_offers(
    status: OfferStatus | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[OfferSummary]:
    """Get offers you've sent"""
    pass


@router_marketplace.post("/offers/{offer_id}/accept")
async def accept_offer(
    offer_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> TransactionResponse:
    """Accept an offer and create transaction"""
    pass


@router_marketplace.post("/offers/{offer_id}/reject")
async def reject_offer(
    offer_id: UUID,
    message: str | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Reject an offer"""
    pass


@router_marketplace.post("/offers/{offer_id}/counter")
async def counter_offer(
    offer_id: UUID,
    counter: CounterOfferCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> OfferResponse:
    """Counter an offer"""
    pass


# ============ Transactions ============

@router_marketplace.get("/transactions", response_model=list[TransactionSummary])
async def get_transactions(
    role: str = Query("all"),  # "buyer", "seller", "all"
    status: str | None = None,
    page: int = 1,
    page_size: int = 20,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[TransactionSummary]:
    """Get transactions"""
    pass


@router_marketplace.get("/transactions/{transaction_id}", response_model=TransactionDetail)
async def get_transaction(
    transaction_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> TransactionDetail:
    """Get transaction details"""
    pass


@router_marketplace.post("/transactions/{transaction_id}/ship")
async def mark_shipped(
    transaction_id: UUID,
    shipping: ShippingInfo,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Mark transaction as shipped with tracking"""
    pass


@router_marketplace.post("/transactions/{transaction_id}/delivered")
async def confirm_delivery(
    transaction_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Confirm delivery received"""
    pass


@router_marketplace.post("/transactions/{transaction_id}/review")
async def submit_review(
    transaction_id: UUID,
    review: ReviewCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Submit a transaction review"""
    pass


# ============ Wanted Posts ============

@router_marketplace.post("/wanted", response_model=WantedPostResponse, status_code=201)
async def create_wanted_post(
    wanted: WantedPostCreate,
    background_tasks: BackgroundTasks,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> WantedPostResponse:
    """Create a wanted post"""
    pass


@router_marketplace.get("/wanted", response_model=list[WantedPostSummary])
async def get_wanted_posts(
    category: PartCategory | None = None,
    urgency: str | None = None,
    near_lat: float | None = None,
    near_lng: float | None = None,
    radius_miles: int = 200,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[WantedPostSummary]:
    """Get wanted posts matching your inventory"""
    pass


@router_marketplace.post("/wanted/{wanted_id}/respond")
async def respond_to_wanted(
    wanted_id: UUID,
    response: WantedResponseCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Respond to a wanted post with your offer"""
    pass


# ============ Auctions ============

@router_marketplace.post("/listings/{listing_id}/bid", response_model=BidResponse)
async def place_bid(
    listing_id: UUID,
    bid: BidCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> BidResponse:
    """Place a bid on an auction"""
    pass


@router_marketplace.get("/listings/{listing_id}/bids", response_model=list[BidSummary])
async def get_auction_bids(
    listing_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[BidSummary]:
    """Get bid history for an auction"""
    pass


# ============ Watchlist ============

@router_marketplace.post("/listings/{listing_id}/watch")
async def watch_listing(
    listing_id: UUID,
    price_alert: Decimal | None = None,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Add listing to watchlist"""
    pass


@router_marketplace.delete("/listings/{listing_id}/watch")
async def unwatch_listing(
    listing_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> dict:
    """Remove from watchlist"""
    pass


@router_marketplace.get("/watchlist", response_model=list[WatchedListing])
async def get_watchlist(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
) -> list[WatchedListing]:
    """Get user's watchlist"""
    pass
```

---

## AI-Powered Features

### Part Compatibility Service

```python
class PartCompatibilityService:
    """AI-powered part compatibility verification"""

    async def verify_compatibility(
        self,
        part: Part,
        equipment_id: UUID
    ) -> CompatibilityResult:
        """Verify if a part is compatible with equipment"""

        equipment = await self._get_equipment(equipment_id)

        # Check direct compatibility list
        if equipment.model in part.compatible_equipment:
            return CompatibilityResult(
                compatible=True,
                confidence=0.95,
                source="catalog",
                notes=["Direct match found in compatibility list"]
            )

        # Check supersession chain
        supersession = await self._check_supersession(part, equipment)
        if supersession:
            return supersession

        # AI-powered compatibility check
        return await self._ai_compatibility_check(part, equipment)

    async def _ai_compatibility_check(
        self,
        part: Part,
        equipment: Equipment
    ) -> CompatibilityResult:
        """Use AI to analyze compatibility"""

        prompt = f"""Analyze if this part is compatible with this equipment:

PART:
- Number: {part.part_number}
- Manufacturer: {part.manufacturer}
- Name: {part.name}
- Specifications: {json.dumps(part.specifications)}
- Compatible equipment: {part.compatible_equipment}

EQUIPMENT:
- Type: {equipment.equipment_type}
- Manufacturer: {equipment.manufacturer}
- Model: {equipment.model}
- Year: {equipment.year_installed}
- Controller: {equipment.controller_type}
- Specifications: {json.dumps(equipment.specifications)}

Respond in JSON:
{{
    "compatible": true/false,
    "confidence": 0.0-1.0,
    "reasoning": "explanation",
    "warnings": ["any compatibility warnings"],
    "alternatives": ["suggested alternative part numbers if not compatible"]
}}"""

        response = await self.anthropic.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )

        result = json.loads(response.content[0].text)

        return CompatibilityResult(
            compatible=result["compatible"],
            confidence=result["confidence"],
            source="ai",
            reasoning=result["reasoning"],
            warnings=result.get("warnings", []),
            alternatives=result.get("alternatives", [])
        )

    async def find_compatible_parts(
        self,
        equipment_id: UUID,
        part_category: PartCategory
    ) -> list[CompatiblePart]:
        """Find all compatible parts for equipment in a category"""

        equipment = await self._get_equipment(equipment_id)

        # Search for parts by manufacturer and equipment
        query = """
            SELECT p.*,
                CASE
                    WHEN $1 = ANY(p.compatible_equipment) THEN 1.0
                    WHEN $2 = ANY(p.compatible_manufacturers) THEN 0.8
                    ELSE 0.5
                END as base_score
            FROM parts_catalog p
            WHERE p.category = $3
            AND (
                $1 = ANY(p.compatible_equipment)
                OR $2 = ANY(p.compatible_manufacturers)
                OR p.manufacturer = $2
            )
            ORDER BY base_score DESC
            LIMIT 50
        """

        parts = await self.db.execute(
            query,
            [equipment.model, equipment.manufacturer, part_category]
        )

        # Verify each part
        results = []
        for part in parts:
            compat = await self.verify_compatibility(part, equipment_id)
            if compat.compatible or compat.confidence > 0.7:
                results.append(CompatiblePart(
                    part=part,
                    compatibility=compat
                ))

        return results


class PartIdentificationService:
    """AI-powered part identification from images"""

    async def identify_part(
        self,
        image_data: bytes,
        context: str | None = None
    ) -> PartIdentification:
        """Identify a part from an image"""

        # Encode image for API
        image_base64 = base64.b64encode(image_data).decode()

        prompt = f"""Identify this part from the image.
{f"Context: {context}" if context else ""}

Provide identification in JSON:
{{
    "part_type": "type of part",
    "manufacturer": "identified manufacturer or null",
    "model_number": "visible model/part number or null",
    "description": "detailed description",
    "condition_estimate": "new/used_excellent/used_good/used_fair",
    "visible_markings": ["any visible text, labels, or markings"],
    "confidence": 0.0-1.0,
    "notes": ["additional observations"]
}}"""

        response = await self.anthropic.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": image_base64}},
                    {"type": "text", "text": prompt}
                ]
            }]
        )

        result = json.loads(response.content[0].text)

        # Search for matching parts in catalog
        matches = await self._search_catalog_matches(result)

        return PartIdentification(
            **result,
            catalog_matches=matches
        )
```

### Pricing Intelligence Service

```python
class PricingIntelligenceService:
    """Market pricing and fair value assessment"""

    async def assess_price(
        self,
        listing: MarketplaceListing
    ) -> PriceAssessment:
        """Assess if a listing price is fair"""

        # Get historical pricing data
        history = await self._get_price_history(
            listing.part_number,
            listing.manufacturer,
            listing.condition
        )

        # Get current market listings
        current_listings = await self._get_comparable_listings(listing)

        # Calculate statistics
        if history:
            avg_price = sum(h.price for h in history) / len(history)
            price_range = (
                min(h.price for h in history),
                max(h.price for h in history)
            )
        else:
            avg_price = None
            price_range = None

        # Determine assessment
        if listing.price and avg_price:
            price_ratio = listing.price / avg_price
            if price_ratio < 0.7:
                assessment = "below_market"
                assessment_label = "Great Deal"
            elif price_ratio < 0.9:
                assessment = "competitive"
                assessment_label = "Good Price"
            elif price_ratio < 1.1:
                assessment = "fair"
                assessment_label = "Fair Price"
            elif price_ratio < 1.3:
                assessment = "above_market"
                assessment_label = "Above Average"
            else:
                assessment = "high"
                assessment_label = "High Price"
        else:
            assessment = "unknown"
            assessment_label = "Price Not Evaluated"

        return PriceAssessment(
            listing_price=listing.price,
            assessment=assessment,
            assessment_label=assessment_label,
            average_market_price=avg_price,
            price_range=price_range,
            sample_size=len(history),
            comparable_listings=[
                ComparableListing(
                    id=l.id,
                    price=l.price,
                    condition=l.condition,
                    location=f"{l.city}, {l.state_province}"
                )
                for l in current_listings[:5]
            ],
            price_trend=await self._calculate_trend(history)
        )

    async def suggest_price(
        self,
        part_number: str,
        manufacturer: str,
        condition: PartCondition
    ) -> PriceSuggestion:
        """Suggest a price for a part"""

        history = await self._get_price_history(part_number, manufacturer, condition)

        if not history:
            # Try to estimate from similar parts
            similar = await self._find_similar_parts(part_number, manufacturer)
            if similar:
                base_price = await self._estimate_from_similar(similar, condition)
            else:
                return PriceSuggestion(
                    suggested_price=None,
                    confidence="low",
                    reasoning="Insufficient market data for this part"
                )
        else:
            # Calculate suggested price from history
            recent = [h for h in history if h.recorded_at > datetime.now() - timedelta(days=90)]
            if recent:
                base_price = sum(h.price for h in recent) / len(recent)
            else:
                base_price = sum(h.price for h in history) / len(history)

        # Adjust for condition
        condition_multipliers = {
            PartCondition.NEW: 1.0,
            PartCondition.REFURBISHED: 0.75,
            PartCondition.USED_EXCELLENT: 0.65,
            PartCondition.USED_GOOD: 0.50,
            PartCondition.USED_FAIR: 0.35,
            PartCondition.SALVAGE: 0.20,
        }

        suggested = base_price * condition_multipliers.get(condition, 0.5)

        return PriceSuggestion(
            suggested_price=round(suggested, 2),
            price_range=(round(suggested * 0.85, 2), round(suggested * 1.15, 2)),
            confidence="high" if len(history) > 10 else "medium" if len(history) > 3 else "low",
            based_on_samples=len(history),
            reasoning=f"Based on {len(history)} historical transactions for this part"
        )

    async def get_market_insights(
        self,
        category: PartCategory,
        manufacturer: str | None = None
    ) -> MarketInsights:
        """Get market insights for a category"""

        query = """
            WITH recent_data AS (
                SELECT
                    part_number,
                    manufacturer,
                    condition,
                    price,
                    recorded_at
                FROM part_price_history
                WHERE recorded_at > NOW() - INTERVAL '90 days'
                AND ($1::text IS NULL OR manufacturer = $1)
                -- Filter by category would require join to parts_catalog
            )
            SELECT
                COUNT(*) as transaction_count,
                AVG(price) as avg_price,
                MIN(price) as min_price,
                MAX(price) as max_price,
                COUNT(DISTINCT part_number) as unique_parts
            FROM recent_data
        """

        stats = await self.db.execute(query, [manufacturer])

        # Get trending parts
        trending = await self._get_trending_parts(category, manufacturer)

        # Get price trends
        price_trend = await self._get_category_price_trend(category)

        return MarketInsights(
            category=category,
            manufacturer=manufacturer,
            transaction_count=stats.transaction_count,
            average_price=stats.avg_price,
            price_range=(stats.min_price, stats.max_price),
            unique_parts_traded=stats.unique_parts,
            trending_parts=trending,
            price_trend=price_trend,
            demand_level=self._calculate_demand(stats)
        )
```

### Part Sourcing Assistant

```python
class PartSourcingAssistant:
    """AI assistant for finding parts"""

    async def find_part(
        self,
        request: PartRequest,
        user_organization_id: UUID
    ) -> SourcingResult:
        """Find a part across all channels"""

        results = SourcingResult(
            request=request,
            sources=[],
            recommended_action=None
        )

        # 1. Check internal inventory first
        internal = await self._check_internal_inventory(
            user_organization_id,
            request.part_number,
            request.manufacturer
        )
        if internal:
            results.sources.append(SourceOption(
                source_type="internal",
                items=internal,
                estimated_cost=Decimal(0),
                availability="immediate"
            ))

        # 2. Check network partners
        network = await self._check_network_inventory(
            user_organization_id,
            request
        )
        if network:
            results.sources.append(SourceOption(
                source_type="network",
                items=network,
                availability="1-2 days"
            ))

        # 3. Search marketplace
        marketplace = await self._search_marketplace(request)
        if marketplace:
            results.sources.append(SourceOption(
                source_type="marketplace",
                items=marketplace,
                availability="varies"
            ))

        # 4. Check authorized suppliers
        suppliers = await self._check_suppliers(request)
        if suppliers:
            results.sources.append(SourceOption(
                source_type="supplier",
                items=suppliers,
                availability="standard lead time"
            ))

        # 5. Check for alternatives if nothing found
        if not any(s.items for s in results.sources):
            alternatives = await self._find_alternatives(request)
            results.alternatives = alternatives

        # Determine recommended action
        results.recommended_action = self._determine_recommendation(
            results,
            request.urgency
        )

        return results

    async def process_natural_query(
        self,
        query: str,
        user_id: UUID
    ) -> PartQueryResult:
        """Process natural language part query"""

        # Use AI to parse the query
        prompt = f"""Parse this part request into structured data:

Query: "{query}"

Extract:
{{
    "part_number": "if mentioned",
    "manufacturer": "if mentioned",
    "part_type": "type of part needed",
    "equipment_context": {{
        "type": "elevator/hvac/etc",
        "manufacturer": "if mentioned",
        "model": "if mentioned"
    }},
    "problem_description": "what issue they're trying to solve",
    "urgency": "emergency/urgent/standard",
    "quantity": 1
}}"""

        response = await self.anthropic.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}]
        )

        parsed = json.loads(response.content[0].text)

        # If no part number, try to identify needed part
        if not parsed.get("part_number") and parsed.get("problem_description"):
            part_suggestion = await self._suggest_part_for_problem(
                parsed["problem_description"],
                parsed.get("equipment_context")
            )
            parsed["suggested_parts"] = part_suggestion

        # Create and execute request
        request = PartRequest(**parsed)
        return await self.find_part(request, await self._get_user_org(user_id))
```

---

## Frontend Components

### Marketplace Search

```tsx
// components/marketplace/MarketplaceSearch.tsx
export function MarketplaceSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<MarketplaceFilters>({
    listingType: null,
    category: null,
    manufacturers: [],
    conditions: [],
    priceRange: { min: null, max: null },
    location: null,
    radius: 100,
    emergencyOnly: false,
  });

  return (
    <div className="space-y-4">
      {/* Natural Language Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Describe what you need... e.g., 'Otis door operator for Gen2'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-20 py-3 border rounded-lg"
        />
        <button className="absolute right-2 top-2 px-4 py-1 bg-blue-600 text-white rounded">
          Search
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <ListingTypeFilter value={filters.listingType} onChange={(v) => setFilters({...filters, listingType: v})} />
        <CategoryFilter value={filters.category} onChange={(v) => setFilters({...filters, category: v})} />
        <ManufacturerFilter values={filters.manufacturers} onChange={(v) => setFilters({...filters, manufacturers: v})} />
        <ConditionFilter values={filters.conditions} onChange={(v) => setFilters({...filters, conditions: v})} />
        <PriceRangeFilter range={filters.priceRange} onChange={(v) => setFilters({...filters, priceRange: v})} />
        <LocationFilter location={filters.location} radius={filters.radius}
          onChange={(l, r) => setFilters({...filters, location: l, radius: r})} />
        <Toggle label="Emergency Available" checked={filters.emergencyOnly}
          onChange={(v) => setFilters({...filters, emergencyOnly: v})} />
      </div>
    </div>
  );
}


// components/marketplace/ListingCard.tsx
interface ListingCardProps {
  listing: MarketplaceListing;
  priceAssessment?: PriceAssessment;
}

export function ListingCard({ listing, priceAssessment }: ListingCardProps) {
  return (
    <div className="bg-white rounded-lg border hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        {listing.images[0] ? (
          <img src={listing.images[0]} alt={listing.name} className="w-full h-full object-cover rounded-t-lg" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg">
            <CubeIcon className="h-16 w-16 text-gray-300" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {listing.emergency_available && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
              ⚡ Emergency
            </span>
          )}
          {listing.is_auction && (
            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded">
              🔨 Auction
            </span>
          )}
          {listing.accepts_trade && (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
              🔄 Trade
            </span>
          )}
        </div>

        {/* Condition Badge */}
        <div className="absolute top-2 right-2">
          <ConditionBadge condition={listing.condition} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.name}</h3>
            <p className="text-sm text-gray-600">{listing.manufacturer}</p>
            <p className="text-xs text-gray-500">Part #: {listing.part_number}</p>
          </div>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            {listing.is_auction ? (
              <div>
                <p className="text-lg font-bold text-purple-600">
                  ${listing.current_bid || listing.starting_bid}
                </p>
                <p className="text-xs text-gray-500">{listing.bid_count} bids</p>
              </div>
            ) : (
              <p className="text-lg font-bold text-green-600">
                {listing.price ? `$${listing.price}` : 'Make Offer'}
              </p>
            )}
          </div>

          {/* Price Assessment */}
          {priceAssessment && (
            <PriceAssessmentBadge assessment={priceAssessment} />
          )}
        </div>

        {/* Location & Availability */}
        <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            {listing.city}, {listing.state_province}
          </span>
          <span>Qty: {listing.quantity_available}</span>
        </div>

        {/* Fulfillment Options */}
        <div className="mt-3 flex flex-wrap gap-1">
          {listing.local_pickup_available && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Pickup</span>
          )}
          {listing.fulfillment_options.includes('shipping') && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Shipping</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {listing.is_auction ? 'Place Bid' : 'Make Offer'}
          </button>
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <HeartIcon className="h-5 w-5 text-gray-400" />
          </button>
          <button className="p-2 border rounded-lg hover:bg-gray-50">
            <ChatBubbleIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}


// components/marketplace/InventoryManager.tsx
export function InventoryManager() {
  const [selectedLocation, setSelectedLocation] = useState<UUID | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);

  const { data: inventory, isLoading } = useInventory({ locationId: selectedLocation });
  const { data: locations } = useStockLocations();
  const { data: lowStock } = useLowStockAlerts();

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      {lowStock && lowStock.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <ExclamationIcon className="h-5 w-5 text-yellow-400 mr-2" />
            <h3 className="font-medium text-yellow-800">
              {lowStock.length} items below reorder point
            </h3>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {lowStock.slice(0, 5).map(item => (
              <span key={item.id} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                {item.part_number} ({item.quantity_available} left)
              </span>
            ))}
            {lowStock.length > 5 && (
              <span className="text-yellow-600 text-sm">+{lowStock.length - 5} more</span>
            )}
          </div>
        </div>
      )}

      {/* Location Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={selectedLocation || 'all'}
            onChange={(e) => setSelectedLocation(e.target.value === 'all' ? null : e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Locations</option>
            {locations?.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} {loc.is_mobile && '🚚'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowAddItem(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            + Add Item
          </button>
          <button className="px-4 py-2 border rounded-lg">
            Import CSV
          </button>
          <button className="px-4 py-2 border rounded-lg">
            Export
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Part</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Location</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">On Hand</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Reserved</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Available</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Condition</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Value</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">For Sale</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {inventory?.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.manufacturer} - {item.part_number}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{item.stock_location_name}</span>
                  {item.bin_location && <span className="text-xs text-gray-400 ml-1">({item.bin_location})</span>}
                </td>
                <td className="px-4 py-3 text-center font-medium">{item.quantity_on_hand}</td>
                <td className="px-4 py-3 text-center text-gray-500">{item.quantity_reserved}</td>
                <td className="px-4 py-3 text-center">
                  <span className={item.quantity_available <= (item.reorder_point || 0) ? 'text-red-600 font-medium' : ''}>
                    {item.quantity_available}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ConditionBadge condition={item.condition} size="sm" />
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  ${item.current_value?.toFixed(2) || '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <Toggle
                    checked={item.available_for_sale}
                    onChange={(v) => updateItem(item.id, { available_for_sale: v })}
                  />
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownItem onClick={() => editItem(item)}>Edit</DropdownItem>
                    <DropdownItem onClick={() => adjustQuantity(item)}>Adjust Qty</DropdownItem>
                    <DropdownItem onClick={() => transferItem(item)}>Transfer</DropdownItem>
                    <DropdownItem onClick={() => createListing(item)}>List for Sale</DropdownItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## Implementation Timeline

### Week 1-2: Core Infrastructure
- [ ] Parts catalog database schema
- [ ] Inventory management CRUD
- [ ] Stock location management
- [ ] Basic part search

### Week 3-4: Marketplace Listings
- [ ] Listing creation and management
- [ ] Listing search with filters
- [ ] Image upload and storage
- [ ] Visibility and access control

### Week 5-6: Offers & Transactions
- [ ] Offer submission and management
- [ ] Counter-offer workflow
- [ ] Transaction creation and tracking
- [ ] Payment integration (Stripe)

### Week 7-8: AI Features
- [ ] Part compatibility verification
- [ ] Price intelligence and assessment
- [ ] Part identification from images
- [ ] Natural language part search

### Week 9-10: Advanced Features
- [ ] Auction functionality
- [ ] Wanted posts and matching
- [ ] Trade workflow
- [ ] Emergency parts system

### Week 11-12: Polish & Integration
- [ ] Seller ratings and reviews
- [ ] Notification system
- [ ] Mobile responsiveness
- [ ] Analytics dashboard

---

## Success Metrics

### Marketplace Activity
- Active listings count
- Transaction volume (count and value)
- Average time to sale
- Listing-to-transaction conversion rate

### User Engagement
- Monthly active buyers/sellers
- Return user rate
- Watchlist additions
- Offer response rate

### AI Effectiveness
- Compatibility verification accuracy
- Price suggestion adoption rate
- Part identification success rate
- Natural language query resolution

### Inventory Efficiency
- Inventory turnover rate
- Parts sourced internally vs. external
- Emergency fulfillment success rate
- Lead time reduction

---

## Security & Trust

### Seller Verification
- Business registration verification
- Insurance requirement verification
- Trade license verification
- Transaction history display

### Buyer Protection
- Dispute resolution process
- Return/refund policies
- Payment escrow option
- Fraud detection

### Part Authenticity
- OEM vs aftermarket labeling
- Counterfeit detection
- Serial number verification
- Condition verification photos
