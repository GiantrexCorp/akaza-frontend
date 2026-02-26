# Transfers API

## Public Endpoints

---

### GET /api/transfers/vehicles

List all active transfer vehicles.

**Auth**: None

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "name": { "en": "Standard Sedan", "de": "Standard-Limousine", "fr": "Berline standard" },
            "translated_name": "Standard Sedan",
            "description": { "en": "...", "de": "...", "fr": "..." },
            "translated_description": "...",
            "type": "sedan",
            "type_label": "Sedan",
            "max_passengers": 3,
            "max_luggage": 3,
            "status": "active",
            "sort_order": 1,
            "image": "https://...",
            "created_at": "2026-02-21T10:00:00.000Z"
        }
    ]
}
```

### Vehicle Types

| Value | Label |
|-------|-------|
| `sedan` | Sedan |
| `suv` | SUV |
| `van` | Van |
| `minibus` | Minibus |
| `limousine` | Limousine |

---

### GET /api/transfers/routes

List all active transfer routes.

**Auth**: None

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "transfer_type": "airport",
            "transfer_type_label": "Airport Transfer",
            "pickup_name": { "en": "Cairo Airport", "de": "Flughafen Kairo", "fr": "Aéroport du Caire" },
            "translated_pickup_name": "Cairo Airport",
            "dropoff_name": { "en": "Downtown Cairo", "de": "Innenstadt Kairo", "fr": "Centre-ville du Caire" },
            "translated_dropoff_name": "Downtown Cairo",
            "pickup_code": "CAI",
            "dropoff_code": "CAI-DT",
            "status": "active",
            "created_at": "2026-02-21T10:00:00.000Z"
        }
    ]
}
```

### Transfer Types

| Value | Label |
|-------|-------|
| `airport` | Airport Transfer |
| `city` | City Transfer |
| `chauffeur` | Chauffeur Service |

---

### GET /api/transfers/routes/{route}/prices

List prices for a specific route (per vehicle).

