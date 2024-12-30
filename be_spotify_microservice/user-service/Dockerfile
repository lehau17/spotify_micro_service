FROM node:20


COPY . .

RUN yarn 

RUN npx prisma db push
RUN npx prisma generate


RUN yarn build

CMD [ "node",  "dist/main.js" ]