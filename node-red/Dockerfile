FROM nodered/node-red:latest

USER root

WORKDIR /data

COPY . .

RUN chown -R node-red:node-red /data

USER node-red

EXPOSE 1880

CMD ["sh", "-c", "node-red -s settings.js -p ${PORT:-1880}"]