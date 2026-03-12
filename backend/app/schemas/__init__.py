from __future__ import annotations

from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ==================== AUTH ====================

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    email: str = Field(..., max_length=255)
    phone: str = Field(..., max_length=50)
    password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)
    role: str = Field(default="passenger")


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    role: str
    preferred_mode: Optional[str] = None
    profile_photo: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class UserBrief(BaseModel):
    full_name: str

    model_config = ConfigDict(from_attributes=True)


# ==================== VEHICLE ====================

class VehicleCreate(BaseModel):
    make: str
    model: str
    year: int
    color: str
    plate_number: str
    is_wheelchair_accessible: bool = False


class VehicleResponse(BaseModel):
    id: int
    make: str
    model: str
    year: int
    color: str
    plate_number: str
    is_wheelchair_accessible: bool
    is_approved: bool
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class VehicleBrief(BaseModel):
    make: str
    model: str
    plate_number: str

    model_config = ConfigDict(from_attributes=True)


# ==================== DRIVER ====================

class DriverRegister(BaseModel):
    license_number: str
    vehicle: VehicleCreate


class DriverResponse(BaseModel):
    id: int
    user_id: int
    license_number: str
    status: str
    is_online: bool
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    average_rating: float
    total_rides: int
    today_rides: int
    today_earnings: float
    acceptance_rate: float
    certified_modes: Optional[List[str]] = None
    approved_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    user: Optional[UserResponse] = None
    vehicle: Optional[VehicleResponse] = None

    model_config = ConfigDict(from_attributes=True)


class DriverBrief(BaseModel):
    id: int
    average_rating: float
    user: Optional[UserBrief] = None
    vehicle: Optional[VehicleBrief] = None

    model_config = ConfigDict(from_attributes=True)


class DriverEarnings(BaseModel):
    today_rides: int
    today_earnings: float
    total_rides: int
    acceptance_rate: float
    average_rating: float


class DriverOnlineStatus(BaseModel):
    is_online: bool


class DriverDocumentResponse(BaseModel):
    id: int
    driver_id: int
    document_type: str
    file_url: Optional[str] = None
    status: str
    reviewed_by: Optional[int] = None
    reviewed_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class DocumentUpload(BaseModel):
    file_url: str


class NearbyDriverResponse(BaseModel):
    driver_id: int
    driver_name: str
    latitude: float
    longitude: float
    distance_km: float
    eta_minutes: float
    average_rating: float
    vehicle: Optional[VehicleBrief] = None


# ==================== RIDE ====================

class RouteRequest(BaseModel):
    pickup_latitude: float
    pickup_longitude: float
    destination_latitude: float
    destination_longitude: float
    mode: str = "normal"


class RouteResponse(BaseModel):
    distance_km: float
    duration_minutes: float
    fare_amount: float
    safety_score: int
    route_polyline: Optional[str] = None
    steps: Optional[List[Any]] = []


class RideRequest(BaseModel):
    mode: str = "normal"
    pickup_address: Optional[str] = None
    pickup_latitude: float
    pickup_longitude: float
    destination_address: Optional[str] = None
    destination_latitude: float
    destination_longitude: float
    scheduled_at: Optional[datetime] = None


class RideResponse(BaseModel):
    id: int
    passenger_id: int
    driver_id: Optional[int] = None
    mode: str
    status: str
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
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    driver: Optional[DriverBrief] = None

    model_config = ConfigDict(from_attributes=True)


class RideStatusUpdate(BaseModel):
    status: str
    cancel_reason: Optional[str] = None


class RatingCreate(BaseModel):
    score: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class RatingResponse(BaseModel):
    id: int
    ride_id: int
    rater_id: int
    driver_id: int
    score: int
    comment: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==================== EMERGENCY CONTACTS ====================

class EmergencyContactCreate(BaseModel):
    name: str
    phone: str
    relationship: Optional[str] = None
    is_primary: bool = False


class EmergencyContactUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    relationship: Optional[str] = None
    is_primary: Optional[bool] = None


class EmergencyContactResponse(BaseModel):
    id: int
    user_id: int
    name: str
    phone: str
    relationship: Optional[str] = Field(None, validation_alias="contact_relationship")
    is_primary: bool
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


# ==================== SOS ====================

class SOSCreate(BaseModel):
    ride_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_address: Optional[str] = None
    severity: str = "critical"


class SOSResponse(BaseModel):
    id: int
    user_id: int
    ride_id: Optional[int] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_address: Optional[str] = None
    severity: str
    status: str
    notes: Optional[str] = None
    resolved_by: Optional[int] = None
    resolved_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class SOSResolve(BaseModel):
    status: str  # "resolved" or "false_alarm"
    notes: Optional[str] = None


# ==================== NOTIFICATIONS ====================

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: Optional[str] = None
    is_read: bool
    data: Optional[Any] = None
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# ==================== ADMIN ====================

class AdminStats(BaseModel):
    total_users: int
    total_drivers: int
    active_drivers: int
    pending_drivers: int
    total_rides: int
    active_rides: int
    total_sos_alerts: int
    active_sos_alerts: int


class RidesByMode(BaseModel):
    mode: str
    rides: int


class SafetyScoreStat(BaseModel):
    month: str
    score: float


class DriverApproval(BaseModel):
    status: str  # "approved" or "rejected"
    notes: Optional[str] = None


class DocumentReview(BaseModel):
    status: str  # "verified" or "rejected"
    notes: Optional[str] = None


class UserToggleActive(BaseModel):
    is_active: bool
