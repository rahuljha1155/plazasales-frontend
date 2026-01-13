# Production Next.js (SSR) using Docker-only Node (node:24-alpine)
# Supports both:
#  - Next "standalone" output (recommended)
#  - Normal output (fallback)
# Runtime env vars are supported (NEXT_PUBLIC_* are build-time; server env vars are runtime).

FROM node:24-alpine AS deps
WORKDIR /app
RUN corepack enable

# Copy only dependency manifests for better layer caching
COPY package.json pnpm-lock.yaml* ./
# If you use pnpm-workspace.yaml in this app folder, copy it too:
# COPY pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
RUN pnpm build

# ---- Runner ----
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001 -G nodejs

# Healthcheck needs curl
RUN apk add --no-cache curl

# Copy minimal runtime files
# If standalone exists, copy it; if not, copy standard build output.
# We'll copy both safely and decide at runtime which to run.
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Standalone (if enabled in next.config.ts: output: "standalone")
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/static

# Non-standalone fallback
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000

# If standalone server.js exists, run it; otherwise run Next normally.
CMD ["sh", "-c", "if [ -f ./.next/standalone/server.js ]; then node ./.next/standalone/server.js; else node ./node_modules/.bin/next start -p 3000; fi"]
