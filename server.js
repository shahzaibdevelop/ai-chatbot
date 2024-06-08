const { Client,LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const { NlpManager } = require("node-nlp");
const qrcode = require('qrcode-terminal');
const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});
const manager = new NlpManager({
  languages: ["en"],
  nlu: { useNoneFeature: false },
});
const modelData = fs.readFileSync("model.nlp", "utf8");
manager.import(modelData);
client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr,{small:true});
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  const response = await manager.process('en', msg.body);
  // msg.reply(response.answer); // to reply user's message
 client.sendMessage(msg.from,response.answer);
});
client.initialize();
