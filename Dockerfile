FROM node:10
WORKDIR /var/www/api

RUN apt-get update && apt-get -y install graphicsmagick

COPY ./package.json ./
COPY ./ ./

RUN yarn global add @nestjs/cli
RUN yarn install

EXPOSE ${IGNITE_API_PORT}

CMD ["yarn", "run", "start"]
