# api/properties.py
from fastapi import APIRouter, HTTPException
from services.property_service import get_all_properties, get_property_by_id

router = APIRouter(
    prefix="/api/properties",
    tags=["Properties"]
)

@router.get("")
def list_properties():
    properties = get_all_properties()
    return {
        "success": True,
        "data": {
            "properties": properties,
            "total": len(properties)
        },
        "error": None
    }

@router.get("/{property_id}")
def get_property(property_id: int):
    prop = get_property_by_id(property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="PROPERTY_NOT_FOUND")
        
    return {
        "success": True,
        "data": {
            "property": prop
        },
        "error": None
    }
