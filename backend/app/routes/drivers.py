from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import User, Driver, Vehicle, DriverDocument, Ride, RideStatus, UserRole
from app.schemas import (
    DriverRegister,
    DriverResponse,
    DriverEarnings,
    DriverOnlineStatus,
    DriverDocumentResponse,
    DocumentUpload,
    RideResponse,
)
from app.services.driver_service import create_driver_profile
from app.utils.dependencies import get_current_user, get_current_driver

router = APIRouter(prefix="/api/drivers", tags=["drivers"])


@router.post("/register", response_model=DriverResponse, status_code=201)
def register_driver(
    payload: DriverRegister,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in (UserRole.driver, UserRole.admin):
        raise HTTPException(status_code=403, detail="User must have driver role to register as driver")

    try:
        driver = create_driver_profile(
            db=db,
            user=current_user,
            license_number=payload.license_number,
            vehicle_data=payload.vehicle.model_dump(),
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Reload with relationships
    driver = (
        db.query(Driver)
        .options(joinedload(Driver.user), joinedload(Driver.vehicle))
        .filter(Driver.id == driver.id)
        .first()
    )
    return driver


@router.get("/me", response_model=DriverResponse)
def get_driver_profile(
    current_user: User = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver = (
        db.query(Driver)
        .options(joinedload(Driver.user), joinedload(Driver.vehicle))
        .filter(Driver.user_id == current_user.id)
        .first()
    )
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    return driver


@router.get("/me/earnings", response_model=DriverEarnings)
def get_driver_earnings(
    current_user: User = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    return DriverEarnings(
        today_rides=driver.today_rides or 0,
        today_earnings=driver.today_earnings or 0.0,
        total_rides=driver.total_rides or 0,
        acceptance_rate=driver.acceptance_rate or 100.0,
        average_rating=driver.average_rating or 0.0,
    )


@router.put("/me/online-status", response_model=DriverResponse)
def toggle_online_status(
    payload: DriverOnlineStatus,
    current_user: User = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    driver.is_online = payload.is_online
    db.commit()
    db.refresh(driver)

    driver = (
        db.query(Driver)
        .options(joinedload(Driver.user), joinedload(Driver.vehicle))
        .filter(Driver.id == driver.id)
        .first()
    )
    return driver


@router.get("/me/available-rides", response_model=List[RideResponse])
def get_available_rides(
    current_user: User = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    # Get rides that are searching or pending and match driver's certified modes
    rides = (
        db.query(Ride)
        .filter(Ride.status.in_([RideStatus.pending, RideStatus.searching]))
        .order_by(Ride.created_at.desc())
        .all()
    )

    # Filter by mode certification
    certified = driver.certified_modes or ["normal"]
    available = [r for r in rides if r.mode.value in certified or r.mode.value == "normal"]
    return available


@router.post("/me/rides/{ride_id}/accept", response_model=RideResponse)
def accept_ride(
    ride_id: int,
    current_user: User = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    if ride.status not in (RideStatus.pending, RideStatus.searching):
        raise HTTPException(status_code=400, detail="Ride is no longer available")

    ride.driver_id = driver.id
    ride.status = RideStatus.matched
    db.commit()
    db.refresh(ride)
    return ride


@router.post("/me/rides/{ride_id}/decline")
def decline_ride(
    ride_id: int,
    current_user: User = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    ride = db.query(Ride).filter(Ride.id == ride_id, Ride.driver_id == driver.id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found or not assigned to you")

    # Unassign driver and set back to searching
    ride.driver_id = None
    ride.status = RideStatus.searching
    db.commit()

    return {"detail": "Ride declined"}


@router.get("/me/documents", response_model=List[DriverDocumentResponse])
def list_documents(
    current_user: User = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    docs = db.query(DriverDocument).filter(DriverDocument.driver_id == driver.id).all()
    return docs


@router.put("/me/documents/{doc_id}/upload", response_model=DriverDocumentResponse)
def upload_document(
    doc_id: int,
    payload: DocumentUpload,
    current_user: User = Depends(get_current_driver),
    db: Session = Depends(get_db),
):
    driver = db.query(Driver).filter(Driver.user_id == current_user.id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    doc = (
        db.query(DriverDocument)
        .filter(DriverDocument.id == doc_id, DriverDocument.driver_id == driver.id)
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    doc.file_url = payload.file_url
    doc.status = "pending"
    db.commit()
    db.refresh(doc)
    return doc
