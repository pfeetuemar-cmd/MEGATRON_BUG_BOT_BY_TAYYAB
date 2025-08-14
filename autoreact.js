const fs = require("fs");
const path = require("path");

// 🔢 Clean number
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

module.exports = async function ({ conn, m, jid, sender, reply, args, isGroup }) {
  try {
    // ❌ Block group usage
    if (isGroup) {
      return reply("❌ This command can only be used in *DM/Private Chat*.");
    }

    const senderNum = resolveSenderNumber(m, conn);
    if (!senderNum) return reply("❌ Unable to detect sender ID.");

    // 🔐 Owner check via selfmode.json
    const configPath = path.join(__dirname, "media/selfmode.json");

    if (!fs.existsSync(configPath)) {
      return reply("⚠️ *Bot is inactive.* Ask the owner to activate it using `.self`\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(configPath));
    } catch {
      return reply("❌ `selfmode.json` is missing or corrupted.");
    }

    const realOwner = jsonData.owner_sender;

    // ✅ Check permission
    if (senderNum !== realOwner) {
      return reply(`😤 *Who gave you permission to touch this?*\n\n🔒 *Only my real boss can toggle auto-react.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);
    }

    // ⚠️ Argument validation
    if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
      return reply("❤️ *Usage:* `.autoreact on` or `.autoreact off`");
    }

    // ✅ Toggle AutoReact
    global.autoreact = args[0].toLowerCase() === "on";
    return reply(`❤️ *Auto React is now* ➜ *${args[0].toUpperCase()}*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓`);

  } catch (err) {
    console.error("❌ AutoReact Error:", err.message);
    return reply("❌ Something went wrong while toggling Auto React.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};