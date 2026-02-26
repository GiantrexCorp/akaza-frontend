# Notifications API

## User Endpoints (Bearer required)

---

### GET /api/notifications

List the authenticated user's in-app notifications (paginated).

**Auth**: Bearer token required

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "data": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "type": "Src\\Domain\\Notification\\Notifications\\BaseBookingNotification",
                "data": {
                    "type": "reconciliation_alert",
                    "subject": "Reconciliation Alert - AKZ-H-...",
                    "body": "A hotel booking (AKZ-H-...) requires reconciliation..."
                },
                "read_at": null,
                "created_at": "2026-02-21T10:30:00.000000Z"
            }
        ],
        "links": { "..." : "..." },
        "meta": { "current_page": 1, "per_page": 20, "total": 5 }
    }
}
```

**Notes**: Uses Laravel's built-in notification system. Only notifications sent via the `database` channel appear here (e.g., reconciliation alerts).

---

### POST /api/notifications/{id}/read

Mark a single notification as read.

**Auth**: Bearer token required

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": { "message": "Notification marked as read." }
}
```

---

### POST /api/notifications/read-all

Mark all unread notifications as read.

**Auth**: Bearer token required

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": { "message": "All notifications marked as read." }
}
```

---

## Admin Endpoints (Bearer + Permission)

---

### GET /api/admin/notification-templates

List all notification templates.

**Auth**: Bearer + `manage-notification-templates` permission

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter[type]` | string | Exact notification type |
| `filter[channel]` | string | `mail` or `database` |
| `filter[is_active]` | bool | `1` or `0` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "type": "hotel_booking_confirmed",
            "type_label": "Hotel Booking Confirmed",
            "channel": "mail",
            "channel_label": "Email",
            "subject": {
                "en": "Your Hotel Booking is Confirmed - {{booking_reference}}",
                "de": "Ihre Hotelbuchung ist bestätigt - {{booking_reference}}",
                "fr": "Votre réservation d'hôtel est confirmée - {{booking_reference}}"
            },
            "body": {
                "en": "Dear {{guest_name}}, your hotel booking at {{hotel_name}} has been confirmed...",
                "de": "Sehr geehrte(r) {{guest_name}}, Ihre Hotelbuchung im {{hotel_name}} wurde bestätigt...",
                "fr": "Cher(e) {{guest_name}}, votre réservation à l'hôtel {{hotel_name}} a été confirmée..."
            },
            "variables": ["booking_reference", "hotel_name", "check_in", "check_out", "guest_name", "status"],
            "is_active": true,
            "created_at": "2026-02-21T10:00:00+00:00",
            "updated_at": "2026-02-21T10:00:00+00:00"
        }
    ]
}
```

---

### GET /api/admin/notification-templates/{notificationTemplate}

Show a single template.

**Auth**: Bearer + `manage-notification-templates` permission

---

### PUT /api/admin/notification-templates/{notificationTemplate}

Update a notification template. Admins can customize subject/body text, change channel, or disable templates.

**Auth**: Bearer + `manage-notification-templates` permission

**Request Body**:
```json
{
    "channel": "mail",
    "subject": {
        "en": "Updated Subject - {{booking_reference}}",
        "de": "Aktualisierter Betreff - {{booking_reference}}",
        "fr": "Sujet mis à jour - {{booking_reference}}"
    },
    "body": {
        "en": "Updated body content...",
        "de": "Aktualisierter Inhalt...",
        "fr": "Contenu mis à jour..."
    },
    "is_active": true
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `channel` | string | No | `mail` or `database` |
| `subject` | object | No | |
| `subject.en` | string | If subject sent | max:255 |
| `subject.de` | string | No | max:255 |
| `subject.fr` | string | No | max:255 |
| `body` | object | No | |
| `body.en` | string | If body sent | |
| `body.de` | string | No | |
| `body.fr` | string | No | |
| `is_active` | bool | No | |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "message": "Notification template updated successfully.",
        "template": { "..." : "..." }
    }
}
```

---

### GET /api/admin/notification-logs

List notification delivery logs.

**Auth**: Bearer + `view-notification-logs` permission

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter[type]` | string | Notification type |
| `filter[channel]` | string | `mail` or `database` |
| `filter[status]` | string | `pending`, `sent`, `failed` |
| `filter[user_id]` | int | Filter by recipient user |
| `filter[byDateRange]` | string | `2026-01-01,2026-12-31` |
| `include` | string | `user` |
| `sort` | string | Default: `-created_at` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "user_id": 5,
            "type": "hotel_booking_confirmed",
            "type_label": "Hotel Booking Confirmed",
            "channel": "mail",
            "recipient_email": "john@example.com",
            "subject": "Your Hotel Booking is Confirmed - AKZ-H-...",
            "status": "sent",
            "status_label": "Sent",
            "error_message": null,
            "metadata": {},
            "sent_at": "2026-02-21T10:30:00+00:00",
            "created_at": "2026-02-21T10:30:00+00:00"
        }
    ]
}
```

---

### GET /api/admin/notification-logs/{notificationLog}

Show a single log entry with user relation.

**Auth**: Bearer + `view-notification-logs` permission

---

## Notification Types

| Type | Channel | Trigger |
|------|---------|---------|
| `hotel_booking_confirmed` | mail | Hotel booking confirmed |
| `hotel_booking_cancelled` | mail | Hotel booking cancelled |
| `tour_booking_confirmed` | mail | Tour booking confirmed |
| `tour_booking_cancelled` | mail | Tour booking cancelled |
| `transfer_booking_confirmed` | mail | Transfer booking confirmed |
| `transfer_booking_cancelled` | mail | Transfer booking cancelled |
| `voucher_delivery` | mail | Voucher PDF is ready |
| `reconciliation_alert` | database | Hotel booking needs reconciliation |

## Template Variables

Templates use `{{variable}}` syntax for dynamic content. Each template type has its own set of variables:

| Type | Variables |
|------|-----------|
| Hotel (confirmed/cancelled) | `booking_reference`, `hotel_name`, `check_in`, `check_out`, `guest_name`, `status` |
| Tour (confirmed/cancelled) | `booking_reference`, `tour_name`, `tour_date`, `guest_name`, `guests_count`, `status` |
| Transfer (confirmed/cancelled) | `booking_reference`, `pickup_location`, `dropoff_location`, `pickup_date`, `guest_name`, `status` |
| Voucher delivery | `booking_reference`, `booking_type`, `guest_name` |
| Reconciliation alert | `booking_reference`, `booking_type`, `issue`, `amount` |

## Log Status Values

| Value | Color | Description |
|-------|-------|-------------|
| `pending` | yellow | Notification queued |
| `sent` | green | Successfully delivered |
| `failed` | red | Delivery failed (see `error_message`) |
