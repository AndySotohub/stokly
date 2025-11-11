## Multi-stage Dockerfile: build with Node, serve static with nginx
## Stage 1 — builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./
# Use npm ci if package-lock.json is present for reproducible installs
RUN if [ -f package-lock.json ]; then npm ci --prefer-offline --no-audit --progress=false; else npm install --no-audit --progress=false; fi

# Copy source and build
COPY . .
RUN npm run build

## Stage 2 — nginx to serve built assets
FROM nginx:stable-alpine AS runner

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
