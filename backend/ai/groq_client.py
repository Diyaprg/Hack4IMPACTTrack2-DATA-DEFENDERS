from groq import Groq
from core.config import settings
from loguru import logger
from typing import Optional
import json

_groq = None


def get_groq_client() -> Optional[Groq]:
    global _groq
    if _groq is None and settings.GROQ_API_KEY:
        _groq = Groq(api_key=settings.GROQ_API_KEY)
    return _groq


async def classify_with_groq(text: str) -> dict:
    client = get_groq_client()
    if not client:
        return {"category": "unknown", "confidence": 0.5, "reasoning": "Groq not configured"}

    prompt = f"""You are a cybersecurity AI for India. Classify this message as a financial scam type.

Message: {text[:800]}

Respond ONLY with valid JSON in this exact format:
{{"category": "investment_scam|voice_clone|fake_upi_refund|phishing|mule_recruitment|deepfake_celebrity|lottery_scam|unknown", "confidence": 0.0-1.0, "reasoning": "one sentence explanation", "target_states": ["state1", "state2"]}}"""

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=200,
        )
        raw = response.choices[0].message.content.strip()
        return json.loads(raw)
    except json.JSONDecodeError:
        logger.warning("Groq returned non-JSON response")
        return {"category": "unknown", "confidence": 0.5, "reasoning": "Parse error"}
    except Exception as e:
        logger.error(f"Groq classify error: {e}")
        return {"category": "unknown", "confidence": 0.5, "reasoning": str(e)}


async def generate_campaign_summary(threats: list, campaign_name: str) -> str:
    client = get_groq_client()
    if not client:
        return f"Coordinated fraud campaign '{campaign_name}' detected with {len(threats)} threat messages."

    sample_texts = [t.get("raw_text", "")[:200] for t in threats[:5]]
    combined = "\n---\n".join(sample_texts)

    prompt = f"""You are a cybersecurity analyst for India. 
A fraud campaign named '{campaign_name}' has been detected with {len(threats)} threat messages.

Sample messages:
{combined}

Write a 2-sentence professional threat intelligence summary of this campaign.
Focus on: what type of scam, who is targeted, what the threat actors are doing.
Be specific and factual. No fluff."""

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=150,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Groq summary error: {e}")
        return f"Coordinated fraud campaign targeting Indian UPI users. {len(threats)} threat messages detected."


async def generate_alert_payload_summary(campaign: dict, entities: list) -> str:
    client = get_groq_client()
    if not client:
        return f"High-severity fraud campaign detected. Immediate action required."

    prompt = f"""Write a 3-sentence actionable alert for Indian banks about this fraud campaign.
Campaign: {campaign.get('name')} | Type: {campaign.get('category')} | Severity: {campaign.get('severity')}
Entities involved: {len(entities)} phone numbers/UPI IDs identified
Include: what to block, what to watch for, urgency level."""

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=120,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Groq alert summary error: {e}")
        return "High-severity coordinated fraud campaign detected. Block listed entities immediately."
