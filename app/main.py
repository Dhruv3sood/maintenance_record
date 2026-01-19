from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, records, sales, export, filters
from app.database import engine, Base
from app.models import Record  # Import models to register with Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Maintenance CRM + Sales Report CRM",
    description="FastAPI backend for Maintenance CRM and Sales Report CRM with two-passcode authentication",
    version="1.0.0"
)

# Configure CORS
# In production, set ALLOWED_ORIGINS env var (comma-separated) or it will allow all origins
import os
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()] if allowed_origins_str else [
    "http://localhost:3000",  # Vite dev server
    "http://localhost:5173",  # Alternative Vite port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],  # Allow all if none specified (for easy deployment)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(records.router)
app.include_router(sales.router)
app.include_router(export.router)
app.include_router(filters.router)


@app.get("/")
async def root():
    return {
        "message": "Maintenance CRM + Sales Report CRM API",
        "version": "1.0.0",
        "docs": "/docs"
    }
