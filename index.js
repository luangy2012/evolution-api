const express = require('express');
const { create } = require('@open-wa/wa-automate');
const app = express();
const PORT = process.env.PORT || 8880;

let clientInstance = null;

app.get('/', (req, res) => {
  res.send('API Evolution está online ✅');
});

app.get('/qr', async (req, res) => {
  try {
    if (clientInstance) {
      return res.send('<h2>Já conectado ao WhatsApp ✅</h2>');
    }

    await create({
      sessionId: "evolution",
      multiDevice: true,
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      authTimeout: 60,
      qrTimeout: 0,
      disableSpins: true,
      popup: false,
    }).then(client => {
      clientInstance = client;
      res.send('<h2>QR Code gerado com sucesso! Escaneie pelo WhatsApp.</h2>');
    }).catch(err => {
      res.send(`<pre>Erro ao iniciar o WhatsApp: ${err}</pre>`);
    });

  } catch (err) {
    res.send(`<pre>Erro ao iniciar: ${err}</pre>`);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
