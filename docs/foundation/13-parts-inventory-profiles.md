# SiteSync V3 - Parts & Inventory Profiles

> **Parts/Inventory Data Model** - Complete specification for parts catalog and inventory management.

---

## What is a Part/Inventory Item?

A **Part** (Inventory Item) represents a physical component that can be used in equipment maintenance and repair. Parts:

- Belong to one Organization (multi-tenant isolation)
- Have a master catalog entry defining specifications
- Track stock levels across multiple locations
- Link to work orders when used in repairs
- Support compatibility mapping to equipment types
- Enable cost tracking and reorder automation

---

## Part Categories

### Primary Categories

| Category | Code | Description | Examples |
|----------|------|-------------|----------|
| **Door Parts** | `door_parts` | Door operators, guides, sensors | Door operator, Gibs, Light curtain |
| **Drive Parts** | `drive_parts` | Motors, drives, controllers | Motor, VFD, Sheave |
| **Safety Parts** | `safety_parts` | Safety devices and components | Governor, Safety gear, Buffers |
| **Control Parts** | `control_parts` | Controllers, boards, processors | Main board, Display, Keypad |
| **Electrical Parts** | `electrical_parts` | Wiring, connections, power | Contactor, Relay, Fuse |
| **Mechanical Parts** | `mechanical_parts` | Bearings, guides, rails | Roller guide, Rail clips, Bearings |
| **Consumables** | `consumables` | Items used up in service | Oil, Lubricant, Cleaning supplies |
| **Hardware** | `hardware` | Fasteners, brackets, mounts | Bolts, Nuts, Brackets |
| **Signage** | `signage` | Labels, plates, indicators | Floor indicators, Certificates |

### Subcategories

```json
{
  "door_parts": [
    "door_operators",
    "door_guides",
    "door_panels",
    "door_sensors",
    "door_locks",
    "interlocks"
  ],
  "drive_parts": [
    "motors",
    "drives",
    "sheaves",
    "ropes",
    "belts",
    "brakes"
  ],
  "safety_parts": [
    "governors",
    "safety_gears",
    "buffers",
    "overspeed_devices",
    "limit_switches"
  ],
  "control_parts": [
    "main_boards",
    "display_boards",
    "communication_boards",
    "encoders",
    "sensors"
  ]
}
```

---

## Part Status Types

| Status | Code | Description | Available for Use |
|--------|------|-------------|-------------------|
| **Active** | `active` | Currently available | Yes |
| **Inactive** | `inactive` | No longer stocked | No |
| **Discontinued** | `discontinued` | Manufacturer discontinued | No (existing stock only) |
| **Pending** | `pending` | Awaiting approval | No |
| **On Order** | `on_order` | Ordered from supplier | No |

---

## Profile Field Reference

### Required Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `organization_id` | UUID | FK, NOT NULL | Parent organization |
| `part_number` | VARCHAR(100) | NOT NULL, UNIQUE per org | SKU/Part number |
| `name` | VARCHAR(255) | NOT NULL | Display name |

### Identity Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | UUID | Auto | Primary key | UUID |
| `organization_id` | UUID | Yes | Parent organization | UUID |
| `part_number` | VARCHAR(100) | Yes | Internal SKU | "DOO-001-KONE" |
| `name` | VARCHAR(255) | Yes | Display name | "Door Operator Assembly" |
| `description` | TEXT | No | Detailed description | "Complete door operator..." |
| `barcode` | VARCHAR(100) | No | Barcode/QR code | "8806084947123" |
| `upc` | VARCHAR(50) | No | Universal Product Code | "012345678901" |

### Classification Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `category` | VARCHAR(100) | Recommended | Primary category | "door_parts" |
| `subcategory` | VARCHAR(100) | No | Sub-classification | "door_operators" |
| `part_type` | VARCHAR(50) | No | Part type | "replacement" |
| `criticality` | VARCHAR(50) | No | Importance level | "critical" |

### Part Types

| Type | Code | Description |
|------|------|-------------|
| **Replacement** | `replacement` | Standard replacement part |
| **Repair Kit** | `repair_kit` | Kit with multiple components |
| **Assembly** | `assembly` | Pre-assembled component |
| **Consumable** | `consumable` | Used up in service |
| **Tool** | `tool` | Service tool (reusable) |

### Criticality Levels

