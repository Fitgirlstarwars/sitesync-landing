# Why SiteSync?

> The philosophy behind building-centric service management

## The Problem

### Buildings Lose Their Memory

When a building changes service contractors, history disappears:

- **10 years of service records** → Gone
- **Equipment quirks learned** → Forgotten
- **Patterns identified** → Lost
- **New contractor starts** → From zero

This happens every contract change. Knowledge evaporates.

### Contractors Own Your Data

Traditional model:

```
Building → hires → Contractor → uses → Their Software → stores → Your Data
```

When the relationship ends, so does your access.

### Information Silos

Different trades, different systems:

| Trade | Typical System |
|-------|----------------|
| Lifts | Spreadsheet or paper |
| HVAC | Different spreadsheet |
| Fire | Compliance folder |
| Electrical | Contractor's system |

No unified view. No cross-trade insights.

---

## The Solution

### Building-Centric Model

Flip the ownership:

```
Building → owns → SiteSync → manages → All Service Data
                      ↑
               Contractors access (temporarily)
```

**The building is permanent. Contractors are temporary workers.**

### One Platform, All Trades

Instead of six systems for six trades:

| Before | After |
|--------|-------|
| Lift spreadsheet | SiteSync |
| HVAC spreadsheet | SiteSync |
| Fire compliance folder | SiteSync |
| Electrical contractor system | SiteSync |
| Plumbing emails | SiteSync |
| Security vendor portal | SiteSync |

One dashboard. One history. One source of truth.

### AI That Learns Forever

Every service visit teaches the system:

- "This KONE throws false F505 errors on humid days"
- "Door operator adjusted 12 times → needs replacement"
- "Similar issue last year → check relay first"

Knowledge accumulates. AI gets smarter. Building gets better.

---

## Core Principles

### 1. Invisible AI

**Wrong:**
- "Our AI chatbot will help you!"
- "Powered by GPT-4" badge
- "AI is thinking..." spinner

**Right:**
- Form auto-fills before you type
- Diagnosis appears instantly
- Report writes itself

The best AI is the AI you don't notice.

### 2. Confirm, Don't Create

AI never takes action automatically. But confirmation is frictionless:

| AI Confidence | User Experience |
|---------------|-----------------|
| High (95%+) | "Likely sensor. Order it?" → One tap |
| Medium (70-95%) | "Could be A, B, or C" → Tap to choose |
| Low (<70%) | "What do you see?" → Photo/voice input |

Human always in control. AI removes friction.

### 3. Building Health Score

One number (0-100) that answers: "How's my building?"

**Calculated from:**
- Equipment age and condition
- Maintenance compliance
- Incident frequency
- First-time fix rate
- Predictive risk

**Comparable:**
- Your building vs. last year
- Your building vs. similar buildings
- Your building vs. portfolio average

### 4. Contractor Freedom

Because you own your data, you can:
- Switch contractors with zero data loss
- Get competitive bids with full history shared
- Compare contractor performance objectively
- Never be locked in

---

## Who Benefits

### Building Managers

| Pain Point | Solution |
|------------|----------|
| "What's the history on Lift 2?" | Complete timeline, all contractors |
| "When's the fire inspection due?" | Compliance dashboard |
| "How do we compare?" | Benchmark against similar buildings |
| "Prove we maintain properly" | Immutable audit trail |

### Technicians

| Pain Point | Solution |
|------------|----------|
| "What's wrong with this unit?" | AI diagnosis + equipment history |
| "Do I have that part?" | Van stock lookup |
| "Who's nearby with expertise?" | Find colleague |
| "Paperwork takes forever" | Auto-generated reports |

### Service Companies

| Pain Point | Solution |
|------------|----------|
| "Training new techs is slow" | AI guidance + knowledge base |
| "First-time fix rate is low" | Better diagnosis, right parts |
| "Scheduling is manual" | AI-optimized routing |
| "Invoicing is delayed" | Instant job completion → invoice |

---

## The Market Opportunity

### Why Now?

1. **AI is ready** — LLMs can now understand technical documents and diagnose faults
2. **Incumbents are stuck** — Legacy business models prevent innovation
3. **Mobile is everywhere** — Technicians have smartphones in their pockets
4. **Data is valuable** — Buildings realize their history has worth

### Counter-Positioning

| Incumbent (ServiceTitan) | SiteSync |
|--------------------------|----------|
| $299-899/month | $29/month |
| Weeks to set up | 5 minutes |
| Dedicated hardware | Any device |
| Per-seat pricing | Per-building pricing |
| 21 trades (shallow) | All trades (deep) |

We're not competing on features. We're competing on model.

---

## Development Roadmap

### Months 1-6 — Foundation
**Goal:** Core platform you can actually use

