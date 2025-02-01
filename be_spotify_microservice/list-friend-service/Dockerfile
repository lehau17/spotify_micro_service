FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn config set network-timeout 600000

RUN yarn install

COPY . .

RUN npx prisma db push

RUN npx prisma generate

RUN yarn build

CMD [ "yarn", "start:prod" ]