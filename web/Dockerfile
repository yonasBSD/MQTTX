FROM node:18-alpine

RUN npm i -g http-server

WORKDIR /app
COPY dist ./

EXPOSE 80

CMD [ "http-server", "-p", "80" ]
