# Settings API

---

## GET /api/settings/public

Get public-facing settings as key-value pairs.

**Auth**: None

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "general.supported_languages": ["en", "de", "fr"],
        "general.default_language": "en",
        "general.default_currency": "USD",
        "company.name": "Akaza Travel",
        "company.email": "info@akazatravel.com",
        "company.phone": "+20 123 456 7890",
        "company.address": "Cairo, Egypt"
    }
}
```

Only settings with `is_public: true` are returned.

---

## GET /api/admin/settings

Get all settings grouped by group.

**Auth**: Bearer + `manage-settings` permission

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "general": [
            {
                "id": 1,
                "group": "general",
                "key": "general.supported_languages",
                "value": ["en", "de", "fr"],
                "type": "json",
                "is_public": true,
                "description": "Supported languages",
                "created_at": "2026-02-20T08:00:00.000000Z",
                "updated_at": "2026-02-20T08:00:00.000000Z"
            }
        ],
        "hotel": [ ... ],
        "payment": [ ... ],
        "company": [ ... ],
        "email": [ ... ]
    }
}
```

---

## GET /api/admin/settings/{group}

Get settings for a specific group as key-value pairs.

**Auth**: Bearer + `manage-settings` permission

**URL Parameter**: `{group}` — one of: `general`, `hotel`, `payment`, `company`, `email`

**Example**: `GET /api/admin/settings/hotel`

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "hotel.markup_percentage": 10
    }
}
```

**Errors**:
- `404` — Invalid group name

---

## PUT /api/admin/settings

Bulk update settings.

**Auth**: Bearer + `manage-settings` permission

**Request Body**:
```json
{
    "settings": {
        "hotel.markup_percentage": 15,
        "company.name": "Akaza Travel Egypt",
        "general.default_currency": "EUR"
    }
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `settings` | object | Yes | min 1 key-value pair |
| `settings.{key}` | mixed | — | Validated per setting type (see below) |

**Dynamic Validation**: Each setting key is looked up in the database. The value is validated against the setting's `type`:

| Setting Type | Validation Rules |
|-------------|-----------------|
| `string` | `string`, `max:1000` |
| `integer` | `integer` |
| `float` | `numeric` |
| `boolean` | `boolean` |
| `json` | `array` |
| `email` | `email`, `max:255` |
| `url` | `url`, `max:2048` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "message": "Settings updated successfully."
    }
}
```

**Errors**:
- `422` — Validation failed (invalid value type, unknown setting key)

---

## Setting Groups

| Group | Description |
|-------|-------------|
| `general` | Supported languages, default language, default currency |
| `hotel` | Markup percentage for hotel pricing |
| `payment` | Reconciliation timeout, payment config |
| `company` | Company name, email, phone, address |
| `email` | Sender name and email for notifications |

---

## Key Settings Reference

| Key | Group | Type | Public | Default | Description |
|-----|-------|------|--------|---------|-------------|
| `general.supported_languages` | general | json | Yes | `["en","de","fr"]` | Available languages |
| `general.default_language` | general | string | Yes | `"en"` | Default locale |
| `general.default_currency` | general | string | Yes | `"USD"` | Default currency code |
| `hotel.markup_percentage` | hotel | integer | No | `10` | Hotel price markup % |
| `payment.reconciliation_timeout_hours` | payment | integer | No | `24` | Hours before reconciliation alert |
| `company.name` | company | string | Yes | `"Akaza Travel"` | Company display name |
| `company.email` | company | email | Yes | `"info@akazatravel.com"` | Contact email |
| `company.phone` | company | string | Yes | `"+20 123 456 7890"` | Contact phone |
| `company.address` | company | string | Yes | `"Cairo, Egypt"` | Company address |
| `email.sender_name` | email | string | No | `"Akaza Travel"` | Email from name |
| `email.sender_email` | email | email | No | `"noreply@akazatravel.com"` | Email from address |
