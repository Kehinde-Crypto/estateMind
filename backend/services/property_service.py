# services/property_service.py
import json
from typing import List, Optional
from models.property import Property

# Fix the file path to match the actual file name
DATA_FILE = "data/property.json"

def load_properties() -> List[dict]:
    try:
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def get_property_by_id(property_id: int) -> Optional[dict]:
    properties = load_properties()
    for prop in properties:
        if prop["id"] == property_id:
            return prop
    return None

def get_all_properties() -> List[dict]:
    return load_properties()