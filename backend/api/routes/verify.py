from fastapi import APIRouter, HTTPException
from models.verify import VerifyRequest, VerifyResponse, VerifyType, NetworkPosition
from ai.graph_builder import check_entity, get_graph_stats
from ai.deepfake_detector import analyze as analyze_video
from loguru import logger

router = APIRouter(prefix="/verify", tags=["verify"])


@router.post("", response_model=VerifyResponse)
async def verify(request: VerifyRequest):
    try:
        if request.type == VerifyType.VIDEO:
            result = await analyze_video(request.value)
            return VerifyResponse(
                input=request.value,
                type="video",
                is_fraud=result["is_fraud"],
                fraud_probability=result["fraud_probability"],
                confidence=result["confidence"],
                reason=result["reason"],
                recommendation=result["recommendation"],
                checked_against=result.get("frames_analyzed", 0),
            )

        graph_result = check_entity(request.value)
        stats = get_graph_stats()
        fraud_prob = graph_result["fraud_probability"]

        if graph_result["found"]:
            campaigns = graph_result["connected_campaigns"]
            reason = (
                f"This {request.type} is directly linked to {len(campaigns)} known fraud "
                f"campaign(s) in our threat database. It has {graph_result['degree']} "
                f"connections to other suspicious entities in the operator network."
            ) if campaigns else (
                f"This {request.type} appears in our threat database with connections "
                f"to suspicious entities."
            )

            network_pos = NetworkPosition(
                connected_campaigns=campaigns,
                connected_entities=graph_result["connected_entities"],
                centrality_score=graph_result["centrality_score"],
            )
        else:
            reason = (
                f"This {request.type} was not found in our database of "
                f"{stats['total_nodes']} known threat entities. "
                f"No connections to active fraud campaigns detected."
            )
            network_pos = None

        confidence_label = (
            "high" if abs(fraud_prob - 0.5) > 0.35
            else "medium" if abs(fraud_prob - 0.5) > 0.15
            else "low"
        )

        recommendation = (
            "Do not transfer money. Block this contact. Report to cybercrime.gov.in"
            if fraud_prob > 0.5
            else "No immediate action required. Stay cautious with unsolicited contacts."
        )

        return VerifyResponse(
            input=request.value,
            type=request.type,
            is_fraud=fraud_prob > 0.5,
            fraud_probability=fraud_prob,
            confidence=confidence_label,
            reason=reason,
            network_position=network_pos,
            recommendation=recommendation,
            checked_against=stats["total_nodes"],
        )

    except Exception as e:
        logger.error(f"Verify error: {e}")
        raise HTTPException(status_code=500, detail="Verification failed")
