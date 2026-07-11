# models/wallet.py
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class Transaction(BaseModel):
    id: str
    type: str  # debit, credit
    amount: float
    currency: str = "USDC"
    booking_id: Optional[str] = None
    description: str
    timestamp: datetime
    status: str # completed, failed

class Wallet(BaseModel):
    address: str
    balance: float
    currency: str = "USDC"
    transactions: List[Transaction] = []
