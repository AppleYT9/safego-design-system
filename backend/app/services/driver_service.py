from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from sqlalchemy.orm import Session

from app.models import (
    Driver, Vehicle, DriverDocument, DriverStatus, DocumentType, DocumentStatus, User
)


def create_driver_profile(
    db: Session,
    user: User,
    license_number: str,
    vehicle_data: dict,
) -> Driver:
    """Create a driver profile, vehicle record, and default document slots."""
    # Check if driver profile already exists
    existing = db.query(Driver).filter(Driver.user_id == user.id).first()
    if existing:
        raise ValueError("Driver profile already exists for this user")

    # Check license uniqueness
    existing_license = db.query(Driver).filter(Driver.license_number == license_number).first()
    if existing_license:
        raise ValueError("License number already registered")

    # Create driver
    driver = Driver(
        user_id=user.id,
        license_number=license_number,
        status=DriverStatus.pending,
        certified_modes=["normal"],
    )
    db.add(driver)
    db.flush()

    # Create vehicle
    vehicle = Vehicle(
        driver_id=driver.id,
        make=vehicle_data["make"],
        model=vehicle_data["model"],
        year=vehicle_data["year"],
        color=vehicle_data["color"],
        plate_number=vehicle_data["plate_number"],
        is_wheelchair_accessible=vehicle_data.get("is_wheelchair_accessible", False),
    )
    db.add(vehicle)

    # Create default document slots
    for doc_type in DocumentType:
        doc = DriverDocument(
            driver_id=driver.id,
            document_type=doc_type,
            status=DocumentStatus.upload_required,
        )
        db.add(doc)

    db.commit()
    db.refresh(driver)
    return driver
