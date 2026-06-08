# ─────────────────────────────────────────────────────────────────
#  Dockerfile — SkyWatch Backend
#  Multi-stage build: keeps the final image lean (no devDependencies)
# ─────────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ────────────────────────────────
FROM node:18-alpine AS deps

WORKDIR /app

# Copy only package files first — lets Docker cache this layer
# so npm install only re-runs when dependencies actually change
COPY package*.json ./
RUN npm install --omit=dev


# ── Stage 2: Final runtime image ─────────────────────────────────
FROM node:18-alpine

WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY . .

# Document the port the app listens on
EXPOSE 3000

# Healthcheck — Docker will mark the container unhealthy if this fails
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Run as non-root user for security (node user is built into node:alpine)
USER node

# Start the server
CMD ["node", "server.js"]