from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import User, Ride, Rating, Driver, RideStatus
from app.schemas import (
    RideRequest,
    RideResponse,
    RideStatusUpdate,
    RatingCreate,
    RatingResponse,
)
from app.services.ride_service import create_ride, complete_ride, update_driver_rating
from app.utils.dependencies import get_current_user, get_current_passenger

router = APIRouter(prefix="/api/rides", tags=["rides"])


@router.post("/request", response_model=RideResponse, status_code=201)
async def request_ride(
    payload: RideRequest,
    current_user: User = Depends(get_current_passenger),
    db: Session = Depends(get_db),
):
    ride = await create_ride(
        db=db,
        passenger_id=current_user.id,
        mode=payload.mode,
        pickup_address=payload.pickup_address,
        pickup_latitude=payload.pickup_latitude,
        pickup_longitude=payload.pickup_longitude,
        destination_address=payload.destination_address,
        destination_latitude=payload.destination_latitude,
        destination_longitude=payload.destination_longitude,
        scheduled_at=payload.scheduled_at,
    )

    # Reload with driver relationship
    ride = (
        db.query(Ride)
        .options(
            joinedload(Ride.driver).joinedload(Driver.user),
            joinedload(Ride.driver).joinedload(Driver.vehicle),
        )
        .filter(Ride.id == ride.id)
        .first()
    )
    return ride


@router.post("/{ride_id}/confirm", response_model=RideResponse)
def confirm_ride(
    ride_id: int,
    current_user: User = Depends(get_current_passenger),
    db: Session = Depends(get_db),
):
    ride = db.query(Ride).filter(Ride.id == ride_id, Ride.passenger_id == current_user.id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    if ride.status != RideStatus.matched:
        raise HTTPException(status_code=400, detail="Ride is not in matched status")

    ride.status = RideStatus.driver_arriving
    db.commit()
    db.refresh(ride)

    ride = (
        db.query(Ride)
        .options(
            joinedload(Ride.driver).joinedload(Driver.user),
            joinedload(Ride.driver).joinedload(Driver.vehicle),
        )
        .filter(Ride.id == ride.id)
        .first()
    )
    return ride


@router.get("/active", response_model=RideResponse)
def get_active_ride(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    active_statuses = [
        RideStatus.searching,
        RideStatus.matched,
        RideStatus.driver_arriving,
        RideStatus.in_progress,
    ]
    ride = (
        db.query(Ride)
        .options(
            joinedload(Ride.driver).joinedload(Driver.user),
            joinedload(Ride.driver).joinedload(Driver.vehicle),
        )
        .filter(Ride.passenger_id == current_user.id, Ride.status.in_(active_statuses))
        .order_by(Ride.created_at.desc())
        .first()
    )
    if not ride:
        raise HTTPException(status_code=404, detail="No active ride found")
    return ride


@router.get("/me", response_model=List[RideResponse])
def get_my_rides(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rides = (
        db.query(Ride)
        .options(
            joinedload(Ride.driver).joinedload(Driver.user),
            joinedload(Ride.driver).joinedload(Driver.vehicle),
        )
        .filter(Ride.passenger_id == current_user.id)
        .order_by(Ride.created_at.desc())
        .all()
    )
    return rides


@router.get("/{ride_id}", response_model=RideResponse)
def get_ride(
    ride_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ride = (
        db.query(Ride)
        .options(
            joinedload(Ride.driver).joinedload(Driver.user),
            joinedload(Ride.driver).joinedload(Driver.vehicle),
        )
        .filter(Ride.id == ride_id)
        .first()
    )
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    # Passengers can only see their own rides unless admin
    if current_user.role.value != "admin" and ride.passenger_id != current_user.id:
        # Also allow the driver of the ride to see it
        driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
        if not driver or ride.driver_id != driver.id:
            raise HTTPException(status_code=403, detail="Access denied")

    return ride


@router.put("/{ride_id}/status", response_model=RideResponse)
def update_ride_status(
    ride_id: int,
    payload: RideStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    new_status = payload.status

    if new_status == "completed":
        ride = complete_ride(db, ride)
    elif new_status == "cancelled":
        ride.status = RideStatus.cancelled
        ride.cancelled_at = datetime.now(timezone.utc)
        ride.cancel_reason = payload.cancel_reason
        db.commit()
        db.refresh(ride)
    elif new_status == "in_progress":
        ride.status = RideStatus.in_progress
        ride.started_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(ride)
    elif new_status == "driver_arriving":
        ride.status = RideStatus.driver_arriving
        db.commit()
        db.refresh(ride)
    else:
        ride.status = RideStatus(new_status)
        db.commit()
        db.refresh(ride)

    ride = (
        db.query(Ride)
        .options(
            joinedload(Ride.driver).joinedload(Driver.user),
            joinedload(Ride.driver).joinedload(Driver.vehicle),
        )
        .filter(Ride.id == ride.id)
        .first()
    )
    return ride


@router.post("/{ride_id}/rate", response_model=RatingResponse, status_code=201)
def rate_ride(
    ride_id: int,
    payload: RatingCreate,
    current_user: User = Depends(get_current_passenger),
    db: Session = Depends(get_db),
):
    ride = db.query(Ride).filter(Ride.id == ride_id, Ride.passenger_id == current_user.id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    if ride.status != RideStatus.completed:
        raise HTTPException(status_code=400, detail="Can only rate completed rides")

    if not ride.driver_id:
        raise HTTPException(status_code=400, detail="Ride has no driver to rate")

    existing = db.query(Rating).filter(Rating.ride_id == ride_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Ride already rated")

    rating = Rating(
        ride_id=ride_id,
        rater_id=current_user.id,
        driver_id=ride.driver_id,
        score=payload.score,
        comment=payload.comment,
    )
    db.add(rating)
    db.commit()
    db.refresh(rating)

    # Recalculate driver average
    update_driver_rating(db, ride.driver_id)

    return rating
