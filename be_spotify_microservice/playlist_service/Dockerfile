FROM node:20


COPY package.json yarn.lock ./

RUN yarn config set network-timeout 600000
RUN yarn 

COPY . .




# RUN yarn config set network-timeout 600000

RUN npx prisma db push
RUN npx prisma generate


RUN yarn build

CMD [ "yarn", "start:prod"]