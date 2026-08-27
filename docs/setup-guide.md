# Setup and Running Guide

This guide describes how to run and develop in the **theStoryBox** monorepo.

## Tech Stack Overview
- **Monorepo Manager:** `pnpm` Workspaces
- **Backend:** NestJS + TypeScript
- **Frontend:** React + Vite + TypeScript
- **Database:** PostgreSQL
- **Orchestration:** Docker Compose

---

## Local Development (Without Docker)

To run the application locally on your machine, follow these steps:

### 1. Install Dependencies
Run the installation command in the root folder of the project. `pnpm` will automatically install and link dependencies across all workspace projects (backend and frontend).
```bash
pnpm install
```

### 2. Start PostgreSQL Database
You need a running PostgreSQL database. You can start just the database container from the docker-compose configuration:
```bash
docker compose up -d db
```

### 3. Start Development Servers
Run the dev script in the root directory to spin up the NestJS and Vite servers simultaneously:
```bash
pnpm dev
```
- Backend will run at: [http://localhost:3000](http://localhost:3000)
- Frontend will run at: [http://localhost:5173](http://localhost:5173)

---

## Development with Docker Compose (Fully Containerized)

If you prefer to run the entire stack inside containers:

### 1. Build and Run the Stack
Run this command from the root directory:
```bash
docker compose up --build
```

### 2. Hot Reloading
The `docker-compose.yml` mounts local directories into the containers, enabling hot reloading on code changes:
- Any change inside `backend/src` will reload the NestJS server.
- Any change inside `frontend/src` will reload the React frontend.
