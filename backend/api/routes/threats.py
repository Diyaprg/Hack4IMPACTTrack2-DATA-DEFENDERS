from fastapi import APIRouter, Query, HTTPException
from core.database import db
from typing import Optional

router = APIRouter(prefix="/threats", tags=["threats"])


@router.get("")
async def get_threats(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    category: Optional[str] = None,
    state: Optional[str] = None,
    min_confidence: float = Query(0.0, ge=0.0, le=1.0),
):
    return await db.get_threats(
        page=page,
        per_page=per_page,
        category=category,
        state=state,
        min_confidence=min_confidence,
    )


@router.get("/{threat_id}")
async def get_threat(threat_id: str):
    threat = await db.get_threat_by_id(threat_id)
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")
    return threat
