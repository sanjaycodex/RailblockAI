from typing import Dict, Any, List
from ..schemas.priority import PriorityResult, ScoreContributions, NormalizedScores, PriorityExplanation
from ..ml.risk_model import failure_risk_service

class PriorityEngine:
    def __init__(self):
        self.w_criticality = 0.35
        self.w_risk = 0.30
        self.w_urgency = 0.20
        self.w_operational = 0.15

    def normalize_criticality(self, val: str) -> float:
        mapping = {
            "critical": 100.0,
            "high": 80.0,
            "medium": 50.0,
            "low": 25.0
        }
        return mapping.get(str(val).lower(), 50.0)

    def normalize_urgency(self, val: str) -> float:
        mapping = {
            "immediate": 100.0,
            "urgent": 75.0,
            "planned": 40.0
        }
        return mapping.get(str(val).lower(), 40.0)

    def calculate_priority(self, task: Dict[str, Any]) -> PriorityResult:
        task_id = task.get("id") or task.get("task_id", "TSK-000")
        
        # 1. Compute/Predict Failure Risk
        risk_score, risk_source = failure_risk_service.predict_failure_risk(task)

        # 2. Normalize components to 0-100
        norm_crit = self.normalize_criticality(task.get("asset_criticality", task.get("severity", "medium")))
        norm_risk = float(risk_score)
        norm_urgency = self.normalize_urgency(task.get("urgency", "planned"))
        norm_op = float(task.get("operational_impact", 50.0))

        # 3. Compute weighted contributions
        c_crit = norm_crit * self.w_criticality
        c_risk = norm_risk * self.w_risk
        c_urg = norm_urgency * self.w_urgency
        c_op = norm_op * self.w_operational

        final_score = round(c_crit + c_risk + c_urg + c_op, 1)

        # 4. Classification
        if final_score >= 85.0:
            level = "P1 Critical"
        elif final_score >= 70.0:
            level = "High"
        elif final_score >= 50.0:
            level = "Medium"
        else:
            level = "Low"

        # 5. Build Explainable Reason
        key_drivers = []
        if norm_crit >= 80.0:
            key_drivers.append(f"High Asset Criticality ({norm_crit}%) on main line")
        if norm_risk >= 80.0:
            key_drivers.append(f"Elevated Failure Risk ({norm_risk}%) predicted by {risk_source}")
        if norm_urgency >= 75.0:
            key_drivers.append(f"Urgent Intervention Requirement ({task.get('urgency', 'Urgent')})")
        if norm_op >= 75.0:
            key_drivers.append(f"High Operational Trunk Impact ({norm_op}%)")

        if not key_drivers:
            key_drivers.append("Standard scheduled maintenance baseline parameters")

        summary_text = (
            f"Priority score {final_score}/100 ({level}) derived from {c_crit:.1f} pts Criticality, "
            f"{c_risk:.1f} pts Failure Risk, {c_urg:.1f} pts Urgency, and {c_op:.1f} pts Operational Impact."
        )

        rec_text = (
            "Allocate immediate night shadow possession slot" if level == "P1 Critical"
            else "Bundle into upcoming weekly maintenance block" if level == "High"
            else "Schedule in routine monthly maintenance possession masterplan"
        )

        explanation = PriorityExplanation(
            summary=summary_text,
            key_drivers=key_drivers,
            risk_source=risk_source,
            recommendation=rec_text
        )

        return PriorityResult(
            task_id=task_id,
            priority_score=final_score,
            priority_level=level,
            predicted_failure_risk=norm_risk,
            prediction_source=risk_source,
            contributions=ScoreContributions(
                asset_criticality_contribution=round(c_crit, 2),
                failure_risk_contribution=round(c_risk, 2),
                maintenance_urgency_contribution=round(c_urg, 2),
                operational_impact_contribution=round(c_op, 2)
            ),
            normalized_scores=NormalizedScores(
                asset_criticality_normalized=norm_crit,
                failure_risk_normalized=norm_risk,
                maintenance_urgency_normalized=norm_urgency,
                operational_impact_normalized=norm_op
            ),
            explanation=explanation
        )

priority_engine = PriorityEngine()
