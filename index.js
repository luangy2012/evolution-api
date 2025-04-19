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
      headless: true,
      executablePath: '/usr/bin/chromium',
      useChrome: true,
      disableSpins: true,
      qrTimeout: 0,
      authTimeout: 60,
      killProcessOnBrowserClose: true,
      multiDevice: true,
      sessionId: undefined, // <- não usa pasta com nome fixo
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--disable-accelerated-2d-canvas',
        '--disable-software-rasterizer',
        '--no-first-run',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-sync',
        '--metrics-recording-only',
        '--mute-audio',
        '--remote-debugging-port=9222'
      ]
    }).then(client => {
      res.send('<h2>WhatsApp iniciado com sucesso! ✅</h2>');
    });
  } catch (error) {
    res.send(`<pre>Erro ao iniciar o WhatsApp: ${error}</pre>`);
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
