# Customers API (CRM)

All customer endpoints are admin-only and require Bearer token + permission.

---

## GET /api/admin/customers

List all customers.

**Auth**: Bearer + `list-customers` permission

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter[status]` | string | `active`, `inactive`, `vip` |
| `filter[source]` | string | `booking`, `manual`, `lead` |
| `filter[email]` | string | Partial match |
| `include` | string | `notes` |
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
            "name": "John",
            "surname": "Doe",
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "nationality": "US",
            "language": "en",
            "source": "booking",
            "source_label": "Booking",
            "status": "active",
            "status_label": "Active",
            "status_color": "green",
            "total_bookings": 3,
            "total_spent": "450.00",
            "currency": "EUR",
            "last_booking_at": "2026-02-21T10:30:00.000Z",
            "created_at": "2026-02-20T08:00:00.000Z",
            "updated_at": "2026-02-21T10:30:00.000Z"
        }
    ]
}
```

### Customer Status Values

| Value | Color | Description |
|-------|-------|-------------|
| `active` | green | Active customer |
| `inactive` | gray | Inactive customer |
| `vip` | gold | VIP customer |

### Customer Source Values

| Value | Description |
|-------|-------------|
| `booking` | Created automatically from a booking |
| `manual` | Manually created by admin |
| `lead` | Converted from a lead |

---

## GET /api/admin/customers/{customer}

Show a single customer.

**Auth**: Bearer + `show-customer` permission

**Response** `200`: Single `CustomerResource` with `notes` loaded.

---

## PUT /api/admin/customers/{customer}

Update a customer.

**Auth**: Bearer + `show-customer` permission

**Request Body**:
```json
{
    "name": "John",
    "surname": "Smith",
    "phone": "+9876543210",
    "nationality": "GB",
    "language": "de",
    "status": "vip"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | No | max:255 |
| `surname` | string | No | max:255 |
| `phone` | string | No | max:20 |
| `nationality` | string | No | max:100 |
| `language` | string | No | `en`, `de`, `fr` |
| `status` | string | No | `active`, `inactive`, `vip` |

**Response** `200`: Updated `CustomerResource`.

---

## GET /api/admin/customers/{customer}/booking-history

Get unified booking history across hotel, tour, and transfer bookings.

**Auth**: Bearer + `show-customer` permission

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "booking_reference": "AKZ-H-...",
            "status": "confirmed",
            "total_price": "220.00",
            "currency": "EUR",
            "created_at": "2026-02-21T10:30:00.000Z",
            "type": "hotel"
        },
        {
            "id": 2,
            "booking_reference": "AKZ-T-...",
            "status": "confirmed",
            "total_price": "90.00",
            "currency": "EUR",
            "created_at": "2026-02-20T08:00:00.000Z",
            "type": "tour"
        }
    ]
}
```

---

## Customer Notes

---

### GET /api/admin/customers/{customer}/notes

List notes for a customer.

**Auth**: Bearer + `add-customer-notes` permission

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "customer_id": 1,
            "created_by": 1,
            "type": "note",
            "type_label": "Note",
            "content": "Customer prefers German language communications",
            "is_pinned": true,
            "follow_up_date": null,
            "follow_up_status": null,
            "created_at": "2026-02-21T10:00:00.000Z",
            "updated_at": "2026-02-21T10:00:00.000Z"
        }
    ]
}
```

### Note Types

| Value | Description |
|-------|-------------|
| `note` | General note |
| `follow_up` | Follow-up reminder |
| `complaint` | Customer complaint |

---

### POST /api/admin/customers/{customer}/notes

Create a note.

**Auth**: Bearer + `add-customer-notes` permission

**Request Body**:
```json
{
    "type": "follow_up",
    "content": "Call customer about tour feedback",
    "is_pinned": false,
    "follow_up_date": "2026-03-01"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `type` | string | No | `note` (default), `follow_up`, `complaint` |
| `content` | string | Yes | max:5000 |
| `is_pinned` | bool | No | default: false |
| `follow_up_date` | date | No | after or equal to today |

**Response** `201`: `CustomerNoteResource`.

---

### PUT /api/admin/customers/{customer}/notes/{note}

Update a note.

**Auth**: Bearer + `add-customer-notes` permission

---

### DELETE /api/admin/customers/{customer}/notes/{note}

Soft-delete a note.

**Auth**: Bearer + `add-customer-notes` permission

---

## GET /api/admin/customers/follow-ups/overdue

List all overdue follow-ups across all customers.

**Auth**: Bearer + `add-customer-notes` permission

**Response** `200`: Array of `CustomerNoteResource` objects where `follow_up_date < today` and `follow_up_status != 'done'`.

---

## Leads

---

### GET /api/admin/leads

List all leads.

**Auth**: Bearer + `manage-leads` permission

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter[status]` | string | `new`, `contacted`, `qualified`, `converted`, `lost` |
| `filter[source]` | string | `hotel_booking`, `tour_booking`, `transfer_booking`, `website`, `manual` |
| `include` | string | `customer` |
| `sort` | string | Default: `-created_at` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "customer_id": null,
            "name": "Jane Smith",
            "email": "jane@example.com",
            "phone": "+1234567890",
            "source": "website",
            "status": "new",
            "status_label": "New",
            "status_color": "blue",
            "notes": "Interested in Nile cruise packages",
            "assigned_to": 1,
            "converted_at": null,
            "created_at": "2026-02-21T10:00:00.000Z",
            "updated_at": "2026-02-21T10:00:00.000Z"
        }
    ]
}
```

### Lead Status Values

| Value | Color | Description |
|-------|-------|-------------|
| `new` | blue | New lead |
| `contacted` | yellow | Lead has been contacted |
| `qualified` | orange | Lead is qualified |
| `converted` | green | Lead converted to customer |
| `lost` | gray | Lead lost |

---

### POST /api/admin/leads

Create a lead.

**Auth**: Bearer + `manage-leads` permission

**Request Body**:
```json
{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "source": "website",
    "notes": "Interested in Nile cruise packages",
    "assigned_to": 1
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | max:255 |
| `email` | string | Yes | valid email, max:255 |
| `phone` | string | No | max:20 |
| `source` | string | No | `hotel_booking`, `tour_booking`, `transfer_booking`, `website`, `manual` |
| `notes` | string | No | max:5000 |
| `assigned_to` | int | No | must exist in `users` |

**Response** `201`: `CustomerLeadResource`.

---

### GET /api/admin/leads/{lead}

**Auth**: Bearer + `manage-leads` permission

---

### PUT /api/admin/leads/{lead}

Update a lead. Same fields as create (all optional), plus `status`.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `status` | string | No | `new`, `contacted`, `qualified`, `converted`, `lost` |

**Auth**: Bearer + `manage-leads` permission

---

### POST /api/admin/leads/{lead}/convert

Convert a lead to a customer. Creates a new customer record from the lead's data and sets `status` to `converted`.

**Auth**: Bearer + `manage-leads` permission

**Request Body**: None

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "message": "Lead converted to customer successfully.",
        "customer": { "id": 5, "name": "Jane", "email": "jane@example.com", "..." : "..." }
    }
}
```
