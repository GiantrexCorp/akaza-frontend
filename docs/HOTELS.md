# Hotels API

---

## POST /api/hotels/search

Search for available hotels.

**Auth**: None

**Request Body**:
```json
{
    "destination": "PMI",
    "check_in": "2026-04-01",
    "check_out": "2026-04-05",
    "occupancies": [
        { "adults": 2, "children": 1, "children_ages": [5] }
    ],
    "hotel_code": null,
    "filters": null
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `destination` | string | Yes | max:255, destination code |
| `check_in` | date | Yes | must be after today |
| `check_out` | date | Yes | must be after `check_in` |
| `occupancies` | array | Yes | min:1 room |
| `occupancies.*.adults` | int | Yes | 1–6 |
| `occupancies.*.children` | int | No | 0–4 |
| `occupancies.*.children_ages` | array | No | required if children > 0 |
| `occupancies.*.children_ages.*` | int | — | 0–17 |
| `hotel_code` | string | No | specific hotel code |
| `filters` | object | No | additional search filters |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "hotel_code": "1234",
            "hotel_name": "Grand Hotel",
            "destination_code": "PMI",
            "destination_name": "Palma de Mallorca",
            "category_code": "4EST",
            "category_name": "4 STARS",
            "latitude": 39.5696,
            "longitude": 2.6502,
            "currency": "EUR",
            "check_in": "2026-04-01",
            "check_out": "2026-04-05",
            "min_rate": 200.00,
            "max_rate": 450.00,
            "markup_percentage": 10.0,
            "min_selling_price": 220.00,
            "max_selling_price": 495.00,
            "rooms": [
                {
                    "room_code": "DBL.ST",
                    "room_name": "Double Standard",
                    "board_code": "BB",
                    "board_name": "Bed and Breakfast",
                    "rate_key": "20260401|20260405|W|...",
                    "rate_type": "BOOKABLE",
                    "rate_class": "NOR",
                    "rate_comments_id": "1|2|3",
                    "packaging": false,
                    "net_price": 200.00,
                    "markup_amount": 20.00,
                    "selling_price": 220.00,
                    "currency": "EUR",
                    "adults": 2,
                    "children": 1,
                    "rooms": 1,
                    "allotment": 5,
                    "cancellation_policies": [
                        { "amount": "50.00", "from": "2026-03-28T23:59:00+02:00" }
                    ],
                    "promotions": []
                }
            ]
        }
    ]
}
```

### Key Fields

- **`rate_type`**: `"BOOKABLE"` (can book directly) or `"RECHECK"` (must call checkRate first)
- **`rate_class`**: `"NOR"` (normal) or `"NRF"` (non-refundable)
- **`rate_comments_id`**: ID for fetching detailed rate comments from Hotelbeds
- **`packaging`**: `true` if rate is part of a package — **cannot be booked standalone** (opaque rate guard)
- **`markup_percentage`**: The markup applied (from Settings)
- **`selling_price`**: `net_price + (net_price * markup_percentage / 100)`

### Room Consolidation

When multiple occupancies have identical configuration (same adults, children, ages), the adapter consolidates them into a single request room with an incremented `rooms` count. The search results reflect this consolidation.

---

## POST /api/hotels/checkrate

Check/verify rates before booking. Required for `RECHECK` rate types.

**Auth**: None

**Request Body**:
```json
{
    "rate_keys": [
        "20260401|20260405|W|1|...",
        "20260401|20260405|W|2|..."
    ]
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `rate_keys` | array | Yes | min:1, max:10 |
| `rate_keys.*` | string | Yes | valid rate key from search |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "rate_key": "20260401|20260405|W|1|...",
            "rate_type": "BOOKABLE",
            "net_price": 205.00,
            "markup_amount": 20.50,
            "selling_price": 225.50,
            "currency": "EUR",
            "cancellation_policies": [ ... ]
        }
    ]
}
```

**Notes**:
- Batch up to 10 rate keys per request
- Prices may change from the original search results
- Markup is applied to the updated prices

---

## POST /api/hotels/bookings

Create a hotel booking.

**Auth**: Bearer token required

