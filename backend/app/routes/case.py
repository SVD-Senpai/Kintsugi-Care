from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid
import json

from app.schemas.case import CaseCreate, CaseResponse, CaseUpdate, CaseAssignment
from app.models.case import Case
from app.models.case_history import CaseHistory
from app.appdatabase import get_db


router = APIRouter(
    prefix="/api/cases",
    tags=["Cases"]
)


@router.post("/", response_model=CaseResponse)
def create_case(
    case: CaseCreate,
    db: Session = Depends(get_db)
):

    # Temporary risk calculation.
    # We will replace this with the Kintsugi AI/ML triage engine later.
    if len(case.symptoms) >= 4:
        risk_level = "high"
    elif len(case.symptoms) >= 2:
        risk_level = "medium"
    else:
        risk_level = "low"

    new_case = Case(
        id=str(uuid.uuid4()),
        animal_type=case.animal_type,
        breed = case.breed,
        age = case.age,
        sex=case.sex,
        tag_id=case.tag_id,
        symptoms=json.dumps(case.symptoms),
        risk_level=risk_level,
        latitude=case.latitude,
        longitude=case.longitude,
        village=case.village,
        farmer_name=case.farmer_name,
        status="Pending",
    )

    db.add(new_case)
    db.commit()
    db.refresh(new_case)

    history = CaseHistory(
       id=str(uuid.uuid4()),
       case_id=new_case.id,
       action="Case Submitted",
       status=new_case.status,
       description="Farmer submitted a new livestock health case."
    )

    db.add(history)
    db.commit()
    return {
        "id": new_case.id,
        "animal_type": new_case.animal_type,
        "breed": new_case.breed,
        "age": new_case.age,
        "sex": new_case.sex,
        "tag_id": new_case.tag_id,
        "symptoms": case.symptoms,
        "risk_level": new_case.risk_level,
        "latitude": new_case.latitude,
        "longitude": new_case.longitude,
        "village": new_case.village,
        "farmer_name": new_case.farmer_name,
        "status": new_case.status,
        "assigned_vet": new_case.assigned_vet,
        "created_at": new_case.created_at,
        "updated_at": new_case.updated_at,

    }

@router.get("/", response_model=list[CaseResponse])
def get_cases(
    db: Session = Depends(get_db)
):
    cases = db.query(Case).order_by(Case.id.desc()).all()

    return [
        {
            "id": case.id,
            "animal_type": case.animal_type,
            "breed": case.breed,
            "age": case.age,
            "sex": case.sex,
            "tag_id": case.tag_id,
            "symptoms": json.loads(case.symptoms),
            "risk_level": case.risk_level,
            "latitude": case.latitude,
            "longitude": case.longitude,
            "village": case.village,
            "farmer_name": case.farmer_name,
            "status": case.status,
            "assigned_vet": case.assigned_vet,
            "created_at": case.created_at,
            "updated_at": case.updated_at,
        }
        for case in cases
    ]

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(
    case_id: str,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()

    if case is None:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    return {
        "id": case.id,
        "animal_type": case.animal_type,
        "breed": case.breed,
        "age": case.age,
        "sex": case.sex,
        "tag_id": case.tag_id,
        "symptoms": json.loads(case.symptoms),
        "risk_level": case.risk_level,
        "latitude": case.latitude,
        "longitude": case.longitude,
        "village": case.village,
        "farmer_name": case.farmer_name,
        "status": case.status,
        "assigned_vet": case.assigned_vet,
        "created_at": case.created_at,
        "updated_at": case.updated_at,
    }


@router.patch("/{case_id}", response_model=CaseResponse)
def update_case_status(
    case_id: str,
    case_update: CaseUpdate,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()

    if case is None:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    old_status = case.status
    case.status = case_update.status

    db.commit()
    db.refresh(case)

    history = CaseHistory(
      id=str(uuid.uuid4()),
      case_id=case.id,
      action="Status Updated",
      status=case.status,
      description=f"Case status changed from {old_status} to {case.status}."
   )

    db.add(history)
    db.commit()

    return {
        "id": case.id,
        "animal_type": case.animal_type,
        "breed": case.breed,
        "age": case.age,
        "sex": case.sex,
        "tag_id": case.tag_id,
        "symptoms": json.loads(case.symptoms),
        "risk_level": case.risk_level,
        "latitude": case.latitude,
        "longitude": case.longitude,
        "village": case.village,
        "farmer_name": case.farmer_name,
        "status": case.status,
        "assigned_vet": case.assigned_vet,
        "created_at": case.created_at,
        "updated_at": case.updated_at,
    }

@router.patch("/{case_id}/assign", response_model=CaseResponse)
def assign_vet(
    case_id: str,
    assignment: CaseAssignment,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()

    if case is None:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    
    case.assigned_vet = assignment.assigned_vet

    db.commit()
    db.refresh(case)

    history = CaseHistory(
      id=str(uuid.uuid4()),
      case_id=case.id,
      action="Vet Assigned",
      status="Assigned",
      description=f"Case assigned to {case.assigned_vet}."
    )

    db.add(history)
    db.commit()

    return {
        "id": case.id,
        "animal_type": case.animal_type,
        "breed": case.breed,
        "age": case.age,
        "sex": case.sex,
        "tag_id": case.tag_id,
        "symptoms": json.loads(case.symptoms),
        "risk_level": case.risk_level,
        "latitude": case.latitude,
        "longitude": case.longitude,
        "village": case.village,
        "farmer_name": case.farmer_name,
        "status": case.status,
        "assigned_vet": case.assigned_vet,
        "created_at": case.created_at,
        "updated_at": case.updated_at,
    }

@router.get("/{case_id}/history")
def get_case_history(
    case_id: str,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()

    if case is None:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    history = (
        db.query(CaseHistory)
        .filter(CaseHistory.case_id == case_id)
        .order_by(CaseHistory.created_at.asc())
        .all()
    )

    return [
        {
            "id": item.id,
            "case_id": item.case_id,
            "action": item.action,
            "status": item.status,
            "description": item.description,
            "created_at": item.created_at,
        }
        for item in history
    ]