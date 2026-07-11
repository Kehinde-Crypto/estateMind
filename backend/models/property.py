# models/property.py
from pydantic import BaseModel

class Property(BaseModel):
    id: int
    name: str
    location: str
    price: float
    wifi_speed: float
    beach_distance: int
    rating: float
    available: bool