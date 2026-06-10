# 3J Backend API

FastAPI backend for the 3J business management platform.

## Setup

### Prerequisites
- Python 3.9+
- PostgreSQL 12+
- pip

### Installation

1. Create a Python virtual environment:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create PostgreSQL database:
```bash
createdb 3j_db
```

4. Update `.env` with your database credentials:
```
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/3j_db
```

5. Initialize the database with sample data:
```bash
python init_db.py
```

### Running the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

- API Documentation: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## Database Schema

### Users
- id (PK)
- name
- email (unique)
- password (hashed)
- role (admin, employee, client)
- created_at, updated_at

### Employees
- id (PK)
- name
- designation
- department
- user_id (FK)
- created_at, updated_at

### Projects
- id (PK)
- title
- description
- status (planning, in_progress, on_hold, completed)
- client_id (FK → Users)
- created_at, updated_at

### Leads
- id (PK)
- company
- contact_name
- contact_email
- contact_phone
- status (new, contacted, qualified, proposal_sent, negotiation, won, lost)
- notes
- created_at, updated_at

### Meetings
- id (PK)
- title
- description
- date
- project_id (FK)
- created_at, updated_at

### DailyUpdates
- id (PK)
- employee_id (FK)
- content
- date
- created_at, updated_at

### Requirements
- id (PK)
- project_id (FK)
- description
- status (pending, in_progress, completed, rejected)
- created_at, updated_at

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/` - Get all users
- `GET /api/users/{id}` - Get user by ID

### Projects
- `GET /api/projects/` - Get all projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}` - Get project by ID
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Employees
- `GET /api/employees/` - Get all employees
- `POST /api/employees/` - Create employee
- `GET /api/employees/{id}` - Get employee by ID
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

### Leads
- `GET /api/leads/` - Get all leads
- `POST /api/leads/` - Create lead
- `GET /api/leads/{id}` - Get lead by ID
- `PUT /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead

### Meetings
- `GET /api/meetings/` - Get all meetings
- `POST /api/meetings/` - Create meeting
- `GET /api/meetings/{id}` - Get meeting by ID
- `PUT /api/meetings/{id}` - Update meeting
- `DELETE /api/meetings/{id}` - Delete meeting

### Daily Updates
- `GET /api/daily-updates/` - Get all daily updates
- `POST /api/daily-updates/` - Create daily update
- `GET /api/daily-updates/{id}` - Get daily update by ID
- `PUT /api/daily-updates/{id}` - Update daily update
- `DELETE /api/daily-updates/{id}` - Delete daily update

### Requirements
- `GET /api/requirements/` - Get all requirements
- `POST /api/requirements/` - Create requirement
- `GET /api/requirements/{id}` - Get requirement by ID
- `PUT /api/requirements/{id}` - Update requirement
- `DELETE /api/requirements/{id}` - Delete requirement

## Development

### Testing with Swagger UI
Navigate to http://localhost:8000/docs for interactive API testing

### Creating New Endpoints
1. Create model in `app/models/`
2. Create schema in `app/schemas/`
3. Create routes in `app/routes/`
4. Include router in `main.py`

## Deployment

For production deployment, ensure:
- SECRET_KEY is a strong random value
- DATABASE_URL points to production database
- CORS origins are restricted to your frontend domain
- Run with a production ASGI server (e.g., Gunicorn with Uvicorn workers)

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```
