# Phase 4.4: IoT & Hardware Platform

> Detailed implementation specification for sensor integration and predictive maintenance
> Status: Design Phase
> Priority: MEDIUM - Future-facing technology integration
> Dependencies: Phase 3.1 (Manufacturer Integration), Phase 0 (Core Platform)

---

## Overview

The IoT & Hardware Platform creates a sensor-driven intelligence layer that:

1. **Integrates** sensors and telemetry from equipment and buildings
2. **Monitors** equipment health in real-time with anomaly detection
3. **Predicts** failures before they occur using machine learning
4. **Optimizes** maintenance schedules based on actual condition
5. **Enables** new diagnostic capabilities with hardware partnerships

---

## User Stories

### As a Building Owner:

1. **US-IOT001:** I want real-time equipment health visibility so I catch problems early
2. **US-IOT002:** I want to predict failures before they happen so I avoid costly downtime
3. **US-IOT003:** I want to optimize maintenance based on actual usage so I save money
4. **US-IOT004:** I want alerts for abnormal conditions so I can respond proactively
5. **US-IOT005:** I want usage analytics so I understand my equipment better

### As a Service Company:

6. **US-IOT006:** I want remote diagnostics so I can prepare before site visits
7. **US-IOT007:** I want predictive alerts so I can prevent emergency calls
8. **US-IOT008:** I want condition data for maintenance planning so I'm more efficient
9. **US-IOT009:** I want to monitor my entire portfolio remotely so I scale operations
10. **US-IOT010:** I want integration with diagnostic tools so my data flows seamlessly

### As a Technician:

11. **US-IOT011:** I want to see equipment trends before arriving so I know what to expect
12. **US-IOT012:** I want AR/VR support for complex repairs so I get guidance
13. **US-IOT013:** I want mobile tools that sync with the platform so my work is documented

### As a Manufacturer:

14. **US-IOT014:** I want telemetry from field equipment so I improve products
15. **US-IOT015:** I want to push firmware updates remotely so equipment stays current
16. **US-IOT016:** I want predictive insights to share with customers so we add value

---

## Feature Breakdown

### 4.4.1 Sensor Integration Platform

#### 4.4.1.1 Device Registration & Management

**API Endpoints:**

```
POST   /api/v1/devices                                   # Register device
GET    /api/v1/devices                                   # List devices
GET    /api/v1/devices/{id}                              # Get device details
PUT    /api/v1/devices/{id}                              # Update device
DELETE /api/v1/devices/{id}                              # Decommission device
GET    /api/v1/devices/{id}/status                       # Get device status
POST   /api/v1/devices/{id}/command                      # Send command
GET    /api/v1/buildings/{id}/devices                    # Building's devices
GET    /api/v1/equipment/{id}/devices                    # Equipment's devices
```

**Supported Device Types:**

| Device Type | Data Collected | Use Case |
|-------------|----------------|----------|
| `vibration_sensor` | Acceleration, frequency | Motor/bearing health |
| `temperature_sensor` | Temperature, humidity | Machine room monitoring |
| `current_sensor` | Amperage, power factor | Motor performance |
| `door_sensor` | Cycle count, dwell time | Door performance |
| `load_sensor` | Weight, distribution | Usage patterns |
| `position_sensor` | Floor position, leveling | Positioning accuracy |
| `air_quality` | CO2, particles | Cabin environment |
| `acoustic_sensor` | Sound levels, patterns | Noise detection |
| `camera` | Visual inspection | Remote inspection |

**Device Schema:**

```python
# sitesync_v3/domains/iot/contracts.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from enum import Enum

class DeviceType(str, Enum):
    VIBRATION_SENSOR = "vibration_sensor"
    TEMPERATURE_SENSOR = "temperature_sensor"
    CURRENT_SENSOR = "current_sensor"
    DOOR_SENSOR = "door_sensor"
    LOAD_SENSOR = "load_sensor"
    POSITION_SENSOR = "position_sensor"
    AIR_QUALITY = "air_quality"
    ACOUSTIC_SENSOR = "acoustic_sensor"
    CAMERA = "camera"
    GATEWAY = "gateway"
    CONTROLLER_INTERFACE = "controller_interface"

class DeviceStatus(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    DEGRADED = "degraded"
    MAINTENANCE = "maintenance"
    ERROR = "error"

class IoTDevice(BaseModel):
    """IoT device record."""

    id: UUID
    device_serial: str

    # Device info
    device_type: DeviceType
    manufacturer: str
    model: str
    firmware_version: str

    # Installation
    building_id: UUID
    equipment_id: UUID | None
    installation_location: str
    installed_at: datetime
    installed_by: str

    # Connectivity
    gateway_id: UUID | None  # Parent gateway if applicable
    connection_type: str  # 'wifi', 'cellular', 'lorawan', 'zigbee', 'wired'
    ip_address: str | None
    mac_address: str | None

    # Status
    status: DeviceStatus
    last_seen: datetime
    battery_level: int | None  # For battery-powered devices
    signal_strength: int | None

    # Configuration
    sampling_interval_seconds: int
    reporting_interval_seconds: int
    alert_thresholds: dict | None

    # Calibration
    last_calibrated: datetime | None
    calibration_due: datetime | None

    # Metadata
    created_at: datetime
    updated_at: datetime

class DeviceRegistration(BaseModel):
    """Request to register a new device."""

    device_serial: str
    device_type: DeviceType
    manufacturer: str
    model: str

    # Installation
    building_id: UUID
    equipment_id: UUID | None
    installation_location: str

    # Connectivity
    connection_type: str
    gateway_id: UUID | None

    # Configuration
    sampling_interval_seconds: int = 60
    reporting_interval_seconds: int = 300
```

