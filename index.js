const { create, ev } = require('@open-wa/wa-automate');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const app = express();

let clientInstance = null;

create({
  sessionId: 'evolution',
  multiDevice: true,
  headless: true,
  qrTimeout: 0,
  authTimeout: 0,
  useChrome: true,
  executablePath: process.env.CHROME_PATH,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}).then((client) => {
  clientInstance = client;
  console.log('Bot Evolution iniciado com sucesso.');
}).catch((err) => console.error('Erro ao iniciar bot:', err));

// Salvar o QR Code em um arquivo quando for gerado
ev.on('qr.**', async (qrData) => {
  fs.writeFileSync('./last.qr.txt', qrData);
  console.log('[QR] QR Code atualizado e salvo.');
});

// Rota para exibir o QR Code visualmente
app.get('/qr', async (req, res) => {
  const path = './last.qr.txt';
  if (!fs.existsSync(path)) {
    return res.send('<p style="font-family:sans-serif;">QR Code ainda não gerado. Aguarde alguns segundos...</p>');
  }

  try {
    const qr = fs.readFileSync(path, 'utf-8');
    const qrImage = await qrcode.toDataURL(qr);
    res.send(`
      <html>
        <head><title>QR Code - Evolution API</title></head>
        <body style="font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;">
          <h2>Escaneie com o WhatsApp</h2>
          <img src="${qrImage}" style="width:300px;height:300px;" />
          <p>QR gerado com sucesso.</p>
        </body>
      </html>
    `);
  } catch {
    res.send('<p>Erro ao processar QR. Tente novamente em instantes.</p>');
  }
});

// Rota de status simples
app.get('/docs', (req, res) => {
  res.send(`
    <h2>Evolution API ativa</h2>
    <p>Para escanear o QR Code do WhatsApp: <a href="https://evolution-api-production-08cc.up.railway.app/qr" target="_blank">/qr</a></p>
  `);
});

app.listen(8880, () => {
  console.log('Servidor rodando em: https://evolution-api-production-08cc.up.railway.app');
});
