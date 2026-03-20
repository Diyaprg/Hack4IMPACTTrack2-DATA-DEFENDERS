from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import normalize
from core.database import db
from ai.groq_client import generate_campaign_summary
from alerts.engine import check_and_fire_alert
from loguru import logger
from datetime import datetime
import numpy as np
import random
import string

_vectorizer = TfidfVectorizer(
    max_features=500,
    ngram_range=(1, 2),
    min_df=1,
    analyzer="word",
)

CAMPAIGN_NAME_PREFIXES = [
    "Operation", "Wave", "Campaign", "Storm", "Strike",
    "Surge", "Pulse", "Blitz", "Shadow", "Phantom",
]

CAMPAIGN_NAME_SUFFIXES = [
    "Ambani Returns", "SBI Refund", "UPI Phantom", "KBC Winner",
    "Crypto Moon", "Family Emergency", "SEBI Approved",
    "RBI Cashback", "OTP Drain", "WhatsApp Trap",
]


def generate_campaign_name() -> str:
    prefix = random.choice(CAMPAIGN_NAME_PREFIXES)
    suffix = random.choice(CAMPAIGN_NAME_SUFFIXES)
    return f"{prefix} {suffix}"


def calculate_severity(threat_count: int, score: float, states_count: int) -> str:
    weighted = (threat_count * 0.3) + (score * 40) + (states_count * 2)
    if weighted >= 30:
        return "critical"
    elif weighted >= 20:
        return "high"
    elif weighted >= 10:
        return "medium"
    return "low"


async def run_campaign_detection():
    logger.info("Running campaign detection...")

    result = await db.get_threats(page=1, per_page=200, min_confidence=0.5)
    threats = result.get("items", [])

    if len(threats) < 2:
        logger.info("Not enough threats for clustering")
        return

    texts = [t.get("raw_text", "") for t in threats]

    try:
        tfidf_matrix = _vectorizer.fit_transform(texts)
        normalized = normalize(tfidf_matrix)

        dbscan = DBSCAN(eps=0.3, min_samples=2, metric="cosine")
        labels = dbscan.fit_predict(normalized)
    except Exception as e:
        logger.error(f"Clustering error: {e}")
        return

    unique_labels = set(labels)
    unique_labels.discard(-1)

    for label in unique_labels:
        cluster_indices = np.where(labels == label)[0]
        cluster_threats = [threats[i] for i in cluster_indices]

        all_states = []
        all_categories = []
        total_confidence = 0.0

        for t in cluster_threats:
            all_states.extend(t.get("target_states", []))
            all_categories.append(t.get("category", "unknown"))
            total_confidence += t.get("confidence", 0.5)

        dominant_category = max(set(all_categories), key=all_categories.count)
        unique_states = list(set(all_states))
        avg_confidence = total_confidence / len(cluster_threats)
        score = min(avg_confidence + (len(cluster_threats) * 0.02), 0.99)

        summary = await generate_campaign_summary(cluster_threats, "detected campaign")

        campaign_name = generate_campaign_name()
        severity = calculate_severity(len(cluster_threats), score, len(unique_states))

        campaign_data = {
            "name": campaign_name,
            "category": dominant_category,
            "severity": severity,
            "status": "active",
            "target_states": unique_states,
            "threat_count": len(cluster_threats),
            "score": score,
            "summary": summary,
            "alert_fired": False,
            "first_detected": datetime.utcnow().isoformat(),
        }

        saved_campaign = await db.write_campaign(campaign_data)
        if saved_campaign:
            logger.info(f"Campaign created: {campaign_name} ({severity}) — {len(cluster_threats)} threats")
            await check_and_fire_alert(saved_campaign)

    logger.info(f"Campaign detection complete — {len(unique_labels)} campaigns found")
