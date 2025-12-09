FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx nx build front-end --configuration=production

FROM node:24-alpine

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=builder /usr/src/app/dist/apps/front-end ./dist/apps/front-end

USER node

ENV PORT=5173

EXPOSE 5173

CMD ["sh", "-c", "serve -s dist/apps/front-end -l ${PORT}"]
