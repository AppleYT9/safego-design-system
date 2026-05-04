from __future__ import annotations

from datetime import datetime, timezone
from typing import List
from beanie import PydanticObjectId

from fastapi import APIRouter, Depends, HTTPException

from app.models import User, SOSAlert, SOSStatus, SOSSeverity, EmergencyContact
from app.schemas import SOSCreate, SOSResponse, SOSResolve
from app.utils.dependencies import get_current_user, get_current_admin
from app.services.notification_service import notification_service

router = APIRouter(prefix="/api/safety", tags=["safety"])


def _sos_dict(sos: SOSAlert) -> dict:
    return {
        "_id": str(sos.id),
        "user_id": str(sos.user_id),
        "ride_id": str(sos.ride_id) if sos.ride_id else None,
        "latitude": sos.latitude,
        "longitude": sos.longitude,
        "location_address": sos.location_address,
        "severity": sos.severity.value,
        "status": sos.status.value,
        "notes": sos.notes,
        "resolved_by": str(sos.resolved_by) if sos.resolved_by else None,
        "resolved_at": sos.resolved_at,
        "created_at": sos.created_at,
    }


@router.post("/sos", response_model=SOSResponse, status_code=201)
async def trigger_sos(payload: SOSCreate, current_user: User = Depends(get_current_user)):
    sos = SOSAlert(
        user_id=current_user.id,
        ride_id=PydanticObjectId(payload.ride_id) if payload.ride_id else None,
        latitude=payload.latitude,
        longitude=payload.longitude,
        location_address=payload.location_address,
        severity=SOSSeverity(payload.severity),
        status=SOSStatus.active,
    )
    await sos.insert()

    try:
        contacts = await EmergencyContact.find(EmergencyContact.user_id == current_user.id).to_list()
        location_url = f"https://www.google.com/maps?q={payload.latitude},{payload.longitude}"
        for contact in contacts:
            notification_service.send_sos_sms(to_number=contact.phone, user_name=current_user.full_name, location_url=location_url)
            notification_service.trigger_sos_call(to_number=contact.phone, user_name=current_user.full_name)
    except Exception as e:
        print(f"Failed to send emergency notifications: {e}")

    return _sos_dict(sos)


@router.post("/sos/{sos_id}/cancel", response_model=SOSResponse)
async def cancel_sos(sos_id: str, current_user: User = Depends(get_current_user)):
    sos = await SOSAlert.find_one(SOSAlert.id == PydanticObjectId(sos_id), SOSAlert.user_id == current_user.id)
    if not sos:
        raise HTTPException(status_code=404, detail="SOS alert not found")
    if sos.status != SOSStatus.active:
        raise HTTPException(status_code=400, detail="SOS alert is not active")
    sos.status = SOSStatus.false_alarm
    sos.resolved_at = datetime.now(timezone.utc)
    sos.resolved_by = current_user.id
    sos.notes = "Cancelled by user (false alarm)"
    await sos.save()
    return _sos_dict(sos)


@router.put("/sos/{sos_id}/resolve", response_model=SOSResponse)
async def resolve_sos(sos_id: str, payload: SOSResolve, admin_user: User = Depends(get_current_admin)):
    sos = await SOSAlert.get(PydanticObjectId(sos_id))
    if not sos:
        raise HTTPException(status_code=404, detail="SOS alert not found")
    sos.status = SOSStatus(payload.status)
    sos.notes = payload.notes
    sos.resolved_by = admin_user.id
    sos.resolved_at = datetime.now(timezone.utc)
    await sos.save()
    return _sos_dict(sos)
