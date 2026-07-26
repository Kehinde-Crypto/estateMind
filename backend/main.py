# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from api.recommendation import router as recommendation_router
from api.properties import router as properties_router
from api.booking import router as booking_router
from api.payment import router as payment_router

from database import engine
from models.orm import Base

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EstateMind API",
    description="Autonomous Wallet for Accommodations"
)

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(properties_router)
app.include_router(recommendation_router)
app.include_router(booking_router)
app.include_router(payment_router)

@app.get("/")
def root():
    return {
        "message": "EstateMind API Running"
    }