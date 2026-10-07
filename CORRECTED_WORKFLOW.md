# ✅ Corrected Three-Panel Workflow System

## 🎯 Correct Role Definitions

### 1. 📋 **Planner** - Create Plans & Assign Work
**Primary Responsibilities**:
- ✅ Create maintenance plans using AI tools
- ✅ Check team and resource availability
- ✅ View all plans (Proposed, Approved, Assigned)
- ✅ **Assign approved plans to departments** (Civil, Electrical, Signal & Telecom, Mechanical)
- ❌ Cannot approve plans (Admin only)

---

### 2. 🛡️ **Admin** - Inspect & Approve Plans
**Primary Responsibilities**:
- ✅ **Inspect all maintenance plans**
- ✅ **Approve plans** that meet standards
- ✅ **Reject plans** with concerns
- ✅ Full system oversight
- ✅ User management

---

### 3. 👁️ **Viewer** - View Only (No Actions)
**Primary Responsibilities**:
- ✅ View all plans and their status
- ✅ Monitor system dashboards
- ✅ Access reports and analytics
- ❌ **No approval rights**
- ❌ **No assignment rights**
- ❌ **Completely read-only**

---

## 🔄 Complete Workflow

```
┌────────────────────────────────────────────────────────────┐
│               STEP 1: PLANNER CREATES PLAN                  │
│                                                             │
│  Planner logs into Planner Panel                           │
│  → Creates maintenance task                                 │
│  → Runs AI Block Optimizer                                  │
│  → Plan Generated                                           │
│  → Status: "PROPOSED"                                       │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────┐
│              STEP 2: ADMIN APPROVES PLAN                    │
│                                                             │
│  Admin logs into Admin Panel                               │
│  → Sees "Pending Approvals" section                        │
│  → Reviews plan details                                     │
│  → Inspects AI confidence score                            │
│  → Option 1: Click "Approve" → Status: "APPROVED"         │
│  → Option 2: Click "Reject" → Status: "CANCELLED"         │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼ (if approved)
┌────────────────────────────────────────────────────────────┐
│          STEP 3: PLANNER ASSIGNS TO DEPARTMENT              │
│                                                             │
│  Planner sees approved plan                                │
│  → Checks team availability                                 │
│  → Clicks "Assign" button                                   │
│  → Selects Department:                                      │
│     • Civil                                                 │
│     • Electrical                                            │
│     • Signal & Telecom                                      │
│     • Mechanical                                            │
│  → Status: "ASSIGNED"                                       │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────┐
│              STEP 4: EXECUTION & MONITORING                 │
│                                                             │
│  Department executes work                                  │
│  → Status: "IN PROGRESS"                                    │
│  → All roles can monitor                                    │
│  → Status: "COMPLETED"                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Panel Dashboards

### Planner Panel Dashboard

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 📋 Planner Control Panel                ┃
┃ Create plans & assign to departments    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ STATISTICS:                             ┃
┃ Proposed: 3 | Assigned: 5 | Total: 12  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ PLANS & ASSIGNMENTS:                    ┃
┃                                         ┃
┃ ┌─────────────────────────────────────┐┃
┃ │ TMQ-MDU Section                     │┃
┃ │ Status: APPROVED ✅                 │┃
┃ │ AI Score: 94%                       │┃
┃ │                                     │┃
┃ │          [Assign to Dept] 📤       │┃
┃ └─────────────────────────────────────┘┃
┃                                         ┃
┃ ┌─────────────────────────────────────┐┃
┃ │ SRT-CVP Section                     │┃
┃ │ Status: PROPOSED ⏳                 │┃
┃ │ Awaiting Admin Approval             │┃
┃ └─────────────────────────────────────┘┃
┃                                         ┃
┃ ┌─────────────────────────────────────┐┃
┃ │ CVP-VPT Section                     │┃
┃ │ Status: ASSIGNED ✓                  │┃
┃ │ Assigned to: Civil                  │┃
┃ └─────────────────────────────────────┘┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Admin Panel Dashboard

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🛡️ Admin Control Panel                  ┃
┃ Inspect and approve plans               ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ STATISTICS:                             ┃
┃ Pending Approvals: 3 ⚠️                ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 🔔 PLANS PENDING YOUR APPROVAL:         ┃
┃                                         ┃
┃ ┌─────────────────────────────────────┐┃
┃ │ 🤖 AI GENERATED | 94% CONFIDENCE    │┃
┃ │ 🟠 AWAITING APPROVAL                │┃
┃ │                                     │┃
┃ │ TMQ-MDU Section                     │┃
┃ │ Time: Tomorrow 02:15 - 04:15       │┃
┃ │ Duration: 120 mins                  │┃
┃ │                                     │┃
┃ │ [✓ Approve Plan] [✗ Reject]       │┃
┃ └─────────────────────────────────────┘┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Viewer Panel Dashboard

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👁️ Viewer Panel - Read Only             ┃
┃ Monitor plans and system status         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ STATISTICS:                             ┃
┃ Total: 12 | Approved: 5 | Pending: 3   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ ALL PLANS (View Only):                  ┃
┃                                         ┃
┃ ┌─────────────────────────────────────┐┃
┃ │ TMQ-MDU Section                     │┃
┃ │ Status: APPROVED ✅                 │┃
┃ │ AI Score: 94%                       │┃
┃ │                    [View Only] 👁️  │┃
┃ └─────────────────────────────────────┘┃
┃                                         ┃
┃ ┌─────────────────────────────────────┐┃
┃ │ SRT-CVP Section                     │┃
┃ │ Status: ASSIGNED ✓                  │┃
┃ │ Assigned: Electrical                │┃
┃ │                    [View Only] 👁️  │┃
┃ └─────────────────────────────────────┘┃
┃                                         ┃
┃ ⚠️ READ-ONLY ACCESS:                   ┃
┃ No approval or assignment rights        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🔐 Permission Matrix

| Action | Admin | Planner | Viewer |
|--------|:-----:|:-------:|:------:|
| **Create Plans** | ✅ | ✅ | ❌ |
| **Run AI Optimizer** | ✅ | ✅ | ❌ |
| **View All Plans** | ✅ | ✅ | ✅ |
| **Approve Plans** | ✅ | ❌ | ❌ |
| **Reject Plans** | ✅ | ❌ | ❌ |
| **Assign to Departments** | ✅ | ✅ | ❌ |
| **Check Availability** | ✅ | ✅ | ❌ |
| **View Reports** | ✅ | ✅ | ✅ |
| **View Digital Twin** | ✅ | ✅ | ✅ |
| **User Management** | ✅ | ❌ | ❌ |

---

## 📋 Plan Status Flow

```
PROPOSED       (Created by Planner, awaiting Admin)
    ↓
