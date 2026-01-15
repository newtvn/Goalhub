from sqlalchemy import Column, String, Integer, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.database import Base

class Turf(Base):
    __tablename__ = "turfs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    type = Column(String, nullable=False) # 5-a-side, 7-a-side
    price = Column(Numeric(10, 2), nullable=False)
    image = Column(String, nullable=True)
    description = Column(Text, nullable=True)
