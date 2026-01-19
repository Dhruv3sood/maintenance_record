# Simple Free Deployment Guide

Deploy your Maintenance CRM using **SQLite database** (persistent) + **free backend hosting** + **Vercel frontend** - all for **$0/month**!

## ✅ What We're Using

- **Database**: SQLite (saves to disk - persistent, no setup needed!)
- **Backend**: Render.com (FREE tier - 750 hours/month, enough for 24/7)
- **Frontend**: Vercel (FREE - unlimited deployments)

## 🚀 Quick Deployment (20 minutes)

### Step 1: Push Code to GitHub (5 min)

```bash
# If you haven't already
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/maintenance-crm.git
git push -u origin main
```

### Step 2: Deploy Backend to Render (10 min)

1. **Go to Render**: https://render.com → Sign up with GitHub (free)

2. **Create New Web Service**:
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select your `maintenance-crm` repository

3. **Configure**:
   - **Name**: `maintenance-crm-api` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave empty (it's at root)
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```bash
     pip install -r requirements.txt && alembic upgrade head
     ```
   - **Start Command**: 
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

4. **Add Environment Variables** (Click "Advanced" button):
   
   Click "Add Environment Variable" and add these:
   
   ```
   MAINTENANCE_PASSCODE=your_secure_passcode_here
   SALES_PASSCODE=your_secure_passcode_here
   JWT_SECRET=generate_a_long_random_string_here
   ```
   
   **Important**: 
   - Generate `JWT_SECRET` using: `openssl rand -hex 32` (run in terminal)
   - Or use a long random string (at least 32 characters)
   - **DO NOT** set `DATABASE_URL` - we're using SQLite (default)

5. **Deploy**:
   - Click **"Create Web Service"**
   - Wait ~5 minutes for deployment
   - Your backend URL will be: `https://maintenance-crm-api.onrender.com` (or your chosen name)

**✅ Your SQLite database will be saved on Render's disk and persist!**

### Step 3: Deploy Frontend to Vercel (5 min)

1. **Go to Vercel**: https://vercel.com → Sign up with GitHub (free)

2. **Import Project**:
   - Click **"Add New"** → **"Project"**
   - Import your GitHub repository
   - **IMPORTANT**: Set **Root Directory** to `frontend`

3. **Configure Build Settings**:
   - **Framework Preset**: `Vite` (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variable**:
   - Click **"Environment Variables"**
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://maintenance-crm-api.onrender.com/api
     ```
     (Use your actual Render backend URL from Step 2)

5. **Deploy**:
   - Click **"Deploy"**
   - Wait ~2 minutes
   - Your frontend URL: `https://your-app.vercel.app`

### Step 4: Update CORS (2 min)

1. Go to **Render Dashboard** → Your backend service
2. Go to **Environment** tab
3. Add new environment variable:
   ```
   Name: ALLOWED_ORIGINS
   Value: https://your-app.vercel.app
   ```
   (Use your actual Vercel URL from Step 3)
4. Click **"Save Changes"** → Render will automatically redeploy

**OR** Edit `app/main.py` directly and add your Vercel URL to the `allow_origins` list, then push to GitHub (Render will auto-deploy).

### Step 5: Test! 🎉

1. Visit your frontend URL: `https://your-app.vercel.app`
2. Login with your passcodes
3. Add a record
4. Verify it saves (data is persistent!)

## ✅ Done!

Your app is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://maintenance-crm-api.onrender.com`
- **Database**: SQLite (saves on Render's disk - persistent!)

## 💡 Keep Backend Alive (Optional)

Render free tier **sleeps after 15 minutes** of inactivity (wakes up in ~30 seconds).

To keep it warm (no sleep):

1. **UptimeRobot** (Free): https://uptimerobot.com
   - Sign up (free)
   - Add monitor → HTTP(s) Monitor
   - URL: Your Render backend URL
   - Interval: 5 minutes
   - Save

This pings your backend every 5 minutes, keeping it awake!

## 📝 Important Notes

1. **SQLite Database Location**: 
   - On Render, it saves to the server's disk
   - Data persists across deployments
   - **Backup**: Render keeps backups, but you can also download your database file if needed

2. **Passcodes**: 
   - Change the default passcodes before deploying to production!
   - Keep them secure

3. **JWT Secret**: 
   - Generate a strong one: `openssl rand -hex 32`
   - Never commit it to GitHub

4. **Free Tier Limits**:
   - **Render**: 750 hours/month (enough for 24/7 for one app)
   - **Vercel**: Unlimited deployments
   - **SQLite**: Unlimited (limited only by disk space on Render)

## 🐛 Troubleshooting

### Backend won't start?
- Check all environment variables are set in Render
- Check logs in Render dashboard (Logs tab)
- Verify `JWT_SECRET` is set

### Frontend can't connect?
- Verify `VITE_API_URL` is correct (include `/api` at end)
- Check CORS is updated with frontend URL
- Test backend URL in browser (should see JSON response)

### Database issues?
- SQLite should work automatically
- If needed, you can check Render logs
- Database file is saved on Render's persistent disk

### Cold starts?
- First request after 15 min inactivity: ~30 second wait
- Use UptimeRobot to keep it warm (see above)
- Or upgrade Render to paid ($7/month) for instant starts

## 💰 Cost Summary

- **Database**: SQLite (Free - unlimited)
- **Backend**: Render (Free - 750 hours/month)
- **Frontend**: Vercel (Free - unlimited)
- **Total**: **$0/month** ✅

## 🎯 Alternative Backend Options

If you need more uptime, consider:

### Railway (FREE - $5 credit/month)
- Better uptime (no automatic sleep)
- Usually enough credit for small apps
- Same deployment process
- See `railway.json` config file

### Fly.io (FREE - 3 VMs)
- Good global distribution
- More complex setup
- Better for scaling

**Render is recommended** for simplicity and reliability!

## 📚 Next Steps

1. Test the deployed app thoroughly
2. Share frontend URL with your client
3. Provide passcodes securely
4. Train client on using the app
5. Monitor usage in Render/Vercel dashboards

Your app is production-ready! 🚀
