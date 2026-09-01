import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Admin Analytics Application API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/admin"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-admin-analytics-jwt-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Admin Credentials
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin@softtech.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "AdminPass123!")
    ADMIN_ROLE: str = "admin"
    
    # Database
    # Render PostgreSQL database connection string
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://system_config_db_user:QVuInDcU0ZU5VHmoxRCmQduZQ3bD5EEk@dpg-dabd9tss728c73acarlg-a.oregon-postgres.render.com/system_config_db_zap3"
    )

settings = Settings()
