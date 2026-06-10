from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

meeting_attendees = Table(
    'meeting_attendees',
    Base.metadata,
    Column('meeting_id', Integer, ForeignKey('meetings.id')),
    Column('employee_id', Integer, ForeignKey('employees.id'))
)

class Meeting(Base):
    __tablename__ = "meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    date = Column(DateTime, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    project = relationship("Project", back_populates="meetings")
    attendees = relationship("Employee", secondary=meeting_attendees)
