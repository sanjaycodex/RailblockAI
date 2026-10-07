# 🚀 Manual Project Setup & Run Guide

## 📋 Prerequisites

Before running the project, ensure you have these installed:

### Required Software:
- ✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- ✅ **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- ✅ **Git** (optional, for version control)

### Check Installations:
```powershell
# Check Node.js version
node --version
# Should show: v18.x.x or higher

# Check npm version
npm --version
# Should show: 9.x.x or higher

# Check Python version
python --version
# Should show: Python 3.9.x or higher

# Check pip version
pip --version
# Should show: pip 23.x.x or higher
```

---

## 🔧 Step-by-Step Setup

### Step 1: Open Two Terminal Windows

You need **two separate terminal windows**:
- **Terminal 1:** For Frontend (React)
- **Terminal 2:** For Backend (Python)

#### Option A: Using PowerShell
1. Press `Win + X`
2. Select "Windows PowerShell" (or "Terminal")
3. Open a second PowerShell window the same way

#### Option B: Using Command Prompt
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Repeat for a second terminal

#### Option C: Using VS Code Terminal
1. Open VS Code
2. Press `` Ctrl + ` `` (backtick) to open terminal
3. Click the `+` icon to open a second terminal
4. Use split terminal feature

---

### Step 2: Navigate to Project Directory

**In BOTH terminals**, navigate to your project folder:

```powershell
cd "C:\Users\srisa\OneDrive\Documents\Desktop\SIH 26"
```

Verify you're in the correct directory:
```powershell
dir
# You should see: backend/, src/, package.json, etc.
```

---

## 🎨 Terminal 1: Frontend Setup & Run

### Step 1: Install Frontend Dependencies

**First time only** (installs React, Vite, TailwindCSS, etc.):

```powershell
npm install
```

This will take 2-5 minutes. You should see:
```
added XXX packages
```

**If you see errors:**
- Try: `npm install --legacy-peer-deps`
- Or: `npm cache clean --force` then `npm install`

### Step 2: Start Frontend Development Server

```powershell
npm run dev
```

**Expected Output:**
```
  VITE v8.2.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Frontend is now running at:** http://localhost:5173

### Troubleshooting Frontend:

**Error: "Cannot find module"**
```powershell
# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
npm run dev
```

**Error: "Port 5173 already in use"**
```powershell
# Find and kill the process using port 5173
netstat -ano | findstr :5173
# Note the PID (last column)
taskkill /F /PID <PID_NUMBER>
# Then run npm run dev again
```

**Error: "npm not recognized"**
- Node.js is not installed or not in PATH
- Reinstall Node.js and restart terminal

---

## 🐍 Terminal 2: Backend Setup & Run

### Step 1: Navigate to Backend Directory

```powershell
cd backend
```

Verify:
```powershell
dir
# You should see: app/, requirements.txt, etc.
```

### Step 2: Create Python Virtual Environment (First Time Only)

**Create virtual environment:**
```powershell
python -m venv venv
```

This creates a `venv` folder with isolated Python packages.

### Step 3: Activate Virtual Environment

**Every time you open a new terminal:**

```powershell
# PowerShell
.\venv\Scripts\Activate.ps1

# Command Prompt (cmd)
.\venv\Scripts\activate.bat
```

**You'll see `(venv)` prefix in your terminal:**
```powershell
(venv) PS C:\Users\srisa\OneDrive\Documents\Desktop\SIH 26\backend>
```

**If you get "scripts disabled" error:**
```powershell
# Run as Administrator:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Then try activating again
```

### Step 4: Install Python Dependencies (First Time Only)

```powershell
pip install -r requirements.txt
```

This installs:
- FastAPI (web framework)
- Uvicorn (server)
- Groq (AI chatbot)
- Scikit-learn (ML)
- OR-Tools (optimizer)
- Supabase (database)
- And more...

**Takes 3-5 minutes.** You should see:
```
Successfully installed fastapi-... uvicorn-... groq-... [etc]
```

**If you see errors:**
```powershell
# Upgrade pip first
python -m pip install --upgrade pip
# Then try again
pip install -r requirements.txt
```

