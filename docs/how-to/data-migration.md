# SiteSync V3 - Data Migration

## Importing Your Building History

> This document provides comprehensive guidance for migrating existing service records, equipment data, and historical documentation into SiteSync.

---

## Philosophy: Your History Matters

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   Your building has a story.                                     ║
║                                                                  ║
║   Every service call, every part replaced, every technician      ║
║   who solved a problem—that's institutional knowledge.           ║
║                                                                  ║
║   SiteSync preserves that story and makes it searchable,        ║
║   intelligent, and permanent.                                    ║
║                                                                  ║
║   The more history you bring, the smarter your building gets.    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Migration Benefits

| What You Import | What You Gain |
|-----------------|---------------|
| Service records | AI learns your equipment patterns |
| Work orders | Historical trend analysis |
| Compliance docs | Automated certificate tracking |
| Equipment specs | Instant technician context |
| Contractor history | Performance benchmarking |

---

## Migration Overview

### Supported Import Sources

```
DATA SOURCES
═══════════════════════════════════════════════════════════════════

DIGITAL FORMATS
───────────────
PDF Documents          Service reports, inspection certificates
Excel/CSV              Spreadsheet records, asset lists
Word Documents         Reports, specifications
Images/Photos          Nameplates, handwritten logs
Email Archives         Service correspondence

SYSTEM EXPORTS
──────────────
ServiceTitan           Work order export
Fiix                   Asset/maintenance export
UpKeep                 CMMS data export
Limble                 Maintenance records
Manufacturer Portals   KONE, Otis, Schindler service logs

PHYSICAL RECORDS
────────────────
Paper Logs             Scanned or photographed
Logbooks               Digitized via OCR
Filing Cabinets        Bulk scanning service available

═══════════════════════════════════════════════════════════════════
```

---

## Migration Paths

### Path 1: Self-Service Upload

**Best for:** Small volumes, digital documents

```
SELF-SERVICE MIGRATION
═══════════════════════════════════════════════════════════════════

Step 1: Prepare Files
├── Gather digital documents
├── Organize by equipment or date
└── Ensure readable quality

Step 2: Upload to SiteSync
├── Navigate to Site → Import
├── Drag and drop files
└── AI processes automatically

Step 3: Review & Confirm
├── AI extracts data
├── You verify accuracy
└── Records added to history

Time: 15-30 minutes for typical building
Cost: Free (included)

═══════════════════════════════════════════════════════════════════
```

### Path 2: Assisted Migration

**Best for:** Large volumes, complex histories

```
ASSISTED MIGRATION
═══════════════════════════════════════════════════════════════════

Step 1: Request Assistance
├── Contact migration team
├── Describe data sources
└── Schedule kickoff call

Step 2: Data Collection
├── Provide access to records
├── Migration team extracts
└── AI processes in bulk

Step 3: Validation Workshop
├── Review extracted data
├── Correct any issues
└── Approve for import

Step 4: Go Live
├── Data imported
├── Training provided
└── Ongoing support

Time: 1-2 weeks depending on volume
Cost: Included for Enterprise, $299 one-time for Pro

═══════════════════════════════════════════════════════════════════
```

### Path 3: System Integration

**Best for:** Migrating from existing CMMS/FSM

```
SYSTEM INTEGRATION MIGRATION
═══════════════════════════════════════════════════════════════════

Supported Systems:
├── ServiceTitan
├── Fiix
├── UpKeep
├── Limble CMMS
├── Maintenance Connection
└── Custom systems via API

Process:
1. Export from existing system
2. Upload export files to SiteSync
3. Automated mapping and transformation
4. Validation and confirmation
5. Ongoing sync (optional)

═══════════════════════════════════════════════════════════════════
```

---

## Document Processing

### AI-Powered Extraction

