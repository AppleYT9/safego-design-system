import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def check_db():
    url = os.getenv("DATABASE_URL", "mongodb://127.0.0.1:27017/safego_db")
    print(f"Connecting to {url}...")
    client = AsyncIOMotorClient(url, serverSelectionTimeoutMS=2000)
    try:
        await client.admin.command('ping')
        print("MongoDB Ping successful!")
    except Exception as e:
        print(f"MongoDB Ping failed: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