| Level | Code | Description | Stock Priority |
|-------|------|-------------|----------------|
| **Critical** | `critical` | Equipment won't run without | Always in stock |
| **High** | `high` | Causes degraded service | Maintain minimum |
| **Medium** | `medium` | Standard wear item | Reorder at threshold |
| **Low** | `low` | Cosmetic or optional | Order as needed |

### Manufacturer Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `manufacturer` | VARCHAR(100) | Recommended | Part manufacturer | "KONE" |
| `manufacturer_part_number` | VARCHAR(100) | Recommended | OEM part number | "KM903370G01" |
| `brand` | VARCHAR(100) | No | Brand name | "EcoDisc" |

### Compatibility Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `compatible_manufacturers` | TEXT[] | Recommended | Works with manufacturers | `["KONE", "Otis"]` |
| `compatible_models` | TEXT[] | Recommended | Works with models | `["MonoSpace 500", "3000"]` |
| `compatible_equipment_types` | TEXT[] | No | Equipment types | `["elevator", "escalator"]` |
| `supersedes` | VARCHAR(100) | No | Replaces old part | "DOO-001-OLD" |
| `superseded_by` | VARCHAR(100) | No | Replaced by new part | "DOO-001-V2" |

### Pricing Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `unit_cost` | DECIMAL(10,2) | Recommended | Purchase cost | 450.00 |
| `sale_price` | DECIMAL(10,2) | No | Customer price | 675.00 |
| `list_price` | DECIMAL(10,2) | No | MSRP | 750.00 |
| `markup_percentage` | DECIMAL(5,2) | No | Default markup | 50.00 |
| `currency` | VARCHAR(3) | No | Currency code | "AUD" |
| `tax_class` | VARCHAR(50) | No | Tax category | "standard" |

### Stock Management Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `minimum_stock` | INTEGER | No | Minimum to keep | 2 |
| `reorder_point` | INTEGER | No | Trigger reorder at | 3 |
| `reorder_quantity` | INTEGER | No | Amount to order | 5 |
| `lead_time_days` | INTEGER | No | Supplier lead time | 14 |
| `unit_of_measure` | VARCHAR(20) | No | UOM | "each" |
| `pack_size` | INTEGER | No | Units per pack | 1 |

### Computed Stock Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `total_on_hand` | INTEGER | Total across locations | 15 |
| `total_reserved` | INTEGER | Reserved for jobs | 3 |
| `total_available` | INTEGER | Available to use | 12 |
| `total_on_order` | INTEGER | On order from supplier | 5 |

### Physical Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `weight_kg` | DECIMAL(10,3) | No | Weight in kg | 2.500 |
| `length_mm` | INTEGER | No | Length in mm | 450 |
| `width_mm` | INTEGER | No | Width in mm | 300 |
| `height_mm` | INTEGER | No | Height in mm | 150 |
| `is_hazardous` | BOOLEAN | No | Hazardous material | false |
| `storage_requirements` | VARCHAR(255) | No | Storage notes | "Store in dry area" |

### Warranty Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `warranty_months` | INTEGER | No | Warranty period | 12 |
| `warranty_type` | VARCHAR(50) | No | Warranty type | "manufacturer" |
| `warranty_terms` | TEXT | No | Terms/conditions | "Parts only, labor..." |

### Supplier Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `primary_supplier_id` | UUID | No | Default supplier | UUID |
| `supplier_part_number` | VARCHAR(100) | No | Supplier's SKU | "SUP-KM903370G01" |
| `supplier_name` | VARCHAR(255) | No | Supplier name | "KONE Spares Australia" |

### Flexible Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `specifications` | JSONB | No | Technical specs |
| `metadata` | JSONB | No | Additional data |
| `custom_fields` | JSONB | No | Org-defined fields |
| `images` | TEXT[] | No | Image URLs |

### System Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | VARCHAR(50) | No (default) | Part status |
| `created_at` | TIMESTAMPTZ | Auto | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Auto | Last update |
| `deleted_at` | TIMESTAMPTZ | No | Soft delete |

---

## Stock Location Types

Stock is tracked separately by location. Each part can exist in multiple locations.

### Location Types

| Type | Code | Description | Typical Use |
|------|------|-------------|-------------|
| **Warehouse** | `warehouse` | Central warehouse | Main inventory storage |
| **Van Stock** | `van` | Technician vehicle | Mobile inventory |
| **Site Stock** | `site` | Building location | Onsite consignment |
| **Consignment** | `consignment` | Third-party held | Supplier-owned stock |
| **In Transit** | `in_transit` | Being transferred | Moving between locations |