**How It Works:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   DOCUMENT UPLOAD                                               │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ OCR Processing                                          │   │
│   │ • Text extraction from scans                            │   │
│   │ • Handwriting recognition                               │   │
│   │ • Table structure detection                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ AI Classification                                       │   │
│   │ • Document type identification                          │   │
│   │ • Equipment matching                                    │   │
│   │ • Date/event extraction                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Structured Output                                       │   │
│   │ • Work orders created                                   │   │
│   │ • Equipment records updated                             │   │
│   │ • Documents linked                                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                        │
│        ▼                                                        │
│   HUMAN REVIEW                                                  │
│   • Confidence scores shown                                     │
│   • Easy correction interface                                   │
│   • Learn from corrections                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Extracted Data Types

**From Service Reports:**

| Field | Extraction | Confidence |
|-------|------------|------------|
| Service date | High (95%+) | Dates are reliable |
| Technician name | High (90%+) | Usually clear |
| Equipment serviced | Medium (80%+) | May need matching |
| Work performed | Medium (75%+) | Free text varies |
| Parts used | Medium (70%+) | Format varies |
| Fault codes | High (90%+) | Structured format |

**From Inspection Certificates:**

| Field | Extraction | Confidence |
|-------|------------|------------|
| Certificate number | High (95%+) | Structured |
| Issue date | High (95%+) | Standard format |
| Expiry date | High (95%+) | Standard format |
| Inspector | High (90%+) | Usually clear |
| Equipment details | High (85%+) | Structured |
| Pass/fail status | High (95%+) | Binary |

---

## Data Mapping

### Standard Field Mappings

**Equipment Data:**

```yaml
Source Field         → SiteSync Field
─────────────────────────────────────────────────
Asset ID            → equipment.external_reference
Name                → equipment.name
Location            → equipment.location
Manufacturer        → equipment.manufacturer
Model               → equipment.model_number
Serial Number       → equipment.serial_number
Install Date        → equipment.installation_date
Category            → equipment.type
Status              → equipment.status
```

**Work Order Data:**

```yaml
Source Field         → SiteSync Field
─────────────────────────────────────────────────
Work Order #        → work_order.external_reference
Created Date        → work_order.created_at
Description         → work_order.description
Priority            → work_order.priority
Type                → work_order.type
Assigned Tech       → work_order.assigned_to
Status              → work_order.status
Completed Date      → work_order.completed_at
Parts Used          → work_order_parts[]
Labor Hours         → work_order_labor[]
Notes               → work_order.notes
```

### Custom Field Handling

```
CUSTOM FIELDS
═══════════════════════════════════════════════════════════════════

If your existing system has custom fields:

1. During migration setup, identify custom fields
2. Map to SiteSync custom fields or notes
3. Preserve original data in metadata

Example:
  Source: "Risk Score: 7/10"
  Maps to: equipment.metadata.legacy_risk_score = 7

Nothing is lost. Everything is preserved.

═══════════════════════════════════════════════════════════════════
```

---

## Migration Templates

### Equipment Import Template

**CSV Format:**

```csv
equipment_name,manufacturer,model,serial_number,installation_date,location,type,status
"Lobby Elevator 1",KONE,MonoSpace 500,KM-12345-2019,2019-03-15,"Ground Floor",traction,operational
"Service Elevator",Otis,Gen2 MRL,OT-67890-2015,2015-08-22,"Basement",traction,operational
"Escalator 1",Schindler,9300AE,SC-11111-2020,2020-01-10,"Mall Entry",escalator,operational
```

**Download Templates:**
- [Equipment Import Template (CSV)](templates/equipment_import.csv)
- [Equipment Import Template (Excel)](templates/equipment_import.xlsx)

### Work Order Import Template

**CSV Format:**

```csv
date,equipment_name,work_type,description,technician,parts_used,labor_hours,status
2024-01-15,"Lobby Elevator 1",breakdown,"F505 fault - door zone sensor replaced","Sarah Chen","KM-DZ-505:1",2.5,completed
2024-02-01,"Lobby Elevator 1",preventive,"Monthly PM inspection","Mike Wong","",1.0,completed
2024-02-20,"Service Elevator",breakdown,"Door operator noise - adjusted","Sarah Chen","",0.5,completed
```

