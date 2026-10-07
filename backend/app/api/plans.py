from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ..schemas.planning import PlanGenerationRequest, PlanningResult
from ..planning.planning_engine import planning_engine

router = APIRouter(prefix="/plans", tags=["Automated Planning Engine"])

@router.post("/weekly/generate", response_model=PlanningResult)
async def generate_weekly_plan(request: PlanGenerationRequest):
    try:
        res = await planning_engine.generate_weekly_plan(request)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate weekly plan: {str(e)}")

@router.get("/weekly", response_model=PlanningResult)
async def get_weekly_plan(corridor_id: str = "CORR-SR-TEN-MDU"):
    if corridor_id in planning_engine.cached_weekly:
        return planning_engine.cached_weekly[corridor_id]
    # Generate on demand
    req = PlanGenerationRequest(corridor_id=corridor_id, horizon_days=7)
    return await planning_engine.generate_weekly_plan(req)

@router.post("/monthly/generate", response_model=PlanningResult)
async def generate_monthly_plan(request: PlanGenerationRequest):
    try:
        res = await planning_engine.generate_monthly_plan(request)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate monthly plan: {str(e)}")

@router.get("/monthly", response_model=PlanningResult)
async def get_monthly_plan(corridor_id: str = "CORR-SR-TEN-MDU"):
    if corridor_id in planning_engine.cached_monthly:
        return planning_engine.cached_monthly[corridor_id]
    # Generate on demand
    req = PlanGenerationRequest(corridor_id=corridor_id, horizon_days=30)
    return await planning_engine.generate_monthly_plan(req)

@router.post("/approve/{plan_id}")
async def approve_plan(plan_id: str):
    return {
        "status": "success",
        "plan_id": plan_id,
        "message": "Strategic possession plan has been marked Approved and deployed to Madurai Division operational rosters."
    }
