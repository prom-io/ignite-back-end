FROM node:10
WORKDIR /var/www/api

COPY . .
RUN apt-get update
RUN apt-get -y install graphicsmagick
RUN yarn global add @nestjs/cli
RUN yarn install

EXPOSE ${DATA_VALIDATOR_API_PORT}

CMD ["yarn", "run", "start"]
