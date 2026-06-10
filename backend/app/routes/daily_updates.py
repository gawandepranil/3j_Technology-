from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.daily_update import DailyUpdate
from app.schemas.daily_update import DailyUpdateCreate, DailyUpdateResponse, DailyUpdateUpdate

router = APIRouter(prefix="/api/daily-updates", tags=["daily-updates"])

@router.post("/", response_model=DailyUpdateResponse)
def create_daily_update(update: DailyUpdateCreate, db: Session = Depends(get_db)):
    db_update = DailyUpdate(**update.model_dump())
    db.add(db_update)
    db.commit()
    db.refresh(db_update)
    return db_update

@router.get("/", response_model=list[DailyUpdateResponse])
def get_daily_updates(db: Session = Depends(get_db)):
    updates = db.query(DailyUpdate).all()
    return updates

@router.get("/{update_id}", response_model=DailyUpdateResponse)
def get_daily_update(update_id: int, db: Session = Depends(get_db)):
    update = db.query(DailyUpdate).filter(DailyUpdate.id == update_id).first()
    if not update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily update not found")
    return update

@router.put("/{update_id}", response_model=DailyUpdateResponse)
def update_daily_update(update_id: int, update_data: DailyUpdateUpdate, db: Session = Depends(get_db)):
    update = db.query(DailyUpdate).filter(DailyUpdate.id == update_id).first()
    if not update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily update not found")
    
    data = update_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(update, key, value)
    
    db.commit()
    db.refresh(update)
    return update

@router.delete("/{update_id}")
def delete_daily_update(update_id: int, db: Session = Depends(get_db)):
    update = db.query(DailyUpdate).filter(DailyUpdate.id == update_id).first()
    if not update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily update not found")
    
    db.delete(update)
    db.commit()
    return {"detail": "Daily update deleted successfully"}
