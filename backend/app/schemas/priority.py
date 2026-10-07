from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class TaskPriorityRequest(BaseModel):
    task_id: str
    asset_id: Optional[str] = None
    department: Optional[str] = "Civil"
    severity: Optional[str] = "Medium"
    asset_criticality: Optional[str] = "Medium"
    urgency: Optional[str] = "Planned"
    operational_impact: Optional[float] = 50.0
    failure_risk: Optional[float] = None
    estimated_duration: Optional[int] = 120
    deadline: Optional[str] = None

class ScoreContributions(BaseModel):
    asset_criticality_contribution: float
    failure_risk_contribution: float
    maintenance_urgency_contribution: float
    operational_impact_contribution: float

class NormalizedScores(BaseModel):
    asset_criticality_normalized: float
    failure_risk_normalized: float
    maintenance_urgency_normalized: float
    operational_impact_normalized: float

class PriorityExplanation(BaseModel):
    summary: str
    key_drivers: List[str]
    risk_source: str
    recommendation: str

class PriorityResult(BaseModel):
    task_id: str
    priority_score: float
    priority_level: str
    predicted_failure_risk: float
    prediction_source: str
    contributions: ScoreContributions
    normalized_scores: NormalizedScores
    explanation: PriorityExplanation

class RecalculateAllResponse(BaseModel):
    total_processed: int
    successfully_processed: int
    failed: int
    updated_tasks: List[PriorityResult]
    summary: Dict[str, Any]
