# Build du frontend React
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Build du backend TypeScript
FROM node:20-alpine AS backend-build
RUN apk add --no-cache python3 make g++
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# Image finale
FROM node:20-alpine
RUN apk add --no-cache libstdc++
WORKDIR /app/backend
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=frontend-build /app/frontend/dist ../frontend/dist
RUN mkdir -p /app/backend/db

EXPOSE 80
CMD ["node", "dist/index.js"]