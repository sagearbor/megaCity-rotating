# Build stage - compile TypeScript and bundle with Vite
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and environment files
COPY . .

# Build the application (GEMINI_API_KEY from .env.local gets baked in)
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Cloud Run required port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
