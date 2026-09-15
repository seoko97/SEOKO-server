# Stage 1: Dependencies
FROM node:24-alpine AS deps

RUN corepack enable && corepack prepare pnpm@10.15 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


# Stage 2: Builder
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.15 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build


# Stage 3: Production Dependencies
FROM node:24-alpine AS prod-deps

RUN corepack enable && corepack prepare pnpm@10.15 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod


# Stage 4: Runner
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME=0.0.0.0

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env

EXPOSE 4000

CMD ["node", "dist/main.js"]
