FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# FROM node:18

# WORKDIR /app
# COPY . .
# RUN npm install
# EXPOSE 3000

# CMD ["npm", "start"]