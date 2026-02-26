# Tours API

## Public Endpoints

---

### GET /api/tours

List all active tours.

**Auth**: None

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter[location]` | string | Filter by location |
| `filter[status]` | string | Filter by status |
| `sort` | string | Default: `-created_at` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "title": { "en": "Pyramids Tour", "de": "Pyramidentour", "fr": "Tour des Pyramides" },
            "translated_title": "Pyramids Tour",
            "description": { "en": "...", "de": "...", "fr": "..." },
            "translated_description": "...",
            "slug": "pyramids-tour",
            "location": "Cairo, Egypt",
            "latitude": 29.9792,
            "longitude": 31.1342,
            "duration_hours": 6,
            "duration_days": null,
            "price_per_person": "45.00",
            "formatted_price": "45.00 EUR",
            "max_capacity": 20,
            "status": "active",
            "status_label": "Active",
            "status_color": "green",
            "currency": "EUR",
            "highlights": ["Visit the Great Pyramid", "Sphinx photo stop"],
            "includes": ["Transport", "Guide", "Lunch"],
            "excludes": ["Tips", "Personal expenses"],
            "images": [
                { "id": 1, "url": "https://...", "name": "pyramids.jpg" }
            ],
            "created_at": "2026-02-21T10:00:00.000Z",
            "updated_at": "2026-02-21T10:00:00.000Z"
        }
    ]
}
```

---

### GET /api/tours/{tour}

Show a single tour with details.

**Auth**: None

**Response** `200`: Single tour object (same shape as list item, with `availabilities` included).

---

### GET /api/tours/{tour}/availabilities

List available dates for a tour.

