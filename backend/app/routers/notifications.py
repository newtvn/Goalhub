from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.database import get_db
from app.models.notification import Notification

router = APIRouter(prefix="/api/notifications", tags=["notifications"])

# Pydantic schemas
class NotificationBase(BaseModel):
    type: str
    message: str
    user_id: UUID | None = None

class NotificationCreate(NotificationBase):
    pass

class NotificationResponse(NotificationBase):
    id: UUID
    read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Get notifications
@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(db: AsyncSession = Depends(get_db)):
    # In real app, filter by current user
    result = await db.execute(select(Notification).order_by(Notification.created_at.desc()))
    return result.scalars().all()

# Create notification
@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(notification: NotificationCreate, db: AsyncSession = Depends(get_db)):
    new_notification = Notification(**notification.model_dump())
    db.add(new_notification)
    await db.commit()
    await db.refresh(new_notification)
    return new_notification

# Mark as read
@router.put("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(notification_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Notification).where(Notification.id == notification_id))
    notification = result.scalars().first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.read = True
    await db.commit()
    await db.refresh(notification)
    return notification