### Stock Location Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | UUID | Auto | Primary key | UUID |
| `organization_id` | UUID | Yes | Parent organization | UUID |
| `inventory_item_id` | UUID | Yes | Part reference | UUID |
| `location_type` | VARCHAR(50) | Yes | Location type | "van" |
| `location_name` | VARCHAR(255) | Yes | Location identifier | "Van #12 - Smith" |
| `contractor_id` | UUID | Conditional | If van stock | UUID |
| `site_id` | UUID | Conditional | If site stock | UUID |
| `quantity_on_hand` | INTEGER | Yes | Physical count | 5 |
| `quantity_reserved` | INTEGER | No | Reserved for jobs | 1 |
| `quantity_available` | INTEGER | Computed | Available | 4 |
| `minimum_stock` | INTEGER | No | Location minimum | 2 |
| `reorder_point` | INTEGER | No | Location reorder | 3 |
| `bin_location` | VARCHAR(100) | No | Physical location | "A-12-3" |
| `last_count_date` | DATE | No | Last physical count | "2024-12-01" |
| `last_count_quantity` | INTEGER | No | Count result | 5 |

---

## Stock Transactions

Every stock movement is recorded for audit and traceability.

### Transaction Types

| Type | Code | Description |
|------|------|-------------|
| **Receipt** | `receipt` | Received from supplier |
| **Issue** | `issue` | Issued to work order |
| **Transfer** | `transfer` | Moved between locations |
| **Adjustment** | `adjustment` | Inventory correction |
| **Return** | `return` | Returned from work order |
| **Write-off** | `write_off` | Damaged/obsolete |
| **Reserve** | `reserve` | Reserved for job |
| **Unreserve** | `unreserve` | Reservation released |

### Transaction Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Auto | Primary key |
| `organization_id` | UUID | Yes | Parent organization |
| `inventory_item_id` | UUID | Yes | Part reference |
| `transaction_type` | VARCHAR(50) | Yes | Transaction type |
| `quantity` | INTEGER | Yes | Quantity (signed) |
| `from_location_id` | UUID | Conditional | Source location |
| `to_location_id` | UUID | Conditional | Destination location |
| `work_order_id` | UUID | Conditional | Related work order |
| `unit_cost` | DECIMAL(10,2) | No | Cost at time |
| `reference` | VARCHAR(100) | No | Reference number |
| `notes` | TEXT | No | Transaction notes |
| `created_by` | UUID | Yes | Who performed |
| `created_at` | TIMESTAMPTZ | Auto | When performed |

---

## Usage on Work Orders

When parts are used on a work order, they're tracked in `work_order_parts`.

### Part Usage Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | UUID | Auto | Primary key | UUID |
| `work_order_id` | UUID | Yes | Parent work order | UUID |
| `inventory_item_id` | UUID | Conditional | From inventory | UUID |
| `part_number` | VARCHAR(100) | Yes | Part identifier | "DOO-001-KONE" |
| `part_name` | VARCHAR(255) | Yes | Part name | "Door Operator" |
| `manufacturer` | VARCHAR(100) | No | Manufacturer | "KONE" |
| `quantity` | INTEGER | Yes | Quantity used | 1 |
| `unit_cost` | DECIMAL(10,2) | No | Cost per unit | 450.00 |
| `total_cost` | DECIMAL(10,2) | No | Total cost | 450.00 |
| `source` | VARCHAR(50) | No | Part source | "inventory" |
| `serial_number` | VARCHAR(100) | No | If serialized | "SN-12345" |
| `warranty_claim` | BOOLEAN | No | Under warranty | false |
| `notes` | TEXT | No | Usage notes | "Replaced due to..." |

### Part Sources

| Source | Code | Description |
|--------|------|-------------|
| **Inventory** | `inventory` | From organization stock |
| **Purchased** | `purchased` | Bought for this job |
| **Customer Supplied** | `customer_supplied` | Provided by customer |
| **Warranty** | `warranty` | Warranty replacement |
| **Consignment** | `consignment` | From consignment stock |

---

## Supplier Management

Suppliers provide parts and can be linked to inventory items.

