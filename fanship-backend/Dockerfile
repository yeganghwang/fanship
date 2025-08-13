# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Optional build args (not strictly needed unless build-time config embedding is required)
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG JWT_SECRET
ARG RECAPTCHA_SECRET_KEY

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
