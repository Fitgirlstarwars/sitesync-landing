# SiteSync V3 - Search & Filtering Architecture

> **Finding Things Fast** - Complete specification for search, filtering, and result management.

---

## Search Philosophy

SiteSync search is designed around three principles:

1. **Fast**: Results in under 300ms for any query
2. **Relevant**: Most likely matches appear first
3. **Comprehensive**: Search across all entity types from one place

---

## Search Types

### Global Search

Universal search across all entities from the main search bar.

**Location**: Top navigation bar, always accessible

**Searchable Entities**:
- Sites (buildings)
- Assets (elevators/equipment)
- Work Orders
- Contractors
- Parts/Inventory
- Users (Admin+ only)

### Entity-Specific Search

Focused search within a single entity type.

**Location**: Search box within each list view

**Examples**:
- Work Orders list → search work orders only
- Assets list → search assets only
- Contractors list → search contractors only

### Quick Find

Jump-to navigation for known identifiers.

**Trigger**: `/` keyboard shortcut or Command Palette

**Supported Formats**:
- `WO-2024-0234` → Jump to work order
- `EL-12345` → Jump to elevator by registration
- `Collins` → Global search for "Collins"

---

## Global Search Architecture

### Search Flow

```
User Input
    │
    ├── Debounce (300ms)
    │
    ├── Parse Query
    │   ├── Identify entity hints (WO-, site:, etc.)
    │   ├── Extract quoted phrases
    │   └── Normalize terms
    │
    ├── Execute Search
    │   ├── Check cache (Redis, 60s TTL)
    │   ├── If miss: Query PostgreSQL full-text search
    │   └── Optional: pgvector semantic search
    │
    ├── Rank Results
    │   ├── Apply relevance scoring
    │   ├── Boost recent items
    │   └── Boost user's recent interactions
    │
    └── Return Results
        ├── Grouped by entity type
        ├── Limited to 5 per group
        └── Total count per group
```

### Search Query Parsing

```python
class SearchQuery:
    raw_query: str           # Original input
    terms: list[str]         # Normalized search terms
    phrases: list[str]       # Quoted phrases (exact match)
    entity_hint: str | None  # Detected entity type
    filters: dict            # Inline filters (site:Collins)

def parse_query(query: str) -> SearchQuery:
    """Parse user search input into structured query."""

    # Extract quoted phrases
    phrases = re.findall(r'"([^"]+)"', query)

    # Detect entity hints
    entity_patterns = {
        r'^WO-': 'work_order',
        r'^EL-': 'elevator',
        r'^SITE:': 'site',
        r'^USER:': 'user',
    }

    # Extract inline filters
    filters = {}
    for match in re.finditer(r'(\w+):(\S+)', query):
        filters[match.group(1)] = match.group(2)

    # Normalize remaining terms
    remaining = re.sub(r'"[^"]+"|\w+:\S+', '', query)
    terms = [t.lower().strip() for t in remaining.split() if t.strip()]

    return SearchQuery(...)
```

### Search Scope by Entity

#### Sites

| Field | Weight | Index Type |
|-------|--------|------------|
| `name` | 1.0 | Full-text + trigram |
| `code` | 0.9 | Exact + prefix |
| `address_line1` | 0.8 | Full-text |
| `city` | 0.7 | Full-text |
| `primary_contact_name` | 0.6 | Full-text |

**Example queries**:
- `Collins` → matches "Collins Tower"
- `123 collins st` → matches by address
- `COL-001` → matches by code

#### Assets (Elevators)

| Field | Weight | Index Type |
|-------|--------|------------|
| `unit_number` | 1.0 | Exact + prefix |
| `serial_number` | 0.9 | Exact + prefix |
| `registration_number` | 0.9 | Exact |
| `manufacturer` | 0.8 | Full-text |
| `model` | 0.8 | Full-text |
| Site name (joined) | 0.5 | Full-text |

**Example queries**:
- `Lift 1` → matches unit number
- `KM-2015-78234` → matches serial
- `KONE MonoSpace` → matches manufacturer + model

