from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ThreatCategory(str, Enum):
    INVESTMENT_SCAM = "investment_scam"
    VOICE_CLONE = "voice_clone"
    FAKE_UPI_REFUND = "fake_upi_refund"
    PHISHING = "phishing"
    MULE_RECRUITMENT = "mule_recruitment"
    DEEPFAKE_CELEBRITY = "deepfake_celebrity"
    LOTTERY_SCAM = "lottery_scam"
    UNKNOWN = "unknown"


class ThreatSource(str, Enum):
    TELEGRAM = "telegram"
    DARK_WEB = "dark_web"
    SOCIAL_MEDIA = "social_media"
    CERTIN = "certin"
    MANUAL = "manual"


class ThreatCreate(BaseModel):
    raw_text: str
    source: ThreatSource
    channel_id: Optional[str] = None
    channel_name: Optional[str] = None
    media_type: Optional[str] = "text"
    media_url: Optional[str] = None


class ThreatResponse(BaseModel):
    id: str
    raw_text: str
    source: str
    channel_name: Optional[str]
    category: str
    confidence: float
    target_states: List[str] = []
    entities: dict = {}
    campaign_id: Optional[str] = None
    created: datetime

    class Config:
        from_attributes = True


class ThreatListResponse(BaseModel):
    items: List[ThreatResponse]
    total: int
    page: int
    per_page: int
