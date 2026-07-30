# 🚀 Team Task Board

A production-ready, full-stack collaborative task management monorepo. Authenticated users can create and manage projects, collaborate with team members, and track tasks through interactive Kanban boards (To Do, In Progress, Done) with real-time updates via Socket.IO.

🔗 **Live Demo:** [https://team-task-board.fly.dev/](https://team-task-board.fly.dev/)  
📄 **API Specification:** [openapi.yaml](openapi.yaml)

---

## 🔑 Demo Accounts

The database includes pre-configured demo accounts for evaluating role-based permissions:

| Role | Email | Password | Access Level |
| --- | --- | --- | --- |
| **Admin** | `admin@example.com` | `Admin123!` | Full administrative access, project creation, member management, and task operations |
| **Member** | `member@example.com` | `Member123!` | Standard project collaboration, task creation, status updates, and history tracking |

To re-seed or reset these accounts in your database:
```bash
npm run seed --workspace=backend
```

---

## 🏗️ Architecture Overview

The project is structured as a **single-domain unified monorepo** using **npm workspaces**:

```
team-task-board/
├── backend/                  # Node.js + Express 5 + TypeScript Backend
│   ├── src/
│   │   ├── config/           # DB connection & Socket.IO server configuration
│   │   ├── constants/        # System enums (Roles, Task Status, Priorities)
│   │   ├── controllers/      # Route handler logic (Auth, Projects, Tasks)
│   │   ├── middlewares/      # JWT Authentication, Error Handler, Zod validation
│   │   ├── models/           # Mongoose Data Models (User, Project, Task, AuditLog)
│   │   ├── routes/           # Express router endpoints
│   │   ├── services/         # Business logic layer
│   │   ├── validators/       # Zod schemas for request payload validation
│   │   └── server.ts         # Server entry point with Socket.IO & static frontend host
│   └── tests/                # Automated test suites
├── frontend/                 # React 19 + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── api/              # Axios HTTP client & API service modules
│   │   ├── components/       # UI components (Kanban Board, Task Cards, Dialogs, Sidebar)
│   │   ├── pages/            # View components (Dashboard, Project Detail, Auth)
│   │   ├── store/            # Zustand state management
│   │   └── types/            # Shared TypeScript type definitions
│   └── dist/                 # Compiled static frontend assets
├── openapi.yaml              # OpenAPI 3.0 API Documentation
├── Dockerfile                # Multi-stage production container build definition
├── docker-compose.yml        # Multi-container orchestration (App + MongoDB)
└── package.json              # Monorepo root workspace config & scripts
```

### Data & Authentication Flow
1. **Single-Domain Hosting:** In production, the Express backend serves compiled React assets directly from `frontend/dist` and handles SPA routing fallbacks.
2. **Authentication:** Uses secure `HTTP-Only` JWT cookies (or optional `Authorization: Bearer <token>` headers) with bcrypt password hashing and middleware authorization.
3. **Real-time Synchronization:** Integrated Socket.IO server broadcasts project updates and task status changes instantly across active team sessions.

---

## 🗄️ Database Setup

The backend connects to MongoDB using Mongoose.

### Option A: Local MongoDB
Ensure a MongoDB instance is running locally on port `27017`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/team-task-board
```

### Option B: MongoDB Atlas (Cloud)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Allow network access (`0.0.0.0/0` for cloud deployment).
3. Create a database user and copy your connection string:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/team-task-board?retryWrites=true&w=majority
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js**: v20 or v22+
- **MongoDB**: Local or Atlas Connection String

### Development Mode

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammed-abdelhafiz/team-task-board.git
   cd team-task-board
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Install all dependencies:**
   ```bash
   npm install
   ```

4. **Seed initial demo data:**
   ```bash
   npm run seed --workspace=backend
   ```

5. **Start development servers (Frontend + Backend concurrently):**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 🧪 Testing

The repository includes automated test suites covering authentication, payload validation, and role-based permissions:

```bash
# Run backend test suite
npm test
```

Tests verify:
- User registration and login flow
- Task CRUD operations and state transitions
- Role-based authorization rules (Admin vs Member privileges)

---

## 🐳 Docker Deployment

To build and run the entire stack locally using Docker Compose:

```bash
docker compose up --build
```
Access the application at `http://localhost:5000`.

---

## 📑 API Reference Summary

The complete OpenAPI specification is provided in [openapi.yaml](openapi.yaml).

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Service health status check | No |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate and retrieve session cookie | No |
| `POST` | `/api/auth/logout` | Clear user session cookie | Yes |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Yes |
| `GET` | `/api/projects` | List projects accessible to user | Yes |
| `POST` | `/api/projects` | Create a new project | Yes |
| `GET` | `/api/projects/:id` | Get project details & member list | Yes |
| `PATCH` | `/api/projects/:id` | Update project details (Owner/Admin) | Yes |
| `DELETE` | `/api/projects/:id` | Delete project and tasks (Owner/Admin) | Yes |
| `POST` | `/api/projects/:id/members` | Add project member | Yes |
| `DELETE` | `/api/projects/:id/members/:userId` | Remove project member | Yes |
| `GET` | `/api/projects/:id/tasks` | Filter & list project tasks | Yes |
| `POST` | `/api/projects/:id/tasks` | Create a task within project | Yes |
| `PATCH` | `/api/projects/:id/tasks/:taskId` | Update task status, assignee, or details | Yes |
| `DELETE` | `/api/projects/:id/tasks/:taskId` | Delete a task | Yes |

---

## 🛠️ Monorepo Scripts Reference

| Command | Workspace | Description |
| --- | --- | --- |
| `npm run dev` | Root | Run frontend & backend in parallel for development |
| `npm run build` | Root | Compile React frontend and TypeScript backend |
| `npm start` | Root | Run production server serving unified application |
| `npm test` | Root | Execute backend automated test suite |
| `npm run seed` | Backend | Seed database with demo accounts & sample data |
| `npm run check` | Backend | Run TypeScript type checks on backend |
| `npm run lint` | Frontend | Run ESLint checks on frontend |
