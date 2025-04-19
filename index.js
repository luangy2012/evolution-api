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
      executablePath: '/usr/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--single-process',
        '--disable-extensions',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
      ],
      killProcessOnBrowserClose: true,
      chromiumArgs: ['--no-sandbox']
    }).then(() => {
      res.send(`<h2>QR Code gerado com sucesso ✅<br>Acesse via terminal ou app com o número vinculado.</h2>`);
    });
  } catch (err) {
    res.send(`<pre>Erro ao iniciar o WhatsApp: ${err}</pre>`);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