#### Work Orders

| Field | Weight | Index Type |
|-------|--------|------------|
| `work_order_number` | 1.0 | Exact |
| `title` | 0.9 | Full-text |
| `description` | 0.7 | Full-text |
| `fault_code` | 0.8 | Exact + prefix |
| Site name (joined) | 0.5 | Full-text |
| Asset unit (joined) | 0.5 | Full-text |

**Example queries**:
- `WO-2024-0234` → exact match
- `door stuck` → matches title/description
- `E15` → matches fault code

#### Contractors

| Field | Weight | Index Type |
|-------|--------|------------|
| `company_name` | 1.0 | Full-text + trigram |
| `contact_name` | 0.9 | Full-text |
| `email` | 0.8 | Exact + prefix |
| `license_number` | 0.7 | Exact |
| `specializations` | 0.6 | Array contains |

**Example queries**:
- `KONE` → matches company name
- `John Smith` → matches contact name
- `hydraulic` → matches specialization

#### Parts/Inventory

| Field | Weight | Index Type |
|-------|--------|------------|
| `part_number` | 1.0 | Exact + prefix |
| `name` | 0.9 | Full-text |
| `manufacturer` | 0.8 | Full-text |
| `manufacturer_part_number` | 0.7 | Exact |
| `description` | 0.5 | Full-text |

**Example queries**:
- `DOO-001` → matches part number
- `door operator` → matches name
- `KM903370G01` → matches OEM part number

---

## Result Ranking Algorithm

### Relevance Score Calculation

```python
def calculate_relevance(
    result: SearchResult,
    query: SearchQuery,
    user: User
) -> float:
    """Calculate relevance score for ranking."""

    score = 0.0

    # 1. Text match score (0-100)
    score += text_match_score(result, query) * 0.5

    # 2. Field weight boost
    score += field_weight_boost(result) * 0.2

    # 3. Recency boost (newer = higher)
    days_old = (now() - result.updated_at).days
    recency_boost = max(0, 1 - (days_old / 365))  # Decay over year
    score += recency_boost * 10 * 0.1

    # 4. User interaction boost
    if result.id in user.recently_viewed:
        score += 15 * 0.1
    if result.id in user.frequently_accessed:
        score += 20 * 0.1

    # 5. Priority boost (for work orders)
    if result.entity_type == 'work_order':
        priority_boosts = {
            'emergency': 25,
            'high': 15,
            'medium': 5,
            'low': 0
        }
        score += priority_boosts.get(result.priority, 0) * 0.05

    # 6. Exact match boost
    if is_exact_match(result, query):
        score *= 1.5

    return min(score, 100)
```

### Result Grouping

Global search returns results grouped by entity:

```json
{
  "query": "collins",
  "total_results": 23,
  "results": {
    "sites": {
      "count": 2,
      "items": [
        {"id": "uuid", "name": "Collins Tower", "score": 95},
        {"id": "uuid", "name": "Collins Street Building", "score": 82}
      ],
      "has_more": false
    },
    "work_orders": {
      "count": 15,
      "items": [
        {"id": "uuid", "number": "WO-2024-0234", "title": "Collins Tower - Lift 1", "score": 78},
        ...
      ],
      "has_more": true
    },
    "assets": {
      "count": 4,
      "items": [...],
      "has_more": false
    },
    "contractors": {
      "count": 2,
      "items": [...],
      "has_more": false
    }
  },
  "suggestions": ["collins tower", "collins street"],
  "recent_searches": ["collins tower work orders"]
}
```

---

## Filtering System

### Filter Types

| Type | Description | Example |
|------|-------------|---------|
| **Select** | Single value from list | Status = "pending" |
| **Multi-Select** | Multiple values from list | Status IN ("pending", "scheduled") |
| **Date Range** | From/to date | Created: Dec 1 - Dec 31 |
| **Number Range** | Min/max number | Health Score: 50-100 |
| **Text** | Contains/equals | Title contains "door" |
| **Boolean** | Yes/no toggle | Is Emergency = true |
| **Autocomplete** | Search + select | Site = (search for site) |

