# SiteSync V3 - Notification System

> **Keeping Users Informed** - Complete specification for notifications across all channels.

---

## Notification Philosophy

SiteSync notifications follow three principles:

1. **Timely**: Deliver when users need to know, not later
2. **Relevant**: Only notify about things that matter to each user
3. **Not Overwhelming**: Respect attention; batch when appropriate

---

## Notification Channels

### Channel Overview

| Channel | Use Case | Delivery | User Control |
|---------|----------|----------|--------------|
| **In-App** | All notifications | Real-time | Per-event toggle |
| **Email** | Important updates, digests | Async | Per-event + digest mode |
| **Push** | Urgent, actionable items | Real-time | Per-event + quiet hours |
| **SMS** | Critical/emergency only | Real-time | Emergency only option |

### Channel Characteristics

#### In-App Notifications

- **Delivery**: WebSocket push, instant
- **Persistence**: Stored in database, shown until read
- **UI**: Bell icon badge, notification panel
- **Retention**: 90 days

#### Email Notifications

- **Delivery**: Queue-based, typically < 5 minutes
- **Modes**: Immediate, hourly digest, daily digest
- **Templates**: HTML with plain-text fallback
- **Unsubscribe**: One-click per notification type

#### Push Notifications (Web & Mobile)

- **Delivery**: Firebase Cloud Messaging (FCM)
- **Platforms**: Web, iOS, Android
- **Quiet Hours**: User-configurable
- **Rich**: Title, body, icon, action buttons

#### SMS Notifications

- **Delivery**: Twilio/MessageBird
- **Use**: Emergency work orders, critical system alerts
- **Limit**: Cost-controlled, emergency only by default
- **Compliance**: TCPA-compliant opt-in

---

## Notification Types by Entity

### Work Order Notifications

| Event | Trigger | Recipients | Channels |
|-------|---------|------------|----------|
| Created | Work order created | Creator confirmation | In-App, Email |
| Assigned | Contractor assigned | Assigned contractor/tech | In-App, Email, Push |
| Status Changed | Status transition | Watchers, assignee | In-App, Push |
| Emergency Created | Emergency WO created | Admins, on-call, assignee | In-App, Email, Push, SMS |
| Scheduled | Appointment set | Assignee, site contact | In-App, Email, Push |
| Started | Work begun | Creator, site contact | In-App |
| Completed | Work finished | Creator, site contact, manager | In-App, Email, Push |
| On Hold | Work paused | Creator, manager | In-App, Email |
| Overdue | Past due date | Assignee, manager | In-App, Email, Push |
| Comment Added | New comment | Watchers | In-App, Push |
| Photo Added | New photo | Watchers | In-App |
| AI Diagnosis Ready | Triforce complete | Creator, assignee | In-App, Push |
| Cost Threshold | Cost exceeds limit | Manager, admin | In-App, Email |

### Asset Notifications

| Event | Trigger | Recipients | Channels |
|-------|---------|------------|----------|
| Status Changed | Asset status update | Site managers | In-App, Push |
| Health Critical | Score drops below 30 | Managers, admins | In-App, Email, Push |
| Health Warning | Score drops below 60 | Managers | In-App |
| Inspection Due | 14 days before due | Managers | In-App, Email |
| Inspection Overdue | Past due date | Managers, admins | In-App, Email, Push |
| Out of Service | Marked out of service | All site stakeholders | In-App, Email, Push |
| Returned to Service | Back operational | All site stakeholders | In-App, Email |

### Site Notifications

| Event | Trigger | Recipients | Channels |
|-------|---------|------------|----------|
| Health Critical | Site score < 30 | Site managers, admins | In-App, Email, Push |
| Multiple Issues | 3+ assets degraded | Site managers | In-App, Email |
| Access Updated | Access codes changed | Assigned techs | In-App, Push |
| Emergency Contact Changed | Contact updated | Admins | In-App |

### Contractor Notifications

