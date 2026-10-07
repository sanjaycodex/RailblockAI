from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from .optimizer import RecommendedBlock

class PlanGenerationRequest(BaseModel):
    corridor_id: Optional[str] = "CORR-SR-TEN-MDU"
    start_date: Optional[str] = None
    horizon_days: Optional[int] = 7

class PlanBlockSummary(BaseModel):
    id: str
    day_index: int
    day_name: str
    date_str: str
    time_window: str
    section_id: str
    section_name: str
    title: str
    department: str
    machine_required: str
    priority_level: str
    status: str
    tasks_count: int
    tasks: List[Dict[str, Any]]

class PlanKPIs(BaseModel):
    total_blocks: int
    total_tasks_scheduled: int
    critical_tasks_covered: int
    estimated_utilization_pct: float
    predicted_operational_impact: str
    estimated_downtime_saved_hours: float
    conflicts_avoided_count: int

class PlanningResult(BaseModel):
    plan_id: str
    plan_type: str  # "weekly" or "monthly"
    corridor_id: str
    horizon_days: int
    created_at: str
    status: str  # "Draft", "Approved"
    summary_kpis: PlanKPIs
    blocks: List[PlanBlockSummary]
    optimizer_engine: str
