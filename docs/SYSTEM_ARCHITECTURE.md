# 🏗️ RailBlockAI - System Architecture

**Comprehensive Technical Architecture Documentation**

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React 19 + Tailwind CSS)                    │
│                                                                 │
│  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐           │
│  │Dashboard│ │Priority  │ │Optimizer│ │Bundling  │  + 10 more │
│  │  Page   │ │  Engine  │ │  Page   │ │  Page    │    pages   │
│  └─────────┘ └──────────┘ └─────────┘ └──────────┘           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API SERVICE LAYER                          │
│                   (src/services/api.js)                         │
│                                                                 │
│  • HTTP Client                                                  │
│  • Request/Response handling                                    │
│  • Supabase Client integration                                  │
│  • LocalStorage fallback                                        │
└──────────────────┬───────────────────┬──────────────────────────┘
                   │                   │
                   ▼                   ▼
┌──────────────────────────┐  ┌────────────────────────────────┐
│   BACKEND API SERVER     │  │     SUPABASE DATABASE          │
│   (FastAPI + Python)     │  │     (PostgreSQL + Auth)        │
│                          │  │                                │
│  ┌────────────────────┐ │  │  ┌──────────────────────────┐ │
│  │  API Routers       │ │  │  │  10 Tables:              │ │
│  │  • /health         │ │  │  │  • corridors             │ │
│  │  • /api/priority   │ │  │  │  • stations              │ │
│  │  • /api/optimizer  │ │  │  │  • railway_sections      │ │
│  │  • /api/bundles    │ │  │  │  • assets                │ │
│  │  • /api/plans      │ │  │  │  • maintenance_tasks     │ │
│  │  • /api/replan     │ │  │  │  • train_movements       │ │
│  └────────────────────┘ │  │  │  • available_windows     │ │
│                          │  │  │  • maintenance_blocks    │ │
│  ┌────────────────────┐ │  │  │  • block_tasks (junction)│ │
│  │  Core Engines      │ │  │  │  • simulation_events     │ │
│  │  • Priority Engine │ │  │  └──────────────────────────┘ │
│  │  • ML Risk Model   │ │  │                                │
│  │  • Optimizer       │ │  │  Row Level Security (RLS)      │
│  │  • Bundling        │ │  │  Real-time Subscriptions       │
│  │  • Planning        │ │  │  Automatic Backups            │
│  │  • Replanning      │ │  └────────────────────────────────┘
│  └────────────────────┘ │
│                          │
│  ┌────────────────────┐ │
│  │  External AI/ML    │ │
│  │  • scikit-learn    │ │
│  │  • OR-Tools        │ │
│  │  • NumPy           │ │
│  └────────────────────┘ │
└──────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Priority Calculation Flow

```
User Action (Frontend)
      │
      ▼
[Select Task from Table]
      │
      ▼
[Click "Calculate Priority"]
      │
      ▼
[API Request: POST /api/priority/calculate]
      │
      ▼
Backend: Priority Engine
      │
      ├─→ Extract task features
      │   (criticality, severity, urgency, impact)
      │
      ├─→ ML Risk Model
      │   (Random Forest prediction)
      │
      ├─→ Calculate weighted score
      │   Score = (0.35×C + 0.30×R + 0.20×U + 0.15×I)
      │
      └─→ Generate explanation
          (key drivers, reasoning)
      │
      ▼
[API Response: PriorityResult]
      │
      ▼
Frontend: Display Results
      │
      ├─→ Show priority score (0-100)
      ├─→ Show priority level (P1/High/Med/Low)
      ├─→ Show explanation text
      └─→ Highlight key drivers
```

### 2. Optimization Flow

```
User Action
      │
      ▼
[Select Corridor & Section]
      │
      ▼
[Click "Run Optimization"]
      │
      ▼
[API Request: POST /api/optimizer/run]
      │
      ▼
Backend: Optimizer Engine
      │
      ├─→ Fetch tasks from Supabase
      ├─→ Fetch sections from Supabase
      ├─→ Fetch train movements
      ├─→ Fetch available windows
      │
      ├─→ Calculate priority for all tasks
      │   (using Priority Engine)
      │
      ├─→ Sort tasks by priority
      │
      ├─→ OR-Tools CP-SAT Solver
      │   • Assign tasks to windows
      │   • Avoid train conflicts
      │   • Maximize utilization
      │   • Balance department loads
      │
      └─→ Generate recommended blocks
          + Calculate optimization score
          + Identify unscheduled tasks
          + Count conflicts prevented
      │
      ▼
[API Response: OptimizationResult]
      │
      ▼
Frontend: Display Results
      │
      ├─→ Show optimization score
      ├─→ List recommended blocks
      ├─→ Show task assignments
      ├─→ Display unscheduled tasks
      └─→ Highlight conflicts avoided
```

