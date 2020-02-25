FROM node:12

WORKDIR /usr/src/app
COPY ./front-end .

RUN yarn install

EXPOSE ${REACT_APP_PRODUCTION_PORT}

CMD ["yarn", "run", "production"]
