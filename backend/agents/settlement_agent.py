# agents/settlement_agent.py
from typing import Dict
from sqlalchemy.orm import Session
from services.wallet_service import deduct_funds, get_wallet
from datetime import datetime, timezone

class SettlementAgent:
    
    def settle_booking(self, db: Session, booking_id: str, property_name: str, total_price: float, treasury_decision: dict) -> Dict:
        """
        Executes mock USDC settlement after treasury approval.
        """
        # 1. Verify Treasury Approval
        if not treasury_decision.get("approved", False):
            return {
                "settled": False,
                "error": "Cannot settle without treasury approval."
            }
            
        # 2. Verify Current Balance (Double Check)
        wallet = get_wallet(db)
        if wallet["balance"] < total_price:
            return {
                "settled": False,
                "error": "Balance changed since approval. Insufficient funds."
            }
            
        try:
            # 3. Deduct funds and record transaction
            description = f"Booking settlement — {property_name}"
            tx = deduct_funds(db=db, amount=total_price, booking_id=booking_id, description=description)
            
            # 4. If Circle API is active, attempt Circle on-chain settlement
            from services.circle_service import CircleService
            circle = CircleService()
            circle_tx = None
            if circle.is_configured():
                try:
                    owner_address = "0x0000000000000000000000000000000000000001"
                    circle_tx = circle.transfer_usdc(destination_address=owner_address, amount=total_price, booking_id=booking_id)
                except Exception as ce:
                    print(f"Circle settlement notification: {ce}")

            return {
                "settled": True,
                "transaction": {
                    **tx,
                    "from_address": wallet["address"],
                    "to_address": "0xPROPERTY_OWNER_SIMULATED",
                    "circle_tx": circle_tx
                },
                "wallet_balance_after": wallet["balance"] - total_price
            }
        except Exception as e:
            return {
                "settled": False,
                "error": str(e)
            }
