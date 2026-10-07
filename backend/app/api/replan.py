from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ..schemas.replan import (
    SimulateEventRequest, ConflictResult, ReplanResult,
    ReplanGenerateRequest, AcceptReplanRequest
)
from ..replan.replan_engine import replan_engine
from ..services.supabase_client import supabase_service

router = APIRouter(tags=["Dynamic Replanning & Simulation"])

@router.post("/replan/simulate-event", response_model=ConflictResult)
async def simulate_event(request: SimulateEventRequest):
    """Simulate a disruption event and detect conflicts with approved blocks."""
    try:
        event_id, conflict_result = await replan_engine.simulate_event(request)
        return conflict_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Event simulation failed: {str(e)}")

@router.post("/replan/generate", response_model=ReplanResult)
async def generate_replan(request: ReplanGenerateRequest):
    """Generate alternative plans using the Phase 3 optimizer."""
    try:
        result = await replan_engine.generate_replan(
            event_id=request.event_id,
            corridor_id=request.corridor_id or "CORR-SR-TEN-MDU"
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Replan generation failed: {str(e)}")

@router.get("/replan/alternatives/{event_id}")
async def get_alternatives(event_id: str):
    """Get cached alternatives for an event."""
    replan = replan_engine.cached_replans.get(event_id)
    if not replan:
        raise HTTPException(status_code=404, detail="No replan found for this event. Run /replan/generate first.")
    return replan

@router.get("/replan/status/{event_id}")
async def get_replan_status(event_id: str):
    """Check the status of a simulation event."""
    event = await supabase_service.get_simulation_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    cached = event_id in replan_engine.cached_replans
    return {
        "event_id": event_id,
        "status": event.get("status", "Unknown"),
        "event_type": event.get("event_type"),
        "section_id": event.get("section_id"),
        "has_cached_replan": cached,
        "alternatives_count": len(replan_engine.cached_replans[event_id].alternatives) if cached else 0
    }

@router.post("/replan/accept/{event_id}")
async def accept_replan(event_id: str, request: AcceptReplanRequest = None):
    """Accept a replanned schedule and update Supabase."""
    plan_index = request.plan_index if request else 0
    try:
        result = await replan_engine.accept_replan(event_id, plan_index)
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Accept replan failed: {str(e)}")

@router.post("/replan/reject/{event_id}")
async def reject_replan(event_id: str):
    """Reject the replan and keep the original schedule."""
    try:
        result = await replan_engine.reject_replan(event_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reject replan failed: {str(e)}")

@router.get("/replan/events")
async def list_simulation_events(corridor_id: str = "CORR-SR-TEN-MDU"):
    """List all simulation events for the corridor."""
    events = await supabase_service.get_simulation_events(corridor_id)
    return {"events": events, "total": len(events)}

# ---- Digital Twin Data Endpoint ----
@router.get("/twin/corridor-state")
async def get_corridor_state(corridor_id: str = "CORR-SR-TEN-MDU"):
    """Get full corridor state for the Digital Twin visualization."""
    try:
        sections = await supabase_service.get_sections(corridor_id)
        stations = await supabase_service.get_stations(corridor_id)
        tasks = await supabase_service.get_tasks(corridor_id)
        trains = await supabase_service.get_train_movements(corridor_id)
        blocks = await supabase_service.get_maintenance_blocks(corridor_id)
        windows = await supabase_service.get_available_windows(corridor_id)

        section_states = []
        for sec in sections:
            sid = sec["id"]
            sec_tasks = [t for t in tasks if t.get("section_id") == sid]
            sec_blocks = [b for b in blocks if b.get("section_id") == sid]
            sec_trains = [t for t in trains if t.get("section_id") == sid]
            sec_windows = [w for w in windows if w.get("section_id") == sid]

            critical_tasks = [t for t in sec_tasks if t.get("severity") == "Critical" or t.get("priority_level") == "P1 Critical"]
            active_blocks = [b for b in sec_blocks if b.get("status") in ("Active",)]
            scheduled_blocks = [b for b in sec_blocks if b.get("status") in ("Approved", "Proposed")]

            # Determine section color state
            if active_blocks:
                color_state = "RED"
            elif scheduled_blocks:
                color_state = "BLUE"
            elif critical_tasks:
                health = float(sec.get("asset_health_score", 90))
                color_state = "ORANGE" if health < 85 else "YELLOW"
            elif float(sec.get("asset_health_score", 90)) < 85:
                color_state = "YELLOW"
            else:
                color_state = "GREEN"

            section_states.append({
                "section": sec,
                "color_state": color_state,
                "open_tasks": len(sec_tasks),
                "critical_tasks": len(critical_tasks),
                "high_risk_assets": len([t for t in sec_tasks if float(t.get("failure_risk", 0)) > 80]),
                "scheduled_blocks": len(scheduled_blocks),
                "active_blocks": len(active_blocks),
                "available_windows": len(sec_windows),
                "trains_active": len(sec_trains),
                "blocks": sec_blocks,
                "tasks": sec_tasks[:5],
                "windows": sec_windows
            })

        return {
            "corridor_id": corridor_id,
            "stations": stations,
            "sections": section_states,
            "total_tasks": len(tasks),
            "total_blocks": len(blocks),
            "total_trains": len(trains)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Corridor state error: {str(e)}")
