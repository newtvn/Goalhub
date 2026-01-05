from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel
from datetime import date
from uuid import UUID
from app.database import get_db
from app.models import Booking
from app.schemas import BookingResponse, BookingCreate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

@router.get("/", response_model=List[BookingResponse])
async def get_bookings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # TODO: Filter for non-admins?
    result = await db.execute(select(Booking).options(selectinload(Booking.turf)))
    return result.scalars().all()

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking: BookingCreate, 
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_booking = Booking(**booking.model_dump())
    new_booking.user_id = current_user.id
    new_booking.status = "confirmed" # In a real flow, this might be pending until payment
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)
    return new_booking

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    date: Optional[date] = None
    time_slot: Optional[str] = None
    turf_id: Optional[UUID] = None
    
@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: UUID,
    booking_update: BookingUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Only admin/manager can update
    if current_user.role not in ["admin", "manager"]:
         raise HTTPException(status_code=403, detail="Not authorized")
         
    result = await db.execute(select(Booking).where(Booking.id == booking_id).options(selectinload(Booking.turf)))
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    update_data = booking_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(booking, key, value)
        
    await db.commit()
    await db.refresh(booking)
    return booking
