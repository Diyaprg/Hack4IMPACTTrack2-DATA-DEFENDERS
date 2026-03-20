import httpx
import asyncio
from core.config import settings
from loguru import logger
from typing import Tuple


async def send_bank_alerts(campaign: dict, payload: dict) -> Tuple[list, dict]:
    bank_webhooks = settings.bank_webhooks
    results = {}
    banks_notified = []

    async def post_to_bank(bank_name: str, url: str):
        for attempt in range(settings.ALERT_RETRY_ATTEMPTS):
            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    response = await client.post(url, json={
                        "bank": bank_name,
                        "alert_type": "fraud_campaign",
                        "campaign": campaign.get("name"),
                        "severity": campaign.get("severity"),
                        "payload": payload,
                    })
                    if response.status_code in (200, 201, 202):
                        logger.info(f"Alert delivered to {bank_name}")
                        results[bank_name] = True
                        banks_notified.append(bank_name)
                        return
                    else:
                        logger.warning(f"{bank_name} returned {response.status_code}")
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed for {bank_name}: {e}")
                await asyncio.sleep(settings.ALERT_RETRY_DELAY * (attempt + 1))
        results[bank_name] = False

    await asyncio.gather(*[
        post_to_bank(name, url)
        for name, url in bank_webhooks.items()
    ])

    return banks_notified, results
