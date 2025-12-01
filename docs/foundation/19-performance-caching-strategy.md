# SiteSync V3 - Performance & Caching Strategy

> **Making It Fast** - Complete specification for performance optimization and caching architecture.

---

## Performance Philosophy

Performance is a feature. SiteSync prioritizes:

1. **Fast by Default**: Optimize the common paths
2. **Perceived Speed**: Show something useful quickly
3. **Graceful Degradation**: Work even with slow connections
4. **Predictable Latency**: Consistent response times

---

## Performance Targets

### Response Time Targets

| Operation | Target | P95 Target | Critical Path |
|-----------|--------|------------|---------------|
| Page Load (First Paint) | < 1.5s | < 2.5s | Yes |
| Page Load (Full) | < 3.0s | < 5.0s | Yes |
| API Simple Read | < 100ms | < 200ms | Yes |
| API Complex Read | < 300ms | < 500ms | Yes |
| API Write | < 200ms | < 400ms | Yes |
| Search | < 300ms | < 500ms | Yes |
| Real-Time Updates | < 100ms | < 200ms | Yes |
| AI Diagnosis | < 10s | < 15s | No |
| Report Generation | < 5s | < 10s | No |
| Bulk Import | Background | Background | No |

### Throughput Targets

| Metric | Target |
|--------|--------|
| Concurrent Users | 10,000 |
| API Requests/Second | 5,000 |
| WebSocket Connections | 50,000 |
| Database Connections | 500 (pooled) |

### Availability Targets

| Metric | Target |
|--------|--------|
| Uptime | 99.9% |
| RTO (Recovery Time) | < 4 hours |
| RPO (Recovery Point) | < 1 hour |

---

## Architecture Layers

```
PERFORMANCE ARCHITECTURE
══════════════════════════════════════════════════════════════════

                           CLIENT
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         CDN (CloudFlare)                         │
│  - Static assets (JS, CSS, images)                              │
│  - Edge caching for API responses                               │
│  - DDoS protection                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LOAD BALANCER (ALB)                         │
│  - SSL termination                                              │
│  - Health checks                                                │
│  - Request routing                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   API Pod   │  │   API Pod   │  │   API Pod   │  (Auto-scale)│
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Redis Cache   │ │   PostgreSQL    │ │   S3 Storage    │
│   (ElastiCache) │ │   (RDS)         │ │                 │
│                 │ │   + Read Replica│ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘

══════════════════════════════════════════════════════════════════
```

---

## Database Optimization

### Connection Pooling

```python
# Database connection configuration
DATABASE_CONFIG = {
    "pool_size": 20,           # Connections per pod
    "max_overflow": 10,         # Extra connections if needed
    "pool_timeout": 30,         # Wait time for connection
    "pool_recycle": 1800,       # Recycle connections after 30 min
    "pool_pre_ping": True,      # Check connection health
}

# With 10 API pods: 10 × 30 = 300 max connections
```

### Indexing Strategy

#### Primary Indexes (Always Created)

```sql
-- Organization isolation (RLS performance)
CREATE INDEX idx_sites_org ON sites(organization_id);
CREATE INDEX idx_elevators_org ON elevators(organization_id);
CREATE INDEX idx_work_orders_org ON work_orders(organization_id);
CREATE INDEX idx_contractors_org ON contractors(organization_id);
CREATE INDEX idx_inventory_org ON inventory_items(organization_id);

-- Foreign key indexes
CREATE INDEX idx_elevators_site ON elevators(site_id);
CREATE INDEX idx_work_orders_elevator ON work_orders(elevator_id);
CREATE INDEX idx_work_orders_site ON work_orders(site_id);
CREATE INDEX idx_work_orders_contractor ON work_orders(assigned_contractor_id);
```

#### Query-Pattern Indexes

```sql
-- Work order list queries (most common)
CREATE INDEX idx_wo_org_status ON work_orders(organization_id, status);
CREATE INDEX idx_wo_org_priority_status ON work_orders(organization_id, priority, status);
CREATE INDEX idx_wo_org_created ON work_orders(organization_id, created_at DESC);
CREATE INDEX idx_wo_assigned_status ON work_orders(assigned_contractor_id, status)
    WHERE assigned_contractor_id IS NOT NULL;

-- Dashboard queries
CREATE INDEX idx_wo_org_status_created ON work_orders(organization_id, status, created_at DESC);
CREATE INDEX idx_sites_org_health ON sites(organization_id, health_score);
CREATE INDEX idx_elevators_org_status ON elevators(organization_id, status);

-- Search indexes
CREATE INDEX idx_sites_name_trgm ON sites USING GIN (name gin_trgm_ops);
CREATE INDEX idx_wo_number ON work_orders(work_order_number);
CREATE INDEX idx_elevators_serial ON elevators(serial_number);

-- Full-text search
CREATE INDEX idx_wo_fts ON work_orders USING GIN (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);
```

