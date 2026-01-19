# Quick Deployment Guide - FREE Options

Deploy your Maintenance CRM to production **completely free** in under 30 minutes!

## 🎯 What You'll Get (All FREE)

- ✅ **Database**: Supabase PostgreSQL (Free - 500MB)
- ✅ **Backend API**: Render or Railway (Free tier)
- ✅ **Frontend**: Vercel (Free - unlimited)
- ✅ **Total Cost**: **$0/month** 💰

## ⚡ Quick Start (5 Steps)

### Step 1: Push Code to GitHub (5 min)

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/maintenance-crm.git
git push -u origin main
```

### Step 2: Setup Free Database (5 min)

1. Go to https://supabase.com → Sign up (free)
2. Click "New Project"
3. Name it: `maintenance-crm`
4. Set a password (SAVE IT!)
5. Wait ~2 minutes
6. Go to **Settings** → **Database**
7. Copy **Connection string** (URI format)
   ```
   postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
   ```

### Step 3: Deploy Backend to Render (10 min)

1. Go to https://render.com → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Fill in:
   - **Name**: `maintenance-crm-api`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Click **"Advanced"** → Add Environment Variables:
   ```
   MAINTENANCE_PASSCODE=your_secure_passcode
   SALES_PASSCODE=your_secure_passcode
   JWT_SECRET=generate_with_openssl_rand_hex_32
   DATABASE_URL=paste_supabase_connection_string_here
   ```
6. Click **"Create Web Service"**
7. Wait ~5 minutes for deployment
8. Your API URL: `https://maintenance-crm-api.onrender.com`

**💡 Generate JWT_SECRET:**
```bash
openssl rand -hex 32
```

### Step 4: Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com → Sign up with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo
4. Configure:
   - **Root Directory**: `frontend` (IMPORTANT!)
   - **Framework Preset**: `Vite`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://maintenance-crm-api.onrender.com/api
   ```
   (Use your actual Render URL from Step 3)
6. Click **"Deploy"**
7. Wait ~2 minutes
8. Your frontend URL: `https://your-app.vercel.app`

### Step 5: Update CORS (2 min)

1. Go to Render dashboard → Your service
2. Environment variables
3. Add:
   ```
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```
   (Use your actual Vercel URL from Step 4)
4. Save changes → Service will redeploy

**OR** Edit `app/main.py` and add your Vercel URL to `allow_origins` list.

## ✅ Done!

Your app is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://maintenance-crm-api.onrender.com`
- **Database**: Supabase (persistent, cloud-hosted)

## 🔧 Keep Backend Alive (Optional)

Render free tier sleeps after 15 min inactivity. Keep it awake:

1. Go to https://uptimerobot.com (free)
2. Create monitor → HTTP(s) Monitor
3. URL: Your Render backend URL
4. Interval: 5 minutes
5. Save

This keeps your app warm (no cold starts).

## 📝 Important Notes

1. **Change passcodes** before going live
2. **Save database password** - you'll need it later
3. **Save all URLs** - backend and frontend
4. **Test the app** after deployment

## 🐛 Troubleshooting

**Backend won't start?**
- Check all environment variables are set
- Check DATABASE_URL format
- View logs in Render dashboard

**Frontend can't connect?**
- Verify VITE_API_URL is correct (include `/api`)
- Check CORS is updated with frontend URL
- Test backend URL in browser (should see JSON)

**Database connection fails?**
- Verify Supabase project is active
- Check password in connection string
- Try connecting via Supabase SQL Editor

## 💰 Cost: $0/month

All services offer free tiers that are perfect for small-medium apps:
- Supabase: 500MB database (free)
- Render: 750 hours/month (free)
- Vercel: Unlimited (free)

## 🚀 Next Steps

1. Share frontend URL with client
2. Provide passcodes to client
3. Train client on how to use the app
4. Monitor usage in hosting dashboards

Your app is production-ready and completely free! 🎉
