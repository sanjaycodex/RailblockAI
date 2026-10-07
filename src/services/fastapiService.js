const FASTAPI_BASE_URL = 'http://127.0.0.1:8000';

export const fastapiService = {
  async getHealth() {
    try {
      const res = await fetch(`${FASTAPI_BASE_URL}/health`, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return {
        status: 'degraded',
        error: e.message,
        risk_model: 'rule_fallback',
        optimizer: 'heuristic_combinatorial',
        database: 'local_fallback'
      };
    }
  },

  async recalculateAllPriorities(corridorId = 'CORR-SR-TEN-MDU') {
    const res = await fetch(`${FASTAPI_BASE_URL}/priority/recalculate-all?corridor_id=${corridorId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`FastAPI Priority Engine failed (HTTP ${res.status})`);
    return await res.json();
  },

  async explainTaskPriority(taskId) {
    const res = await fetch(`${FASTAPI_BASE_URL}/priority/explain/${taskId}`, {
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) throw new Error(`Failed to explain priority for task ${taskId}`);
    return await res.json();
  },

  async runBlockOptimizer(options = {}) {
    const payload = {
      corridor_id: options.corridor_id || 'CORR-SR-TEN-MDU',
      section_id: options.section_id || null,
      planning_horizon_hours: options.planning_horizon_hours || 24,
      objective_weights: options.objective_weights || null
    };

    const res = await fetch(`${FASTAPI_BASE_URL}/optimizer/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) throw new Error(`FastAPI Optimizer Engine error (HTTP ${res.status})`);
    return await res.json();
  },

  async getOptimizationResults() {
    const res = await fetch(`${FASTAPI_BASE_URL}/optimization/results`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) throw new Error(`Failed to fetch optimization results`);
    return await res.json();
  },

  async approveOptimizationRun(runId) {
    const res = await fetch(`${FASTAPI_BASE_URL}/optimizer/approve/${runId}`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Failed to approve optimization plan`);
    return await res.json();
  },

  async generateWeeklyPlan(options = {}) {
    const payload = {
      corridor_id: options.corridor_id || 'CORR-SR-TEN-MDU',
      horizon_days: 7
    };
    const res = await fetch(`${FASTAPI_BASE_URL}/plans/weekly/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`Weekly planner generation failed`);
    return await res.json();
  },

  async getWeeklyPlan(corridorId = 'CORR-SR-TEN-MDU') {
    const res = await fetch(`${FASTAPI_BASE_URL}/plans/weekly?corridor_id=${corridorId}`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Failed to load weekly plan`);
    return await res.json();
  },

  async generateMonthlyPlan(options = {}) {
    const payload = {
      corridor_id: options.corridor_id || 'CORR-SR-TEN-MDU',
      horizon_days: 30
    };
    const res = await fetch(`${FASTAPI_BASE_URL}/plans/monthly/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`Monthly planner generation failed`);
    return await res.json();
  },

  async getMonthlyPlan(corridorId = 'CORR-SR-TEN-MDU') {
    const res = await fetch(`${FASTAPI_BASE_URL}/plans/monthly?corridor_id=${corridorId}`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Failed to load monthly plan`);
    return await res.json();
  },

  async approvePlan(planId) {
    const res = await fetch(`${FASTAPI_BASE_URL}/plans/approve/${planId}`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Failed to approve plan`);
    return await res.json();
  },

  // ---- PHASE 4: REPLANNING & DIGITAL TWIN ----
  async simulateEvent(eventData) {
    const res = await fetch(`${FASTAPI_BASE_URL}/replan/simulate-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Disruption simulation failed (HTTP ${res.status})`);
    return await res.json();
  },

  async generateReplan(eventId, corridorId = 'CORR-SR-TEN-MDU') {
    const res = await fetch(`${FASTAPI_BASE_URL}/replan/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId, corridor_id: corridorId }),
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) throw new Error(`Replan generation failed (HTTP ${res.status})`);
    return await res.json();
  },

  async getAlternatives(eventId) {
    const res = await fetch(`${FASTAPI_BASE_URL}/replan/alternatives/${eventId}`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) throw new Error(`Failed to fetch replan alternatives`);
    return await res.json();
  },

  async acceptReplan(eventId, planIndex = 0) {
    const res = await fetch(`${FASTAPI_BASE_URL}/replan/accept/${eventId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_index: planIndex }),
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Failed to accept replan`);
    return await res.json();
  },

  async rejectReplan(eventId) {
    const res = await fetch(`${FASTAPI_BASE_URL}/replan/reject/${eventId}`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Failed to reject replan`);
    return await res.json();
  },

  async getDigitalTwinCorridorState(corridorId = 'CORR-SR-TEN-MDU') {
    const res = await fetch(`${FASTAPI_BASE_URL}/twin/corridor-state?corridor_id=${corridorId}`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) throw new Error(`Failed to fetch digital twin corridor state`);
    return await res.json();
  },

  // ---- PHASE 5: CROSS-DEPARTMENT SMART BLOCK BUNDLING ----
  async generateSmartBundles(corridorId = 'CORR-SR-TEN-MDU') {
    const res = await fetch(`${FASTAPI_BASE_URL}/bundles/generate?corridor_id=${corridorId}`, {
      method: 'POST',
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) throw new Error(`Smart bundle generation failed (HTTP ${res.status})`);
    return await res.json();
  },

  async getSmartBundles(corridorId = 'CORR-SR-TEN-MDU') {
    const res = await fetch(`${FASTAPI_BASE_URL}/bundles?corridor_id=${corridorId}`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) throw new Error(`Failed to fetch candidate bundles`);
    return await res.json();
  },

  async getBundleDetail(bundleId) {
    const res = await fetch(`${FASTAPI_BASE_URL}/bundles/${bundleId}`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) throw new Error(`Failed to fetch bundle ${bundleId}`);
    return await res.json();
  },

  async evaluateBundleWithOptimizer(bundleId) {
    const res = await fetch(`${FASTAPI_BASE_URL}/bundles/${bundleId}/evaluate`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Optimizer bundle evaluation failed (HTTP ${res.status})`);
    return await res.json();
  },

  async approveBundle(bundleId) {
    const res = await fetch(`${FASTAPI_BASE_URL}/bundles/${bundleId}/approve`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) throw new Error(`Failed to approve bundle ${bundleId}`);
    return await res.json();
  }
};


