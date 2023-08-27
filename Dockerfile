FROM node

WORKDIR /app

ADD package.json package.json

RUN npm install

ADD . .

CMD ["npm", "run", "start2"]

EXPOSE 8000