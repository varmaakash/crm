from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database import get_db
from app.models.leads import Lead
from app.models.followups import Followup

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats")
def dashboard_stats(
    role: Optional[str] = None,
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):

    query = db.query(Lead)

    # -----------------------------
    # ROLE BASED FILTER
    # -----------------------------
    if role == "counsellor":
        query = query.filter(Lead.assigned_counsellor == user_id)

    # -----------------------------
    # LEAD COUNTS
    # -----------------------------
    total_leads = query.count()

    new_leads = query.filter(Lead.status == "new").count()

    converted = query.filter(Lead.status == "converted").count()

    dropped = query.filter(Lead.status == "dropped").count()

    # -----------------------------
    # TODAY FOLLOWUPS
    # -----------------------------
    today = date.today()

    today_followups = db.query(Followup).filter(
        Followup.next_followup == today
    ).count()

    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "converted": converted,
        "dropped": dropped,
        "today_followups": today_followups
    }