from pydantic import BaseModel


class UserCreate(BaseModel):
    full_name: str
    mobile: str
    password: str
    role: str


class UserLogin(BaseModel):
    mobile: str
    password: str