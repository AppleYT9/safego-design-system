from __future__ import annotations

from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.database import get_db
from app.models import (
    User, Driver, Ride, SOSAlert, DriverDocument,
    UserRole, DriverStatus, RideStatus, RideMode, SOSStatus, DocumentStatus,
)
from app.schemas import (
    AdminStats,
    RidesByMode,
    SafetyScoreStat,
    DriverApproval,
    DocumentReview,
    UserResponse,
    DriverResponse,
    RideResponse,
    SOSResponse,
    DriverDocumentResponse,
    UserToggleActive,
)
from app.utils.dependencies import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_drivers = db.query(func.count(Driver.id)).scalar() or 0
    active_drivers = (
        db.query(func.count(Driver.id))
        .filter(Driver.is_online == True, Driver.status == DriverStatus.approved)
        .scalar() or 0
    )
    pending_drivers = (
        db.query(func.count(Driver.id))
        .filter(Driver.status == DriverStatus.pending)
        .scalar() or 0
    )
    total_rides = db.query(func.count(Ride.id)).scalar() or 0
    active_rides = (
        db.query(func.count(Ride.id))
        .filter(Ride.status.in_([
            RideStatus.searching, RideStatus.matched,
            RideStatus.driver_arriving, RideStatus.in_progress,
        ]))
        .scalar() or 0
    )
    total_sos = db.query(func.count(SOSAlert.id)).scalar() or 0
    active_sos = (
        db.query(func.count(SOSAlert.id))
        .filter(SOSAlert.status == SOSStatus.active)
        .scalar() or 0
    )

    return AdminStats(
        total_users=total_users,
        total_drivers=total_drivers,
        active_drivers=active_drivers,
        pending_drivers=pending_drivers,
        total_rides=total_rides,
        active_rides=active_rides,
        total_sos_alerts=total_sos,
        active_sos_alerts=active_sos,
    )


@router.get("/analytics/rides-by-mode", response_model=List[RidesByMode])
def get_rides_by_mode(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    results = (
        db.query(Ride.mode, func.count(Ride.id).label("rides"))
        .group_by(Ride.mode)
        .all()
    )
    return [
        RidesByMode(mode=r.mode.value if hasattr(r.mode, 'value') else r.mode, rides=r.rides)
        for r in results
    ]


@router.get("/analytics/safety-scores", response_model=List[SafetyScoreStat])
def get_safety_scores(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    # Return last 6 months of average safety scores
    results = (
        db.query(
            func.date_format(Ride.created_at, '%Y-%m').label("month"),
            func.avg(Ride.safety_score).label("score"),
        )
        .filter(Ride.safety_score.isnot(None))
        .group_by(func.date_format(Ride.created_at, '%Y-%m'))
        .order_by(func.date_format(Ride.created_at, '%Y-%m').desc())
        .limit(6)
        .all()
    )

    if not results:
        # Return placeholder data if no rides yet
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
            month_name = f"{year}-{month:02d}"
            stats.append(SafetyScoreStat(month=month_name, score=90.0))
        return stats

    return [
        SafetyScoreStat(month=r.month, score=round(float(r.score), 1))
        for r in reversed(results)
    ]


@router.get("/drivers/pending", response_model=List[DriverResponse])
def get_pending_drivers(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    drivers = (
        db.query(Driver)
        .options(joinedload(Driver.user), joinedload(Driver.vehicle))
        .filter(Driver.status == DriverStatus.pending)
        .all()
    )
    return drivers


@router.put("/drivers/{driver_id}/approval", response_model=DriverResponse)
def approve_driver(
    driver_id: int,
    payload: DriverApproval,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    driver = (
        db.query(Driver)
        .options(joinedload(Driver.user), joinedload(Driver.vehicle))
        .filter(Driver.id == driver_id)
        .first()
    )
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    if payload.status == "approved":
        driver.status = DriverStatus.approved
        driver.approved_at = datetime.now(timezone.utc)
    elif payload.status == "rejected":
        driver.status = DriverStatus.rejected
    else:
        raise HTTPException(status_code=400, detail="Status must be 'approved' or 'rejected'")

    db.commit()
    db.refresh(driver)
    return driver


@router.put("/drivers/{driver_id}/documents/{doc_id}", response_model=DriverDocumentResponse)
def review_document(
    driver_id: int,
    doc_id: int,
    payload: DocumentReview,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    doc = (
        db.query(DriverDocument)
        .filter(DriverDocument.id == doc_id, DriverDocument.driver_id == driver_id)
        .first()
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if payload.status not in ("verified", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be 'verified' or 'rejected'")

    doc.status = DocumentStatus(payload.status)
    doc.notes = payload.notes
    doc.reviewed_by = admin.id
    doc.reviewed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(doc)
    return doc


@router.get("/rides/live", response_model=List[RideResponse])
def get_live_rides(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    rides = (
        db.query(Ride)
        .options(
            joinedload(Ride.driver).joinedload(Driver.user),
            joinedload(Ride.driver).joinedload(Driver.vehicle),
        )
        .filter(Ride.status == RideStatus.in_progress)
        .order_by(Ride.started_at.desc())
        .all()
    )
    return rides


@router.get("/rides", response_model=List[RideResponse])
def get_all_rides(
    status: Optional[str] = Query(None),
    mode: Optional[str] = Query(None),
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    query = db.query(Ride).options(
        joinedload(Ride.driver).joinedload(Driver.user),
        joinedload(Ride.driver).joinedload(Driver.vehicle),
    )

    if status:
        query = query.filter(Ride.status == RideStatus(status))
    if mode:
        query = query.filter(Ride.mode == RideMode(mode))

    rides = (
        query
        .order_by(Ride.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return rides


@router.get("/sos-alerts", response_model=List[SOSResponse])
def get_sos_alerts(
    status: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    query = db.query(SOSAlert)
    if status:
        query = query.filter(SOSAlert.status == SOSStatus(status))
    alerts = query.order_by(SOSAlert.created_at.desc()).all()
    return alerts


@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    role: Optional[str] = Query(None),
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == UserRole(role))

    users = (
        query
        .order_by(User.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )
    return users


@router.put("/users/{user_id}/toggle-active", response_model=UserResponse)
def toggle_user_active(
    user_id: int,
    payload: UserToggleActive,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    return user
