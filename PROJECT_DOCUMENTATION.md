# 3J Technologies - Complete Project Documentation

## 📋 Executive Summary

**3J Technologies** is a **multi-role business management platform** built with:
- **Frontend**: Expo React Native (iOS, Android, Web)
- **Backend**: FastAPI + PostgreSQL
- **State Management**: Zustand
- **Architecture**: Microservices-ready with clear separation of concerns

The app serves **three distinct user types**: Clients, Employees, and Admins in a unified interface that adapts based on user role.

---

## 🎯 Core Business Features

### **For Clients**
- View assigned projects and their status
- Submit new project requirements
- Schedule meetings with the 3J team
- Access project files and documentation
- Browse services offered by 3J
- View company mission and values

### **For Employees**
- Manage internal projects
- Submit daily progress updates
- View team dashboard and statistics
- Access employee directory
- Collaborate on project tasks

### **For Admins**
- Manage all projects and employees
- Track sales leads pipeline
- Schedule meetings
- View business analytics
- Full system oversight

---

## 🏗️ Frontend Architecture

### **Navigation Structure**

```
App Root
├── Splash Screen (Loading/Welcome)
├── Landing Page (Public info)
├── Authentication Guard
│   ├── If NOT authenticated → Login/Register
│   └── If authenticated:
│       ├── Client role → Client Dashboard (Tab Nav)
│       ├── Employee role → Internal Dashboard (Tab Nav)
│       └── Admin role → Internal Dashboard (Tab Nav)
```

### **Screen Organization**

| Screen Group | Purpose | Navigation Type |
|---|---|---|
| `/(auth)` | Login & Registration | Stack |
| `/(client)` | Client portal | Tab Navigator |
| `/(internal)` | Employee/Admin portal | Tab Navigator |
| Root | Public pages | Stack |

### **Client Portal Screens** (6 tabs)
1. **Dashboard** - Overview of projects
2. **Projects** - Active projects list
3. **Services** - Browse 3J services
4. **Meetings** - Schedule & view meetings
5. **Files** - Project files management
6. **Contact** - Submit inquiries

### **Internal Portal Screens** (5 tabs)
1. **Dashboard** - Stats & overview
2. **Daily Updates** - Inbox for team updates
3. **Projects** - Project management
4. **Employees** - Team directory
5. **Leads** - Sales pipeline (Admin only)

---

## 🔐 Authentication System

### **Frontend Auth Flow**
```
User Enters Credentials
    ↓
authStore.login(email, password)
    ↓
authService.login() → API call
    ↓
Backend generates JWT Token
    ↓
Frontend stores in AsyncStorage:
  - authToken (JWT)
  - authUser (User object)
    ↓
apiClient.setAuthToken() [adds Bearer token to all requests]
    ↓
User redirected to role-based dashboard
```

### **Auto-Role Assignment (Backend)**
- Email contains `@3j.com`, `.3j.com`, or `3j@` → **EMPLOYEE**
- All other emails → **CLIENT**
- Manual admin role assignment in database

### **Security Features**
- ✅ Password hashing with bcrypt
- ✅ JWT tokens with expiration
- ✅ Secure token storage (AsyncStorage)
- ✅ 401 response handling (auto logout)
- ✅ Protected API endpoints (token verification)

---

## 💾 Backend Architecture

### **Technology Stack**
- **Framework**: FastAPI 0.136.3
- **Server**: Uvicorn (ASGI)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0.50
- **Validation**: Pydantic v2
- **Auth**: JWT + bcrypt

### **Database Models**

**Users**
- `id`, `name`, `email` (unique), `password` (hashed), `role`, `timestamps`
- Roles: admin, employee, client

**Employees**
- `id`, `name`, `designation`, `department`, `user_id` (FK)
- Linked to Users 1:1

**Projects**
- `id`, `title`, `description`, `status`, `client_id`, `timestamps`
- Status: planning, in_progress, on_hold, completed

**Leads**
- `id`, `company`, `contact_name`, `contact_email`, `phone`, `status`, `notes`
- Status: new, contacted, qualified, proposal_sent, negotiation, won, lost

**Meetings**
- `id`, `title`, `description`, `date`, `project_id`, `timestamps`
- Links to Projects (N:1) and Attendees (N:N)

