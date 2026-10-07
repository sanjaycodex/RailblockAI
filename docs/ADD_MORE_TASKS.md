# How to Add More Tasks & Make Demo Dynamic

## Problem
Your task count is stuck at 16 because that's what's seeded in Supabase.

## Solution: 3 Options

---

## Option 1: Quick Fix - Add More Tasks to Seed Data (10 min)

### Step 1: Open seed data file
`src/data/tenMduData.js`

### Step 2: Add 10+ more tasks to `SEED_MAINTENANCE_TASKS` array

**Copy-paste these additional tasks BEFORE the closing `];`:**

```javascript
  {
    id: 'TSK-TEN-017',
    asset_id: 'AST-TEN-TRK-02',
    source_system: 'USFD Inspection',
    department: 'Civil',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-TEN-MEJ',
    task_title: 'Ballast Cleaning & Shoulder Reconditioning KM 8-12',
    severity: 'Medium',
    failure_risk: 62.0,
    asset_criticality: 'Medium',
    urgency: 'Planned',
    operational_impact: 58.0,
    estimated_duration: 240,
    deadline: '2026-09-10T12:00:00Z',
    preferred_start_time: '2026-09-09T01:00:00Z',
    preferred_end_time: '2026-09-09T05:00:00Z',
    priority_score: 64.5,
    priority_level: 'Medium',
    status: 'Pending'
  },
  {
    id: 'TSK-TEN-018',
    asset_id: 'AST-MEJ-SIG-01',
    source_system: 'Signal Test Car',
    department: 'Signal & Telecom',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-MEJ-CVP',
    task_title: 'Track Circuit Battery Replacement - Section A',
    severity: 'High',
    failure_risk: 78.0,
    asset_criticality: 'High',
    urgency: 'Urgent',
    operational_impact: 75.0,
    estimated_duration: 90,
    deadline: '2026-08-31T08:00:00Z',
    preferred_start_time: '2026-08-30T02:00:00Z',
    preferred_end_time: '2026-08-30T03:30:00Z',
    priority_score: 79.5,
    priority_level: 'High',
    status: 'Pending'
  },
  {
    id: 'TSK-TEN-019',
    asset_id: 'AST-CVP-OHE-02',
    source_system: 'Drone Inspection',
    department: 'Electrical',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-CVP-SRT',
    task_title: 'Replace Damaged Insulators on Portal 402',
    severity: 'Critical',
    failure_risk: 89.0,
    asset_criticality: 'Critical',
    urgency: 'Immediate',
    operational_impact: 86.0,
    estimated_duration: 120,
    deadline: '2026-08-28T06:00:00Z',
    preferred_start_time: '2026-08-27T01:30:00Z',
    preferred_end_time: '2026-08-27T03:30:00Z',
    priority_score: 91.0,
    priority_level: 'P1 Critical',
    status: 'Pending'
  },
  {
    id: 'TSK-TEN-020',
    asset_id: 'AST-VPT-TRK-05',
    source_system: 'Track Recording Car',
    department: 'Civil',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-VPT-TMQ',
    task_title: 'Curve Realignment & Super-elevation Correction KM 115',
    severity: 'Medium',
    failure_risk: 67.0,
    asset_criticality: 'Medium',
    urgency: 'Planned',
    operational_impact: 63.0,
    estimated_duration: 180,
    deadline: '2026-09-05T12:00:00Z',
    preferred_start_time: '2026-09-04T00:30:00Z',
    preferred_end_time: '2026-09-04T03:30:00Z',
    priority_score: 68.0,
    priority_level: 'Medium',
    status: 'Pending'
  },
  {
    id: 'TSK-TEN-021',
    asset_id: 'AST-TMQ-SIG-04',
    source_system: 'Station Master Report',
    department: 'Signal & Telecom',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-TMQ-MDU',
    task_title: 'Axle Counter System Calibration - Tirumangalam',
    severity: 'High',
    failure_risk: 74.0,
    asset_criticality: 'High',
    urgency: 'Urgent',
    operational_impact: 71.0,
    estimated_duration: 60,
    deadline: '2026-08-30T10:00:00Z',
    preferred_start_time: '2026-08-29T03:00:00Z',
    preferred_end_time: '2026-08-29T04:00:00Z',
    priority_score: 76.0,
    priority_level: 'High',
    status: 'Pending'
  },
  {
    id: 'TSK-TEN-022',
    asset_id: 'AST-SRT-TRK-03',
    source_system: 'P-Way Inspection',
    department: 'Civil',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-SRT-VPT',
    task_title: 'Fish-plate Bolt Tightening & Lubrication (5 km stretch)',
    severity: 'Low',
    failure_risk: 45.0,
    asset_criticality: 'Low',
    urgency: 'Planned',
    operational_impact: 38.0,
    estimated_duration: 120,
    deadline: '2026-09-15T12:00:00Z',
    preferred_start_time: '2026-09-14T02:00:00Z',
    preferred_end_time: '2026-09-14T04:00:00Z',
    priority_score: 52.0,
    priority_level: 'Low',
    status: 'Pending'
  },
  {
    id: 'TSK-TEN-023',
    asset_id: 'AST-MEJ-OHE-03',
    source_system: 'OHE Maintenance Team',
    department: 'Electrical',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-MEJ-CVP',
    task_title: 'Section Insulator Cleaning & Testing',
    severity: 'Medium',
    failure_risk: 61.0,
    asset_criticality: 'Medium',
    urgency: 'Planned',
    operational_impact: 57.0,
    estimated_duration: 90,
    deadline: '2026-09-08T12:00:00Z',
    preferred_start_time: '2026-09-07T02:30:00Z',
    preferred_end_time: '2026-09-07T04:00:00Z',
    priority_score: 63.0,
    priority_level: 'Medium',
    status: 'Pending'
  },
  {
    id: 'TSK-TEN-024',
    asset_id: 'AST-CVP-TRK-01',
    source_system: 'Keyman Report',
    department: 'Civil',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-CVP-SRT',
    task_title: 'Drain Cleaning & Track Bed De-silting',
    severity: 'Low',
    failure_risk: 42.0,
    asset_criticality: 'Low',
    urgency: 'Planned',
    operational_impact: 35.0,
    estimated_duration: 150,
    deadline: '2026-09-20T12:00:00Z',
    preferred_start_time: '2026-09-19T01:00:00Z',
    preferred_end_time: '2026-09-19T03:30:00Z',
    priority_score: 48.0,
    priority_level: 'Low',
    status: 'Pending'
  },
  {
    id: 'TSK-TEN-025',
    asset_id: 'AST-VPT-SIG-02',
    source_system: 'Signal Inspector',
    department: 'Signal & Telecom',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-VPT-TMQ',
    task_title: 'Signal Aspect LED Bulb Replacement - 3 Signals',
    severity: 'Medium',
    failure_risk: 59.0,
    asset_criticality: 'Medium',
    urgency: 'Planned',
    operational_impact: 54.0,
    estimated_duration: 45,
    deadline: '2026-09-12T12:00:00Z',
    preferred_start_time: '2026-09-11T03:00:00Z',
    preferred_end_time: '2026-09-11T03:45:00Z',
    priority_score: 60.5,
    priority_level: 'Medium',
    status: 'Pending'
  },
  {
    id: 'TSK-TEN-026',
    asset_id: 'AST-TMQ-OHE-05',
    source_system: 'Tower Wagon Inspection',
    department: 'Electrical',
    corridor_id: 'CORR-SR-TEN-MDU',
    section_id: 'SEC-TMQ-MDU',
    task_title: 'Pantograph Wire Height Adjustment - Platform 2',
    severity: 'High',
    failure_risk: 76.0,
    asset_criticality: 'High',
    urgency: 'Urgent',
    operational_impact: 72.0,
    estimated_duration: 75,
    deadline: '2026-08-31T10:00:00Z',
    preferred_start_time: '2026-08-30T02:30:00Z',
    preferred_end_time: '2026-08-30T03:45:00Z',
    priority_score: 77.5,
    priority_level: 'High',
    status: 'Pending'
  },
```