| Module | What it does |
|--------|--------------|
| Database | PostgreSQL + pgvector + Row-Level Security |
| Auth | JWT tokens, sessions, password reset |
| Organizations | Multi-tenant root, settings, billing |
| Users | Roles, permissions, invitations |
| Sites | Buildings/locations, addresses, contacts |
| Assets | Equipment registry, multi-trade, specs |

**Delivers:** Create org → add building → register equipment

---

### Months 7-12 — Work Management
**Goal:** Track jobs from report to resolution

| Module | What it does |
|--------|--------------|
| Work Orders | Full lifecycle, status workflow, priorities |
| Contractors | Workforce registry, skills, rates |
| Scheduling | Assignment, calendar, availability |
| Labor | Time tracking, costs |
| Web Dashboard | Manager view — sites, assets, jobs |
| Mobile App v1 | Technician view — my jobs, basic updates |

**Delivers:** Report problem → assign tech → complete job → record history

---

### Months 13-18 — Intelligence
**Goal:** AI that helps without getting in the way

| Module | What it does |
|--------|--------------|
| AI Diagnosis | Single-model analysis of faults |
| Fault Codes | Database of codes by manufacturer |
| Knowledge Base | Manuals, procedures, tribal knowledge |
| Suggested Parts | AI recommends what you'll need |
| Equipment Insights | "This unit has a humidity issue" |

**Delivers:** Create work order → AI suggests cause + parts + history

---

### Months 19-24 — Inventory & Compliance
**Goal:** Track parts, stay compliant

| Module | What it does |
|--------|--------------|
| Inventory | Parts catalog, costs, compatibility |
| Stock Locations | Warehouse, van stock, site stock |
| Parts Used | Link parts to jobs, auto-deduct |
| Compliance Schedules | Inspections, certifications, deadlines |
| Audit Trail | Immutable log, hash chain, tamper-proof |

**Delivers:** Know what parts you have → use on job → auto-reorder → never miss inspection

---

### Months 25-30 — Marketplace & API
**Goal:** Connect to the world

| Module | What it does |
|--------|--------------|
| Marketplace | List parts for sale, search, buy |
| Transactions | Payments, escrow, reviews |
| Public API | REST endpoints for everything |
| Webhooks | Push events to external systems |
| Integrations | Xero, MYOB, common BMS systems |

**Delivers:** Sell excess parts → buy what you need → sync with accounting

---

### Months 31-36 — Advanced AI
**Goal:** Predict, don't just diagnose

| Module | What it does |
|--------|--------------|
| Triforce | Multi-model consensus (Gemini + Claude + GPT) |
| Predictive Maintenance | "This will fail in 3 weeks" |
| Failure Probability | Risk scores per asset |
| Smart Scheduling | AI-optimized routes and timing |
| Cross-Trade Insights | "HVAC failure causing lift overheating" |

**Delivers:** Fix things before they break

---

### Months 37-42 — Mobile & Offline
**Goal:** Works everywhere, even underground

| Module | What it does |
|--------|--------------|
| Offline-First | Full functionality without signal |
| Background Sync | Queue changes, sync when online |
| Push Notifications | Real-time alerts |
| Voice Input | Speak notes, hands-free |
| Smart Caching | Pre-load today's jobs + assets |

**Delivers:** Walk into basement → keep working → sync when you surface

---

### Months 43-48 — Automation
**Goal:** System runs itself, humans confirm

| Module | What it does |
|--------|--------------|
| Auto Work Orders | Sensor triggers create jobs automatically |
| Compliance Auto-Schedule | Never miss a deadline |
| Smart Notifications | Right person, right time, right channel |
| Workflow Rules | "If X then Y" without code |
| Enterprise | SSO, advanced permissions, white-label |

**Delivers:** Problem detected → job created → tech dispatched → you just approve

---

### Months 49-54 — Network Intelligence
**Goal:** Every building makes every building smarter

| Module | What it does |
|--------|--------------|
| Anonymous Aggregation | Learn from all buildings (privacy-safe) |
| Benchmarking | "Your HVAC costs 20% more than similar buildings" |
| Pattern Detection | Industry-wide failure patterns |
| Shared Knowledge | Opt-in solutions database |

**Delivers:** Diagnose rare fault using data from 10,000 other buildings

---

### Months 55-60 — Platform
**Goal:** We give buildings a memory

| Module | What it does |
|--------|--------------|
| App Ecosystem | Third-party apps on SiteSync |
| Partner API | Deep integrations for vendors |
| Advanced Analytics | Custom reports, BI export |
| Building Memory | Complete, searchable, permanent history |

**Delivers:** Every building remembers everything. Forever.

---

## Further Reading

- [Multi-Trade Architecture](../reference/data-model.md) — How we handle all trades
- [Triforce AI](triforce-ai.md) — How the AI system works
- [Quick Start](../tutorials/quick-start.md) — Try it yourself

---

**[← Back to Docs](../README.md)**