### 3. Smart Bundling Flow

```
User Action
      │
      ▼
[Navigate to Bundling Page]
      │
      ▼
[Click "Generate Smart Bundles"]
      │
      ▼
[API Request: POST /api/bundles/generate]
      │
      ▼
Backend: Bundling Service
      │
      ├─→ Fetch all pending tasks
      ├─→ Group by section
      │
      ├─→ For each section:
      │   │
      │   ├─→ Generate task combinations
      │   │   (2-4 tasks per bundle)
      │   │
      │   ├─→ Calculate compatibility score
      │   │   • Location match (25%)
      │   │   • Time window fit (20%)
      │   │   • Duration feasibility (15%)
      │   │   • Deadline alignment (15%)
      │   │   • Safety compatibility (15%)
      │   │   • Cross-dept bonus (10%)
      │   │
      │   ├─→ Filter by threshold (>75%)
      │   │
      │   └─→ Calculate benefits
      │       • Downtime saved
      │       • Cost savings (₹2.8L per mobilization)
      │       • Coordination level
      │
      ├─→ Rank by benefit score
      │
      └─→ Return top 5 bundles
      │
      ▼
[API Response: BundleCandidate[]]
      │
      ▼
Frontend: Display Bundles
      │
      ├─→ Show bundle cards
      ├─→ Display compatibility scores
      ├─→ Show cost savings
      └─→ Enable evaluation/approval
```

---

## 🧠 Core Algorithms

### Priority Scoring Algorithm

```python
def calculate_priority(task):
    # 1. Normalize inputs to 0-100 scale
    criticality = normalize_criticality(task.asset_criticality)
    risk = ml_model.predict_failure_risk(task)
    urgency = normalize_urgency(task.urgency)
    operational = task.operational_impact
    
    # 2. Apply weighted scoring
    score = (
        criticality * 0.35 +
        risk * 0.30 +
        urgency * 0.20 +
        operational * 0.15
    )
    
    # 3. Classify priority level
    if score >= 85:
        level = "P1 Critical"
    elif score >= 70:
        level = "High"
    elif score >= 50:
        level = "Medium"
    else:
        level = "Low"
    
    # 4. Generate explanation
    explanation = generate_explanation(
        criticality, risk, urgency, operational
    )
    
    return {
        "score": score,
        "level": level,
        "explanation": explanation
    }
```

### ML Risk Prediction

```python
# Random Forest Model
class FailureRiskService:
    def __init__(self):
        # Train on 500 synthetic scenarios
        X_train = [
            [health, crit, sev, urg, op_impact]
            for _ in range(500)
        ]
        y_train = [calculated_risk for _ in range(500)]
        
        self.model = RandomForestRegressor(
            n_estimators=25,
            max_depth=6
        )
        self.model.fit(X_train, y_train)
    
    def predict(self, task):
        features = [
            task.asset_health,
            task.criticality_encoded,
            task.severity_encoded,
            task.urgency_encoded,
            task.operational_impact
        ]
        risk = self.model.predict([features])[0]
        return clip(risk, 10, 99)
```

### Optimization Algorithm (OR-Tools)

```python
def optimize_schedule(tasks, windows, trains):
    model = cp_model.CpModel()
    
    # Variables: task_assigned[t, w] = 1 if task t in window w
    task_assigned = {}
    for t in tasks:
        for w in windows:
            task_assigned[t, w] = model.NewBoolVar(f'task_{t}_window_{w}')
    
    # Constraint 1: Each task assigned to at most one window
    for t in tasks:
        model.Add(sum(task_assigned[t, w] for w in windows) <= 1)
    
    # Constraint 2: Window capacity not exceeded
    for w in windows:
        model.Add(
            sum(task_assigned[t, w] * task_duration[t] for t in tasks)
            <= window_duration[w]
        )
    
    # Constraint 3: No train conflicts
    for w in windows:
        for train in trains:
            if overlaps(window_time[w], train_time[train]):
                model.Add(
                    sum(task_assigned[t, w] for t in tasks_on_section[train.section])
                    == 0
                )
    
    # Objective: Maximize high-priority tasks scheduled
    model.Maximize(
        sum(
            task_assigned[t, w] * task_priority[t]
            for t in tasks
            for w in windows
        )
    )
    
    # Solve
    solver = cp_model.CpSolver()
    status = solver.Solve(model)
    
    return extract_solution(solver, task_assigned)
```

### Bundle Compatibility Scoring

