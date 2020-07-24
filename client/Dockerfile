# 1st stage build client
FROM node:latest as builder

ARG VERSION
ENV VERSION ${VERSION:-0.0.0}

WORKDIR /app
# copy package-lock.json (mainly) and package.json
ADD package-lock.json .
ADD package.json .

RUN cat package.json | sed -e "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" | tee package.json

RUN echo "{\"version\": \"$VERSION\"}" > .version.json

# npm ci for better performance in dependency resolution
RUN npm ci
# bundle client
ADD . .
# build with webpack
RUN npm run build

# 2nd stage: lightweight alpine container
FROM nginx:1.19.0-alpine

ADD nginx.conf /etc/nginx/conf.d/client.conf

RUN nginx -t

COPY --from=builder /app/dist /usr/share/nginx/client/