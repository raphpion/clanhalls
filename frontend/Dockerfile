FROM node:22.3.0 AS build

WORKDIR /clan-halls/frontend

COPY ./frontend .
COPY ./.env ../.env

RUN npm i -s
RUN npm i typescript -g

RUN npm run build

FROM nginx:alpine

COPY --from=build /clan-halls/frontend/dist /usr/share/nginx/html
COPY ./frontend/nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY ./scripts/frontend-entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/entrypoint.sh"]