from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID
import re

# --- Payment Schemas ---
class STKPushRequest(BaseModel):
    phone: str = Field(..., description="Phone number (e.g., 0712345678)")
    amount: int = Field(..., gt=0, le=300000, description="Amount in KES")

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v):
        """Validate and normalize Kenyan phone numbers"""
        # Remove spaces and special chars
        cleaned = v.replace(" ", "").replace("+", "").replace("-", "")

        # Kenyan phone number validation (254 or 0, followed by 7 or 1, then 8 digits)
        phone_regex = r'^(254|0)?[17]\d{8}$'
        if not re.match(phone_regex, cleaned):
            raise ValueError('Invalid Kenyan phone number format. Expected format: 0712345678 or 254712345678')

        # Normalize to 254 format
        if cleaned.startswith('0'):
            cleaned = '254' + cleaned[1:]
        elif not cleaned.startswith('254'):
            cleaned = '254' + cleaned

        return cleaned

    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        """Validate payment amount is within acceptable range"""
        if v < 1 or v > 300000:
            raise ValueError('Amount must be between 1 and 300,000 KES')
        return v

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