### Supplier Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | UUID | Auto | Primary key | UUID |
| `organization_id` | UUID | Yes | Parent organization | UUID |
| `name` | VARCHAR(255) | Yes | Supplier name | "KONE Spares Australia" |
| `code` | VARCHAR(50) | No | Supplier code | "KONE-AU" |
| `contact_name` | VARCHAR(255) | No | Primary contact | "John Smith" |
| `email` | VARCHAR(255) | No | Contact email | "john@konespa..." |
| `phone` | VARCHAR(50) | No | Contact phone | "+61 2 9999 0000" |
| `website` | VARCHAR(255) | No | Website | "https://kone..." |
| `address` | JSONB | No | Address details | {...} |
| `payment_terms` | VARCHAR(50) | No | Payment terms | "Net 30" |
| `lead_time_days` | INTEGER | No | Default lead time | 7 |
| `minimum_order` | DECIMAL(10,2) | No | Minimum order value | 100.00 |
| `is_active` | BOOLEAN | No | Active supplier | true |
| `is_preferred` | BOOLEAN | No | Preferred supplier | true |
| `rating` | DECIMAL(3,2) | No | Supplier rating | 4.50 |
| `notes` | TEXT | No | Notes | "..." |

### Supplier Item Links

Parts can have multiple suppliers with specific pricing:

| Field | Type | Description |
|-------|------|-------------|
| `supplier_id` | UUID | Supplier reference |
| `inventory_item_id` | UUID | Part reference |
| `supplier_part_number` | VARCHAR(100) | Supplier's SKU |
| `unit_cost` | DECIMAL(10,2) | Supplier price |
| `lead_time_days` | INTEGER | Supplier lead time |
| `minimum_quantity` | INTEGER | Min order qty |
| `is_preferred` | BOOLEAN | Preferred supplier for this part |

---

## Reorder Rules & Automation

### Reorder Logic

```
IF quantity_available <= reorder_point
   AND total_on_order = 0
   AND status = 'active'
THEN trigger_reorder_alert()
```

### Reorder Alert Contents

```json
{
  "type": "reorder_alert",
  "part": {
    "id": "uuid",
    "part_number": "DOO-001-KONE",
    "name": "Door Operator Assembly",
    "current_stock": 2,
    "reorder_point": 3,
    "suggested_quantity": 5
  },
  "supplier": {
    "id": "uuid",
    "name": "KONE Spares Australia",
    "estimated_cost": 2250.00,
    "lead_time_days": 7
  },
  "locations_affected": [
    {"name": "Main Warehouse", "quantity": 1},
    {"name": "Van #12", "quantity": 1}
  ]
}
```

### Auto-Reorder Settings (Organization Level)

| Setting | Type | Description | Default |
|---------|------|-------------|---------|
| `auto_reorder_enabled` | BOOLEAN | Enable auto-orders | false |
| `auto_reorder_threshold` | INTEGER | % below reorder point | 0 |
| `auto_reorder_max_value` | DECIMAL | Max order value | 500.00 |
| `auto_reorder_approver` | UUID | Requires approval | null |
| `reorder_notifications` | TEXT[] | Who to notify | ["admin"] |

---

## Part Warranties

### Warranty Types

| Type | Code | Description |
|------|------|-------------|
| **Manufacturer** | `manufacturer` | OEM warranty |
| **Supplier** | `supplier` | Distributor warranty |
| **Extended** | `extended` | Extended coverage |
| **None** | `none` | No warranty |

### Warranty Tracking

Parts with serial numbers track warranty per unit:

```json
{
  "serial_number": "SN-12345",
  "part_id": "uuid",
  "warranty_start": "2024-06-15",
  "warranty_end": "2025-06-14",
  "warranty_type": "manufacturer",
  "warranty_terms": "Parts and labor",
  "claim_history": [
    {
      "date": "2024-09-01",
      "work_order_id": "uuid",
      "issue": "Premature failure",
      "resolution": "Replaced under warranty"
    }
  ]
}
```

---

## Part Compatibility Mapping

### Equipment-Part Matrix

Maps which parts are used on which equipment:

```json
{
  "part_id": "uuid",
  "part_number": "DOO-001-KONE",
  "compatibility": [
    {
      "manufacturer": "KONE",
      "models": ["MonoSpace 500", "MonoSpace 700"],
      "fit_type": "direct",
      "notes": "OEM part"
    },
    {
      "manufacturer": "Otis",
      "models": ["2000E"],
      "fit_type": "compatible",
      "notes": "Requires adapter bracket DOO-ADP-001"
    }
  ]
}
```

### Fit Types

| Type | Code | Description |
|------|------|-------------|
| **Direct** | `direct` | Drop-in replacement |
| **Compatible** | `compatible` | Works with modifications |
| **Alternative** | `alternative` | Alternative option |
| **Universal** | `universal` | Fits multiple brands |

---

