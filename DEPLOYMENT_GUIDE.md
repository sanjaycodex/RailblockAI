# 🚀 Deployment Guide - Vercel (Frontend) + Railway (Backend)

**Complete step-by-step guide to deploy RailBlockAI**

---

## 📋 Overview

- **Frontend**: Deploy to Vercel (React + Vite)
- **Backend**: Deploy to Railway (FastAPI + Python)
- **Database**: Supabase (Already cloud-hosted ✓)

---

## Part 1: 🎨 Deploy Frontend to Vercel

### Prerequisites
- GitHub account (done ✓)
- Vercel account (free) - Sign up at https://vercel.com

### Step 1: Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Repository

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find **sanjaycodex/RailblockAI**
4. Click **"Import"**

### Step 3: Configure Project Settings

**Framework Preset**: Vite ✓ (Auto-detected)

**Root Directory**: `.` (Leave as root)

**Build Settings**:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add these:

```
VITE_SUPABASE_URL=https://pmvjhnnjftbhnleymzqb.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_GROQ_MODEL=qwen/qwen3.8-27b
```

⚠️ **Important**: Add `VITE_` prefix to all variables!

**You'll also need to add:**
```
VITE_BACKEND_URL=https://your-backend-url.railway.app
```
(We'll get this after deploying backend - you can add it later)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. ✅ Your frontend will be live!

**Your URL**: `https://railblockai-xxx.vercel.app`

---

## Part 2: 🚂 Deploy Backend to Railway

### Prerequisites
- GitHub account (done ✓)
- Railway account (free) - Sign up at https://railway.app

### Step 1: Create Railway Account

1. Go to **https://railway.app**
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **sanjaycodex/RailblockAI**
4. Railway will detect it's a Python app

### Step 3: Configure Build Settings

Railway will auto-detect Python. You might need to:

1. Click on your service
2. Go to **"Settings"**
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Step 4: Add Environment Variables

Go to **"Variables"** tab and add:

```
VITE_SUPABASE_URL=https://pmvjhnnjftbhnleymzqb.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=qwen/qwen3.8-27b
BACKEND_HOST=0.0.0.0
BACKEND_PORT=$PORT
```

⚠️ **Note**: Railway automatically provides `$PORT` variable

### Step 5: Deploy

1. Railway will automatically deploy
2. Wait 3-5 minutes
3. ✅ Your backend will be live!

**Your URL**: `https://railblockai-backend-xxx.railway.app`

### Step 6: Test Backend

Visit: `https://your-backend-url.railway.app/health`

You should see:
```json
{
  "status": "healthy",
  "risk_model": "trained_rf",
  "optimizer": "ortools_cpsat",
  "database": "supabase"
}
```

**API Docs**: `https://your-backend-url.railway.app/docs`

---

## Part 3: 🔗 Connect Frontend to Backend

### Update Frontend Environment Variable

1. Go back to **Vercel** dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add or update:

```
VITE_BACKEND_URL=https://your-actual-backend-url.railway.app
```

5. Click **"Save"**
6. Go to **Deployments** tab
7. Click **"Redeploy"** on the latest deployment

---

## Part 4: 🔧 Update Backend CORS

After deployment, you need to update CORS to allow your Vercel domain.

### Option A: Update via GitHub (Recommended)

1. Open your local project
2. Edit `backend/app/config/settings.py`
3. Update CORS_ORIGINS:

```python
CORS_ORIGINS: list[str] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://railblockai-xxx.vercel.app",  # Your Vercel URL
    "https://*.vercel.app",  # All Vercel preview deployments
    "*"
]
```

4. Commit and push:
```bash
git add backend/app/config/settings.py
git commit -m "Update: Add production CORS origins"
git push
```

5. Railway will auto-redeploy

### Option B: Update settings.py to read from environment

Even better, make it configurable:

```python
CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,https://*.vercel.app,*"
).split(",")
```

Then add in Railway environment variables:
```
CORS_ORIGINS=https://railblockai-xxx.vercel.app,https://*.vercel.app
```

---

## Part 5: 📝 Update Frontend API URL

Currently, your frontend has hardcoded `http://127.0.0.1:8000`. Let's make it dynamic.

### Update fastapiService.js

Edit `src/services/fastapiService.js`:

**Change this:**
```javascript
const FASTAPI_BASE_URL = 'http://127.0.0.1:8000';
```

**To this:**
```javascript
const FASTAPI_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
```

### Update api.js

Edit `src/services/api.js` line 825:

**Change this:**
```javascript
const BACKEND_URL = 'http://127.0.0.1:8000';
```

**To this:**
```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';
```

### Commit and Push

```bash
git add src/services/fastapiService.js src/services/api.js
git commit -m "Update: Use environment variable for backend URL"
git push
```

Vercel will auto-redeploy!

---

## ✅ Verification Checklist

### Backend (Railway)
- [ ] Backend deployed successfully
- [ ] Health endpoint works: `/health`
- [ ] API docs accessible: `/docs`
- [ ] Environment variables set
- [ ] CORS includes Vercel URL

### Frontend (Vercel)
- [ ] Frontend deployed successfully
- [ ] Site loads without errors
- [ ] Environment variables set
- [ ] Backend URL configured
- [ ] Can login/logout
- [ ] Dashboard loads data

### Integration
- [ ] Frontend can call backend APIs
- [ ] No CORS errors in browser console
- [ ] All features work end-to-end
- [ ] Supabase connection works

---

## 🔍 Testing Your Deployment

### Test Flow:

1. **Visit Frontend**: `https://railblockai-xxx.vercel.app`
2. **Open Browser Console** (F12)
3. **Check for errors** (should be none)
4. **Login** with test credentials
5. **Test Features**:
   - Dashboard loads ✓
   - Create task ✓
   - Run priority engine ✓
   - Run optimizer ✓
   - Generate bundles ✓

### If Something Fails:

**Backend Logs (Railway)**:
1. Go to Railway dashboard
2. Click your project
3. View **"Deployments"** → **"View Logs"**

**Frontend Logs (Vercel)**:
1. Go to Vercel dashboard
2. Click your project
3. View **"Deployments"** → Click deployment → **"View Logs"**

---

## 🎯 Custom Domain (Optional)

### Vercel Custom Domain:
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Vercel Settings → **Domains**
3. Add your domain: `railblockai.com`
4. Update DNS records as instructed

### Railway Custom Domain:
1. Railway Settings → **Domains**
2. Add custom domain: `api.railblockai.com`
3. Update DNS CNAME record

---

## 💰 Cost Breakdown

### Free Tier Limits:

**Vercel (Free)**:
- ✅ 100 deployments/month
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Preview deployments

**Railway (Free Trial)**:
- ✅ $5 credit (enough for demo)
- ✅ After trial: ~$5-10/month
- ✅ 500 hours/month

**Supabase (Free)**:
- ✅ Already using it
- ✅ 500MB database
- ✅ Unlimited API requests

**Total**: **Free** for hackathon period! 🎉

---

## 🚨 Troubleshooting

### Issue 1: Vercel Build Fails

**Error**: "Build failed"

**Solution**:
```bash
# Test build locally first
npm run build

# If successful, push to GitHub
git push
```

### Issue 2: Railway Backend Won't Start

**Error**: "Application failed to respond"

**Check**:
1. Start command is correct: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
2. Root directory is set to `backend`
3. All environment variables are set
4. Check Railway logs for Python errors

### Issue 3: CORS Errors

**Error**: "CORS policy: No 'Access-Control-Allow-Origin'"

**Solution**:
1. Update backend CORS settings (see Part 4)
2. Make sure Vercel URL is in CORS_ORIGINS
3. Redeploy backend

### Issue 4: Frontend Can't Connect to Backend

**Check**:
1. `VITE_BACKEND_URL` is set in Vercel
2. Backend URL is correct (with https://)
3. Backend health endpoint works
4. No typos in URL

### Issue 5: Environment Variables Not Working

**Vercel**: Must start with `VITE_`
**Railway**: Regular variable names

**Solution**: Redeploy after adding variables

---

## 📊 Deployment URLs

After deployment, fill these in:

```
Frontend (Vercel): https://_____________________.vercel.app
Backend (Railway): https://_____________________.railway.app
API Docs: https://_____________________.railway.app/docs
Health Check: https://_____________________.railway.app/health
```

---

## 🔄 Auto-Deploy on Git Push

Both platforms auto-deploy when you push to GitHub!

```bash
# Make changes
git add .
git commit -m "Update: [your changes]"
git push

# Vercel auto-deploys frontend
# Railway auto-deploys backend
```

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/

---

## ✅ Final Checklist

Before demo day:

- [ ] Both frontend & backend deployed
- [ ] All features working on production
- [ ] Environment variables configured
- [ ] CORS properly set up
- [ ] Custom domain added (optional)
- [ ] Tested on mobile (responsive)
- [ ] No console errors
- [ ] Loading times acceptable
- [ ] All API endpoints working
- [ ] Database connected properly

---

## 🎉 You're Production Ready!

**Frontend**: https://railblockai-xxx.vercel.app  
**Backend**: https://railblockai-backend-xxx.railway.app  
**Status**: 🟢 Live and Ready for Demo!

---

**Need help?** Check the troubleshooting section or deployment logs!

**Generated**: October 7, 2026
