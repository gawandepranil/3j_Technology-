from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserResponse, UserLogin, Token
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os

router = APIRouter(prefix="/api/users", tags=["users"])

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

from app.models.employee import Employee

@router.post("/register", response_model=UserResponse)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    email_lower = user_create.email.strip().lower()
    
    # Check if email already exists
    db_user = db.query(User).filter(User.email == email_lower).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # Auto-classify role based on email domain
    if email_lower.endswith("@3j.com") or email_lower.endswith(".3j.com") or ".3j@" in email_lower or email_lower == "name3j@gmail.com":
        assigned_role = UserRole.EMPLOYEE
    else:
        assigned_role = UserRole.CLIENT

    hashed_password = hash_password(user_create.password)
    new_user = User(
        name=user_create.name,
        email=email_lower,
        password=hashed_password,
        role=assigned_role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Auto-create linked Employee record for employees
    if assigned_role == UserRole.EMPLOYEE:
        # Check if Employee record already exists to be safe
        db_employee = db.query(Employee).filter(Employee.user_id == new_user.id).first()
        if not db_employee:
            new_employee = Employee(
                name=new_user.name,
                designation="Team Member",
                department="Engineering",
                user_id=new_user.id
            )
            db.add(new_employee)
            db.commit()

    return new_user

@router.post("/login", response_model=Token)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    # Normalize email to match the lowercase value stored at registration
    email_lower = user_login.email.strip().lower()
    user = db.query(User).filter(User.email == email_lower).first()
    if not user or not verify_password(user_login.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
