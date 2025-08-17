FROM node:18-bullseye

# install system deps: ffmpeg, chromium
RUN apt-get update && apt-get install -y \
  ffmpeg \
  chromium \
  ca-certificates \
  fonts-liberation \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libxss1 \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production

COPY . .

ENV PUPPETEER_EXECUTABLE=/usr/bin/chromium
ENV NODE_ENV=production

EXPOSE 8080
CMD ["node", "src/server.js"]
