FROM node:18-slim

# Install dependencies required by Puppeteer
RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 libgtk-3-0 libasound2 libnss3 libxss1 fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 10000
CMD ["npm", "start"]
