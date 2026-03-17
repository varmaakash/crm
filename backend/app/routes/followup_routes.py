from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.models.leads import Lead
from app.database import get_db
from app.models.followups import Followup
from app.schemas.followup_schema import FollowupCreate

router = APIRouter(prefix="/followups", tags=["Followups"])


# -----------------------------
# ADD FOLLOWUP
# -----------------------------
@router.post("/add")
def add_followup(followup: FollowupCreate, db: Session = Depends(get_db)):

    new_followup = Followup(
        lead_id = followup.lead_id,
        counsellor_id = followup.counsellor_id,
        remark = followup.remark,
        status = followup.status,
        temperature = followup.temperature,
        next_followup = followup.next_followup
    )

    db.add(new_followup)

    lead = db.query(Lead).filter(Lead.id == followup.lead_id).first()

    if lead:
        lead.status = followup.status
        lead.temperature = followup.temperature
        lead.next_followup = followup.next_followup

    db.commit()
    db.refresh(new_followup)

    return {"message": "Followup added successfully"}


# -----------------------------
# TODAY FOLLOWUPS
# -----------------------------
@router.get("/today")
def today_followups(db: Session = Depends(get_db)):

    today = date.today()

    followups = db.query(Followup).filter(
        Followup.next_followup == today
    ).all()

    return followups


# -----------------------------
# OVERDUE FOLLOWUPS
# -----------------------------
@router.get("/overdue")
def overdue_followups(db: Session = Depends(get_db)):

    today = date.today()

    followups = db.query(Followup).filter(
        Followup.next_followup < today
    ).all()

    return followups


# -----------------------------
# TOMORROW FOLLOWUPS
# -----------------------------
@router.get("/tomorrow")
def tomorrow_followups(db: Session = Depends(get_db)):

    tomorrow = date.today() + timedelta(days=1)

    followups = db.query(Followup).filter(
        Followup.next_followup == tomorrow
    ).all()

    return followups