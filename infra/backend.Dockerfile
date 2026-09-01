# Base image with Node and PNPM
FROM node:22-alpine AS base
ENV CI=true
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root configurations and backend package file
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY backend/package.json ./backend/

# Install dependencies (including devDependencies for building)
FROM base AS install
RUN pnpm install --filter backend...

# Development stage (runs the app in watch mode)
FROM install AS development
COPY backend/ ./backend/
EXPOSE 3000
CMD ["pnpm", "--filter", "backend", "dev"]

# Build stage
FROM install AS build
COPY backend/ ./backend/
RUN pnpm --filter backend build

# Production stage (only runner, lightweight)
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/node_modules ./backend/node_modules

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "backend/dist/main"]
