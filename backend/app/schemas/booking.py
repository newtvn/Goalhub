from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

# --- Payment Schemas ---
class STKPushRequest(BaseModel):
    phone: str = Field(..., description="Phone number (e.g., 0712345678)")
    amount: int = Field(..., gt=0, le=300000, description="Amount in KES")

class STKPushResponse(BaseModel):
    MerchantRequestID: str
    CheckoutRequestID: str
    ResponseCode: str
    ResponseDescription: str
    CustomerMessage: str

class PaymentStatusResponse(BaseModel):
    status: str
    amount: Decimal
    phone: str

# --- Turf Schemas ---
class TurfBase(BaseModel):
    name: str
    location: str
    type: str
    price: Decimal
    image: Optional[str] = None
    description: Optional[str] = None

class TurfCreate(TurfBase):
    pass

class TurfResponse(TurfBase):
    id: UUID
    
    class Config:
        from_attributes = True

# --- Booking Schemas ---
class BookingBase(BaseModel):
    turf_id: UUID
    date: date
    time_slot: str
    duration: int = 1
    amount: Decimal
    extras: Optional[List[Dict[str, Any]]] = None
    
    # Guest details
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: Optional[EmailStr] = None

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: UUID
    status: str
    payment_id: Optional[UUID] = None
    created_at: datetime
    turf: Optional[TurfResponse] = None # Include full turf details
    
    class Config:
        from_attributes = True
