from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.models import User
from app.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import register_user, authenticate_user, create_token_for_user
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if payload.role not in ("passenger", "driver"):
        raise HTTPException(status_code=400, detail="Role must be 'passenger' or 'driver'")

    try:
        user = await register_user(
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone,
            password=payload.password,
            role=payload.role,
            gender=payload.gender,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return _user_to_response(user)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    user = await authenticate_user(payload.email, payload.password)
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
        user_id=str(user.id),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return _user_to_response(current_user)


def _user_to_response(user: User) -> dict:
    """Helper to convert a Beanie User document to a response dict."""
    return {
        "_id": str(user.id),
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "role": user.role.value if hasattr(user.role, "value") else user.role,
        "preferred_mode": user.preferred_mode.value if user.preferred_mode and hasattr(user.preferred_mode, "value") else user.preferred_mode,
        "gender": user.gender.value if user.gender and hasattr(user.gender, "value") else user.gender,
        "profile_photo": user.profile_photo,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }
