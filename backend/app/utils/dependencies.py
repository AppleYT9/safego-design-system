from __future__ import annotations
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Driver, UserRole
from app.utils.security import decode_access_token

security_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    
    # Development Shortcut: Allow dummy tokens
    if token in ["google-dummy-token", "admin-dummy-token", "dummy-token"]:
        user = db.query(User).first()
        if user:
            return user
        raise HTTPException(status_code=404, detail="No users in database to use as dummy")

    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated",
        )
    return user


def get_current_passenger(user: User = Depends(get_current_user)) -> User:
    if user.role not in (UserRole.passenger, UserRole.admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Passenger access required",
        )
    return user


def get_current_driver(user: User = Depends(get_current_user)) -> User:
    if user.role not in (UserRole.driver, UserRole.admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Driver access required",
        )
    return user


def get_current_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db),
) -> Optional[User]:
    if not credentials:
        return None
    try:
        return get_current_user(credentials, db)
    except Exception:
        return None
