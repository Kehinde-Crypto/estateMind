from sqlalchemy import Column, String, Float, Integer, DateTime
from database import Base
import datetime

class WalletORM(Base):
    __tablename__ = "wallets"

    address = Column(String, primary_key=True, index=True)
    balance = Column(Float, default=100000.0)

class TransactionORM(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    type = Column(String)
    amount = Column(Float)
    booking_id = Column(String)
    description = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String)

class BookingORM(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    property_id = Column(Integer, index=True)
    property_name = Column(String)
    check_in = Column(String)
    check_out = Column(String)
    total_price = Column(Float)
    status = Column(String)
