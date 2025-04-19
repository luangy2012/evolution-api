const express = require('express');
const { create, ev } = require('@open-wa/wa-automate');
const QRCode = require('qrcode');
const app = express();
const PORT = process.env.PORT || 8080;

let qrCodeBase64 = null;

app.get('/', (req, res) => {
  res.send('API Evolution está online ✅');
});

app.get('/qr', (req, res) => {
  if (qrCodeBase64) {
    res.send(`
      <h2>Escaneie o QR Code abaixo para conectar:</h2>
      <img src="${qrCodeBase64}" />
    `);
  } else {
    res.send('<h2>Aguardando geração do QR Code...</h2>');
  }
});

create({
  sessionId: "evolution",
  multiDevice: true,
  headless: true,
  authTimeout: 60,
  qrTimeout: 0,
  popup: false,
  disableSpins: true,
  logConsole: false,
  killProcessOnBrowserClose: true,
  useChrome: true,
  chromiumArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu'
  ]
}).then(client => {
  console.log('WhatsApp conectado com sucesso!');
}).catch(error => {
  console.error('Erro ao iniciar o WhatsApp:', error);
});

ev.on('qr.**', async (qrcode, sessionId) => {
  qrCodeBase64 = await QRCode.toDataURL(qrcode);
});
 
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
