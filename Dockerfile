FROM node:10
WORKDIR /var/www/api

RUN apt-get update && apt-get -y install graphicsmagick
RUN yarn global add @nestjs/cli

COPY ./package.json yarn.lock ./
RUN yarn install

COPY ./ ./

EXPOSE ${IGNITE_API_PORT}

CMD ["yarn", "run", "start"]