**Download Templates:**
- [Work Order Import Template (CSV)](templates/workorder_import.csv)
- [Work Order Import Template (Excel)](templates/workorder_import.xlsx)

### Compliance Certificate Template

**CSV Format:**

```csv
certificate_number,equipment_name,certificate_type,issue_date,expiry_date,issuing_authority,inspector,status
CERT-2024-001,"Lobby Elevator 1",annual_inspection,2024-01-15,2025-01-15,"WorkSafe Victoria","John Smith",valid
CERT-2024-002,"Service Elevator",annual_inspection,2024-01-15,2025-01-15,"WorkSafe Victoria","John Smith",valid
```

---

## Step-by-Step Migration

### Phase 1: Assessment

**Inventory Your Data:**

```
DATA INVENTORY CHECKLIST
═══════════════════════════════════════════════════════════════════

☐ Equipment Records
  ☐ How many pieces of equipment?
  ☐ What format? (spreadsheet, documents, system)
  ☐ How complete are specifications?

☐ Service History
  ☐ How many years of history?
  ☐ How are records stored?
  ☐ Digital or paper?

☐ Compliance Documents
  ☐ Current certificates on file?
  ☐ Historical inspections available?
  ☐ Expiry dates known?

☐ Contractor Records
  ☐ Which contractors have serviced building?
  ☐ Contact information available?
  ☐ Contract documents?

☐ Additional Documents
  ☐ Equipment manuals
  ☐ As-built drawings
  ☐ Warranty documents

═══════════════════════════════════════════════════════════════════
```

**Prioritization Matrix:**

| Data Type | Priority | Reason |
|-----------|----------|--------|
| Current equipment specs | High | Enables all features |
| Recent service history (2 years) | High | AI learning |
| Compliance certificates | High | Regulatory requirement |
| Complete service history | Medium | Better predictions |
| Equipment manuals | Medium | Reference value |
| Old contractor records | Low | Historical only |

---

### Phase 2: Preparation

**Data Cleanup Recommendations:**

```
DATA QUALITY CHECKLIST
═══════════════════════════════════════════════════════════════════

EQUIPMENT DATA
☐ Remove duplicate entries
☐ Standardize manufacturer names
  (e.g., "KONE" not "Kone" or "kone corp")
☐ Verify serial numbers are accurate
☐ Confirm installation dates

WORK ORDER DATA
☐ Remove test/cancelled orders
☐ Ensure dates are valid
☐ Check equipment references match

COMPLIANCE DATA
☐ Verify certificate numbers
☐ Confirm expiry dates are future
☐ Remove superseded certificates

═══════════════════════════════════════════════════════════════════
```

**File Organization:**

```
Recommended Folder Structure:
───────────────────────────────────────
/migration/
├── /equipment/
│   ├── equipment_list.xlsx
│   └── /specs/
│       ├── elevator_1_specs.pdf
│       └── elevator_2_specs.pdf
├── /service_history/
│   ├── 2023_service_reports/
│   ├── 2024_service_reports/
│   └── work_orders.xlsx
├── /compliance/
│   ├── current_certificates/
│   └── historical_inspections/
└── /manuals/
    ├── kone_monospace_manual.pdf
    └── otis_gen2_manual.pdf
───────────────────────────────────────
```

---

### Phase 3: Upload & Processing

