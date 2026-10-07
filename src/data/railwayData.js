// ============================================================================
// AUTHENTIC SOUTHERN RAILWAY (MADURAI DIVISION) DOMAIN DATA
// Corridor: Tirunelveli Junction (TEN) – Madurai Junction (MDU) [157.1 KM]
// Double Line 25kV AC Electrified Trunk Line
// ============================================================================

export const CORRIDORS = [
  { id: 'CORR-SR-TEN-MDU', name: 'Tirunelveli - Madurai Mainline (Southern Railway / MDU)', lengthKm: 157.1, activeBlocks: 2, healthScore: 91.8 }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'IMR Transverse Rail Flaw at KM 42/14 (MEJ-CVP)',
    time: '4 mins ago',
    type: 'critical',
    read: false,
    description: 'Immediate rail flaw detected on DN Track between Vanchi Maniyachchi and Kovilpatti. Requires 120-min emergency possession slot.',
    corridor: 'Tirunelveli - Madurai'
  },
  {
    id: 'notif-2',
    title: 'Turnout Point 104B Stalling Motor Current Alert (Satur)',
    time: '18 mins ago',
    type: 'warning',
    read: false,
    description: 'High motor friction logged at Satur North Facing Point 104B during express routing sequence.',
    corridor: 'Kovilpatti - Satur'
  },
  {
    id: 'notif-3',
    title: 'AI Multi-Discipline Possession Approved (SRT-VPT)',
    time: '42 mins ago',
    type: 'success',
    read: false,
    description: '3.5h Joint Shadow Window successfully bundled for Civil Rail Grinding and TRD Catenary adjustment between Satur and Virudhunagar.',
    corridor: 'Satur - Virudhunagar'
  },
  {
    id: 'notif-4',
    title: 'Track Geometry TRC-24 Survey Sync Completed',
    time: '2 hours ago',
    type: 'info',
    read: true,
    description: '157.1 KM track recording car data synced into digital twin repository.',
    corridor: 'Tirunelveli - Madurai'
  }
];

export const RECENT_NOTIFICATIONS = MOCK_NOTIFICATIONS;

export const MOCK_CONFLICTS = [
  {
    id: 'conf-1',
    severity: 'High',
    type: 'Headway Schedule Clash',
    corridor: 'Virudhunagar - Tirumangalam',
    section: 'Satur (SRT) - Virudhunagar (VPT)',
    description: 'Requested Point Machine overhaul at Virudhunagar Yard overlaps with scheduled path of 20666 Vande Bharat Exp (+18 min delay risk).',
    affectedTrain: '20666 TEN-MS Vande Bharat',
    suggestedFix: 'Shift block window +20 mins to 02:15 - 04:15 AM shadow slot.'
  },
  {
    id: 'conf-2',
    severity: 'Medium',
    type: 'Electrical TRD Isolation Dependency',
    corridor: 'Vanchi Maniyachchi - Kovilpatti',
    section: 'MEJ Mast 48/02 - CVP Mast 12/04',
    description: 'Catenary power shutoff required on UP line overlaps with 12694 Pearl City Superfast Express passage.',
    affectedTrain: '12694 Pearl City SF Exp',
    suggestedFix: 'Coordinate with TRD Madurai Control for single-track feed bypass.'
  },
  {
    id: 'conf-3',
    severity: 'High',
    type: 'Civil Machine Speed Restriction',
    corridor: 'Kovilpatti - Satur',
    section: 'CVP KM 72.0 - 78.0',
    description: 'Ballast Cleaning Machine (BCM) tamping leaves 30 km/h caution order affecting 16128 Guruvayur Express run time.',
    affectedTrain: '16128 Guruvayur Exp',
    suggestedFix: 'Deploy Dynamic Track Stabilizer (DTS) to clear caution order in same block.'
  }
];

