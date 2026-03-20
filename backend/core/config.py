from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "SurakshAI"
    APP_ENV: str = "development"
    APP_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"

    POCKETBASE_URL: str = "http://127.0.0.1:8090"
    POCKETBASE_ADMIN_EMAIL: str = "admin@suraksh.ai"
    POCKETBASE_ADMIN_PASSWORD: str = "suraksh_admin_2026"

    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.1-70b-versatile"

    TELEGRAM_API_ID: str = ""
    TELEGRAM_API_HASH: str = ""
    TELEGRAM_SESSION_NAME: str = "suraksh_session"

    SEVERITY_THRESHOLD: float = 0.82
    ALERT_RETRY_ATTEMPTS: int = 3
    ALERT_RETRY_DELAY: int = 2

    BANK_SBI_WEBHOOK: str = "http://localhost:8000/mock/bank/sbi"
    BANK_HDFC_WEBHOOK: str = "http://localhost:8000/mock/bank/hdfc"
    BANK_PAYTM_WEBHOOK: str = "http://localhost:8000/mock/bank/paytm"
    BANK_PHONEPE_WEBHOOK: str = "http://localhost:8000/mock/bank/phonepe"
    CERTIN_WEBHOOK: str = "http://localhost:8000/mock/certin"

    BERT_MODEL: str = "bert-base-multilingual-cased"
    DEEPFAKE_MODEL_PATH: str = "models/deepfake_efficientnet.pth"
    GNN_MODEL_PATH: str = "models/graphsage.pth"

    @property
    def bank_webhooks(self) -> dict:
        return {
            "SBI":     self.BANK_SBI_WEBHOOK,
            "HDFC":    self.BANK_HDFC_WEBHOOK,
            "Paytm":   self.BANK_PAYTM_WEBHOOK,
            "PhonePe": self.BANK_PHONEPE_WEBHOOK,
        }

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

FRAUD_CHANNELS = [
    # Add real Telegram channel IDs here
    # These are placeholder IDs for demo
    -1001234567890,
    -1009876543210,
]

THREAT_CATEGORIES = [
    "investment_scam",
    "voice_clone",
    "fake_upi_refund",
    "phishing",
    "mule_recruitment",
    "deepfake_celebrity",
    "lottery_scam",
    "unknown",
]

INDIAN_STATES = [
    "Maharashtra", "Uttar Pradesh", "Bihar", "West Bengal",
    "Madhya Pradesh", "Rajasthan", "Karnataka", "Gujarat",
    "Andhra Pradesh", "Odisha", "Telangana", "Tamil Nadu",
    "Kerala", "Jharkhand", "Assam", "Punjab", "Haryana",
    "Delhi", "Chhattisgarh", "Uttarakhand",
]
