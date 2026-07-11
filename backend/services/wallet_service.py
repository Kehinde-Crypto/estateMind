# services/wallet_service.py
from datetime import datetime, timezone
import uuid
from models.wallet import Wallet, Transaction

# In-memory singleton for MVP simulated wallet
_mock_wallet = Wallet(
    address="0xSIMULATED_WALLET_123456789",
    balance=100000.0,  # 100k USDC starting balance
    transactions=[]
)

def get_wallet() -> dict:
    return _mock_wallet.dict()

def initialize_wallet(initial_balance: float = 100000.0) -> dict:
    global _mock_wallet
    _mock_wallet.balance = initial_balance
    _mock_wallet.transactions = []
    return _mock_wallet.dict()

def deduct_funds(amount: float, booking_id: str, description: str) -> dict:
    global _mock_wallet
    
    if _mock_wallet.balance < amount:
        raise ValueError("Insufficient funds")
        
    # Deduct balance
    _mock_wallet.balance -= amount
    
    # Create transaction record
    tx = Transaction(
        id=f"tx_{uuid.uuid4().hex[:8]}",
        type="debit",
        amount=amount,
        booking_id=booking_id,
        description=description,
        timestamp=datetime.now(timezone.utc),
        status="completed"
    )
    
    _mock_wallet.transactions.append(tx)
    return tx.dict()
