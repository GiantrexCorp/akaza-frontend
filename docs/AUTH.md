# Auth API

All auth endpoints use the prefix `/api/auth/` (except profile endpoints).

---

## POST /api/auth/register

Register a new customer account.

**Auth**: None

**Request Body**:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123",
    "password_confirmation": "securepass123",
    "phone": "+1234567890"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | Yes | max:255 |
| `email` | string | Yes | valid email, max:255, unique in `users` |
| `password` | string | Yes | min:8, confirmed |
| `password_confirmation` | string | Yes | must match `password` |
| `phone` | string | No | max:20 |

**Response** `201`:
```json
{
    "status": 201,
    "success": true,
    "payload": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "type": "customer",
            "status": "active",
            "locale": "en",
            "roles": [{ "id": 1, "name": "customer" }],
            "permissions": []
        },
        "access_token": "eyJ0eXAiOiJKV1...",
        "token_type": "Bearer"
    }
}
```

New users are always created as `type: "customer"`, `status: "active"`, and assigned the `customer` role.

---

## POST /api/auth/login

Authenticate and receive a Bearer token.

**Auth**: None

**Rate Limit**: 5 attempts per minute (per email + IP)

**Request Body**:
```json
{
    "email": "john@example.com",
    "password": "securepass123"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `email` | string | Yes | valid email (lowercased automatically) |
| `password` | string | Yes | — |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "+1234567890",
            "type": "customer",
            "status": "active",
            "locale": "en",
            "roles": [{ "id": 1, "name": "customer" }],
            "permissions": []
        },
        "access_token": "eyJ0eXAiOiJKV1...",
        "token_type": "Bearer"
    }
}
```

**Errors**:
- `401` — Invalid credentials
- `403` — Account inactive/suspended
- `429` — Rate limit exceeded (`Too many login attempts. Please try again in :seconds seconds.`)

**Notes**:
- All previous tokens are revoked on login (single-session enforcement)
- `last_active_at` and `locale` are updated on login

---

## POST /api/auth/logout

Revoke the current access token.

**Auth**: Bearer token required

**Request Body**: None

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "message": "You have been logged out successfully."
    }
}
```

---

## POST /api/auth/forgot-password

Send a password reset link to the user's email.

**Auth**: None

**Request Body**:
```json
{
    "email": "john@example.com"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `email` | string | Yes | valid email, must exist in `users` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "message": "Password reset link has been sent to your email."
    }
}
```

**Errors**:
- `422` — Email not found / Unable to send reset link

---

## POST /api/auth/reset-password

Reset password using the token from the reset email.

**Auth**: None

**Request Body**:
```json
{
    "email": "john@example.com",
    "token": "abc123...",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `email` | string | Yes | valid email |
| `token` | string | Yes | — |
| `password` | string | Yes | min:8, confirmed |
| `password_confirmation` | string | Yes | must match `password` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "message": "Your password has been reset successfully."
    }
}
```

**Errors**:
- `422` — Invalid or expired token

**Notes**:
- All existing tokens are revoked after reset
- Fires Laravel's `PasswordReset` event

---

## GET /api/profile

Get the authenticated user's profile.

**Auth**: Bearer token required

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "type": "customer",
        "status": "active",
        "locale": "en",
        "last_active_at": "2026-02-21T10:30:00.000000Z",
        "created_at": "2026-02-20T08:00:00.000000Z",
        "roles": [{ "id": 1, "name": "customer" }],
        "permissions": []
    }
}
```

---

## PUT /api/profile

Update the authenticated user's profile.

**Auth**: Bearer token required

**Request Body**:
```json
{
    "name": "John Smith",
    "phone": "+9876543210",
    "locale": "de"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `name` | string | No | max:255 |
| `phone` | string | No | max:20 |
| `locale` | string | No | in: `en`, `ar`, `de` |

**Response** `200`: Same shape as `GET /api/profile`.

---

## POST /api/profile/change-password

Change the authenticated user's password.

**Auth**: Bearer token required

**Request Body**:
```json
{
    "current_password": "oldpass123",
    "password": "newpass123",
    "password_confirmation": "newpass123"
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `current_password` | string | Yes | — |
| `password` | string | Yes | min:8, confirmed |
| `password_confirmation` | string | Yes | must match `password` |

**Response** `200`:
```json
{
    "status": 200,
    "success": true,
    "payload": {
        "message": "Your password has been changed successfully."
    }
}
```

**Errors**:
- `422` — Current password is incorrect

**Notes**:
- All tokens **except the current one** are revoked after password change

---

## Token Lifecycle

1. **Creation**: Token is created on register or login
2. **Single-session**: On login, all previous tokens are revoked
3. **Expiration**: Tokens expire per Passport configuration
4. **Revocation on password change**: All tokens except current are revoked
5. **Revocation on password reset**: All tokens are revoked
6. **Logout**: Only the current token is revoked
7. **Expired token**: Returns `401 Unauthorized`
