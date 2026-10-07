from fastapi import APIRouter
from ..services.supabase_client import supabase_service
from ..ml.risk_model import HAS_SKLEARN
from ..optimization.optimizer_engine import HAS_ORTOOLS

router = APIRouter(tags=["Health & Status"])

@router.get("/health")
async def health_check():
    db_connected = supabase_service.is_connected()
    return {
        "status": "ok",
        "service": "RailBlockAI Hybrid Intelligence Service",
        "version": "1.0.0",
        "corridor": "Tirunelveli - Madurai Mainline (TEN-MDU)",
        "database": "connected" if db_connected else "local_fallback_active",
        "risk_model": "sklearn_random_forest" if HAS_SKLEARN else "rule_fallback",
        "optimizer": "or_tools" if HAS_ORTOOLS else "heuristic_combinatorial",
        "timestamp": "2026-08-25T21:26:00Z"
    }
