from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional
from beanie import PydanticObjectId

from fastapi import APIRouter, Depends, HTTPException, Query

from app.models import User, Driver, Vehicle, Ride, SOSAlert, DriverDocument, UserRole, DriverStatus, RideStatus, RideMode, SOSStatus, DocumentStatus
from app.schemas import AdminStats, RidesByMode, SafetyScoreStat, DriverApproval, DocumentReview, UserResponse, DriverResponse, RideResponse, SOSResponse, DriverDocumentResponse, UserToggleActive
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _user_dict(u: User) -> dict:
    return {"_id": str(u.id), "full_name": u.full_name, "email": u.email, "phone": u.phone,
            "role": u.role.value, "preferred_mode": u.preferred_mode.value if u.preferred_mode else None,
            "gender": u.gender.value if u.gender else None, "profile_photo": u.profile_photo,
            "is_active": u.is_active, "is_verified": u.is_verified, "created_at": u.created_at, "updated_at": u.updated_at}


def _sos_dict(s: SOSAlert) -> dict:
    return {"_id": str(s.id), "user_id": str(s.user_id), "ride_id": str(s.ride_id) if s.ride_id else None,
            "latitude": s.latitude, "longitude": s.longitude, "location_address": s.location_address,
            "severity": s.severity.value, "status": s.status.value, "notes": s.notes,
            "resolved_by": str(s.resolved_by) if s.resolved_by else None, "resolved_at": s.resolved_at, "created_at": s.created_at}


def _doc_dict(d: DriverDocument) -> dict:
    return {"_id": str(d.id), "driver_id": str(d.driver_id), "document_type": d.document_type.value,
            "file_url": d.file_url, "status": d.status.value, "reviewed_by": str(d.reviewed_by) if d.reviewed_by else None,
            "reviewed_at": d.reviewed_at, "notes": d.notes, "created_at": d.created_at, "updated_at": d.updated_at}


def _ride_dict(r: Ride) -> dict:
    return {"_id": str(r.id), "passenger_id": str(r.passenger_id), "driver_id": str(r.driver_id) if r.driver_id else None,
            "mode": r.mode.value, "status": r.status.value, "pickup_address": r.pickup_address,
            "pickup_latitude": r.pickup_latitude, "pickup_longitude": r.pickup_longitude,
            "destination_address": r.destination_address, "destination_latitude": r.destination_latitude,
            "destination_longitude": r.destination_longitude, "distance_km": r.distance_km,
            "duration_minutes": r.duration_minutes, "fare_amount": r.fare_amount, "safety_score": r.safety_score,
            "route_polyline": r.route_polyline, "scheduled_at": r.scheduled_at, "started_at": r.started_at,
            "completed_at": r.completed_at, "cancelled_at": r.cancelled_at, "cancel_reason": r.cancel_reason,
            "created_at": r.created_at, "updated_at": r.updated_at, "driver": None}


async def _driver_dict(driver: Driver) -> dict:
    user = await User.get(driver.user_id)
    vehicle = await Vehicle.find_one(Vehicle.driver_id == driver.id)
    return {
        "_id": str(driver.id), "user_id": str(driver.user_id), "license_number": driver.license_number,
        "status": driver.status.value, "is_online": driver.is_online,
        "current_latitude": driver.current_latitude, "current_longitude": driver.current_longitude,
        "average_rating": driver.average_rating, "total_rides": driver.total_rides,
        "today_rides": driver.today_rides, "today_earnings": driver.today_earnings,
        "acceptance_rate": driver.acceptance_rate, "certified_modes": driver.certified_modes,
        "approved_at": driver.approved_at, "created_at": driver.created_at, "updated_at": driver.updated_at,
        "user": _user_dict(user) if user else None,
        "vehicle": {"_id": str(vehicle.id), "make": vehicle.make, "model": vehicle.model, "year": vehicle.year,
                    "color": vehicle.color, "plate_number": vehicle.plate_number,
                    "is_wheelchair_accessible": vehicle.is_wheelchair_accessible,
                    "is_approved": vehicle.is_approved, "created_at": vehicle.created_at} if vehicle else None,
    }


@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(admin: User = Depends(get_current_admin)):
    total_users = await User.count()
    total_drivers = await Driver.count()
    active_drivers = await Driver.find(Driver.is_online == True, Driver.status == DriverStatus.approved).count()
    pending_drivers = await Driver.find(Driver.status == DriverStatus.pending).count()
    total_rides = await Ride.count()
    active_rides = await Ride.find({"status": {"$in": [RideStatus.searching.value, RideStatus.matched.value, RideStatus.driver_arriving.value, RideStatus.in_progress.value]}}).count()
    total_sos = await SOSAlert.count()
    active_sos = await SOSAlert.find(SOSAlert.status == SOSStatus.active).count()
    return AdminStats(total_users=total_users, total_drivers=total_drivers, active_drivers=active_drivers,
                      pending_drivers=pending_drivers, total_rides=total_rides, active_rides=active_rides,
                      total_sos_alerts=total_sos, active_sos_alerts=active_sos)


