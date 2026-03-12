from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, SOSAlert, SOSStatus, SOSSeverity
from app.schemas import SOSCreate, SOSResponse, SOSResolve
from app.utils.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/api/safety", tags=["safety"])


@router.post("/sos", response_model=SOSResponse, status_code=201)
def trigger_sos(
    payload: SOSCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sos = SOSAlert(
        user_id=current_user.id,
        ride_id=payload.ride_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        location_address=payload.location_address,
        severity=SOSSeverity(payload.severity),
        status=SOSStatus.active,
    )
    db.add(sos)
    db.commit()
    db.refresh(sos)
    return sos


@router.post("/sos/{sos_id}/cancel", response_model=SOSResponse)
def cancel_sos(
    sos_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sos = db.query(SOSAlert).filter(SOSAlert.id == sos_id, SOSAlert.user_id == current_user.id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS alert not found")

    if sos.status != SOSStatus.active:
        raise HTTPException(status_code=400, detail="SOS alert is not active")

    sos.status = SOSStatus.false_alarm
    sos.resolved_at = datetime.now(timezone.utc)
    sos.resolved_by = current_user.id
    sos.notes = "Cancelled by user (false alarm)"
    db.commit()
    db.refresh(sos)
    return sos


@router.put("/sos/{sos_id}/resolve", response_model=SOSResponse)
def resolve_sos(
    sos_id: int,
    payload: SOSResolve,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    sos = db.query(SOSAlert).filter(SOSAlert.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS alert not found")

    sos.status = SOSStatus(payload.status)
    sos.notes = payload.notes
    sos.resolved_by = admin_user.id
    sos.resolved_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(sos)
    return sos
