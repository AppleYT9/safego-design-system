from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import register_user, authenticate_user, create_token_for_user
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if payload.role not in ("passenger", "driver"):
        raise HTTPException(status_code=400, detail="Role must be 'passenger' or 'driver'")

    try:
        user = register_user(
            db=db,
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone,
            password=payload.password,
            role=payload.role,
            gender=payload.gender,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    token = create_token_for_user(user)
    role_val = user.role.value if hasattr(user.role, 'value') else user.role
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        role=role_val,
        user_id=user.id,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
