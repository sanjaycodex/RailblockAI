-- ============================================
-- RailBlockAI Database Schema
-- Supabase PostgreSQL Setup Script
-- ============================================
-- Execute this script in Supabase SQL Editor
-- https://pmvjhnnjftbhnleymzqb.supabase.co
-- ============================================

-- 1. CORRIDORS TABLE
-- Stores railway corridor information
CREATE TABLE IF NOT EXISTS corridors (
  id TEXT PRIMARY KEY,
  corridor_name TEXT NOT NULL,
  total_distance_km NUMERIC(10,2),
  total_sections INTEGER,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE corridors IS 'Railway corridor master data';

-- 2. STATIONS TABLE
-- Stores station information along the corridor
CREATE TABLE IF NOT EXISTS stations (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  station_code TEXT NOT NULL,
  sequence_order INTEGER,
  distance_from_origin NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stations_corridor ON stations(corridor_id);
CREATE INDEX IF NOT EXISTS idx_stations_sequence ON stations(sequence_order);

COMMENT ON TABLE stations IS 'Railway stations along each corridor';

-- 3. RAILWAY_SECTIONS TABLE
-- Stores section-wise information
CREATE TABLE IF NOT EXISTS railway_sections (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  distance NUMERIC(10,2),
  asset_health_score NUMERIC(5,2) DEFAULT 90.0 CHECK (asset_health_score >= 0 AND asset_health_score <= 100),
  traffic_level TEXT CHECK (traffic_level IN ('Low', 'Medium', 'High', 'Very High')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sections_corridor ON railway_sections(corridor_id);
CREATE INDEX IF NOT EXISTS idx_sections_health ON railway_sections(asset_health_score);

COMMENT ON TABLE railway_sections IS 'Railway sections between stations';

-- 4. ASSETS TABLE
-- Stores railway asset information
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  asset_name TEXT NOT NULL,
  section_id TEXT REFERENCES railway_sections(id) ON DELETE CASCADE,
  department TEXT CHECK (department IN ('Civil', 'Signal & Telecom', 'Electrical', 'Mechanical')),
  asset_type TEXT,
  asset_health_score NUMERIC(5,2) DEFAULT 90.0 CHECK (asset_health_score >= 0 AND asset_health_score <= 100),
  last_maintenance_date TIMESTAMPTZ,
  next_maintenance_date TIMESTAMPTZ,
  status TEXT DEFAULT 'Operational' CHECK (status IN ('Operational', 'Under Maintenance', 'Critical', 'Failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_section ON assets(section_id);
CREATE INDEX IF NOT EXISTS idx_assets_department ON assets(department);
CREATE INDEX IF NOT EXISTS idx_assets_health ON assets(asset_health_score);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);

COMMENT ON TABLE assets IS 'Railway infrastructure assets';

-- 5. MAINTENANCE_TASKS TABLE
-- Stores maintenance task information
CREATE TABLE IF NOT EXISTS maintenance_tasks (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id) ON DELETE CASCADE,
  section_id TEXT REFERENCES railway_sections(id) ON DELETE CASCADE,
  asset_id TEXT REFERENCES assets(id) ON DELETE CASCADE,
  task_title TEXT NOT NULL,
  department TEXT NOT NULL CHECK (department IN ('Civil', 'Signal & Telecom', 'Electrical', 'Mechanical')),
  severity TEXT DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  asset_criticality TEXT CHECK (asset_criticality IN ('Low', 'Medium', 'High', 'Critical')),
  urgency TEXT DEFAULT 'Planned' CHECK (urgency IN ('Planned', 'Urgent', 'Immediate')),
  operational_impact NUMERIC(5,2) DEFAULT 50.0 CHECK (operational_impact >= 0 AND operational_impact <= 100),
  failure_risk NUMERIC(5,2) CHECK (failure_risk >= 0 AND failure_risk <= 100),
  priority_score NUMERIC(5,2) CHECK (priority_score >= 0 AND priority_score <= 100),
  priority_level TEXT CHECK (priority_level IN ('Low', 'Medium', 'High', 'P1 Critical')),
  estimated_duration INTEGER, -- in minutes
  deadline TIMESTAMPTZ,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'In Progress', 'Completed', 'Cancelled', 'AI-Optimized')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_corridor ON maintenance_tasks(corridor_id);
CREATE INDEX IF NOT EXISTS idx_tasks_section ON maintenance_tasks(section_id);
CREATE INDEX IF NOT EXISTS idx_tasks_department ON maintenance_tasks(department);
CREATE INDEX IF NOT EXISTS idx_tasks_severity ON maintenance_tasks(severity);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON maintenance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON maintenance_tasks(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON maintenance_tasks(deadline);

COMMENT ON TABLE maintenance_tasks IS 'Maintenance tasks and work orders';

-- 6. TRAIN_MOVEMENTS TABLE
-- Stores train schedule information
CREATE TABLE IF NOT EXISTS train_movements (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id) ON DELETE CASCADE,
  section_id TEXT REFERENCES railway_sections(id) ON DELETE CASCADE,
  train_number TEXT NOT NULL,
  train_name TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  traffic_impact TEXT CHECK (traffic_impact IN ('Low', 'Medium', 'High', 'Critical')),
  priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trains_corridor ON train_movements(corridor_id);
CREATE INDEX IF NOT EXISTS idx_trains_section ON train_movements(section_id);
CREATE INDEX IF NOT EXISTS idx_trains_time ON train_movements(start_time, end_time);

COMMENT ON TABLE train_movements IS 'Train movement schedules';

-- 7. AVAILABLE_BLOCK_WINDOWS TABLE
-- Stores available maintenance windows
CREATE TABLE IF NOT EXISTS available_block_windows (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id) ON DELETE CASCADE,
  section_id TEXT REFERENCES railway_sections(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  availability_score NUMERIC(5,2) DEFAULT 90.0 CHECK (availability_score >= 0 AND availability_score <= 100),
  status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'Occupied', 'Expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_window CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_windows_corridor ON available_block_windows(corridor_id);
CREATE INDEX IF NOT EXISTS idx_windows_section ON available_block_windows(section_id);
CREATE INDEX IF NOT EXISTS idx_windows_time ON available_block_windows(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_windows_status ON available_block_windows(status);

COMMENT ON TABLE available_block_windows IS 'Available maintenance block windows';

-- 8. MAINTENANCE_BLOCKS TABLE
-- Stores approved maintenance blocks
CREATE TABLE IF NOT EXISTS maintenance_blocks (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id) ON DELETE CASCADE,
  section_id TEXT REFERENCES railway_sections(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'Proposed' CHECK (status IN ('Proposed', 'Approved', 'Assigned', 'In Progress', 'Completed', 'Cancelled')),
  optimization_score NUMERIC(5,2) CHECK (optimization_score >= 0 AND optimization_score <= 100),
  
  -- Approval tracking
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  rejected_by TEXT,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Assignment tracking
  assigned_department TEXT CHECK (assigned_department IN ('Civil', 'Signal & Telecom', 'Electrical', 'Mechanical')),
  assigned_by TEXT,
  assigned_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_block_time CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_blocks_corridor ON maintenance_blocks(corridor_id);
CREATE INDEX IF NOT EXISTS idx_blocks_section ON maintenance_blocks(section_id);
CREATE INDEX IF NOT EXISTS idx_blocks_time ON maintenance_blocks(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_blocks_status ON maintenance_blocks(status);

COMMENT ON TABLE maintenance_blocks IS 'Planned maintenance blocks';

-- 9. MAINTENANCE_BLOCK_TASKS (Junction Table)
-- Links tasks to maintenance blocks
CREATE TABLE IF NOT EXISTS maintenance_block_tasks (
  id SERIAL PRIMARY KEY,
  block_id TEXT REFERENCES maintenance_blocks(id) ON DELETE CASCADE,
  task_id TEXT REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(block_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_block_tasks_block ON maintenance_block_tasks(block_id);
CREATE INDEX IF NOT EXISTS idx_block_tasks_task ON maintenance_block_tasks(task_id);

COMMENT ON TABLE maintenance_block_tasks IS 'Junction table linking blocks and tasks';

-- 10. SIMULATION_EVENTS TABLE
-- Stores what-if simulation results
CREATE TABLE IF NOT EXISTS simulation_events (
  id TEXT PRIMARY KEY,
  corridor_id TEXT REFERENCES corridors(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('Equipment Failure', 'Weather Delay', 'Emergency Work', 'Resource Shortage', 'Train Disruption')),
  event_data JSONB,
  impact_summary JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_simulations_corridor ON simulation_events(corridor_id);
CREATE INDEX IF NOT EXISTS idx_simulations_type ON simulation_events(event_type);
CREATE INDEX IF NOT EXISTS idx_simulations_created ON simulation_events(created_at DESC);

COMMENT ON TABLE simulation_events IS 'What-if simulation scenarios and results';

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

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

-- ============================================
-- CREATE RLS POLICIES (Development Mode)
-- ============================================
-- Note: For production, implement proper authentication-based policies

-- Read policies (SELECT)
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

-- Write policies (INSERT, UPDATE, DELETE) - Development only
CREATE POLICY "Enable insert for all users" ON corridors FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON stations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON railway_sections FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON assets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON maintenance_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON train_movements FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON available_block_windows FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON maintenance_blocks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON maintenance_block_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON simulation_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON corridors FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON stations FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON railway_sections FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON assets FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON maintenance_tasks FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON train_movements FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON available_block_windows FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON maintenance_blocks FOR UPDATE USING (true);
CREATE POLICY "Enable update for all users" ON simulation_events FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON corridors FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON stations FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON railway_sections FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON assets FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON maintenance_tasks FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON train_movements FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON available_block_windows FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON maintenance_blocks FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON maintenance_block_tasks FOR DELETE USING (true);
CREATE POLICY "Enable delete for all users" ON simulation_events FOR DELETE USING (true);

-- ============================================
-- CREATE FUNCTIONS FOR AUTO-UPDATES
-- ============================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_tasks_updated_at
    BEFORE UPDATE ON maintenance_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_blocks_updated_at
    BEFORE UPDATE ON maintenance_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CREATE USEFUL VIEWS
-- ============================================

-- View: Tasks with Section and Asset Details
CREATE OR REPLACE VIEW v_tasks_detailed AS
SELECT 
    t.id,
    t.task_title,
    t.department,
    t.severity,
    t.priority_score,
    t.priority_level,
    t.status,
    t.estimated_duration,
    t.deadline,
    s.section_name,
    s.asset_health_score as section_health,
    a.asset_name,
    a.asset_health_score as asset_health,
    c.corridor_name,
    t.created_at
FROM maintenance_tasks t
LEFT JOIN railway_sections s ON t.section_id = s.id
LEFT JOIN assets a ON t.asset_id = a.id
LEFT JOIN corridors c ON t.corridor_id = c.id;

COMMENT ON VIEW v_tasks_detailed IS 'Detailed view of maintenance tasks with related info';

-- View: Section Health Summary
CREATE OR REPLACE VIEW v_section_health_summary AS
SELECT 
    s.id as section_id,
    s.section_name,
    s.asset_health_score as section_health,
    COUNT(DISTINCT a.id) as total_assets,
    AVG(a.asset_health_score) as avg_asset_health,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.severity = 'Critical' THEN t.id END) as critical_tasks,
    COUNT(DISTINCT CASE WHEN t.status = 'Pending' THEN t.id END) as pending_tasks
FROM railway_sections s
LEFT JOIN assets a ON s.id = a.section_id
LEFT JOIN maintenance_tasks t ON s.id = t.section_id
GROUP BY s.id, s.section_name, s.asset_health_score;

COMMENT ON VIEW v_section_health_summary IS 'Health summary by railway section';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verify all indexes created
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verify RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- DATABASE SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Run frontend: npm run dev
-- 2. Open browser console and execute:
--    await api.resetAndSeedDatabase();
-- 3. Verify data in Supabase Table Editor
-- ============================================
