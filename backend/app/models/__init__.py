from __future__ import annotations

import enum
from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, Enum, ForeignKey, JSON, UniqueConstraint
)
from sqlalchemy.orm import relationship

from app.database import Base


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


# ---------- MODELS ----------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.passenger)
    preferred_mode = Column(Enum(RideMode), nullable=True, default=RideMode.normal)
    profile_photo = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    # relationships
    driver_profile = relationship("Driver", back_populates="user", uselist=False)
    rides = relationship("Ride", back_populates="passenger", foreign_keys="[Ride.passenger_id]")
    emergency_contacts = relationship("EmergencyContact", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    sos_alerts = relationship("SOSAlert", back_populates="user", foreign_keys="[SOSAlert.user_id]")
    ratings = relationship("Rating", back_populates="rater", foreign_keys="[Rating.rater_id]")


class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    license_number = Column(String(100), unique=True, nullable=False)
    status = Column(Enum(DriverStatus), nullable=False, default=DriverStatus.pending)
    is_online = Column(Boolean, default=False)
    current_latitude = Column(Float, nullable=True)
    current_longitude = Column(Float, nullable=True)
    average_rating = Column(Float, default=0.0)
    total_rides = Column(Integer, default=0)
    today_rides = Column(Integer, default=0)
    today_earnings = Column(Float, default=0.0)
    acceptance_rate = Column(Float, default=100.0)
    certified_modes = Column(JSON, default=lambda: ["normal"])
    approved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    # relationships
    user = relationship("User", back_populates="driver_profile")
    vehicle = relationship("Vehicle", back_populates="driver", uselist=False)
    documents = relationship("DriverDocument", back_populates="driver")
    rides = relationship("Ride", back_populates="driver", foreign_keys="[Ride.driver_id]")
    ratings = relationship("Rating", back_populates="driver", foreign_keys="[Rating.driver_id]")


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), unique=True, nullable=False)
    make = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    color = Column(String(50), nullable=False)
    plate_number = Column(String(50), unique=True, nullable=False)
    is_wheelchair_accessible = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=_utcnow)

    # relationships
    driver = relationship("Driver", back_populates="vehicle")


class DriverDocument(Base):
    __tablename__ = "driver_documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    file_url = Column(String(500), nullable=True)
    status = Column(Enum(DocumentStatus), nullable=False, default=DocumentStatus.upload_required)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    # relationships
    driver = relationship("Driver", back_populates="documents")
    reviewer = relationship("User", foreign_keys=[reviewed_by])


class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    passenger_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    mode = Column(Enum(RideMode), nullable=False, default=RideMode.normal)
    status = Column(Enum(RideStatus), nullable=False, default=RideStatus.pending)
    pickup_address = Column(String(500), nullable=True)
    pickup_latitude = Column(Float, nullable=False)
    pickup_longitude = Column(Float, nullable=False)
    destination_address = Column(String(500), nullable=True)
    destination_latitude = Column(Float, nullable=False)
    destination_longitude = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=True)
    duration_minutes = Column(Float, nullable=True)
    fare_amount = Column(Float, nullable=True)
    safety_score = Column(Integer, nullable=True)
    route_polyline = Column(Text, nullable=True)
    scheduled_at = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)
    cancel_reason = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    # relationships
    passenger = relationship("User", back_populates="rides", foreign_keys=[passenger_id])
    driver = relationship("Driver", back_populates="rides", foreign_keys=[driver_id])
    rating = relationship("Rating", back_populates="ride", uselist=False)
    location_history = relationship("RideLocationHistory", back_populates="ride")
    sos_alerts = relationship("SOSAlert", back_populates="ride")


class RideLocationHistory(Base):
    __tablename__ = "ride_location_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ride_id = Column(Integer, ForeignKey("rides.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=_utcnow)

    # relationships
    ride = relationship("Ride", back_populates="location_history")


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ride_id = Column(Integer, ForeignKey("rides.id"), unique=True, nullable=False)
    rater_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    score = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=_utcnow)

    # relationships
    ride = relationship("Ride", back_populates="rating")
    rater = relationship("User", back_populates="ratings", foreign_keys=[rater_id])
    driver = relationship("Driver", back_populates="ratings", foreign_keys=[driver_id])


class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    contact_relationship = Column("relationship", String(100), nullable=True)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=_utcnow)

    # relationships
    user = relationship("User", back_populates="emergency_contacts")


class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ride_id = Column(Integer, ForeignKey("rides.id"), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location_address = Column(String(500), nullable=True)
    severity = Column(Enum(SOSSeverity), nullable=False, default=SOSSeverity.critical)
    status = Column(Enum(SOSStatus), nullable=False, default=SOSStatus.active)
    notes = Column(Text, nullable=True)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=_utcnow)

    # relationships
    user = relationship("User", back_populates="sos_alerts", foreign_keys=[user_id])
    ride = relationship("Ride", back_populates="sos_alerts")
    resolver = relationship("User", foreign_keys=[resolved_by])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=True)
    is_read = Column(Boolean, default=False)
    data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=_utcnow)

    # relationships
    user = relationship("User", back_populates="notifications")