**Database Schema:**

```sql
-- IoT devices
CREATE TABLE iot_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_serial VARCHAR(100) UNIQUE NOT NULL,

    -- Device info
    device_type VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    firmware_version VARCHAR(50),

    -- Installation
    building_id UUID NOT NULL REFERENCES sites(id),
    equipment_id UUID REFERENCES elevators(id),
    installation_location VARCHAR(255),
    installed_at TIMESTAMPTZ,
    installed_by VARCHAR(255),

    -- Connectivity
    gateway_id UUID REFERENCES iot_devices(id),
    connection_type VARCHAR(30) NOT NULL,
    ip_address INET,
    mac_address MACADDR,

    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'offline',
    last_seen TIMESTAMPTZ,
    battery_level INTEGER,
    signal_strength INTEGER,

    -- Configuration
    sampling_interval_seconds INTEGER DEFAULT 60,
    reporting_interval_seconds INTEGER DEFAULT 300,
    alert_thresholds JSONB,

    -- Calibration
    last_calibrated TIMESTAMPTZ,
    calibration_due TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),

    CONSTRAINT valid_status CHECK (status IN ('online', 'offline', 'degraded', 'maintenance', 'error'))
);

-- Device telemetry (time-series, consider TimescaleDB)
CREATE TABLE device_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES iot_devices(id),
    equipment_id UUID REFERENCES elevators(id),

    -- Reading
    metric_name VARCHAR(100) NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    metric_unit VARCHAR(30),
    quality VARCHAR(20) DEFAULT 'good',  -- 'good', 'suspect', 'bad'

    -- Context
    timestamp TIMESTAMPTZ NOT NULL,
    operating_mode VARCHAR(50),

    -- Indexing
    PRIMARY KEY (device_id, timestamp, metric_name)
) PARTITION BY RANGE (timestamp);

-- Create monthly partitions
-- CREATE TABLE device_telemetry_2025_01 PARTITION OF device_telemetry
--     FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Device alerts
CREATE TABLE device_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES iot_devices(id),
    equipment_id UUID REFERENCES elevators(id),

    -- Alert
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    metric_name VARCHAR(100),
    threshold_value DOUBLE PRECISION,
    actual_value DOUBLE PRECISION,
    message TEXT,

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,

    -- Metadata
    triggered_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_severity CHECK (severity IN ('info', 'warning', 'critical'))
);

-- Indexes
CREATE INDEX idx_devices_building ON iot_devices(building_id);
CREATE INDEX idx_devices_equipment ON iot_devices(equipment_id);
CREATE INDEX idx_devices_status ON iot_devices(status);
CREATE INDEX idx_telemetry_device_time ON device_telemetry(device_id, timestamp DESC);
CREATE INDEX idx_telemetry_equipment_time ON device_telemetry(equipment_id, timestamp DESC);
CREATE INDEX idx_alerts_device ON device_alerts(device_id);
CREATE INDEX idx_alerts_active ON device_alerts(status) WHERE status = 'active';
```

#### 4.4.1.2 Data Ingestion Pipeline

