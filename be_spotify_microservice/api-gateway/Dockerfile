FROM node:20

COPY . .

RUN yarn install


RUN yarn build

CMD [ "node", "dist/main.js" ]