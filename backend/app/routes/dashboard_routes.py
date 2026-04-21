from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date

from app.database import get_db
from sqlalchemy import func
from app.models.leads import Lead

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


# =====================================
# 🔥 INCENTIVE LOGIC (FLAT SLAB)
# =====================================
def calculate_incentive(conversions: int):
    if conversions >= 31:
        return conversions * 10000
    elif conversions >= 21:
        return conversions * 5000
    elif conversions >= 11:
        return conversions * 3000
    elif conversions >= 1:
        return conversions * 2000
    return 0


# =====================================
# 🔥 1. EMPLOYEE PERFORMANCE (UPDATED)
# =====================================
@router.get("/employee-performance")
def employee_performance(db: Session = Depends(get_db)):

    result = db.execute(text("""
        SELECT 
            u.full_name,
            l.assigned_counsellor,
            COUNT(*) AS leads_handled,
            COUNT(CASE WHEN LOWER(l.status) = 'converted' THEN 1 END) AS conversions,
            ROUND(
                COUNT(CASE WHEN LOWER(l.status) = 'converted' THEN 1 END) * 100.0 / COUNT(*), 2
            ) AS conversion_rate
        FROM leads l
        JOIN users u ON l.assigned_counsellor = u.id
        GROUP BY u.full_name, l.assigned_counsellor
    """)).fetchall()

    data = []

    for row in result:
        r = dict(row._mapping)

        conversions = r.get("conversions", 0) or 0

        # 💰 Incentive
        r["incentive"] = calculate_incentive(conversions)

        data.append(r)

    # 🏆 Ranking by incentive
    data = sorted(data, key=lambda x: x["incentive"], reverse=True)

    for i, d in enumerate(data):
        d["rank"] = i + 1

    return data


# =====================================
# 🔥 2. FOLLOW-UP METRICS
# =====================================
@router.get("/followup-metrics")
def followup_metrics(db: Session = Depends(get_db)):

    result = db.execute(text("""
        SELECT
            COUNT(*) FILTER (
                WHERE DATE(next_followup) < CURRENT_DATE
                AND completed_at IS NULL
            ) AS missed,

            COUNT(*) FILTER (
                WHERE DATE(next_followup) = CURRENT_DATE
                AND completed_at IS NULL
            ) AS today,

            COUNT(*) FILTER (
                WHERE DATE(next_followup) > CURRENT_DATE
                AND completed_at IS NULL
            ) AS pending,

            COUNT(*) FILTER (
                WHERE completed_at IS NOT NULL
                AND DATE(completed_at) = CURRENT_DATE
            ) AS completed_today

        FROM followups
    """)).fetchone()

    return {
        "missed": result.missed or 0,
        "today": result.today or 0,
        "pending": result.pending or 0,
        "completed_today": result.completed_today or 0
    }


# =====================================
# 🔥 3. SOURCE PERFORMANCE
# =====================================
@router.get("/source-metrics")
def source_metrics(db: Session = Depends(get_db)):

    result = db.execute(text("""
        SELECT 
            COALESCE(NULLIF(lead_source, ''), 'Unknown') AS source,
            COUNT(*) AS total_leads,
            COUNT(CASE WHEN LOWER(status) = 'converted' THEN 1 END) AS conversions,
            ROUND(
                COUNT(CASE WHEN LOWER(status) = 'converted' THEN 1 END) * 100.0 / COUNT(*), 2
            ) AS conversion_rate
        FROM leads
        GROUP BY lead_source
        ORDER BY total_leads DESC
    """)).fetchall()

    return [dict(row._mapping) for row in result]


# =====================================
# 🔥 4. TEMPERATURE
# =====================================
@router.get("/temperature")
def lead_temperature(db: Session = Depends(get_db)):

    result = db.execute(text("""
        SELECT 
            LOWER(temperature) as temperature,
            COUNT(*) as total
        FROM leads
        GROUP BY temperature
    """)).fetchall()

    return [dict(row._mapping) for row in result]


