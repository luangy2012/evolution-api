FROM node:18

# Instalar dependências do Chromium
RUN apt-get update && apt-get install -y \
  wget \
  unzip \
  gnupg \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

# Baixar e instalar o Chromium corretamente
RUN wget https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/1182810/chrome-linux.zip && \
    unzip chrome-linux.zip && \
    mv chrome-linux/chrome /usr/bin/chromium && \
    chmod +x /usr/bin/chromium && \
    rm -rf chrome-linux chrome-linux.zip

ENV CHROME_PATH="/usr/bin/chromium"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8880

CMD ["npm", "start"]
