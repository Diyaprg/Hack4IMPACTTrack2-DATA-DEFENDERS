import httpx
from ingestion.pipeline import process
from loguru import logger

OSINT_SOURCES = [
    {
        "name": "cybercrime_india",
        "url": "https://cybercrime.gov.in",
        "enabled": False,
    },
]

DEMO_THREAT_TEXTS = [
    "URGENT: Dear customer, your SBI account will be blocked. Call 9876543210 immediately. Send OTP to verify. Link: http://sbi-verify.in",
    "Earn 40% monthly returns! Exclusive WhatsApp investment group. Limited seats. Pay via UPI: profit@ybl Contact @investguru99",
    "Hi beta, it's your uncle. I had an accident. Need ₹50,000 immediately. Transfer to 8765432109@paytm. Don't tell anyone.",
    "CONGRATULATIONS! You won KBC lottery ₹25 lakh. Send your Aadhaar and account details to claim. Contact 7654321098",
    "Part time job work from home. Earn ₹500 per UPI transaction. Need your bank account. Telegram: @earnhomejobs",
    "Nirmala Sitharaman announces new government investment scheme. 60% guaranteed returns. Register: bit.ly/govtscheme2026",
    "Your UPI transaction of ₹15,000 failed. Refund processing. Share OTP received on mobile to complete refund. helpdesk@npci-refund.com",
    "SEBI approved crypto trading platform. Celebrity endorsed. Invest ₹10,000 get ₹1,00,000 in 30 days. @cryptoindiaofficial",
]


async def scrape_osint_sources():
    logger.info("Running OSINT scrape cycle")

    for source in OSINT_SOURCES:
        if not source.get("enabled"):
            continue
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(source["url"])
                if response.status_code == 200:
                    await process(
                        raw_text=response.text[:1000],
                        source="osint",
                        channel_name=source["name"],
                    )
        except Exception as e:
            logger.warning(f"OSINT scrape failed for {source['name']}: {e}")

    logger.info("OSINT scrape cycle complete")


async def inject_demo_threat(text: str = None):
    import random
    threat_text = text or random.choice(DEMO_THREAT_TEXTS)
    result = await process(
        raw_text=threat_text,
        source="telegram",
        channel_name="demo_injection",
    )
    logger.info(f"Demo threat injected: {result}")
    return result
