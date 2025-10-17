# ---------- Stage 1: Build React App ----------
FROM node:20-alpine AS build

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app for production
RUN npm run build


# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Copy build output from Stage 1 to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx config (optional, for SPA routing or API proxy)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
