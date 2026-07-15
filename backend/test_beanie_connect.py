import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models import User

async def main():
    print("Testing connection to:", settings.DATABASE_URL)
    client = AsyncIOMotorClient(settings.DATABASE_URL, serverSelectionTimeoutMS=2000)
    db_name = settings.DATABASE_URL.rsplit("/", 1)[-1].split("?")[0] or "safego_db"
    db = client[db_name]
    print("Database name:", db_name)
    
    print("Initializing Beanie with User model...")
    try:
        await init_beanie(database=db, document_models=[User])
        print("Beanie initialized successfully!")
    except Exception as e:
        print("Beanie initialization failed:", e)
        
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
