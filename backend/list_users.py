import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def list_users():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["safego_db"]
    users_coll = db["users"]
    
    print("--- MongoDB User Details ---")
    async for user in users_coll.find({}):
        print(f"Role: {user.get('role')} | Email: {user.get('email')} | Name: {user.get('full_name')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(list_users())
