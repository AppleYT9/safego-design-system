from __future__ import annotations

from sqlalchemy.orm import Session

from app.models import User, UserRole
from app.utils.security import hash_password, verify_password, create_access_token


def register_user(
    db: Session,
    full_name: str,
    email: str,
    phone: str,
    password: str,
    role: str = "passenger",
) -> User:
    """Create a new user in the database."""
    existing = db.query(User).filter((User.email == email) | (User.phone == phone)).first()
    if existing:
        if existing.email == email:
            raise ValueError("Email already registered")
        raise ValueError("Phone number already registered")

    user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        hashed_password=hash_password(password),
        role=UserRole(role),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Verify email+password and return the user or None."""
    user = db.query(User).filter(User.email == email).first()
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
