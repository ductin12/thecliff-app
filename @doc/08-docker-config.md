# DOCKER CONFIGURATION

## 1. Overview

Docker configuration for The Cliff Resort PWA enables consistent deployments across environments and easy management with Arcane.

---

## 2. Docker Files

### 2.1 Production Dockerfile

```dockerfile
# Dockerfile
# Multi-stage build for optimized production image

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:18-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production

# ============================================
# Stage 2: Builder
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for Next.js public env vars
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_GA_ID

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# ============================================
# Stage 3: Runner
# ============================================
FROM node:18-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set correct permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy build output (standalone mode)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]
```

### 2.2 Development Dockerfile

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]
```

---

## 3. Docker Compose Files

### 3.1 Production Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  thecliff-app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-https://app.thecliffresort.com.vn}
        - NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME:-The Cliff Resort Services}
        - NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}
    container_name: thecliff-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - WIFI_SSID=${WIFI_SSID}
      - WIFI_PASSWORD=${WIFI_PASSWORD}
    networks:
      - thecliff-network
    labels:
      - "arcane.app=thecliff-app"
      - "arcane.port=3000"

networks:
  thecliff-network:
    driver: bridge
```

### 3.2 Development Docker Compose

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  thecliff-app-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: thecliff-app-dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - WIFI_SSID=TheCliffResort_Guest
      - WIFI_PASSWORD=TestPassword
    stdin_open: true
    tty: true
```

### 3.3 Full Stack Docker Compose (with Nginx)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  thecliff-app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
        - NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}
    container_name: thecliff-app
    restart: unless-stopped
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
      - WIFI_SSID=${WIFI_SSID}
      - WIFI_PASSWORD=${WIFI_PASSWORD}
    networks:
      - thecliff-network
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  nginx:
    image: nginx:1.25-alpine
    container_name: thecliff-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      thecliff-app:
        condition: service_healthy
    networks:
      - thecliff-network

networks:
  thecliff-network:
    driver: bridge
```

---

## 4. Nginx Configuration

### 4.1 nginx.conf

```nginx
# nginx/nginx.conf
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_conn_zone $binary_remote_addr zone=addr:10m;

    # Upstream
    upstream thecliff_app {
        server thecliff-app:3000;
        keepalive 32;
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        server_name app.thecliffresort.com.vn;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name app.thecliffresort.com.vn;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:50m;
        ssl_session_tickets off;

        # Modern SSL config
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # HSTS
        add_header Strict-Transport-Security "max-age=63072000" always;

        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";

        # Rate limiting
        limit_req zone=general burst=20 nodelay;
        limit_conn addr 10;

        # Proxy to Next.js app
        location / {
            proxy_pass http://thecliff_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static files caching
        location /_next/static {
            proxy_pass http://thecliff_app;
            proxy_cache_valid 60m;
            add_header Cache-Control "public, max-age=31536000, immutable";
        }

        # Health check endpoint
        location /api/health {
            proxy_pass http://thecliff_app;
            access_log off;
        }
    }
}
```

---

## 5. Next.js Configuration

### 5.1 next.config.js (for Docker)

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Docker
  
  // Image optimization
  images: {
    domains: ['thecliffresort.com.vn'],
    formats: ['image/webp'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
};

module.exports = withPWA(nextConfig);
```

---

## 6. Docker Commands Reference

### 6.1 Build Commands

```bash
# Build production image
docker build -t thecliff-app:latest .

# Build with specific tag
docker build -t thecliff-app:v1.0.0 .

# Build with build args
docker build \
  --build-arg NEXT_PUBLIC_APP_URL=https://app.thecliffresort.com.vn \
  --build-arg NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX \
  -t thecliff-app:latest .

# Build without cache
docker build --no-cache -t thecliff-app:latest .
```

### 6.2 Run Commands

```bash
# Run container
docker run -d -p 3000:3000 --name thecliff-app thecliff-app:latest

# Run with environment file
docker run -d -p 3000:3000 --env-file .env.production --name thecliff-app thecliff-app:latest

# Run with volume mount (for logs)
docker run -d -p 3000:3000 \
  -v $(pwd)/logs:/app/logs \
  --name thecliff-app thecliff-app:latest
```

### 6.3 Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Start with build
docker-compose up -d --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f thecliff-app

# Restart services
docker-compose restart

# Scale (if configured)
docker-compose up -d --scale thecliff-app=3
```

### 6.4 Maintenance Commands

```bash
# View running containers
docker ps

# View container logs
docker logs thecliff-app -f

# Execute command in container
docker exec -it thecliff-app sh

# View container stats
docker stats thecliff-app

# Remove container
docker rm -f thecliff-app

# Remove image
docker rmi thecliff-app:latest

# Prune unused images
docker image prune -a
```

---

## 7. Docker Registry

### 7.1 Push to Registry

```bash
# Tag for registry
docker tag thecliff-app:latest ghcr.io/thecliffresort/thecliff-app:latest

# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Push image
docker push ghcr.io/thecliffresort/thecliff-app:latest
```

### 7.2 Pull from Registry

```bash
# Pull image
docker pull ghcr.io/thecliffresort/thecliff-app:latest

# Run from registry
docker run -d -p 3000:3000 ghcr.io/thecliffresort/thecliff-app:latest
```

---

## 8. Troubleshooting

### 8.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Container exits immediately | Build error | Check `docker logs` |
| Port already in use | Another process | Change port or stop process |
| Permission denied | File ownership | Check Dockerfile USER |
| Memory issues | Container limits | Increase memory limit |
| Slow build | No cache | Use multi-stage builds |

### 8.2 Debug Commands

```bash
# View build logs
docker build -t thecliff-app . 2>&1 | tee build.log

# Inspect container
docker inspect thecliff-app

# View container processes
docker top thecliff-app

# Check health status
docker inspect --format='{{.State.Health.Status}}' thecliff-app
```

---

**Document Version**: 1.0  
**Created**: 2026-02-04  
**Author**: Development Team
