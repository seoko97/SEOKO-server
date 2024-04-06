FROM node:16-alpine as base

FROM base as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .pnp.cjs .
COPY .pnp.loader.mjs .
COPY .yarn ./.yarn


RUN yarn install -g pm2
RUN yarn install

COPY . .

RUN yarn build

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/.yarn/releases ./.yarn/releases
COPY --from=builder /app/.yarn/cache ./.yarn/cache
COPY --from=builder /app/.yarn/unplugged ./.yarn/unplugged
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./.env

COPY --from=builder /app/.pnp.cjs ./.pnp.cjs
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/pm2.yml ./pm2.yml

ENV NODE_ENV production
ENV PORT 4000
ENV HOSTNAME 0.0.0.0

EXPOSE 4000

CMD ["yarn", "start:prod"]