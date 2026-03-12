from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Driver, RideLocationHistory, User, UserRole
from app.utils.security import decode_access_token
from app.utils.websocket_manager import manager

router = APIRouter(tags=["websocket"])


def _get_user_from_token(token: str, db: Session) -> User | None:
    """Validate JWT token and return user."""
    payload = decode_access_token(token)
    if payload is None:
        return None
    user_id = payload.get("sub")
    if user_id is None:
        return None
    return db.query(User).filter(User.id == int(user_id)).first()


@router.websocket("/ws/ride/{ride_id}/track")
async def ride_tracking(websocket: WebSocket, ride_id: int, token: str = Query(...)):
    """Passenger subscribes to live driver location updates for a ride."""
    db = SessionLocal()
    try:
        user = _get_user_from_token(token, db)
        if not user:
            await websocket.close(code=4001, reason="Invalid token")
            return
    finally:
        db.close()

    await manager.connect_ride(ride_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect_ride(ride_id, websocket)


@router.websocket("/ws/driver/{driver_id}/location")
async def driver_location(websocket: WebSocket, driver_id: int, token: str = Query(...)):
    """
    Driver streams live GPS to server.
    Server persists to DB, broadcasts to ride passengers and admin.
    """
    db = SessionLocal()
    try:
        user = _get_user_from_token(token, db)
        if not user:
            await websocket.close(code=4001, reason="Invalid token")
            return

        # Verify this user owns the driver profile
        driver = db.query(Driver).filter(Driver.id == driver_id).first()
        if not driver or driver.user_id != user.id:
            await websocket.close(code=4003, reason="Forbidden")
            return

        # Set driver online
        driver.is_online = True
        db.commit()
    finally:
        db.close()

    await manager.connect_driver(driver_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            latitude = data.get("latitude")
            longitude = data.get("longitude")
            ride_id = data.get("ride_id")

            if latitude is None or longitude is None:
                continue

            # Update driver location in DB
            db = SessionLocal()
            try:
                driver = db.query(Driver).filter(Driver.id == driver_id).first()
                if driver:
                    driver.current_latitude = latitude
                    driver.current_longitude = longitude
                    db.commit()

                # If driver has active ride, log to ride_location_history
                if ride_id:
                    loc = RideLocationHistory(
                        ride_id=ride_id,
                        latitude=latitude,
                        longitude=longitude,
                    )
                    db.add(loc)
                    db.commit()

                    # Broadcast to passengers watching this ride
                    await manager.broadcast_to_ride(ride_id, {
                        "type": "driver_location",
                        "latitude": latitude,
                        "longitude": longitude,
                        "status": "in_progress",
                        "driver_id": driver_id,
                    })
            finally:
                db.close()

            # Always broadcast to admins
            await manager.broadcast_to_admins({
                "type": "driver_location",
                "driver_id": driver_id,
                "latitude": latitude,
                "longitude": longitude,
                "ride_id": ride_id,
            })

    except WebSocketDisconnect:
        manager.disconnect_driver(driver_id)
        # Set driver offline
        db = SessionLocal()
        try:
            driver = db.query(Driver).filter(Driver.id == driver_id).first()
            if driver:
                driver.is_online = False
                db.commit()
        finally:
            db.close()


@router.websocket("/ws/admin/live")
async def admin_live(websocket: WebSocket, token: str = Query(...)):
    """Admin receives all driver location updates and SOS alert events."""
    db = SessionLocal()
    try:
        user = _get_user_from_token(token, db)
        if not user or user.role != UserRole.admin:
            await websocket.close(code=4003, reason="Admin access required")
            return
    finally:
        db.close()

    await manager.connect_admin(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect_admin(websocket)
