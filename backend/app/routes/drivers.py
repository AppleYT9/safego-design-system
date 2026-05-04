from __future__ import annotations

from typing import List
from datetime import datetime, timezone

from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.models import User, Driver, Vehicle, DriverDocument, Ride, RideStatus, UserRole, DocumentStatus
from app.schemas import (
    DriverRegister, DriverResponse, DriverEarnings, DriverOnlineStatus,
    DriverDocumentResponse, DocumentUpload, RideResponse,
)
from app.services.driver_service import create_driver_profile
from app.utils.dependencies import get_current_user, get_current_driver

router = APIRouter(prefix="/api/drivers", tags=["drivers"])


async def _driver_dict(driver: Driver) -> dict:
    user = await User.get(driver.user_id)
    vehicle = await Vehicle.find_one(Vehicle.driver_id == driver.id)
    return {
        "_id": str(driver.id), "user_id": str(driver.user_id),
        "license_number": driver.license_number, "status": driver.status.value,
        "is_online": driver.is_online, "current_latitude": driver.current_latitude,
        "current_longitude": driver.current_longitude, "average_rating": driver.average_rating,
        "total_rides": driver.total_rides, "today_rides": driver.today_rides,
        "today_earnings": driver.today_earnings, "acceptance_rate": driver.acceptance_rate,
        "certified_modes": driver.certified_modes, "approved_at": driver.approved_at,
        "created_at": driver.created_at, "updated_at": driver.updated_at,
        "user": {"_id": str(user.id), "full_name": user.full_name, "email": user.email,
                 "phone": user.phone, "role": user.role.value,
                 "preferred_mode": user.preferred_mode.value if user.preferred_mode else None,
                 "gender": user.gender.value if user.gender else None,
                 "profile_photo": user.profile_photo, "is_active": user.is_active,
                 "is_verified": user.is_verified, "created_at": user.created_at,
                 "updated_at": user.updated_at} if user else None,
        "vehicle": {"_id": str(vehicle.id), "make": vehicle.make, "model": vehicle.model,
                    "year": vehicle.year, "color": vehicle.color,
                    "plate_number": vehicle.plate_number,
                    "is_wheelchair_accessible": vehicle.is_wheelchair_accessible,
                    "is_approved": vehicle.is_approved,
                    "created_at": vehicle.created_at} if vehicle else None,
    }


def _doc_dict(doc: DriverDocument) -> dict:
    return {
        "_id": str(doc.id), "driver_id": str(doc.driver_id),
        "document_type": doc.document_type.value, "file_url": doc.file_url,
        "status": doc.status.value,
        "reviewed_by": str(doc.reviewed_by) if doc.reviewed_by else None,
        "reviewed_at": doc.reviewed_at, "notes": doc.notes,
        "created_at": doc.created_at, "updated_at": doc.updated_at,
    }


async def _ride_dict(ride: Ride) -> dict:
    return {
        "_id": str(ride.id), "passenger_id": str(ride.passenger_id),
        "driver_id": str(ride.driver_id) if ride.driver_id else None,
        "mode": ride.mode.value, "status": ride.status.value,
        "pickup_address": ride.pickup_address, "pickup_latitude": ride.pickup_latitude,
        "pickup_longitude": ride.pickup_longitude, "destination_address": ride.destination_address,
        "destination_latitude": ride.destination_latitude,
        "destination_longitude": ride.destination_longitude,
        "distance_km": ride.distance_km, "duration_minutes": ride.duration_minutes,
        "fare_amount": ride.fare_amount, "safety_score": ride.safety_score,
        "route_polyline": ride.route_polyline, "scheduled_at": ride.scheduled_at,
        "started_at": ride.started_at, "completed_at": ride.completed_at,
        "cancelled_at": ride.cancelled_at, "cancel_reason": ride.cancel_reason,
        "created_at": ride.created_at, "updated_at": ride.updated_at, "driver": None,
    }


