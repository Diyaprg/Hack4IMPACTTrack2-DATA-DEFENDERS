from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from loguru import logger
import asyncio

from core.config import settings
from core.database import db
from core.scheduler import start_scheduler, stop_scheduler
from api.middleware import setup_middleware
from api.routes import threats, campaigns, alerts, verify, network, stats
from ai.classifier import load_classifier
from ai.deepfake_detector import load_deepfake_model
from ai.graph_builder import load_graph_from_db
from ingestion.telegram_scraper import start_telegram_listener, stop_telegram_listener


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 50)
    logger.info(f"  {settings.APP_NAME} — Starting up")
    logger.info("=" * 50)

    db.authenticate()
    logger.info("Database connected")

    load_classifier()
    logger.info("NLP classifier loaded")

    load_deepfake_model()
    logger.info("Deepfake detector loaded")

    await load_graph_from_db()
    logger.info("Operator network graph loaded")

    start_scheduler()
    logger.info("Scheduler started")

    asyncio.create_task(start_telegram_listener())
    logger.info("Telegram listener started")

    logger.info(f"SurakshAI ready on port {settings.APP_PORT}")
    logger.info("=" * 50)

    yield

    logger.info("Shutting down SurakshAI...")
    stop_scheduler()
    await stop_telegram_listener()
    logger.info("Shutdown complete")


app = FastAPI(
    title="SurakshAI",
    description="Autonomous Cyber Threat Intelligence Platform for India's UPI Ecosystem",
    version="1.0.0",
    lifespan=lifespan,
)

setup_middleware(app)

app.include_router(threats.router)
app.include_router(campaigns.router)
app.include_router(alerts.router)
app.include_router(verify.router)
app.include_router(network.router)
app.include_router(stats.router)


@app.get("/")
async def health():
    return {
        "status": "operational",
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "message": "India's cyber defence layer is active",
    }


@app.post("/ingest/manual")
async def manual_ingest(request: Request):
    body = await request.json()
    from ingestion.pipeline import process
    result = await process(
        raw_text=body.get("text", ""),
        source=body.get("source", "manual"),
        channel_name=body.get("channel", "manual_injection"),
    )
    return result


@app.post("/trigger/test")
async def trigger_test_campaign():
    from ingestion.osint_scraper import inject_demo_threat
    from ai.campaign_detector import run_campaign_detection
    result = await inject_demo_threat()
    await run_campaign_detection()
    return {"status": "triggered", "threat": result}


@app.post("/mock/bank/{bank_name}")
async def mock_bank_webhook(bank_name: str, request: Request):
    payload = await request.json()
    logger.info(f"MOCK BANK ALERT RECEIVED — {bank_name.upper()}: {payload.get('campaign', 'unknown')}")
    return {"status": "received", "bank": bank_name, "acknowledged": True}


@app.post("/mock/certin")
async def mock_certin_webhook(request: Request):
    payload = await request.json()
    logger.info(f"MOCK CERT-In REPORT RECEIVED: {payload.get('campaign', 'unknown')}")
    return {"status": "received", "certin": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.APP_PORT,
        reload=settings.APP_ENV == "development",
        log_level="info",
    )
