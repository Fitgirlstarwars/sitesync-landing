# SiteSync V3 - Data Lifecycle & Retention

> **Managing Data Over Time** - Complete specification for data retention, archival, backup, and compliance.

---

## Data Lifecycle Philosophy

SiteSync manages data responsibly:

1. **Keep What's Needed**: Retain operational and compliance data
2. **Archive Responsibly**: Move old data to cold storage
3. **Delete When Required**: Honor retention limits and user requests
4. **Always Recoverable**: Maintain backups for disaster recovery

---

## Data Classification

### Classification Levels

| Level | Description | Examples | Retention |
|-------|-------------|----------|-----------|
| **Active** | Current operations | Open work orders, active sites | Indefinite |
| **Historical** | Completed, for reference | Completed work orders, past inspections | 7 years |
| **Audit** | Compliance/security | Audit events, permission changes | 7 years |
| **Temporary** | Session/cache | User sessions, search cache | Days/hours |
| **Personal** | User PII | Profile data, contact info | Until deleted |

### Data by Entity

| Entity | Classification | Retention | Archival |
|--------|----------------|-----------|----------|
| Organizations | Active | Until deleted | 90 days post-delete |
| Sites | Active | Until deleted | 90 days post-delete |
| Assets | Active | Until deleted | 90 days post-delete |
| Work Orders | Historical | 7 years | After 2 years |
| Audit Events | Audit | 7 years | After 1 year |
| User Profiles | Personal | Until deleted | 30 days post-delete |
| Notifications | Temporary | 90 days | None |
| Sessions | Temporary | 30 days | None |
| Search Cache | Temporary | 1 hour | None |
| AI Diagnoses | Historical | 7 years | After 2 years |

---

## Retention Policies

### Policy by Entity

#### Work Orders

```json
{
  "entity": "work_order",
  "active_retention": {
    "duration": "indefinite",
    "condition": "status NOT IN ('completed', 'cancelled', 'invoiced')"
  },
  "historical_retention": {
    "duration_years": 7,
    "condition": "status IN ('completed', 'cancelled', 'invoiced')"
  },
  "archival": {
    "trigger_years": 2,
    "destination": "cold_storage",
    "compression": true,
    "searchable": true
  },
  "deletion": {
    "trigger_years": 7,
    "requires_approval": true,
    "exceptions": ["legal_hold", "active_audit"]
  }
}
```

#### Audit Events

```json
{
  "entity": "audit_event",
  "retention": {
    "duration_years": 7,
    "legal_basis": "compliance",
    "regulation": ["SOX", "GDPR", "AS/NZS ISO 27001"]
  },
  "archival": {
    "trigger_years": 1,
    "destination": "cold_storage",
    "compression": true,
    "immutable": true
  },
  "deletion": {
    "trigger_years": 7,
    "hard_delete": true,
    "requires_audit": true
  }
}
```

#### User Data

```json
{
  "entity": "user",
  "active_retention": {
    "duration": "indefinite",
    "condition": "is_active = true"
  },
  "inactive_retention": {
    "duration_days": 365,
    "condition": "is_active = false"
  },
  "deletion": {
    "soft_delete_days": 30,
    "hard_delete_days": 90,
    "gdpr_request": "immediate_soft",
    "data_portability": true
  }
}
```

#### Notifications

```json
{
  "entity": "notification",
  "retention": {
    "in_app": {
      "duration_days": 90,
      "auto_archive_days": 30
    },
    "email_metadata": {
      "duration_days": 7
    }
  },
  "deletion": {
    "auto_delete": true,
    "batch_size": 10000
  }
}
```

#### Sessions

```json
{
  "entity": "session",
  "retention": {
    "active_session": {
      "duration_hours": 24,
      "extension_on_activity": true
    },
    "refresh_token": {
      "duration_days": 30
    },
    "session_history": {
      "duration_days": 30
    }
  },
  "deletion": {
    "auto_delete": true,
    "on_logout": "immediate"
  }
}
```

---

## Archival Strategy

### Archive Flow

```
ARCHIVAL PIPELINE
══════════════════════════════════════════════════════════════════

Active Data (PostgreSQL)
         │
         │ Age > Archive Threshold
         ▼
┌─────────────────────┐
│   Archival Job      │
│   (Scheduled)       │
│                     │
│   1. Select records │
│   2. Validate       │
│   3. Transform      │
│   4. Compress       │
│   5. Upload to S3   │
│   6. Update indexes │
│   7. Delete from DB │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐       ┌─────────────────────┐
│   S3 Glacier        │       │   Elasticsearch     │
│   (Cold Storage)    │       │   (Archive Index)   │
│                     │       │                     │
│   Compressed        │       │   Searchable        │
│   Encrypted         │       │   metadata only     │
└─────────────────────┘       └─────────────────────┘

══════════════════════════════════════════════════════════════════
```