# =====================================
# 🔥 5. COURSE
# =====================================
@router.get("/course")
def course_leads(db: Session = Depends(get_db)):

    result = db.execute(text("""
        SELECT 
            interested_course as course,

            COUNT(*) FILTER (WHERE LOWER(temperature) = 'hot') as hot,
            COUNT(*) FILTER (WHERE LOWER(temperature) = 'warm') as warm,
            COUNT(*) FILTER (WHERE LOWER(temperature) = 'cold') as cold

        FROM leads
        GROUP BY interested_course
        ORDER BY course
    """)).fetchall()

    return [dict(row._mapping) for row in result]


# =====================================
# 🔥 6. KPI LEADS FILTER
# =====================================
@router.get("/kpi-leads")
def kpi_leads(type: str = None, db: Session = Depends(get_db)):

    query = """
        SELECT l.* FROM leads l
        WHERE 1=1
    """

    if type == "converted":
        query += " AND LOWER(l.status) = 'converted'"

    elif type == "missed":
        query += """
            AND l.id IN (
                SELECT lead_id FROM followups
                WHERE next_followup < CURRENT_DATE
                AND completed_at IS NULL
            )
        """

    elif type == "today":
        query += """
            AND l.id IN (
                SELECT lead_id FROM followups
                WHERE DATE(next_followup) = CURRENT_DATE
                AND completed_at IS NULL
            )
        """

    elif type == "pending":
        query += """
            AND l.id IN (
                SELECT lead_id FROM followups
                WHERE next_followup > CURRENT_DATE
                AND completed_at IS NULL
            )
        """

    result = db.execute(text(query)).fetchall()

    return [dict(row._mapping) for row in result]


# =====================================
# 🔥 7. LEADS FILTER
# =====================================
@router.get("/leads")
def get_leads(
    temperature: str = None,
    interested_course: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):

    query = """
        SELECT l.*, u.full_name as counsellor_name
        FROM leads l
        LEFT JOIN users u ON l.assigned_counsellor = u.id
        WHERE 1=1
    """

    params = {}

    if temperature:
        query += " AND LOWER(l.temperature) LIKE LOWER(:temperature)"
        params["temperature"] = f"%{temperature}%"

    if interested_course:
        query += " AND LOWER(l.interested_course) LIKE LOWER(:course)"
        params["course"] = f"%{interested_course}%"

    if status:
        query += " AND LOWER(l.status) LIKE LOWER(:status)"
        params["status"] = f"%{status}%"

    query += " ORDER BY l.created_at DESC"

    result = db.execute(text(query), params).fetchall()

    return [dict(row._mapping) for row in result]
@router.get("/source-count")
def source_count(db: Session = Depends(get_db)):

    data = db.query(
        Lead.lead_source,
        func.count(Lead.id).label("total")
    ).group_by(Lead.lead_source).all()

    return [
        {
            "source": d.lead_source,
            "total": d.total
        }
        for d in data
    ]
# =====================================
# 🔥 BULK UPLOAD (FINAL FIXED VERSION)
# =====================================

from fastapi import UploadFile, File
import pandas as pd

@router.post("/upload-leads")
async def upload_leads(file: UploadFile = File(...), db: Session = Depends(get_db)):

    try:
        df = pd.read_excel(file.file)

        # 🔥 column normalize (IMPORTANT)
        df.columns = df.columns.str.strip().str.lower()

    except Exception as e:
        return {"error": f"Excel read failed: {str(e)}"}

    inserted = 0
    skipped = 0

    for _, row in df.iterrows():

        # 🔥 flexible column support
        name = str(row.get("name") or row.get("student_name") or "").strip()
        mobile = str(
            row.get("mobile") or 
            row.get("mobile no") or 
            row.get("phone") or 
            row.get("student_contact") or ""
        ).strip()

        # ❌ empty skip
        if not name or not mobile:
            skipped += 1
            continue

        # 🔥 duplicate check (FIXED FIELD)
        exists = db.query(Lead).filter(Lead.student_contact == mobile).first()
        if exists:
            skipped += 1
            continue

        # ✅ correct fields (VERY IMPORTANT FIX)
        new_lead = Lead(
            student_name=name,
            student_contact=mobile,
            status="new",
            temperature="warm",
            lead_source="Bulk Upload"
        )

        db.add(new_lead)
        inserted += 1

    db.commit()

    return {
        "inserted": inserted,
        "skipped": skipped,
        "message": f"{inserted} leads added, {skipped} skipped"
    }
