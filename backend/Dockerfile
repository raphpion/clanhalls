FROM node:22.3.0
EXPOSE 8000
EXPOSE 8080

WORKDIR /clan-halls/backend

COPY . .

RUN npm i -s
RUN npm i pm2 -g
RUN npm i typeorm -g

RUN npm run build

CMD ["npm", "run", "start"]