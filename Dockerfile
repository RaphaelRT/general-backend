FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --ignore-scripts || npm install --no-audit --no-fund --ignore-scripts

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate --schema prisma/portfolio.prisma && npx prisma generate --schema prisma/intervu.prisma && npm run build

FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
EXPOSE 4000
CMD ["node","dist/index.js"]