from fastapi.responses import StreamingResponse
import io
import pandas as pd

# =====================================
# 🔥 DOWNLOAD TEMPLATE
# =====================================
@router.get("/download-template")
def download_template():

    # ✅ sample structure
    data = {
        "name": ["Rahul Kumar", "Aman Singh"],
        "mobile": ["9876543210", "9123456789"]
    }

    df = pd.DataFrame(data)

    # 🔥 create excel in memory
    output = io.BytesIO()
    df.to_excel(output, index=False)
    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=lead_template.xlsx"}
    )

@router.get("/all-employees")
def all_employees(db: Session = Depends(get_db)):

    result = db.execute(text("""
        SELECT 
            u.id,
            u.full_name,
            u.mobile,
            u.role,

            COUNT(l.id) AS total_leads,

            COUNT(
                CASE WHEN LOWER(l.status) = 'converted' THEN 1 END
            ) AS converted

        FROM users u
        LEFT JOIN leads l 
        ON l.assigned_counsellor = u.id

        GROUP BY u.id, u.full_name, u.mobile, u.role
        ORDER BY u.id
    """)).fetchall()

    return [dict(row._mapping) for row in result]

from datetime import datetime

from sqlalchemy import text

@router.get("/followups")
def get_followups(type: str = "all", db: Session = Depends(get_db)):

    query = """
        SELECT 
            f.id,
            f.lead_id,
            f.next_followup,
            f.completed_at,

            f.remark,
            f.created_at AS updated_at,

            u.full_name AS updated_by,

            -- 🔥 CORRECT FIELDS
            l.student_name,
            l.student_contact,
            l.interested_course

        FROM followups f
        JOIN leads l ON l.id = f.lead_id
        LEFT JOIN users u ON u.id = f.counsellor_id
        WHERE 1=1
    """

    if type == "today":
        query += " AND DATE(f.next_followup) = CURRENT_DATE AND f.completed_at IS NULL"

    elif type == "missed":
        query += " AND f.next_followup < CURRENT_DATE AND f.completed_at IS NULL"

    elif type == "upcoming":
        query += " AND f.next_followup > CURRENT_DATE AND f.completed_at IS NULL"

    elif type == "done":
        query += " AND f.completed_at IS NOT NULL"

    query += " ORDER BY f.next_followup DESC"

    result = db.execute(text(query)).fetchall()

    return [dict(row._mapping) for row in result]
@router.put("/followup-done/{id}")
def mark_done(id: int, db: Session = Depends(get_db)):

    f = db.execute(text("SELECT * FROM followups WHERE id=:id"), {"id": id}).fetchone()

    if not f:
        return {"error": "Not found"}

    db.execute(
        text("UPDATE followups SET completed_at=:now WHERE id=:id"),
        {"now": datetime.now(), "id": id}
    )

    db.commit()

    return {"message": "Done"}

@router.delete("/followup/{id}")
def delete_followup(id: int, db: Session = Depends(get_db)):

    db.execute(text("DELETE FROM followups WHERE id=:id"), {"id": id})
    db.commit()

    return {"message": "Deleted"}

@router.put("/followup-reschedule/{id}")
def reschedule_followup(id: int, new_date: str, db: Session = Depends(get_db)):

    db.execute(
        text("UPDATE followups SET next_followup=:date WHERE id=:id"),
        {"date": new_date, "id": id}
    )

    db.commit()

    return {"message": "Rescheduled"}