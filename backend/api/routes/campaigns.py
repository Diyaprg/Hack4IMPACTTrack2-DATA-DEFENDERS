from fastapi import APIRouter, Query, HTTPException
from core.database import db
from ai.graph_builder import get_subgraph_for_campaign
from typing import Optional

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("")
async def get_campaigns(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    severity: Optional[str] = None,
):
    return await db.get_campaigns(
        page=page,
        per_page=per_page,
        status=status,
        severity=severity,
    )


@router.get("/{campaign_id}")
async def get_campaign(campaign_id: str):
    campaign = await db.get_campaign_by_id(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.get("/{campaign_id}/threats")
async def get_campaign_threats(campaign_id: str):
    result = await db.get_threats(page=1, per_page=200)
    threats = [
        t for t in result.get("items", [])
        if t.get("campaign_id") == campaign_id
    ]
    return {"items": threats, "total": len(threats)}


@router.get("/{campaign_id}/network")
async def get_campaign_network(campaign_id: str):
    return get_subgraph_for_campaign(campaign_id)
