FROM node:alpine

WORKDIR '/app'

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install -g serve

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]

