FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Install dependencies (npm install will update lock file if needed)
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
# Les variables NEXT_PUBLIC_* doivent être définies au moment du build
# Elles sont passées via --build-arg depuis docker-compose
ARG NEXT_PUBLIC_DIRECTUS_URL
ENV NEXT_PUBLIC_DIRECTUS_URL=${NEXT_PUBLIC_DIRECTUS_URL}
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
# IMPORTANT: En mode standalone, Next.js ne copie pas automatiquement le dossier public
# Il faut le copier manuellement à côté du server.js
# Structure attendue:
# /app/
#   server.js (depuis standalone)
#   public/ (copié manuellement)
#   .next/
#     static/ (copié manuellement)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Copier le dossier public après standalone pour qu'il soit à côté du server.js
# Le dossier public doit être accessible depuis le répertoire de travail de Next.js
# S'assurer que le dossier public existe et est copié avec les bonnes permissions
# Utiliser --chown pour s'assurer que les permissions sont correctes pour tous les fichiers
# IMPORTANT: Copier récursivement pour s'assurer que tous les fichiers (PNG, SVG, AVIF) sont inclus
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy node_modules from builder to get sharp
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

WORKDIR /app

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Next.js standalone output structure: server.js is at the root of standalone
CMD ["node", "server.js"]

