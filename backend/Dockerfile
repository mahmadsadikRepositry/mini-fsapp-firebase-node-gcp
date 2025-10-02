# backend/Dockerfile
FROM node:20-slim

# create app dir
WORKDIR /usr/src/app

# Install dependencies (copy package files first for layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --production

# copy source
COPY src ./src
# copy other files if needed
COPY .env ./

EXPOSE 8080

# start
CMD ["node", "src/index.js"]
