FROM node:12.0

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

CMD [ "npm", "run", "watch" ]
# To build the image: docker build . -t towelshop-backend
# To run container: docker run -it -p 5000:5000 towelshop-backend