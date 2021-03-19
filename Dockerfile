FROM node:latest

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH


COPY package.json yarn.lock ./
RUN yarn
COPY . .
CMD ["npm", "start"]
