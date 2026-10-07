import os
from supabase import create_client, Client
from typing import List, Dict, Any, Optional
from ..config.settings import settings

class SupabaseService:
    def __init__(self):
        self.client: Optional[Client] = None
        self._init_client()

    def _init_client(self):
        if settings.SUPABASE_URL and settings.SUPABASE_KEY and not settings.SUPABASE_URL.endswith("your-project-id.supabase.co"):
            try:
                self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                print(f"[SupabaseService] Connected to Supabase at {settings.SUPABASE_URL}")
            except Exception as e:
                print(f"[SupabaseService] Connection warning: {e}")
                self.client = None

    def is_connected(self) -> bool:
        return self.client is not None

    async def get_tasks(self, corridor_id: str = "CORR-SR-TEN-MDU") -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("maintenance_tasks").select("*").eq("corridor_id", corridor_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_tasks error: {e}")
        return self._get_fallback_tasks()

    async def update_task_priority(self, task_id: str, priority_score: float, priority_level: str, failure_risk: float) -> bool:
        if self.client:
            try:
                self.client.table("maintenance_tasks").update({
                    "priority_score": priority_score,
                    "priority_level": priority_level,
                    "failure_risk": failure_risk
                }).eq("id", task_id).execute()
                return True
            except Exception as e:
                print(f"[SupabaseService] update_task_priority error: {e}")
        return False

    async def get_assets(self) -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("assets").select("*").execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_assets error: {e}")
        return []

    async def get_sections(self, corridor_id: str = "CORR-SR-TEN-MDU") -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("railway_sections").select("*").eq("corridor_id", corridor_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_sections error: {e}")
        return self._get_fallback_sections()

    async def get_train_movements(self, corridor_id: str = "CORR-SR-TEN-MDU") -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("train_movements").select("*").eq("corridor_id", corridor_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_train_movements error: {e}")
        return self._get_fallback_trains()

    async def get_available_windows(self, corridor_id: str = "CORR-SR-TEN-MDU") -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("available_block_windows").select("*").eq("corridor_id", corridor_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_available_windows error: {e}")
        return self._get_fallback_windows()

    async def save_approved_block(self, block_data: Dict[str, Any], task_ids: List[str]) -> bool:
        if self.client:
            try:
                self.client.table("maintenance_blocks").upsert(block_data).execute()
                for tid in task_ids:
                    self.client.table("maintenance_block_tasks").upsert({
                        "block_id": block_data["id"],
                        "task_id": tid
                    }).execute()
                    self.client.table("maintenance_tasks").update({"status": "Approved"}).eq("id", tid).execute()
                return True
            except Exception as e:
                print(f"[SupabaseService] save_approved_block error: {e}")
        return False

    # ---- Phase 4: Maintenance Blocks ----
    async def get_maintenance_blocks(self, corridor_id: str = "CORR-SR-TEN-MDU") -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("maintenance_blocks").select("*").eq("corridor_id", corridor_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_maintenance_blocks error: {e}")
        return self._get_fallback_blocks()

    async def get_block_tasks(self, block_id: str) -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("maintenance_block_tasks").select("task_id").eq("block_id", block_id).execute()
                if res.data:
                    task_ids = [r["task_id"] for r in res.data]
                    tasks_res = self.client.table("maintenance_tasks").select("*").in_("id", task_ids).execute()
                    if tasks_res.data:
                        return tasks_res.data
            except Exception as e:
                print(f"[SupabaseService] get_block_tasks error: {e}")
        return []

    async def update_maintenance_block(self, block_id: str, updates: Dict[str, Any]) -> bool:
        if self.client:
            try:
                self.client.table("maintenance_blocks").update(updates).eq("id", block_id).execute()
                return True
            except Exception as e:
                print(f"[SupabaseService] update_maintenance_block error: {e}")
        return False

    # ---- Phase 4: Simulation Events ----
    async def save_simulation_event(self, event: Dict[str, Any]) -> bool:
        if self.client:
            try:
                self.client.table("simulation_events").upsert(event).execute()
                return True
            except Exception as e:
                print(f"[SupabaseService] save_simulation_event error: {e}")
        return False

    async def get_simulation_events(self, corridor_id: str = "CORR-SR-TEN-MDU") -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("simulation_events").select("*").eq("corridor_id", corridor_id).order("created_at", desc=True).execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_simulation_events error: {e}")
        return []

    async def get_simulation_event(self, event_id: str) -> Optional[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("simulation_events").select("*").eq("id", event_id).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                print(f"[SupabaseService] get_simulation_event error: {e}")
        return None

    async def update_simulation_event(self, event_id: str, updates: Dict[str, Any]) -> bool:
        if self.client:
            try:
                self.client.table("simulation_events").update(updates).eq("id", event_id).execute()
                return True
            except Exception as e:
                print(f"[SupabaseService] update_simulation_event error: {e}")
        return False

    # ---- Phase 4: Stations & Assets by section ----
    async def get_stations(self, corridor_id: str = "CORR-SR-TEN-MDU") -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("stations").select("*").eq("corridor_id", corridor_id).order("sequence_order").execute()
                if res.data and len(res.data) > 0:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_stations error: {e}")
        return self._get_fallback_stations()

    async def get_assets_for_section(self, section_id: str) -> List[Dict[str, Any]]:
        if self.client:
            try:
                res = self.client.table("assets").select("*").eq("section_id", section_id).execute()
                if res.data:
                    return res.data
            except Exception as e:
                print(f"[SupabaseService] get_assets_for_section error: {e}")
        return []

    def _get_fallback_blocks(self):
        return [
            {"id": "BLK-OPT-001", "corridor_id": "CORR-SR-TEN-MDU", "section_id": "SEC-MEJ-CVP", "start_time": "2026-08-27T01:30:00Z", "end_time": "2026-08-27T04:30:00Z", "status": "Approved", "optimization_score": 88.5},
            {"id": "BLK-OPT-002", "corridor_id": "CORR-SR-TEN-MDU", "section_id": "SEC-SRT-VPT", "start_time": "2026-08-27T01:00:00Z", "end_time": "2026-08-27T04:00:00Z", "status": "Approved", "optimization_score": 88.5},
            {"id": "BLK-OPT-003", "corridor_id": "CORR-SR-TEN-MDU", "section_id": "SEC-TMQ-MDU", "start_time": "2026-08-28T00:30:00Z", "end_time": "2026-08-28T03:30:00Z", "status": "Approved", "optimization_score": 88.5}
        ]

    def _get_fallback_stations(self):
        return [
            {"id": "STN-TEN", "corridor_id": "CORR-SR-TEN-MDU", "name": "Tirunelveli Junction", "station_code": "TEN", "sequence_order": 1, "distance_from_origin": 0.0},
            {"id": "STN-MEJ", "corridor_id": "CORR-SR-TEN-MDU", "name": "Vanchi Maniyachchi Junction", "station_code": "MEJ", "sequence_order": 2, "distance_from_origin": 28.8},
            {"id": "STN-CVP", "corridor_id": "CORR-SR-TEN-MDU", "name": "Kovilpatti", "station_code": "CVP", "sequence_order": 3, "distance_from_origin": 64.9},
            {"id": "STN-SRT", "corridor_id": "CORR-SR-TEN-MDU", "name": "Satur", "station_code": "SRT", "sequence_order": 4, "distance_from_origin": 86.4},
            {"id": "STN-VPT", "corridor_id": "CORR-SR-TEN-MDU", "name": "Virudhunagar Junction", "station_code": "VPT", "sequence_order": 5, "distance_from_origin": 113.6},
            {"id": "STN-TMQ", "corridor_id": "CORR-SR-TEN-MDU", "name": "Tirumangalam", "station_code": "TMQ", "sequence_order": 6, "distance_from_origin": 139.9},
            {"id": "STN-MDU", "corridor_id": "CORR-SR-TEN-MDU", "name": "Madurai Junction", "station_code": "MDU", "sequence_order": 7, "distance_from_origin": 157.1}
        ]

    def _get_fallback_sections(self):
        return [
            {"id": "SEC-TEN-MEJ", "section_name": "Tirunelveli - Vanchi Maniyachchi (TEN-MEJ)", "distance": 28.8, "asset_health_score": 94.2, "traffic_level": "High"},
            {"id": "SEC-MEJ-CVP", "section_name": "Vanchi Maniyachchi - Kovilpatti (MEJ-CVP)", "distance": 36.1, "asset_health_score": 87.5, "traffic_level": "High"},
            {"id": "SEC-CVP-SRT", "section_name": "Kovilpatti - Satur (CVP-SRT)", "distance": 21.5, "asset_health_score": 89.0, "traffic_level": "Medium"},
            {"id": "SEC-SRT-VPT", "section_name": "Satur - Virudhunagar (SRT-VPT)", "distance": 27.2, "asset_health_score": 79.4, "traffic_level": "Very High"},
            {"id": "SEC-VPT-TMQ", "section_name": "Virudhunagar - Tirumangalam (VPT-TMQ)", "distance": 26.3, "asset_health_score": 93.0, "traffic_level": "High"},
            {"id": "SEC-TMQ-MDU", "section_name": "Tirumangalam - Madurai (TMQ-MDU)", "distance": 17.2, "asset_health_score": 92.0, "traffic_level": "Very High"}
        ]

    def _get_fallback_trains(self):
        return [
            {"id": "TRN-20666", "section_id": "SEC-TEN-MEJ", "train_number": "20666", "train_name": "Tirunelveli - Chennai Egmore Vande Bharat Express", "start_time": "2026-08-26T06:00:00Z", "end_time": "2026-08-26T07:45:00Z", "traffic_impact": "Critical", "priority": 1},
            {"id": "TRN-12694", "section_id": "SEC-SRT-VPT", "train_number": "12694", "train_name": "Pearl City Superfast Express", "start_time": "2026-08-26T20:45:00Z", "end_time": "2026-08-26T22:30:00Z", "traffic_impact": "High", "priority": 2},
            {"id": "TRN-16128", "section_id": "SEC-MEJ-CVP", "train_number": "16128", "train_name": "Guruvayur - Chennai Egmore Express", "start_time": "2026-08-26T09:15:00Z", "end_time": "2026-08-26T11:00:00Z", "traffic_impact": "High", "priority": 2},
            {"id": "TRN-FRT-8821", "section_id": "SEC-SRT-VPT", "train_number": "BCNHL-8821", "train_name": "Tuticorin Port Container Coal Freight", "start_time": "2026-08-26T01:15:00Z", "end_time": "2026-08-26T03:00:00Z", "traffic_impact": "Medium", "priority": 4}
        ]

    def _get_fallback_windows(self):
        return [
            {"id": "WIN-01", "section_id": "SEC-MEJ-CVP", "start_time": "2026-08-27T01:30:00Z", "end_time": "2026-08-27T04:30:00Z", "availability_score": 96.0},
            {"id": "WIN-02", "section_id": "SEC-SRT-VPT", "start_time": "2026-08-27T01:00:00Z", "end_time": "2026-08-27T04:00:00Z", "availability_score": 94.0},
            {"id": "WIN-03", "section_id": "SEC-TMQ-MDU", "start_time": "2026-08-28T00:30:00Z", "end_time": "2026-08-28T03:30:00Z", "availability_score": 92.0},
            {"id": "WIN-04", "section_id": "SEC-TEN-MEJ", "start_time": "2026-08-28T12:30:00Z", "end_time": "2026-08-28T14:30:00Z", "availability_score": 84.0}
        ]

    def _get_fallback_tasks(self):
        return [
            {"id": "TSK-TEN-001", "task_title": "Immediate Removal (IMR) Transverse Rail Flaw at KM 42/14", "department": "Civil", "section_id": "SEC-MEJ-CVP", "asset_id": "AST-MEJ-TRK-02", "severity": "Critical", "asset_criticality": "Critical", "urgency": "Immediate", "operational_impact": 92.0, "failure_risk": 98.0, "estimated_duration": 120, "deadline": "2026-08-27T06:00:00Z", "status": "Pending"},
            {"id": "TSK-TEN-002", "task_title": "Rail Profile Grinding & Gauge Corner Restoration (Curve KM 98.2)", "department": "Civil", "section_id": "SEC-SRT-VPT", "asset_id": "AST-SRT-TRK-04", "severity": "Critical", "asset_criticality": "Critical", "urgency": "Urgent", "operational_impact": 88.0, "failure_risk": 91.0, "estimated_duration": 180, "deadline": "2026-08-28T12:00:00Z", "status": "Pending"},
            {"id": "TSK-TEN-003", "task_title": "Recondition Worn Crossing Nose on Diamond 108 (Virudhunagar South)", "department": "Civil", "section_id": "SEC-SRT-VPT", "asset_id": "AST-SRT-SWT-02", "severity": "High", "asset_criticality": "Critical", "urgency": "Urgent", "operational_impact": 85.0, "failure_risk": 86.0, "estimated_duration": 150, "deadline": "2026-08-29T10:00:00Z", "status": "Pending"},
            {"id": "TSK-TEN-004", "task_title": "Point Machine 104B Stalling Motor Current Spike Inspection & Overhaul", "department": "Signal & Telecom", "section_id": "SEC-CVP-SRT", "asset_id": "AST-CVP-SIG-03", "severity": "High", "asset_criticality": "High", "urgency": "Urgent", "operational_impact": 82.0, "failure_risk": 84.0, "estimated_duration": 90, "deadline": "2026-08-28T08:00:00Z", "status": "Pending"},
            {"id": "TSK-TEN-005", "task_title": "Scissors Crossover Point 201A Tongue Rail Replacement & Tamping", "department": "Civil", "section_id": "SEC-TMQ-MDU", "asset_id": "AST-TMQ-TRK-06", "severity": "High", "asset_criticality": "Critical", "urgency": "Urgent", "operational_impact": 89.0, "failure_risk": 82.0, "estimated_duration": 180, "deadline": "2026-08-30T18:00:00Z", "status": "Pending"},
            {"id": "TSK-TEN-006", "task_title": "Replace Loose Catenary Droppers & Adjust Stagger (Masts SRT/102-108)", "department": "Electrical", "section_id": "SEC-SRT-VPT", "asset_id": "AST-SRT-OHE-04", "severity": "Medium", "asset_criticality": "High", "urgency": "Planned", "operational_impact": 64.0, "failure_risk": 68.0, "estimated_duration": 150, "deadline": "2026-09-02T12:00:00Z", "status": "Pending"},
            {"id": "TSK-TEN-007", "task_title": "Maniyachchi Point 102A Slide Chair Lubrication & Clearance Check", "department": "Civil", "section_id": "SEC-TEN-MEJ", "asset_id": "AST-TEN-SWT-01", "severity": "Medium", "asset_criticality": "High", "urgency": "Planned", "operational_impact": 60.0, "failure_risk": 65.0, "estimated_duration": 60, "deadline": "2026-09-01T12:00:00Z", "status": "Pending"},
            {"id": "TSK-TEN-008", "task_title": "Deep Ballast Screening (BCM) & Sleeper Realignment KM 48-52", "department": "Civil", "section_id": "SEC-MEJ-CVP", "asset_id": "AST-MEJ-SLP-01", "severity": "Medium", "asset_criticality": "Medium", "urgency": "Planned", "operational_impact": 74.0, "failure_risk": 71.0, "estimated_duration": 210, "deadline": "2026-09-05T18:00:00Z", "status": "Pending"},
            {"id": "TSK-TEN-009", "task_title": "Neutral Section Feeder Mast 76/12 Insulator Cleaning & Megger Testing", "department": "Electrical", "section_id": "SEC-CVP-SRT", "asset_id": "AST-CVP-OHE-03", "severity": "Low", "asset_criticality": "High", "urgency": "Planned", "operational_impact": 40.0, "failure_risk": 42.0, "estimated_duration": 90, "deadline": "2026-09-10T12:00:00Z", "status": "Pending"}
        ]

supabase_service = SupabaseService()
