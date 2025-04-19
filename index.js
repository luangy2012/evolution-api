const express = require('express');
const { create } = require('@open-wa/wa-automate');
const app = express();
const PORT = process.env.PORT || 8880;

app.get('/', (req, res) => {
  res.send('API Evolution está online ✅');
});

app.get('/qr', async (req, res) => {
  try {
    await create({
      sessionId: "evolution",
      multiDevice: true,
      headless: true,
      useChrome: true,
      qrTimeout: 0,
      popup: false,
      disableSpins: true,
      authTimeout: 60,
      executablePath: process.env.CHROME_PATH || '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }).then(client => res.send('<h1>WhatsApp conectado ✅</h1>'));
  } catch (err) {
    res.send(`<pre>Erro ao iniciar: ${err}</pre>`);
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
