from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel
from uuid import UUID
from app.database import get_db
from app.models.event import Event

router = APIRouter(prefix="/api/events", tags=["events"])

# Pydantic schemas
class EventBase(BaseModel):
    title: str
    description: str | None = None
    date: str
    time: str
    image: str | None = None
    location: str | None = None

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class EventResponse(EventBase):
    id: UUID
    
    class Config:
        from_attributes = True

# Get all events
@router.get("/", response_model=List[EventResponse])
async def get_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event))
    return result.scalars().all()

# Get event by ID
@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalars().first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# Create event (admin/manager only)
@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(event: EventCreate, db: AsyncSession = Depends(get_db)):
    new_event = Event(**event.model_dump())
    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    return new_event

# Update event
@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: UUID, event_update: EventUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalars().first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    for field, value in event_update.model_dump().items():
        setattr(event, field, value)
    
    await db.commit()
    await db.refresh(event)
    return event

# Delete event
@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    event = result.scalars().first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    await db.delete(event)
    await db.commit()
    return None