| Event | Trigger | Recipients | Channels |
|-------|---------|------------|----------|
| Invitation Sent | Invited to org | Invited contractor | Email |
| Invitation Accepted | Contractor joins | Admins | In-App, Email |
| License Expiring | 30 days before | Contractor, admins | In-App, Email |
| License Expired | Past expiry | Contractor, admins | In-App, Email, Push |
| Insurance Expiring | 30 days before | Contractor, admins | In-App, Email |
| Rating Updated | Performance updated | Contractor | In-App |
| Status Changed | Active/inactive | Contractor, admins | In-App, Email |

### Inventory Notifications

| Event | Trigger | Recipients | Channels |
|-------|---------|------------|----------|
| Low Stock | Below reorder point | Inventory managers | In-App, Email |
| Out of Stock | Zero available | Inventory managers | In-App, Email, Push |
| Reorder Triggered | Auto-reorder created | Admins | In-App, Email |
| Stock Received | Inventory received | Inventory managers | In-App |

### User Notifications

| Event | Trigger | Recipients | Channels |
|-------|---------|------------|----------|
| Invitation | Invited to org | Invited user | Email |
| Welcome | Completes signup | New user | Email |
| Role Changed | Role updated | Affected user | In-App, Email |
| Password Reset | Reset requested | User | Email |
| Password Changed | Password updated | User | Email |
| 2FA Enabled | 2FA activated | User | Email |
| Login from New Device | New device login | User | Email, Push |
| Mention | @mentioned | Mentioned user | In-App, Push |

### System Notifications

| Event | Trigger | Recipients | Channels |
|-------|---------|------------|----------|
| Maintenance Scheduled | System maintenance | All users | In-App, Email |
| Feature Announcement | New feature released | All users | In-App |
| Security Alert | Security event | Admins, owner | In-App, Email, Push |
| Subscription Expiring | 14 days before | Owner | In-App, Email |
| Subscription Expired | Expiry date reached | Owner, admins | In-App, Email, Push |
| Usage Limit Warning | 80% of limit | Admins | In-App, Email |
| Usage Limit Reached | 100% of limit | Owner, admins | In-App, Email, Push |

---

## Notification Triggers

### Event-Based Triggers

Fired immediately when entity changes:

```python
# Example: Work order status change
async def on_work_order_status_changed(
    work_order: WorkOrder,
    old_status: str,
    new_status: str,
    changed_by: User
):
    # Determine recipients
    recipients = get_work_order_watchers(work_order)

    # Exclude the person who made the change
    recipients = [r for r in recipients if r.id != changed_by.id]

    # Send notifications
    await send_notification(
        event_type="work_order_status_changed",
        entity_type="work_order",
        entity_id=work_order.id,
        recipients=recipients,
        data={
            "work_order_number": work_order.number,
            "title": work_order.title,
            "old_status": old_status,
            "new_status": new_status,
            "changed_by": changed_by.display_name
        }
    )
```

### Time-Based Triggers

Scheduled checks for conditions:

```python
# Example: Inspection due reminder
@scheduled(cron="0 9 * * *")  # Daily at 9 AM
async def check_inspections_due():
    # Find inspections due in 14 days
    due_soon = await get_assets_inspection_due_within(days=14)

    for asset in due_soon:
        recipients = get_site_managers(asset.site_id)

        await send_notification(
            event_type="inspection_due",
            entity_type="asset",
            entity_id=asset.id,
            recipients=recipients,
            data={
                "asset_name": asset.unit_number,
                "site_name": asset.site.name,
                "due_date": asset.next_inspection_due
            }
        )
```

### Threshold-Based Triggers

Triggered when metrics cross thresholds:

