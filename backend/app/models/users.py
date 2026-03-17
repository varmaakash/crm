from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    # Login username
    username = Column(String, unique=True, nullable=False)

    # User details
    full_name = Column(String, nullable=False)

    mobile = Column(String, unique=True, nullable=False)

    # Hashed password
    password = Column(String, nullable=False)

    # Role system
    role = Column(String, default="counsellor")

    created_at = Column(DateTime, default=datetime.utcnow)