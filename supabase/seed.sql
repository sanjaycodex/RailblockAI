-- ============================================================================
-- RAILBLOCKAI SEED DATA: TIRUNELVELI - MADURAI (TEN-MDU) CORRIDOR
-- Southern Railway / Madurai Division
-- All information is simulated demo/prototype data.
-- ============================================================================

-- Insert Corridor
INSERT INTO corridors (id, name, origin, destination, description, asset_health_score, traffic_level, is_prototype_data)
VALUES (
  'CORR-SR-TEN-MDU',
  'Tirunelveli - Madurai Electrified Mainline',
  'Tirunelveli Junction (TEN)',
  'Madurai Junction (MDU)',
  '157.1 KM high-density double-line passenger & freight trunk in Southern Railway (Madurai Division). 25kV AC electric traction.',
  91.80,
  'High',
  TRUE
) ON CONFLICT (id) DO UPDATE SET asset_health_score = EXCLUDED.asset_health_score;

-- Insert Stations
INSERT INTO stations (id, corridor_id, name, station_code, sequence_order, distance_from_origin) VALUES
('STN-TEN', 'CORR-SR-TEN-MDU', 'Tirunelveli Junction', 'TEN', 1, 0.0),
('STN-MEJ', 'CORR-SR-TEN-MDU', 'Vanchi Maniyachchi Junction', 'MEJ', 2, 28.8),
('STN-CVP', 'CORR-SR-TEN-MDU', 'Kovilpatti', 'CVP', 3, 64.9),
('STN-SRT', 'CORR-SR-TEN-MDU', 'Satur', 'SRT', 4, 86.4),
('STN-VPT', 'CORR-SR-TEN-MDU', 'Virudhunagar Junction', 'VPT', 5, 113.6),
('STN-TMQ', 'CORR-SR-TEN-MDU', 'Tirumangalam', 'TMQ', 6, 139.9),
('STN-MDU', 'CORR-SR-TEN-MDU', 'Madurai Junction', 'MDU', 7, 157.1)
ON CONFLICT (id) DO NOTHING;

-- Insert Railway Sections
INSERT INTO railway_sections (id, corridor_id, from_station_id, to_station_id, section_name, distance, asset_health_score, traffic_level) VALUES
('SEC-TEN-MEJ', 'CORR-SR-TEN-MDU', 'STN-TEN', 'STN-MEJ', 'Tirunelveli - Vanchi Maniyachchi (TEN-MEJ)', 28.8, 94.20, 'High'),
('SEC-MEJ-CVP', 'CORR-SR-TEN-MDU', 'STN-MEJ', 'STN-CVP', 'Vanchi Maniyachchi - Kovilpatti (MEJ-CVP)', 36.1, 87.50, 'High'),
('SEC-CVP-SRT', 'CORR-SR-TEN-MDU', 'STN-CVP', 'STN-SRT', 'Kovilpatti - Satur (CVP-SRT)', 21.5, 89.00, 'Medium'),
('SEC-SRT-VPT', 'CORR-SR-TEN-MDU', 'STN-SRT', 'STN-VPT', 'Satur - Virudhunagar (SRT-VPT)', 27.2, 79.40, 'Very High'),
('SEC-VPT-TMQ', 'CORR-SR-TEN-MDU', 'STN-VPT', 'STN-TMQ', 'Virudhunagar - Tirumangalam (VPT-TMQ)', 26.3, 93.00, 'High'),
('SEC-TMQ-MDU', 'CORR-SR-TEN-MDU', 'STN-TMQ', 'STN-MDU', 'Tirumangalam - Madurai Approach (TMQ-MDU)', 17.2, 92.00, 'Very High')
ON CONFLICT (id) DO NOTHING;

