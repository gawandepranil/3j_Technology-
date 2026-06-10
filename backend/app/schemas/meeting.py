from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class MeetingBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    project_id: Optional[int] = None

class MeetingCreate(MeetingBase):
    pass

class MeetingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    project_id: Optional[int] = None

class MeetingResponse(MeetingBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