export const MOCK_BUNDLED_BLOCKS = [
  {
    id: 'BND-TEN-101',
    title: 'Vanchi Maniyachchi – Kovilpatti Triple Joint Corridor Possession',
    corridor: 'Tirunelveli - Madurai',
    section: 'Vanchi Maniyachchi (MEJ) - Kovilpatti (CVP)',
    scheduledDate: '2026-08-27',
    timeSlot: '01:30 - 04:30 AM (3.0 Hours)',
    efficiencyScore: 96,
    tasksCount: 4,
    departments: ['Civil (P-Way)', 'Electrical (TRD)', 'Signal & Telecom'],
    downtimeSavedMinutes: 135,
    costSavingsLakhs: 8.4,
    status: 'Approved',
    tasks: [
      { id: 'TSK-TEN-001', name: 'IMR Transverse Weld Flaw at KM 42/14', dept: 'Civil', machine: 'AUMT Weld Cutter & Clamp' },
      { id: 'TSK-TEN-008', name: 'BCM Deep Ballast Screening KM 48-52', dept: 'Civil', machine: 'BCM-800 & Tamping Machine' },
      { id: 'TSK-TEN-006', name: '25kV Catenary Dropper Realignment', dept: 'Electrical', machine: 'Tower Wagon TW-SR-12' },
      { id: 'TSK-TEN-004', name: 'Point Machine 104B Overhaul & Lubrication', dept: 'Signal & Telecom', machine: 'S&T Tool Van' }
    ]
  },
  {
    id: 'BND-TEN-102',
    title: 'Satur – Virudhunagar Curve Restoration & SSI Maintenance',
    corridor: 'Tirunelveli - Madurai',
    section: 'Satur (SRT) - Virudhunagar (VPT)',
    scheduledDate: '2026-08-28',
    timeSlot: '01:00 - 04:00 AM (3.0 Hours)',
    efficiencyScore: 93,
    tasksCount: 3,
    departments: ['Civil (P-Way)', 'Signal & Telecom'],
    downtimeSavedMinutes: 110,
    costSavingsLakhs: 6.2,
    status: 'AI-Optimized',
    tasks: [
      { id: 'TSK-TEN-002', name: 'Rail Profile Grinding (Curve KM 98.2)', dept: 'Civil', machine: 'Rail Grinding Machine (RGM-72)' },
      { id: 'TSK-TEN-003', name: 'Recondition Worn Crossing Nose Diamond 108', dept: 'Civil', machine: 'Translamatic Robotic Welder' },
      { id: 'TSK-TEN-010', name: 'LC Gate 118 Boom Lock Testing', dept: 'Signal & Telecom', machine: 'S&T Inspection Van' }
    ]
  },
  {
    id: 'BND-TEN-103',
    title: 'Tirumangalam – Madurai South Scissors Crossover Renewal',
    corridor: 'Tirunelveli - Madurai',
    section: 'Tirumangalam (TMQ) - Madurai Jn (MDU)',
    scheduledDate: '2026-08-29',
    timeSlot: '00:30 - 03:30 AM (3.0 Hours)',
    efficiencyScore: 91,
    tasksCount: 3,
    departments: ['Civil (P-Way)', 'Electrical (TRD)'],
    downtimeSavedMinutes: 95,
    costSavingsLakhs: 5.1,
    status: 'Pending Approval',
    tasks: [
      { id: 'TSK-TEN-005', name: 'Scissors Crossover Point 201A Tongue Rail Renewal', dept: 'Civil', machine: 'Unimat 08-475 Tamping' },
      { id: 'TSK-TEN-011', name: 'Jogged Fishplate Fitment at KM 152/4', dept: 'Civil', machine: 'USFD Gang Trolley' },
      { id: 'TSK-TEN-012', name: 'Tirumangalam TSS 132kV Circuit Breaker SF6 Calibration', dept: 'Electrical', machine: 'TRD Test Vehicle' }
    ]
  }
];

export const MAINTENANCE_BLOCKS = MOCK_BUNDLED_BLOCKS;

export const MOCK_AI_RECOMMENDATIONS = [
  {
    id: 'ai-rec-1',
    confidenceScore: 96,
    category: 'Dynamic Slot Shifting',
    title: 'Shift Satur Yard Track Block by +20 Mins',
    description: 'Prevents 18-minute cascading headway delay to 20666 Vande Bharat Express while granting full 120-min window for Point 104B overhaul.',
    projectedPunctualityGain: '+2.4%',
    affectedTrainsCount: 1,
    impactComparison: {
      originalDelayMinutes: 38,
      optimizedDelayMinutes: 0,
      costSavings: '₹3.2 Lakhs'
    },
    suggestedTime: 'Tomorrow 02:15 - 04:15 (Shadow Slot)',
    status: 'Ready to Apply'
  },
  {
    id: 'ai-rec-2',
    confidenceScore: 94,
    category: 'Multi-Discipline Bundling',
    title: 'Combine BCM Screening with 25kV OHE Catenary Adjustments (MEJ-CVP)',
    description: 'Synchronizes Civil Track Tamping and Electrical Catenary tensioning into 1 joint 3.5h window. Eliminates duplicate possession and saves 135 mins.',
    projectedPunctualityGain: '+3.8%',
    affectedTrainsCount: 0,
    impactComparison: {
      originalDelayMinutes: 75,
      optimizedDelayMinutes: 10,
      costSavings: '₹8.4 Lakhs'
    },
    suggestedTime: 'Sunday 01:30 - 04:30 AM',
    status: 'Ready to Apply'
  },
  {
    id: 'ai-rec-3',
    confidenceScore: 91,
    category: 'Headway Shadow Packing',
    title: 'Pack Ultrasonic Flaw Repair During Night Freight Headway (TMQ-MDU)',
    description: 'Utilizes 90-min gap between freight rake departures to complete USFD rail flaw weld clamp without impacting passenger express timings.',
    projectedPunctualityGain: '+1.6%',
    affectedTrainsCount: 0,
    impactComparison: {
      originalDelayMinutes: 25,
      optimizedDelayMinutes: 0,
      costSavings: '₹2.1 Lakhs'
    },
    suggestedTime: 'Tonight 01:00 - 02:30 AM',
    status: 'Ready to Apply'
  }
];

