# 🏗️ Role-Based Access Control - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Login Page                               │
│                                                                  │
│   ┌───────────┐    ┌───────────┐    ┌───────────┐             │
│   │   Admin   │    │  Planner  │    │  Viewer   │             │
│   │   Button  │    │   Button  │    │   Button  │             │
│   └─────┬─────┘    └─────┬─────┘    └─────┬─────┘             │
└─────────┼──────────────────┼────────────────┼───────────────────┘
          │                  │                │
          ▼                  ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AuthContext                                 │
│                                                                  │
│  user = {                                                        │
│    role: "Admin" | "Planner" | "Viewer"                        │
│    full_name: "..."                                             │
│    department: "..."                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      App.jsx Routes                              │
│                                                                  │
│  /admin-panel        → RoleProtectedRoute(['Admin'])            │
│  /planner-panel      → RoleProtectedRoute(['Admin','Planner'])  │
│  /viewer-panel       → RoleProtectedRoute(['All'])              │
│  /ai-priority-engine → RoleProtectedRoute(['Admin','Planner'])  │
│  /dashboard          → All roles                                │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Sidebar Navigation                            │
│                                                                  │
│  getNavSections(user.role) → Filters menu items by role        │
│                                                                  │
│  ┌─────────────┬─────────────┬─────────────┐                  │
│  │    Admin    │   Planner   │   Viewer    │                  │
│  ├─────────────┼─────────────┼─────────────┤                  │
│  │ Admin Panel │      -      │      -      │                  │
│  │ Planner     │ Planner     │      -      │                  │
│  │ Viewer      │ Viewer      │ Viewer      │                  │
│  │ Dashboard   │ Dashboard   │ Dashboard   │                  │
│  │ Priority    │ Priority    │      -      │                  │
│  │ Bundling    │ Bundling    │      -      │                  │
│  │ Optimizer   │ Optimizer   │      -      │                  │
│  │ Planner     │ Planner     │      -      │                  │
│  │ Twin        │ Twin        │ Twin        │                  │
│  │ Reports     │ Reports     │ Reports     │                  │
│  └─────────────┴─────────────┴─────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Panel Components                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ AdminPanel.jsx                                           │  │
│  │ ┌────────────┐ ┌────────────┐ ┌────────────┐          │  │
│  │ │   Users    │ │   Config   │ │ Audit Logs │          │  │
│  │ │ Management │ │  Database  │ │   System   │          │  │
│  │ └────────────┘ └────────────┘ └────────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PlannerPanel.jsx                                         │  │
│  │ ┌────────────┐ ┌────────────┐ ┌────────────┐          │  │
│  │ │ AI Priority│ │   Smart    │ │ Optimizer  │          │  │
│  │ │   Engine   │ │  Bundling  │ │  Planning  │          │  │
│  │ └────────────┘ └────────────┘ └────────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ViewerPanel.jsx                                          │  │
│  │ ┌────────────┐ ┌────────────┐ ┌────────────┐          │  │
│  │ │ Dashboard  │ │   Asset    │ │  Digital   │          │  │
│  │ │  Viewing   │ │   Health   │ │    Twin    │          │  │
│  │ └────────────┘ └────────────┘ └────────────┘          │  │
│  │ ⚠️ Read-Only Access                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Flow

```
┌───────────────┐
│  Login Page   │
└───────┬───────┘
        │ Select Role
        ▼
┌───────────────┐
│  AuthContext  │ ◄─── Stores user.role
└───────┬───────┘
        │
        ├─────────────────────────────────┐
        │                                 │
        ▼                                 ▼
┌────────────────┐              ┌─────────────────┐
│    App.jsx     │              │  Sidebar.jsx    │
│                │              │                 │
│ RoleProtected  │              │ getNavSections  │
│    Routes      │              │ (filters menu)  │
└────────┬───────┘              └────────┬────────┘
         │                               │
         ▼                               ▼
┌──────────────────────────────────────────────┐
│           Panel Components                    │
│  AdminPanel | PlannerPanel | ViewerPanel    │
└──────────────────────────────────────────────┘
```

---

## Security Layers

```
Layer 1: Route Protection
├─ RoleProtectedRoute.jsx
├─ Checks user.role against allowedRoles
└─ Shows AccessDenied if unauthorized

Layer 2: Navigation Filtering
├─ getNavSections(userRole)
├─ Filters menu items by role
└─ Hides restricted options

Layer 3: UI Component Guards
├─ {isPlannerOrAdmin && <Button />}
├─ Conditional rendering
└─ Feature-level protection

Layer 4: Visual Indicators
├─ Role badge in sidebar
├─ Access denied screens
└─ Permission notices
```

---

## Data Flow

```
User Login
    │
    ▼
Role Assignment (AuthContext)
    │
    ▼
Route Request
    │
    ├─→ RoleProtectedRoute Check
    │       │
    │       ├─→ Authorized → Render Component
    │       │
    │       └─→ Unauthorized → Access Denied Screen
    │
    ▼
Sidebar Renders
    │
    └─→ getNavSections(role) → Filtered Menu
```

---

## Role Permission Hierarchy

```
                    ┌───────────┐
                    │   Admin   │ ← Full Access
                    │  (Level 3)│
                    └─────┬─────┘
                          │
                    Inherits ↓
                          │
                    ┌─────▼─────┐
                    │  Planner  │ ← Operational Access
                    │ (Level 2) │
                    └─────┬─────┘
                          │
                    Inherits ↓
                          │
                    ┌─────▼─────┐
                    │  Viewer   │ ← Read-Only Access
                    │ (Level 1) │
                    └───────────┘

Admin = Planner permissions + Admin permissions
Planner = Viewer permissions + Planning permissions
Viewer = Base viewing permissions only
```

---

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.jsx      (Authentication)
│   │   └── RoleProtectedRoute.jsx  (Authorization) ✨ NEW
│   └── layout/
│       ├── AppLayout.jsx
│       └── Sidebar.jsx             (Modified) ✨
│
├── pages/
│   ├── AdminPanel.jsx              ✨ NEW
│   ├── PlannerPanel.jsx            ✨ NEW
│   ├── ViewerPanel.jsx             ✨ NEW
│   ├── Dashboard.jsx               (Shared)
│   ├── AssetHealth.jsx             (Shared)
│   ├── AIPriorityEngine.jsx        (Planner+)
│   ├── SmartBlockBundling.jsx      (Planner+)
│   ├── AIBlockOptimizer.jsx        (Planner+)
│   ├── WeeklyPlanner.jsx           (Planner+)
│   ├── MonthlyPlanner.jsx          (Planner+)
│   ├── RailwayDigitalTwin.jsx      (Shared)
│   ├── DynamicReplanning.jsx       (Planner+)
│   ├── WhatIfSimulator.jsx         (Planner+)
│   ├── ReportsAnalytics.jsx        (Shared)
│   └── Settings.jsx                (Shared)
│
├── context/
│   └── AuthContext.jsx             (Provides user.role)
│
└── App.jsx                         (Modified) ✨

Legend:
✨ NEW = Newly created
(Modified) = Updated for RBAC
(Shared) = All roles can access
(Planner+) = Planner and Admin only
```

---

## State Management

```javascript
// AuthContext
const AuthContext = {
  user: {
    id: 'usr-001',
    email: 'admin@railblock.ai',
    role: 'Admin',           // ← Key for RBAC
    full_name: 'Er. S. Kumar',
    department: 'Control',
    division: 'Madurai'
  },
  isAuthenticated: true,
  login: Function,
  logout: Function,
  loginWithDemoRole: Function
}

// Usage in Components
const { user } = useAuth();
const userRole = user?.role?.toLowerCase();

// Permission Check
const hasAccess = allowedRoles.includes(userRole);
```

---

## Route Configuration

```javascript
// App.jsx Route Structure

<Routes>
  <Route path="/login" />
  
  <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
    
    {/* Role-Specific Panels */}
    <Route path="admin-panel" 
           element={<RoleProtected roles={['Admin']}><AdminPanel /></>} />
    
    <Route path="planner-panel" 
           element={<RoleProtected roles={['Admin','Planner']}><PlannerPanel /></>} />
    
    <Route path="viewer-panel" 
           element={<RoleProtected roles={['All']}><ViewerPanel /></>} />
    
    {/* Shared Routes */}
    <Route path="dashboard" element={<Dashboard />} />
    
    {/* Planner+ Routes */}
    <Route path="ai-priority-engine" 
           element={<RoleProtected roles={['Admin','Planner']}><AIPriority /></>} />
    
    {/* ... more routes */}
  </Route>
</Routes>
```

---

## Access Matrix Implementation

```javascript
const ACCESS_MATRIX = {
  'Admin': {
    panels: ['admin', 'planner', 'viewer'],
    features: ['all'],
    pages: ['all']
  },
  'Planner': {
    panels: ['planner', 'viewer'],
    features: ['create', 'edit', 'optimize', 'plan'],
    pages: ['dashboard', 'priority', 'bundling', 'optimizer', 'planners', 'twin', 'replanning', 'simulator', 'reports']
  },
  'Viewer': {
    panels: ['viewer'],
    features: ['view'],
    pages: ['dashboard', 'asset-health', 'twin', 'reports']
  }
};
```

---

## Backend Integration (Future)

```python
# FastAPI Role-Based Endpoints

from fastapi import Depends, HTTPException
from typing import List

def check_role(allowed_roles: List[str]):
    async def role_checker(user = Depends(get_current_user)):
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required roles: {allowed_roles}"
            )
        return user
    return role_checker

