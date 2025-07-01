FROM node:22-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 4321

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "4321"]