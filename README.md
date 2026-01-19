# Maintenance CRM + Sales Report CRM

FastAPI backend + React frontend for a product Maintenance CRM and Sales Report CRM with two-passcode authentication (no user accounts).

**✅ Ready for FREE deployment - Database (SQLite), Backend (Render), and Frontend (Vercel) all available for $0/month!**

## Features

- **Authentication**: Two-passcode system (maintenance and sales) with JWT tokens
- **Record Management**: Full CRUD operations for maintenance records
- **Warranty Tracking**: 1-year warranty from delivery date with status tracking
- **Sales Reports**: Read-only access to sales data with summaries and breakdowns
- **Export Functionality**: Export records to CSV, XLSX, or PDF formats
- **Database**: SQLite (persistent, saves to disk) - no setup needed!
- **Frontend**: Modern React + TypeScript web interface

## Quick Start

### Local Development

1. **Backend**:
   ```bash
   pip install -r requirements.txt
   cp .env.example .env  # Edit with your passcodes
   alembic upgrade head
   uvicorn app.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Free Production Deployment

**Quick Guide**: See `SIMPLE_DEPLOY.md` for step-by-step instructions (20 minutes)

**What you get**:
- ✅ SQLite database (persistent - saves to disk automatically)
- ✅ Backend on Render.com (FREE - 750 hours/month)
- ✅ Frontend on Vercel (FREE - unlimited)

**Total Cost: $0/month** 💰

## Database

### SQLite (Default - Recommended)

**SQLite is persistent by default!** Data saves to `maintenance_crm.db` file on disk and won't be lost.

- ✅ No setup needed
- ✅ Data persists across restarts
- ✅ Perfect for small to medium apps
- ✅ Used automatically (no configuration)

The database file is saved locally and on your hosting provider's disk (persistent storage).

### PostgreSQL (Optional - for large scale)

If you need PostgreSQL for production, see `setup_database.md` for free cloud database options (Supabase/Neon).

## Project Structure

```
maintenance_record/
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── package.json
├── app/                    # FastAPI backend
│   ├── main.py            # FastAPI app entry point
│   ├── config.py          # Environment configuration
│   ├── database.py        # Database setup (SQLite/PostgreSQL)
│   ├── models.py          # SQLAlchemy models
│   ├── schemas.py         # Pydantic schemas
│   ├── security.py        # JWT token functions
│   ├── dependencies.py    # FastAPI auth dependencies
│   ├── crud.py            # CRUD operations
│   ├── routers/           # API routes
│   │   ├── auth.py        # Authentication endpoints
│   │   ├── records.py     # Record CRUD endpoints
│   │   ├── sales.py       # Sales report endpoints
│   │   └── export.py      # Export endpoints
│   └── utils/
│       ├── warranty.py    # Warranty calculations
│       └── export_utils.py # Export utilities
├── alembic/               # Database migrations
├── requirements.txt       # Python dependencies
├── alembic.ini           # Alembic configuration
├── SIMPLE_DEPLOY.md      # Simple deployment guide (SQLite)
├── DEPLOYMENT.md         # Detailed deployment guide
└── README.md
```

## Setup

### 1. Install Dependencies

**Backend**:
```bash
pip install -r requirements.txt
```

**Frontend**:
```bash
cd frontend
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:
```env
MAINTENANCE_PASSCODE=your_maintenance_passcode
SALES_PASSCODE=your_sales_passcode
JWT_SECRET=your-secret-key-for-jwt-tokens

# SQLite is used by default (no DATABASE_URL needed)
# Database file: maintenance_crm.db (saves to disk)
```

### 3. Run Database Migrations

```bash
alembic upgrade head
```

This creates all database tables.

### 4. Run the Application

**Backend**:
```bash
uvicorn app.main:app --reload
```
Backend runs at `http://localhost:8000`

**Frontend** (in another terminal):
```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:3000`

## Deployment

### Simple Free Deployment (Recommended)

See `SIMPLE_DEPLOY.md` for the easiest deployment path:
- SQLite database (persistent, no setup)
- Render.com backend (FREE)
- Vercel frontend (FREE)

**Time**: ~20 minutes  
**Cost**: $0/month

### Detailed Deployment Guide

See `DEPLOYMENT.md` for:
- Multiple hosting options
- PostgreSQL database setup (if needed)
- Advanced configuration
- Troubleshooting

## API Endpoints

### Authentication
- `POST /auth/login` - Login with passcode

### Records (Maintenance Role)
- `POST /records` - Create record
- `GET /records/{id}` - Get record
- `PATCH /records/{id}` - Update record
- `DELETE /records/{id}` - Delete record
- `GET /records` - List records (with search, filters, pagination)
- `GET /records/warranty/out-of-warranty` - Out of warranty records
- `GET /records/warranty/expiring-soon?days=30` - Expiring soon records
- `GET /records/warranty/summary` - Warranty summary

### Sales (Sales Role)
- `GET /sales/records` - View sales records (read-only)
- `GET /sales/summary` - Sales summary with breakdowns

### Export
- `GET /export/records.csv|xlsx|pdf` - Export records (maintenance)
- `GET /export/sales.csv|xlsx|pdf` - Export sales (sales)

Full API documentation: `http://localhost:8000/docs` (Swagger UI)

## Frontend Features

- **Login Page**: Passcode-based authentication
- **Maintenance Dashboard**: 
  - Record CRUD operations
  - Search and filters
  - Warranty tracking
  - Export functionality
- **Sales Dashboard**:
  - Read-only sales records
  - Sales summary and breakdowns
  - Export functionality

## Record Model Fields

See the full record model in `app/models.py`. Key fields:
- Record ID (auto-generated: RMZ-000001)
- Client information (name, phone, address, zone)
- Machine details (capacity, heater, controller, card, body)
- Dates (delivery, installation, site visit)
- Commercial (sale price, sold by, lead source)
- Warranty tracking (1 year from delivery date)

## Free Tier Limits

### Render (Backend)
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Sleeps after 15 min inactivity (~30 sec cold start)
- 💡 Use UptimeRobot (free) to keep it awake

### Vercel (Frontend)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Global CDN

### SQLite (Database)
- ✅ Unlimited (limited only by disk space)
- ✅ Persistent on Render's disk
- ✅ Perfect for most use cases

## Security Notes

1. **Change default passcodes** before production
2. **Generate strong JWT_SECRET**: `openssl rand -hex 32`
3. **Never commit `.env` file** (it's in `.gitignore`)
4. **Use HTTPS** (automatic on Render/Vercel)

## Troubleshooting

### Database
- SQLite file saves to disk automatically
- Check `maintenance_crm.db` exists in project root (local)
- On Render, database is on persistent disk

### Deployment
- Check logs in Render/Vercel dashboards
- Verify environment variables are set
- Test backend URL in browser first

### CORS Issues
- Add frontend URL to `ALLOWED_ORIGINS` env var
- Or update `app/main.py` directly

## License

This project is provided as-is for the Maintenance CRM + Sales Report CRM system.

## Support

For deployment help, see:
- `SIMPLE_DEPLOY.md` - Quick deployment guide
- `DEPLOYMENT.md` - Detailed deployment options
- `setup_database.md` - Database setup guide
