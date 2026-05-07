# TaskFlow - Team Task Manager

A production-ready team task management application built with modern web technologies. TaskFlow enables teams to collaborate on projects, manage tasks, and track progress with role-based access control.

![TaskFlow Dashboard](https://img.shields.io/badge/status-production-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

### Authentication & Authorization
- JWT-based authentication with secure HTTP-only tokens
- Role-based access control (Admin & Member roles)
- Protected routes with automatic redirect
- Password hashing with bcrypt

### Project Management
- Create, edit, and delete projects (Admin)
- Add and remove team members
- View assigned projects with member avatars
- Project search and filtering

### Task Management
- Create tasks with descriptions, due dates, and assignments
- Kanban board and list views
- Quick status updates (To Do → In Progress → Completed)
- Task filtering by project, status, and overdue
- Search tasks by title
- Visual overdue indicators

### Dashboard
- Real-time statistics (Total, Completed, Pending, Overdue)
- Task status distribution with progress bars
- Project workload visualization
- Recent activity feed
- Completion rate tracking

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Clean, modern interface with smooth animations
- Skeleton loading states
- Toast notifications
- Keyboard shortcuts (Ctrl+K for search)
- Accessible modals with focus trapping

## Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for utility-first styling
- **React Router v6** for client-side routing
- **Axios** for HTTP requests
- **date-fns** for date formatting
- **react-hot-toast** for notifications

### Backend
- **Node.js** with **Express.js**
- **MySQL** database with **mysql2** driver
- **JWT** (jsonwebtoken) for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **express-rate-limit** for API protection

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Railway MySQL

## Project Structure
team-task-manager/
├── client/ # React frontend
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ │ ├── common/ # Button, Input, Modal, Badge, etc.
│ │ │ ├── layout/ # Sidebar, Header, MainLayout
│ │ │ ├── dashboard/ # StatsCard, RecentTasks, ProjectOverview
│ │ │ ├── projects/ # ProjectCard, ProjectForm
│ │ │ └── tasks/ # TaskCard, TaskForm, TaskList, TaskFilters
│ │ ├── pages/ # Route pages
│ │ │ ├── auth/ # Login, Signup
│ │ │ ├── dashboard/ # Dashboard
│ │ │ ├── projects/ # Projects
│ │ │ └── tasks/ # Tasks
│ │ ├── context/ # AuthContext, ToastContext
│ │ ├── services/ # API service layer
│ │ ├── utils/ # Helpers, constants
│ │ └── App.jsx # Root component
│ ├── tailwind.config.js
│ └── vite.config.js
├── server/ # Express backend
│ ├── src/
│ │ ├── config/ # Database, environment, CORS
│ │ ├── controllers/ # Route handlers
│ │ ├── middleware/ # Auth, RBAC, validation, errors
│ │ ├── routes/ # API routes
│ │ ├── validators/ # Request validation rules
│ │ └── utils/ # AppError, catchAsync
│ ├── database/
│ │ └── schema.sql # Database schema
│ └── server.js # Entry point
└── README.md

text

## Quick Start

### Prerequisites

- Node.js 18+ 
- MySQL 8+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
2. Setup Database
bash
# Login to MySQL
mysql -u root -p

# Run the schema
source server/database/schema.sql
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
# JWT_SECRET=your_secret_key_change_this

# Start development server
npm run dev
The API will be running at http://localhost:5000

4. Setup Frontend
bash
cd client
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
The app will be running at http://localhost:5173

5. Test the Application
Open http://localhost:5173

Sign up as an admin

Create projects and tasks

Invite team members

API Endpoints
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
Query Parameters for GET /api/tasks
Parameter	Type	Description
projectId	number	Filter by project
status	string	Filter by status (todo, in_progress, completed)
overdue	boolean	Filter overdue tasks
search	string	Search by title
Environment Variables
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
Deployment
See DEPLOYMENT.md for detailed deployment instructions.

Quick Deploy Links
Frontend (Vercel): https://vercel.com/button

Backend (Railway): https://railway.app/button.svg

Demo Credentials
Role	Email	Password
Admin	admin@example.com	password123
Member	john@example.com	password123
License
MIT License - see LICENSE file for details.

Author
Your Name - GitHub

Acknowledgments
React

Tailwind CSS

Express.js

MySQL