**Request Body**:
```json
{
    "rate_key": "20260401|20260405|W|1|...",
    "rate_type": "BOOKABLE",
    "hotel_code": "1234",
    "hotel_name": "Grand Hotel",
    "destination_code": "PMI",
    "destination_name": "Palma de Mallorca",
    "check_in": "2026-04-01",
    "check_out": "2026-04-05",
    "room_code": "DBL.ST",
    "room_name": "Double Standard",
    "board_code": "BB",
    "board_name": "Bed and Breakfast",
    "net_price": 200.00,
    "currency": "EUR",
    "rate_comments_id": "1|2|3",
    "packaging": false,
    "cancellation_policies": [
        { "amount": "50.00", "from": "2026-03-28T23:59:00+02:00" }
    ],
    "holder_name": "John",
    "holder_surname": "Doe",
    "holder_email": "john@example.com",
    "holder_phone": "+1234567890",
    "rooms": [
        {
            "guests": [
                { "type": "AD", "name": "John", "surname": "Doe" },
                { "type": "CH", "name": "Jane", "surname": "Doe", "age": 5 }
            ]
        }
    ]
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `rate_key` | string | Yes | — |
| `rate_type` | string | Yes | `BOOKABLE` or `RECHECK` |
| `hotel_code` | string | Yes | — |
| `hotel_name` | string | Yes | max:500 |
| `destination_code` | string | Yes | — |
| `destination_name` | string | Yes | max:255 |
| `check_in` | date | Yes | after today |
| `check_out` | date | Yes | after `check_in` |
| `room_code` | string | Yes | — |
| `room_name` | string | Yes | max:500 |
| `board_code` | string | Yes | — |
| `board_name` | string | Yes | max:255 |
| `net_price` | numeric | Yes | min:0 |
| `currency` | string | No | 3 chars (default: from system) |
| `rate_comments_id` | string | No | — |
| `packaging` | bool | No | — |
| `cancellation_policies` | array | No | — |
| `holder_name` | string | Yes | max:255 |
| `holder_surname` | string | Yes | max:255 |
| `holder_email` | string | Yes | valid email, max:255 |
| `holder_phone` | string | Yes | max:50 |
| `rooms` | array | Yes | min:1 |
| `rooms.*.guests` | array | Yes | min:1 |
| `rooms.*.guests.*.type` | string | Yes | `AD` (adult) or `CH` (child) |
| `rooms.*.guests.*.name` | string | Yes | max:255 |
| `rooms.*.guests.*.surname` | string | Yes | max:255 |
| `rooms.*.guests.*.age` | int | CH only | 0–17 (required if type is `CH`) |

**Response** `201`:
```json
{
    "status": 201,
    "success": true,
    "payload": {
        "id": 1,
        "booking_reference": "AKZ-H-67B8A1C2D3E4F",
        "bedbank_booking_id": "1-123456",
        "bedbank_provider": "hotelbeds",
        "status": "confirmed",
        "status_label": "Confirmed",
        "status_color": "green",
        "hotel_code": "1234",
        "hotel_name": "Grand Hotel",
        "hotel_address": "Calle Example 1, Palma",
        "hotel_phone": "+34 971 000 000",
        "hotel_category_code": "4EST",
        "hotel_category_name": "4 STARS",
        "destination_code": "PMI",
        "destination_name": "Palma de Mallorca",
        "check_in": "2026-04-01",
        "check_out": "2026-04-05",
        "nights_count": 4,
        "total_rooms": 1,
        "net_price": "200.00",
        "markup_percentage": "10.00",
        "markup_amount": "20.00",
        "selling_price": "220.00",
        "formatted_selling_price": "220.00 EUR",
        "currency": "EUR",
        "holder_name": "John",
        "holder_surname": "Doe",
        "holder_email": "john@example.com",
        "holder_phone": "+1234567890",
        "cancellation_policy": [ ... ],
        "cancellation_deadline": "2026-03-28T23:59:00.000000Z",
        "is_cancellable": true,
        "cancelled_at": null,
        "cancellation_reason": null,
        "refund_amount": null,
        "confirmed_at": "2026-02-21T10:30:00.000000Z",
        "voucher_path": "vouchers/hotel/AKZ-H-67B8A1C2D3E4F.pdf",
        "rooms": [
            {
                "id": 1,
                "room_code": "DBL.ST",
                "room_name": "Double Standard",
                "board_code": "BB",
                "board_name": "Bed and Breakfast",
                "rate_type": "BOOKABLE",
                "net_price": "200.00",
                "selling_price": "220.00",
                "currency": "EUR",
                "adults": 2,
                "children": 1,
                "children_ages": [5],
                "guests": [
                    { "id": 1, "type": "AD", "name": "John", "surname": "Doe", "age": null },
                    { "id": 2, "type": "CH", "name": "Jane", "surname": "Doe", "age": 5 }
                ]
            }
        ],
        "status_logs_count": 2,
        "created_at": "2026-02-21T10:30:00.000000Z",
        "updated_at": "2026-02-21T10:30:00.000000Z"
    }
}
```

### Booking Flows

#### BOOKABLE Flow
1. Client sends `rate_type: "BOOKABLE"`
2. Server skips checkRate — books directly with Hotelbeds
3. On success: status → `confirmed`, voucher PDF generated

#### RECHECK Flow
1. Client sends `rate_type: "RECHECK"`
2. Server calls checkRate first to verify/update the rate
3. If rate is still valid: proceeds to book with Hotelbeds
4. On success: status → `confirmed`, voucher PDF generated

#### Opaque Rate Guard
If `packaging: true`, the booking is rejected with `422`:
```json
{
    "status": 422,
    "success": false,
    "payload": null,
    "errors": []
}
```
Message: "Opaque/packaged rates cannot be booked standalone."

#### Payment-Booking Discrepancy
If the Hotelbeds booking call fails after the internal booking record is created:
- Status → `pending_reconciliation`
- Admin receives high-priority alert
- Admin must manually retry or refund via the reconciliation endpoint

### Client Reference
A unique `booking_reference` (format: `AKZ-H-{UNIQID}`) is generated and sent to Hotelbeds as the `clientReference`. This links the internal booking to the Hotelbeds booking.

**Errors**:
- `422` — Validation failed, opaque rate guard, rate expired, no rooms available

---

## GET /api/hotels/bookings

List the authenticated user's hotel bookings.

**Auth**: Bearer token required

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number |
| `per_page` | int | Items per page |
| `filter[status]` | string | Filter by booking status |
| `include` | string | `rooms`, `rooms.guests`, `statusLogs` |
| `sort` | string | Default: `-created_at` |

**Response** `200`: Paginated array of `HotelBookingResource` objects (same shape as create response).

---

## GET /api/hotels/bookings/{booking}

Show a specific booking. Users can only view their own bookings.

**Auth**: Bearer token required (own booking or `show-hotel-booking` permission)

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `include` | string | `rooms`, `rooms.guests`, `statusLogs` |

**Response** `200`: Single `HotelBookingResource` object with `rooms.guests` and `statusLogs` loaded.

---

## POST /api/hotels/bookings/{booking}/cancel

Cancel a confirmed booking.

**Auth**: Bearer token required (must be booking owner + booking must be cancellable)

**Request Body**:
```json
{
    "reason": "Change of plans"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `reason` | string | No | max:500 |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "id": 1,
        "status": "cancelled",
        "cancelled_at": "2026-02-21T12:00:00.000000Z",
        "cancellation_reason": "Change of plans",
        "refund_amount": "170.00",
        "...": "..."
    }
}
```

### Cancellation Flow
1. Validates booking `is_cancellable` (status allows transition + deadline not passed)
2. Status → `pending_cancellation`
3. Calls Hotelbeds cancellation API
4. **Success**: Status → `cancelled`, `refund_amount = selling_price - cancellation_cost`
5. **Failure**: Status → `cancellation_failed`

**Errors**:
- `422` — Booking cannot be cancelled (wrong status or past deadline)

---

## GET /api/hotels/bookings/{booking}/cancellation-cost

Preview the cancellation cost before cancelling.

**Auth**: Bearer token required (must be booking owner)

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "cancellation_cost": "50.00",
        "currency": "EUR",
        "cancellation_deadline": "2026-03-28T23:59:00+02:00"
    }
}
```

