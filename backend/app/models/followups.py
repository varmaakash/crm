from sqlalchemy import Column, Integer, String, Date, DateTime
from datetime import datetime
from app.database import Base


class Followup(Base):

    __tablename__ = "followups"

    id = Column(Integer, primary_key=True, index=True)

    lead_id = Column(Integer)
    counsellor_id = Column(Integer)

    remark = Column(String)
    status = Column(String)
    temperature = Column(String)   # ⭐ ADD THIS

    next_followup = Column(Date)

    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)