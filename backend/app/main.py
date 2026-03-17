from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base

# Import Models (tables create करने के लिए)
from app.models import users, leads, followups, lead_movements

# Import Routes
from app.routes import auth_routes
from app.routes import user_routes
from app.routes import lead_routes
from app.routes import followup_routes
from app.routes import movement_routes
from app.routes import dashboard_routes


# -----------------------------
# CREATE FASTAPI APP
# -----------------------------
app = FastAPI(title="Education CRM API")


# -----------------------------
# CORS SETTINGS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# CREATE DATABASE TABLES
# -----------------------------
Base.metadata.create_all(bind=engine)


# -----------------------------
# INCLUDE ROUTES
# -----------------------------
app.include_router(auth_routes.router)

app.include_router(user_routes.router)

app.include_router(lead_routes.router)

app.include_router(followup_routes.router)

app.include_router(movement_routes.router)

app.include_router(dashboard_routes.router)


# -----------------------------
# ROOT API
# -----------------------------
@app.get("/")
def home():
    return {"message": "CRM API Running Successfully"}