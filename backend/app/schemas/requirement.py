from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class RequirementStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"

class RequirementBase(BaseModel):
    description: str
    project_id: int
    status: RequirementStatus = RequirementStatus.PENDING

class RequirementCreate(RequirementBase):
    pass

class RequirementUpdate(BaseModel):
    description: Optional[str] = None
    status: Optional[RequirementStatus] = None

class RequirementResponse(RequirementBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
