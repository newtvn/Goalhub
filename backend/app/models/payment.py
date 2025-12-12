from sqlalchemy import Column, String, Numeric, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    checkout_request_id = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String, default="pending") # pending, completed, failed
    reference = Column(String, nullable=True) # M-Pesa Receipt Number
    failure_reason = Column(String, nullable=True)
    callback_metadata = Column(JSON, nullable=True) # Full callback metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
