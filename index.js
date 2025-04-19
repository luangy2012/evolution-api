const express = require("express");
const { create, ev } = require("@open-wa/wa-automate");
const app = express();
const PORT = process.env.PORT || 8080;

let qrCodeBase64 = "";

app.get("/", (req, res) => {
  res.send("API Evolution está online ✅");
});

app.get("/qr", async (req, res) => {
  if (!qrCodeBase64) {
    return res.send("<h2>Aguardando geração do QR Code...</h2>");
  }
  res.send(`
    <h2>Escaneie o QR Code para conectar:</h2>
    <img src="data:image/png;base64,${qrCodeBase64}" />
  `);
});

create({
  sessionId: "evolution",
  multiDevice: true,
  authTimeout: 60,
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  qrTimeout: 0,
  popup: false,
  useChrome: true,
  killProcessOnBrowserClose: true,
  args: ["--no-sandbox"],
}).then((client) => start(client));

function start(client) {
  console.log("Bot iniciado com sucesso!");
}

ev.on("qr.**", async (qrcode) => {
  try {
    const QRCode = require("qrcode");
    qrCodeBase64 = await QRCode.toDataURL(qrcode, { errorCorrectionLevel: 'L' });
    console.log("QR Code gerado com sucesso!");
  } catch (err) {
    console.error("Erro ao gerar QR Code:", err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
