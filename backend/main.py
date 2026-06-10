import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.routes import users, projects, employees, leads, meetings, daily_updates, requirements

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="3J Business Management API",
    description="FastAPI backend for 3J project management and business portal",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(employees.router)
app.include_router(leads.router)
app.include_router(meetings.router)
app.include_router(daily_updates.router)
app.include_router(requirements.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to 3J Business Management API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