```python
def calculate_compatibility(tasks):
    # Location match (same section = 100%)
    location_score = 100.0 if same_section(tasks) else 0.0
    
    # Time window fit (can all fit in one window?)
    max_duration = max(t.duration for t in tasks)
    concurrent_duration = max_duration + 30  # 30 min buffer
    total_duration = sum(t.duration for t in tasks)
    time_score = 95.0 if concurrent_duration <= 210 else 70.0
    
    # Duration feasibility
    duration_score = 90.0 if total_duration <= 300 else 70.0
    
    # Deadline alignment (all within 7 days?)
    deadline_score = 92.0 if deadlines_compatible(tasks) else 60.0
    
    # Safety (departments can work concurrently?)
    safety_score = 94.0  # Civil + TRD + S&T safe together
    
    # Cross-department bonus
    num_depts = len(set(t.department for t in tasks))
    dept_score = {1: 50, 2: 80, 3: 100}[num_depts]
    
    # Weighted average
    compatibility = (
        location_score * 0.25 +
        time_score * 0.20 +
        duration_score * 0.15 +
        deadline_score * 0.15 +
        safety_score * 0.15 +
        dept_score * 0.10
    )
    
    return compatibility
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
corridors (1) ──────────────┐
    │                       │
    │ (1:N)                 │ (1:N)
    │                       │
    ▼                       ▼
stations              railway_sections (1) ────┐
                           │                   │
                           │ (1:N)             │ (1:N)
                           │                   │
                           ▼                   ▼
                      assets              train_movements
                           │
                           │ (1:N)
                           │
                           ▼
                   maintenance_tasks ───────┐
                           │                │
                           │                │ (N:M via junction)
                           │                │
                           │                ▼
                           │       maintenance_block_tasks
                           │                │
                           │                │
                           ▼                ▼
                   available_block_windows  maintenance_blocks
                                                   │
                                                   │
                                                   ▼
                                           simulation_events
```

### Key Tables

#### maintenance_tasks
```sql
- id (PK)
- corridor_id (FK)
- section_id (FK)
- asset_id (FK)
- task_title
- department (Civil/S&T/Electrical)
- severity (Critical/High/Medium/Low)
- priority_score (0-100)
- priority_level (P1/High/Medium/Low)
- estimated_duration (minutes)
- status (Pending/Approved/Completed)
```

#### maintenance_blocks
```sql
- id (PK)
- corridor_id (FK)
- section_id (FK)
- start_time
- end_time
- status (Proposed/Approved/Completed)
- optimization_score (0-100)
```

#### maintenance_block_tasks (Junction)
```sql
- id (PK)
- block_id (FK)
- task_id (FK)
- (unique constraint on block_id + task_id)
```

---

## 🔐 Security Architecture

### Authentication Flow

```
User Login
    │
    ▼
[Enter Credentials]
    │
    ▼
Supabase Auth
    │
    ├─→ Verify credentials
    ├─→ Generate JWT token
    └─→ Return user session
    │
    ▼
Store in AuthContext
    │
    ├─→ localStorage (token)
    └─→ React Context (user info)
    │
    ▼
Protected Routes
    │
    ├─→ Check authentication
    ├─→ Redirect if not logged in
    └─→ Allow access if authenticated
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;

-- Read policy (allow all for development)
CREATE POLICY "Enable read access for all users"
ON maintenance_tasks FOR SELECT
USING (true);

-- Write policy (allow all for development)
CREATE POLICY "Enable write access for all users"
ON maintenance_tasks FOR INSERT
WITH CHECK (true);

-- For production, replace with:
-- USING (auth.uid() = created_by)
-- WITH CHECK (auth.uid() = created_by)
```

---

## 📊 Performance Optimizations

### Database Indexes

```sql
-- Fast lookups by section
CREATE INDEX idx_tasks_section ON maintenance_tasks(section_id);

-- Fast lookups by priority
CREATE INDEX idx_tasks_priority ON maintenance_tasks(priority_score DESC);

-- Fast lookups by status
CREATE INDEX idx_tasks_status ON maintenance_tasks(status);

-- Fast time-based queries
CREATE INDEX idx_blocks_time ON maintenance_blocks(start_time, end_time);
```

### API Caching Strategy

```javascript
// Frontend caching
const cache = {
  tasks: { data: null, timestamp: null, ttl: 60000 }, // 1 min
  sections: { data: null, timestamp: null, ttl: 300000 }, // 5 min
};

async function getCachedTasks() {
  const now = Date.now();
  if (cache.tasks.data && (now - cache.tasks.timestamp) < cache.tasks.ttl) {
    return cache.tasks.data; // Return cached
  }
  
  const data = await api.getTasks(); // Fetch fresh
  cache.tasks = { data, timestamp: now };
  return data;
}
```

### Backend Optimization

