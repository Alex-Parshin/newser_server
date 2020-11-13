FROM node:14.15.0-alpine3.10
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
EXPOSE 5005
COPY . .
CMD ["npm", "run", "start"]