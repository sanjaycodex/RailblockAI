# 📤 GitHub Push Guide - RailBlockAI

**Quick guide to push your project to GitHub**

---

## ⚠️ IMPORTANT: Before You Push

### 1. ✅ Verify .env is NOT Being Committed

Your `.env` file contains sensitive credentials and should **NEVER** be pushed to GitHub:
- ✅ Supabase credentials
- ✅ Groq API keys

**The `.gitignore` has been updated to exclude `.env` files.**

### 2. 🔐 What's Safe to Push

✅ **Safe Files**:
- Source code (`.js`, `.jsx`, `.py`, `.css`, etc.)
- Configuration files (`vite.config.js`, `package.json`, etc.)
- Documentation (`.md` files)
- `.env.example` (template without real credentials)
- Database schema (`database_schema.sql`)

❌ **DO NOT Push**:
- `.env` file
- `node_modules/`
- `venv/` or `.venv/`
- `__pycache__/`
- Any files with real API keys or passwords

---

## 🚀 Step-by-Step Instructions

### Step 1: Initialize Git Repository

```bash
git init
```

### Step 2: Add All Files

```bash
git add .
```

### Step 3: Verify What Will Be Committed

```bash
git status
```

**⚠️ CHECK THIS OUTPUT!** Make sure `.env` is NOT listed.

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: RailBlockAI - Intelligent Railway Maintenance System"
```

### Step 5: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon (top right)
3. Select **"New repository"**
4. Fill in:
   - **Repository name**: `railblockai-sih2026` (or your choice)
   - **Description**: `AI-powered railway maintenance planning and optimization for Indian Railways - SIH 2026`
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** initialize with README (you already have one)
5. Click **"Create repository"**

### Step 6: Connect to GitHub

GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

**Replace**:
- `YOUR-USERNAME` with your GitHub username
- `YOUR-REPO-NAME` with the repository name you created

### Example:
```bash
git remote add origin https://github.com/johnsmith/railblockai-sih2026.git
git branch -M main
git push -u origin main
```

### Step 7: Enter GitHub Credentials

When prompted:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your password)

**How to Create a Personal Access Token:**
1. Go to https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `RailBlockAI SIH 2026`
4. Select scopes: Check **`repo`** (full control)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)
7. Use this token as your password

---

## 🎯 Quick Commands (Copy & Paste)

Run these commands one by one:

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Check status (verify .env is NOT listed)
git status

# 4. Commit
git commit -m "Initial commit: RailBlockAI - Intelligent Railway Maintenance System"

# 5. Connect to GitHub (replace with YOUR repo URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# 6. Set main branch
git branch -M main

# 7. Push to GitHub
git push -u origin main
```

---

## 🔍 Verify .env is Ignored

Before committing, double-check:

```bash
git status
```

**Look for `.env` in the output:**
- ✅ **NOT listed** = Good! It's being ignored
- ❌ **Listed in red/green** = STOP! Don't commit!

If `.env` is listed, run:
```bash
git rm --cached .env
```

---

## 📝 After Pushing to GitHub

### Update README with Your GitHub Link

Add to your README.md:

```markdown
## 🔗 Repository
https://github.com/YOUR-USERNAME/YOUR-REPO-NAME
```

### Add a License (Optional)

Create a `LICENSE` file. For educational/hackathon projects, MIT License is common:

```bash
# GitHub can help you add one through the web interface:
# Repository → Add file → Create new file → Type "LICENSE" → Choose template
```

### Add Collaborators (If Team Project)

1. Go to your repository on GitHub
2. Settings → Collaborators → Add people
3. Enter teammates' GitHub usernames

---

## 🔄 Future Updates

After making changes to your code:

```bash
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with a message
git commit -m "Add feature: [describe your changes]"

# 4. Push to GitHub
git push
```

### Good Commit Message Examples:
```bash
git commit -m "Add AI priority recalculation feature"
git commit -m "Fix: Resolve optimizer timeout issue"
git commit -m "Update: Improve smart bundling algorithm"
git commit -m "Docs: Add deployment instructions"
```

---

## 🚨 Troubleshooting

### Issue 1: Git Not Recognized
```bash
# Install Git: https://git-scm.com/download/win
# Restart your terminal after installation
```

### Issue 2: Permission Denied
```bash
# Make sure you're using a Personal Access Token, not your password
# Or use SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Issue 3: .env Accidentally Committed

**If you already pushed .env to GitHub:**

1. **Delete the repository immediately** (Settings → Delete repository)
2. **Rotate all credentials**:
   - Generate new Supabase keys
   - Generate new Groq API key
3. Create a new repository and push again (after updating .env)

### Issue 4: Repository Already Exists Error
```bash
# If you get "remote origin already exists"
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
```

### Issue 5: Large Files Error
```bash
# If files are too large (>100MB), add them to .gitignore
# Then remove from git cache:
git rm --cached path/to/large/file
```

---

## 📚 Additional Git Commands

```bash
# View commit history
git log

# See changes before committing
git diff

# Undo changes to a file
git checkout -- filename

# Create a new branch
git checkout -b feature-branch-name

# Switch branches
git checkout main

# Merge branches
git merge feature-branch-name

# Pull latest changes from GitHub
git pull
```

---

## ✅ Pre-Push Checklist

Before running `git push`, verify:

- [ ] `.env` is listed in `.gitignore`
- [ ] `.env` does NOT appear in `git status` output
- [ ] All sensitive credentials are in `.env` (not hardcoded)
- [ ] `node_modules/` is not being committed
- [ ] `venv/` or `.venv/` is not being committed
- [ ] README.md is updated with project info
- [ ] `.env.example` exists with placeholder values
- [ ] Code is tested and working
- [ ] Commit message is descriptive

---

## 🎯 Your Repository Info

After creating your GitHub repository, fill this in:

```
Repository Name: _____________________________
Repository URL: ______________________________
Visibility: [ ] Public  [ ] Private
Branch: main
```

---

## 📞 Need Help?

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Create Personal Access Token**: https://github.com/settings/tokens
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf

---

**Ready to Push?** Follow the steps above! 🚀

**Status**: ✅ `.gitignore` updated to protect sensitive files
