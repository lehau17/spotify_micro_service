# FROM node:20-alpine as build

# WORKDIR /root/upload-service

# COPY package.json yarn.lock ./

# RUN yarn install

# COPY . .


# RUN yarn build

# FROM node:20-alpine 

# WORKDIR /root/upload-service
# COPY --from=build /root/upload-service/dist ./dist
# COPY --from=build /root/upload-service/package.json ./
# COPY --from=build /root/upload-service/yarn.lock ./

# RUN yarn install --production


# CMD ["yarn","start:prod"]


FROM node:20 AS build

WORKDIR /root/user-service

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn","start:prod"]