APPROVED       (Admin approved, ready for assignment)
    ↓
ASSIGNED       (Planner assigned to department)
    ↓
IN PROGRESS    (Department executing)
    ↓
COMPLETED      (Work finished)

Alternative Path:
PROPOSED → CANCELLED (Admin rejected)
```

---

## 🎯 Use Case Examples

### Example 1: Normal Flow

**Day 1 - Morning:**
1. **Planner** creates track grinding plan
2. Runs AI optimizer
3. Plan status: PROPOSED

**Day 1 - Afternoon:**
4. **Admin** reviews plan
5. Checks 94% AI confidence
6. Clicks "Approve"
7. Plan status: APPROVED

**Day 2 - Morning:**
8. **Planner** sees approved plan
9. Checks Civil department availability
10. Assigns to Civil department
11. Plan status: ASSIGNED

**Day 2 - Implementation:**
12. Civil department executes work
13. Plan status: IN PROGRESS
14. **Viewer** monitors progress
15. Work completed
16. Plan status: COMPLETED

---

### Example 2: Rejection & Revision

**Scenario:** Admin finds safety concern

1. **Planner** creates plan
2. **Admin** reviews
3. **Admin** finds issue (conflict with special train)
4. **Admin** clicks "Reject"
5. Plan status: CANCELLED
6. **Planner** notified
7. **Planner** creates revised plan
8. **Admin** approves new plan
9. **Planner** assigns to department

---

## 🔄 Department Assignment

### Available Departments:
1. **Civil** - Track, bridges, infrastructure
2. **Electrical** - Power supply, overhead equipment
3. **Signal & Telecom** - Signaling systems, communication
4. **Mechanical** - Rolling stock, machinery

### Assignment Modal (Planner):
```
┌─────────────────────────────────┐
│ Assign Plan to Department      │
├─────────────────────────────────┤
│ Section: TMQ-MDU               │
│                                │
│ Select Department:             │
│ [Civil                      📤]│
│ [Electrical                 📤]│
│ [Signal & Telecom           📤]│
│ [Mechanical                 📤]│
│                                │
│           [Cancel]             │
└─────────────────────────────────┘
```

---

## 🚀 Testing the System

### Test Scenario:

```bash
# 1. Start application
npm run dev

