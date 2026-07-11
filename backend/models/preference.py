# models/preference.py
from pydantic import BaseModel

class UserPreference(BaseModel):
    budget: float
    location: str
    min_wifi_speed: float
    max_beach_distance: int
    duration_days: int