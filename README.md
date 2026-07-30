# Team Task Board

A production-minded full-stack task board monorepo for teams. Authenticated users can manage projects, collaborate with project members, and create and track tasks through To Do, In Progress, and Done.

## Stack and Architecture

- **Monorepo:** npm workspaces (`frontend`, `backend`).
- **Frontend:** React, TypeScript, Vite, TanStack Query, Zustand, Tailwind CSS.
- **Backend:** Express 5, TypeScript, MongoDB/Mongoose, Socket.IO, Zod validation.
- **Single-Domain Deployment:** The Express backend serves static React production assets (`frontend/dist`) and handles SPA fallback routing under the same origin.
- **Authentication:** HTTP-only JWT cookie, bcrypt password hashing, route middleware.

## Quick Start (Monorepo)

Prerequisites: Node.js 20+ and a running MongoDB instance.

### Development Mode

1. Copy `.env.example` to `.env` (or configure `backend/.env`):
   ```bash
   cp .env.example .env
   ```
2. Install monorepo dependencies:
   ```bash
   npm install
   ```
3. Seed demo data (optional):
   ```bash
   npm run seed --workspace=backend
   ```
4. Start both frontend and backend concurrently in development mode:
   ```bash
   npm run dev
   ```

### Production Single-Domain Build & Run

Build both the React frontend and Express backend, then start the unified server:

```bash
# Build frontend and backend
npm run build

# Start the unified server on port 5000 serving both API and Frontend
npm start
```
Open `http://localhost:5000` in your browser. Both the React UI and API routes (`/api/*`) are served from the same domain.

### Single-Container Docker Deployment

Start MongoDB and the single-domain monorepo application container:

```bash
docker compose up --build
```
Access the application at `http://localhost:5000`.

## Demo Accounts

Run `npm run seed --workspace=backend` to create or refresh:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@example.com | Admin123! |
| Member | member@example.com | Member123! |

## Monorepo Commands

| Location | Command | Purpose |
| --- | --- | --- |
| Root | `npm run build` | Build both React frontend and Express backend |
| Root | `npm start` | Start production server serving API + Frontend |
| Root | `npm run dev` | Run frontend & backend in parallel for development |
| Root | `npm test` | Run backend validation & permission test suite |
| backend | `npm run seed` | Seed database with demo accounts & project data |
| backend | `npm run check` | Type-check backend TypeScript |
| frontend | `npm run lint` | Run ESLint checks on frontend |

## API Overview

The complete machine-readable API description is in [openapi.yaml](openapi.yaml).

All project and task routes require authentication. Send the session cookie (browser) or an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | API health check |
| POST | `/api/auth/register` | Create a member account |
| POST | `/api/auth/login` | Start a session |
| POST | `/api/auth/logout` | End a session |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/projects` | List accessible projects / create a project |
| GET/PATCH/DELETE | `/api/projects/:projectId` | Read, update, or delete a project |
| POST | `/api/projects/:projectId/members` | Add a member (owner/Admin) |
| DELETE | `/api/projects/:projectId/members/:userId` | Remove a member (owner/Admin) |
| GET/POST | `/api/projects/:projectId/tasks` | Filter/list tasks or create one |
| GET/PATCH/DELETE | `/api/projects/:projectId/tasks/:taskId` | Read, update, or delete a task |

## Environment Variables

`.env.example` documents all required configuration including optional `FRONTEND_DIST_PATH` overrides.
