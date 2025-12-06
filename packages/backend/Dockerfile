FROM oven/bun:1 AS base
WORKDIR /app

# Copy root workspace files for dependency resolution
COPY package.json bun.lock ./
COPY packages/backend/package.json ./packages/backend/

# Install dependencies
RUN bun install

# Copy backend source code
COPY packages/backend ./packages/backend

WORKDIR /app/packages/backend

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Run the app
CMD ["bun", "run", "src/index.ts"]
