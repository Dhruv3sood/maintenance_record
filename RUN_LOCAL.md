# Running Locally - Quick Guide

## Prerequisites

- Python 3.11 or 3.12 (recommended - Python 3.13 may have compatibility issues)
- Node.js 16+ and npm

## Step 1: Create Environment File

Create a `.env` file in the root directory:

```bash
MAINTENANCE_PASSCODE=maintenance123
SALES_PASSCODE=sales123
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-use-openssl-rand-hex-32
DATABASE_URL=sqlite:///./maintenance_crm.db
```

## Step 2: Setup Backend

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head
```

## Step 3: Start Backend Server

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Start the server
uvicorn app.main:app --reload
```

Backend will run at: **http://localhost:8000**
API docs at: **http://localhost:8000/docs**

## Step 4: Setup Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000**

## Step 5: Access the Application

1. Open browser: **http://localhost:3000**
2. Login with:
   - **Maintenance passcode**: `maintenance123` (or your custom passcode)
   - **Sales passcode**: `sales123` (or your custom passcode)

## Troubleshooting

### Backend won't start
- Make sure virtual environment is activated
- Check `.env` file exists with all required variables
- Check port 8000 is not in use

### Frontend won't start
- Make sure you're in `frontend` directory
- Check Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again

### Database issues
- Run migrations: `alembic upgrade head`
- Check `maintenance_crm.db` file is created (after first run)
- Delete `.db` file to reset database

### Port already in use
- Backend: Change port with `uvicorn app.main:app --reload --port 8001`
- Frontend: Vite will automatically use next available port

## Stopping

- **Backend**: Press `Ctrl+C` in the terminal
- **Frontend**: Press `Ctrl+C` in the terminal
- **Virtual environment**: Run `deactivate`
