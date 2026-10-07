# Testing Checklist - Before Demo

**Date**: August 29, 2026  
**Purpose**: Verify all recent changes work correctly before SIH demo

---

## Pre-Testing Setup

### 1. Ensure Both Servers Running

```bash
# Terminal 1 - Frontend
npm run dev
# Should show: http://localhost:5173

# Terminal 2 - Backend  
cd backend
python -m app.main
# Should show: http://127.0.0.1:8000
```

**Status**: ☐ Frontend running ☐ Backend running

---

## Toast Notifications Testing

### Dashboard (http://localhost:5173/#/dashboard)

**Action**: Click refresh button (↻ icon in top-right)

Expected behavior:
- ☐ Loading toast appears: "Refreshing corridor dashboard data..."
- ☐ Toast transitions to success: "✅ Dashboard refreshed: X tasks, Y available windows"
- ☐ Toast auto-dismisses after 4 seconds
- ☐ Dashboard data updates

**If error occurs**:
- ☐ Error toast appears: "❌ Error loading dashboard: [message]"
- ☐ Check browser console for details
- ☐ Verify backend is running

---

### AI Priority Engine (http://localhost:5173/#/ai-priority-engine)

**Action**: Click "Recalculate AI Priorities" button

Expected behavior:
- ☐ Loading toast: "Running Hybrid AI Engine (ML Risk + 4-Factor Priority Model)..."
- ☐ Button shows loading state (disabled)
- ☐ Success toast: "✅ Successfully recalculated X tasks via Hybrid AI Engine..."
- ☐ Toast stays for 5 seconds
- ☐ Table updates with new priority scores

**If error occurs**:
- ☐ Error toast: "❌ Recalculation error: [message]"
- ☐ Check backend logs
- ☐ Verify FastAPI service running

---

### Smart Block Bundling (http://localhost:5173/#/smart-block-bundling)

**Action 1**: Page loads (or click "Generate Smart Bundles")

Expected behavior:
- ☐ Loading toast: "Analyzing task compatibility and generating smart bundles..."
- ☐ Success toast: "✨ Discovered X high-compatibility cross-discipline candidate bundle(s)!"
- ☐ Bundles appear in list

**Action 2**: Click "Evaluate with Phase 3 Optimizer" on a bundle

Expected behavior:
- ☐ Loading toast: "Running Phase 3 OR-Tools Multi-Objective Solver..."
- ☐ Modal opens showing evaluation
- ☐ Success toast: "✅ OR-Tools optimization completed successfully!"
- ☐ Evaluation results display

**Action 3**: Click "Approve Possession Bundle" in modal

Expected behavior:
- ☐ Loading toast: "Approving bundle and deploying coordinated maintenance possession..."
- ☐ Success toast: "✅ Bundle [ID] approved and deployed as coordinated maintenance possession!"
- ☐ Toast duration 5 seconds
- ☐ Modal closes
- ☐ Bundle status updates to "Approved"

---

### Weekly Planner (http://localhost:5173/#/weekly-planner)

**Action 1**: Page loads (auto-generates plan)

Expected behavior:
- ☐ Loading toast: "Generating AI-optimized weekly possession masterplan..."
- ☐ Success toast: "✅ Weekly possession masterplan generated! X blocks across 7 days..."
- ☐ Toast duration 5 seconds
- ☐ Calendar grid populates with blocks

**Action 2**: Click "Approve Plan" button

Expected behavior:
- ☐ Loading toast: "Approving and deploying weekly plan to operational rosters..."
- ☐ Success toast: "✅ Weekly Plan [ID] approved and deployed to Madurai Division..."
- ☐ Toast duration 5 seconds
- ☐ Plan status updates

---

### Dynamic Replanning (http://localhost:5173/#/dynamic-replanning)

**Action**: Configure disruption, click "Simulate Disruption Event"

Expected behavior:
- ☐ Loading toast: "Simulating operational disruption and detecting conflicts..."
- ☐ Warning toast: "⚠️ Disruption simulated: X scheduled block(s) conflicted..."
- ☐ Toast duration 4 seconds
- ☐ Conflict results display below

---

## Map Testing

### Railway Digital Twin (http://localhost:5173/#/railway-digital-twin)

**Visual Verification**:

1. **OpenRailwayMap Overlay**:
   - ☐ Railway tracks visible on map (red/orange lines)
   - ☐ Tracks overlay matches base map features
   - ☐ Railway infrastructure clearly visible

2. **Station Markers** (verify all 7 stations):
   - ☐ TEN (Tirunelveli Junction) - Bottom left
   - ☐ **MEJ (Vanchi Maniyachchi)** - On railway track (NOT off to the side)
   - ☐ CVP (Kovilpatti)
   - ☐ SRT (Satur)
   - ☐ VPT (Virudhunagar)
   - ☐ TMQ (Tirumangalam)
   - ☐ MDU (Madurai Junction) - Top right

3. **MEJ Station Specific Check** (CRITICAL):
   - ☐ Click MEJ marker
   - ☐ Popup shows: "Vanchi Maniyachchi Jn (MEJ)"
   - ☐ Station Code: MEJ
   - ☐ Marker is positioned EXACTLY on the railway track line
   - ☐ Not displaced to the side or away from track

4. **Section Health Circles**:
   - ☐ 6 colored circles between stations
   - ☐ Colors: Red (critical), Amber (warning), Blue (good), Green (excellent)
   - ☐ Click circle shows section details popup

5. **Map Functionality**:
   - ☐ Zoom in/out works smoothly
   - ☐ Pan around corridor works
   - ☐ All markers clickable
   - ☐ Popups display correctly

---

## Loading States Testing

