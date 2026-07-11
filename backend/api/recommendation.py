# api/recommendation.py
from fastapi import APIRouter
from models.preference import UserPreference
from agents.recommendation_agent import RecommendationAgent

router = APIRouter(
    prefix="/api",
    tags=["Recommendation"]
)

agent = RecommendationAgent()

@router.post("/recommend")
async def recommend(preference: UserPreference):
    result = await agent.recommend(preference)
    
    return {
        "success": True,
        "data": {
            **result,
            "preferences_used": preference.dict()
        },
        "error": None
    }