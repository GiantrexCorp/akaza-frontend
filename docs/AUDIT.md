# Audit API

All audit endpoints are admin-only and require Bearer token + `view-audit-logs` permission.

---

## GET /api/admin/audit-logs

List audit log entries.

**Auth**: Bearer + `view-audit-logs` permission

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter[action]` | string | Exact action value (see table below) |
| `filter[entity_type]` | string | Exact entity type (see table below) |
| `filter[entity_id]` | int | Exact entity ID |
| `filter[user_id]` | int | Filter by acting user |
| `filter[byDateRange]` | string | `2026-01-01,2026-12-31` |
| `sort` | string | Default: `-created_at` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "user_id": 1,
            "user_name": "Admin User",
            "action": "settings_updated",
            "action_label": "Settings Updated",
            "entity_type": "setting",
            "entity_type_label": "Setting",
            "entity_id": null,
            "description": "Bulk settings update",
            "old_values": null,
            "new_values": { "hotel_markup_percentage": "15" },
            "ip_address": "192.168.1.1",
            "user_agent": "Mozilla/5.0...",
            "metadata": null,
            "created_at": "2026-02-21T10:30:00.000Z"
        }
    ]
}
```

---

## GET /api/admin/audit-logs/{auditLog}

Show a single audit log entry.

**Auth**: Bearer + `view-audit-logs` permission

**Response** `200`: Single audit log object with `user` relation loaded.

---

## Action Values

| Value | Label | Description |
|-------|-------|-------------|
| `created` | Created | Resource was created |
| `updated` | Updated | Resource was updated |
| `deleted` | Deleted | Resource was deleted |
| `status_changed` | Status Changed | Booking status was changed |
| `login` | Login | User logged in |
| `logout` | Logout | User logged out |
| `reconciled` | Reconciled | Hotel booking retry succeeded |
| `refunded` | Refunded | Hotel booking force refund |
| `markup_changed` | Markup Changed | Hotel markup percentage changed |
| `settings_updated` | Settings Updated | System settings bulk updated |
| `role_assigned` | Role Assigned | Role was assigned to user |
| `exported` | Exported | Data was exported |

## Entity Type Values

| Value | Label |
|-------|-------|
| `user` | User |
| `hotel_booking` | Hotel Booking |
| `tour` | Tour |
| `tour_booking` | Tour Booking |
| `transfer_vehicle` | Transfer Vehicle |
| `transfer_route` | Transfer Route |
| `transfer_booking` | Transfer Booking |
| `customer` | Customer |
| `lead` | Lead |
| `setting` | Setting |

## What Gets Audited

| Action | Entity | Trigger |
|--------|--------|---------|
| Settings bulk update | `setting` | Admin updates system settings |
| Hotel reconcile (retry) | `hotel_booking` | Admin retries a failed booking |
| Hotel reconcile (refund) | `hotel_booking` | Admin force-refunds a booking |
| Tour created/updated/deleted | `tour` | Admin CRUD on tours |
| Tour booking status change | `tour_booking` | Admin changes booking status |
| Vehicle created/updated/deleted | `transfer_vehicle` | Admin CRUD on vehicles |
| Route created/updated/deleted | `transfer_route` | Admin CRUD on routes |
| Transfer booking status change | `transfer_booking` | Admin changes booking status |