#### Partial Indexes (Filtered)

```sql
-- Active records only (skip soft-deleted)
CREATE INDEX idx_sites_active ON sites(organization_id, name)
    WHERE deleted_at IS NULL;

CREATE INDEX idx_wo_open ON work_orders(organization_id, priority, created_at)
    WHERE status NOT IN ('completed', 'cancelled', 'invoiced');

-- Emergency work orders (frequent dashboard query)
CREATE INDEX idx_wo_emergency ON work_orders(organization_id, created_at DESC)
    WHERE priority = 'emergency' AND status NOT IN ('completed', 'cancelled');

-- Inspections due (scheduled job)
CREATE INDEX idx_elevators_inspection_due ON elevators(next_inspection_due)
    WHERE next_inspection_due IS NOT NULL AND status != 'decommissioned';
```

### Query Optimization Patterns

#### Avoid N+1 Queries

```python
# BAD: N+1 queries
work_orders = await get_work_orders(org_id)
for wo in work_orders:
    wo.site = await get_site(wo.site_id)  # N additional queries!

# GOOD: Eager loading
work_orders = await get_work_orders_with_sites(org_id)
# Single query with JOIN
```

```python
# Using SQLAlchemy
async def get_work_orders_with_relations(org_id: UUID) -> list[WorkOrder]:
    query = (
        select(WorkOrder)
        .options(
            selectinload(WorkOrder.site),
            selectinload(WorkOrder.elevator),
            selectinload(WorkOrder.contractor)
        )
        .where(WorkOrder.organization_id == org_id)
    )
    result = await session.execute(query)
    return result.scalars().all()
```

#### Pagination

```python
# Offset pagination (simple, for smaller datasets)
async def list_work_orders_offset(
    org_id: UUID,
    page: int = 1,
    per_page: int = 25
) -> PaginatedResult:
    offset = (page - 1) * per_page

    query = (
        select(WorkOrder)
        .where(WorkOrder.organization_id == org_id)
        .order_by(WorkOrder.created_at.desc())
        .offset(offset)
        .limit(per_page)
    )
    # ...

# Cursor pagination (for large datasets, consistent performance)
async def list_work_orders_cursor(
    org_id: UUID,
    cursor: str | None = None,
    limit: int = 25
) -> CursorResult:
    query = (
        select(WorkOrder)
        .where(WorkOrder.organization_id == org_id)
    )

    if cursor:
        cursor_data = decode_cursor(cursor)
        query = query.where(
            WorkOrder.created_at < cursor_data['created_at']
        )

    query = query.order_by(WorkOrder.created_at.desc()).limit(limit + 1)
    # ...
```

### Read Replicas

```python
# Route read-heavy queries to replica
class DatabaseRouter:
    def __init__(self, primary_url: str, replica_url: str):
        self.primary = create_engine(primary_url)
        self.replica = create_engine(replica_url)

    def get_session(self, read_only: bool = False) -> AsyncSession:
        engine = self.replica if read_only else self.primary
        return AsyncSession(engine)

# Usage
async def get_dashboard_data(org_id: UUID):
    async with db.get_session(read_only=True) as session:
        # Complex dashboard queries go to replica
        ...
```

---

## Caching Strategy

### Cache Layers

```
REQUEST FLOW WITH CACHING
══════════════════════════════════════════════════════════════════

Client Request
     │
     ▼
┌─────────────────┐
│  Browser Cache  │  TTL: minutes to days (static assets)
└────────┬────────┘
         │ miss
         ▼
┌─────────────────┐
│    CDN Cache    │  TTL: seconds to hours (API, static)
└────────┬────────┘
         │ miss
         ▼
┌─────────────────┐
│  Application    │  In-memory (hot data, seconds)
│    Memory       │
└────────┬────────┘
         │ miss
         ▼
┌─────────────────┐
│   Redis Cache   │  TTL: seconds to hours (API data)
└────────┬────────┘
         │ miss
         ▼
┌─────────────────┐
│   PostgreSQL    │  Query cache + connection pool
│   (+ replica)   │
└─────────────────┘

══════════════════════════════════════════════════════════════════
```