**Auth**: None

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "tour_id": 1,
            "date": "2026-03-15",
            "start_time": "09:00",
            "total_spots": 20,
            "booked_spots": 5,
            "remaining_spots": 15,
            "price_override": null,
            "effective_price": "45.00",
            "status": "available",
            "status_label": "Available",
            "status_color": "green",
            "created_at": "2026-02-21T10:00:00.000Z"
        }
    ]
}
```

**Key Fields**:
- `remaining_spots`: `total_spots - booked_spots`
- `effective_price`: Uses `price_override` if set, otherwise falls back to the tour's `price_per_person`

---

## User Endpoints (Bearer required)

---

### POST /api/tours/bookings

Create a tour booking.

**Auth**: Bearer token required

**Request Body**:
```json
{
    "tour_id": 1,
    "tour_availability_id": 1,
    "contact_name": "John Doe",
    "contact_email": "john@example.com",
    "contact_phone": "+1234567890",
    "special_requests": "Vegetarian lunch please",
    "guests": [
        { "name": "John", "surname": "Doe", "type": "AD" },
        { "name": "Jane", "surname": "Doe", "type": "CH", "age": 8 }
    ]
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `tour_id` | int | Yes | must exist in `tours` |
| `tour_availability_id` | int | Yes | must exist in `tour_availabilities` |
| `contact_name` | string | Yes | max:255 |
| `contact_email` | string | Yes | valid email, max:255 |
| `contact_phone` | string | No | max:20 |
| `special_requests` | string | No | max:2000 |
| `guests` | array | Yes | min:1 |
| `guests.*.name` | string | Yes | max:255 |
| `guests.*.surname` | string | Yes | max:255 |
| `guests.*.type` | string | No | `AD` (adult, default) or `CH` (child) |
| `guests.*.age` | int | No | 0–120 |

**Response** `201`:
```json
{
    "status": 201,
    "success": true,
    "payload": {
        "id": 1,
        "booking_reference": "AKZ-T-67B8A1C2D3E4F",
        "status": "confirmed",
        "status_label": "Confirmed",
        "status_color": "green",
        "tour": { "id": 1, "translated_title": "Pyramids Tour", "..." : "..." },
        "tour_date": "2026-03-15",
        "number_of_guests": 2,
        "price_per_person": "45.00",
        "total_price": "90.00",
        "formatted_total_price": "90.00 EUR",
        "currency": "EUR",
        "contact_name": "John Doe",
        "contact_email": "john@example.com",
        "contact_phone": "+1234567890",
        "special_requests": "Vegetarian lunch please",
        "is_cancellable": true,
        "confirmed_at": "2026-02-21T10:30:00.000Z",
        "cancelled_at": null,
        "cancellation_reason": null,
        "refund_amount": null,
        "voucher_path": "vouchers/tour/AKZ-T-67B8A1C2D3E4F.pdf",
        "guests": [
            { "id": 1, "name": "John", "surname": "Doe", "type": "AD", "type_label": "Adult", "age": null },
            { "id": 2, "name": "Jane", "surname": "Doe", "type": "CH", "type_label": "Child", "age": 8 }
        ],
        "status_logs": [ ... ],
        "created_at": "2026-02-21T10:30:00.000Z",
        "updated_at": "2026-02-21T10:30:00.000Z"
    }
}
```

### Booking Flow
1. Validates availability has enough `remaining_spots` for the guest count
2. Calculates `total_price = effective_price * guest_count`
3. Creates booking + guest records
4. Increments `booked_spots` on the availability (marks as `full` if no spots remain)
5. **Auto-confirms** the booking immediately
6. Generates PDF voucher
7. Creates CRM customer record
8. Sends confirmation email notification

**Errors**:
- `422` — No spots available, availability not found, or validation failed

---

### GET /api/tours/bookings

List the authenticated user's tour bookings.

**Auth**: Bearer token required

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter[status]` | string | Filter by booking status |
| `include` | string | `tour`, `guests`, `statusLogs` |
| `sort` | string | Default: `-created_at` |

**Response** `200`: Array of `TourBookingResource` objects.

---

### GET /api/tours/bookings/{booking}

Show a specific tour booking.

**Auth**: Bearer token required (own booking or `manage-tour-bookings` permission)

**Response** `200`: Single `TourBookingResource` with `tour`, `guests`, `statusLogs` loaded.

---

### POST /api/tours/bookings/{booking}/cancel

Cancel a tour booking.

**Auth**: Bearer token required (must be booking owner + booking must be cancellable)

**Request Body**:
```json
{
    "reason": "Change of plans"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `reason` | string | No | max:1000 |

**Response** `200`: Updated `TourBookingResource` with `status: "cancelled"`.

### Cancellation Flow
1. Validates booking `is_cancellable` (only `pending` or `confirmed` status)
2. Status → `cancelled`, sets `cancelled_at`, `refund_amount = total_price`
3. Decrements `booked_spots` on the availability (reopens if was `full`)
4. Sends cancellation email notification

---

### GET /api/tours/bookings/{booking}/voucher

Download the booking voucher as PDF.

**Auth**: Bearer token required (own booking or `manage-tour-bookings` permission)

**Response** `200`:
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="voucher-AKZ-T-....pdf"`
- A4 portrait PDF with tour name, date, guests, contact info, branding

**Errors**:
- `404` — Voucher not available

---

## Admin Endpoints (Bearer + Permission)

---

### GET /api/admin/tours

List all tours (including draft/inactive).

**Auth**: Bearer + `create-tour` permission

**Query Parameters**: Same filtering/sorting as public list.

---

### POST /api/admin/tours

Create a new tour.

**Auth**: Bearer + `create-tour` permission

**Request Body**:
```json
{
    "title": { "en": "Pyramids Tour", "de": "Pyramidentour", "fr": "Tour des Pyramides" },
    "description": { "en": "...", "de": "...", "fr": "..." },
    "location": "Cairo, Egypt",
    "latitude": 29.9792,
    "longitude": 31.1342,
    "duration_hours": 6,
    "duration_days": null,
    "price_per_person": 45.00,
    "max_capacity": 20,
    "currency": "EUR",
    "highlights": ["Visit the Great Pyramid"],
    "includes": ["Transport", "Guide"],
    "excludes": ["Tips"]
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `title` | object | Yes | `en`, `de`, `fr` keys required, each max:255 |
| `description` | object | Yes | `en`, `de`, `fr` keys required |
| `location` | string | Yes | max:255 |
| `latitude` | float | No | -90 to 90 |
| `longitude` | float | No | -180 to 180 |
| `duration_hours` | int | No | min:0 |
| `duration_days` | int | No | min:0 |
| `price_per_person` | float | Yes | min:0 |
| `max_capacity` | int | Yes | min:1 |
| `currency` | string | No | 3 chars (default: EUR) |
| `highlights` | array | No | |
| `includes` | array | No | |
| `excludes` | array | No | |

**Response** `201`: `TourResource` object. Tour is created with `status: "draft"`.

---

### GET /api/admin/tours/{tour}

**Auth**: Bearer + `create-tour` permission

**Response** `200`: `TourResource` with `media` and `availabilities` loaded.

---

### PUT /api/admin/tours/{tour}

Update a tour. Same fields as create, all optional. Adds `status` field:

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `status` | string | No | `draft`, `active`, `inactive` |

**Auth**: Bearer + `update-tour` permission

**Response** `200`: Updated `TourResource`.

---

### DELETE /api/admin/tours/{tour}

Soft-delete a tour.

**Auth**: Bearer + `delete-tour` permission

**Response** `200`:
```json
{ "status": 200, "success": true, "payload": { "message": "Tour deleted successfully." } }
```

---

### POST /api/admin/tours/{tour}/images

Upload images for a tour.

**Auth**: Bearer + `update-tour` permission

**Request Body**: `multipart/form-data`

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `images[]` | file | Yes | image, max:5MB each |

**Response** `201`: `TourResource` with updated `images` array.

---

### DELETE /api/admin/tours/{tour}/images/{media}

Delete a specific image from a tour.

**Auth**: Bearer + `update-tour` permission

**Response** `200`: Success message.

---

### GET /api/admin/tours/{tour}/availabilities

List availabilities for a tour.

**Auth**: Bearer + `create-tour` permission

**Response** `200`: Array of `TourAvailabilityResource` objects ordered by date.

---

### POST /api/admin/tours/{tour}/availabilities

Create a single availability slot.

**Auth**: Bearer + `update-tour` permission

**Request Body**:
```json
{
    "date": "2026-03-15",
    "start_time": "09:00",
    "total_spots": 20,
    "price_override": null
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `date` | date | Yes | after or equal to today |
| `start_time` | string | No | format `HH:mm` |
| `total_spots` | int | Yes | min:1 |
| `price_override` | float | No | min:0 |

**Response** `201`: `TourAvailabilityResource`.

---

### POST /api/admin/tours/{tour}/availabilities/bulk

Bulk create availability slots.

**Auth**: Bearer + `update-tour` permission

**Request Body**:
```json
{
    "availabilities": [
        { "date": "2026-03-15", "start_time": "09:00", "total_spots": 20 },
        { "date": "2026-03-16", "start_time": "09:00", "total_spots": 20 },
        { "date": "2026-03-17", "start_time": "09:00", "total_spots": 15 }
    ]
}
```

**Response** `201`: Array of created `TourAvailabilityResource` objects.

---

### PUT /api/admin/tours/{tour}/availabilities/{availability}

Update an availability slot.

**Auth**: Bearer + `update-tour` permission

**Response** `200`: Updated `TourAvailabilityResource`.

---

### DELETE /api/admin/tours/{tour}/availabilities/{availability}

Delete an availability slot.

**Auth**: Bearer + `update-tour` permission

**Response** `200`: Success message.

---

### GET /api/admin/tour-bookings

List all tour bookings.

**Auth**: Bearer + `manage-tour-bookings` permission

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter[status]` | string | Exact status value |
| `filter[user_id]` | int | Filter by user |
| `filter[tour_id]` | int | Filter by tour |
| `filter[byDateRange]` | string | `2026-01-01,2026-12-31` |
| `include` | string | `tour`, `guests`, `statusLogs`, `user` |
| `sort` | string | Default: `-created_at` |

**Response** `200`: Array of `TourBookingResource` objects.

---

### GET /api/admin/tour-bookings/{booking}

Show any tour booking.

**Auth**: Bearer + `manage-tour-bookings` permission

**Response** `200`: `TourBookingResource` with `tour`, `guests`, `statusLogs`, `user` loaded.

---

### PATCH /api/admin/tour-bookings/{booking}/status

Update booking status (admin).

**Auth**: Bearer + `manage-tour-bookings` permission

**Request Body**:
```json
{
    "status": "completed",
    "reason": "Tour completed successfully"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `status` | string | Yes | `pending`, `confirmed`, `cancelled`, `completed`, `no_show` |
| `reason` | string | No | max:1000 |

**Response** `200`: Updated `TourBookingResource`.

---

## Booking Status State Machine

```
         ┌─────────┐
         │ PENDING  │
         └────┬─────┘
         ┌────┴────┐
         ▼         ▼
    ┌─────────┐ ┌──────────┐
    │CONFIRMED│ │CANCELLED │
    └────┬────┘ └──────────┘
    ┌────┼────┐
    ▼    ▼    ▼
┌──────────┐ ┌─────────┐ ┌─────────┐
│CANCELLED │ │COMPLETED│ │ NO_SHOW │
└──────────┘ └─────────┘ └─────────┘
```

| Status | Value | Color | Description |
|--------|-------|-------|-------------|
| Pending | `pending` | yellow | Booking created, awaiting confirmation |
| Confirmed | `confirmed` | green | Booking confirmed, voucher available |
| Cancelled | `cancelled` | gray | Booking cancelled |
| Completed | `completed` | blue | Tour completed |
| No Show | `no_show` | red | Guest did not show up |

### Allowed Transitions

| From | Allowed To |
|------|-----------|
| `pending` | `confirmed`, `cancelled` |
| `confirmed` | `cancelled`, `completed`, `no_show` |
| `cancelled` | _(terminal)_ |
| `completed` | _(terminal)_ |
| `no_show` | _(terminal)_ |
