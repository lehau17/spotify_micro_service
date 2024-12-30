FROM node:20


COPY . .

RUN yarn 


RUN yarn config set network-timeout 600000

RUN npx prisma db push
RUN npx prisma generate


RUN yarn build

CMD [ "node",  "dist/main.js" ]