FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build            # outputs to /app/frontend/dist

FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY test-project/package*.json test-project/tsconfig*.json ./
RUN npm ci
COPY test-project/ ./test-project
# copy over the already-built frontend
COPY --from=frontend-builder /app/frontend/dist ./test-project/frontend/dist
WORKDIR /app/test-project
RUN npm run build            # compiles Nest into /app/test-project/dist

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=backend-builder /app/test-project/dist ./dist
COPY --from=backend-builder /app/test-project/node_modules ./node_modules
COPY --from=backend-builder /app/test-project/frontend/dist ./frontend/dist
EXPOSE 3500
CMD ["node", "dist/main.js"]
