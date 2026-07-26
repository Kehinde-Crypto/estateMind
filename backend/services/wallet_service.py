# services/wallet_service.py
from datetime import datetime, timezone
import uuid
from sqlalchemy.orm import Session
from models.orm import WalletORM, TransactionORM
from services.circle_service import CircleService

circle_service = CircleService()

def get_wallet(db: Session) -> dict:
    wallet = db.query(WalletORM).first()
    
    # Target real Circle address if configured
    target_address = circle_service.wallet_address if circle_service.is_configured() else "0xSIMULATED_WALLET_123456789"
    
    if not wallet:
        wallet = WalletORM(address=target_address, balance=100000.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)
    elif circle_service.is_configured() and wallet.address != target_address:
        wallet.address = target_address
        db.commit()

    transactions = db.query(TransactionORM).order_by(TransactionORM.timestamp.desc()).all()
    
    # Query on-chain balance if Circle is configured
    current_balance = wallet.balance
    if circle_service.is_configured():
        circle_data = circle_service.get_wallet_balance()
        if "error" not in circle_data and circle_data["balance"] > 0:
            current_balance = circle_data["balance"]
            wallet.balance = current_balance
            db.commit()

    return {
        "address": wallet.address,
        "balance": current_balance,
        "is_real_circle_wallet": circle_service.is_configured(),
        "blockchain": "MATIC-AMOY" if circle_service.is_configured() else "SIMULATED",
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
    target_address = circle_service.wallet_address if circle_service.is_configured() else "0xSIMULATED_WALLET_123456789"
    
    if not wallet:
        wallet = WalletORM(address=target_address, balance=initial_balance)
        db.add(wallet)
        db.commit()
    else:
        wallet.balance = initial_balance
        wallet.address = target_address
        db.commit()
        
    return get_wallet(db)

def deduct_funds(db: Session, amount: float, booking_id: str, description: str) -> dict:
    wallet = db.query(WalletORM).first()
    target_address = circle_service.wallet_address if circle_service.is_configured() else "0xSIMULATED_WALLET_123456789"

    if not wallet:
        wallet = WalletORM(address=target_address, balance=100000.0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    if wallet.balance < amount:
        raise ValueError("Insufficient funds")
        
    # Deduct balance in local database
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
        "amount": amount,
        "booking_id": booking_id,
        "description": description,
        "timestamp": tx.timestamp.isoformat(),
        "status": tx.status
    }