Calls the Hotelbeds simulation endpoint (`cancellationFlag=SIMULATION`) without actually cancelling.

---

## GET /api/hotels/bookings/{booking}/voucher

Download the booking voucher as a PDF.

**Auth**: Bearer token required (own booking or `show-hotel-booking` permission)

**Response** `200`:
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="voucher-AKZ-H-67B8A1C2D3E4F.pdf"`
- A4 portrait PDF with booking details, hotel info, guest list, and Hotelbeds certification notice

**Errors**:
- `404` — Voucher not available (booking not confirmed or voucher not generated)

---

## GET /api/admin/hotel-bookings

List all hotel bookings (admin).

**Auth**: Bearer + `manage-hotel-bookings` permission (policy: `list-hotel-bookings`)

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number |
| `per_page` | int | Items per page |
| `filter[id]` | int | Exact ID |
| `filter[status]` | string | Exact status value |
| `filter[bedbank_provider]` | string | e.g. `hotelbeds` |
| `filter[user_id]` | int | Filter by user |
| `filter[hotel_code]` | string | Exact hotel code |
| `filter[destination_code]` | string | Exact destination |
| `filter[booking_reference]` | string | Partial match |
| `filter[hotel_name]` | string | Partial match |
| `filter[holder_name]` | string | Partial match |
| `filter[holder_surname]` | string | Partial match |
| `filter[holder_email]` | string | Partial match |
| `filter[byDateRange]` | string | `2026-01-01,2026-12-31` (check_in range) |
| `filter[pendingReconciliation]` | bool | Only pending reconciliation |
| `include` | string | `rooms`, `rooms.guests`, `statusLogs`, `user` |
| `sort` | string | Default: `-created_at` |

**Response** `200`: Paginated array of `HotelBookingResource` objects.

---

## GET /api/admin/hotel-bookings/{booking}

Show any booking (admin).

**Auth**: Bearer + admin permission

**Response** `200`: Single `HotelBookingResource` with `rooms.guests`, `statusLogs.actor`, and `user` loaded.

The `statusLogs` include `changed_by` info:
```json
{
    "status_logs": [
        {
            "id": 1,
            "from_status": null,
            "to_status": "pending",
            "reason": null,
            "metadata": null,
            "changed_by": { "id": 1, "name": "System" },
            "created_at": "2026-02-21T10:30:00.000000Z"
        }
    ]
}
```

---

## POST /api/admin/hotel-bookings/{booking}/reconcile

Admin reconciliation for bookings in `pending_reconciliation` status.

**Auth**: Bearer + `hotel-bookings.reconcile` permission

**Request Body**:
```json
{
    "action": "retry",
    "reason": null
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `action` | string | Yes | `retry` or `refund` |
| `reason` | string | If refund | max:500, required when action is `refund` |

### Retry Action
Re-attempts the Hotelbeds booking:
1. Reconstructs booking DTO from stored data
2. Calls Hotelbeds book API
3. **Success**: Status → `confirmed`, voucher PDF generated
4. **Failure**: Stays `pending_reconciliation`, error logged

### Refund Action
Marks the booking as failed and initiates refund:
1. Status → `failed`
2. `refund_amount` set to `selling_price`
3. Reason logged in status logs

**Response** `200`: Updated `HotelBookingResource`.

---

## Booking Status State Machine

```
                    ┌──────────┐
                    │ PENDING  │
                    └────┬─────┘
                         │
              ┌──────────┼──────────────┐
              ▼          ▼              ▼
         ┌─────────┐ ┌────────┐ ┌──────────────────────┐
         │CONFIRMED│ │ FAILED │ │PENDING_RECONCILIATION│
         └────┬────┘ └────────┘ └──────────┬───────────┘
              │                       ┌────┴────┐
              ▼                       ▼         ▼
    ┌───────────────────┐       ┌─────────┐ ┌────────┐
    │PENDING_CANCELLATION│      │CONFIRMED│ │ FAILED │
    └────────┬──────────┘       └─────────┘ └────────┘
        ┌────┴────┐
        ▼         ▼
  ┌──────────┐ ┌────────────────────┐
  │CANCELLED │ │CANCELLATION_FAILED │
  └──────────┘ └────────┬───────────┘
                    ┌────┴────┐
                    ▼         ▼
          ┌───────────────────┐ ┌──────────┐
          │PENDING_CANCELLATION│ │CANCELLED │
          └───────────────────┘ └──────────┘
```

### Status Values

| Status | Value | Color | Description |
|--------|-------|-------|-------------|
| Pending | `pending` | yellow | Booking created, awaiting bedbank confirmation |
| Confirmed | `confirmed` | green | Bedbank confirmed, voucher available |
| Failed | `failed` | red | Bedbank rejected the booking |
| Cancelled | `cancelled` | gray | Successfully cancelled |
| Pending Cancellation | `pending_cancellation` | orange | Cancellation in progress |
| Cancellation Failed | `cancellation_failed` | red | Bedbank cancellation failed |
| Pending Reconciliation | `pending_reconciliation` | purple | Payment captured but booking failed — admin action required |

### Allowed Transitions

| From | Allowed To |
|------|-----------|
| `pending` | `confirmed`, `failed`, `pending_reconciliation` |
| `confirmed` | `pending_cancellation` |
| `failed` | _(terminal)_ |
| `cancelled` | _(terminal)_ |
| `pending_cancellation` | `cancelled`, `cancellation_failed` |
| `cancellation_failed` | `pending_cancellation`, `cancelled` |
| `pending_reconciliation` | `confirmed`, `failed` |
