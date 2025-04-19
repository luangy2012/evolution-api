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
  console.log('[OK] Bot Evolution iniciado com sucesso.');
}).catch((err) => console.error('[ERRO] Falha ao iniciar o bot:', err));

// Salvar o QR Code
ev.on('qr.**', async (qrData) => {
  try {
    fs.writeFileSync('./last.qr.txt', qrData);
    console.log('[QR] QR Code atualizado e salvo.');
  } catch (err) {
    console.error('[ERRO] Falha ao salvar QR Code:', err);
  }
});

// Rota segura para exibir o QR
app.get('/qr', async (req, res) => {
  try {
    if (!fs.existsSync('./last.qr.txt')) {
      return res.status(202).send('<p style="font-family:sans-serif;">QR Code ainda não gerado. Aguarde alguns segundos...</p>');
    }

    const qrRaw = fs.readFileSync('./last.qr.txt', 'utf-8');

    if (!qrRaw || qrRaw.length < 10) {
      return res.status(204).send('<p style="font-family:sans-serif;">QR Code inválido ou ainda carregando...</p>');
    }

    const qrImage = await qrcode.toDataURL(qrRaw);

    return res.send(`
      <html>
        <head><title>QR Code - Evolution API</title></head>
        <body style="font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;">
          <h2>Escaneie com o WhatsApp</h2>
          <img src="${qrImage}" style="width:300px;height:300px;" />
          <p>QR gerado com sucesso.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('[ERRO] na rota /qr:', error);
    return res.status(500).send('<p style="font-family:sans-serif;">Erro interno. Tente novamente em instantes.</p>');
  }
});

// Rota de verificação
app.get('/docs', (req, res) => {
  res.send(`
    <h2>Evolution API rodando</h2>
    <p>Acesse <a href="/qr" target="_blank">/qr</a> para escanear o código</p>
  `);
});

const PORT = process.env.PORT || 8880;
app.listen(PORT, () => {
  console.log(`[ONLINE] Servidor rodando na porta ${PORT}`);
});
