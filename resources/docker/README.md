# Module Federation Deployment Guide

This guide explains how to deploy your Nx Module Federation application using Docker and nginx.

## Architecture Overview

- **Host Application**: Main application served at root path `/`
  - React Router handles client-side routes: `/dashboard` and `/connections`
- **Remote Modules** (Module Federation assets):
  - Dashboard: Served at `/_mf/dashboard/`
  - Connections: Served at `/_mf/connections/`

## Build and Deploy

### 1. Build the Docker Image

```bash
# From the project root
docker build -f resources/docker/Dockerfile -t mfe-rspack-app .
```

### 2. Run the Container

```bash
# Run on port 80
docker run -p 80:80 mfe-rspack-app

# Or run on a different port (e.g., 8080)
docker run -p 8080:80 mfe-rspack-app
```

### 3. Access the Application

- **Main Application**: http://localhost/
- **Client-side routes** (handled by React Router):
  - Dashboard page: http://localhost/dashboard
  - Connections page: http://localhost/connections
- **Health Check**: http://localhost/health

## Module Federation URLs

The remote modules expose their `remoteEntry.js` files at:

- Dashboard: `http://localhost/_mf/dashboard/remoteEntry.js`
- Connections: `http://localhost/_mf/connections/remoteEntry.js`

> **Note**: The `/_mf/` prefix is used to avoid conflicts with React Router's client-side routes.

## Module Federation Configuration

### For Production Deployment

You'll need to update your module federation configuration to use the production URLs. There are several approaches:

#### Option 1: Environment-based Configuration

Update your `module-federation.config.ts` files to use environment variables:

```typescript
// src/apps/host/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'host',
  remotes:
    process.env['NODE_ENV'] === 'production'
      ? [
          ['dashboard', 'http://your-domain.com/_mf/dashboard'],
          ['connections', 'http://your-domain.com/_mf/connections'],
        ]
      : ['dashboard', 'connections'], // Development uses default ports
};

export default config;
```

#### Option 2: Runtime Configuration

Use Module Federation's runtime API to dynamically set remote URLs:

```typescript
// In your bootstrap.tsx or app initialization
import { init } from '@module-federation/enhanced/runtime';

if (process.env['NODE_ENV'] === 'production') {
  init({
    name: 'host',
    remotes: [
      {
        name: 'dashboard',
        entry: '/_mf/dashboard/remoteEntry.js',
      },
      {
        name: 'connections',
        entry: '/_mf/connections/remoteEntry.js',
      },
    ],
  });
}
```

## Production Considerations

### Environment Variables

For production deployment, you may want to set:

```bash
# Build with production optimizations
NODE_ENV=production docker build -f resources/docker/Dockerfile -t mfe-rspack-app .
```

### SSL/TLS

For HTTPS deployment, modify the nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    # ... rest of configuration
}
```

### Scaling

For horizontal scaling, consider:

1. Using a load balancer in front of multiple container instances
2. Serving static assets from a CDN
3. Implementing proper caching strategies

### Monitoring

The container includes:

- Health check endpoint at `/health`
- Nginx access and error logs
- Built-in nginx status monitoring

## Troubleshooting

### Common Issues

1. **CORS Errors**: The nginx configuration includes CORS headers for module federation
2. **Module Loading Failures**: Ensure `publicPath: 'auto'` is set in rspack configs
3. **404 Errors**: Check that all applications built successfully in the Docker build stage

### Debugging

```bash
# Check container logs
docker logs <container-id>

# Access container shell
docker exec -it <container-id> /bin/sh

# Check nginx configuration
docker exec <container-id> nginx -t

# View built files
docker exec <container-id> ls -la /usr/share/nginx/html/
```

## Docker Compose (Optional)

Create a `docker-compose.yml` for easier deployment:

```yaml
version: '3.8'
services:
  mfe-app:
    build:
      context: .
      dockerfile: resources/docker/Dockerfile
    ports:
      - '80:80'
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost/health']
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
```

Then run:

```bash
docker-compose up -d
```
