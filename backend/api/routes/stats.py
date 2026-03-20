from fastapi import APIRouter
from core.database import db
from ai.graph_builder import get_graph_stats

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("")
async def get_stats():
    db_stats = await db.get_stats()
    graph_stats = get_graph_stats()
    return {
        **db_stats,
        "graph": graph_stats,
        "threat_level": _compute_threat_level(
            db_stats.get("active_campaigns", 0),
            db_stats.get("total_threats", 0),
        ),
    }


def _compute_threat_level(active_campaigns: int, total_threats: int) -> str:
    if active_campaigns >= 5 or total_threats >= 100:
        return "critical"
    elif active_campaigns >= 3 or total_threats >= 50:
        return "high"
    elif active_campaigns >= 1 or total_threats >= 10:
        return "elevated"
    return "normal"
