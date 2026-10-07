# 🎯 Smart India Hackathon 2026 - Demo Preparation Checklist

## Project: RailBlockAI - Intelligent Railway Maintenance Orchestration

---

## 📅 Timeline: 1 Week Before Demo

### Day 1-2: Database & Backend Setup ✅

#### Database Setup (2 hours)
- [ ] **Open Supabase Dashboard**
  - URL: https://pmvjhnnjftbhnleymzqb.supabase.co
  - Navigate to SQL Editor

- [ ] **Run Database Schema**
  - Copy content from `database_schema.sql`
  - Execute in Supabase SQL Editor
  - Verify all 10 tables created
  - Check indexes and policies created

- [ ] **Verify Database**
  ```sql
  -- Run this query to verify
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' 
  ORDER BY table_name;
  ```
  Should show: assets, available_block_windows, corridors, maintenance_blocks, maintenance_block_tasks, maintenance_tasks, railway_sections, simulation_events, stations, train_movements

#### Backend Setup (1 hour)
- [ ] **Install Python Dependencies**
  ```bash
  cd backend
  pip install -r requirements.txt
  pip install scikit-learn numpy ortools  # ML dependencies
  ```

- [ ] **Start Backend Server**
  ```bash
  python -m app.main
  ```

- [ ] **Test Backend Health**
  - Open: http://127.0.0.1:8000/health
  - Should return: `{"status": "healthy"}`

- [ ] **Test API Documentation**
  - Open: http://127.0.0.1:8000/docs
  - Verify all endpoints visible

- [ ] **Run Backend Tests**
  - Execute: `test-backend.bat`
  - Verify all 5 API calls work

---

### Day 3: Frontend Setup & Integration ✅

#### Frontend Setup (1 hour)
- [ ] **Install Node Dependencies**
  ```bash
  npm install
  ```

- [ ] **Verify Environment Variables**
  - Check `.env` file exists
  - Confirm Supabase URL and KEY are correct

- [ ] **Start Frontend Server**
  ```bash
  npm run dev
  ```
  - Should open at: http://localhost:5173

#### Data Seeding (30 mins)
- [ ] **Seed Database via Frontend**
  1. Open browser console (F12)
  2. Run command:
     ```javascript
     // Import api (if not in module scope)
     const { api } = await import('./src/services/api.js');
     
     // Reset and seed
     await api.resetAndSeedDatabase();
     console.log('Database seeded successfully!');
     ```
  3. Verify in Supabase Table Editor that data exists

- [ ] **Verify Data in Supabase**
  - Check `corridors` table has 1 row
  - Check `stations` table has 7 rows
  - Check `railway_sections` table has 6 rows
  - Check `maintenance_tasks` table has 9 rows
  - Check `assets` table has data
  - Check `train_movements` table has 4 rows
  - Check `available_block_windows` table has 4 rows

#### Frontend Testing (1 hour)
- [ ] **Test All Pages Load**
  - [ ] Dashboard: http://localhost:5173/#/dashboard
  - [ ] Maintenance Intelligence: http://localhost:5173/#/maintenance-intelligence
  - [ ] Asset Health: http://localhost:5173/#/asset-health
  - [ ] AI Priority Engine: http://localhost:5173/#/ai-priority-engine
  - [ ] Smart Block Bundling: http://localhost:5173/#/smart-block-bundling
  - [ ] AI Block Optimizer: http://localhost:5173/#/ai-block-optimizer
  - [ ] Weekly Planner: http://localhost:5173/#/weekly-planner
  - [ ] Monthly Planner: http://localhost:5173/#/monthly-planner
  - [ ] Digital Twin: http://localhost:5173/#/railway-digital-twin
  - [ ] Dynamic Replanning: http://localhost:5173/#/dynamic-replanning
  - [ ] What-If Simulator: http://localhost:5173/#/what-if-simulator
  - [ ] Reports: http://localhost:5173/#/reports-analytics
  - [ ] Settings: http://localhost:5173/#/settings

- [ ] **Test Core Workflows**
  - [ ] View dashboard metrics
  - [ ] Click section selector
  - [ ] View AI recommendations
  - [ ] Navigate between pages
  - [ ] Check data tables loading

---

### Day 4-5: Feature Testing & Demo Flow 🎯

