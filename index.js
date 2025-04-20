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
            background: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
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
          const qrData = ${JSON.stringify(currentQr)};
          const canvas = document.getElementById('qr-canvas');

          QRCode.toCanvas(canvas, qrData, {
            errorCorrectionLevel: 'H',
            scale: 12,
            margin: 2,
            width: 512
          }, function (error) {
            if (error) console.error('Erro ao renderizar QR:', error);
          });
        </script>
      </body>
    </html>
  `);
});