**Self-Service Upload Interface:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Import Building History                                       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │              📁 Drag files here                         │   │
│   │                                                         │   │
│   │         or click to browse                              │   │
│   │                                                         │   │
│   │   Supported: PDF, Excel, CSV, Word, Images              │   │
│   │   Max 100 files or 500MB per upload                     │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ─── OR import from template ───                               │
│                                                                 │
│   [ Equipment Template ]  [ Work Orders ]  [ Certificates ]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Processing Status:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Import Progress                                               │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ service_report_2024_jan.pdf      ✓ Processed            │   │
│   │   → 1 work order extracted                              │   │
│   │   → Equipment: Lobby Elevator 1 (matched)               │   │
│   │   → Confidence: 92%                                     │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ service_report_2024_feb.pdf      ⟳ Processing...        │   │
│   │   [████████████░░░░░░░░░░] 65%                          │   │
│   ├─────────────────────────────────────────────────────────┤   │
│   │ inspection_cert_2024.pdf         ○ Queued               │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   Estimated time remaining: 2 minutes                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Phase 4: Validation

**Review Interface:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Review Imported Data                                          │
│                                                                 │
│   Document: service_report_2024_jan.pdf     Confidence: 92%     │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ EXTRACTED DATA                   │ ORIGINAL DOCUMENT    │   │
│   │ ────────────────────────         │                      │   │
│   │                                  │  ┌────────────────┐  │   │
│   │ Date: 2024-01-15                 │  │                │  │   │
│   │ Equipment: Lobby Elevator 1 [✓]  │  │  [Preview of   │  │   │
│   │ Work Type: Breakdown             │  │   PDF page]    │  │   │
│   │ Technician: Sarah Chen           │  │                │  │   │
│   │ Description:                     │  │                │  │   │
│   │   F505 fault code. Door zone     │  │                │  │   │
│   │   sensor replaced. System test   │  │                │  │   │
│   │   passed.                        │  └────────────────┘  │   │
│   │                                  │                      │   │
│   │ Parts:                           │  [ View Full Doc ]   │   │
│   │   KM-DZ-505 x1 ($85)            │                      │   │
│   │                                  │                      │   │
│   │ Labor: 2.5 hours                 │                      │   │
│   │                                  │                      │   │
│   │ [ Edit ] [ Correct Equipment ]   │                      │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   [ ← Previous ]  [ Approve & Next → ]  [ Skip ]  [ Reject ]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Bulk Validation:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Bulk Review                                                   │
│                                                                 │
│   High Confidence (>90%): 45 records                            │
│   [ Approve All High Confidence ]                               │
│                                                                 │
│   Medium Confidence (70-90%): 12 records                        │
│   [ Review Individually ]                                       │
│                                                                 │
│   Low Confidence (<70%): 3 records                              │
│   [ Review Individually ] ← Recommended                         │
│                                                                 │
│   Unprocessable: 2 files                                        │
│   [ View Issues ]                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Phase 5: Completion

**Post-Migration Summary:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Migration Complete                                            │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                                                         │   │
│   │   ✓ 62 documents processed                              │   │
│   │   ✓ 3 equipment records created                         │   │
│   │   ✓ 58 work orders imported                             │   │
│   │   ✓ 6 compliance certificates added                     │   │
│   │   ✓ 5 years of history now searchable                   │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   Your building just got 5 years smarter.                       │
│                                                                 │
│   What's different now:                                         │
│   • AI diagnosis uses your equipment's actual history           │
│   • Health Score reflects real performance data                 │
│   • Technicians see complete context from day one               │
│   • Compliance tracking is automated                            │
│                                                                 │
│   [ Go to Dashboard ]  [ Import More ]  [ Download Report ]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Special Migration Scenarios

### Scenario: Multiple Contractors' Records

**Challenge:** Different contractors have different records for same equipment.

**Solution:**

```
MULTI-CONTRACTOR HISTORY MERGE
═══════════════════════════════════════════════════════════════════

Import Process:
1. Import all records (duplicates OK)
2. AI identifies potential overlaps
3. Timeline construction merges events
4. Human review for conflicts

Result:
├── 2019: ABC Elevators (previous contractor)
│   └── 12 service visits merged
├── 2020: ABC Elevators
│   └── 15 service visits merged
├── 2021-2023: XYZ Lift Services (changed contractor)
│   └── 36 service visits merged
└── 2024: Current contractor
    └── Ongoing live records

Your building remembers everything, regardless of who serviced it.

═══════════════════════════════════════════════════════════════════
```

