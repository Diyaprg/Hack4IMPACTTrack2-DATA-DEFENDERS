from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from loguru import logger

scheduler = AsyncIOScheduler()


def start_scheduler():
    from ai.campaign_detector import run_campaign_detection
    from ai.graph_builder import persist_graph
    from ingestion.osint_scraper import scrape_osint_sources

    scheduler.add_job(
        run_campaign_detection,
        trigger=IntervalTrigger(minutes=10),
        id="campaign_detection",
        name="Campaign Detection",
        replace_existing=True,
    )

    scheduler.add_job(
        persist_graph,
        trigger=IntervalTrigger(minutes=5),
        id="graph_persist",
        name="Graph Persistence",
        replace_existing=True,
    )

    scheduler.add_job(
        scrape_osint_sources,
        trigger=IntervalTrigger(minutes=15),
        id="osint_scrape",
        name="OSINT Scraper",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("Scheduler started — campaign detection every 10min, graph persist every 5min, OSINT every 15min")


def stop_scheduler():
    scheduler.shutdown()
    logger.info("Scheduler stopped")
