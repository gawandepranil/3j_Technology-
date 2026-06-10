# 3J Technologies - Business Management Platform

A modern, multi-role business management platform built with **Expo React Native** and **FastAPI**, designed to streamline project management, team collaboration, and business development.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Production%20Ready-brightgreen)

---

## 🎯 Overview

**3J Technologies** is an all-in-one business management platform that serves three distinct user types:

- **👥 Clients** - Submit projects, track progress, and communicate with the team
- **👨‍💼 Employees** - Manage projects, submit daily updates, and collaborate
- **🔑 Admins** - Oversee all operations, manage leads, and view analytics

### Key Features

✨ **Multi-Role Access Control** - Different UIs for clients, employees, and admins
🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
📊 **Project Management** - Create, track, and manage projects with requirements
📝 **Daily Updates** - Team members log progress and daily achievements
💼 **Lead Management** - Track sales pipeline and business opportunities
📅 **Meeting Scheduling** - Schedule and manage meetings with clients
📁 **File Management** - Upload and share project files
🔔 **Real-Time Updates** - Keep everyone synchronized
🎨 **Modern UI/UX** - Beautiful dark theme with smooth animations
📱 **Cross-Platform** - iOS, Android, and Web support via Expo

---

## 🏗️ Tech Stack

### Frontend
- **Expo 56.0.8** - Framework for React Native
- **React Native 0.85.3** - Cross-platform mobile UI
- **React 19.2.3** - Latest React version
- **TypeScript 6.0.3** - Type safety
- **Zustand** - State management
- **Axios** - HTTP client
- **Expo Router** - File-based routing
- **React Hook Form** - Form management

### Backend
- **FastAPI 0.136.3** - High-performance Python web framework
- **Uvicorn 0.48.0** - ASGI server
- **SQLAlchemy 2.0.50** - ORM
- **PostgreSQL 15** - Relational database
- **Pydantic 2.13.4** - Data validation
- **JWT (python-jose)** - Authentication
- **Bcrypt** - Password hashing

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **PostgreSQL** - Primary database
- **PgAdmin** - Database management UI
- **EAS (Expo Application Services)** - Mobile app build & deployment

---

## 📋 Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **Docker Desktop** or PostgreSQL 12+
- **Git**
- **Expo CLI** (installed via npm)
- **VS Code** (recommended)

---

## ⚡ Quick Start (5 Minutes)

### 1. Clone Repository
```bash
git clone https://github.com/gawandepranil/3j_Technology-.git
cd 3j
```

### 2. Start Database
```bash
docker-compose up -d
```

### 3. Setup Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python init_db.py
python -m uvicorn main:app --reload
```

Backend runs at: http://localhost:8000

### 4. Setup Frontend (New Terminal)
```bash
npm install
npm start

# Choose platform:
# i = iOS
# a = Android
# w = Web
```

### 5. Login with Demo Account
```
Email: admin@3j.com
Password: admin123
```

---

## 📚 Project Structure

```
3j/
├── backend/                          # FastAPI backend
│   ├── app/
│   │   ├── models/                  # SQLAlchemy models
│   │   ├── routes/                  # API endpoints
│   │   ├── schemas/                 # Pydantic schemas
│   │   └── database/                # Database config
│   ├── main.py                      # FastAPI app
│   ├── init_db.py                   # Database initialization
│   └── requirements.txt             # Python dependencies
│
├── src/                              # Frontend source
│   ├── api/                         # HTTP services
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   └── ... (other services)
│   │
│   ├── store/                       # Zustand stores
│   │   ├── authStore.ts
│   │   ├── projectStore.ts
│   │   └── ... (other stores)
│   │
│   ├── components/ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ... (other components)
│   │
│   ├── theme/                       # Design system
│   │   └── tokens.ts
│   │
│   └── types/                       # TypeScript types
│
├── app/                              # Screens (Expo Router)
│   ├── _layout.tsx                  # Navigation setup
│   ├── (auth)/                      # Auth screens
│   ├── (client)/                    # Client portal
│   ├── (internal)/                  # Employee/Admin portal
│   └── ...
│
├── package.json                     # Frontend dependencies
├── app.json                         # Expo configuration
├── eas.json                         # EAS build config
├── tsconfig.json                    # TypeScript config
├── docker-compose.yml               # Docker services
└── README.md                        # This file
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - Create new account
- `POST /api/users/login` - Login & get JWT token
- `GET /api/users/` - List all users
- `GET /api/users/{id}` - Get user details

