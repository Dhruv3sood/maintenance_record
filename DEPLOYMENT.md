# Free Deployment Guide - Maintenance CRM

This guide covers deploying the Maintenance CRM + Sales Report CRM to **free hosting services**.

## Free Hosting Options

### Database (PostgreSQL - FREE)
1. **Supabase** (Recommended) - https://supabase.com
   - Free tier: 500MB database, unlimited API requests
   - Free PostgreSQL database
   - Easy setup

2. **Neon** - https://neon.tech
   - Free tier: PostgreSQL with 3GB storage
   - Serverless PostgreSQL

### Backend API (Python/FastAPI - FREE)
1. **Render** (Recommended) - https://render.com
   - Free tier: 750 hours/month (enough for 24/7)
   - Automatic deployments from GitHub
   - Free SSL

2. **Railway** - https://railway.app
   - Free tier: $5 credit/month (enough for small apps)
   - Easy PostgreSQL integration

3. **Fly.io** - https://fly.io
   - Free tier: 3 shared-cpu VMs
   - Good for global distribution

### Frontend (React - FREE)
1. **Vercel** (Recommended) - https://vercel.com
   - Free tier: Unlimited deployments
   - Automatic deployments from GitHub
   - Global CDN

2. **Netlify** - https://netlify.com
   - Free tier: 100GB bandwidth/month
   - Automatic deployments from GitHub
   - Easy to use

## Step-by-Step Deployment

### Step 1: Set Up Free Database (Supabase)

1. Go to https://supabase.com and sign up (free)
2. Create a new project
3. Wait for database to be created (~2 minutes)
4. Go to **Settings** → **Database**
5. Copy the **Connection string** (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
6. Save this - you'll need it for backend deployment

**Note**: For local development, you can still use SQLite. The app automatically uses PostgreSQL when `DATABASE_URL` is set.

### Step 2: Deploy Backend to Render (FREE)

#### Option A: Deploy via Render Dashboard

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create Render account**: https://render.com (sign up with GitHub)

3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

4. **Configure Service**:
   - **Name**: maintenance-crm-api (or any name)
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Root Directory**: (leave empty - it's at root)
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables**:
   Click "Advanced" and add these:
   ```
   MAINTENANCE_PASSCODE=your_secure_passcode_here
   SALES_PASSCODE=your_secure_passcode_here
   JWT_SECRET=your_very_long_random_secret_key_here
   DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
   ```
   - Generate `JWT_SECRET`: Use a long random string (at least 32 characters)
   - Use the Supabase connection string from Step 1

6. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (~5 minutes)
   - Your API will be at: `https://maintenance-crm-api.onrender.com` (or your chosen name)

#### Option B: Deploy via Railway

1. **Push code to GitHub** (same as above)

2. **Create Railway account**: https://railway.app (sign up with GitHub)

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

4. **Configure Service**:
   - Railway auto-detects Python
   - Add environment variables (same as Render)
   - Railway will auto-deploy

5. **Set Start Command**:
   - Add `start.sh` or configure in Railway dashboard:
   - Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

6. **Get your URL**:
   - Railway provides: `https://your-app.up.railway.app`

### Step 3: Deploy Frontend to Vercel (FREE)

1. **Push frontend code to GitHub** (if not already)

2. **Create Vercel account**: https://vercel.com (sign up with GitHub)

3. **Import Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

4. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
     (Use your backend URL from Step 2)

6. **Deploy**:
   - Click "Deploy"
   - Wait for deployment (~2 minutes)
   - Your frontend will be at: `https://your-app.vercel.app`

### Step 4: Update Frontend API URL

After both are deployed, update the frontend environment variable:
- Go to Vercel dashboard
- Settings → Environment Variables
- Update `VITE_API_URL` to your backend URL + `/api`

### Step 5: Update Backend CORS

Update `app/main.py` CORS settings to include your frontend URL:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-frontend-url.vercel.app",  # Add your Vercel URL
        # Add any other frontend URLs
    ],
    # ... rest of config
)
```

Or for production, you can allow all origins (less secure but simpler):
```python
allow_origins=["*"],  # Only for production/demo
```

## Quick Deployment Scripts

### Local Testing with Cloud Database

Create `.env` file:
```env
MAINTENANCE_PASSCODE=test123
SALES_PASSCODE=test456
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

Run migrations:
```bash
alembic upgrade head
```

Run locally:
```bash
uvicorn app.main:app --reload
```

## Free Tier Limitations

### Supabase (Database)
- ✅ 500MB database storage
- ✅ Unlimited API requests
- ⚠️ Database sleeps after 1 week of inactivity (free tier)
- ✅ Perfect for small to medium apps

### Render (Backend)
- ✅ 750 hours/month (enough for 24/7 for one app)
- ⚠️ Free tier spins down after 15 minutes of inactivity (cold start ~30 seconds)
- ✅ Perfect for demos and small production apps
- 💡 **Tip**: Use a ping service to keep it alive (UptimeRobot free tier)

### Vercel (Frontend)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Perfect for production
- ✅ Always fast (global CDN)

## Keeping Render App Alive (Free Tier)

Since Render free tier spins down after inactivity, use a free ping service:

1. **UptimeRobot** (https://uptimerobot.com) - Free tier
   - Add a monitor to ping your backend URL every 5 minutes
   - Keeps the app warm

2. **cron-job.org** (https://cron-job.org) - Free tier
   - Set up a cron job to ping your URL every 10 minutes

## Alternative: Railway (Backend) - Better Uptime

Railway offers better uptime but limited free credit:
- $5 credit/month (usually enough for small apps)
- No automatic spin-down
- Better for production

## Cost Summary: $0/month ✅

- Database: **Supabase Free** - $0
- Backend: **Render Free** - $0 (or Railway $0 with free credit)
- Frontend: **Vercel Free** - $0
- **Total: $0/month**

## Security Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use strong passcodes** in production
3. **Generate strong JWT_SECRET** - Use: `openssl rand -hex 32`
4. **Change default passcodes** before deployment
5. **Enable HTTPS** (automatic on Render/Vercel)

## Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Check database connection string format
- View logs in Render/Railway dashboard

### Frontend can't connect to backend
- Check CORS settings include frontend URL
- Verify `VITE_API_URL` is set correctly
- Check backend is running (visit backend URL in browser)

### Database connection fails
- Verify DATABASE_URL format
- Check Supabase project is active
- Ensure password is correct (check Supabase dashboard)

### Cold starts on Render
- Free tier has ~30 second cold start
- Use UptimeRobot to keep it warm
- Or upgrade to paid tier for instant starts

## Support

If you encounter issues:
1. Check application logs in hosting dashboard
2. Verify all environment variables are set
3. Test database connection separately
4. Check CORS configuration