### Archive Storage Tiers

| Tier | Storage | Use Case | Access Time | Cost |
|------|---------|----------|-------------|------|
| Hot | PostgreSQL | Active operations | Instant | $$$ |
| Warm | S3 Standard | Recent archives | Seconds | $$ |
| Cold | S3 Glacier | Long-term retention | Hours | $ |
| Deep | S3 Glacier Deep | Legal retention | 12 hours | ¢ |

### Archive Job Implementation

```python
@scheduled(cron="0 2 * * 0")  # Weekly on Sunday 2 AM
async def archive_old_work_orders():
    """Archive work orders older than 2 years."""

    cutoff_date = now() - timedelta(days=730)

    # Find archival candidates
    work_orders = await db.execute(
        select(WorkOrder)
        .where(WorkOrder.completed_at < cutoff_date)
        .where(WorkOrder.archived_at.is_(None))
        .where(WorkOrder.legal_hold.is_(False))
        .limit(1000)
    )

    for wo in work_orders:
        try:
            # 1. Gather related data
            archive_data = await gather_work_order_archive_data(wo)

            # 2. Create archive record
            archive_record = {
                "id": wo.id,
                "organization_id": wo.organization_id,
                "data": archive_data,
                "archived_at": now(),
                "archive_version": "1.0"
            }

            # 3. Compress and upload to S3
            compressed = compress_json(archive_record)
            s3_key = f"archives/work_orders/{wo.organization_id}/{wo.id}.json.gz"
            await s3.upload(s3_key, compressed)

            # 4. Index in Elasticsearch (metadata only)
            await index_archive_metadata(wo, s3_key)

            # 5. Mark as archived in database
            await db.execute(
                update(WorkOrder)
                .where(WorkOrder.id == wo.id)
                .values(archived_at=now(), archive_location=s3_key)
            )

            # 6. Delete detailed data (keep summary)
            await delete_work_order_details(wo.id)

        except Exception as e:
            log.error(f"Failed to archive {wo.id}: {e}")
            await notify_admin(f"Archive failure: {wo.id}")
```

### Archive Access

```python
async def retrieve_archived_work_order(work_order_id: UUID) -> dict:
    """Retrieve work order from archive."""

    # Check if archived
    wo = await get_work_order(work_order_id)

    if not wo.archived_at:
        raise ValueError("Work order is not archived")

    # Get archive location
    s3_key = wo.archive_location

    # Determine storage tier
    storage_class = await s3.get_object_storage_class(s3_key)

    if storage_class in ["GLACIER", "DEEP_ARCHIVE"]:
        # Initiate restore (async)
        restore_job = await s3.restore_object(
            s3_key,
            days=7,
            tier="Standard"  # or "Expedited" for faster
        )
        return {
            "status": "restoring",
            "restore_job_id": restore_job.id,
            "estimated_time_hours": 3 if storage_class == "GLACIER" else 12
        }

    # Download and decompress
    compressed = await s3.download(s3_key)
    return decompress_json(compressed)
```

---

## Backup Strategy

### Backup Types

| Type | Frequency | Retention | Use Case |
|------|-----------|-----------|----------|
| Continuous (WAL) | Real-time | 7 days | Point-in-time recovery |
| Daily Snapshot | Daily 2 AM | 30 days | Daily restore point |
| Weekly Snapshot | Sunday 3 AM | 90 days | Weekly restore point |
| Monthly Snapshot | 1st of month | 1 year | Monthly restore point |

### Backup Architecture

```
BACKUP ARCHITECTURE
══════════════════════════════════════════════════════════════════

PostgreSQL Primary
         │
         │ Streaming Replication
         ▼
┌─────────────────────┐
│   Read Replica(s)   │◄──────── Query offload
└─────────────────────┘
         │
         │ WAL Archiving
         ▼
┌─────────────────────┐
│   S3 WAL Archive    │◄──────── Point-in-time recovery
│   (7 days)          │
└─────────────────────┘

         │
         │ pg_dump (scheduled)
         ▼
┌─────────────────────┐
│   S3 Snapshots      │◄──────── Full backup
│   (30/90/365 days)  │
└─────────────────────┘

         │
         │ Cross-region copy
         ▼
┌─────────────────────┐
│   DR Region         │◄──────── Disaster recovery
│   (ap-southeast-2)  │
└─────────────────────┘

══════════════════════════════════════════════════════════════════
```

