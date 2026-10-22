# Dockerfile multi-stage do backend NestJS
# bcrypt é nativo: fase de build precisa de toolchain (python3, make, g++)
FROM node:20-bookworm-slim AS deps
WORKDIR /app
# Toolchain para compilar bcrypt (node-gyp)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Dependências nativas mínimas para bcrypt já compilado + OpenSSL
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]