-- Insert Assets
INSERT INTO assets (id, section_id, department, asset_type, asset_name, asset_health_score, criticality, status) VALUES
('AST-TEN-TRK-01', 'SEC-TEN-MEJ', 'Civil', 'Track Geometry (60kg 90UTS)', 'UP Main Line KM 12.0 - 18.5', 96.00, 'High', 'Normal'),
('AST-TEN-OHE-01', 'SEC-TEN-MEJ', 'Electrical', '25kV Traction Catenary', 'Mast TEN/14 to MEJ/02', 94.00, 'High', 'Normal'),
('AST-TEN-SIG-01', 'SEC-TEN-MEJ', 'Signal & Telecom', 'Multi-Section Axle Counter', 'Block Section Track Circuit AXL-TEN-1', 98.00, 'Critical', 'Normal'),
('AST-TEN-SWT-01', 'SEC-TEN-MEJ', 'Civil', 'Thick Web Switch 1:12 Turnout', 'Maniyachchi South Cross Point 102A', 88.00, 'High', 'Caution'),
('AST-MEJ-TRK-02', 'SEC-MEJ-CVP', 'Civil', 'Track Welds & USFD', 'DN Main Flash Butt Welds KM 42.4', 76.00, 'Critical', 'Degraded'),
('AST-MEJ-SLP-01', 'SEC-MEJ-CVP', 'Civil', 'Pre-stressed Concrete Sleepers', 'PSC Sleeper Batch KM 48.0 - 52.0', 84.00, 'Medium', 'Caution'),
('AST-MEJ-OHE-02', 'SEC-MEJ-CVP', 'Electrical', 'Catenary Auto Tension Device (ATD)', 'Traction Tensioner Mast MEJ/48', 91.00, 'Medium', 'Normal'),
('AST-MEJ-SIG-02', 'SEC-MEJ-CVP', 'Signal & Telecom', 'Electronic Interlocking (EI)', 'Kovilpatti Outer Home Relay Set', 96.00, 'Critical', 'Normal'),
('AST-CVP-TRK-03', 'SEC-CVP-SRT', 'Civil', 'Ballast Cushion & Deep Bed', 'Ballast Screening KM 72.0 - 78.0', 89.00, 'Medium', 'Normal'),
('AST-CVP-OHE-03', 'SEC-CVP-SRT', 'Electrical', 'Section Insulator 25kV', 'Neutral Section CVP Feeder Mast 76/12', 93.00, 'High', 'Normal'),
('AST-CVP-SIG-03', 'SEC-CVP-SRT', 'Signal & Telecom', 'Point Machine 24V DC', 'Satur North Facing Point 104B', 82.00, 'High', 'Caution'),
('AST-CVP-BRG-01', 'SEC-CVP-SRT', 'Civil', 'Steel Girder Minor Bridge', 'Bridge No. 142 at KM 81.4', 95.00, 'Medium', 'Normal'),
('AST-SRT-TRK-04', 'SEC-SRT-VPT', 'Civil', 'Rail Head Wear & Twist', 'UP Main Curve KM 98.2 (2.4 Degree Curve)', 72.00, 'Critical', 'Degraded'),
('AST-SRT-SWT-02', 'SEC-SRT-VPT', 'Civil', 'Diamond Crossing & Check Rails', 'Virudhunagar Junction Approach Diamond 108', 74.00, 'Critical', 'Degraded'),
('AST-SRT-SIG-04', 'SEC-SRT-VPT', 'Signal & Telecom', 'Solid State Interlocking (SSI)', 'Virudhunagar Yard Central SSI Cabin', 91.00, 'Critical', 'Normal'),
('AST-SRT-OHE-04', 'SEC-SRT-VPT', 'Electrical', 'Overhead Catenary Droppers', 'Dropper Assembly Mast SRT/102 - VPT/04', 85.00, 'High', 'Caution'),
('AST-SRT-LVL-01', 'SEC-SRT-VPT', 'Signal & Telecom', 'Interlocked Level Crossing Gate', 'LC Gate No. 118 at KM 106.2', 88.00, 'High', 'Normal'),
('AST-VPT-TRK-05', 'SEC-VPT-TMQ', 'Civil', 'Continuous Welded Rail (CWR)', 'Track Alignment KM 118.0 - 132.0', 95.00, 'High', 'Normal'),
('AST-VPT-OHE-05', 'SEC-VPT-TMQ', 'Electrical', 'Sub-station Transformer 132/25kV', 'Tirumangalam Traction Sub-station (TSS)', 97.00, 'Critical', 'Normal'),
('AST-VPT-SIG-05', 'SEC-VPT-TMQ', 'Signal & Telecom', 'High-Intensity LED Color Light Signals', 'Auto Signaling Line Signals SIG-TMQ-01', 98.00, 'Medium', 'Normal'),
('AST-TMQ-TRK-06', 'SEC-TMQ-MDU', 'Civil', 'Yard Turnouts & Scissors Crossover', 'Madurai South Crossover Point 201A/B', 81.00, 'Critical', 'Caution'),
('AST-TMQ-OHE-06', 'SEC-TMQ-MDU', 'Electrical', 'Yard Portal Masts & Isolator Switch', 'Madurai Yard Catenary Portal P-14', 92.00, 'High', 'Normal'),
('AST-TMQ-SIG-06', 'SEC-TMQ-MDU', 'Signal & Telecom', 'Integrated Power Supply (IPS)', 'Madurai Relay Room Standby Battery Bank', 96.00, 'Critical', 'Normal'),
('AST-TMQ-TRK-07', 'SEC-TMQ-MDU', 'Civil', 'Ultrasonic Flaw Inspection (USFD)', 'Thermit Welds at KM 152.4 (UP Line)', 83.00, 'High', 'Caution'),
('AST-TMQ-SIG-07', 'SEC-TMQ-MDU', 'Signal & Telecom', 'Axle Counter Reset Unit', 'Madurai Departure Section Axle Counter', 97.00, 'Medium', 'Normal'),
('AST-TMQ-OHE-07', 'SEC-TMQ-MDU', 'Electrical', 'Return Current Bond & Earthing', 'Traction Earth Bonds KM 148 - 156', 94.00, 'Medium', 'Normal')
ON CONFLICT (id) DO NOTHING;

