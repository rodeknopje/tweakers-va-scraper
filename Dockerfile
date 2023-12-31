FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
CMD [ "node", "index.js" ]
LABEL org.opencontainers.image.source https://github.com/rodeknopje/tweakers-va-scraper