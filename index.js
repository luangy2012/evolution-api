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

// Salva QR na memória
ev.on('qr.**', async (qrData) => {
  currentQr = qrData;
  console.log('[QR] QR Code atualizado.');
});

// Rota para renderizar o QR via canvas (sem toDataURL)
app.get('/qr', (req, res) => {
  if (!currentQr || currentQr.length < 10) {
    return res.send('<p style="font-family:sans-serif;">QR Code ainda não gerado. Aguarde alguns segundos...</p>');
  }

  res.send(`
    <html>
      <head>
        <title>QR Code - Evolution API</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
        <style>
          body {
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <h2>Escaneie com o WhatsApp</h2>
        <canvas id="qr-canvas"></canvas>
        <p>QR gerado com sucesso.</p>
        <script>
          var qr = new QRious({
            element: document.getElementById('qr-canvas'),
            size: 300,
            value: ${JSON.stringify(currentQr)}
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
