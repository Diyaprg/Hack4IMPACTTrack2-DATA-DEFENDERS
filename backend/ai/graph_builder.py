import networkx as nx
from typing import Optional
from loguru import logger
from core.database import db
import asyncio

_graph: nx.DiGraph = nx.DiGraph()
_entity_metadata: dict = {}


def add_entities(entities: dict, message_id: str, campaign_id: Optional[str] = None):
    global _graph, _entity_metadata

    all_entities = []

    for phone in entities.get("phones", []):
        node_id = f"phone:{phone}"
        all_entities.append(node_id)
        _graph.add_node(node_id, type="phone", value=phone)
        _entity_metadata[node_id] = {
            "type": "phone", "value": phone, "message_id": message_id
        }

    for upi in entities.get("upi_ids", []):
        node_id = f"upi:{upi}"
        all_entities.append(node_id)
        _graph.add_node(node_id, type="upi", value=upi)
        _entity_metadata[node_id] = {
            "type": "upi", "value": upi, "message_id": message_id
        }

    for handle in entities.get("telegram_handles", []):
        node_id = f"telegram:{handle}"
        all_entities.append(node_id)
        _graph.add_node(node_id, type="telegram", value=handle)
        _entity_metadata[node_id] = {
            "type": "telegram", "value": handle, "message_id": message_id
        }

    if campaign_id:
        campaign_node = f"campaign:{campaign_id}"
        _graph.add_node(campaign_node, type="campaign")
        for entity in all_entities:
            _graph.add_edge(entity, campaign_node, weight=1.0, source=message_id)

    for i, entity_a in enumerate(all_entities):
        for entity_b in all_entities[i + 1:]:
            if _graph.has_edge(entity_a, entity_b):
                _graph[entity_a][entity_b]["weight"] += 0.5
            else:
                _graph.add_edge(entity_a, entity_b, weight=1.0, source=message_id)


def check_entity(value: str) -> dict:
    for node_id in _graph.nodes():
        node_data = _graph.nodes[node_id]
        if node_data.get("value") == value:
            neighbors = list(_graph.neighbors(node_id))
            campaigns = [n.replace("campaign:", "") for n in neighbors if n.startswith("campaign:")]
            other_entities = [n for n in neighbors if not n.startswith("campaign:")]

            try:
                centrality = nx.degree_centrality(_graph).get(node_id, 0.0)
            except Exception:
                centrality = 0.0

            fraud_probability = min(0.3 + (len(campaigns) * 0.25) + (centrality * 0.5), 0.99)

            return {
                "found": True,
                "node_id": node_id,
                "fraud_probability": round(fraud_probability, 4),
                "connected_campaigns": campaigns,
                "connected_entities": other_entities[:10],
                "centrality_score": round(centrality, 4),
                "degree": _graph.degree(node_id),
            }

    return {
        "found": False,
        "fraud_probability": 0.03,
        "connected_campaigns": [],
        "connected_entities": [],
        "centrality_score": 0.0,
        "degree": 0,
    }


def get_full_graph() -> dict:
    nodes = []
    for node_id, data in _graph.nodes(data=True):
        try:
            centrality = nx.degree_centrality(_graph).get(node_id, 0)
        except Exception:
            centrality = 0

        nodes.append({
            "id": node_id,
            "type": data.get("type", "unknown"),
            "value": data.get("value", node_id),
            "degree": _graph.degree(node_id),
            "centrality": round(centrality, 4),
        })

    edges = []
    for u, v, data in _graph.edges(data=True):
        edges.append({
            "source": u,
            "target": v,
            "weight": data.get("weight", 1.0),
        })

    return {
        "nodes": nodes,
        "edges": edges,
        "total_nodes": len(nodes),
        "total_edges": len(edges),
    }


def get_subgraph_for_campaign(campaign_id: str) -> dict:
    campaign_node = f"campaign:{campaign_id}"
    if campaign_node not in _graph:
        return {"nodes": [], "edges": []}

    neighbors = list(_graph.predecessors(campaign_node))
    subgraph_nodes = [campaign_node] + neighbors
    sub = _graph.subgraph(subgraph_nodes)

    nodes = [{"id": n, "type": _graph.nodes[n].get("type", "unknown"), "value": _graph.nodes[n].get("value", n)} for n in sub.nodes()]
    edges = [{"source": u, "target": v} for u, v in sub.edges()]
    return {"nodes": nodes, "edges": edges}


async def persist_graph():
    graph_data = get_full_graph()
    await db.save_graph(graph_data)
    logger.info(f"Graph persisted: {graph_data['total_nodes']} nodes, {graph_data['total_edges']} edges")


async def load_graph_from_db():
    global _graph
    saved = await db.load_graph()
    if saved:
        for node in saved.get("nodes", []):
            _graph.add_node(node["id"], type=node.get("type"), value=node.get("value"))
        for edge in saved.get("edges", []):
            _graph.add_edge(edge["source"], edge["target"], weight=edge.get("weight", 1.0))
        logger.info(f"Graph loaded from DB: {_graph.number_of_nodes()} nodes")
    else:
        logger.info("No saved graph found — starting fresh")


def get_graph_stats() -> dict:
    return {
        "total_nodes": _graph.number_of_nodes(),
        "total_edges": _graph.number_of_edges(),
        "phone_nodes": sum(1 for _, d in _graph.nodes(data=True) if d.get("type") == "phone"),
        "upi_nodes": sum(1 for _, d in _graph.nodes(data=True) if d.get("type") == "upi"),
        "telegram_nodes": sum(1 for _, d in _graph.nodes(data=True) if d.get("type") == "telegram"),
        "campaign_nodes": sum(1 for _, d in _graph.nodes(data=True) if d.get("type") == "campaign"),
    }
