from sqlalchemy import Column, String, Integer, Numeric, Date, ForeignKey, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    turf_id = Column(UUID(as_uuid=True), ForeignKey("turfs.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # Nullable for guest bookings
    payment_id = Column(UUID(as_uuid=True), ForeignKey("payments.id"), nullable=True)
    
    date = Column(Date, nullable=False)
    time_slot = Column(String, nullable=False)
    duration = Column(Integer, default=1)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, default="pending") # pending, confirmed, cancelled, completed
    
    customer_name = Column(String, nullable=True) # For guest bookings
    customer_phone = Column(String, nullable=True) # For guest bookings
    customer_email = Column(String, nullable=True) # For guest bookings
    
    extras = Column(JSON, nullable=True) # List of extras
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    turf = relationship("Turf")
    user = relationship("User")
    payment = relationship("Payment")
