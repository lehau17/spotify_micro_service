FROM node:20


COPY package.json yarn.lock ./

RUN yarn config set network-timeout 600000
RUN yarn 

COPY dist ./dist

CMD [ "yarn",  "start:prod" ]