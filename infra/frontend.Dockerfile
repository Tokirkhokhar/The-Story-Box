# Base image with Node and PNPM
FROM node:22-alpine AS base
ENV CI=true
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root configurations and frontend package file
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY frontend/package.json ./frontend/

# Install dependencies
FROM base AS install
RUN pnpm install --filter frontend...

# Development stage (runs vite dev server)
FROM install AS development
COPY frontend/ ./frontend/
EXPOSE 5173
CMD ["pnpm", "--filter", "frontend", "dev", "--host"]

# Build stage
FROM install AS build
COPY frontend/ ./frontend/
RUN pnpm --filter frontend build

# Production stage using Nginx to serve static content
FROM nginx:alpine AS runner
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
