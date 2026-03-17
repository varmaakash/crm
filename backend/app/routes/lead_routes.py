from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database import get_db
from app.models.leads import Lead
from app.models.followups import Followup
from app.models.lead_movements import LeadMovement

from app.schemas.lead_schema import LeadCreate, LeadUpdate
from app.models.users import User

router = APIRouter(prefix="/leads", tags=["Leads"])


# -----------------------------
# CREATE LEAD
# -----------------------------
@router.post("/create")
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):

    existing_lead = db.query(Lead).filter(
        Lead.student_contact == lead.student_contact
    ).first()

    if existing_lead:
        return {
            "message": "Lead already exists",
            "lead_id": existing_lead.id
        }

    new_lead = Lead(**lead.dict())

    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)

    return {
        "message": "Lead created successfully",
        "lead": new_lead
    }


# -----------------------------
# GET ALL LEADS
# -----------------------------
@router.get("/")
def get_leads(
    role: Optional[str] = None,
    user_id: Optional[int] = None,
    status: Optional[str] = None,
    temperature: Optional[str] = None,
    today_followups: Optional[bool] = None,
    assigned_counsellor: Optional[int] = None,
    student_contact: Optional[str] = None,
    db: Session = Depends(get_db)
):

    query = db.query(Lead)

    # -----------------------------
    # ROLE BASED FILTER
    # -----------------------------
    if role == "counsellor":
        query = query.filter(Lead.assigned_counsellor == user_id)

    # -----------------------------
    # STATUS FILTER
    # -----------------------------
    if status:
        query = query.filter(Lead.status == status)

    # -----------------------------
    # TEMPERATURE FILTER
    # -----------------------------
    if temperature:
        query = query.filter(Lead.temperature == temperature)

    # -----------------------------
    # TODAY FOLLOWUPS
    # -----------------------------
    if today_followups:
        today = str(date.today())
        query = query.filter(Lead.next_followup == today)

    # -----------------------------
    # OPTIONAL FILTERS
    # -----------------------------
    if assigned_counsellor:
        query = query.filter(Lead.assigned_counsellor == assigned_counsellor)

    if student_contact:
        query = query.filter(Lead.student_contact == student_contact)

    leads = query.order_by(Lead.created_at.desc()).all()

    return leads


# -----------------------------
# GET LEAD PROFILE
# -----------------------------
@router.get("/{lead_id}")
def get_lead_profile(lead_id: int, db: Session = Depends(get_db)):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        return {"message": "Lead not found"}


    # -----------------------------
    # Assigned Counsellor
    # -----------------------------
    assigned_name = None

    if lead.assigned_counsellor:

        assigned_user = db.query(User).filter(
            User.id == lead.assigned_counsellor
        ).first()

        if assigned_user:
            assigned_name = assigned_user.full_name


    # -----------------------------
    # FOLLOWUPS
    # -----------------------------
    followups = db.query(Followup).filter(
        Followup.lead_id == lead_id
    ).order_by(Followup.created_at.desc()).all()


    followup_list = []

    for f in followups:

        counsellor = db.query(User).filter(
            User.id == f.counsellor_id
        ).first()

        followup_list.append({

            "id": f.id,
            "remark": f.remark,
            "status": f.status,
            "temperature": f.temperature,
            "next_followup": f.next_followup,
            "created_at": f.created_at,

            # WHO UPDATED FOLLOWUP
            "updated_by": counsellor.full_name if counsellor else "Unknown"

        })


    return {

        "lead": lead,

        # ASSIGNED COUNSELLOR
        "assigned_to": assigned_name,

        "followups": followup_list

    }

# -----------------------------
# UPDATE LEAD
# -----------------------------
@router.put("/update/{lead_id}")
def update_lead(lead_id: int, lead_data: LeadUpdate, db: Session = Depends(get_db)):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        return {"message": "Lead not found"}

    update_data = lead_data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(lead, key, value)

    db.commit()
    db.refresh(lead)

    return {
        "message": "Lead updated successfully",
        "lead": lead
    }


# -----------------------------
# MOVE LEAD (Transfer)
# -----------------------------
@router.post("/move/{lead_id}")
def move_lead(
    lead_id: int,
    to_user: int,
    db: Session = Depends(get_db)
):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        return {"message": "Lead not found"}

    movement = LeadMovement(
        lead_id=lead_id,
        from_user=lead.assigned_counsellor,
        to_user=to_user
    )

    lead.assigned_counsellor = to_user

    db.add(movement)
    db.commit()
    db.refresh(lead)

    return {
        "message": "Lead moved successfully",
        "lead": lead
    }


# -----------------------------
# LEAD TIMELINE
# -----------------------------
@router.get("/timeline/{lead_id}")
def lead_timeline(lead_id: int, db: Session = Depends(get_db)):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        return {"message": "Lead not found"}

    timeline = []

    # Lead created
    timeline.append({
        "type": "lead_created",
        "time": lead.created_at,
        "message": f"Lead created for {lead.student_name}"
    })

    # Followups
    followups = db.query(Followup).filter(
        Followup.lead_id == lead_id
    ).all()

    for f in followups:
        timeline.append({
            "type": "followup",
            "time": f.created_at,
            "message": f.remark
        })

    # Lead movements
    movements = db.query(LeadMovement).filter(
        LeadMovement.lead_id == lead_id
    ).all()

    for m in movements:
        timeline.append({
            "type": "lead_moved",
            "time": m.moved_at,
            "message": f"Lead moved from {m.from_user} to {m.to_user}"
        })

    timeline = sorted(timeline, key=lambda x: x["time"])

    return timeline


# -----------------------------
# DELETE LEAD
# -----------------------------
@router.delete("/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        return {"message": "Lead not found"}

    db.delete(lead)
    db.commit()

    return {"message": "Lead deleted successfully"}