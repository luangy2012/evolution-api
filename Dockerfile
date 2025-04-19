FROM node:18

# Instala dependências necessárias
RUN apt-get update && apt-get install -y \
    wget \
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
    chromium \
    && apt-get clean

# Cria pasta do app
WORKDIR /app

# Copia arquivos
COPY package.json .
COPY index.js .

# Instala dependências do Node
RUN npm install

# Define variáveis de ambiente
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Porta da aplicação
EXPOSE 8880

# Comando para iniciar
CMD ["node", "index.js"]
