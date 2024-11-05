FROM node:22.3.0
EXPOSE 8000
EXPOSE 8080

WORKDIR /clan-halls/backend

COPY ./backend .
COPY ./.env ../.env

RUN npm i -s
RUN npm i typescript typeorm pm2 -g

RUN npm run build

CMD ["npm", "run", "start"]