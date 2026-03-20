from core.config import settings
from core.database import db
from alerts.bank_webhooks import send_bank_alerts
from alerts.certin_reporter import generate_certin_report
from loguru import logger
import asyncio


async def check_and_fire_alert(campaign: dict):
    score = campaign.get("score", 0.0)
    severity = campaign.get("severity", "low")
    alert_fired = campaign.get("alert_fired", False)

    if alert_fired:
        return

    should_alert = (
        score >= settings.SEVERITY_THRESHOLD or
        severity in ("critical", "high")
    )

    if not should_alert:
        logger.info(f"Campaign '{campaign.get('name')}' below alert threshold (score={score:.2f})")
        return

    logger.info(f"ALERT TRIGGERED: Campaign '{campaign.get('name')}' score={score:.2f} severity={severity}")

    certin_report = generate_certin_report(campaign)
    banks_notified, bank_results = await send_bank_alerts(campaign, certin_report)

    alert_data = {
        "campaign_id": campaign.get("id", ""),
        "campaign_name": campaign.get("name", ""),
        "risk_level": severity,
        "banks_notified": banks_notified,
        "certin_notified": True,
        "payload": certin_report,
        "status": "delivered" if any(bank_results.values()) else "partial",
        "estimated_amount_protected_cr": _estimate_protection(campaign),
        "bank_response_details": bank_results,
    }

    saved_alert = await db.write_alert(alert_data)

    if saved_alert:
        campaign_id = campaign.get("id")
        if campaign_id:
            await db.update_campaign(campaign_id, {"alert_fired": True, "status": "monitoring"})
        logger.info(f"Alert saved: {saved_alert.get('id')} — notified {len(banks_notified)} banks")
    else:
        logger.error("Failed to save alert to database")


def _estimate_protection(campaign: dict) -> float:
    severity_multiplier = {
        "critical": 8.5,
        "high": 4.2,
        "medium": 1.8,
        "low": 0.5,
    }
    base = severity_multiplier.get(campaign.get("severity", "low"), 1.0)
    threat_factor = campaign.get("threat_count", 1) * 0.15
    states_factor = len(campaign.get("target_states", [])) * 0.3
    return round(base + threat_factor + states_factor, 2)
