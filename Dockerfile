FROM node:16

# RUN npm install --production
WORKDIR /usr/src/app

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn

COPY . .

RUN yarn build

CMD [ "yarn", "start" ]
