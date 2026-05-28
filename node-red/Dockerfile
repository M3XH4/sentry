FROM nodered/node-red:latest

WORKDIR /data

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1880

CMD ["npm", "start"]