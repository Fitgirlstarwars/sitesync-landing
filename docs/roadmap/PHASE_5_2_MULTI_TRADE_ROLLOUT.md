# Phase 5.2: Multi-Trade Rollout

> Detailed implementation specification for expanding beyond elevators to other building trades
> Status: Design Phase
> Priority: HIGH (for growth) - Massive market expansion opportunity
> Dependencies: Phases 0-4 substantially complete, proven model

---

## Overview

The Multi-Trade Rollout expands SiteSync from an elevator-focused platform to a comprehensive building services operating system covering:

1. **HVAC** - Heating, ventilation, and air conditioning
2. **Electrical** - Power systems and lighting
3. **Plumbing** - Water and waste systems
4. **Fire Safety** - Fire alarm and suppression systems
5. **Security** - Access control and surveillance

---

## User Stories

### As a Building Owner:

1. **US-MTR001:** I want all building systems in one platform so I have unified visibility
2. **US-MTR002:** I want cross-system insights so I understand building health holistically
3. **US-MTR003:** I want consolidated vendor management so I reduce administrative overhead
4. **US-MTR004:** I want unified compliance tracking so nothing falls through the cracks

### As a Facilities Manager:

5. **US-MTR005:** I want one dashboard for all systems so I manage efficiently
6. **US-MTR006:** I want to see system interdependencies so I understand impacts
7. **US-MTR007:** I want unified work order management so operations are streamlined
8. **US-MTR008:** I want consolidated reporting so I demonstrate portfolio performance

### As a Multi-Trade Contractor:

9. **US-MTR009:** I want to offer multiple services through one platform so I grow revenue
10. **US-MTR010:** I want cross-trade technician visibility so I deploy resources efficiently
11. **US-MTR011:** I want unified scheduling so I coordinate multi-trade work

---

## Feature Breakdown

### 5.2.1 Trade-Specific Modules

#### 5.2.1.1 HVAC Module

**Equipment Types:**

| Type | Subtypes | Key Metrics |
|------|----------|-------------|
| Chillers | Centrifugal, Absorption, Scroll | Efficiency, runtime, refrigerant |
| Boilers | Gas, Electric, Steam | Efficiency, emissions |
| AHUs | Rooftop, Indoor, Makeup | Airflow, filter status |
| VRF/VRV | Heat pump, Heat recovery | Zone performance |
| Cooling Towers | Induced draft, Forced draft | Water quality, efficiency |
| Split Systems | Ducted, Ductless | Temperature, runtime |

**HVAC-Specific Features:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    HVAC MODULE FEATURES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EQUIPMENT MANAGEMENT                                            │
│  ├── Equipment inventory with specifications                     │
│  ├── Refrigerant tracking (EPA compliance)                       │
│  ├── Filter change tracking                                      │
│  ├── Belt and drive maintenance                                  │
│  └── Control system integration                                  │
│                                                                  │
│  PERFORMANCE MONITORING                                          │
│  ├── Temperature/humidity monitoring                             │
│  ├── Energy consumption tracking                                 │
│  ├── Efficiency calculations                                     │
│  ├── Comfort complaints correlation                              │
│  └── Setpoint optimization                                       │
│                                                                  │
│  COMPLIANCE                                                      │
│  ├── Refrigerant reporting (EPA 608)                             │
│  ├── Air quality certifications                                  │
│  ├── Energy audits                                               │
│  └── Commissioning documentation                                 │
│                                                                  │
│  AI DIAGNOSIS                                                    │
│  ├── Fault detection (FDD)                                       │
│  ├── Energy anomaly detection                                    │
│  ├── Predictive maintenance                                      │
│  └── Optimization recommendations                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**HVAC Data Model:**

```python
# sitesync_v3/domains/hvac/models.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from enum import Enum

class HVACEquipmentType(str, Enum):
    CHILLER = "chiller"
    BOILER = "boiler"
    AHU = "ahu"
    RTU = "rtu"
    VRF = "vrf"
    COOLING_TOWER = "cooling_tower"
    SPLIT_SYSTEM = "split_system"
    FAN_COIL = "fan_coil"
    PUMP = "pump"

class HVACEquipment(BaseModel):
    """HVAC equipment record."""

    id: UUID
    site_id: UUID
    organization_id: UUID

    # Equipment info
    equipment_type: HVACEquipmentType
    designation: str  # "CH-1", "AHU-3"
    manufacturer: str
    model: str
    serial_number: str

    # Capacity
    cooling_capacity_tons: float | None
    heating_capacity_btuh: float | None
    airflow_cfm: float | None

    # Refrigerant (if applicable)
    refrigerant_type: str | None
    refrigerant_charge_lbs: float | None

    # Location
    location_description: str
    serves_areas: list[str]

    # Installation
    installation_date: date
    expected_life_years: int

    # Current status
    status: str  # 'operational', 'degraded', 'out_of_service'
    last_maintenance: date | None

    # Compliance
    epa_registered: bool
    last_leak_check: date | None

class RefrigerantLog(BaseModel):
    """Refrigerant tracking for EPA compliance."""

    id: UUID
    equipment_id: UUID

    # Transaction
    transaction_type: str  # 'charge', 'recovery', 'leak_repair'
    refrigerant_type: str
    quantity_lbs: float

    # Details
    technician_id: UUID
    technician_epa_cert: str
    work_order_id: UUID | None

    # Date
    transaction_date: date
    notes: str | None
```

