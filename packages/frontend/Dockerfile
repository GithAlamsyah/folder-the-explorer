FROM oven/bun:1 AS base
WORKDIR /app

# Copy root workspace files for dependency resolution
COPY package.json bun.lock ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# Install dependencies
RUN bun install

# Copy source code (backend needed for workspace type resolution)
COPY packages/backend ./packages/backend
COPY packages/frontend ./packages/frontend

WORKDIR /app/packages/frontend

# Build the frontend
RUN bun run build

# Production stage with nginx
FROM nginx:alpine AS production
COPY --from=base /app/packages/frontend/dist /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
