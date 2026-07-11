# models/booking.py
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from models.preference import UserPreference

class Booking(BaseModel):
    id: str
    property_id: int
    property_name: str
    user_id: str = "user_default"  # Default user for MVP
    check_in: date
    check_out: date
    total_price: float
    status: str  # pending, settled, failed, rejected
    created_at: datetime

class BookingRequest(BaseModel):
    property_id: int
    check_in: date
    check_out: date
    preference: UserPreference