export const AI_RECOMMENDATIONS = MOCK_AI_RECOMMENDATIONS;

export const MOCK_SECTIONS = [
  { id: 'SEC-TEN-MEJ', name: 'Tirunelveli (TEN) - Vanchi Maniyachchi (MEJ)', kmStart: 0, kmEnd: 28.8, health: 94.2, status: 'Normal', activeTrains: 3, cautionOrders: 0, trackType: 'Double Line Electrified 60kg 90UTS' },
  { id: 'SEC-MEJ-CVP', name: 'Vanchi Maniyachchi (MEJ) - Kovilpatti (CVP)', kmStart: 28.8, kmEnd: 64.9, health: 87.5, status: 'Caution', activeTrains: 4, cautionOrders: 1, trackType: 'Double Line (IMR Defect at KM 42/14)' },
  { id: 'SEC-CVP-SRT', name: 'Kovilpatti (CVP) - Satur (SRT)', kmStart: 64.9, kmEnd: 86.4, health: 89.0, status: 'Normal', activeTrains: 3, cautionOrders: 0, trackType: 'Double Line Automatic Block' },
  { id: 'SEC-SRT-VPT', name: 'Satur (SRT) - Virudhunagar (VPT)', kmStart: 86.4, kmEnd: 113.6, health: 79.4, status: 'Degraded', activeTrains: 5, cautionOrders: 2, trackType: 'Double Line (High Density Freight & Passenger)' },
  { id: 'SEC-VPT-TMQ', name: 'Virudhunagar (VPT) - Tirumangalam (TMQ)', kmStart: 113.6, kmEnd: 139.9, health: 93.0, status: 'Normal', activeTrains: 4, cautionOrders: 0, trackType: 'Double Line Electrified 130 km/h' },
  { id: 'SEC-TMQ-MDU', name: 'Tirumangalam (TMQ) - Madurai Junction (MDU)', kmStart: 139.9, kmEnd: 157.1, health: 92.0, status: 'Normal', activeTrains: 6, cautionOrders: 1, trackType: 'Madurai Approach Yard & Crossovers' }
];

export const MOCK_KPIS = {
  totalDowntimeSavedHours: 428,
  efficiencyImprovementPct: 24.8,
  conflictsPrevented: 67,
  activeMaintenanceBlocks: 3,
  corridorsMonitored: 1,
  totalSections: 6,
  totalTrackKm: 157.1,
  totalAssets: 26,
  networkHealthAverage: 91.8
};

export const SYSTEM_METRICS = MOCK_KPIS;

// Digital Twin node representations for the Tirunelveli–Madurai corridor
export const DIGITAL_TWIN_NODES = MOCK_SECTIONS.map((s, i) => ({
  id: s.id,
  label: s.name,
  kmStart: s.kmStart,
  kmEnd: s.kmEnd,
  health: s.health,
  status: s.status,
  activeTrains: s.activeTrains,
  cautionOrders: s.cautionOrders,
  trackType: s.trackType,
  type: 'section',
  x: 80 + i * 160,
  y: 200
}));

// What-If simulation scenario presets
export const SIMULATION_SCENARIOS = [
  {
    id: 'sim-1',
    name: 'Monsoon Speed Restriction Impact',
    description: 'All sections capped at 75 km/h due to track softening in heavy monsoon. Evaluate cascading delay on Vande Bharat and Pearl City Express.',
    type: 'speed_restriction',
    parameters: { speedCapKmh: 75, affectedSections: ['SEC-TEN-MEJ', 'SEC-MEJ-CVP', 'SEC-CVP-SRT'] }
  },
  {
    id: 'sim-2',
    name: 'Emergency IMR Flaw Block Extension (+60 min)',
    description: 'IMR at KM 42/14 requires an additional 60-minute unplanned window. Measure headway impact on 20666 VB Exp and freight rake.',
    type: 'block_extension',
    parameters: { sectionId: 'SEC-MEJ-CVP', extraMinutes: 60 }
  },
  {
    id: 'sim-3',
    name: 'Crew Change Delay at Madurai (30 min)',
    description: 'Simulate 30-minute crew availability delay at Madurai Jn. Ripple effect on reverse working of 12694 Pearl City SF.',
    type: 'crew_delay',
    parameters: { station: 'MDU', delayMinutes: 30 }
  },
  {
    id: 'sim-4',
    name: 'TRD Substation Outage at Tirumangalam TSS',
    description: 'Tirumangalam Traction Sub-Station offline for 4 hours. Section falls to single-feed. Assess derated operation impact.',
    type: 'power_outage',
    parameters: { tssId: 'TSS-TMQ', durationHours: 4, affectedSection: 'SEC-VPT-TMQ' }
  }
];
