FROM ubuntu:latest
MAINTAINER groliffe@gmail.com

RUN apt-get -y update && apt-get install -y apt-utils && apt-get install -y nodejs && apt-get install -y npm

# Usertest setup
RUN mkdir -p /app

WORKDIR /app

COPY entrypoint.sh .
COPY bin/ bin/
COPY db/ db/
COPY models/ models/
COPY public/ public/
COPY routes/ routes/
COPY views/ views/
COPY app.js .
COPY package.json .

RUN npm install

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
