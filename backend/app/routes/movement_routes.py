from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.lead_movements import LeadMovement
from app.models.leads import Lead
from app.schemas.movement_schema import LeadMove

router = APIRouter(prefix="/lead-move", tags=["Lead Movement"])


@router.post("/")
def move_lead(move: LeadMove, db: Session = Depends(get_db)):

    lead = db.query(Lead).filter(Lead.id == move.lead_id).first()

    if not lead:
        return {"message": "Lead not found"}

    # update assigned counsellor
    lead.assigned_counsellor = move.to_user

    movement = LeadMovement(
        lead_id=move.lead_id,
        from_user=move.from_user,
        to_user=move.to_user,
        remark=move.remark
    )

    db.add(movement)
    db.commit()

    return {"message": "Lead moved successfully"}