### Dashboard
- ☐ Initial load shows PageLoadingSpinner
- ☐ Message: "Loading corridor dashboard..."
- ☐ Spinner animates
- ☐ Content appears after loading

### Railway Digital Twin
- ☐ Initial load shows loading state
- ☐ Map loads smoothly
- ☐ All markers appear

---

## Error Handling Testing (Optional)

### Simulate Backend Error

1. Stop backend server
2. Navigate to Dashboard
3. Click refresh button

Expected:
- ☐ Error toast appears
- ☐ Console shows error details
- ☐ App doesn't crash
- ☐ User can continue navigating

**Restart backend after test**

---

## Browser Testing

Test in your primary browser (Chrome recommended):

**Chrome**:
- ☐ All toasts display correctly
- ☐ Map renders properly
- ☐ No console errors

**Firefox** (if time permits):
- ☐ Toasts work
- ☐ Map works

**Edge** (if time permits):
- ☐ Toasts work
- ☐ Map works

---

## Mobile Responsiveness (Optional)

If demo includes mobile/tablet view:

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPad" or "iPhone"

Check:
- ☐ Toasts appear correctly
- ☐ Map is usable
- ☐ Buttons accessible

---

## Performance Check

### Page Load Times (should be fast)

- ☐ Dashboard: < 2 seconds
- ☐ AI Priority Engine: < 2 seconds
- ☐ Smart Block Bundling: < 3 seconds
- ☐ Railway Digital Twin: < 3 seconds (map takes time)
- ☐ Weekly Planner: < 3 seconds

### Toast Performance

- ☐ Toasts appear immediately when action triggered
- ☐ No lag or delay
- ☐ Smooth animations
- ☐ No toast stacking issues

---

## Common Issues & Solutions

### Issue: Toast not appearing

**Solutions**:
1. Check browser console for errors
2. Verify `<Toaster />` in App.jsx
3. Check import statement: `import toast from 'react-hot-toast'`
4. Hard refresh: Ctrl+Shift+R

### Issue: MEJ station still misplaced

**Solutions**:
1. Hard refresh page (Ctrl+Shift+R)
2. Clear browser cache
3. Verify RailwayMap.jsx has coordinates: `lat: 9.0253, lng: 77.9503`
4. Restart dev server

### Issue: Backend errors

**Solutions**:
1. Check backend logs in terminal
2. Verify Python environment activated
3. Check requirements installed: `pip install -r requirements.txt`
4. Restart backend server

### Issue: Toasts stay forever

**Solutions**:
1. Check if using `id` parameter to replace loading toast
2. Verify pattern: `toast.success('...', { id: loadingToast })`
3. Check duration is set in App.jsx Toaster config

---

## Demo Preparation

### Final Checks Before Demo

1. **Backend running**: ☐
2. **Frontend running**: ☐
3. **All toasts tested**: ☐
4. **Map verified**: ☐
5. **No console errors**: ☐
6. **All pages accessible**: ☐

### Pages to Have Ready

**Tab 1**: Dashboard (http://localhost:5173/#/dashboard)
**Tab 2**: AI Priority Engine (http://localhost:5173/#/ai-priority-engine)
**Tab 3**: Smart Block Bundling (http://localhost:5173/#/smart-block-bundling)
**Tab 4**: Railway Digital Twin (http://localhost:5173/#/railway-digital-twin)

### Demo Script

1. **Start at Dashboard**:
   - "This is our command center..."
   - Click refresh → Show toast notification
   - "Notice the real-time feedback"

2. **Navigate to AI Priority Engine**:
   - "Our ML-powered priority system..."
   - Click recalculate → Show toast
   - "ML risk model updates rankings"

3. **Navigate to Smart Block Bundling**:
   - "Cross-discipline coordination..."
   - Show bundling → Evaluate → Approve flow
   - "Notice professional feedback at each step"

4. **Navigate to Railway Digital Twin**:
   - "Real-world corridor visualization..."
   - Zoom to MEJ station
   - "Exact GPS coordinates for all stations"
   - Show OpenRailwayMap overlay

---

## Backup Plan

### If Something Breaks During Demo

**Have these ready**:
1. Screenshots of working features
2. Video recording of successful toast flow
3. Backup browser tab with everything pre-loaded
4. Explanation prepared: "This is a development build; production would be stable"

---

## Success Criteria

### All Tests Pass ✅

- ☐ All 5+ toast notification actions work
- ☐ MEJ station correctly positioned
- ☐ Map renders with railway overlay
- ☐ No console errors
- ☐ All pages load quickly
- ☐ Professional UX throughout

### Demo Confidence Level

**Target**: 9.5/10 ⭐⭐⭐⭐⭐

After all tests pass, you should feel confident demonstrating:
- Real-time user feedback system
- Professional UX design
- Accurate railway mapping
- ML-powered optimization
- Cross-discipline coordination

---

## Notes Section

Use this space to note any issues during testing:

**Issue 1**:
- Description: 
- Solution:
- Status: ☐ Fixed ☐ Workaround ☐ Known limitation

**Issue 2**:
- Description:
- Solution:
- Status: ☐ Fixed ☐ Workaround ☐ Known limitation

---

## Final Sign-Off

When all checks pass:

- ☐ All toast notifications working (9/9 actions)
- ☐ MEJ station correctly positioned on map
- ☐ No critical console errors
- ☐ Both servers running stable
- ☐ Demo tabs prepared
- ☐ Backup plan ready

**Status**: ☐ READY FOR DEMO! 🚀

---

**Tester**: _____________  
**Date Tested**: August 29, 2026  
**Time Spent**: _______ minutes  
**Issues Found**: _______  
**Issues Resolved**: _______  
**Demo Confidence**: ___/10

---

**Next Step**: Practice your demo script! 🎯
