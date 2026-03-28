from __future__ import annotations

"""
SafeGo Backend — Action Controller (Browser-Native AI Edition)
==============================================================
This route handles secure server-side actions triggered by the 
frontend's Browser-native AI (Web Speech API + Gemini Flash).
- SOS Triggering
- Location Sharing
"""

import asyncio
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ride, SOSAlert, SOSSeverity, SOSStatus, User
from app.schemas import (
    LocationShareRequest, RideResponse, SOSResponse, SOSTriggerRequest
)
from app.utils.dependencies import get_current_user, get_optional_user

router = APIRouter(prefix="/api/voice", tags=["voice"])

@router.post("/sos-trigger", response_model=SOSResponse)
def trigger_sos(
    payload: SOSTriggerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sos = SOSAlert(
        user_id=current_user.id,
        ride_id=payload.ride_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        location_address=payload.location_address or "Current Location",
        severity=SOSSeverity.critical,
        status=SOSStatus.active,
        notes="Triggered via Voice Assistance",
    )
    db.add(sos)
    db.commit()
    db.refresh(sos)
    return sos

@router.post("/location-share")
def share_location(
    payload: LocationShareRequest,
    current_user: User = Depends(get_current_user),
):
    # Log the sharing event
    print(f"[Voice Location Share] User {current_user.id} at {payload.latitude}, {payload.longitude}")
    return {"status": "shared", "timestamp": datetime.now(timezone.utc).isoformat()}

@router.get("/ride-status", response_model=Optional[RideResponse])
def get_ride_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Ride)
        .filter(Ride.passenger_id == current_user.id)
        .order_by(Ride.created_at.desc())
        .first()
    )

@router.get("/health")
async def voice_health():
    return {"status": "ok", "system": "Browser-Native AI Controller"}
