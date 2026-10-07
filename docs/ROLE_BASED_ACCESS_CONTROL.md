# 🔐 Role-Based Access Control (RBAC) System

## Overview

RailBlockAI now implements a comprehensive **three-tier role-based access control system** that provides different functionality based on user roles. Each role has its own dedicated panel with tailored features and permissions.

---

## 🎭 Three User Roles

### 1. **👑 Admin** - Full System Control
**Description**: Chief Controller / System Administrator with complete access to all features and system management.

**Access Level**: Full Control (Read + Write + Delete + Configure)

**Dedicated Panel**: `/admin-panel`

#### Capabilities:
- ✅ **User Management**
  - Create and manage user accounts
  - Assign and revoke permissions
  - View user activity logs
  
- ✅ **System Configuration**
  - Database settings and management
  - API configuration
  - System-wide parameters
  
- ✅ **Full Planning & Operations**
  - All planner capabilities
  - Create and modify maintenance tasks
  - Run optimization algorithms
  - Approve and schedule blocks
  
- ✅ **Analytics & Monitoring**
  - System health monitoring
  - Audit logs and compliance
  - Performance metrics
  - Advanced reporting

#### Accessible Pages:
- Admin Control Panel ⭐ (Exclusive)
- Planner Dashboard
- Monitoring Panel
- Dashboard
- Maintenance Intelligence
- Asset Health
- AI Priority Engine
- Smart Block Bundling
- AI Block Optimizer
- Weekly/Monthly Planners
- Railway Digital Twin
- Dynamic Replanning
- What-If Simulator
- Reports & Analytics
- Settings

---

### 2. **⚙️ Planner** - Maintenance Planning & Optimization
**Description**: Senior Section Engineer / Maintenance Coordinator responsible for planning and executing maintenance operations.

**Access Level**: Read + Write (Operational Planning)

**Dedicated Panel**: `/planner-panel`

#### Capabilities:
- ✅ **Task Management**
  - Create maintenance tasks
  - Modify pending tasks
  - Set priorities and deadlines
  
- ✅ **AI-Powered Planning**
  - Run priority engine calculations
  - Generate smart block bundles
  - Execute block optimization
  - Create weekly/monthly plans
  
- ✅ **Schedule Management**
  - View and approve schedules
  - Handle dynamic replanning
  - Run what-if simulations
  
- ✅ **Resource Allocation**
  - Assign machines and teams
  - Manage possession windows
  - Coordinate cross-department tasks

- ⚠️ **Limited Access**
  - Cannot create/delete users
  - Cannot modify system configuration
  - Cannot access admin logs

#### Accessible Pages:
- Planner Dashboard ⭐ (Primary)
- Monitoring Panel
- Dashboard
- Maintenance Intelligence
- Asset Health
- AI Priority Engine
- Smart Block Bundling
- AI Block Optimizer
- Weekly/Monthly Planners
- Railway Digital Twin
- Dynamic Replanning
- What-If Simulator
- Reports & Analytics
- Settings

---

### 3. **👁️ Viewer** - Monitoring & Approval Authority
**Description**: Station Master / Safety Inspector with monitoring access and **CRITICAL APPROVAL AUTHORITY** for maintenance proposals.

**Access Level**: Read + **Approve/Reject** Proposals

**Dedicated Panel**: `/viewer-panel`

#### Capabilities:
- ✅ **Approval Authority** ⭐ **PRIMARY FUNCTION**
  - **Review AI-generated optimization proposals**
  - **Approve proposed maintenance blocks**
  - **Reject proposals with safety concerns**
  - Final sign-off before scheduling
  
- ✅ **Dashboard Viewing**
  - Monitor live system status
  - View maintenance schedules
  - Track asset health
  - See pending approvals counter
  
- ✅ **Reports & Analytics**
  - Access read-only reports
  - View historical data
  - Export analytics
  
- ✅ **Visualization**
  - Railway digital twin viewing
  - Section health monitoring
  - Train movement tracking

- ❌ **Restricted Actions**
  - Cannot create or modify tasks
  - Cannot run optimizations
  - Cannot create new proposals
  - Cannot access admin functions
  - **Can only approve/reject existing proposals**

