# Finance API

All finance endpoints are admin-only and require Bearer token + permission. The Finance domain has no database tables — it queries across existing booking tables (hotel_bookings, tour_bookings, transfer_bookings).

---

## GET /api/admin/finance/dashboard

Get the financial dashboard overview.

**Auth**: Bearer + `view-financial-dashboard` permission

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "total_revenue": 12500.00,
        "breakdown": {
            "hotel": 8000.00,
            "tour": 3000.00,
            "transfer": 1500.00
        },
        "monthly_trend": [
            { "period": "2026-01", "revenue": 4200.00, "bookings": 15 },
            { "period": "2026-02", "revenue": 8300.00, "bookings": 28 }
        ],
        "recent_bookings": [
            {
                "booking_reference": "AKZ-H-...",
                "status": "confirmed",
                "total_price": "220.00",
                "currency": "EUR",
                "created_at": "2026-02-21T10:30:00.000000Z",
                "type": "hotel"
            }
        ]
    }
}
```

**Key Fields**:
- `total_revenue`: Sum of all confirmed bookings across hotel, tour, and transfer
- `breakdown`: Revenue split by booking type
- `monthly_trend`: Last 6 months of revenue data
- `recent_bookings`: Last 10 bookings across all types

---

## GET /api/admin/finance/revenue

Get revenue data grouped by period.

**Auth**: Bearer + `view-financial-reports` permission

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `period` | string | `daily`, `monthly` (default), `yearly` |
| `from` | date | Start date filter (e.g. `2026-01-01`) |
| `to` | date | End date filter (e.g. `2026-12-31`) |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": [
        { "period": "2026-01", "revenue": 4200.00, "bookings": 15 },
        { "period": "2026-02", "revenue": 8300.00, "bookings": 28 }
    ]
}
```

---

## GET /api/admin/finance/reports

Generate a comprehensive financial report (JSON).

**Auth**: Bearer + `view-financial-reports` permission

**Query Parameters**: Same as `/revenue` (`period`, `from`, `to`).

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "period": "monthly",
        "date_range": {
            "from": "2026-01-01",
            "to": "2026-02-28"
        },
        "total_revenue": 12500.00,
        "breakdown": {
            "hotel": 8000.00,
            "tour": 3000.00,
            "transfer": 1500.00
        },
        "revenue_by_period": [
            { "period": "2026-01", "revenue": 4200.00, "bookings": 15 },
            { "period": "2026-02", "revenue": 8300.00, "bookings": 28 }
        ],
        "booking_status_summary": {
            "hotel": { "confirmed": 10, "cancelled": 2, "pending": 1 },
            "tour": { "confirmed": 8, "completed": 5 },
            "transfer": { "confirmed": 12, "cancelled": 1 }
        },
        "generated_at": "2026-02-22T14:30:00+00:00"
    }
}
```

---

## GET /api/admin/finance/reports/export

Export a financial report as PDF.

**Auth**: Bearer + `export-reports` permission

**Query Parameters**: Same as `/reports` (`period`, `from`, `to`).

**Response** `200`:
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="finance-report-2026-02-22.pdf"`
- A4 portrait PDF with:
  - Company header (AKAZA Travel)
  - Revenue summary (total + per-type breakdown)
  - Revenue by period table
  - Booking status summary per type
  - Generation timestamp

---

## GET /api/admin/finance/booking-status-summary

Get booking counts grouped by status for each booking type.

**Auth**: Bearer + `view-financial-dashboard` permission

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "hotel": {
            "pending": 1,
            "confirmed": 10,
            "cancelled": 2,
            "failed": 0,
            "pending_reconciliation": 1
        },
        "tour": {
            "pending": 0,
            "confirmed": 8,
            "cancelled": 1,
            "completed": 5,
            "no_show": 1
        },
        "transfer": {
            "confirmed": 12,
            "cancelled": 1,
            "completed": 8
        }
    }
}
```

---

## Permissions

| Endpoint | Permission |
|----------|-----------|
| Dashboard | `view-financial-dashboard` |
| Revenue | `view-financial-reports` |
| Reports (JSON) | `view-financial-reports` |
| Reports (PDF export) | `export-reports` |
| Booking status summary | `view-financial-dashboard` |

The `admin` role has all three permissions. The `finance-admin` role has `view-financial-dashboard`, `view-financial-reports`, and `export-reports`.
