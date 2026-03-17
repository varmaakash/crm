from pydantic import BaseModel


class LeadMove(BaseModel):

    lead_id: int
    from_user: int
    to_user: int

    remark: str