from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..schemas.optimizer import OptimizationRequest, OptimizationResult
from ..optimization.optimizer_engine import optimizer_engine
from ..services.supabase_client import supabase_service

router = APIRouter(tags=["Block Optimization Engine"])

@router.post("/optimizer/run", response_model=OptimizationResult)
async def run_block_optimizer(request: OptimizationRequest):
    try:
        result = await optimizer_engine.run_optimization(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Block optimization failed: {str(e)}")

@router.get("/optimization/results", response_model=List[OptimizationResult])
async def get_optimization_results():
    if not optimizer_engine.runs_history:
        # Run default optimization to populate initial result
        default_req = OptimizationRequest()
        await optimizer_engine.run_optimization(default_req)
    return optimizer_engine.runs_history[:10]

@router.post("/optimizer/approve/{run_id}")
async def approve_optimization_run(run_id: str):
    matching = [r for r in optimizer_engine.runs_history if r.optimization_run_id == run_id]
    if not matching:
        raise HTTPException(status_code=404, detail="Optimization run not found")
    
    run = matching[0]
    saved_blocks = 0
    for block in run.recommended_blocks:
        block_dict = {
            "id": block.id,
            "corridor_id": block.corridor_id,
            "section_id": block.section_id,
            "start_time": block.start_time,
            "end_time": block.end_time,
            "status": "Approved",
            "optimization_score": block.score
        }
        task_ids = [t.task_id for t in block.tasks]
        success = await supabase_service.save_approved_block(block_dict, task_ids)
        if success:
            saved_blocks += 1

    return {
        "status": "success",
        "optimization_run_id": run_id,
        "message": f"Successfully approved and persisted {len(run.recommended_blocks)} maintenance blocks to Supabase.",
        "approved_blocks_count": len(run.recommended_blocks)
    }
