from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class BundledTaskItem(BaseModel):
    task_id: str
    task_title: str
    department: str  # Civil, Signal & Telecom, Electrical
    severity: str
    priority_score: float
    estimated_duration: int
    asset_id: str

class BundleCandidate(BaseModel):
    bundle_id: str
    corridor_id: str
    section_id: str
    section_name: str
    title: str
    departments: List[str]
    tasks: List[BundledTaskItem]
    tasks_count: int
    total_duration_minutes: int
    individual_duration_sum: int
    downtime_saved_minutes: int
    compatibility_score: float
    bundle_benefit_score: float
    status: str = "Candidate"  # Candidate, Evaluated, Approved, Rejected
    compatible_window: str
    scheduled_start: Optional[str] = None
    scheduled_end: Optional[str] = None
    cost_savings_lakhs: float
    coordination_level: str  # e.g., "Triple Joint (Civil + S&T + TRD)"

class BundleEvaluationResult(BaseModel):
    bundle_id: str
    section_name: str
    departments_coordinated: List[str]
    # Option A: Individual
    option_a_blocks_count: int
    option_a_total_duration: int
    option_a_score: float
    option_a_train_impact: str
    # Option B: Bundled
    option_b_blocks_count: int
    option_b_total_duration: int
    option_b_score: float
    option_b_train_impact: str
    # Evaluation
    better_option: str  # "Option B: Bundled Scheduling"
    efficiency_gain_pct: float
    downtime_saved_hours: float
    ai_recommendation_reason: str

class BundleApprovalResult(BaseModel):
    status: str
    bundle_id: str
    block_id: str
    section_name: str
    departments: List[str]
    scheduled_window: str
    message: str
