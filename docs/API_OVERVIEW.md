# API Overview

## Base URL

```
{APP_URL}/api
```

All endpoints are prefixed with `/api`.

---

## Authentication

Protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer {token}
```

Tokens are obtained via `/api/auth/login` or `/api/auth/register`.

---

## Response Envelope

All responses follow this envelope format:

```json
{
    "status": 200,
    "success": true,
    "payload": { },
    "errors": []
}
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | `int` | HTTP status code |
| `success` | `bool` | `true` for 2xx responses, `false` otherwise |
| `payload` | `object\|array\|null` | Response data |
| `errors` | `array` | Validation or error details (empty on success) |

---

## Pagination

Paginated endpoints use Spatie QueryBuilder conventions:

```
GET /api/admin/users?page=1&per_page=15
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | `1` | Page number |
| `per_page` | `15` | Items per page (configurable via `config/system.php`) |

Paginated responses include Laravel's standard pagination meta:

```json
{
    "status": 200,
    "success": true,
    "payload": {
        "data": [ ... ],
        "links": { "first": "...", "last": "...", "prev": null, "next": "..." },
        "meta": {
            "current_page": 1,
            "from": 1,
            "last_page": 5,
            "per_page": 15,
            "to": 15,
            "total": 73
        }
    }
}
```

---

## Filtering

Filter results using query parameters:

```
GET /api/admin/users?filter[status]=active&filter[type]=admin
```

- **Exact match**: `?filter[status]=active` — matches exactly
- **Partial match**: `?filter[name]=john` — contains (depends on repository config)
- **Scope filters**: `?filter[createdAtBetween]=2026-01-01,2026-12-31` — calls a local scope

Available filters are defined per-repository. See individual API docs for each endpoint's supported filters.

---

## Includes (Eager Loading)

Load related resources:

```
GET /api/hotels/bookings/1?include=rooms,rooms.guests,statusLogs
```

Only whitelisted includes are allowed (defined per-repository). Invalid includes are silently ignored.

---

## Sorting

Sort results by field:

```
GET /api/admin/users?sort=name          # Ascending
GET /api/admin/users?sort=-created_at   # Descending (prefix with -)
```

Default sort is typically `-created_at` (newest first).

---

## Language

Set the response language via the `Accept-Language` header:

```
Accept-Language: en
Accept-Language: de
Accept-Language: fr
```

Supported languages: `en` (English), `de` (German), `fr` (French). Defaults to `en` if not specified or unsupported.

This affects:
- Validation error messages
- Status labels (e.g. booking status translations)
- System messages in the `payload`

---

## Error Codes

| Status | Meaning | When |
|--------|---------|------|
| `400` | Bad Request | Malformed request body |
| `401` | Unauthorized | Missing or invalid Bearer token |
| `403` | Forbidden | Valid token but insufficient permissions |
| `404` | Not Found | Resource does not exist |
| `422` | Unprocessable Entity | Validation failed or business rule violation |
| `429` | Too Many Requests | Rate limit exceeded (login: 5/min) |
| `500` | Internal Server Error | Unexpected server error |
| `503` | Service Unavailable | External service (e.g. Hotelbeds) is unreachable |

### Validation Error Response (422)

```json
{
    "status": 422,
    "success": false,
    "payload": null,
    "errors": {
        "email": ["The email field is required."],
        "password": ["The password must be at least 8 characters."]
    }
}
```

### Business Rule Error Response (422)

```json
{
    "status": 422,
    "success": false,
    "payload": null,
    "errors": []
}
```

The error message is in the HTTP exception message (accessible via `message` field in Laravel's default exception rendering).

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `POST /api/auth/login` | 5 attempts per minute (per email + IP) |
| All other endpoints | Laravel default (configurable) |

When rate-limited, the response includes `Retry-After` header.

---

## Content Type

- **Request**: `Content-Type: application/json`
- **Response**: `Content-Type: application/json` (except PDF voucher downloads which return `application/pdf`)

---

## Endpoint Index

| Domain | Endpoints | Auth | Doc |
|--------|-----------|------|-----|
| Auth | 8 endpoints | Mixed | [AUTH.md](./AUTH.md) |
| Users (Admin) | 5 endpoints | Bearer + Permission | [USERS.md](./USERS.md) |
| Hotels | 10 endpoints | Mixed | [HOTELS.md](./HOTELS.md) |
| Tours | 20 endpoints | Mixed | [TOURS.md](./TOURS.md) |
| Transfers | 18 endpoints | Mixed | [TRANSFERS.md](./TRANSFERS.md) |
| Settings | 4 endpoints | Mixed | [SETTINGS.md](./SETTINGS.md) |
| Customers (CRM) | 14 endpoints | Bearer + Permission | [CUSTOMERS.md](./CUSTOMERS.md) |
| Audit | 2 endpoints | Bearer + Permission | [AUDIT.md](./AUDIT.md) |
| Finance | 5 endpoints | Bearer + Permission | [FINANCE.md](./FINANCE.md) |
| Notifications | 8 endpoints | Mixed | [NOTIFICATIONS.md](./NOTIFICATIONS.md) |
