# syntax=docker/dockerfile:1

# ---------- Stage 1: build the React app + bundle the Express server ----------
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable

# Copy dependency manifests first so Docker caches the install layer
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build            # -> dist/public (frontend) + dist/index.js (server)

# ---------- Stage 2: small production image ----------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

COPY --from=build /app/dist ./dist

# Run as the unprivileged "node" user
USER node
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/ > /dev/null || exit 1

CMD ["node", "dist/index.js"]
