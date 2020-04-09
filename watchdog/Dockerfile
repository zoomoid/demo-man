FROM node:alpine

WORKDIR /app

ADD package-lock.json .

RUN npm ci

ADD . .

CMD [ "npm", "start" ]
