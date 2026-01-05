from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models import Booking
from app.schemas import BookingResponse, BookingCreate

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

@router.get("/", response_model=List[BookingResponse])
async def get_bookings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Booking))
    return result.scalars().all()

@router.post("/", response_model=BookingResponse)
async def create_booking(booking: BookingCreate, db: AsyncSession = Depends(get_db)):
    new_booking = Booking(**booking.model_dump())
    new_booking.status = "confirmed" # In a real flow, this might be pending until payment
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)
    return new_booking
