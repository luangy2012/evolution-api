const express = require('express');
const { create, ev } = require('@open-wa/wa-automate');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 8080;

let qrCodeBase64 = '';

app.get('/', (req, res) => {
  res.send('API Evolution está online ✅');
});

app.get('/qr', async (req, res) => {
  if (!qrCodeBase64) {
    return res.send('<h2>QR Code ainda não gerado. Aguarde alguns segundos...</h2>');
  }

  const html = `
    <h2>Escaneie o QR Code abaixo para autenticar no WhatsApp:</h2>
    <img src="${qrCodeBase64}" style="width:300px;height:300px;" />
  `;
  res.send(html);
});

create({
  sessionId: "evolution",
  multiDevice: true,
  headless: true,
  useChrome: true,
  qrTimeout: 0,
  authTimeout: 60,
  popup: false,
  disableSpins: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu'
  ]
}).then(async (client) => {
  console.log('WhatsApp conectado com sucesso ✅');
}).catch((err) => {
  console.error('Erro ao iniciar o WhatsApp:', err);
});

ev.on('qr.**', async (qr) => {
  try {
    qrCodeBase64 = await QRCode.toDataURL(qr);
    console.log('QR Code gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error.message);
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
