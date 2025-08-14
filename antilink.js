const fs = require("fs");
const path = require("path");

// 🔢 Clean number from JID
function getCleanNumber(jid) {
  return jid ? jid.replace(/\D/g, "") : null;
}

// 🔍 Identify sender number
function resolveSenderNumber(m, conn) {
  let senderJid =
    m.key?.participant ||
    m.participant ||
    m.message?.extendedTextMessage?.contextInfo?.participant ||
    m.sender ||
    (m.key?.fromMe && conn?.user?.id) ||
    m.key?.remoteJid;

  return getCleanNumber(senderJid);
}

module.exports = async function ({ m, isGroup, reply, args, conn }) {
  try {
    // ✅ Only allow in group chats
    if (!isGroup) {
      return reply("❌ This command is only allowed inside group chats.");
    }

    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Unable to detect sender.");

    // ✅ Load owner from selfmode.json
    const configPath = path.join(__dirname, "media/selfmode.json");
    if (!fs.existsSync(configPath)) {
      return reply("⚠️ Bot is inactive. Ask the owner to activate it using `.self`\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(configPath));
    } catch {
      return reply("❌ `selfmode.json` is corrupted or unreadable.");
    }

    const realOwner = jsonData.owner_sender;

    // ✅ Check admin status
    let isAdmin = false;
    try {
      const groupMetadata = await conn.groupMetadata(m.key.remoteJid);
      const participant = groupMetadata.participants.find(p => p.id === senderNum + "@s.whatsapp.net");
      isAdmin = participant && (participant.admin === "admin" || participant.admin === "superadmin");
    } catch (e) {
      return reply("⚠️ Failed to load group admin list.");
    }

    // ❌ Reject non-admin and non-owner
    if (senderNum !== realOwner && !isAdmin) {
      return reply("😡 You are *not allowed* to use this command!\nOnly *group admins* or *bot owner* can toggle antilink.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // ✅ Validate input
    if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
      return reply("⚠️ Usage:\n*.antilink on* - to enable\n*.antilink off* - to disable");
    }

    // ✅ Save status
    global.antilink = global.antilink || {};
    const chatId = m.key.remoteJid;
    const status = args[0].toLowerCase();
    global.antilink[chatId] = status === "on";

    return reply(`🔗 *Antilink is now ${status.toUpperCase()}* for this group.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);

  } catch (err) {
    console.error("[❌ Error in .antilink]:", err);
    return reply("❌ Unexpected error while toggling antilink.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};