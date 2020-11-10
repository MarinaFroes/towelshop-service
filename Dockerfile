FROM node:12.19.0-alpine3.10

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install --silent

EXPOSE 5000

CMD [ "npm", "run", "watch" ]