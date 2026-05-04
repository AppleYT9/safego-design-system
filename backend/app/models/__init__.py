from __future__ import annotations

import enum
from datetime import datetime, timezone
from typing import Optional, List, Any

from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field


# ---------- ENUMS ----------

class UserRole(str, enum.Enum):
    passenger = "passenger"
    driver = "driver"
    admin = "admin"


class RideMode(str, enum.Enum):
    normal = "normal"
    pink = "pink"
    pwd = "pwd"
    elderly = "elderly"


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"


class DriverStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    suspended = "suspended"


class RideStatus(str, enum.Enum):
    pending = "pending"
    searching = "searching"
    matched = "matched"
    driver_arriving = "driver_arriving"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class DocumentType(str, enum.Enum):
    national_id = "national_id"
    drivers_license = "drivers_license"
    vehicle_registration = "vehicle_registration"
    nbi_clearance = "nbi_clearance"


class DocumentStatus(str, enum.Enum):
    upload_required = "upload_required"
    pending = "pending"
    verified = "verified"
    rejected = "rejected"


class SOSSeverity(str, enum.Enum):
    critical = "critical"
    moderate = "moderate"
    low = "low"


class SOSStatus(str, enum.Enum):
    active = "active"
    resolved = "resolved"
    false_alarm = "false_alarm"


def _utcnow():
    return datetime.now(timezone.utc)


# ---------- MODELS (Beanie Documents) ----------

class User(Document):
    full_name: str
    email: Indexed(str, unique=True)  # type: ignore
    phone: Indexed(str, unique=True)  # type: ignore
    hashed_password: str
    role: UserRole = UserRole.passenger
    preferred_mode: Optional[RideMode] = RideMode.normal
    gender: Optional[Gender] = Gender.male
    profile_photo: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "users"


class Driver(Document):
    user_id: PydanticObjectId
    license_number: Indexed(str, unique=True)  # type: ignore
    status: DriverStatus = DriverStatus.pending
    is_online: bool = False
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    average_rating: float = 0.0
    total_rides: int = 0
    today_rides: int = 0
    today_earnings: float = 0.0
    acceptance_rate: float = 100.0
    certified_modes: List[str] = Field(default_factory=lambda: ["normal"])
    approved_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "drivers"


class Vehicle(Document):
    driver_id: PydanticObjectId
    make: str
    model: str
    year: int
    color: str
    plate_number: Indexed(str, unique=True)  # type: ignore
    is_wheelchair_accessible: bool = False
    is_approved: bool = False
    created_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "vehicles"


class DriverDocument(Document):
    driver_id: PydanticObjectId
    document_type: DocumentType
    file_url: Optional[str] = None
    status: DocumentStatus = DocumentStatus.upload_required
    reviewed_by: Optional[PydanticObjectId] = None
    reviewed_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "driver_documents"


class Ride(Document):
    passenger_id: PydanticObjectId
    driver_id: Optional[PydanticObjectId] = None
    mode: RideMode = RideMode.normal
    status: RideStatus = RideStatus.pending
    pickup_address: Optional[str] = None
    pickup_latitude: float
    pickup_longitude: float
    destination_address: Optional[str] = None
    destination_latitude: float
    destination_longitude: float
    distance_km: Optional[float] = None
    duration_minutes: Optional[float] = None
    fare_amount: Optional[float] = None
    safety_score: Optional[int] = None
    route_polyline: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    cancel_reason: Optional[str] = None
    passenger_count: int = 1
    passenger_details: Optional[List[str]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=_utcnow)
    updated_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "rides"


class RideLocationHistory(Document):
    ride_id: PydanticObjectId
    latitude: float
    longitude: float
    recorded_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "ride_location_history"


class Rating(Document):
    ride_id: PydanticObjectId
    rater_id: PydanticObjectId
    driver_id: PydanticObjectId
    score: int
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "ratings"


class EmergencyContact(Document):
    user_id: PydanticObjectId
    name: str
    phone: str
    contact_relationship: Optional[str] = None
    is_primary: bool = False
    created_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "emergency_contacts"


class SOSAlert(Document):
    user_id: PydanticObjectId
    ride_id: Optional[PydanticObjectId] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_address: Optional[str] = None
    severity: SOSSeverity = SOSSeverity.critical
    status: SOSStatus = SOSStatus.active
    notes: Optional[str] = None
    resolved_by: Optional[PydanticObjectId] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "sos_alerts"


class Notification(Document):
    user_id: PydanticObjectId
    title: str
    message: str
    type: Optional[str] = None
    is_read: bool = False
    data: Optional[Any] = None
    created_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "notifications"