### Recovery Objectives

| Objective | Target | Strategy |
|-----------|--------|----------|
| **RTO** (Recovery Time) | < 4 hours | Automated failover, warm standby |
| **RPO** (Recovery Point) | < 1 hour | WAL archiving, streaming replication |

### Backup Verification

```python
@scheduled(cron="0 6 * * *")  # Daily at 6 AM
async def verify_backup_integrity():
    """Verify backup integrity and restorability."""

    # Get latest backup
    latest_backup = await s3.list_objects(
        prefix="backups/daily/",
        sort_by="LastModified",
        limit=1
    )[0]

    # Restore to test environment
    test_instance = await rds.restore_db_instance(
        source_snapshot=latest_backup.key,
        target_instance="sitesync-backup-test",
        instance_class="db.t3.small"
    )

    # Wait for restore
    await test_instance.wait_until_available()

    # Run verification queries
    results = await run_backup_verification_queries(test_instance)

    if results.all_passed:
        log.info(f"Backup verification passed: {latest_backup.key}")
    else:
        await notify_admin(f"Backup verification FAILED: {results}")

    # Cleanup test instance
    await rds.delete_db_instance("sitesync-backup-test")
```

### Recovery Procedures

```
RECOVERY RUNBOOK
══════════════════════════════════════════════════════════════════

Scenario 1: Point-in-Time Recovery (Data Corruption)
─────────────────────────────────────────────────────

1. Identify corruption time
2. Stop application traffic
3. Create recovery instance from WAL
   aws rds restore-db-instance-to-point-in-time \
     --source-db-instance-identifier sitesync-prod \
     --target-db-instance-identifier sitesync-recovery \
     --restore-time "2024-12-01T10:30:00Z"
4. Verify recovered data
5. Promote recovery instance
6. Update connection strings
7. Resume traffic

Estimated Time: 2-4 hours

─────────────────────────────────────────────────────

Scenario 2: Full Database Loss
─────────────────────────────

1. Identify latest valid backup
2. Restore from snapshot
   aws rds restore-db-instance-from-db-snapshot \
     --db-instance-identifier sitesync-recovery \
     --db-snapshot-identifier sitesync-daily-2024-12-01
3. Apply WAL logs to latest point
4. Verify data integrity
5. Promote and switch traffic

Estimated Time: 3-4 hours

─────────────────────────────────────────────────────

Scenario 3: Region Failure (Disaster Recovery)
────────────────────────────────────────────────

1. Declare disaster
2. Activate DR region
3. Restore from cross-region backup
4. Update DNS to DR region
5. Verify application health
6. Communicate to users

Estimated Time: 4-6 hours

══════════════════════════════════════════════════════════════════
```

---

## Data Purging

### Purge Process

```python
@scheduled(cron="0 3 * * 0")  # Weekly on Sunday 3 AM
async def purge_expired_data():
    """Purge data that has exceeded retention period."""

    purge_jobs = [
        purge_old_notifications(),
        purge_expired_sessions(),
        purge_old_search_history(),
        purge_soft_deleted_users(),
        purge_archived_work_orders(),
    ]

    results = await asyncio.gather(*purge_jobs, return_exceptions=True)

    # Log results
    for job, result in zip(purge_jobs, results):
        if isinstance(result, Exception):
            log.error(f"Purge job failed: {job.__name__}: {result}")
        else:
            log.info(f"Purged {result} records from {job.__name__}")

async def purge_soft_deleted_users():
    """Purge users soft-deleted more than 90 days ago."""

    cutoff = now() - timedelta(days=90)

    # Get users to purge
    users = await db.execute(
        select(User)
        .where(User.deleted_at < cutoff)
    )

    count = 0
    for user in users:
        # Check for any holds
        if await has_legal_hold(user.id):
            continue

        # Anonymize audit records (don't delete)
        await anonymize_audit_records(user.id)

        # Delete personal data
        await hard_delete_user(user.id)

        count += 1

    return count
```

### Purge Verification

```sql
-- Verify no data outside retention
SELECT
    'notifications' as entity,
    COUNT(*) as count,
    MIN(created_at) as oldest
FROM notifications
WHERE created_at < NOW() - INTERVAL '90 days'

UNION ALL

SELECT
    'sessions' as entity,
    COUNT(*) as count,
    MIN(created_at) as oldest
FROM sessions
WHERE created_at < NOW() - INTERVAL '30 days';
```

---

## GDPR/Privacy Compliance

### Right to Access (Data Export)

