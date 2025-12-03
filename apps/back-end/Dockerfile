FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx nx build back-end --configuration=production

FROM node:24-alpine

RUN apk update && apk upgrade --no-cache

WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/dist/apps/back-end ./dist
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/package.json ./

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
