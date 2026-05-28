FROM nodered/node-red:latest

USER root

WORKDIR /data

COPY package*.json ./
RUN npm install --unsafe-perm --no-audit --no-fund

COPY . .

RUN chown -R node-red:node-red /data

USER node-red

EXPOSE 1880

CMD ["npm", "start"]