```python
async def export_user_data(user_id: UUID) -> dict:
    """Export all user data for GDPR data portability."""

    user = await get_user(user_id)

    export = {
        "export_date": now().isoformat(),
        "user_id": str(user_id),
        "profile": {
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "created_at": user.created_at.isoformat()
        },
        "preferences": user.preferences,
        "notification_preferences": user.notification_preferences,
        "activity": {
            "work_orders_created": await get_user_work_orders(user_id),
            "login_history": await get_login_history(user_id),
            "audit_events": await get_user_audit_events(user_id)
        }
    }

    return export
```

### Right to Erasure (Delete Request)

```python
async def process_deletion_request(
    user_id: UUID,
    request_type: str = "gdpr"
) -> DeletionResult:
    """Process GDPR deletion request."""

    # 1. Validate request
    user = await get_user(user_id)
    if not user:
        raise ValueError("User not found")

    # 2. Check for blockers
    blockers = []

    # Active work orders?
    active_wos = await count_active_work_orders_for_user(user_id)
    if active_wos > 0:
        blockers.append(f"{active_wos} active work orders")

    # Legal hold?
    if await has_legal_hold(user_id):
        blockers.append("User under legal hold")

    if blockers:
        return DeletionResult(
            status="blocked",
            blockers=blockers,
            message="Cannot delete user due to blockers"
        )

    # 3. Soft delete immediately
    await soft_delete_user(user_id)

    # 4. Schedule hard delete
    await schedule_hard_delete(
        user_id=user_id,
        scheduled_for=now() + timedelta(days=30),
        request_type=request_type
    )

    # 5. Create audit record
    await create_audit_event(
        event_type="gdpr_deletion_requested",
        entity_type="user",
        entity_id=user_id,
        data={"request_type": request_type}
    )

    return DeletionResult(
        status="scheduled",
        soft_deleted_at=now(),
        hard_delete_scheduled=now() + timedelta(days=30)
    )
```

### Data Anonymization

```python
async def anonymize_user_data(user_id: UUID):
    """Anonymize user data while preserving aggregates."""

    # Generate anonymous identifier
    anon_id = f"ANON-{generate_hash(user_id)[:8]}"

    # Anonymize in audit logs
    await db.execute(
        update(AuditEvent)
        .where(AuditEvent.actor_id == user_id)
        .values(
            actor_email=f"{anon_id}@anonymized.sitesync.io",
            event_data=func.jsonb_set(
                AuditEvent.event_data,
                '{user_email}',
                f'"{anon_id}@anonymized.sitesync.io"'
            )
        )
    )

    # Anonymize in work orders (reporter info)
    await db.execute(
        update(WorkOrder)
        .where(WorkOrder.reporter_user_id == user_id)
        .values(
            reported_by_name="[Deleted User]",
            reported_by_email=None,
            reported_by_phone=None
        )
    )
```

### Consent Tracking

```json
{
  "user_id": "uuid",
  "consents": [
    {
      "type": "terms_of_service",
      "version": "2024.1",
      "granted_at": "2024-01-15T10:00:00Z",
      "ip_address": "203.0.113.50"
    },
    {
      "type": "privacy_policy",
      "version": "2024.1",
      "granted_at": "2024-01-15T10:00:00Z",
      "ip_address": "203.0.113.50"
    },
    {
      "type": "marketing_emails",
      "granted_at": "2024-01-15T10:00:00Z",
      "revoked_at": "2024-06-01T14:30:00Z"
    }
  ]
}
```

---

## Data Migration

### Version Migrations

```python
# alembic/versions/2024_12_01_add_contractor_insurance.py

from alembic import op
import sqlalchemy as sa

revision = '2024_12_01_001'
down_revision = '2024_11_15_001'

def upgrade():
    # Add new columns
    op.add_column('contractors',
        sa.Column('insurance_type', sa.String(50))
    )
    op.add_column('contractors',
        sa.Column('insurance_limit', sa.Numeric(12, 2))
    )

    # Backfill data
    op.execute("""
        UPDATE contractors
        SET insurance_type = 'general_liability',
            insurance_limit = 1000000
        WHERE insurance_policy IS NOT NULL
    """)

    # Create index
    op.create_index(
        'idx_contractors_insurance_expiry',
        'contractors',
        ['insurance_expiry'],
        postgresql_where='insurance_expiry IS NOT NULL'
    )

def downgrade():
    op.drop_index('idx_contractors_insurance_expiry')
    op.drop_column('contractors', 'insurance_limit')
    op.drop_column('contractors', 'insurance_type')
```

### Schema Migration Best Practices

