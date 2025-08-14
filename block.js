const fs = require("fs");
const path = require("path");

// 🧼 Clean number from JID
function getCleanNumber(jid) {
  return jid ? jid.replace(/\D/g, "") : null;
}

// 🔍 Resolve sender JID
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

module.exports = async function ({ conn, m, args, command, sender, reply, jid }) {
  try {
    const isGroup = jid.endsWith("@g.us");

    // 🔐 Read selfmode.json for owner info
    const configPath = path.join(__dirname, "media", "selfmode.json");
    if (!fs.existsSync(configPath)) {
      return reply("⚠️ *I'm waiting for my owner's `.self` command to activate authority.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(configPath));
    } catch {
      return reply("❌ Error reading `selfmode.json`. File may be corrupted.");
    }

    const savedOwner = data.owner_sender;

    // 🔍 Get sender number
    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Unable to resolve sender.");

    // 🔐 Owner check
    if (senderNum !== savedOwner) {
      return reply(`🚫 *Access Denied!*\n\nOnly *REAL BOT OWNER* can use this block/unblock command.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    }

    // 📵 Must be in DM
    if (isGroup) {
      return reply("❌ *This command only works in DMs.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // 🎯 Target is the person you're chatting with
    const targetJid = m.key.remoteJid;

    const action = command === "block" ? "block" : "unblock";
    await conn.updateBlockStatus(targetJid, action);

    return reply(`✅ *${action === "block" ? "Blocked" : "Unblocked"} user:* ${getCleanNumber(targetJid)}\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
  } catch (err) {
    console.error("❌ Block/Unblock Error:", err);
    return reply("❌ *Something went wrong while trying to update block status.*");
  }
};