FROM node:alpine

WORKDIR /app

RUN npm config set @zoomoid:registry https://git.rwth-aachen.de/api/v4/packages/npm/

# RUN mkdir files

ADD package-lock.json .
ADD package.json .

RUN npm ci

ADD . .

CMD [ "npm", "start" ]
