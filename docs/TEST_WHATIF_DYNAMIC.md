# 🧪 Testing What-If Simulator - Dynamic Values

## ✅ Changes Applied & Frontend Restarted

The What-If Simulator now has:
1. ✅ Dynamic calculations based on scenario and parameters
2. ✅ Console logging to verify calculations
3. ✅ Fresh frontend restart (no cache)

---

## 🔍 How to Verify It's Dynamic

### Step 1: Open Browser Console
1. Open http://localhost:5173
2. Press **F12** to open DevTools
3. Click the **Console** tab
4. Keep it open while testing

### Step 2: Navigate to What-If Simulator
1. In the app, click "What-If Simulator" in sidebar
2. You're now on the simulation page

### Step 3: Run Test with Different Parameters

#### Test A: Train Delay 30min
1. Select scenario: **"A. Train Delay (Headway Conflict)"**
2. Select parameter: **30 min**
3. Click **"Run What-If Simulation"**
4. **Check console** - You should see:
   ```
   [What-If Simulator] Running dynamic calculations for: {
     scenarioType: "TRAIN_DELAY",
     parameter: 30,
     ...
   }
   [What-If Simulator] Calculated metrics: {
     optScore: "95.0",
     availAfter: "97.5%",
     tasksAffected: 1,
     conflictsFound: 1,
     ...
   }
   ```
5. **Check UI** - Should show:
   - Optimization Score: **95.0%**
   - Tasks Protected: **1 Task**
   - Conflicts: **1**

#### Test B: Train Delay 120min
1. **DON'T RELOAD PAGE**
2. Change parameter to: **120 min**
3. Click **"Run What-If Simulation"** again
4. **Check console** - Should show:
   ```
   [What-If Simulator] Running dynamic calculations for: {
     scenarioType: "TRAIN_DELAY",
     parameter: 120,
     ...
   }
   [What-If Simulator] Calculated metrics: {
     optScore: "87.0",  // DIFFERENT!
     availAfter: "96.8%",  // DIFFERENT!
     tasksAffected: 3,  // DIFFERENT!
     conflictsFound: 2,  // DIFFERENT!
     ...
   }
   ```
5. **Check UI** - Should NOW show:
   - Optimization Score: **87.0%** (was 95.0%)
   - Tasks Protected: **3 Tasks** (was 1)
   - Conflicts: **2** (was 1)
   - Reasoning text should mention "3 scheduled maintenance blocks" and "deferring 1 non-critical task by 24 hours"

---

## 📊 Expected Values for Each Scenario

### Scenario A: Train Delay
| Parameter | Opt Score | Tasks | Conflicts | Availability |
|-----------|-----------|-------|-----------|--------------|
| 30 min    | 95.0%     | 1     | 1         | 97.5%        |
| 60 min    | 91.0%     | 2     | 1         | 97.5%        |
| 90 min    | 89.0%     | 2     | 2         | 96.8%        |
| 120 min   | 87.0%     | 3     | 2         | 96.8%        |

### Scenario B: Emergency Maintenance
| Parameter | Opt Score | Tasks | Conflicts | Availability |
|-----------|-----------|-------|-----------|--------------|
| 45 min    | 91.8%     | 2     | 2         | 97.0%        |
| 75 min    | 90.3%     | 3     | 2         | 97.0%        |
| 120 min   | 88.0%     | 4     | 3         | 95.2%        |
| 180 min   | 85.0%     | 6     | 3         | 95.2%        |

### Scenario C: Block Window Unavailable
| Parameter | Opt Score | Tasks | Conflicts | Availability |
|-----------|-----------|-------|-----------|--------------|
| 60 min    | 90.6%     | 2     | 2         | 96.5%        |
| 90 min    | 89.4%     | 3     | 2         | 96.5%        |
| 120 min   | 88.2%     | 3     | 4         | 94.8%        |
| 180 min   | 85.8%     | 5     | 4         | 94.8%        |

### Scenario D: Duration Over-run
| Parameter | Opt Score | Tasks | Conflicts | Availability |
|-----------|-----------|-------|-----------|--------------|
| 30 min    | 89.5%     | 2     | 1         | 97.2%        |
| 60 min    | 87.0%     | 3     | 3         | 95.5%        |
| 90 min    | 84.5%     | 4     | 3         | 95.5%        |
| 120 min   | 82.0%     | 5     | 3         | 95.5%        |

### Scenario E: Traffic Surge
| Parameter | Opt Score | Tasks | Conflicts | Availability |
|-----------|-----------|-------|-----------|--------------|
| 10%       | 89.0%     | 3     | 1         | 96.0%        |
| 25%       | 86.0%     | 5     | 3         | 94.0%        |
| 50%       | 81.0%     | 7     | 5         | 94.0%        |

---

## 🎯 Quick Verification Test

### 5-Minute Test to Prove It's Dynamic:

1. **Open What-If Simulator**
2. **Test 1:** Train Delay 30 min → Run
   - Note the score: Should be ~95%
3. **Test 2:** Change to 120 min → Run
   - Note the score: Should be ~87% (DIFFERENT!)
4. **Test 3:** Switch to Emergency Maintenance 45 min → Run
   - Note the score: Should be ~91.8% (DIFFERENT AGAIN!)
5. **Test 4:** Change to 180 min → Run
   - Note the score: Should be ~85% (CHANGED!)

**If all 4 tests show DIFFERENT scores, it's working!** ✅

---

## 🐛 If Still Showing Same Values

### Check 1: Browser Cache
1. Hard refresh: **Ctrl + Shift + R** (Chrome/Edge)
2. Or: Ctrl + F5
3. Or: Close browser completely and reopen

### Check 2: Console Logs
Open browser console and look for:
```
[What-If Simulator] Running dynamic calculations for: ...
[What-If Simulator] Calculated metrics: ...
[What-If Simulator] Final results: ...
```

**If you see these logs, calculations ARE running!**

### Check 3: Copy Console Output
If it's still not working:
1. Run a simulation
2. Copy ALL console output
3. Send it to me

I'll be able to see exactly what values are being calculated.

---

## 📱 Visual Indicators of Dynamic Behavior

When working correctly, you should see:

1. **Optimization Score changes** (95% → 87% → 91.8% → 85%)
2. **Tasks Affected changes** (1 → 3 → 2 → 6)
3. **Conflicts count changes** (1 → 2 → 3)
4. **Reasoning text is different** each time
5. **Availability % changes** (97.5% → 96.8% → 95.2%)
6. **Feedback message** shows different numbers

---

## 🎬 For Demo

**Show mentors this sequence:**

1. "Let me show you the simulator adapts to different scenarios"
2. Run Train Delay 30min → "See, 95% score, 1 task"
3. Change to 120min → "Now 87% score, 3 tasks - it got harder!"
4. Switch to Emergency → "Different scenario, different strategy"
5. **Point to console:** "You can see the calculations happening live"

---

## ✅ Success Criteria

You'll know it's working when:
- ✅ Different parameters give different scores
- ✅ Console shows calculation logs
- ✅ Reasoning text changes per scenario
- ✅ Numbers in metrics cards update
- ✅ Feedback message shows varying numbers

---

**Frontend Restarted:** Yes ✅  
**Code Updated:** Yes ✅  
**Console Logging:** Added ✅  
**Ready to Test:** Yes ✅

**Test now at:** http://localhost:5173 → What-If Simulator