## Minimum Viable Part

### Absolute Minimum (2 fields)

```json
{
  "part_number": "DOO-001",
  "name": "Door Operator"
}
```

**Note**: `organization_id` is set from authentication context.

### Recommended Minimum

```json
{
  "part_number": "DOO-001-KONE",
  "name": "Door Operator Assembly",
  "manufacturer": "KONE",
  "manufacturer_part_number": "KM903370G01",
  "category": "door_parts",
  "unit_cost": 450.00,
  "minimum_stock": 1,
  "reorder_point": 2,
  "compatible_manufacturers": ["KONE"],
  "compatible_models": ["MonoSpace 500", "MonoSpace 700"]
}
```

---

## Profile Completeness Levels

### Minimal Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "part_number": "DOO-001",
  "name": "Door Operator",
  "status": "active",
  "total_on_hand": 0,
  "total_reserved": 0,
  "total_available": 0,
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: ~10%

### Standard Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "part_number": "DOO-001-KONE",
  "name": "Door Operator Assembly",
  "description": "Complete door operator assembly for KONE lifts",
  "category": "door_parts",
  "subcategory": "door_operators",
  "manufacturer": "KONE",
  "manufacturer_part_number": "KM903370G01",
  "compatible_manufacturers": ["KONE"],
  "compatible_models": ["MonoSpace 500", "MonoSpace 700", "3000"],
  "unit_cost": 450.00,
  "sale_price": 675.00,
  "minimum_stock": 1,
  "reorder_point": 2,
  "reorder_quantity": 3,
  "unit_of_measure": "each",
  "criticality": "critical",
  "status": "active",
  "total_on_hand": 5,
  "total_reserved": 1,
  "total_available": 4,
  "created_at": "2024-06-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: ~50%

### Complete Profile

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440010",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "part_number": "DOO-001-KONE",
  "name": "Door Operator Assembly",
  "description": "Complete door operator assembly for KONE MonoSpace series. Includes motor, belt, and mounting hardware. Direct replacement for models manufactured 2015-2023.",
  "barcode": "8806084947123",
  "category": "door_parts",
  "subcategory": "door_operators",
  "part_type": "assembly",
  "criticality": "critical",
  "manufacturer": "KONE",
  "manufacturer_part_number": "KM903370G01",
  "brand": "EcoDisc",
  "compatible_manufacturers": ["KONE"],
  "compatible_models": ["MonoSpace 500", "MonoSpace 700", "3000", "EcoSpace"],
  "compatible_equipment_types": ["elevator"],
  "supersedes": "KM903370G00",
  "unit_cost": 450.00,
  "sale_price": 675.00,
  "list_price": 750.00,
  "markup_percentage": 50.00,
  "currency": "AUD",
  "tax_class": "standard",
  "minimum_stock": 2,
  "reorder_point": 3,
  "reorder_quantity": 5,
  "lead_time_days": 7,
  "unit_of_measure": "each",
  "pack_size": 1,
  "weight_kg": 2.500,
  "length_mm": 450,
  "width_mm": 300,
  "height_mm": 150,
  "is_hazardous": false,
  "storage_requirements": "Store in dry area, protect from dust",
  "warranty_months": 12,
  "warranty_type": "manufacturer",
  "warranty_terms": "Parts replacement only. Labor not included. Must be installed by certified technician.",
  "primary_supplier_id": "550e8400-e29b-41d4-a716-446655440020",
  "supplier_part_number": "SUP-KM903370G01",
  "supplier_name": "KONE Spares Australia",
  "specifications": {
    "voltage": "240V",
    "motor_type": "brushless_dc",
    "belt_type": "toothed",
    "door_weight_max_kg": 150,
    "opening_speed_mps": 0.4,
    "noise_level_db": 45
  },
  "metadata": {
    "introduced_date": "2015-01-01",
    "end_of_life_date": null,
    "typical_failure_modes": ["belt_wear", "motor_burnout"],
    "average_lifespan_years": 8
  },
  "images": [
    "https://cdn.sitesync.io/parts/DOO-001-KONE/main.jpg",
    "https://cdn.sitesync.io/parts/DOO-001-KONE/dimensions.jpg"
  ],
  "status": "active",
  "total_on_hand": 8,
  "total_reserved": 2,
  "total_available": 6,
  "total_on_order": 5,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

**Completeness**: 100%

---

## Complete Examples by Type

### Example 1: Critical Replacement Part

