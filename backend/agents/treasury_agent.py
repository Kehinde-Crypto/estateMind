# agents/treasury_agent.py
from models.preference import UserPreference
from typing import Dict

class TreasuryAgent:
    
    def approve_booking(self, property_data: dict, duration_days: int, preference: UserPreference, wallet: dict) -> Dict:
        """
        Validates booking against budget constraints and wallet balance.
        """
        total_cost = property_data["price"] * duration_days
        
        # 1. Enforce Per-night Budget
        budget_check = property_data["price"] <= preference.budget
        if not budget_check:
            return {
                "approved": False,
                "reason": f"Property price ({property_data['price']} USDC) exceeds per-night budget ({preference.budget} USDC).",
                "checks": {"budget_check": False, "balance_check": True, "low_balance_warning": False}
            }
            
        # 2. Enforce Wallet Balance
        balance_check = total_cost <= wallet["balance"]
        if not balance_check:
            return {
                "approved": False,
                "reason": f"Insufficient wallet balance. Cost is {total_cost} USDC, but balance is {wallet['balance']} USDC.",
                "checks": {"budget_check": True, "balance_check": False, "low_balance_warning": False}
            }
            
        # 3. Low balance warning (below 10% of 100k starting balance)
        remaining = wallet["balance"] - total_cost
        low_balance = remaining < 10000 
        
        return {
            "approved": True,
            "reason": "Booking approved. Within budget and sufficient balance.",
            "checks": {
                "budget_check": True,
                "balance_check": True,
                "low_balance_warning": low_balance
            },
            "financial_summary": {
                "property_price_per_night": property_data["price"],
                "duration_days": duration_days,
                "total_cost": total_cost,
                "wallet_balance_before": wallet["balance"],
                "wallet_balance_after": remaining
            }
        }
