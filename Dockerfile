### STAGE 1: Build ###
FROM node:lts-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run ng build -- --prod

### STAGE 2: Run ###
FROM nginx:1.19.0-alpine
COPY --from=build /usr/src/app/www/ /usr/share/nginx/html