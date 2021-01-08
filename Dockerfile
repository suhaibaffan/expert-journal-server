FROM node:14.4.0-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package.json ./package.json
COPY yarn.lock ./

RUN yarn --frozen-lockfile

COPY . ./

EXPOSE 8000

RUN yarn build

CMD ["yarn", "start"]
