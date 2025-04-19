const { create, ev } = require('@open-wa/wa-automate');
const express = require('express');
const app = express();

let currentQr = '';

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
  console.log('[OK] Bot Evolution iniciado com sucesso.');
}).catch((err) => console.error('[ERRO] Falha ao iniciar o bot:', err));

ev.on('qr.**', async (qrData) => {
  currentQr = qrData;
  console.log('[QR] QR Code atualizado.');
});

app.get('/qr', (req, res) => {
  if (!currentQr || currentQr.length < 10) {
    return res.send('<p style="font-family:sans-serif;">QR Code ainda não gerado. Aguarde alguns segundos...</p>');
  }

  res.send(`
    <html>
      <head>
        <title>QR Code - Evolution API</title>
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          canvas {
            image-rendering: pixelated;
            width: 90vw;
            max-width: 400px;
            height: auto;
          }
        </style>
      </head>
      <body>
        <h2>Escaneie com o WhatsApp</h2>
        <canvas id="qr-canvas"></canvas>
        <p>QR gerado com sucesso.</p>
        <script>
          const qrData = ${JSON.stringify(currentQr)};
          const canvas = document.getElementById('qr-canvas');
          QRCode.toCanvas(canvas, qrData, {
            errorCorrectionLevel: 'H',
            scale: 12,
            margin: 2
          }, function (error) {
            if (error) console.error(error);
          });
        </script>
      </body>
    </html>
  `);
});

app.get('/docs', (req, res) => {
  res.send(`<h2>Evolution API rodando</h2><p>Acesse <a href="/qr">/qr</a> para escanear</p>`);
});

const PORT = process.env.PORT || 8880;
app.listen(PORT, () => {
  console.log(`[ONLINE] Servidor rodando na porta ${PORT}`);
});
