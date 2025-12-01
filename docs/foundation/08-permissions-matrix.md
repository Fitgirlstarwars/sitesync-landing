# SiteSync V3 - Permissions Matrix

> **Who Can Do What** - Complete RBAC permission matrix for all roles and resources.

---

## RBAC Overview

SiteSync uses **Role-Based Access Control (RBAC)** where:

1. **Users** are assigned a **Role**
2. **Roles** have default **Permissions**
3. **Permissions** control **Actions** on **Resources**
4. Additional permissions can be granted per-user

```
User → Role → Default Permissions → Access
         ↓
    + Additional Permissions (optional)
```

---

## Role Definitions

| Role | Code | Level | Description |
|------|------|-------|-------------|
| **Owner** | `owner` | 100 | Organization owner, full control |
| **Admin** | `admin` | 90 | Administrator, all except billing |
| **Manager** | `manager` | 70 | Operations manager |
| **User** | `user` | 50 | Standard user |
| **Technician** | `technician` | 40 | Field technician |
| **Readonly** | `readonly` | 20 | View-only access |
| **Guest** | `guest` | 10 | Temporary/limited access |

### Role Inheritance

Higher roles inherit permissions from lower roles:

```
Owner ──────────► Has all Admin permissions + billing
  │
Admin ──────────► Has all Manager permissions + users
  │
Manager ────────► Has all User permissions + sites + contractors
  │
User ───────────► Has all Technician permissions + create work orders
  │
Technician ─────► Has Readonly permissions + assigned work
  │
Readonly ───────► View only
  │
Guest ──────────► Limited view
```

---

## Master Permissions Matrix

### Organization Management

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| View organization | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit organization | ✓ | ✓ | - | - | - | - | - |
| Delete organization | ✓ | - | - | - | - | - | - |
| Manage billing | ✓ | - | - | - | - | - | - |
| View subscription | ✓ | ✓ | - | - | - | - | - |
| Upgrade subscription | ✓ | - | - | - | - | - | - |
| Edit settings | ✓ | ✓ | - | - | - | - | - |

### User Management

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| View users list | ✓ | ✓ | ✓ | - | - | - | - |
| View user profile | ✓ | ✓ | ✓ | Self | Self | Self | Self |
| Create user | ✓ | ✓ | - | - | - | - | - |
| Edit user | ✓ | ✓ | - | Self | Self | - | - |
| Delete user | ✓ | ✓ | - | - | - | - | - |
| Change user role | ✓ | ✓* | - | - | - | - | - |
| Reset password | ✓ | ✓ | - | Self | Self | - | - |
| Deactivate user | ✓ | ✓ | - | - | - | - | - |

*Admin can assign roles up to Manager level only

### Site Management

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| View sites list | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View site details | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create site | ✓ | ✓ | ✓ | - | - | - | - |
| Edit site | ✓ | ✓ | ✓ | - | - | - | - |
| Delete site | ✓ | ✓ | - | - | - | - | - |
| View access codes | ✓ | ✓ | ✓ | ✓ | ✓* | - | - |
| Edit access codes | ✓ | ✓ | ✓ | - | - | - | - |
| View health score | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |

*Technicians see access codes only for assigned work orders

### Asset/Elevator Management

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| View elevators list | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View elevator details | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create elevator | ✓ | ✓ | ✓ | ✓ | - | - | - |
| Edit elevator | ✓ | ✓ | ✓ | ✓ | - | - | - |
| Delete elevator | ✓ | ✓ | ✓ | - | - | - | - |
| Change status | ✓ | ✓ | ✓ | ✓ | ✓* | - | - |
| View specifications | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Edit specifications | ✓ | ✓ | ✓ | ✓ | - | - | - |
| View AI quirks | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |

*Technicians can change status on assigned elevators only

### Work Order Management

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| View all work orders | ✓ | ✓ | ✓ | ✓ | - | ✓ | - |
| View assigned work orders | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Create work order | ✓ | ✓ | ✓ | ✓ | - | - | - |
| Edit work order | ✓ | ✓ | ✓ | ✓ | ✓* | - | - |
| Delete work order | ✓ | ✓ | ✓ | - | - | - | - |
| Cancel work order | ✓ | ✓ | ✓ | ✓ | - | - | - |
| Assign contractor | ✓ | ✓ | ✓ | - | - | - | - |
| Reassign contractor | ✓ | ✓ | ✓ | - | - | - | - |
| Change priority | ✓ | ✓ | ✓ | ✓ | - | - | - |
| Change status | ✓ | ✓ | ✓ | ✓ | ✓* | - | - |
| Add notes | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| Add photos | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| Log labor | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| Log parts | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| Complete work order | ✓ | ✓ | ✓ | ✓ | ✓* | - | - |
| View costs | ✓ | ✓ | ✓ | ✓ | - | ✓ | - |
| Request AI diagnosis | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |

*Technicians can only modify their assigned work orders

### Contractor Management

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| View contractors | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| View contractor details | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Create contractor | ✓ | ✓ | ✓ | - | - | - | - |
| Edit contractor | ✓ | ✓ | ✓ | - | - | - | - |
| Delete contractor | ✓ | ✓ | - | - | - | - | - |
| Set preferred | ✓ | ✓ | ✓ | - | - | - | - |
| View rates | ✓ | ✓ | ✓ | - | - | - | - |
| Edit rates | ✓ | ✓ | ✓ | - | - | - | - |
| View performance | ✓ | ✓ | ✓ | ✓ | - | ✓ | - |

### Inventory Management

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| View inventory | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| View item details | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Create item | ✓ | ✓ | ✓ | - | - | - | - |
| Edit item | ✓ | ✓ | ✓ | - | - | - | - |
| Delete item | ✓ | ✓ | - | - | - | - | - |
| View stock levels | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Adjust stock | ✓ | ✓ | ✓ | ✓ | - | - | - |
| Transfer stock | ✓ | ✓ | ✓ | - | - | - | - |
| View van stock | ✓ | ✓ | ✓ | ✓ | ✓* | ✓ | - |

*Technicians can only view their own van stock

### Reports & Analytics

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| View dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| View basic reports | ✓ | ✓ | ✓ | ✓ | - | ✓ | - |
| View advanced reports | ✓ | ✓ | ✓ | - | - | - | - |
| Export reports | ✓ | ✓ | ✓ | - | - | - | - |
| View financial reports | ✓ | ✓ | - | - | - | - | - |
| View performance reports | ✓ | ✓ | ✓ | - | - | - | - |
| Schedule reports | ✓ | ✓ | ✓ | - | - | - | - |

### AI Features

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| Use AI diagnosis | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| View AI suggestions | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Rate AI accuracy | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |
| Search knowledge base | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Contribute to knowledge | ✓ | ✓ | ✓ | ✓ | ✓ | - | - |

### Audit & Compliance

| Action | Owner | Admin | Manager | User | Tech | Readonly | Guest |
|--------|:-----:|:-----:|:-------:|:----:|:----:|:--------:|:-----:|
| View audit log | ✓ | ✓ | ✓ | - | - | ✓ | - |
| Export audit log | ✓ | ✓ | - | - | - | - | - |
| View compliance status | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | - |
| Generate compliance reports | ✓ | ✓ | ✓ | - | - | - | - |

---

## Permission Codes

### Format

Permissions use the format: `resource:action`

### Complete Permission List

```python
# Organization
"org:view"
"org:edit"
"org:delete"
"org:billing"
"org:settings"

# Users
"users:list"
"users:view"
"users:create"
"users:edit"
"users:delete"
"users:roles"

# Sites
"sites:list"
"sites:view"
"sites:create"
"sites:edit"
"sites:delete"
"sites:access_codes"

# Assets/Elevators
"assets:list"
"assets:view"
"assets:create"
"assets:edit"
"assets:delete"
"assets:status"

# Work Orders
"work_orders:list"
"work_orders:view"
"work_orders:view_assigned"
"work_orders:create"
"work_orders:edit"
"work_orders:edit_assigned"
"work_orders:delete"
"work_orders:assign"
"work_orders:complete"

# Contractors
"contractors:list"
"contractors:view"
"contractors:create"
"contractors:edit"
"contractors:delete"
"contractors:rates"

# Inventory
"inventory:list"
"inventory:view"
"inventory:create"
"inventory:edit"
"inventory:delete"
"inventory:adjust"
"inventory:transfer"

# Reports
"reports:basic"
"reports:advanced"
"reports:export"
"reports:financial"

# AI
"ai:diagnose"
"ai:contribute"

# Audit
"audit:view"
"audit:export"
```

---

## Default Permissions by Role

### Owner Permissions

```json
[
  "org:*",
  "users:*",
  "sites:*",
  "assets:*",
  "work_orders:*",
  "contractors:*",
  "inventory:*",
  "reports:*",
  "ai:*",
  "audit:*"
]
```

### Admin Permissions

```json
[
  "org:view",
  "org:edit",
  "org:settings",
  "users:*",
  "sites:*",
  "assets:*",
  "work_orders:*",
  "contractors:*",
  "inventory:*",
  "reports:*",
  "ai:*",
  "audit:view"
]
```

### Manager Permissions

```json
[
  "org:view",
  "users:list",
  "users:view",
  "sites:*",
  "assets:*",
  "work_orders:*",
  "contractors:*",
  "inventory:list",
  "inventory:view",
  "inventory:adjust",
  "reports:basic",
  "reports:advanced",
  "reports:export",
  "ai:*",
  "audit:view"
]
```

### User Permissions

```json
[
  "org:view",
  "sites:list",
  "sites:view",
  "assets:list",
  "assets:view",
  "assets:create",
  "assets:edit",
  "work_orders:list",
  "work_orders:view",
  "work_orders:create",
  "work_orders:edit",
  "contractors:list",
  "contractors:view",
  "inventory:list",
  "inventory:view",
  "reports:basic",
  "ai:diagnose"
]
```

### Technician Permissions

```json
[
  "org:view",
  "sites:list",
  "sites:view",
  "sites:access_codes",
  "assets:list",
  "assets:view",
  "assets:status",
  "work_orders:view_assigned",
  "work_orders:edit_assigned",
  "work_orders:complete",
  "contractors:view",
  "inventory:list",
  "inventory:view",
  "ai:diagnose",
  "ai:contribute"
]
```

### Readonly Permissions

```json
[
  "org:view",
  "sites:list",
  "sites:view",
  "assets:list",
  "assets:view",
  "work_orders:list",
  "work_orders:view",
  "contractors:list",
  "contractors:view",
  "inventory:list",
  "inventory:view",
  "reports:basic",
  "audit:view"
]
```

### Guest Permissions

```json
[
  "org:view",
  "sites:list",
  "sites:view",
  "assets:list",
  "assets:view"
]
```

---

## Special Access Rules

### Self-Service Actions

Users can always perform these actions on their own profile:
- View own profile
- Edit own profile (name, phone, avatar)
- Change own password
- Update notification preferences

### Assigned Work Rules

Technicians have elevated access for **assigned work orders only**:
- View work order details
- Edit work order (notes, status, parts, labor)
- View site access codes
- Change elevator status
- Complete work order

### Cross-Organization Access

**Contractors** (external) access via Contractor Portal:
- View assigned work orders
- View site access instructions
- Update work order status
- Log time and parts
- Cannot see other work orders or sites

---

## Permission Checking

### API Authorization

```python
# FastAPI dependency
async def require_permission(
    permission: str,
    user: User = Depends(get_current_user),
):
    """Check if user has required permission."""
    if not has_permission(user, permission):
        raise HTTPException(
            status_code=403,
            detail=f"Permission denied: {permission}"
        )

def has_permission(user: User, permission: str) -> bool:
    """Check if user has permission via role or explicit grant."""
    # Get default permissions for role
    role_permissions = ROLE_PERMISSIONS.get(user.role, [])

    # Combine with explicit permissions
    all_permissions = set(role_permissions) | set(user.permissions)

    # Check for wildcard or specific permission
    resource = permission.split(":")[0]
    return (
        f"{resource}:*" in all_permissions or
        permission in all_permissions
    )

# Usage in route
@router.post("/sites")
async def create_site(
    site: SiteCreate,
    _: None = Depends(require_permission("sites:create")),
    db: AsyncSession = Depends(get_db),
):
    ...
```

### Frontend Permission Checking

```typescript
// React hook for permission checking
function usePermission(permission: string): boolean {
  const { user } = useAuth();

  if (!user) return false;

  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  const allPermissions = [...rolePermissions, ...user.permissions];

  const resource = permission.split(':')[0];
  return (
    allPermissions.includes(`${resource}:*`) ||
    allPermissions.includes(permission)
  );
}

// Usage in component
function CreateSiteButton() {
  const canCreate = usePermission('sites:create');

  if (!canCreate) return null;

  return <Button onClick={handleCreate}>Add Site</Button>;
}
```

---

## Audit Trail

All permission-related events are logged:

```json
{
  "event_type": "permission_denied",
  "actor_id": "user-uuid",
  "actor_email": "user@example.com",
  "permission": "sites:delete",
  "resource_type": "site",
  "resource_id": "site-uuid",
  "ip_address": "192.168.1.1",
  "created_at": "2024-12-01T10:00:00Z"
}
```

---

**[← Previous: Creation Flows](07-creation-flows.md)** | **[Next: State Machines →](09-state-machines.md)**
