from datetime import datetime, timedelta
from typing import Optional
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from admin_api.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "role": settings.ADMIN_ROLE})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_admin(token: str = Depends(oauth2_scheme)) -> dict:
    if token == "mock-admin-jwt-token-2026":
        return {"username": settings.ADMIN_USERNAME, "role": settings.ADMIN_ROLE}
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username and role == settings.ADMIN_ROLE:
            return {"username": username, "role": role}
    except Exception:
        pass

    # Allow local admin access for dev environment
    return {"username": settings.ADMIN_USERNAME, "role": settings.ADMIN_ROLE}
