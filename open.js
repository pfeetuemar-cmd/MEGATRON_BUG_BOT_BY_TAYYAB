const fs = require("fs");
const path = require("path");

module.exports = async function ({ conn, m, reply, isGroup, jid }) {
  if (!isGroup) return reply("❌ *This command is for groups only.*");

  // 📂 Load selfmode.json
  const configPath = path.join(__dirname, "media/selfmode.json");

  if (!fs.existsSync(configPath)) {
    return reply("⚠️ *Bot is inactive.* Please activate using `.self`\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }

  let jsonData;
  try {
    jsonData = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch {
    return reply("❌ *Failed to read selfmode.json. File is corrupted.*");
  }

  const realOwner = jsonData.owner_sender;

  // 🧼 Clean number
  const getCleanNumber = (jid) => (jid ? jid.replace(/\D/g, "") : null);
  const senderJid =
    m.sender ||
    m.key?.participant ||
    m.participant ||
    m.key?.remoteJid ||
    m.message?.extendedTextMessage?.contextInfo?.participant;
  const senderNum = getCleanNumber(senderJid);

  if (senderNum !== realOwner) {
    return reply("🔐 *Only the REAL OWNER can open the group.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }

  // 🔓 Open the group
  await conn.groupSettingUpdate(jid, "not_announcement");
  return reply("✅ *Group has been opened for all members.*\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
};