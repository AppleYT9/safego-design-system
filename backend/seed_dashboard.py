import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

async def seed_dashboard_data():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.safego_db
    
    # 1. Ensure a driver exists (James Dela Cruz)
    user = await db.users.find_one({"email": "james@safego.com"})
    if not user:
        user_id = (await db.users.insert_one({
            "full_name": "James Dela Cruz",
            "email": "james@safego.com",
            "phone": "09123456789",
            "hashed_password": "fake_hashed_password",
            "role": "driver",
            "is_active": True,
            "is_verified": True,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })).inserted_id
    else:
        user_id = user["_id"]

    driver = await db.drivers.find_one({"user_id": user_id})
    if not driver:
        driver_id = (await db.drivers.insert_one({
            "user_id": user_id,
            "license_number": "D12-34-567890",
            "status": "approved",
            "is_online": True,
            "current_latitude": 22.3,
            "current_longitude": 73.19,
            "average_rating": 4.9,
            "today_rides": 12,
            "today_earnings": 3240.0,
            "acceptance_rate": 94.0,
            "total_rides": 1250,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        })).inserted_id
    else:
        driver_id = driver["_id"]
        await db.drivers.update_one({"_id": driver_id}, {"$set": {
            "average_rating": 4.9,
            "today_rides": 12,
            "today_earnings": 3240.0,
            "acceptance_rate": 94.0,
            "is_online": True,
            "current_latitude": 22.3,
            "current_longitude": 73.19
        }})

    # 2. Insert the 4 ride requests from the image
    rides_data = [
        {
            "passenger_id": user_id, # Self-request for demo purposes
            "pickup_address": "SM Megamall",
            "destination_address": "Makati CBD",
            "distance_km": 8.2,
            "fare_amount": 250.0,
            "passenger_count": 1,
            "mode": "pink",
            "status": "pending",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "passenger_id": user_id,
            "pickup_address": "QC Memorial",
            "destination_address": "Eastwood",
            "distance_km": 5.1,
            "fare_amount": 142.0,
            "passenger_count": 2,
            "mode": "normal",
            "status": "pending",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "passenger_id": user_id,
            "pickup_address": "BGC High Street",
            "destination_address": "Ortigas Center",
            "distance_km": 6.7,
            "fare_amount": 235.0,
            "passenger_count": 1,
            "mode": "premium",
            "status": "pending",
            "created_at": datetime.now(timezone.utc)
        },
        {
            "passenger_id": user_id,
            "pickup_address": "Mall of Asia",
            "destination_address": "Pasay CBD",
            "distance_km": 3.4,
            "fare_amount": 88.0,
            "passenger_count": 3,
            "mode": "pink",
            "status": "pending",
            "created_at": datetime.now(timezone.utc)
        }
    ]
    
    # 3. Insert historical data for Activity Feed
    # Completed rides
    await db.rides.insert_many([
        {
            "passenger_id": user_id,
            "driver_id": driver_id,
            "pickup_address": "Quezon City",
            "destination_address": "Makati CBD",
            "distance_km": 15.5,
            "fare_amount": 450.0,
            "status": "completed",
            "mode": "normal",
            "completed_at": datetime.now(timezone.utc),
            "created_at": datetime.now(timezone.utc)
        },
        {
            "passenger_id": user_id,
            "driver_id": driver_id,
            "pickup_address": "Pasig City",
            "destination_address": "BGC",
            "distance_km": 5.2,
            "fare_amount": 180.0,
            "status": "completed",
            "mode": "normal",
            "completed_at": datetime.now(timezone.utc),
            "created_at": datetime.now(timezone.utc)
        }
    ])

    # Verified Document
    await db.driver_documents.update_many(
        {"driver_id": driver_id, "document_type": "vehicle_registration"},
        {"$set": {"status": "verified", "updated_at": datetime.now(timezone.utc)}}
    )

    # 5-star rating
    await db.ratings.insert_one({
        "ride_id": user_id, # Mock ID
        "rater_id": user_id,
        "driver_id": driver_id,
        "score": 5,
        "comment": "Great driver!",
        "created_at": datetime.now(timezone.utc)
    })

    print("Successfully seeded dashboard and historical data to MongoDB!")

if __name__ == "__main__":
    asyncio.run(seed_dashboard_data())
