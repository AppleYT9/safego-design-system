import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def list_users():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["safego_db"]
    users_coll = db["users"]
    
    with open("user_details.txt", "w") as f:
        f.write("--- MongoDB User Login Details ---\n\n")
        async for user in users_coll.find({}):
            role = user.get('role')
            email = user.get('email')
            name = user.get('full_name')
            # We can't see the password because it's hashed, 
            # but we can list the emails for the user to try.
            f.write(f"ROLE: {role}\n")
            f.write(f"NAME: {name}\n")
            f.write(f"EMAIL: {email}\n")
            f.write("-" * 20 + "\n")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(list_users())
