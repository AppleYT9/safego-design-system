from __future__ import annotations

from sqlalchemy.orm import Session

from app.models import Notification


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "info",
    data: dict | None = None,
) -> Notification:
    """Create a notification for a user."""
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notification_type,
        data=data,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif
