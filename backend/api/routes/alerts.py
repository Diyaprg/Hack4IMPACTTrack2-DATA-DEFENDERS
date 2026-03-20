from fastapi import APIRouter, Query, HTTPException
from core.database import db

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("")
async def get_alerts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    return await db.get_alerts(page=page, per_page=per_page)


@router.get("/{alert_id}")
async def get_alert(alert_id: str):
    alert = await db.get_alert_by_id(alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