### Projects
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Employees
- `GET /api/employees/` - List employees
- `POST /api/employees/` - Add employee

### Leads
- `GET /api/leads/` - List sales leads
- `POST /api/leads/` - Create lead

### Meetings
- `GET /api/meetings/` - List meetings
- `POST /api/meetings/` - Schedule meeting

### Daily Updates
- `GET /api/daily-updates/` - Get team updates
- `POST /api/daily-updates/` - Submit update

### Requirements
- `GET /api/requirements/` - List requirements
- `POST /api/requirements/` - Create requirement

**Full API Documentation:** http://localhost:8000/docs (Swagger UI)

---

## 👥 Sample Users

After running `python init_db.py`:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| admin@3j.com | admin123 | Admin | Full system access |
| client@company.com | client123 | Client | Client portal access |
| john@3j.com | password123 | Employee | Team member |
| jane@3j.com | password123 | Employee | Team member |
| mike@3j.com | password123 | Employee | Team member |
| sarah@3j.com | password123 | Employee | Team member |

---

## 🎨 UI/UX

### Design System
- **Color Scheme**: Dark theme with amber accents
- **Primary Color**: `#eab308` (Amber)
- **Components**: 10+ reusable React Native components
- **Responsive**: Optimized for all screen sizes
- **Animations**: Smooth transitions and interactions

### Navigation
- **Expo Router**: File-based routing (Next.js style)
- **Role-Based UI**: Automatic layout switching based on user role
- **Bottom Tab Navigation**: Quick access to main features
- **Stack Navigation**: Natural screen transitions

---

## 🔐 Authentication & Security

### How Authentication Works

1. User logs in with email/password
2. Backend validates credentials and generates JWT token
3. Token stored in `AsyncStorage` (encrypted on device)
4. Token included in all subsequent API requests
5. Backend verifies token signature on each request
6. Expired token triggers automatic logout

### Security Features

✅ **JWT Tokens** - Stateless, secure authentication
✅ **Bcrypt Hashing** - Industry-standard password hashing
✅ **Token Expiry** - 30-minute token expiration
✅ **HTTPS Ready** - Production-ready SSL/TLS support
✅ **Input Validation** - Pydantic validation on backend
✅ **Secure Storage** - Tokens in encrypted AsyncStorage
✅ **CORS Protection** - Configurable cross-origin requests

---

## 📊 Database Schema

### Users
```
- id (PK)
- name
- email (unique)
- password (bcrypt hashed)
- role (admin|employee|client)
- created_at, updated_at
```

### Employees
```
- id (PK)
- name
- designation
- department
- user_id (FK → Users)
- created_at, updated_at
```

### Projects
```
- id (PK)
- title
- description
- status (planning|in_progress|on_hold|completed)
- client_id (FK → Users)
- created_at, updated_at
```

### Leads
```
- id (PK)
- company
- contact_name, contact_email, contact_phone
- status (new|contacted|qualified|proposal_sent|negotiation|won|lost)
- notes
- created_at, updated_at
```

### Meetings
```
- id (PK)
- title, description
- date
- project_id (FK → Projects)
- attendees (N:N relationship)
- created_at, updated_at
```

### DailyUpdates
```
- id (PK)
- content
- employee_id (FK → Employees)
- date
- created_at, updated_at
```

### Requirements
```
- id (PK)
- description
- project_id (FK → Projects)
- status
- created_at, updated_at
```

---

## 🚀 Development Workflow

### Adding a New Feature

1. **Backend**
   - Create SQLAlchemy model in `app/models/`
   - Create Pydantic schema in `app/schemas/`
   - Create routes in `app/routes/`
   - Register router in `main.py`

