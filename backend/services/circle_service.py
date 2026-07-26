# services/circle_service.py
import os
import uuid
import base64
import httpx
from typing import Dict, Optional
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_public_key

class CircleService:
    def __init__(self):
        self.api_key = os.getenv("CIRCLE_API_KEY")
        self.entity_secret = os.getenv("CIRCLE_ENTITY_SECRET")
        self.wallet_id = os.getenv("CIRCLE_WALLET_ID")
        self.wallet_address = os.getenv("CIRCLE_WALLET_ADDRESS")
        self.base_url = "https://api.circle.com/v1/w3s"

    def is_configured(self) -> bool:
        return bool(self.api_key and self.entity_secret and self.wallet_id)

    def _get_entity_secret_ciphertext(self) -> str:
        url = f"{self.base_url}/config/entity/publicKey"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        res = httpx.get(url, headers=headers, timeout=10.0)
        res.raise_for_status()
        public_key_pem = res.json()["data"]["publicKey"]

        public_key = load_pem_public_key(public_key_pem.encode("utf-8"))
        ciphertext = public_key.encrypt(
            bytes.fromhex(self.entity_secret),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        return base64.b64encode(ciphertext).decode("utf-8")

    def get_wallet_balance(self) -> Dict:
        """
        Fetches on-chain token balance for the configured Circle wallet.
        """
        if not self.is_configured():
            return {"balance": 100000.0, "address": "0xSIMULATED_WALLET_123456789", "tokens": []}

        url = f"{self.base_url}/wallets/{self.wallet_id}/balances"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        try:
            res = httpx.get(url, headers=headers, timeout=10.0)
            res.raise_for_status()
            data = res.json().get("data", {})
            token_balances = data.get("tokenBalances", [])

            # Look for USDC token or default to 0
            usdc_amount = 0.0
            for tb in token_balances:
                token = tb.get("token", {})
                if token.get("symbol") in ["USDC", "USDC.e"]:
                    usdc_amount = float(tb.get("amount", 0))
                    break

            return {
                "balance": usdc_amount,
                "address": self.wallet_address,
                "tokens": token_balances,
                "circle_wallet_id": self.wallet_id
            }
        except Exception as e:
            print(f"Error fetching Circle balance: {e}")
            return {
                "balance": 0.0,
                "address": self.wallet_address or "0xSIMULATED_WALLET",
                "tokens": [],
                "error": str(e)
            }

    def transfer_usdc(self, destination_address: str, amount: float, booking_id: str) -> Dict:
        """
        Initiates a developer-controlled USDC transfer on Polygon Amoy testnet.
        """
        if not self.is_configured():
            raise ValueError("Circle API credentials not configured.")

        url = f"{self.base_url}/developer/transactions/transfer"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        # Retrieve token ID for USDC on MATIC-AMOY or send natively
        payload = {
            "idempotencyKey": str(uuid.uuid4()),
            "walletId": self.wallet_id,
            "destinationAddress": destination_address,
            "amounts": [str(amount)],
            "feeLevel": "MEDIUM",
            "entitySecretCiphertext": self._get_entity_secret_ciphertext()
        }

        try:
            res = httpx.post(url, headers=headers, json=payload, timeout=15.0)
            res.raise_for_status()
            tx_data = res.json().get("data", {})
            return {
                "success": True,
                "tx_id": tx_data.get("id"),
                "state": tx_data.get("state"),
                "tx_hash": tx_data.get("txHash")
            }
        except Exception as e:
            print(f"Circle Transfer Error: {e}")
            raise RuntimeError(f"Circle transaction failed: {e}")