### Available Filters by Entity

#### Work Order Filters

| Filter | Type | Options/Range |
|--------|------|---------------|
| Status | Multi-Select | draft, pending, scheduled, in_progress, on_hold, completed, cancelled, invoiced |
| Priority | Multi-Select | emergency, high, medium, low, scheduled |
| Type | Multi-Select | breakdown, preventive, inspection, callback, installation, modernization, audit |
| Site | Autocomplete | All sites |
| Asset | Autocomplete | All assets (filtered by site) |
| Contractor | Autocomplete | All contractors |
| Created By | Autocomplete | All users |
| Created Date | Date Range | Any date range |
| Scheduled Date | Date Range | Any date range |
| Completed Date | Date Range | Any date range |
| Has AI Diagnosis | Boolean | Yes/No |
| Is Overdue | Boolean | Yes/No |
| Is Emergency | Boolean | Yes/No |

#### Site Filters

| Filter | Type | Options/Range |
|--------|------|---------------|
| Building Type | Multi-Select | commercial, residential, mixed, industrial |
| Health Score | Number Range | 0-100 |
| City | Autocomplete | Cities in org |
| State | Select | States/Provinces |
| Has Open Work Orders | Boolean | Yes/No |
| Inspection Overdue | Boolean | Yes/No |
| Created Date | Date Range | Any date range |

#### Asset Filters

| Filter | Type | Options/Range |
|--------|------|---------------|
| Status | Multi-Select | operational, degraded, out_of_service, maintenance, decommissioned |
| Site | Autocomplete | All sites |
| Manufacturer | Multi-Select | Manufacturers in org |
| Health Score | Number Range | 0-100 |
| Installation Date | Date Range | Any date range |
| Inspection Due | Date Range | Any date range |
| Inspection Overdue | Boolean | Yes/No |

#### Contractor Filters

| Filter | Type | Options/Range |
|--------|------|---------------|
| Type | Multi-Select | company, independent, internal, vendor |
| Status | Select | active, inactive, pending, suspended |
| Is Preferred | Boolean | Yes/No |
| Specializations | Multi-Select | Available specializations |
| Trade Types | Multi-Select | lifts, escalators, HVAC, etc. |
| Rating | Number Range | 0-5 |
| License Valid | Boolean | Yes/No |

#### Parts Filters

| Filter | Type | Options/Range |
|--------|------|---------------|
| Status | Multi-Select | active, inactive, discontinued |
| Category | Multi-Select | Categories |
| Manufacturer | Multi-Select | Manufacturers |
| Criticality | Multi-Select | critical, high, medium, low |
| In Stock | Boolean | Yes/No |
| Below Reorder Point | Boolean | Yes/No |
| Compatible With | Autocomplete | Equipment manufacturer/model |

### Filter Combination Logic

Filters within the same field use **OR** logic:
```
Status = "pending" OR Status = "scheduled"
```

Filters across different fields use **AND** logic:
```
Status = "pending" AND Site = "Collins Tower"
```

Text search combines with filters:
```
(Title CONTAINS "door") AND (Status = "pending") AND (Site = "Collins Tower")
```

### Filter UI Patterns

#### Desktop Filter Panel