2. **Frontend**
   - Create API service in `src/api/`
   - Create Zustand store in `src/store/`
   - Build UI components
   - Integrate with store hooks

3. **Testing**
   - Test API in Swagger UI (http://localhost:8000/docs)
   - Test frontend login flow
   - Verify data persistence

### Environment Setup

**Backend `.env`**
```
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/3j_db
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend `.env`**
```
EXPO_PUBLIC_API_URL=http://localhost:8000
```

---

## 🐛 Troubleshooting

### Backend Connection Issues
```bash
# Verify PostgreSQL is running
docker-compose ps

# Check backend health
curl http://localhost:8000/health

# View logs
docker-compose logs postgres
docker-compose logs pgadmin
```

### Frontend Won't Connect
- Check API URL in `.env` file
- Android Emulator: Use `10.0.2.2:8000` instead of `localhost`
- iOS Simulator: Use `localhost:8000`
- Web: Use `localhost:8000`

### Database Already Initialized
```bash
# Reinitialize database (clears all data)
python init_db.py

# Or use PgAdmin UI: http://localhost:5050
```

### Module Not Found
```bash
npm install              # Frontend
pip install -r requirements.txt  # Backend
```

---

## 📱 Platform-Specific Notes

### Android
- API URL: `http://10.0.2.2:8000` (Android emulator special IP)
- Or use your machine IP: `http://192.168.x.x:8000`
- Requires internet permission (configured in `app.json`)

### iOS
- API URL: `http://localhost:8000`
- Works directly with host machine
- Requires development team certificate for physical testing

### Web
- API URL: `http://localhost:8000`
- Runs in browser
- Full feature parity with mobile versions

---

## 🚀 Production Deployment

### Backend (Heroku)

```bash
# Create Procfile
echo "web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app" > Procfile

# Deploy
heroku create your-app-name
heroku config:set DATABASE_URL=postgresql://...
git push heroku main
```

### Frontend (Expo)

```bash
# Build for all platforms
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### Security Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Update CORS to specific domain
- [ ] Enable HTTPS
- [ ] Implement rate limiting
- [ ] Add monitoring & logging
- [ ] Implement refresh tokens
- [ ] Regular security audits

---

## 📚 Documentation

- [Full Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [Project Documentation](./PROJECT_DOCUMENTATION.md) - Complete architecture overview
- [Backend README](./backend/README.md) - Backend-specific docs
- [API Swagger](http://localhost:8000/docs) - Interactive API docs (when running)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Pranil Gawande**
- GitHub: [@gawandepranil](https://github.com/gawandepranil)
- Project: [3J Technologies](https://github.com/gawandepranil/3j_Technology-)

---

## 🎓 Learning Resources

- [Expo Documentation](https://docs.expo.dev/versions/v56.0.0/)
- [React Native Guide](https://reactnative.dev/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://zustand.surge.sh/)

---

## 📞 Support

Need help? Check out these resources:

- 📖 [Setup Guide](./SETUP_GUIDE.md)
- 📋 [Full Documentation](./PROJECT_DOCUMENTATION.md)
- 🐛 [GitHub Issues](https://github.com/gawandepranil/3j_Technology-/issues)
- 💬 [Discussions](https://github.com/gawandepranil/3j_Technology-/discussions)

---

## 🎉 Features Roadmap

### Current ✅
- Multi-role authentication
- Project management
- Daily updates system
- Lead tracking
- Meeting scheduling
- File management
- Responsive UI

### Upcoming 🔄
- Real-time notifications
- Team chat/messaging
- Video conferencing integration
- Advanced analytics
- Mobile app store deployment
- Performance optimization
- Internationalization (i18n)

---

## 📊 Project Stats

- **Frontend**: 3000+ lines of TypeScript/React Native
- **Backend**: 1500+ lines of Python/FastAPI
- **Database**: 7 core models with relationships
- **API Endpoints**: 20+ RESTful endpoints
- **UI Components**: 15+ reusable components
- **Platforms**: iOS, Android, Web

---

**Made with ❤️ for 3J Technologies**

Last Updated: June 2026
