"""
Database initialization script

Run this after setting up PostgreSQL:
1. Create the database: createdb 3j_db
2. Update .env with your PostgreSQL credentials
3. Run this script: python init_db.py
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.connection import Base
from app.models.user import User, UserRole
from app.models.employee import Employee
from app.models.project import Project, ProjectStatus
from app.models.lead import Lead, LeadStatus
from app.models.requirement import Requirement, RequirementStatus
from app.routes.users import hash_password
from datetime import datetime, timedelta

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://user:password@localhost/3j_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Clear existing data (in correct dependency order)
        db.query(Requirement).delete()
        db.query(Project).delete()
        db.query(Employee).delete()
        db.query(Lead).delete()
        db.query(User).delete()
        db.commit()
        
        # Create admin user
        admin = User(
            name="Admin User",
            email="admin@3j.com",
            password=hash_password("admin123"),
            role=UserRole.ADMIN
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        # Create employee users
        employees_data = [
            ("John Doe", "john@3j.com", "Senior Developer"),
            ("Jane Smith", "jane@3j.com", "Project Manager"),
            ("Mike Johnson", "mike@3j.com", "Designer"),
            ("Sarah Williams", "sarah@3j.com", "QA Engineer"),
        ]
        
        for name, email, designation in employees_data:
            user = User(
                name=name,
                email=email,
                password=hash_password("password123"),
                role=UserRole.EMPLOYEE
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
            employee = Employee(
                name=name,
                designation=designation,
                department="Engineering",
                user_id=user.id
            )
            db.add(employee)
        
        db.commit()
        
        # Create client user
        client = User(
            name="Client Corp",
            email="client@company.com",
            password=hash_password("client123"),
            role=UserRole.CLIENT
        )
        db.add(client)
        db.commit()
        db.refresh(client)
        
        # Create projects
        projects_data = [
            ("Website Redesign", "Complete redesign of company website", ProjectStatus.IN_PROGRESS, client.id),
            ("Mobile App", "New mobile application development", ProjectStatus.PLANNING, client.id),
            ("Cloud Migration", "Migrate infrastructure to cloud", ProjectStatus.PLANNING, client.id),
        ]
        
        for title, description, status, client_id in projects_data:
            project = Project(
                title=title,
                description=description,
                status=status,
                client_id=client_id
            )
            db.add(project)
        
        db.commit()
        
        # Get all projects for requirements
        all_projects = db.query(Project).all()
        
        # Create requirements
        if all_projects:
            req1 = Requirement(
                project_id=all_projects[0].id,
                description="Implement user authentication system",
                status=RequirementStatus.IN_PROGRESS
            )
            req2 = Requirement(
                project_id=all_projects[0].id,
                description="Design responsive layout",
                status=RequirementStatus.PENDING
            )
            req3 = Requirement(
                project_id=all_projects[1].id,
                description="Setup backend API",
                status=RequirementStatus.PENDING
            )
            db.add_all([req1, req2, req3])
            db.commit()
        
        # Create leads
        leads_data = [
            ("Tech Startup Inc", "John Tech", "john@techstartup.com", "9876543210", LeadStatus.NEW),
            ("Fortune 500 Corp", "Jane Fortune", "jane@fortune500.com", "1234567890", LeadStatus.CONTACTED),
            ("Growth Company Ltd", "Bob Growth", "bob@growth.com", "5555555555", LeadStatus.QUALIFIED),
        ]
        
        for company, contact_name, email, phone, status in leads_data:
            lead = Lead(
                company=company,
                contact_name=contact_name,
                contact_email=email,
                contact_phone=phone,
                status=status
            )
            db.add(lead)
        
        db.commit()
        
        print("[SUCCESS] Database initialized successfully!")
        print("\nCreated users:")
        print(f"  - Admin: admin@3j.com / admin123")
        print(f"  - Client: client@company.com / client123")
        print(f"  - Employees: (4 users with email/password123)")
        print("\nCreated sample data:")
        print(f"  - 3 Projects")
        print(f"  - 3 Requirements")
        print(f"  - 3 Leads")
        
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error initializing database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
