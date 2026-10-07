# 🎯 Three-Panel Workflow System

## Complete Workflow: From Planning to Execution

---

## 🎭 The Three Distinct Panels

### Panel 1: **Planner Panel** 🔧
**Role**: Section Engineer / Maintenance Coordinator  
**Route**: `/planner-panel`  
**Primary Function**: **CREATE & OPTIMIZE**

**Dashboard Features**:
- Quick action buttons for AI tools
- Recent tasks overview
- Planning statistics
- Optimization launcher

**Workflow**:
```
1. Create maintenance tasks
2. Run AI Priority Engine
3. Generate smart bundles
4. Execute block optimizer
5. Submit proposals for approval ➡️ VIEWER
```

---

### Panel 2: **Viewer Panel** 👁️
**Role**: Station Master / Safety Inspector  
**Route**: `/viewer-panel`  
**Primary Function**: **REVIEW & APPROVE** ⭐

**Dashboard Features**:
- ⚠️ **Pending Approvals Counter** (Prominent)
- AI optimization proposal cards
- Approve/Reject buttons
- Monitoring dashboards
- Reports access

**Workflow**:
```
1. Review proposals from PLANNER ⬅️
2. Check AI confidence scores
3. Verify schedule compatibility
4. APPROVE ✅ or REJECT ❌
5. Approved proposals → Scheduled for execution
```

---

### Panel 3: **Admin Panel** 🛡️
**Role**: Chief Controller / System Administrator  
**Route**: `/admin-panel`  
**Primary Function**: **MANAGE & OVERSEE**

**Dashboard Features**:
- User management
- System configuration
- Database controls
- Audit logs
- Full system oversight

**Workflow**:
```
1. Manage users and permissions
2. Configure system settings
3. Override approvals (emergency)
4. Monitor all activities
5. Ensure compliance
```

---

## 📋 Complete Maintenance Block Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 1: PLANNING                              │
│                    (Planner Panel)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Planner creates │
                    │  maintenance     │
                    │  task           │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Runs AI         │
                    │  Priority Engine │
                    │  (Priority Score)│
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Runs Smart      │
                    │  Bundling        │
                    │  (Cross-dept)    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Runs AI Block   │
                    │  Optimizer       │
                    │  (Time Window)   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Proposal        │
                    │  Generated       │
                    │  Status:         │
                    │  "PROPOSED"      │
                    └────────┬─────────┘
                             │
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 2: APPROVAL                              │
│                    (Viewer Panel) ⭐                             │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Station Master  │
                    │  sees proposal   │
                    │  in dashboard    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Reviews:        │
                    │  • AI Score: 94% │
                    │  • Time Window   │
                    │  • Section       │
                    │  • Duration      │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
          ┌──────────────┐   ┌──────────────┐
          │   APPROVE    │   │    REJECT    │
          │              │   │              │
          │  Click "✓   │   │  Click "✗   │
          │  Approve &   │   │  Reject"     │
          │  Schedule"   │   │              │
          └──────┬───────┘   └──────┬───────┘
                 │                   │
                 ▼                   ▼
        ┌────────────────┐   ┌────────────────┐
        │  Status:       │   │  Status:       │
        │  "APPROVED"    │   │  "CANCELLED"   │
        └────────┬───────┘   └────────┬───────┘
                 │                     │
                 │                     └─────────┐
                 │                               │
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 3: EXECUTION                             │
│                    (All Panels Can Monitor)                      │
└─────────────────────────────────────────────────────────────────┘
                 │                               │
                 ▼                               ▼
        ┌────────────────┐            ┌──────────────────┐
        │  Block         │            │  Planner notified│
        │  Scheduled     │            │  Create new      │
        │  Status:       │            │  proposal        │
        │  "In Progress" │            └──────────────────┘
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │  Maintenance   │
        │  Executed      │
        │  Status:       │
        │  "COMPLETED"   │
        └────────────────┘
