FROM node:20-bullseye-slim AS base
WORKDIR /app

ENV CI=1
ENV ROLLUP_SKIP_NODEJS_NATIVE=1

COPY package*.json ./
RUN npm ci


FROM base AS dev
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]


FROM base AS test-ui
WORKDIR /app
COPY . .
EXPOSE 51204
CMD ["npm","run","test:ui"]
