FROM node:18-alpine

COPY . /app

WORKDIR /app

RUN npm install --production

WORKDIR /app/src

CMD ["node", "index.js"]