```python
# Example: Health score dropped
async def on_health_score_calculated(
    asset: Asset,
    old_score: int,
    new_score: int
):
    # Critical threshold
    if new_score < 30 and old_score >= 30:
        await send_notification(
            event_type="health_critical",
            entity_type="asset",
            entity_id=asset.id,
            recipients=get_asset_stakeholders(asset),
            data={
                "asset_name": asset.unit_number,
                "site_name": asset.site.name,
                "old_score": old_score,
                "new_score": new_score
            }
        )
    # Warning threshold
    elif new_score < 60 and old_score >= 60:
        await send_notification(
            event_type="health_warning",
            ...
        )
```

---

## Recipient Rules

### Role-Based Recipients

| Notification Type | Owner | Admin | Manager | User | Tech |
|-------------------|:-----:|:-----:|:-------:|:----:|:----:|
| Emergency WO | ✓ | ✓ | ✓ | - | Assigned |
| Health Critical | ✓ | ✓ | Site | - | - |
| System Security | ✓ | ✓ | - | - | - |
| Billing/Subscription | ✓ | - | - | - | - |
| New Feature | ✓ | ✓ | ✓ | ✓ | ✓ |

### Contextual Recipients

**Work Order Stakeholders**:
- Creator
- Assigned contractor/technician
- Site managers
- Watchers (explicitly added)

**Asset Stakeholders**:
- Site managers
- Primary contractor for site
- Users who created recent WOs for asset

**Site Stakeholders**:
- Assigned site managers
- Primary contact

### Escalation Rules

```json
{
  "escalation": {
    "work_order_unassigned": {
      "initial_wait_minutes": 30,
      "escalation_levels": [
        {"wait_minutes": 30, "notify": ["managers"]},
        {"wait_minutes": 60, "notify": ["admins"]},
        {"wait_minutes": 120, "notify": ["owner"], "channel": ["sms"]}
      ]
    },
    "emergency_not_started": {
      "initial_wait_minutes": 15,
      "escalation_levels": [
        {"wait_minutes": 15, "notify": ["managers", "admins"], "channel": ["push", "sms"]}
      ]
    }
  }
}
```

---

## Notification Templates

