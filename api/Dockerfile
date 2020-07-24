FROM node:alpine

WORKDIR /app

RUN npm config set @zoomoid:registry https://git.rwth-aachen.de/api/v4/packages/npm/

ADD package-lock.json .
ADD package.json .
RUN npm ci

ADD . .

ARG VERSION
ENV VERSION ${VERSION:-0.0.0}
RUN echo $VERSION
RUN cat package.json | sed -e "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" | tee package.json

CMD [ "npm", "start" ]
