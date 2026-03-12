from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, EmergencyContact, Notification
from app.schemas import (
    UserResponse,
    EmergencyContactCreate,
    EmergencyContactUpdate,
    EmergencyContactResponse,
    NotificationResponse,
)
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


# ==================== EMERGENCY CONTACTS ====================

@router.get("/me/emergency-contacts", response_model=List[EmergencyContactResponse])
def list_emergency_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contacts = (
        db.query(EmergencyContact)
        .filter(EmergencyContact.user_id == current_user.id)
        .order_by(EmergencyContact.is_primary.desc(), EmergencyContact.id)
        .all()
    )
    return contacts


@router.post("/me/emergency-contacts", response_model=EmergencyContactResponse, status_code=201)
def add_emergency_contact(
    payload: EmergencyContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contact = EmergencyContact(
        user_id=current_user.id,
        name=payload.name,
        phone=payload.phone,
        contact_relationship=payload.relationship,
        is_primary=payload.is_primary,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.put("/me/emergency-contacts/{contact_id}", response_model=EmergencyContactResponse)
def update_emergency_contact(
    contact_id: int,
    payload: EmergencyContactUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contact = (
        db.query(EmergencyContact)
        .filter(EmergencyContact.id == contact_id, EmergencyContact.user_id == current_user.id)
        .first()
    )
    if not contact:
        raise HTTPException(status_code=404, detail="Emergency contact not found")

    if payload.name is not None:
        contact.name = payload.name
    if payload.phone is not None:
        contact.phone = payload.phone
    if payload.relationship is not None:
        contact.contact_relationship = payload.relationship
    if payload.is_primary is not None:
        contact.is_primary = payload.is_primary

    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/me/emergency-contacts/{contact_id}", status_code=204)
def delete_emergency_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    contact = (
        db.query(EmergencyContact)
        .filter(EmergencyContact.id == contact_id, EmergencyContact.user_id == current_user.id)
        .first()
    )
    if not contact:
        raise HTTPException(status_code=404, detail="Emergency contact not found")

    db.delete(contact)
    db.commit()
    return None


# ==================== NOTIFICATIONS ====================

@router.get("/me/notifications", response_model=List[NotificationResponse])
def list_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    notifs = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )
    return notifs
