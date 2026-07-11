# api/booking.py
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
import uuid

from models.booking import BookingRequest, Booking
from services.property_service import get_property_by_id
from services.wallet_service import get_wallet
from services.booking_service import save_booking, get_all_bookings, get_booking_by_id

from agents.treasury_agent import TreasuryAgent
from agents.settlement_agent import SettlementAgent

router = APIRouter(
    prefix="/api",
    tags=["Booking"]
)

treasury_agent = TreasuryAgent()
settlement_agent = SettlementAgent()

@router.post("/booking")
def create_booking(request: BookingRequest):
    # 1. Validate property
    prop = get_property_by_id(request.property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="PROPERTY_NOT_FOUND")
    if not prop["available"]:
        raise HTTPException(status_code=400, detail="PROPERTY_UNAVAILABLE")
        
    # Calculate duration
    duration = (request.check_out - request.check_in).days
    if duration <= 0:
        raise HTTPException(status_code=400, detail="Invalid dates")
        
    total_price = prop["price"] * duration
    wallet = get_wallet()
    
    # 2. Treasury Agent Approval
    treasury_decision = treasury_agent.approve_booking(
        property_data=prop, 
        duration_days=duration, 
        preference=request.preference, 
        wallet=wallet
    )
    
    if not treasury_decision["approved"]:
        # Booking failed at treasury
        return {
            "success": False,
            "data": None,
            "error": {
                "code": "TREASURY_REJECTED",
                "message": treasury_decision["reason"]
            }
        }
        
    # Create pending booking record
    booking_id = f"bk_{uuid.uuid4().hex[:8]}"
    booking = Booking(
        id=booking_id,
        property_id=prop["id"],
        property_name=prop["name"],
        check_in=request.check_in,
        check_out=request.check_out,
        total_price=total_price,
        status="pending",
        created_at=datetime.now(timezone.utc)
    )
    save_booking(booking)
    
    # 3. Settlement Agent
    settlement = settlement_agent.settle_booking(
        booking_id=booking.id,
        property_name=prop["name"],
        total_price=total_price,
        treasury_decision=treasury_decision
    )
    
    if not settlement["settled"]:
        booking.status = "failed"
        return {
            "success": False,
            "data": None,
            "error": {
                "code": "SETTLEMENT_FAILED",
                "message": settlement["error"]
            }
        }
        
    # Success
    booking.status = "settled"
    
    return {
        "success": True,
        "data": {
            "booking": booking.dict(),
            "treasury_decision": treasury_decision,
            "settlement": settlement
        },
        "error": None
    }

@router.get("/bookings")
def list_bookings():
    bookings = get_all_bookings()
    return {
        "success": True,
        "data": {
            "bookings": bookings,
            "total": len(bookings)
        },
        "error": None
    }

@router.get("/booking/{booking_id}")
def get_booking(booking_id: str):
    booking = get_booking_by_id(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="BOOKING_NOT_FOUND")
    return {
        "success": True,
        "data": {
            "booking": booking
        },
        "error": None
    }
