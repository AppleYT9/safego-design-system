from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Driver, DriverStatus
from app.schemas import RouteRequest, RouteResponse, NearbyDriverResponse
from app.services.map_service import get_route
from app.utils.fare import haversine_distance, estimate_duration
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/map", tags=["map"])


@router.post("/route", response_model=RouteResponse)
async def calculate_route(payload: RouteRequest):
    result = await get_route(
        pickup_lat=payload.pickup_latitude,
        pickup_lng=payload.pickup_longitude,
        dest_lat=payload.destination_latitude,
        dest_lng=payload.destination_longitude,
        mode=payload.mode,
    )
    return RouteResponse(**result)


@router.get("/nearby-drivers", response_model=List[NearbyDriverResponse])
def get_nearby_drivers(
    latitude: float = Query(...),
    longitude: float = Query(...),
    mode: str = Query(default="normal"),
    db: Session = Depends(get_db),
):
    drivers = (
        db.query(Driver)
        .filter(
            Driver.status == DriverStatus.approved,
            Driver.is_online == True,
            Driver.current_latitude.isnot(None),
            Driver.current_longitude.isnot(None),
        )
        .all()
    )

    nearby = []
    for driver in drivers:
        certified = driver.certified_modes or ["normal"]
        if mode not in certified and mode != "normal":
            continue

        dist = haversine_distance(latitude, longitude, driver.current_latitude, driver.current_longitude)
        if dist > 50:  # Skip drivers > 50km away
            continue

        eta = estimate_duration(dist)

        vehicle_brief = None
        if driver.vehicle:
            vehicle_brief = {
                "make": driver.vehicle.make,
                "model": driver.vehicle.model,
                "plate_number": driver.vehicle.plate_number,
            }

        nearby.append(NearbyDriverResponse(
            driver_id=driver.id,
            driver_name=driver.user.full_name if driver.user else "Unknown",
            latitude=driver.current_latitude,
            longitude=driver.current_longitude,
            distance_km=round(dist, 2),
            eta_minutes=eta,
            average_rating=driver.average_rating or 0.0,
            vehicle=vehicle_brief,
        ))

    # Sort by distance
    nearby.sort(key=lambda d: d.distance_km)
    return nearby[:20]