@router.post("/register", response_model=DriverResponse, status_code=201)
async def register_driver(payload: DriverRegister, current_user: User = Depends(get_current_user)):
    if current_user.role not in (UserRole.driver, UserRole.admin):
        raise HTTPException(status_code=403, detail="User must have driver role to register as driver")
    try:
        driver = await create_driver_profile(
            user=current_user,
            license_number=payload.license_number,
            vehicle_data=payload.vehicle.model_dump(),
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return await _driver_dict(driver)


@router.get("/me", response_model=DriverResponse)
async def get_driver_profile(current_user: User = Depends(get_current_driver)):
    driver = await Driver.find_one(Driver.user_id == current_user.id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    return await _driver_dict(driver)


@router.get("/me/earnings", response_model=DriverEarnings)
async def get_driver_earnings(current_user: User = Depends(get_current_driver)):
    driver = await Driver.find_one(Driver.user_id == current_user.id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    return DriverEarnings(
        today_rides=driver.today_rides or 0, today_earnings=driver.today_earnings or 0.0,
        total_rides=driver.total_rides or 0, acceptance_rate=driver.acceptance_rate or 100.0,
        average_rating=driver.average_rating or 0.0,
    )


@router.put("/me/online-status", response_model=DriverResponse)
async def toggle_online_status(payload: DriverOnlineStatus, current_user: User = Depends(get_current_driver)):
    driver = await Driver.find_one(Driver.user_id == current_user.id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    driver.is_online = payload.is_online
    driver.updated_at = datetime.now(timezone.utc)
    await driver.save()
    return await _driver_dict(driver)


@router.get("/me/available-rides", response_model=List[RideResponse])
async def get_available_rides(current_user: User = Depends(get_current_driver)):
    driver = await Driver.find_one(Driver.user_id == current_user.id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    rides = await Ride.find(
        {"status": {"$in": [RideStatus.pending.value, RideStatus.searching.value]}}
    ).sort(-Ride.created_at).to_list()
    certified = driver.certified_modes or ["normal"]
    available = [r for r in rides if r.mode.value in certified or r.mode.value == "normal"]
    return [await _ride_dict(r) for r in available]


@router.post("/me/rides/{ride_id}/accept", response_model=RideResponse)
async def accept_ride(ride_id: str, current_user: User = Depends(get_current_driver)):
    driver = await Driver.find_one(Driver.user_id == current_user.id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    ride = await Ride.get(PydanticObjectId(ride_id))
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    if ride.status not in (RideStatus.pending, RideStatus.searching):
        raise HTTPException(status_code=400, detail="Ride is no longer available")
    ride.driver_id = driver.id
    ride.status = RideStatus.matched
    await ride.save()
    return await _ride_dict(ride)


@router.post("/me/rides/{ride_id}/decline")
async def decline_ride(ride_id: str, current_user: User = Depends(get_current_driver)):
    driver = await Driver.find_one(Driver.user_id == current_user.id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    ride = await Ride.find_one(Ride.id == PydanticObjectId(ride_id), Ride.driver_id == driver.id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found or not assigned to you")
    ride.driver_id = None
    ride.status = RideStatus.searching
    await ride.save()
    return {"detail": "Ride declined"}


@router.get("/me/documents", response_model=List[DriverDocumentResponse])
async def list_documents(current_user: User = Depends(get_current_driver)):
    driver = await Driver.find_one(Driver.user_id == current_user.id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    docs = await DriverDocument.find(DriverDocument.driver_id == driver.id).to_list()
    return [_doc_dict(d) for d in docs]


@router.put("/me/documents/{doc_id}/upload", response_model=DriverDocumentResponse)
async def upload_document(doc_id: str, payload: DocumentUpload, current_user: User = Depends(get_current_driver)):
    driver = await Driver.find_one(Driver.user_id == current_user.id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    doc = await DriverDocument.find_one(
        DriverDocument.id == PydanticObjectId(doc_id),
        DriverDocument.driver_id == driver.id,
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.file_url = payload.file_url
    doc.status = DocumentStatus.pending
    doc.updated_at = datetime.now(timezone.utc)
    await doc.save()
    return _doc_dict(doc)
