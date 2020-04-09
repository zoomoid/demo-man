# 1st stage build client
FROM node:alpine as builder

WORKDIR /app
# copy package-lock.json (mainly) and package.json
COPY package-lock.json .
# npm ci for better performance in dependency resolution
RUN npm ci
# bundle client
ADD src .
ADD public .
ADD babel.config.js .
ADD package.json .
# build with webpack
RUN npm run build

# 2nd stage: lightweight alpine container
FROM nginx:alpine

ADD nginx.conf /etc/nginx/conf.d/default.conf

RUN nginx -t

COPY --from=builder /dist /usr/share/nginx/html/