```
┌─────────────────────────────────────────────────────────────┐
│ Filters                                      [Clear All]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Status           ▼                                          │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [✓] Pending  [✓] Scheduled  [ ] In Progress            ││
│ │ [ ] On Hold  [ ] Completed  [ ] Cancelled              ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Priority         ▼                                          │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [✓] Emergency  [✓] High  [ ] Medium  [ ] Low           ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Site             ▼                                          │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ [Search sites...]                                       ││
│ │ Collins Tower (5)                              [×]      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Created Date     ▼                                          │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ From: [01/12/2024]  To: [31/12/2024]                   ││
│ │                                                         ││
│ │ Quick: [Today] [This Week] [This Month] [Custom]       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ [Apply Filters]                         [Save This Filter] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile Filter Sheet

```
┌───────────────────────────┐
│ Filters              [×]  │
├───────────────────────────┤
│                           │
│ ACTIVE FILTERS (3)        │
│ ┌───────────────────────┐ │
│ │ Status: Pending [×]   │ │
│ │ Priority: High [×]    │ │
│ │ Site: Collins [×]     │ │
│ └───────────────────────┘ │
│                           │
│ ─────────────────────────  │
│                           │
│ Status                  > │
│ Priority                > │
│ Type                    > │
│ Site                    > │
│ Date Range              > │
│ More Filters            > │
│                           │
│ ─────────────────────────  │
│                           │
│ [Clear All] [Apply (47)]  │
│                           │
└───────────────────────────┘
```

---

## Saved Filters

### User Saved Filters

Users can save filter combinations for reuse:

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Emergency WOs This Week",
  "entity_type": "work_order",
  "filters": {
    "priority": ["emergency"],
    "status": ["pending", "scheduled", "in_progress"],
    "created_date": {
      "type": "relative",
      "value": "this_week"
    }
  },
  "is_default": false,
  "show_in_sidebar": true,
  "sort": {
    "field": "created_at",
    "direction": "desc"
  },
  "columns": ["number", "title", "site", "status", "created_at"],
  "created_at": "2024-12-01T10:00:00Z",
  "last_used_at": "2024-12-01T14:30:00Z"
}
```

### System Default Filters

Pre-configured filters available to all users:

| Filter Name | Entity | Configuration |
|-------------|--------|---------------|
| All Open | Work Orders | status NOT IN (completed, cancelled, invoiced) |
| Emergencies | Work Orders | priority = emergency, status NOT IN (completed, cancelled) |
| My Assigned | Work Orders | assigned_to = current_user |
| Created by Me | Work Orders | created_by = current_user |
| Overdue | Work Orders | due_date < today, status NOT IN (completed, cancelled) |
| This Week | Work Orders | created_date = this_week |
| Needs Attention | Sites | health_score < 50 OR inspection_overdue = true |
| Low Stock | Parts | available_quantity < reorder_point |

### Filter Sharing (Manager+)

Managers can share filters with their team:

```json
{
  "id": "uuid",
  "created_by": "uuid",
  "name": "Collins Sites Emergency WOs",
  "entity_type": "work_order",
  "filters": {...},
  "shared_with": {
    "type": "role",
    "roles": ["manager", "user"]
  },
  "is_pinned": true
}
```

---

## Typeahead / Autocomplete

### Autocomplete Behavior

```
User types: "col"
    │
    ├── 300ms debounce
    │
    ├── Query: prefix search on indexed fields
    │
    └── Return suggestions:
        ├── Sites: "Collins Tower", "Collins Street"
        ├── Recent: "Collins Tower work orders" (previous search)
        └── Suggested: "Collins Tower - Lift 1" (frequent access)
```

### Autocomplete Response

```json
{
  "query": "col",
  "suggestions": [
    {
      "type": "site",
      "id": "uuid",
      "text": "Collins Tower",
      "subtitle": "123 Collins St, Melbourne",
      "icon": "building"
    },
    {
      "type": "asset",
      "id": "uuid",
      "text": "Collins Tower - Lift 1",
      "subtitle": "KONE MonoSpace 500",
      "icon": "elevator"
    },
    {
      "type": "recent_search",
      "text": "collins tower emergency",
      "icon": "history"
    }
  ]
}
```

### Autocomplete Fields by Entity

| Entity | Autocomplete Fields |
|--------|---------------------|
| Site | name, code, address |
| Asset | unit_number, serial_number, site_name |
| Work Order | number, title |
| Contractor | company_name, contact_name |
| Part | part_number, name |
| User | first_name + last_name, email |

---

## Recent Searches

### Storage

Recent searches stored per user:

```json
{
  "user_id": "uuid",
  "recent_searches": [
    {
      "query": "collins tower emergency",
      "timestamp": "2024-12-01T14:30:00Z",
      "result_count": 5,
      "clicked_result": {
        "type": "work_order",
        "id": "uuid"
      }
    },
    {
      "query": "door operator",
      "timestamp": "2024-12-01T10:15:00Z",
      "result_count": 12,
      "clicked_result": null
    }
  ],
  "max_stored": 20,
  "retention_days": 30
}
```

