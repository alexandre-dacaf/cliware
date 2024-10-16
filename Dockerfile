FROM node:20

WORKDIR /app

COPY ./core/package*.json ./

RUN npm install

COPY ./core .

EXPOSE 3000

CMD ["npm", "start"]