-- Insert Maintenance Tasks
INSERT INTO maintenance_tasks (id, asset_id, source_system, department, corridor_id, section_id, task_title, severity, failure_risk, asset_criticality, urgency, operational_impact, estimated_duration, deadline, preferred_start_time, preferred_end_time, priority_score, priority_level, status) VALUES
('TSK-TEN-001', 'AST-MEJ-TRK-02', 'USFD Hand Trolley Inspection', 'Civil', 'CORR-SR-TEN-MDU', 'SEC-MEJ-CVP', 'Immediate Removal (IMR) Transverse Rail Flaw at KM 42/14', 'Critical', 98.00, 'Critical', 'Immediate', 92.00, 120, '2026-08-27T06:00:00Z', '2026-08-26T01:30:00Z', '2026-08-26T03:30:00Z', 98.50, 'P1 Critical', 'Pending'),
('TSK-TEN-002', 'AST-SRT-TRK-04', 'Track Recording Car (TRC-SR)', 'Civil', 'CORR-SR-TEN-MDU', 'SEC-SRT-VPT', 'Rail Profile Grinding & Gauge Corner Restoration (Curve KM 98.2)', 'Critical', 91.00, 'Critical', 'Urgent', 88.00, 180, '2026-08-28T12:00:00Z', '2026-08-27T01:00:00Z', '2026-08-27T04:00:00Z', 94.00, 'P1 Critical', 'AI-Optimized'),
('TSK-TEN-003', 'AST-SRT-SWT-02', 'P-Way Keyman Inspection', 'Civil', 'CORR-SR-TEN-MDU', 'SEC-SRT-VPT', 'Recondition Worn Crossing Nose on Diamond 108 (Virudhunagar South)', 'High', 86.00, 'Critical', 'Urgent', 85.00, 150, '2026-08-29T10:00:00Z', '2026-08-28T02:00:00Z', '2026-08-28T04:30:00Z', 89.50, 'High', 'Approved'),
('TSK-TEN-004', 'AST-CVP-SIG-03', 'Signal Diagnostic IoT Sensor', 'Signal & Telecom', 'CORR-SR-TEN-MDU', 'SEC-CVP-SRT', 'Point Machine 104B Stalling Motor Current Spike Inspection & Overhaul', 'High', 84.00, 'High', 'Urgent', 82.00, 90, '2026-08-28T08:00:00Z', '2026-08-27T02:30:00Z', '2026-08-27T04:00:00Z', 87.00, 'High', 'Pending'),
('TSK-TEN-005', 'AST-TMQ-TRK-06', 'Madurai Yard Master Daily Log', 'Civil', 'CORR-SR-TEN-MDU', 'SEC-TMQ-MDU', 'Scissors Crossover Point 201A Tongue Rail Replacement & Tamping', 'High', 82.00, 'Critical', 'Urgent', 89.00, 180, '2026-08-30T18:00:00Z', '2026-08-29T00:30:00Z', '2026-08-29T03:30:00Z', 88.00, 'High', 'In Progress'),
('TSK-TEN-006', 'AST-SRT-OHE-04', 'Optical Drone Catenary Scan', 'Electrical', 'CORR-SR-TEN-MDU', 'SEC-SRT-VPT', 'Replace Loose Catenary Droppers & Adjust Stagger (Masts SRT/102-108)', 'Medium', 68.00, 'High', 'Planned', 64.00, 150, '2026-09-02T12:00:00Z', '2026-08-30T01:00:00Z', '2026-08-30T03:30:00Z', 72.00, 'Medium', 'AI-Optimized'),
('TSK-TEN-007', 'AST-TEN-SWT-01', 'Section Engineer P-Way Inspection', 'Civil', 'CORR-SR-TEN-MDU', 'SEC-TEN-MEJ', 'Maniyachchi Point 102A Slide Chair Lubrication & Clearance Check', 'Medium', 65.00, 'High', 'Planned', 60.00, 60, '2026-09-01T12:00:00Z', '2026-08-30T02:00:00Z', '2026-08-30T03:00:00Z', 68.00, 'Medium', 'Approved'),
('TSK-TEN-008', 'AST-MEJ-SLP-01', 'Track Geometry TRC-24', 'Civil', 'CORR-SR-TEN-MDU', 'SEC-MEJ-CVP', 'Deep Ballast Screening (BCM) & Sleeper Realignment KM 48-52', 'Medium', 71.00, 'Medium', 'Planned', 74.00, 210, '2026-09-05T18:00:00Z', '2026-08-31T01:00:00Z', '2026-08-31T04:30:00Z', 75.50, 'Medium', 'Pending'),
('TSK-TEN-009', 'AST-CVP-OHE-03', 'TRD Section Inspection', 'Electrical', 'CORR-SR-TEN-MDU', 'SEC-CVP-SRT', 'Neutral Section Feeder Mast 76/12 Insulator Cleaning & Megger Testing', 'Low', 42.00, 'High', 'Planned', 40.00, 90, '2026-09-10T12:00:00Z', '2026-09-02T02:00:00Z', '2026-09-02T03:30:00Z', 52.00, 'Low', 'Pending'),
('TSK-TEN-010', 'AST-SRT-LVL-01', 'Safety Audit Team', 'Signal & Telecom', 'CORR-SR-TEN-MDU', 'SEC-SRT-VPT', 'Level Crossing Gate 118 Interlocking Boom Lock & Audio-Visual Warning Test', 'Medium', 60.00, 'High', 'Planned', 55.00, 45, '2026-09-03T10:00:00Z', '2026-09-01T11:00:00Z', '2026-09-01T11:45:00Z', 64.00, 'Medium', 'Completed'),
('TSK-TEN-011', 'AST-TMQ-TRK-07', 'USFD Ultrasonic Car', 'Civil', 'CORR-SR-TEN-MDU', 'SEC-TMQ-MDU', 'Thermit Weld Clamp & Jogged Fishplate Installation at KM 152/4 (UP)', 'High', 88.00, 'High', 'Immediate', 84.00, 75, '2026-08-27T14:00:00Z', '2026-08-26T02:00:00Z', '2026-08-26T03:15:00Z', 91.00, 'P1 Critical', 'Pending'),
('TSK-TEN-012', 'AST-VPT-OHE-05', 'SCADA Traction Sub-station Monitor', 'Electrical', 'CORR-SR-TEN-MDU', 'SEC-VPT-TMQ', 'Tirumangalam TSS 132kV Circuit Breaker SF6 Gas Pressure Top-up & Calibration', 'Medium', 58.00, 'Critical', 'Planned', 62.00, 120, '2026-09-08T18:00:00Z', '2026-09-04T01:30:00Z', '2026-09-04T03:30:00Z', 69.00, 'Medium', 'Approved')
ON CONFLICT (id) DO NOTHING;

