FROM node:20

COPY . .

RUN yarn install
RUN yarn config set network-timeout 600000


RUN yarn build

CMD [ "node", "dist/main.js" ]