```python
# Connection pooling
from supabase import create_client

client = create_client(url, key)  # Reuse connection

# Batch queries
tasks = await client.table("maintenance_tasks").select("*").execute()
sections = await client.table("railway_sections").select("*").execute()
# vs making separate queries for each task

# Lazy loading
def get_task_details(task_id):
    # Only fetch when needed, not all at once
    return client.table("maintenance_tasks").select("*").eq("id", task_id).single()
```

---

## 🚀 Deployment Architecture

### Production Deployment (Recommended)

```
┌─────────────────────────────────────────────┐
│         Vercel (Frontend)                   │
│         https://railblock.vercel.app        │
│                                             │
│  • React build artifacts                    │
│  • CDN edge caching                         │
│  • Automatic HTTPS                          │
│  • GitHub auto-deploy                       │
└──────────────┬──────────────────────────────┘
               │
               │ HTTPS/REST
               │
               ▼
┌─────────────────────────────────────────────┐
│         Railway.app (Backend)               │
│         https://railblock-api.railway.app   │
│                                             │
│  • Python FastAPI container                 │
│  • Auto-scaling                             │
│  • Health checks                            │
│  • GitHub auto-deploy                       │
└──────────────┬──────────────────────────────┘
               │
               │ PostgreSQL
               │
               ▼
┌─────────────────────────────────────────────┐
│         Supabase (Database)                 │
│         https://pmvjhnnjftbhnleymzqb.       │
│         supabase.co                         │
│                                             │
│  • Managed PostgreSQL                       │
│  • Automatic backups                        │
│  • Real-time subscriptions                  │
│  • Row Level Security                       │
└─────────────────────────────────────────────┘
```

### Docker Deployment (Alternative)

```
docker-compose.yml
    │
    ├─→ Backend Service
    │   • Build from backend/Dockerfile
    │   • Expose port 8000
    │   • Environment variables from .env
    │
    └─→ Frontend Service
        • Build from Dockerfile
        • Expose port 5173
        • Depends on backend
        • Environment variables from .env
```

---

## 🔄 CI/CD Pipeline (Future)

```
GitHub Push
    │
    ▼
[GitHub Actions Trigger]
    │
    ├─→ Backend Pipeline
    │   │
    │   ├─→ Checkout code
    │   ├─→ Setup Python
    │   ├─→ Install dependencies
    │   ├─→ Run linter (flake8)
    │   ├─→ Run unit tests
    │   ├─→ Build Docker image
    │   └─→ Deploy to Railway.app
    │
    └─→ Frontend Pipeline
        │
        ├─→ Checkout code
        ├─→ Setup Node.js
        ├─→ Install dependencies
        ├─→ Run linter (oxlint)
        ├─→ Run build (vite build)
        ├─→ Run tests (vitest)
        └─→ Deploy to Vercel
```

---

## 📈 Monitoring & Logging (Future)

### Application Monitoring

```
┌─────────────────────────────────────────┐
│         Sentry (Error Tracking)         │
│  • Frontend errors                      │
│  • Backend exceptions                   │
│  • Performance monitoring               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         LogRocket (Session Replay)      │
│  • User session recordings              │
│  • Console logs                         │
│  • Network requests                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Supabase Logs                   │
│  • Database queries                     │
│  • Authentication events                │
│  • API usage stats                      │
└─────────────────────────────────────────┘
```

---

## 🎯 Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    │
    ├─→ Backend Instance 1 ─┐
    ├─→ Backend Instance 2 ─┤
    └─→ Backend Instance 3 ─┤
                            │
                            ▼
                    Shared Database
                    (Supabase)
```

### Caching Strategy

```
User Request
    │
    ▼
[Check Redis Cache]
    │
    ├─→ Cache Hit → Return cached data
    │
    └─→ Cache Miss
        │
        ▼
    [Query Database]
        │
        ▼
    [Store in Redis]
        │
        ▼
    [Return data]
```

---

## 🔍 System Health Checks

### Health Check Endpoints

```
GET /health
→ Returns: { "status": "healthy", "timestamp": "..." }

GET /health/database
→ Returns: { "status": "connected", "latency_ms": 45 }

GET /health/services
→ Returns: {
    "ml_model": "loaded",
    "or_tools": "available",
    "supabase": "connected"
}
```

---

**This architecture is designed for:**
- ✅ Scalability (can handle growing data)
- ✅ Maintainability (clean separation of concerns)
- ✅ Reliability (fallback mechanisms)
- ✅ Security (RLS, auth, input validation)
- ✅ Performance (caching, indexes, optimization)

---

**Last Updated**: August 26, 2026  
**Architecture Version**: 1.0  
**Status**: Production-Ready Design ✅
