FROM node:18

# Instala dependências do sistema
RUN apt-get update && \
    apt-get install -y chromium && \
    apt-get install -y fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
    libatk1.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 libnspr4 libnss3 \
    libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 xdg-utils

# Cria diretório da aplicação
WORKDIR /app

# Copia arquivos
COPY package.json ./
COPY index.js ./

# Instala dependências
RUN npm install

# Porta
EXPOSE 8080

# Comando de inicialização
CMD ["npm", "start"]
