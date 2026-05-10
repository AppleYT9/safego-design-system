import asyncio
from app.models import User, UserRole
from app.database import init_db, close_db
from app.utils.security import hash_password

async def create_test_passenger():
    await init_db()
    email = "test@safego.com"
    existing = await User.find_one(User.email == email)
    if not existing:
        user = User(
            full_name="Test Passenger",
            email=email,
            phone="09000000001",
            hashed_password=hash_password("password123"),
            role=UserRole.passenger,
            is_active=True,
            is_verified=True
        )
        await user.insert()
        print(f"Created test user: {email} / password123")
    else:
        print(f"Test user already exists: {email}")
    await close_db()

if __name__ == "__main__":
    asyncio.run(create_test_passenger())