#### Priority Engine Testing
- [ ] **Navigate to AI Priority Engine**
- [ ] **Test Priority Calculation**
  - Select a task from table
  - Click "Calculate Priority"
  - Verify priority score appears (0-100)
  - Check priority level (P1 Critical, High, Medium, Low)
  - Review explanation and key drivers

#### Block Optimizer Testing
- [ ] **Navigate to AI Block Optimizer**
- [ ] **Run Optimization**
  - Select corridor: CORR-SR-TEN-MDU
  - Select section: ALL or specific section
  - Click "Run Optimization"
  - Wait for results
  - Verify recommended blocks appear
  - Check optimization score (85-98%)
  - Review scheduled tasks vs unscheduled

#### Smart Bundling Testing
- [ ] **Navigate to Smart Block Bundling**
- [ ] **Generate Bundles**
  - Click "Generate Smart Bundles"
  - Verify candidate bundles appear
  - Check compatibility scores (>75%)
  - Review department coordination
  - Check cost savings calculation
- [ ] **Evaluate Bundle**
  - Select a bundle
  - Click "Evaluate Options"
  - Review Option A vs Option B comparison
  - Check efficiency gains
- [ ] **Approve Bundle**
  - Click "Approve Bundle"
  - Verify success message
  - Check status changes to "Approved"

#### Planning Testing
- [ ] **Weekly Planner**
  - Click "Generate Weekly Plan"
  - Verify 7-day schedule appears
  - Check daily blocks with tasks
  - Review KPIs (blocks, tasks, utilization)
  
- [ ] **Monthly Planner**
  - Click "Generate Monthly Plan"
  - Verify 30-day strategic plan
  - Check key maintenance days
  - Review monthly KPIs

#### Dynamic Replanning Testing
- [ ] **Navigate to Dynamic Replanning**
- [ ] **Test Emergency Injection**
  - Add emergency task details
  - Click "Inject & Replan"
  - Verify new schedule generated
  - Check impact on existing blocks

#### What-If Simulator Testing
- [ ] **Navigate to What-If Simulator**
- [ ] **Run Simulations**
  - [ ] Equipment Failure scenario
  - [ ] Weather Delay scenario
  - [ ] Emergency Work scenario
  - Review impact analysis for each
  - Check affected sections
  - Verify recommendations

---

### Day 6: Demo Preparation 🎬

#### Create Demo Script
- [ ] **Prepare Story Flow**
  1. **Introduction** (2 mins)
     - Problem statement
     - Current challenges in railway maintenance
     
  2. **Solution Overview** (2 mins)
     - RailBlockAI features
     - Tech stack
     
  3. **Live Demo** (10 mins)
     - Dashboard walkthrough
     - Priority calculation
     - Block optimization
     - Smart bundling
     - Planning
     - Simulation
     
  4. **Results & Impact** (2 mins)
     - Key metrics
     - Cost savings
     - Efficiency gains
     
  5. **Q&A** (4 mins)

- [ ] **Prepare Demo Data**
  - Ensure all tables have fresh data
  - Create 2-3 compelling scenarios
  - Prepare "worst case" example for what-if

- [ ] **Take Screenshots**
  - [ ] Dashboard with metrics
  - [ ] Priority calculation results
  - [ ] Optimization output
  - [ ] Smart bundle comparison
  - [ ] Weekly/monthly plans
  - [ ] Simulation results

#### Practice Demo (3 hours)
- [ ] **Run Full Demo End-to-End**
  - Time each section
  - Note any slow API calls
  - Fix any UI bugs
  - Smooth transitions

- [ ] **Prepare for Questions**
  - How does ML model work?
  - What is OR-Tools?
  - How accurate is priority scoring?
  - Can it scale to other corridors?
  - Database schema design?
  - Security measures?

- [ ] **Backup Plans**
  - If Supabase down → Use localStorage fallback
  - If backend fails → Have screenshots
  - If internet fails → Run locally

---

### Day 7: Final Polish & Testing 🚀

#### Performance Optimization
- [ ] **Test Page Load Times**
  - Dashboard < 2 seconds
  - API calls < 3 seconds
  - Optimization < 5 seconds

- [ ] **Browser Testing**
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Edge

- [ ] **Mobile Responsive Check**
  - Open on mobile browser
  - Verify layout adapts

#### Documentation Review
- [ ] **Update README.md**
  - Confirm all links work
  - Update screenshots if needed
  - Add any new features

