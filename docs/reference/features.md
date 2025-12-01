# SiteSync V3 - Features

## Complete Feature Specification

> This document details all features of SiteSync V3, from core functionality to breakthrough innovations.

---

## Core Features

### 1. Building Data Ownership

**What It Is:**
Buildings own their complete service history permanently, regardless of which contractors perform the work.

**Key Capabilities:**
- Complete service history tied to the building
- History persists through contractor changes
- Full audit trail with tamper-proof integrity
- Export capabilities for property transactions
- AI insights accumulated over building lifetime

**User Experience:**
- Building managers see unified history from all contractors
- New contractors see complete context from day one
- Equipment quirks and patterns are preserved
- Compliance documentation always available

---

### 2. Multi-Level Visibility

**Site Level:**
- Building Health Score (0-100)
- All trades summary
- Open jobs across all trades
- Cost tracking (YTD, monthly)
- Upcoming maintenance schedule
- Recent activity feed

**Trade Level:**
- Trade-specific health score
- All equipment in that trade
- Service provider history
- Performance comparisons
- AI insights for the trade

**Equipment Level:**
- Complete timeline (all contractors)
- Equipment specifications
- Known quirks (AI-learned)
- Documents and manuals
- Predictive insights
- Compliance certificates

---

### 3. AI-Powered Diagnosis

**Triforce AI System:**
- Multi-model jury (Gemini, Claude, GPT-4)
- Consensus voting for reliability
- Knowledge base validation
- Structured, actionable outputs

**Diagnosis Capabilities:**
- Fault code interpretation
- Symptom analysis
- Probable cause ranking
- Diagnostic step recommendations
- Parts prediction
- Time estimation
- Safety notes

**Output Example:**
```
Fault: F505 on KONE MonoSpace
Confidence: 87%
Primary Cause: Door zone sensor fault
Diagnostic Steps:
1. Check sensor alignment
2. Test sensor output
3. Inspect wiring
Parts Likely Needed: KM-DZ-505 ($85)
Estimated Time: 90 minutes
Similar Cases Resolved: 847
```

---

### 4. Building Health Score

**What It Measures:**
| Component | Weight | Description |
|-----------|--------|-------------|
| Equipment Condition | 25% | Age, wear, recent issues |
| Maintenance Compliance | 25% | Scheduled vs actual |
| Incident Frequency | 20% | Breakdowns, callbacks |
| First-Time Fix Rate | 15% | Resolution efficiency |
| Predictive Risk | 15% | AI-assessed future risk |

**Features:**
- Single score (0-100) for entire building
- Breakdown by trade
- Trend tracking over time
- Comparison to similar buildings
- Predictive forecasting
- Actionable recommendations

---

### 5. Work Order Management

**Lifecycle:**
```
Draft → Pending → Scheduled → In Progress → Completed → Invoiced
                     ↓
                  On Hold
                     ↓
                 Cancelled
```

**Features:**
- AI-assisted creation (auto-suggests priority, type)
- Smart assignment (considers skills, location, availability)
- Real-time status tracking
- Parts and labor logging
- Photo and document attachments
- AI diagnosis integration
- Auto-generated reports
- Callback tracking

**Priority Levels:**
| Priority | Response Target | Use Case |
|----------|-----------------|----------|
| Emergency | Immediate | People trapped, safety issue |
| High | Same day | Equipment out of service |
| Medium | 48 hours | Degraded operation |
| Low | 1 week | Minor issues |
| Scheduled | Planned date | Preventive maintenance |

---

### 6. Van Stock Management

**Inventory Tracking:**
- Real-time stock levels per technician
- Minimum stock alerts
- Auto-reorder suggestions
- Stock transfer between technicians
- Usage history and trends

**Nearby Parts Feature:**
- Locate parts in nearby technicians' vans
- Distance and availability shown
- One-tap contact to request
- Part sharing workflow

**Van Stock Dashboard:**
```
MY VAN STOCK
────────────────────────────────────
Part             Qty  Min  Status
────────────────────────────────────
Door Sensor       2    1   ● OK
Interlock Switch  1    1   ● OK
Encoder Belt      0    1   ○ LOW
Safety Contacts   3    2   ● OK
────────────────────────────────────
[Reorder Low Stock] [Transfer Parts]
```

---

### 7. Parts Marketplace

**Listing Types:**
- Peer-to-peer (tech to tech)
- Company surplus
- Supplier listings
- Used/refurbished parts

**Features:**
- Search by part number, manufacturer
- Condition ratings (new, refurbished, used)
- Location-based results
- Price comparison
- Seller ratings
- Secure transactions

**Revenue Model:**
- 5% transaction fee (peer-to-peer)
- 3% transaction fee (suppliers)
- Premium placement options

---

### 8. Technician Professional Profiles

**Profile Components:**
- Verified job history
- Expertise score (0-100)
- First-time fix rate
- Specializations
- Certifications
- Knowledge contributions
- Endorsements
- Badges and achievements

**Career Features:**
- Resume integration
- Employer search
- Opportunity matching
- Career progression tracking
- Skills development paths

**Privacy Controls:**
- Public / Employers only / Private
- Anonymous contributions option
- Control over visibility

---

### 9. Collective Knowledge Base

**Content Types:**
- Fault solutions
- Quick tips
- Procedures
- Equipment quirks
- Safety notes

**How It Works:**
1. Technician solves problem
2. Documents solution
3. AI validates and enhances
4. Community accesses
5. Usage tracked for reputation

