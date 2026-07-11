# Agent Behavior Specifications

EstateMind uses 3 AI agents that work in a pipeline to autonomously
discover, evaluate, approve, and settle accommodation bookings.

---

## Agent Pipeline

```
User Preferences
       │
       ▼
┌──────────────────┐
│ Recommendation   │  Evaluates all properties → returns ranked list
│ Agent            │
└──────┬───────────┘
       │ Top recommendation selected
       ▼
┌──────────────────┐
│ Treasury         │  Validates budget + wallet balance → approves/rejects
│ Agent            │
└──────┬───────────┘
       │ If approved
       ▼
┌──────────────────┐
│ Settlement       │  Deducts funds → records transaction → confirms
│ Agent            │
└──────────────────┘
```

---

## 1. Recommendation Agent

**Purpose:** Evaluate available properties against user preferences
and return a ranked list of the best matches.

**File:** `backend/agents/recommendation_agent.py`

### Input

```python
class UserPreference:
    budget: float            # Max price per night (USDC)
    location: str            # Preferred city
    min_wifi_speed: float    # Minimum Mbps
    max_beach_distance: int  # Maximum meters to beach
    duration_days: int       # Length of stay
```

### Scoring System (Max: 110 Points)

| Criteria | Condition | Points |
|----------|-----------|--------|
| Budget Match | `property.price <= preference.budget` | +40 |
| Location Match | `property.location == preference.location` (case-insensitive) | +15 |
| WiFi Match | `property.wifi_speed >= preference.min_wifi_speed` | +15 |
| Beach Distance | `property.beach_distance <= preference.max_beach_distance` | +10 |
| Rating | `(property.rating / 5) * 20` | 0–20 |
| Availability | `property.available == true` | +10 |

### Output

```python
{
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
            "explanation": "..."  # Template-based or LLM-generated
        }
    ],
    "total_evaluated": 12
}
```

### Behavior Rules

1. Always return **top 3** properties, sorted by score descending
2. If fewer than 3 properties exist, return all available
3. Include a score breakdown for every recommended property
4. Generate an explanation for each recommendation
5. Properties with `available: false` still get scored but are flagged
6. Ties in score are broken by higher rating, then lower price

### Explanation Templates (No-LLM Fallback)

When no LLM API key is available, use template-based explanations:

- **Score > 90:** "Excellent match! This property meets all your key criteria — budget, location, and connectivity."
- **Score 70-90:** "Strong match. This property meets most of your preferences with minor tradeoffs in {lowest_criteria}."
- **Score 50-70:** "Decent option. It's {within/above} budget but falls short on {missing_criteria}."
- **Score < 50:** "Limited match. Consider adjusting your preferences for better options."

---

## 2. Treasury Agent

**Purpose:** Validate that a booking is financially viable before
allowing settlement. Acts as the financial gatekeeper.

**File:** `backend/agents/treasury_agent.py`

### Input

```python
{
    "booking": {
        "property_id": 1,
        "total_price": 56000,  # price × duration_days
        "duration_days": 7
    },
    "wallet": {
        "balance": 100000
    },
    "preference": {
        "budget": 10000  # per-night budget
    }
}
```

### Decision Logic

```
1. Calculate total_cost = property.price × duration_days
2. CHECK: Is property.price <= preference.budget?
   → NO  → REJECT with reason "Property exceeds per-night budget"
3. CHECK: Is total_cost <= wallet.balance?
   → NO  → REJECT with reason "Insufficient wallet balance"
4. CHECK: Would remaining balance fall below 10% of original?
   → YES → APPROVE with WARNING "Low balance after booking"
   → NO  → APPROVE
```

### Output

```python
{
    "approved": true,  # or false
    "reason": "Booking approved. Within budget and sufficient balance.",
    "checks": {
        "budget_check": true,
        "balance_check": true,
        "low_balance_warning": false
    },
    "financial_summary": {
        "property_price_per_night": 8000,
        "duration_days": 7,
        "total_cost": 56000,
        "wallet_balance_before": 100000,
        "wallet_balance_after": 44000
    }
}
```

### Behavior Rules

1. **Never approve** a booking that exceeds the wallet balance
2. **Never approve** a booking where the per-night price exceeds the user's stated budget
3. Always calculate `total_cost = price × duration_days`
4. Issue a warning (but still approve) if remaining balance would be < 10% of starting balance
5. Return a clear, human-readable reason for every decision
6. Treasury decisions are final — no override mechanism in MVP

---

## 3. Settlement Agent

**Purpose:** Execute the simulated USDC payment after Treasury
approval. Deduct funds, record the transaction, and confirm.

**File:** `backend/agents/settlement_agent.py`

### Input

```python
{
    "booking": {
        "id": "bk_001",
        "property_id": 1,
        "property_name": "Lekki Beach Apartment",
        "total_price": 56000
    },
    "treasury_approval": {
        "approved": true,
        "financial_summary": { ... }
    },
    "wallet": {
        "address": "0xSIMULATED_WALLET_ADDRESS",
        "balance": 100000
    }
}
```

### Settlement Flow

```
1. VERIFY: Treasury approval is true
   → false → ABORT with "Cannot settle without treasury approval"
2. VERIFY: Wallet balance >= total_price (double-check)
   → false → ABORT with "Balance changed since approval"
3. DEDUCT: wallet.balance -= total_price
4. RECORD: Create transaction record
5. UPDATE: Set booking status to "settled"
6. RETURN: Settlement receipt
```

### Output

```python
{
    "settled": true,
    "transaction": {
        "id": "tx_001",
        "type": "debit",
        "amount": 56000,
        "currency": "USDC",
        "booking_id": "bk_001",
        "description": "Booking settlement — Lekki Beach Apartment",
        "from_address": "0xSIMULATED_WALLET_ADDRESS",
        "to_address": "0xPROPERTY_OWNER_SIMULATED",
        "timestamp": "2026-07-10T16:00:01Z",
        "status": "completed"
    },
    "wallet_balance_after": 44000
}
```

### Behavior Rules

1. **Never settle** without a valid Treasury approval
2. **Always double-check** the wallet balance before deducting
3. Generate a unique transaction ID for every settlement (format: `tx_{sequential}`)
4. Generate a unique booking ID for every booking (format: `bk_{sequential}`)
5. Transaction records are immutable once created
6. In MVP, all settlements are simulated — no real blockchain calls
7. If settlement fails mid-execution, booking status should be set to `failed` (not `settled`)

---

## Agent Communication Protocol

Agents communicate through the **Booking API endpoint** which
orchestrates the pipeline:

```python
# In api/booking.py — POST /api/booking

1. Validate property exists and is available
2. recommendation_agent.get_score(property, preference)
   → Attach score + explanation to booking
3. treasury_agent.approve_booking(booking, wallet, preference)
   → If rejected → return 400 with treasury decision
4. settlement_agent.settle_booking(booking, treasury_decision, wallet)
   → If failed → return 500 with settlement error
5. Return complete booking with all agent decisions
```

### Error Escalation

| Agent | Failure Mode | Result |
|-------|-------------|--------|
| Recommendation | No properties match | Return empty list with message |
| Treasury | Budget exceeded | Booking rejected, no settlement |
| Treasury | Insufficient funds | Booking rejected, no settlement |
| Settlement | Balance mismatch | Booking marked as `failed` |
| Settlement | Internal error | Booking marked as `failed`, funds not deducted |
