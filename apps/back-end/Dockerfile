FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx nx build back-end --configuration=production

FROM node:24-alpine

RUN apk update && apk upgrade --no-cache
RUN npm install -g nx

WORKDIR /usr/src/app

COPY package.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/tsconfig.base.json ./

COPY --from=builder --chown=node:node /usr/src/app/dist/apps/back-end ./dist

COPY --from=builder --chown=node:node /usr/src/app/apps/back-end ./apps/back-end

RUN mkdir -p .nx && chown -R node:node .nx
ENV NX_CACHE_DIRECTORY=/usr/src/app/.nx/cache

USER node
EXPOSE 3000

CMD ["sh", "-c", "nx run back-end:migration-run && nx run back-end:seed-run && node dist/main.js"]