### Step 3: Reseed the database

Click the **"Seed DB"** button in your app header (top-right corner).

**Result**: Now you'll have 26 tasks instead of 16! ✅

---

## Option 2: Make Task Count Dynamic During Demo (Best for Demo!)

### Add a "Simulate New Defect" Button

This will add tasks on-the-fly during your presentation!

**File**: `src/pages/Dashboard.jsx`

Add this function before the return statement:

```javascript
const handleSimulateNewDefect = async () => {
  const newDefects = [
    {
      id: `TSK-DEMO-${Date.now()}`,
      asset_id: 'AST-MEJ-TRK-02',
      source_system: 'Real-time USFD Alert',
      department: 'Civil',
      corridor_id: 'CORR-SR-TEN-MDU',
      section_id: 'SEC-MEJ-CVP',
      task_title: `NEW: Rail Crack Detected at KM ${Math.floor(Math.random() * 150)}`,
      severity: Math.random() > 0.7 ? 'Critical' : Math.random() > 0.4 ? 'High' : 'Medium',
      failure_risk: Math.floor(Math.random() * 40 + 60), // 60-100
      asset_criticality: 'High',
      urgency: 'Immediate',
      operational_impact: Math.floor(Math.random() * 30 + 70),
      estimated_duration: Math.floor(Math.random() * 120 + 60),
      deadline: new Date(Date.now() + 86400000).toISOString(),
      priority_score: Math.floor(Math.random() * 30 + 70),
      priority_level: Math.random() > 0.7 ? 'P1 Critical' : 'High',
      status: 'Pending'
    }
  ];
  
  // Add to Supabase
  if (isSupabaseConfigured && supabase) {
    await supabase.from('maintenance_tasks').insert(newDefects);
  }
  
  // Refresh dashboard
  await loadDashboard();
  
  alert('🚨 New defect detected! Task count updated.');
};
```