- [ ] **Code Cleanup**
  - Remove console.logs
  - Fix linting errors: `npm run lint`
  - Remove commented code

#### Final Deployment Check
- [ ] **Production Build Test**
  ```bash
  npm run build
  npm run preview
  ```
  - Verify build succeeds
  - Test built version

- [ ] **Environment Variables**
  - Double-check `.env` file
  - Ensure no secrets exposed in code

---

## 🎯 Demo Day Checklist

### 2 Hours Before Demo
- [ ] **System Check**
  - [ ] Start backend: `cd backend && python -m app.main`
  - [ ] Start frontend: `npm run dev`
  - [ ] Verify both running
  - [ ] Test all core features once

- [ ] **Data Refresh**
  - [ ] Clear browser cache
  - [ ] Reseed database if needed
  - [ ] Verify fresh data loads

- [ ] **Backup Preparation**
  - [ ] Have screenshots ready
  - [ ] Have video recording (optional)
  - [ ] Have presentation slides

### 30 Minutes Before Demo
- [ ] **Final Tests**
  - [ ] Open all pages once
  - [ ] Test priority calculation
  - [ ] Test optimization
  - [ ] Test bundling

- [ ] **Mental Preparation**
  - [ ] Review key talking points
  - [ ] Practice transitions
  - [ ] Prepare for questions

### During Demo
- [ ] **Stay Calm**
- [ ] **Explain as You Go**
- [ ] **Highlight Unique Features**
  - ML failure prediction
  - OR-Tools optimization
  - Cross-department bundling
  - Real railway domain (TEN-MDU)
- [ ] **Show Impact**
  - Cost savings
  - Downtime reduction
  - Punctuality improvement

---

## 📊 Key Metrics to Highlight

### Optimization Results
- ✅ **88-98%** optimization scores
- ✅ **5.6-14.5 hours** downtime saved per week
- ✅ **₹8.4 Lakhs** cost savings per bundle
- ✅ **100%** predicted on-time punctuality
- ✅ **7-19** train conflicts prevented per week

### Technical Achievements
- ✅ **Multi-objective** constraint programming
- ✅ **Random Forest** ML model for risk prediction
- ✅ **96.5%** bundle compatibility scoring
- ✅ **Real-time** simulation engine
- ✅ **157.1 KM** corridor coverage

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
**Solution:**
```bash
cd backend
pip install --upgrade -r requirements.txt
python -m app.main
```

### Issue: Frontend API errors
**Solution:**
1. Check backend is running (http://127.0.0.1:8000/health)
2. Verify `.env` has correct values
3. Check browser console for specific error

### Issue: No data showing
**Solution:**
1. Open browser console
2. Run: `await api.resetAndSeedDatabase()`
3. Refresh page

### Issue: Optimization taking too long
**Solution:**
- Reduce section filter (select specific section instead of ALL)
- Check backend logs for errors
- Ensure OR-Tools installed: `pip install ortools`

---

## 📞 Emergency Contacts

- **Team Lead**: [Your Name]
- **Backend Dev**: [Name]
- **Frontend Dev**: [Name]
- **Database Admin**: [Name]

---

## 🎉 Success Criteria

Your demo is successful if:
- ✅ All pages load without errors
- ✅ Priority calculation works and shows results
- ✅ Optimization generates recommended blocks
- ✅ Smart bundling creates and evaluates bundles
- ✅ Planning generates weekly/monthly schedules
- ✅ Simulation shows impact analysis
- ✅ Judges understand the value proposition
- ✅ Technical questions answered confidently

---

## 📝 Post-Demo Actions

After the demo:
- [ ] Collect feedback from judges
- [ ] Note improvement suggestions
- [ ] Save all demo recordings
- [ ] Backup final codebase
- [ ] Celebrate your hard work! 🎉

---

**Last Updated**: August 26, 2026  
**Next Review**: 1 Day Before Demo  
**Status**: Ready for Testing Phase ✅

---

## 🎓 Learning Resources

If judges ask technical questions:

**OR-Tools**: Google's optimization library for constraint programming  
**Random Forest**: Ensemble ML algorithm using multiple decision trees  
**Supabase**: Open-source Firebase alternative (PostgreSQL + Auth)  
**FastAPI**: Modern Python web framework with auto-generated docs  
**React 19**: Latest version with improved performance  

---

**Good Luck! You've got this! 💪🚂✨**