### What to Cache

| Data Type | TTL | Cache Layer | Invalidation |
|-----------|-----|-------------|--------------|
| Static Assets | 1 year | CDN + Browser | Deploy versioning |
| User Session | 24 hours | Redis | Explicit logout |
| API List (unchanging) | 5 min | Redis | Entity change |
| API Detail | 1 min | Redis | Entity change |
| Search Results | 60 sec | Redis | Time-based |
| Dashboard Stats | 30 sec | Redis | Time-based |
| Filter Options | 1 hour | Redis | Entity change |
| Health Scores | 5 min | Redis | Recalculation |
| User Preferences | 1 hour | Redis | User update |

### Redis Cache Architecture

```python
# Cache key patterns
CACHE_KEYS = {
    # Entity caching
    "site": "org:{org_id}:site:{site_id}",
    "site_list": "org:{org_id}:sites:list:{hash}",
    "elevator": "org:{org_id}:elevator:{elevator_id}",
    "work_order": "org:{org_id}:wo:{work_order_id}",

    # Aggregate caching
    "dashboard": "org:{org_id}:dashboard:{user_role}",
    "site_health": "org:{org_id}:site:{site_id}:health",

    # Search caching
    "search": "org:{org_id}:search:{hash}",
    "filter_options": "org:{org_id}:filters:{entity}:{field}",

    # User-specific
    "user_prefs": "user:{user_id}:prefs",
    "user_recent": "user:{user_id}:recent",
}
```

### Cache Implementation

```python
from functools import wraps
import hashlib
import json

class CacheService:
    def __init__(self, redis: Redis):
        self.redis = redis

    async def get(self, key: str) -> dict | None:
        data = await self.redis.get(key)
        return json.loads(data) if data else None

    async def set(self, key: str, value: dict, ttl: int):
        await self.redis.setex(key, ttl, json.dumps(value))

    async def delete(self, key: str):
        await self.redis.delete(key)

    async def delete_pattern(self, pattern: str):
        keys = await self.redis.keys(pattern)
        if keys:
            await self.redis.delete(*keys)

def cached(key_template: str, ttl: int = 60):
    """Decorator for caching function results."""

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Build cache key
            key = key_template.format(**kwargs)

            # Try cache
            cached_result = await cache.get(key)
            if cached_result:
                return cached_result

            # Execute function
            result = await func(*args, **kwargs)

            # Store in cache
            await cache.set(key, result, ttl)

            return result
        return wrapper
    return decorator

# Usage
@cached(key_template="org:{org_id}:dashboard:{role}", ttl=30)
async def get_dashboard_data(org_id: UUID, role: str) -> dict:
    # Complex dashboard query
    ...
```

### Cache Invalidation

```python
# Event-based invalidation
async def on_work_order_changed(work_order: WorkOrder, event: str):
    """Invalidate caches when work order changes."""

    org_id = work_order.organization_id

    # Invalidate specific entity
    await cache.delete(f"org:{org_id}:wo:{work_order.id}")

    # Invalidate list caches
    await cache.delete_pattern(f"org:{org_id}:*:list:*")

    # Invalidate dashboard
    await cache.delete_pattern(f"org:{org_id}:dashboard:*")

    # Invalidate site health if status changed
    if event == 'status_changed':
        await cache.delete(f"org:{org_id}:site:{work_order.site_id}:health")


# Using pub/sub for distributed invalidation
async def publish_cache_invalidation(pattern: str):
    await redis.publish('cache_invalidation', pattern)

# Subscriber in each API pod
async def cache_invalidation_subscriber():
    async for message in redis.subscribe('cache_invalidation'):
        await cache.delete_pattern(message)
```

---

## Frontend Optimization

### Bundle Splitting

```javascript
// Route-based code splitting
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard')),
  },
  {
    path: '/work-orders',
    component: lazy(() => import('./pages/WorkOrders')),
  },
  {
    path: '/sites',
    component: lazy(() => import('./pages/Sites')),
  },
  // ...
];

// Component-level splitting
const AIDialog = lazy(() => import('./components/AIDialog'));
const ReportGenerator = lazy(() => import('./components/ReportGenerator'));
```

### Initial Bundle Targets

| Bundle | Max Size | Contents |
|--------|----------|----------|
| Main | 150 KB | React, Router, Core UI |
| Vendor | 200 KB | Dependencies |
| Route (each) | 50 KB | Page components |
| Shared | 100 KB | Common components |

### Lazy Loading

