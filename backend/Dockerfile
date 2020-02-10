FROM node:12
WORKDIR /var/www/api

RUN yarn global add @nestjs/cli
RUN yarn install

EXPOSE ${DATA_VALIDATOR_API_PORT}

CMD ["yarn", "run", "start"]
