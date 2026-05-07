
# TaskFlow - Team Task Manager

A full-stack team task management application with role-based access control, real-time dashboard, and modern UI.

![Status](https://img.shields.io/badge/status-production-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [Vercel](https://team-task-manager-ruby-eight.vercel.app) |
| **Backend API** | [Render](https://team-task-manager-kpws.onrender.com/api) |
| **Database** | Railway MySQL |

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure password hashing (bcrypt)
- Role-based access control (Admin & Member roles)
- Protected routes with automatic token verification
- Persistent login with local storage

### 📊 Dashboard
- Real-time statistics: Total, Completed, Pending, Overdue tasks
- Task status distribution with progress bars
- Project workload visualization
- Recent activity feed
- Completion rate tracking

### 📁 Project Management
- Create, edit, and delete projects (Admin)
- Add and remove team members
- Member avatars with color coding
- Project search and filtering
- Project detail view

### ✅ Task Management
- Create tasks with title, description, due dates, and assignments
- Kanban board and list views
- Quick status updates (To Do → In Progress → Completed)
- Filter tasks by project, status, and overdue
- Search tasks by title
- Visual overdue indicators with color coding
- Task assignment to team members

### 🎨 User Interface
- Clean, modern design with consistent styling
- Responsive layout (mobile, tablet, desktop)
- Skeleton loading states
- Toast notifications for actions
- Keyboard shortcut (Ctrl+K for search)
- Smooth animations and transitions
- Hover-reveal action buttons

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **date-fns** - Date formatting
- **react-hot-toast** - Toast notifications

### Backend
- **Node.js** with Express.js
- **MySQL** database with mysql2 driver
- **JWT** (jsonwebtoken) - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - API rate limiting
- **morgan** - HTTP request logging

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Railway MySQL

## 📁 Project Structure
team-task-manager/
├── client/ # React Frontend
│ ├── public/
│ │ └── favicon.svg
│ ├── src/
│ │ ├── components/
│ │ │ ├── common/ # Button, Input, Modal, Badge, Spinner, SearchBar
│ │ │ ├── layout/ # Sidebar, Header, MainLayout
│ │ │ ├── dashboard/ # StatsCard, RecentTasks, ProjectOverview
│ │ │ ├── projects/ # ProjectCard, ProjectForm
│ │ │ └── tasks/ # TaskCard, TaskForm, TaskList, TaskFilters
│ │ ├── pages/
│ │ │ ├── auth/ # LoginPage, SignupPage
│ │ │ ├── dashboard/ # DashboardPage
│ │ │ ├── projects/ # ProjectsPage
│ │ │ └── tasks/ # TasksPage
│ │ ├── context/ # AuthContext
│ │ ├── services/ # API service layer
│ │ ├── utils/ # Helpers, constants
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── tailwind.config.js
│ ├── vite.config.js
│ └── package.json
│
├── server/ # Express Backend
│ ├── src/
│ │ ├── config/ # Database, environment, CORS
│ │ ├── controllers/ # Auth, project, task, dashboard controllers
│ │ ├── middleware/ # Auth, RBAC, validation, error handler
│ │ ├── routes/ # API route definitions
│ │ ├── validators/ # Request validation rules
│ │ └── utils/ # AppError, catchAsync
│ ├── database/
│ │ └── schema.sql # Database schema
│ ├── server.js # Entry point
│ └── package.json
│
├── .gitignore
├── LICENSE
└── README.md

text

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/sunnyvarun/team-task-manager.git
cd team-task-manager
2. Setup Database
bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS team_task_manager;
USE team_task_manager;

# Run schema
source server/database/schema.sql;
exit;
3. Setup Backend
bash
cd server
npm install

# Create environment file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=team_task_manager
# DB_PORT=3306
# JWT_SECRET=your_secret_key

# Start development server
npm run dev
API runs at: http://localhost:5000

4. Setup Frontend
bash
cd client
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
App runs at: http://localhost:5173

5. Test
Open http://localhost:5173

Sign up as admin

Create projects and tasks

Invite team members

📡 API Endpoints
Authentication
Method	Endpoint	Description	Access
POST	/api/auth/signup	Create account	Public
POST	/api/auth/login	Login	Public
GET	/api/auth/me	Get current user	Private
GET	/api/auth/users	Get all users	Private
Projects
Method	Endpoint	Description	Access
GET	/api/projects	Get all projects	Private
GET	/api/projects/:id	Get project by ID	Private
POST	/api/projects	Create project	Admin
PUT	/api/projects/:id	Update project	Admin
DELETE	/api/projects/:id	Delete project	Admin
POST	/api/projects/:id/members	Add member	Admin
DELETE	/api/projects/:id/members/:userId	Remove member	Admin
Tasks
Method	Endpoint	Description	Access
GET	/api/tasks	Get tasks (with filters)	Private
GET	/api/tasks/:id	Get task by ID	Private
POST	/api/tasks	Create task	Private
PUT	/api/tasks/:id	Update task	Private
DELETE	/api/tasks/:id	Delete task	Admin
Dashboard
Method	Endpoint	Description	Access
GET	/api/dashboard	Get dashboard stats	Private
Task Filter Query Parameters
Parameter	Type	Description
projectId	number	Filter by project
status	string	todo, in_progress, completed
overdue	boolean	Show overdue tasks only
search	string	Search by title
🔐 Environment Variables
Backend (server/.env)
env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=team_task_manager
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
Frontend (client/.env)
env
VITE_API_URL=http://localhost:5000/api
🎨 Color Theme
The application uses a modern, professional color palette:

Color	Usage
Brand Blue (#5c7cfa)	Primary actions, active states
Success Green (#40c057)	Completed tasks, success states
Warning Amber (#fcc419)	Pending tasks, warnings
Danger Red (#fa5252)	Overdue tasks, delete actions
Accent Purple (#845ef7)	Secondary accents
Surface Gray (#f8f9fa → #212529)	Backgrounds, text
👥 Demo Credentials
Role	Email	Password
Admin	admin@test.com	password123
Member	member@test.com	password123