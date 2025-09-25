# Multi-stage build for smaller final image
FROM node:22-alpine AS builder
# Add git for any dependencies that need it
RUN apk add --no-cache git
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
# Install all dependencies (including dev dependencies for build)
RUN npm ci --only=production --omit=dev && npm cache clean --force

# Copy source code
COPY . .
# Build the application
RUN npm run build

# Production stage - use distroless or minimal base
FROM gcr.io/distroless/nodejs22-debian12 AS production
# Or alternatively, stick with alpine but don't install serve
# FROM node:22-alpine AS production

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy a minimal package.json for serve
COPY --from=builder /app/package.json ./package.json

# Create a simple server script instead of using serve
COPY <<EOF /app/server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }
  
  const ext = path.extname(filePath);
  const contentType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  }[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(4321, () => console.log('Server running on port 4321'));
EOF

EXPOSE 4321

# Use node directly instead of serve
CMD ["node", "server.js"]