```
MIGRATION SAFETY CHECKLIST
══════════════════════════════════════════════════════════════════

□ Migration is backward compatible
□ No table locks longer than 5 seconds
□ Large data migrations run in batches
□ Rollback tested in staging
□ Monitoring in place during deploy

SAFE OPERATIONS
───────────────
✓ Adding nullable column
✓ Adding index CONCURRENTLY
✓ Adding table
✓ Adding constraint NOT VALID

UNSAFE OPERATIONS (Need special handling)
─────────────────────────────────────────
✗ Adding NOT NULL column
✗ Changing column type
✗ Removing column
✗ Dropping table
✗ Adding constraint VALID on large table

══════════════════════════════════════════════════════════════════
```

### Data Transformation

```python
async def transform_legacy_data():
    """Transform data during major version upgrade."""

    # Process in batches
    batch_size = 1000
    processed = 0

    while True:
        # Get batch
        records = await db.execute(
            select(LegacyWorkOrder)
            .where(LegacyWorkOrder.migrated.is_(False))
            .limit(batch_size)
        )

        if not records:
            break

        for record in records:
            try:
                # Transform
                new_record = transform_work_order(record)

                # Insert new format
                await db.execute(
                    insert(WorkOrder).values(**new_record)
                )

                # Mark migrated
                await db.execute(
                    update(LegacyWorkOrder)
                    .where(LegacyWorkOrder.id == record.id)
                    .values(migrated=True)
                )

                processed += 1

            except Exception as e:
                log.error(f"Failed to migrate {record.id}: {e}")
                await create_migration_error(record.id, str(e))

        await db.commit()
        log.info(f"Migrated {processed} records")

    return processed
```

---

## Monitoring & Reporting

### Data Lifecycle Dashboard

```
DATA LIFECYCLE DASHBOARD
──────────────────────────────────────────────────────────────────

Storage Usage                          Retention Compliance
──────────────                         ────────────────────
Active DB:     45 GB (↑ 2%)           ✓ All policies current
Archive:      120 GB                   ✓ No overdue purges
Backups:      200 GB                   ✓ GDPR requests: 0 pending
Total:        365 GB

Archive Queue                          Purge Queue
─────────────                          ───────────
Pending: 12,450 records                Sessions: 45,000 (due)
Next Run: Sunday 2 AM                  Notifications: 120,000 (due)
Est. Time: 45 min                      Next Run: Sunday 3 AM

Recent Activity
───────────────
Dec 1: Archived 8,234 work orders (12 GB)
Nov 24: Purged 50,000 expired notifications
Nov 17: GDPR export completed (user-123)
Nov 10: Backup verification passed

Storage Trend (12 months)
─────────────────────────
400 GB ─┼──────────────────────────────_______
        │                         _____/
300 GB ─┼────────────────_______/
        │           ____/
200 GB ─┼─────_____/
        │____/
100 GB ─┼─────────────────────────────────────
        Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
```

### Compliance Reports

```python
async def generate_retention_compliance_report() -> dict:
    """Generate retention compliance report."""

    report = {
        "generated_at": now().isoformat(),
        "period": "monthly",
        "entities": {}
    }

    for entity, policy in RETENTION_POLICIES.items():
        stats = await get_entity_retention_stats(entity, policy)

        report["entities"][entity] = {
            "total_records": stats.total,
            "within_retention": stats.within_retention,
            "due_for_archive": stats.due_for_archive,
            "due_for_purge": stats.due_for_purge,
            "oldest_record": stats.oldest_record.isoformat(),
            "compliance_status": "compliant" if stats.compliant else "action_required"
        }

    return report
```

---

## API Endpoints

### Data Export

```http
POST /api/v1/users/me/data-export
{
  "format": "json",
  "include": ["profile", "activity", "preferences"]
}

Response:
{
  "export_id": "uuid",
  "status": "processing",
  "estimated_completion": "2024-12-01T10:30:00Z",
  "download_url": null
}
```

### Deletion Request

```http
POST /api/v1/users/me/deletion-request
{
  "reason": "no_longer_needed",
  "confirm": true
}

Response:
{
  "request_id": "uuid",
  "status": "scheduled",
  "soft_deleted_at": "2024-12-01T10:00:00Z",
  "hard_delete_scheduled": "2024-12-31T10:00:00Z",
  "cancellation_deadline": "2024-12-31T00:00:00Z"
}
```

### Archive Retrieval

```http
GET /api/v1/work-orders/{id}/retrieve-archive

Response:
{
  "status": "restoring",
  "estimated_availability": "2024-12-01T13:00:00Z",
  "notify_email": "user@example.com"
}
```

---

**[← Previous: Performance & Caching](19-performance-caching-strategy.md)** | **[Next: Design System →](21-design-system-complete.md)**