**Ingestion Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA INGESTION PIPELINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SOURCES:                                                        │
│  ├── Direct device connections (MQTT, HTTP)                      │
│  ├── Gateway aggregation                                         │
│  ├── Manufacturer APIs                                           │
│  ├── BMS integration                                             │
│  └── Third-party monitoring systems                              │
│                                                                  │
│  INGESTION LAYER:                                                │
│  ├── Protocol handlers (MQTT, HTTP, CoAP)                        │
│  ├── Authentication & authorization                              │
│  ├── Rate limiting                                               │
│  ├── Data validation                                             │
│  └── Message queuing (Kafka/Redis)                               │
│                                                                  │
│  PROCESSING LAYER:                                               │
│  ├── Data normalization                                          │
│  ├── Unit conversion                                             │
│  ├── Quality scoring                                             │
│  ├── Anomaly detection (real-time)                               │
│  └── Aggregation (1min, 5min, 1hr)                               │
│                                                                  │
│  STORAGE LAYER:                                                  │
│  ├── Time-series database (raw data)                             │
│  ├── Aggregated metrics (PostgreSQL)                             │
│  ├── Hot storage (recent 24hrs in memory)                        │
│  └── Cold storage (archive to S3/GCS)                            │
│                                                                  │
│  OUTPUT:                                                         │
│  ├── Real-time dashboard updates                                 │
│  ├── Alert triggering                                            │
│  ├── ML model input                                              │
│  └── API access                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
POST   /api/v1/telemetry/ingest                          # Ingest telemetry batch
POST   /api/v1/telemetry/ingest/stream                   # WebSocket stream
GET    /api/v1/equipment/{id}/telemetry                  # Get equipment telemetry
GET    /api/v1/equipment/{id}/telemetry/latest           # Latest readings
GET    /api/v1/equipment/{id}/telemetry/history          # Historical data
GET    /api/v1/equipment/{id}/telemetry/aggregate        # Aggregated metrics
```

---

### 4.4.2 Real-Time Monitoring

#### 4.4.2.1 Equipment Health Dashboard

**Dashboard Components:**

```python
class EquipmentHealthDashboard(BaseModel):
    """Real-time health dashboard for equipment."""

    equipment_id: UUID
    equipment_name: str
    last_updated: datetime

    # Overall health
    health_score: int  # 0-100
    health_status: str  # 'healthy', 'attention', 'warning', 'critical'
    health_trend: str  # 'improving', 'stable', 'declining'

    # Current readings
    current_readings: dict
    # {
    #     "motor_temperature": {"value": 45, "unit": "°C", "status": "normal"},
    #     "vibration_level": {"value": 2.3, "unit": "mm/s", "status": "normal"},
    #     "door_cycle_time": {"value": 3.2, "unit": "s", "status": "normal"},
    #     "power_consumption": {"value": 12.5, "unit": "kW", "status": "normal"}
    # }

    # Trends (24hr)
    trends: list[dict]
    # [{"metric": "motor_temperature", "data": [...], "trend": "stable"}]

    # Active alerts
    active_alerts: list[dict]
    # [{"severity": "warning", "message": "...", "since": datetime}]

    # Recent events
    recent_events: list[dict]
    # [{"type": "door_fault", "time": datetime, "details": "..."}]

    # Predictions
    predictions: dict | None
    # {
    #     "next_likely_issue": "door_operator",
    #     "probability": 0.65,
    #     "timeframe": "2-4 weeks",
    #     "recommended_action": "..."
    # }

    # Comparison
    vs_fleet_average: dict
    # {"health_score": "+5", "uptime": "+2%"}
```

#### 4.4.2.2 Anomaly Detection

**Detection Methods:**

| Method | Description | Use Case |
|--------|-------------|----------|
| Threshold | Static limits | Temperature, vibration |
| Statistical | Std deviation | Normal variations |
| Pattern | Sequence matching | Fault signatures |
| ML Model | Learned baseline | Complex patterns |
| Ensemble | Combined methods | High confidence |

**Anomaly Schema:**

```python
class AnomalyDetection(BaseModel):
    """Detected anomaly."""

    id: UUID
    equipment_id: UUID
    device_id: UUID | None

    # Anomaly info
    anomaly_type: str  # 'threshold', 'statistical', 'pattern', 'ml'
    severity: str  # 'low', 'medium', 'high', 'critical'

    # Detection
    metric_name: str
    expected_value: float | None
    expected_range: dict | None  # {"min": x, "max": y}
    actual_value: float
    deviation_percent: float | None

    # Context
    detected_at: datetime
    operating_context: dict  # {"mode": "...", "load": "..."}

    # Confidence
    confidence_score: float
    detection_model: str

    # Classification
    likely_cause: str | None
    similar_past_anomalies: list[UUID]

    # Impact
    estimated_impact: str  # 'none', 'minor', 'moderate', 'severe'
    recommended_action: str

    # Status
    status: str  # 'active', 'acknowledged', 'investigating', 'resolved'
