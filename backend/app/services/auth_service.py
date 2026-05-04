from __future__ import annotations

from app.models import User, UserRole
from app.utils.security import hash_password, verify_password, create_access_token


async def register_user(
    full_name: str,
    email: str,
    phone: str,
    password: str,
    role: str = "passenger",
    gender: str = "male",
) -> User:
    """Create a new user in the database."""
    existing_email = await User.find_one(User.email == email)
    if existing_email:
        raise ValueError("Email already registered")

    existing_phone = await User.find_one(User.phone == phone)
    if existing_phone:
        raise ValueError("Phone number already registered")

    user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        hashed_password=hash_password(password),
        role=UserRole(role),
        gender=gender,
    )
    await user.insert()
    return user


async def authenticate_user(email: str, password: str) -> User | None:
    """Verify email+password and return the user or None."""
    user = await User.find_one(User.email == email)
    if user is None:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_token_for_user(user: User) -> str:
    """Create a JWT access token for the given user."""
    return create_access_token(
        data={"sub": str(user.id), "role": user.role.value if hasattr(user.role, 'value') else user.role}
    )
