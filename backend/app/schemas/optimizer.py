from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class OptimizationRequest(BaseModel):
    corridor_id: Optional[str] = "CORR-SR-TEN-MDU"
    section_id: Optional[str] = None
    planning_date: Optional[str] = None
    planning_horizon_hours: Optional[int] = 24
    objective_weights: Optional[Dict[str, float]] = None

class ScheduledTaskAssignment(BaseModel):
    task_id: str
    task_title: str
    department: str
    severity: str
    priority_score: float
    estimated_duration: int
    scheduled_start: str
    scheduled_end: str
    asset_id: str
    section_id: str

class RecommendedBlock(BaseModel):
    id: str
    corridor_id: str
    section_id: str
    section_name: str
    start_time: str
    end_time: str
    duration_minutes: int
    status: str = "Proposed"
    score: float
    reasoning: str
    trains_avoided: List[str]
    tasks: List[ScheduledTaskAssignment]

class UnscheduledTask(BaseModel):
    task_id: str
    task_title: str
    department: str
    priority_score: float
    reason: str

class OptimizationSummary(BaseModel):
    total_candidate_tasks: int
    scheduled_tasks_count: int
    critical_tasks_scheduled: int
    total_blocks_count: int
    optimization_score: float
    predicted_operational_impact: str
    estimated_asset_availability_gain: str
    train_conflicts_prevented: int
    unscheduled_count: int

class OptimizationResult(BaseModel):
    optimization_run_id: str
    created_at: str
    optimizer_engine: str  # "or_tools" or "heuristic_fallback"
    summary: OptimizationSummary
    recommended_blocks: List[RecommendedBlock]
    unscheduled_tasks: List[UnscheduledTask]
    reasoning: str
