# 🔄 Approval Workflow System

## Overview

The RailBlockAI system implements a **three-tier approval workflow** where different roles have distinct responsibilities in the maintenance planning process.

---

## 🎭 Role Responsibilities

### 1. **Planner** - Creates & Optimizes
**Responsibilities**:
- Create maintenance tasks
- Run AI optimization algorithms
- Generate smart block bundles
- Propose maintenance blocks
- Submit proposals for approval

**Output**: Proposed maintenance blocks with AI confidence scores

---

### 2. **Viewer** - Reviews & Approves ⭐
**Responsibilities**:
- **Review AI-generated optimization proposals**
- **Approve or reject proposed maintenance blocks**
- Monitor system performance
- Access reports and analytics
- Track asset health

**Key Function**: **APPROVAL AUTHORITY**  
Station Masters and Safety Inspectors must approve all proposed maintenance blocks before they can be scheduled.

---

### 3. **Admin** - Oversees Everything
**Responsibilities**:
- All Planner capabilities
- All Viewer capabilities
- User management
- System configuration
- Audit and compliance

---

## 📋 Approval Workflow

```
┌──────────────┐
│   Planner    │
│  Creates     │
│  Tasks       │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Planner    │
│  Runs AI     │
│  Optimizer   │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  AI Optimization     │
│  Proposal Generated  │
│  Status: "Proposed"  │
└──────┬───────────────┘
       │
       ▼
┌────────────────────────────┐
│      Viewer Panel          │
│  "Pending Your Approval"   │
│                            │
│  [Approve] or [Reject]     │
└──────┬────────┬────────────┘
       │        │
       │        └─────────────┐
       │                      │
       ▼                      ▼
┌──────────────┐      ┌──────────────┐
│  APPROVED    │      │   REJECTED   │
│  Status:     │      │   Status:    │
│  "Approved"  │      │  "Cancelled" │
└──────┬───────┘      └──────────────┘
       │
       ▼
┌──────────────┐
│  Scheduled   │
│  For         │
│  Execution   │
└──────────────┘
```

---

## 🎯 Viewer Panel - Approval Interface

### Dashboard Components

#### 1. **Pending Approvals Counter** (Primary Metric)
```
┌─────────────────────────────┐
│  Pending Approvals: 3       │
│  Requires Your Review       │
└─────────────────────────────┘
```

#### 2. **AI Optimization Proposals Section**
Shows all proposals with status "Proposed"

Each proposal displays:
- 🤖 **AI Optimization Badge**
- 📊 **Confidence Score** (e.g., 94% Confidence)
- 🔵 **Ready to Apply Status**
- 📍 **Section Name**
- ⏰ **Proposed Time Window**
- ⌛ **Duration**
- ✅ **Approve & Schedule Button**
- ❌ **Reject Button**

---

## 🔐 Permission Matrix (Updated)

| Action | Admin | Planner | Viewer |
|--------|:-----:|:-------:|:------:|
| **Create Tasks** | ✅ | ✅ | ❌ |
| **Run Optimization** | ✅ | ✅ | ❌ |
| **Generate Proposals** | ✅ | ✅ | ❌ |
| **View Proposals** | ✅ | ✅ | ✅ |
| **Approve Proposals** | ✅ | ⚠️ | ✅ |
| **Reject Proposals** | ✅ | ⚠️ | ✅ |
| **View Reports** | ✅ | ✅ | ✅ |
| **Monitor Assets** | ✅ | ✅ | ✅ |

⚠️ Planners typically don't approve their own proposals (separation of duties)

---

## 📊 Status Flow

### Maintenance Block Statuses

1. **Proposed** - Created by Planner, awaiting Viewer approval
2. **Approved** - Approved by Viewer, ready for scheduling
3. **In Progress** - Currently being executed
4. **Completed** - Successfully finished
5. **Cancelled** - Rejected by Viewer or cancelled by Admin

---

## 💡 Use Cases

### Use Case 1: Normal Approval Flow

**Scenario**: Section Engineer proposes a maintenance block

1. **Planner** (Er. R. Ramesh):
   - Creates maintenance task for track grinding
   - Runs AI Block Optimizer
   - System generates optimal window: 02:15 AM - 04:15 AM
   - Proposal created with 94% confidence score

2. **Viewer** (A. Sundaram - Station Master):
   - Logs into Viewer Panel
   - Sees "1 Pending Approval" notification
   - Reviews proposal details:
     - Section: TMQ-MDU
     - Time: 02:15 - 04:15 (Shadow slot)
     - Punctuality impact: +2%
     - Cost savings: ₹3.8 Lakhs
   - Checks train schedule compatibility
   - Clicks "Approve & Schedule"

3. **System**:
   - Updates status to "Approved"
   - Notifies planning team
   - Block becomes available for execution

---

### Use Case 2: Rejection Flow

**Scenario**: Proposal conflicts with special train

1. **Viewer** reviews proposal
2. Notices conflict with VIP special train
3. Clicks "Reject"
4. Proposal status → "Cancelled"
5. Planner is notified to create alternative plan