```javascript
// Images
<img
  src={lowResPlaceholder}
  data-src={highResImage}
  loading="lazy"
  alt="..."
/>

// Data (pagination)
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
  ['work-orders', filters],
  ({ pageParam }) => fetchWorkOrders({ ...filters, cursor: pageParam }),
  { getNextPageParam: (lastPage) => lastPage.nextCursor }
);

// Intersection Observer for infinite scroll
const { ref, inView } = useInView();
useEffect(() => {
  if (inView && hasNextPage) {
    fetchNextPage();
  }
}, [inView, hasNextPage]);
```

### Image Optimization

```
Image Pipeline
══════════════════════════════════════════════════════════════════

Upload                    Processing                  Delivery
──────                    ──────────                  ────────
Original      ────►     Generate variants:          CDN serves
(any size)              - thumbnail (100px)         optimal variant
                        - small (400px)             based on:
                        - medium (800px)            - Device width
                        - large (1200px)            - DPR
                        - WebP versions             - Format support

<picture>
  <source srcset="img-400.webp" type="image/webp" media="(max-width: 400px)">
  <source srcset="img-800.webp" type="image/webp" media="(max-width: 800px)">
  <img src="img-800.jpg" alt="...">
</picture>
```

### Service Worker Caching

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'sitesync-v1';
const STATIC_ASSETS = [
  '/',
  '/static/js/main.js',
  '/static/css/main.css',
  '/offline.html',
];

// Cache static assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // Network first for API
    event.respondWith(networkFirst(event.request));
  } else {
    // Cache first for static
    event.respondWith(cacheFirst(event.request));
  }
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return caches.match(request);
  }
}
```

---

## API Optimization

### Response Compression

```python
# FastAPI middleware
from fastapi import FastAPI
from starlette.middleware.gzip import GZipMiddleware

app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

### Sparse Fieldsets

```http
# Request only needed fields
GET /api/v1/work-orders?fields=id,number,title,status,site.name

Response:
{
  "data": [
    {
      "id": "uuid",
      "number": "WO-2024-0234",
      "title": "Door not closing",
      "status": "pending",
      "site": {
        "name": "Collins Tower"
      }
    }
  ]
}
```

```python
# Implementation
@router.get("/work-orders")
async def list_work_orders(
    fields: str | None = Query(None, description="Comma-separated fields"),
    db: AsyncSession = Depends(get_db)
):
    field_list = fields.split(",") if fields else None

    work_orders = await get_work_orders(db, fields=field_list)

    return {
        "data": [
            serialize_sparse(wo, field_list)
            for wo in work_orders
        ]
    }
```

### Batch Requests

```http
# Single request for multiple operations
POST /api/v1/batch
{
  "requests": [
    {"method": "GET", "path": "/sites/uuid1"},
    {"method": "GET", "path": "/sites/uuid2"},
    {"method": "GET", "path": "/work-orders?site_id=uuid1"}
  ]
}

Response:
{
  "responses": [
    {"status": 200, "body": {...}},
    {"status": 200, "body": {...}},
    {"status": 200, "body": {...}}
  ]
}
```

### ETags for Conditional Requests

```python
from hashlib import md5

@router.get("/work-orders/{work_order_id}")
async def get_work_order(
    work_order_id: UUID,
    if_none_match: str | None = Header(None),
    db: AsyncSession = Depends(get_db)
):
    work_order = await get_work_order_by_id(db, work_order_id)

    # Generate ETag from last update
    etag = md5(str(work_order.updated_at).encode()).hexdigest()

    # Return 304 if unchanged
    if if_none_match == etag:
        return Response(status_code=304)

    return JSONResponse(
        content=work_order.dict(),
        headers={"ETag": etag}
    )
```

---

## Mobile Optimization

### Offline-First Architecture

```
OFFLINE-FIRST DATA FLOW
══════════════════════════════════════════════════════════════════

                    ┌─────────────────┐
                    │   Mobile App    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Local Storage  │
                    │  (SQLite/Realm) │
                    └────────┬────────┘
                             │
              Online?  ──────┼────── Offline?
                  │                    │
                  ▼                    ▼
         ┌───────────────┐    ┌───────────────┐
         │  Sync Engine  │    │  Queue Action │
         │  (Background) │    │  for Later    │
         └───────────────┘    └───────────────┘
                  │
                  ▼
         ┌───────────────┐
         │   SiteSync    │
         │     API       │
         └───────────────┘

══════════════════════════════════════════════════════════════════
```

### Data Sync Strategy

