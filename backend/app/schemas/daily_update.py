from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DailyUpdateBase(BaseModel):
    content: str
    employee_id: int
    date: Optional[datetime] = None

class DailyUpdateCreate(DailyUpdateBase):
    pass

class DailyUpdateUpdate(BaseModel):
    content: Optional[str] = None

class DailyUpdateResponse(DailyUpdateBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