```json
{
  "part_number": "GOV-001-KONE",
  "name": "Governor Assembly",
  "description": "Centrifugal governor for KONE gearless lifts. Critical safety device.",
  "category": "safety_parts",
  "subcategory": "governors",
  "part_type": "assembly",
  "criticality": "critical",
  "manufacturer": "KONE",
  "manufacturer_part_number": "KM51100152V003",
  "compatible_manufacturers": ["KONE"],
  "compatible_models": ["MonoSpace 500", "MonoSpace 700"],
  "unit_cost": 1850.00,
  "sale_price": 2775.00,
  "minimum_stock": 1,
  "reorder_point": 1,
  "reorder_quantity": 1,
  "lead_time_days": 21,
  "warranty_months": 24,
  "warranty_type": "manufacturer",
  "specifications": {
    "rated_speed_mps": 1.75,
    "overspeed_trip_mps": 1.925,
    "rope_diameter_mm": 8,
    "certification": "AS1735.2"
  }
}
```

### Example 2: Consumable Item

```json
{
  "part_number": "LUB-001-GEN",
  "name": "Guide Rail Lubricant",
  "description": "High-performance lubricant for guide rails. Suitable for all lift types.",
  "category": "consumables",
  "subcategory": null,
  "part_type": "consumable",
  "criticality": "medium",
  "manufacturer": "Kluber",
  "manufacturer_part_number": "Klubersynth GH 6-80",
  "compatible_manufacturers": ["KONE", "Otis", "Schindler", "ThyssenKrupp"],
  "compatible_models": [],
  "compatible_equipment_types": ["elevator"],
  "unit_cost": 45.00,
  "sale_price": 67.50,
  "minimum_stock": 5,
  "reorder_point": 10,
  "reorder_quantity": 20,
  "lead_time_days": 3,
  "unit_of_measure": "litre",
  "pack_size": 1,
  "weight_kg": 0.950,
  "is_hazardous": false,
  "storage_requirements": "Store below 30C, keep container sealed"
}
```

### Example 3: Universal Hardware

```json
{
  "part_number": "HDW-BOLT-M10X40",
  "name": "Hex Bolt M10 x 40mm",
  "description": "Grade 8.8 hex head bolt, zinc plated",
  "category": "hardware",
  "subcategory": null,
  "part_type": "replacement",
  "criticality": "low",
  "manufacturer": "Generic",
  "compatible_manufacturers": ["KONE", "Otis", "Schindler", "ThyssenKrupp"],
  "compatible_models": [],
  "unit_cost": 0.45,
  "sale_price": 0.90,
  "minimum_stock": 50,
  "reorder_point": 100,
  "reorder_quantity": 200,
  "lead_time_days": 2,
  "unit_of_measure": "each",
  "pack_size": 100,
  "specifications": {
    "thread": "M10",
    "length_mm": 40,
    "grade": "8.8",
    "finish": "zinc_plated"
  }
}
```

### Example 4: Repair Kit

```json
{
  "part_number": "KIT-DOOR-KONE-01",
  "name": "Door Service Kit - KONE MonoSpace",
  "description": "Complete door maintenance kit including rollers, gibs, and wear items",
  "category": "door_parts",
  "subcategory": "repair_kits",
  "part_type": "repair_kit",
  "criticality": "high",
  "manufacturer": "KONE",
  "manufacturer_part_number": "KM50084782G01",
  "compatible_manufacturers": ["KONE"],
  "compatible_models": ["MonoSpace 500", "MonoSpace 700"],
  "unit_cost": 185.00,
  "sale_price": 277.50,
  "minimum_stock": 2,
  "reorder_point": 3,
  "reorder_quantity": 5,
  "lead_time_days": 5,
  "specifications": {
    "kit_contents": [
      {"part_number": "KM50010520", "name": "Door Roller", "quantity": 4},
      {"part_number": "KM50010521", "name": "Door Gib", "quantity": 4},
      {"part_number": "KM50010522", "name": "Belt Tensioner", "quantity": 1},
      {"part_number": "KM50010523", "name": "Belt", "quantity": 1},
      {"part_number": "HDW-BOLT-M8X25", "name": "M8 Bolt", "quantity": 8}
    ]
  }
}
```

---

## Inventory Location Examples

