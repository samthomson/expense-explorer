FROM mhart/alpine-node

WORKDIR /server

EXPOSE 3100

ADD . /server

RUN yarn --silent

RUN yarn global add ts-node --silent

RUN yarn build

CMD yarn start