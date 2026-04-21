from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta

from app.database import get_db
from app.models.followups import Followup
from app.models.leads import Lead
from app.schemas.followup_schema import FollowupCreate

router = APIRouter(prefix="/followups", tags=["Followups"])


# =====================================
# 🔥 ADD FOLLOWUP
# =====================================
@router.post("/add")
def add_followup(followup: FollowupCreate, db: Session = Depends(get_db)):

    new_followup = Followup(
        lead_id=followup.lead_id,
        counsellor_id=followup.counsellor_id,
        remark=followup.remark,
        status=followup.status,
        temperature=followup.temperature,
        next_followup=followup.next_followup
    )

    db.add(new_followup)

    # 🔥 Update Lead also
    lead = db.query(Lead).filter(Lead.id == followup.lead_id).first()
    if lead:
        lead.status = followup.status
        lead.temperature = followup.temperature
        lead.next_followup = followup.next_followup

    db.commit()
    db.refresh(new_followup)

    return {"message": "Followup added successfully"}


# =====================================
# 🔥 COMPLETE FOLLOWUP
# =====================================
@router.put("/complete/{id}")
def complete_followup(id: int, db: Session = Depends(get_db)):

    f = db.query(Followup).filter(Followup.id == id).first()

    if not f:
        return {"error": "Followup not found"}

    f.completed_at = datetime.now()
    db.commit()

    return {"message": "Followup completed"}


# =====================================
# 🔥 TODAY FOLLOWUPS
# =====================================
@router.get("/today")
def today_followups(db: Session = Depends(get_db)):

    today = date.today()

    return db.query(Followup).filter(
        Followup.next_followup == today,
        Followup.completed_at == None
    ).all()


# =====================================
# 🔥 MISSED FOLLOWUPS
# =====================================
@router.get("/missed")
def missed_followups(db: Session = Depends(get_db)):

    today = date.today()

    return db.query(Followup).filter(
        Followup.next_followup < today,
        Followup.completed_at == None
    ).all()


# =====================================
# 🔥 TOMORROW FOLLOWUPS
# =====================================
@router.get("/tomorrow")
def tomorrow_followups(db: Session = Depends(get_db)):

    tomorrow = date.today() + timedelta(days=1)

    return db.query(Followup).filter(
        Followup.next_followup == tomorrow,
        Followup.completed_at == None
    ).all()