### Step 5: Verify Environment Variables

Make sure `.env` file exists in the **root directory** (not in backend):

```powershell
# Go back to root
cd ..

# Check if .env exists
dir .env
```

**Contents of `.env` should have:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### Step 6: Start Backend Server

```powershell
# Make sure you're in backend directory and venv is activated
cd backend
python -m app.main
```

**Expected Output:**
```
[SupabaseService] Connected to Supabase at https://pmvjhnnjftbhnleymzqb.supabase.co
[FailureRiskService] Random Forest ML model initialized successfully.
[ChatService] Groq client initialized successfully
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started server process [XXXX]
INFO:     Application startup complete.
```

**Backend is now running at:** http://127.0.0.1:8000

### Troubleshooting Backend:

**Error: "No module named 'app'"**
```powershell
# Make sure you're in the backend directory
cd backend
# And running with python -m
python -m app.main
```

**Error: "No module named 'fastapi'"**
```powershell
# Virtual environment not activated or packages not installed
# Activate venv first:
.\venv\Scripts\Activate.ps1
# Then install:
pip install -r requirements.txt
```

**Error: "ModuleNotFoundError: No module named 'groq'"**
```powershell
# Install groq specifically
pip install groq
```

**Error: "Port 8000 already in use"**
```powershell
# Find and kill the process
netstat -ano | findstr :8000
# Note the PID
taskkill /F /PID <PID_NUMBER>
# Then run python -m app.main again
```

**Error: "GROQ_API_KEY not found"**
- Check `.env` file is in the root directory (not backend)
- Verify the file has `GROQ_API_KEY=your_key_here`
- Restart the backend server

---

## ✅ Verification - Both Services Running

### Check Frontend:
1. Open browser: http://localhost:5173
2. You should see the Railway Dashboard
3. Navigation sidebar on the left
4. KPI cards showing metrics

### Check Backend:
1. Open browser: http://127.0.0.1:8000/api/health
2. You should see: `{"status":"healthy","timestamp":"..."}`

### Check Both Together:
1. In the frontend UI, click "AI Copilot" (sparkles icon)
2. Type "Hi" and send
3. AI should respond (if backend is working)

---

## 🎯 Quick Start Commands (Copy-Paste)

### Open Two Terminals Side-by-Side

**Terminal 1 (Frontend):**
```powershell
cd "C:\Users\srisa\OneDrive\Documents\Desktop\SIH 26"
npm run dev
```

**Terminal 2 (Backend):**
```powershell
cd "C:\Users\srisa\OneDrive\Documents\Desktop\SIH 26\backend"
.\venv\Scripts\Activate.ps1
python -m app.main
```

---

## 🛑 How to Stop the Project

### Stop Frontend (Terminal 1):
Press `Ctrl + C` in the terminal running `npm run dev`

### Stop Backend (Terminal 2):
Press `Ctrl + C` in the terminal running `python -m app.main`

---

## 🔄 Daily Workflow

### Starting Work:
1. Open two terminals
2. **Terminal 1:** 
   ```powershell
   cd "C:\Users\srisa\OneDrive\Documents\Desktop\SIH 26"
   npm run dev
   ```
3. **Terminal 2:**
   ```powershell
   cd "C:\Users\srisa\OneDrive\Documents\Desktop\SIH 26\backend"
   .\venv\Scripts\Activate.ps1
   python -m app.main
   ```
4. Open http://localhost:5173 in browser

### While Working:
- Frontend auto-reloads when you edit React files
- Backend auto-reloads when you edit Python files (thanks to Uvicorn watch mode)
- Keep both terminals visible to see logs

### Ending Work:
- Press `Ctrl + C` in both terminals
- Close browser tab
- Close terminals

---

## 📁 Project Structure

```
SIH 26/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── ml/             # ML models
│   │   ├── optimization/   # OR-Tools optimizer
│   │   ├── services/       # Supabase, etc.
│   │   └── main.py         # Entry point
│   ├── venv/               # Virtual environment (created by you)
│   └── requirements.txt    # Python dependencies
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── services/           # API calls
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
├── package.json            # Node dependencies
└── vite.config.js          # Vite configuration
```

