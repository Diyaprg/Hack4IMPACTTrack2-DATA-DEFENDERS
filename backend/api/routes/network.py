from fastapi import APIRouter
from ai.graph_builder import get_full_graph, get_graph_stats

router = APIRouter(prefix="/network", tags=["network"])


@router.get("/graph")
async def get_network_graph():
    return get_full_graph()


@router.get("/stats")
async def get_network_stats():
    return get_graph_stats()