#### 5.2.1.2 Electrical Module

**Equipment Types:**

| Type | Subtypes | Key Metrics |
|------|----------|-------------|
| Transformers | Dry, Oil-filled | Temperature, load |
| Switchgear | Low/Medium voltage | Arc flash, maintenance |
| Generators | Diesel, Natural gas | Runtime, fuel, load test |
| UPS | Online, Line-interactive | Battery health, load |
| Lighting | LED, Fluorescent, Controls | Energy, lamp life |
| EV Charging | Level 2, DC Fast | Utilization, energy |

#### 5.2.1.3 Plumbing Module

**Equipment Types:**

| Type | Subtypes | Key Metrics |
|------|----------|-------------|
| Water Heaters | Tank, Tankless, Heat pump | Efficiency, temperature |
| Pumps | Domestic, Fire, Sump | Flow, pressure, runtime |
| Backflow | RPZ, Double check | Test dates, compliance |
| Water Treatment | Softeners, Filtration | Quality, filter life |
| Grease Traps | Gravity, Automatic | Pumping schedule |

#### 5.2.1.4 Fire Safety Module

**Equipment Types:**

| Type | Subtypes | Key Metrics |
|------|----------|-------------|
| Fire Alarm | Addressable, Conventional | Test dates, faults |
| Sprinkler | Wet, Dry, Pre-action | Inspection, impairments |
| Fire Pumps | Electric, Diesel | Weekly tests, flow tests |
| Extinguishers | ABC, CO2, K-class | Inspection, hydro test |
| Suppression | Clean agent, Wet chem | Inspection, recharge |

#### 5.2.1.5 Security Module

**Equipment Types:**

| Type | Subtypes | Key Metrics |
|------|----------|-------------|
| Access Control | Card, Biometric, Mobile | Doors, credentials |
| Video | IP cameras, NVR | Camera count, storage |
| Intrusion | Motion, Glass break | Zones, monitoring |
| Intercom | Audio, Video | Units, integration |

---

### 5.2.2 Cross-Trade Integration

#### 5.2.2.1 Unified Dashboard

**Cross-Trade Views:**

```python
class BuildingSystemsOverview(BaseModel):
    """Unified view of all building systems."""

    site_id: UUID
    as_of: datetime

    # System summaries
    systems: list[dict]
    # [{
    #     "system": "elevators",
    #     "equipment_count": 6,
    #     "operational": 6,
    #     "health_score": 85,
    #     "open_work_orders": 2,
    #     "next_inspection": date
    # }, {
    #     "system": "hvac",
    #     "equipment_count": 12,
    #     "operational": 11,
    #     "health_score": 78,
    #     "open_work_orders": 5,
    #     "next_inspection": date
    # }, ...]

    # Overall metrics
    overall_health_score: int
    total_equipment: int
    total_operational: int
    total_open_work_orders: int

    # Cross-system alerts
    alerts: list[dict]
    # [{"system": "hvac", "message": "Chiller efficiency below threshold"}]

    # Compliance summary
    compliance_status: dict
    # {"compliant": 18, "due_soon": 3, "overdue": 1}
```

#### 5.2.2.2 Trade-Specific AI Training

**AI Model per Trade:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRADE-SPECIFIC AI                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ELEVATORS (Existing)                                            │
│  ├── Fault code diagnosis                                        │
│  ├── Failure prediction                                          │
│  └── Knowledge base: Comprehensive                               │
│                                                                  │
│  HVAC (New)                                                      │
│  ├── Fault detection & diagnostics                               │
│  ├── Energy optimization                                         │
│  ├── Comfort complaint analysis                                  │
│  └── Knowledge base: Build from scratch                          │
│                                                                  │
│  ELECTRICAL (New)                                                │
│  ├── Load analysis                                               │
│  ├── Preventive maintenance timing                               │
│  └── Knowledge base: Build from scratch                          │
│                                                                  │
│  FIRE SAFETY (New)                                               │
│  ├── Compliance tracking AI                                      │
│  ├── False alarm analysis                                        │
│  └── Knowledge base: Code-focused                                │
│                                                                  │
│  TRAINING APPROACH:                                              │
│  ├── Start with manufacturer documentation                       │
│  ├── Incorporate industry standards                              │
│  ├── Learn from work order data                                  │
│  └── Crowdsource technician knowledge                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5.2.3 Rollout Strategy

**Trade Launch Sequence:**

| Phase | Trade | Rationale | Timeline |
|-------|-------|-----------|----------|
| 1 | HVAC | Largest market, similar dynamics | Month 1-4 |
| 2 | Fire Safety | Compliance-heavy, clear requirements | Month 3-6 |
| 3 | Electrical | Growing complexity, EV growth | Month 5-8 |
| 4 | Plumbing | Mature market, simpler needs | Month 7-10 |
| 5 | Security | Tech-forward, IoT integration | Month 9-12 |

---

## Success Metrics

### Phase 5.2 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Trades active | 3+ | Beyond elevators |
| Multi-trade buildings | 500+ | Buildings with 2+ trades |
| Cross-trade revenue | 40%+ | % from non-elevator |
| Multi-trade contractors | 100+ | Contractors using 2+ trades |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
