from pydantic import BaseModel, constr
from typing import Optional


# -----------------------------
# CREATE LEAD SCHEMA
# -----------------------------
class LeadCreate(BaseModel):

    student_name: str
    student_contact: constr(pattern=r'^\d{10}$')

    gender: Optional[str] = None
    qualification: Optional[str] = None
    school_name: Optional[str] = None
    year_of_passing: Optional[str] = None

    # LOCATION
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None

    # PARENT INFO
    parent_name: Optional[str] = None
    parent_contact: Optional[str] = None

    # COURSE INFO
    interested_course: Optional[str] = None
    interested_location: Optional[str] = None

    # LEAD SOURCE
    lead_source: Optional[str] = None

    # ASSIGNED USER
    assigned_counsellor: Optional[int] = None

    # LEAD STATUS
    status: Optional[str] = "new"
    temperature: Optional[str] = "cold"

    # FOLLOWUP
    next_followup: Optional[str] = None


# -----------------------------
# UPDATE LEAD SCHEMA
# -----------------------------
class LeadUpdate(BaseModel):

    student_name: Optional[str] = None
    student_contact: Optional[str] = None

    gender: Optional[str] = None
    qualification: Optional[str] = None
    school_name: Optional[str] = None
    year_of_passing: Optional[str] = None

    # LOCATION
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None

    # PARENT INFO
    parent_name: Optional[str] = None
    parent_contact: Optional[str] = None

    # COURSE INFO
    interested_course: Optional[str] = None
    interested_location: Optional[str] = None

    # LEAD SOURCE
    lead_source: Optional[str] = None

    # ASSIGNED USER
    assigned_counsellor: Optional[int] = None

    # STATUS
    status: Optional[str] = None
    temperature: Optional[str] = None

    # FOLLOWUP
    next_followup: Optional[str] = None