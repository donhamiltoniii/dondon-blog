# Multi-stage build for smaller final image
FROM node:22-alpine AS builder

# Add git for any dependencies that need it
RUN apk add --no-cache git

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S portfolio -u 1001

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built application from builder stage
COPY --from=builder --chown=portfolio:nodejs /app/dist ./dist

# Switch to non-root user
USER portfolio

# Expose port
EXPOSE 4321

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4321/ || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "4321"]