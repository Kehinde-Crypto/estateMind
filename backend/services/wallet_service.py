# services/wallet_service.py
from datetime import datetime, timezone
import uuid
from sqlalchemy.orm import Session
from models.orm import WalletORM, TransactionORM

def get_wallet(db: Session) -> dict:
    wallet = db.query(WalletORM).first()
    if not wallet:
        return {"address": "0xSIMULATED_WALLET_123456789", "balance": 100000.0, "transactions": []}
    
    transactions = db.query(TransactionORM).order_by(TransactionORM.timestamp.desc()).all()
    
    return {
        "address": wallet.address,
        "balance": wallet.balance,
        "transactions": [
            {
                "id": tx.id,
                "type": tx.type,
                "amount": tx.amount,
                "booking_id": tx.booking_id,
                "description": tx.description,
                "timestamp": tx.timestamp.isoformat(),
                "status": tx.status
            } for tx in transactions
        ]
    }

def initialize_wallet(db: Session, initial_balance: float = 100000.0) -> dict:
    wallet = db.query(WalletORM).first()
    if not wallet:
        wallet = WalletORM(address="0xSIMULATED_WALLET_123456789", balance=initial_balance)
        db.add(wallet)
        db.commit()
    return get_wallet(db)

def deduct_funds(db: Session, amount: float, booking_id: str, description: str) -> dict:
    wallet = db.query(WalletORM).first()
    if not wallet:
        wallet = WalletORM(address="0xSIMULATED_WALLET_123456789", balance=100000.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    if wallet.balance < amount:
        raise ValueError("Insufficient funds")
        
    wallet.balance -= amount
    
    tx = TransactionORM(
        id=f"tx_{uuid.uuid4().hex[:8]}",
        type="debit",
        amount=amount,
        booking_id=booking_id,
        description=description,
        timestamp=datetime.now(timezone.utc),
        status="completed"
    )
    
    db.add(tx)
    db.commit()
    db.refresh(tx)
    
    return {
        "id": tx.id,
        "type": tx.type,
        "amount": tx.amount,
        "booking_id": tx.booking_id,
        "description": tx.description,
        "timestamp": tx.timestamp.isoformat(),
        "status": tx.status
    }