**Search Capabilities:**
- Natural language queries
- Fault code lookup
- Equipment-specific filtering
- AI-synthesized answers

---

### 10. Compliance Management

**Tracking:**
- Inspection schedules
- Certificate management
- Regulatory requirements
- Compliance status dashboard

**Automation:**
- Due date reminders
- Auto-scheduling
- Certificate expiry alerts
- Compliance reporting

**Audit Trail:**
- Immutable event log
- Hash-chain integrity
- Export for regulators
- Due diligence reports

---

## Multi-Trade Support

### Supported Trades

| Trade | Status | AI Specialization |
|-------|--------|-------------------|
| Lifts & Escalators | Launch | Lift AI (full) |
| HVAC | Phase 2 | HVAC AI |
| Electrical | Phase 2 | Electrical AI |
| Plumbing | Phase 2 | Plumbing AI |
| Fire Systems | Phase 2 | Fire AI |
| Security | Phase 3 | Security AI |
| Painting/Fit-out | Phase 3 | Basic |
| Removalists | Phase 3 | Basic |

### Trade-Specific Features

**Each Trade Gets:**
- Specialized AI models
- Trade-specific fault codes
- Relevant compliance tracking
- Appropriate scheduling rules
- Trade knowledge base

---

## Emergency Response

### Category System

**Category 1 - Immediate (People Safety):**
- People trapped in lift
- Fire/smoke detected
- Active flooding
- Security breach

**Response:** Instant alert, auto-dispatch nearest qualified tech

**Category 2 - Urgent (Building Impact):**
- Lift out of service (single-lift building)
- HVAC failure in extreme weather
- Power failure
- Fire system fault

**Response:** 1-hour target, escalation protocols

**Category 3 - Standard:**
- Intermittent faults
- Comfort complaints
- Minor damage
- Vandalism

**Response:** Next business day

### Emergency Flow

```
Report Received
      │
      ▼
AI Categorizes (Cat 1/2/3)
      │
      ▼
Auto-Dispatch if Cat 1
      │
      ▼
Technician Notified
      │
      ▼
Building Gets ETA
      │
      ▼
En-Route Updates
      │
      ▼
Resolution + Report
```

---

## Breakthrough Innovations

### 1. AI Vision

**Capability:** Point camera at equipment, get instant identification and context.

**Features:**
- Nameplate OCR
- Equipment identification
- Auto-download relevant manual
- Show equipment history
- Display known quirks

### 2. Voice-First Interface

**Capability:** Speak naturally, get AI assistance without typing.

**Features:**
- Symptom description by voice
- Voice-activated diagnosis
- Hands-free report dictation
- Voice search in knowledge base

### 3. Smart Scheduling

**Capability:** AI-optimized daily schedules for technicians.

**Features:**
- Route optimization
- Traffic consideration
- Priority balancing
- Skill matching
- Part availability awareness

### 4. Predictive Maintenance

**Capability:** AI predicts failures before they happen.

**Features:**
- Pattern analysis across fleet
- Wear prediction models
- Proactive alerts
- "Motor will need attention in 3 months"

### 5. Self-Writing Reports

**Capability:** Complete professional reports generated automatically.

**Features:**
- Job data synthesis
- Professional language
- Building manager appropriate
- One-tap send
- Template customization

### 6. Colleague Finder

**Capability:** Find nearby expert when stuck.

**Features:**
- Skill-matched search
- Proximity awareness
- Availability status
- Context briefing for helper
- "Maria is 2km away, she's solved this 12 times"

### 7. Anonymous Knowledge Network

**Capability:** Share knowledge without employer attribution.

**Features:**
- Anonymous contribution option
- Knowledge still tracked privately
- No fear of retaliation
- Build the commons

### 8. Building Health Score

**Capability:** Single number representing building condition.

**Features:**
- 0-100 score
- Multi-factor calculation
- Trend analysis
- Peer comparison
- Predictive forecasting

---

## Integrations

### Native Integrations

| System | Integration Type |
|--------|------------------|
| Google Workspace | Calendar, Drive |
| Microsoft 365 | Outlook, SharePoint |
| Xero | Invoicing |
| MYOB | Accounting |
| QuickBooks | Accounting |

### API Capabilities

- REST API (full CRUD)
- Webhooks (real-time events)
- OAuth 2.0 authentication
- Rate limiting
- OpenAPI 3.1 spec

### Future Integrations

- BMS connectors
- IoT device integration
- Manufacturer APIs
- ERP systems

---

## Mobile Experience

### Progressive Web App (PWA)

**Features:**
- Works offline
- Push notifications
- Home screen install
- Camera access
- GPS integration

### Offline Capabilities

- View assigned jobs
- Access equipment history
- Log work (syncs when online)
- Access downloaded manuals
- Use cached knowledge

### Auto-Offline Mode

**Capability:** Automatically switches to high-contrast offline mode when entering areas with no signal (elevator shafts).

**Features:**
- Signal strength detection
- Auto-mode switch
- Flashlight integration
- Essential data cached
- Auto-sync on reconnection

---

## Reporting

### Standard Reports

- Work order summary
- Contractor performance
- Equipment health
- Compliance status
- Cost analysis
- Building health trends

### Custom Reports

- Report builder
- Scheduled delivery
- Multiple formats (PDF, Excel)
- Branding options

### AI-Generated Reports

- Natural language summaries
- Trend analysis
- Recommendations
- Executive briefings

---

**[← Back to API Reference](api.md)** | **[Next: Implementation →](implementation.md)**
