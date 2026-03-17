from pydantic import BaseModel
from datetime import date
from typing import Optional


class FollowupCreate(BaseModel):

    lead_id: int
    remark: str

    status: str
    temperature: Optional[str] = None
    counsellor_id: int

    next_followup: date