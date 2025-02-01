### STAGE 1: Build ###
FROM node:lts-alpine AS build
ARG NPM_TOKEN
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./

RUN echo "//npm.pkg.github.com/:_authToken=$NPM_TOKEN" > .npmrc

RUN npm install

RUN rm -f .npmrc

COPY . .
RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
RUN npm run docker

### STAGE 2: Run ###
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/www/browser /usr/share/nginx/html

## Copy the EntryPoint
COPY ./entryPoint.sh /
RUN chmod +x entryPoint.sh

ENTRYPOINT ["/entryPoint.sh"]
CMD ["nginx", "-g", "daemon off;"]