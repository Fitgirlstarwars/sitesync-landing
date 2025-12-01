# Phase 5.1: International Expansion

> Detailed implementation specification for global localization and regional market launches
> Status: Design Phase
> Priority: HIGH (for growth) - Global market opportunity
> Dependencies: Phases 0-4 substantially complete

---

## Overview

The International Expansion creates a globally accessible platform that:

1. **Localizes** the platform for multiple languages and regional requirements
2. **Adapts** compliance databases for international regulatory frameworks
3. **Supports** local currencies, payment methods, and business practices
4. **Partners** with regional manufacturers, suppliers, and service providers
5. **Scales** infrastructure for global performance and reliability

---

## User Stories

### As an International Building Owner:

1. **US-INT001:** I want the platform in my language so I can use it effectively
2. **US-INT002:** I want to see local compliance requirements so I stay compliant
3. **US-INT003:** I want to pay in my currency so transactions are simple
4. **US-INT004:** I want local support hours so help is available when I need it

### As an International Service Company:

5. **US-INT005:** I want to find technicians in my region so I can hire locally
6. **US-INT006:** I want parts suppliers in my market so delivery is fast
7. **US-INT007:** I want certifications recognized in my country so they're valid
8. **US-INT008:** I want local manufacturer integrations so I access their resources

### As a Multinational Corporation:

9. **US-INT009:** I want to manage buildings across countries in one platform
10. **US-INT010:** I want consistent reporting across regions so I compare performance
11. **US-INT011:** I want local compliance handled per region so I'm covered everywhere
12. **US-INT012:** I want multi-currency reporting so I understand costs globally

---

## Feature Breakdown

### 5.1.1 Platform Localization

#### 5.1.1.1 Multi-Language Support

**Supported Languages (Phased):**

| Phase | Languages | Markets |
|-------|-----------|---------|
| Launch | English, Spanish, French | US, Canada, UK, EU |
| Phase 1 | German, Italian, Portuguese | DACH, Southern EU, Brazil |
| Phase 2 | Chinese, Japanese, Korean | Asia Pacific |
| Phase 3 | Arabic, Hindi | Middle East, India |

**Localization Scope:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOCALIZATION SCOPE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USER INTERFACE                                                  │
│  ├── Navigation and menus                                        │
│  ├── Form labels and buttons                                     │
│  ├── Error messages and tooltips                                 │
│  ├── Date/time formatting                                        │
│  ├── Number formatting                                           │
│  └── Right-to-left support (Arabic, Hebrew)                      │
│                                                                  │
│  CONTENT                                                         │
│  ├── Help documentation                                          │
│  ├── Email templates                                             │
│  ├── Notification messages                                       │
│  ├── Report templates                                            │
│  └── Marketing materials                                         │
│                                                                  │
│  DATA                                                            │
│  ├── Equipment types and terminology                             │
│  ├── Fault codes and descriptions                                │
│  ├── Compliance requirements                                     │
│  ├── Certification names                                         │
│  └── Industry terminology                                        │
│                                                                  │
│  TECHNICAL                                                       │
│  ├── Character encoding (UTF-8)                                  │
│  ├── Font support                                                │
│  ├── Collation/sorting                                           │
│  └── Search optimization                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**API Endpoints:**

```
GET    /api/v1/localization/languages                    # List languages
GET    /api/v1/localization/translations/{locale}        # Get translations
PUT    /api/v1/me/preferences/language                   # Set language pref
GET    /api/v1/localization/regions                      # List regions
```

**Localization Schema:**

```python
# sitesync_v3/domains/localization/contracts.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class LocaleConfig(BaseModel):
    """Configuration for a locale."""

    locale_code: str  # "en-US", "fr-FR", "zh-CN"
    language_code: str  # "en", "fr", "zh"
    region_code: str  # "US", "FR", "CN"

    # Display
    language_name: str  # "English"
    language_native: str  # "English"
    region_name: str  # "United States"

    # Formatting
    date_format: str  # "MM/DD/YYYY", "DD/MM/YYYY"
    time_format: str  # "12h", "24h"
    number_format: dict  # {"decimal": ".", "thousands": ","}
    currency_code: str  # "USD", "EUR"
    currency_symbol: str  # "$", "€"
    currency_position: str  # "before", "after"

    # Layout
    text_direction: str  # "ltr", "rtl"
    default_font: str | None

    # Status
    is_active: bool
    translation_coverage: float  # % complete
    last_updated: datetime

class TranslationBundle(BaseModel):
    """Translation strings for a locale."""

    locale_code: str
    namespace: str  # "common", "dashboard", "work_orders", etc.
    version: str

    translations: dict[str, str]
    # {"key.path": "Translated value", ...}

    # Metadata
    string_count: int
    translated_count: int
    coverage_percent: float
```

#### 5.1.1.2 Regional Date/Time/Currency

**Currency Support:**

```python
class CurrencyConfig(BaseModel):
    """Currency configuration."""

    code: str  # ISO 4217
    symbol: str
    name: str
    decimal_places: int

    # Exchange
    exchange_rate_to_usd: float
    exchange_rate_updated: datetime

    # Formatting
    symbol_position: str  # "before", "after"
    space_between: bool
    decimal_separator: str
    thousands_separator: str

class RegionalSettings(BaseModel):
    """Regional settings for user/organization."""

    # Location
    country_code: str
    region_code: str | None
    timezone: str

    # Formatting
    locale_code: str
    date_format: str
    time_format: str

    # Currency
    primary_currency: str
    display_currencies: list[str]

    # Units
    measurement_system: str  # "metric", "imperial"
    temperature_unit: str  # "celsius", "fahrenheit"
```

