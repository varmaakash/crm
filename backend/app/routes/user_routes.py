from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.users import User
from app.utils.security import verify_password, create_access_token

router = APIRouter(prefix="/users", tags=["Users"])


# -----------------------------
# GET ALL USERS
# -----------------------------
@router.get("/")
def get_users(db: Session = Depends(get_db)):

    users = db.query(User).all()

    return users


# -----------------------------
# LOGIN USER
# -----------------------------
@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username")

    if not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user.full_name,
        "role": user.role,
        "user_id": user.id
    }