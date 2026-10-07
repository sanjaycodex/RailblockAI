# 🚀 RailBlockAI - Complete Implementation Guide

## Project Status: 75% Complete ✅

Your project has a **solid foundation**! Here's your step-by-step guide to completion.

---

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Database Setup](#database-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Testing](#testing)
6. [Documentation](#documentation)
7. [Deployment](#deployment)

---

## ⚡ Quick Start

### Prerequisites
```bash
# Check if installed:
node --version   # Should be v18+
python --version # Should be 3.9+
```

### Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

---

## 🗄️ Database Setup

### Step 1: Supabase Tables Creation

Your `.env` already has Supabase credentials! Now create these tables:

#### 1. Go to Supabase Dashboard
- Visit: https://pmvjhnnjftbhnleymzqb.supabase.co
- Navigate to **SQL Editor**

#### 2. Execute This SQL Script:

```sql
-- 1. CORRIDORS TABLE
CREATE TABLE IF NOT EXISTS corridors (
  id TEXT PRIMARY KEY,
  corridor_name TEXT NOT NULL,
  total_distance_km NUMERIC(10,2),
  total_sections INTEGER,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STATIONS TABLE
CREATE TABLE IF NOT EXISTS stations (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id),
  name TEXT NOT NULL,
  station_code TEXT NOT NULL,
  sequence_order INTEGER,
  distance_from_origin NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RAILWAY_SECTIONS TABLE
CREATE TABLE IF NOT EXISTS railway_sections (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id),
  section_name TEXT NOT NULL,
  distance NUMERIC(10,2),
  asset_health_score NUMERIC(5,2) DEFAULT 90.0,
  traffic_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ASSETS TABLE
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  asset_name TEXT NOT NULL,
  section_id TEXT REFERENCES railway_sections(id),
  department TEXT,
  asset_type TEXT,
  asset_health_score NUMERIC(5,2) DEFAULT 90.0,
  last_maintenance_date TIMESTAMPTZ,
  next_maintenance_date TIMESTAMPTZ,
  status TEXT DEFAULT 'Operational',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MAINTENANCE_TASKS TABLE
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id),
  section_id TEXT REFERENCES railway_sections(id),
  asset_id TEXT REFERENCES assets(id),
  task_title TEXT NOT NULL,
  department TEXT NOT NULL,
  severity TEXT DEFAULT 'Medium',
  asset_criticality TEXT,
  urgency TEXT DEFAULT 'Planned',
  operational_impact NUMERIC(5,2) DEFAULT 50.0,
  failure_risk NUMERIC(5,2),
  priority_score NUMERIC(5,2),
  priority_level TEXT,
  estimated_duration INTEGER,
  deadline TIMESTAMPTZ,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TRAIN_MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS train_movements (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id),
  section_id TEXT REFERENCES railway_sections(id),
  train_number TEXT NOT NULL,
  train_name TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  traffic_impact TEXT,
  priority INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AVAILABLE_BLOCK_WINDOWS TABLE
CREATE TABLE IF NOT EXISTS available_block_windows (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id),
  section_id TEXT REFERENCES railway_sections(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  availability_score NUMERIC(5,2) DEFAULT 90.0,
  status TEXT DEFAULT 'Available',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MAINTENANCE_BLOCKS TABLE
CREATE TABLE IF NOT EXISTS maintenance_blocks (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id),
  section_id TEXT REFERENCES railway_sections(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'Proposed',
  optimization_score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MAINTENANCE_BLOCK_TASKS (Junction Table)
CREATE TABLE IF NOT EXISTS maintenance_block_tasks (
  id SERIAL PRIMARY KEY,
  block_id TEXT REFERENCES maintenance_blocks(id),
  task_id TEXT REFERENCES maintenance_tasks(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(block_id, task_id)
);

-- 10. SIMULATION_EVENTS TABLE
CREATE TABLE IF NOT EXISTS simulation_events (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  impact_summary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (Optional but Recommended)
ALTER TABLE corridors ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE railway_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE train_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_block_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_block_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_events ENABLE ROW LEVEL SECURITY;

-- Create Policies for Public Read Access (Adjust for Production)
CREATE POLICY "Enable read access for all users" ON corridors FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON stations FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON railway_sections FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON assets FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON maintenance_tasks FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON train_movements FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON available_block_windows FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON maintenance_blocks FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON maintenance_block_tasks FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON simulation_events FOR SELECT USING (true);

-- Enable Insert/Update/Delete (For Development)
CREATE POLICY "Enable insert for all users" ON maintenance_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON maintenance_tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON maintenance_tasks FOR DELETE USING (true);
```

#### 3. Verify Tables Created
Run this to confirm:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

---

## 🐍 Backend Setup

### Step 1: Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt

# Install optional ML dependencies
pip install scikit-learn numpy ortools
```

### Step 2: Test Backend Server

```bash
# Run from project root
cd backend
python -m app.main
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 3: Test API Endpoints

Open browser: http://127.0.0.1:8000/docs

Test these endpoints:
- ✅ `GET /health` - Health check
- ✅ `POST /api/priority/calculate` - Priority calculation
- ✅ `POST /api/optimizer/run` - Optimization engine
- ✅ `POST /api/bundles/generate` - Smart bundling

---

## ⚛️ Frontend Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Seed Database (First Time Only)

The app will auto-seed localStorage. To seed Supabase:

1. Start the frontend:
```bash
npm run dev
```

2. Open: http://localhost:5173

3. Open browser console (F12) and run:
```javascript
import { api } from './src/services/api.js';
await api.resetAndSeedDatabase();
```

This will populate Supabase with seed data!

### Step 3: Test Frontend Features

Visit these pages:
- 🏠 Dashboard: http://localhost:5173/#/dashboard
- 🎯 AI Priority Engine: http://localhost:5173/#/ai-priority-engine
- ⚡ AI Block Optimizer: http://localhost:5173/#/ai-block-optimizer
- 📦 Smart Block Bundling: http://localhost:5173/#/smart-block-bundling
- 📅 Weekly Planner: http://localhost:5173/#/weekly-planner

---

## 🧪 Testing

### Manual Testing Checklist

#### Backend API Tests:
```bash
# Test Priority Calculation
curl -X POST http://127.0.0.1:8000/api/priority/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TSK-TEST-001",
    "asset_criticality": "Critical",
    "severity": "High",
    "urgency": "Immediate",
    "operational_impact": 90.0
  }'

# Test Optimization
curl -X POST http://127.0.0.1:8000/api/optimizer/run \
  -H "Content-Type: application/json" \
  -d '{
    "corridor_id": "CORR-SR-TEN-MDU",
    "section_id": "ALL"
  }'
```

#### Frontend Tests:
1. ✅ Login/Logout flow
2. ✅ Create new maintenance task
3. ✅ Run optimization
4. ✅ Generate smart bundles
5. ✅ View weekly/monthly plans
6. ✅ Check asset health dashboard

---

## 📚 Documentation

### Update README.md

Replace the generic Vite content with:

```markdown
# 🚂 RailBlockAI - Intelligent Railway Maintenance Orchestration System

AI-powered maintenance planning and optimization for Indian Railways.

## Features
- 🧠 AI Priority Engine with ML failure risk prediction
- ⚡ Multi-objective block optimization using OR-Tools
- 📦 Smart cross-department task bundling
- 📅 Automated weekly & monthly planning
- 🔄 Dynamic replanning for disruptions
- 🎮 What-if simulation engine
- 🗺️ Digital twin visualization

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Supabase Account

### Installation

1. Clone & Install:
\`\`\`bash
npm install
cd backend && pip install -r requirements.txt
\`\`\`

2. Configure Environment:
\`\`\`bash
cp .env.example .env
# Add your Supabase credentials
\`\`\`

3. Setup Database:
- Run SQL script from IMPLEMENTATION_GUIDE.md
- Seed data via frontend console

4. Run Application:
\`\`\`bash
# Terminal 1 - Backend
cd backend && python -m app.main

# Terminal 2 - Frontend
npm run dev
\`\`\`

5. Open: http://localhost:5173

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, React Router
- **Backend**: FastAPI, Python 3.9+
- **Database**: Supabase (PostgreSQL)
- **ML/AI**: scikit-learn, OR-Tools
- **Auth**: Supabase Auth

## API Documentation
Visit: http://127.0.0.1:8000/docs

## License
Smart India Hackathon 2026 Project
\`\`\`

---

## 🚀 Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel:
```bash
npm install -g vercel
vercel
```

#### Deploy Backend to Railway:
1. Create account: https://railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Update CORS origins in backend

### Option 2: Docker (Full Stack)

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    
  frontend:
    build: .
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

---

## 🎯 Final Checklist for SIH Demo

### Must-Have (Critical):
- [x] ✅ Database tables created
- [x] ✅ Backend API running
- [x] ✅ Frontend connecting to backend
- [ ] ⏳ Sample data seeded in Supabase
- [ ] ⏳ All pages loading without errors
- [ ] ⏳ Priority calculation working
- [ ] ⏳ Optimization engine working
- [ ] ⏳ Bundling engine working

### Nice-to-Have:
- [ ] ⏳ Unit tests added
- [ ] ⏳ API documentation complete
- [ ] ⏳ Deployment on cloud
- [ ] ⏳ Performance optimization
- [ ] ⏳ Mobile responsive

---

## 🐛 Troubleshooting

### Issue: Backend won't start
```bash
# Check Python version
python --version

# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

### Issue: Frontend can't connect to backend
```bash
# Check .env file has correct values
cat .env

# Verify backend is running
curl http://127.0.0.1:8000/health
```

### Issue: Supabase connection fails
- Check credentials in `.env`
- Verify tables exist in Supabase dashboard
- Check RLS policies are created

---

## 📞 Need Help?

Check these files:
- `IMPLEMENTATION_GUIDE.md` (this file)
- `backend/app/main.py` - Backend entry point
- `src/services/api.js` - Frontend API layer
- `backend/app/services/supabase_client.py` - Database layer

---

**Last Updated**: August 26, 2026
**Project Status**: Ready for Integration Testing
**Next Milestone**: SIH 2026 Demo Preparation
