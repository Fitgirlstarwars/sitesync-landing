# Add Assets Tutorial

> Register your building equipment in SiteSync

## Overview

Assets are any equipment in your building that needs maintenance: lifts, HVAC units, electrical panels, fire systems, etc. This tutorial walks you through adding assets individually, using smart capture, and bulk importing.

## Prerequisites

- Active SiteSync account
- Building/site already created
- Equipment information (manufacturer, model, location)
- For bulk import: CSV or spreadsheet ready

---

## Adding Methods

Choose the method that fits your situation:

| Method | Best For | Time |
|--------|----------|------|
| **Manual Entry** | Single asset, full details known | 2-3 min |
| **Smart Capture** | On-site with phone, nameplate visible | 1-2 min |
| **Bulk Import** | Multiple assets, migrating from spreadsheet | 5-10 min |
| **From Template** | Similar equipment across sites | 1 min |

---

## Method 1: Manual Entry

### Step 1: Navigate to Assets

From your dashboard:

1. Select your building
2. Click **Assets** in the sidebar
3. Click **+ Add Asset**

### Step 2: Select Trade Type

Choose the equipment category:

| Trade | Examples |
|-------|----------|
| Lifts & Escalators | Passenger lift, goods lift, escalator, moving walk |
| HVAC | Chiller, AHU, split system, cooling tower |
| Electrical | Main switchboard, distribution board, UPS |
| Fire Systems | Alarm panel, sprinklers, extinguishers, hydrants |
| Plumbing | Hot water system, pumps, backflow prevention |
| Security | Access control, CCTV, intercom |

### Step 3: Enter Equipment Details

**Required fields:**

- **Asset Number** — Your identifier (e.g., "Lift 1", "AHU-01")

**Recommended fields:**

- **Manufacturer** — Equipment maker (KONE, Daikin, etc.)
- **Model** — Model name/number
- **Serial Number** — From nameplate
- **Registration Number** — Government registration (if applicable)

**Specifications (vary by trade):**

For lifts:
- Capacity (kg and persons)
- Speed (m/s)
- Floors served
- Drive type (gearless, hydraulic, MRL)
- Door type (center opening, side opening)

For HVAC:
- Cooling capacity (kW)
- Refrigerant type
- Airflow rate

### Step 4: Smart Suggestions

SiteSync recognizes common equipment and auto-fills details:

```
You entered: KONE MonoSpace
┌─────────────────────────────────────────────┐
│  ✓ Recognized: KONE MonoSpace 500 Series    │
│                                             │
│  Auto-filled:                               │
│  • Drive type: MRL (Machine Room Less)      │
│  • Typical capacity: 630-1000kg             │
│  • Controller: KCM/KDM                      │
│  • Door operator: KONE ADM                  │
│                                             │
│  [ Accept ]  [ Edit ]  [ Ignore ]           │
└─────────────────────────────────────────────┘
```

### Step 5: Set Compliance Dates

If applicable, enter:

- **Installation Date** — When equipment was installed
- **Last Inspection Date** — Most recent inspection
- **Next Inspection Due** — Upcoming compliance date

### Step 6: Confirm and Save

Review the asset details, then click **Save Asset**.

Your asset now appears in:
- Building dashboard health score
- Asset list
- Available for work orders
- Compliance calendar (if dates entered)

---

## Method 2: Smart Capture (Photo)

Use your phone's camera to extract equipment details from the nameplate.

### Step 1: Start Smart Capture

From the Add Asset screen:

```
┌─────────────────────────────────────────────────────────┐
│  How would you like to add this elevator?               │
│                                                         │
│  [📷 Smart Capture]     [📝 Manual Entry]              │
│                                                         │
│  Take a photo of the    Enter details manually          │
│  nameplate and we'll                                   │
│  extract the details                                   │
└─────────────────────────────────────────────────────────┘
```

Click **Smart Capture**.

### Step 2: Photograph the Nameplate

Tips for best results:

