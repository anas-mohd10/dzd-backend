# Stage 1: Build the Angular application
FROM 211125565601.dkr.ecr.ap-south-1.amazonaws.com/node-18-alpine:latest AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application source code
COPY . .

# Build the Angular application
RUN npm run build:prod-new

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=build /app/dist/commerce-castle /usr/share/nginx/html

# # Copy the custom Nginx configuration file
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]