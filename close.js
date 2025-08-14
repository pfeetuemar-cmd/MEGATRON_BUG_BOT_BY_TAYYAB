const fs = require("fs");
const path = require("path");

// 🧼 Clean number from JID
function getCleanNumber(jid) {
  return jid ? jid.replace(/\D/g, "") : null;
}

// 🔍 Resolve sender number
function resolveSenderNumber(m, conn) {
  let senderJid =
    m.sender ||
    m.key?.participant ||
    m.participant ||
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

module.exports = async function ({ conn, m, isGroup, reply, jid }) {
  try {
    // 🔒 Group-only restriction
    if (!isGroup) return reply("❌ This command only works in *Groups*.");

    // 🔍 Extract sender number
    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Could not detect sender number.");

    // 📂 Load owner from selfmode.json
    const configPath = path.join(__dirname, "media/selfmode.json");
    if (!fs.existsSync(configPath)) {
      return reply("⚠️ *I'm waiting for my owner's `.self` command to activate authority.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(configPath));
    } catch {
      return reply("❌ Error reading selfmode.json. File may be corrupted.");
    }

    const realOwner = jsonData.owner_sender;

    // 🔐 Verify owner
    if (senderNum !== realOwner) {
      return reply(`🚫 *Access Denied!*\n\nOnly the *REAL BOT OWNER* can close the group.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    }

    // 🔐 Lock group (announcement mode)
    await conn.groupSettingUpdate(jid, "announcement");
    return reply("🔐 *Group has been closed!*\nNow only admins can send messages.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");

  } catch (err) {
    console.error("❌ Close Group Error:", err);
    return reply("❌ Something went wrong while closing the group.");
  }
};