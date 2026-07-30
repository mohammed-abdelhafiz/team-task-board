# Stage 1: Build Frontend
FROM node:22-slim AS frontend-builder
WORKDIR /app
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN npm install --workspace=frontend
COPY frontend/ ./frontend/
RUN npm run build --workspace=frontend

# Stage 2: Build Backend
FROM node:22-slim AS backend-builder
WORKDIR /app
COPY package.json ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
RUN npm install --workspace=backend
COPY backend/ ./backend/
RUN npm run build --workspace=backend

# Stage 3: Production Runtime
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY package.json ./
COPY backend/package.json ./backend/
RUN npm install --workspace=backend --omit=dev

COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

CMD ["node", "backend/dist/server.js"]

