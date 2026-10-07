from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class SimulateEventRequest(BaseModel):
    event_type: str  # TRAIN_DELAY, EMERGENCY_MAINTENANCE, BLOCK_WINDOW_UNAVAILABLE, MAINTENANCE_DURATION_INCREASE, TRAFFIC_INCREASE
    corridor_id: Optional[str] = "CORR-SR-TEN-MDU"
    section_id: str
    description: Optional[str] = None
    severity: Optional[str] = "High"
    affected_block_id: Optional[str] = None
    affected_train_id: Optional[str] = None
    delay_minutes: Optional[int] = None
    duration_increase_minutes: Optional[int] = None
    traffic_increase_pct: Optional[float] = None

class AffectedBlock(BaseModel):
    block_id: str
    section_id: str
    section_name: str
    original_start: str
    original_end: str
    conflict_reason: str
    tasks: List[Dict[str, Any]]

class ConflictResult(BaseModel):
    event_id: str
    event_type: str
    conflicts_detected: int
    affected_blocks: List[AffectedBlock]
    affected_tasks_count: int
    severity: str
    reasoning: str

class AlternativePlan(BaseModel):
    plan_index: int
    label: str
    section_id: str
    section_name: str
    start_time: str
    end_time: str
    duration_minutes: int
    tasks: List[Dict[str, Any]]
    optimization_score: float
    operational_impact: str
    deadline_risk: str
    changed_tasks_count: int
    changed_blocks_count: int
    explanation: str

class ReplanResult(BaseModel):
    event_id: str
    original_plan_id: Optional[str] = None
    event_type: str
    affected_blocks: List[AffectedBlock]
    affected_tasks_count: int
    alternatives: List[AlternativePlan]
    recommended_index: int
    explanation: str
    optimizer_engine: str
    generated_at: str
    feasible: bool = True

class ReplanGenerateRequest(BaseModel):
    event_id: str
    corridor_id: Optional[str] = "CORR-SR-TEN-MDU"

class AcceptReplanRequest(BaseModel):
    plan_index: Optional[int] = 0
