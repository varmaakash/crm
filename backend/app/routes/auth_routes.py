from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.users import User
from app.schemas.user_schema import UserCreate
from app.utils.security import hash_password

router = APIRouter(prefix="/auth", tags=["Auth"])


# -----------------------------
# REGISTER USER
# -----------------------------
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    # check existing mobile
    existing_user = db.query(User).filter(User.mobile == user.mobile).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Mobile already registered")

    hashed_password = hash_password(user.password)

    new_user = User(
        username=user.mobile,      # login username
        full_name=user.full_name,
        mobile=user.mobile,
        password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id,
        "username": new_user.username,
        "role": new_user.role
    }