FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/src/database/migrations ./dist/database/migrations

RUN mkdir -p uploads

EXPOSE 3000

CMD ["sh", "-c", "node dist/database/migrate.js && node dist/app.js"]