-- Insert Train Movements (All 24 trains from TEN-MDU corridor)
INSERT INTO train_movements (id, corridor_id, section_id, train_number, train_name, start_time, end_time, traffic_impact, priority, movement_date) VALUES
-- 1. Premium Vande Bharat Express Trains (4 trains)
('TRN-20666', 'CORR-SR-TEN-MDU', 'SEC-TEN-MEJ', '20666', 'Tirunelveli - Chennai Egmore Vande Bharat Express', '2026-08-26T06:00:00Z', '2026-08-26T07:45:00Z', 'Critical', 1, '2026-08-26'),
('TRN-20665', 'CORR-SR-TEN-MDU', 'SEC-TMQ-MDU', '20665', 'Chennai Egmore - Tirunelveli Vande Bharat Express', '2026-08-26T16:45:00Z', '2026-08-26T18:15:00Z', 'Critical', 1, '2026-08-26'),
('TRN-20627', 'CORR-SR-TEN-MDU', 'SEC-VPT-TMQ', '20627', 'Chennai Egmore - Nagercoil Vande Bharat Express', '2026-08-26T11:15:00Z', '2026-08-26T13:00:00Z', 'Critical', 1, '2026-08-26'),
('TRN-20628', 'CORR-SR-TEN-MDU', 'SEC-MEJ-CVP', '20628', 'Nagercoil - Chennai Egmore Vande Bharat Express', '2026-08-26T14:45:00Z', '2026-08-26T16:30:00Z', 'Critical', 1, '2026-08-26'),

