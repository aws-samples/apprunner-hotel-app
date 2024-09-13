FROM node:16-slim

RUN apk update && apk upgrade

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

USER node

CMD [ "npm", "start" ]