# 2. Login as Planner
Click "Planner" button
Navigate to /planner-panel
Click "AI Block Optimizer"
Run optimization
Plan created with status="Proposed"
Logout

# 3. Login as Admin
Click "Admin" button
Navigate to /admin-panel
See "Pending Approvals: 1"
Review the plan
Click "Approve Plan"
Plan status changes to "Approved"
Logout

# 4. Login as Planner again
Navigate to /planner-panel
See the approved plan
Click "Assign" button
Select "Civil" department
Plan status changes to "Assigned"
Plan assigned to Civil department ✅
Logout

# 5. Login as Viewer
Click "Viewer" button
Navigate to /viewer-panel
See all plans (read-only)
Can view but cannot approve/assign ✅
No action buttons available
```

---

## 📝 Database Schema Updates

### New Fields in `maintenance_blocks` table:

```sql
-- Approval tracking
approved_by TEXT
approved_at TIMESTAMPTZ
rejected_by TEXT
rejected_at TIMESTAMPTZ
rejection_reason TEXT

-- Assignment tracking
assigned_department TEXT CHECK (assigned_department IN 
  ('Civil', 'Signal & Telecom', 'Electrical', 'Mechanical'))
assigned_by TEXT
assigned_at TIMESTAMPTZ

-- Status updated
status TEXT CHECK (status IN 
  ('Proposed', 'Approved', 'Assigned', 'In Progress', 'Completed', 'Cancelled'))
```

---

## ✅ Implementation Checklist

- [x] Planner Panel: Create plans + Assign to departments
- [x] Admin Panel: Inspect + Approve/Reject plans
- [x] Viewer Panel: Read-only view (no actions)
- [x] Assignment modal with 4 departments
- [x] Plan status flow (Proposed → Approved → Assigned)
- [x] Database schema updated
- [x] Permissions correctly enforced

---

## 🎓 Summary

### Three Distinct Roles:

1. **Planner** = **CREATOR + ASSIGNER**
   - Creates plans
   - Checks availability
   - Assigns to departments

2. **Admin** = **APPROVER + INSPECTOR**
   - Reviews plans
   - Approves/Rejects
   - System oversight

3. **Viewer** = **MONITOR ONLY**
   - Views everything
   - No approval rights
   - No assignment rights

---

**Status**: ✅ CORRECTED AND IMPLEMENTED  
**Last Updated**: September 2, 2026  
**Version**: 2.0.0 (Corrected Workflow)

---

**Built with ❤️ for Indian Railways**  
**Correct Workflow. Clear Roles. Efficient Operations.**
