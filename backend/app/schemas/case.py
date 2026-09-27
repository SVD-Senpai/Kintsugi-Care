from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime


class CaseCreate(BaseModel):
    animal_type: str
    breed: str | None = None
    age: int | None = None
    sex: str | None = None
    tag_id: str | None = None
    symptoms: List[str]
    latitude: float | None = None
    longitude: float | None = None
    village: str | None = None
    farmer_name: str | None = None


class CaseResponse(BaseModel):
    id: str
    animal_type: str
    breed: str | None = None
    age: int | None = None 
    sex: str | None = None
    tag_id: str | None = None
    symptoms: List[str]
    risk_level: str
    latitude: float | None = None
    longitude: float | None = None
    village: str | None = None
    farmer_name: str | None = None
    status: str
    assigned_vet: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

class CaseUpdate(BaseModel):
    status: Literal["Pending", "Assigned", "In Treatment", "Resolved"]


class CaseAssignment(BaseModel):
    assigned_vet: str