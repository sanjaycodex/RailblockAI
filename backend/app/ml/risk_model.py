import numpy as np
from typing import Dict, Any, Tuple
try:
    from sklearn.ensemble import RandomForestRegressor
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

class FailureRiskService:
    def __init__(self):
        self.model = None
        self.model_version = "prototype-rf-v1"
        self._init_model()

    def _init_model(self):
        if not HAS_SKLEARN:
            return

        # Train a lightweight prototype Random Forest model on simulated feature distributions
        # Features: [asset_health(0-100), criticality_num(0-3), severity_num(0-3), urgency_num(0-2), op_impact(0-100)]
        np.random.seed(42)
        X_synth = []
        y_synth = []

        for _ in range(500):
            health = np.random.uniform(50, 100)
            crit = np.random.choice([0, 1, 2, 3])  # Low, Med, High, Crit
            sev = np.random.choice([0, 1, 2, 3])
            urg = np.random.choice([0, 1, 2])     # Planned, Urgent, Immediate
            op_impact = np.random.uniform(20, 100)

            # Domain formula for target risk
            risk = (
                (100.0 - health) * 0.40
                + (crit / 3.0 * 100.0) * 0.25
                + (sev / 3.0 * 100.0) * 0.25
                + (urg / 2.0 * 100.0) * 0.10
            )
            # Add synthetic noise
            risk = np.clip(risk + np.random.normal(0, 3), 5.0, 99.0)

            X_synth.append([health, crit, sev, urg, op_impact])
            y_synth.append(risk)

        try:
            rf = RandomForestRegressor(n_estimators=25, max_depth=6, random_state=42)
            rf.fit(np.array(X_synth), np.array(y_synth))
            self.model = rf
            print("[FailureRiskService] Random Forest ML model initialized successfully.")
        except Exception as e:
            print(f"[FailureRiskService] ML model init warning: {e}")
            self.model = None

    def predict_failure_risk(self, task_data: Dict[str, Any]) -> Tuple[float, str]:
        """
        Predicts failure_risk_score from 0 to 100.
        Returns: (risk_score, prediction_source)
        """
        # If task already has a verified failure_risk, we preserve/bound it
        raw_risk = task_data.get("failure_risk")
        if raw_risk is not None and float(raw_risk) > 0:
            return round(float(raw_risk), 1), "telemetry_logged"

        crit_map = {"low": 0, "medium": 1, "high": 2, "critical": 3}
        sev_map = {"low": 0, "medium": 1, "high": 2, "critical": 3}
        urg_map = {"planned": 0, "urgent": 1, "immediate": 2}

        crit_str = str(task_data.get("asset_criticality", "medium")).lower()
        sev_str = str(task_data.get("severity", "medium")).lower()
        urg_str = str(task_data.get("urgency", "planned")).lower()

        crit_val = crit_map.get(crit_str, 1)
        sev_val = sev_map.get(sev_str, 1)
        urg_val = urg_map.get(urg_str, 0)
        op_impact = float(task_data.get("operational_impact", 50.0))
        health = float(task_data.get("asset_health", 85.0))

        if self.model is not None:
            try:
                features = np.array([[health, crit_val, sev_val, urg_val, op_impact]])
                pred = float(self.model.predict(features)[0])
                return round(np.clip(pred, 10.0, 99.0), 1), "ml_random_forest"
            except Exception as e:
                print(f"[FailureRiskService] ML prediction fallback: {e}")

        # Deterministic Rule Fallback
        score = (
            (100.0 - health) * 0.35
            + (crit_val / 3.0 * 100.0) * 0.30
            + (sev_val / 3.0 * 100.0) * 0.25
            + (urg_val / 2.0 * 100.0) * 0.10
        )
        return round(float(np.clip(score, 15.0, 98.0)), 1), "rule_fallback"

failure_risk_service = FailureRiskService()
