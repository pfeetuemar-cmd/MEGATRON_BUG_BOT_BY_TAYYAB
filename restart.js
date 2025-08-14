const fs = require("fs");
const path = require("path");

module.exports = async function ({ conn, m, jid, reply }) {
  try {
    // 📍 Clean number helper
    const getCleanNumber = (jid) => (jid ? jid.replace(/\D/g, "") : null);

    // 📥 Resolve actual sender number
    let senderJid =
      m.key?.participant ||
      m.participant ||
      m.sender ||
      m.key?.remoteJid ||
      (m.key?.fromMe && conn?.user?.id) ||
      m.message?.extendedTextMessage?.contextInfo?.participant;

    const senderNum = getCleanNumber(senderJid);
    if (!senderNum) return reply("❌ Unable to detect sender.");

    // 📂 Load selfmode.json
    const configPath = path.join(__dirname, "media", "selfmode.json");

    if (!fs.existsSync(configPath)) {
      return reply("⚠️ *Bot hasn't been activated yet.* Use `.self` first.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch {
      return reply("❌ Failed to read `selfmode.json`. File may be corrupted.");
    }

    const realOwner = jsonData.owner_sender;

    // 🔐 Check if sender is REAL OWNER
    if (senderNum !== realOwner) {
      return reply("🚫 *ACCESS DENIED!*\n\nOnly *REAL BOT OWNER* can restart the bot.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    }

    // ✅ Restart action
    await reply("♻️ *Restarting MegaTron Bot...*\n\nSee you shortly!\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
    process.exit();

  } catch (err) {
    console.error("❌ Restart Error:", err);
    return reply("❌ Something went wrong while restarting MegaTron.\n\n> 𝐋 𝐔 𝐂 𝐈 𝐅 𝐄 𝐑 ❦ ✓");
  }
};