### Recent Search Display

```
┌─────────────────────────────────────────────────────────────┐
│ [🔍 Search...                                           ]   │
├─────────────────────────────────────────────────────────────┤
│ Recent Searches                                             │
│ ───────────────                                             │
│ 🕐 collins tower emergency                                  │
│ 🕐 door operator                                            │
│ 🕐 WO-2024-0230                                             │
│ 🕐 KONE MonoSpace                                           │
│                                                             │
│ [Clear Recent Searches]                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Search Analytics

### Metrics Tracked

| Metric | Description | Use |
|--------|-------------|-----|
| Query Volume | Searches per day/week/month | Capacity planning |
| Popular Queries | Most frequent search terms | Feature development |
| Zero-Result Queries | Searches with no results | Content gaps |
| Click-Through Rate | % of searches that click a result | Relevance tuning |
| Time to Click | How long before user clicks | UX improvement |
| Query Refinement | User modifies initial query | Relevance tuning |
| Filter Usage | Which filters are used most | UI optimization |

### Analytics Dashboard (Admin)

```
Search Performance - Last 30 Days
─────────────────────────────────────────────────────────────

Total Searches: 12,450
Unique Queries: 3,200
Avg Results per Query: 8.5
Click-Through Rate: 72%
Zero-Result Rate: 4%

Top Queries (Last 7 Days)        Zero-Result Queries
─────────────────────────        ────────────────────
1. Collins Tower (234)           1. KM123456 (15)
2. Emergency (189)               2. escalator (12)
3. Door operator (156)           3. Smith contractor (8)
4. WO-2024 (142)                 4. fire damper (5)
5. Inspection due (98)           5. loading dock (3)

Most Used Filters                Filter Combinations
─────────────────                ──────────────────
1. Status (78%)                  1. Status + Site (45%)
2. Site (65%)                    2. Status + Priority (32%)
3. Priority (42%)                3. Status + Date (28%)
4. Date Range (35%)              4. Site + Contractor (15%)
5. Contractor (22%)              5. Three+ filters (12%)
```

---

## Performance Optimization

### Indexing Strategy

#### PostgreSQL Full-Text Search Indexes

```sql
-- Sites full-text index
CREATE INDEX idx_sites_fts ON sites USING GIN (
    to_tsvector('english',
        coalesce(name, '') || ' ' ||
        coalesce(code, '') || ' ' ||
        coalesce(address_line1, '') || ' ' ||
        coalesce(city, '')
    )
);

-- Work orders full-text index
CREATE INDEX idx_work_orders_fts ON work_orders USING GIN (
    to_tsvector('english',
        coalesce(work_order_number, '') || ' ' ||
        coalesce(title, '') || ' ' ||
        coalesce(description, '') || ' ' ||
        coalesce(fault_code, '')
    )
);

-- Trigram indexes for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_sites_name_trgm ON sites USING GIN (name gin_trgm_ops);
CREATE INDEX idx_contractors_company_trgm ON contractors USING GIN (company_name gin_trgm_ops);
CREATE INDEX idx_inventory_name_trgm ON inventory_items USING GIN (name gin_trgm_ops);
```

#### Composite Indexes for Filtering

```sql
-- Work orders common filter patterns
CREATE INDEX idx_work_orders_filter_1 ON work_orders(organization_id, status, priority);
CREATE INDEX idx_work_orders_filter_2 ON work_orders(organization_id, site_id, status);
CREATE INDEX idx_work_orders_filter_3 ON work_orders(organization_id, assigned_contractor_id, status);
CREATE INDEX idx_work_orders_filter_4 ON work_orders(organization_id, created_at DESC);

-- Sites common filter patterns
CREATE INDEX idx_sites_filter_1 ON sites(organization_id, health_score);
CREATE INDEX idx_sites_filter_2 ON sites(organization_id, city, state);
```

### Caching Strategy

#### Search Result Caching (Redis)

```python
# Cache key format
cache_key = f"search:{org_id}:{hash(query)}:{hash(filters)}"

