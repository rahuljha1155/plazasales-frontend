FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Set environment variables directly (these are public/client-side)
ENV NEXT_PUBLIC_API_URL=https://app.plazasales.com.np/api/v1/plaza
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeC4AEsAAAAACosF5XfvpZIiKGA2zTfkO4a_eNQ
ENV NODE_ENV=production

# Ensure next.config.js exists
RUN if [ ! -f next.config.js ] && [ ! -f next.config.ts ]; then \
    echo "module.exports = { staticPageGenerationTimeout: 180 }" > next.config.js; \
  fi

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=2661

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 2661

CMD ["pnpm", "start"]