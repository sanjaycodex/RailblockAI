-- ============================================================================
-- RAILBLOCKAI DATABASE SCHEMA (PostgreSQL / Supabase)
-- Focus: Tirunelveli - Madurai (TEN-MDU) Railway Corridor Prototype
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Planner', 'Viewer')) DEFAULT 'Planner',
    department TEXT NOT NULL DEFAULT 'Operations',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CORRIDORS TABLE
CREATE TABLE IF NOT EXISTS corridors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    description TEXT,
    asset_health_score NUMERIC(5,2) DEFAULT 92.50,
    traffic_level TEXT CHECK (traffic_level IN ('Low', 'Medium', 'High', 'Very High')) DEFAULT 'High',
    is_prototype_data BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STATIONS TABLE
CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY,
    corridor_id TEXT NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    station_code TEXT NOT NULL UNIQUE,
    sequence_order INT NOT NULL,
    distance_from_origin NUMERIC(6,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RAILWAY SECTIONS TABLE
CREATE TABLE IF NOT EXISTS railway_sections (
    id TEXT PRIMARY KEY,
    corridor_id TEXT NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    from_station_id TEXT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    to_station_id TEXT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    section_name TEXT NOT NULL,
    distance NUMERIC(6,2) NOT NULL,
    asset_health_score NUMERIC(5,2) DEFAULT 90.00,
    traffic_level TEXT CHECK (traffic_level IN ('Low', 'Medium', 'High', 'Very High')) DEFAULT 'High',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ASSETS TABLE
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    department TEXT NOT NULL CHECK (department IN ('Civil', 'Signal & Telecom', 'Electrical')),
    asset_type TEXT NOT NULL,
    asset_name TEXT NOT NULL,
    asset_health_score NUMERIC(5,2) DEFAULT 95.00,
    criticality TEXT NOT NULL CHECK (criticality IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    status TEXT NOT NULL CHECK (status IN ('Normal', 'Caution', 'Degraded', 'Maintenance')) DEFAULT 'Normal',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MAINTENANCE TASKS TABLE
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id TEXT PRIMARY KEY,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    source_system TEXT NOT NULL DEFAULT 'USFD / TRC Ingestion',
    department TEXT NOT NULL CHECK (department IN ('Civil', 'Signal & Telecom', 'Electrical')),
    corridor_id TEXT NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    failure_risk NUMERIC(5,2) DEFAULT 65.00,
    asset_criticality TEXT NOT NULL CHECK (asset_criticality IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    urgency TEXT NOT NULL CHECK (urgency IN ('Planned', 'Urgent', 'Immediate')) DEFAULT 'Planned',
    operational_impact NUMERIC(5,2) DEFAULT 50.00,
    estimated_duration INT NOT NULL, -- minutes
    deadline TIMESTAMPTZ NOT NULL,
    preferred_start_time TIMESTAMPTZ,
    preferred_end_time TIMESTAMPTZ,
    priority_score NUMERIC(5,2) DEFAULT 75.00,
    priority_level TEXT NOT NULL CHECK (priority_level IN ('Low', 'Medium', 'High', 'P1 Critical')) DEFAULT 'Medium',
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Approved', 'AI-Optimized', 'In Progress', 'Completed', 'Rejected')) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TRAIN MOVEMENTS TABLE
CREATE TABLE IF NOT EXISTS train_movements (
    id TEXT PRIMARY KEY,
    corridor_id TEXT NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    train_number TEXT NOT NULL,
    train_name TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    traffic_impact TEXT NOT NULL CHECK (traffic_impact IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    priority INT NOT NULL DEFAULT 1, -- 1=Vande Bharat/Rajdhani, 2=Mail/Express, 3=Passenger, 4=Freight
    movement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AVAILABLE BLOCK WINDOWS TABLE
CREATE TABLE IF NOT EXISTS available_block_windows (
    id TEXT PRIMARY KEY,
    corridor_id TEXT NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    availability_score NUMERIC(5,2) DEFAULT 88.00,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. MAINTENANCE BLOCKS TABLE
CREATE TABLE IF NOT EXISTS maintenance_blocks (
    id TEXT PRIMARY KEY,
    corridor_id TEXT NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Proposed', 'Approved', 'Active', 'Completed', 'Cancelled')) DEFAULT 'Proposed',
    optimization_score NUMERIC(5,2) DEFAULT 90.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MAINTENANCE BLOCK TASKS (Junction table)
CREATE TABLE IF NOT EXISTS maintenance_block_tasks (
    block_id TEXT NOT NULL REFERENCES maintenance_blocks(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (block_id, task_id)
);

-- 11. SIMULATION EVENTS TABLE
CREATE TABLE IF NOT EXISTS simulation_events (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    corridor_id TEXT NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    section_id TEXT NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    event_start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Active', 'Mitigated', 'Resolved')) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_tasks_corridor ON maintenance_tasks(corridor_id);
CREATE INDEX IF NOT EXISTS idx_tasks_section ON maintenance_tasks(section_id);
CREATE INDEX IF NOT EXISTS idx_tasks_department ON maintenance_tasks(department);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON maintenance_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_severity ON maintenance_tasks(severity);
CREATE INDEX IF NOT EXISTS idx_assets_section ON assets(section_id);
CREATE INDEX IF NOT EXISTS idx_trains_section ON train_movements(section_id);
CREATE INDEX IF NOT EXISTS idx_blocks_section ON maintenance_blocks(section_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Prototype Mode)
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
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

-- Allow full access for prototype demo
DROP POLICY IF EXISTS "Allow public read corridors" ON corridors;
DROP POLICY IF EXISTS "Allow public read stations" ON stations;
DROP POLICY IF EXISTS "Allow public read railway_sections" ON railway_sections;
DROP POLICY IF EXISTS "Allow public read assets" ON assets;
DROP POLICY IF EXISTS "Allow public read maintenance_tasks" ON maintenance_tasks;
DROP POLICY IF EXISTS "Allow public insert/update maintenance_tasks" ON maintenance_tasks;
DROP POLICY IF EXISTS "Allow public read train_movements" ON train_movements;
DROP POLICY IF EXISTS "Allow public read available_block_windows" ON available_block_windows;
DROP POLICY IF EXISTS "Allow public read maintenance_blocks" ON maintenance_blocks;
DROP POLICY IF EXISTS "Allow public read simulation_events" ON simulation_events;
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;

CREATE POLICY "Allow public all corridors" ON corridors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all stations" ON stations FOR ALL USING (true);
CREATE POLICY "Allow public all railway_sections" ON railway_sections FOR ALL USING (true);
CREATE POLICY "Allow public all assets" ON assets FOR ALL USING (true);
CREATE POLICY "Allow public all maintenance_tasks" ON maintenance_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all train_movements" ON train_movements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all available_block_windows" ON available_block_windows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all maintenance_blocks" ON maintenance_blocks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all simulation_events" ON simulation_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);

