import asyncio
from app.config import connect_db
from app.models import Driver, User, Vehicle

async def clean_orphans():
    await connect_db()
    drivers = await Driver.find_all().to_list()
    count = 0
    for driver in drivers:
        user = await User.get(driver.user_id)
        if not user:
            print(f"Deleting orphaned driver: {driver.id}")
            vehicle = await Vehicle.find_one(Vehicle.driver_id == driver.id)
            if vehicle:
                await vehicle.delete()
            await driver.delete()
            count += 1
    print(f"Cleaned up {count} orphaned driver records.")

if __name__ == "__main__":
    asyncio.run(clean_orphans())
