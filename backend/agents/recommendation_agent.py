# agents/recommendation_agent.py
from services.property_service import get_all_properties
from models.preference import UserPreference
from typing import List, Dict
import os
import httpx
import json

class RecommendationAgent:

    def _generate_template_explanation(self, score: float, property: dict, preference: UserPreference) -> str:
        # Template-based explanation (fallback if Gemini API is unavailable)
        if score > 90:
            return "Excellent match! This property meets all your key criteria — budget, location, and connectivity."
        elif score >= 70:
            if property["price"] > preference.budget:
                return "Strong match. Meets most preferences but is slightly above your requested budget."
            elif property["wifi_speed"] < preference.min_wifi_speed:
                return "Strong match. Meets most preferences but has slower WiFi than requested."
            else:
                return "Strong match. This property meets most of your preferences."
        elif score >= 50:
            return "Decent option, but requires some compromises on your preferences."
        else:
            return "Limited match. Consider adjusting your preferences for better options."

    async def _generate_gemini_explanation(self, property: dict, preference: UserPreference, score_breakdown: dict) -> str:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return None

        prompt = (
            f"You are an autonomous AI accommodation agent named EstateMind. "
            f"A user is looking for a property with these preferences: "
            f"Budget: {preference.budget} USDC/night, Location: {preference.location}, "
            f"Min WiFi: {preference.min_wifi_speed}Mbps, Max Beach Distance: {preference.max_beach_distance}m. "
            f"You are recommending this property: "
            f"Name: {property['name']}, Location: {property['location']}, "
            f"Price: {property['price']} USDC/night, WiFi: {property['wifi_speed']}Mbps, "
            f"Rating: {property['rating']}/5. "
            f"Score breakdown (out of 110 points): {json.dumps(score_breakdown)}. "
            f"Write a concise 1-2 sentence explanation to the user on why this property was recommended. "
            f"Focus on the key strengths or tradeoffs. Be direct and professional."
        )

        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"gemini-3.5-flash:generateContent?key={api_key}"
        )

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {
                            "maxOutputTokens": 300,
                            "temperature": 0.4
                        }
                    },
                    timeout=15.0
                )
                response.raise_for_status()
                data = response.json()
                
                # Safely extract the response text
                candidates = data.get("candidates", [])
                if not candidates:
                    return None
                    
                content = candidates[0].get("content", {})
                parts = content.get("parts", [])
                
                if not parts:
                    return None
                    
                return parts[0].get("text", "").strip()
        except Exception as e:
            print(f"Gemini API failed, falling back to template: {e}")
            return None

    async def recommend(self, preference: UserPreference) -> Dict:
        properties = get_all_properties()
        evaluated_properties = []

        for property in properties:
            score = 0
            breakdown = {
                "budget_match": 0,
                "location_match": 0,
                "wifi_match": 0,
                "beach_distance_match": 0,
                "rating_score": 0,
                "availability_bonus": 0
            }

            # 1. Budget (+40)
            if property["price"] <= preference.budget:
                score += 40
                breakdown["budget_match"] = 40

            # 2. Location (+15)
            if property["location"].lower() == preference.location.lower():
                score += 15
                breakdown["location_match"] = 15

            # 3. WiFi (+15)
            if property["wifi_speed"] >= preference.min_wifi_speed:
                score += 15
                breakdown["wifi_match"] = 15

            # 4. Beach Distance (+10)
            if property["beach_distance"] <= preference.max_beach_distance:
                score += 10
                breakdown["beach_distance_match"] = 10

            # 5. Rating (0-20)
            rating_pts = (property["rating"] / 5.0) * 20
            score += rating_pts
            breakdown["rating_score"] = round(rating_pts, 2)

            # 6. Availability (+10)
            if property["available"]:
                score += 10
                breakdown["availability_bonus"] = 10

            # Attempt Gemini explanation, fallback to template
            explanation = await self._generate_gemini_explanation(property, preference, breakdown)
            if not explanation:
                explanation = self._generate_template_explanation(score, property, preference)

            evaluated_properties.append({
                "property": property,
                "score": round(score, 2),
                "score_breakdown": breakdown,
                "explanation": explanation
            })

        # Sort by score descending, then rating descending, then price ascending
        evaluated_properties.sort(
            key=lambda x: (x["score"], x["property"]["rating"], -x["property"]["price"]),
            reverse=True
        )

        # Return top 3
        top_recommendations = evaluated_properties[:3]

        # Add rank
        for i, rec in enumerate(top_recommendations):
            rec["rank"] = i + 1

        return {
            "recommendations": top_recommendations,
            "total_evaluated": len(properties)
        }