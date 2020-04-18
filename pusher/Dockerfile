FROM node:latest AS client-builder

WORKDIR /pusher

ADD pusher-front-end/package-lock.json .

RUN npm ci

ADD pusher-front-end/ .

RUN npm run build

FROM node:latest

WORKDIR /pusher

COPY --from=client-builder /pusher/dist public/