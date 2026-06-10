# Complete Setup Guide: 3J Business Management Platform

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
- Python 3.9+
- PostgreSQL 12+ (or Docker Desktop)
- VS Code

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

# Activate it
# Windows:
venv\\Scripts\\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database with sample data
python init_db.py

# Start server
python main.py
```

Server runs at: http://localhost:8000
API Docs: http://localhost:8000/docs

### Step 3: Setup Frontend

```bash
# From project root
npm install

# Create .env file (already exists with defaults)
# Update API_URL if needed

# Start Expo
npm start

# Then choose:
# Press 'i' for iOS
# Press 'a' for Android
# Press 'w' for Web
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

2. **Login:**
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
  "user": { "id": 1, "name": "Admin", "email": "admin@3j.com", "role": "admin" }
}
```

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

After running `init_db.py`, the database includes:

**Users:**
- admin@3j.com / admin123 (Admin)
- client@company.com / client123 (Client)
- 4 Employees with password: password123

**Projects:**
- Website Redesign
- Mobile App
- Cloud Migration

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

### "Connection refused" error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Docker: `docker-compose ps` to verify services

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

## Performance Tips

1. Add database indexes on frequently queried fields
2. Implement pagination for large datasets
3. Use caching for static data
4. Optimize API queries with eager loading

## Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Use HTTPS in production
- [ ] Restrict CORS to specific origins
- [ ] Implement rate limiting
- [ ] Validate all inputs on backend
- [ ] Use environment variables for secrets
- [ ] Implement refresh token mechanism
- [ ] Add logging and monitoring

## Next Steps

1. ✓ Backend API with FastAPI
2. ✓ PostgreSQL Database
3. ✓ React Native Frontend Integration
4. → Build authentication screens
5. → Implement data validation
6. → Add error handling UI
7. → Test on physical devices
8. → Deploy to production
