from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional
from beanie import PydanticObjectId

from fastapi import APIRouter, Depends, HTTPException, status

from app.models import User, Ride, Rating, Driver, Vehicle, RideStatus
from app.schemas import RideRequest, RideResponse, RideStatusUpdate, RatingCreate, RatingResponse
from app.services.ride_service import create_ride, complete_ride, update_driver_rating
from app.utils.dependencies import get_current_user, get_current_passenger

router = APIRouter(prefix="/api/rides", tags=["rides"])


def _ride_dict(ride: Ride, driver_brief=None) -> dict:
    return {
        "_id": str(ride.id),
        "passenger_id": str(ride.passenger_id),
        "driver_id": str(ride.driver_id) if ride.driver_id else None,
        "mode": ride.mode.value,
        "status": ride.status.value,
        "pickup_address": ride.pickup_address,
        "pickup_latitude": ride.pickup_latitude,
        "pickup_longitude": ride.pickup_longitude,
        "destination_address": ride.destination_address,
        "destination_latitude": ride.destination_latitude,
        "destination_longitude": ride.destination_longitude,
        "distance_km": ride.distance_km,
        "duration_minutes": ride.duration_minutes,
        "fare_amount": ride.fare_amount,
        "safety_score": ride.safety_score,
        "route_polyline": ride.route_polyline,
        "scheduled_at": ride.scheduled_at,
        "started_at": ride.started_at,
        "completed_at": ride.completed_at,
        "cancelled_at": ride.cancelled_at,
        "cancel_reason": ride.cancel_reason,
        "passenger_count": ride.passenger_count,
        "passenger_details": ride.passenger_details,
        "created_at": ride.created_at,
        "updated_at": ride.updated_at,
        "driver": driver_brief,
    }


async def _load_driver_brief(driver_id: PydanticObjectId):
    if not driver_id:
        return None
    driver = await Driver.get(driver_id)
    if not driver:
        return None
    user = await User.get(driver.user_id)
    vehicle = await Vehicle.find_one(Vehicle.driver_id == driver.id)
    return {
        "_id": str(driver.id),
        "average_rating": driver.average_rating,
        "user": {"full_name": user.full_name} if user else None,
        "vehicle": {"make": vehicle.make, "model": vehicle.model, "plate_number": vehicle.plate_number} if vehicle else None,
    }


@router.post("/request", response_model=RideResponse, status_code=201)
async def request_ride(payload: RideRequest, current_user: User = Depends(get_current_passenger)):
    ride = await create_ride(
        passenger_id=current_user.id,
        mode=payload.mode,
        pickup_address=payload.pickup_address,
        pickup_latitude=payload.pickup_latitude,
        pickup_longitude=payload.pickup_longitude,
        destination_address=payload.destination_address,
        destination_latitude=payload.destination_latitude,
        destination_longitude=payload.destination_longitude,
        scheduled_at=payload.scheduled_at,
        passenger_count=payload.passenger_count,
        passenger_details=payload.passenger_details,
    )
    driver_brief = await _load_driver_brief(ride.driver_id)
    return _ride_dict(ride, driver_brief)


@router.post("/{ride_id}/confirm", response_model=RideResponse)
async def confirm_ride(ride_id: str, current_user: User = Depends(get_current_passenger)):
    ride = await Ride.find_one(Ride.id == PydanticObjectId(ride_id), Ride.passenger_id == current_user.id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    if ride.status != RideStatus.matched:
        raise HTTPException(status_code=400, detail="Ride is not in matched status")
    ride.status = RideStatus.driver_arriving
    await ride.save()
    driver_brief = await _load_driver_brief(ride.driver_id)
    return _ride_dict(ride, driver_brief)


@router.get("/active", response_model=RideResponse)
async def get_active_ride(current_user: User = Depends(get_current_user)):
    active_statuses = [RideStatus.searching.value, RideStatus.matched.value, RideStatus.driver_arriving.value, RideStatus.in_progress.value]
    ride = await Ride.find_one(
        {"passenger_id": current_user.id, "status": {"$in": active_statuses}}
    )
    if not ride:
        raise HTTPException(status_code=404, detail="No active ride found")
    driver_brief = await _load_driver_brief(ride.driver_id)
    return _ride_dict(ride, driver_brief)


@router.get("/me", response_model=List[RideResponse])
async def get_my_rides(current_user: User = Depends(get_current_user)):
    rides = await Ride.find(Ride.passenger_id == current_user.id).sort(-Ride.created_at).to_list()
    result = []
    for ride in rides:
        db = await _load_driver_brief(ride.driver_id)
        result.append(_ride_dict(ride, db))
    return result


@router.get("/{ride_id}", response_model=RideResponse)
async def get_ride(ride_id: str, current_user: User = Depends(get_current_user)):
    ride = await Ride.get(PydanticObjectId(ride_id))
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    role_val = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
    if role_val != "admin" and ride.passenger_id != current_user.id:
        driver = await Driver.find_one(Driver.user_id == current_user.id)
        if not driver or ride.driver_id != driver.id:
            raise HTTPException(status_code=403, detail="Access denied")
    driver_brief = await _load_driver_brief(ride.driver_id)
    return _ride_dict(ride, driver_brief)


@router.put("/{ride_id}/status", response_model=RideResponse)
async def update_ride_status(ride_id: str, payload: RideStatusUpdate, current_user: User = Depends(get_current_user)):
    ride = await Ride.get(PydanticObjectId(ride_id))
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    if payload.status == "completed":
        ride = await complete_ride(ride)
    elif payload.status == "cancelled":
        ride.status = RideStatus.cancelled
        ride.cancelled_at = datetime.now(timezone.utc)
        ride.cancel_reason = payload.cancel_reason
        await ride.save()
    elif payload.status == "in_progress":
        ride.status = RideStatus.in_progress
        ride.started_at = datetime.now(timezone.utc)
        await ride.save()
    elif payload.status == "driver_arriving":
        ride.status = RideStatus.driver_arriving
        await ride.save()
    else:
        ride.status = RideStatus(payload.status)
        await ride.save()
    driver_brief = await _load_driver_brief(ride.driver_id)
    return _ride_dict(ride, driver_brief)


@router.post("/{ride_id}/rate", response_model=RatingResponse, status_code=201)
async def rate_ride(ride_id: str, payload: RatingCreate, current_user: User = Depends(get_current_passenger)):
    ride = await Ride.find_one(Ride.id == PydanticObjectId(ride_id), Ride.passenger_id == current_user.id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    if ride.status != RideStatus.completed:
        raise HTTPException(status_code=400, detail="Can only rate completed rides")
    if not ride.driver_id:
        raise HTTPException(status_code=400, detail="Ride has no driver to rate")
    existing = await Rating.find_one(Rating.ride_id == ride.id)
    if existing:
        raise HTTPException(status_code=400, detail="Ride already rated")
    rating = Rating(
        ride_id=ride.id,
        rater_id=current_user.id,
        driver_id=ride.driver_id,
        score=payload.score,
        comment=payload.comment,
    )
    await rating.insert()
    await update_driver_rating(ride.driver_id)
    return {
        "_id": str(rating.id),
        "ride_id": str(rating.ride_id),
        "rater_id": str(rating.rater_id),
        "driver_id": str(rating.driver_id),
        "score": rating.score,
        "comment": rating.comment,
        "created_at": rating.created_at,
    }