# Cache configuration
SEARCH_CACHE_TTL = 60  # seconds
AUTOCOMPLETE_CACHE_TTL = 300  # 5 minutes
FILTER_OPTIONS_CACHE_TTL = 3600  # 1 hour

# Cache invalidation triggers
# - Entity created/updated/deleted
# - Filter options change
# - Time-based expiry
```

#### Filter Options Caching

Cache available filter options (e.g., list of sites, manufacturers):

```python
async def get_filter_options(
    entity_type: str,
    filter_field: str,
    org_id: UUID
) -> list[FilterOption]:
    """Get cached filter options."""

    cache_key = f"filter_options:{org_id}:{entity_type}:{filter_field}"

    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)

    options = await fetch_filter_options(entity_type, filter_field, org_id)
    await redis.setex(cache_key, FILTER_OPTIONS_CACHE_TTL, json.dumps(options))

    return options
```

### Pagination

#### Offset-Based Pagination (Simple Lists)

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 25,
    "total_items": 150,
    "total_pages": 6,
    "has_next": true,
    "has_prev": false
  }
}
```

#### Cursor-Based Pagination (Large Datasets)

```json
{
  "data": [...],
  "pagination": {
    "cursor": "eyJpZCI6IjEyMyIsImNyZWF0ZWRfYXQiOiIyMDI0LTEyLTAxIn0=",
    "per_page": 25,
    "has_more": true
  }
}
```

#### Pagination Limits

| Entity | Max Per Page | Default Per Page |
|--------|--------------|------------------|
| Work Orders | 100 | 25 |
| Sites | 100 | 25 |
| Assets | 100 | 25 |
| Contractors | 100 | 25 |
| Parts | 100 | 50 |
| Audit Events | 500 | 100 |

---

## API Endpoints

### Global Search

```http
GET /api/v1/search?q=collins&limit=5

Response:
{
  "query": "collins",
  "results": {
    "sites": [...],
    "work_orders": [...],
    "assets": [...]
  },
  "suggestions": ["collins tower"],
  "took_ms": 45
}
```

### Entity Search with Filters

```http
GET /api/v1/work-orders?
    q=door&
    status=pending,scheduled&
    priority=emergency,high&
    site_id=uuid&
    created_after=2024-12-01&
    sort=-created_at&
    page=1&
    per_page=25

Response:
{
  "data": [...],
  "filters_applied": {
    "q": "door",
    "status": ["pending", "scheduled"],
    "priority": ["emergency", "high"],
    "site_id": "uuid",
    "created_after": "2024-12-01"
  },
  "available_filters": {
    "status": [
      {"value": "pending", "count": 12},
      {"value": "scheduled", "count": 8},
      ...
    ],
    "priority": [...]
  },
  "pagination": {...},
  "sort": {"field": "created_at", "direction": "desc"},
  "took_ms": 65
}
```

### Autocomplete

```http
GET /api/v1/search/autocomplete?q=col&entity=site&limit=5

Response:
{
  "suggestions": [
    {
      "type": "site",
      "id": "uuid",
      "text": "Collins Tower",
      "subtitle": "123 Collins St"
    }
  ]
}
```

### Saved Filters

```http
# List saved filters
GET /api/v1/filters?entity=work_order

# Create saved filter
POST /api/v1/filters
{
  "name": "Emergency WOs",
  "entity_type": "work_order",
  "filters": {...},
  "is_default": false
}

# Apply saved filter
GET /api/v1/work-orders?saved_filter=uuid
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Focus global search |
| `Esc` | Close search, clear filters |
| `Enter` | Execute search / select highlighted |
| `↑` / `↓` | Navigate suggestions |
| `Cmd/Ctrl + K` | Open command palette |
| `Cmd/Ctrl + F` | Focus entity search (in list view) |

---

**[← Previous: Role-Based Views](14-role-based-views.md)** | **[Next: Customization & Personalization →](16-customization-personalization.md)**
