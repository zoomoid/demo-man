# 1st stage build client
FROM node:latest as builder

WORKDIR /app
# copy package-lock.json (mainly) and package.json
ADD package-lock.json .
ADD package.json .

# npm ci for better performance in dependency resolution
RUN npm ci

# Add specific version file to avoid exposing the entire package.json
RUN echo "{\"version\": \"$VERSION\"}" > .version.json

# bundle client
ADD . .

ARG VERSION
ENV VERSION ${VERSION:-0.0.0}
RUN echo $VERSION
RUN cat package.json | sed -e "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" | tee package.json

# build with webpack
RUN npm run build

# 2nd stage: lightweight alpine container
FROM nginx:alpine

ADD nginx.conf /etc/nginx/conf.d/client.conf

RUN nginx -t

COPY --from=builder /app/dist /usr/share/nginx/client/