```

---

## 🎨 Visual Differences

### Planner Panel View
```
┌─────────────────────────────────────────────┐
│ 🔧 Maintenance Planner Panel                │
│ Create, optimize, and manage schedules      │
├─────────────────────────────────────────────┤
│                                             │
│ Quick Actions:                              │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ AI       │ │ Smart    │ │ Block    │   │
│ │ Priority │ │ Bundling │ │ Optimizer│   │
│ └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│ Recent Tasks:                               │
│ • Track Grinding - Pending                  │
│ • Signal Renewal - In Progress              │
└─────────────────────────────────────────────┘
```

### Viewer Panel View
```
┌─────────────────────────────────────────────┐
│ 👁️ Monitoring & Analytics Panel             │
│ View-only access + Approval authority       │
├─────────────────────────────────────────────┤
│                                             │
│ ⚠️ PENDING APPROVALS: 3                     │
│ Requires Your Review                        │
│                                             │
│ Proposal #1:                                │
│ 🤖 AI OPTIMIZATION  94% CONFIDENCE          │
│ TMQ-MDU Section                            │
│ Tomorrow 02:15 - 04:15 AM                  │
│                                             │
│ [✓ Approve & Schedule] [✗ Reject]         │
│                                             │
│ Monitoring Views:                           │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │Dashboard │ │  Asset   │ │ Digital  │   │
│ │  (View)  │ │  Health  │ │   Twin   │   │
│ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────┘
```

### Admin Panel View
```
┌─────────────────────────────────────────────┐
│ 🛡️ Admin Control Panel                      │
│ Full system administration                  │
├─────────────────────────────────────────────┤
│                                             │
│ System Management:                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │  User    │ │ Database │ │  Audit   │   │
│ │  Mgmt    │ │ Settings │ │   Logs   │   │
│ └──────────┘ └──────────┘ └──────────┘   │
│                                             │
│ Statistics:                                 │
│ Total Users: 3                             │
│ Total Tasks: 26                            │
│ Critical: 4                                │
└─────────────────────────────────────────────┘
```

---

## 🔄 Interaction Scenarios

### Scenario 1: Standard Workflow
**Actors**: Planner → Viewer → System

1. **Planner (Er. R. Ramesh)**:
   - Logs into Planner Panel
   - Creates task "Track Grinding TMQ-MDU"
   - Runs AI Block Optimizer
   - System proposes: Tomorrow 02:15-04:15 AM
   - Submits proposal (Status: "Proposed")

2. **Viewer (A. Sundaram)**:
   - Logs into Viewer Panel
   - Sees notification: "1 Pending Approval"
   - Reviews proposal card:
     - 94% AI confidence
     - Shadow window timing
     - No train conflicts
   - Clicks "Approve & Schedule"

3. **System**:
   - Updates status to "Approved"
   - Sends notification to Planner
   - Schedules block for execution
   - All panels can monitor progress

---

### Scenario 2: Rejection & Revision
**Actors**: Planner → Viewer → Planner

1. **Planner**: Proposes maintenance block
2. **Viewer**: Reviews and finds safety concern
3. **Viewer**: Clicks "Reject"
4. **System**: Notifies Planner
5. **Planner**: Creates revised proposal
6. **Viewer**: Reviews new proposal
7. **Viewer**: Approves revised version

---

### Scenario 3: Admin Override (Emergency)
**Actors**: Admin → System

1. **Emergency situation**: Track damage reported
2. **Admin**: Logs into Admin Panel
3. **Admin**: Creates emergency task
4. **Admin**: Bypasses normal approval
5. **Admin**: Directly marks as "Approved"
6. **System**: Immediately schedules
7. **Audit log**: Records emergency override

---

## 📊 Key Metrics by Panel

### Planner Panel Metrics
- Pending tasks created
- Optimization runs completed
- Proposals submitted
- Approval success rate

### Viewer Panel Metrics
- **Pending approvals (Primary)**
- Proposals reviewed
- Approval rate
- Average review time
- Rejections with reasons

### Admin Panel Metrics
- Total system users
- System health
- Database statistics
- Audit log entries
- Emergency overrides

---

## 🎯 Workflow States

### Task States
1. **Created** - New task by Planner
2. **Pending** - Awaiting optimization
3. **AI-Optimized** - Optimization complete
4. **Proposed** - Awaiting Viewer approval
5. **Approved** - Ready for scheduling
6. **In Progress** - Currently executing
7. **Completed** - Successfully finished
8. **Cancelled** - Rejected or cancelled

### Panel-State Relationship

| State | Planner Can | Viewer Can | Admin Can |
|-------|-------------|------------|-----------|
| Created | Edit/Delete | View | Edit/Delete |
| Pending | Optimize | View | Optimize |
| AI-Optimized | Submit | View | Submit |
| **Proposed** | View | **Approve/Reject** | Override |
| Approved | View | View | Modify |
| In Progress | Monitor | Monitor | Monitor |
| Completed | View | View | View |

---

## 🔐 Security & Separation of Duties

### Principle: Checks and Balances
- ✅ Planners cannot approve their own proposals
- ✅ Viewers cannot create new tasks
- ✅ Separation between creation and approval
- ✅ Admin can override for emergencies only
- ✅ All actions logged in audit trail

### Access Levels
```
Level 1 (Viewer):   Read + Approve
Level 2 (Planner):  Create + Optimize
Level 3 (Admin):    All + Configure + Override
```

---

## 📱 Navigation Summary

### URL Routes
```
Admin:   http://localhost:5173/#/admin-panel
Planner: http://localhost:5173/#/planner-panel
Viewer:  http://localhost:5173/#/viewer-panel
```

### Sidebar Visibility

**Planner sees**:
- ✅ Planner Panel
- ✅ Viewer Panel
- ✅ All planning tools
- ❌ Admin Panel

**Viewer sees**:
- ✅ Viewer Panel (Primary)
- ✅ Dashboard
- ✅ Reports
- ❌ Admin Panel
- ❌ Planning tools

**Admin sees**:
- ✅ Everything

---

## 🎓 Quick Reference

### For Planners
**I want to create a maintenance block:**
1. Go to Planner Panel
2. Click "AI Block Optimizer"
3. Select section and configure
4. Run optimization
5. Submit proposal
6. Wait for Viewer approval

### For Viewers
**I want to approve a proposal:**
1. Go to Viewer Panel
2. Check "Pending Approvals" section
3. Review proposal details
4. Verify no conflicts
5. Click "Approve & Schedule"

### For Admins
**I want to manage the system:**
1. Go to Admin Panel
2. Access user management
3. Configure system settings
4. Review audit logs
5. Handle emergency overrides

---

## 🚀 Getting Started

### Test the Workflow

1. **Start application**: `npm run dev`

2. **Login as Planner**:
   - Click "Planner" button
   - Navigate to `/planner-panel`
   - Click "AI Block Optimizer"
   - Create a proposal

3. **Switch to Viewer**:
   - Logout
   - Click "Viewer" button
   - See the proposal in "Pending Approvals"
   - Approve or reject it

4. **Check as Admin**:
   - Logout
   - Click "Admin" button
   - View audit logs
   - See the complete workflow

---

**Workflow Status**: ✅ Fully Functional  
**Last Updated**: September 2, 2026  
**Version**: 1.0.0

---

**Built with ❤️ for Indian Railways**  
**Three Roles. Three Panels. One Efficient System.**
