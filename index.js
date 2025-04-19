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
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      killProcessOnBrowserClose: true,
      disableSpins: true,
      qrTimeout: 0,
      authTimeout: 60
    }).then(client => {
      res.send('<h2>WhatsApp conectado com sucesso ✅</h2>');
    });
  } catch (error) {
    res.send(`<pre>Erro ao iniciar o WhatsApp: ${error}</pre>`);
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
