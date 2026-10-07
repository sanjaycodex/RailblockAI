# ⚡ RailBlockAI - Quick Start Guide

**Get up and running in 15 minutes!**

---

## 🎯 What You'll Accomplish

1. ✅ Set up Supabase database
2. ✅ Start backend API server
3. ✅ Start frontend application
4. ✅ Seed database with sample data
5. ✅ Test all features

---

## 📋 Prerequisites (Already Done!)

- ✅ Node.js installed
- ✅ Python installed
- ✅ Supabase account configured
- ✅ `.env` file with credentials

---

## 🚀 Step-by-Step Setup

### Step 1: Database Setup (5 minutes)

#### 1.1 Open Supabase Dashboard
```
URL: https://pmvjhnnjftbhnleymzqb.supabase.co
```

#### 1.2 Create Tables
1. Click **SQL Editor** in left sidebar
2. Click **New Query**
3. Open file: `database_schema.sql`
4. Copy entire content
5. Paste into SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for success message

#### 1.3 Verify Tables
Run this query:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see 10 tables:
- assets
- available_block_windows
- corridors
- maintenance_blocks
- maintenance_block_tasks
- maintenance_tasks
- railway_sections
- simulation_events
- stations
- train_movements

✅ **Database setup complete!**

---

### Step 2: Backend Setup (3 minutes)

#### 2.1 Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

Optional ML dependencies (recommended):
```bash
pip install scikit-learn numpy ortools
```

#### 2.2 Start Backend Server
```bash
python -m app.main
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

#### 2.3 Test Backend
Open browser: http://127.0.0.1:8000/health

Should display:
```json
{
  "status": "healthy",
  "service": "RailBlockAI Intelligence Service"
}
```

✅ **Backend is running!**

**Leave this terminal open and continue in a new terminal.**

---

### Step 3: Frontend Setup (3 minutes)

#### 3.1 Install Dependencies
Open **new terminal** in project root:
```bash
npm install
```

#### 3.2 Start Frontend Server
```bash
npm run dev
```

You should see:
```
  VITE v8.2.2  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 3.3 Open Application
Browser should auto-open to: http://localhost:5173

If not, manually open: http://localhost:5173

✅ **Frontend is running!**

---

### Step 4: Seed Database (2 minutes)

#### 4.1 Open Browser Console
Press **F12** to open Developer Tools

#### 4.2 Run Seed Command
In Console tab, paste and run:
```javascript
// Import API service
const { api } = await import('./src/services/api.js');

// Seed database
await api.resetAndSeedDatabase();

console.log('✅ Database seeded successfully!');
```

#### 4.3 Verify Data
1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Check these tables have data:
   - `corridors` → 1 row
   - `stations` → 7 rows
   - `railway_sections` → 6 rows
   - `maintenance_tasks` → 9 rows
   - `train_movements` → 4 rows
   - `available_block_windows` → 4 rows

✅ **Database seeded with sample data!**

---

### Step 5: Test Features (2 minutes)

#### 5.1 Test Dashboard
URL: http://localhost:5173/#/dashboard

Should see:
- Corridor metrics
- Section status cards
- AI recommendations
- Tasks table

#### 5.2 Test Priority Engine
1. Navigate to: **AI Priority Engine**
2. Click on any task in the table
3. Click **"Calculate Priority"** button
4. Verify priority score appears (0-100)

#### 5.3 Test Block Optimizer
1. Navigate to: **AI Block Optimizer**
2. Select Section: **ALL**
3. Click **"Run Optimization"** button
4. Wait 3-5 seconds
5. Verify recommended blocks appear

#### 5.4 Test Smart Bundling
1. Navigate to: **Smart Block Bundling**
2. Click **"Generate Smart Bundles"** button
3. Verify candidate bundles appear
4. Click **"Evaluate Options"** on any bundle
5. Review comparison

✅ **All core features working!**

---

## 🎉 Success! You're Ready!

Your RailBlockAI system is now fully operational!

---

## 🔗 Quick Links

| Resource | URL |
|----------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://127.0.0.1:8000 |
| **API Docs** | http://127.0.0.1:8000/docs |
| **Supabase** | https://pmvjhnnjftbhnleymzqb.supabase.co |

---

## 📱 Application Pages

| Page | Route |
|------|-------|
| Dashboard | `/dashboard` |
| AI Priority Engine | `/ai-priority-engine` |
| AI Block Optimizer | `/ai-block-optimizer` |
| Smart Block Bundling | `/smart-block-bundling` |
| Weekly Planner | `/weekly-planner` |
| Monthly Planner | `/monthly-planner` |
| Dynamic Replanning | `/dynamic-replanning` |
| What-If Simulator | `/what-if-simulator` |
| Digital Twin | `/railway-digital-twin` |
| Asset Health | `/asset-health` |
| Reports | `/reports-analytics` |

---

## 🛠️ Using the Quick Start Script

**Windows users** can use the automated script:

```bash
start-dev.bat
```

This will:
1. Open backend terminal
2. Open frontend terminal
3. Wait 10 seconds
4. Auto-open browser

---

## 🧪 Testing the API

### Using curl (Windows Command Prompt):

**Test Health:**
```bash
curl http://127.0.0.1:8000/health
```

**Test Priority Calculation:**
```bash
curl -X POST http://127.0.0.1:8000/api/priority/calculate ^
  -H "Content-Type: application/json" ^
  -d "{\"id\":\"TSK-001\",\"asset_criticality\":\"Critical\",\"severity\":\"High\"}"
```

**Test Optimization:**
```bash
curl -X POST http://127.0.0.1:8000/api/optimizer/run ^
  -H "Content-Type: application/json" ^
  -d "{\"corridor_id\":\"CORR-SR-TEN-MDU\",\"section_id\":\"ALL\"}"
```

**Or run the test script:**
```bash
test-backend.bat
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
pip install --upgrade -r requirements.txt
python -m app.main
```

### Frontend won't start
```bash
npm install
npm run dev
```

### No data showing
1. Press F12 (Developer Console)
2. Run: `await api.resetAndSeedDatabase()`
3. Refresh page

### Port already in use
**Backend (Port 8000):**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Frontend (Port 5173):**
```bash
# Find process using port 5173
netstat -ano | findstr :5173

# Kill process (replace PID)
taskkill /PID <PID> /F
```

---

## 📚 Next Steps

1. **Read Full Documentation**: `README.md`
2. **Setup Checklist**: `SIH_DEMO_CHECKLIST.md`
3. **Implementation Details**: `IMPLEMENTATION_GUIDE.md`
4. **Practice Demo Flow**: Test all features end-to-end

---

## 🎯 Demo-Ready Checklist

- [ ] Backend running without errors
- [ ] Frontend loads successfully
- [ ] Database has seed data
- [ ] Dashboard shows metrics
- [ ] Priority calculation works
- [ ] Optimization generates blocks
- [ ] Bundling creates candidates
- [ ] Planning generates schedules
- [ ] All pages accessible

---

## 💡 Pro Tips

1. **Keep both terminals open** (backend + frontend)
2. **Check browser console** (F12) for any errors
3. **Use API documentation** at http://127.0.0.1:8000/docs
4. **Refresh browser** if UI doesn't update
5. **Check Supabase logs** if database issues occur

---

## 🎓 Understanding the Stack

**Frontend:**
- React 19 → UI library
- Vite → Build tool
- Tailwind CSS → Styling
- Supabase Client → Database access

**Backend:**
- FastAPI → API framework
- Python → Programming language
- OR-Tools → Optimization solver
- scikit-learn → Machine learning

**Database:**
- Supabase → PostgreSQL hosting
- Row Level Security → Access control
- Real-time subscriptions → Live updates

---

## 📞 Need Help?

Check these files in order:
1. `QUICK_START.md` (this file) - Basic setup
2. `README.md` - Project overview
3. `IMPLEMENTATION_GUIDE.md` - Detailed instructions
4. `SIH_DEMO_CHECKLIST.md` - Demo preparation

---

## 🎉 Congratulations!

You now have a fully functional AI-powered railway maintenance orchestration system!

**Ready for your Smart India Hackathon demo! 🚂✨**

---

**Last Updated**: August 26, 2026  
**Estimated Setup Time**: 15 minutes  
**Status**: Production Ready ✅
