from __future__ import annotations

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.config import settings

# Motor client
_client: AsyncIOMotorClient = None  # type: ignore


async def init_db():
    """Initialize Motor client and Beanie ODM. Call once at startup."""
    global _client

    from app.models import (
        User, Driver, Vehicle, DriverDocument,
        Ride, RideLocationHistory, Rating,
        EmergencyContact, SOSAlert, Notification,
    )

    _client = AsyncIOMotorClient(settings.DATABASE_URL)
    db_name = settings.DATABASE_URL.rsplit("/", 1)[-1].split("?")[0] or "safego_db"

    await init_beanie(
        database=_client[db_name],
        document_models=[
            User, Driver, Vehicle, DriverDocument,
            Ride, RideLocationHistory, Rating,
            EmergencyContact, SOSAlert, Notification,
        ],
    )
    print(f"[DB] Connected to MongoDB: {db_name}")


async def close_db():
    """Shutdown Motor client."""
    global _client
    if _client:
        _client.close()
        print("[DB] MongoDB connection closed")
