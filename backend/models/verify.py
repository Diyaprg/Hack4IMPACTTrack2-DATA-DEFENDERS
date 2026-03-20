from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class VerifyType(str, Enum):
    PHONE = "phone"
    UPI = "upi"
    VIDEO = "video"


class VerifyRequest(BaseModel):
    type: VerifyType
    value: str


class NetworkPosition(BaseModel):
    connected_campaigns: List[str] = []
    connected_entities: List[str] = []
    centrality_score: float = 0.0
    first_seen: Optional[str] = None


class VerifyResponse(BaseModel):
    input: str
    type: str
    is_fraud: bool
    fraud_probability: float
    confidence: str
    reason: str
    network_position: Optional[NetworkPosition] = None
    recommendation: str
    checked_against: int = 0
