from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Auth - use environment variables with defaults for local dev
    maintenance_passcode: str = os.getenv("MAINTENANCE_PASSCODE", "maintenance123")
    sales_passcode: str = os.getenv("SALES_PASSCODE", "sales123")
    jwt_secret: str = os.getenv("JWT_SECRET", "your-super-secret-jwt-key-change-this-in-production-use-openssl-rand-hex-32")
    
    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./maintenance_crm.db")
    
    # JWT settings
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 24
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
