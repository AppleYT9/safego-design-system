import asyncio
from app.database import init_db
from app.models import User, UserRole
from app.utils.security import hash_password
from app.config import settings

async def seed():
    await init_db()
    admin_email = "admin@safego.ph"
    existing_admin = await User.find_one(User.email == admin_email)
    if not existing_admin:
        admin_user = User(
            full_name="SafeGo Admin",
            email=admin_email,
            phone="+639000000000",
            hashed_password=hash_password("Admin@SafeGo2025"),
            role=UserRole.admin,
            is_active=True,
            is_verified=True,
        )
        await admin_user.insert()
        print(f"Admin user {admin_email} created successfully.")
    else:
        print(f"Admin user {admin_email} already exists.")

if __name__ == "__main__":
    asyncio.run(seed())
