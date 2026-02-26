# Users API (Admin)

All admin user endpoints require `Authorization: Bearer {token}` and the appropriate permission.

---

## GET /api/admin/users

List all users (paginated).

**Auth**: Bearer + `list-users` permission

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number (default: 1) |
| `per_page` | int | Items per page (default: 15) |
| `filter[id]` | int | Exact match by ID |
| `filter[status]` | string | Exact: `active`, `inactive`, `suspended` |
| `filter[type]` | string | Exact: `customer`, `admin` |
| `filter[name]` | string | Partial match on name |
| `filter[email]` | string | Partial match on email |
| `filter[phone]` | string | Partial match on phone |
| `filter[createdAtBetween]` | string | Date range: `2026-01-01,2026-12-31` |
| `filter[hasPermission]` | string | Users with specific permission |
| `filter[hasRole]` | string | Users with specific role |
| `include` | string | `roles` |
| `sort` | string | Field name. Prefix `-` for desc. Default: `-created_at` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "data": [
            {
                "id": 1,
                "name": "Admin User",
                "email": "admin@akaza.travel",
                "phone": null,
                "type": "admin",
                "status": "active",
                "locale": "en",
                "created_at": "2026-02-20T08:00:00.000000Z",
                "roles": [{ "id": 1, "name": "super-admin" }],
                "permissions": ["list-users", "create-user", "..."]
            }
        ],
        "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
        "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 1 }
    }
}
```

---

## POST /api/admin/users

Create a new user.

**Auth**: Bearer + `create-user` permission

**Request Body**:
```json
{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepass123",
    "phone": "+1234567890",
    "type": "admin",
    "status": "active",
    "roles": ["admin"]
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | max:255 |
| `email` | string | Yes | valid email, max:255, unique in `users` |
| `password` | string | Yes | min:8 |
| `phone` | string | No | max:20 |
| `type` | string | Yes | `customer` or `admin` |
| `status` | string | No | `active`, `inactive`, `suspended` (default: `active`) |
| `roles` | array | No | array of role names |
| `roles.*` | string | — | must exist in `roles` table |

**Response** `201`:
```json
{
    "status": 201,
    "success": true,
    "payload": {
        "id": 2,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1234567890",
        "type": "admin",
        "status": "active",
        "locale": "en",
        "created_at": "2026-02-21T10:00:00.000000Z",
        "roles": [{ "id": 2, "name": "admin" }],
        "permissions": []
    }
}
```

---

## GET /api/admin/users/{user}

Show a single user.

**Auth**: Bearer + `show-user` permission

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "id": 2,
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1234567890",
        "type": "admin",
        "status": "active",
        "locale": "en",
        "created_at": "2026-02-21T10:00:00.000000Z",
        "roles": [{ "id": 2, "name": "admin" }],
        "permissions": ["list-users", "create-user", "..."]
    }
}
```

---

## PUT /api/admin/users/{user}

Update a user.

**Auth**: Bearer + `update-user` permission. Changing roles also requires `assign-user-role` permission.

**Request Body** (all fields optional):
```json
{
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "password": "newpass123",
    "phone": "+9876543210",
    "type": "admin",
    "status": "inactive",
    "roles": ["finance-admin"]
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | No | max:255 |
| `email` | string | No | valid email, max:255, unique (excluding current user) |
| `password` | string | No | min:8 |
| `phone` | string | No | max:20 |
| `type` | string | No | `customer` or `admin` |
| `status` | string | No | `active`, `inactive`, `suspended` |
| `roles` | array | No | array of role names (requires `assign-user-role` permission) |
| `roles.*` | string | — | must exist in `roles` table |

**Response** `200`: Same shape as `GET /api/admin/users/{user}`.

---

## DELETE /api/admin/users/{user}

Soft-delete a user.

**Auth**: Bearer + `update-user` permission

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "message": "User has been deleted successfully."
    }
}
```

---

## Roles & Permissions

### Available Roles

| Role | Description |
|------|-------------|
| `super-admin` | Full access to everything (bypasses all permission checks) |
| `admin` | User/booking/content/customer/markup/audit/settings management |
| `finance-admin` | Financial dashboard, reports, export, refunds, booking read access |
| `customer` | No admin permissions (end-user) |

### Available Permissions

| Category | Permissions |
|----------|------------|
| Users | `list-users`, `create-user`, `update-user`, `show-user`, `assign-user-role` |
| Bookings | `list-bookings`, `show-booking`, `update-booking-status` |
| Hotel | `manage-hotel-bookings` |
| Tour | `manage-tour-bookings`, `create-tour`, `update-tour`, `delete-tour` |
| Transfer | `manage-transfer-bookings`, `create-transfer`, `update-transfer`, `delete-transfer` |
| Customer | `list-customers`, `show-customer`, `manage-leads`, `add-customer-notes` |
| Finance | `view-financial-dashboard`, `view-financial-reports`, `export-reports`, `manage-refunds`, `manage-markup` |
| Audit | `view-audit-logs` |
| Settings | `manage-settings` |