#### Accessible Pages:
- Monitoring Panel ⭐ (Primary)
- Dashboard (Read-Only)
- Asset Health (Read-Only)
- Railway Digital Twin (Read-Only)
- Reports & Analytics (Read-Only)
- Settings (Personal only)

---

## 🚀 Quick Start - Using Roles

### Login with Demo Users

The system comes with three pre-configured demo users:

```javascript
// Admin Login
Email: admin@railblock.ai
Role: Admin
Name: Er. S. Kumar (Chief Controller)
Department: Central Operating Control / IRSE

// Planner Login
Email: planner@railblock.ai
Role: Planner
Name: Er. R. Ramesh (Senior Section Engineer)
Department: Civil P-Way / TRD Coordination

// Viewer Login
Email: viewer@railblock.ai
Role: Viewer
Name: A. Sundaram (Station Operations)
Department: Station Master / Safety Inspector
```

### One-Click Login

On the login page, click the role buttons for instant access:
- **Admin** button → Full system access
- **Planner** button → Planning tools access
- **Viewer** button → Read-only monitoring

---

## 🔒 Permission Matrix

| Feature | Admin | Planner | Viewer |
|---------|-------|---------|--------|
| **View Dashboard** | ✅ | ✅ | ✅ |
| **View Asset Health** | ✅ | ✅ | ✅ |
| **View Reports** | ✅ | ✅ | ✅ |
| **Digital Twin** | ✅ | ✅ | ✅ (View Only) |
| **Create Tasks** | ✅ | ✅ | ❌ |
| **Modify Tasks** | ✅ | ✅ | ❌ |
| **Delete Tasks** | ✅ | ⚠️ (Own only) | ❌ |
| **Run Optimization** | ✅ | ✅ | ❌ |
| **Smart Bundling** | ✅ | ✅ | ❌ |
| **Weekly Planning** | ✅ | ✅ | ❌ |
| **Monthly Planning** | ✅ | ✅ | ❌ |
| **Replanning** | ✅ | ✅ | ❌ |
| **What-If Simulator** | ✅ | ✅ | ❌ |
| **Approve Proposals** ⭐ | ✅ | ⚠️ (Not own) | ✅ |
| **Reject Proposals** ⭐ | ✅ | ⚠️ (Not own) | ✅ |
| **User Management** | ✅ | ❌ | ❌ |
| **System Config** | ✅ | ❌ | ❌ |
| **Audit Logs** | ✅ | ❌ | ❌ |
| **New Optimization Button** | ✅ | ✅ | ❌ |

⭐ **Key Viewer Capability**: Station Masters/Safety Inspectors must approve all AI-generated maintenance proposals before execution.

---

## 🛠️ Technical Implementation

### 1. Route Protection

Routes are protected using `RoleProtectedRoute` component:

```jsx
<Route 
  path="admin-panel" 
  element={
    <RoleProtectedRoute allowedRoles={['Admin']}>
      <AdminPanel />
    </RoleProtectedRoute>
  } 
/>

<Route 
  path="planner-panel" 
  element={
    <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
      <PlannerPanel />
    </RoleProtectedRoute>
  } 
/>
```

### 2. Dynamic Sidebar Navigation

The sidebar automatically shows/hides menu items based on user role:

```javascript
export const getNavSections = (userRole) => {
  const role = userRole?.toLowerCase();
  
  // Filter items based on role permissions
  const sections = [
    {
      group: 'ROLE PANELS',
      items: [
        role === 'admin' && { path: '/admin-panel', ... },
        (role === 'admin' || role === 'planner') && { path: '/planner-panel', ... },
        { path: '/viewer-panel', ... } // All roles
      ].filter(Boolean)
    }
    // ... more sections
  ];
  
  return sections.filter(section => section.items.length > 0);
};
```

### 3. Component-Level Access Control

```jsx
const { user } = useAuth();
const isPlannerOrAdmin = ['admin', 'planner'].includes(user?.role?.toLowerCase());

{isPlannerOrAdmin && (
  <button onClick={createTask}>Create New Task</button>
)}
```

### 4. Access Denied Screen

When unauthorized access is attempted, users see a friendly access denied screen explaining:
- What role is required
- Their current role
- Why access is restricted

---

## 📱 Panel Features Comparison