---

### Scenario: Paper Records Only

**Challenge:** All historical records are paper-based.

**Options:**

```
PAPER RECORD DIGITIZATION
═══════════════════════════════════════════════════════════════════

Option 1: Self-Scan
──────────────────
• Use smartphone to photograph pages
• Upload images to SiteSync
• AI OCR processes automatically
• Best for: <50 pages

Option 2: Bulk Scanning Service
───────────────────────────────
• Ship or pickup documents
• Professional scanning (300 DPI)
• Return originals + digital copies
• Best for: 50-500 pages
• Cost: $0.10-0.25 per page

Option 3: Migration Team Assistance
───────────────────────────────────
• We collect and process
• Quality assurance included
• Structured data extraction
• Best for: 500+ pages or complex records
• Cost: Custom quote

═══════════════════════════════════════════════════════════════════
```

---

### Scenario: Existing CMMS Migration

**From ServiceTitan:**

```python
# ServiceTitan Export Guide
# 1. Go to Settings → Data Management → Export
# 2. Select "Work Orders" and date range
# 3. Export as CSV
# 4. Upload to SiteSync

# Automatic field mapping:
servicetitan_field    → sitesync_field
───────────────────────────────────────
"Job Number"         → external_reference
"Job Type"           → type
"Customer"           → site (by match)
"Description"        → description
"Assigned Tech"      → assigned_to
"Status"             → status
"Completed Date"     → completed_at
"Invoice Total"      → metadata.original_invoice
```

**From Fiix:**

```python
# Fiix Export Guide
# 1. Navigate to Reports → Work Orders
# 2. Configure date range and fields
# 3. Export to Excel
# 4. Upload to SiteSync

# Automatic field mapping:
fiix_field           → sitesync_field
───────────────────────────────────────
"Work Order ID"      → external_reference
"Asset"              → equipment (by match)
"Maintenance Type"   → type
"Description"        → description
"Assigned To"        → assigned_to
"Status"             → status
"Completion Date"    → completed_at
"Labor Hours"        → labor_entries
"Parts"              → parts_used
```

**From Spreadsheets:**

```python
# Generic Spreadsheet Import
# Supported: Excel (.xlsx), CSV, Google Sheets

# Required columns (minimum):
- Date (service date)
- Equipment (name or ID)
- Description (work performed)

# Optional columns (recommended):
- Technician
- Work Type (breakdown, preventive, inspection)
- Parts Used
- Labor Hours
- Status
- Notes

# Tips:
# - Use consistent date format (YYYY-MM-DD preferred)
# - Equipment names must match your SiteSync equipment
# - Include as many columns as available
```

---

## Data Governance

### Ownership & Rights

```
DATA OWNERSHIP PRINCIPLES
═══════════════════════════════════════════════════════════════════

BUILDING DATA
─────────────
• Building owns all data about their property
• Ownership transfers with property sale (optional)
• Export available at any time
• Deletion upon request (with audit retention)

CONTRACTOR DATA
───────────────
• Contractors own their business data
• Work records shared with building
• Company-specific data remains private
• Historical records persist for building

TECHNICIAN DATA
───────────────
• Technicians own their professional profile
• Work history tied to both building AND technician
• Profile portable between employers
• Anonymous contribution option

═══════════════════════════════════════════════════════════════════
```

### Data Retention

| Data Type | Retention Period | Reason |
|-----------|------------------|--------|
| Equipment records | Permanent | Asset lifecycle |
| Work orders | 10 years | Warranty, legal |
| Compliance docs | 7 years past expiry | Regulatory |
| Audit events | Permanent | Integrity |
| Deleted records | 90 days | Recovery |

---

## Validation & Quality

### Post-Migration Checks

**Automated Validation:**

