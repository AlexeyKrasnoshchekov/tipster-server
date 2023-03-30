FROM node

WORKDIR /app

ADD package.json package.json

RUN npm install

ADD . .

CMD ["npm", "run", "start"]

EXPOSE 8000