```
┌─────────────────────────────────────────────────────────┐
│                    📷 PHOTO TIPS                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✓ Good lighting (use flash if needed)                  │
│  ✓ Nameplate fills most of frame                        │
│  ✓ Text is in focus and readable                        │
│  ✓ Avoid reflections and glare                          │
│  ✓ Hold phone parallel to nameplate                     │
│                                                         │
│  ✗ Don't photograph from an angle                       │
│  ✗ Don't crop out edges of nameplate                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Review Extracted Data

AI extracts details from the nameplate:

```
┌─────────────────────────────────────────────────────────┐
│  🤖 Extracted from nameplate                            │
│                                                         │
│  Manufacturer:    KONE Corporation          ✓ Verified  │
│  Model:           MonoSpace 500             ✓ Verified  │
│  Serial Number:   KM-2015-78234             ✓ Verified  │
│  Capacity:        1000 kg / 13 persons      ✓ Verified  │
│  Speed:           1.6 m/s                   ✓ Verified  │
│  Year:            2015                      ⚠ Estimated │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Unit Number:     [Lift 1                  ] ← You enter│
│                                                         │
│  [ Retake Photo ]  [ Edit Details ]  [ Confirm ]        │
└─────────────────────────────────────────────────────────┘
```

### Step 4: Complete Missing Fields

Add any information not on the nameplate:

- **Unit Number** (required) — Your internal reference
- **Registration Number** — Government registration
- **Installation Date** — If different from manufacture date

### Step 5: Save Asset

Click **Confirm** to create the asset with extracted data.

---

## Method 3: Bulk Import

Import multiple assets from a CSV file or spreadsheet.

### Step 1: Prepare Your Data

Download the template or prepare a CSV with these columns:

**Required columns:**
- `unit_number` — Your identifier

**Recommended columns:**
- `manufacturer`
- `model`
- `serial_number`
- `registration_number`
- `capacity_kg`
- `speed_mps`
- `floors_served`
- `installation_date` (YYYY-MM-DD format)

### Step 2: Download Template

Navigate to **Assets > Import > Download Template**

```csv
unit_number,manufacturer,model,serial_number,registration_number,capacity_kg,speed_mps,floors_served,drive_type,door_type,installation_date
Lift 1,KONE,MonoSpace 500,KM-2015-78234,EL-VIC-12345,1000,1.6,12,gearless,center_opening,2015-06-15
Lift 2,Otis,Gen2,OT-2018-45678,EL-VIC-12346,1275,1.75,15,gearless,center_opening,2018-03-20
```

### Step 3: Fill In Your Data

Complete the spreadsheet with your equipment details:

| Field | Format | Example |
|-------|--------|---------|
| `unit_number` | Text | "Lift 1" |
| `manufacturer` | Text | "KONE" |
| `model` | Text | "MonoSpace 500" |
| `serial_number` | Text | "KM-2015-78234" |
| `capacity_kg` | Integer | 1000 |
| `speed_mps` | Decimal | 1.6 |
| `floors_served` | Integer | 12 |
| `drive_type` | gearless/geared/hydraulic/mrl | "gearless" |
| `door_type` | center_opening/side_opening/freight | "center_opening" |
| `installation_date` | YYYY-MM-DD | "2015-06-15" |

### Step 4: Upload and Validate

1. Navigate to **Assets > Import**
2. Select your building
3. Choose trade type (e.g., "Lifts & Escalators")
4. Upload your CSV file
5. System validates your data

```
┌─────────────────────────────────────────────────────────┐
│  📊 Import Validation                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  File: collins_lifts.csv                                │
│  Rows: 6                                                │
│                                                         │
│  ✓ Row 1: Lift 1 - Valid                                │
│  ✓ Row 2: Lift 2 - Valid                                │
│  ✓ Row 3: Lift 3 - Valid                                │
│  ⚠ Row 4: Lift 4 - Warning: capacity_kg empty           │
│  ✗ Row 5: Lift 5 - Error: unit_number already exists    │
│  ✓ Row 6: Goods Lift - Valid                            │
│                                                         │
│  Ready to import: 4 assets                              │
│  Warnings: 1 (will import with missing data)            │
│  Errors: 1 (will skip)                                  │
│                                                         │
│  [ Cancel ]  [ Import Valid Rows ]                      │
└─────────────────────────────────────────────────────────┘
```

### Step 5: Confirm Import

Review the validation results and click **Import Valid Rows**.

Assets are created with:
- Status: `operational` (default)
- Health score: Calculated after first work order

---

## Method 4: From Template

Create assets quickly using predefined templates.

### Step 1: Select Template

Navigate to **Assets > Add from Template**

```
┌─────────────────────────────────────────────────────────┐
│  📋 Asset Templates                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Recent Templates:                                      │
│  ○ KONE MonoSpace 500 (1000kg, 1.6m/s)                 │
│  ○ Otis Gen2 Comfort (1350kg, 1.75m/s)                 │
│  ○ Schindler 3300 (630kg, 1.0m/s)                      │
│                                                         │
│  Organization Templates:                                │
│  ○ Standard Commercial Lift                            │
│  ○ Standard Goods Lift                                 │
│  ○ Standard Hydraulic Lift                             │
│                                                         │
│  [ Create New Template ]  [ Browse All ]               │
└─────────────────────────────────────────────────────────┘
```

### Step 2: Customize for This Asset

Select a template and modify only what's different:

```
┌─────────────────────────────────────────────────────────┐
│  Template: KONE MonoSpace 500                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Unit Number:     [Lift 3                  ] ← Change   │
│  Serial Number:   [KM-2020-99123           ] ← Change   │
│  Registration:    [EL-VIC-12350            ] ← Change   │
│                                                         │
│  ── Pre-filled from template ──────────────────────     │
│  Manufacturer:    KONE                                  │
│  Model:           MonoSpace 500                         │
│  Capacity:        1000 kg                               │
│  Speed:           1.6 m/s                               │
│  Drive Type:      Gearless                              │
│                                                         │
│  [ Cancel ]  [ Create Asset ]                           │
└─────────────────────────────────────────────────────────┘
```

### Step 3: Save as New Template (Optional)

If you've customized significantly, save for future use:

```
☑ Save as new template: "KONE MonoSpace 500 - High Rise"
```

---

## Profile Completeness

SiteSync shows how complete your asset profile is:

| Level | Completeness | What's Included |
|-------|--------------|-----------------|
| **Minimal** | ~10% | Unit number only |
| **Basic** | ~30% | + Manufacturer, model |
| **Standard** | ~50% | + Serial, specs, dates |
| **Complete** | 100% | All fields + compliance |

```
┌─────────────────────────────────────────────────────────┐
│  Profile Completeness: ████████░░░░ 65%                 │
│                                                         │
│  Missing for 100%:                                      │
│  • Installation date                                    │
│  • Last inspection date                                 │
│  • Next inspection due                                  │
│  • Car dimensions                                       │
│                                                         │
│  [ Complete Profile ]                                   │
└─────────────────────────────────────────────────────────┘
```

Higher completeness = better AI diagnosis accuracy.

---

## Validation Errors

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Unit number is required" | Empty unit number | Enter a unique identifier |
| "Unit number already exists at this site" | Duplicate | Use different name or check existing assets |
| "Capacity must be positive" | Zero or negative value | Enter positive number |
| "Installation date cannot be in the future" | Date after today | Correct the date |
| "Invalid status" | Unrecognized status value | Use: operational, degraded, out_of_service |
| "Site not found" | Invalid site reference | Select valid building first |

### Validation Error Display

```
┌─────────────────────────────────────────────────────────┐
│  ⚠ Please fix the following errors:                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Unit Number                                            │
│  ✗ Unit number already exists at this site              │
│    "Lift 1" is already registered. Try "Lift 1A" or    │
│    check if this is a duplicate entry.                  │
│                                                         │
│  Installation Date                                      │
│  ✗ Installation date cannot be in the future            │
│    You entered: 2025-06-15                              │
│    Current date: 2024-12-01                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Smart Capture Not Working