# Admin-only endpoint
@app.post("/api/admin/users", dependencies=[Depends(check_role(["Admin"]))])
async def create_user(user_data: UserCreate):
    return {"status": "user created"}

# Planner+ endpoint
@app.post("/api/tasks", dependencies=[Depends(check_role(["Admin", "Planner"]))])
async def create_task(task: TaskCreate):
    return {"status": "task created"}

# All roles endpoint
@app.get("/api/dashboard")
async def get_dashboard(user = Depends(get_current_user)):
    return {"data": "dashboard data"}
```

---

## Testing Strategy

```
Test Suite: RBAC Implementation

1. Authentication Tests
   ✓ Login with each role
   ✓ Logout functionality
   ✓ Session persistence

2. Route Protection Tests
   ✓ Admin can access /admin-panel
   ✓ Planner cannot access /admin-panel
   ✓ Viewer cannot access /planner-panel
   ✓ All roles can access /dashboard

3. Navigation Tests
   ✓ Admin sees all menu items
   ✓ Planner sees filtered menu
   ✓ Viewer sees limited menu
   ✓ Role badge displays correctly

4. UI Component Tests
   ✓ "New Optimization" button for Planner+
   ✓ "New Optimization" hidden for Viewer
   ✓ Action buttons conditional rendering

5. Access Denied Tests
   ✓ Shows appropriate error message
   ✓ Displays current vs required role
   ✓ "Go Back" button works
```

---

## Performance Considerations

```
Optimizations Applied:

1. Route-Level Code Splitting
   - Each panel lazy loaded
   - Reduces initial bundle size

2. Conditional Rendering
   - Menu items filtered at runtime
   - No unnecessary component mounting

3. Role Caching
   - User role stored in context
   - No repeated API calls

4. Efficient Navigation
   - getNavSections() memoization possible
   - Filter logic optimized
```

---

## Security Best Practices

```
✅ Implemented:
   - Client-side route protection
   - Role-based menu filtering
   - Conditional UI rendering
   - Access denied screens

⚠️ TODO (Production):
   - Server-side permission validation
   - JWT token with role claims
   - Database-backed user roles
   - Audit logging for role changes
   - Rate limiting per role
   - CSRF protection
```

---

**Architecture Status**: ✅ Complete  
**Last Updated**: September 2, 2026  
**Version**: 1.0.0
