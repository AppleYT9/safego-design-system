import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_mongo():
    url = "mongodb://localhost:27017/safego_db"
    print(f"Connecting to {url}...")
    client = AsyncIOMotorClient(url, serverSelectionTimeoutMS=2000)
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        print("MongoDB is UP and running!")
    except Exception as e:
        print(f"MongoDB is DOWN or unreachable: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_mongo())
