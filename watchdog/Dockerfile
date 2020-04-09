FROM node:alpine

WORKDIR /app

RUN mkdir files

ADD package-lock.json .

RUN npm ci

ADD . .

CMD [ "npm", "start" ]