### Admin Panel Features
- 📊 System statistics dashboard
- 👥 User management interface
- 🔧 System configuration tools
- 📜 Audit log viewer
- 🔍 Activity monitoring
- ⚙️ Database management
- 📈 Performance metrics

### Planner Panel Features
- ⚡ Quick action buttons for AI tools
- 📋 Recent tasks overview
- 📊 Planning statistics
- 🚀 One-click optimization launch
- 📅 Schedule management
- 🔄 Replanning capabilities

### Viewer Panel Features
- 👁️ Live system monitoring
- 📊 Read-only statistics
- 🗺️ Visual dashboards
- 📑 Report viewing
- 🔍 Asset health overview
- ⭐ **Proposal approval interface** (PRIMARY FUNCTION)
- ✅ **Approve/Reject optimization proposals**
- 🔔 Pending approvals counter
- 📋 Proposal review cards

---

## 🔐 Security Features

### 1. Route-Level Protection
- Unauthorized users cannot access protected routes
- Automatic redirect to access denied page
- Role verification on every page load

### 2. UI Element Hiding
- Menu items dynamically filtered by role
- Action buttons hidden for unauthorized users
- Form fields disabled based on permissions

### 3. Session Management
- Role stored in user session
- Role persists across page reloads
- Role verification on API calls (backend)

### 4. Visual Indicators
- Current role badge in sidebar
- Color-coded panel headers
- Permission notices on restricted pages

---

## 🎨 Visual Design

### Color Schemes by Role

**Admin Panel**
- Primary: Purple/Indigo gradient
- Icon: Shield
- Accent: Purple-600

**Planner Panel**
- Primary: Blue/Cyan gradient
- Icon: Wrench
- Accent: Blue-600

**Viewer Panel**
- Primary: Teal/Green gradient
- Icon: Eye
- Accent: Teal-600

---

## 🔄 Switching Roles

### During Development/Demo

1. **Logout** from current session
2. **Return to login page**
3. **Click desired role button** (Admin/Planner/Viewer)
4. **Automatically logged in** with that role

### In Production

1. Contact system administrator
2. Administrator assigns role via Admin Panel
3. Logout and login again
4. New permissions applied

---

## 📝 Best Practices

### For Admins
✅ Regularly review user permissions
✅ Monitor audit logs for unusual activity
✅ Keep system configurations documented
✅ Assign minimum required permissions

### For Planners
✅ Focus on your assigned sections
✅ Review AI recommendations before approval
✅ Coordinate with other departments
✅ Document planning decisions

### For Viewers
✅ Monitor for anomalies and report
✅ Stay informed of schedule changes
✅ Use reports for operational decisions
✅ Request planner access if needed

---

## 🚨 Troubleshooting

### "Access Denied" Error

**Problem**: User sees access denied screen

**Solutions**:
1. Verify your role with admin
2. Check if you're logged in
3. Try logout and login again
4. Contact system administrator

### Missing Menu Items

**Problem**: Expected menu items not visible

**Solutions**:
1. Confirm your role has access
2. Check permission matrix above
3. Refresh the page
4. Clear browser cache

### Cannot Create Tasks

**Problem**: Create button not visible or disabled

**Solutions**:
1. Ensure you have Planner or Admin role
2. Viewer role is read-only
3. Request role upgrade from admin

---

## 📚 Related Documentation

- `IMPLEMENTATION_GUIDE.md` - Full setup guide
- `QUICK_START.md` - Getting started
- `README.md` - Project overview
- `SIH_DEMO_CHECKLIST.md` - Demo preparation

---

## 🎯 Future Enhancements

### Planned Features
- [ ] Custom role creation
- [ ] Granular permission editor
- [ ] Department-based access control
- [ ] Time-based permissions
- [ ] Multi-factor authentication
- [ ] Role request workflow
- [ ] Permission audit trail
- [ ] Role analytics dashboard

---

## 📞 Support

For role-related issues or questions:
- Check this documentation first
- Contact your system administrator
- Review permission matrix
- Check troubleshooting section

---

**Last Updated**: September 2, 2026  
**Version**: 1.0.0  
**Status**: Fully Implemented ✅

---

**Built with ❤️ for Indian Railways**  
**Secure. Scalable. Role-Based.**
