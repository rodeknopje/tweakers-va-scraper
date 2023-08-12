FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
LABEL org.opencontainers.image.source https://github.com/rodeknopje/tweakers-va-scraper