```
AUTOMATED CHECKS
═══════════════════════════════════════════════════════════════════

✓ Equipment Count Match
  Expected: 3 | Imported: 3 | Status: PASS

✓ Work Order Date Range
  Earliest: 2019-03-15 | Latest: 2024-06-01 | Status: PASS

✓ Compliance Currency
  Valid Certs: 3 | Expired: 0 | Status: PASS

⚠ Duplicate Detection
  Potential duplicates: 2 records | Status: REVIEW NEEDED

✓ Equipment Linkage
  Work orders linked: 58/58 (100%) | Status: PASS

═══════════════════════════════════════════════════════════════════
```

**Manual Spot Checks:**

```
RECOMMENDED SPOT CHECKS
═══════════════════════════════════════════════════════════════════

1. Random Sample Review
   □ Select 5% of imported records randomly
   □ Compare to source documents
   □ Verify key fields accurate

2. Timeline Consistency
   □ Review equipment timeline
   □ Verify chronological order
   □ Check for gaps or overlaps

3. Compliance Verification
   □ Compare certificate dates to originals
   □ Verify inspector names
   □ Confirm certificate numbers

4. Part/Cost Accuracy
   □ Verify part numbers match
   □ Check quantities
   □ Confirm cost figures

═══════════════════════════════════════════════════════════════════
```

---

## Troubleshooting

### Common Issues

**"Equipment not matching"**

```
Problem: Imported work orders don't link to equipment

Solutions:
1. Check equipment names match exactly
   - "Elevator 1" ≠ "elevator 1" ≠ "Lift 1"
   - Standardize before import

2. Use equipment ID/serial number
   - More reliable than names
   - Add to import template

3. Manual linking after import
   - Edit work order
   - Select correct equipment
```

**"Dates not parsing correctly"**

```
Problem: Dates showing incorrectly or not importing

Solutions:
1. Use ISO format: YYYY-MM-DD
   - "2024-01-15" (correct)
   - "01/15/2024" (may fail)
   - "15 Jan 2024" (may fail)

2. Specify date format during upload
   - Select your format from dropdown
   - Preview before confirming

3. Check regional settings
   - Australian: DD/MM/YYYY
   - US: MM/DD/YYYY
   - Be explicit
```

**"Low confidence extractions"**

```
Problem: AI extraction confidence is low

Solutions:
1. Improve scan quality
   - 300 DPI minimum
   - Good contrast
   - Straight alignment

2. Use structured templates
   - Standard formats extract better
   - Consider reformatting

3. Manual entry for critical data
   - Some handwritten records need human
   - Flag for manual processing
```

**"Missing historical records"**

```
Problem: Can't find old service records

Solutions:
1. Contact previous contractors
   - Request service history
   - They may have records

2. Check building files
   - Previous manager records
   - Filing cabinets
   - Email archives

3. Request from equipment manufacturer
   - Service portal access
   - Historical reports

4. Start fresh
   - Begin tracking from today
   - History builds over time
```

---

## Migration Support

### Self-Service Resources

- [Video: How to Import Equipment](tutorials/import-equipment.mp4)
- [Video: How to Import Work Orders](tutorials/import-workorders.mp4)
- [Video: How to Import Compliance Docs](tutorials/import-compliance.mp4)
- [Template Downloads](templates/)
- [FAQ: Migration Questions](../faq.md#migration)

### Assisted Support

**Pro Tier:**
- Email support for migration questions
- One-time migration assistance ($299 optional)
- Template customization

**Enterprise Tier:**
- Dedicated migration specialist
- Custom integration development
- On-site assistance available
- Included in contract

### Contact

```
Migration Support
─────────────────────────────────────────
Email: migration@sitesync.com
Schedule Call: sitesync.com/migration-help
Response Time: Within 24 hours
```

---

**[← Back to Quick Start](../tutorials/quick-start.md)** | **[Next: Security & Compliance →](../explanation/security-compliance.md)**
