-- ============================================================================
-- PHASE 4: ALTER simulation_events for Dynamic Replanning & What-If
-- Run this in Supabase SQL Editor
-- ============================================================================

ALTER TABLE simulation_events
  ADD COLUMN IF NOT EXISTS affected_train_id TEXT,
  ADD COLUMN IF NOT EXISTS delay_minutes INT,
  ADD COLUMN IF NOT EXISTS duration_increase_minutes INT,
  ADD COLUMN IF NOT EXISTS traffic_increase_pct NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS event_end_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS affected_block_id TEXT,
  ADD COLUMN IF NOT EXISTS original_plan_snapshot JSONB,
  ADD COLUMN IF NOT EXISTS replan_result JSONB;

-- Update the status constraint to include new states
ALTER TABLE simulation_events DROP CONSTRAINT IF EXISTS simulation_events_status_check;
ALTER TABLE simulation_events ADD CONSTRAINT simulation_events_status_check
  CHECK (status IN ('Pending', 'Active', 'Mitigated', 'Resolved', 'Conflicted', 'Replanned', 'Rejected'));

-- Update event_type to support Phase 4 types
ALTER TABLE simulation_events DROP CONSTRAINT IF EXISTS simulation_events_event_type_check;
