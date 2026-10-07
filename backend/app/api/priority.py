from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from ..schemas.priority import TaskPriorityRequest, PriorityResult, RecalculateAllResponse
from ..priority.priority_engine import priority_engine
from ..services.supabase_client import supabase_service

router = APIRouter(prefix="/priority", tags=["Hybrid AI Priority Engine"])

@router.post("/calculate", response_model=PriorityResult)
async def calculate_task_priority(task: TaskPriorityRequest):
    try:
        result = priority_engine.calculate_priority(task.model_dump())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Priority computation error: {str(e)}")

@router.post("/recalculate-all", response_model=RecalculateAllResponse)
async def recalculate_all_tasks(corridor_id: str = "CORR-SR-TEN-MDU"):
    try:
        tasks = await supabase_service.get_tasks(corridor_id)
        updated_tasks: List[PriorityResult] = []
        success_count = 0
        failed_count = 0

        for t in tasks:
            try:
                res = priority_engine.calculate_priority(t)
                updated_tasks.append(res)
                
                # Persist updated scores back to Supabase
                await supabase_service.update_task_priority(
                    task_id=res.task_id,
                    priority_score=res.priority_score,
                    priority_level=res.priority_level,
                    failure_risk=res.predicted_failure_risk
                )
                success_count += 1
            except Exception as item_err:
                print(f"[RecalculateAll] Error processing task {t.get('id')}: {item_err}")
                failed_count += 1

        summary = {
            "corridor": corridor_id,
            "critical_count": len([r for r in updated_tasks if r.priority_level == "P1 Critical"]),
            "high_count": len([r for r in updated_tasks if r.priority_level == "High"]),
            "medium_count": len([r for r in updated_tasks if r.priority_level == "Medium"]),
            "low_count": len([r for r in updated_tasks if r.priority_level == "Low"]),
            "avg_priority_score": round(sum(r.priority_score for r in updated_tasks) / max(len(updated_tasks), 1), 1)
        }

        return RecalculateAllResponse(
            total_processed=len(tasks),
            successfully_processed=success_count,
            failed=failed_count,
            updated_tasks=updated_tasks,
            summary=summary
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch priority recalculation error: {str(e)}")

@router.get("/explain/{task_id}", response_model=PriorityResult)
async def explain_task_priority(task_id: str):
    tasks = await supabase_service.get_tasks()
    matching = [t for t in tasks if t.get("id") == task_id or t.get("task_id") == task_id]
    
    if not matching:
        # Generate on-demand fallback explanation
        fallback_task = {"id": task_id, "task_title": f"Maintenance Task {task_id}", "severity": "High", "urgency": "Urgent"}
        return priority_engine.calculate_priority(fallback_task)

    return priority_engine.calculate_priority(matching[0])