### Warehouse Stock

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440030",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "inventory_item_id": "550e8400-e29b-41d4-a716-446655440010",
  "location_type": "warehouse",
  "location_name": "Melbourne Main Warehouse",
  "contractor_id": null,
  "site_id": null,
  "quantity_on_hand": 10,
  "quantity_reserved": 2,
  "quantity_available": 8,
  "minimum_stock": 5,
  "reorder_point": 8,
  "bin_location": "A-12-3",
  "last_count_date": "2024-11-15",
  "last_count_quantity": 10
}
```

### Van Stock

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440031",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "inventory_item_id": "550e8400-e29b-41d4-a716-446655440010",
  "location_type": "van",
  "location_name": "Van #12 - John Smith",
  "contractor_id": "550e8400-e29b-41d4-a716-446655440005",
  "site_id": null,
  "quantity_on_hand": 2,
  "quantity_reserved": 0,
  "quantity_available": 2,
  "minimum_stock": 1,
  "reorder_point": 1,
  "bin_location": null,
  "last_count_date": "2024-12-01",
  "last_count_quantity": 2
}
```

### Site Consignment

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440032",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "inventory_item_id": "550e8400-e29b-41d4-a716-446655440010",
  "location_type": "site",
  "location_name": "Collins Tower - Machine Room",
  "contractor_id": null,
  "site_id": "550e8400-e29b-41d4-a716-446655440001",
  "quantity_on_hand": 1,
  "quantity_reserved": 0,
  "quantity_available": 1,
  "minimum_stock": 1,
  "reorder_point": 1,
  "bin_location": "Spares Cabinet",
  "last_count_date": "2024-10-01",
  "last_count_quantity": 1
}
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `part_number` | Required, 1-100 chars | "Part number is required" |
| `part_number` | Unique per organization | "Part number already exists" |
| `part_number` | Alphanumeric + hyphens | "Part number contains invalid characters" |
| `name` | Required, 1-255 chars | "Part name is required" |
| `unit_cost` | Positive or null | "Unit cost must be positive" |
| `sale_price` | Positive or null | "Sale price must be positive" |
| `sale_price` | >= unit_cost (if both set) | "Sale price cannot be less than cost" |
| `minimum_stock` | Non-negative integer | "Minimum stock must be 0 or greater" |
| `reorder_point` | >= minimum_stock | "Reorder point cannot be less than minimum stock" |
| `reorder_quantity` | Positive integer | "Reorder quantity must be positive" |
| `lead_time_days` | Non-negative integer | "Lead time must be 0 or greater" |
| `weight_kg` | Positive or null | "Weight must be positive" |
| `warranty_months` | Non-negative integer | "Warranty months must be 0 or greater" |
| `category` | Valid category code | "Invalid category" |
| `status` | Valid status code | "Invalid status" |

---

## Related Entities

| Entity | Relationship | Description |
|--------|--------------|-------------|
| Organization | N:1 | Parent organization |
| Stock Locations | 1:N | Where stock is held |
| Work Order Parts | 1:N | Usage on work orders |
| Suppliers | N:N | Where to purchase |
| Equipment | N:N | Compatibility mapping |
| Stock Transactions | 1:N | Movement history |

---

## Pydantic Models

