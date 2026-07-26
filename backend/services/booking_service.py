# services/booking_service.py
from typing import List, Optional
from sqlalchemy.orm import Session
from models.orm import BookingORM

def get_all_bookings(db: Session) -> List[dict]:
    bookings = db.query(BookingORM).all()
    return [
        {
            "id": b.id,
            "property_id": b.property_id,
            "property_name": b.property_name,
            "check_in": b.check_in,
            "check_out": b.check_out,
            "total_price": b.total_price,
            "status": b.status
        } for b in bookings
    ]

def get_booking_by_id(db: Session, booking_id: str) -> Optional[dict]:
    b = db.query(BookingORM).filter(BookingORM.id == booking_id).first()
    if b:
        return {
            "id": b.id,
            "property_id": b.property_id,
            "property_name": b.property_name,
            "check_in": b.check_in,
            "check_out": b.check_out,
            "total_price": b.total_price,
            "status": b.status
        }
    return None

def save_booking(db: Session, booking_data: dict) -> dict:
    b = BookingORM(**booking_data)
    db.add(b)
    db.commit()
    db.refresh(b)
    return booking_data

def update_booking_status(db: Session, booking_id: str, status: str) -> Optional[dict]:
    b = db.query(BookingORM).filter(BookingORM.id == booking_id).first()
    if b:
        b.status = status
        db.commit()
        db.refresh(b)
        return {
            "id": b.id,
            "property_id": b.property_id,
            "property_name": b.property_name,
            "check_in": b.check_in,
            "check_out": b.check_out,
            "total_price": b.total_price,
            "status": b.status
        }
    return None