**DailyUpdates**
- `id`, `content`, `employee_id`, `date`, `timestamps`
- Employee progress tracking

**Requirements**
- `id`, `description`, `project_id`, `status`, `timestamps`
- Project specifications/deliverables

### **API Endpoints**

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/users/login` | POST | Get JWT token |
| `/api/users/register` | POST | Create account |
| `/api/users/` | GET | List all users |
| `/api/projects/` | GET, POST | List/create projects |
| `/api/projects/{id}` | GET, PUT, DELETE | Project CRUD |
| `/api/employees/` | GET, POST | Manage team |
| `/api/leads/` | GET, POST | Sales pipeline |
| `/api/meetings/` | GET, POST | Schedule meetings |
| `/api/daily-updates/` | POST | Submit updates |
| `/api/requirements/` | GET, POST | Project requirements |

---

## 🔗 API Integration

### **API Client Setup** (`src/api/apiClient.ts`)

```typescript
// Axios instance with:
- Base URL: http://localhost:8000 (or EXPO_PUBLIC_API_URL)
- Android Emulator mapping: localhost → 10.0.2.2
- Default timeout: 30 seconds
- Headers: Authorization Bearer token
- Response interceptor: Handles 401 errors (logout)
```

### **Service Layer** (`src/api/`)
Each resource has a dedicated service:
- `authService.ts` - Login, register, user info
- `projectService.ts` - Project CRUD
- `employeeService.ts` - Employee directory
- `leadService.ts` - Sales leads
- `meetingService.ts` - Meeting scheduling
- `dailyUpdateService.ts` - Daily progress
- `requirementService.ts` - Project requirements

**Pattern**: All services use axios and return typed responses.

---

## 🎨 State Management (Zustand)

### **Store Pattern**
```typescript
// Example: projectStore.ts
interface ProjectState {
  projects: Project[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProjects: () => Promise<void>
  createProject: (data) => Promise<Project | null>
  updateProject: (id, data) => Promise<Project | null>
  deleteProject: (id) => Promise<void>
}

// Usage in components:
const { projects, isLoading, fetchProjects } = useProjectStore()
```

### **Available Stores**
| Store | Purpose |
|---|---|
| `authStore` | User auth, persistence |
| `projectStore` | Project data & caching |
| `employeeStore` | Employee directory |
| `leadStore` | Sales leads |
| `meetingStore` | Meeting data |
| `dailyUpdateStore` | Daily updates |

---

## 🎨 UI Components & Design System

### **Component Library** (`src/components/ui/`)

**Button.tsx**
- Variants: primary, secondary, ghost, danger
- Sizes: sm, md, lg
- Features: Loading state, icon support, disabled state

**Card.tsx**
- Container with gradient background
- Configurable padding
- Sub-component: SectionTitle

**Input.tsx**
- Label support
- Error states
- Icons (left & right)
- Multiline support

**Other Components**:
- Avatar, Badge, SkillChip, StatCard
- UpdateCard, EmptyState, FileIcon
- ScreenHeader, SearchBar

### **Design Tokens** (`src/theme/tokens.ts`)

**Color Palette** (Dark Theme)
- Primary: `#eab308` (Amber)
- Background: `#070b13` (Near black)
- Surface: `#0f172a` (Dark blue)
- Text: `#F9FAFB` (Off white)
- Status: success, error, warning, info

**Spacing Scale**: xs(4), sm(8), base(16), md(20), lg(24), xl(32), 2xl(40)

**Typography**: Size, weight, lineHeight tokens

**Shadows**: xs, sm, md, lg (for depth)

**Border Radius**: sm, md, lg, xl, full

---

## 📦 Configuration Files

### **app.json** - Expo Configuration
- App metadata (name, version, icon)
- Platform configs (iOS bundle ID, Android package)
- Plugin setup (routing, secure storage)
- EAS project ID

### **package.json** - Frontend Dependencies
```
Key packages:
- expo ~56.0.8
- react-native 0.85.3
- expo-router (file-based routing)
- axios (HTTP client)
- zustand (state management)
- react-hook-form (form management)
- expo-linear-gradient (UI gradients)
```

### **tsconfig.json** - TypeScript Config
- Strict mode enabled
- Path alias: `@/` → `./src/`
- Import example: `import { types } from '@/types'`

### **eas.json** - Build Configuration
- Development builds
- Preview builds
- Production builds for App Store/Play Store

### **docker-compose.yml** - Backend Infrastructure
```yaml
Services:
- PostgreSQL 15 on port 5432
- PgAdmin on port 5050 (database management)
- One-command setup: docker-compose up -d
```

### **backend/requirements.txt** - Python Dependencies
```
FastAPI, Uvicorn, SQLAlchemy, psycopg
Pydantic, python-jose (JWT), bcrypt
python-dotenv (environment variables)
```

---

## 🚀 Development Workflow

### **Local Development Setup**

**1. Start Backend**
```bash
cd backend
docker-compose up -d
python -m uvicorn main:app --reload
```
Backend: http://localhost:8000

**2. Start Frontend**
```bash
npm install
npm start
# Choose platform: a (Android), i (iOS), w (Web)
```

**3. Database Management**
- URL: http://localhost:5050
- Email: admin@example.com
- Password: admin

### **Production Build** (EAS)
```bash
eas build --platform android
eas build --platform ios
eas submit -p production
```

---

## 🔄 Data Flow Example: Creating a Project

```
1. User enters form (title, description, status)
   ↓
2. Submit button → useProjectStore.createProject(data)
   ↓
3. projectService.createProject(data)
   ↓
4. Axios POST /api/projects/ + JWT token in header
   ↓
5. Backend:
   - Validates with Pydantic schema
   - Saves to PostgreSQL
   - Returns created Project object
   ↓
6. Frontend:
   - Store updates optimistically
   - Component re-renders with new project
   ↓
7. Success: Project appears in list
```

---

## ⚙️ Key Technical Decisions

### Why These Choices?

| Choice | Why |
|---|---|
| Zustand | Lightweight, simple state management (vs Redux) |
| Axios | Well-known HTTP client with interceptor support |
| Pydantic | Type validation on backend, auto docs |
| SQLAlchemy | ORM for cleaner database code |
| Expo Router | File-based routing (familiar to Next.js devs) |
| JWT | Stateless auth (scalable) |
| PostgreSQL | Robust, relational data (not NoSQL) |

---

## 🎯 Architecture Strengths

✅ **Clear Separation of Concerns**: UI ↔ State ↔ Services ↔ API ↔ Database

✅ **Type Safety**: Full TypeScript + Pydantic validation

✅ **Scalable Patterns**: Service layer + store pattern reusable

✅ **Consistent Design**: Centralized design tokens

✅ **Production Ready**: Error handling, auth, CORS, Docker setup

✅ **Role-Based UI**: Single app, multiple experiences

✅ **Persistent Auth**: Works offline, restored on restart

---

## 📝 File Structure Summary

```
d:\project\3j\
├── App.tsx                        # Root component
├── app/                           # Screens (Expo Router)
│   ├── _layout.tsx               # Navigation setup
│   ├── (auth)/                   # Auth screens
│   ├── (client)/                 # Client portal
│   └── (internal)/               # Employee/Admin portal
├── src/
│   ├── api/                      # HTTP services
│   ├── components/ui/            # Reusable UI components
│   ├── store/                    # Zustand stores
│   ├── theme/                    # Design tokens
│   └── types/                    # TypeScript types
├── backend/
│   ├── main.py                   # FastAPI app
│   ├── app/
│   │   ├── models/               # SQLAlchemy models
│   │   ├── routes/               # API endpoints
│   │   └── schemas/              # Pydantic schemas
│   └── requirements.txt          # Python dependencies
├── package.json                  # Frontend dependencies
├── app.json                      # Expo config
├── eas.json                      # EAS build config
├── tsconfig.json                 # TypeScript config
└── docker-compose.yml            # Backend infrastructure
```

---

## 🔍 Ready for Questions

I now fully understand:
- ✅ Frontend architecture & navigation
- ✅ Backend API structure & database models
- ✅ Authentication & security
- ✅ State management & data flow
- ✅ UI component system & design tokens
- ✅ Configuration files & deployment
- ✅ Development workflow

**What questions do you have about the project?**
