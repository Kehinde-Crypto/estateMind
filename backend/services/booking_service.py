# services/booking_service.py
from typing import List, Optional
from models.booking import Booking

# In-memory storage for MVP
_bookings_db: List[Booking] = []

def get_all_bookings() -> List[dict]:
    return [b.dict() for b in _bookings_db]

def get_booking_by_id(booking_id: str) -> Optional[dict]:
    for b in _bookings_db:
        if b.id == booking_id:
            return b.dict()
    return None

def save_booking(booking: Booking) -> dict:
    _bookings_db.append(booking)
    return booking.dict()

def update_booking_status(booking_id: str, status: str) -> Optional[dict]:
    for b in _bookings_db:
        if b.id == booking_id:
            b.status = status
            return b.dict()
    return None
