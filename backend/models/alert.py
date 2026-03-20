from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AlertResponse(BaseModel):
    id: str
    campaign_id: str
    campaign_name: str
    risk_level: str
    banks_notified: List[str] = []
    certin_notified: bool = False
    payload: dict = {}
    status: str
    estimated_amount_protected_cr: float = 0.0
    created: datetime

    class Config:
        from_attributes = True


class AlertListResponse(BaseModel):
    items: List[AlertResponse]
    total: int
