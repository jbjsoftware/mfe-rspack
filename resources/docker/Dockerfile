# Multi-stage Dockerfile for Nx Module Federation with Rspack

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY .npmrc* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build all applications
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and configuration files
COPY . .

# Build all applications for production (host + all modules)
RUN pnpm nx run-many --target=build --all --parallel=3

# Stage 3: Production runtime with nginx
FROM nginx:alpine AS production

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built applications to nginx html directory
# Host app (main application)
COPY --from=builder /app/dist/src/apps/host /usr/share/nginx/html

# Remote modules under /_mf/ to avoid React Router conflicts  
# Copy all modules to both locations: direct access AND /_mf/ prefix
COPY --from=builder /app/dist/src/modules/ /usr/share/nginx/html/
COPY --from=builder /app/dist/src/modules/ /usr/share/nginx/html/_mf/

# Copy nginx configuration
COPY resources/docker/nginx.conf /etc/nginx/nginx.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp

# Set permissions
RUN chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
