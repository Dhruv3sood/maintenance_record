from fastapi import APIRouter, HTTPException, status
from datetime import timedelta
from app.schemas import LoginRequest, TokenResponse
from app.security import create_access_token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Login with passcode and get JWT token"""
    role = None
    
    if request.passcode == settings.maintenance_passcode:
        role = "maintenance"
    elif request.passcode == settings.sales_passcode:
        role = "sales"
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid passcode"
        )
    
    access_token = create_access_token(data={"role": role})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=role
    )