```python
from datetime import datetime
from decimal import Decimal
from uuid import UUID
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict


class PartStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DISCONTINUED = "discontinued"
    PENDING = "pending"
    ON_ORDER = "on_order"


class PartType(str, Enum):
    REPLACEMENT = "replacement"
    REPAIR_KIT = "repair_kit"
    ASSEMBLY = "assembly"
    CONSUMABLE = "consumable"
    TOOL = "tool"


class Criticality(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class LocationType(str, Enum):
    WAREHOUSE = "warehouse"
    VAN = "van"
    SITE = "site"
    CONSIGNMENT = "consignment"
    IN_TRANSIT = "in_transit"


class InventoryItem(BaseModel):
    """Inventory item (part) domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID
    organization_id: UUID

    # Identity
    part_number: str
    name: str
    description: str | None = None
    barcode: str | None = None

    # Classification
    category: str | None = None
    subcategory: str | None = None
    part_type: PartType | None = None
    criticality: Criticality | None = None

    # Manufacturer
    manufacturer: str | None = None
    manufacturer_part_number: str | None = None

    # Compatibility
    compatible_manufacturers: list[str] = Field(default_factory=list)
    compatible_models: list[str] = Field(default_factory=list)

    # Pricing
    unit_cost: Decimal | None = None
    sale_price: Decimal | None = None

    # Stock management
    minimum_stock: int = 0
    reorder_point: int = 0
    reorder_quantity: int = 1
    lead_time_days: int | None = None
    unit_of_measure: str = "each"

    # Computed totals
    total_on_hand: int = 0
    total_reserved: int = 0
    total_available: int = 0

    # Status
    status: PartStatus = PartStatus.ACTIVE

    # Flexible
    specifications: dict = Field(default_factory=dict)
    metadata: dict = Field(default_factory=dict)

    # Timestamps
    created_at: datetime
    updated_at: datetime


class InventoryItemCreate(BaseModel):
    """Create inventory item request."""

    part_number: str = Field(..., min_length=1, max_length=100)
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    category: str | None = None
    subcategory: str | None = None
    manufacturer: str | None = None
    manufacturer_part_number: str | None = None
    compatible_manufacturers: list[str] = Field(default_factory=list)
    compatible_models: list[str] = Field(default_factory=list)
    unit_cost: Decimal | None = Field(None, ge=0)
    sale_price: Decimal | None = Field(None, ge=0)
    minimum_stock: int = Field(0, ge=0)
    reorder_point: int = Field(0, ge=0)
    reorder_quantity: int = Field(1, ge=1)
    specifications: dict = Field(default_factory=dict)


class InventoryItemUpdate(BaseModel):
    """Update inventory item request."""

    part_number: str | None = Field(None, min_length=1, max_length=100)
    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    category: str | None = None
    manufacturer: str | None = None
    manufacturer_part_number: str | None = None
    unit_cost: Decimal | None = Field(None, ge=0)
    sale_price: Decimal | None = Field(None, ge=0)
    minimum_stock: int | None = Field(None, ge=0)
    reorder_point: int | None = Field(None, ge=0)
    status: PartStatus | None = None
    specifications: dict | None = None


class StockLocation(BaseModel):
    """Stock location domain model."""

    model_config = ConfigDict(frozen=True)

    id: UUID
    organization_id: UUID
    inventory_item_id: UUID

    location_type: LocationType
    location_name: str
    contractor_id: UUID | None = None
    site_id: UUID | None = None

    quantity_on_hand: int = 0
    quantity_reserved: int = 0
    quantity_available: int = 0

    minimum_stock: int = 0
    reorder_point: int = 0
    bin_location: str | None = None

    last_count_date: datetime | None = None
    last_count_quantity: int | None = None

    created_at: datetime
    updated_at: datetime


class WorkOrderPart(BaseModel):
    """Part used on work order."""

    model_config = ConfigDict(frozen=True)

    id: UUID
    work_order_id: UUID
    inventory_item_id: UUID | None = None

    part_number: str
    part_name: str
    manufacturer: str | None = None

    quantity: int = 1
    unit_cost: Decimal | None = None
    total_cost: Decimal | None = None

    source: str | None = None
    serial_number: str | None = None
    warranty_claim: bool = False
    notes: str | None = None

    created_at: datetime
```

---

## API Operations

### List Parts

```http
GET /api/v1/inventory?category=door_parts&status=active
```

### Get Part by ID

```http
GET /api/v1/inventory/{part_id}
```

### Create Part

```http
POST /api/v1/inventory
Content-Type: application/json

{
  "part_number": "DOO-001-KONE",
  "name": "Door Operator Assembly",
  "manufacturer": "KONE",
  "unit_cost": 450.00
}
```

### Update Part

```http
PATCH /api/v1/inventory/{part_id}
Content-Type: application/json

{
  "unit_cost": 475.00,
  "reorder_point": 4
}
```

### Get Stock Levels

```http
GET /api/v1/inventory/{part_id}/stock
```

### Transfer Stock

```http
POST /api/v1/inventory/{part_id}/transfer
Content-Type: application/json

{
  "from_location_id": "uuid",
  "to_location_id": "uuid",
  "quantity": 2,
  "notes": "Replenishing van stock"
}
```

### Issue to Work Order

```http
POST /api/v1/work-orders/{work_order_id}/parts
Content-Type: application/json

{
  "inventory_item_id": "uuid",
  "quantity": 1,
  "source": "inventory"
}
```

### Check Reorder Status

```http
GET /api/v1/inventory/reorder-alerts
```

### Bulk Import Parts

```http
POST /api/v1/inventory/import
Content-Type: text/csv

part_number,name,manufacturer,unit_cost
DOO-001-KONE,Door Operator,KONE,450.00
GOV-001-KONE,Governor,KONE,1850.00
```

---

**[← Previous: Contractor Profiles](12-contractor-profiles.md)** | **[Next: Role-Based Views →](14-role-based-views.md)**