---

## 🧪 Testing Individual Components

### Test Backend Only:
```powershell
# Start backend
cd backend
.\venv\Scripts\Activate.ps1
python -m app.main

# In another terminal, test API:
curl http://127.0.0.1:8000/api/health
```

### Test Frontend Only:
```powershell
# Start frontend
npm run dev

# Open browser to http://localhost:5173
```

### Test Database Connection:
```powershell
# Start backend and check logs for:
[SupabaseService] Connected to Supabase at https://...
```

### Test Groq AI:
```powershell
# Start backend and check logs for:
[ChatService] Groq client initialized successfully

# Test via command:
$body = '{"messages":[{"role":"user","content":"Hi"}]}'
Invoke-WebRequest -Uri http://127.0.0.1:8000/api/chat/send -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found" Errors

**Frontend:**
```powershell
rm -rf node_modules
rm package-lock.json
npm install
```

**Backend:**
```powershell
pip install -r requirements.txt
```

### Issue 2: Ports Already in Use

**Frontend (5173):**
```powershell
netstat -ano | findstr :5173
taskkill /F /PID <PID>
```

**Backend (8000):**
```powershell
netstat -ano | findstr :8000
taskkill /F /PID <PID>
```

### Issue 3: Virtual Environment Issues

**Can't activate venv:**
```powershell
# Delete and recreate
rmdir /s /q venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Issue 4: Environment Variables Not Loading

**Check .env location:**
```powershell
# Should be in root, not backend
dir .env
# If in wrong place, move it:
move backend\.env .env
```

### Issue 5: Supabase Connection Failed

**Check .env has correct keys:**
```env
VITE_SUPABASE_URL=https://pmvjhnnjftbhnleymzqb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Check internet connection** - Supabase is cloud-based

### Issue 6: Groq API Not Working

**Check .env has key:**
```env
GROQ_API_KEY=your_groq_api_key_here
```

**Check backend logs:**
```
[ChatService] Groq client initialized successfully
```

**If not showing, restart backend** after adding the key

---

## 📊 Health Check Checklist

Before demoing to your team:

- [ ] Frontend running on http://localhost:5173
- [ ] Backend running on http://127.0.0.1:8000
- [ ] Dashboard loads with metrics
- [ ] Can navigate between pages
- [ ] AI Copilot button visible
- [ ] Backend logs show Supabase connected
- [ ] Backend logs show Groq initialized
- [ ] No red errors in either terminal

---

## 🎓 For Your Teammates

Share this with your team:

### First-Time Setup (One-Time):
1. Install Node.js and Python
2. Clone/download project
3. Run `npm install` in root directory
4. Create venv: `python -m venv backend/venv`
5. Activate venv and run `pip install -r backend/requirements.txt`

### Daily Usage:
**Terminal 1:**
```powershell
cd "path/to/SIH 26"
npm run dev
```

**Terminal 2:**
```powershell
cd "path/to/SIH 26/backend"
.\venv\Scripts\Activate.ps1
python -m app.main
```

**Then open:** http://localhost:5173

---

## 🚀 Production Deployment (Future)

For deploying to a server:

**Frontend:**
```powershell
npm run build
# Creates dist/ folder
# Deploy to Netlify, Vercel, or any static host
```

**Backend:**
```powershell
# Use gunicorn or Docker
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

---

## 📞 Getting Help

If you're stuck:

1. Check the **terminal logs** for error messages
2. Read the **error carefully** - it usually tells you what's wrong
3. Google the error message
4. Check these files:
   - `TROUBLESHOOTING.md` (if exists)
   - `README.md`
   - Backend logs
   - Browser console (F12)

---

## ✅ Summary

**To run the project manually:**

1. Open two terminals
2. **Terminal 1:** `npm run dev` (Frontend)
3. **Terminal 2:** `python -m app.main` (Backend, with venv activated)
4. Open http://localhost:5173
5. Done! 🎉

**Both must be running** for the full application to work.

---

**Document Created:** August 26, 2026  
**For:** SIH 2026 Team  
**Project:** Railway Block Management System
