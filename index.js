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
      executablePath: "/usr/bin/chromium",
      qrTimeout: 0,
      popup: false,
      disableSpins: true,
      authTimeout: 60,
      killProcessOnBrowserClose: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-zygote',
        '--disable-gpu',
        '--single-process',
        '--disable-extensions'
      ]
    }).then(client => res.send('<h1>WhatsApp conectado ✅</h1>'));
  } catch (err) {
    res.send(`<pre>Erro ao iniciar: ${err}</pre>`);
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