Add button in header JSX:

```javascript
<button
  onClick={handleSimulateNewDefect}
  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
>
  <AlertTriangle className="w-4 h-4" />
  Simulate New Defect
</button>
```

**During Demo**: 
1. Show initial task count (26 tasks)
2. Click "Simulate New Defect"  
3. Task count increases to 27, 28, 29...
4. Show real-time system response! ✨

---

## Option 3: Add Task Status Transitions (Most Impressive!)

### Make tasks move through workflow states

Add this function:

```javascript
const handleCompleteTask = async (taskId) => {
  if (isSupabaseConfigured && supabase) {
    await supabase
      .from('maintenance_tasks')
      .update({ status: 'Completed' })
      .eq('id', taskId);
  }
  await loadDashboard();
};
```

**During Demo**:
- Start: 26 Pending tasks
- Complete 3 tasks → 23 Pending
- Add 2 new defects → 25 Pending
- Show dynamic count changes! 📊

---

## Recommendation for Your Demo

### Do ALL THREE:

1. **Before Demo**: Add 10 more tasks (Option 1) → Start with 26 tasks
2. **During Demo**: Use "Simulate New Defect" button (Option 2) → Show 27, 28, 29...
3. **Show Workflow**: Mark tasks as "In Progress" or "Completed" (Option 3) → Show count decreasing

### Demo Script:

**Mentor**: "How many tasks are in the system?"  
**You**: "Currently 26 maintenance tasks across the TEN-MDU corridor."

**Mentor**: "Does this update in real-time?"  
**You**: *Click "Simulate New Defect"*  
"Yes! Here's a new USFD defect detected - count increased to 27. The ML model will automatically prioritize it."

**Mentor**: "What happens when tasks complete?"  
**You**: *Mark task as completed*  
"Task moves to 'Completed' state, and the count drops to 26. This updates the OR-Tools optimizer input automatically."

**Result**: Looks like a real, dynamic system! 🎯

---

## Quick Implementation

### 5-Minute Version:

1. Copy the 10 additional tasks above
2. Paste into `src/data/tenMduData.js` BEFORE the final `];`
3. Click "Seed DB" button in your app
4. **Done!** You now have 26 tasks

### Full Version (30 min):

1. Add the 10 tasks (above)
2. Add "Simulate New Defect" button code
3. Add task completion functionality
4. Practice the demo flow

---

## For Your Presentation

### What to Say:

"Our system manages [X] maintenance tasks across the 157 km corridor. As new defects are detected by USFD trolleys or drone inspections, tasks are automatically added to the queue. The ML model predicts failure risk, and the OR-Tools optimizer re-calculates the optimal block schedule in real-time."

### What to Show:

1. Dashboard showing current task count
2. Click refresh → count updates
3. Simulate new defect → count increases
4. Complete a task → count decreases
5. Run AI Priority Engine → see ML scores update

**This makes your system look production-ready!** 🚀

---

## Current vs Enhanced

| Aspect | Current | After Enhancement |
|--------|---------|-------------------|
| Task Count | Static 16 | Dynamic 26+ |
| Demo Flow | One-time load | Interactive changes |
| Realism | Fixed dataset | Living system |
| Impressiveness | Basic | Professional |

---

**Bottom Line**: Add more tasks (Option 1) for better variety, and optionally add dynamic buttons (Option 2 & 3) to wow mentors! 🎉
