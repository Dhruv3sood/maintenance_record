from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.security import verify_token
from app.config import settings

security = HTTPBearer()


def get_current_role(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Extract role from JWT token"""
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    role = payload.get("role")
    if role not in ["maintenance", "sales"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid role"
        )
    return role


def require_maintenance(role: str = Depends(get_current_role)) -> str:
    """Require maintenance role"""
    if role != "maintenance":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Maintenance role required"
        )
    return role


def require_sales(role: str = Depends(get_current_role)) -> str:
    """Require sales role"""
    if role != "sales":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sales role required"
        )
    return role


def require_any_role(role: str = Depends(get_current_role)) -> str:
    """Allow either maintenance or sales role"""
    return role
