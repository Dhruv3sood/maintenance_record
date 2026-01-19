from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Auth
    maintenance_passcode: str
    sales_passcode: str
    jwt_secret: str
    
    # Database
    database_url: str = "sqlite:///./maintenance_crm.db"
    
    # JWT settings
    jwt_algorithm: str = "HS256"
    jwt_expire_hours: int = 24
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