```

---

### 4.4.3 Predictive Maintenance

#### 4.4.3.1 ML Prediction Models

**Model Types:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    PREDICTION MODELS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. REMAINING USEFUL LIFE (RUL)                                  │
│     ├── Predicts time until component failure                    │
│     ├── Input: Sensor data, usage patterns, age                  │
│     ├── Output: Days until maintenance needed                    │
│     └── Components: Motors, doors, ropes, bearings               │
│                                                                  │
│  2. FAILURE PROBABILITY                                          │
│     ├── Probability of failure in time window                    │
│     ├── Input: Current readings, trends, history                 │
│     ├── Output: % probability (7d, 30d, 90d)                     │
│     └── Used for: Risk assessment, scheduling                    │
│                                                                  │
│  3. FAULT CLASSIFICATION                                         │
│     ├── Identifies type of developing issue                      │
│     ├── Input: Anomaly patterns, symptoms                        │
│     ├── Output: Fault type and confidence                        │
│     └── Faults: Door, motor, control, safety                     │
│                                                                  │
│  4. MAINTENANCE OPTIMIZATION                                     │
│     ├── Optimal timing for maintenance                           │
│     ├── Input: RUL, failure prob, cost, schedule                 │
│     ├── Output: Recommended maintenance date                     │
│     └── Balances: Risk vs. cost vs. convenience                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Prediction API:**

```
GET    /api/v1/equipment/{id}/predictions                # Get predictions
GET    /api/v1/equipment/{id}/predictions/rul            # Remaining useful life
GET    /api/v1/equipment/{id}/predictions/failure-risk   # Failure probability
GET    /api/v1/buildings/{id}/predictions/summary        # Building summary
POST   /api/v1/predictions/batch                         # Batch predictions
```

**Prediction Schema:**

```python
class EquipmentPrediction(BaseModel):
    """Prediction for equipment."""

    equipment_id: UUID
    generated_at: datetime
    model_version: str

    # Remaining useful life
    rul_predictions: list[dict]
    # [{
    #     "component": "door_operator",
    #     "current_health": 72,
    #     "estimated_rul_days": 180,
    #     "confidence": 0.78,
    #     "factors": ["cycle_count", "vibration_trend"]
    # }]

    # Failure risk
    failure_risk: dict
    # {
    #     "7_day": {"probability": 0.02, "top_risk": "none"},
    #     "30_day": {"probability": 0.08, "top_risk": "door_fault"},
    #     "90_day": {"probability": 0.25, "top_risk": "door_operator"}
    # }

    # Recommended actions
    recommendations: list[dict]
    # [{
    #     "action": "Inspect door operator",
    #     "priority": "medium",
    #     "timeframe": "Within 30 days",
    #     "estimated_cost": 500,
    #     "failure_cost_if_ignored": 2500,
    #     "confidence": 0.75
    # }]

    # Optimal maintenance window
    optimal_maintenance: dict
    # {
    #     "recommended_date_range": {"start": date, "end": date},
    #     "reasoning": "...",
    #     "components_to_address": ["door_operator", "guide_shoes"]
    # }

    # Model confidence
    overall_confidence: float
    data_quality_score: float
    prediction_basis: str  # 'full_data', 'partial_data', 'limited_data'
```

---

### 4.4.4 Hardware Partnerships

#### 4.4.4.1 Partner Integration Program

**Partner Types:**

| Partner Type | Integration | Revenue Model |
|--------------|-------------|---------------|
| Sensor manufacturers | Device certification | Hardware sales referral |
| Diagnostic tool makers | Tool integration | Data exchange |
| BMS vendors | System integration | API licensing |
| AR/VR providers | Visualization tools | Feature licensing |
| Manufacturers | Telemetry access | Data partnership |

**API Endpoints:**

```
GET    /api/v1/hardware/partners                         # List partners
GET    /api/v1/hardware/partners/{id}                    # Partner details
GET    /api/v1/hardware/compatible-devices               # Compatible devices
POST   /api/v1/hardware/certification-request            # Request certification
```

---

## Success Metrics

### Phase 4.4 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Connected devices | 5,000+ | Active devices |
| Buildings with IoT | 200+ | Buildings monitored |
| Prediction accuracy | 80%+ | Failure predictions |
| Anomaly detection rate | 90%+ | True positives |
| Downtime reduction | 25%+ | Via predictive maintenance |
| Hardware partnerships | 10+ | Active integrations |

### KPIs

1. **Technical Performance**
   - Data ingestion rate
   - Processing latency
   - Model accuracy
   - False positive rate

2. **Business Impact**
   - Downtime prevented
   - Emergency calls reduced
   - Maintenance optimized
   - Customer satisfaction

3. **Adoption**
   - Device registration rate
   - Active monitoring buildings
   - Feature utilization

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