-- 2. Historic & Major Superfast Express Trains (10 trains)
('TRN-12638', 'CORR-SR-TEN-MDU', 'SEC-TMQ-MDU', '12638', 'Pandian Superfast Express', '2026-08-26T21:20:00Z', '2026-08-26T22:15:00Z', 'High', 2, '2026-08-26'),
('TRN-12637', 'CORR-SR-TEN-MDU', 'SEC-TMQ-MDU', '12637', 'Pandian Superfast Express (Down)', '2026-08-26T04:45:00Z', '2026-08-26T05:35:00Z', 'High', 2, '2026-08-26'),
('TRN-12642', 'CORR-SR-TEN-MDU', 'SEC-SRT-VPT', '12642', 'Thirukkural Superfast Express', '2026-08-26T21:15:00Z', '2026-08-26T23:20:00Z', 'High', 2, '2026-08-26'),
('TRN-12690', 'CORR-SR-TEN-MDU', 'SEC-CVP-SRT', '12690', 'Nagercoil - Chennai Egmore Weekly Express', '2026-08-26T20:05:00Z', '2026-08-26T22:45:00Z', 'High', 2, '2026-08-26'),
('TRN-12694', 'CORR-SR-TEN-MDU', 'SEC-SRT-VPT', '12694', 'Pearl City Superfast Express', '2026-08-26T20:30:00Z', '2026-08-26T22:50:00Z', 'High', 2, '2026-08-26'),
('TRN-12693', 'CORR-SR-TEN-MDU', 'SEC-MEJ-CVP', '12693', 'Pearl City Superfast Express (Down)', '2026-08-26T03:30:00Z', '2026-08-26T05:40:00Z', 'High', 2, '2026-08-26'),
('TRN-16128', 'CORR-SR-TEN-MDU', 'SEC-MEJ-CVP', '16128', 'Guruvayur - Chennai Egmore Express', '2026-08-26T08:45:00Z', '2026-08-26T11:20:00Z', 'High', 2, '2026-08-26'),
('TRN-16127', 'CORR-SR-TEN-MDU', 'SEC-VPT-TMQ', '16127', 'Chennai Egmore - Guruvayur Express', '2026-08-26T17:30:00Z', '2026-08-26T20:10:00Z', 'High', 2, '2026-08-26'),
('TRN-16367', 'CORR-SR-TEN-MDU', 'SEC-TEN-MEJ', '16367', 'Kashi Tamil Sangam Express', '2026-08-26T22:15:00Z', '2026-08-27T00:45:00Z', 'High', 2, '2026-08-26'),
('TRN-22630', 'CORR-SR-TEN-MDU', 'SEC-CVP-SRT', '22630', 'Tirunelveli - Lokmanya Tilak Terminus SF Express', '2026-08-26T07:30:00Z', '2026-08-26T09:50:00Z', 'High', 2, '2026-08-26'),
('TRN-20603', 'CORR-SR-TEN-MDU', 'SEC-TEN-MEJ', '20603', 'Nagercoil - New Jalpaiguri Amrit Bharat Express', '2026-08-26T19:45:00Z', '2026-08-26T22:30:00Z', 'High', 2, '2026-08-26'),
('TRN-06103', 'CORR-SR-TEN-MDU', 'SEC-CVP-SRT', '06103', 'Tirunelveli - Shimoga Town Express Special', '2026-08-26T15:40:00Z', '2026-08-26T18:20:00Z', 'Medium', 3, '2026-08-26'),

