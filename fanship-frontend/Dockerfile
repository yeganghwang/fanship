FROM node:18 AS build
WORKDIR /app

# Build-time variables passed from GitHub Actions (or docker build --build-arg ...)
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_SERVER_URL
ARG REACT_APP_RECAPTCHA_SITE_KEY

# Expose them to the React build process (create-react-app reads process.env.* at build time)
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL \
    REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL \
    REACT_APP_RECAPTCHA_SITE_KEY=$REACT_APP_RECAPTCHA_SITE_KEY

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

# Copy the build output to Nginx's default static file directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]


# FROM node:18

# WORKDIR /app
# COPY . .
# RUN npm install
# EXPOSE 3000

# CMD ["npm", "start"]