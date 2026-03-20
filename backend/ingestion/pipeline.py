from ai.classifier import classify_threat
from ai.entity_extractor import extract_entities
from ai.graph_builder import add_entities
from core.database import db
from loguru import logger
from datetime import datetime


async def process(
    raw_text: str,
    source: str,
    channel_id: str = None,
    channel_name: str = None,
    media_type: str = "text",
    media_url: str = None,
) -> dict:
    if not raw_text or len(raw_text.strip()) < 10:
        return {"status": "skipped", "reason": "too_short"}

    classification = classify_threat(raw_text)
    entities = classification.get("entities", extract_entities(raw_text))

    threat_data = {
        "raw_text": raw_text[:2000],
        "source": source,
        "channel_id": str(channel_id) if channel_id else "",
        "channel_name": channel_name or "",
        "media_type": media_type,
        "media_url": media_url or "",
        "category": classification["category"],
        "confidence": classification["confidence"],
        "method": classification.get("method", "keyword"),
        "target_states": entities.get("target_states", []),
        "entities": {
            "phones": entities.get("phones", []),
            "upi_ids": entities.get("upi_ids", []),
            "telegram_handles": entities.get("telegram_handles", []),
            "urls": entities.get("urls", []),
        },
        "campaign_id": "",
        "ingested_at": datetime.utcnow().isoformat(),
    }

    saved = await db.write_threat(threat_data)

    if saved:
        add_entities(entities, saved.get("id", "unknown"))
        logger.info(
            f"Threat ingested: [{classification['category']}] "
            f"conf={classification['confidence']:.2f} "
            f"source={source}"
        )
        return {"status": "ok", "threat_id": saved.get("id"), "category": classification["category"]}

    return {"status": "error", "reason": "db_write_failed"}