---

### 5.1.2 Regional Compliance

#### 5.1.2.1 International Regulatory Database

**Regional Coverage:**

| Region | Key Regulations | Coverage Status |
|--------|-----------------|-----------------|
| **United States** | ASME A17.1, state codes | Complete |
| **Canada** | CSA B44, provincial codes | Complete |
| **United Kingdom** | BS EN 81, LOLER, PUWER | Planned |
| **European Union** | EN 81 series, Lift Directive | Planned |
| **Germany** | BetrSichV, TRA | Planned |
| **France** | Code du travail | Planned |
| **Australia** | AS 1735 | Future |
| **Middle East** | Various | Future |
| **Asia Pacific** | Various | Future |

**Regulatory Schema:**

```python
class InternationalRegulation(BaseModel):
    """International regulatory framework."""

    id: UUID
    region_code: str
    country_code: str

    # Regulation info
    regulation_code: str
    regulation_name: str
    description: str
    issuing_body: str

    # Scope
    equipment_types: list[str]
    building_types: list[str]

    # Requirements
    inspection_frequency: str
    certification_requirements: list[str]
    documentation_requirements: list[str]

    # Enforcement
    enforcement_body: str
    penalty_structure: dict

    # Dates
    effective_date: date
    last_updated: date

    # Reference
    official_url: str | None
    full_text_document_id: UUID | None
```

---

### 5.1.3 Regional Partnerships

#### 5.1.3.1 Market Entry Strategy

**Regional Launch Sequence:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    REGIONAL LAUNCH SEQUENCE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PHASE 1: ENGLISH-SPEAKING MARKETS                               │
│  ├── United Kingdom + Ireland                                    │
│  │   ├── EN 81 compliance database                               │
│  │   ├── GBP currency support                                    │
│  │   ├── UK manufacturer partnerships                            │
│  │   └── Local support team                                      │
│  └── Australia + New Zealand (future)                            │
│                                                                  │
│  PHASE 2: EUROPEAN UNION                                         │
│  ├── Germany (DACH priority)                                     │
│  │   ├── German language                                         │
│  │   ├── BetrSichV compliance                                    │
│  │   └── TÜV partnerships                                        │
│  ├── France                                                      │
│  ├── Benelux                                                     │
│  └── Southern Europe                                             │
│                                                                  │
│  PHASE 3: ASIA PACIFIC                                           │
│  ├── Singapore (English-speaking hub)                            │
│  ├── Japan                                                       │
│  ├── South Korea                                                 │
│  └── Greater China (consideration)                               │
│                                                                  │
│  PHASE 4: MIDDLE EAST                                            │
│  ├── UAE (English hub)                                           │
│  ├── Saudi Arabia                                                │
│  └── Regional expansion                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Partnership Schema:**

```python
class RegionalPartner(BaseModel):
    """Regional partner organization."""

    id: UUID
    partner_type: str  # 'manufacturer', 'supplier', 'training', 'compliance'

    # Partner info
    name: str
    country_code: str
    regions_served: list[str]

    # Integration
    integration_status: str  # 'prospect', 'in_progress', 'active'
    integration_type: str  # 'api', 'data_share', 'marketing', 'full'

    # Contact
    primary_contact_name: str
    primary_contact_email: str

    # Terms
    agreement_signed: bool
    agreement_date: date | None
    revenue_share_percent: float | None
```

---

### 5.1.4 Infrastructure Scaling

#### 5.1.4.1 Global Infrastructure

**Architecture:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    GLOBAL INFRASTRUCTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  REGIONS:                                                        │
│  ├── US East (Primary)                                           │
│  │   ├── Primary database                                        │
│  │   ├── Full application stack                                  │
│  │   └── US/Canada traffic                                       │
│  │                                                               │
│  ├── EU West (Frankfurt/Ireland)                                 │
│  │   ├── Read replica database                                   │
│  │   ├── Full application stack                                  │
│  │   ├── EU data residency                                       │
│  │   └── GDPR compliance                                         │
│  │                                                               │
│  └── Asia Pacific (Singapore/Tokyo)                              │
│      ├── Read replica database                                   │
│      ├── Full application stack                                  │
│      └── APAC traffic                                            │
│                                                                  │
│  CDN:                                                            │
│  ├── CloudFlare/Fastly global edge                               │
│  ├── Static asset distribution                                   │
│  ├── API caching (where appropriate)                             │
│  └── DDoS protection                                             │
│                                                                  │
│  DATA RESIDENCY:                                                 │
│  ├── EU data stays in EU region                                  │
│  ├── Optional per-country isolation                              │
│  └── Compliance with local regulations                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Success Metrics

### Phase 5.1 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Languages supported | 6+ | Active languages |
| International users | 10,000+ | Non-US users |
| Regional compliance | 5+ | Country databases |
| International revenue | 20%+ | % of total revenue |
| Regional partnerships | 20+ | Active partners |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Owner: SiteSync Product Team*