### Email Template Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif;">
  <!-- Header with logo -->
  <div style="background: {{org_primary_color}}; padding: 20px;">
    <img src="{{org_logo_url}}" alt="{{org_name}}" height="40">
  </div>

  <!-- Content -->
  <div style="padding: 20px;">
    <h1>{{title}}</h1>
    <p>{{body}}</p>

    <!-- Entity details card -->
    {{#if entity_card}}
    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
      {{entity_card}}
    </div>
    {{/if}}

    <!-- Call to action -->
    {{#if action_url}}
    <a href="{{action_url}}" style="...">{{action_text}}</a>
    {{/if}}
  </div>

  <!-- Footer -->
  <div style="padding: 20px; color: #666; font-size: 12px;">
    <p>{{org_email_footer}}</p>
    <p>
      <a href="{{unsubscribe_url}}">Unsubscribe</a> |
      <a href="{{preferences_url}}">Notification preferences</a>
    </p>
  </div>
</body>
</html>
```

### Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `{{recipient_name}}` | User's display name | "John Smith" |
| `{{recipient_first_name}}` | User's first name | "John" |
| `{{org_name}}` | Organization name | "Collins Lift Services" |
| `{{org_logo_url}}` | Organization logo | URL |
| `{{org_primary_color}}` | Brand color | "#1E40AF" |
| `{{entity_type}}` | Entity type (localized) | "Work Order" |
| `{{entity_name}}` | Entity identifier | "WO-2024-0234" |
| `{{action_url}}` | Deep link to entity | URL |
| `{{unsubscribe_url}}` | One-click unsubscribe | URL |

### Example Templates

#### Work Order Assigned (Email)

**Subject**: `New Job Assigned: {{work_order_number}} - {{work_order_title}}`

```
Hi {{recipient_first_name}},

You've been assigned a new job:

┌─────────────────────────────────────────────┐
│ {{work_order_number}}                       │
│ {{work_order_title}}                        │
│                                             │
│ Site: {{site_name}}                         │
│ Address: {{site_address}}                   │
│ Priority: {{priority}}                      │
│ Scheduled: {{scheduled_date}}               │
└─────────────────────────────────────────────┘

[View Job Details]

Best regards,
{{org_name}}
```

#### Emergency Work Order (Push)

```json
{
  "title": "EMERGENCY: {{site_name}}",
  "body": "{{work_order_title}}",
  "icon": "emergency_icon",
  "badge": 1,
  "sound": "emergency.wav",
  "data": {
    "type": "work_order",
    "id": "{{work_order_id}}",
    "action": "view"
  },
  "actions": [
    {"action": "view", "title": "View Details"},
    {"action": "navigate", "title": "Navigate to Site"}
  ]
}
```

#### Inspection Overdue (In-App)

```json
{
  "type": "inspection_overdue",
  "title": "Inspection Overdue",
  "message": "{{asset_name}} at {{site_name}} is overdue for inspection",
  "icon": "warning",
  "color": "red",
  "entity": {
    "type": "asset",
    "id": "{{asset_id}}"
  },
  "actions": [
    {"type": "view", "label": "View Asset"},
    {"type": "create_wo", "label": "Schedule Inspection"}
  ]
}
```

---

## User Preferences Integration

### Preference Resolution

```python
async def should_send_notification(
    user: User,
    event_type: str,
    channel: str
) -> bool:
    """Determine if notification should be sent based on preferences."""

    # Get user's notification preferences
    prefs = user.notification_preferences

    # Check if channel is enabled
    if not prefs.get('channels', {}).get(channel, {}).get('enabled', True):
        return False

    # Check if event type is enabled for channel
    event_prefs = prefs.get('events', {}).get(event_type, {})
    if not event_prefs.get(channel, True):
        return False

    # Check quiet hours for push/sms
    if channel in ['push', 'sms']:
        quiet_hours = prefs.get('channels', {}).get(channel, {}).get('quiet_hours')
        if quiet_hours and is_quiet_time(quiet_hours, user.timezone):
            # Queue for later unless emergency
            if not is_emergency(event_type):
                return False

    return True
```

### Digest Mode Handling

```python
async def handle_digest_notification(
    user: User,
    notification: Notification
):
    """Handle notifications in digest mode."""

    digest_settings = user.notification_preferences.get('digest', {})
    mode = digest_settings.get('mode', 'immediate')

    if mode == 'immediate':
        await send_email_notification(user, notification)
    else:
        # Add to digest queue
        await add_to_digest_queue(
            user_id=user.id,
            notification=notification,
            digest_time=get_next_digest_time(user, digest_settings)
        )

@scheduled(cron="0 * * * *")  # Every hour
async def send_pending_digests():
    """Send accumulated digest notifications."""

    due_digests = await get_due_digests(now())

    for user_id, notifications in due_digests.items():
        user = await get_user(user_id)
        await send_digest_email(user, notifications)
        await mark_digests_sent(user_id, notifications)
```

---

## Notification State Machine

```
┌─────────┐     ┌─────────┐     ┌───────────┐     ┌────────┐
│ Created │ ──► │ Queued  │ ──► │ Delivered │ ──► │  Read  │
└─────────┘     └─────────┘     └───────────┘     └────────┘
                    │                │                 │
                    │                │                 │
                    ▼                ▼                 ▼
               ┌─────────┐     ┌─────────┐       ┌──────────┐
               │ Failed  │     │ Clicked │       │ Archived │
               └─────────┘     └─────────┘       └──────────┘
```

### States

| State | Description |
|-------|-------------|
| `created` | Notification record created |
| `queued` | Added to delivery queue |
| `delivered` | Successfully delivered to channel |
| `failed` | Delivery failed |
| `read` | User viewed notification |
| `clicked` | User clicked action |
| `archived` | User dismissed/archived |

### State Transitions

```python
class NotificationStatus(str, Enum):
    CREATED = "created"
    QUEUED = "queued"
    DELIVERED = "delivered"
    FAILED = "failed"
    READ = "read"
    CLICKED = "clicked"
    ARCHIVED = "archived"

NOTIFICATION_TRANSITIONS = {
    NotificationStatus.CREATED: [NotificationStatus.QUEUED],
    NotificationStatus.QUEUED: [NotificationStatus.DELIVERED, NotificationStatus.FAILED],
    NotificationStatus.DELIVERED: [NotificationStatus.READ, NotificationStatus.ARCHIVED],
    NotificationStatus.READ: [NotificationStatus.CLICKED, NotificationStatus.ARCHIVED],
    NotificationStatus.CLICKED: [NotificationStatus.ARCHIVED],
    NotificationStatus.FAILED: [NotificationStatus.QUEUED],  # Retry
    NotificationStatus.ARCHIVED: [],  # Terminal
}
```

---

## Notification History & Audit

### Notification Record Schema

```json
{
  "id": "uuid",
  "organization_id": "uuid",
  "recipient_id": "uuid",
  "event_type": "work_order_assigned",
  "channel": "email",
  "status": "delivered",
  "entity_type": "work_order",
  "entity_id": "uuid",
  "title": "New Job Assigned",
  "body": "You've been assigned WO-2024-0234",
  "data": {
    "work_order_number": "WO-2024-0234",
    "site_name": "Collins Tower"
  },
  "created_at": "2024-12-01T10:00:00Z",
  "queued_at": "2024-12-01T10:00:01Z",
  "delivered_at": "2024-12-01T10:00:05Z",
  "read_at": "2024-12-01T10:15:00Z",
  "clicked_at": "2024-12-01T10:15:30Z",
  "archived_at": null,
  "delivery_attempts": 1,
  "last_error": null
}
```

### Retention Policy

| Channel | Retention |
|---------|-----------|
| In-App | 90 days |
| Email | 7 days (metadata only after delivery) |
| Push | 7 days |
| SMS | 90 days (compliance) |

---

## API Endpoints

### List Notifications

```http
GET /api/v1/notifications?
    status=delivered,read&
    channel=in_app&
    page=1&
    per_page=25

Response:
{
  "data": [
    {
      "id": "uuid",
      "event_type": "work_order_assigned",
      "title": "New Job Assigned",
      "body": "WO-2024-0234 at Collins Tower",
      "status": "delivered",
      "read_at": null,
      "created_at": "2024-12-01T10:00:00Z",
      "entity": {
        "type": "work_order",
        "id": "uuid",
        "url": "/work-orders/uuid"
      },
      "actions": [
        {"type": "view", "label": "View Job", "url": "/work-orders/uuid"}
      ]
    }
  ],
  "unread_count": 5,
  "pagination": {...}
}
```

### Mark as Read

```http
POST /api/v1/notifications/{notification_id}/read

Response:
{
  "id": "uuid",
  "status": "read",
  "read_at": "2024-12-01T10:15:00Z"
}
```

### Mark All as Read

```http
POST /api/v1/notifications/read-all

Response:
{
  "updated_count": 5
}
```

### Archive Notification

```http
POST /api/v1/notifications/{notification_id}/archive
```

### Get Unread Count

```http
GET /api/v1/notifications/unread-count

Response:
{
  "count": 5,
  "by_type": {
    "work_order": 3,
    "asset": 1,
    "system": 1
  }
}
```

### Update Preferences

```http
PATCH /api/v1/users/me/notification-preferences
{
  "channels": {
    "email": {
      "enabled": true,
      "digest_mode": "daily"
    }
  },
  "events": {
    "work_order_assigned": {
      "email": true,
      "push": true
    }
  }
}
```

---

## Real-Time Delivery (WebSocket)

### Connection Setup

```javascript
// Client-side WebSocket connection
const socket = new WebSocket('wss://api.sitesync.io/ws');

socket.onopen = () => {
  // Authenticate
  socket.send(JSON.stringify({
    type: 'auth',
    token: accessToken
  }));
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);

  if (message.type === 'notification') {
    // New notification received
    showNotification(message.data);
    updateBadgeCount(message.unread_count);
  }
};
```

### WebSocket Message Format

```json
{
  "type": "notification",
  "data": {
    "id": "uuid",
    "event_type": "work_order_assigned",
    "title": "New Job Assigned",
    "body": "WO-2024-0234 at Collins Tower",
    "entity": {
      "type": "work_order",
      "id": "uuid"
    },
    "actions": [...]
  },
  "unread_count": 6
}
```

---

## Email Delivery Infrastructure

### Queue Architecture

```
Event Trigger
     │
     ▼
┌──────────────┐
│ Notification │
│   Service    │
└──────────────┘
     │
     ▼
┌──────────────┐     ┌──────────────┐
│    Redis     │ ◄── │   Priority   │
│    Queue     │     │   Routing    │
└──────────────┘     └──────────────┘
     │
     ▼
┌──────────────┐
│    Email     │
│   Workers    │
└──────────────┘
     │
     ├──► SendGrid/SES
     │
     └──► Delivery webhooks ──► Update status
```

### Priority Queues

| Queue | Priority | Use Case | SLA |
|-------|----------|----------|-----|
| `email:critical` | 1 | Emergency, security | < 30s |
| `email:high` | 2 | Assigned, status change | < 2 min |
| `email:normal` | 3 | General updates | < 5 min |
| `email:digest` | 4 | Digest emails | < 30 min |
| `email:bulk` | 5 | Marketing, announcements | < 1 hour |

### Delivery Tracking

```python
async def handle_email_webhook(event: dict):
    """Handle SendGrid/SES delivery webhooks."""

    notification_id = event.get('custom_args', {}).get('notification_id')

    if event['event'] == 'delivered':
        await update_notification_status(
            notification_id,
            status='delivered',
            delivered_at=event['timestamp']
        )
    elif event['event'] == 'bounced':
        await update_notification_status(
            notification_id,
            status='failed',
            error=event['reason']
        )
        # Mark email as invalid
        await mark_email_bounced(event['email'])
    elif event['event'] == 'opened':
        await update_notification_status(
            notification_id,
            status='read',
            read_at=event['timestamp']
        )
    elif event['event'] == 'clicked':
        await update_notification_status(
            notification_id,
            status='clicked',
            clicked_at=event['timestamp']
        )
```

---

## Notification Analytics

### Metrics Tracked

| Metric | Description | Granularity |
|--------|-------------|-------------|
| Send Volume | Notifications sent | By type, channel, hour |
| Delivery Rate | Successfully delivered | By channel |
| Open Rate | Emails opened / sent | By type |
| Click Rate | Clicked / delivered | By type |
| Preference Changes | Opt-outs | By type, channel |
| Response Time | Avg time to read | By priority |

### Analytics Dashboard (Admin)

```
Notification Analytics - Last 30 Days
──────────────────────────────────────────────────────────────

Total Sent: 45,230        Delivered: 99.2%       Opened: 65%

By Channel                          By Event Type
─────────────                       ──────────────
Email:     12,450 (99.5%)           Work Order:     28,400
Push:      18,200 (98.8%)           Asset:           8,230
In-App:    14,580 (100%)            Inventory:       5,400
SMS:           120 (99.1%)          System:          3,200

Open Rate Trend                     Top Clicked
─────────────────                   ─────────────
[Chart showing trend]               1. Emergency WO (82%)
                                    2. Assigned to me (71%)
                                    3. Status change (45%)

Unsubscribe Rate: 0.3%              Bounce Rate: 0.1%
```

---

**[← Previous: Customization & Personalization](16-customization-personalization.md)** | **[Next: AI Learning & Feedback →](18-ai-learning-feedback.md)**
