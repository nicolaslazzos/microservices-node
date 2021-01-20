FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install
RUN npm install evergreen-ui --legacy-peer-deps
COPY . .

CMD ["npm", "run", "dev"]