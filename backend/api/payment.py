# api/payment.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from services.wallet_service import get_wallet, initialize_wallet
from database import get_db

router = APIRouter(
    prefix="/api/wallet",
    tags=["Wallet"]
)

class InitWalletRequest(BaseModel):
    initial_balance: float = 100000.0

@router.get("")
def read_wallet(db: Session = Depends(get_db)):
    wallet_data = get_wallet(db)
    return {
        "success": True,
        "data": {
            "wallet": {
                "address": wallet_data["address"],
                "balance": wallet_data["balance"],
                "currency": "USDC"
            },
            "transactions": wallet_data["transactions"],
            "total_transactions": len(wallet_data["transactions"])
        },
        "error": None
    }

@router.post("/initialize")
def reset_wallet(request: InitWalletRequest, db: Session = Depends(get_db)):
    wallet_data = initialize_wallet(db, request.initial_balance)
    return {
        "success": True,
        "data": {
            "wallet": {
                "address": wallet_data["address"],
                "balance": wallet_data["balance"],
                "currency": "USDC"
            },
            "message": "Wallet initialized successfully"
        },
        "error": None
    }