**Problem**: Photo not extracting data

**Solutions**:
1. Ensure good lighting
2. Clean camera lens
3. Hold phone steady
4. Try flash for reflective nameplates
5. Manually crop to nameplate area
6. Fall back to manual entry

### Bulk Import Failing

**Problem**: CSV validation errors

**Solutions**:
1. Check date format (YYYY-MM-DD)
2. Remove special characters from text fields
3. Ensure unit numbers are unique
4. Check for empty required fields
5. Download fresh template and re-enter data

### Asset Not Appearing

**Problem**: Created asset not visible

**Solutions**:
1. Check you're viewing correct building
2. Check asset filters (status, trade type)
3. Refresh the page
4. Clear browser cache
5. Check audit log for creation confirmation

---

## After Adding Assets

### Immediate Next Steps

1. **Add remaining assets** — Register all equipment
2. **Set inspection dates** — Enter compliance deadlines
3. **Upload documents** — Attach manuals, certificates
4. **Create maintenance schedules** — Set up preventive maintenance

### Building Health Score

After adding assets, your building health score updates:

```
┌─────────────────────────────────────────────────────────┐
│  Collins Place Tower 1                                  │
│                                                         │
│  Building Health: ████████░░ 82                         │
│                                                         │
│  Assets: 6 lifts registered                             │
│  ├── 5 Operational                                      │
│  ├── 1 Degraded (Lift 3 - door issue)                  │
│  └── 0 Out of Service                                   │
│                                                         │
│  Upcoming: 2 inspections due this month                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Related Guides

- [Create Work Orders](work-orders.md) — Log jobs for this asset
- [Use AI Diagnosis](ai-diagnosis.md) — Get AI help with faults
- [Data Migration](../how-to/data-migration.md) — Import from existing systems
- [Compliance Tracking](../how-to/compliance-tracking.md) — Manage inspections
- [Asset Profiles Reference](../foundation/06-asset-profiles.md) — Complete field reference

---

**[← Back to Quick Start](quick-start.md)** | **[Next: Work Orders →](work-orders.md)**
