from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel
from datetime import date
from uuid import UUID
from app.database import get_db
from app.models import Booking, Payment
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
    checkout_request_id: Optional[str] = Query(None, description="M-Pesa checkout request ID for payment verification"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # If payment reference provided, find payment and link it
    payment = None
    if checkout_request_id:
        payment_result = await db.execute(
            select(Payment).where(Payment.checkout_request_id == checkout_request_id)
        )
        payment = payment_result.scalars().first()

        # Only allow booking if payment is completed
        if not payment:
            raise HTTPException(
                status_code=404,
                detail="Payment not found. Please complete payment first."
            )

        if payment.status != "completed":
            raise HTTPException(
                status_code=400,
                detail=f"Payment must be completed before creating booking. Current status: {payment.status}"
            )

    new_booking = Booking(**booking.model_dump())
    new_booking.user_id = current_user.id
    new_booking.status = "confirmed" if payment else "pending"  # Confirmed only if paid
    new_booking.payment_id = payment.id if payment else None
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
