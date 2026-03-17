from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    # STUDENT INFO
    student_name = Column(String, nullable=False)
    student_contact = Column(String, nullable=False)

    gender = Column(String)
    qualification = Column(String)
    school_name = Column(String)
    year_of_passing = Column(String)

    # LOCATION
    city = Column(String)
    state = Column(String)
    country = Column(String)
    address = Column(String)

    # PARENT INFO
    parent_name = Column(String)
    parent_contact = Column(String)

    # COURSE INFO
    interested_course = Column(String)
    interested_location = Column(String)

    # SOURCE
    lead_source = Column(String)

    # ASSIGNED USER
    assigned_counsellor = Column(Integer)

    # LEAD STATUS
    status = Column(String, default="new")
    temperature = Column(String, default="cold")

    # FOLLOWUP
    next_followup = Column(String)

    # SYSTEM INFO
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer)