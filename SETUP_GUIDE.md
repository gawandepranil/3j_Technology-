# Complete Setup Guide: 3J Business Management Platform

## ⚡ Quick Start (5 minutes)

For experienced developers who know the stack:

```bash
# 1. Start database
docker-compose up -d

# 2. Setup backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows (or source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
python init_db.py
python -m uvicorn main:app --reload

# 3. In new terminal, setup frontend
npm install
npm start
# Choose platform: a (Android), i (iOS), w (Web)
```

**Login:** `admin@3j.com` / `admin123`

---

## Project Structure

```
3j/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routes/            # API endpoints
│   │   ├── schemas/           # Pydantic schemas
│   │   └── database/          # Database configuration
│   ├── main.py               # FastAPI app entry point
│   ├── init_db.py            # Database initialization
│   ├── requirements.txt       # Python dependencies
│   ├── .env                  # Environment variables
│   └── README.md             # Backend documentation
│
├── src/
│   ├── api/                  # API service layer
│   │   ├── apiClient.ts      # Base API client
│   │   ├── authService.ts    # Auth API calls
│   │   ├── projectService.ts # Projects API calls
│   │   ├── employeeService.ts
│   │   ├── leadService.ts
│   │   ├── meetingService.ts
│   │   ├── dailyUpdateService.ts
│   │   └── requirementService.ts
│   │
│   ├── store/                # Zustand stores
│   │   ├── authStore.ts      # Auth state management
│   │   ├── projectStore.ts
│   │   ├── employeeStore.ts
│   │   ├── leadStore.ts
│   │   ├── meetingStore.ts
│   │   └── dailyUpdateStore.ts
│   │
│   ├── components/           # React Native components
│   ├── data/                 # Mock data (deprecated, use API)
│   ├── types/               # TypeScript types
│   ├── theme/              # Theme & tokens
│   └── ...
│
├── package.json            # Frontend dependencies
├── .env                    # Frontend environment variables
└── docker-compose.yml      # Docker services configuration
```

## Database Schema

```
Users (id, name, email, password, role, created_at, updated_at)
├── Employees (id, name, designation, department, user_id)
├── DailyUpdates (id, content, employee_id, date)
└── Meetings (attendees join table)

Projects (id, title, status, client_id, description)
├── Requirements (id, description, project_id, status)
└── Meetings (id, title, date, project_id)

Leads (id, company, status, contact_info)
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+ (3.9 may have compatibility issues)
- PostgreSQL 12+ (or Docker Desktop for easier setup)
- VS Code
- Git (for pushing to GitHub)

### Step 1: Setup PostgreSQL

**Option A: Using Docker (Recommended)**

```bash
cd 3j
docker-compose up -d
```

This starts:
- PostgreSQL: `localhost:5432` (user: user, password: password)
- pgAdmin: `localhost:5050` (admin@example.com / admin)

**Option B: Manual PostgreSQL Setup**

```bash
# Create database
createdb 3j_db

# Create user
createuser -P user  # Password: password
```

### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify installation (should list all packages)
pip list

# Initialize database with sample data
# ⚠️ WARNING: This will clear all existing data!
python init_db.py

# Check for success message like:
# "✅ Database initialized successfully!"

# Start backend server (pick one)
python -m uvicorn main:app --reload
# OR
python main.py
```

Server runs at: http://localhost:8000
API Interactive Docs: http://localhost:8000/docs (Swagger UI - try endpoints here!)
Alternative Docs: http://localhost:8000/redoc

### Step 3: Setup Frontend

```bash
# From project root
npm install

# Check .env file - it should have API_URL configured
# .env file example:
# EXPO_PUBLIC_API_URL=http://localhost:8000

# For Android Emulator (if using Android):
# Change localhost to your machine's IP address (e.g., http://192.168.x.x:8000)
# Or use 10.0.2.2 if using Android Studio emulator

# Start Expo
npm start

# Then choose:
# Press 'i' for iOS (http://localhost:8000 works)
# Press 'a' for Android (use machine IP or 10.0.2.2)
# Press 'w' for Web (http://localhost:8000 works)
```

## API Usage

### Authentication

1. **Register:**
```bash
POST http://localhost:8000/api/users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

2. **Login with Sample Data:**
```bash
POST http://localhost:8000/api/users/login
{
  "email": "admin@3j.com",
  "password": "admin123"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": { 
    "id": 1, 
    "name": "Admin User", 
    "email": "admin@3j.com", 
    "role": "admin" 
  }
}
```

**Test Login Accounts:**
- Admin: `admin@3j.com` / `admin123`
- Client: `client@company.com` / `client123`
- Employee: `john@3j.com` / `password123`

### Token Storage

The app automatically:
1. Stores token in AsyncStorage after login
2. Includes token in all subsequent requests
3. Clears token on logout

### Using Stores in Components

```typescript
import { useProjectStore } from '@/src/store/projectStore';
import { useEffect } from 'react';

export function ProjectList() {
  const { projects, isLoading, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <FlatList
      data={projects}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
}
```

## Sample Data

After running `python init_db.py`, the database includes:

**Users:**
- admin@3j.com / admin123 (Admin role)
- client@company.com / client123 (Client role)
- john@3j.com / password123 (Employee - Senior Developer)
- jane@3j.com / password123 (Employee - Project Manager)
- mike@3j.com / password123 (Employee - Designer)
- sarah@3j.com / password123 (Employee - QA Engineer)

**Projects:**
- Website Redesign (In Progress)
- Mobile App (Planning)
- Cloud Migration (Planning)

**Leads:**
- Tech Startup Inc (New)
- Fortune 500 Corp (Contacted)
- Growth Company Ltd (Qualified)

## Migration from Mock Data

### Before (Mock Data):
```typescript
import { MOCK_PROJECTS } from '@/src/data/mockData';

export function Dashboard() {
  return <ProjectList projects={MOCK_PROJECTS} />;
}
```

### After (API):
```typescript
import { useProjectStore } from '@/src/store/projectStore';

export function Dashboard() {
  const { projects, fetchProjects } = useProjectStore();
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  return <ProjectList projects={projects} />;
}
```

## Troubleshooting

### API Connection Issues

**For Android Emulator:**
- Default: `http://10.0.2.2:8000` (special mapping for emulator)
- Or use your machine IP: `http://192.168.x.x:8000`
- Update `EXPO_PUBLIC_API_URL` in `.env` file

**For iOS Simulator:**
- Use: `http://localhost:8000` (simulator can access host localhost)

**For Web:**
- Use: `http://localhost:8000` (runs in browser on same machine)

### "Connection refused" error
- Ensure PostgreSQL is running: `docker-compose ps`
- Ensure backend is running: `python -m uvicorn main:app --reload`
- Check DATABASE_URL in `.env` is correct
- Verify API URL in frontend `.env` matches your setup
- Docker: `docker-compose logs postgres` to check database logs

### "Token expired" 401 error
- Token expired, user must re-login
- Token stored in AsyncStorage
- Check if API is running and accessible

### CORS errors
- Backend has CORS enabled for all origins
- For production, update allowed origins in `main.py`

### "Module not found" errors
- Run `npm install` to install dependencies
- Run `pip install -r requirements.txt` for backend
- Ensure you activated the Python virtual environment

### Backend won't start (Windows PowerShell)
- If venv activation fails, try: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Then: `.\venv\Scripts\Activate.ps1`
- Or use Git Bash instead of PowerShell

### Frontend blank screen
- Check browser console for errors (`npm start` → `w` for web)
- Verify backend is running: `http://localhost:8000/health`
- Check EXPO_PUBLIC_API_URL in `.env` file

### Database already initialized
- Delete data: `python init_db.py` (will clear and reinitialize)
- Or access PgAdmin at `http://localhost:5050` to manually manage

## Development Workflow

### Adding a New Feature

1. **Backend API:**
   - Create model in `app/models/`
   - Create schema in `app/schemas/`
   - Create routes in `app/routes/`
   - Include router in `main.py`

2. **Frontend Integration:**
   - Create API service in `src/api/`
   - Create Zustand store in `src/store/`
   - Use store in components

3. **Example - New "Feedback" feature:**

   Backend models/feedback.py:
   ```python
   class Feedback(Base):
       __tablename__ = "feedback"
       id = Column(Integer, primary_key=True)
       content = Column(Text)
       project_id = Column(Integer, ForeignKey("projects.id"))
   ```

   Frontend src/api/feedbackService.ts:
   ```typescript
   export const feedbackService = {
     getFeedback: async () => apiClient.get('/api/feedback/'),
     createFeedback: async (data) => apiClient.post('/api/feedback/', data),
   };
   ```

## Production Deployment

### Backend (Heroku Example)

```bash
# Add Procfile
echo "web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app" > Procfile

# Deploy to Heroku
heroku create 3j-api
heroku config:set DATABASE_URL=postgresql://...
git push heroku main
```

### Frontend (Expo Managed)

```bash
eas build --platform all
eas submit --platform all
```

## Database Backups

```bash
# Backup
pg_dump 3j_db > backup.sql

# Restore
psql 3j_db < backup.sql
```

## Important Files

- **`.env` (Frontend)** - API URL configuration (don't commit if it has secrets)
- **`backend/.env`** - Database credentials and JWT secret (⚠️ NEVER commit to Git!)
- **`.gitignore`** - Prevents committing sensitive files (automatically configured)

- [ ] PostgreSQL running: `docker-compose ps` shows containers as "healthy"
- [ ] Backend started: Can access `http://localhost:8000/health` (returns `{"status": "healthy"}`)
- [ ] API docs accessible: `http://localhost:8000/docs` loads Swagger UI
- [ ] Database initialized: Can login with `admin@3j.com / admin123`
- [ ] Frontend starts: `npm start` shows Expo menu
- [ ] Frontend connects: Can login without connection errors
- [ ] Sample data loaded: Can see projects and leads in the app after login

---

1. Add database indexes on frequently queried fields
2. Implement pagination for large datasets
3. Use caching for static data
4. Optimize API queries with eager loading

## Security Checklist

**Before Production Deployment:**

- [ ] **Change SECRET_KEY** in `backend/.env` (currently: "your-super-secret-key-change-this-in-production")
- [ ] **Use HTTPS** - Update API URLs from `http://` to `https://` in production
- [ ] **Restrict CORS** - Update `allow_origins=["*"]` in `backend/main.py` to specific frontend domain(s)
- [ ] **Environment Variables** - Never commit `.env` files to Git (already in `.gitignore`)
- [ ] **Validate All Inputs** - Backend validates all Pydantic models (✅ already done)
- [ ] **Implement Rate Limiting** - Add rate limiting middleware for API endpoints
- [ ] **Add Refresh Token** - Implement refresh token mechanism (currently: 30-min expiry only)
- [ ] **Use Secure Storage** - Frontend uses `expo-secure-store` for sensitive data (✅ already configured)
- [ ] **Password Hashing** - All passwords hashed with bcrypt (✅ already done)
- [ ] **Logging & Monitoring** - Add logging for auth attempts and errors
- [ ] **Disable Debug Mode** - Set `reload=False` in production for Uvicorn

## Next Steps

1. ✅ Backend API with FastAPI - **COMPLETE**
2. ✅ PostgreSQL Database - **COMPLETE**
3. ✅ React Native Frontend Integration - **COMPLETE**
4. ✅ Authentication system (JWT + bcrypt) - **COMPLETE**
5. ✅ Sample data initialization - **COMPLETE**
6. → Customize design and branding
7. → Add more features (notifications, real-time updates, etc.)
8. → Implement comprehensive error handling UI
9. → Test on physical devices and multiple platforms
10. → Performance optimization and profiling
11. → Deploy to production (Heroku for backend, App Store/Play Store for frontend)

---

## Getting Help

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Expo Docs**: https://docs.expo.dev/versions/v56.0.0/
- **React Native**: https://reactnative.dev/
- **Zustand**: https://zustand.surge.sh/
- **SQLAlchemy**: https://docs.sqlalchemy.org/

---

## Version Info

- Expo: ~56.0.8
- React Native: 0.85.3
- React: 19.2.3
- FastAPI: 0.136.3
- SQLAlchemy: 2.0.50
- PostgreSQL: 15 (Docker)
- Node.js: 18+ (recommended)
- Python: 3.10+ (3.9 may have issues)
