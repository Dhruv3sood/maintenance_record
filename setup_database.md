# Database Setup Guide

## Understanding the Database

The application uses **SQLAlchemy** which supports both SQLite and PostgreSQL:

- **SQLite** (default): Saves to a file on disk (`maintenance_crm.db`) - **persistent by default**
- **PostgreSQL** (production): Cloud database for deployment - **recommended for production**

## Current Setup

By default, the app uses **SQLite** which saves data to `maintenance_crm.db` file in the project root. This is **persistent** - data is saved permanently.

To use **PostgreSQL** (cloud database), just set the `DATABASE_URL` environment variable.

## Option 1: SQLite (Local - Already Persistent)

SQLite saves to disk automatically. The database file `maintenance_crm.db` contains all your data.

**No changes needed** - it's already persistent!

## Option 2: PostgreSQL (Cloud - Recommended for Deployment)

### Setup Free PostgreSQL Database

#### Using Supabase (Recommended - FREE)

1. **Sign up**: Go to https://supabase.com (it's free)

2. **Create project**:
   - Click "New Project"
   - Choose a name (e.g., "maintenance-crm")
   - Set a strong password (save it!)
   - Choose a region close to you
   - Wait ~2 minutes for setup

3. **Get connection string**:
   - Go to **Settings** → **Database**
   - Scroll to "Connection string"
   - Copy the URI format:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with your actual password

4. **Use in your app**:
   
   Create/update `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres
   ```

   Or set as environment variable when deploying.

5. **Run migrations**:
   ```bash
   alembic upgrade head
   ```

#### Using Neon (Alternative - FREE)

1. **Sign up**: Go to https://neon.tech (it's free)

2. **Create project**:
   - Click "Create Project"
   - Choose a name
   - Wait for setup

3. **Get connection string**:
   - Copy the connection string from dashboard
   - Format: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb`

4. **Use in your app**:
   Same as Supabase - set `DATABASE_URL` in `.env`

## Switching Between SQLite and PostgreSQL

The app automatically detects which database to use:

- **No `DATABASE_URL` set** → Uses SQLite (`sqlite:///./maintenance_crm.db`)
- **`DATABASE_URL` set** → Uses PostgreSQL (from the URL)

### Example `.env` files:

**For SQLite (local development)**:
```env
MAINTENANCE_PASSCODE=maintenance123
SALES_PASSCODE=sales123
JWT_SECRET=your-secret-key-change-this
# DATABASE_URL not set = uses SQLite
```

**For PostgreSQL (production)**:
```env
MAINTENANCE_PASSCODE=maintenance123
SALES_PASSCODE=sales123
JWT_SECRET=your-secret-key-change-this
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

## Database Migrations

After setting up PostgreSQL, run migrations:

```bash
# This will create all tables in your PostgreSQL database
alembic upgrade head
```

## Verifying Database

### SQLite
Check if `maintenance_crm.db` file exists in project root. Data is in that file.

### PostgreSQL
1. Use Supabase SQL Editor or any PostgreSQL client
2. Connect using your connection string
3. Check if `records` table exists:
   ```sql
   SELECT * FROM records LIMIT 10;
   ```

## Free Database Limits

### Supabase (Free Tier)
- ✅ 500MB database storage
- ✅ Unlimited API requests
- ⚠️ Database pauses after 1 week of inactivity (wakes up when accessed)
- ✅ Perfect for small to medium apps

### Neon (Free Tier)
- ✅ 3GB database storage
- ✅ Serverless (scales automatically)
- ✅ No automatic pauses
- ✅ Perfect for production

## Summary

- **Local Development**: SQLite is fine (already persistent)
- **Production/Client Delivery**: Use Supabase or Neon (free PostgreSQL)
- **Data Persistence**: Both SQLite and PostgreSQL save data permanently
- **Cost**: $0/month for free tiers

The app works the same with both databases - just set `DATABASE_URL` for PostgreSQL!
