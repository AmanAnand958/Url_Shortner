FROM node:20-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y iputils-ping


COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