```typescript
// Sync priority for mobile
const SYNC_PRIORITY = {
  // Critical: Sync immediately when online
  CRITICAL: ['work_order_completion', 'emergency_create', 'time_log'],

  // High: Sync within 1 minute
  HIGH: ['work_order_update', 'photo_upload', 'parts_log'],

  // Normal: Sync within 5 minutes
  NORMAL: ['notes', 'preferences'],

  // Low: Sync when convenient
  LOW: ['analytics', 'full_refresh'],
};

// Pre-fetch for offline access
const PREFETCH_DATA = [
  'assigned_work_orders',
  'site_details_for_assigned_jobs',
  'equipment_for_assigned_jobs',
  'access_codes',
  'parts_inventory',
];
```

### Battery/Bandwidth Considerations

```typescript
// Adaptive sync based on conditions
async function determineSyncStrategy(): SyncStrategy {
  const battery = await navigator.getBattery();
  const connection = navigator.connection;

  if (battery.level < 0.2 && !battery.charging) {
    return 'minimal';  // Only critical syncs
  }

  if (connection.effectiveType === '2g' || connection.saveData) {
    return 'reduced';  // No images, compressed data
  }

  if (connection.effectiveType === '4g' && battery.level > 0.5) {
    return 'full';  // Full sync including prefetch
  }

  return 'standard';
}
```

---

## Monitoring & Alerting

### Key Metrics

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Response Time P95 | DataDog APM | > 500ms |
| Error Rate | DataDog | > 1% |
| Database Connections | CloudWatch | > 80% |
| Cache Hit Rate | Redis metrics | < 70% |
| CPU Usage | CloudWatch | > 80% |
| Memory Usage | CloudWatch | > 85% |
| Disk I/O | CloudWatch | > 80% |

### Performance Dashboard

```
PERFORMANCE DASHBOARD
──────────────────────────────────────────────────────────────

API Response Times (P95)                Error Rate
────────────────────────                ──────────

200ms ─┼─────────────────────           1.0% ─┼─────────────
       │         ____                         │
150ms ─┼────____/    \____               0.5% ─┼─────────────
       │___/                                   │_____________
100ms ─┼─────────────────────           0.0% ─┼─────────────
       │                                       │
   50ms ─┼─────────────────────               │
        6am   9am   12pm   3pm   6pm          6am    3pm

Cache Performance                       Database
────────────────                        ────────
Hit Rate: 82%                           Connections: 145/300
Miss Rate: 18%                          Query Time P95: 45ms
Memory: 2.1 GB / 4 GB                   Slow Queries: 3

Active Alerts
─────────────
⚠ API P95 > 400ms on /api/v1/work-orders (5 min ago)
✓ All other metrics normal
```

### Slow Query Logging

```sql
-- PostgreSQL slow query logging
ALTER SYSTEM SET log_min_duration_statement = 100;  -- Log queries > 100ms
ALTER SYSTEM SET log_statement = 'none';            -- Don't log all queries

-- Query analysis
SELECT
    query,
    calls,
    mean_time,
    total_time,
    rows
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY total_time DESC
LIMIT 20;
```

---

## Load Testing

### Test Scenarios

| Scenario | VUs | Duration | Target |
|----------|-----|----------|--------|
| Normal Load | 100 | 10 min | < 200ms P95 |
| Peak Load | 500 | 5 min | < 500ms P95 |
| Stress Test | 1000 | 5 min | No errors |
| Soak Test | 200 | 1 hour | Stable memory |

### k6 Load Test Script

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Stay at 100
    { duration: '2m', target: 200 },  // Spike
    { duration: '5m', target: 200 },  // Stay at 200
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const BASE_URL = 'https://api.sitesync.io';

  // Login
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, {
    email: 'test@example.com',
    password: 'password',
  });
  const token = loginRes.json('access_token');

  // Dashboard request
  const dashboardRes = http.get(`${BASE_URL}/api/v1/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(dashboardRes, {
    'dashboard status 200': (r) => r.status === 200,
    'dashboard < 500ms': (r) => r.timings.duration < 500,
  });

  // Work orders list
  const workOrdersRes = http.get(`${BASE_URL}/api/v1/work-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  check(workOrdersRes, {
    'work orders status 200': (r) => r.status === 200,
  });

  sleep(1);
}
```

---

**[← Previous: AI Learning & Feedback](18-ai-learning-feedback.md)** | **[Next: Data Lifecycle & Retention →](20-data-lifecycle-retention.md)**
