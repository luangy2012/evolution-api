const express = require('express');
const { create, ev } = require('@open-wa/wa-automate');

// Variável global para armazenar o último QR code (conteúdo) e status
let latestQr = null;
let isAuthenticated = false;

// Inicia o servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// Rota principal /qr que serve a página com o QR Code
app.get('/qr', (req, res) => {
  // Conteúdo HTML da página QR
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WhatsApp QR Code</title>
  <style>
    body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0; }
    #qr-container { text-align: center; }
    #qrcode { display: inline-block; padding: 20px; background: #fff; }
    #status { font-family: Arial, sans-serif; color: #333; margin-bottom: 10px; }
    canvas { image-rendering: pixelated; }
  </style>
</head>
<body>
  <div id="qr-container">
    <div id="status">Carregando QR Code...</div>
    <div id="qrcode"></div>
  </div>
  <script src="https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js"></script>
  <script>
    let qrCode;
    async function atualizarQR() {
      try {
        const resp = await fetch('/qr-data');
        const data = await resp.json();
        if (data.status === 'authenticated') {
          // Dispositivo conectado
          document.getElementById('status').innerText = '✅ Dispositivo conectado com sucesso!';
          // Opcional: podemos parar de atualizar depois de autenticado
          return;
        }
        if (data.qr) {
          document.getElementById('status').innerText = 'Escaneie o QR Code com o WhatsApp';
          // Renderiza o novo QR Code no canvas
          document.getElementById('qrcode').innerHTML = ""; // limpa QR antigo
          qrCode = new QRCode(document.getElementById('qrcode'), {
            text: data.qr,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        }
      } catch (e) {
        console.error('Erro ao buscar QR code:', e);
      } finally {
        // Tenta atualizar novamente após 5 segundos, caso ainda não autenticado
        if (!${isAuthenticated}) {
          setTimeout(atualizarQR, 5000);
        }
      }
    }
    // Chamada inicial para obter o QR Code
    atualizarQR();
  </script>
</body>
</html>`);
});

// Endpoint para fornecer os dados atuais do QR code em JSON
app.get('/qr-data', (req, res) => {
  res.json({
    qr: latestQr,
    status: isAuthenticated ? 'authenticated' : 'pending'
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Função de inicialização do WhatsApp (chamada após obter cliente)
function start(client) {
  console.log('WhatsApp cliente iniciado!');
  // Podemos adicionar aqui handlers de mensagens, etc, se necessário.
}

// Listener de eventos para capturar QR code sempre que for gerado/atualizado
ev.on('qr.**', async (qrcode, sessionId) => {
  // qrcode é uma string base64 (data URI) representando a imagem do QR Code
  console.log(`[QR] Código QR recebido para sessão ${sessionId || 'principal'}`);
  try {
    // Extrai a parte base64 (removendo prefixo data:image/png...)
    const base64Data = qrcode.replace('data:image/png;base64,', '');
    // Opcional: decodifica a imagem para obter o texto do QR (para gerar via qrcode.js)
    // Aqui usamos jsQR + Jimp para ler o conteúdo do QR code
    const Jimp = require('jimp');
    const jsQR = require('jsqr');
    // Carrega a imagem a partir do buffer base64
    const image = await Jimp.read(Buffer.from(base64Data, 'base64'));
    const { data, width, height } = image.bitmap;
    const code = jsQR(new Uint8ClampedArray(data), width, height);
    if (code) {
      latestQr = code.data; // conteúdo do QR code (texto) para usar no front-end
    } else {
      console.warn('Falha ao decodificar o conteúdo do QR code.');
      latestQr = null;
    }
  } catch (err) {
    console.error('Erro ao processar QR code:', err);
    latestQr = null;
  }
});

// Quando o cliente autenticar com sucesso, atualiza o estado
ev.on('sessionData.**', async (_sessionData, sessionId) => {
  console.log(`Sessão ${sessionId || 'principal'} autenticada!`);
  isAuthenticated = true;
  // Opcional: podemos limpar o QR já que não é mais necessário
  // latestQr = null;
});

// Configurações do @open-wa/wa-automate para criar o cliente WhatsApp
const chromeExecutable = process.env.CHROME_PATH || (() => {
  try {
    // Tenta usar o Chrome baixado pelo Puppeteer, se disponível
    return require('puppeteer').executablePath();
  } catch {
    return undefined;
  }
})();

// Inicia o cliente WhatsApp
create({
  sessionId: 'SessionMultiDevice',    // ID da sessão (pode trocar para identificar)
  multiDevice: true,                  // garante modo multi-dispositivo
  headless: true,                     // executa sem interface gráfica
  autoRefresh: true,                  // atualiza QR automaticamente se expirar
  qrTimeout: 0,                       // espera indefinidamente pelo scan do QR
  authTimeout: 0,                     // espera indefinidamente pela autenticação
  executablePath: chromeExecutable,   // caminho do Chrome/Chromium
  useChrome: !!chromeExecutable       // usa Chrome do sistema se disponível
}).then(client => {
  // Cliente criado com sucesso
  start(client);
}).catch(err => {
  console.error('Erro ao criar cliente WhatsApp:', err);
});
