FROM node:14.15.0-alpine3.10
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
EXPOSE 5000
COPY . .
CMD ["npm", "run", "start:dev"]