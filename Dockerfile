# Use specific version for reproducibility and security
FROM node:18-alpine AS base

# Create a non-root user and group
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs client/package*.json ./client/
COPY --chown=nodejs:nodejs server/package*.json ./server/

# Install dependencies as root (needed for some packages)
RUN npm ci --only=production=false && \
    cd client && npm ci --only=production=false && \
    cd ../server && npm ci --only=production=false

# Copy source code with proper ownership
COPY --chown=nodejs:nodejs . .

# Development stage
FROM base AS development

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start application
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production

# Build the application
RUN cd client && npm run build && \
    cd ../server && npm run build

# Remove dev dependencies
RUN npm ci --only=production && \
    cd client && npm ci --only=production && \
    cd ../server && npm ci --only=production

# Switch to non-root user
USER nodejs

# Expose ports
EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start production server
CMD ["npm", "start"]
