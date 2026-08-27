# theStoryBox Monorepo

Welcome to the **theStoryBox** project! This repository is organized as a monorepo using **pnpm workspaces**.

## Folder Structure

```text
theStoryBox
├── backend/            # NestJS Backend Application
├── frontend/           # React Frontend Application (Vite + TS)
├── infra/              # Dockerfiles and Infrastructure configs
├── docs/               # Architecture & Setup Documentation
│   └── setup-guide.md  # Detailed setup instructions
├── docker-compose.yml  # Local services orchestration
├── package.json        # Workspace scripts
└── pnpm-workspace.yaml # Workspaces definition
```

## Quick Start

### 1. Installation
Install all dependencies across the monorepo workspace:
```bash
pnpm install
```

### 2. Development Mode
Run development servers for both frontend and backend concurrently:
```bash
pnpm dev
```
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Frontend App:** [http://localhost:5173](http://localhost:5173)

### 3. Docker Compose Development
Run everything inside Docker containers:
```bash
docker compose up --build
```

For detailed guides, please refer to [docs/setup-guide.md](file:///Users/tokiralikhokhar/Desktop/Projects/theStoryBox/docs/setup-guide.md).
