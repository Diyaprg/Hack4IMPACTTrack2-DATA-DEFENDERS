from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class CampaignStatus(str, Enum):
    ACTIVE = "active"
    MONITORING = "monitoring"
    NEUTRALISED = "neutralised"


class CampaignSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class CampaignResponse(BaseModel):
    id: str
    name: str
    category: str
    severity: str
    status: str
    target_states: List[str] = []
    threat_count: int = 0
    operator_count: int = 0
    summary: str = ""
    score: float = 0.0
    alert_fired: bool = False
    first_detected: datetime
    created: datetime

    class Config:
        from_attributes = True


class CampaignListResponse(BaseModel):
    items: List[CampaignResponse]
    total: int
