FROM node

# app working folder
WORKDIR /app

# install dependencies
COPY package*.json ./

RUN npm install

# install app
COPY . . 

EXPOSE 8080

# Run CMD
CMD ["node", "server.js"]