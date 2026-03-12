from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.models import Ride, Driver, RideStatus, DriverStatus, RideMode
from app.utils.fare import haversine_distance
from app.services.map_service import get_route


def find_nearest_driver(db: Session, pickup_lat: float, pickup_lng: float, mode: str) -> Optional[Driver]:
    """Find the nearest online + approved driver who is certified for the given mode."""
    drivers = db.query(Driver).filter(
        Driver.status == DriverStatus.approved,
        Driver.is_online == True,
        Driver.current_latitude.isnot(None),
        Driver.current_longitude.isnot(None),
    ).all()

    best_driver = None
    best_distance = float("inf")

    for driver in drivers:
        # Check mode certification
        certified = driver.certified_modes or []
        if mode not in certified and mode != "normal":
            continue

        dist = haversine_distance(
            pickup_lat, pickup_lng,
            driver.current_latitude, driver.current_longitude,
        )
        if dist < best_distance:
            best_distance = dist
            best_driver = driver

    return best_driver


async def create_ride(
    db: Session,
    passenger_id: int,
    mode: str,
    pickup_address: str | None,
    pickup_latitude: float,
    pickup_longitude: float,
    destination_address: str | None,
    destination_latitude: float,
    destination_longitude: float,
    scheduled_at: datetime | None = None,
) -> Ride:
    """Create a ride request and attempt to match a driver."""
    # Get route info
    route_info = await get_route(
        pickup_latitude, pickup_longitude,
        destination_latitude, destination_longitude,
        mode,
    )

    ride = Ride(
        passenger_id=passenger_id,
        mode=RideMode(mode),
        status=RideStatus.searching,
        pickup_address=pickup_address,
        pickup_latitude=pickup_latitude,
        pickup_longitude=pickup_longitude,
        destination_address=destination_address,
        destination_latitude=destination_latitude,
        destination_longitude=destination_longitude,
        distance_km=route_info["distance_km"],
        duration_minutes=route_info["duration_minutes"],
        fare_amount=route_info["fare_amount"],
        safety_score=route_info["safety_score"],
        route_polyline=route_info["route_polyline"],
        scheduled_at=scheduled_at,
    )

    # Try to match a driver
    driver = find_nearest_driver(db, pickup_latitude, pickup_longitude, mode)
    if driver:
        ride.driver_id = driver.id
        ride.status = RideStatus.matched

    db.add(ride)
    db.commit()
    db.refresh(ride)
    return ride


def complete_ride(db: Session, ride: Ride) -> Ride:
    """Mark a ride as completed and update driver stats."""
    ride.status = RideStatus.completed
    ride.completed_at = datetime.now(timezone.utc)

    if ride.driver_id:
        driver = db.query(Driver).filter(Driver.id == ride.driver_id).first()
        if driver:
            driver.total_rides = (driver.total_rides or 0) + 1
            driver.today_rides = (driver.today_rides or 0) + 1
            driver.today_earnings = (driver.today_earnings or 0) + (ride.fare_amount or 0)

    db.commit()
    db.refresh(ride)
    return ride


def update_driver_rating(db: Session, driver_id: int):
    """Recalculate the average rating for a driver from all ratings."""
    from app.models import Rating
    ratings = db.query(Rating).filter(Rating.driver_id == driver_id).all()
    if ratings:
        avg = sum(r.score for r in ratings) / len(ratings)
        driver = db.query(Driver).filter(Driver.id == driver_id).first()
        if driver:
            driver.average_rating = round(avg, 2)
            db.commit()
