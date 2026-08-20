from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from admin_api.config import settings
from admin_api.auth import create_access_token, get_current_admin

router = APIRouter(prefix="/auth", tags=["Admin Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_user: dict

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest):
    # Enforce strict admin access verification
    if request.username != settings.ADMIN_USERNAME or request.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials. Only designated Admin users can log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": request.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "admin_user": {
            "username": request.username,
            "role": settings.ADMIN_ROLE,
            "title": "System Administrator"
        }
    }

@router.get("/me")
def get_current_admin_user(current_admin: dict = Depends(get_current_admin)):
    return {
        "username": current_admin["username"],
        "role": current_admin["role"],
        "authenticated": True
    }
