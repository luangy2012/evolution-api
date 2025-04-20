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
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
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
            background: white;
            margin: 0;
          }
          canvas {
            width: 320px;
            height: 320px;
            image-rendering: pixelated;
            border: 4px solid black;
          }
        </style>
      </head>
      <body>
        <h2>Escaneie com o WhatsApp</h2>
        <canvas id="qr-canvas"></canvas>
        <p>QR gerado com sucesso.</p>
        <script>
          document.addEventListener("DOMContentLoaded", function () {
            const qrData = ${JSON.stringify(currentQr)};
            QRCode.toCanvas(document.getElementById('qr-canvas'), qrData, {
              errorCorrectionLevel: 'H',
              scale: 12,
              margin: 2
            }, function (err) {
              if (err) console.error('Erro ao renderizar QR:', err);
            });
          });
        </script>
      </body>
    </html>
  `);
});

app.get('/docs', (req, res) => {
  res.send(`
    <h2>Evolution API está rodando</h2>
    <p>Acesse: <a href="/qr" target="_blank">/qr</a> para escanear o QR Code</p>
  `);
});

const PORT = process.env.PORT || 8880;
app.listen(PORT, () => {
  console.log(`[ONLINE] Servidor rodando na porta ${PORT}`);
});
