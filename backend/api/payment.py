# api/payment.py
from fastapi import APIRouter
from pydantic import BaseModel
from services.wallet_service import get_wallet, initialize_wallet

router = APIRouter(
    prefix="/api/wallet",
    tags=["Wallet"]
)

class InitWalletRequest(BaseModel):
    initial_balance: float = 100000.0

@router.get("")
def read_wallet():
    wallet_data = get_wallet()
    return {
        "success": True,
        "data": {
            "wallet": {
                "address": wallet_data["address"],
                "balance": wallet_data["balance"],
                "currency": wallet_data["currency"]
            },
            "transactions": wallet_data["transactions"],
            "total_transactions": len(wallet_data["transactions"])
        },
        "error": None
    }

@router.post("/initialize")
def reset_wallet(request: InitWalletRequest):
    wallet_data = initialize_wallet(request.initial_balance)
    return {
        "success": True,
        "data": {
            "wallet": {
                "address": wallet_data["address"],
                "balance": wallet_data["balance"],
                "currency": wallet_data["currency"]
            },
            "message": "Wallet initialized successfully"
        },
        "error": None
    }
