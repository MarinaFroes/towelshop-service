FROM node:12.0

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

CMD [ "npm", "run", "watch" ]