**Auth**: None

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        {
            "id": 1,
            "transfer_route_id": 1,
            "transfer_vehicle_id": 1,
            "vehicle": {
                "id": 1,
                "translated_name": "Standard Sedan",
                "type": "sedan",
                "max_passengers": 3,
                "..."  : "..."
            },
            "price": "35.00",
            "currency": "EUR"
        }
    ]
}
```

---

## User Endpoints (Bearer required)

---

### POST /api/transfers/bookings

Create a transfer booking.

**Auth**: Bearer token required

**Request Body**:
```json
{
    "transfer_route_id": 1,
    "transfer_vehicle_id": 1,
    "transfer_type": "airport",
    "pickup_location": "Cairo Airport Terminal 3",
    "dropoff_location": "Marriott Hotel, Downtown Cairo",
    "pickup_date": "2026-04-01",
    "pickup_time": "14:30",
    "passengers": 2,
    "luggage_count": 3,
    "currency": "EUR",
    "contact_name": "John Doe",
    "contact_email": "john@example.com",
    "contact_phone": "+1234567890",
    "flight_number": "MS801",
    "special_requests": "Child seat needed"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `transfer_route_id` | int | No | must exist in `transfer_routes` |
| `transfer_vehicle_id` | int | Yes | must exist in `transfer_vehicles` |
| `transfer_type` | string | Yes | `airport`, `city`, `chauffeur` |
| `pickup_location` | string | Yes | max:255 |
| `dropoff_location` | string | Yes | max:255 |
| `pickup_date` | date | Yes | after or equal to today |
| `pickup_time` | string | Yes | format `HH:mm` |
| `passengers` | int | Yes | min:1 |
| `luggage_count` | int | No | min:0 |
| `currency` | string | No | 3 chars (default: EUR) |
| `contact_name` | string | Yes | max:255 |
| `contact_email` | string | Yes | valid email, max:255 |
| `contact_phone` | string | No | max:20 |
| `flight_number` | string | No | max:20 |
| `special_requests` | string | No | max:2000 |

**Response** `201`:
```json
{
    "status": 201,
    "success": true,
    "payload": {
        "id": 1,
        "booking_reference": "AKZ-X-67B8A1C2D3E4F",
        "status": "confirmed",
        "status_label": "Confirmed",
        "status_color": "green",
        "transfer_type": "airport",
        "transfer_type_label": "Airport Transfer",
        "route": { "..." : "..." },
        "vehicle": { "..." : "..." },
        "pickup_location": "Cairo Airport Terminal 3",
        "dropoff_location": "Marriott Hotel, Downtown Cairo",
        "pickup_date": "2026-04-01",
        "pickup_time": "14:30",
        "passengers": 2,
        "luggage_count": 3,
        "price": "35.00",
        "formatted_price": "35.00 EUR",
        "currency": "EUR",
        "contact_name": "John Doe",
        "contact_email": "john@example.com",
        "contact_phone": "+1234567890",
        "flight_number": "MS801",
        "special_requests": "Child seat needed",
        "is_cancellable": true,
        "confirmed_at": "2026-02-21T10:30:00.000Z",
        "cancelled_at": null,
        "cancellation_reason": null,
        "refund_amount": null,
        "voucher_path": "vouchers/transfer/AKZ-X-67B8A1C2D3E4F.pdf",
        "status_logs": [ ... ],
        "created_at": "2026-02-21T10:30:00.000Z",
        "updated_at": "2026-02-21T10:30:00.000Z"
    }
}
```

### Booking Flow
1. Validates vehicle capacity (`passengers <= max_passengers`)
2. Looks up price from `transfer_route_prices` table (route + vehicle combo)
3. Creates booking record
4. **Auto-confirms** the booking immediately
5. Generates PDF voucher
6. Creates CRM customer record
7. Sends confirmation email notification

**Errors**:
- `422` — Vehicle capacity exceeded, route/vehicle price not found, validation failed

---

### GET /api/transfers/bookings

List the authenticated user's transfer bookings.

**Auth**: Bearer token required

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `filter[status]` | string | Filter by booking status |
| `include` | string | `route`, `vehicle`, `statusLogs` |
| `sort` | string | Default: `-created_at` |

**Response** `200`: Array of `TransferBookingResource` objects.

---

### GET /api/transfers/bookings/{booking}

Show a specific transfer booking.

**Auth**: Bearer token required (own booking or `manage-transfer-bookings` permission)

**Response** `200`: Single `TransferBookingResource`.

---

### POST /api/transfers/bookings/{booking}/cancel

Cancel a transfer booking.

**Auth**: Bearer token required (must be booking owner + booking must be cancellable)

**Request Body**:
```json
{
    "reason": "Flight cancelled"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `reason` | string | No | max:1000 |

**Response** `200`: Updated `TransferBookingResource` with `status: "cancelled"`.

---

### GET /api/transfers/bookings/{booking}/voucher

Download the booking voucher as PDF.

**Auth**: Bearer token required (own booking or `manage-transfer-bookings` permission)

**Response** `200`:
- `Content-Type: application/pdf`
- A4 portrait PDF with transfer details, pickup/dropoff info, vehicle, contact, branding

---

## Admin Endpoints (Bearer + Permission)

---

### GET /api/admin/transfers/vehicles

List all vehicles (including inactive).

**Auth**: Bearer + `create-transfer` permission

---

### POST /api/admin/transfers/vehicles

Create a vehicle.

**Auth**: Bearer + `create-transfer` permission

**Request Body**:
```json
{
    "name": { "en": "Standard Sedan", "de": "Standard-Limousine", "fr": "Berline standard" },
    "description": { "en": "...", "de": "...", "fr": "..." },
    "type": "sedan",
    "max_passengers": 3,
    "max_luggage": 3,
    "sort_order": 1
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | object | Yes | `en`, `de`, `fr` keys required, each max:255 |
| `description` | object | No | `en`, `de`, `fr` keys |
| `type` | string | Yes | `sedan`, `suv`, `van`, `minibus`, `limousine` |
| `max_passengers` | int | Yes | min:1 |
| `max_luggage` | int | No | min:0 |
| `sort_order` | int | No | min:0 |

**Response** `201`: `TransferVehicleResource`.

---

### GET /api/admin/transfers/vehicles/{vehicle}

**Auth**: Bearer + `create-transfer` permission

---

### PUT /api/admin/transfers/vehicles/{vehicle}

**Auth**: Bearer + `update-transfer` permission

---

### DELETE /api/admin/transfers/vehicles/{vehicle}

Soft-delete a vehicle.

**Auth**: Bearer + `delete-transfer` permission

---

### GET /api/admin/transfers/routes

List all routes.

**Auth**: Bearer + `create-transfer` permission

---

### POST /api/admin/transfers/routes

Create a route.

**Auth**: Bearer + `create-transfer` permission

**Request Body**:
```json
{
    "transfer_type": "airport",
    "pickup_name": { "en": "Cairo Airport", "de": "Flughafen Kairo", "fr": "Aéroport du Caire" },
    "dropoff_name": { "en": "Downtown Cairo", "de": "Innenstadt Kairo", "fr": "Centre-ville du Caire" },
    "pickup_code": "CAI",
    "dropoff_code": "CAI-DT"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `transfer_type` | string | Yes | `airport`, `city`, `chauffeur` |
| `pickup_name` | object | Yes | `en`, `de`, `fr` keys required, each max:255 |
| `dropoff_name` | object | Yes | `en`, `de`, `fr` keys required, each max:255 |
| `pickup_code` | string | No | max:50 |
| `dropoff_code` | string | No | max:50 |

**Response** `201`: `TransferRouteResource`.

---

### GET /api/admin/transfers/routes/{route}

**Auth**: Bearer + `create-transfer` permission

**Response** `200`: `TransferRouteResource` with `prices.vehicle` loaded.

---

### PUT /api/admin/transfers/routes/{route}

**Auth**: Bearer + `update-transfer` permission

---

### DELETE /api/admin/transfers/routes/{route}

Soft-delete a route.

**Auth**: Bearer + `delete-transfer` permission

---

### POST /api/admin/transfers/routes/{route}/prices

Set or update the price for a route + vehicle combination.

**Auth**: Bearer + `update-transfer` permission

**Request Body**:
```json
{
    "transfer_vehicle_id": 1,
    "price": 35.00,
    "currency": "EUR"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `transfer_vehicle_id` | int | Yes | must exist in `transfer_vehicles` |
| `price` | float | Yes | min:0 |
| `currency` | string | No | 3 chars (default: EUR) |

**Response** `200`: `TransferRoutePriceResource` with `vehicle` loaded.

---

### GET /api/admin/transfer-bookings

List all transfer bookings.

**Auth**: Bearer + `manage-transfer-bookings` permission

---

### GET /api/admin/transfer-bookings/{booking}

Show any transfer booking.

**Auth**: Bearer + `manage-transfer-bookings` permission

---

### PATCH /api/admin/transfer-bookings/{booking}/status

Update booking status (admin).

**Auth**: Bearer + `manage-transfer-bookings` permission

**Request Body**:
```json
{
    "status": "completed",
    "reason": "Transfer completed"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `status` | string | Yes | `pending`, `confirmed`, `cancelled`, `completed`, `no_show` |
| `reason` | string | No | max:1000 |

---

## Booking Status State Machine

Same as Tour bookings:

| From | Allowed To |
|------|-----------|
| `pending` | `confirmed`, `cancelled` |
| `confirmed` | `cancelled`, `completed`, `no_show` |
| `cancelled` | _(terminal)_ |
| `completed` | _(terminal)_ |
| `no_show` | _(terminal)_ |
