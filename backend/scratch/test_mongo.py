
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def test_mongo():
    load_dotenv()
    db_url = os.environ.get("DATABASE_URL", "mongodb://127.0.0.1:27017/safego_db")
    print(f"Connecting to: {db_url}")
    client = AsyncIOMotorClient(db_url, serverSelectionTimeoutMS=5000)
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("MongoDB connection successful!")
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_mongo())
