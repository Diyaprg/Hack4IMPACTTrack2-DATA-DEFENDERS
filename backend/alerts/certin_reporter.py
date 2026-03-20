from datetime import datetime
from core.config import settings


def generate_certin_report(campaign: dict) -> dict:
    now = datetime.utcnow().isoformat() + "Z"

    return {
        "report_metadata": {
            "report_id": f"SURAKSH-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "generated_at": now,
            "generated_by": "SurakshAI Autonomous Threat Intelligence Platform",
            "report_version": "1.0",
            "classification": "TLP:AMBER",
        },
        "incident_details": {
            "incident_type": "Coordinated Financial Fraud Campaign",
            "campaign_name": campaign.get("name"),
            "category": campaign.get("category"),
            "severity": campaign.get("severity", "high").upper(),
            "first_detected": campaign.get("first_detected", now),
            "report_generated": now,
            "status": "ACTIVE",
        },
        "threat_intelligence": {
            "threat_count": campaign.get("threat_count", 0),
            "target_states": campaign.get("target_states", []),
            "confidence_score": campaign.get("score", 0.0),
            "operator_network_size": campaign.get("operator_count", 0),
            "campaign_summary": campaign.get("summary", ""),
        },
        "recommended_actions": _get_recommended_actions(campaign.get("category", "unknown")),
        "affected_platforms": ["UPI", "WhatsApp", "Telegram", "SMS"],
        "iocs": {
            "description": "Indicators of Compromise extracted from campaign messages",
            "note": "Full IOC list available via SurakshAI API /campaigns/{id}/iocs",
        },
        "contact": {
            "platform": "SurakshAI",
            "api": f"{settings.FRONTEND_URL}/api",
            "report_portal": f"{settings.FRONTEND_URL}/alerts",
        },
    }


def _get_recommended_actions(category: str) -> list:
    base_actions = [
        "Block all UPI IDs and phone numbers listed in IOC section",
        "Flag associated transactions for manual review",
        "Alert fraud detection teams in all member banks",
        "Issue customer advisory through official channels",
    ]

    category_actions = {
        "investment_scam": [
            "Block UPI IDs associated with fake investment platforms",
            "Monitor for large outbound transfers to flagged accounts",
            "Coordinate with SEBI for regulatory action on fake scheme promoters",
        ],
        "voice_clone": [
            "Advise customers to verify family emergency calls via callback",
            "Flag same-device multiple transfer attempts as high risk",
            "Issue advisory: always call back on known numbers before transferring",
        ],
        "fake_upi_refund": [
            "Block inbound calls spoofing NPCI/RBI numbers",
            "Disable OTP sharing prompts in customer-facing communications",
            "Monitor for refund-claim transaction patterns",
        ],
        "phishing": [
            "Block listed phishing domains at DNS level",
            "Invalidate sessions from IPs associated with phishing campaign",
            "Force re-authentication for customers in targeted regions",
        ],
    }

    return base_actions + category_actions.get(category, [])
