from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.requirement import Requirement
from app.schemas.requirement import RequirementCreate, RequirementResponse, RequirementUpdate

router = APIRouter(prefix="/api/requirements", tags=["requirements"])

@router.post("/", response_model=RequirementResponse)
def create_requirement(requirement: RequirementCreate, db: Session = Depends(get_db)):
    db_requirement = Requirement(**requirement.model_dump())
    db.add(db_requirement)
    db.commit()
    db.refresh(db_requirement)
    return db_requirement

@router.get("/", response_model=list[RequirementResponse])
def get_requirements(db: Session = Depends(get_db)):
    requirements = db.query(Requirement).all()
    return requirements

@router.get("/{requirement_id}", response_model=RequirementResponse)
def get_requirement(requirement_id: int, db: Session = Depends(get_db)):
    requirement = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not requirement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requirement not found")
    return requirement

@router.put("/{requirement_id}", response_model=RequirementResponse)
def update_requirement(requirement_id: int, requirement_update: RequirementUpdate, db: Session = Depends(get_db)):
    requirement = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not requirement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requirement not found")
    
    update_data = requirement_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(requirement, key, value)
    
    db.commit()
    db.refresh(requirement)
    return requirement

@router.delete("/{requirement_id}")
def delete_requirement(requirement_id: int, db: Session = Depends(get_db)):
    requirement = db.query(Requirement).filter(Requirement.id == requirement_id).first()
    if not requirement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Requirement not found")
    
    db.delete(requirement)
    db.commit()
    return {"detail": "Requirement deleted successfully"}
