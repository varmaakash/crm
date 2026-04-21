from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# ================================
# 🔥 1. EMPLOYEE PERFORMANCE
# ================================
@router.get("/employee-performance")
def employee_performance(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT 
            u.full_name,
            l.assigned_counsellor,
            COUNT(*) AS leads_handled,
            COUNT(CASE WHEN l.status = 'converted' THEN 1 END) AS conversions,
            ROUND(
                COUNT(CASE WHEN l.status = 'converted' THEN 1 END) * 100.0 / COUNT(*), 2
            ) AS conversion_rate
        FROM leads l
        JOIN users u ON l.assigned_counsellor = u.id
        GROUP BY u.full_name, l.assigned_counsellor
        ORDER BY conversions DESC
    """)).fetchall()

    return [dict(row._mapping) for row in result]


# ================================
# 🔥 2. FOLLOW-UP METRICS (FINAL FIXED)
# ================================
@router.get("/followup-metrics")
def followup_metrics(db: Session = Depends(get_db)):

    result = db.execute(text("""
        SELECT
            COUNT(*) FILTER (
                WHERE next_followup::date < CURRENT_DATE
                AND status NOT IN ('converted', 'dropped')
            ) AS missed,

            COUNT(*) FILTER (
                WHERE next_followup::date = CURRENT_DATE
                AND status NOT IN ('converted', 'dropped')
            ) AS today,

            COUNT(*) FILTER (
                WHERE next_followup::date > CURRENT_DATE
                AND status NOT IN ('converted', 'dropped')
            ) AS pending

        FROM followups
    """)).fetchone()

    return {
        "missed": result.missed or 0,
        "today": result.today or 0,
        "pending": result.pending or 0
    }


# ================================
# 🔥 3. SOURCE PERFORMANCE
# ================================
@router.get("/source-metrics")
def source_metrics(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT 
            COALESCE(NULLIF(lead_source, ''), 'Unknown') AS source,
            COUNT(*) AS total_leads,
            COUNT(CASE WHEN status = 'converted' THEN 1 END) AS conversions,
            ROUND(
                COUNT(CASE WHEN status = 'converted' THEN 1 END) * 100.0 / COUNT(*), 2
            ) AS conversion_rate
        FROM leads
        GROUP BY lead_source
    """)).fetchall()

    return [dict(row._mapping) for row in result]


# ================================
# 🔥 4. TEMPERATURE (PIE)
# ================================
@router.get("/temperature")
def lead_temperature(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT 
            temperature,
            COUNT(*) as total
        FROM leads
        GROUP BY temperature
    """)).fetchall()

    return [dict(row._mapping) for row in result]


# ================================
# 🔥 5. COURSE (BAR)
# ================================
@router.get("/course")
def course_leads(db: Session = Depends(get_db)):
    result = db.execute(text("""
        SELECT 
            interested_course,
            COUNT(*) as total
        FROM leads
        GROUP BY interested_course
    """)).fetchall()

    return [dict(row._mapping) for row in result]


# ================================
# 🔥 6. KPI BASED LEADS (FINAL FIXED)
# ================================
@router.get("/kpi-leads")
def kpi_leads(type: str = None, db: Session = Depends(get_db)):

    query = "SELECT * FROM leads WHERE 1=1"

    # ✅ Converted
    if type == "converted":
        query += " AND LOWER(status) = 'converted'"

    # 🔴 Missed (past)
    elif type == "missed":
        query += """
            AND id IN (
                SELECT lead_id FROM followups
                WHERE next_followup::date < CURRENT_DATE
                AND status NOT IN ('converted', 'dropped')
            )
        """

    # 🟣 Today
    elif type == "today":
        query += """
            AND id IN (
                SELECT lead_id FROM followups
                WHERE next_followup::date = CURRENT_DATE
                AND status NOT IN ('converted', 'dropped')
            )
        """

    # 🟡 Pending (future)
    elif type == "pending":
        query += """
            AND id IN (
                SELECT lead_id FROM followups
                WHERE next_followup::date > CURRENT_DATE
                AND status NOT IN ('converted', 'dropped')
            )
        """

    result = db.execute(text(query)).fetchall()

    return [dict(row._mapping) for row in result]


# ================================
# 🔥 7. LEADS FILTER (MAIN)
# ================================
@router.get("/leads")
def get_leads(
    temperature: str = None,
    interested_course: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    query = """
        SELECT * FROM leads
        WHERE 1=1
    """

    params = {}

    if temperature:
        query += " AND LOWER(temperature) LIKE LOWER(:temperature)"
        params["temperature"] = f"%{temperature}%"

    if interested_course:
        query += " AND LOWER(interested_course) LIKE LOWER(:course)"
        params["course"] = f"%{interested_course}%"

    if status:
        query += " AND LOWER(status) LIKE LOWER(:status)"
        params["status"] = f"%{status}%"

    result = db.execute(text(query), params).fetchall()

    return [dict(row._mapping) for row in result]
@router.get("/status-count")
def status_count(db: Session = Depends(get_db)):

    result = db.execute(text("""
        SELECT 
            LOWER(status) as status,
            COUNT(*) as count
        FROM leads
        GROUP BY status
    """)).fetchall()

    return [dict(row._mapping) for row in result]