from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base


class LeadMovement(Base):
    __tablename__ = "lead_movements"

    id = Column(Integer, primary_key=True, index=True)

    lead_id = Column(Integer)
    from_user = Column(Integer)
    to_user = Column(Integer)

    remark = Column(String)

    moved_at = Column(DateTime, default=datetime.utcnow)