@router.get("/analytics/rides-by-mode", response_model=List[RidesByMode])
async def get_rides_by_mode(admin: User = Depends(get_current_admin)):
    results = {}
    for mode in RideMode:
        count = await Ride.find(Ride.mode == mode).count()
        if count > 0:
            results[mode.value] = count
    return [RidesByMode(mode=m, rides=c) for m, c in results.items()]


@router.get("/analytics/safety-scores", response_model=List[SafetyScoreStat])
async def get_safety_scores(admin: User = Depends(get_current_admin)):
    import calendar
    from datetime import date
    today = date.today()
    stats = []
    for i in range(5, -1, -1):
        month = today.month - i
        year = today.year
        if month <= 0:
            month += 12
            year -= 1
        stats.append(SafetyScoreStat(month=f"{year}-{month:02d}", score=90.0))
    return stats


@router.get("/drivers/pending", response_model=List[DriverResponse])
async def get_pending_drivers(admin: User = Depends(get_current_admin)):
    drivers = await Driver.find(Driver.status == DriverStatus.pending).to_list()
    return [await _driver_dict(d) for d in drivers]


@router.put("/drivers/{driver_id}/approval", response_model=DriverResponse)
async def approve_driver(driver_id: str, payload: DriverApproval, admin: User = Depends(get_current_admin)):
    driver = await Driver.get(PydanticObjectId(driver_id))
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    if payload.status == "approved":
        driver.status = DriverStatus.approved
        driver.approved_at = datetime.now(timezone.utc)
    elif payload.status == "rejected":
        driver.status = DriverStatus.rejected
    else:
        raise HTTPException(status_code=400, detail="Status must be 'approved' or 'rejected'")
    await driver.save()
    return await _driver_dict(driver)


@router.put("/drivers/{driver_id}/documents/{doc_id}", response_model=DriverDocumentResponse)
async def review_document(driver_id: str, doc_id: str, payload: DocumentReview, admin: User = Depends(get_current_admin)):
    doc = await DriverDocument.find_one(DriverDocument.id == PydanticObjectId(doc_id), DriverDocument.driver_id == PydanticObjectId(driver_id))
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if payload.status not in ("verified", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be 'verified' or 'rejected'")
    doc.status = DocumentStatus(payload.status)
    doc.notes = payload.notes
    doc.reviewed_by = admin.id
    doc.reviewed_at = datetime.now(timezone.utc)
    await doc.save()
    return _doc_dict(doc)


@router.get("/rides/live", response_model=List[RideResponse])
async def get_live_rides(admin: User = Depends(get_current_admin)):
    rides = await Ride.find(Ride.status == RideStatus.in_progress).sort(-Ride.created_at).to_list()
    return [_ride_dict(r) for r in rides]


@router.get("/rides", response_model=List[RideResponse])
async def get_all_rides(status: Optional[str] = Query(None), mode: Optional[str] = Query(None),
                        page: int = Query(default=1, ge=1), per_page: int = Query(default=20, ge=1, le=100),
                        admin: User = Depends(get_current_admin)):
    query = {}
    if status:
        query["status"] = status
    if mode:
        query["mode"] = mode
    rides = await Ride.find(query).sort(-Ride.created_at).skip((page - 1) * per_page).limit(per_page).to_list()
    return [_ride_dict(r) for r in rides]


@router.get("/sos-alerts", response_model=List[SOSResponse])
async def get_sos_alerts(status: Optional[str] = Query(None), admin: User = Depends(get_current_admin)):
    query = {}
    if status:
        query["status"] = status
    alerts = await SOSAlert.find(query).sort(-SOSAlert.created_at).to_list()
    return [_sos_dict(a) for a in alerts]


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(role: Optional[str] = Query(None), page: int = Query(default=1, ge=1),
                        per_page: int = Query(default=20, ge=1, le=100), admin: User = Depends(get_current_admin)):
    query = {}
    if role:
        query["role"] = role
    users = await User.find(query).sort(-User.created_at).skip((page - 1) * per_page).limit(per_page).to_list()
    return [_user_dict(u) for u in users]


@router.put("/users/{user_id}/toggle-active", response_model=UserResponse)
async def toggle_user_active(user_id: str, payload: UserToggleActive, admin: User = Depends(get_current_admin)):
    user = await User.get(PydanticObjectId(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = payload.is_active
    await user.save()
    return _user_dict(user)