-- 3. Through Long-Distance Express Trains (5 trains)
('TRN-12634', 'CORR-SR-TEN-MDU', 'SEC-TMQ-MDU', '12634', 'Kanniyakumari - Chennai Egmore Kanyakumari SF', '2026-08-26T19:50:00Z', '2026-08-26T21:30:00Z', 'High', 2, '2026-08-26'),
('TRN-16526', 'CORR-SR-TEN-MDU', 'SEC-SRT-VPT', '16526', 'KSR Bengaluru - Kanniyakumari Island Express', '2026-08-26T10:20:00Z', '2026-08-26T13:00:00Z', 'High', 2, '2026-08-26'),
('TRN-16352', 'CORR-SR-TEN-MDU', 'SEC-MEJ-CVP', '16352', 'Mumbai CSMT - Nagercoil Balaji Express', '2026-08-26T13:15:00Z', '2026-08-26T15:50:00Z', 'High', 2, '2026-08-26'),
('TRN-12666', 'CORR-SR-TEN-MDU', 'SEC-TEN-MEJ', '12666', 'Kanniyakumari - Howrah Superfast Express', '2026-08-26T23:30:00Z', '2026-08-27T02:15:00Z', 'High', 2, '2026-08-26'),
('TRN-11022', 'CORR-SR-TEN-MDU', 'SEC-CVP-SRT', '11022', 'Tirunelveli - Dadar Chalukya Express', '2026-08-26T18:10:00Z', '2026-08-26T20:45:00Z', 'Medium', 3, '2026-08-26'),

-- 4. Passenger, Local & MEMU Services (4 trains)
('TRN-56701', 'CORR-SR-TEN-MDU', 'SEC-TMQ-MDU', '56701', 'Madurai - Tirunelveli Fast Passenger', '2026-08-26T05:20:00Z', '2026-08-26T08:30:00Z', 'Low', 3, '2026-08-26'),
('TRN-56706', 'CORR-SR-TEN-MDU', 'SEC-MEJ-CVP', '56706', 'Tirunelveli - Madurai Passenger', '2026-08-26T13:40:00Z', '2026-08-26T16:50:00Z', 'Low', 3, '2026-08-26'),
('TRN-66801', 'CORR-SR-TEN-MDU', 'SEC-VPT-TMQ', '66801', 'Madurai - Tirunelveli Mainline MEMU', '2026-08-26T07:05:00Z', '2026-08-26T09:40:00Z', 'Low', 3, '2026-08-26'),
('TRN-56741', 'CORR-SR-TEN-MDU', 'SEC-TEN-MEJ', '56741', 'Tirunelveli - Sengottai Passenger (via Branch)', '2026-08-26T06:50:00Z', '2026-08-26T09:20:00Z', 'Low', 3, '2026-08-26'),

-- 5. Heavy Freight & Port Logistics Movements (3 trains)
('TRN-FRT-8821', 'CORR-SR-TEN-MDU', 'SEC-SRT-VPT', 'BCNHL-8821', 'Tuticorin Port Container Coal Freight', '2026-08-26T01:15:00Z', '2026-08-26T03:00:00Z', 'Medium', 4, '2026-08-26'),
('TRN-FRT-4412', 'CORR-SR-TEN-MDU', 'SEC-MEJ-CVP', 'BOXNHL-4412', 'VOC Port Tuticorin Fertilizer & Gypsum Bulk Rake', '2026-08-26T02:45:00Z', '2026-08-26T04:50:00Z', 'Medium', 4, '2026-08-26'),
('TRN-FRT-3309', 'CORR-SR-TEN-MDU', 'SEC-VPT-TMQ', 'BTPN-3309', 'IOCL Petroleum Tanker Special', '2026-08-26T00:30:00Z', '2026-08-26T02:20:00Z', 'High', 3, '2026-08-26')
ON CONFLICT (id) DO NOTHING;

-- Insert Available Block Windows
INSERT INTO available_block_windows (id, corridor_id, section_id, start_time, end_time, availability_score, date) VALUES
('WIN-01', 'CORR-SR-TEN-MDU', 'SEC-MEJ-CVP', '2026-08-27T01:30:00Z', '2026-08-27T04:30:00Z', 96.00, '2026-08-27'),
('WIN-02', 'CORR-SR-TEN-MDU', 'SEC-SRT-VPT', '2026-08-27T01:00:00Z', '2026-08-27T04:00:00Z', 94.00, '2026-08-27'),
('WIN-03', 'CORR-SR-TEN-MDU', 'SEC-TMQ-MDU', '2026-08-28T00:30:00Z', '2026-08-28T03:30:00Z', 92.00, '2026-08-28'),
('WIN-04', 'CORR-SR-TEN-MDU', 'SEC-TEN-MEJ', '2026-08-28T12:30:00Z', '2026-08-28T14:30:00Z', 84.00, '2026-08-28')
ON CONFLICT (id) DO NOTHING;
