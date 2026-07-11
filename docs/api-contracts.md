# API Contracts

All endpoints are served by the FastAPI backend at `http://localhost:8000`.
Responses follow a consistent shape. All endpoints return JSON.

---

## Base URL

```
http://localhost:8000/api
```

## Response Envelope

All responses follow this shape:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

On error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Wallet balance is insufficient for this booking"
  }
}
```

---

## Properties

### `GET /api/properties`

List all available properties.

**Response:**

```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": 1,
        "name": "Lekki Beach Apartment",
        "location": "Lagos",
        "price": 8000,
        "wifi_speed": 50,
        "beach_distance": 100,
        "rating": 4.8,
        "available": true,
        "image_url": "/properties/lekki-beach.jpg",
        "amenities": ["wifi", "pool", "parking"]
      }
    ],
    "total": 12
  }
}
```

---

### `GET /api/properties/{id}`

Get a single property by ID.

**Path Params:**

| Param | Type | Required |
|-------|------|----------|
| `id`  | int  | Yes      |

**Response:**

```json
{
  "success": true,
  "data": {
    "property": {
      "id": 1,
      "name": "Lekki Beach Apartment",
      "location": "Lagos",
      "price": 8000,
      "wifi_speed": 50,
      "beach_distance": 100,
      "rating": 4.8,
      "available": true,
      "image_url": "/properties/lekki-beach.jpg",
      "amenities": ["wifi", "pool", "parking"],
      "description": "A modern beachfront apartment with ocean views."
    }
  }
}
```

**Errors:**

| Code | Status | When |
|------|--------|------|
| `PROPERTY_NOT_FOUND` | 404 | Property ID does not exist |

---

## Recommendations

### `POST /api/recommend`

Submit user preferences and receive ranked property recommendations.

**Request Body:**

```json
{
  "budget": 10000,
  "location": "Lagos",
  "min_wifi_speed": 30,
  "max_beach_distance": 500,
  "duration_days": 7
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `budget` | float | Yes | Maximum price per night (USDC) |
| `location` | string | Yes | Preferred city/area |
| `min_wifi_speed` | float | Yes | Minimum WiFi speed in Mbps |
| `max_beach_distance` | int | Yes | Maximum distance to beach in meters |
| `duration_days` | int | Yes | Length of stay in days |

**Response:**

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "rank": 1,
        "property": { ... },
        "score": 95.2,
        "score_breakdown": {
          "budget_match": 40,
          "location_match": 15,
          "wifi_match": 15,
          "beach_distance_match": 10,
          "rating_score": 19.2,
          "availability_bonus": 10
        },
        "explanation": "This property is within your budget, matches your preferred location, and offers excellent WiFi connectivity."
      }
    ],
    "total_evaluated": 12,
    "preferences_used": { ... }
  }
}
```

---

## Bookings

### `POST /api/booking`

Create a new booking. Triggers the full agent pipeline:
Recommendation → Treasury Approval → Settlement.

**Request Body:**

```json
{
  "property_id": 1,
  "check_in": "2026-07-20",
  "check_out": "2026-07-27",
  "preference": {
    "budget": 10000,
    "location": "Lagos",
    "min_wifi_speed": 30,
    "max_beach_distance": 500,
    "duration_days": 7
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `property_id` | int | Yes | ID of the property to book |
| `check_in` | string (date) | Yes | Check-in date (YYYY-MM-DD) |
| `check_out` | string (date) | Yes | Check-out date (YYYY-MM-DD) |
| `preference` | object | Yes | User preferences used for validation |

**Response:**

```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "bk_001",
      "property_id": 1,
      "property_name": "Lekki Beach Apartment",
      "check_in": "2026-07-20",
      "check_out": "2026-07-27",
      "total_price": 56000,
      "status": "settled",
      "created_at": "2026-07-10T16:00:00Z"
    },
    "treasury_decision": {
      "approved": true,
      "reason": "Booking is within budget. Wallet balance sufficient.",
      "wallet_balance_before": 100000,
      "wallet_balance_after": 44000
    },
    "settlement": {
      "transaction_id": "tx_001",
      "amount": 56000,
      "currency": "USDC",
      "status": "completed",
      "settled_at": "2026-07-10T16:00:01Z"
    }
  }
}
```

**Errors:**

| Code | Status | When |
|------|--------|------|
| `PROPERTY_NOT_FOUND` | 404 | Property ID does not exist |
| `PROPERTY_UNAVAILABLE` | 400 | Property is not available |
| `TREASURY_REJECTED` | 400 | Budget exceeded or insufficient wallet balance |
| `SETTLEMENT_FAILED` | 500 | Settlement could not be completed |

---

### `GET /api/bookings`

List all bookings.

**Response:**

```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "bk_001",
        "property_id": 1,
        "property_name": "Lekki Beach Apartment",
        "check_in": "2026-07-20",
        "check_out": "2026-07-27",
        "total_price": 56000,
        "status": "settled",
        "created_at": "2026-07-10T16:00:00Z"
      }
    ],
    "total": 1
  }
}
```

---

### `GET /api/booking/{id}`

Get a single booking by ID.

**Path Params:**

| Param | Type | Required |
|-------|------|----------|
| `id`  | string | Yes    |

**Response:** Same shape as the booking object above.

**Errors:**

| Code | Status | When |
|------|--------|------|
| `BOOKING_NOT_FOUND` | 404 | Booking ID does not exist |

---

## Wallet

### `GET /api/wallet`

Get current wallet balance and transaction history.

**Response:**

```json
{
  "success": true,
  "data": {
    "wallet": {
      "address": "0xSIMULATED_WALLET_ADDRESS",
      "balance": 44000,
      "currency": "USDC"
    },
    "transactions": [
      {
        "id": "tx_001",
        "type": "debit",
        "amount": 56000,
        "booking_id": "bk_001",
        "description": "Booking settlement — Lekki Beach Apartment",
        "timestamp": "2026-07-10T16:00:01Z",
        "status": "completed"
      }
    ],
    "total_transactions": 1
  }
}
```

---

### `POST /api/wallet/initialize`

Initialize or reset the simulated wallet with a starting balance.

**Request Body:**

```json
{
  "initial_balance": 100000
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `initial_balance` | float | No | 100000 | Starting USDC balance |

**Response:**

```json
{
  "success": true,
  "data": {
    "wallet": {
      "address": "0xSIMULATED_WALLET_ADDRESS",
      "balance": 100000,
      "currency": "USDC"
    },
    "message": "Wallet initialized successfully"
  }
}
```

---

## Health

### `GET /`

Health check endpoint.

**Response:**

```json
{
  "message": "EstateMind API Running"
}
```
