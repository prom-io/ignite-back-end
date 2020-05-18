FROM node:10
WORKDIR /var/www/api

COPY ./package.json ./
COPY ./ ./
RUN apt-get update
RUN apt-get -y install graphicsmagick
RUN yarn global add @nestjs/cli
RUN yarn install

EXPOSE ${IGNITE_API_PORT}

CMD ["yarn", "run", "start"]
