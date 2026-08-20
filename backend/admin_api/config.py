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
    # Standard PostgreSQL string or fallback SQLite file
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'database', 'admin_analytics.db')}"
    )

settings = Settings()