---

### Use Case 3: Emergency Override

**Scenario**: Urgent maintenance needed

1. **Admin** can bypass approval process
2. Directly mark proposal as "Approved"
3. Or create and approve in single action
4. Emergency protocols documented in audit log

---

## 🎨 UI Design - Viewer Panel

### Proposal Card Design

```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 AI OPTIMIZATION    94% CONFIDENCE    🟠 READY TO APPLY   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ TMQ-MDU Section                                             │
│ Proposed: Tomorrow 02:15 AM - 04:15 AM                      │
│                                                              │
│ Duration: 120 mins    Status: Awaiting Approval             │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  [✓ Approve & Schedule]  [✗ Reject]                        │
└─────────────────────────────────────────────────────────────┘
```

### Color Coding

- **Orange Border**: Pending approval (requires action)
- **Green Button**: Approve
- **Red Button**: Reject
- **Blue Badge**: AI-generated
- **Confidence Colors**:
  - 🟢 ≥90%: High confidence
  - 🟡 75-89%: Medium confidence
  - 🔴 <75%: Low confidence (review carefully)

---

## 🔔 Notifications

### For Viewers
- Email/SMS when new proposal available
- In-app notification badge
- Dashboard alert banner
- Daily digest of pending approvals

### For Planners
- Approval confirmation notification
- Rejection notification with reason request
- Status change alerts

### For Admins
- Daily summary of approval activity
- Alerts for proposals pending >24 hours
- Audit log entries

---

## 📈 Metrics & Reporting

### Approval Dashboard Metrics

- **Pending Approvals**: Current count
- **Average Approval Time**: Target <4 hours
- **Approval Rate**: % of proposals approved
- **Rejection Reasons**: Categories for analysis

### Performance Tracking

```javascript
{
  total_proposals: 45,
  approved: 38,
  rejected: 5,
  pending: 2,
  approval_rate: 84%,
  avg_approval_time: "2.3 hours"
}
```

---

## 🔒 Security & Audit

### Audit Trail
Every approval/rejection is logged with:
- Timestamp
- Approver identity
- Proposal details
- Decision (approve/reject)
- Optional comments

### Compliance
- Separation of duties enforced
- Cannot approve own proposals
- Approval required before execution
- Full audit trail maintained

---

## 🚀 Implementation Details

### Database Schema

```sql
-- maintenance_blocks table
CREATE TABLE maintenance_blocks (
  id TEXT PRIMARY KEY,
  status TEXT CHECK (status IN (
    'Proposed',      -- Awaiting approval
    'Approved',      -- Ready to schedule
    'In Progress',   -- Currently executing
    'Completed',     -- Successfully done
    'Cancelled'      -- Rejected or cancelled
  )),
  optimization_score NUMERIC(5,2),
  approved_by TEXT,  -- User ID who approved
  approved_at TIMESTAMPTZ,
  rejected_by TEXT,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  -- ... other fields
);
```

### API Endpoints

```javascript
// Approve proposal
POST /api/blocks/{blockId}/approve
Authorization: Viewer or Admin
Response: { status: "Approved", message: "Block scheduled" }

// Reject proposal
POST /api/blocks/{blockId}/reject
Authorization: Viewer or Admin
Body: { reason: "Conflicts with special train" }
Response: { status: "Cancelled", message: "Proposal rejected" }
```

---

## 💼 Best Practices

### For Viewers (Approvers)
✅ Review proposals daily  
✅ Check train schedule conflicts  
✅ Verify safety requirements  
✅ Consider operational impact  
✅ Provide rejection reasons  
✅ Respond within 4 hours for urgent items

### For Planners (Proposers)
✅ Include detailed justification  
✅ Provide alternative time windows  
✅ Highlight AI confidence scores  
✅ Document expected benefits  
✅ Coordinate with departments  
✅ Revise rejected proposals

### For Admins
✅ Monitor approval bottlenecks  
✅ Review rejection patterns  
✅ Ensure timely responses  
✅ Maintain audit compliance  
✅ Train users on process

---

## 🎓 Training Scenarios

### Scenario 1: High-Confidence Proposal
- Confidence: 98%
- Punctuality Impact: +2.5%
- Cost Savings: ₹4.2 Lakhs
- **Action**: Quick approval recommended

### Scenario 2: Low-Confidence Proposal
- Confidence: 72%
- Multiple constraints
- **Action**: Careful review, request clarification

### Scenario 3: Conflicting Proposals
- Multiple proposals for same time window
- **Action**: Choose optimal, reject others with reason

---

## 📞 Escalation Process

### Level 1: Normal Approval
- Viewer reviews and approves
- Standard process

### Level 2: Consultation Needed
- Viewer consults with Planner
- Discussion before decision

### Level 3: Admin Override
- Complex situation
- Admin makes final decision
- Documented in audit log

---

**Workflow Status**: ✅ Implemented  
**Last Updated**: September 2, 2026  
**Version**: 1.0.0

---

**Built with ❤️ for Indian Railways**  
**Ensuring Safe and Efficient Maintenance Operations**
