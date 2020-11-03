FROM node:15.0.1-alpine3.10
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "run", "start:dev"]